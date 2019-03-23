$(function() {
  function onChange() { /*console.log("changed");*/ }
  function onError(error) { console.log(`Error: ${error}`); }
  $('textarea').text(browser.storage.local.get().stylish_1.code);
  $('#update').click(function() {
    var stylingCode = { value: document.getElementById("code").value };
    browser.storage.local.set({ stylish_1: { code: stylingCode } }).then(onChange, onError); 
  });
});