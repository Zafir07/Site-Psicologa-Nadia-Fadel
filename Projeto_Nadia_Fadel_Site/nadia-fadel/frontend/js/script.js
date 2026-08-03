// ============================================================
// Configuração
// ============================================================
// URL do back-end responsável por receber o formulário de contato.
// Em produção, troque pelo endereço público da sua API (ex.: https://api.seudominio.com.br)
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000';

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Menu hamburguer
const hamBtn = document.getElementById('hamBtn');
const mobileMenu = document.getElementById('mobileMenu');
hamBtn.addEventListener('click', () => {
  hamBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
function closeMobile() {
  hamBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// Scroll reveal com fallback defensivo
const revealEls = document.querySelectorAll('.reveal, .reveal-zoom');
try {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }
} catch (e) {
  revealEls.forEach((el) => el.classList.add('in'));
}
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.in),.reveal-zoom:not(.in)').forEach((el) => el.classList.add('in'));
}, 2500);
setTimeout(() => {
  document.querySelectorAll('.hero-reveal,.hero-reveal-zoom').forEach((el) => { el.style.opacity = '1'; });
}, 1500);

// Stagger nos cards de abordagem
document.querySelectorAll('#approachGrid .approach-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 80) + 'ms';
});

// FAQ accordion
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const body = item.querySelector('.faq-body');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-body').style.maxHeight = '0';
    el.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    item.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
  }
}

// Formulário — envio para o back-end próprio (Node.js + Express)
async function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const btn = form.querySelector('button[type="submit"]');
  const originalBtnText = btn.textContent;
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  const payload = {
    nome: form.nome.value.trim(),
    telefone: form.telefone.value.trim(),
    email: form.email.value.trim(),
    servico: form.servico.value,
    mensagem: form.mensagem.value.trim()
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      form.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    } else {
      const msg = (data && data.message) ? data.message : 'Erro ao enviar. Tente pelo WhatsApp.';
      btn.textContent = msg;
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalBtnText;
      }, 4000);
    }
  } catch {
    btn.textContent = 'Erro ao enviar. Tente pelo WhatsApp.';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = originalBtnText;
    }, 4000);
  }
}

// Parallax hero
try {
  const prefersReduced = (typeof window.matchMedia === 'function') && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    const heroPhoto = document.getElementById('heroPhoto');
    const heroBlob = document.getElementById('heroBlob');
    const hero = document.getElementById('hero');
    if (hero && heroPhoto && heroBlob) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroPhoto.style.transform = `translate(${x * 10}px, ${y * 10}px) rotate(${x * 1.2}deg)`;
      });
      window.addEventListener('scroll', () => {
        const sc = window.scrollY;
        if (sc < window.innerHeight) heroBlob.style.transform = `translateY(${sc * 0.18}px)`;
      });
      const particleHost = document.getElementById('hero');
      for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 4 + Math.random() * 7;
        p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:${(0.3+Math.random()*0.4).toFixed(2)};animation:floaty ${5+Math.random()*4}s ease-in-out ${Math.random()*4}s infinite;`;
        particleHost.appendChild(p);
      }
    }
  }
} catch(e) {}
