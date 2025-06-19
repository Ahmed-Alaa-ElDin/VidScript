// In popup.js
let currentResults = {};
let videoId = null;

// Load initial data when popup opens
document.addEventListener("DOMContentLoaded", async () => {
    await getYouTubeVideoId();
    await loadInitialResults();
    setupStorageListener();
    setupDeleteListeners();
});

// Helper to extract video ID
async function getYouTubeVideoId() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab && tab.url) {
            try {
                const urlObj = new URL(tab.url);
                if (urlObj.hostname.includes("youtube.com")) {
                    videoId = urlObj.searchParams.get("v");
                }
                if (urlObj.hostname === "youtu.be") {
                    videoId = urlObj.pathname.slice(1); // Remove leading slash
                }
            } catch (e) {
                console.error("Invalid URL");
            }
        } else {
            videoId = null;
        }
    });
}

async function loadInitialResults() {
    try {
        const result = await chrome.storage.local.get("vidscript_results");
        currentResults = result.vidscript_results || {};

        let videoResults = currentResults[videoId] || {};

        updatePopupUI(videoResults);
    } catch (error) {
        console.error("Error loading initial results:", error);
    }
}

function setupStorageListener() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === "local" && changes.vidscript_results) {
            currentResults = changes.vidscript_results.newValue[videoId] || {};
            updatePopupUI(currentResults);
        }
    });
}

function setupDeleteListeners() {
    document.addEventListener("click", (event) => {
        console.log(event.target);
        if (event.target.classList.contains("vidscript-popup-body-results-item-delete")) {
            deleteResult(event.target.dataset.key);
        }
    });

    document.getElementById("vidscript-popup-body-clear-results").addEventListener("click", () => {
        clearResults();
    });
}

function clearResults() {
    chrome.storage.local.set({ "vidscript_results": {} });
    updatePopupUI({ results: {} });
}

function updatePopupUI(currentResults) {
    const resultCount = Object.keys(currentResults.results).length;
    const resultsCount = `${resultCount} result${resultCount === 1 ? "" : "s"}`;
    document.getElementById("vidscript-popup-header-results-count").textContent = resultsCount;

    const resultsList = document.getElementById("vidscript-popup-body-results");
    resultsList.innerHTML = "";
    if (Object.keys(currentResults.results).length === 0) {
        resultsList.innerHTML = "<li class='vidscript-popup-body-results-item vidscript-popup-body-results-item-empty'>No results found</li>";
    } else {
        // Sort results by currentTime lowest to highest
        Object.entries(currentResults.results).sort((a, b) => a[1].currentTime - b[1].currentTime).forEach(([key, value]) => {
            const li = document.createElement("li");
            li.className = "vidscript-popup-body-results-item";
            li.innerHTML = /*html*/ `
                <div class="vidscript-popup-body-results-item-content">
                    <img src="${
                        value.dataUrl
                    }" alt="Result Image" class="vidscript-popup-body-results-item-image">
                    <div class="vidscript-popup-body-results-item-info">
                        <div class="vidscript-popup-body-results-item-description">
                            ${
                                value.text
                                    ? `<div>
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 18H3M17 6H3m18 6H3"/></svg></span>
                                <span class="vidscript-popup-body-results-item-text">${value.text}</span>
                            </div>`
                                    : ""
                            }

                            <div>
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock w-4 h-4 text-gray-500" data-lov-id="src/components/ChromeExtensionPopup.tsx:244:30" data-lov-name="Clock" data-component-path="src/components/ChromeExtensionPopup.tsx" data-component-line="244" data-component-file="ChromeExtensionPopup.tsx" data-component-name="Clock" data-component-content="%7B%22className%22%3A%22w-4%20h-4%20text-gray-500%22%7D"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span>
                                <span>${formatTime(value.currentTime)}</span>
                            </div>

                            <div>
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m6 18l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-.85-2H20V4H4v13.125zM4 16V4zm3-2h6q.425 0 .713-.288T14 13t-.288-.712T13 12H7q-.425 0-.712.288T6 13t.288.713T7 14m0-3h10q.425 0 .713-.288T18 10t-.288-.712T17 9H7q-.425 0-.712.288T6 10t.288.713T7 11m0-3h10q.425 0 .713-.288T18 7t-.288-.712T17 6H7q-.425 0-.712.288T6 7t.288.713T7 8"/></svg></span>
                                <span>${value.chat.length}</span>
                            </div>
                        </div>
                        <span class="vidscript-popup-body-results-item-delete" data-key="${key}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            `;
            resultsList.appendChild(li);
        });
    }
}

function formatTime(time) {
    const date = new Date(0);
    date.setSeconds(time);
    return date.toISOString().substring(11, 19);
}

function deleteResult(key) {
    chrome.storage.local.get("vidscript_results", (result) => {
        const results = result.vidscript_results || {};
        const videoResults = results[videoId] || {};
        delete videoResults.results[key];
        chrome.storage.local.set({ vidscript_results: results });
    });
}
