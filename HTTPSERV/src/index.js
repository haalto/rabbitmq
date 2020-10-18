import http from "http";
import fs from 'fs';
const PORT = 8080;
const FILENAME = '../../data/data.txt';
http
  .createServer(async (req, res) => {
    try {
      fs.readFile(FILENAME, 'utf8', (err, data) => {
        if (err) throw err;
        res.end(data);
      })

    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.end("Server error 500");
    }
  })
  .listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });