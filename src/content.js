const AnimationCop = require("animation-cop");

let cop;

function formatElements(elems) {
  return elems.map(elem => {
    return [
      elem.tagName.toLowerCase(),
      ...elem.className.split(" ").map(c => `.${c}`),
      `#${elem.id}`
    ].join("");
  });
}

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  switch (msg) {
    case "start": {
      cop = new AnimationCop();
      cop.start();
      break;
    }
    case "stop": {
      if (cop) {
        cop.stop();
        const elems = formatElements(Array.from(cop.animatedElems));
        respond(elems);
        cop = null;
      }
      break;
    }
  }
});
