import { loadletters } from "./animations/animation.js";
import { enableSmoothScroll } from "./utils/smoothScroll.js";
import { showToastNotification } from "./utils/toastNotifications.js";
import { toggleNav } from "./utils/navToggle.js";

window.addEventListener("load", () => {
  toggleNav();
  loadletters();
  enableSmoothScroll();
  showToastNotification();
});
