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
        const elems = Array.from(cop.animatedElems);
        respond(formatElements(elems));
        console.info("Animation Cop found animated elements:");
        console.info(elems);
        cop = null;
      }
      break;
    }
  }
});
