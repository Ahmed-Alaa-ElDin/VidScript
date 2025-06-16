import EventManager from "./EventManager.js";
import ConfigManager from "./ConfigManager.js";
import ChatService from "./ChatService.js";

const VideoManager = (() => {
    // Get YouTube video ID
    const getVideoId = () => {
        // Method 1: URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get("v");
        if (videoId) return videoId;

        // Method 2: URL path (for shortened URLs)
        const pathname = window.location.pathname;
        if (pathname.startsWith("/shorts/")) {
            return pathname.substring(8);
        }

        return null;
    };

    // Get YouTube video title
    const getVideoInfo = () => {
        const videoId = getVideoId();

        if (!videoId) return null;

        return new Promise((resolve, reject) => {
            // Send the message to the background script
            chrome.runtime.sendMessage({ type: "get-video-context", videoId }, (response) => {
                if (response && response.success) {
                    if (response.result.items.length === 0) {
                        reject("Video not found");
                    }
                    resolve({
                        videoId: videoId,
                        videoTitle: response.result.items[0].snippet.title,
                        videoDescription: response.result.items[0].snippet.description,
                    });
                } else {
                    reject(response.error);
                }
            });
        });
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
    const captureCurrentFrame = async () => {
        return new Promise((resolve, reject) => {
            try {
                const video = document.querySelector("video");
                if (!video || video.readyState < 2) {
                    return reject(new Error("Video element not ready"));
                }

                const canvas = document.createElement("canvas");
                canvas.style.position = "absolute";

                // Set canvas dimensions to match video
                canvas.width = parseInt(video.style.width) || video.videoWidth;
                canvas.height = parseInt(video.style.height) || video.videoHeight;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                ConfigManager.updateFrameData({
                    mode: "image",
                    canvas,
                    dataUrl: canvas.toDataURL("image/png"),
                    width: parseInt(video.style.width) || video.videoWidth,
                    height: parseInt(video.style.height) || video.videoHeight,
                    top: parseInt(video.style.top) || video.offsetTop,
                    left: parseInt(video.style.left) || video.offsetLeft,
                    currentTime: getCurrentTime(),
                    timestamp: Date.now(),
                    text: null,
                    textOverlay: null,
                });

                // Return both canvas and dataURL
                resolve(ConfigManager.getFrameData());
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

        // Handle play event
        video.addEventListener("play", () => {
            EventManager.emit("video-played");
        });

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

    const getVideoContext = async () => {
        const videoInfo = await getVideoInfo();
        
        if (!videoInfo) return null;
        
        const videoId = videoInfo.videoId;
        const videoTitle = videoInfo.videoTitle;
        const videoDescription = videoInfo.videoDescription;

        ConfigManager.update("context.videoId", videoId);
        ConfigManager.update("context.videoTitle", videoTitle);
        ConfigManager.update("context.videoDescription", videoDescription);

        const response = await ChatService.generateVideoContext(
            videoTitle,
            videoDescription,
        );

        if (response.success) {
            ConfigManager.update("context.videoContext", response.result);
        }

        return response;
    };

    return {
        getVideoId,
        getVideoInfo,
        getCurrentTime,
        formatTime,
        captureCurrentFrame,
        pauseVideo,
        playVideo,
        isVideoPlaying,
        setupVideoEvents,
        getVideoContext,
    };
})();

export default VideoManager;
