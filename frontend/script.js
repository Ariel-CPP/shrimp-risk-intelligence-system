const API_URL = "http://127.0.0.1:8000";

document.getElementById("fileInput").addEventListener("change", previewFile);

function previewFile() {
    const file = document.getElementById("fileInput").files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split("\n").map(r => r.split(","));
        renderTable("previewTable", rows.slice(0, 5)); // preview 5 rows
    };

    reader.readAsText(file);
}

async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a CSV file first");
        return;
    }

    let formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.error) {
            alert(result.error);
            return;
        }

        renderJSONTable("resultTable", result);

    } catch (error) {
        alert("Error connecting to backend");
        console.error(error);
    }
}

function renderTable(elementId, rows) {
    let table = document.getElementById(elementId);
    table.innerHTML = "";

    rows.forEach((row, i) => {
        let tr = document.createElement("tr");

        row.forEach(cell => {
            let el = document.createElement(i === 0 ? "th" : "td");
            el.textContent = cell;
            tr.appendChild(el);
        });

        table.appendChild(tr);
    });
}

function renderJSONTable(elementId, data) {
    let table = document.getElementById(elementId);
    table.innerHTML = "";

    if (data.length === 0) return;

    // Header
    let header = document.createElement("tr");
    Object.keys(data[0]).forEach(key => {
        let th = document.createElement("th");
        th.textContent = key;
        header.appendChild(th);
    });
    table.appendChild(header);

    // Rows
    data.forEach(row => {
        let tr = document.createElement("tr");

        Object.values(row).forEach(val => {
            let td = document.createElement("td");
            td.textContent = typeof val === "number" ? val.toFixed(3) : val;
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });
}
