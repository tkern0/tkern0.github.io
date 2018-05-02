function autoConvert() {
    document.getElementById("converters").hidden = true;
    document.getElementById("autoDiv").hidden = false;
}

function autoSubmit() {
    document.getElementById("inputText").value = "";
    var text = document.getElementById("lyrics").value
    text = text.replace(/\n\s*\n/g, "\n");
    var endTime = parseInt(document.getElementById("songLen").value) * 1000
    convertLyrics(text, 0, endTime);
    document.getElementById("converters").hidden = false;
    document.getElementById("autoDiv").hidden = true;
}
