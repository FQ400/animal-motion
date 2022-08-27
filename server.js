const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const port = 8080;

const app = express()

app.use(express.static('.'))

app.post('/store-image', bodyParser.json(), function (req, res) {
  const image = req.body.data.split(';base64,')[1];
  const now = new Date().toISOString().replaceAll(':', '-').split('.')[0];
  const filePath = `store/image-${now}.jpeg`;
  if (image) {
    fs.writeFile(filePath, image, {encoding: 'base64'}, function (err) {
      if(err) {
        console.log(err);
      }
      console.log(`${filePath} created`);
    });
  }
  return res.send('Ok');

});

app.get('/preview', function(req, res){
  fs.readdir(`${__dirname}/store`, (err, files) => {
    const filteredFiles = files.filter((file) => file.includes('image'));
    const reversedFiles = filteredFiles.reverse();
    const last10Files = reversedFiles.slice(0,25);
    const getHtmlImage = (file) => `<img alt="${file}" src="./store/${file}" width="640" height="320"/>`

    return res.send(`<html><body>${last10Files.map(getHtmlImage).join('')}</body></html>`);
  });
});
app.listen(port)
