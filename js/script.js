// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
navToggle && navToggle.addEventListener('click', ()=>{
  // toggle mobile nav: add/remove a class so CSS can handle layout
  if(siteNav.classList.contains('show')){
    siteNav.classList.remove('show');
  } else {
    siteNav.classList.add('show');
  }
});

// Dark mode toggle
function toggleMode(){
  document.body.classList.toggle('dark');
}

const themeToggle = document.getElementById('themeToggle');
themeToggle && themeToggle.addEventListener('click', toggleMode);

// Year in footer
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

// Highlight active nav link based on scroll position
(() => {
  const navLinks = document.querySelectorAll('.nav a');
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if(!navLinks.length || !sections.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.target.id) return;
      const id = `#${entry.target.id}`;
      const link = document.querySelector(`.nav a[href="${id}"]`);
      if(entry.isIntersecting){
        navLinks.forEach(l => l.classList.remove('active'));
        link && link.classList.add('active');
      }
    });
  }, { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => obs.observe(s));
})();

// Small UI polish: reveal animations and image fade-in
document.addEventListener('DOMContentLoaded', ()=>{
  // give the hero a small entrance
  const heroCard = document.querySelector('.hero-card');
  if(heroCard) setTimeout(()=>heroCard.classList.add('in-view'), 120);

  // reveal existing cards and service blocks when they come into view
  const reveals = document.querySelectorAll('.card, .service-card');
  if(reveals.length){
    const rObs = new IntersectionObserver((entries)=>{
      entries.forEach(ent => { if(ent.isIntersecting) ent.target.classList.add('in-view'); });
    }, {threshold: 0.12});
    reveals.forEach(r => rObs.observe(r));
  }

  // image lazy-load reveal for gallery items: add 'loaded' class when each image finishes loading
  document.querySelectorAll('.masonry-item img, #galleryMasonry img').forEach(img => {
    if(img.complete) img.classList.add('loaded');
    else img.addEventListener('load', ()=> img.classList.add('loaded'));
  });

  // close mobile nav when a link is tapped (mobile UX)
  document.querySelectorAll('.nav a').forEach(a=> a.addEventListener('click', ()=>{ siteNav && siteNav.classList.remove('show'); }));
});

// Contact form: open mail client with prefilled subject/body and show inline status
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const company = document.getElementById('company').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if(!name || !email || !message){
      status.textContent = 'Ju lutem plotësoni fushat e nevojshme.';
      return;
    }

    const subject = encodeURIComponent(`Kërkesë për skela nga ${name}`);
    const body = encodeURIComponent(`Emri: ${name}%0AKompanija: ${company}%0AEmail: ${email}%0A%0ADetajet e projektit:%0A${message}`);
    // Hap klientin e postës parazgjedhur. Ndryshoni adresën nëse duhet.
    window.location.href = `mailto:info@skelemmandm.com?subject=${subject}&body=${body}`;

    status.textContent = 'Po hapet klienti i postës suaj për të dërguar kërkesën. Nëse nuk ndodh asgjë, dërgoni email në info@skelemmandm.com.';
  });
}

// Lightbox for gallery
(() => {
  const gallery = document.getElementById('galleryMasonry');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox && lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox && lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox && lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox && lightbox.querySelector('.lightbox-next');
  if(!gallery || !lightbox) return;

  const items = Array.from(gallery.querySelectorAll('img'));
  let index = -1;

  function openAt(i){
    index = i;
    lightboxImg.src = items[index].src;
    lightbox.setAttribute('aria-hidden','false');
  }

  function close(){
    lightbox.setAttribute('aria-hidden','true');
    lightboxImg.src = '';
    index = -1;
  }

  function prev(){ if(index>0) openAt(index-1); }
  function next(){ if(index < items.length-1) openAt(index+1); }

  items.forEach((img, i)=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=> openAt(i));
  });

  closeBtn && closeBtn.addEventListener('click', close);
  prevBtn && prevBtn.addEventListener('click', prev);
  nextBtn && nextBtn.addEventListener('click', next);

  // close on backdrop click
  lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) close(); });

  // keyboard navigation
  document.addEventListener('keydown', (e)=>{
    if(lightbox.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowLeft') prev();
      if(e.key === 'ArrowRight') next();
    }
  });
})();
