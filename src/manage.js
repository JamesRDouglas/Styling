$(function() {
  function onChange() { /*console.log("changed");*/ }
  function onError(error) { console.log(`Error: ${error}`); }
  browser.storage.local.get().then(function(item) {
    $('textarea').text(item.stylish_1.code);
  });
  $('#update').click(function() {
    var stylingCode = { value: document.getElementById("code").value };
    browser.storage.local.set({ stylish_1: { code: stylingCode } }).then(onChange, onError); 
  });
});