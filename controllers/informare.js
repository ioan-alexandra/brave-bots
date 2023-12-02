const path = require("path");
const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const {trimiteEmail} = require("./email");
const {populateFactura} = require("./factura");
const {trimiteSms} = require("./sms");
const fs = require("fs");
let lastFile = '';
let today = new Date();
let salut = " ziua";
if (today.getHours() >= 18) salut = " seara";

const informare = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/formInformare.html"));
};

const robot = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/formInformare.html"));

    const userInformare = {
        email: process.env.EMAIL_INFORMARE,
        password: process.env.PASSWORD_INFORMARE,
    };

    let info2 = {
        cui: req.body.cui,
        telefon: req.body.phone,
        email: req.body.email,
        certificat: "Informare O.N.R.C.",
        factura: req.body.factura,
        persFactura: req.body.persFactura,
        adresa: req.body.localitate,
        judet: req.body.judet,
        cuiFactura: req.body.cuiFactura,
        persFizica: req.body.persFizica,
        date: req.body.date,
        pret_vanzare_tva: "53.5500",
        pret_vanzare: "45.0000",
        solicitat: " solicitat ",
        tip_document: "",
        serie: "",
        cota_tva_ies: 19,
        serie_document: "DIANEXF",
        facturaName: "Intermediere Informare O.N.R.C. Taxa ONRC este inclusa",
    };

    if (!info2.cuiFactura) info2.cuiFactura = info2.cui;

    console.log(info2);

    let data = JSON.stringify({
        phone: "+4" + info2.telefon,
        shortTextMessage:
            "Buna" +
            salut +
            ", \n Informarea O.N.R.C. solicitata a fost livrata pe email. Va mai asteptam pe site www.dianex.ro",
        sendAsShort: true,
    });
    let dataError = JSON.stringify({
        phone: "+40721321348",
        shortTextMessage:
            "Informarea " +
            info2.cui +
            " pentru " +
            info2.email +
            " nu a fost trimisa.",
        sendAsShort: true,
    });

    puppeteer.use(
        RecaptchaPlugin({
            provider: {
                id: "2captcha",
                token: "5fef25e1868798f42897edf1418eeba4", // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
            },
            visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
        })
    );

    try {
        run2();
      } catch (e) {
        return console.log("Unable to finish process", e, "failed_send");
      }

    const getMostRecentFile = (dir) => {
        const files = orderRecentFiles(dir);
        return files.length ? files[0] : undefined;
    };

    const orderRecentFiles = (dir) => {
        return fs.readdirSync(dir)
            .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
            .map(file => ({file, mtime: fs.lstatSync(path.join(dir, file)).mtime}))
            .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    };

    lastFile = getMostRecentFile(path.resolve(__dirname, '../informari')).file

    async function run2() {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
        });
        page = await browser.newPage();
        page.setDefaultTimeout(1000 * 60 * 5);

        await page.goto(
            "https://portal.onrc.ro/ONRCPortalWeb/appmanager/myONRC/recom?_nfpb=true&_windowLabel=RecomPortlet&_urlType=render&wlpRecomPortlet__wuview=%2FONRCPortalWeb%2Fappmanager%2FmyONRC%2Frecom%2F%3Fwicket%3AbookmarkablePage%3D%3Acom.romsys.onrc.portal.recom.furnizare.web.FurnizareInformatiiSearchPage#wlp_RecomPortlet"
        );

        await page.evaluate((userInformare) => {
            document.getElementById("u").value = userInformare.email;
            document.getElementById("p").value = userInformare.password;
            document.getElementById("loginForm").submit();
        }, userInformare);

        await page.waitForNavigation();

        try {
            await addCUI();
        } catch (e) {
            console.log("Unable to create request", e, "failed_request");
        }

        try {
            await downloadCert();
            let message =
                "Bună ziua<br><br>Atașat la prezentul email aveți Informarea O.N.R.C. solicitata prin intermediul formularului de comandă." +
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

            await page.waitFor(7000);
            let newLast = getMostRecentFile(path.resolve(__dirname, '../informari')).file;

            let mailOptions = {
                from: "Comanda " + info2.certificat + " <online@dianex.ro>",
                to: `${info2.email}, "online@dianex.ro"`,
                subject: "Comanda " + info2.certificat + " " + info2.email,
                text: "Buna ziua,",
                html: message,
                attachments: [
                    {
                        filename: newLast,
                        path: path.resolve(__dirname, '../informari') + "\\" + newLast,
                    },
                ],
            };
            console.log(lastFile, newLast)

            if (newLast != lastFile) {
                if (trimiteEmail(mailOptions, dataError)) {
                    if (info2.factura == "OP") {
                        info2.serie = "5121.06";
                        info2.tip_document = "Ordin de plata";
                    } else if (info2.factura == "CARD") {
                        info2.serie = "5125.02";
                        info2.tip_document = "Card bancar";
                    }
                    populateFactura(info2, data);
                }
            }
            browser.close();

        } catch (e) {
            try {
                await page.reload({
                    waitUntil: ["networkidle0", "domcontentloaded"],
                });
                let links = await downloadCert();

                const response = {
                    certLink: links,
                };

                return response;
            } catch (e) {
                return console.log(
                    "Unable to download certificate",
                    e,
                    "failed_download"
                );
            }
        }

        async function downloadCert() {
            await page.waitForFunction(function () {
                return (
                    window["jQuery"] && jQuery('span:contains("Download")').length == 1
                );
            });

            await page._client.send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: path.resolve(__dirname, '../informari'),
            });

            page.waitFor(5000);

            await page.evaluate(function () {
                const cui = document.querySelector("button[id=idRecomPortlet__44]");
                console.log(cui)
                cui.click();
            });
        }

        async function addCUI() {
            const isCaptcha = await page.evaluate(function () {
                return document
                    .querySelector("body")
                    .innerText.includes("Verificare utilizator uman");
            });

            if (isCaptcha) {
                console.log("Face recaptcha");
                await page.solveRecaptchas();
                await page.evaluate(function () {
                    jQuery('span:contains("Valideaza")').click();
                });
                await page.waitForNavigation();
            }

            await page.waitForSelector("legend");
            await page.waitForFunction(function () {
                return jQuery('legend:contains("Firma")').click();
            });

            await page.waitForSelector("input[class=input_357]");
            await page.evaluate((info2) => {
                const cui = document.querySelector(".input_357");
                cui.value = info2.cui;
            }, info2);

            await page.waitForSelector("button[name=btnSearch]");
            await searchCUI();
        }

        async function searchCUI() {
            await page.evaluate(function () {
                const cui = document.querySelector("button[name=btnSearch]");
                cui.click();
            });
            await addCompany();
        }

        async function addCompany() {
            await page.waitFor(5000);

            let t = await page.evaluate(function (info2) {
                return $(`p:contains(${info2.cui})`)
                    .closest("td")
                    .next()
                    .find('p:not(:contains("- radiată"))')
                    .closest("td")
                    .prev()
                    .prev()
                    .prev()
                    .find("input[type=checkbox]").length;
            }, info2);

            await page.evaluate(function (info2) {
                $(`p:contains(${info2.cui})`)
                    .closest("td")
                    .next()
                    .find('p:not(:contains("- radiată"))')
                    .closest("td")
                    .prev()
                    .prev()
                    .prev()
                    .find("input[type=checkbox]")
                    .click();
            }, info2);

            await page.evaluate(function () {
                jQuery('span:contains("Adaugare in lot firme")').first().click();
            });

            await page.waitFor(4000);

            let x = await page.evaluate(function (info2) {
                return $(`p:contains(${info2.cui})`)
                    .closest("td")
                    .next()
                    .find('p:not(:contains("- radiată"))')
                    .closest("td")
                    .prev()
                    .prev()
                    .find("input[type=checkbox]").length;
            }, info2);

            await page.evaluate(function (info2) {
                $(`p:contains(${info2.cui})`)
                    .closest("td")
                    .next()
                    .find('p:not(:contains("- radiată"))')
                    .closest("td")
                    .prev()
                    .prev()
                    .find("input[type=checkbox]")
                    .click();
            }, info2);

            await typeStep();
        }

        async function typeStep() {
            await page.waitFor(5000);

            await page.evaluate(function () {
                const cui = document.querySelector("button[name=furnizareInformatii]");
                cui.click();
            });
            await confirmStep();
        }
    }

    async function confirmStep() {
        await page.waitFor(6000);

        await page.evaluate(function () {
            const cui = document.querySelector("button[name=furnizareInformatiiPDF]");
            cui.click();
        });
    }
};

module.exports = {
    getInformare: informare,
    sendInformare: robot
};