require('dotenv').config();

const DB_PATH = "/tmp/sessions.db"; // Use /tmp for Vercel's writable filesystem.

const express = require("express");
const axios = require("axios");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const sqlite3 = require("sqlite3").verbose();
const { RtcTokenBuilder, RtcRole } = require("agora-token");

// --- Database and Session Setup ---
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    // Basic migration: create sessions table if it doesn't exist
    db.run(
      "CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, sess TEXT NOT NULL, expire INTEGER NOT NULL)",
      (err) => {
        if (err) console.error("Error creating sessions table", err);
      }
    );
  }
});

const app = express();

app.use(
  session({
    store: new SQLiteStore({ db: "sessions.db", dir: "/tmp" }), // Point to the temp directory
    secret: process.env.SESSION_SECRET || 'a-default-secret-key',
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

// --- Passport (Google OAuth) Setup ---
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Setting up Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
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

// API: Fetch Stream Metrics
const streamMetricsProducer = {
    streams: [],
    init() {
        // Initial streams can be empty, populated by webhooks
    },
    createStream(id) {
        return {
            streamId: id,
            platformsList: [],
            streamQuality: 100,
            viewerCount: 0,
            durationSec: 0,
        };
    },
    updateMetrics() {
        this.streams.forEach(stream => {
            stream.viewerCount += Math.floor(Math.random() * 20) - 10; // Fluctuate viewers
            if (stream.viewerCount < 0) stream.viewerCount = 0;
            stream.durationSec += 5;
            stream.streamQuality = 95 + Math.random() * 5; // Fluctuate quality
        });
    }
    // updateMetrics can be called from a webhook handler now
};
streamMetricsProducer.init();

app.get("/stream-metrics", ensureAuthenticated, async (req, res) => {
  try {
    // Using the in-memory producer for more realistic data
    const streams = streamMetricsProducer.streams;
    res.json({
      success: true,
      metrics: streams.map((stream) => ({
        streamId: stream.streamId,
        platforms: stream.platformsList,
        quality: `${stream.streamQuality.toFixed(2)}%`,
        viewers: stream.viewerCount,
        duration: stream.durationSec,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stream metrics" });
  }
});

// API: Start Streaming to Multiple Platforms
app.post("/api/stream/start", express.json(), ensureAuthenticated, async (req, res) => {
  const { platform, channel, token } = req.body;

  try {
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
    res.status(500).json({ error: `Failed to start stream on ${platform}` });
  }
});

// API: Webhook for real-time metrics from providers
app.post("/api/webhooks/agora", express.json({ type: '*/*' }), (req, res) => {
  const events = req.body.events || [req.body]; // Support single or batched events

  console.log("Received webhook events:", JSON.stringify(events, null, 2));

  events.forEach(event => {
    const { streamId, eventType, payload } = event;
    if (!streamId || !eventType) {
      return; // Ignore invalid events
    }

    let stream = streamMetricsProducer.streams.find(s => s.streamId === streamId);
    if (!stream) {
      stream = streamMetricsProducer.createStream(streamId);
      streamMetricsProducer.streams.push(stream);
    }

    // Example event processing
    if (eventType === 'viewer_join') {
      stream.viewerCount = payload.count;
    } else if (eventType === 'stream_quality_update') {
      stream.streamQuality = payload.quality;
    }
  });

  res.status(200).send("OK");
});

// --- Start the Server ---
// Vercel will handle the listening part, so we just export the app
module.exports = app;
