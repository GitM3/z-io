const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const portfolioVideo = document.querySelector(".project-video video");

const savedTheme = localStorage.getItem("portfolio-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
root.dataset.theme = savedTheme || preferredTheme;

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
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

document.querySelector("#current-year").textContent = new Date().getFullYear();

// Autoplay requires muted inline video on most browsers. Controls remain available
// as a fallback when data-saving or browser policies block automatic playback.
if (portfolioVideo) {
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
}
