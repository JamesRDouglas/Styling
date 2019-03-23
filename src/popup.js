$(function() {
  /*if (`${item.disabled.state}` == true) {
    $('img').prop("src", "../images/StylingDisabled.png");
  } else {
    $('img').prop("src", "../images/Styling.png");
  }*/
  function onGot(item) { console.log(item); }
  function onError(error) { console.log(`Error: ${error}`); }
  $.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
  var disabled = { state: "false" };
  $('#disable').click(function() {
    if ($(this).is(':checked')) {
      $('img').prop("src", "../images/StylingDisabled.png");
      disabled = { state: "true" };
      browser.browserAction.setIcon({path: "../images/StylingDisabled.png"});
      browser.storage.local.set({disabled}).then(onGot, onError);
    } else {
      $('img').prop("src", "../images/Styling.png");
      disabled = { state: "false" };
      browser.browserAction.setIcon({path: "../images/Styling.png"});
      browser.storage.local.set({disabled}).then(onGot, onError);
    }
  });
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url:"manage.html" }).then(onGot, onError); });
  $('#details').click(function() { browser.tabs.create({ url:"manage.html" }).then(onGot, onError); });
});