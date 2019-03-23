$(function() {
  /*if (`${item.disabled.state}` == true) {
    $('img').prop("src", "../images/StylingDisabled.png");
  } else {
    $('img').prop("src", "../images/Styling.png");
  }*/
  $.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
  var disabled = { state: false };
  $('#disable').click(function() {
    if ($(this).is(':checked')) {
      $('img').prop("src", "../images/StylingDisabled.png");
      disabled = { state: true };
      browser.browserAction.setIcon({path: "../images/StylingDisabled.png"});
      browser.storage.local.set({disabled}).then(onCreated, onError);
    } else {
      $('img').prop("src", "../images/Styling.png");
      disabled = { state: false };
      browser.browserAction.setIcon({path: "../images/Styling.png"});
      browser.storage.local.set({disabled}).then(onCreated, onError);
    }
  });
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url:"manage.html" }).then(onCreated, onError); });
  $('#details').click(function() { browser.tabs.create({ url:"manage.html" }).then(onCreated, onError); });
  alert(`${item.disabled.state}`);
});