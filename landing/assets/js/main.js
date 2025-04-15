/**
*
* -----------------------------------------------------------------------------
*
* Template : #
* Author : #
* Author URI : #

* -----------------------------------------------------------------------------
*
**/

document.addEventListener("DOMContentLoaded", () => {
    "use strict";
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
  
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
          });
        }
      });
    });
  
    // Word animation logic
    const words = document.getElementsByClassName("word");
    const wordArray = [];
    let currentWord = 0;
  
    // Set the initial opacity for the first word
    words[currentWord].style.opacity = 1;
  
    // Split each word into individual letters
    for (let i = 0; i < words.length; i++) {
      splitLetters(words[i]);
    }
  
    function changeWord() {
      const cw = wordArray[currentWord]; // Current word's letters
      const nw = currentWord === words.length - 1 ? wordArray[0] : wordArray[currentWord + 1]; // Next word's letters
  
      for (let i = 0; i < cw.length; i++) {
        animateLetterOut(cw, i);
      }
  
      for (let i = 0; i < nw.length; i++) {
        nw[i].className = "letter behind";
        nw[0].parentElement.style.opacity = 1;
        animateLetterIn(nw, i);
      }
  
      currentWord = currentWord === wordArray.length - 1 ? 0 : currentWord + 1;
    }
  
    function animateLetterOut(cw, i) {
      setTimeout(() => {
        cw[i].className = "letter out";
      }, i * 80);
    }
  
    function animateLetterIn(nw, i) {
      setTimeout(() => {
        nw[i].className = "letter in";
      }, 340 + i * 80);
    }
  
    function splitLetters(word) {
      const content = word.innerHTML;
      word.innerHTML = "";
      const letters = [];
      for (let i = 0; i < content.length; i++) {
        const letter = document.createElement("span");
        letter.className = "letter";
        letter.innerHTML = content.charAt(i);
        word.appendChild(letter);
        letters.push(letter);
      }
  
      wordArray.push(letters);
    }
  
    // Initialize the word change
    changeWord();
    setInterval(changeWord, 4000);
  });
  