import"../chunks/DAC7LG0P.js";import"../chunks/CWztfNBP.js";import{p as ne,b as le,e as C,f as m,a as r,n as ge,s as e,a3 as S,d as u,c as v,a6 as $,r as n,t as G,D as x}from"../chunks/DsyOPacL.js";import{s as R}from"../chunks/hsT29ikC.js";import{e as U}from"../chunks/CeIe0SU1.js";import{h as Y}from"../chunks/DXosZ1wI.js";import{i as he}from"../chunks/B9z3HFrn.js";import{k as b}from"../chunks/Dh3Cqbqq.js";import{A as ve,a as _e,b as $e}from"../chunks/_o55-Pkd.js";import{a as P,C as D}from"../chunks/CqBF9NMd.js";import{C as T,a as A}from"../chunks/DdMUw8iS.js";import{L as y}from"../chunks/LMlr842W.js";import{s as be}from"../chunks/Bfl1Ent3.js";import{s as xe,r as ye}from"../chunks/BkgMDRcK.js";import{I as Se}from"../chunks/BYtUzbfq.js";function we(j,w){ne(w,!0);let q=ye(w,["$$slots","$$events","$$legacy"]);const k=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]];Se(j,xe({name:"triangle-alert"},()=>q,{get iconNode(){return k},children:(M,Z)=>{var I=C(),N=m(I);be(N,()=>w.children??ge),r(M,I)},$$slots:{default:!0}})),le()}var Qe=v(`<ul class="list-disc"><li>Gas-phase / isolated-solute scattering (no cage or intermolecular
          interference)</li> <li>Independent atoms (tabulated form factors)</li> <li>No Debye-Waller factors or thermal motion</li> <li>Tabulated solvent thermal response</li> <li>No explicit solute-solvent structural correlation</li></ul>`),Pe=v("<!> <!> <!>",1),De=v(`<p>4-Gaussian + constant parameterization (coefficients stored locally
          for 98 elements).</p> <div class="mt-3 rounded-md bg-muted px-3 py-2"><!></div>`,1),Te=v("<!> <!>",1),Ae=v(`Alternative parameterization via <code>periodictable</code> using <code>cromermann.fxrayatq()</code>. <br/><br/> Computes <!> only (no anomalous <!> corrections). This ignores dispersion
        corrections and may be inaccurate near absorption edges or when resonant scattering
        effects are significant.`,1),Ie=v("<!> <!>",1),Ce=v("<!> <!>",1),je=v("<!> <!>",1),qe=v("<!> <!>",1),ke=v(`<section><h1 class="font-semibold">Technical Documentation</h1> <p>Documentation of the physics, algorithms, and implementation details behind
    the SimEx-Debye Scattering Simulator.</p> <p>See the code repository at: <a href="https://git.xfel.eu/simulation/simex-debye/" target="_blank" rel="noopener noreferrer">https://git.xfel.eu/simulation/simex-debye/</a>.</p></section> <section><!> <h2 class="font-semibold">Simulation Details</h2> <h3>The Debye Scattering Equation</h3> <p>The simulator computes scattering intensity via the Debye scattering
    equation, which provides the orientational average for isotropic samples. We
    compute <strong>relative orientationally averaged molecular scattering</strong> (up to an overall scale factor); detector and beamline prefactors are handled
    separately or not modeled.</p> <div class="flex flex-wrap items-center"><div class="flex-2"><!></div> <div class="flex-1 p-4 text-xs"><!></div> <div class="flex-1 p-4 text-xs"><!></div></div></section> <section><h3>Atomic Form Factors</h3> <div class="not-prose flex flex-wrap gap-6"><!> <!></div></section> <section><h3>Difference Scattering Pipeline</h3> <p>For pump–probe time-resolved XSS experiments, the difference signal <!> combines solute structural change with
    solvent thermal response. Time dependence arises through the excitation fraction <!> and solvent heating parameters, not structural
    evolution.</p> <div class="not-prose grid gap-6 md:grid-cols-3"></div></section> <section><h3>Image Reconstruction Pipeline</h3> <p>We forward-simulate a 2D detector image by applying the same effects that
    are corrected during 1D reduction, then re-integrate as a consistency check.</p> <div class="not-prose grid gap-6 md:grid-cols-3"></div></section> <section><h2 class="font-semibold">Usage</h2> <div class="not-prose grid gap-6 sm:grid-cols-2 xl:grid-cols-3"></div></section>`,1);function Ke(j,w){ne(w,!1);const q=String.raw`I(Q) = \sum_{i=1}^{N} \sum_{j=1}^{N} f_i(Q) f_j(Q) \frac{\sin(Q r_{ij})}{Q r_{ij}}`,k=String.raw`
    \begin{aligned}
      f_i(Q) &\coloneqq \text{atomic form factor for atom } i \\
      r_{ij} &\coloneqq \lVert \mathbf{r}_i - \mathbf{r}_j \rVert \text{ (interatomic distance in } \AA\text{)} \\
      2\theta &\coloneqq \text{scattering angle}; \quad \theta = \text{half-angle} \\
      Q &\coloneqq \frac{4\pi}{\lambda} \sin(\theta) \text{ (momentum transfer in } \AA^{-1}\text{)}
    \end{aligned}
  `,M=String.raw`
    \begin{aligned}
      I_{\text{pairs}}(Q) = \sum_{i<j} f_i(Q) f_j(Q) \frac{\sin(Qr_{ij})}{Qr_{ij}} &\colon \text{pair contributions} \\
      I_{\text{self}}(Q) = \sum_{i=1}^{N} f_i^2(Q) &\colon \text{self-terms (diagonal)} \\
      I(Q) = 2 I_{\text{pairs}}(Q) + I_{\text{self}}(Q) &\colon \text{total intensity} \\
      \mathcal{O}(N^2, N_Q) &\colon \text{complexity for } N \text{ atoms, } N_Q \text{ Q-points}
    \end{aligned}
  `,Z=String.raw`f_0(Q) = \sum_{k=1}^{4} a_k \exp\left(-b_k \left(\frac{Q}{4\pi}\right)^2\right) + c`,I=[{title:"Solute Difference",body:`
        <p>Load ground and excited state structures (XYZ), compute intensities:</p>
        ${b.renderToString(String.raw`\Delta I(Q) = I_{\text{excited}}(Q) - I_{\text{ground}}(Q)`,{displayMode:!0})}
      `},{title:"Solvent Response",body:`
        <p>Load experimental ${b.renderToString(String.raw`(\partial S/\partial T)`)} data and interpolate onto the Q grid.</p>
        <br>
        <p>This is multiplied by a scalar temperature rise (or fitted amplitude) to estimate the solvent contribution to the signal.</p>
      `},{title:"Combined Signal",body:`
        <p>The measured difference signal combines both contributions:</p>
        ${b.renderToString(String.raw`\Delta I(Q,t) \approx \alpha(t) \cdot \Delta I_{\text{solute}}(Q) + \beta(t) \cdot \Delta I_{\text{solvent,unit}}(Q)`,{displayMode:!0})}
        where ${b.renderToString(String.raw`\alpha(t)`)} is the time-dependent excited state fraction, and ${b.renderToString(String.raw`\beta(t)`)} is the solvent-heating amplitude (e.g., proportional to temperature jump).
      `}],N=[{title:"Forward project 1D signal onto detector coordinates",body:`
        <p>Simulated 1D difference signal is projected onto detector geometry.</p>
        <br>
        <p>The 1D curve is mapped to a 2D image (radius vs azimuthal angle).</p>
      `},{title:"Map radial coordinate → pixel geometry",body:"..."},{title:"Apply absorption",body:"..."},{title:"Apply solid-angle correction",body:"..."},{title:"Apply polarization correction",body:"..."},{title:"Apply flat-field",body:"..."},{title:"Add dark/background",body:"..."},{title:"Add noise",body:"..."},{title:"Add geometry uncertainty",body:"..."},{title:"Azimuthally integrate to validate closure",body:"..."}],de=[{title:"Load Structures",body:`
        <p>Upload XYZ or PDB files for ground and excited states. Structures are parsed via SimEx-Lite
        <code>SampleData</code> to extract atomic numbers and positions.</p>
      `},{title:"Configure Solvent",body:`
        <p>Select a solvent with ${b.renderToString(String.raw`(\partial S/\partial T)`)} differential
        data. Set concentration to scale the solute contribution relative to the solvent background.</p>
      `},{title:"Set Pump Parameters",body:`
        <p>Define photon energy (eV), excess energy deposited as heat per absorption, and excitation fraction
        (${b.renderToString(String.raw`\alpha(t)`)}). The heat deposition is used to estimate temperature jump and solvent response amplitude.</p>
      `},{title:"Detector Geometry",body:`
        <p>Configure sample-detector distance and beam center. Supports European XFEL detectors with
        module layouts.</p>
      `},{title:"Compute & Analyze",body:`
        <p>View ${b.renderToString(String.raw`\Delta I(Q)`)} with separated contributions: total
        signal, scaled solute difference (${b.renderToString(String.raw`\alpha \cdot \Delta I_{\text{solute}}`)}),
        and solvent thermal response. Identify optimal Q-ranges for your experiment.</p>
      `},{title:"Compare & Export",body:`
        <p>Compare multiple simulation configurations, save results for analysis, and use predictions
        to optimize beamtime parameters.</p>
      `}];he();var B=ke(),E=e(m(B),2),K=u(E);ve(K,{class:"float-right mb-4 ml-4 max-w-md border-amber-500/50 bg-amber-500/5",children:(o,p)=>{var l=Pe(),d=m(l);we(d,{class:"text-amber-600"});var f=e(d,2);_e(f,{class:"text-amber-600",children:(c,a)=>{$();var t=S("Physics Simplifications");r(c,t)},$$slots:{default:!0}});var i=e(f,2);$e(i,{class:"text-sm [&_li]:my-0 [&_li]:leading-snug [&_ul]:pl-4",children:(c,a)=>{var t=Qe();r(c,t)},$$slots:{default:!0}}),r(o,l)},$$slots:{default:!0}});var O=e(K,8),L=u(O),ce=u(L);y(ce,{get math(){return q},displayMode:!0}),n(L);var z=e(L,2),pe=u(z);y(pe,{get math(){return k},displayMode:!0}),n(z);var H=e(z,2),me=u(H);y(me,{get math(){return M},displayMode:!0}),n(H),n(O),n(E);var F=e(E,2),J=e(u(F),2),ee=u(J);P(ee,{class:"flex-2 gap-2",children:(o,p)=>{var l=Te(),d=m(l);T(d,{children:(i,c)=>{A(i,{children:(a,t)=>{$();var s=S("Cromer-Mann (1968)");r(a,s)},$$slots:{default:!0}})},$$slots:{default:!0}});var f=e(d,2);D(f,{children:(i,c)=>{var a=De(),t=e(m(a),2),s=u(t);y(s,{get math(){return Z},displayMode:!0}),n(t),r(i,a)},$$slots:{default:!0}}),r(o,l)},$$slots:{default:!0}});var ue=e(ee,2);P(ue,{class:"flex-2 gap-2",children:(o,p)=>{var l=Ie(),d=m(l);T(d,{children:(i,c)=>{A(i,{children:(a,t)=>{$();var s=S("Waasmaier–Kirfel (1995)");r(a,s)},$$slots:{default:!0}})},$$slots:{default:!0}});var f=e(d,2);D(f,{children:(i,c)=>{$();var a=Ae(),t=e(m(a),8);y(t,{math:String.raw`f_0(Q)`});var s=e(t,2);y(s,{math:String.raw`f'(E), f''(E)`}),$(),r(i,a)},$$slots:{default:!0}}),r(o,l)},$$slots:{default:!0}}),n(J),n(F);var V=e(F,2),W=e(u(V),2),te=e(u(W));y(te,{math:String.raw`\Delta I(Q)`});var fe=e(te,2);y(fe,{math:String.raw`\alpha(t)`}),$(),n(W);var re=e(W,2);U(re,5,()=>I,({title:o,body:p})=>o,(o,p)=>{let l=()=>x(p).title,d=()=>x(p).body;P(o,{class:"gap-0",children:(f,i)=>{var c=Ce(),a=m(c);T(a,{children:(s,g)=>{A(s,{children:(_,h)=>{$();var Q=S();G(()=>R(Q,l())),r(_,Q)},$$slots:{default:!0}})},$$slots:{default:!0}});var t=e(a,2);D(t,{children:(s,g)=>{var _=C(),h=m(_);Y(h,d),r(s,_)},$$slots:{default:!0}}),r(f,c)},$$slots:{default:!0}})}),n(re),n(V);var X=e(V,2),ae=e(u(X),4);U(ae,7,()=>N,({title:o,body:p})=>o,(o,p,l)=>{let d=()=>x(p).title,f=()=>x(p).body;P(o,{class:"gap-0",children:(i,c)=>{var a=je(),t=m(a);T(t,{children:(g,_)=>{A(g,{children:(h,Q)=>{$();var se=S();G(()=>R(se,`${x(l)+1}. ${d()??""}`)),r(h,se)},$$slots:{default:!0}})},$$slots:{default:!0}});var s=e(t,2);D(s,{children:(g,_)=>{var h=C(),Q=m(h);Y(Q,f),r(g,h)},$$slots:{default:!0}}),r(i,a)},$$slots:{default:!0}})}),n(ae),n(X);var oe=e(X,2),ie=e(u(oe),2);U(ie,7,()=>de,o=>o.title,(o,p,l)=>{P(o,{class:"h-full gap-0",children:(d,f)=>{var i=qe(),c=m(i);T(c,{class:"relative flex-row items-center gap-3",children:(t,s)=>{A(t,{children:(g,_)=>{$();var h=S();G(()=>R(h,`${x(l)+1}. ${x(p).title??""}`)),r(g,h)},$$slots:{default:!0}})},$$slots:{default:!0}});var a=e(c,2);D(a,{children:(t,s)=>{var g=C(),_=m(g);Y(_,()=>x(p).body),r(t,g)},$$slots:{default:!0}}),r(d,i)},$$slots:{default:!0}})}),n(ie),n(oe),r(j,B),le()}export{Ke as component};
