$(function() {
  /*if (`${item.disabled.state}` == true) {
    $('img').prop("src", "../images/StylingDisabled.png");
  } else {
    $('img').prop("src", "../images/Styling.png");
  }*/
  function onGot(item) { console.log(item); }
  function onChange() { console.log("changed"); }
  function onError(error) { console.log(`Error: ${error}`); }
  $.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
  console.log(browser.storage.local.get("disabled").then(onChange, onError));
  var disabled = { value: "false" };
  $('#disable').click(function() {
    if ($(this).is(':checked')) {
      $('img').prop("src", "../images/StylingDisabled.png");
      disabled = { value: "true" };
      browser.browserAction.setIcon({path: "../images/StylingDisabled.png"});
      browser.storage.local.set({disabled}).then(onChange, onError);
    } else {
      $('img').prop("src", "../images/Styling.png");
      disabled = { value: "false" };
      browser.browserAction.setIcon({path: "../images/Styling.png"});
      browser.storage.local.set({disabled}).then(onChange, onError);
    }
  });
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url:"manage.html" }).then(onChange, onError); });
  $('#details').click(function() { browser.tabs.create({ url:"manage.html" }).then(onChange, onError); });
});