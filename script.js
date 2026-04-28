// ── Navbar scroll effect ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile menu ──
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ── Scroll reveal ──
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ── Skill bar animation ──
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target.getAttribute('data-width');
      entry.target.style.width = target + '%';
    }
  });
}, { threshold: 0.5 });
skillBars.forEach(bar => skillObserver.observe(bar));

// ── Counter animation ──
function animateCounters() {
  document.querySelectorAll('.counter').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Active nav link highlight ──
const sections = document.querySelectorAll('.section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--text-primary)';
    }
  });
});

// ── Parallax on mouse move (hero shapes) ──
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 8;
      shape.style.transform += ` translate(${x * speed}px, ${y * speed}px)`;
    });
  });
}

// ── Contact form handling ──
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const statusEl = document.getElementById('form-status');
    const originalText = btn.textContent;

    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Clear previous status
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    // Show loading state
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (data.success) {
        // Success
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
        statusEl.textContent = data.message;
        statusEl.className = 'form-status success';
        form.reset();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          statusEl.textContent = '';
          statusEl.className = 'form-status';
        }, 4000);
      } else {
        // Server returned an error
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      btn.textContent = '✗ Failed to Send';
      btn.style.background = 'linear-gradient(135deg, #e74c3c, #fd79a8)';
      statusEl.textContent = error.message || 'Could not connect to the server. Please try again later.';
      statusEl.className = 'form-status error';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

// ── Tilt effect on project cards ──
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Typing effect for hero badge ──
const typingEl = document.querySelector('.typing-text');
if (typingEl) {
  const texts = ['Full-Stack Developer', 'MERN Stack Developer', 'Freelance Developer'];
  let textIdx = 0, charIdx = 0, isDeleting = false;

  function typeEffect() {
    const current = texts[textIdx];
    typingEl.textContent = current.substring(0, charIdx);

    if (!isDeleting && charIdx < current.length) {
      charIdx++;
      setTimeout(typeEffect, 80);
    } else if (isDeleting && charIdx > 0) {
      charIdx--;
      setTimeout(typeEffect, 40);
    } else if (!isDeleting) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
    } else {
      isDeleting = false;
      textIdx = (textIdx + 1) % texts.length;
      setTimeout(typeEffect, 500);
    }
  }
  typeEffect();
}
