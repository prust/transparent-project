function transparency(data) {
  return ['<html>',
    '<head>',
    '<link href="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/css/bootstrap-combined.min.css" rel="stylesheet">',
    '<style>',
    '  table { width: 100%;}',
    '  td { width: 50%;}',
    '  .success { color: green;}',
    '  .warning { color: #faa732;}',
    '  .danger { color: red;}',
    '</style>',
    '</head>',
    '<body>',
    '  <table class="table table-striped table-bordered"><tbody>',
    genRows(data),
    '  </tbody></table>',
    '</body>',
    '</html>'].join('\n');
}

function genRows(data) {
  var html = [];
  for (var date in data) {
    html.push('<tr><td colspan="2">' + date + '</td></tr>');
    html.push('<tr>');

    html.push(genHoursCell(data[date].hours));
    html.push(genGoalCell(data[date].goals));
    html.push('</tr>');
  }
  return html.join('\n');
}

function genHoursCell(hours) {
  var hours_html = '';
  for (var category in hours) {      
    var total_hours = sum(hours[category].map(function(time_entry) {
      return getTimeDiff(time_entry[0], time_entry[1]);
    }));
    total_hours = Math.round(total_hours * 10) / 10;

    if (category == 'Writing') {
      var css_class;
      if (total_hours >= 3)
        css_class = 'success';
      else if (total_hours >= 2)
        css_class = 'warning';
      else
        css_class = 'danger';
      hours_html += '<strong class="' + css_class + '">';
    }

    hours_html += category + ': ' + total_hours;
    if (category == 'Writing')
      hours_html += '</strong>';
    hours_html += '<br>';
  }
  return '<td>' + hours_html + '</td>';
}

var time_re = /^(\d\d?):(\d\d)(am|pm)$/i;
function getTimeDiff(start, end) {
  var hrs_diff = (toMin(end) - toMin(start)) / 60;

  // .1 precision (like `.toFixed(1)` but this returns a float)
  return Math.round(hrs_diff * 10) / 10;
}

function toMin(time_str) {
  var match = time_re.exec(time_str);
  if (!match) throw new Error('Invalid time: "' + time_str + '"');
  var hrs = parseInt(match[1], 10);
  var min = parseInt(match[2], 10);
  if (hrs != 12 && match[3].toLowerCase() == 'pm')
    hrs += 12;
  return hrs * 60 + min;
}


function genGoalCell(goals) {
  var goal_html = '';
  for (var goal in goals) {
    var progress = goals[goal];
    goal_html += goal + ': ' + progress[0] + '% <i class="icon-arrow-right"></i> ' + progress[1] + '%<br>';
  }
  return '<td>' + goal_html + '</td>';
}

function sum(arr) {
  var total = 0;
  var num_items = arr.length;
  for (var i = 0; i < num_items; ++i)
    total += arr[i];
  return total;
}

module.exports = transparency;