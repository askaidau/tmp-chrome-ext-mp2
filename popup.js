import {rpx} from "./constants.js"
import {sync} from "./sync.js"
import {smtm} from "./smtm.js"

let {tk} = await chrome.storage.local.get();
let {odr} = await chrome.storage.session.get();
$("#getBC").css("display", !tk ? "block" : "none");
$("body").css("background-color", tk ? "#c6fdbb" : "#e3b8aa");

//

//

//

$("#syncBtn").val(tk ? (odr ? "Reload" : "SyncNow") : "Binding").click(() => {
    if (tk) {
        if (odr) {
            chrome.tabs.query({active: true, currentWindow: true}, t => {
                if (t[0].url.indexOf("macromicro.me") != -1) {
                    chrome.tabs.reload(t[0].id);
                }
            });
        } else {
            sync({tk});
        }
    } else {
        if (!$("#code").val()) {
            alert("You can ask 'Jack Ma' for a binding code.")
            return;
        }
        $("#syncBtn").attr("disabled", true);
        fetch(rpx + "/binding/" + $("#code").val()).then(rs => {
            $("#syncBtn").attr("disabled", false);
            rs.json().then(rt => {
                if (rt.retCode) {
                    tk = rt.data;
                    chrome.storage.local.set({tk});
                    $("#getBC").css("display", !tk ? "block" : "none");
                    $("#syncBtn").val(tk ? "SyncNow" : "Binding").click();
                }
                alert(rt.retMsg);
            });
        }).catch(err => {
            alert("network err, close ur vpn and try again.")
            $("#syncBtn").attr("disabled", false);
        });
    }
});

$("#regMail").val("Save").click(() => {
    let mailbox = $("#mailbox").val();
    mailbox = mailbox ? mailbox : "NULL";
    fetch(rpx + "/regMail/" + tk + "/" + mailbox).then(r => {
        r.json().then(rt => {
            if (rt.retCode) {
                alert("ok");
                odr.mailbox = mailbox;
                chrome.storage.session.set({odr});
            } else {
                alert(rt.retMsg);
            }
        });
    });
});

//

//

//

function roi() {
    chrome.storage.session.get().then(({odr}) => {
        $("#orderInfo").css('display', odr ? 'block' : 'none');
        if (odr) {
            if (!$("#mailbox").is(":focus")) {
                $("#mailbox").val(odr.mailbox);
            }
            $("#order").text("OrderNO : " + odr.code);
            $("#bdCnt").text("BindingCnt : " + odr.bdCnt);
            $("#expiryDate").text("ExpiredAt : " + odr.expiryDate);
            $("#dlCnt").text("DownloadCnt : " + odr.dlCnt);
        }
    });
}

roi();
$("body").everyTime("5s", roi);

//

//

//

function rdc() {
    $("#cdl").empty();
    chrome.storage.session.get().then(({crdy}) => {
        if (crdy) {
            smtm({cmd: "rcd()"});
        }
    });
}

rdc();
$("body").everyTime("5s", rdc);

//

//

//

chrome.runtime.onMessage.addListener(({cmd, data}, sender, sendResponse) => {
    switch (cmd) {
        case "rcdcb":
            for (const i in data) {
                let a = $("<a href='#'>").text(data[i]).click(function () {
                    smtm({cmd: "dcd('" + i + "', '" + rpx + "/countdown/" + tk + "')"}, resp => {
                        odr.dlCnt--;
                        chrome.storage.session.set({odr});
                    });
                }).css("margin-top", "20px").css("cursor", "pointer");
                $("#cdl").append(a).append("<br/>");
            }
            return true;
    }
});