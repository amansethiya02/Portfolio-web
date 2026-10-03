/**
 * Aman Sethiya - Portfolio Interactions
 * Dark Modern Theme
 * Pure JavaScript for dynamic features, copy helpers, modal handlers, typewriter effect, and link management
 */

import gymImg from './assets/images/project_gym_website_1790966250439.jpg';
import margdarshakImg from './assets/images/project_margdarshak_mockup_1790978396784.jpg';
import profileImg from './assets/images/profile.png';

function initPortfolio() {
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

  // 6. Contact Form Submission directly to amansethiya02@gmail.com
  const contactForm = document.getElementById('portfolioContactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const submitText = document.getElementById('contactSubmitText');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('formName')?.value.trim() || '';
      const email = document.getElementById('formEmail')?.value.trim() || '';
      const subject = document.getElementById('formSubject')?.value.trim() || 'New Portfolio Inquiry';
      const message = document.getElementById('formMessage')?.value.trim() || '';

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.', 'info');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (submitText) submitText.textContent = 'Sending to Aman...';

      try {
        const response = await fetch('https://formsubmit.co/ajax/amansethiya02@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            message: message,
            _subject: `New Portfolio Message from ${name}: ${subject}`,
            _replyto: email
          })
        });

        const data = await response.json();
        if (response.ok && (data.success === 'true' || data.success === true || data.message)) {
          showToast(`Thank you, ${name}! Your message was successfully sent to Aman (amansethiya02@gmail.com). Aman will reply soon!`, 'success');
          contactForm.reset();
        } else {
          // If first-time activation needed or error, fallback to direct form submit
          contactForm.submit();
        }
      } catch (err) {
        console.warn('Direct fetch attempt failed, submitting standard form:', err);
        contactForm.submit();
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'Send Message';
      }
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
        linkedin: linkedinVal || 'https://www.linkedin.com/in/aman-sethiya02/?isSelfProfile=true',
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}

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

// User Exact Photo Persistence & Auto-Detection Loader
function initPhotoPersistence() {
  const photoImg = document.getElementById('heroPortraitImg');
  const fileInput = document.getElementById('heroPhotoInput');

  if (photoImg) {
    // Clear any stale test cache from browser localStorage so the real photo always shows
    try {
      localStorage.removeItem('aman_custom_photo');
    } catch (_) {}

    // Set real imported profile image
    photoImg.src = profileImg;

    photoImg.onerror = function() {
      photoImg.src = '/profile.png';
    };
  }

  // File input change handler to let user pick their exact original photo
  if (fileInput && photoImg) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async function(event) {
        const dataUrl = event.target.result;
        photoImg.src = dataUrl;
        
        try {
          localStorage.setItem('aman_custom_photo', dataUrl);
        } catch (err) {
          console.warn('LocalStorage limit exceeded for large image:', err);
        }

        showToast('Saving your photo permanently to website files...', 'info');

        try {
          const resp = await fetch('/api/upload-hero-photo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              imageBase64: dataUrl,
              filename: file.name
            })
          });

          const resData = await resp.json();
          if (resData.success) {
            showToast('Photo permanently saved in website! (Aapka photo permanently save ho gaya hai)', 'success');
          } else {
            showToast('Photo updated on website preview!', 'success');
          }
        } catch (err) {
          console.error('Error saving photo via API:', err);
          showToast('Photo loaded & cached in browser!', 'success');
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
    linkedin: 'https://www.linkedin.com/in/aman-sethiya02/?isSelfProfile=true',
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

// Resume PDF Direct Download Handler (ATS 1-Page Format with Active Hyperlinks & Ultra-HD Resolution)
window.downloadResumePDF = function() {
  const resumeSheet = document.querySelector('.resume-paper-sheet');
  if (!resumeSheet) {
    window.print();
    return;
  }

  showToast('Generating official 1-page Aman Sethiya Resume PDF (Ultra HD)...', 'info');

  if (typeof window.html2pdf === 'function') {
    // Clone resume sheet to apply clean PDF dimensions without disturbing UI
    const cloned = resumeSheet.cloneNode(true);
    cloned.style.boxShadow = 'none';
    cloned.style.borderRadius = '0';
    cloned.style.width = '750px';
    cloned.style.maxWidth = '750px';
    cloned.style.margin = '0';
    cloned.style.padding = '14px 22px';
    cloned.style.backgroundColor = '#ffffff';
    cloned.style.color = '#000000';
    cloned.style.webkitFontSmoothing = 'antialiased';

    // Dedicated top-aligned container at (0,0) to prevent any window scrolling offset in html2canvas
    const exportContainer = document.createElement('div');
    exportContainer.id = 'resumePdfExportWrapper';
    exportContainer.style.position = 'fixed';
    exportContainer.style.left = '0';
    exportContainer.style.top = '0';
    exportContainer.style.width = '750px';
    exportContainer.style.zIndex = '999999';
    exportContainer.style.backgroundColor = '#ffffff';
    exportContainer.style.pointerEvents = 'none';
    exportContainer.style.margin = '0';
    exportContainer.style.padding = '0';
    exportContainer.appendChild(cloned);
    document.body.appendChild(exportContainer);

    const marginX = 6; // 6mm left & right
    const marginY = 5; // 5mm top & bottom
    const printableWidthMm = 210 - (marginX * 2); // 198mm

    const opt = {
      margin:       [marginY, marginX, marginY, marginX],
      filename:     'Aman_Sethiya_Resume.pdf',
      image:        { type: 'png' }, // Lossless PNG for razor-sharp HD text without JPEG compression artifacts
      enableLinks:  true,
      html2canvas:  {
        scale: 3, // Ultra-HD 300+ DPI sharpness
        useCORS: true,
        letterRendering: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        width: 750,
        windowWidth: 750,
        windowHeight: cloned.offsetHeight || 1000
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Use toPdf().get('pdf') pipeline to guarantee clickable interactive hyperlinks in all PDF readers
    window.html2pdf()
      .set(opt)
      .from(cloned)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const sheetRect = cloned.getBoundingClientRect();
        const scaleFactor = printableWidthMm / cloned.offsetWidth;
        const linkElements = cloned.querySelectorAll('a[href]');

        linkElements.forEach(linkEl => {
          const href = linkEl.getAttribute('href');
          if (!href || href === '#' || href.startsWith('javascript:')) return;
          const rect = linkEl.getBoundingClientRect();
          const linkX = marginX + (rect.left - sheetRect.left) * scaleFactor;
          const linkY = marginY + (rect.top - sheetRect.top) * scaleFactor;
          const linkW = rect.width * scaleFactor;
          const linkH = rect.height * scaleFactor;

          try {
            pdf.link(linkX, linkY, linkW, linkH, { url: href });
          } catch (e) {
            console.warn('Link annotation note:', e);
          }
        });
      })
      .save()
      .then(() => {
        if (document.body.contains(exportContainer)) {
          document.body.removeChild(exportContainer);
        }
        showToast('Aman_Sethiya_Resume.pdf downloaded successfully! (Ultra HD · Single-Page ATS · Clickable Links)', 'success');
      })
      .catch(err => {
        console.error('html2pdf generation error:', err);
        if (document.body.contains(exportContainer)) {
          document.body.removeChild(exportContainer);
        }
        showToast('Opening print dialog for PDF save...', 'info');
        window.print();
      });
  } else {
    const resumeModalEl = document.getElementById('resumeModal');
    if (resumeModalEl && window.bootstrap) {
      const modal = bootstrap.Modal.getInstance(resumeModalEl) || new bootstrap.Modal(resumeModalEl);
      modal.show();
    }
    setTimeout(() => {
      window.print();
    }, 400);
  }
};

const projectsData = {
  gym: {
    title: 'Gym & Fitness Management Website',
    tagline: 'Comprehensive fitness club web platform with packages, schedules & inquiry management',
    tech: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript', 'Django'],
    image: gymImg,
    features: [
      'Developed as a featured project during industrial web development training at VGT Software',
      'Interactive fitness packages listing with tiered membership options',
      'Dynamic trainer bios and workout schedule management',
      'Integrated member inquiry and contact registration backend',
      'Fully responsive UI optimized for mobile, tablet, and high-res desktops'
    ],
    github: '',
    demoUrl: ''
  },
  margdarshak: {
    title: 'MargDarshak — Intelligent Urban Graph & Fleet Route Optimizer',
    tagline: 'High-performance transit routing & last-mile fleet optimizer modeling Jaipur intra-city network',
    tech: ['C++ / TypeScript', 'React', 'Leaflet', 'Data Structures & Graph Algorithms', 'Dijkstra', 'TSP Solver'],
    image: margdarshakImg,
    features: [
      'Engineered an in-memory graph routing engine modeling Jaipur’s intra-city transit network across 14 strategic nodes and 44 bidirectional road corridors.',
      'Implemented Dijkstra’s Algorithm for real-time shortest route calculation across transit networks.',
      'Designed a Multi-Stop Traveling Salesperson Problem (TSP) solver for last-mile delivery loops, reducing backtracking and cutting trip fuel consumption by up to 35%.',
      'Integrated a real-time Disruption & Roadblock Simulator to dynamically recalculate detours and alternative bypass corridors with multi-objective criteria (Fastest, Shortest, Zero-Toll, Eco-Green).'
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
        githubLink.href = data.github || '#';
        githubLink.style.display = data.github ? 'inline-flex' : 'none';
      }
      if (demoLink) {
        demoLink.href = data.demoUrl || '#';
        demoLink.style.display = (data.demoUrl && data.demoUrl !== '#') ? 'inline-flex' : 'none';
      }

      const modalEl = document.getElementById('projectPreviewModal');
      if (modalEl && window.bootstrap) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  });
}
