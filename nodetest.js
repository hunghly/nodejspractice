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
var csv = require('csv');
var url = require('url');
var create_html = require('./create_html.js');
var update_log = require('./update_log.js');

var json_request_body = undefined;
var csv_request_body = undefined;
var html_content = undefined;



setInterval(function() {
    request('https://www.bnefoodtrucks.com.au/api/1/trucks',
        function(err, request_res, body) {
            json_request_body = body;
        });
    console.log('requesting json data');
}, 2000);



// https://www.data.brisbane.qld.gov.au/data/dataset/1e11bcdd-fab1-4ec5-b671-396fd1e6dd70/resource/3c972b8e-9340-4b6d-8c7b-2ed988aa3343/download/public-art-open-data-2020-01-09.csv

setInterval(function() {
    request('https://www.data.brisbane.qld.gov.au/data/dataset/1e11bcdd-fab1-4ec5-b671-396fd1e6dd70/resource/3c972b8e-9340-4b6d-8c7b-2ed988aa3343/download/public-art-open-data-2020-01-09.csv',
        function(err, request_res, body) {
            csv.parse(body, function(err, data) {
                // console.log(data);
                csv_request_body = data;
            });
            // request_body = body;
        });
    console.log('requesting csv data');
}, 2000);

http.createServer(function(req, res) {
    if (json_request_body && csv_request_body && html_content) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var request_url = url.parse(req.url);
        console.log(request_url.path);
        switch (request_url.path) {
            case '/json':
                update_log.updateLogFile('Accessed JSON data');
                res.end(create_html.createHtmlStringFromJSON(html_content, JSON.parse(json_request_body)));
                break;
            case '/csv':
                update_log.updateLogFile('Accessed CSV data');
                res.end(create_html.createHtmlStringFromCsv(html_content, csv_request_body));
                break;
        }
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

