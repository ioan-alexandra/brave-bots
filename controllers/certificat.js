const path = require("path");
const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const { trimiteEmail } = require("../controllers/email");
const { populateFactura } = require("../controllers/factura");

let today = new Date();
let salut = " ziua";
if (today.getHours() >= 18) salut = " seara";

let companyName = "DIANEX SERV SRL";
let page;

const card = {
  number: process.env.NUMBER,
  name: process.env.NAME,
  month: process.env.MONTH,
  year: process.env.YEAR,
  cvv: process.env.CVV,
  email: process.env.EMAIL,
};

const certificat = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/form.html"));

  const user = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  };

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
    cota_tva_ies: 19,
    solicitat: " solicitat ",
    tip_document: "",
    serie: "",
    serie_document: "DIANEXF",
    sms: "Certificatul Constatator solicitat a fost livrat pe email. Verificati si in SPAM. Va mai asteptam pe www.dianex.ro.",
    facturaName: "Intermediere Certificat Constatator. Taxa ONRC este inclusa",
  };

  if (!info.cuiFactura) info.cuiFactura = info.cui;
 console.log(req.body);
  if (info.certificat == "Furnizare informatii") {
    info.subtip = "Informare";
    info.pret_vanzare_tva = "64.0000";
    info.pret_vanzare = "53.7800";
    info.solicitat = " solicitata ";
    info.facturaName =
      "Intermediere Furnizare Informatii. Taxa ONRC este inclusa";
    info.sms =
      "Furnizarea de Informatii solicitata a fost livrata pe email. Verificati si in SPAM. Va mai asteptam pe www.dianex.ro.";
  } else if (info.certificat == "Certificat constatator de bază") {
    info.subtip = req.body.certBaza;
  } else if (info.certificat == "Certificat constatator fonduri IMM") {
    info.subtip = req.body.certIMM;
  } else if (info.certificat == "Certificat constatator pentru insolvență") {
    info.subtip = req.body.certIns;
  } else if (info.certificat == "Informare") {
    info.pret_vanzare_tva = "53.5500";
    info.pret_vanzare = "45.0000";
    info.facturaName = "Intermediere Informare O.N.R.C. Taxa ONRC este inclusa";
    info.sms =
      "Informarea O.N.R.C. solicitata a fost livrata pe email. Verificati si in SPAM. Va mai asteptam pe www.dianex.ro.";
    info.solicitat = " solicitata ";
  }

  console.log(info);

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

  puppeteer.use(
    RecaptchaPlugin({
      provider: {
        id: "2captcha",
        token: "5fef25e1868798f42897edf1418eeba4", // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
      },
      visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
    })
  );

  run();
  
  async function run() {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    page = await browser.newPage();
    page.setDefaultTimeout(1000 * 60 * 5);

    await page.goto(
      "https://portal.onrc.ro/ONRCPortalWeb/appmanager/myONRC/public?_nfpb=true&_pageLabel=login#wlp_login"
    );
    await page.evaluate((user) => {
      document.getElementById("u").value = user.email;
      document.getElementById("p").value = user.password;
      document.getElementById("loginForm").submit();
    }, user);

    await page.waitForNavigation();
    await page.waitForFunction(function () {
      return document.getElementsByClassName("logout_button").length;
    });
    await page.goto(
      "https://portal.onrc.ro/ONRCPortalWeb/appmanager/myONRC/wicket?p=rc.certificateConstatatoare"
    );
    await page.evaluate(() => {
      jQuery("form a")[0].click();
    });
    await page.waitForNavigation();

    try {
      await accord();
    } catch (e) {
      console.log("Unable to create request", e, "failed_request");
    }

    try {
      let certificat = await downloadCert();
      let mesaj =
        "Bună" +
        salut +
        ",<br><br>Atașat la prezentul email aveți " +
        info.certificat +
        info.solicitat +
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
        attachments: [
          {
            path: certificat,
          },
        ],
      };
      if (trimiteEmail(mailOptions, dataError)) {
        browser.close();
        if (info.factura === "OP") {
          info.serie = "5121.06";
          info.tip_document = "Ordin de plata";
        } else if (info.factura === "CARD") {
          info.serie = "5125.02";
          info.tip_document = "Card bancar";
        }
        populateFactura(info, data);
      }
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
          window["jQuery"] &&
          jQuery('td:contains("Document")')
            .parent()
            .find('td:contains("Descarca (pdf)")').length == 1
        );
      });

      let certLink = await page.evaluate(
        function () {
          return jQuery('td:contains("Document")')
            .parent()
            .find('td:contains("Descarca (pdf)")')
            .last()
            .find("a")
            .attr("href");
        },
        {
          timeout: 10 * 60 * 1000,
        }
      );

      const baseURL = "https://portal.onrc.ro";

      certLink = `${baseURL}/${certLink}`;

      return certLink;
    }

    async function accord() {
      await page.waitForFunction(function () {
        return (
          window["jQuery"] &&
          jQuery("form a")[0] &&
          jQuery("form a")[0].text === "Am fost informat"
        );
      });

      await page.evaluate(() => {
        jQuery("form a")[0].click();
      });

      await page.waitForNavigation();
      await selectProfile();
    }

    async function selectProfile() {
      let handles = await page.$$(".btn-copy");
      await handles[0].click();

      await page.waitForNavigation();
      await page.waitForFunction(function () {
        return (
          window["jQuery"] && jQuery('span:contains("Pasul următor")').length
        );
      });
      await page.evaluate(function () {
        jQuery('span:contains("Pasul următor")').first().click();
      });

      await page.waitForNavigation();
      await page.waitForFunction(function () {
        return (
          window["jQuery"] && jQuery('span:contains("Firmă solicitată")').length
        );
      });
      await addCompany();
    }

    async function addCompany() {
      page.evaluate(function (info) {
        jQuery(
          'input[name="__page_3:container:cautareFirmaPanel:form:cuiField"]'
        ).val(info.cui);
        jQuery('span:contains("Caută")').closest("button").click();
      }, info);

      await page.waitFor(2000);
      const isCaptcha = await page.evaluate(function () {
        return document
          .querySelector("body")
          .innerText.includes("Verificare operator uman");
      });

      if (isCaptcha) {
        await page.solveRecaptchas();
        await page.evaluate(function () {
          jQuery('span:contains("Confirma")').click();
        });
        await page.waitForNavigation();
        page.evaluate(function (info) {
          jQuery(
            'input[name="__page_3:container:cautareFirmaPanel:form:cuiField"]'
          ).val(info.cui);
          jQuery('span:contains("Caută")').closest("button").click();
        }, info);
      }

      await page.waitForFunction(
        function (info) {
          return (
            window["jQuery"] &&
            jQuery(`span:contains('${info.cui}')`)
              .closest("td")
              .next()
              .next()
              .find('span:not(:contains("radiată"))')
              .closest("tr")
              .find(".btn-plus").length
          );
        },
        {},
        info
      );

      await page.evaluate(function (info) {
        jQuery(`span:contains('${info.cui}')`)
          .closest("td")
          .next()
          .next()
          .find('span:not(:contains("radiată"))')
          .closest("tr")
          .find(".btn-plus")
          .click();
      }, info);

      await page.waitForFunction(
        function (info) {
          return (
            window["jQuery"] &&
            jQuery(`span:contains('${info.cui}')`)
              .closest("tr")
              .find(".btn-delete").length
          );
        },
        {},
        info
      );

      await page.evaluate(function () {
        jQuery('span:contains("Pasul următor")').first().click();
      });
      await typeStep();
    }

    async function typeStep() {
      await page.waitForFunction(function () {
        return (
          window["jQuery"] &&
          jQuery('td:contains("--- Alegeţi o opţiune ---")').length == 2
        );
      });
      await page.evaluate(function (info) {
        jQuery(`.selectbox div.text:contains("${info.certificat}")`)
          .first("li")
          .click();
      }, info);

      await page.waitForFunction(
        function (info) {
          return (
            window["jQuery"] &&
            jQuery(`.selectbox div.text:contains('${info.subtip}')`).length
          );
        },
        {},
        info
      );

      await page.evaluate(function (info) {
        jQuery(`.selectbox div.text:contains('${info.subtip}')`)
          .first("li")
          .click();
        jQuery('span:contains("Pasul următor")').first().click();
      }, info);

      await page.waitForNavigation();
      await confirmStep();
    }
  }

  async function confirmStep() {
    await page.waitForFunction(function () {
      return (
        window["jQuery"] &&
        jQuery('span:contains("Transmitere solicitare")').length
      );
    });
    await page.evaluate(function () {
      jQuery('span:contains("Transmitere solicitare")').eq(0).trigger("click");
    });
    await page.waitForNavigation();
    await page.waitForFunction(function () {
      return window["jQuery"] && jQuery('span:contains("Plata online")').length;
    });

    await page.evaluate(function () {
      jQuery('span:contains("Plata online")').click();
    });
    await page.waitForNavigation();
    await page.evaluate((companyName) => {
      jQuery(`span:contains("${companyName}")`)
        .closest("tr")
        .find(".btn-copy")
        .click();
    }, companyName);
    await page.waitForNavigation();

    await payment();
  }

  async function payment() {
    await page.waitForFunction(function () {
      return window["jQuery"] && jQuery('span:contains("Plătește")').length;
    });
    await page.evaluate(function () {
      jQuery('span:contains("Plătește")').click();
    });
    await page.waitForNavigation();

    await page.waitForFunction(function () {
      return (
        window["jQuery"] && jQuery('span:contains("Plătește Online")').length
      );
    });
    await page.evaluate(function () {
      jQuery('span:contains("Plătește Online")').click();
    });
    await page.waitForNavigation();

    await page.waitForFunction(function () {
      return document.getElementById("consent");
    });
    await page.waitFor(7000);

    await page.evaluate(function (card) {
      document.getElementById("consent").checked = true;
      document.getElementById("exp_month").value = card.month;
      document.getElementById("exp_year").value = card.year;
      document.getElementById("card").value = card.number;
      document.getElementById("name_on_card").value = card.name;
      document.getElementById("cvv2").value = card.cvv;
      document.getElementById("email").value = card.email;
      //document.getElementById('button_status').click();
    }, card);
    await page.waitFor(7000);

    await page.$eval("#button_status", (el) => el.click());

    await page.waitForNavigation();

    await page.waitForFunction(function () {
      return document.getElementsByClassName("f-title");
    });

    const isVerificare = await page.evaluate(function () {
      return document.getElementsByClassName("f-title").length;
    });

    console.log("Verificare:" + isVerificare);

    if (isVerificare) {
      await page.waitFor(() => !document.querySelector(".f-title"));

      console.log("passed verification");

      await page.waitForNavigation();

      await page.waitFor(5000);

      await page.waitFor(
        () => !document.querySelector("#visa-sensory-branding")
      );

      await page.waitFor(() => !document.querySelector(".mesaj"));

      await page.waitFor(5000);

      let isLogin = await page.evaluate(() => {
        let el = document.getElementById("loginForm");
        return el ? el.length : "";
      });

      console.log("Logare:" + isLogin);
      await page.waitFor(3000);

      if (isLogin) {
        await page.evaluate((user) => {
          document.getElementById("u").value = user.email;
          document.getElementById("p").value = user.password;
          document.getElementById("loginForm").submit();
        }, user);

        await page.waitForNavigation();
        await page.waitForFunction(function () {
          return document.getElementsByClassName("logout_button").length;
        });
      }
    }
    await page.waitForFunction(
      function () {
        return window["jQuery"] && jQuery('a:contains("AICI")').length;
      },
      {
        timeout: 10 * 60 * 1000,
      }
    ); // TODO: raise timeout back to 10 * 60 * 1000 (60 hours)

    await page.evaluate(function (card) {
      jQuery('a:contains("AICI")')[0].click();
    }, card);

    await page.waitForNavigation();
  }
};

const robot = (req, res) => {
  return res.sendFile(path.join(__dirname, "../views/form.html"));
};

module.exports = {
  getCertificat: robot,
  sendCertificat: certificat,
};
