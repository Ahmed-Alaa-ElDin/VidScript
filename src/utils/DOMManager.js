import ConfigManager from "./ConfigManager.js";
import NotificationManager from "./NotificationManager.js";
import UIFactory from "./UIFactory.js";
import VideoManager from "./VideoManager.js";
import EventManager from "./EventManager.js";

// Module for DOM operations
const DOMManager = (() => {
    let buttonObserver = null;
    let navigateInterval = null;
    let resizeObserver = null;
    let lastVideoSize = { width: 0, height: 0 };

    // Insert button into YouTube player
    const insertButton = () => {
        const { targetButtons, existingButton } = ConfigManager.get("selectors");

        // Check if button already exists
        if (document.querySelector(existingButton)) {
            return true;
        }

        // Try to find button container
        const buttonContainer = document.querySelector(targetButtons);

        if (!buttonContainer) {
            return false;
        }

        // Create and add button
        const button = UIFactory.createMainButton();
        buttonContainer.insertBefore(button, buttonContainer.firstChild);

        // Create and append settings menu (hidden by default)
        const menu = UIFactory.createSettingsMenu();
        button.appendChild(menu);

        // Set up event listeners
        setupButtonEvents(button, menu);

        return true;
    };

    // Set up button event listeners
    const setupButtonEvents = (button, menu) => {
        // Menu button click
        const menuButton = button.querySelector("#vidscript-menu-button");
        menuButton.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("active");

            // Add document click listener to close menu when clicking outside
            if (menu.classList.contains("active")) {
                setTimeout(() => {
                    document.addEventListener("click", closeMenuOnClickOutside);
                }, 10);
            } else {
                document.removeEventListener("click", closeMenuOnClickOutside);
            }
        });

        // Main button click - extract text
        const toggler = button.querySelector("#vidscript-toggle");
        toggler.addEventListener("change", (e) => {
            // Avoid triggering when clicking on menu button or toggle
            if (e.target.id === "vidscript-menu-button") {
                return;
            }

            // get the current state
            const currentState = ConfigManager.getCurrentState();

            // if the current state is OFF, trigger creating video overlay
            if (currentState == "OFF") {
                ConfigManager.updateState("READY");
            } else {
                ConfigManager.updateState("OFF");
            }
        });
    };

    // Close menu when clicking outside
    const closeMenuOnClickOutside = (e) => {
        const menu = document.querySelector("#vidscript-menu");
        const menuButton = document.querySelector("#vidscript-menu-button");

        if (menu && !menu.contains(e.target) && !menuButton.contains(e.target)) {
            menu.classList.remove("active");
            document.removeEventListener("click", closeMenuOnClickOutside);
        }
    };

    // Set up observer to watch for button container
    const setupButtonObserver = () => {
        // Clean up existing observer
        if (buttonObserver) {
            buttonObserver.disconnect();
        }

        // Target nodes to observe
        const targetNodes = [
            document.querySelector("ytd-watch-flexy"),
            document.querySelector("ytd-watch-metadata"),
            document.querySelector("#movie_player"),
        ].filter(Boolean);

        if (targetNodes.length === 0) {
            targetNodes.push(document.body);
        }

        // Create new observer
        buttonObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    if (insertButton()) {
                        console.log("✅ VidScript button added via observer");
                        buttonObserver.disconnect();

                        // Set up video events once button is added
                        VideoManager.setupVideoEvents();
                        break;
                    }
                }
            }
        });

        // Start observing with targeted options
        targetNodes.forEach((node) => {
            buttonObserver.observe(node, {
                childList: true,
                subtree: true,
            });
        });

        // Timeout to prevent infinite observation
        setTimeout(() => {
            if (buttonObserver) {
                buttonObserver.disconnect();
                console.log("⏱️ VidScript button observer timed out");
            }
        }, 30000);

        return buttonObserver;
    };

    // Set up periodic check for YouTube navigation
    const setupNavigationWatcher = () => {
        // Clean up existing interval
        if (navigateInterval) {
            clearInterval(navigateInterval);
        }

        // Variables to track URL changes
        let lastUrl = window.location.href;

        // Check for URL changes periodically
        navigateInterval = setInterval(() => {
            const currentUrl = window.location.href;

            // If URL changed, try to insert button
            if (currentUrl !== lastUrl) {
                console.log("🔄 YouTube navigation detected");
                lastUrl = currentUrl;

                // Small delay to let YouTube UI update
                setTimeout(() => {
                    if (!document.querySelector(ConfigManager.get("selectors.existingButton"))) {
                        if (insertButton()) {
                            console.log("✅ VidScript button added after navigation");
                        } else {
                            // If failed, set up observer
                            setupButtonObserver();
                        }

                        // Set up video events
                        VideoManager.setupVideoEvents();
                    }
                }, 1000);
            } else {
                // Periodic check for button if not present
                if (!document.querySelector(ConfigManager.get("selectors.existingButton"))) {
                    if (insertButton()) {
                        console.log("✅ VidScript button added via interval check");
                    }
                }
            }
        }, 1000);

        return navigateInterval;
    };

    const setupVideoObserverWhenReady = () => {
        const observer = new MutationObserver(() => {
            const videoElement = document.querySelector("video");
            const videoContainer = document.querySelector("#movie_player");

            if (videoElement && videoContainer) {
                console.log("🎬 Video found. Initializing resize observer...");
                setupVideoResizeObserver();
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    };

    // Set up observer to watch for video size changes
    const setupVideoResizeObserver = () => {
        // Clean up existing observer
        if (resizeObserver) {
            resizeObserver.disconnect();
        }

        // Find video element
        const videoElement = document.querySelector("video");
        if (!videoElement) {
            console.log("⚠️ Video element not found for resize observer");
            return null;
        }

        // Find video container
        const videoContainer = document.querySelector("#movie_player");
        if (!videoContainer) {
            console.log("⚠️ Video container not found for resize observer");
            return null;
        }

        // Store initial video size
        lastVideoSize = {
            width: videoContainer.offsetWidth,
            height: videoContainer.offsetHeight,
        };

        // Create resize observer
        resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const newWidth = entry.contentRect.width;
                const newHeight = entry.contentRect.height;

                // Check if size has meaningfully changed (by more than 5px)
                if (
                    Math.abs(newWidth - lastVideoSize.width) > 5 ||
                    Math.abs(newHeight - lastVideoSize.height) > 5
                ) {
                    lastVideoSize = { width: newWidth, height: newHeight };

                    // Dispatch custom event for other components to listen to
                    if (ConfigManager.getCurrentState() === "READY") {
                        EventManager.emit("resize-overlay");
                    }

                    console.log(`📏 Video resized: ${newWidth}x${newHeight}`);
                }
            }
        });

        // Start observing the video container
        resizeObserver.observe(videoContainer);
        console.log("👁️ Video resize observer started");

        return resizeObserver;
    };

    // Update UI elements based on video size
    const updateUIOnResize = (videoSize) => {
        // Notify EventManager about the resize
        EventManager.emit("video-resized", videoSize);

        // Get current active overlays or UI elements
        const overlays = document.querySelectorAll(".vidscript-overlay");
        if (overlays.length > 0) {
            overlays.forEach((overlay) => {
                // Update overlay position and size based on video dimensions
                overlay.style.width = `${videoSize.width}px`;
                overlay.style.height = `${videoSize.height}px`;
            });
        }

        // Update settings menu position if needed
        const settingsMenu = document.querySelector("#vidscript-menu");
        if (settingsMenu && settingsMenu.classList.contains("active")) {
            // Ensure menu stays within viewport
            const menuRect = settingsMenu.getBoundingClientRect();
            if (menuRect.right > window.innerWidth) {
                settingsMenu.style.right = "0px";
                settingsMenu.style.left = "auto";
            }
        }

        // Notify user if in debug mode
        if (ConfigManager.get("debugMode")) {
            NotificationManager.show(
                `Video resized: ${videoSize.width}×${videoSize.height}`,
                "info",
                2000
            );
        }
    };

    // Get current video dimensions
    const getVideoSize = () => {
        return { ...lastVideoSize };
    };

    // Clean up all observers and intervals
    const cleanup = () => {
        if (buttonObserver) {
            buttonObserver.disconnect();
            buttonObserver = null;
        }

        if (navigateInterval) {
            clearInterval(navigateInterval);
            navigateInterval = null;
        }

        // Remove event listeners
        document.removeEventListener("click", closeMenuOnClickOutside);
    };

    // Insert Results Slider
    const insertResultsSlider = () => {
        const overlay = createResultsSliderOverlay();
        const slider = createResultsSlider();

        document.body.appendChild(overlay);
        document.body.appendChild(slider);
    };

    // Create Result Slider Overlay
    const createResultsSliderOverlay = () => {
        const overlay = document.createElement("div");
        overlay.id = "vidscript-results-overlay";

        overlay.addEventListener("click", () => {
            EventManager.emit("hide-results");
        });

        return overlay;
    };

    // Create Results Slider
    const createResultsSlider = () => {
        const sliderPanel = document.createElement("div");
        sliderPanel.id = "vidscript-slider";

        const sliderHeader = document.createElement("div");
        sliderHeader.id = "vidscript-slider-header";
        sliderPanel.appendChild(sliderHeader);

        const sliderHeaderTitle = document.createElement("h3");
        sliderHeaderTitle.id = "vidscript-slider-header-title";
        sliderHeaderTitle.textContent = "VidScript Results";
        sliderHeader.appendChild(sliderHeaderTitle);

        const sliderHeaderActions = document.createElement("div");
        sliderHeaderActions.id = "vidscript-slider-header-actions";
        sliderHeader.appendChild(sliderHeaderActions);

        const closeSliderBtn = document.createElement("button");
        closeSliderBtn.id = "vidscript-close-slider-btn";
        closeSliderBtn.ariaLabel = "Close slider";
        closeSliderBtn.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='currentColor' d='M16.95 8.464a1 1 0 0 0-1.414-1.414L12 10.586L8.464 7.05A1 1 0 1 0 7.05 8.464L10.586 12L7.05 15.536a1 1 0 1 0 1.414 1.414L12 13.414l3.536 3.536a1 1 0 1 0 1.414-1.414L13.414 12z'/></svg>";
        sliderHeaderActions.appendChild(closeSliderBtn);

        closeSliderBtn.addEventListener("click", () => {
            EventManager.emit("hide-results");
        });

        const sliderContent = document.createElement("div");
        sliderContent.id = "vidscript-slider-content";
        sliderPanel.appendChild(sliderContent);

        return sliderPanel;
    };



    return {
        insertButton,
        setupButtonObserver,
        setupNavigationWatcher,
        setupVideoObserverWhenReady,
        setupVideoResizeObserver,
        updateUIOnResize,
        getVideoSize,
        cleanup,
        createResultsSlider,
        insertResultsSlider,
    };
})();

export default DOMManager;
