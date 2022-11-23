import Combokeys from "combokeys";

import keyboardMappings from "./keyboard-mappings.js";

let instance;

function getInstance() {
  if (!instance) {
    instance = new Combokeys(document.body);
  }
  return instance;
}

export function merge(callbacks) {
  const inst = getInstance();
  Object.keys(callbacks).forEach((name) => {
    const keysHandler = callbacks[name];
    if (keysHandler) {
      inst.bind(keyboardMappings[name].binding, keysHandler);
    }
  });
}

export function reset() {
  const combokeys = getInstance();
  combokeys.reset();
}
