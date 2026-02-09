import"../chunks/DAC7LG0P.js";import"../chunks/CWztfNBP.js";import{p as re,b as oe,e as ue,f as h,n as ce,a as s,c as x,a4 as Te,D as k,a5 as Re,F as Pe,s as i,a3 as L,d as C,aq as ge,a6 as g,r as I}from"../chunks/DsyOPacL.js";import{i as Ue}from"../chunks/B9z3HFrn.js";import{B as Ae,M as ye,r as he}from"../chunks/Krc4woEF.js";import{B as Ee}from"../chunks/0aE9uwHx.js";import{a as W,C as ie}from"../chunks/CqBF9NMd.js";import{C as q}from"../chunks/HkXub20T.js";import{C as H,a as Y}from"../chunks/DdMUw8iS.js";import{C as j}from"../chunks/saYhnTrj.js";import{a as De}from"../chunks/BiysGuQ7.js";import{s as fe,r as me,b as Se}from"../chunks/BkgMDRcK.js";import"../chunks/Dh3Cqbqq.js";import{L as te}from"../chunks/LMlr842W.js";import{s as _e}from"../chunks/Bfl1Ent3.js";import{I as pe}from"../chunks/BYtUzbfq.js";import{A as $e,F as we}from"../chunks/Boljl8gY.js";import{F as Le,B as Xe}from"../chunks/CnFmektC.js";function Fe(M,U){re(U,!0);let l=me(U,["$$slots","$$events","$$legacy"]);const E=[["path",{d:"M5 12h14"}],["path",{d:"m12 5 7 7-7 7"}]];pe(M,fe({name:"arrow-right"},()=>l,{get iconNode(){return E},children:(e,B)=>{var R=ue(),$=h(R);_e($,()=>U.children??ce),s(e,R)},$$slots:{default:!0}})),oe()}function Ce(M,U){re(U,!0);let l=me(U,["$$slots","$$events","$$legacy"]);const E=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16"}],["path",{d:"M18 17V9"}],["path",{d:"M13 17V5"}],["path",{d:"M8 17v-3"}]];pe(M,fe({name:"chart-column"},()=>l,{get iconNode(){return E},children:(e,B)=>{var R=ue(),$=h(R);_e($,()=>U.children??ce),s(e,R)},$$slots:{default:!0}})),oe()}function Ie(M,U){re(U,!0);let l=me(U,["$$slots","$$events","$$legacy"]);const E=[["path",{d:"M12 12h.01"}],["path",{d:"M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z"}],["path",{d:"M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z"}],["path",{d:"M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z"}]];pe(M,fe({name:"radiation"},()=>l,{get iconNode(){return E},children:(e,B)=>{var R=ue(),$=h(R);_e($,()=>U.children??ce),s(e,R)},$$slots:{default:!0}})),oe()}var Me=x('<canvas class="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true"></canvas>');function Be(M,U){re(U,!0);const l={pixelSize:8,maxIntensity:30,beamCenter:{x:.5,y:.55},rings:[.12,.28,.48,.72],ringWidth:.04,backgroundDecay:3,beamStopRadius:.04,pulseFrames:15,gapFrames:60,photonRateHigh:2e4,photonRateLowMax:1,intensityDecay:.92,pulseFadeDuration:8,pulseBoost:.6};let E,e=null,B,R=0,$=Re(!1),ae=Pe(()=>k($)?0:l.photonRateLowMax),D,S,z=[],K=[],O,X,Z,Q,G=0,b=0,P=0;const ee=`#version 300 es
    in vec2 a_position;
    out vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `,le=`#version 300 es
    precision highp float;

    uniform sampler2D u_state;
    uniform sampler2D u_probability;
    uniform sampler2D u_noise;
    uniform float u_decayRate;
    uniform float u_pulseFade;
    uniform float u_photonRate;
    uniform float u_maxIntensity;
    uniform float u_time;
    uniform vec2 u_resolution;

    in vec2 v_uv;
    out vec4 fragColor;

    // Hash function for additional randomness
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec4 state = texture(u_state, v_uv);
      float intensity = state.r;
      float pulseTimer = state.g;

      // Decay
      intensity = intensity > 0.1 ? intensity * u_decayRate : 0.0;
      pulseTimer = max(0.0, pulseTimer - u_pulseFade);

      // Sample noise texture with time offset for randomness
      vec2 noiseUV = fract(v_uv + vec2(u_time * 0.1, u_time * 0.07));
      float noise = texture(u_noise, noiseUV).r;

      // Additional hash-based randomness
      float rand = hash(v_uv * u_resolution + u_time);

      // Probability of this pixel receiving a photon
      float prob = texture(u_probability, v_uv).r;

      // Scale probability by photon rate (normalized)
      float threshold = prob * u_photonRate * 0.5;

      // Add photons stochastically
      if (noise * rand < threshold) {
        intensity = min(intensity + 2.0, u_maxIntensity);
        pulseTimer = 1.0;
      }

      fragColor = vec4(intensity, pulseTimer, 0.0, 1.0);
    }
  `,T=`#version 300 es
    precision highp float;

    uniform sampler2D u_state;
    uniform sampler2D u_colorLut;
    uniform float u_maxIntensity;
    uniform float u_pulseBoost;
    uniform vec2 u_resolution;
    uniform vec2 u_detectorSize;
    uniform float u_pixelSize;
    uniform vec3 u_bgColor;

    in vec2 v_uv;
    out vec4 fragColor;

    void main() {
      // Background color from uniform
      vec3 bgColor = u_bgColor;

      // Calculate detector pixel coordinates
      vec2 pixelCoord = v_uv * u_resolution;
      vec2 detectorPixel = floor(pixelCoord / u_pixelSize);
      vec2 withinPixel = mod(pixelCoord, u_pixelSize);

      // Grid gap effect (1px border)
      if (withinPixel.x >= u_pixelSize - 1.0 || withinPixel.y >= u_pixelSize - 1.0) {
        fragColor = vec4(bgColor, 1.0);
        return;
      }

      // Sample state at detector pixel center
      vec2 stateUV = (detectorPixel + 0.5) / u_detectorSize;

      // Clamp to valid range
      if (stateUV.x < 0.0 || stateUV.x > 1.0 || stateUV.y < 0.0 || stateUV.y > 1.0) {
        fragColor = vec4(bgColor, 1.0);
        return;
      }

      vec4 state = texture(u_state, stateUV);
      float intensity = state.r;
      float pulseTimer = state.g;

      if (intensity < 0.1) {
        fragColor = vec4(bgColor, 1.0);
        return;
      }

      // Look up color from LUT
      float lutCoord = min(1.0, intensity / u_maxIntensity);
      vec4 color = texture(u_colorLut, vec2(lutCoord, 0.5));

      // Apply pulse boost
      if (pulseTimer > 0.0) {
        float boost = pulseTimer * u_pulseBoost;
        color.r = min(1.0, color.r + boost * (1.0 - color.r));
        color.g = min(1.0, color.g + boost * (1.0 - color.g));
        color.b = min(1.0, color.b + boost * (100.0 / 255.0));
        color.a = min(1.0, color.a + boost * (76.0 / 255.0));
      }

      // Alpha blend with background
      vec3 blended = color.rgb * color.a + bgColor * (1.0 - color.a);
      fragColor = vec4(blended, 1.0);
    }
  `;function w(r,o){const t=e.createShader(r);return e.shaderSource(t,o),e.compileShader(t),e.getShaderParameter(t,e.COMPILE_STATUS)||console.error("Shader compile error:",e.getShaderInfoLog(t)),t}function _(r,o){const t=e.createProgram();return e.attachShader(t,w(e.VERTEX_SHADER,r)),e.attachShader(t,w(e.FRAGMENT_SHADER,o)),e.linkProgram(t),e.getProgramParameter(t,e.LINK_STATUS)||console.error("Program link error:",e.getProgramInfoLog(t)),t}function p(r){let o=Math.exp(-r*l.backgroundDecay);const t=l.ringWidth*.3,u=2*t*t;for(const c of l.rings){const A=Math.abs(r-c);A<l.ringWidth*2&&(o+=Math.exp(-(A*A)/u)*.8*(1-c*.5))}return r<l.beamStopRadius&&(o*=r/l.beamStopRadius),Math.min(o,1)}function m(r){const o=new Uint8Array(1024);for(let t=0;t<256;t++){const u=t/255;let c,A,y,N;if(r)if(u<.3){const f=u/.3;c=100+f*100,A=150+f*50,y=255,N=(0+f*.3)*255}else if(u<.6){const f=(u-.3)/.3;c=200-f*50,A=200-f*50,y=255,N=(.5+f*.25)*255}else{const f=(u-.6)/.4;c=255-f*50,A=100-f*50,y=200+f*30,N=(.75+f*.25)*255}else if(u<.3){const f=u/.3;c=245-f*45,A=240-f*80,y=255-f*30,N=(.3+f*.3)*255}else if(u<.6){const f=(u-.3)/.3;c=200-f*70,A=160-f*80,y=225-f*25,N=(.6+f*.2)*255}else{const f=(u-.6)/.4;c=130-f*50,A=80-f*50,y=200+f*30,N=(.8+f*.2)*255}const J=t*4;o[J]=c,o[J+1]=A,o[J+2]=y,o[J+3]=N}return o}function d(){const r=E.offsetWidth,o=E.offsetHeight;E.width=r,E.height=o,b=Math.ceil(r/l.pixelSize),P=Math.ceil(o/l.pixelSize);const t=b*l.beamCenter.x,u=P*l.beamCenter.y,c=Math.sqrt(b*b+P*P)/2;D=_(ee,le),S=_(ee,T),Q=e.createVertexArray(),e.bindVertexArray(Q);const A=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,A),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const y=e.getAttribLocation(D,"a_position");e.enableVertexAttribArray(y),e.vertexAttribPointer(y,2,e.FLOAT,!1,0,0);const N=new Float32Array(b*P*4);for(let F=0;F<2;F++){const V=e.createTexture();e.bindTexture(e.TEXTURE_2D,V),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,b,P,0,e.RGBA,e.FLOAT,N),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),z.push(V);const ne=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,ne),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,V,0),K.push(ne)}const J=new Float32Array(b*P*4);for(let F=0;F<P;F++)for(let V=0;V<b;V++){const ne=(F*b+V)*4,ve=V-t,xe=F-u,be=Math.sqrt(ve*ve+xe*xe)/c;J[ne]=p(be)}O=e.createTexture(),e.bindTexture(e.TEXTURE_2D,O),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,b,P,0,e.RGBA,e.FLOAT,J),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const f=m(k($));X=e.createTexture(),e.bindTexture(e.TEXTURE_2D,X),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,256,1,0,e.RGBA,e.UNSIGNED_BYTE,f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const se=512,de=new Uint8Array(se*se*4);for(let F=0;F<de.length;F++)de[F]=Math.random()*255;Z=e.createTexture(),e.bindTexture(e.TEXTURE_2D,Z),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,se,se,0,e.RGBA,e.UNSIGNED_BYTE,de),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.bindFramebuffer(e.FRAMEBUFFER,null)}function v(){!E||!e||(z.forEach(r=>e.deleteTexture(r)),K.forEach(r=>e.deleteFramebuffer(r)),O&&e.deleteTexture(O),X&&e.deleteTexture(X),Z&&e.deleteTexture(Z),z=[],K=[],G=0,d())}function n(r){if(!e)return;const o=E.width,t=E.height,A=(R<l.pulseFrames?l.photonRateHigh:k(ae))/(b*P);let y={r:250/255,g:250/255,b:252/255};k($)&&(y={r:20/255,g:20/255,b:30/255}),e.useProgram(D),e.bindFramebuffer(e.FRAMEBUFFER,K[1-G]),e.viewport(0,0,b,P),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,z[G]),e.uniform1i(e.getUniformLocation(D,"u_state"),0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,O),e.uniform1i(e.getUniformLocation(D,"u_probability"),1),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,Z),e.uniform1i(e.getUniformLocation(D,"u_noise"),2),e.uniform1f(e.getUniformLocation(D,"u_decayRate"),l.intensityDecay),e.uniform1f(e.getUniformLocation(D,"u_pulseFade"),1/l.pulseFadeDuration),e.uniform1f(e.getUniformLocation(D,"u_photonRate"),A),e.uniform1f(e.getUniformLocation(D,"u_maxIntensity"),l.maxIntensity),e.uniform1f(e.getUniformLocation(D,"u_time"),r*.001),e.uniform2f(e.getUniformLocation(D,"u_resolution"),b,P),e.bindVertexArray(Q),e.drawArrays(e.TRIANGLE_STRIP,0,4),G=1-G,e.useProgram(S),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,o,t),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,z[G]),e.uniform1i(e.getUniformLocation(S,"u_state"),0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,X),e.uniform1i(e.getUniformLocation(S,"u_colorLut"),1),e.uniform1f(e.getUniformLocation(S,"u_maxIntensity"),l.maxIntensity),e.uniform1f(e.getUniformLocation(S,"u_pulseBoost"),l.pulseBoost),e.uniform2f(e.getUniformLocation(S,"u_resolution"),o,t),e.uniform2f(e.getUniformLocation(S,"u_detectorSize"),b,P),e.uniform1f(e.getUniformLocation(S,"u_pixelSize"),l.pixelSize),e.uniform3f(e.getUniformLocation(S,"u_bgColor"),y.r,y.g,y.b),e.drawArrays(e.TRIANGLE_STRIP,0,4),R=(R+1)%(l.pulseFrames+l.gapFrames),B=requestAnimationFrame(n)}De(()=>{Te($,document.documentElement.classList.contains("dark"),!0);const r=new MutationObserver(()=>{const t=k($);if(Te($,document.documentElement.classList.contains("dark"),!0),k($)!==t&&e){e.deleteTexture(X);const u=m(k($));X=e.createTexture(),e.bindTexture(e.TEXTURE_2D,X),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,256,1,0,e.RGBA,e.UNSIGNED_BYTE,u),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}});if(r.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),e=E.getContext("webgl2",{alpha:!1,antialias:!1}),!e){console.error("WebGL2 not supported");return}if(!e.getExtension("EXT_color_buffer_float")){console.error("EXT_color_buffer_float not supported");return}return d(),B=requestAnimationFrame(n),window.addEventListener("resize",v),()=>{window.removeEventListener("resize",v),cancelAnimationFrame(B),r.disconnect()}});var a=Me();Se(a,r=>E=r,()=>E),s(M,a),oe()}var Ge=x("Open Dashboard <!>",1),Ne=x("<!> Documentation",1),ke=x("<!> <!> <!>",1),ze=x('<div class="rounded px-3 py-2 text-center"><!></div>'),Oe=x("<!> <!>",1),Ve=x("<!> <!> <!>",1),We=x('<div class="rounded px-3 py-2 text-center"><!></div>'),qe=x("<!> <!>",1),He=x("<!> <!> <!>",1),Ye=x('<div class="rounded px-3 py-2 text-center"><!></div>'),je=x("<!> <!>",1),Ke=x("<!> <!> <!>",1),Ze=x('<div class="rounded px-3 py-2 text-center">...</div>'),Je=x("<!> <!>",1),Qe=x("<!> <!> <!>",1),et=x(`Pre-loaded <!> data for
              common solvents with temperature-dependent response curves.`,1),tt=x("<!> <!> <!>",1),rt=x(`Configure photon energy, excited state energy, and excitation
              fraction (<!>) for your optical
              pump.`,1),ot=x("<!> <!> <!>",1),at=x("<!> <!> <!>",1),st=x(`<!> <div class="relative flex grow justify-center-safe overflow-hidden"><div class="relative z-10 flex w-full max-w-5xl flex-col gap-10"><section class="flex flex-col items-center gap-8 text-center lg:mt-12"><div class="flex flex-col gap-2"><h1 class="text-4xl font-bold tracking-tight text-balance md:text-5xl">X-Ray Solution Scattering Simulator</h1> <p class="mx-auto max-w-2xl text-lg text-pretty text-muted-foreground">Proof of concept web interface for X-ray solution scattering
          simulation</p></div> <div class="flex flex-wrap justify-center gap-3"><!> <!></div></section> <section class="flex flex-col gap-8"><div class="flex flex-col gap-2 text-center"><h2 class="text-2xl font-semibold">Simulation Pipeline</h2> <p class="text-muted-foreground">Combine solute structural changes with solvent thermal response</p></div> <div class="cards-grid grid gap-6 md:grid-cols-2"><!> <!> <!> <!></div></section> <section class="flex flex-col gap-8"><div class="flex flex-col gap-2 text-center"><h2 class="text-2xl font-semibold">Configure Your Experiment</h2> <p class="text-muted-foreground">Set up all parameters needed for accurate scattering predictions</p></div> <div class="features-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><!> <!> <!> <!></div></section></div></div>`,1);function Rt(M,U){re(U,!1),Ue();var l=st(),E=h(l);Be(E,{});var e=i(E,2),B=C(e),R=C(B),$=i(C(R),2),ae=C($);{let T=ge(()=>he("/dashboard"));Ee(ae,{get href(){return k(T)},class:"gap-2",children:(w,_)=>{g();var p=Ge(),m=i(h(p));Fe(m,{class:"h-4 w-4"}),s(w,p)},$$slots:{default:!0}})}var D=i(ae,2);{let T=ge(()=>he("/docs"));Ee(D,{get href(){return k(T)},variant:"outline",class:"gap-2",children:(w,_)=>{var p=Ne(),m=h(p);Ae(m,{class:"h-4 w-4"}),g(),s(w,p)},$$slots:{default:!0}})}I($),I(R);var S=i(R,2),z=i(C(S),2),K=C(z);W(K,{class:"rounded-none border-0 bg-white/25 shadow-none backdrop-blur-sm dark:bg-slate-900/40",children:(T,w)=>{var _=Oe(),p=h(_);H(p,{children:(d,v)=>{var n=ke(),a=h(n);j(a,{class:"flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10",children:(t,u)=>{$e(t,{class:"h-6 w-6 text-blue-500"})},$$slots:{default:!0}});var r=i(a,2);Y(r,{children:(t,u)=>{g();var c=L("Solute Difference");s(t,c)},$$slots:{default:!0}});var o=i(r,2);q(o,{children:(t,u)=>{g();var c=L(`Compute intensity difference between excited and ground state
              molecular structures`);s(t,c)},$$slots:{default:!0}}),s(d,n)},$$slots:{default:!0}});var m=i(p,2);ie(m,{children:(d,v)=>{var n=ze(),a=C(n);te(a,{math:String.raw`\Delta I = I_{\text{exc}} - I_{\text{gnd}}`,displayMode:!0}),I(n),s(d,n)},$$slots:{default:!0}}),s(T,_)},$$slots:{default:!0}});var O=i(K,2);W(O,{class:"rounded-none border-0 bg-white/25 shadow-none backdrop-blur-sm dark:bg-slate-900/40",children:(T,w)=>{var _=qe(),p=h(_);H(p,{children:(d,v)=>{var n=Ve(),a=h(n);j(a,{class:"flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10",children:(t,u)=>{we(t,{class:"h-6 w-6 text-amber-500"})},$$slots:{default:!0}});var r=i(a,2);Y(r,{children:(t,u)=>{g();var c=L("Solvent Response");s(t,c)},$$slots:{default:!0}});var o=i(r,2);q(o,{children:(t,u)=>{g();var c=L("Account for thermal expansion from pump laser energy deposition");s(t,c)},$$slots:{default:!0}}),s(d,n)},$$slots:{default:!0}});var m=i(p,2);ie(m,{children:(d,v)=>{var n=We(),a=C(n);te(a,{math:String.raw`\frac{\partial S}{\partial T} \cdot \Delta T`,displayMode:!0}),I(n),s(d,n)},$$slots:{default:!0}}),s(T,_)},$$slots:{default:!0}});var X=i(O,2);W(X,{class:"rounded-none border-0 bg-white/25 shadow-none backdrop-blur-sm dark:bg-slate-900/40",children:(T,w)=>{var _=je(),p=h(_);H(p,{children:(d,v)=>{var n=He(),a=h(n);j(a,{class:"flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10",children:(t,u)=>{Ce(t,{class:"h-6 w-6 text-green-500"})},$$slots:{default:!0}});var r=i(a,2);Y(r,{children:(t,u)=>{g();var c=L("Combined Signal");s(t,c)},$$slots:{default:!0}});var o=i(r,2);q(o,{children:(t,u)=>{g();var c=L(`Predict the total difference scattering as measured at the
              detector`);s(t,c)},$$slots:{default:!0}}),s(d,n)},$$slots:{default:!0}});var m=i(p,2);ie(m,{children:(d,v)=>{var n=Ye(),a=C(n);te(a,{math:String.raw`\Delta S \approx \alpha \Delta S_{\text{sol}} + \Delta S_{\text{slv}}`,displayMode:!0}),I(n),s(d,n)},$$slots:{default:!0}}),s(T,_)},$$slots:{default:!0}});var Z=i(X,2);W(Z,{class:"rounded-none border-0 bg-white/25 shadow-none backdrop-blur-sm dark:bg-slate-900/40",children:(T,w)=>{var _=Je(),p=h(_);H(p,{children:(d,v)=>{var n=Ke(),a=h(n);j(a,{class:"flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10",children:(t,u)=>{Le(t,{class:"h-6 w-6 text-red-500"})},$$slots:{default:!0}});var r=i(a,2);Y(r,{children:(t,u)=>{g();var c=L("Image Recreation");s(t,c)},$$slots:{default:!0}});var o=i(r,2);q(o,{children:(t,u)=>{g();var c=L(`Simulate detector images based on detector information (geometry,
              masks, etc...) and combined scattering signal`);s(t,c)},$$slots:{default:!0}}),s(d,n)},$$slots:{default:!0}});var m=i(p,2);ie(m,{children:(d,v)=>{var n=Ze();s(d,n)},$$slots:{default:!0}}),s(T,_)},$$slots:{default:!0}}),I(z),I(S);var Q=i(S,2),G=i(C(Q),2),b=C(G);W(b,{class:"rounded-none border-0 bg-white/25 shadow-none backdrop-blur-sm dark:bg-slate-900/40",children:(T,w)=>{H(T,{children:(_,p)=>{var m=Qe(),d=h(m);Y(d,{class:"text-base",children:(a,r)=>{g();var o=L("Molecular Structures");s(a,o)},$$slots:{default:!0}});var v=i(d,2);j(v,{children:(a,r)=>{$e(a,{class:"h-5 w-5 text-primary"})},$$slots:{default:!0}});var n=i(v,2);q(n,{class:"text-sm text-muted-foreground",children:(a,r)=>{g();var o=L(`Upload XYZ for ground and excited states. Supports arbitrary
              molecular geometries.`);s(a,o)},$$slots:{default:!0}}),s(_,m)},$$slots:{default:!0}})},$$slots:{default:!0}});var P=i(b,2);W(P,{class:"rounded-none border-0 bg-white/25 shadow-none backdrop-blur-sm dark:bg-slate-900/40",children:(T,w)=>{H(T,{children:(_,p)=>{var m=tt(),d=h(m);Y(d,{class:"text-base",children:(a,r)=>{g();var o=L("Solvent Library");s(a,o)},$$slots:{default:!0}});var v=i(d,2);j(v,{children:(a,r)=>{Xe(a,{class:"h-5 w-5 text-primary"})},$$slots:{default:!0}});var n=i(v,2);q(n,{class:"text-sm text-muted-foreground",children:(a,r)=>{g();var o=et(),t=i(h(o));te(t,{math:String.raw`\partial S/\partial T`}),g(),s(a,o)},$$slots:{default:!0}}),s(_,m)},$$slots:{default:!0}})},$$slots:{default:!0}});var ee=i(P,2);W(ee,{class:"rounded-none border-0 bg-white/25 shadow-none backdrop-blur-sm dark:bg-slate-900/40",children:(T,w)=>{H(T,{children:(_,p)=>{var m=ot(),d=h(m);Y(d,{class:"text-base",children:(a,r)=>{g();var o=L("Pump Parameters");s(a,o)},$$slots:{default:!0}});var v=i(d,2);j(v,{children:(a,r)=>{Ie(a,{class:"h-5 w-5 text-primary"})},$$slots:{default:!0}});var n=i(v,2);q(n,{class:"text-sm text-muted-foreground",children:(a,r)=>{g();var o=rt(),t=i(h(o));te(t,{math:String.raw`\alpha`}),g(),s(a,o)},$$slots:{default:!0}}),s(_,m)},$$slots:{default:!0}})},$$slots:{default:!0}});var le=i(ee,2);W(le,{class:"rounded-none border-0 bg-white/25 shadow-none backdrop-blur-sm dark:bg-slate-900/40",children:(T,w)=>{H(T,{children:(_,p)=>{var m=at(),d=h(m);Y(d,{class:"text-base",children:(a,r)=>{g();var o=L("Detector Geometry");s(a,o)},$$slots:{default:!0}});var v=i(d,2);j(v,{children:(a,r)=>{ye(a,{class:"h-5 w-5 text-primary"})},$$slots:{default:!0}});var n=i(v,2);q(n,{class:"text-sm text-muted-foreground",children:(a,r)=>{g();var o=L(`Support for European XFEL detectors with configurable
              sample-detector distance.`);s(a,o)},$$slots:{default:!0}}),s(_,m)},$$slots:{default:!0}})},$$slots:{default:!0}}),I(G),I(Q),I(B),I(e),s(M,l),oe()}export{Rt as component};
