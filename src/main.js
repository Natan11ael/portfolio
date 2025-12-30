//
// --- Generic values
const html = document.documentElement;
//
// --- Theme Managers
const theme_btn = document.getElementById('theme');
const theme_ico = theme_btn.querySelector('i');
const themes = [
  { icon: "fa-sun", name: "light" },
  { icon: "fa-moon", name: "dark" },
  { icon: "fa-circle-half-stroke", name: "auto" }
];
let theme_id = 2;
//
theme_btn.addEventListener('click', () => {
  theme_id = (theme_id + 1) % themes.length;
  const new_theme = themes[theme_id];

  theme_ico.className = `fa-solid ${new_theme.icon}`;

  applyTheme(new_theme.name);
});
function applyTheme(theme) {
  if (theme === 'auto') html.removeAttribute('data-theme');
  else html.setAttribute('data-theme', theme);
  localStorage.setItem('user-theme', theme);
}
//
//
const savedTheme = localStorage.getItem('user-theme') || 'auto';
applyTheme(savedTheme);
//
const initialThemeObj = themes.find(t => t.name === savedTheme) || themes[2];
theme_id = themes.indexOf(initialThemeObj);
theme_ico.className = `fa-solid ${initialThemeObj.icon}`;
//
// --- Header Menu Manager
const toggleIcon = document.querySelector('.toggle-icon');
const headerMenu = document.querySelector('header ul');
//
// Open Menu
toggleIcon.addEventListener('click', () => {
  toggleIcon.classList.toggle('open');
  headerMenu.classList.toggle('open');
});
//
// Close Menu
window.addEventListener('click', (e) => {
  if (headerMenu.classList.contains('open') &&
    !headerMenu.contains(e.target) &&
    !toggleIcon.contains(e.target)) {

    headerMenu.classList.remove('open');
    toggleIcon.classList.remove('open');
  }
});
//
headerMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    headerMenu.classList.remove('open');
    toggleIcon.classList.remove('open');
  });
});
//
// --- Header Hidden
let lastScrollY = window.scrollY;
const header = document.querySelector("header");
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (lastScrollY < window.scrollY && window.scrollY > 100) {
        header.classList.add("header-hidden");
      } else {
        header.classList.remove("header-hidden");
      }
      lastScrollY = window.scrollY;
      ticking = false;
    });
    ticking = true;
  }
});
//
// --- Section Active
const observerOptions = {
  root: null, // usa a janela do navegador como referência
  threshold: 0.2 // dispara quando 20% da seção está visível
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Quando entra na tela
      entry.target.classList.add('active');
    } else {
      // Quando sai da tela (faz o efeito de sumir novamente)
      entry.target.classList.remove('active');
    }
  });
}, observerOptions);
//
// Seleciona todas as seções e coloca o observador nelas
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});
//
// ---  Form
const form = document.querySelector(".contact-form");
const btnSubmit = form.querySelector(".btn-submit");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Salva o conteúdo original para voltar depois
  const originalContent = btnSubmit.innerHTML;

  // ESTADO 1: Enviando
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `Enviando... <i class="fa-solid fa-spinner fa-spin"></i>`;
  btnSubmit.style.opacity = "0.7";
  btnSubmit.style.cursor = "not-allowed";

  try {
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      // ESTADO 2: Sucesso
      btnSubmit.innerHTML = `Enviado! <i class="fa-solid fa-check"></i>`;
      btnSubmit.classList.add("btn-success"); // Vamos criar essa classe no CSS

      form.reset();

      // ESTADO 3: Resetar após 3 segundos
      setTimeout(() => {
        btnSubmit.classList.remove("btn-success");
        btnSubmit.innerHTML = originalContent;
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = "1";
        btnSubmit.style.cursor = "pointer";
      }, 3000);

    } else {
      throw new Error();
    }
  } catch (error) {
    // ESTADO DE ERRO
    btnSubmit.innerHTML = `Erro ao enviar <i class="fa-solid fa-xmark"></i>`;
    btnSubmit.style.background = "#ef4444"; // Vermelho

    setTimeout(() => {
      btnSubmit.innerHTML = originalContent;
      btnSubmit.style.background = ""; // Volta ao original do CSS
      btnSubmit.disabled = false;
    }, 3000);
  }
});
//
// --- Loads key information
// Função principal que busca os dados e distribui para as funções de renderização
import data from '/src/contents.json';
async function carregarPortfolio() {
  try {
    //const response = await fetch('/contents.json');
    //if (!response.ok) throw new Error('Não foi possível carregar o arquivo JSON');

    //const data = await response.json();

    // Executa todas as funções de preenchimento
    renderSocial(data.social);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderExperiences(data.experiences);
    renderArticles(data.articles);

  } catch (error) {
    console.error('Erro ao carregar o portfólio:', error);
  }
}
//
// 1. Renderiza Redes Sociais (em todos os containers: social-links e footer-social)
function renderSocial(socials) {
  const containers = document.querySelectorAll(".social-links, .footer-social");
  const html = socials.map(s => `
        <a href="${s.url}" target="_blank" title="${s.nome}" aria-label="Acessar meu ${s.nome}">
            <i class="${s.icone}"></i>
        </a>
    `).join('');

  containers.forEach(c => c.innerHTML = html);
}
//
// 2. Renderiza as Habilidades (Badges)
function renderSkills(skills) {
  const grid = document.querySelector(".skills-grid");
  if (grid) {
    grid.innerHTML = skills.map(s => `
            <span class="skill-badge">${s}</span>
        `).join('');
  }
}
//
// 3. Renderiza os Projetos (Cards)
function renderProjects(projects) {
  const grid = document.querySelector(".projects-grid");
  if (grid) {
    grid.innerHTML = projects.map(p => `
            <article class="project-card">
                <div class="project-image">
                    <img src="${p.image}" alt="${p.title}" loading="lazy">
                    <div class="project-overlay">
                        <a href="${p.github}" target="_blank" aria-label="Ver código do projeto ${p.title} no GitHub"><i class="fa-brands fa-github"></i></a>
                        <a href="${p.demo}" target="_blank" aria-label="Ver o projeto ${p.title}."><i class="fa-solid fa-link"></i></a>
                    </div>
                </div>
                <div class="project-info">
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                    <div class="project-techs">
                        ${p.techs.map(t => `<span>${t}</span>`).join('')}
                    </div>
                </div>
            </article>
        `).join('');
  }
}
//
// 4. Renderiza a Timeline de Experiências
function renderExperiences(experiences) {
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    timeline.innerHTML = experiences.map(e => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-date">${e.period}</div>
                <div class="timeline-content">
                    <h3>${e.position}</h3>
                    <p class="company">${e.enterprise}</p>
                    <p class="description">${e.description}</p>
                    <div class="experience-techs">
                        ${e.techs.map(t => `<span>${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
  }
}
//
// 5. Renderiza os Artigos do Blog
function renderArticles(articles) {
  const grid = document.querySelector(".blog-grid");
  if (grid && articles.length > 0) {
    grid.innerHTML = articles.map(a => `
            <article class="blog-card">
                <div class="blog-image">
                    <img src="${a.image}" alt="${a.title}" loading="lazy">
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-category">${a.category}</span>
                        <span class="blog-date">${a.date}</span>
                    </div>
                    <h3>${a.title}</h3>
                    <p>${a.summary}</p>
                    <a href="${a.link}" class="read-more">Ler mais <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </article>
        `).join('');
  }
  else {
    grid.innerHTML = `
            <article class="blog-card placeholder">
                <div class="blog-content">
                    <i class="fa-solid fa-pen-nib" style="font-size: 2rem; color: var(--accent-color);"></i>
                    <h3>Futuramente escrevendo o primeiro artigo e/ou blog...</h3>
                    <p>Em breve, compartilharei meus conhecimentos, experiencias e as novidades do mundo Technologico aqui.</p>
                </div>
            </article>
        `;
  }
}
//
// Inicia o processo quando o documento estiver pronto
document.addEventListener("DOMContentLoaded", carregarPortfolio);