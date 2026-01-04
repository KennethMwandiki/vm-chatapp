const GenericRtmpService = {
    /**
     * Handle generic RTMP platforms where user provides URL/Key
     */
    startStream: (platformName, rtmpUrl, streamKey) => {
        if (!streamKey) {
            throw new Error(`Missing Stream Key for ${platformName}`);
        }

        // In a real generic implementation, this would likely:
        // 1. Spin up an FFmpeg process to push to this RTMP URL.
        // 2. Or return the config to the client config to push directly.

        return {
            platform: platformName,
            status: 'configured',
            stream_url: rtmpUrl,
            stream_key: streamKey,
            message: `Ready to push to ${platformName}`
        };
    },

    /**
     * Helper to retrieve configured keys for known platforms
     */
    getConfigFor: (platform) => {
        switch (platform.toLowerCase()) {
            case 'substack':
                return { url: process.env.SUBSTACK_RTMP_URL, key: process.env.SUBSTACK_STREAM_KEY };
            case 'kick':
                return { url: process.env.KICK_RTMP_URL, key: process.env.KICK_STREAM_KEY };
            case 'tiktok':
                return { url: "rtmp://generic.tiktok.com", key: process.env.TIKTOK_STREAM_KEY };
            case 'twitter (x)':
            case 'twitter':
                return { url: "rtmp://generic.twitter.com", key: process.env.TWITTER_STREAM_KEY };
            default:
                return null;
        }
    }
};

module.exports = GenericRtmpService;
