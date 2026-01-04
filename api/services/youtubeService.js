const { google } = require('googleapis');

const YouTubeService = {
    /**
     * Start a YouTube Broadcast using Data API v3
     * Requires: YOUTUBE_CLIENT_ID, SECRET, REFRESH_TOKEN
     */
    startStream: async (title, description) => {
        if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_REFRESH_TOKEN) {
            // Fallback to RTMP config if OAUTH is missing
            if (process.env.YOUTUBE_STREAM_KEY) {
                return {
                    mode: 'rtmp_fallback',
                    stream_url: process.env.YOUTUBE_RTMP_URL || "rtmp://a.rtmp.youtube.com/live2",
                    stream_key: process.env.YOUTUBE_STREAM_KEY
                };
            }
            throw new Error("Missing YouTube Config (OAuth or Stream Key)");
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            `${process.env.BASE_URL}/auth/google/callback`
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
        });

        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

        try {
            // 1. Insert Broadcast
            const broadcastRes = await youtube.liveBroadcasts.insert({
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title: title || 'Live Stream',
                        scheduledStartTime: new Date().toISOString()
                    },
                    status: {
                        privacyStatus: 'public' // or private/unlisted
                    }
                }
            });

            // 2. Insert Stream
            const streamRes = await youtube.liveStreams.insert({
                part: 'snippet,cdn',
                requestBody: {
                    snippet: { title: 'VM Chat Stream' },
                    cdn: {
                        format: '1080p',
                        ingestionType: 'rtmp'
                    }
                }
            });

            // 3. Bind Broadcast to Stream
            await youtube.liveBroadcasts.bind({
                id: broadcastRes.data.id,
                part: 'id,contentDetails',
                streamId: streamRes.data.id
            });

            return {
                id: broadcastRes.data.id,
                stream_url: streamRes.data.cdn.ingestionInfo.ingestionAddress,
                stream_key: streamRes.data.cdn.ingestionInfo.streamName
            };

        } catch (error) {
            console.error("YouTube API Error:", error);
            throw new Error("Failed to start YouTube stream: " + error.message);
        }
    }
};

module.exports = YouTubeService;
