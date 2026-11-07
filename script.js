// Reveal hero code line by line (one orchestrated moment)
(function () {
  const code = document.getElementById('code');
  if (!code) return;
  const lines = code.querySelectorAll('.code-line');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const play = () => lines.forEach((l, i) => {
    if (reduce) { l.classList.add('on'); return; }
    setTimeout(() => l.classList.add('on'), 200 + i * 260);
  });
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { play(); io.disconnect(); } }, { threshold: 0.4 }).observe(code);
})();

// Highlight the active "file" in the nav while scrolling
(function () {
  const links = document.querySelectorAll('.nav-link');
  const sections = [...document.querySelectorAll('section[id]')];
  const setActive = (id) => links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s));
  setActive('home');
})();

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Rotating role (typewriter) ---------- */
(function () {
  const el = document.getElementById('role');
  if (!el) return;
  const roles = ['web apps with Django.', 'mobile apps with React Native.', 'AI projects with Python.', 'clean REST APIs.'];
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = roles[0]; return; }
  let r = 0, c = 0, del = false;
  (function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
    if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 28 : 65);
  })();
})();

/* ---------- Animated stat counters ---------- */
(function () {
  const nums = document.querySelectorAll('.stat');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run = (n) => {
    const target = parseFloat(n.dataset.target), dec = parseInt(n.dataset.dec || 0, 10);
    if (reduce) { n.textContent = target.toFixed(dec); return; }
    const t0 = performance.now(), dur = 1400;
    (function step(t) {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      n.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  };
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }));
  nums.forEach(n => io.observe(n));
})();

/* ---------- Copy email button ---------- */
(function () {
  const btn = document.getElementById('copy-email');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(btn.dataset.email); }
    catch (e) { window.location.href = 'mailto:' + btn.dataset.email; return; }
    const old = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('done');
    setTimeout(() => { btn.textContent = old; btn.classList.remove('done'); }, 1800);
  });
})();

/* ---------- Skills filter ---------- */
(function () {
  const filters = document.querySelectorAll('.filter');
  const skills = document.querySelectorAll('.skill');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const type = btn.dataset.filter;
    skills.forEach(s => s.classList.toggle('hide', type !== 'all' && s.dataset.cat !== type));
  }));
})();


/* ---------- Starry hero sky ---------- */
(function () {
  const cv = document.getElementById('stars');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const hero = cv.parentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = hero.clientWidth + 60; h = hero.clientHeight + 60;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((w * h) / 5500);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      a: Math.random() * 0.6 + 0.25,
      s: Math.random() * 0.02 + 0.004,
      p: Math.random() * Math.PI * 2,
      c: Math.random() < 0.2 ? '216,180,254' : '255,255,255'
    }));
    draw(0);
  }
  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const tw = reduce ? 1 : 0.6 + 0.4 * Math.sin(t * s.s + s.p);
      ctx.fillStyle = `rgba(${s.c},${(s.a * tw).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill();
    }
  }
  resize();
  window.addEventListener('resize', resize);
  if (reduce) return;

  let running = true, looping = false;
  function loop(t) { if (!running) { looping = false; return; } looping = true; draw(t || 0); requestAnimationFrame(loop); }
  new IntersectionObserver(es => { running = es[0].isIntersecting; if (running && !looping) loop(); }).observe(hero);
  loop();

  // gentle parallax with the mouse
  hero.addEventListener('mousemove', (e) => {
    const b = hero.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
    cv.style.transform = `translate(${(-x * 26).toFixed(1)}px, ${(-y * 18).toFixed(1)}px)`;
  });
})();


/* ================= Full portfolio sections ================= */
const ic=(slug,c)=>`https://cdn.simpleicons.org/${slug}/${c}`;
const T=[['Python','python','4B8BBE'],['C','c','A8B9CC'],['Java','openjdk','ED8B00'],['JavaScript','javascript','F7DF1E'],['PHP','php','8993BE'],['Django','django','44B78B'],['React Native','react','61DAFB'],['MySQL','mysql','4DA3C7'],['HTML','html5','E34F26'],['CSS','css3','2D8FD5'],['Keras','keras','FF5A5A'],['OpenCV','opencv','8F7BFF'],['Git','git','F05032'],['GitHub','github','FFFFFF'],['VS Code','visualstudiocode','35A8F0'],['Postman','postman','FF6C37'],['Tableau','tableau','E97627'],['Canva','canva','00C4CC'],['REST API'],['Generative AI']];
document.getElementById('chips').innerHTML=T.map(([n,s,c])=>`<span class="tc" style="--c:#${c||'a78bfa'}">${s?`<img src="${ic(s,c)}" alt="" onerror="this.remove()">`:'<b>✦</b>'}${n}</span>`).join('');

const SV=[['Web Development','Responsive sites and apps with Django, HTML, CSS and JavaScript.'],['Mobile Apps','Cross-platform apps with React Native and REST APIs.'],['API Integration','Connecting apps to REST APIs, tested with Postman.'],['Databases','MySQL schema design and queries for real records.'],['AI & Vision','CNN models with Keras and OpenCV for live prediction.'],['Data Visuals','Charts and dashboards with Tableau.']];
const card=SV.map(([a,b])=>`<div class="svc"><b>${a}</b><p>${b}</p></div>`).join('');
document.getElementById('marq').innerHTML=card+card;

const M={
 recipe:`<div class="mk"><div class="mk-in">Search recipes…</div>${['Pasta Primavera','Masala Dosa','Fruit Salad'].map(x=>`<div class="mk-row"><span>${x}</span><i>♥</i></div>`).join('')}</div>`,
 emo:`<div class="mk"><div class="mk-face">🙂</div>${['Happy','Neutral','Sad'].map((x,i)=>`<div class="mk-bar"><span>${x}</span><u style="width:${[78,45,20][i]}%"></u></div>`).join('')}</div>`,
 organ:`<div class="mk">${[['Donor','O+','Kidney'],['Recipient','O+','Kidney'],['Hospital','—','Match found']].map(r=>`<div class="mk-row"><span>${r[0]}</span><span>${r[1]}</span><i>${r[2]}</i></div>`).join('')}</div>`,
 course:`<div class="mk"><div class="mk-in">Full name</div><div class="mk-in">Email</div><div class="mk-in">Select course</div><div class="mk-btn">Register</div></div>`};
const P=[
 ['Recipe App','#f97316','Cross-platform recipe app with search and favorites.','recipe','Built during my React Native internship at Torus Solutions.',['Categorized recipes delivered through REST APIs','Detailed cooking information for each recipe','Search and filtering to find recipes quickly','Favorites to save recipes you like'],['React Native','REST APIs']],
 ['Facial Emotion Detection','#22d3ee','Real-time emotion recognition from a webcam.','emo','A deep learning project that reads faces and names the emotion live.',['CNN trained on a custom 48×48 grayscale dataset','Webcam integration for live classification','Built with Keras and OpenCV'],['Python','CNN','Keras','OpenCV']],
 ['Organ Donation Management','#f43f5e','Donors, recipients, hospitals and organs in one system.','organ','A web app that keeps records organized and speeds up matching.',['Manages donor, recipient, hospital and organ records','Matching by blood group, organ type and patient urgency'],['PHP','MySQL']],
 ['Online Course Registration','#a78bfa','Responsive course listing with a validated form.','course','Built during a 90-hour web development internship at LearnNicely.in.',['Course listing page','Registration form with input validation','Responsive layout for phones and desktops'],['HTML','CSS','JavaScript']]];
document.getElementById('projlist').innerHTML=P.map((p,i)=>`<article class="grid md:grid-cols-2 gap-8 items-center" data-r style="--c:${p[1]}">
 <div class="showcase ${i%2?'md:order-2':''}"><h3>${p[2]}</h3>${M[p[3]]}</div>
 <div><h3 class="ptitle"><i></i>${p[0]}</h3><p class="text-dim mt-3 leading-relaxed">${p[4]}</p>
 <ul class="mt-5 space-y-2.5">${p[5].map(b=>`<li class="plus">${b}</li>`).join('')}</ul>
 <div class="flex flex-wrap gap-2 mt-6">${p[6].map(t=>`<span class="tag">${t}</span>`).join('')}</div></div></article>`).join('');

const E=[['T','Torus Solutions','React Native Mobile Application Intern','Jan 2025 – Feb 2025','Built a cross-platform Recipe App with React Native, integrating REST APIs for categorized recipes and cooking details.',[['React Native','Cross-platform'],['REST APIs','Recipe data'],['Search & Filter','Easy discovery'],['Favorites','Saved recipes']]],
 ['L','LearnNicely.in','Web Development Intern','Jan 2024 – Feb 2024','Completed a 90-hour internship building a responsive Online Course Registration website.',[['90 hours','Internship'],['HTML · CSS · JS','Front-end stack'],['Responsive','Any screen'],['Validation','Registration form']]]];
document.getElementById('explist').innerHTML=E.map(e=>`<div class="exp" data-r><div class="flex items-center gap-4"><div class="logo-sq">${e[0]}</div><div class="flex-1"><h3 class="text-2xl font-bold">${e[1]}</h3><div class="text-emerald-400 font-semibold">${e[2]}</div></div><div class="text-dim text-sm hidden sm:block">${e[3]}</div></div>
 <p class="mt-5 text-slate-300">${e[4]}</p><div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">${e[5].map(t=>`<div class="stile"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div></div>`).join('');

/* scroll reveal */
(function(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});document.querySelectorAll('[data-r]').forEach(n=>io.observe(n));})();

/* floating tech icons that dodge the cursor */
(function(){const box=document.getElementById('float');if(!box)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const L=T.slice(0,18).filter(t=>t[1]&&t[1]!=='github').slice(0,10);let W=box.clientWidth,H=box.clientHeight,m={x:-999,y:-999};
 const it=L.map(([n,s,c])=>{const im=new Image();im.src=ic(s,c);im.alt=n;im.title=n;im.className='fl';im.onerror=()=>im.remove();box.appendChild(im);return{im,x:Math.random()*(W-34),y:Math.random()*(H-34),vx:(Math.random()-.5)*.8,vy:(Math.random()-.5)*.8}});
 box.addEventListener('mousemove',e=>{const b=box.getBoundingClientRect();m.x=e.clientX-b.left;m.y=e.clientY-b.top});box.addEventListener('mouseleave',()=>m.x=-999);
 (function f(){W=box.clientWidth;H=box.clientHeight;it.forEach(o=>{if(!reduce){const dx=o.x+17-m.x,dy=o.y+17-m.y,d=Math.hypot(dx,dy);if(d<90){o.vx+=dx/d*.35;o.vy+=dy/d*.35}
 const sp=Math.hypot(o.vx,o.vy);if(sp>1.6){o.vx*=.94;o.vy*=.94}o.x+=o.vx;o.y+=o.vy;if(o.x<0||o.x>W-34)o.vx*=-1;if(o.y<0||o.y>H-34)o.vy*=-1;o.x=Math.max(0,Math.min(W-34,o.x));o.y=Math.max(0,Math.min(H-34,o.y))}
 o.im.style.transform=`translate(${o.x}px,${o.y}px)`});requestAnimationFrame(f)})();})();

/* draggable globe */
(function(){const cv=document.getElementById('globe');if(!cv)return;const d=Math.min(devicePixelRatio||1,2),S=176;cv.width=cv.height=S*d;const x=cv.getContext('2d');x.scale(d,d);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,R=S/2-6,pts=[];for(let la=-80;la<=80;la+=10)for(let lo=-180;lo<180;lo+=10/Math.cos(la*Math.PI/180))pts.push([la,lo]);
 let rot=-77.6,drag=false,lx=0;const rad=Math.PI/180;
 const pr=(la,lo)=>{const a=la*rad,b=(lo+rot)*rad;return[R*Math.cos(a)*Math.sin(b),-R*Math.sin(a),Math.cos(a)*Math.cos(b)]};
 cv.onpointerdown=e=>{drag=true;lx=e.clientX;cv.setPointerCapture(e.pointerId)};cv.onpointerup=()=>drag=false;cv.onpointermove=e=>{if(drag){rot+=(e.clientX-lx)*.6;lx=e.clientX}};
 (function f(t){x.clearRect(0,0,S,S);x.save();x.translate(S/2,S/2);x.fillStyle='rgba(124,58,237,.12)';x.beginPath();x.arc(0,0,R,0,7);x.fill();
 pts.forEach(([la,lo])=>{const[px,py,z]=pr(la,lo);if(z>0){x.fillStyle=`rgba(200,190,255,${.15+z*.5})`;x.fillRect(px,py,1.6,1.6)}});
 const[bx,by,bz]=pr(12.97,77.59);if(bz>0){x.fillStyle='#f0abfc';x.beginPath();x.arc(bx,by,4,0,7);x.fill();x.strokeStyle='rgba(240,171,252,.6)';x.beginPath();x.arc(bx,by,6+(t/150%8),0,7);x.stroke()}
 x.restore();if(!drag&&!reduce)rot+=.12;requestAnimationFrame(f)})(0);})();

/* ---------- Contact form: opens your email app with the message filled in ---------- */
(function () {
  const f = document.getElementById('cform');
  if (!f) return;
  const st = document.getElementById('cf-status');
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = f.querySelector('#cf-name').value.trim(), m = f.querySelector('#cf-mail').value.trim(), t = f.querySelector('#cf-msg').value.trim();
    if (!n || !t || !/^\S+@\S+\.\S+$/.test(m)) { st.style.color = '#fb7185'; st.textContent = 'Please fill in your name, a valid email and a message.'; return; }
    const body = `${t}\n\nFrom: ${n} (${m})`;
    window.location.href = `mailto:shashankgowdagk@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + n)}&body=${encodeURIComponent(body)}`;
    st.style.color = '#5eead4'; st.textContent = 'Opening your email app. Press send there to finish.';
  });
})();
