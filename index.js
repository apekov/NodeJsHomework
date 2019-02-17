const http = require('http');
const port = 3000;
require('dotenv').config();

const interval = Number(process.env.interval);
const timeout = Number(process.env.timeout);

const requestHandler = (request, response) => {
    response.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    })
    if (request.url !== '/favicon.ico') { 
        DateStand(interval, timeout).then(date => {
            response.end('date end: ' + date);
        });
    }
};

function DateStand(inter, time) {
    let logDate = setInterval(() => {
        let data = new Date();
        console.log(data.toString());
    }, inter);
    let datePromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            clearInterval(logDate);
            let data = new Date();
            let endDate = data.toString();
            resolve(endDate);
            console.log('end this seans');
        }, time);
    })
    return datePromise;
}

let app = http.createServer(requestHandler);

app.listen(port, (err) => {
    if (err) {
        console.error('Whats happened???');
    } else {
        console.log('app is listen ' + port);
    }
});