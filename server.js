const http = require('http');
const handler = require('serve-handler');
const port = 8080;
const fs = require('fs')

http.createServer((req, res) => {
  if(req.url === '/store-image' && req.method === 'POST') {
    let data = [];

    req.on('data', (chunk) => {
      data.push(chunk);
    });

    req.on('end', () => {
      const base64String = data.join().toString();
      const image = base64String.split(';base64,')[1];
      const now = new Date().toISOString().replaceAll(':','-').split('.')[0];
      const filePath = `store/image-${now}.jpeg`;

      fs.writeFile(filePath, image, {encoding: 'base64'}, function(err) {
        console.log(`${filePath} created`);
      });
    });

  } else {
    return handler(req, res);
  }
}).listen(port, () => {
  console.log(`App is running on port ${port}`);
});
