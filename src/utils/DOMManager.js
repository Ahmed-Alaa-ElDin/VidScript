import ConfigManager from "./ConfigManager.js";
import NotificationManager from "./NotificationManager.js";
import UIFactory from "./UIFactory.js";
import VideoManager from "./VideoManager.js";
import EventManager from "./EventManager.js";

// Module for DOM operations
const DOMManager = (() => {
    let buttonObserver = null;
    let navigateInterval = null;

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
        // Toggle button
        const toggle = button.querySelector("#vidscript-toggle");
        toggle.addEventListener("change", (e) => {
            const checked = e.target.checked;
            ConfigManager.update("states.extract", checked);
            button.classList.toggle("checked", checked);

            if (checked) {
                VideoManager.createVideoOverlay();
            } else {
                VideoManager.cleanupVideoOverlay();
            }

            NotificationManager.show(
                `Extraction ${checked ? "started" : "stopped"}`,
                checked ? "success" : "info"
            );
        });

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
        button.addEventListener("click", (e) => {
            // Avoid triggering when clicking on menu button or toggle
            if (e.target.id === "vidscript-menu-button" || e.target.id === "vidscript-toggle") {
                return;
            }

            EventManager.emit("extract-text");
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

    return {
        insertButton,
        setupButtonObserver,
        setupNavigationWatcher,
        cleanup,
    };
})();

export default DOMManager;
