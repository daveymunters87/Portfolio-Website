document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");
  let currentIndex = 0;

  async function fetchCertificates() {
    try {
      const response = await fetch("js/data/certificates.json");
      if (!response.ok) {
        throw new Error("Failed to load certificates.json");
      }
      const certificates = await response.json();
      populateCarousel(certificates);
    } catch (error) {
      console.error("Error loading certificates:", error);
    }
  }

  function populateCarousel(certificates) {
    const slides = [];

    certificates.forEach((certificate) => {
      const slide = `
        <li class="carousel-slide bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between w-full sm:w-[33.333%] flex-shrink-0">
          <div>
            <h3 class="text-primary font-bold text-lg">${certificate.title}</h3>
            <p class="text-gray-500 text-sm">${certificate.organization}</p>
          </div>
          <p class="text-gray-700 text-sm mt-2">${certificate.description}</p>
          <div class="flex items-center justify-between mt-4">
            <p class="text-gray-400 text-sm">${certificate.date}</p>
            <a href="https://www.nexed.com/verify?certId=${certificate.certId}" target="_blank" class="text-primary text-sm px-2 py-2 hover:scale-105 hover:underline underline-offset-4 transition duration-300 ease-in-out">
              Verify Certificate
            </a>
          </div>
        </li>
      `;
      slides.push(slide);
    });

    carousel.innerHTML = slides.join("");
    centerInitialCard(certificates.length); // Center the middle card
    enableManualSlider(certificates.length); // Enable navigation buttons
  }

  function centerInitialCard(totalSlides) {
    const cardWidth = carousel.offsetWidth / (window.innerWidth < 640 ? 1 : 3); // Adjust for mobile
    const gap = parseInt(getComputedStyle(carousel).gap) || 0;
    const slideWidth = cardWidth + gap;

    // Set the initial index to the middle card
    currentIndex = Math.floor(totalSlides / 2);

    // Calculate the translation to center the middle card
    const initialTranslateX = -(currentIndex * slideWidth) + (carousel.offsetWidth / 2 - slideWidth / 2);
    carousel.style.transform = `translateX(${initialTranslateX}px)`;
  }

  function enableManualSlider(totalSlides) {
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    prevButton.addEventListener("click", () => slideCarousel("prev", totalSlides));
    nextButton.addEventListener("click", () => slideCarousel("next", totalSlides));
  }

  function slideCarousel(direction, totalSlides) {
    const cardWidth = carousel.offsetWidth / (window.innerWidth < 640 ? 1 : 3); // Adjust for mobile
    const gap = parseInt(getComputedStyle(carousel).gap) || 0;
    const slideWidth = cardWidth + gap;
    const maxIndex = totalSlides - 1;

    if (direction === "next" && currentIndex < maxIndex) {
      currentIndex++;
    } else if (direction === "prev" && currentIndex > 0) {
      currentIndex--;
    }

    const translateX = -(currentIndex * slideWidth) + (carousel.offsetWidth / 2 - slideWidth / 2);
    carousel.style.transform = `translateX(${translateX}px)`;
  }

  fetchCertificates();
});
