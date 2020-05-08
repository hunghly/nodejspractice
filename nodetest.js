/*
let http = require('http');
let moment = require('moment');
let $ = require('jquery');

function serverCallback(req, res) {
    let begin_time = moment('10:00', 'HH:mm');
    let end_time = moment('18:00', 'HH:mm');

    let message = 'Hello ' + process.argv[2] + '!\n';
    let begin_difference =  begin_time.diff(moment(), 'minutes');
    let end_difference = end_time.diff(moment(), 'minutes');
    console.log(begin_difference);
    console.log(end_difference);
    let diffMessage = '';
    // too early
    if (begin_difference > 0) {
        diffMessage+= 'Please come back in ' + begin_difference + ' minutes';
    }
    // too late
    else if (end_difference < 0) {
        diffMessage+= 'You are too late, come back tomorrow';
    }
    else {
        diffMessage+= 'Welcome to the store!'
    }
        res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write(`
    Hello Zenva!
    Welcome to our page.
    Now, it is ${moment().format('LT')}
    Our business hours is from ${begin_time.format('HH:mm')} to ${end_time.format('HH:mm')}.
    ${diffMessage}
    `);
    console.log('current date: ' + moment().format('dddd'));
    console.log($);
    res.end('Hello ' + process.argv[2] + '. it is ' + moment().format() + ' now');
}

http.createServer(serverCallback).listen(8080);
*/

var http = require('http');
var request = require('request');
var fs = require('fs');

var request_body = undefined;
var html_content = undefined;

function createHtmlStringFromJSON(retrievedData) {
    let body_begin_index = html_content.indexOf('<body>');
    let body_end_index = html_content.indexOf('</body>');

    let string_until_body = html_content.slice(0, body_begin_index + 6);
    console.log(string_until_body.toString());
    let string_from_body = html_content.slice(body_end_index);
    let html_string = '<table>\n';
    html_string += '<tr>\n';
    for (var attribute in retrievedData[0]) {
        if (typeof retrievedData[0][attribute] !== 'object') {
            html_string += "<td>" + attribute + "</td>\n";
        }
    }
    html_string += "</tr>\n";

    retrievedData.forEach(function(object) {
        html_string += '<tr>\n';
        for (var attribute in object) {
            if (typeof object[attribute] !== 'object') {
                html_string += '<td>' + object[attribute] + '</td>\n';
            }
        }
        html_string += "</tr>\n";
    });
    html_string += "</table>";
    return string_until_body + html_string + string_from_body;
}

request('https://www.bnefoodtrucks.com.au/api/1/trucks',
    function(err, request_res, body) {
        request_body = body;
    });

http.createServer(function(req, res) {
    if (request_body && html_content) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(createHtmlStringFromJSON(JSON.parse(request_body)));
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("Nothing retrieved yet");
    }
}).listen(8080);

fs.readFile('./index.html', function(err, html) {
    if (err) {
        throw err;
    } else {
        html_content = html;
    }
})

