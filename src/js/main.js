window.addEventListener("load", loadletters());

async function loadletters() {
    const textElement = document.getElementById("animated-text");
    
      const textContent = textElement.textContent;
      textElement.innerHTML = ""; 
    
      textContent.split("").forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.opacity = "0"; // Start invisible
        span.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
        span.style.display = "inline-block";
        span.style.transform = "translateY(10px)";
        textElement.appendChild(span);
        // Trigger animation right away
        requestAnimationFrame(() => {
          span.style.opacity = "1";
          span.style.transform = "translateY(0)"; 
        });
      });
}
