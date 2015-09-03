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

  const $button = $("#button");
  const $resultArea = $("#result");
  let detecting = false;

  function startDetecting() {
    sendMessage("start");
  }

  function stopDetecting() {
    sendMessage("stop", updateResult);
  }

  function toggleDetecting() {
    detecting = !detecting;
    if (detecting) {
      $button.text("Stop");
      startDetecting();
    } else {
      $button.text("Start");
      stopDetecting();
    }
  }

  function updateResult(elems) {
    $resultArea.empty();
    for (const elem of elems) {
      var $elem = $("<li></li>").text(elem);
      $resultArea.append($elem);
    }
    if (elems.length === 0) {
      $resultArea.append($("<li>No animated elements found.</li>"))
    }
  }

  $button.on("click", toggleDetecting);

  chrome.runtime.onMessage.addListener(elems => {
    updateResult(elems);
  });
});
