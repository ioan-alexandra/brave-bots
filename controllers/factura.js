const {XMLHttpRequest} = require("xmlhttprequest");
const {trimiteSms} = require("./sms");
const {removeDiacritics} = require("./diacritice");
let xhr = new XMLHttpRequest();
let data1, data2, data3;
let smsData = '';

function populateFactura(info, sms) {
    data1 = '', data2 = '', data3 = '';

    if (info.persFizica == "NU") {

        let request = new XMLHttpRequest();

        request.open(
            "GET",
            `https://infocui.ro/system/api/data?key=c817ac27d558da46d45ccdc1a08ccbaa096caad1&cui=${info.cuiFactura}`
        );

        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                console.log("Status:", this.status);

                let obj = JSON.parse(this.responseText);
                let adresa = obj.data.adresa;
                adresa = removeDiacritics(adresa);
                data1 = `{
                    "parametri" :
                       {
                          "manage_existing" : 1,
                          "single_tran" : 0,
                          "updated_columns":"cif_cnp,pers_fizica,denumire,adresa,email,telefon"
                       },
                    "linii": [
                      {
                         "cif_cnp":  ${JSON.stringify(info.cuiFactura)},
                         "pers_fizica": 0,
                         "denumire": ${JSON.stringify(obj.data.nume)},
                         "adresa": ${JSON.stringify(adresa)},
                         "email": ${JSON.stringify(info.email)},
                         "telefon": ${JSON.stringify(info.telefon)},
                         "cod_tara": "RO"
                       }]
                }`;

                smsData = sms;
                importPartener(data1);
            }
        }

        request.send();

        data2 = `{
            "parametri": {
                "single_tran": 1,
                "gen_pvmpma": 0
            },
            "antete": [{
                "id_document": 500,
                "serie_document": ${JSON.stringify(info.serie_document)},
                "id_carnet": 1,
                "data_document": ${JSON.stringify(info.date)},
                "data_scadenta": ${JSON.stringify(info.date)},
                "curs": 1.0000,
                "den_gestiune": "SEDIU",
                "cont_debit": "4111",
                "cif_client": ${JSON.stringify(info.cuiFactura)},
                "livrat_afara_ro": false,
                "taxare_inversa": false,
                "incasare_bon_fiscal": false,
                "validare": true,
                "anulare": false,
                "linii": [{
                    "den_produs": ${JSON.stringify(info.facturaName)},
                    "cont_produs": "704",
                    "cantitate": 1.000,
                    "cota_tva_ies": ${JSON.stringify(info.cota_tva_ies)},
                    "pret_vanzare": ${info.pret_vanzare},
                    "pret_vanzare_tva": ${info.pret_vanzare_tva},
                    "denumire_sup": "",
                    "id_centru_profit": "",
                    "den_centru_profit": ""
                }]
        
            }]
        
        }`;
        data3 = `{
            "parametri": {
                "single_tran": 1
            },
            "antete": [{
                "id_document": "500",
                "tip_import": "BAL",
                "cont": ${JSON.stringify(info.serie)},
                "plata": 0,
                "tip_document": ${JSON.stringify(info.tip_document)},
                "numar_document": 0,
                "data_document": ${JSON.stringify(info.date)},
                "suma": ${info.pret_vanzare_tva},
                "cont_coresp": "4111.  .  .  .   ",
                "tip_coresp": "P",
                "cif_coresp": ${JSON.stringify(info.cuiFactura)},
                "validare": true
            }]
        }`;
    }
    else {
        data1 = `{
            "parametri" :
             {
             "manage_existing" : 1,
              "single_tran" : 0,
              "updated_columns":"cif_cnp,pers_fizica,denumire,adresa,email,telefon"
             },
            "linii": [
              {
                 "denumire":  ${JSON.stringify(info.persFactura)},
                 "pers_fizica": 1,
                 "email": ${JSON.stringify(info.email)},
                 "telefon": ${JSON.stringify(info.telefon)},
                 "cod_tara": "RO",
                 "den_localitate":${JSON.stringify(info.adresa)},
                 "cod_judet": ${JSON.stringify(info.judet)}
               }]
        }`;

        data2 = `{
            "parametri": {
                "single_tran": 1,
                "gen_pvmpma": 0
            },
            "antete": [{
                "id_document": 500,
                "serie_document": ${JSON.stringify(info.serie_document)},
                "id_carnet": 1,
                "data_document": ${JSON.stringify(info.date)},
                "data_scadenta": ${JSON.stringify(info.date)},
                "curs": 1.0000,
                "den_gestiune": "SEDIU",
                "cont_debit": "4111",
                "den_client": ${JSON.stringify(info.persFactura)},
                "livrat_afara_ro": false,
                "taxare_inversa": false,
                "incasare_bon_fiscal": false,
                "validare": true,
                "anulare": false,
                "linii": [{
                    "den_produs": ${JSON.stringify(info.facturaName)},
                    "cont_produs": "704",
                    "cantitate": 1.000,
                    "cota_tva_ies": ${JSON.stringify(info.cota_tva_ies)},
                    "pret_vanzare": ${info.pret_vanzare},
                    "pret_vanzare_tva": ${info.pret_vanzare_tva},
                    "denumire_sup": "",
                    "id_centru_profit": "",
                    "den_centru_profit": ""
                }]
        
            }]
        
        }`;

        data3 = `{
            "parametri": {
                "single_tran": 1
            },
            "antete": [{
                "id_document": 500,
                "tip_import": "BAL",
                "cont": ${JSON.stringify(info.serie)},
                "plata": 0,
                "tip_document": ${JSON.stringify(info.tip_document)},
                "numar_document": 0,
                "data_document": ${JSON.stringify(info.date)},
                "suma": ${info.pret_vanzare_tva},
                "cont_coresp": "4111",
                "tip_coresp": "P",
                "den_coresp": ${JSON.stringify(info.persFactura)},
                "validare": true
            }]
        }`;

        smsData = sms;
        importPartener(data1);
    }

}

function importPartener(data) {
    console.log(data1);

    xhr = new XMLHttpRequest();

    xhr.open(
        "POST",
        "http://84.232.142.71:3030/api/v1/import/parteneri"
    );

    xhr.setRequestHeader(
        "Authorization",
        "Basic QUI0Mzk5RjI4RDBCNDJGRjhCNUE0MTI5M0JFRTEzQ0E6"
    );
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status)
            console.log(xhr.responseText)
            let obj = JSON.parse(xhr.responseText);
            console.log("importPartener:" + obj.message);
            if (obj.message == "OK") {
                importFactura();
            }
        }
    };
    xhr.withCredentials = true;
    xhr.send(data);
}

function importFactura() {
    console.log(data2)

    xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://84.232.142.71:3030/api/v1/import/facturi_clienti"
    );

    xhr.setRequestHeader(
        "Authorization",
        "Basic QUI0Mzk5RjI4RDBCNDJGRjhCNUE0MTI5M0JFRTEzQ0E6"
    );
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let obj = JSON.parse(xhr.responseText);
            console.log("importFactura:" + obj.message);
            if (obj.message == "OK") {
                incasareFactura();
            }
        }
    };

    xhr.send(data2);
}

function incasareFactura() {
    console.log(data3);

    xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "http://84.232.142.71:3030/api/v1/import/incasari_plati"
    );
    xhr.setRequestHeader(
        "Authorization",
        "Basic QUI0Mzk5RjI4RDBCNDJGRjhCNUE0MTI5M0JFRTEzQ0E6"
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let obj = JSON.parse(xhr.responseText);
            console.log("incasareFactura:" + obj.message);
            console.log(smsData);
            trimiteSms(smsData);
        }
    };
    xhr.send(data3);
}

module.exports = {
    populateFactura: populateFactura,
};
