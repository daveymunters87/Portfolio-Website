window.addEventListener("load", loadletters());

// Animation for H1 text
async function loadletters() {
  console.log('Start Animation');
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

  // Start animation
  requestAnimationFrame(() => {
    spans.forEach((span) => {
      span.style.opacity = "1";
      span.style.transform = "translateY(0)";
    });
  });
}

// Smooth slide animation for A tags
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

if (window.location.search.includes('success=true')) {
    // Show the SweetAlert
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: "success",
      title: "Message sent successfully!"
    });

    const url = new URL(window.location);
    url.searchParams.delete('success'); // Remove "success" query parameter
    window.history.replaceState({}, document.title, url.toString());
  }


// Error handler for Form
// document.getElementById('contactForm').addEventListener('submit', async function (event) {
//   event.preventDefault(); 

//   const form = event.target;
//   const formData = {
//       name: form.name.value,
//       email: form.email.value,
//       message: form.message.value,
//   };

//   try {
//       const response = await fetch('/send-email', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//           // Show error message on the page
//           document.getElementById('errorMessage').textContent = result.error;
//       } else {
//           // Redirect on success
//           window.location.href = '/?success=true';
//       }
//   } catch (error) {
//       document.getElementById('errorMessage').textContent = "An unexpected error occurred. Please try again.";
//   }
// });
