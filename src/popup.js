$(function() {
  $.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
  $('#disable').click(function() {
    if ($(this).is(':checked')) {
      $('img').prop("src", "../images/StylingDisabled.png");
      browser.browserAction.setIcon({path: "../images/StylingDisabled.png"});
    } else {
      $('img').prop("src", "../images/Styling.png");
      browser.browserAction.setIcon({path: "../images/Styling.png"});
    }
  });
  $('img, label').click(function() { $('#disable').click(); });
  $('#manage').click(function() { browser.tabs.create({ url:"manage.html" }).then(onCreated, onError); });
  $('#details').click(function() { browser.tabs.create({ url:"manage.html" }).then(onCreated, onError); });
});