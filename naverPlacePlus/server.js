const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const { attachNaverRoutes } = require("./attachRoutes");

const app = express();
attachNaverRoutes(app);

const PORT = process.env.NAVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Naver local server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/naver/start`);
});
