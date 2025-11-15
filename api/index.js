require('dotenv').config();

const express = require("express");
const axios = require("axios");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const { RtcTokenBuilder, RtcRole } = require("agora-token");

// --- Database and Session Setup ---
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas.'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const User = require('./models/User');
const Role = require('./models/Role');

// --- Mongoose Schema and Model for Streams ---
const streamSchema = new mongoose.Schema({
  streamId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true }, // To associate streams with users
  platformsList: [String],
  streamQuality: { type: Number, default: 100 },
  viewerCount: { type: Number, default: 0 },
  durationSec: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

const Stream = mongoose.model('Stream', streamSchema);

// --- Utility function to update stream duration ---
const updateStreamDurations = async () => {
  try {
    await Stream.updateMany({ isActive: true }, { $inc: { durationSec: 5 } });
  } catch (error) {
    console.error('Error updating stream durations:', error);
  }
};
setInterval(updateStreamDurations, 5000); // Update duration every 5 seconds

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoUri,
      ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware: Ensure User is Authenticated
const ensureAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized access!" });
  } else {
    next();
  }
};

// Middleware to check for specific roles
const hasRole = (roleName) => (req, res, next) => {
  if (req.isAuthenticated() && req.user.role && req.user.role.name === roleName) {
    return next();
  }
  res.status(403).json({ error: "Forbidden: Insufficient privileges." });
};

const hasAdminRoles = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role && ['Admin', 'Super Admin'].includes(req.user.role.name)) {
        return next();
    }
    res.status(403).json({ error: "Forbidden: Administrator access required." });
};

const isSuperAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role && req.user.role.name === 'Super Admin') {
        return next();
    }
    res.status(403).json({ error: "Forbidden: Super Admin access required." });
};
// --- Passport (Google OAuth) Setup ---
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).populate('role');
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// --- Passport (Local Strategy) Setup ---
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isValid = await user.isValidPassword(password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Setting up Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        const userCount = await User.countDocuments();
        let roleName = 'User';
        if (userCount === 0) {
          roleName = 'Super Admin';
        }

        let role = await Role.findOne({ name: roleName });
        if (!role) {
          // If roles don't exist, create them
          await Role.insertMany([{ name: 'User' }, { name: 'Admin' }, { name: 'Super Admin' }]);
          role = await Role.findOne({ name: roleName });
        }

        const newUser = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          role: role._id
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);

// --- Routes ---

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

app.get('/auth/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}
);

app.post('/auth/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    let userRole = await Role.findOne({ name: 'User' });
    if (!userRole) {
        // Seed roles if they don't exist
        await Role.insertMany([{ name: 'User' }, { name: 'Admin' }, { name: 'Super Admin' }]);
        userRole = await Role.findOne({ name: 'User' });
    }
    const user = new User({ username, email, role: userRole._id });
    await user.setPassword(password);
    await user.save();
    req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ message: "User registered and logged in.", user: { id: user.id, username: user.username } });
    });
  } catch (error) {
    next(error);
  }
});

app.post('/auth/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: "Logged in successfully.", user: { id: req.user.id, username: req.user.username } });
);

// Health Check Endpoint for Deployment Readiness
app.get("/healthz", async (req, res) => {
  // Check Agora and Chat API keys/configs
  let agoraStatus = "ok";
  let chatStatus = "ok";
  try {
    // This check is simplified as some keys are now in env vars
    if (!process.env.AGORA_APP_ID || !process.env.AGORA_CUSTOMER_SECRET) {
      throw new Error('Agora credentials not configured');
    }
    // Try a simple Agora API call (e.g., get app info)
    // A more specific health check could be added here if needed.
  } catch (e) {
    agoraStatus = "fail";
  }
  // Optionally, check chat service status here if API available
  res.json({
    status: "ok",
    agora: agoraStatus,
    chat: chatStatus,
    appId: process.env.AGORA_APP_ID,
  });
});

// API: Generate Token for Agora Session
app.get("/generate-token/:channelName", ensureAuthenticated, async (req, res) => {
  const { channelName } = req.params;
  const uid = 0; // Or a user-specific ID
  const role = RtcRole.PUBLISHER;
  const privilegeExpires = Math.floor(Date.now() / 1000) + 3600; // 1-hour token validity

  try {
    if (!process.env.AGORA_APP_ID || !process.env.AGORA_CUSTOMER_SECRET) {
        return res.status(500).json({ error: "Agora App ID or App Certificate is not configured." });
    }
    const token = RtcTokenBuilder.buildTokenWithUid(process.env.AGORA_APP_ID, process.env.AGORA_CUSTOMER_SECRET, channelName, uid, role, privilegeExpires);
    res.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token", details: error.message });
  }
});

app.get("/stream-metrics", ensureAuthenticated, async (req, res) => {
  try {
    // Fetch active streams for the logged-in user from MongoDB
    const streams = await Stream.find({ userId: req.user.id, isActive: true });
    res.json({
      success: true,
      metrics: streams.map((stream) => ({
        streamId: stream.streamId,
        platforms: stream.platformsList || [],
        quality: `${stream.streamQuality.toFixed(2)}%`,
        viewers: stream.viewerCount,
        duration: stream.durationSec,
      })),
    });
  } catch (error) {
    console.error("Error fetching stream metrics:", error);
    res.status(500).json({ error: "Failed to fetch stream metrics" });
  }
});

// API: Start Streaming to Multiple Platforms
app.post("/api/stream/start", express.json(), ensureAuthenticated, async (req, res) => {
  const { platform, channel, token } = req.body;

  try {
    // Create or update a stream record in MongoDB
    await Stream.findOneAndUpdate(
      { streamId: channel, userId: req.user.id },
      { 
        $addToSet: { platformsList: platform }, // Add platform if not already present
        isActive: true 
      },
      { upsert: true, new: true } // Create if it doesn't exist
    );

    // Example: Add integration logic for each platform
    if (platform === "YouTube") {
      // Call YouTube Live API or RTMP endpoint
      // await axios.post('https://youtube.googleapis.com/youtube/v3/liveBroadcasts', ...)
    } else if (platform === "Facebook") {
      // Call Facebook Live API or RTMP endpoint
    } else if (platform === "Twitch") {
      // Call Twitch API or RTMP endpoint
    } else if (platform === "Instagram") {
      // Instagram Live integration (usually via RTMP)
    } else if (platform === "LinkedIn") {
      // LinkedIn Live API
    } else if (platform === "Twitter (X)") {
      // X (Twitter) Live API or RTMP endpoint
    } else if (platform === "WeChat") {
      // WeChat streaming integration (custom or via RTMP)
    } else if (platform === "Kick") {
      // Kick streaming integration
    } else if (platform === "Trovo") {
      // Trovo streaming integration
    } else if (platform === "DLive") {
      // DLive streaming integration
    } else if (platform === "Vimeo") {
      // Vimeo Live API
    } else if (platform === "TikTok") {
      // TikTok Live integration
    } else if (platform === "Custom RTMP") {
      // Use RTMP URL provided by user
    }

    // For demo, just return success
    res.json({ success: true, started: true, platform });
  } catch (error) {
    console.error(`Error starting stream on ${platform}:`, error);
    res.status(500).json({ error: `Failed to start stream on ${platform}` });
  }
});

// API: Webhook for real-time metrics from providers
app.post("/api/webhooks/agora", express.json({ type: '*/*' }), async (req, res) => {
  const events = req.body.events || [req.body]; // Support single or batched events

  console.log("Received webhook events:", JSON.stringify(events, null, 2));

  for (const event of events) {
      const { streamId, eventType, payload, userId } = event; // Assuming userId might come in webhook
      if (!streamId || !eventType) {
        continue; // Ignore invalid events
      }

      try {
        const update = {};
        if (eventType === 'viewer_join' || eventType === 'viewer_leave') {
          update.viewerCount = payload.count;
        } else if (eventType === 'stream_quality_update') {
          update.streamQuality = payload.quality;
        } else if (eventType === 'stream_ended') {
          update.isActive = false;
        }

        if (Object.keys(update).length > 0) {
          // Find and update the stream in the database
          // It's important to use userId here if the webhook provides it,
          // to ensure the correct user's stream is updated.
          // Using upsert can create a stream record if it starts from a webhook.
          await Stream.findOneAndUpdate(
            { streamId, userId },
            update,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      } catch (error) {
        console.error(`Error processing webhook for stream ${streamId}:`, error);
      }
  }

  res.status(200).send("OK");
});

app.post("/api/subscribe", express.json(), async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const Email = require('./models/Email');
    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(201).json({ success: true, message: "Thank you for subscribing!" });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(409).json({ error: "This email is already subscribed." });
    }
    console.error("Subscription error:", error);
    res.status(500).json({ error: "An error occurred during subscription." });
  }
});

// --- Admin Routes ---
app.get('/api/admin/users', ensureAuthenticated, hasAdminRoles, async (req, res) => {
    try {
        const users = await User.find({}, '-password').populate('role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

app.put('/api/admin/users/:userId/role', ensureAuthenticated, isSuperAdmin, async (req, res) => {
    try {
        const { roleName } = req.body;
        const role = await Role.findOne({ name: roleName });
        if (!role) return res.status(400).json({ error: 'Invalid role.' });

        const user = await User.findByIdAndUpdate(req.params.userId, { role: role._id }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ message: `User ${user.username}'s role updated to ${role.name}.`});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user role.' });
    }
});

// --- Start the Server ---
// Vercel will handle the listening part, so we just export the app
module.exports = app;
