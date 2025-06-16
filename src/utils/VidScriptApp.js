import ConfigManager from "./ConfigManager.js";
import DOMManager from "./DOMManager.js";
import EventManager from "./EventManager.js";
import NotificationManager from "./NotificationManager.js";
import StyleManager from "./StyleManager.js";
import VideoManager from "./VideoManager.js";
import TextExtractor from "./TextExtractor.js";
import UIFactory from "./UIFactory.js";

// Module for main application logic
const VidScriptApp = (() => {
    // Initialize the app
    const init = () => {
        console.log("🚀 VidScript initializing...");

        try {
            // Load saved settings
            ConfigManager.loadSavedSettings();

            // Set up styles
            StyleManager.injectStyles();

            // Try to insert button immediately
            if (DOMManager.insertButton()) {
                console.log("✅ VidScript button added immediately");
            } else {
                // If immediate insertion fails, set up observer
                DOMManager.setupButtonObserver();
            }

            // Set up video resize observer
            DOMManager.setupVideoObserverWhenReady();

            // Set up navigation watcher
            DOMManager.setupNavigationWatcher();

            // Set up event handlers
            setupEventHandlers();

            // Insert results slider
            DOMManager.insertResultsSlider();

            // Insert translation lang selector popup
            DOMManager.insertTranslationLangSelectorPopup();

            // Insert platform select popup
            DOMManager.insertPlatformSelectPopup();

            console.log("✅ VidScript initialized successfully");
        } catch (error) {
            console.error("❌ VidScript initialization error:", error);
        }
    };

    // Set up event handlers
    const setupEventHandlers = () => {
        // Set up state change event
        EventManager.on("add-overlay", async () => {
            console.log("🎬 Adding overlay...");

            // Add overlay
            try {
                // Pause video
                VideoManager.pauseVideo();

                // Capture current frame
                await VideoManager.captureCurrentFrame();

                // Add overlay
                UIFactory.createVideoOverlay();
            } catch (error) {
                console.error("❌ Error adding overlay:", error);
            }
        });

        // Resize overlay
        EventManager.on("resize-overlay", async () => {
            console.log("🎬 Resizing overlay...");

            // Resize overlay
            try {
                // Pause video
                VideoManager.pauseVideo();

                // Capture current frame
                await VideoManager.captureCurrentFrame();

                // Resize overlay
                UIFactory.resizeVideoOverlay();
            } catch (error) {
                console.error("❌ Error resizing overlay:", error);
            }
        });

        // Remove overlay
        EventManager.on("remove-overlay", async () => {
            console.log("🎬 Removing overlay...");

            // Remove overlay
            try {
                // Resume video
                VideoManager.playVideo();

                // Remove overlay
                UIFactory.removeVideoOverlay();
            } catch (error) {
                console.error("❌ Error removing overlay:", error);
            }
        });

        // Video play event
        EventManager.on("video-played", () => {
            ConfigManager.updateState("OFF");
        });

        // Video seek event
        EventManager.on("video-seeked", () => {
            ConfigManager.updateState("OFF");
        });

        // toggle vidscript button
        EventManager.on("toggle-vidscript", (state) => {
            const toggler = document.querySelector("#vidscript-toggle");
            const button = document.querySelector("#vidscript-wrapper");

            if (!toggler || !button) return;

            toggler.checked = state;

            if (state) {
                toggler.classList.add("checked");
                button.classList.add("checked");
            } else {
                toggler.classList.remove("checked");
                button.classList.remove("checked");
            }
        });

        // Extract text button click
        EventManager.on("extract-text", async () => {
            try {
                let frameData = ConfigManager.getFrameData();
                if (!frameData) {
                    NotificationManager.show("Please select an area to extract text from", "error");
                    return;
                }

                // Process the frame to extract text
                NotificationManager.show("Extracting text from video...", "info");
                await TextExtractor.processFrame();
            } catch (error) {
                console.error("Extract text error:", error);
                NotificationManager.show(`Error: ${error.message}`, "error");
            }
        });

        EventManager.on("show-results", () => {
            const vidScriptOverlay = document.querySelector("#vidscript-results-overlay");
            const vidScriptSlider = document.querySelector("#vidscript-slider");

            if (!vidScriptOverlay || !vidScriptSlider) {
                return;
            }

            document.body.style.overflow = "hidden";
            vidScriptOverlay.classList.add("active");
            vidScriptSlider.classList.add("active");

            // Update results slider
            UIFactory.drawResultsOnCanvas();
            UIFactory.addResultsToTextArea();
        });

        EventManager.on("hide-results", () => {
            const vidScriptOverlay = document.querySelector("#vidscript-results-overlay");
            const vidScriptSlider = document.querySelector("#vidscript-slider");

            if (!vidScriptOverlay || !vidScriptSlider) {
                return;
            }

            document.body.style.overflow = "auto";
            vidScriptOverlay.classList.remove("active");
            vidScriptSlider.classList.remove("active");

            // Reset the slider
            DOMManager.resetSlider();

            // Reset settings
            ConfigManager.resetExtractedImageData();
        });

        EventManager.on("update-results", () => {
            const resultsSlider = document.querySelector("#vidscript-slider-content-left-results-canvas");
            if (!resultsSlider) {
                return;
            }

            resultsSlider.innerHTML = "";
            resultsSlider.appendChild(UIFactory.createResultsCanvas());
        });

        EventManager.on("send-llm-request", (text) => {
            chrome.runtime.sendMessage({ type: "send-llm-request", text });
        });

        EventManager.on("get-video-context", () => {
            console.log("get-video-context");
            console.log(ConfigManager.get("context.videoContext"));

            // Check if video has context generated before
            if (ConfigManager.get("context.videoContext") === null) {
                VideoManager.getVideoContext();
            }
        });

        EventManager.on("show-translation-lang-selector-popup", () => {
            const translationLangSelectorOverlay = document.querySelector("#vidscript-translation-lang-selector-overlay");
            const translationLangSelectorPopup = document.querySelector("#vidscript-translation-lang-selector-popup");
            if (translationLangSelectorOverlay && translationLangSelectorPopup) {
                translationLangSelectorOverlay.classList.add("active");
                translationLangSelectorPopup.classList.add("active");
            }
        });

        EventManager.on("hide-translation-lang-selector-popup", () => {
            const translationLangSelectorOverlay = document.querySelector("#vidscript-translation-lang-selector-overlay");
            const translationLangSelectorPopup = document.querySelector("#vidscript-translation-lang-selector-popup");
            if (translationLangSelectorOverlay && translationLangSelectorPopup) {
                translationLangSelectorOverlay.classList.remove("active");
                translationLangSelectorPopup.classList.remove("active");
            }
        });

        EventManager.on("show-platform-select-popup", () => {
            const platformSelectOverlay = document.querySelector("#vidscript-platform-select-overlay");
            const platformSelectPopup = document.querySelector("#vidscript-platform-select-popup");
            const platformSelectTextArea = document.querySelector("#vidscript-platform-select-popup-body-textarea");

            const sharingText = TextExtractor.prepareSharingText();
            platformSelectTextArea.value = sharingText;

            if (platformSelectOverlay && platformSelectPopup) {
                platformSelectOverlay.classList.add("active");
                platformSelectPopup.classList.add("active");
            }
        });

        EventManager.on("hide-platform-select-popup", () => {
            const platformSelectOverlay = document.querySelector("#vidscript-platform-select-overlay");
            const platformSelectPopup = document.querySelector("#vidscript-platform-select-popup");
            if (platformSelectOverlay && platformSelectPopup) {
                platformSelectOverlay.classList.remove("active");
                platformSelectPopup.classList.remove("active");
            }
        });

        // // Video paused event
        // EventManager.on("video-paused", () => {
        //     if (ConfigManager.get("settings.extract")) {
        //         // Wait a bit to ensure video is fully paused
        //         setTimeout(() => {
        //             EventManager.emit("extract-text");
        //         }, 200);
        //     }
        // });

        // // Settings changed event
        // EventManager.on("setting-changed", ({ key, value }) => {
        //     // Update UI based on setting
        //     if (key === "extract") {
        //         const button = document.querySelector("#vidscript-wrapper");
        //         if (button) {
        //             button.classList.toggle("checked", value);
        //         }
        //     }
        // });

        // // Export text event
        // EventManager.on("export-text", () => {
        //     NotificationManager.show("Please extract text first", "info");
        //     EventManager.emit("extract-text");
        // });

        // Show about modal
        EventManager.on("show-about", () => {
            const aboutText =
                `VidScript v1.0.0 - A YouTube video text extraction tool. \n\nThis extension allows you to extract text from YouTube videos. \n\nSimply click the VidScript button in the video player to extract text. \n\n© ${new Date().getFullYear()} VidScript`.trim();

            UIFactory.createModal("About VidScript", aboutText);
        });
    };

    // Unload/cleanup the app
    const unload = () => {
        console.log("🛑 VidScript unloading...");

        // Clean up DOM observers
        DOMManager.cleanup();

        // Remove styles
        StyleManager.removeStyles();

        // Remove any UI components
        const elements = [
            "#vidscript-wrapper",
            "#vidscript-state",
            "#vidscript-modal",
            ".vidscript-backdrop",
            "#vidscript-overlay",
        ];

        elements.forEach((selector) => {
            const element = document.querySelector(selector);
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        console.log("✅ VidScript unloaded successfully");
    };

    return {
        init,
        unload,
    };
})();

export default VidScriptApp;
