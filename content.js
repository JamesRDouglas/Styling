let prefs;

class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(eventType, listener) {
    if (typeof listener !== 'function') {
      return;
    }
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).add(listener);
    } else {
      this.listeners.set(eventType, new Set([listener]));
    }
  }

  off(eventType, listener) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).delete(listener);
    }
  }

  emit(eventType, ...data) {
    const listener = this.listeners.get(eventType);
    listener.forEach(fn => fn(...data));
  }
}

const events = new EventEmitter();

function shareObjectsWithPageScript() {
  const DH5A = {
    prefs,
    on: events.on.bind(events),
  };
  window.wrappedJSObject.DH5A = cloneInto(DH5A, window, { cloneFunctions: true });
}

function injectScript() {
  const domain = window.location.hostname;
  const script = document.createElement('script');
  script.src = browser.extension.getURL(`js/inject.js`);
  document.documentElement.appendChild(script);
}

function bgScriptMessageHandler(message) {
  if (message.msg === 'domain-prefs-changed') {
    events.emit('prefs-changed', message.prefName, message.value);
  }
}

async function init() {
  prefs = await browser.runtime.sendMessage({ msg: 'content-script-loaded' });
  shareObjectsWithPageScript();
  injectScript();
  browser.runtime.onMessage.addListener(bgScriptMessageHandler);
}

init().catch(e => console.log(e));
