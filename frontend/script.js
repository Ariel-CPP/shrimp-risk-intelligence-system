async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    let formData = new FormData();
    formData.append("file", file);

    let response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData
    });

    let result = await response.json();

    document.getElementById("output").textContent =
        JSON.stringify(result, null, 2);
}
