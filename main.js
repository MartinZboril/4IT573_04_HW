import http from 'http';
import fs from 'fs';

const filePath = './counter.txt';

function modifyCounter(operation) {
    fs.readFile(filePath, (err, data) => {
        let currentCount = 0;
        if (!err) {
            currentCount = parseInt(data);
        }

        if (operation === 'increase') {
            currentCount++;
        } else if (operation === 'decrease') {
            currentCount--;
        }

        fs.writeFile(filePath, currentCount.toString(), (err) => {
            if (err) {
                console.log('Error writing file', err);
            }
        });
    });
}

function readCounter(callback) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            callback('0');
        } else {
            callback(data);
        }
    });
}

const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/increase':
            modifyCounter('increase');
            res.end('OK');
            break;
        case '/decrease':
            modifyCounter('decrease');
            res.end('OK');
            break;
        case '/read':
            readCounter((count) => {
                res.end(count);
            });
            break;
        default:
            res.writeHead(404);
            res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
