let powerButton = document.getElementById("powerButton");
let hijriButton = document.getElementById("hijriButton");
let gregorianButton = document.getElementById("gregorianButton");

chrome.storage.sync.get(["power", "conversion_type"], function(result) {

    if (result.power === "on") {
        powerButton.checked = true;
    } else {
        powerButton.checked = false;
    }

    if (result.conversion_type === "hijri") {
        hijriButton.checked = true;
    } else {
        gregorianButton.checked = true;
    }
});



powerButton.addEventListener('change', function () {
    if (this.checked) {
        chrome.storage.sync.set({"power": "on"});
    } else {
        chrome.storage.sync.set({"power": "off"});
    }
});

hijriButton.addEventListener('change', function () {
    if (this.checked) {
        chrome.storage.sync.set({"conversion_type": "hijri"});
    }
});

gregorianButton.addEventListener('change', function () {
    if (this.checked) {
        chrome.storage.sync.set({"conversion_type": "gregorian"});
    }
});