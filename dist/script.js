const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
document.querySelectorAll('.choose').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#service').value=b.dataset.service;document.querySelector('#contact').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}));
const track=document.querySelector('.project-track'),prev=document.querySelector('#previous'),next=document.querySelector('#next');function updateGallery(){prev.disabled=track.scrollLeft<5;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-5;}
function moveGallery(direction){track.scrollBy({left:direction*(track.querySelector('figure').offsetWidth+26),behavior:reduced.matches?'instant':'smooth'});}prev.addEventListener('click',()=>moveGallery(-1));next.addEventListener('click',()=>moveGallery(1));track.addEventListener('scroll',updateGallery,{passive:true});window.addEventListener('resize',updateGallery);updateGallery();
const lightbox=document.querySelector('#lightbox');document.querySelectorAll('.enlarge').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#lightbox-image').src=b.dataset.image;document.querySelector('#lightbox-image').alt=b.querySelector('img').alt;document.querySelector('#lightbox-caption').textContent=b.dataset.caption;lightbox.showModal();}));document.querySelector('.close-lightbox').addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',e=>{if(e.target===lightbox){const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)lightbox.close();}});
document.querySelector('#quote-form').addEventListener('submit',e=>{e.preventDefault();const result=document.querySelector('#form-result');result.hidden=false;result.textContent='Uw demo-aanvraag is correct ingevuld. Er is niets verzonden of opgeslagen. Op de definitieve website kan Sepro hier uw aanvraag ontvangen.';});

// Native disclosures remain usable if enhancement or animation libraries fail.
document.querySelectorAll('details').forEach((details,index)=>{
  const summary=details.querySelector('summary');
  const item=document.createElement('div');item.className='t-acc';item.dataset.open=String(details.open);
  const head=document.createElement('button');head.type='button';head.className='t-acc-head';head.innerHTML=summary.innerHTML;head.setAttribute('aria-expanded',String(details.open));
  const panel=document.createElement('div');panel.className='t-acc-panel';panel.id=`disclosure-${index}`;head.setAttribute('aria-controls',panel.id);
  const inner=document.createElement('div');inner.className='t-acc-panel-inner';
  Array.from(details.children).filter(child=>child!==summary).forEach(child=>inner.append(child));panel.append(inner);item.append(head,panel);panel.inert=!details.open;details.replaceWith(item);
  head.addEventListener('click',()=>{const open=item.dataset.open!=='true';item.dataset.open=String(open);head.setAttribute('aria-expanded',String(open));panel.inert=!open;});
  panel.addEventListener('transitionend',event=>{if(event.propertyName==='grid-template-rows'&&window.ScrollTrigger)ScrollTrigger.refresh();});
});

if(window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  const motion=gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)',()=>{
    const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
    gsap.to(progress,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.2}});
    if(window.scrollY<100){
      gsap.timeline({defaults:{ease:'power3.out',duration:.9}})
        .from('.hero-copy h1',{y:28,opacity:0},.05)
        .from('.hero-copy>p,.hero-actions,.hero-points',{y:18,opacity:0,stagger:.12},.24)
        .from('.hero-image',{opacity:0,duration:1.1},.1)
        .from('.hero-image>img',{scale:1.12,duration:1.6},.1)
        .from('.hero-image figcaption',{y:22,opacity:0},.6);
    }
    // Enter animations start on arrival; content is never hidden while waiting offscreen.
    const reveal=(target,vars={})=>ScrollTrigger.create({trigger:target,start:'top 91%',once:true,onEnter:()=>gsap.from(target,{y:26,opacity:.3,duration:.8,ease:'power3.out',clearProps:'transform,opacity',...vars})});
    document.querySelectorAll('.section-heading,.service-photo,.about h2,.about-values>div,.faq h2,.contact h2,.contact form').forEach(el=>reveal(el));
    document.querySelectorAll('.service-list .t-acc,.faq .t-acc').forEach((el,i)=>reveal(el,{y:16,duration:.65,delay:(i%6)*.035}));
    reveal('.project-track figure',{stagger:.12});
    document.querySelectorAll('.process li').forEach((el,i)=>{
      reveal(el,{y:18,delay:i*.1});
      gsap.to(el,{'--step-progress':1,ease:'none',scrollTrigger:{trigger:el,start:'top 87%',end:'top 45%',scrub:.6}});
    });
    const desktop=gsap.matchMedia();desktop.add('(min-width: 900px)',()=>{
      const img=document.querySelector('.about-photo img');
      gsap.fromTo(img,{yPercent:-5,scale:1.12},{yPercent:5,scale:1.12,ease:'none',scrollTrigger:{trigger:'.about-photo',start:'top bottom',end:'bottom top',scrub:.8}});
    });
    return ()=>{desktop.revert();progress.remove();};
  });
  document.fonts.ready.then(()=>ScrollTrigger.refresh());
  window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
}


// Crossfade real projects, with explicit pause and no automatic motion offscreen.
{
  const hero=document.querySelector('.hero-image');
  const slides=Array.from(hero.querySelectorAll(':scope>img'));
  const controls=hero.querySelector('.hero-slideshow-controls');
  const dots=Array.from(hero.querySelectorAll('.hero-dots button'));
  const pause=hero.querySelector('.hero-pause');
  let current=0,timer,paused=reduced.matches,visible=true,hovered=false,focused=false;
  function schedule(){clearTimeout(timer);if(!paused&&!document.hidden&&visible&&!hovered&&!focused)timer=setTimeout(()=>show((current+1)%slides.length),5000);}
  async function show(index){
    const image=slides[index];
    try{await image.decode();}catch{schedule();return;}
    current=index;
    slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===current);slide.setAttribute('aria-hidden',String(i!==current));});
    dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));
    schedule();
  }
  function updatePause(){pause.setAttribute('aria-label',paused?'Diashow afspelen':'Diashow pauzeren');pause.innerHTML=paused?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7Z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>';schedule();}
  slides[0].classList.add('is-active');hero.classList.add('slideshow-ready');controls.hidden=false;
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
  pause.addEventListener('click',()=>{paused=!paused;updatePause();});
  hero.addEventListener('mouseenter',()=>{hovered=true;schedule();});hero.addEventListener('mouseleave',()=>{hovered=false;schedule();});
  hero.addEventListener('focusin',()=>{focused=true;schedule();});hero.addEventListener('focusout',()=>{focused=false;schedule();});
  document.addEventListener('visibilitychange',schedule);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.15}).observe(hero);
  reduced.addEventListener('change',()=>{paused=reduced.matches;updatePause();});updatePause();
}
