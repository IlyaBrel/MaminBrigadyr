/* ===== Касса бригадира · 3D-город денег (Three.js r128) =====
   Каждый объект — стеклянная башня: высота = сколько денег выдано на объект,
   светящаяся заливка = сколько осталось. Золотые монеты — свободные деньги общей кассы. */
const City={ok:false,ready:false,host:null,canvas:null,labels:null,R:null,scene:null,cam:null,root:null,items:[],coins:null,spin:null,parts:null,
  ang:-.55,vel:0,drag:null,raf:0,vis:true,sig:'',prevH:{},tStart:0,io:null,ro:null,radius:7.6,target:null,clock:0,

  check(){try{if(!window.THREE)return false;const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'))}catch(e){return false}},
  init(){this.ok=this.check();},

  setup(){const T=THREE;
    this.canvas=document.createElement('canvas');this.canvas.setAttribute('aria-label','3D-город денег: объекты и свободные деньги');this.canvas.setAttribute('role','img');
    this.labels=document.createElement('div');
    try{this.R=new T.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:true,powerPreference:'high-performance'})}catch(e){this.ok=false;return false}
    this.R.setPixelRatio(Math.min(2,devicePixelRatio||1));this.R.setClearColor(0x000000,0);
    const sc=this.scene=new T.Scene();sc.fog=new T.FogExp2(0x090c15,.055);
    this.cam=new T.PerspectiveCamera(36,1,.1,100);this.target=new T.Vector3(0,2.15,0);
    sc.add(new T.HemisphereLight(0xffffff,0x221133,.65));
    const dl=new T.DirectionalLight(0xffe2c8,1.1);dl.position.set(3,7,5);sc.add(dl);
    const p1=new T.PointLight(0xff2e7e,1.4,22);p1.position.set(-4.5,3,2.5);sc.add(p1);
    const p2=new T.PointLight(0x8b5cff,1.2,22);p2.position.set(4.5,4,-2);sc.add(p2);
    const p3=new T.PointLight(0xffc83d,1.1,10);p3.position.set(0,2,3.5);sc.add(p3);
    /* пол: сетка и светящийся диск */
    const grid=new T.GridHelper(40,40,0x4a2f6a,0x1a2236);grid.material.transparent=true;grid.material.opacity=.45;grid.material.depthWrite=false;sc.add(grid);
    const disc=new T.Mesh(new T.CircleGeometry(7,64),new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,
      uniforms:{t:{value:0}},vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'uniform float t;varying vec2 vU;void main(){float d=distance(vU,vec2(.5))*2.;float a=smoothstep(1.,0.,d)*.35;float ring=smoothstep(.02,0.,abs(fract(d*3.-t*.25)-.5)-.47)*.25*(1.-d);vec3 c=mix(vec3(1.,.48,.1),vec3(1.,.18,.5),d);gl_FragColor=vec4(c*(a+ring),1.);}'}));
    disc.rotation.x=-Math.PI/2;disc.position.y=.005;sc.add(disc);this.disc=disc;
    /* искры */
    const N=170,pos=new Float32Array(N*3),spd=new Float32Array(N);for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*14;pos[i*3+1]=Math.random()*7;pos[i*3+2]=(Math.random()-.5)*9;spd[i]=.004+Math.random()*.012}
    const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));
    this.parts=new T.Points(pg,new T.PointsMaterial({size:.06,color:0xffb36b,transparent:true,opacity:.75,blending:T.AdditiveBlending,depthWrite:false,map:this.dotTex()}));this.parts.userData.spd=spd;sc.add(this.parts);
    this.root=new T.Group();sc.add(this.root);
    /* управление пальцем */
    const cv=this.canvas;
    cv.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,y:e.clientY,t:performance.now(),moved:false,h:null}});
    cv.addEventListener('pointermove',e=>{const d=this.drag;if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(d.h===null&&(Math.abs(dx)>6||Math.abs(dy)>6))d.h=Math.abs(dx)>Math.abs(dy);
      if(d.h){d.moved=true;this.vel=-dx*.0075;this.ang+=this.vel;d.x=e.clientX;d.y=e.clientY}else if(d.h===false)d.moved=true});
    const up=e=>{const d=this.drag;this.drag=null;if(!d)return;if(!d.moved&&performance.now()-d.t<450)this.tap(e)};
    cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',()=>{this.drag=null});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.loop()});
    this.ready=true;return true},

  dotTex(){if(this._dot)return this._dot;const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.3,'rgba(255,255,255,.6)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);return this._dot=new THREE.CanvasTexture(c)},
  glowTex(col){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,col);r.addColorStop(.25,col+'aa');r.addColorStop(1,col+'00');g.fillStyle=r;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)},

  data(){const objs=S.objects.filter(o=>!o.arch||rnd(kassa(o.id))!==0).map(o=>{const s=objStats(o.id);return {id:o.id,name:o.name,recv:s.recv,left:kassa(o.id),g:gOf(o)}});
    return {objs,gen:kassa(null)}},

  build(){const T=THREE;const D=this.data();const sig=JSON.stringify(D);if(sig===this.sig&&this.items.length+(this.coins?1:0))return;this.sig=sig;
    /* очистка */
    this.root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map)m.map.dispose();m.dispose()})}});
    this.root.clear();this.items=[];this.coins=null;this.spin=null;this.labels.innerHTML='';
    const maxV=Math.max(1,...D.objs.map(o=>o.recv),D.gen);const n=D.objs.length;
    const W=n<=5?1.6:1.35;const rows=n<=5?1:2;const perRow=Math.ceil(n/rows);
    D.objs.forEach((o,i)=>{const row=rows===1?0:Math.floor(i/perRow);const k=rows===1?i:i%perRow;const cnt=rows===1?n:(row===0?perRow:n-perRow);
      const off=k-(cnt-1)/2;const x=off*W,z=-Math.abs(off)*.45-row*1.6;
      const H=.4+2.5*o.recv/maxV;const fr=o.recv>0?Math.max(0,Math.min(1,o.left/o.recv)):0;
      const c1=new T.Color(o.g[0]),c2=new T.Color(o.g[1]);const w=.92;
      const g=new T.Group();g.position.set(x,0,z);
      const box=new T.BoxGeometry(1,1,1);box.translate(0,.5,0);
      const shell=new T.Mesh(box,new T.MeshStandardMaterial({color:c1,transparent:true,opacity:.13,roughness:.08,metalness:.3,depthWrite:false,side:T.DoubleSide}));shell.scale.set(w,H,w);
      const edges=new T.LineSegments(new T.EdgesGeometry(box),new T.LineBasicMaterial({color:c1,transparent:true,opacity:.95}));edges.scale.copy(shell.scale);
      const fill=new T.Mesh(box.clone(),new T.ShaderMaterial({transparent:true,uniforms:{t:{value:0},c1:{value:c1},c2:{value:c2}},
        vertexShader:'varying float vY;varying vec3 vN;void main(){vY=position.y;vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
        fragmentShader:'uniform float t;uniform vec3 c1;uniform vec3 c2;varying float vY;varying vec3 vN;void main(){vec3 c=mix(c2,c1,vY);float fr=pow(1.-abs(vN.z),2.);float band=smoothstep(.9,1.,fract(vY*4.-t*.35));float top=smoothstep(.82,1.,vY);c+=fr*.35+band*.35+top*.25;gl_FragColor=vec4(c,.9);}'}));
      const fw=w*.82;fill.scale.set(fw,Math.max(.001,H*fr),fw);
      /* окна: тонкие полосы этажей */
      const fl=new T.Group();const floors=Math.max(1,Math.round(H/.32));for(let j=1;j<floors;j++){const y=j*H/floors;const l=new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(w,w)),new T.LineBasicMaterial({color:c1,transparent:true,opacity:.18}));l.rotation.x=-Math.PI/2;l.position.y=y;fl.add(l)}
      const glow=new T.Sprite(new T.SpriteMaterial({map:this.glowTex(o.g[0]),blending:T.AdditiveBlending,transparent:true,depthWrite:false}));glow.scale.set(2.2,2.2,1);
      const ring=new T.Mesh(new T.RingGeometry(.62,.78,48),new T.MeshBasicMaterial({color:c1,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.01;
      g.add(shell,edges,fill,fl,glow,ring);this.root.add(g);
      const prev=this.prevH[o.id]||{H:0,F:0};
      const lb=document.createElement('div');lb.className='clbl';lb.style.setProperty('--c',o.g[1]);lb.innerHTML=`<small>${esc(o.name)}</small><b>${esc(moneyS(o.left))}</b>`;this.labels.appendChild(lb);
      this.items.push({id:o.id,g,shell,edges,fill,fl,glow,lb,H,F:H*fr,h0:prev.H,f0:prev.F,w,pri:o.left});
      this.prevH[o.id]={H,F:H*fr}});
    /* монеты общей кассы */
    const gen=Math.max(0,D.gen);
    if(gen>0||!n){const k=gen>0?Math.max(1,Math.min(18,Math.round(gen/maxV*16)+1)):0;const cg=new T.Group();cg.position.set(0,0,n?1.75:0);
      const geo=new T.CylinderGeometry(.42,.42,.1,40);const mat=new T.MeshStandardMaterial({color:0xffc83d,metalness:.95,roughness:.22,emissive:0x5a3300,emissiveIntensity:.5});
      for(let j=0;j<k;j++){const m=new T.Mesh(geo,mat);m.position.set((Math.random()-.5)*.06,.05+j*.105,(Math.random()-.5)*.06);m.rotation.y=Math.random()*6;m.userData.y=m.position.y;cg.add(m)}
      const sp=new T.Mesh(new T.CylinderGeometry(.34,.34,.06,40),mat);sp.rotation.x=Math.PI/2;sp.position.y=.4+k*.105;cg.add(sp);this.spin=sp;
      const glow=new T.Sprite(new T.SpriteMaterial({map:this.glowTex('#ffc83d'),blending:T.AdditiveBlending,transparent:true,depthWrite:false}));glow.scale.set(2.4,2.4,1);glow.position.y=k*.105*.6+.2;cg.add(glow);
      cg.userData={id:'__gen',k};this.root.add(cg);this.coins=cg;
      const lb=document.createElement('div');lb.className='clbl';lb.style.setProperty('--c','#d99a1e');lb.innerHTML=`<small>Свободно</small><b>${esc(moneyS(gen))}</b>`;this.labels.appendChild(lb);this.coins.userData.lb=lb;this.coins.userData.top=sp.position.y+.25;
      const pc=this.prevH.__gen||0;this.coins.userData.c0=pc;this.prevH.__gen=k;}
    const span=Math.max(3.2,(n<=5?n:Math.ceil(n/2))*W+1.2);this.radius=Math.max(7.2,span*1.45);
    this.tStart=performance.now()},

  mount(host){if(!this.ok)return;if(!this.ready&&!this.setup())return;this.host=host;host.appendChild(this.canvas);host.appendChild(this.labels);
    this.resize();this.build();
    if(this.ro)this.ro.disconnect();this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(host);
    if(this.io)this.io.disconnect();this.io=new IntersectionObserver(es=>{this.vis=es[0].isIntersecting;if(this.vis)this.loop()});this.io.observe(host);
    this.loop()},
  detach(){cancelAnimationFrame(this.raf);this.raf=0;if(this.ro)this.ro.disconnect();if(this.io)this.io.disconnect();this.host=null},
  /* подписи над башнями: не заходят под баланс и не налезают друг на друга */
  placeLabels(L){const top=this.ovB||this.H*.45,placed=[];L.sort((a,b)=>b.pri-a.pri);
    for(const o of L){const lb=o.lb;if(!lb._w){lb._w=lb.offsetWidth||90;lb._h=lb.offsetHeight||32}const w=lb._w,h=lb._h;
      const x=Math.max(w/2+4,Math.min(this.W-w/2-4,o.x));const r={l:x-w/2-3,r:x+w/2+3,t:o.y-h-2,b:o.y+2};
      const ok=o.z<1&&r.t>top&&r.b<this.H-4&&!placed.some(p=>r.l<p.r&&r.r>p.l&&r.t<p.b&&r.b>p.t);
      if(ok)placed.push(r);lb.style.opacity=ok?1:0;lb.style.transform=`translate(${(x-w/2).toFixed(1)}px,${(o.y-h).toFixed(1)}px)`}},
  resize(){if(!this.host)return;const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.R.setSize(w,h,false);this.cam.aspect=w/h;this.cam.fov=w/h<.9?42:36;this.cam.updateProjectionMatrix();this.W=w;this.H=h;const ov=this.host.parentElement&&this.host.parentElement.querySelector('.hero-ov');if(ov){const a=ov.getBoundingClientRect(),b=this.host.getBoundingClientRect();this.ovB=a.bottom-b.top+6}},

  tap(e){const T=THREE;const r=this.canvas.getBoundingClientRect();const m=new T.Vector2(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
    const rc=new T.Raycaster();rc.setFromCamera(m,this.cam);
    const targets=[];this.items.forEach(it=>{targets.push(it.shell,it.fill)});if(this.coins)this.coins.children.forEach(c=>targets.push(c));
    const hit=rc.intersectObjects(targets,false)[0];if(!hit){return}
    const it=this.items.find(x=>x.shell===hit.object||x.fill===hit.object);buzz(10);
    if(it)openObj(it.id);else whereMoney()},

  loop(){if(this.raf||!this.host||!this.vis||document.hidden)return;const T=THREE;const ease=x=>1-Math.pow(1-x,3);const v=new T.Vector3();
    const frame=now=>{this.raf=0;if(!this.host||!this.vis||document.hidden)return;
      const t=now/1000;const p=Math.min(1,(now-this.tStart)/(reduced()?1:1400));
      if(!this.drag){this.vel*=.94;this.ang+=this.vel+(reduced()?0:.0016)}
      const R=this.radius;this.cam.position.set(Math.sin(this.ang)*R,3.4+R*.12,Math.cos(this.ang)*R);this.cam.lookAt(this.target);this.cam.updateMatrixWorld();
      const LB=[];
      this.items.forEach((it,i)=>{const q=ease(Math.max(0,Math.min(1,p*1.25-i*.08)));const H=it.h0+(it.H-it.h0)*q,F=it.f0+(it.F-it.f0)*q;
        it.shell.scale.y=Math.max(.001,H);it.edges.scale.y=it.shell.scale.y;it.fill.scale.y=Math.max(.001,F);it.fl.scale.y=Math.max(.001,H/it.H||0);
        it.fill.material.uniforms.t.value=t;it.glow.position.y=Math.max(.2,F);it.glow.material.opacity=.55+.25*Math.sin(t*2+i);
        v.set(it.g.position.x,H+.18,it.g.position.z).project(this.cam);const x=(v.x*.5+.5)*this.W,y=(-v.y*.5+.5)*this.H;
        LB.push({lb:it.lb,x,y,z:v.z,pri:it.pri})});
      if(this.coins){const k=this.coins.userData.k;this.coins.children.forEach((c,j)=>{if(c.userData.y!=null){const q=ease(Math.max(0,Math.min(1,p*1.4-j*.03)));c.position.y=c.userData.y+(1-q)*4;c.visible=q>0}});
        if(this.spin){this.spin.rotation.z=t*2.2;this.spin.position.y=.4+k*.105+Math.sin(t*2)*.08}
        v.set(this.coins.position.x,this.coins.userData.top+.15,this.coins.position.z).project(this.cam);const x=(v.x*.5+.5)*this.W,y=(-v.y*.5+.5)*this.H;const lb=this.coins.userData.lb;
        if(lb)LB.push({lb,x,y,z:v.z,pri:1e12})}
      this.placeLabels(LB);
      const pa=this.parts.geometry.attributes.position,sp=this.parts.userData.spd;for(let i=0;i<sp.length;i++){let y=pa.getY(i)+sp[i];if(y>7)y=0;pa.setY(i,y)}pa.needsUpdate=true;
      this.disc.material.uniforms.t.value=t;
      this.R.render(this.scene,this.cam);this.raf=requestAnimationFrame(frame)};
    this.raf=requestAnimationFrame(frame)}
};
