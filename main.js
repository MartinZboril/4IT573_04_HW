import http from 'http';
import fs from 'fs/promises';

const filePath = 'counter.txt';

async function modifyCounter(operation) {
    let currentCount = 0;
    try {
        const data = await fs.readFile(filePath);
        currentCount = parseInt(data, 10);
    } catch (err) {
        console.log('File not found, starting with 0');
    }

    if (operation === 'increase') {
        currentCount++;
    } else if (operation === 'decrease') {
        currentCount--;
    }

    await fs.writeFile(filePath, currentCount.toString());
}

async function readCounter() {
    try {
        return await fs.readFile(filePath);
    } catch (err) {
        return '0';
    }
}

const server = http.createServer(async (req, res) => {
    try {
        switch (req.url) {
            case '/increase':
                await modifyCounter('increase');
                res.end('OK');
                break;
            case '/decrease':
                await modifyCounter('decrease');
                res.end('OK');
                break;
            case '/read':
                const count = await readCounter();
                res.end(count);
                break;
            default:
                res.writeHead(404);
                res.end('Not Found');
        }
    } catch (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});