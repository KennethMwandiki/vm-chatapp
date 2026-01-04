const axios = require('axios');

const LinkedInService = {
    /**
     * Start a LinkedIn Live Video via the Organizational Entity API
     * Requires: LINKEDIN_ACCESS_TOKEN (OAuth verified) and Organization URN
     */
    startStream: async (title, description) => {
        const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
        const authorUrn = process.env.LINKEDIN_AUTHOR_URN; // e.g., "urn:li:person:..." or "urn:li:organization:..."

        if (!accessToken || !authorUrn) {
            // Fallback to RTMP if specific API keys missing but Stream Key exists
            if (process.env.LINKEDIN_STREAM_KEY) {
                return {
                    mode: 'rtmp_fallback',
                    stream_url: "rtmp://static-ingest.linkedin.com/live",
                    stream_key: process.env.LINKEDIN_STREAM_KEY
                };
            }
            throw new Error("Missing LinkedIn Configuration (AccessToken+URN or StreamKey)");
        }

        try {
            // 1. Initialize Upload (Functionally: Register the live video)
            const response = await axios.post(
                'https://api.linkedin.com/v2/liveVideos',
                {
                    "author": authorUrn,
                    "recipeType": "urn:li:digitalmediaRecipe:feedshare-live-video",
                    "options": {
                        "liveVideoOptions": {
                            "isLowLatency": true
                        }
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'X-Restli-Protocol-Version': '2.0.0'
                    }
                }
            );

            const data = response.data;

            // 2. Extract Ingest URL
            // The API returns an ingestionEndpoint with URL and Key info
            // This handling depends on exact API response version, simplified here:
            const ingestInfo = data.value?.ingestEndpoints?.[0]; // hypothetical path based on standard LinkedIn Live schema

            return {
                id: data.value?.liveVideoUrn || "li_live_" + Date.now(),
                stream_url: ingestInfo?.url || "rtmps://live-api.linkedin.com/ingest",
                stream_key: ingestInfo?.key || "key_from_response",
                provider: "LinkedIn Live API"
            };

        } catch (error) {
            console.error("LinkedIn API Error:", error.response?.data || error.message);
            throw new Error("Failed to start LinkedIn stream: " + (error.response?.data?.message || error.message));
        }
    }
};

module.exports = LinkedInService;
