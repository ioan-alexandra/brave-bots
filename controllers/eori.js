const path = require("path");
const {trimiteEmail} = require("./email");
const {populateFactura} = require("./factura");
const {trimiteSms} = require("./sms");

let today = new Date();
let salut = " ziua";
if (today.getHours() >= 18) salut = " seara";

const eori = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/formEORI.html"));
};

const robot = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/formEORI.html"));

    let info = {
        cuiFactura: req.body.cuiFactura,
        telefon: req.body.phone,
        email: req.body.email,
        factura: req.body.factura,
        persFizica: req.body.persFizica,
        adresa: req.body.localitate,
        judet: req.body.judet,
        persFactura: req.body.persFactura,
        eori: req.body.eori,
        date: req.body.date,
        mesaj: "",
        text: "",
        subject: "",
        cota_tva_ies: 19,
        facturaName: "Servicii intermediere EORI",
        serie: "",
        serie_document: "DIANEXF",
        tip_document: "",
        pret_vanzare_tva: "",
        pret_vanzare: ""
    };

    let attachments = [];
    for (let i = 0; i < req.files.length; i++) {
        attachments.push({
            filename: req.files[i].originalname,
            path: req.files[i].path,
        });
    }
    switch (info.eori) {
        case 'EORI RO (Firmă înregistrată în România)': info.pret_vanzare = "66.3900", info.pret_vanzare_tva = "79.0000";
            break;
        case 'EORI RO (PFA sau I.I.)': info.pret_vanzare = "66.3900", info.pret_vanzare_tva = "79.0000";
            break;
        case 'EORI RO (Foreign citizen)': info.pret_vanzare = "125.2100", info.pret_vanzare_tva = "149.0000";
            break;
        case 'Obținere EORI-GB': info.pret_vanzare = "125.2100", info.pret_vanzare_tva = "149.0000";
            break;
        case 'Modificarea EORI-RO': info.pret_vanzare = "83.1900", info.pret_vanzare_tva = "99.0000";
            break;
        default:
            info.pret_vanzare = "66.3900", info.pret_vanzare_tva = "79.0000";
    }

    if (info.eori == "Obținere EORI-GB") {
        info.subject = "Comanda EORI GB " + info.email;
        info.mesaj =
            "Buna" +
            salut +
            "\n" +
            "EORI GB a fost trimis pe email. Verificati si in SPAM. Va mai asteptam pe www.dianex.ro.";

        info.text =
            "<p>Bună" +
            salut +
            ",<br />Atașat la prezentul email aveți EORI GB solicitat prin intermediul formularului de comandă. Documentul este eliberat de autoritatile U.K.<br>In cel mai scurt timp veti primi si factura fiscala pentru documentul intermediat.<br></p>" +
            "Suntem specializați și autorizați pentru servicii 100% online:<ul>" +
            '  <li><a href="https://www.dianex.ro/certificat-constatator-online/" target="_blank" rel="noopener" >Certificat Constatator O.N.R.C.</a></li>' +
            '  <li><a href="https://www.dianex.ro/infiintare-pfa/" target="_blank" rel="noopener" >Infiintare PFA</a>&nbsp;și&nbsp;<a href="https://www.dianex.ro/pasi-infiintare-srl/" target="_blank" rel="noopener">SRL</a></li>' +
            '  <li><a href="https://www.dianex.ro/modificari-firma/" target="_blank" rel="noopener" >Modificări Firmă</a>&nbsp;la Registrul Comerțului</li>' +
            ' <li><a href="https://www.dianex.ro/contabilitate-pfa/" target="_blank" rel="noopener" >Contabilitate PFA</a>&nbsp;și SRL</li>' +
            ' <li><a href="https://www.dianex.ro/extras-de-carte-funciara-online/" target="_blank" rel="noopener" >Extras Carte Funciară</a></li> </ul>' +
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
    else if(info.eori == "EORI RO (Foreign citizen)")
    {
        info.subject = "Submission of EORI RO file " + info.email;
        info.mesaj =
            "Hello," +
            "\n" +
            "The file for EORI RO has been submitted. The Customs Directorate will send the EORI code to your email. Check also in SPAM. We hope to see you again on www.dianex.ro.";
        info.text =
            "Hello," +
            '<br /><br />The file for obtaining the EORI RO code was submitted to the relevant Customs Directorate for resolution.<br><br>Resolution will normally occur within 24 - 48 business hours of submission. The timeframe is set exclusively by the Regional Directorate of Customs, depending on the volume of files in progress.<br>Please email us when you receive the code so we may close the file and delete your data.<br><br>If more than 48 working hours have passed since receiving this email and you have not received the EORI code, you can check if the EORI code has been issued by entering your CUI (companies) / CNP (natural persons) with RO in front and without space,<a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=ro">here</a>.' +
            "We are specialized and authorized for 100% online services:<ul>" +
            '  <li><a href="https://www.dianex.ro/certificat-constatator-online/" target="_blank" rel="noopener" >Confirmation of Company Details from O.N.R.C.</a></li>' +
            '  <li><a href="https://www.dianex.ro/infiintare-pfa/" target="_blank" rel="noopener" >Registering PFA</a>&nbsp;and&nbsp;<a href="https://www.dianex.ro/pasi-infiintare-srl/" target="_blank" rel="noopener">SRL</a></li>' +
            '  <li><a href="https://www.dianex.ro/modificari-firma/" target="_blank" rel="noopener" >Company Amendment</a>&nbsp;la Registrul Comerțului</li>' +
            ' <li><a href="https://www.dianex.ro/contabilitate-pfa/" target="_blank" rel="noopener" >PFA and SRL Accounting</a></li>' +
            ' <li><a href="https://www.dianex.ro/extras-de-carte-funciara-online/" target="_blank" rel="noopener" >Real Estate Register Excerpt</a></li> </ul>' +
            " Best regards,<br>" +
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
    }
    else{
        info.subject = "Depunere dosar EORI RO " + info.email;
        info.mesaj =
            "Buna" +
            salut +
            "\n" +
            "Dosarul pentru EORI RO a fost depus. Directia Vamala va trimite pe emailul dvs. codul eori. Verificati si in SPAM. Va mai asteptam pe www.dianex.ro.";
        info.text =
            "Bună" +
            salut +
            ',<br /><br />Dosarul pentru obținerea codului EORI RO a fost depus la Direcția Vamală competentă pentru soluționare.<br><br>În mod normal, soluționarea va avea loc în 24 - 48 ore lucrătoare de la depunere. Termenul este stabilit exclusiv de Direcția Regională a Vămilor, în funcție de volumul de dosare aflate în lucru.<br>Vă rog sa ne comunicați pe email când primiți codul pentru a închide dosarul și sterge datele dvs.<br><br>Dacă trec mai mult de 48 de ore lucrătoare de la momentul primirii acestul email și nu ati primit codul EORI, puteti verifica daca s-a emis codul EORI prin introducere CUI (firme) / CNP(persoane fizice) cu RO în față fără spațiu,<a href="https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=ro">aici</a>.' +
            "Suntem specializați și autorizați pentru servicii 100% online:<ul>" +
            '  <li><a href="https://www.dianex.ro/certificat-constatator-online/" target="_blank" rel="noopener" >Certificat Constatator O.N.R.C.</a></li>' +
            '  <li><a href="https://www.dianex.ro/infiintare-pfa/" target="_blank" rel="noopener" >Infiintare PFA</a>&nbsp;și&nbsp;<a href="https://www.dianex.ro/pasi-infiintare-srl/" target="_blank" rel="noopener">SRL</a></li>' +
            '  <li><a href="https://www.dianex.ro/modificari-firma/" target="_blank" rel="noopener" >Modificări Firmă</a>&nbsp;la Registrul Comerțului</li>' +
            ' <li><a href="https://www.dianex.ro/contabilitate-pfa/" target="_blank" rel="noopener" >Contabilitate PFA</a>&nbsp;și SRL</li>' +
            ' <li><a href="https://www.dianex.ro/extras-de-carte-funciara-online/" target="_blank" rel="noopener" >Extras Carte Funciară</a></li> </ul>' +
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
    }

    console.log(info)

    let data = JSON.stringify({
        phone: "+4" + info.telefon,
        shortTextMessage: info.mesaj,
        sendAsShort: true,
    });

    let dataError = JSON.stringify({
        phone: "+40721321348",
        shortTextMessage: "Codul Eori pentru " + info.email + " nu a fost trimis.",
        sendAsShort: true,
    });

    try {
        let mailOptions = {
            from: "Comanda EORI <online@dianex.ro>",
            to: `${info.email}, "online@dianex.ro"`,
            subject: info.subject,
            text: "Buna ziua,",
            html: info.text,
            attachments: attachments,
        };

        if (trimiteEmail(mailOptions, dataError)) {
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
        return console.log("Unable to send email", e, "failed_send");
    }

};


module.exports = {
    getEORI: eori,
    sendEORI: robot
};