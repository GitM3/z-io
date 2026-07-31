const root = document.documentElement;
root.classList.add("js");
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const portfolioVideo = document.querySelector(".project-video video");

let savedTheme;
try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch {
  savedTheme = null;
}
const preferredTheme = window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
root.dataset.theme = savedTheme || preferredTheme;

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch {
    // Theme still applies for the current page when storage is unavailable.
  }
});

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("#current-year").textContent = new Date().getFullYear();

// Autoplay requires muted inline video on most browsers. Controls remain available
// as a fallback when data-saving or browser policies block automatic playback.
if (portfolioVideo && "IntersectionObserver" in window) {
  portfolioVideo.muted = true;
  portfolioVideo.defaultMuted = true;

  const tryPlayback = () => portfolioVideo.play().catch(() => {});
  portfolioVideo.addEventListener("canplay", tryPlayback, { once: true });

  const videoObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        tryPlayback();
      } else {
        portfolioVideo.pause();
      }
    },
    { threshold: 0.25 },
  );

  videoObserver.observe(portfolioVideo);
} else if (portfolioVideo) {
  portfolioVideo.muted = true;
}
