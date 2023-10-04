const express = require("express");
const fileUpload = require("express-fileupload");
const server = express();
const routes = require("./routes/index");
const next = require("next");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const dotenv = require("dotenv").config();

const dev = dotenv.parsed.NODE_ENV !== "production";
const hostname = dotenv.parsed.HOSTNAME;
const port = dotenv.parsed.PORT;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  server.use(logger("dev"));
  server.use(cookieParser());
  server.use(cors({ origin: true }));
  server.use(express.static(path.join(__dirname, "../public")));
  server.use(express.json({ limit: "50mb" }));
  server.use(express.urlencoded({ limit: "50mb", extended: true }));
  server.use(fileUpload());

  server.use("/api", routes);

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
