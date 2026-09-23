const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems=document.querySelectorAll('.reveal');
if(reducedMotion){
  revealItems.forEach(el=>el.classList.add('visible'));
}else{
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -40px'});
  revealItems.forEach(el=>observer.observe(el));
}

const glow=document.querySelector('.cursor-glow');
if(glow&&!reducedMotion){
  window.addEventListener('pointermove',(event)=>{
    glow.style.left=`${event.clientX}px`;
    glow.style.top=`${event.clientY}px`;
  },{passive:true});
}

const countEls=document.querySelectorAll('[data-count]');
const countObserver=new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(!entry.isIntersecting)return;
    const el=entry.target;
    const target=Number(el.dataset.count||0);
    if(reducedMotion){el.textContent=target;countObserver.unobserve(el);return;}
    const start=performance.now();
    const duration=850;
    const tick=(now)=>{
      const progress=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-progress,3);
      el.textContent=Math.round(target*eased);
      if(progress<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
},{threshold:.5});
countEls.forEach(el=>countObserver.observe(el));

const navLinks=document.querySelectorAll('.desktop-nav a');
const sections=[...navLinks].map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(section=>{
    if(window.scrollY>=section.offsetTop-180)current=`#${section.id}`;
  });
  navLinks.forEach(link=>{
    link.style.color=link.getAttribute('href')===current?'#ffffff':'';
  });
},{passive:true});
