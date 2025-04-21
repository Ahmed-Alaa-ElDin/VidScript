import EventManager from "./EventManager.js";
import NotificationManager from "./NotificationManager.js";
import ConfigManager from "./ConfigManager.js";

const VideoManager = (() => {
    // Get YouTube video ID
    const getVideoId = () => {
        // Try multiple methods to get video ID

        // Method 1: URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get("v");
        if (videoId) return videoId;

        // Method 2: URL path (for shortened URLs)
        const pathname = window.location.pathname;
        if (pathname.startsWith("/shorts/")) {
            return pathname.substring(8);
        }

        // Method 3: Meta tags
        const ogUrlMeta = document.querySelector('meta[property="og:url"]');
        if (ogUrlMeta) {
            try {
                const url = new URL(ogUrlMeta.content);
                const urlId = new URLSearchParams(url.search).get("v");
                if (urlId) return urlId;
            } catch (e) {
                console.error("Error parsing og:url:", e);
            }
        }

        // Method 4: Video element data
        const videoElement = document.querySelector("video");
        if (videoElement && videoElement.src) {
            const matches = videoElement.src.match(/\/([a-zA-Z0-9_-]{11})\//);
            if (matches && matches[1]) return matches[1];
        }

        return null;
    };

    // Get YouTube video title
    const getVideoTitle = () => {
        // Try multiple methods to get video title

        // Method 1: Title element in DOM
        const titleElement =
            document.querySelector("h1.ytd-watch-metadata yt-formatted-string") ||
            document.querySelector("h1 .ytd-watch-metadata");
        if (titleElement && titleElement.textContent) {
            return titleElement.textContent.trim();
        }

        // Method 2: Meta tags
        const ogTitleMeta = document.querySelector('meta[property="og:title"]');
        if (ogTitleMeta && ogTitleMeta.content) {
            return ogTitleMeta.content.trim();
        }

        // Method 3: Document title (fallback)
        if (document.title && document.title !== "YouTube") {
            // Remove " - YouTube" suffix if present
            return document.title.replace(/ - YouTube$/, "").trim();
        }

        return "Untitled Video";
    };

    // Get current video time
    const getCurrentTime = () => {
        const video = document.querySelector("video");
        return video ? video.currentTime : 0;
    };

    // Format seconds to time string (HH:MM:SS)
    const formatTime = (seconds) => {
        const date = new Date(0);
        date.setSeconds(seconds);
        return date.toISOString().substring(11, 19);
    };

    // Capture current frame from video
    const captureCurrentFrame = () => {
        return new Promise((resolve, reject) => {
            try {
                const video = document.querySelector("video");
                if (!video || video.readyState < 2) {
                    return reject(new Error("Video element not ready"));
                }

                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Return both canvas and dataURL
                resolve({
                    canvas,
                    dataUrl: canvas.toDataURL("image/png"),
                    width: canvas.width,
                    height: canvas.height,
                    timestamp: getCurrentTime(),
                });
            } catch (error) {
                reject(error);
            }
        });
    };

    // Pause the video
    const pauseVideo = () => {
        const video = document.querySelector("video");
        if (video && !video.paused) {
            video.pause();
            return true;
        }
        return false;
    };

    // Resume the video
    const playVideo = () => {
        const video = document.querySelector("video");
        if (video && video.paused) {
            video.play();
            return true;
        }
        return false;
    };

    // Check if video is currently playing
    const isVideoPlaying = () => {
        const video = document.querySelector("video");
        return video && !video.paused && !video.ended && video.currentTime > 0;
    };

    // Set up video event listeners
    const setupVideoEvents = () => {
        const video = document.querySelector("video");
        if (!video) return false;

        // Handle pause event
        video.addEventListener("pause", () => {
            if (ConfigManager.get("settings.extractOnPause")) {
                EventManager.emit("video-paused");
            }
        });

        // Handle seeking event
        video.addEventListener("seeked", () => {
            EventManager.emit("video-seeked");
        });

        return true;
    };

    return {
        getVideoId,
        getVideoTitle,
        getCurrentTime,
        formatTime,
        captureCurrentFrame,
        pauseVideo,
        playVideo,
        isVideoPlaying,
        setupVideoEvents,
    };
})();

export default VideoManager;
