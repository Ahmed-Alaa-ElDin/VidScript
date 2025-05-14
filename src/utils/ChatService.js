import DOMManager from "./DOMManager.js";

// Module for chat service
const ChatService = (() => {
    const sendMessage = (text) => {
        DOMManager.addSliderChatMessage(text, "user");

        // Show the chat loading state
        DOMManager.addSliderChatLoadingState();

        // Send the message to the background script
        chrome.runtime.sendMessage({ type: "send-llm-request", text }, (response) => {
            console.log("LLM Response:", response);
            if (response && response.success) {
                // Hide the chat loading state
                DOMManager.removeSliderChatLoadingState();
                // Show the chat response
                DOMManager.addSliderChatMessage(response.result, "ai");
            } else {
                // Hide the chat loading state
                DOMManager.removeSliderChatLoadingState();
                // Show the chat error
                DOMManager.addSliderChatMessage(response.error, "error");
            }
        });
    };

    return {
        sendMessage,
    };
})();

export default ChatService;
