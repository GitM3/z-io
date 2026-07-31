const root = document.documentElement;
root.classList.add("js");

const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const portfolioVideo = document.querySelector(".project-video video");
const reducedMotionQuery = window.matchMedia?.(
  "(prefers-reduced-motion: reduce)",
);

let savedTheme;

try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch {
  savedTheme = null;
}

const preferredTheme = window.matchMedia?.(
  "(prefers-color-scheme: light)",
).matches
  ? "light"
  : "dark";

root.dataset.theme = savedTheme || preferredTheme;

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;

  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch {
    // The theme still applies for the current page when storage is unavailable.
  }
});

navToggle?.addEventListener("click", () => {
  if (!navLinks) return;

  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
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
    {
      threshold: 0.08,
      rootMargin: "0px 0px -24px",
    },
  );

  document
    .querySelectorAll("[data-reveal]")
    .forEach((element) => revealObserver.observe(element));
} else {
  document
    .querySelectorAll("[data-reveal]")
    .forEach((element) => element.classList.add("is-visible"));
}

const yearElement = document.querySelector("#current-year");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

// Autoplay requires a muted, inline video on most browsers.
// Playback is paused while the card is outside the viewport.
if (portfolioVideo) {
  portfolioVideo.muted = true;
  portfolioVideo.defaultMuted = true;

  const tryPlayback = () => portfolioVideo.play().catch(() => {});

  portfolioVideo.addEventListener("canplay", tryPlayback, {
    once: true,
  });

  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlayback();
        } else {
          portfolioVideo.pause();
        }
      },
      {
        threshold: 0.25,
      },
    );

    videoObserver.observe(portfolioVideo);
  } else {
    tryPlayback();
  }
}

function initialiseCarousel(carousel) {
  const slides = Array.from(
    carousel.querySelectorAll(".carousel-slide"),
  );

  const dots = Array.from(
    carousel.querySelectorAll(".carousel-dots span"),
  );

  if (slides.length < 2) return;

  let currentIndex = 0;
  let timerId = null;
  let isVisible = true;

  const interval = Math.max(
    2200,
    Number(carousel.dataset.interval) || 3800,
  );

  const showSlide = (nextIndex) => {
    currentIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;

      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  };

  const stop = () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

const start = () => {
  stop();

  if (!isVisible || document.hidden) {
    return;
  }

  timerId = window.setInterval(() => {
    showSlide(currentIndex + 1);
  }, interval);
};

  slides.forEach((slide, index) => {
    slide.setAttribute("aria-hidden", String(index !== 0));
  });

  showSlide(0);

  if ("IntersectionObserver" in window) {
    const carouselObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (isVisible) {
          start();
        } else {
          stop();
        }
      },
      {
        threshold: 0.18,
      },
    );

    carouselObserver.observe(carousel);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });


  start();
}

document
  .querySelectorAll("[data-carousel]")
  .forEach(initialiseCarousel);
