$(function() {
  $.getJSON('../manifest.json', function(data) { $('#version').text(data.version); });
  $('#disable').click(function() {
    if ($(this).is(':checked')) {
      $('img').prop("src", "../StylingDisabled.png");
    } else {
      $('img').prop("src", "../Styling.png");
    }
  });
  $('img').click(function() { $('#disable').click(); });
});