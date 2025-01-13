export function loadletters() {
  const textElement = document.getElementById("animated-text");
  const textContent = textElement.textContent;
  textElement.innerHTML = ""; 

  const spans = textContent.split("").map((letter, index) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.opacity = "0"; 
    span.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
    span.style.display = "inline-block";
    span.style.transform = "translateY(10px)";
    return span;
  });

  spans.forEach((span) => textElement.appendChild(span));

  requestAnimationFrame(() => {
    spans.forEach((span) => {
      span.style.opacity = "1";
      span.style.transform = "translateY(0)";
    });
  });
}
