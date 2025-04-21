import UIFactory from "./UIFactory.js";

const NotificationManager = (() => {
    let activeNotification = null;
    let hideTimeout = null;

    const show = (message, type = "info", duration = 3000) => {
        // Clear any existing timeout
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }

        // Create or update notification
        const notification = UIFactory.createNotification(message, type);
        activeNotification = notification;

        // Auto-hide after duration
        if (duration > 0) {
            hideTimeout = setTimeout(() => {
                hide();
            }, duration);
        }

        return notification;
    };

    const hide = () => {
        if (activeNotification) {
            activeNotification.style.opacity = "0";
            setTimeout(() => {
                if (activeNotification && activeNotification.parentNode) {
                    activeNotification.parentNode.removeChild(activeNotification);
                }
                activeNotification = null;
            }, 300);
        }
    };

    return {
        show,
        hide,
    };
})();

export default NotificationManager;