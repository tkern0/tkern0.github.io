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

    inputDec.value = "";
    inputHex.value = "";
    inputOct.value = "";

    // Setup bit display, easier than hardcoding it
    index = 63;
    bitRows = document.getElementsByClassName("bitRow");
    for (rowIndex = 0; rowIndex < 4; rowIndex++) {
        row = bitRows[rowIndex];
        data = "";
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                data += `<span id="bit` + index + `" onclick="toggleBit(` + index
                        + `)" class="` + (index >= 32 ? "grey": "pointer") + `">0</span>`;
                index--;
            }
            data += " ";
        }
        // Remove the last space
        row.innerHTML = data.slice(0, data.length-1);
    }
});

var signed = false;
var wordSize = 32;

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

    fixDisplays();
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

const IGNORE_BIT = 0b0001;
const IGNORE_DEC = 0b0010;
const IGNORE_HEX = 0b0100;
const IGNORE_OCT = 0b1000;
function fixDisplays(ignore) {
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
            if ((ignore & IGNORE_BIT) == 0) {
                bit.classList.add("red");
                bit.innerHTML = "1";
            }
        } else {
            if ((ignore & IGNORE_BIT) == 0) {
                bit.classList.remove("red");
                bit.innerHTML = "0";
            }
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
    if ((ignore & IGNORE_HEX) == 0) {
        inputHex.value = hex;
    }
    if ((ignore & IGNORE_OCT) == 0) {
        inputOct.value = oct;
    }

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
    if ((ignore & IGNORE_DEC) == 0) {
        inputDec.value = dec;
    }
}

/*
  Annoyingly while oninput fires on pretty much all inputs, it's after the change has happened
  It also doesn't return data in my firefox install
  So instead of intercepting the event we'll just make the textbox red when invalid
*/
function validateDec() {
    val = inputDec.value.replace(/[\s,]/g, "");
    // Without this you can only get back to 0
    if (val == "") {
        emptyInputs();
        return;
    }

    // Make sure we have the right characters
    if (/^-?\d*$/.test(val)) {
        // Don't want negative numbers on unsigned
        if (signed || !val.startsWith("-")) {
            if (val == "-") {
                return;
            }
            /*
              Make sure you stay within the limits of your word size
              This is easier for the other two because each digit in those represents a constant
               amount of bits, unlike decimal
            */
            num = bigInt(val);
            min = signed ? bigInt(2).pow(wordSize - 1).multiply(-1) : 0;
            max = bigInt(2).pow(wordSize - signed).subtract(1);

            if (num.greaterOrEquals(min) && num.lesserOrEquals(max)) {
                inputDec.classList.remove("red");
                // We don't want to overwrite what you just wrote
                changeValue(num, IGNORE_DEC);
                return;
            }
        }
    }

    inputDec.classList.add("red");
}

function validateHex() {
    val = inputHex.value.replace(/\s/g, "");
    if (val == "") {
        emptyInputs();
        return;
    }

    if (/^[0-9a-f]*$/i.test(val)) {
        // Each character represents 4 bits so we can just check the input length
        if (val.length <= wordSize/4) {
            inputHex.classList.remove("red");
            changeValue(bigInt(val, 16), IGNORE_HEX);
            return;
        }
    }

    inputHex.classList.add("red");
}

function validateOct() {
    val = inputOct.value.replace(/\s/g, "");
    if (val == "") {
        emptyInputs();
        return;
    }

    if (/^[0-7]*$/.test(val)) {
        if (val.length <= Math.ceil(wordSize/3)) {
            inputOct.classList.remove("red");
            changeValue(bigInt(val, 8), IGNORE_OCT);
            return;
        }
    }

    inputOct.classList.add("red");
}

// Really this works well as a general purpose function but it was one of the last things I wrote
function changeValue(val, ignore=0) {
    negative = val.isNegative();
    if (negative) {
        values[wordSize - 1] = 1;
        val = val.add(1);
    }
    for (i = 0; i < wordSize; i++) {
        values[i] = val.isOdd() ^ negative;
        val = val.divide(2);
    }
    fixDisplays(ignore);
}

function emptyInputs() {
    values = Array(64).fill(0);
    fixDisplays();
    // fixDisplays will set these to 0 but we want to empty them
    inputDec.value = "";
    inputHex.value = "";
    inputOct.value = "";
    inputDec.classList.remove("red");
    inputHex.classList.remove("red");
    inputOct.classList.remove("red");

}
