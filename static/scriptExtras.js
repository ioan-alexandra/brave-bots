let cuiDiv = document.getElementById("cuiDiv");
let adresaDiv = document.getElementById("adresaDiv");
let uploadDiv = document.getElementById("uploadDiv");
let factDiv = document.getElementById("factDiv");
let persDiv = document.getElementById("persDiv");

let persFizica = document.getElementById("persFizica");
let persFactura = document.getElementById("persFactura");
let cuiFactura = document.getElementById("cuiFactura");
let tipExtras = document.getElementById("tipExtras");
let files = document.getElementById("files");
let adresa = document.getElementById("localitate");
let judet = document.getElementById("judet");
let xhr = new XMLHttpRequest();
document.getElementById("date").valueAsDate = new Date();

persFizica.addEventListener("change", persoana);
tipExtras.addEventListener("change", paUpload);
judet.addEventListener("change", changeJudet);

factDiv.style.display = "none";
cuiFactura.disabled = true;

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
            removeOptions(localitate);

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

function persoana() {
    if (persFizica.value == "DA") {
        factDiv.style.display = "none";
        cuiFactura.disabled = true;
        persDiv.style.display = "block";
        persFactura.disabled = false;
        adresaDiv.style.display = "block";
        adresa.disabled = false;
        judet.disabled = false;
    } else if (persFizica.value == "NU") {
        factDiv.style.display = "block";
        cuiFactura.disabled = false;
        persDiv.style.display = "none";
        persFactura.disabled = true;
        adresaDiv.style.display = "none";
        adresa.disabled = true;
        judet.disabled = true;
    }
}

function paUpload() {
    if (tipExtras.value == "Lipsa Imobil") {
        files.disabled = true;
        uploadDiv.style.display = "none";
    } else {
        files.disabled = false;
        uploadDiv.style.display = "block";

    }
}

function orderList(list) {
    list.sort((a, b) => (a.denumire > b.denumire) ? 1 : ((b.denumire > a.denumire) ? -1 : 0))
}
