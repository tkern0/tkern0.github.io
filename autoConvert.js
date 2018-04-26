var CONVERTERS_BASE_HTML = "";
function autoConvert() {
    CONVERTERS_BASE_HTML = document.getElementById("converters").innerHTML;
    document.getElementById("converters").innerHTML = `
        <div class="center">
            Song Length: <input type="number" id="songLen" min="0">
            <button type="button" onclick="autoSubmit()">Submit</button>
        </div>
    `;
}

function autoSubmit() {
    document.getElementById("inputText").value = "";
    var text = document.getElementById("lyrics").value
    text = text.replace(/\n\s*\n/g, "\n");
    var endTime = parseInt(document.getElementById("songLen").value) * 1000
    convertLyrics(text, 0, endTime);
    document.getElementById("converters").innerHTML = CONVERTERS_BASE_HTML;
}
