const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealElements = document.querySelectorAll(".reveal");
const skillBars = document.querySelectorAll(".skill-bar span");
const typingElements = document.querySelectorAll("[data-typing]");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const themeToggle = document.querySelector(".theme-toggle");
const parallaxTargets = document.querySelectorAll(".hero-card, .hub-showcase");

function updateHeaderState() {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
}

function toggleMenu() {
  if (!navMenu || !navToggle) return;
  const isOpen = navMenu.classList.toggle("active");
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMenu() {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
}

function initializeTyping() {
  typingElements.forEach((element) => {
    const words = element.dataset.typing.split(",").map((item) => item.trim()).filter(Boolean);
    if (words.length === 0) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentWord = words[wordIndex];
      charIndex += isDeleting ? -1 : 1;
      element.textContent = currentWord.slice(0, charIndex);

      let speed = isDeleting ? 70 : 100;
      if (!isDeleting && charIndex === currentWord.length) {
        speed = 1400;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 280;
      }

      window.setTimeout(type, speed);
    };

    type();
  });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("visible");

    if (entry.target.classList.contains("skill-item")) {
      const bar = entry.target.querySelector(".skill-bar span");
      if (bar) bar.style.width = bar.dataset.width;
    }

    observer.unobserve(entry.target);
  });
}, { threshold: 0.16 });

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
  const group = input.closest(".form-group");
  const errorElement = group?.querySelector(".error-message");
  if (!group || !errorElement) return;
  group.classList.add("error");
  errorElement.textContent = message;
}

function clearError(input) {
  const group = input.closest(".form-group");
  const errorElement = group?.querySelector(".error-message");
  if (!group || !errorElement) return;
  group.classList.remove("error");
  errorElement.textContent = "";
}

function handleFormSubmit(event) {
  event.preventDefault();
  if (!contactForm || !formStatus) return;

  const nameInput = contactForm.name;
  const emailInput = contactForm.email;
  const messageInput = contactForm.message;
  let isValid = true;

  [nameInput, emailInput, messageInput].forEach(clearError);
  formStatus.textContent = "";

  if (!nameInput.value.trim()) {
    showError(nameInput, "Nama wajib diisi.");
    isValid = false;
  }

  if (!emailInput.value.trim()) {
    showError(emailInput, "Email wajib diisi.");
    isValid = false;
  } else if (!validateEmail(emailInput.value.trim())) {
    showError(emailInput, "Format email belum valid.");
    isValid = false;
  }

  if (messageInput.value.trim().length < 10) {
    showError(messageInput, "Pesan minimal 10 karakter.");
    isValid = false;
  }

  if (!isValid) {
    formStatus.textContent = "Mohon periksa kembali form Anda.";
    return;
  }

  formStatus.textContent = "Pesan berhasil divalidasi. Form siap dikirim.";
  contactForm.reset();
}

function handleParallax() {
  if (window.innerWidth < 981) return;
  const offset = Math.min(window.scrollY * 0.08, 28);
  parallaxTargets.forEach((target, index) => {
    target.style.setProperty("--parallax-offset", `${offset * (index === 0 ? 1 : 0.6)}px`);
  });
}

function applyStoredTheme() {
  const storedTheme = window.localStorage.getItem("portfolio-theme");
  if (storedTheme === "light") {
    body.classList.add("light-mode");
  }
}

function toggleTheme() {
  body.classList.toggle("light-mode");
  const mode = body.classList.contains("light-mode") ? "light" : "dark";
  window.localStorage.setItem("portfolio-theme", mode);
}

navToggle?.addEventListener("click", toggleMenu);
navLinks.forEach((link) => link.addEventListener("click", closeMenu));
themeToggle?.addEventListener("click", toggleTheme);
contactForm?.addEventListener("submit", handleFormSubmit);

window.addEventListener("scroll", () => {
  updateHeaderState();
  handleParallax();
});

revealElements.forEach((element) => revealObserver.observe(element));
skillBars.forEach((bar) => { bar.style.width = "0"; });

applyStoredTheme();
updateHeaderState();
handleParallax();
initializeTyping();
