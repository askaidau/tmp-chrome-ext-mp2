$.getScript(chrome.runtime.getURL("content-scripts/evalCore.umd.js"), function () {
    $.getScript(chrome.runtime.getURL("content-scripts/injected.js"), function () {
        chrome.runtime.sendMessage({cmd: "_a"});
    });
});

window.addEventListener("returning", ({detail}) => {
    chrome.runtime.sendMessage(detail);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    window.dispatchEvent(new CustomEvent("forwarding", {
        detail: request
    }));
    sendResponse({s: true});
});