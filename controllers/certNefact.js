const path = require("path");
const {trimiteEmail} = require("./email");
const {populateFactura} = require("./factura");

let today = new Date();
let salut = " ziua";
if (today.getHours() >= 18) salut = " seara";

const certificatNefacut = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/formCertificat.html"));
};

const robot = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/formCertificat.html"));

    let info = {
        cui: req.body.cui,
        telefon: req.body.phone,
        email: req.body.email,
        certificat: req.body.certificat,
        subtip: "",
        factura: req.body.factura,
        persFactura: req.body.persFactura,
        adresa: req.body.localitate,
        judet: req.body.judet,
        cuiFactura: req.body.cuiFactura,
        persFizica: req.body.persFizica,
        date: req.body.date,
        pret_vanzare_tva: "94.0000",
        pret_vanzare: "78.9900",
        solicitat: " solicitat ",
        tip_document: "",
        cota_tva_ies: 19,
        serie: "",
        serie_document: "DIANEXF",
        sms: "Certificatul Constatator solicitat a fost livrat pe email. Verificati si in SPAM. Va mai asteptam pe www.dianex.ro.",
        facturaName: "Intermediere Certificat Constatator. Taxa ONRC este inclusa",
    };

    if (!info.cuiFactura) info.cuiFactura = info.cui;

    if (info.certificat === "Furnizare Informatii") {
        info.subtip = "Informare";
        info.pret_vanzare_tva = "64.0000";
        info.pret_vanzare = "53.7800";
        info.solicitat = " solicitata ";
        info.facturaName = "Intermediere Furnizare Informatii. Taxa ONRC este inclusa";
        info.sms = "Furnizarea de Informatii solicitata a fost livrata pe email. Verificati si in SPAM. Va mai asteptam pe www.dianex.ro.";
    } else if (info.certificat === "Informare") {
        info.pret_vanzare_tva = "53.5500";
        info.pret_vanzare = "45.0000";
        info.facturaName = "Intermediere Informare O.N.R.C. Taxa ONRC este inclusa";
        info.sms = "Informarea O.N.R.C. solicitata a fost livrata pe email. Verificati si in SPAM. Va mai asteptam pe www.dianex.ro.";
        info.solicitat = " solicitata ";
    }

    let data = JSON.stringify({
        phone: "+4" + info.telefon,
        shortTextMessage: "Buna" + salut + ", \n" + info.sms,
        sendAsShort: true,
    });

    let dataError = JSON.stringify({
        phone: "+40721321348",
        shortTextMessage:
            info.certificat +
            info.cui +
            " pentru " +
            info.email +
            " nu a fost trimis.",
        sendAsShort: true,
    });

    console.log(info);

    let attachments = [];
    for (let i = 0; i < req.files.length; i++) {
        attachments.push({
            filename: req.files[i].originalname,
            path: req.files[i].path,
        });
    }
    console.log(attachments);

    try {
        let mesaj = "Bună" + salut + ",<br><br>Atașat la prezentul email aveți " + info.certificat + info.solicitat +
            "prin intermediul formularului de comandă. Documentul este semnat electronic de către Registrul Comerțului (O.N.R.C.)." +
            '<br><br>In cel mai scurt timp veti primi si factura fiscala pentru documentul eliberat.<br> <br>Pentru comenzi viitoare folosiți acest <a href="https://www.dianex.ro/certificat-constatator-online/" target="_blank"> link </a>și veți economisi timp.<br>Suntem specializați și autorizați pentru servicii 100% online: <ul>' +
            '<li><a href="https://www.dianex.ro/cod-eori-comanda-online/" target="_blank">Cod EORI RO și GB</a></li>' +
            '<li><a href="https://www.dianex.ro/infiintare-pfa/" target="_blank">Înființare PFA</a> și <a href="https://www.dianex.ro/pasi-infiintare-srl/" target="_blank">SRL</a></li>' +
            '<li><a href="https://www.dianex.ro/modificari-firma/" target="_blank">Modificări Firmă</a> la Registrul Comerțului</li>' +
            '<li><a href="https://www.dianex.ro/contabilitate-pfa/" target="_blank">Contabilitate PFA</a> și SRL</li>' +
            '<li><a href="https://www.dianex.ro/extras-carte-funciara-online-de-la-ancpi/" target="_blank">Extras Carte Funciară</a></li>' +
            "</ul>" +
            "Cu stimă,<br>" +
            "Elena<br>" +
            "0730 072 337<br>" +
            '<a href="https://www.dianex.ro" target="_blank" rel="noopener">www.dianex.ro</a><br>' +
            '<img width="200" src="https://www.dianex.ro/logo.jpg" alt="dianex">';

        let mailOptions = {
            from: "Comanda " + info.certificat + " <online@dianex.ro>",
            to: `${info.email}, "online@dianex.ro"`,
            subject: "Comanda " + info.certificat + " " + info.email,
            text: "Buna ziua,",
            html: mesaj,
            attachments: attachments,
        };

        if (trimiteEmail(mailOptions, dataError)) {
            if (info.factura == "OP") {
                info.serie = "5121.06";
                info.tip_document = "Ordin de plata";
            } else if (info.factura == "CARD") {
                info.serie = "5125.02";
                info.tip_document = "Card bancar";
            }
            populateFactura(info, data);
        }

    } catch (e) {
        return console.log("Unable to send email", e, "failed_send");
    }
};


module.exports = {
    getCertificatNefacut: certificatNefacut,
    sendCertificatNefacut: robot
};