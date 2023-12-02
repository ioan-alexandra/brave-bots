const express = require("express");
const app = express();
const http = require("http");
let server = http.createServer(app);
let corsOptions = {
    origin: "https://84.232.142.71:3031/api",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const initRoutes = require("./routes/web");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const multer = require("multer");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/static", express.static("./static/"));
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(limiter);

app.use(bodyParser.json());

initRoutes(app);


server.listen(3000, function () {
    console.log("Server listening on port: http://localhost:3000");
});
