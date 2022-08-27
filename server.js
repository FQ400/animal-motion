const http = require('http');
const handler = require('serve-handler');
const port = 8080;

http.createServer((req, res) => {
  return handler(req, res);
}).listen(port, () => {
  console.log(`App is running on port ${port}`);
});
