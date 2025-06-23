# VidScript — YouTube Video Text Extraction & AI Assistant Extension

VidScript is a powerful Chrome extension that empowers users to capture frames from YouTube videos, extract embedded text (slides, handwriting, screen text), and interact with the extracted content using advanced AI tools for summarization, translation, and explanation. Built for learners, researchers, and content consumers, VidScript turns passive watching into active learning.

🔍 Features

* 🎬 Frame Capture: Instantly capture a paused frame from a YouTube video.
* 🖼️ Region Selection: Choose between full-frame, rectangle, or freehand selection to extract specific areas.
* 🧠 OCR Extraction: Extract readable text from screenshots using OCR.space API.
* 💡 Text Visualization: Overlay extracted words exactly where they appear on the video frame.
* 🧑‍🏫 AI Integration:

  * Improve: Fix OCR typos and structure the text based on context.
  * Explain: Get a simplified explanation of complex content.
  * Translate: Translate extracted content with automatic RTL/LTR layout detection.
  * Chat: Ask follow-up questions with contextual awareness.
* 📋 Clipboard & Sharing:

  * Copy extracted or AI-generated text.
  * Share to Facebook, Telegram, WhatsApp, X (Twitter), and more.
* 🧠 Video Context Awareness:

  * Uses video title, description, and keywords for better AI responses.
* 💾 Save & Reload:

  * Save OCR results with timestamps and reload anytime via extension popup.
* 📤 Export & Import:

  * Export extracted sessions as Markdown, PDF, or JSON.
  * Re-import them to resume work across devices.
* 📚 Productivity Integration (Planned):

  * Export to Notion, Obsidian, or other note-taking apps.

🚀 Getting Started

1. Clone this repository:

git clone [https://github.com/yourusername/vidscript.git](https://github.com/yourusername/vidscript.git)

2. Install dependencies:

npm install

3. Build the extension:

npm run build

4. Load into Chrome:

* Go to chrome://extensions
* Enable Developer Mode
* Click Load Unpacked
* Select the dist folder from the project

💡 Tech Stack

* Manifest V3 (Chrome Extensions)
* JavaScript (Vanilla + ES6 Modules)
* OCR.space API for text extraction
* Cohere LLM API for AI chat
* Highlight.js + Marked.js for markdown formatting
* Vite for bundling

🛠 Project Structure

src/
├── background.js          # Handles OCR and AI API calls
├── content.js             # Injected into YouTube pages
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic and UI rendering
├── styles.css             # Global styles
├── utils/                 # OCR, drawing, storage utils
├── assets/                # Icons and logos
└── manifest.json          # Chrome extension manifest

📦 Build Commands

* npm run dev — Build with watch mode
* npm run build — Production build to dist/

🔐 Permissions

This extension requires:

* activeTab: To access video content
* scripting: To inject overlay and tools
* storage: To save session data locally
* host\_permissions: For YouTube, OCR, and Cohere APIs

🔒 Privacy & Security

VidScript does not collect or share personal data. All frame captures and extractions are performed locally, and data is only sent to OCR.space or Cohere when needed. See the full Privacy Policy here.

🧪 Testing

* Manual tests with different types of YouTube content (slides, handwriting, software tutorials, etc.)
* Edge case handling: No video ID, no frame, incorrect OCR, offline mode
* Performance: Smooth overlays, fast image processing

📄 Documentation

* Full user guide: /docs/UserManual.pdf
* Developer setup instructions: /docs/DevGuide.md
* Master's thesis documentation: /docs/ThesisFinal.pdf

📍 Future Roadmap

* Offline OCR support with Tesseract.js
* Full support for Firefox and Edge
* Productivity platform integration (Notion, Obsidian, Google Docs)
* AI study guide generation and video summarization
* Cloud sync and collaboration features

🙋‍♀️ Support & Feedback

For issues, suggestions, or questions:

* GitHub Issues: [https://github.com/yourusername/vidscript/issues](https://github.com/yourusername/vidscript/issues)
* Email: [ahmedalaaaldin100@gmail.com](mailto:ahmedalaaaldin100@gmail.com)

🧠 Author

Ahmed Alaa Eldin
Master’s Degree Candidate – Computer Science
Supervised by \[Your Supervisor Name Here]
Faculty of Computers and Information, \[Your University]

📄 License

This project is licensed under the MIT License. See LICENSE for details.