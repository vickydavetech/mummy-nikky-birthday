"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  }
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const backToTop = document.querySelector(".back-to-top");
let scrollScheduled = false;
window.addEventListener("scroll", () => {
  if (!scrollScheduled) {
    window.requestAnimationFrame(() => {
      backToTop.classList.toggle("is-visible", window.scrollY > 500);
      scrollScheduled = false;
    });
    scrollScheduled = true;
  }
}, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" }));

const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
let currentPhoto = 0;
let previouslyFocused = null;

function showPhoto(index) {
  currentPhoto = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentPhoto];
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = item.querySelector("img").alt;
  lightboxCaption.textContent = item.dataset.caption;
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    previouslyFocused = item;
    showPhoto(index);
    lightbox.showModal();
    document.querySelector(".lightbox-close").focus();
  });
});

document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
document.querySelector(".lightbox-prev").addEventListener("click", () => showPhoto(currentPhoto - 1));
document.querySelector(".lightbox-next").addEventListener("click", () => showPhoto(currentPhoto + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
  if (previouslyFocused) previouslyFocused.focus();
});
document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
  if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
});

const confettiLayer = document.querySelector("#confetti-layer");
const confettiColors = ["#bc7a70", "#d5b477", "#ead5cd", "#fff8e9", "#9d7268", "#c99a8c"];
let confettiCleanup;

function celebrate() {
  if (reducedMotion) return;
  window.clearTimeout(confettiCleanup);
  confettiLayer.replaceChildren();
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 85; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = confettiColors[i % confettiColors.length];
    piece.style.setProperty("--fall-duration", `${2.8 + Math.random() * 2.2}s`);
    piece.style.setProperty("--fall-delay", `${Math.random() * 0.8}s`);
    piece.style.setProperty("--drift", `${Math.round(Math.random() * 200 - 100)}px`);
    piece.style.setProperty("--spin", `${Math.round(Math.random() * 800 + 180)}deg`);
    if (i % 3 === 0) piece.style.borderRadius = "50%";
    fragment.append(piece);
  }
  confettiLayer.append(fragment);
  confettiCleanup = window.setTimeout(() => confettiLayer.replaceChildren(), 6500);
}

const wishButton = document.querySelector("#wish-button");
const cakeWrap = document.querySelector(".cake-wrap");
const wishResult = document.querySelector("#wish-result");
wishButton.addEventListener("click", () => {
  cakeWrap.classList.add("is-blown");
  wishResult.hidden = false;
  wishButton.disabled = true;
  wishButton.setAttribute("aria-label", "Your birthday wish has been made");
  celebrate();
});

const surpriseButton = document.querySelector("#surprise-button");
const surpriseMessage = document.querySelector("#surprise-message");
surpriseButton.addEventListener("click", () => {
  const isExpanded = surpriseButton.getAttribute("aria-expanded") === "true";
  surpriseButton.setAttribute("aria-expanded", String(!isExpanded));
  surpriseButton.innerHTML = isExpanded
    ? 'There\'s something special for you <span aria-hidden="true">♥</span>'
    : 'A little reminder, just for you <span aria-hidden="true">♥</span>';
  surpriseMessage.hidden = isExpanded;
  if (!isExpanded) {
    surpriseMessage.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "nearest" });
    celebrate();
  }
});
