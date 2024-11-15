const smtm = function(m, c) {
    chrome.tabs.query({active: true, currentWindow: true}, t => {
        if (!t[0].url || t[0].url.indexOf("macromicro.me") == -1) {
            return;
        }
        chrome.tabs.sendMessage(t[0].id, m, c);
    });
};
export {smtm}