import {sync} from "./sync.js"

chrome.storage.local.get().then(({tk}) => {
    if (!tk) {
        return;
    }
    sync({tk});
});

chrome.runtime.onMessage.addListener(({cmd, data}, sender, sendResponse) => {
    switch (cmd) {
        case "_a":
            chrome.storage.session.get().then(({cd}) => {
                if (cd) {
                    chrome.tabs.sendMessage(sender.tab.id, {cmd: cd}, resp => {
                        if (resp.s) {
                            chrome.storage.session.set({crdy: true});
                        }
                    });
                }
            });
            return true;
    }
});