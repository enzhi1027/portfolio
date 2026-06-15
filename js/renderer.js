/**
 * Hero 섹션 렌더링
 * @param {Object} hero - hero 데이터
 */
function renderHero(hero) {
  const inner = document.querySelector('#hero .section__inner');
  if (!inner || !hero) return;

  const scrollIndicator = hero.scrollIndicator
    ? `<a href="#about" class="hero__scroll" aria-label="아래로 스크롤">
         <span class="hero__scroll-arrow" aria-hidden="true"></span>
       </a>`
    : '';

  const ctaPrimary = hero.ctaPrimary
    ? `<a href="${hero.ctaPrimary.href}" class="hero__btn hero__btn--primary"${hero.ctaPrimary.href.endsWith('.pdf') ? ' download' : ''}>${hero.ctaPrimary.label}</a>`
    : '';

  const ctaSecondary = hero.ctaSecondary
    ? `<a href="${hero.ctaSecondary.href}" class="hero__btn hero__btn--secondary" target="_blank" rel="noopener noreferrer">${hero.ctaSecondary.label}</a>`
    : '';

  inner.innerHTML = `
    <div class="hero">
      <div class="hero__content">
        <p class="hero__name-en">${hero.nameEn}</p>
        <h1 id="hero-heading" class="hero__name">${hero.name}</h1>
        <p class="hero__tagline">${hero.tagline}</p>
        <p class="hero__sub-tagline">${hero.subTagline}</p>
        <div class="hero__cta">
          ${ctaPrimary}
          ${ctaSecondary}
        </div>
      </div>
      ${scrollIndicator}
    </div>
  `;
}

/**
 * About 섹션 이니셜 fallback 값 반환
 * @param {Object} about - about 데이터
 * @returns {string}
 */
function getAboutInitials(about) {
  if (about.initials) return about.initials;

  if (about.nameEn) {
    return about.nameEn
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  return 'EJ';
}

/**
 * About 섹션 프로필 이미지 fallback 처리
 * @param {HTMLElement} inner - about 섹션 inner 요소
 * @param {Object} about - about 데이터
 */
function bindAboutAvatarFallback(inner, about) {
  const avatar = inner.querySelector('.about__avatar');
  const image = inner.querySelector('.about__image');

  if (!avatar) return;

  const showFallback = () => avatar.classList.add('about__avatar--fallback');

  if (!about.profileImage) {
    showFallback();
    return;
  }

  if (!image) {
    showFallback();
    return;
  }

  image.addEventListener('error', showFallback, { once: true });

  if (image.complete && image.naturalWidth === 0) {
    showFallback();
  }
}

/**
 * About 섹션 렌더링
 * @param {Object} about - about 데이터
 */
function renderAbout(about) {
  const inner = document.querySelector('#about .section__inner');
  if (!inner || !about) return;

  const initials = getAboutInitials(about);

  const keywords = Array.isArray(about.keywords)
    ? about.keywords
        .map((keyword) => `<li class="about__keyword">${keyword}</li>`)
        .join('')
    : '';

  const statusBadge = about.availableForWork
    ? `<div class="about__status">
         <span class="about__status-dot" aria-hidden="true"></span>
         <span class="about__status-label">${about.availableLabel}</span>
       </div>`
    : '';

  const profileImage = about.profileImage
    ? `<img class="about__image" src="${about.profileImage}" alt="이은지 프로필 사진" loading="lazy" />`
    : '';

  inner.innerHTML = `
    <div class="about">
      <div class="about__media">
        <div class="about__avatar">
          ${profileImage}
          <span class="about__initials" aria-hidden="true">${initials}</span>
        </div>
        ${statusBadge}
      </div>
      <div class="about__content">
        <h2 id="about-heading" class="about__title">About</h2>
        <p class="about__summary">${about.summary}</p>
        <ul class="about__keywords">${keywords}</ul>
      </div>
    </div>
  `;

  bindAboutAvatarFallback(inner, about);
}

/**
 * Tech Stack 탭 버튼 라벨 반환
 * @param {string} categoryName - 카테고리 이름
 * @returns {string}
 */
function getTechStackTabLabel(categoryName) {
  if (categoryName === 'Infra / DevOps') return 'Infra';
  return categoryName;
}

/**
 * Tech Stack 아이템 HTML 생성
 * @param {Object} item - 기술 아이템 데이터
 * @returns {string}
 */
function renderTechStackItem(item) {
  const hasNote = Boolean(item.note && item.note.trim());
  const noteClass = hasNote ? ' techstack__item--has-note' : '';
  const tooltip = hasNote
    ? `<span class="techstack__tooltip" role="tooltip">${item.note}</span>`
    : '';

  return `
    <li class="techstack__item${noteClass}">
      <div class="techstack__item-header">
        <span class="techstack__item-name">${item.name}</span>
        ${tooltip}
      </div>
      <div class="techstack__bar" aria-hidden="true">
        <div class="techstack__bar-fill" data-level="${item.level}" style="width: 0%"></div>
      </div>
      <span class="techstack__level" aria-label="숙련도 ${item.level}단계">${item.level}/5</span>
    </li>
  `;
}

/**
 * Tech Stack progress bar 애니메이션 실행
 * @param {HTMLElement} panel - 카테고리 패널 요소
 */
function animateTechStackBars(panel) {
  if (!panel) return;

  panel.querySelectorAll('.techstack__bar-fill:not(.is-animated)').forEach((fill) => {
    const level = Number(fill.dataset.level) || 0;
    const percent = (level / 5) * 100;

    fill.classList.add('is-animated');
    // transition 적용을 위해 다음 프레임에 width 설정
    requestAnimationFrame(() => {
      fill.style.width = `${percent}%`;
    });
  });
}

/**
 * Tech Stack 카테고리 탭 전환 바인딩
 * @param {HTMLElement} inner - tech-stack 섹션 inner 요소
 */
function bindTechStackTabs(inner) {
  const tabs = inner.querySelectorAll('.techstack__tab');
  const panels = inner.querySelectorAll('.techstack__panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const index = tab.dataset.categoryIndex;

      tabs.forEach((btn) => {
        const isActive = btn.dataset.categoryIndex === index;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.categoryIndex === index;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });

      const activePanel = inner.querySelector(`.techstack__panel[data-category-index="${index}"]`);
      animateTechStackBars(activePanel);
    });
  });
}

/**
 * Tech Stack progress bar 뷰포트 진입 애니메이션 바인딩
 * @param {HTMLElement} inner - tech-stack 섹션 inner 요소
 */
function bindTechStackProgress(inner) {
  const section = document.querySelector('#tech-stack');
  if (!section) return;

  const runActivePanelAnimation = () => {
    const activePanel = inner.querySelector('.techstack__panel.is-active');
    animateTechStackBars(activePanel);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runActivePanelAnimation();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(section);
}

/**
 * Tech Stack 섹션 렌더링
 * @param {Object} techStack - techStack 데이터
 */
function renderTechStack(techStack) {
  const inner = document.querySelector('#tech-stack .section__inner');
  if (!inner || !techStack || !Array.isArray(techStack.categories)) return;

  const tabs = techStack.categories
    .map((category, index) => {
      const isActive = index === 0;
      const label = getTechStackTabLabel(category.name);
      return `<button
        type="button"
        class="techstack__tab${isActive ? ' is-active' : ''}"
        role="tab"
        aria-selected="${isActive}"
        aria-controls="techstack-panel-${index}"
        id="techstack-tab-${index}"
        data-category-index="${index}"
      >${label}</button>`;
    })
    .join('');

  const panels = techStack.categories
    .map((category, index) => {
      const isActive = index === 0;
      const items = Array.isArray(category.items)
        ? category.items.map(renderTechStackItem).join('')
        : '';

      return `<div
        class="techstack__panel${isActive ? ' is-active' : ''}"
        id="techstack-panel-${index}"
        role="tabpanel"
        aria-labelledby="techstack-tab-${index}"
        data-category-index="${index}"
        ${isActive ? '' : 'hidden'}
      >
        <ul class="techstack__items">${items}</ul>
      </div>`;
    })
    .join('');

  const levelGuide = techStack.levelGuide
    ? Object.entries(techStack.levelGuide)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(
          ([level, label]) =>
            `<li class="techstack__guide-item"><span class="techstack__guide-level">${level}</span><span class="techstack__guide-label">${label}</span></li>`
        )
        .join('')
    : '';

  inner.innerHTML = `
    <div class="techstack">
      <h2 id="tech-stack-heading" class="techstack__title">Tech Stack</h2>
      <div class="techstack__tabs" role="tablist" aria-label="기술 스택 카테고리">${tabs}</div>
      <div class="techstack__panels">${panels}</div>
      <div class="techstack__legend">
        <p class="techstack__legend-title">숙련도 기준</p>
        <ul class="techstack__guide">${levelGuide}</ul>
      </div>
    </div>
  `;

  bindTechStackTabs(inner);
  bindTechStackProgress(inner);
}

/**
 * Projects 팀 규모 뱃지 텍스트 반환
 * @param {number} teamSize - 팀 인원
 * @returns {string}
 */
function getProjectTeamBadge(teamSize) {
  if (teamSize <= 1) return '개인 프로젝트';
  return `팀 프로젝트 (${teamSize}인)`;
}

/**
 * Projects 썸네일 fallback 텍스트 반환
 * @param {Object} project - 프로젝트 데이터
 * @returns {string}
 */
function getProjectThumbFallback(project) {
  if (Array.isArray(project.techStack) && project.techStack.length > 0) {
    return project.techStack[0];
  }
  return project.title;
}

/**
 * Projects 링크 버튼 목록 생성
 * @param {Object} project - 프로젝트 데이터
 * @returns {string}
 */
function renderProjectLinks(project) {
  const links = [];

  if (project.liveUrl) {
    links.push({
      href: project.liveUrl,
      label: 'Live Demo',
      ariaLabel: `${project.title} Live Demo`,
      className: 'projects__link projects__link--live',
      external: true,
    });
  }

  if (project.demoVideo) {
    links.push({
      href: project.demoVideo,
      label: 'Demo Video',
      ariaLabel: `${project.title} Demo Video`,
      className: 'projects__link projects__link--video',
      external: true,
    });
  }

  if (project.github) {
    links.push({
      href: project.github,
      label: 'GitHub',
      ariaLabel: `${project.title} GitHub 저장소`,
      className: 'projects__link projects__link--github',
      external: true,
    });
  }

  if (!links.length) return '';

  return links
    .map(
      (link) =>
        `<a href="${link.href}" class="${link.className}" target="_blank" rel="noopener noreferrer" aria-label="${link.ariaLabel}">${link.label}</a>`
    )
    .join('');
}

/**
 * Projects 카드 HTML 생성
 * @param {Object} project - 프로젝트 데이터
 * @returns {string}
 */
function renderProjectCard(project) {
  const fallback = getProjectThumbFallback(project);
  const badge = getProjectTeamBadge(project.teamSize);
  const highlight = project.highlights
    ? `<blockquote class="projects__highlight">${project.highlights}</blockquote>`
    : '';

  const thumbnail = project.thumbnail
    ? `<img class="projects__thumb-image" src="${project.thumbnail}" alt="${project.title} 프로젝트 썸네일" loading="lazy" />
       <span class="projects__thumb-fallback" aria-hidden="true">${fallback}</span>`
    : `<span class="projects__thumb-fallback is-visible">${fallback}</span>`;

  return `
    <article
      class="projects__card"
      data-project-id="${project.id}"
      tabindex="0"
      role="button"
      aria-label="${project.title} 프로젝트 상세 보기"
    >
      <div class="projects__thumb">${thumbnail}</div>
      <div class="projects__body">
        <span class="projects__badge">${badge}</span>
        <h3 class="projects__card-title">${project.title}</h3>
        <p class="projects__subtitle">${project.subtitle}</p>
        <p class="projects__meta">${project.period} · ${project.role}</p>
        ${highlight}
      </div>
    </article>
  `;
}

/**
 * Projects 모달 상세 HTML 생성
 * @param {Object} project - 프로젝트 데이터
 * @returns {string}
 */
function renderProjectModalContent(project) {
  const fallback = getProjectThumbFallback(project);
  const badge = getProjectTeamBadge(project.teamSize);

  const thumbnail = project.thumbnail
    ? `<img class="projects__modal-image" src="${project.thumbnail}" alt="${project.title} 프로젝트 썸네일" loading="lazy" />
       <span class="projects__modal-fallback" aria-hidden="true">${fallback}</span>`
    : `<span class="projects__modal-fallback is-visible">${fallback}</span>`;

  const features = Array.isArray(project.features)
    ? project.features.map((feature) => `<li>${feature}</li>`).join('')
    : '';

  const techTags = Array.isArray(project.techStack)
    ? project.techStack
        .map((tech) => `<li class="projects__tag">${tech}</li>`)
        .join('')
    : '';

  const architecture = project.architectureDiagram
    ? `<figure class="projects__diagram">
         <img src="${project.architectureDiagram}" alt="${project.title} 아키텍처 다이어그램" loading="lazy" />
       </figure>`
    : '';

  const links = renderProjectLinks(project);

  return `
    <div class="projects__modal-thumb">${thumbnail}</div>
    <div class="projects__modal-header">
      <span class="projects__badge">${badge}</span>
      <h3 id="projects-modal-title" class="projects__modal-title">${project.title}</h3>
      <p class="projects__modal-subtitle">${project.subtitle}</p>
      <p class="projects__modal-meta">${project.period} · ${project.role}</p>
    </div>
    <p class="projects__modal-description">${project.description}</p>
    <div class="projects__modal-section">
      <h4 class="projects__modal-label">주요 기능</h4>
      <ul class="projects__features">${features}</ul>
    </div>
    ${architecture}
    <div class="projects__modal-section">
      <h4 class="projects__modal-label">Tech Stack</h4>
      <ul class="projects__tags">${techTags}</ul>
    </div>
    ${links ? `<div class="projects__modal-links">${links}</div>` : ''}
  `;
}

/**
 * Projects 썸네일 이미지 fallback 바인딩
 * @param {HTMLElement} root - projects 섹션 루트 요소
 */
function bindProjectThumbnails(root) {
  root.querySelectorAll('.projects__thumb-image, .projects__modal-image').forEach((image) => {
    const showFallback = () => {
      const wrapper = image.parentElement;
      if (!wrapper) return;
      image.classList.add('is-hidden');
      const fallback = wrapper.querySelector('.projects__thumb-fallback, .projects__modal-fallback');
      if (fallback) fallback.classList.add('is-visible');
    };

    image.addEventListener('error', showFallback, { once: true });

    if (image.complete && image.naturalWidth === 0) {
      showFallback();
    }
  });
}

/**
 * Projects 모달 열기/닫기 바인딩
 * @param {HTMLElement} inner - projects 섹션 inner 요소
 * @param {Array} projects - projects 데이터
 */
function bindProjectsModal(inner, projects) {
  const modal = inner.querySelector('.projects__modal');
  const backdrop = inner.querySelector('.projects__modal-backdrop');
  const closeBtn = inner.querySelector('.projects__modal-close');
  const content = inner.querySelector('.projects__modal-content');

  if (!modal || !content) return;

  const projectMap = new Map(projects.map((project) => [project.id, project]));

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('hidden', '');
    document.body.classList.remove('is-modal-open');
  };

  const openModal = (projectId) => {
    const project = projectMap.get(projectId);
    if (!project) return;

    content.innerHTML = renderProjectModalContent(project);
    bindProjectThumbnails(modal);
    modal.classList.add('is-open');
    modal.removeAttribute('hidden');
    document.body.classList.add('is-modal-open');
    closeBtn.focus();
  };

  inner.querySelectorAll('.projects__card').forEach((card) => {
    const open = () => openModal(card.dataset.projectId);

    card.addEventListener('click', open);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/**
 * Projects 섹션 렌더링
 * @param {Array} projects - projects 데이터
 */
function renderProjects(projects) {
  const inner = document.querySelector('#projects .section__inner');
  if (!inner || !Array.isArray(projects) || !projects.length) return;

  const cards = projects.map(renderProjectCard).join('');

  inner.innerHTML = `
    <div class="projects">
      <h2 id="projects-heading" class="projects__title">Projects</h2>
      <div class="projects__grid">${cards}</div>
      <div class="projects__modal" hidden>
        <div class="projects__modal-backdrop" aria-hidden="true"></div>
        <div
          class="projects__modal-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="projects-modal-title"
        >
          <button type="button" class="projects__modal-close" aria-label="모달 닫기">&times;</button>
          <div class="projects__modal-content"></div>
        </div>
      </div>
    </div>
  `;

  bindProjectThumbnails(inner);
  bindProjectsModal(inner, projects);
}

/**
 * Experience 활동 데이터 유효성 검사
 * @param {Array} activities - activities 데이터
 * @returns {boolean}
 */
function hasValidActivities(activities) {
  if (!Array.isArray(activities)) return false;

  return activities.some(
    (activity) =>
      Boolean(activity.title?.trim()) ||
      Boolean(activity.period?.trim()) ||
      Boolean(activity.description?.trim())
  );
}

/**
 * Experience 교육 시간 포맷
 * @param {string} hours - hours 문자열
 * @returns {string}
 */
function formatTrainingHours(hours) {
  if (!hours) return '';

  const numeric = String(hours).replace(/[^\d]/g, '');
  return numeric ? `총 ${numeric}시간` : hours;
}

/**
 * Experience 학력 타임라인 아이템 HTML 생성
 * @param {Object} item - 학력 데이터
 * @returns {string}
 */
function renderEducationTimelineItem(item) {
  const note = item.note ? `<p class="experience__note">${item.note}</p>` : '';

  return `
    <li class="experience__timeline-item">
      <div class="experience__timeline-dot" aria-hidden="true"></div>
      <article class="experience__card">
        <span class="experience__status">${item.status}</span>
        <h3 class="experience__card-title">${item.institution}</h3>
        <p class="experience__card-subtitle">${item.major} · ${item.degree}</p>
        <p class="experience__period">${item.period}</p>
        ${note}
      </article>
    </li>
  `;
}

/**
 * Experience 교육 타임라인 아이템 HTML 생성
 * @param {Object} item - 교육 데이터
 * @returns {string}
 */
function renderTrainingTimelineItem(item) {
  const hours = formatTrainingHours(item.hours);
  const periodMeta = hours ? `${item.period} · ${hours}` : item.period;

  const skills = Array.isArray(item.skills)
    ? item.skills
        .map((skill) => `<li class="experience__skill">${skill}</li>`)
        .join('')
    : '';

  return `
    <li class="experience__timeline-item">
      <div class="experience__timeline-dot" aria-hidden="true"></div>
      <article class="experience__card">
        <span class="experience__status">${item.status}</span>
        <h3 class="experience__card-title">${item.institution}</h3>
        <p class="experience__card-subtitle">${item.courseName}</p>
        <p class="experience__period">${periodMeta}</p>
        <ul class="experience__skills">${skills}</ul>
      </article>
    </li>
  `;
}

/**
 * Experience 자격증 카드 HTML 생성
 * @param {Object} item - 자격증 데이터
 * @returns {string}
 */
function renderCertificationCard(item) {
  return `
    <article class="experience__cert">
      <span class="experience__cert-icon" aria-hidden="true">🏆</span>
      <div class="experience__cert-body">
        <h3 class="experience__cert-name">${item.name}</h3>
        <p class="experience__cert-issuer">${item.issuer}</p>
        <p class="experience__cert-date">${item.date} · ${item.status}</p>
      </div>
    </article>
  `;
}

/**
 * Experience 활동 카드 HTML 생성
 * @param {Object} item - 활동 데이터
 * @returns {string}
 */
function renderActivityCard(item) {
  return `
    <article class="experience__activity">
      <h3 class="experience__activity-title">${item.title}</h3>
      <p class="experience__period">${item.period}</p>
      <p class="experience__activity-desc">${item.description}</p>
    </article>
  `;
}

/**
 * Experience 탭 전환 바인딩
 * @param {HTMLElement} inner - experience 섹션 inner 요소
 */
function bindExperienceTabs(inner) {
  const tabs = inner.querySelectorAll('.experience__tab');
  const panels = inner.querySelectorAll('.experience__panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;

      tabs.forEach((btn) => {
        const isActive = btn.dataset.tab === tabId;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.tab === tabId;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });
    });
  });
}

/**
 * Experience 섹션 렌더링
 * @param {Object} experience - experience 데이터
 */
function renderExperience(experience) {
  const inner = document.querySelector('#experience .section__inner');
  if (!inner || !experience) return;

  const tabs = [
    { id: 'education', label: '학력' },
    { id: 'training', label: '교육' },
    { id: 'certifications', label: '자격증' },
  ];

  if (hasValidActivities(experience.activities)) {
    tabs.push({ id: 'activities', label: '활동' });
  }

  const defaultTab = 'training';

  const tabButtons = tabs
    .map((tab) => {
      const isActive = tab.id === defaultTab;
      return `<button
        type="button"
        class="experience__tab${isActive ? ' is-active' : ''}"
        role="tab"
        aria-selected="${isActive}"
        aria-controls="experience-panel-${tab.id}"
        id="experience-tab-${tab.id}"
        data-tab="${tab.id}"
      >${tab.label}</button>`;
    })
    .join('');

  const educationItems = Array.isArray(experience.education)
    ? experience.education.map(renderEducationTimelineItem).join('')
    : '';

  const trainingItems = Array.isArray(experience.training)
    ? experience.training.map(renderTrainingTimelineItem).join('')
    : '';

  const certificationCards = Array.isArray(experience.certifications)
    ? experience.certifications.map(renderCertificationCard).join('')
    : '';

  const activityCards = hasValidActivities(experience.activities)
    ? experience.activities
        .filter(
          (activity) =>
            activity.title?.trim() ||
            activity.period?.trim() ||
            activity.description?.trim()
        )
        .map(renderActivityCard)
        .join('')
    : '';

  const panels = tabs
    .map((tab) => {
      const isActive = tab.id === defaultTab;
      let content = '';

      if (tab.id === 'education') {
        content = `<ol class="experience__timeline">${educationItems}</ol>`;
      } else if (tab.id === 'training') {
        content = `<ol class="experience__timeline">${trainingItems}</ol>`;
      } else if (tab.id === 'certifications') {
        content = `<div class="experience__cert-list">${certificationCards}</div>`;
      } else if (tab.id === 'activities') {
        content = `<div class="experience__activity-list">${activityCards}</div>`;
      }

      return `<div
        class="experience__panel${isActive ? ' is-active' : ''}"
        id="experience-panel-${tab.id}"
        role="tabpanel"
        aria-labelledby="experience-tab-${tab.id}"
        data-tab="${tab.id}"
        ${isActive ? '' : 'hidden'}
      >${content}</div>`;
    })
    .join('');

  inner.innerHTML = `
    <div class="experience">
      <h2 id="experience-heading" class="experience__title">Experience</h2>
      <div class="experience__tabs" role="tablist" aria-label="경력 및 학습 이력">${tabButtons}</div>
      <div class="experience__panels">${panels}</div>
    </div>
  `;

  bindExperienceTabs(inner);
}

/**
 * Contact 아이콘 SVG 반환
 * @param {string} type - 아이콘 타입
 * @returns {string}
 */
function getContactIcon(type) {
  const icons = {
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2 1a13 13 0 006 6l1-2 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10 10 0 0012 2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 8.5A1.75 1.75 0 118.25 6.75 1.75 1.75 0 016.5 8.5zM5 20v-9h3v9zm5 0v-9h2.9v1.3h.04a3.18 3.18 0 012.86-1.57c3.06 0 3.63 2 3.63 4.6V20h-3v-4.6c0-1.1-.02-2.52-1.54-2.52-1.54 0-1.77 1.2-1.77 2.44V20z"/></svg>',
    blog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/></svg>',
  };

  return icons[type] || '';
}

/**
 * Contact 연락처 링크 HTML 생성
 * @param {string} type - 링크 타입
 * @param {string} href - 링크 URL
 * @param {string} label - 표시 텍스트
 * @param {boolean} external - 새 탭 여부
 * @returns {string}
 */
function renderContactLink(type, href, label, external = false) {
  const externalAttrs = external
    ? ` target="_blank" rel="noopener noreferrer" aria-label="${label} 페이지 열기"`
    : '';

  return `
    <a href="${href}" class="contact__link"${externalAttrs}>
      <span class="contact__icon" aria-hidden="true">${getContactIcon(type)}</span>
      <span class="contact__link-text">${label}</span>
    </a>
  `;
}

/**
 * Contact 폼 유효성 검사
 * @param {Object} values - 입력값
 * @returns {{ valid: boolean, errors: Object }}
 */
function validateContactForm(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.name.trim()) {
    errors.name = '이름을 입력해 주세요.';
  }

  if (!values.email.trim()) {
    errors.email = '이메일을 입력해 주세요.';
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = '올바른 이메일 형식을 입력해 주세요.';
  }

  if (!values.message.trim()) {
    errors.message = '메시지를 입력해 주세요.';
  } else if (values.message.trim().length < 10) {
    errors.message = '메시지는 최소 10자 이상 입력해 주세요.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Contact 폼 제출 및 유효성 검사 바인딩
 * @param {HTMLElement} inner - contact 섹션 inner 요소
 * @param {Object} contact - contact 데이터
 */
function bindContactForm(inner, contact) {
  const form = inner.querySelector('.contact__form');
  if (!form) return;

  const successEl = inner.querySelector('.contact__success');
  const fields = {
    name: form.querySelector('#contact-name'),
    email: form.querySelector('#contact-email'),
    message: form.querySelector('#contact-message'),
  };

  const errorEls = {
    name: form.querySelector('[data-error="name"]'),
    email: form.querySelector('[data-error="email"]'),
    message: form.querySelector('[data-error="message"]'),
  };

  const showErrors = (errors) => {
    Object.entries(errorEls).forEach(([key, el]) => {
      const message = errors[key] || '';
      if (el) el.textContent = message;
      if (fields[key]) fields[key].setAttribute('aria-invalid', message ? 'true' : 'false');
    });
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (successEl) {
      successEl.hidden = true;
      successEl.textContent = '';
    }

    const values = {
      name: fields.name.value,
      email: fields.email.value,
      message: fields.message.value,
    };

    const { valid, errors } = validateContactForm(values);
    showErrors(errors);

    if (!valid) return;

    const subject = encodeURIComponent(`Portfolio Contact from ${values.name.trim()}`);
    const body = encodeURIComponent(
      `이름: ${values.name.trim()}\n이메일: ${values.email.trim()}\n\n${values.message.trim()}`
    );

    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;

    if (successEl) {
      successEl.textContent = '메일 앱이 열리면 메시지를 전송해 주세요. 감사합니다!';
      successEl.hidden = false;
    }

    form.reset();
    showErrors({});
  });
}

/**
 * Contact 섹션 렌더링
 * @param {Object} contact - contact 데이터
 */
function renderContact(contact) {
  const inner = document.querySelector('#contact .section__inner');
  if (!inner || !contact) return;

  const links = [];

  if (contact.email) {
    links.push(renderContactLink('email', `mailto:${contact.email}`, contact.email));
  }

  if (contact.phone) {
    links.push(renderContactLink('phone', `tel:${contact.phone.replace(/-/g, '')}`, contact.phone));
  }

  if (contact.github) {
    links.push(renderContactLink('github', contact.github, 'GitHub', true));
  }

  if (contact.linkedin?.trim()) {
    links.push(renderContactLink('linkedin', contact.linkedin, 'LinkedIn', true));
  }

  if (contact.blog?.trim()) {
    links.push(renderContactLink('blog', contact.blog, 'Blog', true));
  }

  const placeholders = contact.formPlaceholder || {};
  const formSection = contact.formEnabled
    ? `
      <div class="contact__form-wrap">
        <form class="contact__form" novalidate>
          <div class="contact__field">
            <label class="contact__label" for="contact-name">${placeholders.name || '이름'}</label>
            <input class="contact__input" type="text" id="contact-name" name="name" required autocomplete="name" />
            <p class="contact__error" data-error="name" aria-live="polite"></p>
          </div>
          <div class="contact__field">
            <label class="contact__label" for="contact-email">${placeholders.email || '이메일'}</label>
            <input class="contact__input" type="email" id="contact-email" name="email" required autocomplete="email" />
            <p class="contact__error" data-error="email" aria-live="polite"></p>
          </div>
          <div class="contact__field">
            <label class="contact__label" for="contact-message">${placeholders.message || '메시지'}</label>
            <textarea class="contact__input contact__textarea" id="contact-message" name="message" rows="5" required></textarea>
            <p class="contact__error" data-error="message" aria-live="polite"></p>
          </div>
          <button type="submit" class="contact__submit">${placeholders.submit || '보내기'}</button>
          <p class="contact__success" hidden aria-live="polite"></p>
          ${contact.responseNote ? `<p class="contact__note">${contact.responseNote}</p>` : ''}
        </form>
      </div>
    `
    : '';

  inner.innerHTML = `
    <div class="contact">
      <h2 id="contact-heading" class="contact__title">Contact</h2>
      <div class="contact__layout">
        <div class="contact__info">
          <p class="contact__intro">프로젝트 협업, 채용 문의 등 편하게 연락해 주세요.</p>
          <div class="contact__links">${links.join('')}</div>
        </div>
        ${formSection}
      </div>
    </div>
  `;

  if (contact.formEnabled) {
    bindContactForm(inner, contact);
  }
}