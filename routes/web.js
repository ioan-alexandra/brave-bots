const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const extrasController = require("../controllers/extras");
const certController = require("../controllers/certificat");
const informareController = require("../controllers/informare");
const eoriController = require("../controllers/eori");
const certNefactController = require("../controllers/certNefact");
const onrcController = require("../controllers/onrc");
const multer = require("multer");
const upload = multer({
    dest: "uploads/",
});

let routes = app => {
    router.get("/", homeController.getHome);

    router.get("/getExtras", extrasController.getExtras);

    router.get("/getCertificat", certController.getCertificat);

    router.get("/getInformare", informareController.getInformare);

    router.get("/getEORI", eoriController.getEORI);

    router.get("/getONRC", onrcController.getONRC);

    router.get("/getCertificatNefacut", certNefactController.getCertificatNefacut);

    router.post("/sendCertificat", certController.sendCertificat);

    router.post("/sendInformare", informareController.sendInformare);

    router.post("/sendExtras", upload.array("files"), extrasController.sendExtras);

    router.post("/sendEORI", upload.array("files"), eoriController.sendEORI);

    router.post("/sendCertificatNefacut", upload.array("files"), certNefactController.sendCertificatNefacut);

    router.post("/sendONRC", onrcController.sendONRC);

    return app.use("/", router);
};

module.exports = routes;