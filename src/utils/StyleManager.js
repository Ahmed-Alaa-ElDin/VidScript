// Module for UI styling
const StyleManager = (() => {
    // Create and inject styles
    const injectStyles = () => {
        const style = document.createElement("style");
        style.id = "vidscript-styles";
        style.textContent = /*css*/ `
            #vidscript-wrapper {
                display: inline-flex !important;
                border-radius: 8px !important;
                background: radial-gradient(60% 80% at 50% 100%, #999c, #666c) !important;
                padding: 0 !important;
                align-items: center !important;
                justify-content: center !important;
                position: relative;
                top: -17px;
                margin: 0 8px !important;
                transition: background 0.3s ease;
                cursor: pointer;
            }

            #vidscript-wrapper:hover {
                background: radial-gradient(60% 80% at 50% 100%, #AAAA, #888c) !important;
            }

            #vidscript-wrapper.checked {
                background: radial-gradient(60% 80% at 50% 100%, #b84b4b, #666c) !important;
            }

            #vidscript-wrapper span {
                height: max-content !important;
                line-height: normal !important;
                font-weight: 500 !important;
                font-size: 14px !important;
                color: white !important;
            }

            #vidscript-toggler-wrapper {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 8px !important;
                border-right: 1px solid rgba(255, 255, 255, .12) !important;
                padding: 7px 8px !important;
                cursor: pointer !important;
            }

            #vidscript-menu-button {
                background: transparent !important;
                border: none !important;
                padding: 7px 8px !important;
                cursor: pointer !important;
                color: white !important;
            }

            #vidscript-switch-wrapper {
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: sans-serif;
                background-color: transparent;
                border-radius: 20px;
                color: #fff;
                width: fit-content;
            }

            #vidscript-switch-label {
                position: relative;
                display: inline-block;
                width: 30px;
                height: 16px;
                background: #0a0d3330;
                border-radius: 10px;
                cursor: pointer;
                transition: background 0.3s ease;
            }

            #vidscript-wrapper.checked #vidscript-switch-label {
                background: rgba(177, 23, 23, 0.16);
            }

            #vidscript-toggle {
                opacity: 0;
                width: 0;
                height: 0;
            }

            #vidscript-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                border-radius: 34px;
                transition: 0.3s;
            }

            #vidscript-toggle-slider:before {
                position: absolute;
                content: "";
                height: 12px;
                width: 12px;
                left: 2px;
                top: 2px;
                background-color: #979797;
                border-radius: 50%;
                transition: 0.3s;
            }

            #vidscript-toggle:checked + #vidscript-toggle-slider:before {
                transform: translateX(14px);
                background-color: #fff;
            }

            #vidscript-toggle:checked + #vidscript-toggle-slider {
                background-color: #b84b4b;
            }

            #vidscript-menu {   
                position: absolute;
                bottom: 100%;
                right: 0;
                background: #222;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                z-index: 2000;
                width: 250px;
                padding: 8px 12px;
                color: white;
                font-family: sans-serif;
                display: none;
            }

            #vidscript-menu.active {
                display: block;
            }

            .vidscript-menu-item {
                padding: 8px 12px;
                margin: 4px 0;
                display: flex;
                line-height: normal;
                justify-content: space-between;
                align-items: center;
                border-radius: 4px;
            }

            .vidscript-menu-item:hover {
                background: rgba(255,255,255,0.1);
            }

            .vidscript-menu-header {
                font-weight: bold;
                padding: 12px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                margin-bottom: 8px;
                line-height: normal;
                font-size: 14px;
            }
            
            #vidscript-state {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 15px;
                border-radius: 4px;
                z-index: 9999;
                font-weight: bold;
                transition: opacity 0.3s ease-in-out;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            
            .vidscript-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1500;
                background: rgba(0,0,0,0.5);
                display: none;
            }
            
            .vidscript-backdrop.active {
                display: block;
            }
            
            #vidscript-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #222;
                border-radius: 8px;
                padding: 20px;
                color: white;
                z-index: 2000;
                width: 500px;
                max-width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                display: none;
            }
            
            #vidscript-modal.active {
                display: block;
            }
            
            .vidscript-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                width: 100%;
                gap: 10px;
            }
            
            .vidscript-modal-header h3 {
                margin: 0;
                font-size: 14px;
            }
            
            .vidscript-close-button {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                width: auto;
                padding: 0;
                font-size: 18px;
            }
            
            .vidscript-modal-content {
                margin-bottom: 16px;
            }
            
            .vidscript-modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            }
            
            .vidscript-button {
                padding: 8px 16px;
                border-radius: 4px;
                border: none;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.2s ease;
            }
            
            .vidscript-button-primary {
                background: #b84b4b;
                color: white;
            }
            
            .vidscript-button-primary:hover {
                background: #d75a5a;
            }
            
            .vidscript-button-secondary {
                background: rgba(255,255,255,0.1);
                color: white;
            }
            
            .vidscript-button-secondary:hover {
                background: rgba(255,255,255,0.2);
            }
            
            #vidscript-extracted-text {
                background: rgba(0,0,0,0.2);
                border-radius: 4px;
                padding: 12px;
                max-height: 300px;
                overflow-y: auto;
                white-space: pre-wrap;
                font-family: monospace;
                margin-bottom: 16px;
            }
            
            .vidscript-tooltip {
                position: relative;
                cursor: help;
            }
            
            .vidscript-tooltip:hover::after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: #000;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 100;
            }

            #vidscript-overlay{
                position: absolute;
                overflow: hidden;
                z-index: 9999;
                pointer-events: auto;
            }

            #vidscript-overlay-inner {
                background-size: cover;
                width: 100% !important;
                height: 100% !important;
                mask-image: linear-gradient(to top, black 0%, black 0%, transparent 0%);
                -webkit-mask-image: linear-gradient(to top, black 0%, black 0%, transparent 0%);
                mask-size: 100% 100% !important;
                -webkit-mask-size: 100% 100% !important;
                animation: revealMask 2s ease-out forwards;
            }

            #vidscript-sparkle {
                position: absolute;
                width: 100%;
                height: 5px;
                top: 100%;
                left: 0;
                background: radial-gradient(white, transparent);
                box-shadow: 0 0 20px 10px rgb(182, 122, 122);
                animation: sparkleMove 2s ease-out forwards;
            }

            #vidscript-border {
                position: absolute !important;
                box-sizing: border-box !important;
                border: 5px solid;
                border-image: linear-gradient(
                    to top, 
                    #b84b4b, 
                    rgba(0, 0, 0, 0)
                ) 1 100%;
                pointer-events: none !important;
                z-index: 9999 !important;
                mask-image: linear-gradient(to top, black 0%, transparent 0%);
                -webkit-mask-image: linear-gradient(to top, black 0%, transparent 0%);
                mask-size: 100% 100%;
                -webkit-mask-size: 100% 100%;
                animation: revealBorder 2s ease-out forwards;
            }

            #vidscript-selection-tools-wrapper {
                position: absolute;
                transform: translateY(-50%);
                top:50%;
                left: 10px;
                z-index: 10002;
                pointer-events: none;
                background: #888888cc;
                padding: 6px 14px;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }

            #vidscript-selector-toggle {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 6px;
                cursor: pointer;
                pointer-events: auto;
            }

            #vidscript-selector-toggle-button {
                width: 30px;
                height: 16px;
                background: #ff4f4f;
                border-radius: 8px;
                position: relative;
                cursor: pointer;
                transition: background 0.3s ease;        
            }

            #vidscript-selector-toggle-circle {
                width: 14px;
                height: 14px;
                background: white;
                border-radius: 50%;
                position: absolute;
                top: 1px;
                left: 1px;
                transition: left 0.3s;
            }

            #vidscript-selector-toggle-label {
                color: white;
                font-weight: bold;
                height: 20px;
                width: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 0;
            }

            #vidscript-full-screen-selector {
                width: 100%;
                background: #ff4f4f;
                box-shadow: 0 0 8px 1px #888888cc;
                border-radius: 8px;
                padding: 5px 0;
                position: relative;
                cursor: pointer;
                transition: background 0.3s ease;   
                display: flex;     
                align-items: center;
                justify-content: center;
                line-height: 0;
                overflow: hidden;
                cursor: pointer;
                z-index: 10002;
                pointer-events: auto;
            }

            #vidscript-full-screen-selector:hover {
                background:rgb(255, 59, 59);
            }

            /* Result Slider */
            #vidscript-results-overlay {
                position: fixed;
                inset: 0;
                background-color: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(4px);
                z-index: 100000;
                transition: opacity 0.3s ease;
                opacity: 0;
                pointer-events: none;
            }

            #vidscript-results-overlay.active {
                opacity: 1;
                pointer-events: auto;
                cursor: pointer;
            }

            #vidscript-slider {
                position: fixed;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%) translateY(100%);
                width: 95vw;
                height: 90vh;
                background-color: white;
                z-index: 100000;
                border-width: 6px 6px 0 6px;
                border-style: solid;
                border-color: #ff4f4f;
                border-radius: 20px 20px 0 0;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                padding: 0 1.5rem;
                transition: transform 0.3s ease-in-out;
                overflow: hidden;
            }

            #vidscript-slider.active {
                transform: translateX(-50%) translateY(0);
            }

            #vidscript-slider-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 0;
                border-bottom: 1px solid #e5e7eb;
            }

            #vidscript-slider-header-title {
                font-size: 2.5rem;
                color: #574a4a;
                font-weight: 600;
                margin: 0;
            }

            #vidscript-slider-header-actions {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            #vidscript-close-slider-btn {
                padding: 0.5rem;
                border-radius: 9999px;
                background-color: #ff4f4f;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
            }

            #vidscript-close-slider-btn:hover {
                background-color: #ff6f6f;
            }

            #vidscript-slider-content {
                padding: 1.5rem;
                padding-top: 3rem;
            }

            @keyframes revealBorder {
                0% {
                    mask-image: linear-gradient(to top, black 0%, transparent 0%);
                    -webkit-mask-image: linear-gradient(to top, black 0%, transparent 0%);
                }
                100% {
                    mask-image: linear-gradient(to top, black 100%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to top, black 100%, transparent 100%);
                }
            }
            
            
            @keyframes revealMask {
                0% {
                    mask-image: linear-gradient(to top, black 0%, black 0%, transparent 0%);
                    -webkit-mask-image: linear-gradient(to top, black 0%, black 0%, transparent 0%);
                }
                100% {
                    mask-image: linear-gradient(to top, black 100%, black 100%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to top, black 100%, black 100%, transparent 100%);
                }
            }
    
            @keyframes sparkleMove {
                0%   { top: 100%; opacity: 1; }
                90%  { opacity: 1; }
                100% { top: 0%; opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    };

    return {
        injectStyles,
        removeStyles: () => {
            const existingStyle = document.getElementById("vidscript-styles");
            if (existingStyle) {
                existingStyle.remove();
            }
        },
    };
})();

export default StyleManager;
