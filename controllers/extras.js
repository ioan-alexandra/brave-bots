const path = require("path");
const {trimiteEmail} = require("./email");
const {populateFactura} = require("./factura");

let today = new Date();
let salut = " ziua";
if (today.getHours() >= 18) salut = " seara";

const extras = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/formExtras.html"));
};

const robot = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/formExtras.html"));
    let infoExtras = {
        cuiFactura: req.body.cuiFactura,
        telefon: req.body.phone,
        email: req.body.email,
        factura: req.body.factura,
        persFizica: req.body.persFizica,
        adresa: req.body.localitate,
        judet: req.body.judet,
        persFactura: req.body.persFactura,
        tipExtras: req.body.tipExtras,
        date: req.body.date,
        mesaj: "",
        text: "",
        subject: "",
        facturaName: "",
        serie: "",
        cota_tva_ies: 19,
        serie_document: "DIANEXF",
        tip_document: "",
        pret_vanzare: "48.0000",
        pret_vanzare_tva: "57.1200"
    };

    let attachments = [];

    if (infoExtras.tipExtras != "Lipsa Imobil") {
        for (let i = 0; i < req.files.length; i++) {
            attachments.push({
                filename: req.files[i].originalname,
                path: req.files[i].path,
            });
        }
    }

    if (infoExtras.factura == "OP") {
        infoExtras.serie = "5121.06";
        infoExtras.tip_document = "Ordin de plata";
    } else if (infoExtras.factura == "CARD") {
        infoExtras.serie = "5125.03";
        infoExtras.tip_document = "Card bancar";
    }

    if (infoExtras.tipExtras == "Carte Funciara") {
        infoExtras.facturaName =
            "Intermediere Extras Carte Funciara. Taxa ANCPI este inclusa";
        infoExtras.subject = "Comanda Extras Carte Funciara " + infoExtras.email;
        infoExtras.mesaj =
            "Buna" +
            salut +
            "\n" +
            "Extrasul de Carte Funciara solicitat a fost livrat pe email. Verificati si in SPAM. Va mai asteptam pe www.dianex.ro";
        infoExtras.text =
            "<p>Bună" +
            salut +
            ',<br /><br />Atașat la prezentul email aveți Extrasul de Carte Funciara solicitat prin intermediul formularului de comandă. Documentul este eliberat de către Agentia Nationala de Cadastru si Publicitate Imobiliara (A.N.C.P.I.).<br><br>In cel mai scurt timp veti primi si factura fiscala pentru documentul eliberat.<br><br>Pentru comenzi viitoare folosiți acest&nbsp;<a href="https://www.dianex.ro/extras-carte-funciara-online-de-la-ancpi/" target="_blank" rel="noopener">link</a>&nbsp;și veți economisi timp.</div></p>' +
            "Suntem specializați și autorizați pentru servicii 100% online:<ul>" +
            '  <li><a href="https://www.dianex.ro/cod-eori-comanda-online/" target="_blank" rel="noopener" >Cod EORI RO și GB</a></li>' +
            '  <li><a href="https://www.dianex.ro/infiintare-pfa/" target="_blank" rel="noopener" >Infiintare PFA</a>&nbsp;și&nbsp;<a href="https://www.dianex.ro/pasi-infiintare-srl/" target="_blank" rel="noopener">SRL</a></li>' +
            '  <li><a href="https://www.dianex.ro/modificari-firma/" target="_blank" rel="noopener" >Modificări Firmă</a>&nbsp;la Registrul Comerțului</li>' +
            ' <li><a href="https://www.dianex.ro/contabilitate-pfa/" target="_blank" rel="noopener" >Contabilitate PFA</a>&nbsp;și SRL</li>' +
            ' <li><a href="https://www.dianex.ro/certificat-constatator-online/" target="_blank" rel="noopener" >Certificat Constatator ONRC</a></li> </ul>' +
            " Cu stimă,<br>" +
            " Elena<br>" +
            "0730 072 337<br>" +
            '<a href="https://www.dianex.ro" target="_blank" rel="noopener">www.dianex.ro</a><br>' +
            ' <img width="200" src="https://www.dianex.ro/logo.jpg" alt="dianex">' +
            '<p className="MsoNormal"><span style="font-family:Calibri,sans-serif"><b><font color="#000000">Procesam datele personale confrom</font>&nbsp;' +
            '<a href="https://dianex.ro/prelucrarea-datelor-cu-caracter-personal" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://dianex.ro/prelucrarea-datelor-cu-caracter-personal&amp;source=gmail&amp;ust=1643651989477000&amp;usg=AOvVaw3KvYowOSkS0aaLmiruPYyo">Politicii de prelucrare date personale Dianex</a>.</b></span>&nbsp; <br></p>' +
            '<p className="MsoNormal">Acest mesaj contine informatii confidentiale sau privilegiate legal care sunt' +
            "utilizabile doar de catre destinatarii de drept ai acestui mesaj. Aceste informatii sunt protejate prin lege" +
            "împotriva divulgării, orice dezvăluire, diseminare, distribuire, copiere sau orice alta acțiune legată de" +
            "informațiile din acest mesaj fiind interzisă.<br>Desi&nbsp;<b>Dianex</b>&nbsp;întreprinde toate demersurile" +
            "necesare pentru securizarea comunicarilor, e-mailurile nu sunt un mijloc de comunicare sigur, pot fi" +
            "interceptate, trunchiate sau pot conține virusi. Oricine comunică cu noi prin acest mijloc o face" +
            "acceptând aceste riscuri.<br>Dacă nu sunteți destinatarul acestui mesaj sau reprezentantul acestuia, vă" +
            "rugăm să-l inștiințați imediat pe expeditor prin e-mail și apoi să ștergeți definitiv acest mesaj și" +
            "toate atașamentele din sistemul dumneavoastră.<br>Dacă nu doriti sa mai primiti mesaje de la aceasta" +
            "adresa de e-mail, va rog sa ne comunicati acest lucru printr-un reply la acest mesaj.</p>";
    } else if (infoExtras.tipExtras == "Plan Cadastral") {
        infoExtras.facturaName =
            "Intermediere Extras Plan Cadastral. Taxa ANCPI este inclusa";
        infoExtras.subject =
            "Comandă Extras din Planul Cadastral, pe ORTOFOTOPLAN " +
            infoExtras.email;
        infoExtras.mesaj =
            "Buna" +
            salut +
            "\n" +
            "Extrasul de Plan Cadastral solicitat a fost livrat pe email. Verificati si in SPAM. Va mai asteptam pe www.dianex.ro";

        infoExtras.text =
            "<p>Bună" +
            salut +
            ',<br />Atașat la prezentul email aveți Extrasul de Plan Cadastral solicitat prin intermediul formularului de comandă. Documentul este eliberat de către Agentia Nationala de Cadastru si Publicitate Imobiliara (A.N.C.P.I.).<br>În cel mai scurt timp veți primi pe email factura fiscală electronică pentru documentul comandat.<br><br>Pentru comenzi viitoare folosiți acest&nbsp;<a href="https://www.dianex.ro/extras-carte-funciara-online-de-la-ancpi/" target="_blank" rel="noopener">link</a>&nbsp;și veți economisi timp.</div></p>' +
            "Suntem specializați și autorizați pentru servicii 100% online:<ul>" +
            '  <li><a href="https://www.dianex.ro/cod-eori-comanda-online/" target="_blank" rel="noopener" >Cod EORI RO și GB</a></li>' +
            '  <li><a href="https://www.dianex.ro/infiintare-pfa/" target="_blank" rel="noopener" >Infiintare PFA</a>&nbsp;și&nbsp;<a href="https://www.dianex.ro/pasi-infiintare-srl/" target="_blank" rel="noopener">SRL</a></li>' +
            '  <li><a href="https://www.dianex.ro/modificari-firma/" target="_blank" rel="noopener" >Modificări Firmă</a>&nbsp;la Registrul Comerțului</li>' +
            ' <li><a href="https://www.dianex.ro/contabilitate-pfa/" target="_blank" rel="noopener" >Contabilitate PFA</a>&nbsp;și SRL</li>' +
            ' <li><a href="https://www.dianex.ro/certificat-constatator-online/" target="_blank" rel="noopener" >Certificat Constatator ONRC</a></li> </ul>' +
            "Cu stimă,<br>" +
            "Elena<br>" +
            "0730 072 337<br>" +
            '<a href="https://www.dianex.ro" target="_blank" rel="noopener">www.dianex.ro</a><br>' +
            '<img width="200" src="https://www.dianex.ro/logo.jpg" alt="dianex">' +
            '<p className="MsoNormal"><span style="font-family:Calibri,sans-serif"><b><font color="#000000">Procesam datele personale confrom</font>&nbsp;' +
            '<a href="https://dianex.ro/prelucrarea-datelor-cu-caracter-personal" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://dianex.ro/prelucrarea-datelor-cu-caracter-personal&amp;source=gmail&amp;ust=1643651989477000&amp;usg=AOvVaw3KvYowOSkS0aaLmiruPYyo">Politicii de prelucrare date personale Dianex</a>.</b></span>&nbsp; <br></p>' +
            '<p className="MsoNormal">Acest mesaj contine informatii confidentiale sau privilegiate legal care sunt' +
            "utilizabile doar de catre destinatarii de drept ai acestui mesaj. Aceste informatii sunt protejate prin lege" +
            "împotriva divulgării, orice dezvăluire, diseminare, distribuire, copiere sau orice alta acțiune legată de" +
            "informațiile din acest mesaj fiind interzisă.<br>Desi&nbsp;<b>Dianex</b>&nbsp;întreprinde toate demersurile" +
            "necesare pentru securizarea comunicarilor, e-mailurile nu sunt un mijloc de comunicare sigur, pot fi" +
            "interceptate, trunchiate sau pot conține virusi. Oricine comunică cu noi prin acest mijloc o face" +
            "acceptând aceste riscuri.<br>Dacă nu sunteți destinatarul acestui mesaj sau reprezentantul acestuia, vă" +
            "rugăm să-l inștiințați imediat pe expeditor prin e-mail și apoi să ștergeți definitiv acest mesaj și" +
            "toate atașamentele din sistemul dumneavoastră.<br>Dacă nu doriti sa mai primiti mesaje de la aceasta" +
            "adresa de e-mail, va rog sa ne comunicati acest lucru printr-un reply la acest mesaj.</p>";
    }
    if (infoExtras.tipExtras == "Lipsa Imobil") {
        infoExtras.facturaName =
            "Intermediere Extras Plan Cadastral / Carte Funciara. Taxa ANCPI este inclusa";
        infoExtras.mesaj =
            "Buna" +
            salut +
            "\nImobilul introdus NU a fost identificat automat in baza de date ANCPI. Functionarii ANCPI vor începe procesul de conversie in format electronic. Termen minim 2 zile lucrătoare.";

        infoExtras.subject =
            "Imobilul introdus NU a fost identificat automat in baza de date ! " +
            infoExtras.email;
        infoExtras.text =
            "<p>Bună" +
            salut +
            ',<br /><p>Am făcut solicitarea și am platit taxa de eliberare la ANCPI.</p><p>În urma solicitării electronice către ANCPI a Extrasului de Carte Funciară / Plan Cadastral am primit următorul mesaj:</p><span style="font-family:&quot;Avenir LT W01 65 Medium&quot;,Arial,Helvetica,sans-serif;color:red"><i><b>Imobilul introdus NU a fost identificat automat in baza de date !</b></i></span><br><br>Funcționarii ANCPI vor începe procesul de conversie in format electronic a cărții funciare / planului cadastral solicitate, urmand sa primiti o notificare pe email cand acest proces va fi finalizat. <b> Procesul de conversie dureaza minim 2 zile lucrătoare. </b><br>În cel mai scurt timp veți primi pe email factura fiscală electronică pentru documentul comandat.' +
            "<br><br> Cu stimă,<br>" +
            " Elena<br>" +
            "0730 072 337<br>" +
            '<a href="https://www.dianex.ro" target="_blank" rel="noopener">www.dianex.ro</a><br>' +
            '<img width="200" src="https://www.dianex.ro/logo.jpg" alt="dianex">' +
            '<p className="MsoNormal"><span style="font-family:Calibri,sans-serif"><b><font color="#000000">Procesam datele personale confrom</font>&nbsp;' +
            '<a href="https://dianex.ro/prelucrarea-datelor-cu-caracter-personal" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://dianex.ro/prelucrarea-datelor-cu-caracter-personal&amp;source=gmail&amp;ust=1643651989477000&amp;usg=AOvVaw3KvYowOSkS0aaLmiruPYyo">Politicii de prelucrare date personale Dianex</a>.</b></span>&nbsp; <br></p>' +
            '<p className="MsoNormal">Acest mesaj contine informatii confidentiale sau privilegiate legal care sunt' +
            "utilizabile doar de catre destinatarii de drept ai acestui mesaj. Aceste informatii sunt protejate prin lege" +
            "împotriva divulgării, orice dezvăluire, diseminare, distribuire, copiere sau orice alta acțiune legată de" +
            "informațiile din acest mesaj fiind interzisă.<br>Desi&nbsp;<b>Dianex</b>&nbsp;întreprinde toate demersurile" +
            "necesare pentru securizarea comunicarilor, e-mailurile nu sunt un mijloc de comunicare sigur, pot fi" +
            "interceptate, trunchiate sau pot conține virusi. Oricine comunică cu noi prin acest mijloc o face" +
            "acceptând aceste riscuri.<br>Dacă nu sunteți destinatarul acestui mesaj sau reprezentantul acestuia, vă" +
            "rugăm să-l inștiințați imediat pe expeditor prin e-mail și apoi să ștergeți definitiv acest mesaj și" +
            "toate atașamentele din sistemul dumneavoastră.<br>Dacă nu doriti sa mai primiti mesaje de la aceasta" +
            "adresa de e-mail, va rog sa ne comunicati acest lucru printr-un reply la acest mesaj.</p>";
    }

    let data = JSON.stringify({
        phone: "+4" + infoExtras.telefon,
        shortTextMessage: infoExtras.mesaj,
        sendAsShort: true,
    });

    let dataError = JSON.stringify({
        phone: "+40721321348",
        shortTextMessage:
            "Extrasul pentru " + infoExtras.email + " nu a fost trimis.",
        sendAsShort: true,
    });

    try {
        let mailOptions = {};
        if (infoExtras.tipExtras == "Lipsa Imobil") {
            mailOptions = {
                from: "Extras Carte Funciara / Plan Cadastral <online@dianex.ro>",
                to: `${infoExtras.email}, "online@dianex.ro"`,
                subject: infoExtras.subject,
                text: "Buna ziua,",
                html: infoExtras.text,
            };
        } else {
            mailOptions = {
                from: "Extras Carte Funciara / Plan Cadastral <online@dianex.ro>",
                to: `${infoExtras.email}, "online@dianex.ro"`,
                subject: infoExtras.subject,
                text: "Buna ziua,",
                html: infoExtras.text,
                attachments: attachments,
            };
        }
        if (trimiteEmail(mailOptions, dataError)) {
            if (infoExtras.factura == "OP") {
                infoExtras.serie = "5121.06";
                infoExtras.tip_document = "Ordin de plata";
            } else if (infoExtras.factura == "CARD") {
                infoExtras.serie = "5125.02";
                infoExtras.tip_document = "Card bancar";
            }
            populateFactura(infoExtras, data);
        }
    } catch (e) {
        return console.log("Unable to send email", e, "failed_send");
    }
};

module.exports = {
    getExtras: extras,
    sendExtras: robot
};