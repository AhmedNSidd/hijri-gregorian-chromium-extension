// background.js

let default_power = "on";
let default_conversion_type = "hijri";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        "power": default_power,
        "conversion_type": default_conversion_type
    });
});