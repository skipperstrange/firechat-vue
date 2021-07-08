const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const cors = require("cors"),
  app = express();
app.use(cors());
app.use(serveStatic(path.join(__dirname, "dist")));
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`app is listening on port: ${port}`);
