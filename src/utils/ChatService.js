import DOMManager from "./DOMManager.js";
import ConfigManager from "./ConfigManager.js";

// Module for chat service
const ChatService = (() => {
    const sendMessage = (text) => {
        // Get the latest chat context
        const chatContext = ConfigManager.get("context.chatContext");
        
        // Add the user message to the chat
        DOMManager.addSliderChatMessage(text, "user");

        // Show the chat loading state
        DOMManager.addSliderChatLoadingState();

        const prompt = [
            {
                role: "system",
                content: chatContext
                    ? `You are a helpful assistant. Here is the conversation so far:\n\n${chatContext}`
                    : "You are a helpful assistant.",
            },
            {
                role: "user",
                content: text,
            },
        ];

        // Send the message to the background script
        chrome.runtime.sendMessage({ type: "send-llm-request", prompt }, (response) => {
            console.log("LLM Response:", response);
            if (response && response.success) {
                // Hide the chat loading state
                DOMManager.removeSliderChatLoadingState();
                // Show the chat response
                DOMManager.addSliderChatMessage(response.result, "ai");
                // Update the chat context
                updateChatContext(text, response.result);
            } else {
                // Hide the chat loading state
                DOMManager.removeSliderChatLoadingState();
                // Show the chat error
                DOMManager.addSliderChatMessage(response.error, "error");
            }
        });
    };

    const generateVideoContext = async (videoTitle, videoDescription) => {
        const prompt = [
            {
                role: "system",
                content:
                    "You are an expert assistant that summarizes YouTube videos clearly and concisely based on the available metadata.",
            },
            {
                role: "user",
                content: `Please provide a short summary of this video based on its metadata:\n\n**Title:** ${videoTitle}\n**Description:** ${videoDescription}`,
            },
        ];

        // Send the message to the background script
        const response = await new Promise((resolve) =>
            chrome.runtime.sendMessage({ type: "send-llm-request", prompt }, (response) => {
                console.log("LLM Response:", response);
                resolve(response);
            })
        );

        return response;
    };

    const updateChatContext = async (lastRequest, lastResponse) => {
        const oldChatContext = ConfigManager.get("context.chatContext");

        const prompt = [
            {
                role: "system",
                content:
                    "You are an assistant that maintains a concise, up-to-date context summary of an ongoing conversation between a user and an AI. Your job is to update the chat context using the latest request and response, while keeping it brief and useful for future interactions.",
            },
            {
                role: "user",
                content: `Here is the previous chat context:\n\n${
                    oldChatContext || "None"
                }\n\nThe user asked:\n\n${lastRequest}\n\nThe AI responded:\n\n${lastResponse}\n\nUpdate the chat context to reflect the new exchange. The result should be a short summary that captures the important points from the conversation so far.`,
            },
        ];

        // Send to background for LLM summarization
        chrome.runtime.sendMessage({ type: "send-llm-request", prompt }, (response) => {
            console.log("Updated Chat Context Response:", response);
            if (response && response.success) {
                ConfigManager.update("context.chatContext", response.result);
            } else {
                console.error("Failed to update chat context:", response.error);
            }
        });
    };

    const getLastRequest = (prompt) => {
        return prompt.find((item) => item.role === "user").content;
    };

    const improveVideoORCResults = async () => {
        DOMManager.addSliderChatMessage("Improve video OCR results", "user");

        // Show the chat loading state
        DOMManager.addSliderChatLoadingState();

        const videoContext = ConfigManager.get("context.videoContext");
        const ocrText = ConfigManager.getExtractedImageData().text;

        const prompt = [
            {
                role: "system",
                content:
                    "You are an expert assistant that improves text extracted from video frames (via OCR) by making it more readable, coherent, and contextually relevant based on the video's topic.",
            },
            {
                role: "user",
                content: `Here is the OCR result extracted from a video frame:\n\n${ocrText}\n\nThe video context is:\n\n${videoContext}\n\nPlease rewrite the OCR result so that it is:\n- Grammatically correct\n- Easy to read\n- Aligned with the topic of the video\n- With unclear words intelligently inferred based on the video context\n\nReturn only the improved text.`,
            },
        ];

        // Send the message to the background script
        chrome.runtime.sendMessage({ type: "send-llm-request", prompt }, (response) => {
            console.log("LLM Response:", response);
            if (response && response.success) {
                // Hide the chat loading state
                DOMManager.removeSliderChatLoadingState();
                // Show the chat response
                DOMManager.addSliderChatMessage(response.result, "ai");
                // Update the chat context
                updateChatContext(getLastRequest(prompt), response.result);
            } else {
                // Hide the chat loading state
                DOMManager.removeSliderChatLoadingState();
                // Show the chat error
                DOMManager.addSliderChatMessage(response.error, "error");
            }
        });
    };

    const explainVideoOCRResultsForBeginners = async () => {
        DOMManager.addSliderChatMessage("Explain video OCR results", "user");

        // Show the chat loading state
        DOMManager.addSliderChatLoadingState();

        const videoContext = ConfigManager.get("context.videoContext");
        const ocrText = ConfigManager.getExtractedImageData().text;

        const prompt = [
            {
                role: "system",
                content:
                    "You are a helpful assistant who explains technical video content in simple, beginner-friendly language. Use analogies or examples where helpful.",
            },
            {
                role: "user",
                content: `Here's some text extracted from a video frame:\n\n${ocrText}\n\nThe video is about:\n\n${videoContext}\n\nPlease explain the extracted text in a way that a complete beginner can understand. Break down complex terms, use everyday language, and relate it to the video context. Keep it short, friendly, and clear.`,
            },
        ];

        // Send the message to the background script
        chrome.runtime.sendMessage({ type: "send-llm-request", prompt }, (response) => {
            console.log("LLM Response:", response);
            if (response && response.success) {
                // Hide the chat loading state
                DOMManager.removeSliderChatLoadingState();
                // Show the chat response
                DOMManager.addSliderChatMessage(response.result, "ai");
                // Update the chat context
                updateChatContext(getLastRequest(prompt), response.result);
            } else {
                // Hide the chat loading state
                DOMManager.removeSliderChatLoadingState();
                // Show the chat error
                DOMManager.addSliderChatMessage(response.error, "error");
            }
        });
    };

    const translateVideoOCRResults = async (lang) => {
        DOMManager.addSliderChatMessage(`Translate video OCR results to ${lang}`, "user");

        // Show the chat loading state
        DOMManager.addSliderChatLoadingState();

        const videoContext = ConfigManager.get("context.videoContext");
        const ocrText = ConfigManager.getExtractedImageData().text;

        const prompt = [
            {
                role: "system",
                content:
                    "You are a professional translator with expertise in educational videos. Your job is to translate technical or domain-specific content into clear, simple language for beginners, using the video’s context to disambiguate unclear terms.",
            },
            {
                role: "user",
                content: `Here is the OCR result extracted from a video frame:\n\n${ocrText}\n\nThe video context is:\n\n${videoContext}\n\nTranslate the text into '${lang}' while ensuring:\n- Simplicity\n- Clarity\n- Contextual accuracy\n- Beginner-friendly language\n\nReturn only the translated version.`,
            },
        ];

        // Send the message to the background script
        chrome.runtime.sendMessage({ type: "send-llm-request", prompt }, (response) => {
            console.log("LLM Response:", response);
            if (response && response.success) {
                // Hide the chat loading state
                DOMManager.removeSliderChatLoadingState();
                // Show the chat response
                DOMManager.addSliderChatMessage(response.result, "ai");
                // Update the chat context
                updateChatContext(getLastRequest(prompt), response.result);
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
        generateVideoContext,
        improveVideoORCResults,
        explainVideoOCRResultsForBeginners,
        translateVideoOCRResults,
    };
})();

export default ChatService;
