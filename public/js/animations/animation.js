export function loadletters() {
  // Wrap every letter in a span
  var textWrapper = document.querySelector('.ml7 .letters');
  textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
  
  anime.timeline({loop: false})
    .add({
      targets: '.ml7 .letter',
      translateY: ["1.1em", 0],
      translateX: ["0.55em", 0],
      translateZ: 0,
      rotateZ: [180, 0],
      duration: 1250,
      easing: "easeOutExpo",
      delay: (el, i) => 100 * i
    }).add({
      targets: '.ml7',
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    });
}