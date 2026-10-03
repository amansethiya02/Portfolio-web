/**
 * Aman Sethiya - Portfolio Interactions
 * Dark Modern Theme
 * Pure JavaScript for dynamic features, copy helpers, modal handlers, typewriter effect, and link management
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect
  const navbar = document.querySelector('.navbar-custom');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 2. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-custom');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Typewriter Animation for "Hi, I'm Aman Sethiya"
  initTypewriterEffect();

  // 4. Custom Photo Persistence (For using exact img.png)
  initPhotoPersistence();

  // 5. Load Saved Custom Links (LeetCode, GFG, GitHub, LinkedIn)
  loadCustomLinks();

  // 6. Contact Form Submission
  const contactForm = document.getElementById('portfolioContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('formName');
      const name = nameInput ? nameInput.value.trim() : 'Friend';
      showToast(`Thank you, ${name}! Your message has been sent successfully. Aman will reach out soon.`, 'success');
      contactForm.reset();
    });
  }

  // 7. Link Customizer Modal Save Handler
  const saveLinksBtn = document.getElementById('saveLinksBtn');
  if (saveLinksBtn) {
    saveLinksBtn.addEventListener('click', () => {
      const githubVal = document.getElementById('inputGithub')?.value.trim();
      const linkedinVal = document.getElementById('inputLinkedin')?.value.trim();
      const leetcodeVal = document.getElementById('inputLeetcode')?.value.trim();
      const gfgVal = document.getElementById('inputGfg')?.value.trim();
      const resumeVal = document.getElementById('inputResume')?.value.trim();

      const links = {
        github: githubVal || 'https://github.com/',
        linkedin: linkedinVal || 'https://www.linkedin.com/in/aman-sethiya02',
        leetcode: leetcodeVal || 'https://leetcode.com/u/aman_sethiya/',
        gfg: gfgVal || 'https://www.geeksforgeeks.org/profile/amansethil4j4',
        resume: resumeVal || '#'
      };

      localStorage.setItem('aman_portfolio_links', JSON.stringify(links));
      applyLinks(links);

      const modalEl = document.getElementById('customLinksModal');
      if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      }

      showToast('Profile links updated successfully!', 'success');
    });
  }

  // 8. Initialize Project Modals
  setupProjectModals();
});

// Typewriter Animation Implementation
function initTypewriterEffect() {
  const targetEl = document.getElementById('typewriterText');
  if (!targetEl) return;

  const phrases = [
    "Hi, I'm Aman Sethiya",
    "Hi, I'm a Web Developer",
    "Hi, I'm a C++ Programmer",
    "Hi, I'm a Problem Solver",
    "Hi, I'm Aman Sethiya"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeStep() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      targetEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      targetEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Finished typing current phrase: pause before deleting
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting: move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeStep, typingSpeed);
  }

  typeStep();
}

// User Exact Photo Persistence Helper
function initPhotoPersistence() {
  const photoImg = document.getElementById('heroPortraitImg');
  const fileInput = document.getElementById('heroPhotoInput');

  // Load saved custom photo if present
  try {
    const savedPhoto = localStorage.getItem('aman_custom_photo');
    if (savedPhoto && photoImg) {
      photoImg.src = savedPhoto;
    }
  } catch (e) {
    console.error('Could not load custom photo from localStorage', e);
  }

  // File input change handler to let user pick their exact img.png
  if (fileInput && photoImg) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(event) {
        const dataUrl = event.target.result;
        photoImg.src = dataUrl;
        try {
          localStorage.setItem('aman_custom_photo', dataUrl);
          showToast('Your exact original photo has been loaded and saved!', 'success');
        } catch (err) {
          showToast('Photo loaded successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  }
}

// Helper: Copy text to clipboard
window.copyToClipboard = function(text, label) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied: ${text}`, 'success');
    }).catch(() => {
      fallbackCopyText(text, label);
    });
  } else {
    fallbackCopyText(text, label);
  }
};

function fallbackCopyText(text, label) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`${label} copied: ${text}`, 'success');
  } catch (err) {
    showToast(`Value: ${text}`, 'info');
  }
  document.body.removeChild(textArea);
}

// Helper: Show toast notification
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('customToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'customToastContainer';
    toastContainer.className = 'position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '1100';
    document.body.appendChild(toastContainer);
  }

  const toastEl = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-dark text-white border border-info' : 'bg-secondary text-white';
  toastEl.className = `toast align-items-center ${bgClass} shadow-lg rounded-3`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2">
        <i class="bi bi-check-circle-fill text-info fs-5"></i>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);
  if (window.bootstrap) {
    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  } else {
    setTimeout(() => toastEl.remove(), 4000);
  }
}

// Load and apply custom links from localStorage or defaults
function loadCustomLinks() {
  const defaultLinks = {
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/in/aman-sethiya02',
    leetcode: 'https://leetcode.com/u/aman_sethiya/',
    gfg: 'https://www.geeksforgeeks.org/profile/amansethil4j4',
    resume: '#'
  };

  let saved = null;
  try {
    const raw = localStorage.getItem('aman_portfolio_links');
    if (raw) saved = JSON.parse(raw);
  } catch (e) {
    console.error('Error parsing stored links', e);
  }

  const links = { ...defaultLinks, ...(saved || {}) };
  applyLinks(links);

  const gitInput = document.getElementById('inputGithub');
  const linkedInput = document.getElementById('inputLinkedin');
  const leetInput = document.getElementById('inputLeetcode');
  const gfgInput = document.getElementById('inputGfg');
  const resumeInput = document.getElementById('inputResume');

  if (gitInput) gitInput.value = links.github;
  if (linkedInput) linkedInput.value = links.linkedin;
  if (leetInput) leetInput.value = links.leetcode;
  if (gfgInput) gfgInput.value = links.gfg;
  if (resumeInput) resumeInput.value = links.resume;
}

function applyLinks(links) {
  document.querySelectorAll('.link-github').forEach(el => {
    el.setAttribute('href', links.github);
  });
  document.querySelectorAll('.link-linkedin').forEach(el => {
    el.setAttribute('href', links.linkedin);
  });
  document.querySelectorAll('.link-leetcode').forEach(el => {
    el.setAttribute('href', links.leetcode);
  });
  document.querySelectorAll('.link-gfg').forEach(el => {
    el.setAttribute('href', links.gfg);
  });
  document.querySelectorAll('.link-resume-direct').forEach(el => {
    if (links.resume && links.resume !== '#') {
      el.setAttribute('href', links.resume);
      el.setAttribute('target', '_blank');
    }
  });
}

const projectsData = {
  gym: {
    title: 'Gym & Fitness Management Website',
    tagline: 'Comprehensive fitness club web platform with packages, schedules & inquiry management',
    tech: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript', 'Django'],
    image: '/src/assets/images/project_gym_website_1790966250439.jpg',
    features: [
      'Developed as a featured project during industrial web development training at VGT Software',
      'Interactive fitness packages listing with tiered membership options',
      'Dynamic trainer bios and workout schedule management',
      'Integrated member inquiry and contact registration backend',
      'Fully responsive UI optimized for mobile, tablet, and high-res desktops'
    ],
    github: 'https://github.com/',
    demoUrl: '#'
  },
  margdarshak: {
    title: 'Margdarshak - Career & Academic Guidance Platform',
    tagline: 'Intelligent guidance portal empowering students with career roadmaps & mentorship',
    tech: ['Web Development', 'Modern Frontend', 'Vercel Deployment', 'Interactive Roadmaps'],
    image: '/src/assets/images/project_margdarshak_mockup_1790978396784.jpg',
    features: [
      'Live deployed production web application: https://marg-darshk.vercel.app/',
      'Personalized career roadmap guides for school & college students',
      'Stream and specialization exploration with curated skill milestones',
      'Clean modern responsive interface with intuitive navigation cards',
      'Fast client-side routing with instant resource accessibility'
    ],
    github: 'https://github.com/',
    demoUrl: 'https://marg-darshk.vercel.app/'
  }
};

function setupProjectModals() {
  document.querySelectorAll('[data-project-key]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = btn.getAttribute('data-project-key');
      const data = projectsData[key];
      if (!data) return;

      if (btn.classList.contains('direct-link')) {
        return;
      }

      e.preventDefault();
      const titleEl = document.getElementById('projectModalTitle');
      const imgEl = document.getElementById('projectModalImg');
      const techEl = document.getElementById('projectModalTech');
      const descEl = document.getElementById('projectModalDesc');
      const featuresEl = document.getElementById('projectModalFeatures');
      const githubLink = document.getElementById('projectModalGithub');
      const demoLink = document.getElementById('projectModalDemo');

      if (titleEl) titleEl.textContent = data.title;
      if (imgEl) {
        imgEl.src = data.image;
        imgEl.alt = data.title;
      }
      if (techEl) {
        techEl.innerHTML = data.tech.map(t => `<span class="project-tech-tag">${t}</span>`).join('');
      }
      if (descEl) descEl.textContent = data.tagline;
      if (featuresEl) {
        featuresEl.innerHTML = data.features.map(f => `
          <li class="mb-2 d-flex align-items-start gap-2">
            <i class="bi bi-check2-circle text-info fs-6 mt-1"></i>
            <span class="text-light">${f}</span>
          </li>
        `).join('');
      }
      if (githubLink) {
        githubLink.href = data.github;
      }
      if (demoLink) {
        demoLink.href = data.demoUrl;
      }

      const modalEl = document.getElementById('projectPreviewModal');
      if (modalEl && window.bootstrap) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  });
}
