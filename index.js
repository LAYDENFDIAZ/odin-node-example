const http = require('http');
const fs = require('fs');
const path = require('path');

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Construct the file path based on the URL
    let filePath = '.' + req.url;

    // Set the default file to index.html if the URL is '/'
    if (filePath === './') {
        filePath = './index.html';
    }

    // Get the file extension to determine the content type
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
    }[extname] || 'application/octet-stream';

    // Read the file and respond with its content or handle errors
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // If the file is not found, serve the 404.html page
            if (err.code === 'ENOENT') {
                fs.readFile('./404.html', (err, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                // Internal server error for other errors
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            // Serve the file with the appropriate content type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8080;

// Set the server to listen on port 8080
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
