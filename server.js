const http = require('http');
const https = require('https');
const port = 3500;

const url = 'https://time.com';

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/getTimeStories') {
        https.get(url, (response) => {
            let data = '';
            response.on('data',(chunk) => {
                data +=  chunk;
            });
            response.on('end', () => {
                const latestAllStories = parseHTML(data);
                const latestStories = latestAllStories.slice(0, 6);

                res.write("[\n");
                latestStories.forEach((story) => {
                    res.write(JSON.stringify(story, null, 2) + '\n');
                });
                res.write("]");

                res.end();
            });
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function parseHTML(html){
    const latestStories = [];
    const regex = /<li class="latest-stories__item">\s*<a href="([^"]+)">\s*<h3 class="latest-stories__item-headline">([^<]+)<\/h3>/g;
    let match;
    while((match = regex.exec(html)) !== null){
            latestStories.push({
                title: match[2],
                link: match[1],
            });
    }
    return latestStories;
}