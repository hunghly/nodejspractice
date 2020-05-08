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
