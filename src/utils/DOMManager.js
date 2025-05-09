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
            ConfigManager.updateState(currentState == "OFF" ? "READY" : "OFF");
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
                    if (ConfigManager.getCurrentState() !== "OFF") {
                        EventManager.emit("resize-overlay");
                    }

                    console.log(`📏 Video resized: ${newWidth}x${newHeight}`);
                    console.log(`📏 Video resized: ${ConfigManager.getCurrentState()}`);
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

        const sliderHeader = createSliderHeader();
        sliderPanel.appendChild(sliderHeader);

        const sliderContent = createSliderContent();
        sliderPanel.appendChild(sliderContent);

        return sliderPanel;
    };

    const createSliderHeader = () => {
        const sliderHeader = document.createElement("div");
        sliderHeader.id = "vidscript-slider-header";

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
        closeSliderBtn.innerHTML =
            "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='currentColor' d='M16.95 8.464a1 1 0 0 0-1.414-1.414L12 10.586L8.464 7.05A1 1 0 1 0 7.05 8.464L10.586 12L7.05 15.536a1 1 0 1 0 1.414 1.414L12 13.414l3.536 3.536a1 1 0 1 0 1.414-1.414L13.414 12z'/></svg>";
        sliderHeaderActions.appendChild(closeSliderBtn);

        closeSliderBtn.addEventListener("click", () => {
            EventManager.emit("hide-results");
        });

        return sliderHeader;
    };

    const createSliderContent = () => {
        const sliderContent = document.createElement("div");
        sliderContent.id = "vidscript-slider-content";

        const sliderContentContainer = document.createElement("div");
        sliderContentContainer.id = "vidscript-slider-content-container";
        sliderContent.appendChild(sliderContentContainer);

        const sliderContentLeft = createSliderContentLeft();
        sliderContentContainer.appendChild(sliderContentLeft);

        const sliderContentRight = createSliderContentRight();
        sliderContentContainer.appendChild(sliderContentRight);

        return sliderContent;
    };

    const createSliderContentLeft = () => {
        const sliderContentLeft = document.createElement("div");
        sliderContentLeft.id = "vidscript-slider-content-left";

        const sliderContentLeftControllers = createSliderContentLeftControllers();
        sliderContentLeft.appendChild(sliderContentLeftControllers);

        const sliderContentLeftResults = createSliderContentLeftResults();
        sliderContentLeft.appendChild(sliderContentLeftResults);

        return sliderContentLeft;
    };

    const createSliderContentLeftControllers = () => {
        const sliderContentLeftControllers = document.createElement("div");
        sliderContentLeftControllers.id = "vidscript-slider-content-left-controllers";

        const sliderExtractionModeToggle = createSliderExtractionModeToggle();
        sliderContentLeftControllers.appendChild(sliderExtractionModeToggle);

        const sliderContentLeftActions = createSliderContentLeftActions();
        sliderContentLeftControllers.appendChild(sliderContentLeftActions);

        return sliderContentLeftControllers;
    };

    const createSliderContentLeftResults = () => {
        const sliderContentLeftResults = document.createElement("div");
        sliderContentLeftResults.id = "vidscript-slider-content-left-results";

        const canvas = document.createElement("div");
        canvas.id = "vidscript-slider-content-left-results-canvas";
        sliderContentLeftResults.appendChild(canvas);

        const textArea = document.createElement("textarea");
        textArea.id = "vidscript-slider-content-left-results-textarea";
        textArea.classList.add("hidden");
        textArea.placeholder = "Results will appear here...";
        sliderContentLeftResults.appendChild(textArea);

        return sliderContentLeftResults;
    };

    const createSliderExtractionModeToggle = () => {
        const wrapper = document.createElement("div");
        wrapper.id = "vidscript-slider-extraction-mode-toggle";

        // Toggle button container
        const button = document.createElement("div");
        button.id = "vidscript-slider-extraction-mode-toggle-button";

        // Circle inside toggle
        const circle = document.createElement("div");
        circle.id = "vidscript-slider-extraction-mode-toggle-circle";
        button.appendChild(circle);

        // Label with icon
        const label = document.createElement("span");
        label.id = "vidscript-slider-extraction-mode-toggle-label";
        label.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                <path fill="currentColor" d="M448 80c8.8 0 16 7.2 16 16v319.8l-5-6.5l-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3l-83 107.4l-30.5-42.7c-4.5-6.3-11.7-10-19.5-10s-15 3.7-19.5 10.1l-80 112l-4.5 6.2V96c0-8.8 7.2-16 16-16zM64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm80 192a48 48 0 1 0 0-96a48 48 0 1 0 0 96"/>
            </svg>        
        `;

        wrapper.appendChild(button);
        wrapper.appendChild(label);

        // Initial mode state
        let currentMode = "image";
        try {
            currentMode = ConfigManager.getFrameData().mode || "image";
        } catch (e) {
            console.error("Error getting frame data:", e);
        }

        // Toggle click handler
        button.addEventListener("click", () => {
            currentMode = currentMode === "image" ? "text" : "image";

            ConfigManager.updateFrameData({mode: currentMode});

            // Animate circle (by moving it to the right or left)
            if (currentMode === "text") {
                circle.style.left = "23px";
                // change the label svg
                label.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1536 1792">
                        <path fill="currentColor" d="M1468 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28H96q-40 0-68-28t-28-68V96q0-40 28-68T96 0h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22m384 1528V640H992q-40 0-68-28t-28-68V128H128v1536zM384 800q0-14 9-23t23-9h704q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23zm736 224q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64q0-14 9-23t23-9zm0 256q14 0 23 9t9 23v64q0 14-9 23t-23 9H416q-14 0-23-9t-9-23v-64q0-14 9-23t23-9z"/>
                    </svg>
                `;

                // toggle textarea
                const textarea = document.querySelector(
                    "#vidscript-slider-content-left-results-textarea"
                );
                textarea.classList.remove("hidden");

                // toggle canvas
                const canvas = document.querySelector(
                    "#vidscript-slider-content-left-results-canvas"
                );
                canvas.classList.add("hidden");
            } else {
                circle.style.left = "3px";
                // change the label svg
                label.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M448 80c8.8 0 16 7.2 16 16v319.8l-5-6.5l-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3l-83 107.4l-30.5-42.7c-4.5-6.3-11.7-10-19.5-10s-15 3.7-19.5 10.1l-80 112l-4.5 6.2V96c0-8.8 7.2-16 16-16zM64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm80 192a48 48 0 1 0 0-96a48 48 0 1 0 0 96"/>
                    </svg>        
                `;

                // toggle textarea
                const textarea = document.querySelector(
                    "#vidscript-slider-content-left-results-textarea"
                );
                textarea.classList.add("hidden");

                // toggle canvas
                const canvas = document.querySelector(
                    "#vidscript-slider-content-left-results-canvas"
                );
                canvas.classList.remove("hidden");
            }

            console.log(`🔄 Extraction mode switched to: ${currentMode}`);

            // Emit event if EventManager exists
            if (typeof EventManager !== "undefined") {
                EventManager.emit("extraction-mode-changed", currentMode);
            }
        });

        // Initialize circle position
        circle.style.left = "3px";

        return wrapper;
    };

    const createSliderContentLeftActions = () => {
        const sliderContentLeftActions = document.createElement("div");
        sliderContentLeftActions.id = "vidscript-slider-content-left-actions";

        const copyResultsBtn = createCopyResultsBtn();
        sliderContentLeftActions.appendChild(copyResultsBtn);

        const saveResultsBtn = createSaveResultsBtn();
        sliderContentLeftActions.appendChild(saveResultsBtn);

        const shareResultsBtn = createShareResultsBtn();
        sliderContentLeftActions.appendChild(shareResultsBtn);

        return sliderContentLeftActions;
    };

    const createCopyResultsBtn = () => {
        const copyResultsBtn = document.createElement("button");
        copyResultsBtn.id = "vidscript-copy-results-btn";
        copyResultsBtn.ariaLabel = "Copy results";
        copyResultsBtn.className = "controller-btn";
        copyResultsBtn.innerHTML = /*html*/ `
        <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512"><path fill="currentColor" d="m433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941M266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6m128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6m6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243z"/></svg>
        </div>
        <span class="btn-text">Copy</span>
        `;
        return copyResultsBtn;
    };

    const createSaveResultsBtn = () => {
        const saveResultsBtn = document.createElement("button");
        saveResultsBtn.id = "vidscript-save-results-btn";
        saveResultsBtn.ariaLabel = "Save results";
        saveResultsBtn.className = "controller-btn";
        saveResultsBtn.innerHTML = /*html*/ `
        <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512"><path fill="currentColor" d="m433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941M272 80v80H144V80zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6M224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88s88-39.477 88-88s-39.477-88-88-88m0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40s40 17.944 40 40s-17.944 40-40 40"/></svg>
        </div>
        <span class="btn-text">Save</span>
        `;
        return saveResultsBtn;
    };

    const createShareResultsBtn = () => {
        const shareResultsBtn = document.createElement("button");
        shareResultsBtn.id = "vidscript-share-results-btn";
        shareResultsBtn.ariaLabel = "Share results";
        shareResultsBtn.className = "controller-btn";
        shareResultsBtn.innerHTML = /*html*/ `
        <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 576 512"><path fill="currentColor" d="M561.938 158.06L417.94 14.092C387.926-15.922 336 5.097 336 48.032v57.198c-42.45 1.88-84.03 6.55-120.76 17.99c-35.17 10.95-63.07 27.58-82.91 49.42C108.22 199.2 96 232.6 96 271.94c0 61.697 33.178 112.455 84.87 144.76c37.546 23.508 85.248-12.651 71.02-55.74c-15.515-47.119-17.156-70.923 84.11-78.76V336c0 42.993 51.968 63.913 81.94 33.94l143.998-144c18.75-18.74 18.75-49.14 0-67.88M384 336V232.16C255.309 234.082 166.492 255.35 206.31 376C176.79 357.55 144 324.08 144 271.94c0-109.334 129.14-118.947 240-119.85V48l144 144zm24.74 84.493a82.7 82.7 0 0 0 20.974-9.303c7.976-4.952 18.286.826 18.286 10.214V464c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h132c6.627 0 12 5.373 12 12v4.486c0 4.917-2.987 9.369-7.569 11.152c-13.702 5.331-26.396 11.537-38.05 18.585a12.14 12.14 0 0 1-6.28 1.777H54a6 6 0 0 0-6 6v340a6 6 0 0 0 6 6h340a6 6 0 0 0 6-6v-25.966c0-5.37 3.579-10.059 8.74-11.541"/></svg>
        </div>
        <span class="btn-text">Share</span>
        `;
        return shareResultsBtn;
    };

    const createSliderContentRight = () => {
        const sliderContentRight = document.createElement("div");
        sliderContentRight.id = "vidscript-slider-content-right";

        const sliderContentRightControllers = createSliderContentRightControllers();
        sliderContentRight.appendChild(sliderContentRightControllers);

        const sliderContentRightResults = createSliderContentRightResults();
        sliderContentRight.appendChild(sliderContentRightResults);

        return sliderContentRight;
    };

    const createSliderContentRightControllers = () => {
        const sliderContentRightControllers = document.createElement("div");
        sliderContentRightControllers.id = "vidscript-slider-content-right-controllers";

        const sliderContentRightControllersTitle = document.createElement("h3");
        sliderContentRightControllersTitle.id = "vidscript-slider-content-right-controllers-title";
        sliderContentRightControllersTitle.textContent = "Talk to AI";
        sliderContentRightControllers.appendChild(sliderContentRightControllersTitle);

        const sliderContentRightControllersActions = createSliderContentRightActions();
        sliderContentRightControllers.appendChild(sliderContentRightControllersActions);

        return sliderContentRightControllers;
    };

    const createSliderContentRightActions = () => {
        const sliderContentRightActions = document.createElement("div");
        sliderContentRightActions.id = "vidscript-slider-content-right-actions";

        const improveBtn = createImproveBtn();
        sliderContentRightActions.appendChild(improveBtn);

        const translateBtn = createTranslateBtn();
        sliderContentRightActions.appendChild(translateBtn);

        const explainBtn = createExplainBtn();
        sliderContentRightActions.appendChild(explainBtn);

        return sliderContentRightActions;
    };

    const createImproveBtn = () => {
        const improveBtn = document.createElement("button");
        improveBtn.id = "vidscript-improve-btn";
        improveBtn.ariaLabel = "Improve video";
        improveBtn.className = "controller-btn";
        improveBtn.innerHTML = /*html*/ `
        <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 1664 1664"><path fill="currentColor" d="m1190 581l293-293l-107-107l-293 293zm447-293q0 27-18 45L333 1619q-18 18-45 18t-45-18L45 1421q-18-18-18-45t18-45L1331 45q18-18 45-18t45 18l198 198q18 18 18 45M286 98l98 30l-98 30l-30 98l-30-98l-98-30l98-30l30-98zm350 162l196 60l-196 60l-60 196l-60-196l-196-60l196-60l60-196zm930 478l98 30l-98 30l-30 98l-30-98l-98-30l98-30l30-98zM926 98l98 30l-98 30l-30 98l-30-98l-98-30l98-30l30-98z"/></svg>
        </div>
        <span class="btn-text">Improve</span>
        `;
        return improveBtn;
    };

    const createTranslateBtn = () => {
        const translateBtn = document.createElement("button");
        translateBtn.id = "vidscript-translate-btn";
        translateBtn.ariaLabel = "Translate video";
        translateBtn.className = "controller-btn";
        translateBtn.innerHTML = /*html*/ `
        <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="m11.9 22l4.55-12h2.1l4.55 12H21l-1.075-3.05h-4.85L14 22zM4 19l-1.4-1.4l5.05-5.05q-.875-.875-1.588-2T4.75 8h2.1q.5.975 1 1.7t1.2 1.45q.825-.825 1.713-2.313T12.1 6H1V4h7V2h2v2h7v2h-2.9q-.525 1.8-1.575 3.7t-2.075 2.9l2.4 2.45l-.75 2.05l-3.05-3.125zm11.7-1.8h3.6l-1.8-5.1z"/></svg>
        </div>
        <span class="btn-text">Translate</span>
        `;
        return translateBtn;
    };

    const createExplainBtn = () => {
        const explainBtn = document.createElement("button");
        explainBtn.id = "vidscript-explain-btn";
        explainBtn.ariaLabel = "Explain video";
        explainBtn.className = "controller-btn";
        explainBtn.innerHTML = /*html*/ `
        <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M20 17a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9.46c.35.61.54 1.3.54 2h10v11h-9v2m4-10v2H9v13H7v-6H5v6H3v-8H1.5V9a2 2 0 0 1 2-2zM8 4a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2"/></svg>
        </div>
        <span class="btn-text">Explain</span>
        `;
        return explainBtn;
    };

    const createSliderContentRightResults = () => {
        const sliderContentRightResults = document.createElement("div");
        sliderContentRightResults.id = "vidscript-slider-content-right-results";

        // chat
        const chat = document.createElement("div");
        chat.id = "vidscript-slider-content-right-results-chat";
        sliderContentRightResults.appendChild(chat);

        // inner text area
        const textArea = document.createElement("textarea");
        textArea.id = "vidscript-slider-content-right-results-textarea";
        textArea.placeholder = "Write your text here...";
        sliderContentRightResults.appendChild(textArea);

        // send button
        const sendBtn = document.createElement("button");
        sendBtn.id = "vidscript-slider-content-right-results-send-btn";
        sendBtn.ariaLabel = "Send text";
        sendBtn.className = "controller-btn";
        sendBtn.innerHTML = /*html*/ `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1700 1900">
            <path fill="currentColor" d="M1764 43q33 24 27 64l-256 1536q-5 29-32 45q-14 8-31 8q-11 0-24-5l-527-215l-298 327q-18 21-47 21q-14 0-23-4q-19-7-30-23.5t-11-36.5v-452L40 1115q-37-14-40-55q-3-39 32-59L1696 41q35-21 68 2m-342 1499l221-1323l-1434 827l336 137l863-639l-478 797z"/>
        </svg>            
        `;
        sliderContentRightResults.appendChild(sendBtn);

        return sliderContentRightResults;
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
