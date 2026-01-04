const facebook = require('facebook-nodejs-business-sdk');

const FacebookService = {
    /**
     * Create a Live Video object on a Facebook Page.
     * Requires: FACEBOOK_PAGE_ACCESS_TOKEN
     */
    startPageStream: async (title, description) => {
        const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
        if (!accessToken) throw new Error("Missing FACEBOOK_PAGE_ACCESS_TOKEN");

        const api = facebook.FacebookAdsApi.init(accessToken);
        const LiveVideo = facebook.LiveVideo;

        try {
            // Create a live video object
            // Note: In real usage, you'd target a specific Page ID. 
            // 'me' refers to the entity owning the token (User or Page).
            const liveVideo = await (new LiveVideo('me')).create({
                title: title || 'Live Stream',
                description: description || 'Broadcast via VM Chat Control Center',
                status: 'LIVE_NOW', // Or 'SCHEDULED_UNPUBLISHED'
                secure_stream_url: true
            });

            return {
                id: liveVideo.id,
                stream_url: liveVideo.secure_stream_url, // RTMP URL to push to
                dashboard_url: `https://facebook.com/${liveVideo.id}`
            };
        } catch (error) {
            console.error("Facebook API Error:", error);
            throw new Error("Failed to start Facebook stream: " + error.message);
        }
    },

    /**
     * Instagram Live (Business) via Graph API
     */
    startInstagramStream: async (title) => {
        const accessToken = process.env.INSTAGRAM_USER_ACCESS_TOKEN;
        if (!accessToken) throw new Error("Missing INSTAGRAM_USER_ACCESS_TOKEN");

        // Note: IG Live requires specific Business Account setup.
        // This is a simplified implementation wrapping the creation call.
        // Real impl requires:
        // 1. Get IG User ID
        // 2. POST /{ig-user-id}/live_broadcasts

        // Placeholder for actual SDK call as IG publishing often requires direct HTTP calls 
        // outside the standard Business SDK wrapper for simple posts.
        // For now, consistent simulation check:
        return {
            id: "ig_live_" + Date.now(),
            stream_url: "rtmps://live-upload.instagram.com:443/rtmp/",
            stream_key: process.env.INSTAGRAM_STREAM_KEY || "simulated_ig_key"
        };
    }
};

module.exports = FacebookService;
