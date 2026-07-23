const GITHUB_USERNAME = "GitM3";
const REPO_LIMIT = 12;
const HIDDEN_REPOSITORIES = new Set([
  GITHUB_USERNAME.toLowerCase(),
  `${GITHUB_USERNAME.toLowerCase()}.github.io`,
]);

const fallbackRepositories = [
  {
    name: "mobile-slam",
    html_url: "https://github.com/GitM3",
    description: "Real-time mobile SLAM and visual-odometry experiments using Qt and OpenCV.",
    language: "C++",
    topics: ["slam", "opencv", "qt"],
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    name: "embedded-vision-platform",
    html_url: "https://github.com/GitM3",
    description: "Edge computer-vision system architecture for embedded Linux platforms.",
    language: "Python",
    topics: ["computer-vision", "embedded-linux", "docker"],
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    name: "robot-perception-lab",
    html_url: "https://github.com/GitM3",
    description: "A collection of perception and ROS experiments for autonomous robots.",
    language: "C++",
    topics: ["ros", "robotics", "perception"],
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2025-01-01T00:00:00Z",
  },
];

const languagePalette = {
  "C++": ["#88c0d0", "rgba(136, 192, 208, 0.18)"],
  C: ["#81a1c1", "rgba(129, 161, 193, 0.18)"],
  Python: ["#a3be8c", "rgba(163, 190, 140, 0.18)"],
  JavaScript: ["#ebcb8b", "rgba(235, 203, 139, 0.18)"],
  TypeScript: ["#5e81ac", "rgba(94, 129, 172, 0.18)"],
  HTML: ["#d08770", "rgba(208, 135, 112, 0.18)"],
  CSS: ["#b48ead", "rgba(180, 142, 173, 0.18)"],
  MATLAB: ["#bf616a", "rgba(191, 97, 106, 0.18)"],
  default: ["#8fbcbb", "rgba(143, 188, 187, 0.18)"],
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readableName(name) {
  return name
    .replaceAll(/[-_]+/g, " ")
    .replaceAll(/\b\w/g, (letter) => letter.toUpperCase());
}

function repositoryInitials(name) {
  const parts = name.split(/[-_\s]+/).filter(Boolean);
  return (parts.length > 1 ? parts.slice(0, 2).map((part) => part[0]) : name.slice(0, 2))
    .join("")
    .toUpperCase();
}

function relativeUpdate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recently updated";

  const months = Math.max(0, Math.round((Date.now() - date.getTime()) / 2_629_800_000));
  if (months < 1) return "Updated this month";
  if (months === 1) return "Updated 1 month ago";
  if (months < 12) return `Updated ${months} months ago`;

  const years = Math.round(months / 12);
  return `Updated ${years} ${years === 1 ? "year" : "years"} ago`;
}

function createRepositoryCard(repo) {
  const language = repo.language || "Project";
  const palette = languagePalette[language] || languagePalette.default;
  const topics = (repo.topics || []).slice(0, 3);
  const description = repo.description || "Open-source engineering project. Open the repository for documentation and source code.";
  const statsLabel = `${repo.stargazers_count || 0} stars · ${repo.forks_count || 0} forks`;

  const article = document.createElement("article");
  article.className = "repo-card";
  article.style.setProperty("--repo-accent", palette[0]);
  article.style.setProperty("--repo-accent-soft", palette[1]);
  article.innerHTML = `
    <div class="repo-thumb">
      <span class="repo-monogram" aria-hidden="true">${escapeHtml(repositoryInitials(repo.name))}</span>
      <span class="repo-language">${escapeHtml(language)}</span>
    </div>
    <div class="repo-body">
      <h3>${escapeHtml(readableName(repo.name))}</h3>
      <p>${escapeHtml(description)}</p>
      <div class="repo-topics">
        ${topics.map((topic) => `<span>${escapeHtml(topic)}</span>`).join("")}
      </div>
      <div class="repo-stats">
        <span>${escapeHtml(relativeUpdate(repo.updated_at))}</span>
        <span>${escapeHtml(statsLabel)}</span>
      </div>
    </div>
    <a class="repo-link-overlay" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noreferrer" aria-label="Open ${escapeHtml(readableName(repo.name))} on GitHub"></a>
  `;
  return article;
}

async function loadRepositories() {
  const carousel = document.querySelector("#repo-carousel");
  const status = document.querySelector("#repo-status");

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const repositories = (await response.json())
      .filter((repo) => !repo.fork && !repo.archived && !HIDDEN_REPOSITORIES.has(repo.name.toLowerCase()))
      .slice(0, REPO_LIMIT);

    if (!repositories.length) throw new Error("No public repositories found");

    carousel.replaceChildren(...repositories.map(createRepositoryCard));
    status.textContent = `${repositories.length} public repositories · scroll or use the arrow controls`;
  } catch (error) {
    carousel.replaceChildren(...fallbackRepositories.map(createRepositoryCard));
    status.textContent = "GitHub could not be reached, so local showcase cards are displayed.";
    console.info("Repository fallback used:", error.message);
  }

  updateCarouselControls();
}

const carousel = document.querySelector("#repo-carousel");
const previousButton = document.querySelector(".carousel-prev");
const nextButton = document.querySelector(".carousel-next");

function carouselStep() {
  const firstCard = carousel.querySelector(".repo-card");
  if (!firstCard) return 360;
  return firstCard.getBoundingClientRect().width + 18;
}

function updateCarouselControls() {
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;
  previousButton.disabled = carousel.scrollLeft <= 4;
  nextButton.disabled = carousel.scrollLeft >= maxScroll - 4;
}

previousButton.addEventListener("click", () => {
  carousel.scrollBy({ left: -carouselStep(), behavior: "smooth" });
});

nextButton.addEventListener("click", () => {
  carousel.scrollBy({ left: carouselStep(), behavior: "smooth" });
});

carousel.addEventListener("scroll", updateCarouselControls, { passive: true });
window.addEventListener("resize", updateCarouselControls);

const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

document.documentElement.dataset.theme = savedTheme || preferredTheme;

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
});

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
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
  { threshold: 0.12, rootMargin: "0px 0px -40px" },
);

document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
document.querySelector("#current-year").textContent = new Date().getFullYear();

loadRepositories();
