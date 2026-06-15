/**
 * UI 인터랙션 초기화
 * - nav 활성 섹션 하이라이트
 * - 햄버거 메뉴 토글
 * - fade-in 애니메이션
 */
function initUI() {
  initNavHighlight();
  initHamburgerMenu();
  initFadeInAnimation();
}

/**
 * 스크롤 시 nav 활성 섹션 하이라이트 (IntersectionObserver)
 */
function initNavHighlight() {
  const navLinks = [
    ...document.querySelectorAll(".site-nav__link[data-section]"),
  ];
  const sections = document.querySelectorAll(".section");

  if (!navLinks.length || !sections.length) return;

  const linkMap = new Map(navLinks.map((link) => [link.dataset.section, link]));

  const sectionVisibility = new Map();

  const setActiveSection = (sectionId) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === sectionId);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sectionVisibility.set(
          entry.target.id,
          entry.isIntersecting ? entry.intersectionRatio : 0,
        );
      });

      let activeSectionId = sections[0]?.id || "";
      let highestRatio = 0;

      sectionVisibility.forEach((ratio, sectionId) => {
        if (ratio > highestRatio) {
          highestRatio = ratio;
          activeSectionId = sectionId;
        }
      });

      if (linkMap.has(activeSectionId)) {
        setActiveSection(activeSectionId);
      }
    },
    {
      root: null,
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    },
  );

  sections.forEach((section) => {
    sectionVisibility.set(section.id, 0);
    observer.observe(section);
  });

  setActiveSection(sections[0]?.id || "hero");
}

/**
 * 햄버거 메뉴 토글 (모바일)
 */
function initHamburgerMenu() {
  console.log("hamburger init");
  const toggleBtn = document.querySelector(".site-nav__toggle");
  const menu = document.querySelector(".site-nav__menu");

  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = toggleBtn.classList.toggle("is-open");
    menu.classList.toggle("is-open", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
  });

  // 메뉴 링크 클릭 시 모바일 메뉴 닫기
  menu.querySelectorAll(".site-nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      toggleBtn.classList.remove("is-open");
      menu.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-label", "메뉴 열기");
    });
  });
}

/**
 * 스크롤 시 요소 fade-in 애니메이션 (IntersectionObserver)
 */
function initFadeInAnimation() {
  const targets = document.querySelectorAll(".section__inner");

  if (!targets.length) return;

  targets.forEach((el) => el.classList.add("fade-in"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    },
  );

  targets.forEach((target) => observer.observe(target));
}

// DOM 준비 후 UI 초기화
document.addEventListener("DOMContentLoaded", initUI);
