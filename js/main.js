/**
 * 포트폴리오 데이터 로딩 및 섹션 렌더링 진입점
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('./data/portfolio.json');

    if (!response.ok) {
      throw new Error(`데이터 로딩 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // renderer.js의 각 섹션 렌더 함수 순서대로 호출
    renderHero(data.hero);
    renderAbout(data.about);
    renderTechStack(data.techStack);
    renderProjects(data.projects);
    renderExperience(data.experience);
    renderContact(data.contact);
  } catch (error) {
    console.error('[Portfolio] 초기화 중 오류가 발생했습니다:', error);

    const main = document.querySelector('main');
    if (main) {
      const errorMessage = document.createElement('p');
      errorMessage.className = 'portfolio-error';
      errorMessage.textContent = '포트폴리오 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
      errorMessage.style.cssText = 'padding: var(--space-xl); text-align: center; color: var(--color-accent);';
      main.prepend(errorMessage);
    }
  }
});