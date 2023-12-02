let tipCertificat = document.getElementById("certificat");
let baza = document.getElementById("baza");
let imm = document.getElementById("imm");
let insol = document.getElementById("insol");
let certBaza = document.getElementById("certBaza");
let certIns = document.getElementById("certIns");
let certIMM = document.getElementById("certIMM");
let persFizica = document.getElementById("persFizica");
let factDiv = document.getElementById("factDiv");
let persDiv = document.getElementById("persDiv");
let persFactura = document.getElementById("persFactura");
let cuiFactura = document.getElementById("cuiFactura");
let adresa = document.getElementById("localitate");
let judet = document.getElementById("judet");
let adresaDiv = document.getElementById("adresaDiv");
let xhr = new XMLHttpRequest();
persDiv.style.display = "none";
adresaDiv.style.display = "none";

persFactura.disabled = true;
adresa.disabled = true;
judet.disabled = true;

judet.addEventListener("change", changeJudet);
tipCertificat.addEventListener("change", certificat);
persFizica.addEventListener("change", factura);

document.getElementById("date").valueAsDate = new Date();

insol.style.display = "none";
imm.style.display = "none";

certIMM.disabled = true;
certIns.disabled = true;

tipCertificat.addEventListener("change", certificat);

populateBucuresti();

function changeJudet() {
    removeOptions(localitate);
    let loading = document.createElement("option");
    loading.text = "Se incarca...";
    localitate.appendChild(loading);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://alex-cors.onrender.com/http://84.232.142.71:3030/api/v3/read/localitati");

    xhr.setRequestHeader("Authorization", "Basic QUI0Mzk5RjI4RDBCNDJGRjhCNUE0MTI5M0JFRTEzQ0E6");
    xhr.setRequestHeader("Content-Type", "application/json");


    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let obj = JSON.parse(xhr.responseText);
            removeOptions(localitate);
            orderList(obj.result);
            for (let i = 0; i < obj.result.length; i++) {
                let option = document.createElement("option");
                option.value = obj.result[i].denumire;
                option.text = obj.result[i].denumire;
                localitate.appendChild(option);
            }
        }
    };
    console.log(judet.options[judet.selectedIndex].text)
    let data = `{
            "den_judet" : "${judet.options[judet.selectedIndex].text}",
            "campuri" :"denumire"
        }`;

    xhr.send(data);
}

function populateBucuresti() {
    xhr.open("POST", "https://alex-cors.onrender.com/http://84.232.142.71:3030/api/v3/read/localitati");

    xhr.setRequestHeader("Authorization", "Basic QUI0Mzk5RjI4RDBCNDJGRjhCNUE0MTI5M0JFRTEzQ0E6");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let obj = JSON.parse(xhr.responseText);
            for (let i = 0; i < obj.result.length; i++) {
                let option = document.createElement("option");
                option.value = obj.result[i].denumire;
                option.text = obj.result[i].denumire;
                localitate.appendChild(option);
            }
        }
    };

    let data = `{
            "den_judet" : "Bucuresti",
            "campuri" :"denumire"
        }`;
    xhr.send(data);
}

function removeOptions(selectElement) {
    let i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

function factura() {
    if (persFizica.value == "DA") {
        factDiv.style.display = "none";
        persDiv.style.display = "block";
        adresaDiv.style.display = "block";
        persFactura.disabled = false;
        cuiFactura.disabled = true;
        adresa.disabled = false;
        judet.disabled = false;
    } else {
        factDiv.style.display = "block";
        persDiv.style.display = "none";
        adresaDiv.style.display = "none";
        persFactura.disabled = true;
        adresa.disabled = true;
        judet.disabled = true;
        cuiFactura.disabled = false;
    }
}


function certificat() {

    if (tipCertificat.value == "Certificat constatator de bază") {
        baza.style.display = "block";
        insol.style.display = "none";
        imm.style.display = "none";

        certIMM.disabled = true;
        certIns.disabled = true;
        certBaza.disabled = false;
    } else if (tipCertificat.value == "Certificat constatator fonduri IMM") {
        imm.style.display = "block";
        baza.style.display = "none";
        insol.style.display = "none";

        certBaza.disabled = true;
        certIns.disabled = true;
        certIMM.disabled = false;
    } else if (tipCertificat.value == "Certificat constatator pentru insolvență") {
        imm.style.display = "none";
        baza.style.display = "none";
        insol.style.display = "block";

        certBaza.disabled = true;
        certIns.disabled = false;
        certIMM.disabled = true;
    } else {
        baza.style.display = "none";
        insol.style.display = "none";
        imm.style.display = "none";

        certIMM.disabled = true;
        certIns.disabled = true;
        certBaza.disabled = true;
    }
}
function orderList(list) {
    list.sort((a,b) => (a.denumire > b.denumire) ? 1 : ((b.denumire > a.denumire) ? -1 : 0))
}

