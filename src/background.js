var default_style = { name: "New style", id: 1, enabled: true, blocks: [ { code: "", urls: [ { address: "", type: "url" } ] } ], options: { line_count: 15, tab_size: 2, font_size: 11, autocomplete: true, error_marker: { enabled: true, errors: true, warnings: true, notes: false }, soft_tabs: true, guide_indent: false, show_invisible: false, keybinding: "default" } };
function onError(error) { console.log(error); }
function patchBrowserStorage(item) {
  if (item.disabled === undefined || item.latest === undefined) { item.disabled = false; item.latest = 1; browser.storage.local.set(item).catch(onError); }
  if (item.default === undefined || item.default.name === undefined || item.default.enabled === undefined || item.default.blocks === undefined || item.default.options === undefined) { item.default = default_style; browser.storage.local.set(item).catch(onError); }
  if (item.styles === undefined) { item.styles = [ ]; browser.storage.local.set(item).catch(onError); }
  if (item.styles[0] !== undefined && typeof item.styles[0].id === "string") { for (s = 0; s <= item.styles.length; s++) { if (s === item.styles.length) { browser.storage.local.set(item); break; } if (item.styles[s] !== undefined && typeof item.styles[s].id === "string") { item.styles[s].id = Number(item.styles[s].id); } } }
}
browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
  if (reason === "install") { item = { default: default_style, disabled: false, latest: 1, styles: [] }; browser.storage.local.set(item); }
});
document.addEventListener("DOMContentLoaded", function(event) {
  browser.storage.local.get(function(item) {
    patchBrowserStorage(item);
    if (item.disabled === true) { browser.browserAction.setIcon({path: "../images/StylingDisabled.png"}); } else { browser.browserAction.setIcon({path: "../images/Styling.png"}); }
  });
  browser.runtime.onMessage.addListener(function(message) { if (message.action === "patch storage") { patchBrowserStorage(); } });
});
