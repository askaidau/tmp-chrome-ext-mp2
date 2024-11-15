import {rpx} from "./constants.js";

export const sync = ({tk}) => {
    fetch(rpx + "/order/" + tk).then(oresp => {
        oresp.json().then(ortd => {
            if (ortd.retCode) {
                let odr = {
                    code: ortd.data.code,
                    bdCnt: ortd.data.bdCnt,
                    expiryDate: ortd.data.expiryDate,
                    dlCnt: ortd.data.dlCnt,
                    mailbox: ortd.data.mailbox
                };
                chrome.storage.session.set({odr});
            } else {
                if (ortd.retMsg == "tokenIsInvalid") {
                    chrome.storage.local.remove(["tk"]);
                }
            }
        });
    });
    fetch(rpx + "/reqRule/" + tk).then(rs => {
        rs.json().then(rt => {
            if (rt.retCode) {
                chrome.declarativeNetRequest.getSessionRules().then((ors) => {
                    chrome.declarativeNetRequest.updateSessionRules({
                        removeRuleIds: ors.map(rl => rl.id), addRules: JSON.parse(rt.data)
                    });
                });
                chrome.storage.session.set({rrdy: rt.retCode});
            } else {
                if (rt.retMsg == "tokenIsInvalid") {
                    tk = undefined;
                    chrome.storage.local.set({tk});
                }
            }
        });
    });
    fetch(rpx + "/reqCode/" + tk).then(r => {
        r.json().then(rt => {
            if (rt.retCode) {
                let cd = rt.data;
                chrome.storage.session.set({cd});
            }
        });
    });
};