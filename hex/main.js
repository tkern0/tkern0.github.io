var inputDec     = null;
var inputHex     = null;
var inputOct     = null;
var signedButton = null;
var sizeDown     = null;
var sizeLabel    = null;
var sizeUp       = null;
window.addEventListener("load", function() {
    inputDec     = document.getElementById("inputDec");
    inputHex     = document.getElementById("inputHex");
    inputOct     = document.getElementById("inputOct");
    signedButton = document.getElementById("signedButton");
    sizeDown     = document.getElementById("sizeDown");
    sizeLabel    = document.getElementById("sizeLabel");
    sizeUp       = document.getElementById("sizeUp");

    inputDec.addEventListener("input", validateDec);
    inputHex.addEventListener("input", validateHex);
    inputOct.addEventListener("input", validateOct);

    // Setup bit display, easier than hardcoding it
    index = 63;
    bitRows = document.getElementsByClassName("bitRow");
    for (rowIndex = 0; rowIndex < 4; rowIndex++) {
        row = bitRows[rowIndex];
        data = "";
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                data += `<span id="bit` + index + `" onclick="toggleBit(` + index
                        + `)" class="pointer">0</span>`;
                index--;
            }
            data += " ";
        }
        // Remove the last space
        row.innerHTML = data.slice(0, data.length-1);
    }
});

var signed = true;
var wordSize = 64;

/*
  Javascript uses doubles, which loses precision before 64 bits
  We have two options: use a bigInt, or store it in an array of bits
  I consider the binary display (an array) the "raw data", so representing it the same way is easier
  Switching bigInts between signed/unsigned is a little awkward too
*/
var values = Array(64).fill(0);

function adjustSize(amount) {
    oldSize = wordSize;
    wordSize *= amount;
    sizeLabel.innerHTML = wordSize;
    // By disabling the buttons at the right time I can limit the sizes to only standard ones
    sizeUp.disabled = wordSize == 64;
    sizeDown.disabled = wordSize == 8;

    // If the size went down disable all the extra bits
    for (i = 63; i > wordSize - 1; i--) {
        values[i] = 0;
        bit = document.getElementById("bit" + i);
        bit.innerHTML = "0";
        bit.classList.add("grey");
        bit.classList.remove("pointer");
        bit.classList.remove("red");
    }
    // If the size went up re-enable all new bits
    for (i = wordSize - 1; i > oldSize - 1; i--) {
        /*
          If we were using signed values then copy the highest bit of the old value
          This will keep the same value incase it was negative
          If using unsigned we always want to leave it at 0 though
        */
        values[i] = signed ? values[oldSize - 1] : 0;
        bit = document.getElementById("bit" + i);
        bit.classList.add("pointer");
        bit.classList.remove("grey");
    }
    fixDisplays()
}

function toggleSigned() {
    signed = !signed;
    signedButton.innerHTML = signed ? "S" : "U";
    fixDisplays();
}

function toggleBit(index) {
    if (index >= wordSize) {
        return;
    }
    values[index] ^= 1;
    fixDisplays();
}

function fixDisplays() {
    /*
      Calculate our value
      Using a bigInt here just to do all the toString conversions
    */
    val = bigInt(0);
    for (i = wordSize - 1; i >= 0; i--) {
        val = val.times(2);
        bit = document.getElementById("bit" + i);
        if (values[i]) {
            val = val.add(1);
            bit.classList.add("red");
            bit.innerHTML = "1";
        } else {
            bit.classList.remove("red");
            bit.innerHTML = "0";
        }
    }
    hex = val.toString(16);
    oct = val.toString(8);
    // Add seperators
    for (i = hex.length - 4; i > 0; i -= 4) {
        hex = hex.slice(0, i) + " " + hex.slice(i);
    }
    for (i = oct.length - 3; i > 0; i -= 3) {
        oct = oct.slice(0, i) + " " + oct.slice(i);
    }
    inputHex.value = hex;
    inputOct.value = oct;

    // If negative signed number
    if (signed && values[wordSize - 1] == 1) {
        val = val.subtract(bigInt(2).pow(wordSize));
    }
    dec = val.toString();
    for (i = dec.length - 3; i > 0; i -= 3) {
        if (dec.slice(0, i) == "-") {
            continue;
        }
        dec = dec.slice(0, i) + "," + dec.slice(i);
    }
    inputDec.value = dec;
}

function validateDec() {
    // TODO
}

function validateHex() {
    // TODO
}
function validateOct() {
    // TODO
}
