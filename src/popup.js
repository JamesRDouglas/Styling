$(function() {
  if (`${item.disabled}` == true) {
    $('img').prop("src", "../images/StylingDisabled.png");
  } else {
    $('img').prop("src", "../images/Styling.png");
  }
  $.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
  var disabled = false;
  $('#disable').click(function() {
    if ($(this).is(':checked')) {
      $('img').prop("src", "../images/StylingDisabled.png");
      disabled = true;
      browser.browserAction.setIcon({path: "../images/StylingDisabled.png"});
      browser.storage.local.set({disabled});
    } else {
      $('img').prop("src", "../images/Styling.png");
      disabled = false;
      browser.browserAction.setIcon({path: "../images/Styling.png"});
      browser.storage.local.set({disabled});
    }
  });
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url:"manage.html" }).then(onCreated, onError); });
  $('#details').click(function() { browser.tabs.create({ url:"manage.html" }).then(onCreated, onError); });
});