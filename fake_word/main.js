/*
  This whole site is made to theoretically accept other sources of data, but I'm just including one
   for now cause I don't feel like formatting the page to support that
*/

var CHAR_NUM = 3;
var LEN_WEIGHT = 50;

var worldDisplay = null;
window.addEventListener("load", function() {
    wordDisplay = document.getElementById("word");

    // Let's hope this page stays in the same spot, I have a local copy just in case though
    loadURL("https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt");
});

function loadURL(url) {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            wordDisplay.classList.remove("gray");
            if (xhr.statusText == "OK") {
                createStats(xhr.responseText);
                displayWord();
            } else {
                wordDisplay.classList.add("red");
                wordDisplay.innerHTML = "Error accessing data"
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send()
}

var stats = null;
function createStats(data) {
    stats = {};

    // My input splits on newlines but I think whitespace is more general
    all_lines = data.split(/\s+/g);
    for (var i = 0; i < all_lines.length; i++) {
        start_chars = " ".repeat(CHAR_NUM);
        /*
          Again my input is just all lowercase chars already but this will work better generally
          Other languages might want to add other symbols too, but for english I think you just need
           the apostrophe
        */
        line = all_lines[i].toLowerCase().replace(/[^a-z']/g, "") + start_chars;

        for (var j = 0; j < line.length; j++) {
            char = line.charAt(j);
            if (start_chars in stats) {
                if (char in stats[start_chars]) {
                    stats[start_chars][char]++;
                } else {
                    stats[start_chars][char] = 1;
                }
                stats[start_chars].total++;
            } else {
                stats[start_chars] = {total: 1};
                stats[start_chars][char] = 1;
            }
            start_chars = start_chars.slice(1) + char;
        }
    }
}

function genWord() {
    start_chars = " ".repeat(CHAR_NUM);
    word = "";
    new_char = "";
    while (new_char != " ") {
        /*
          We add all the length stuff here to discourage words from getting too long
          Spaces will always sort to the front of the list, so we make it possible to pick something
           negative which would also select them and end the word
        */
        char_index = (Math.random()
                      * (stats[start_chars].total + word.length*LEN_WEIGHT)
                     ) - word.length*LEN_WEIGHT;
        keys = Object.keys(stats[start_chars]);
        keys = keys.filter(function(str, i, a) {return str != "total"});
        keys.sort();

        // Find which char that index corrosponds to
        key_index = 0;
        while (char_index > stats[start_chars][keys[key_index]]) {
            char_index -= stats[start_chars][keys[key_index]];
            key_index++;
        }

        new_char = keys[key_index];
        word += new_char;
        start_chars = start_chars.slice(1) + new_char;
    }
    // Capitalize first char and trim space
    return word.charAt(0).toUpperCase() + word.slice(1, -1);
}

// Helper just for the button incase I ever want to generate words seperatly
function displayWord() {
    wordDisplay.innerHTML = genWord();
}
