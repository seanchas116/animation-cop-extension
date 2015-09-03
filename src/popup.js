const $ = require("jquery");

function getCurrentTab() {
  return new Promise(resolve => {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
      resolve(tabs[0]);
    });
  });
}

async function sendMessage(msg, callback) {
  const tab = await getCurrentTab();
  chrome.tabs.sendMessage(tab.id, msg, callback);
}

document.addEventListener("DOMContentLoaded", () => {

  const $startButton = $("#button-start");
  const $stopButton = $("#button-stop");
  const $resultArea = $("#result");

  function startDetecting() {
    sendMessage("start");
  }

  function stopDetecting() {
    sendMessage("stop", updateResult);
  }

  function updateResult(elems) {
    $resultArea.empty();
    for (const elem of elems) {
      $resultArea.append($(`<li>${elem}</li>`));
    }
  }

  $startButton.on("click", startDetecting);
  $stopButton.on("click", stopDetecting);

  chrome.runtime.onMessage.addListener(elems => {
    updateResult(elems);
  });
});
