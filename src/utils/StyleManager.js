// Module for UI styling
const StyleManager = (() => {
    // Create and inject styles
    const injectStyles = () => {
        // Check if styles are already injected
        if (document.getElementById('vidscript-styles')) {
            return;
        }
        // Create link element for external CSS
        const link = document.createElement('link');
        link.id = 'vidscript-styles';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.runtime.getURL('../styles/styles.css');

        const hljsLink = document.createElement('link');
        hljsLink.id = 'vidscript-hljs-styles';
        hljsLink.rel = 'stylesheet';
        hljsLink.type = 'text/css';
        hljsLink.href = chrome.runtime.getURL('../styles/atom-one-dark.min.css');
        
        document.head.appendChild(link);
        document.head.appendChild(hljsLink); 
    };

    return {
        injectStyles,
        removeStyles: () => {
            const existingStyle = document.getElementById("vidscript-styles");
            if (existingStyle) {
                existingStyle.remove();
            }

            const existingHljsStyle = document.getElementById("vidscript-hljs-styles");
            if (existingHljsStyle) {
                existingHljsStyle.remove();
            }
        },
    };
})();

export default StyleManager;
