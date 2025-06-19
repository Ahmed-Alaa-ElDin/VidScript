import EventManager from "./EventManager.js";
import TextExtractor from "./TextExtractor.js";
import NotificationManager from "./NotificationManager.js";

// Module for configuration settings
const ConfigManager = (() => {
    const states = ["OFF", "READY", "EXTRACTING", "DONE"];
    const selectorStates = ["rectangle", "freehand"];
    const extractionModes = ["image", "text"];
    const languages = [
        { code: "ar", name: "Arabic" },
        { code: "en", name: "English" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "es", name: "Spanish" },
        { code: "it", name: "Italian" },
        { code: "ja", name: "Japanese" },
        { code: "ko", name: "Korean" },
        { code: "pt", name: "Portuguese" },
        { code: "ru", name: "Russian" },
        { code: "zh", name: "Chinese" },
    ];

    const platforms = [
        {
            code: "copy",
            name: "Copy",
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 448 512'><path fill='currentColor' d='m433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941M266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6m128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6m6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243z'/></svg>",
            color: "#ff2f2f",
            textColor: "#fff",
            colorHover: "#ff4f4f",
            clickFunction: TextExtractor.copySharingText,
        },
        {
            code: "facebook",
            name: "Copy & Open Facebook",
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='currentColor' d='M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z'/></svg>",
            color: "#1877f2",
            textColor: "#fff",
            colorHover: "#135fc2",
            clickFunction: TextExtractor.shareToFacebook,
        },
        {
            code: "linkedin",
            name: "Copy & Open LinkedIn",
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='currentColor' d='M4.75 1.875a2.125 2.125 0 1 0 0 4.25a2.125 2.125 0 0 0 0-4.25m-2 6A.125.125 0 0 0 2.625 8v13c0 .069.056.125.125.125h4A.125.125 0 0 0 6.875 21V8a.125.125 0 0 0-.125-.125zm6.5 0A.125.125 0 0 0 9.125 8v13c0 .069.056.125.125.125h4a.125.125 0 0 0 .125-.125v-7a1.875 1.875 0 1 1 3.75 0v7c0 .069.056.125.125.125h4a.125.125 0 0 0 .125-.125v-8.62c0-2.427-2.11-4.325-4.525-4.106a7.2 7.2 0 0 0-2.169.548l-1.306.56V8a.125.125 0 0 0-.125-.125z'/></svg>",
            color: "#0a66c2",
            textColor: "#fff",
            colorHover: "#08529b",
            clickFunction: TextExtractor.shareToLinkedIn,
        },
        {
            code: "whatsapp",
            name: "WhatsApp",
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='currentColor' d='M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28'/></svg>",
            color: "#25d366",
            textColor: "#fff",
            colorHover: "#1ea952",
            clickFunction: TextExtractor.shareToWhatsApp,
        },
        {
            code: "telegram",
            name: "Telegram",
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><g fill='none' fill-rule='evenodd'><path d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/><path fill='currentColor' d='M19.777 4.43a1.5 1.5 0 0 1 2.062 1.626l-2.268 13.757c-.22 1.327-1.676 2.088-2.893 1.427c-1.018-.553-2.53-1.405-3.89-2.294c-.68-.445-2.763-1.87-2.507-2.884c.22-.867 3.72-4.125 5.72-6.062c.785-.761.427-1.2-.5-.5c-2.302 1.738-5.998 4.381-7.22 5.125c-1.078.656-1.64.768-2.312.656c-1.226-.204-2.363-.52-3.291-.905c-1.254-.52-1.193-2.244-.001-2.746z'/></g></svg>",
            color: "#0088cc",
            textColor: "#fff",
            colorHover: "#006da3",
            clickFunction: TextExtractor.shareToTelegram,
        },
        {
            code: "x",
            name: "X",
            icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='currentColor' d='m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z'/></svg>",
            color: "#14171a",
            textColor: "#fff",
            colorHover: "#434548",
            clickFunction: TextExtractor.shareToX,
        },
    ];

    // Core configuration with defaults
    const config = {
        context: {
            videoId: null,
            videoTitle: null,
            videoDescription: null,
            videoContext: null,
        },

        // Default settings that can be overridden by user
        settings: {
            showBoundingBoxes: false,
            language: "auto",
            fontFamily: "Arial",
            fontSize: 20,
            boxColor: "rgba(255, 0, 0, 0.5)",
            textColor: "rgba(255, 255, 255, 0.9)",
            overlayBackground: "rgba(0, 0, 0, 0.6)",
        },

        // Current state of the application
        state: "OFF",

        // Current frame data
        frameData: {
            canvas: null,
            dataUrl: null,
            width: null,
            height: null,
            top: null,
            left: null,
            currentTime: null,
            timestamp: null,
        },

        // Extracted image data
        extractedImageData: {
            mode: "image",
            dataUrl: null,
            width: null,
            height: null,
            top: null,
            left: null,
            currentTime: null,
            timestamp: null,
            text: null,
            textOverlay: null,
            chat: [],
            chatContext: null,
        },

        // Current selector settings
        selectorSettings: {
            mode: "rectangle",
            strokeStyle: "#ff6666",
            lineWidth: 2,
            isActive: false,
            startX: 0,
            startY: 0,
            path: [],
        },
    };

    return {
        get: (path) => {
            // Parse dot notation path to get nested config values
            return path.split(".").reduce((obj, key) => obj && obj[key], config);
        },

        getAll: () => config,

        getLanguages: () => languages,

        getPlatforms: () => platforms,

        update: (path, value) => {
            const keys = path.split(".");
            const lastKey = keys.pop();
            const target = keys.reduce((obj, key) => obj[key], config);
            target[lastKey] = value;

            // Save to localStorage when updating settings
            if (path.startsWith("settings.")) {
                localStorage.setItem("vidscript_settings", JSON.stringify(config.settings));
            }
            return value;
        },

        updateFrameData: (frameData) => {
            config.frameData = { ...config.frameData, ...frameData };
        },

        getFrameData: () => {
            return config.frameData;
        },

        updateExtractedImageData: (imageData) => {
            // Validate mode
            if (imageData.mode && !extractionModes.includes(imageData.mode)) {
                console.error(`Invalid mode: ${imageData.mode}`);
                return;
            }

            config.extractedImageData = { ...config.extractedImageData, ...imageData };
        },

        getExtractedImageData: () => {
            return config.extractedImageData;
        },

        resetExtractedImageData: () => {
            config.extractedImageData = {
                mode: "image",
                dataUrl: null,
                width: null,
                height: null,
                top: null,
                left: null,
                currentTime: null,
                timestamp: null,
                text: null,
                textOverlay: null,
                chat: [],
                chatContext: null,
            };
        },

        loadSavedSettings: () => {
            try {
                const savedSettings = localStorage.getItem("vidscript_settings");
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings);
                    config.settings = { ...config.settings, ...parsed };
                }
            } catch (e) {
                console.error("Error loading saved settings:", e);
            }
        },

        updateState: (newState) => {
            // Validate the new state is valid
            if (!states.includes(newState)) {
                console.error(`Invalid state: ${newState}`);
                return false;
            }

            config.state = newState;

            // Emit state change event
            if (typeof EventManager !== "undefined") {
                switch (newState) {
                    case "OFF":
                        EventManager.emit("remove-overlay");
                        EventManager.emit("toggle-vidscript", false);
                        ConfigManager.resetSettings();
                        break;
                    case "READY":
                        EventManager.emit("get-video-context");
                        EventManager.emit("add-overlay");
                        EventManager.emit("toggle-vidscript", true);
                        EventManager.emit("hide-results");
                        break;
                    case "EXTRACTING":
                        EventManager.emit("update-results");
                        EventManager.emit("extract-text");
                        break;
                    case "DONE":
                        EventManager.emit("show-results");
                        break;
                }
            }

            return true;
        },

        getCurrentState: () => {
            return config.state;
        },

        getCurrentSelectorMode: () => {
            return config.selectorSettings.mode;
        },

        updateSelectorSettings: (key = null, value) => {
            switch (key) {
                case "mode":
                    if (!selectorStates.includes(value)) {
                        console.error(`Invalid selector setting: ${value}`);
                        return false;
                    }
                    config.selectorSettings.mode = value;
                    break;
                case "isActive":
                    config.selectorSettings.isActive = value;
                    break;
                case "startX":
                    config.selectorSettings.startX = value;
                    break;
                case "startY":
                    config.selectorSettings.startY = value;
                    break;
                case "path":
                    config.selectorSettings.path = value;
                    break;
                case "strokeStyle":
                    config.selectorSettings.strokeStyle = value;
                    break;
                case "lineWidth":
                    config.selectorSettings.lineWidth = value;
                    break;
                case null:
                    config.selectorSettings = value;
                    break;
                default:
                    config.selectorSettings[key] = value;
                    break;
            }

            // Emit selector setting change event
            if (typeof EventManager !== "undefined") {
                EventManager.emit("update-selector-settings", config.selectorSettings);
            }

            return true;
        },

        getCurrentSelectorSettings: (key = null) => {
            if (key) {
                return config.selectorSettings[key];
            }

            return config.selectorSettings;
        },

        addCurrentResultsToLocalStore: async () => {
            const { context, extractedImageData } = config;

            if (!extractedImageData.text && !extractedImageData.chat.length) {
                NotificationManager.show("No text data found in extractedImageData", "error");
                return;
            }

            const { videoId, videoTitle, videoDescription, videoContext } = context;
            const { currentTime, timestamp } = extractedImageData;

            if (!videoId || !currentTime) {
                NotificationManager.show("Missing required videoId or timestamp", "error");
                return;
            }

            try {
                // Get existing results from localStorage
                const savedResults = await ConfigManager.getSavedResults();

                // Initialize video entry if it doesn't exist
                if (!savedResults[videoId]) {
                    savedResults[videoId] = {
                        videoTitle,
                        videoDescription,
                        videoContext,
                        results: {},
                    };
                }

                // Find existing result by timestamp or create new one
                savedResults[videoId].results[currentTime] = extractedImageData;

                // Save updated results to localStorage
                chrome.storage.local.set({ "vidscript_results": savedResults });

                NotificationManager.show("Results saved successfully", "success");
            } catch (error) {
                console.error("Error adding results to local storage:", error);
                NotificationManager.show("Error adding results to local storage", "error");
            }
        },

        // Helper function to get saved results
        getSavedResults: async () => {
            try {
                const saved = await chrome.storage.local.get("vidscript_results");
                return saved.vidscript_results ?? {};
            } catch (error) {
                console.error("Error parsing saved results:", error);
                return {};
            }
        },

        resetContext: () => {
            config.context = {
                videoId: null,
                videoTitle: null,
                videoDescription: null,
                videoContext: null,
            };
        },

        resetSettings: () => {
            config.settings = {
                showBoundingBoxes: false,
                language: "auto",
                fontFamily: "Arial",
                fontSize: 20,
                boxColor: "rgba(255, 0, 0, 0.5)",
                textColor: "rgba(255, 255, 255, 0.9)",
                overlayBackground: "rgba(0, 0, 0, 0.6)",
            };

            config.frameData = {
                canvas: null,
                dataUrl: null,
                width: null,
                height: null,
                top: null,
                left: null,
                currentTime: null,
                timestamp: null,
            };

            config.extractedImageData = {
                mode: "image",
                dataUrl: null,
                width: null,
                height: null,
                top: null,
                left: null,
                currentTime: null,
                timestamp: null,
                text: null,
                textOverlay: null,
                chat: [],
                chatContext: null,
            };

            config.selectorSettings = {
                mode: "rectangle",
                strokeStyle: "#ff6666",
                lineWidth: 2,
                isActive: false,
                startX: 0,
                startY: 0,
                path: [],
            };
        },
    };
})();

export default ConfigManager;
