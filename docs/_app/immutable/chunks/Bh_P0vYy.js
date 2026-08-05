import{a as Or,u as mr,s as Dt,T as H,g as gr,i as Tr,h as Fr,j as kn,I as Jn,k as Kn,O as Qn,G as $n,m as yn,l as er,n as xn,o as hr,p as Nr,e as Ir,F as jr,C as Rr,q as Hr,r as Wr,P as Gr,B as Vr,v as Pn,w as bn,x as tr,y as qr,z as Yr,A as Zr}from"./CQgp_76R.js";import{E as Oo,J as To,K as Fo,L as No,M as Io,N as jo,Q as Ro,R as Ho,U as Wo,V as Go,W as Vo,X as qo,Y as Yo,H as Zo,Z as Xo,_ as Jo,$ as Ko,a0 as Qo,a1 as $o,a2 as ea,a3 as ta,a4 as na,a5 as ra,a6 as ia,a7 as oa,a8 as aa,a9 as sa,aa as la,ab as ca,ac as _a,ad as da,ae as fa,af as ua,ag as ma,ah as ga,ai as ha,aj as va,ak as pa,al as ya,am as xa,an as ba,ao as wa,ap as za,aq as Sa,ar as Ma,as as Aa,at as La,au as Ea,av as ka,aw as Pa,ax as Ua,ay as Ba,az as Ca,aA as Da,aB as Oa,aC as Ta,aD as Fa,aE as Na,aF as Ia,aG as ja,aH as Ra,aI as Ha,aJ as Wa,aK as Ga,aL as Va,aM as qa,aN as Ya,aO as Za,aP as Xa,aQ as Ja,aR as Ka,aS as Qa,aT as $a,aU as es,aV as ts,aW as ns,aX as rs,aY as is,aZ as os,a_ as as}from"./CQgp_76R.js";import{b as nn,s as Xr,f as it,e as Jr,c as Kr,F as _n,d as Un,h as Bt,W as Dn,B as On,S as vr,V as st,i as Qr,j as sn,U as pr,k as Tn,l as ln,M as $r,m as Yt,L as ei,n as ti,o as ni,C as Gt,p as wn,q as zn,r as Fn,u as yr,v as Vt,w as xr,x as nr}from"./CDYM49c_.js";import"./mOQUUTdI.js";import{p as St,K as ri,g as t,b as Mt,f as U,d as Re,r as Ne,s as C,t as et,a as L,u as d,c as He,M as $e,i as Ue,j as ce,e as at,bs as Ct,h as wt,N as Sn,bl as ii,n as Bn,R as rr,aB as Zt}from"./_crwTh5p.js";import{s as Ie,e as oi}from"./CrXF5aH7.js";import{h as ai}from"./CZ4FFPfq.js";import{p as y,s as Ye,r as Nn,i as he,a as si,d as li,c as T,b as ci}from"./B7V8lvbK.js";import{o as _i,a as di}from"./CBKylcws.js";import{s as Cn}from"./ppPDLhIj.js";import{e as fi,a as ui,C as mi,d as Se}from"./DqdaQFJQ.js";import{b as ir}from"./fOYtcRxU.js";import{i as cn}from"./Cf1U1xpm.js";import{e as qe,i as gi}from"./DeSYy8jl.js";const hi=10,xt=new Map;function or(a){let e=2166136261;for(const n of a){const r=new Float64Array([n]),i=new Uint32Array(r.buffer);e^=i[0],e=Math.imul(e,16777619),e^=i[1],e=Math.imul(e,16777619)}return e>>>0}function vi(a,e,n){const r=a.length;return r===0?`0:${n.toFixed(6)}:0:0`:`${r}:${n.toFixed(6)}:${or(a).toString(16)}:${or(e).toString(16)}`}function pi(a,e,n){const r=e.reduce((u,m)=>u+m,0);if(n<=0||r===0)return e;const i=Array(e.length).fill(0),l=4;for(let u=0;u<a.length;u++){const m=a[u],g=l*n;for(let f=0;f<a.length;f++){const h=a[f];if(Math.abs(m-h)>g)continue;const b=Math.exp(-((m-h)**2)/(2*n**2));i[u]+=e[f]*b}}const s=i.reduce((u,m)=>u+m,0);if(s===0)return e;const _=r/s;return i.map(u=>u*_)}function yi(a,e,n){if(n<=0)return e;const r=vi(a,e,n),i=xt.get(r);if(i)return xt.delete(r),xt.set(r,i),i;const l=pi(a,e,n);if(xt.size>=hi){const s=xt.keys().next().value;s!==void 0&&xt.delete(s)}return xt.set(r,l),l}const xi=5,bi=3,br=2;function wi(a,e){const n=a.length;if(n===0)return[];if(n===1)return[0];const r=Math.floor(e/2),i=Array(n);for(let l=0;l<n;l++){const s=Math.max(0,l-r),_=Math.min(n,l+r+1);let[u,m,g]=[0,0,0];for(let f=s;f<_;f++){const h=a[f];if(!Number.isFinite(h))continue;g++;const x=h-u;u+=x/g;const b=h-u;m+=x*b}i[l]=g>1?m/(g-1):0}return i}function wr(a){if(a.length<2)return[];const e=Array(a.length-1);for(let n=0;n<a.length-1;n++)e[n]=a[n+1]-a[n];return e}function zi(a,e,n){const r=wr(a);if(r.length<e)return{onset_index:-1,score:0};const i=wi(r,e),l=Math.min(Math.floor(r.length/4),50),s=i.slice(0,Math.max(l,e)),_=dn(s.filter(m=>m>0));if(_===0)return{onset_index:-1,score:0};let u=0;for(let m=l;m<i.length;m++){const g=i[m]/_;if(g>u&&(u=g),g>n)return{onset_index:m+1,score:g}}return{onset_index:-1,score:u}}function Si(a,e){if(a.length<e*3)return{onset_index:-1,score:0};const n=[],r=Math.floor(e/2);for(let s=r;s<a.length-r;s++){const _=s-r,u=s+r+1,m=u-_;let g=0;for(let x=_;x<u;x++)g+=a[x];const f=g/m;let h=0;for(let x=_;x<u;x++){const b=Math.abs(a[x]-f);b>h&&(h=b)}n.push(h)}if(n.length<10)return{onset_index:-1,score:0};const i=dn(n.slice(0,Math.floor(n.length/4)));if(i===0)return{onset_index:-1,score:0};let l=0;for(let s=Math.floor(n.length/4);s<n.length;s++){const _=n[s]/i;if(_>l&&(l=_),_>10)return{onset_index:s+r,score:_/10}}return{onset_index:-1,score:l/10}}function Mi(a,e,n=3){const r=wr(a);if(r.length<e*2)return{onset_index:-1,score:0};const i=Math.floor(e/2);let l=0;for(let s=i;s<r.length-i;s++){const _=s-i,u=s+i+1;let m=0;for(let f=_+1;f<u;f++)r[f]*r[f-1]<0&&m++;const g=m/n;if(g>l&&(l=g),m>n)return{onset_index:s+1,score:g}}return{onset_index:-1,score:l}}function Ai(a,e,n={}){const r=n.window_size??xi,i=n.oscillation_threshold??bi,l={derivative_variance:n.oscillation_weights?.derivative_variance??1,amplitude_growth:n.oscillation_weights?.amplitude_growth??1,sign_changes:n.oscillation_weights?.sign_changes??1},s=[],_=[];for(let te=0;te<e.length;te++)Number.isFinite(e[te])&&(s.push(te),_.push(e[te]));if(_.length<r*2)return{detected:!1,onset_index:-1,onset_x:NaN,combined_score:0,method_scores:{derivative_variance:0,amplitude_growth:0,sign_changes:0}};const u=zi(_,r,i),m=Si(_,r),g=Mi(_,r),f={derivative_variance:u.score,amplitude_growth:m.score,sign_changes:g.score},h=l.derivative_variance+l.amplitude_growth+l.sign_changes,x=h>0?(l.derivative_variance*u.score+l.amplitude_growth*m.score+l.sign_changes*g.score)/h:0,b=[{idx:u.onset_index,score:u.score*l.derivative_variance},{idx:m.onset_index,score:m.score*l.amplitude_growth},{idx:g.onset_index,score:g.score*l.sign_changes}].filter(te=>te.idx>=0);let p=-1;b.length>0&&(p=Math.min(...b.map(te=>te.idx)),p>=0&&p<s.length&&(p=s[p]));const W=x>=i||p>=0,ee=p>=0&&p<a.length?a[p]:NaN;return{detected:W,onset_index:p,onset_x:ee,combined_score:x,method_scores:f}}function Li(a,e){if(a.length===0||e<=1)return[...a];const n=Array(a.length),r=Math.floor(e/2);for(let i=0;i<a.length;i++){const l=Math.max(0,i-r),s=Math.min(a.length,i+r+1);let[_,u]=[0,0];for(let m=l;m<s;m++)Number.isFinite(a[m])&&(_+=a[m],u++);n[i]=u>0?_/u:a[i]}return n}function Ei(a,e){const n=Math.floor(a/2),r=2*n+1,i=[];for(let m=-n;m<=n;m++){const g=[];for(let f=0;f<=e;f++)g.push(Math.pow(m,f));i.push(g)}const l=lr(sr(i),i),s=Ti(l);if(!s)return Array(r).fill(1/r);const _=sr(i);return lr(s,_)[0]}function ki(a,e,n=br){if(a.length===0)return[];let r=e%2===0?e+1:e;if(r=Math.max(r,n+2),r=Math.min(r,a.length),r<3)return[...a];const i=Ei(r,n),l=Math.floor(r/2),s=Array(a.length),_=i.reduce((u,m)=>u+m,0);for(let u=0;u<a.length;u++){let[m,g]=[0,0];for(let f=0;f<r;f++){const h=u-l+f;h>=0&&h<a.length&&Number.isFinite(a[h])&&(m+=i[f]*a[h],g+=i[f])}s[u]=g!==0?m/g*_:a[u]}return s}function qt(a,e,n){return n.type==="moving_avg"?Li(e,n.window):n.type==="savgol"?ki(e,n.window,n.polynomial_order??br):n.type==="gaussian"?yi(a,e,n.sigma):e}const Pi=7,Ui=2,Bi=5;function Ci(a,e,n){const r=[],i=Math.max(0,e-n),l=Math.min(a.length-1,e+n);for(let s=i;s<=l;s++)s!==e&&Number.isFinite(a[s])&&r.push(a[s]);return r.length===0?a[e]:dn(r)}function Di(a,e,n,r){const i=[],l=Math.max(0,e-n),s=Math.min(a.length-1,e+n);for(let _=l;_<=s;_++)_!==e&&Number.isFinite(a[_])&&i.push(Math.abs(a[_]-r));return i.length===0?0:dn(i)}function Oi(a,e={}){const n=e.window_half??Pi,r=e.mad_threshold??Ui,i=e.max_iterations??Bi,l=a.length;if(l===0)return{kept_indices:[],removed_indices:[],iterations_used:0};const s=n*2+1;if(l<s)return{kept_indices:Array.from({length:l},(f,h)=>h),removed_indices:[],iterations_used:0};let _=Array(l).fill(!0),u=0;for(let f=0;f<i;f++){let h=!1;const x=[..._];for(let b=0;b<l;b++){if(!_[b]||!Number.isFinite(a[b]))continue;const p=Ci(a,b,n),W=Di(a,b,n,p);if(W===0)continue;const ee=W*r;Math.abs(a[b]-p)>ee&&(x[b]=!1,h=!0)}if(_=x,u=f+1,!h)break}const m=[],g=[];for(let f=0;f<l;f++)_[f]?m.push(f):g.push(f);return{kept_indices:m,removed_indices:g,iterations_used:u}}function Ot(a,e){const n=[];let r=0;if(e==="propagate"){for(const l of a)Number.isFinite(l)||r++;return{cleaned:[...a],removed_indices:[],invalid_count:r}}if(e==="remove"){const l=[];for(let s=0;s<a.length;s++)Number.isFinite(a[s])?l.push(a[s]):(n.push(s),r++);return{cleaned:l,removed_indices:n,invalid_count:r}}const i=[...a];for(let l=0;l<i.length;l++)if(!Number.isFinite(i[l])){r++;let s=l-1;for(;s>=0&&!Number.isFinite(i[s]);)s--;let _=l+1;for(;_<i.length&&!Number.isFinite(i[_]);)_++;if(s>=0&&_<i.length){const u=(l-s)/(_-s);i[l]=i[s]+u*(i[_]-i[s])}else s>=0?i[l]=i[s]:_<i.length?i[l]=i[_]:i[l]=0}return{cleaned:i,removed_indices:[],invalid_count:r}}function zr(a,e,n){const r=[...e],i=[];let l=0;for(let s=0;s<r.length;s++){const _=a[s],u=r[s],m=typeof n.min=="function"?n.min(_):n.min,g=typeof n.max=="function"?n.max(_):n.max;let f=!1;if(m!==void 0&&u<m&&(f=!0),g!==void 0&&u>g&&(f=!0),f){l++;const h=n.mode??"clamp";h==="clamp"?(m!==void 0&&u<m&&(r[s]=m),g!==void 0&&u>g&&(r[s]=g)):h==="filter"?i.push(s):h==="null"&&(r[s]=NaN)}}return{y:r,violations:l,filtered_indices:i}}function So(a,e){if(a!==void 0)return Array.isArray(a)?e.map(n=>a[n]):a}function Ht(a,e){return e.map(n=>a[n])}function Sr(a,e,n){const r=typeof n.min=="function"?n.min(e):n.min,i=typeof n.max=="function"?n.max(e):n.max;return!(r!==void 0&&a<r||i!==void 0&&a>i)}function ar(a,e){const n=new Set(e);return Array.from({length:a},(r,i)=>i).filter(r=>!n.has(r))}function Mo(a,e={}){const n=e.in_place??!0,r=e.invalid_values??"remove",i=e.truncation_mode??"mark_unstable";let l=[...a.x],s=[...a.y],_=a.metadata,u=a.color_values?[...a.color_values]:void 0,m=a.size_values?[...a.size_values]:void 0;const g={points_removed:0,invalid_values_found:0,oscillation_detected:!1,bounds_violations:0},f=(p,W)=>{l=Ht(l,p),s=Ht(s,p),Array.isArray(_)&&(_=Ht(_,p)),u&&(u=Ht(u,p)),m&&(m=Ht(m,p)),g.points_removed+=W},h=Ot(s,r);if(g.invalid_values_found=h.invalid_count,r==="remove"&&h.removed_indices.length>0){const p=ar(l.length,h.removed_indices);f(p,h.removed_indices.length)}else s=h.cleaned;if(e.bounds){const p=zr(l,s,e.bounds);if(s=p.y,g.bounds_violations=p.violations,e.bounds.mode==="filter"&&p.filtered_indices.length>0){const W=ar(l.length,p.filtered_indices);f(W,p.filtered_indices.length)}}if(e.local_outliers){const p=Oi(s,e.local_outliers);g.outliers_removed=p.removed_indices.length,p.removed_indices.length>0&&f(p.kept_indices,p.removed_indices.length)}e.smooth&&(s=qt(l,s,e.smooth));const x=Ai(l,s,e);if(g.oscillation_detected=x.detected,g.oscillation_score=x.combined_score,x.detected&&x.onset_index>=0)if(i==="hard_cut"){const p=Array.from({length:x.onset_index},(W,ee)=>ee);g.truncated_at_x=x.onset_x,f(p,l.length-x.onset_index)}else g.stable_range=[l[0],x.onset_x];const b=n?a:{...a};return b.x=l,b.y=s,_!==void 0&&(b.metadata=_),u&&(b.color_values=u),m&&(b.size_values=m),{series:b,quality:g}}function Ao(a,e,n={}){if(e.length===0)return{x:[...a],cleaned_y:[],quality:[]};const r=n.invalid_values??"remove",i=Math.min(a.length,...e.map(f=>f.length)),{bounds:l,smooth:s}=n;let _=Array.from({length:i},(f,h)=>h);r==="remove"&&(_=_.filter(f=>e.every(h=>Number.isFinite(h[f])))),l?.mode==="filter"&&(_=_.filter(f=>{const h=a[f];return e.every(x=>Sr(x[f],h,l))}));const u=_.map(f=>a[f]),m=[],g=[];for(const f of e){let h=_.map(p=>f[p]),x=0;for(let p=0;p<i;p++)Number.isFinite(f[p])||x++;const b={points_removed:i-_.length,invalid_values_found:x,oscillation_detected:!1,bounds_violations:0};if(r==="interpolate"&&(h=Ot(h,"interpolate").cleaned),l&&l.mode!=="filter"){const p=zr(u,h,l);h=p.y,b.bounds_violations=p.violations}s&&(h=qt(u,h,s)),m.push(h),g.push(b)}return{x:u,cleaned_y:m,quality:g}}function Lo(a,e,n,r={}){const i=r.invalid_values??"remove",l=Math.min(a.length,e.length,n.length),s=[a,e,n],{bounds:_,smooth:u}=r;let m=0;for(let x=0;x<l;x++)s.every(b=>Number.isFinite(b[x]))||m++;let g=Array.from({length:l},(x,b)=>b);i==="remove"&&(g=g.filter(x=>s.every(b=>Number.isFinite(b[x]))));let f={x:g.map(x=>a[x]),y:g.map(x=>e[x]),z:g.map(x=>n[x])};const h={points_removed:l-g.length,invalid_values_found:m,oscillation_detected:!1,bounds_violations:0};if(i==="interpolate"&&(f.x=Ot(f.x,"interpolate").cleaned,f.y=Ot(f.y,"interpolate").cleaned,f.z=Ot(f.z,"interpolate").cleaned),_?.mode==="filter"){const x=r.primary_axis??"x",b=[];for(let p=0;p<f.x.length;p++){const W=f[x][p];Sr(W,f.x[p],_)?b.push(p):h.bounds_violations++}f={x:b.map(p=>f.x[p]),y:b.map(p=>f.y[p]),z:b.map(p=>f.z[p])},h.points_removed+=g.length-b.length}return u&&(f.y=qt(f.x,f.y,u),f.z=qt(f.x,f.z,u)),{...f,quality:h}}function Eo(a,e={}){const n=Object.entries(a);if(n.length===0)return{props:{},quality:{}};const r=e.independent_axis??"Step",i=e.invalid_values??"remove",{smooth:l}=e,s=Math.min(...n.map(([,x])=>x.length)),_=a[r]??Array.from({length:s},(x,b)=>b),u=Object.fromEntries(n.map(([x,b])=>{let p=0;for(let W=0;W<s;W++)Number.isFinite(b[W])||p++;return[x,p]}));let m=Array.from({length:s},(x,b)=>b);i==="remove"&&(m=m.filter(x=>n.every(([,b])=>Number.isFinite(b[x]))));const g=m.map(x=>_[x]),f={},h={};for(const[x,b]of n){let p=m.map(ee=>b[ee]);const W={points_removed:s-m.length,invalid_values_found:u[x],oscillation_detected:!1,bounds_violations:0};i==="interpolate"&&(p=Ot(p,"interpolate").cleaned),l&&x!==r&&(p=qt(g,p,l)),f[x]=p,h[x]=W}return a[r]||(f[r]=g,h[r]={points_removed:s-m.length,invalid_values_found:0,oscillation_detected:!1,bounds_violations:0}),{props:f,quality:h}}function dn(a){if(a.length===0)return 0;const e=[...a].sort((r,i)=>r-i),n=Math.floor(e.length/2);return e.length%2!==0?e[n]:(e[n-1]+e[n])/2}function sr(a){if(a.length===0)return[];const e=a.length,n=a[0].length,r=Array.from({length:n},()=>Array(e).fill(0));for(let i=0;i<e;i++)for(let l=0;l<n;l++)r[l][i]=a[i][l];return r}function lr(a,e){const n=a.length,r=a[0]?.length??0,i=e[0]?.length??0,l=Array.from({length:n},()=>Array(i).fill(0));for(let s=0;s<n;s++)for(let _=0;_<i;_++)for(let u=0;u<r;u++)l[s][_]+=a[s][u]*e[u][_];return l}function Ti(a){const e=a.length;if(e===0||a[0].length!==e)return null;const n=a.map((r,i)=>[...r,...Array.from({length:e},(l,s)=>i===s?1:0)]);for(let r=0;r<e;r++){let i=r;for(let s=r+1;s<e;s++)Math.abs(n[s][r])>Math.abs(n[i][r])&&(i=s);if(Math.abs(n[i][r])<1e-10)return null;[n[r],n[i]]=[n[i],n[r]];const l=n[r][r];for(let s=0;s<2*e;s++)n[r][s]/=l;for(let s=0;s<e;s++)if(s!==r){const _=n[s][r];for(let u=0;u<2*e;u++)n[s][u]-=_*n[r][u]}}return n.map(r=>r.slice(e))}var Fi=new Set(["$$slots","$$events","$$legacy","y","x_axis","y_axis","y_unit","tooltip_point","hovered"]),Ni=He("<strong> </strong><br/> <!> ",1);function ko(a,e){St(e,!0);let n=y(e,"x_axis",19,()=>({})),r=y(e,"y_axis",19,()=>({})),i=y(e,"y_unit",19,()=>""),l=y(e,"tooltip_point",15,null),s=y(e,"hovered",15,!1),_=Nn(e,Fi);ri(()=>{nn.element?.number&&!s()&&l({x:nn.element.number,y:e.y[nn.element.number-1],series_idx:0,point_idx:nn.element.number-1})});{const u=(h,x)=>{let b=()=>(x?.()).x,p=()=>(x?.()).y;const W=d(()=>Jr[b()-1]);var ee=Ni(),te=U(ee),ue=Re(te,!0);Ne(te);var pe=C(te,3);ai(pe,()=>Xr(r().label||"Value"));var ke=C(pe);et(G=>{Ie(ue,t(W)?`${b()} ${t(W).symbol} - ${t(W).name}`:`Element ${b()}`),Ie(ke,`: ${G??""}${i()??""??""}`)},[()=>it(p(),r().format??"~s")]),L(h,ee)};let m=d(()=>[{x:[...Array(e.y.length+1).keys()].slice(1),y:e.y,color_values:e.y,point_style:{radius:2}}]),g=d(()=>({label:"Atomic Number",range:[0,null],...n()})),f=d(()=>({format:"~s",...r()}));Or(a,Ye({get series(){return t(m)},get x_axis(){return t(g)},get y_axis(){return t(f)},color_bar:null,padding:{l:60,r:10,t:5,b:45},range_padding:0},()=>_,{get tooltip_point(){return l()},set tooltip_point(h){l(h)},get hovered(){return s()},set hovered(h){s(h)},tooltip:u,$$slots:{tooltip:!0}}))}Mt()}const cr=new On,rn=new st;class Mr extends Kr{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],n=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],r=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(r),this.setAttribute("position",new _n(e,3)),this.setAttribute("uv",new _n(n,2))}applyMatrix4(e){const n=this.attributes.instanceStart,r=this.attributes.instanceEnd;return n!==void 0&&(n.applyMatrix4(e),r.applyMatrix4(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const r=new Un(n,6,1);return this.setAttribute("instanceStart",new Bt(r,3,0)),this.setAttribute("instanceEnd",new Bt(r,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const r=new Un(n,6,1);return this.setAttribute("instanceColorStart",new Bt(r,3,0)),this.setAttribute("instanceColorEnd",new Bt(r,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Dn(e.geometry)),this}fromLineSegments(e){const n=e.geometry;return this.setPositions(n.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new On);const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;e!==void 0&&n!==void 0&&(this.boundingBox.setFromBufferAttribute(e),cr.setFromBufferAttribute(n),this.boundingBox.union(cr))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new vr),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;if(e!==void 0&&n!==void 0){const r=this.boundingSphere.center;this.boundingBox.getCenter(r);let i=0;for(let l=0,s=e.count;l<s;l++)rn.fromBufferAttribute(e,l),i=Math.max(i,r.distanceToSquared(rn)),rn.fromBufferAttribute(n,l),i=Math.max(i,r.distanceToSquared(rn));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}ln.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Tn(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};sn.line={uniforms:pr.merge([ln.common,ln.fog,ln.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class fn extends Qr{constructor(e){super({type:"LineMaterial",uniforms:pr.clone(sn.line.uniforms),vertexShader:sn.line.vertexShader,fragmentShader:sn.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Mn=new Yt,_r=new st,dr=new st,Ce=new Yt,De=new Yt,nt=new Yt,An=new st,Ln=new ti,Oe=new ei,fr=new st,on=new On,an=new vr,rt=new Yt;let ot,zt;function ur(a,e,n){return rt.set(0,0,-e,1).applyMatrix4(a.projectionMatrix),rt.multiplyScalar(1/rt.w),rt.x=zt/n.width,rt.y=zt/n.height,rt.applyMatrix4(a.projectionMatrixInverse),rt.multiplyScalar(1/rt.w),Math.abs(Math.max(rt.x,rt.y))}function Ii(a,e){const n=a.matrixWorld,r=a.geometry,i=r.attributes.instanceStart,l=r.attributes.instanceEnd,s=Math.min(r.instanceCount,i.count);for(let _=0,u=s;_<u;_++){Oe.start.fromBufferAttribute(i,_),Oe.end.fromBufferAttribute(l,_),Oe.applyMatrix4(n);const m=new st,g=new st;ot.distanceSqToSegment(Oe.start,Oe.end,g,m),g.distanceTo(m)<zt*.5&&e.push({point:g,pointOnLine:m,distance:ot.origin.distanceTo(g),object:a,face:null,faceIndex:_,uv:null,uv1:null})}}function ji(a,e,n){const r=e.projectionMatrix,l=a.material.resolution,s=a.matrixWorld,_=a.geometry,u=_.attributes.instanceStart,m=_.attributes.instanceEnd,g=Math.min(_.instanceCount,u.count),f=-e.near;ot.at(1,nt),nt.w=1,nt.applyMatrix4(e.matrixWorldInverse),nt.applyMatrix4(r),nt.multiplyScalar(1/nt.w),nt.x*=l.x/2,nt.y*=l.y/2,nt.z=0,An.copy(nt),Ln.multiplyMatrices(e.matrixWorldInverse,s);for(let h=0,x=g;h<x;h++){if(Ce.fromBufferAttribute(u,h),De.fromBufferAttribute(m,h),Ce.w=1,De.w=1,Ce.applyMatrix4(Ln),De.applyMatrix4(Ln),Ce.z>f&&De.z>f)continue;if(Ce.z>f){const ue=Ce.z-De.z,pe=(Ce.z-f)/ue;Ce.lerp(De,pe)}else if(De.z>f){const ue=De.z-Ce.z,pe=(De.z-f)/ue;De.lerp(Ce,pe)}Ce.applyMatrix4(r),De.applyMatrix4(r),Ce.multiplyScalar(1/Ce.w),De.multiplyScalar(1/De.w),Ce.x*=l.x/2,Ce.y*=l.y/2,De.x*=l.x/2,De.y*=l.y/2,Oe.start.copy(Ce),Oe.start.z=0,Oe.end.copy(De),Oe.end.z=0;const p=Oe.closestPointToPointParameter(An,!0);Oe.at(p,fr);const W=ni.lerp(Ce.z,De.z,p),ee=W>=-1&&W<=1,te=An.distanceTo(fr)<zt*.5;if(ee&&te){Oe.start.fromBufferAttribute(u,h),Oe.end.fromBufferAttribute(m,h),Oe.start.applyMatrix4(s),Oe.end.applyMatrix4(s);const ue=new st,pe=new st;ot.distanceSqToSegment(Oe.start,Oe.end,pe,ue),n.push({point:pe,pointOnLine:ue,distance:ot.origin.distanceTo(pe),object:a,face:null,faceIndex:h,uv:null,uv1:null})}}}class Ri extends $r{constructor(e=new Mr,n=new fn({color:Math.random()*16777215})){super(e,n),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,n=e.attributes.instanceStart,r=e.attributes.instanceEnd,i=new Float32Array(2*n.count);for(let s=0,_=0,u=n.count;s<u;s++,_+=2)_r.fromBufferAttribute(n,s),dr.fromBufferAttribute(r,s),i[_]=_===0?0:i[_-1],i[_+1]=i[_]+_r.distanceTo(dr);const l=new Un(i,2,1);return e.setAttribute("instanceDistanceStart",new Bt(l,1,0)),e.setAttribute("instanceDistanceEnd",new Bt(l,1,1)),this}raycast(e,n){const r=this.material.worldUnits,i=e.camera;i===null&&!r&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const l=e.params.Line2!==void 0&&e.params.Line2.threshold||0;ot=e.ray;const s=this.matrixWorld,_=this.geometry,u=this.material;zt=u.linewidth+l,_.boundingSphere===null&&_.computeBoundingSphere(),an.copy(_.boundingSphere).applyMatrix4(s);let m;if(r)m=zt*.5;else{const f=Math.max(i.near,an.distanceToPoint(ot.origin));m=ur(i,f,u.resolution)}if(an.radius+=m,ot.intersectsSphere(an)===!1)return;_.boundingBox===null&&_.computeBoundingBox(),on.copy(_.boundingBox).applyMatrix4(s);let g;if(r)g=zt*.5;else{const f=Math.max(i.near,on.distanceToPoint(ot.origin));g=ur(i,f,u.resolution)}on.expandByScalar(g),ot.intersectsBox(on)!==!1&&(r?Ii(this,n):ji(this,i,n))}onBeforeRender(e){const n=this.material.uniforms;n&&n.resolution&&(e.getViewport(Mn),this.material.uniforms.resolution.value.set(Mn.z,Mn.w))}}class In extends Mr{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const n=e.length-3,r=new Float32Array(2*n);for(let i=0;i<n;i+=3)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];return super.setPositions(r),this}setColors(e){const n=e.length-3,r=new Float32Array(2*n);for(let i=0;i<n;i+=3)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];return super.setColors(r),this}setFromPoints(e){const n=e.length-1,r=new Float32Array(6*n);for(let i=0;i<n;i++)r[6*i]=e[i].x,r[6*i+1]=e[i].y,r[6*i+2]=e[i].z||0,r[6*i+3]=e[i+1].x,r[6*i+4]=e[i+1].y,r[6*i+5]=e[i+1].z||0;return super.setPositions(r),this}fromLine(e){const n=e.geometry;return this.setPositions(n.attributes.position.array),this}}class Ar extends Ri{constructor(e=new In,n=new fn({color:Math.random()*16777215})){super(e,n),this.isLine2=!0,this.type="Line2"}}function Hi(a,e){St(e,!0);const n=()=>si(s,"$size",r),[r,i]=li();let l=y(e,"scene_size",19,()=>[10,10,5]);const{size:s}=mr();let _=d(()=>Ct(l(),3)),u=d(()=>t(_)[0]),m=d(()=>t(_)[1]),g=d(()=>t(_)[2]),f=d(()=>e.ranges.x),h=d(()=>e.ranges.y),x=d(()=>e.ranges.z),b=d(()=>{const w=gr({scene_x:t(u),scene_y:t(m),scene_z:t(g),x_range:t(f),y_range:t(h),z_range:t(x)});return(A,E,P)=>w(A,E,P)});const p=(w,A)=>[t(b)(...w),t(b)(...A)];let W=d(()=>{if(e.ref_line.visible===!1)return null;const[w,A]=Dt(e.ref_line.x_span,t(f)),[E,P]=Dt(e.ref_line.y_span,t(h)),[X,k]=Dt(e.ref_line.z_span,t(x));if(e.ref_line.type==="x-axis")return p([w,e.ref_line.y,e.ref_line.z],[A,e.ref_line.y,e.ref_line.z]);if(e.ref_line.type==="y-axis")return p([e.ref_line.x,E,e.ref_line.z],[e.ref_line.x,P,e.ref_line.z]);if(e.ref_line.type==="z-axis")return p([e.ref_line.x,e.ref_line.y,X],[e.ref_line.x,e.ref_line.y,k]);if(e.ref_line.type==="segment")return p(e.ref_line.p1,e.ref_line.p2);if(e.ref_line.type==="line"){const[oe,se,F]=e.ref_line.p1,[K,S,j]=[e.ref_line.p2[0]-oe,e.ref_line.p2[1]-se,e.ref_line.p2[2]-F],N=[...K!==0?[(w-oe)/K,(A-oe)/K]:[],...S!==0?[(E-se)/S,(P-se)/S]:[],...j!==0?[(X-F)/j,(k-F)/j]:[]],D=1e-6,$=N.filter(ne=>{const[z,J,le]=[oe+ne*K,se+ne*S,F+ne*j];return z>=w-D&&z<=A+D&&J>=E-D&&J<=P+D&&le>=X-D&&le<=k+D});if($.length<2)return null;const B=Math.min(...$),I=Math.max(...$);return p([oe+B*K,se+B*S,F+B*j],[oe+I*K,se+I*S,F+I*j])}return null}),ee=d(()=>({color:e.ref_line.style?.color??"white",opacity:e.ref_line.style?.opacity??1,width:e.ref_line.style?.width??2,dashed:!!e.ref_line.style?.dash})),te=at(null),ue=at(null);$e(()=>{if(!t(W)){Ue(te,null),Ue(ue,null);return}const[w,A]=t(W),E=new In;E.setPositions([w.x,w.y,w.z,A.x,A.y,A.z]);const P=new fn({color:new Gt(t(ee).color).getHex(),linewidth:t(ee).width,transparent:t(ee).opacity<1,opacity:t(ee).opacity,dashed:t(ee).dashed,dashSize:.3,gapSize:.1,resolution:new Tn(n().width||1,n().height||1)}),X=new Ar(E,P);return X.computeLineDistances(),Ue(ue,P,!0),Ue(te,X,!0),()=>{E.dispose(),P.dispose()}}),$e(()=>{t(ue)&&t(ue).resolution.set(n().width||1,n().height||1)});var pe=ce(),ke=U(pe);{var G=w=>{H(w,{get is(){return t(te)}})};he(ke,w=>{t(te)&&w(G)})}L(a,pe),Mt(),i()}var Wi=He("<!> <!>",1);function Gi(a,e){St(e,!0);let n=y(e,"scene_size",19,()=>[10,10,5]),r=d(()=>Ct(n(),3)),i=d(()=>t(r)[0]),l=d(()=>t(r)[1]),s=d(()=>t(r)[2]),_=d(()=>e.ranges.x),u=d(()=>e.ranges.y),m=d(()=>e.ranges.z),g=d(()=>{const S=gr({scene_x:t(i),scene_y:t(l),scene_z:t(s),x_range:t(_),y_range:t(u),z_range:t(m)});return(j,N,D)=>{const{x:$,y:B,z:I}=S(j,N,D);return new st($,B,I)}}),f=d(()=>Dt(e.ref_plane.x_span,t(_))),h=d(()=>Ct(t(f),2)),x=d(()=>t(h)[0]),b=d(()=>t(h)[1]),p=d(()=>Dt(e.ref_plane.y_span,t(u))),W=d(()=>Ct(t(p),2)),ee=d(()=>t(W)[0]),te=d(()=>t(W)[1]),ue=d(()=>Dt(e.ref_plane.z_span,t(m))),pe=d(()=>Ct(t(ue),2)),ke=d(()=>t(pe)[0]),G=d(()=>t(pe)[1]);const w=S=>P(S.map(([j,N,D])=>t(g)(j,N,D)));function A(){if(e.ref_plane.visible===!1)return null;if(e.ref_plane.type==="xy"){const S=e.ref_plane.z;return w([[t(x),t(ee),S],[t(b),t(ee),S],[t(b),t(te),S],[t(x),t(te),S]])}if(e.ref_plane.type==="xz"){const S=e.ref_plane.y;return w([[t(x),S,t(ke)],[t(b),S,t(ke)],[t(b),S,t(G)],[t(x),S,t(G)]])}if(e.ref_plane.type==="yz"){const S=e.ref_plane.x;return w([[S,t(ee),t(ke)],[S,t(te),t(ke)],[S,t(te),t(G)],[S,t(ee),t(G)]])}if(e.ref_plane.type==="normal")return Math.hypot(...e.ref_plane.normal)<1e-9?null:X(e.ref_plane.normal,e.ref_plane.point);if(e.ref_plane.type==="points"){const{p1:S,p2:j,p3:N}=e.ref_plane,D=[j[0]-S[0],j[1]-S[1],j[2]-S[2]],$=[N[0]-S[0],N[1]-S[1],N[2]-S[2]],B=zn(D,$);return Math.hypot(...B)<1e-9?null:X(wn(B),S)}return null}let E=at(null);$e(()=>{const S=A();return Ue(E,S,!0),()=>S?.dispose()});function P(S){const j=new Vt,[N,D,$,B]=S,I=[N,D,$,N,$,B].flatMap(ne=>[ne.x,ne.y,ne.z]);return j.setAttribute("position",new xr(new Float32Array(I),3)),j.computeVertexNormals(),j}function X(S,j){const N=wn(S),D=wn(zn(N,Math.abs(N[0])<.9?[1,0,0]:[0,1,0])),$=zn(N,D),B=Math.max(t(b)-t(x),t(te)-t(ee),t(G)-t(ke))*2,[I,ne,z]=j,J=(ye,be)=>[I+D[0]*ye+$[0]*be,ne+D[1]*ye+$[1]*be,z+D[2]*ye+$[2]*be],le=[J(-B,-B),J(B,-B),J(B,B),J(-B,B)];return P(le.map(([ye,be,Te])=>t(g)(ye,be,Te)))}let k=d(()=>({color:e.ref_plane.style?.color??"#4488ff",opacity:e.ref_plane.style?.opacity??.3,wireframe:e.ref_plane.style?.wireframe??!1,wireframe_color:e.ref_plane.style?.wireframe_color??"white",double_sided:e.ref_plane.style?.double_sided??!0})),oe=at(null);$e(()=>{const S=t(E)&&t(k).wireframe?new Dn(t(E)):null;return Ue(oe,S,!0),()=>S?.dispose()});var se=ce(),F=U(se);{var K=S=>{var j=Wi(),N=U(j);T(N,()=>H.Mesh,(B,I)=>{I(B,{get geometry(){return t(E)},children:(ne,z)=>{var J=ce(),le=U(J);{let ye=d(()=>t(k).double_sided?Fn:yr);T(le,()=>H.MeshBasicMaterial,(be,Te)=>{Te(be,{get color(){return t(k).color},get opacity(){return t(k).opacity},transparent:!0,get side(){return t(ye)},depthWrite:!1})})}L(ne,J)},$$slots:{default:!0}})});var D=C(N,2);{var $=B=>{var I=ce(),ne=U(I);T(ne,()=>H.LineSegments,(z,J)=>{J(z,{get geometry(){return t(oe)},children:(le,ye)=>{var be=ce(),Te=U(be);T(Te,()=>H.LineBasicMaterial,(Be,Me)=>{Me(Be,{get color(){return t(k).wireframe_color}})}),L(le,be)},$$slots:{default:!0}})}),L(B,I)};he(D,B=>{t(oe)&&B($)})}L(S,j)};he(F,S=>{t(E)&&S(K)})}L(a,se),Mt()}var En=He("<!> <!>",1);function Vi(a,e){St(e,!0);let n=y(e,"x_range",19,()=>[0,1]),r=y(e,"y_range",19,()=>[0,1]),i=y(e,"z_range",19,()=>[0,1]),l=y(e,"scene_x",3,10),s=y(e,"scene_y",3,10),_=y(e,"scene_z",3,5);const u=(w,[A,E],P)=>((w-A)/(E-A||1)-.5)*P;function m(w){try{return new Gt(w)}catch{return new Gt(4491519)}}function g(w,A,E){if(e.config.color_fn)return m(e.config.color_fn(w,A,E));if(e.config.color)return m(e.config.color);const P=(E-i()[0])/(i()[1]-i()[0]||1);return new Gt().setHSL(.66-P*.66,.8,.5)}function f(w,A,E,P,X){w.push(u(E,n(),l()),u(X,i(),_()),u(P,r(),s()));const k=g(E,P,X);A.push(k.r,k.g,k.b)}function h(w,A,E,P,X){const k=new Vt;if(k.setAttribute("position",new _n(w,3)),k.setAttribute("color",new _n(A,3)),X?.length)k.setIndex(X.flat());else if(E&&P&&E>=2&&P>=2){const oe=[];for(let se=0;se<P-1;se++)for(let F=0;F<E-1;F++){const K=se*E+F;oe.push(K,K+E,K+1,K+1,K+E,K+E+1)}k.setIndex(oe)}return k.computeVertexNormals(),k}const x=()=>Array.isArray(e.config.resolution)?e.config.resolution:[e.config.resolution??20,e.config.resolution??20];function b(){const[w,A]=x(),E=[],P=[];if(e.config.type==="grid"&&e.config.z_fn){if(w<2||A<2)return new Vt;const[X,k]=e.config.x_range??n(),[oe,se]=e.config.y_range??r(),F=(k-X)/(w-1),K=(se-oe)/(A-1);for(let S=0;S<A;S++)for(let j=0;j<w;j++){const N=X+j*F,D=oe+S*K;f(E,P,N,D,e.config.z_fn(N,D))}return h(E,P,w,A)}if(e.config.type==="parametric"&&e.config.parametric_fn){if(w<2||A<2)return new Vt;const[X,k]=e.config.u_range??[0,1],[oe,se]=e.config.v_range??[0,1],F=(k-X)/(w-1),K=(se-oe)/(A-1);for(let S=0;S<A;S++)for(let j=0;j<w;j++){const N=e.config.parametric_fn(X+j*F,oe+S*K);f(E,P,N.x,N.y,N.z)}return h(E,P,w,A)}if(e.config.type==="triangulated"&&e.config.points?.length){for(const X of e.config.points)f(E,P,X.x,X.y,X.z);return h(E,P,void 0,void 0,e.config.triangles)}return null}let p=at(null),W=at(null);$e(()=>{const w=b(),A=w?new Dn(w):null;return Ue(p,w,!0),Ue(W,A,!0),()=>{w?.dispose(),A?.dispose()}});let ee=d(()=>(e.config.opacity??1)<1),te=d(()=>({transparent:t(ee),opacity:e.config.opacity??1,side:e.config.double_sided??t(ee)?Fn:yr,vertexColors:!0,depthWrite:!0})),ue=d(()=>({color:e.config.wireframe_color??"#333",linewidth:e.config.wireframe_width??1,transparent:!0,opacity:.5}));var pe=ce(),ke=U(pe);{var G=w=>{var A=En(),E=U(A);T(E,()=>H.Mesh,(k,oe)=>{oe(k,{children:(se,F)=>{var K=En(),S=U(K);H(S,{get is(){return t(p)}});var j=C(S,2);T(j,()=>H.MeshStandardMaterial,(N,D)=>{D(N,Ye(()=>t(te)))}),L(se,K)},$$slots:{default:!0}})});var P=C(E,2);{var X=k=>{var oe=ce(),se=U(oe);T(se,()=>H.LineSegments,(F,K)=>{K(F,{children:(S,j)=>{var N=En(),D=U(N);H(D,{get is(){return t(W)}});var $=C(D,2);T($,()=>H.LineBasicMaterial,(B,I)=>{I(B,Ye(()=>t(ue)))}),L(S,N)},$$slots:{default:!0}})}),L(k,oe)};he(P,k=>{e.config.wireframe&&t(W)&&k(X)})}L(w,A)};he(ke,w=>{t(p)&&w(G)})}L(a,pe),Mt()}var bt=He("<!> <!>",1),Wt=He("<!> <!> <!>",1),qi=He('<span class="tick-label svelte-z0d8pf"> </span>'),Yi=He('<span class="axis-label svelte-z0d8pf"> </span>'),Zi=He('<div class="svelte-z0d8pf"> </div>'),Xi=He('<div class="tooltip svelte-z0d8pf"><div class="svelte-z0d8pf"> </div> <div class="svelte-z0d8pf"> </div> <div class="svelte-z0d8pf"> </div> <!></div>'),Ji=He("<!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!>",1);function Ki(a,e){St(e,!0);let n=y(e,"series",19,()=>[]),r=y(e,"series_visibility",19,()=>[]),i=y(e,"x_axis",19,()=>({})),l=y(e,"y_axis",19,()=>({})),s=y(e,"z_axis",19,()=>({})),_=y(e,"display",19,()=>({})),u=y(e,"styles",19,()=>({})),m=y(e,"surfaces",19,()=>[]),g=y(e,"ref_lines",19,()=>[]),f=y(e,"ref_planes",19,()=>[]),h=y(e,"color_scale",19,()=>({type:"linear",scheme:"interpolateViridis"})),x=y(e,"size_scale",19,()=>({type:"linear",radius_range:[.05,.2]})),b=y(e,"camera_position",19,()=>[10,10,10]),p=y(e,"camera_projection",19,()=>"perspective"),W=y(e,"auto_rotate",3,0),ee=y(e,"rotation_damping",3,0),te=y(e,"fov",3,50),ue=y(e,"min_zoom",3,.1),pe=y(e,"max_zoom",3,100),ke=y(e,"rotate_speed",3,2),G=y(e,"zoom_speed",3,2),w=y(e,"pan_speed",3,2),A=y(e,"ambient_light",3,.6),E=y(e,"directional_light",3,.8),P=y(e,"sphere_segments",3,16),X=y(e,"gizmo",3,!0),k=y(e,"hovered_point",15,null),oe=y(e,"scene",15),se=y(e,"camera",15),F=y(e,"orbit_controls",15),K=y(e,"width",3,0),S=y(e,"height",3,0);const j=mr();$e(()=>{oe(j.scene),se(j.camera.current)}),Tr();const N=10,D=10,$=5,B=N/2,I=D/2,ne=$/2;let z=wt({x:-B,y:-ne,z:-I});Fr(()=>{if(!se())return;const o=se().position,c=o.x>0?-B:B,v=o.y>0?-ne:ne,M=o.z>0?-I:I;z.x!==c&&(z.x=c),z.y!==v&&(z.y=v),z.z!==M&&(z.z=M)});const J=d(()=>z.x<0?-1:1),le=d(()=>z.y<0?-1:1);let ye=d(()=>n().filter(Boolean).flatMap((o,c)=>o.x.map((v,M)=>({x:v,y:o.y[M],z:o.z[M],series_idx:c,point_idx:M,color_value:o.color_values?.[M]??null,size_value:o.size_values?.[M]??null,metadata:Array.isArray(o.metadata)?o.metadata[M]:o.metadata,point_style:Array.isArray(o.point_style)?o.point_style[M]:o.point_style}))));function be(o){const v=[];if(o.type==="grid"&&o.z_fn){const[M,R]=o.x_range??[-1,1],[Y,q]=o.y_range??[-1,1];for(let Q=0;Q<=10;Q++)for(let re=0;re<=10;re++){const me=M+Q/10*(R-M),xe=Y+re/10*(q-Y);v.push({x:me,y:xe,z:o.z_fn(me,xe)})}}else if(o.type==="parametric"&&o.parametric_fn){const[M,R]=o.u_range??[0,1],[Y,q]=o.v_range??[0,1];for(let Q=0;Q<=10;Q++)for(let re=0;re<=10;re++)v.push(o.parametric_fn(M+Q/10*(R-M),Y+re/10*(q-Y)))}else o.type==="triangulated"&&o.points&&v.push(...o.points);return v.filter(M=>isFinite(M.x)&&isFinite(M.y)&&isFinite(M.z))}function Te(o,c){if(c?.[0]!=null&&c?.[1]!=null)return c;const v=o.filter(isFinite);if(!v.length)return[0,1];let[M,R]=[Math.min(...v),Math.max(...v)];const Y=M===R?M===0?1:Math.abs(M*.1):(R-M)*.05;return c?.[0]==null&&(M-=Y),c?.[1]==null&&(R+=Y),er().domain([c?.[0]??M,c?.[1]??R]).nice().domain()}let Be=d(()=>m().flatMap(be)),Me=d(()=>Te([...t(ye).map(o=>o.x),...t(Be).map(o=>o.x)],i().range)),Pe=d(()=>Te([...t(ye).map(o=>o.y),...t(Be).map(o=>o.y)],l().range)),je=d(()=>Te([...t(ye).map(o=>o.z),...t(Be).map(o=>o.z)],s().range));const We=o=>xn(o,t(Me),N),Xe=o=>xn(o,t(Pe),D),lt=o=>xn(o,t(je),$);let dt=d(()=>t(ye).map(o=>o.color_value).filter(o=>o!=null)),gt=d(()=>{if(!t(dt).length)return[0,1];let o=t(dt)[0],c=t(dt)[0];for(const v of t(dt))v<o?o=v:v>c&&(c=v);return[o,c]}),ht=d(()=>t(ye).map(o=>o.size_value).filter(o=>o!=null)),At=d(()=>hr(h(),t(gt))),Tt=d(()=>Nr(x(),t(ht))),Xt=d(()=>t(ye).map(o=>({...o,x:We(o.x),y:lt(o.z),z:Xe(o.y)}))),Lt=d(()=>{const o={};for(const c of t(Xt)){const v=n()[c.series_idx];if(!(r()[c.series_idx]??v?.visible??!0))continue;const M=c.color_value!=null?t(At)(c.color_value):c.point_style?.fill??kn(c.series_idx),R=c.size_value!=null?t(Tt)(c.size_value):(c.point_style?.radius??u().point?.size??2)*.05,Y=R.toFixed(4);(o[Y]??={radius:R,points:[],colors:[]}).points.push(c),o[Y].colors.push(M)}return Object.values(o)}),un=d(()=>_().projection_opacity??.3),mn=d(()=>_().projection_scale??.5),gn=d(()=>["xy","xz","yz"].filter(o=>_().projections?.[o]).map(o=>({key:o,get_pos:o==="xy"?c=>[c.x,z.y,c.z]:o==="xz"?c=>[c.x,c.y,z.z]:c=>[z.x,c.y,c.z]}))),vt=at(wt([]));$e(()=>{for(const c of Sn(()=>t(vt)))c.geometry.dispose(),c.material.dispose();const o=[];for(let c=0;c<n().length;c++){const v=n()[c];if(!v?.line_style||!(r()[c]??v.visible??!0))continue;const M=t(Xt).filter(Z=>Z.series_idx===c).sort((Z,fe)=>Z.point_idx-fe.point_idx);if(M.length<2)continue;const R=[];for(const Z of M)R.push(Z.x,Z.y,Z.z);const Y=new In;Y.setPositions(R);const q=v.line_style,Q=q.stroke??(Array.isArray(v.point_style)?v.point_style[0]?.fill:v.point_style?.fill)??kn(c),re=q.stroke_width??2,me=!!q.line_dash,xe=new fn({color:new Gt(Q).getHex(),linewidth:re,dashed:me,dashScale:me?2:1,dashSize:.1,gapSize:.05,resolution:new Tn(1,1)}),_e=new Ar(Y,xe);_e.computeLineDistances(),o.push({series_idx:c,color:Q,width:re,dashed:me,line2:_e,geometry:Y,material:xe})}Ue(vt,o,!0)}),$e(()=>{const o=K()||1,c=S()||1;for(const v of t(vt))v.material.resolution.set(o,c)}),_i(()=>{for(const{geometry:o,material:c}of t(vt))o.dispose(),c.dispose();Object.values(ft).forEach(o=>o.dispose());for(const o of Object.values(tt))o.tick_geoms.forEach(c=>c.dispose()),o.grid_geoms.flat().forEach(c=>c.dispose())});function Je(o,c){if(Array.isArray(c))return c;const[v,M]=o;if(!isFinite(v)||!isFinite(M)||v===M)return[v];const R=typeof c=="number"?c:5;return er().domain([v,M]).ticks(R)}let hn=d(()=>Je(t(Me),i().ticks)),vn=d(()=>Je(t(Pe),l().ticks)),O=d(()=>Je(t(je),s().ticks));function V(o,c){const v=new Vt,M=new Float32Array([...o,...c]);return v.setAttribute("position",new xr(M,3)),v}function Le(o,c){const v=t(ye).find(M=>M.series_idx===o.series_idx&&M.point_idx===o.point_idx);return v?{x:v.x,y:v.y,z:v.z,metadata:o.metadata??null,label:n()[o.series_idx]?.label??null,series_idx:o.series_idx,x_axis:i(),y_axis:l(),z_axis:s(),x_formatted:it(v.x,i().format||".3~g"),y_formatted:it(v.y,l().format||".3~g"),z_formatted:it(v.z,s().format||".3~g"),color_value:o.color_value,fullscreen:!1,event:c,point:o}:null}function Et(o){k(o);const c=Le(o);c&&e.on_point_hover?.(c)}function kt(o,c){const v=Le(o,c);v&&e.on_point_click?.(v)}let Pt=d(()=>X()===!1?null:X()===!0?{background:{enabled:!1},offset:{left:5,bottom:5}}:X()),Ft=d(()=>({enableRotate:ke()>0,rotateSpeed:ke(),enableZoom:G()>0,zoomSpeed:G(),enablePan:w()>0,panSpeed:w(),target:[0,0,0],maxZoom:pe(),minZoom:ue(),autoRotate:!!W(),autoRotateSpeed:W(),enableDamping:ee()>0,dampingFactor:ee()}));const Nt=.15,It=["x","y","z"];let ft=wt({x:V([-B,-ne,-I],[B,-ne,-I]),y:V([-B,-ne,-I],[-B,-ne,I]),z:V([-B,-ne,-I],[-B,ne,-I])});$e(()=>{const{x:o,y:c,z:v}=z;Sn(()=>{for(const M of It)ft[M].dispose()}),ft.x=V([-B,c,v],[B,c,v]),ft.y=V([o,c,-I],[o,c,I]),ft.z=V([o,-ne,v],[o,ne,v])});let jt=d(()=>[{key:"x",color:"#ef4444",axis:i(),ticks:t(hn),range:t(Me),get_tick_pos:o=>[We(o),z.y,z.z],get_tick_end:o=>[We(o),z.y+t(le)*Nt,z.z],get_grid_lines:o=>{const c=We(o);return[[[c,-ne,z.z],[c,ne,z.z]],[[c,z.y,-I],[c,z.y,I]]]},tick_label_pos:o=>[We(o),z.y+t(le)*.4,z.z],axis_label_pos:[0,z.y+t(le)*.9,z.z]},{key:"y",color:"#22c55e",axis:l(),ticks:t(vn),range:t(Pe),get_tick_pos:o=>[z.x,z.y,Xe(o)],get_tick_end:o=>[z.x,z.y+t(le)*Nt,Xe(o)],get_grid_lines:o=>{const c=Xe(o);return[[[-B,z.y,c],[B,z.y,c]],[[z.x,-ne,c],[z.x,ne,c]]]},tick_label_pos:o=>[z.x+t(J)*.5,z.y+t(le)*.4,Xe(o)],axis_label_pos:[z.x,z.y+t(le)*.9,z.z<0?I+.5:-I-.5]},{key:"z",color:"#3b82f6",axis:s(),ticks:t(O),range:t(je),get_tick_pos:o=>[z.x,lt(o),z.z],get_tick_end:o=>[z.x+t(J)*Nt,lt(o),z.z],get_grid_lines:o=>{const c=lt(o);return[[[-B,c,z.z],[B,c,z.z]],[[z.x,c,-I],[z.x,c,I]]]},tick_label_pos:o=>[z.x+t(J)*.5,lt(o),z.z],axis_label_pos:[z.x+t(J),0,z.z]}]);const Rt=()=>({tick_geoms:[],grid_geoms:[]});let tt=wt({x:Rt(),y:Rt(),z:Rt()});$e(()=>{const o=t(jt);Sn(()=>{for(const c of It)tt[c].tick_geoms.forEach(v=>v.dispose()),tt[c].grid_geoms.flat().forEach(v=>v.dispose())});for(const{key:c,ticks:v,get_tick_pos:M,get_tick_end:R,get_grid_lines:Y}of o)tt[c]={tick_geoms:v.map(q=>V(M(q),R(q))),grid_geoms:v.map(q=>Y(q).map(([Q,re])=>V(Q,re)))}});var Jt=Ji(),Kt=U(Jt);{var we=o=>{var c=ce(),v=U(c);T(v,()=>H.PerspectiveCamera,(M,R)=>{R(M,{makeDefault:!0,get position(){return b()},get fov(){return te()},near:.1,far:1e3,children:(Y,q)=>{var Q=ce(),re=U(Q);T(re,()=>Qn,(me,xe)=>{xe(me,Ye(()=>t(Ft),{get ref(){return F()},set ref(_e){F(_e)},children:(_e,Z)=>{var fe=ce(),ae=U(fe);{var ie=Ee=>{var Ae=ce(),ge=U(Ae);T(ge,()=>$n,(de,ze)=>{ze(de,Ye(()=>t(Pt)))}),L(Ee,Ae)};he(ae,Ee=>{t(Pt)&&Ee(ie)})}L(_e,fe)},$$slots:{default:!0}}))}),L(Y,Q)},$$slots:{default:!0}})}),L(o,c)},Ge=o=>{var c=ce(),v=U(c);{let M=d(()=>Math.min(K(),S())/Math.max(N,D)/2||50);T(v,()=>H.OrthographicCamera,(R,Y)=>{Y(R,{makeDefault:!0,get position(){return b()},get zoom(){return t(M)},near:-100,far:1e3,children:(q,Q)=>{var re=ce(),me=U(re);T(me,()=>Qn,(xe,_e)=>{_e(xe,Ye(()=>t(Ft),{get ref(){return F()},set ref(Z){F(Z)},children:(Z,fe)=>{var ae=ce(),ie=U(ae);{var Ee=Ae=>{var ge=ce(),de=U(ge);T(de,()=>$n,(ze,Ve)=>{Ve(ze,Ye(()=>t(Pt)))}),L(Ae,ge)};he(ie,Ae=>{t(Pt)&&Ae(Ee)})}L(Z,ae)},$$slots:{default:!0}}))}),L(q,re)},$$slots:{default:!0}})})}L(o,c)};he(Kt,o=>{p()==="perspective"?o(we):o(Ge,-1)})}var ct=C(Kt,2);T(ct,()=>H.DirectionalLight,(o,c)=>{c(o,{position:[10,20,10],get intensity(){return E()}})});var ve=C(ct,2);{let o=d(()=>E()*.3);T(ve,()=>H.DirectionalLight,(c,v)=>{v(c,{position:[-10,-10,-10],get intensity(){return t(o)}})})}var Qt=C(ve,2);T(Qt,()=>H.AmbientLight,(o,c)=>{c(o,{get intensity(){return A()}})});var $t=C(Qt,2);{var Lr=o=>{const c=d(()=>({color:"#888",opacity:.04,transparent:!0,side:Fn,depthWrite:!1}));var v=Wt(),M=U(v);{let q=d(()=>[0,z.y,0]);T(M,()=>H.Mesh,(Q,re)=>{re(Q,{get position(){return t(q)},"rotation.x":-Math.PI/2,renderOrder:-1,children:(me,xe)=>{var _e=bt(),Z=U(_e);T(Z,()=>H.PlaneGeometry,(ae,ie)=>{ie(ae,{args:[N,D]})});var fe=C(Z,2);T(fe,()=>H.MeshBasicMaterial,(ae,ie)=>{ie(ae,Ye(()=>t(c)))}),L(me,_e)},$$slots:{default:!0}})})}var R=C(M,2);{let q=d(()=>[0,0,z.z]);T(R,()=>H.Mesh,(Q,re)=>{re(Q,{get position(){return t(q)},renderOrder:-1,children:(me,xe)=>{var _e=bt(),Z=U(_e);T(Z,()=>H.PlaneGeometry,(ae,ie)=>{ie(ae,{args:[N,$]})});var fe=C(Z,2);T(fe,()=>H.MeshBasicMaterial,(ae,ie)=>{ie(ae,Ye(()=>t(c)))}),L(me,_e)},$$slots:{default:!0}})})}var Y=C(R,2);{let q=d(()=>[z.x,0,0]);T(Y,()=>H.Mesh,(Q,re)=>{re(Q,{get position(){return t(q)},"rotation.y":Math.PI/2,renderOrder:-1,children:(me,xe)=>{var _e=bt(),Z=U(_e);T(Z,()=>H.PlaneGeometry,(ae,ie)=>{ie(ae,{args:[D,$]})});var fe=C(Z,2);T(fe,()=>H.MeshBasicMaterial,(ae,ie)=>{ie(ae,Ye(()=>t(c)))}),L(me,_e)},$$slots:{default:!0}})})}L(o,v)};he($t,o=>{_().show_grid!==!1&&o(Lr)})}var jn=C($t,2);{var Er=o=>{var c=ce(),v=U(c);qe(v,17,()=>t(jt),({key:M,color:R,axis:Y,ticks:q,tick_label_pos:Q,axis_label_pos:re})=>M,(M,R)=>{let Y=()=>t(R).key,q=()=>t(R).color,Q=()=>t(R).axis,re=()=>t(R).ticks,me=()=>t(R).tick_label_pos,xe=()=>t(R).axis_label_pos;var _e=Wt(),Z=U(_e);T(Z,()=>H.Line,(ie,Ee)=>{Ee(ie,{children:(Ae,ge)=>{var de=bt(),ze=U(de);H(ze,{get is(){return ft[Y()]}});var Ve=C(ze,2);T(Ve,()=>H.LineBasicMaterial,(Ke,pt)=>{pt(Ke,{get color(){return q()},linewidth:2})}),L(Ae,de)},$$slots:{default:!0}})});var fe=C(Z,2);qe(fe,18,re,ie=>ie,(ie,Ee,Ae)=>{var ge=Wt(),de=U(ge);{var ze=Fe=>{var Qe=ce(),_t=U(Qe);T(_t,()=>H.Line,(yt,ut)=>{ut(yt,{children:(Ze,Ut)=>{var mt=bt(),en=U(mt);H(en,{get is(){return tt[Y()].tick_geoms[t(Ae)]}});var pn=C(en,2);T(pn,()=>H.LineBasicMaterial,(Zn,tn)=>{tn(Zn,{get color(){return q()}})}),L(Ze,mt)},$$slots:{default:!0}})}),L(Fe,Qe)};he(de,Fe=>{tt[Y()].tick_geoms[t(Ae)]&&Fe(ze)})}var Ve=C(de,2);{var Ke=Fe=>{var Qe=ce(),_t=U(Qe);qe(_t,17,()=>tt[Y()].grid_geoms[t(Ae)]??[],gi,(yt,ut)=>{var Ze=ce(),Ut=U(Ze);T(Ut,()=>H.Line,(mt,en)=>{en(mt,{children:(pn,Zn)=>{var tn=bt(),Xn=U(tn);H(Xn,{get is(){return t(ut)}});var Br=C(Xn,2);T(Br,()=>H.LineBasicMaterial,(Cr,Dr)=>{Dr(Cr,{color:"#888",opacity:.4,transparent:!0})}),L(pn,tn)},$$slots:{default:!0}})}),L(yt,Ze)}),L(Fe,Qe)};he(Ve,Fe=>{_().show_grid!==!1&&Fe(Ke)})}var pt=C(Ve,2);{let Fe=d(()=>me()(Ee));T(pt,()=>yn,(Qe,_t)=>{_t(Qe,{get position(){return t(Fe)},center:!0,children:(yt,ut)=>{var Ze=qi(),Ut=Re(Ze,!0);Ne(Ze),et(mt=>Ie(Ut,mt),[()=>it(Ee,Q().format||".2~g")]),L(yt,Ze)},$$slots:{default:!0}})})}L(ie,ge)});var ae=C(fe,2);T(ae,()=>yn,(ie,Ee)=>{Ee(ie,{get position(){return xe()},center:!0,children:(Ae,ge)=>{var de=Yi();let ze;var Ve=Re(de,!0);Ne(de),et(Ke=>{ze=fi(de,"",ze,{color:q()}),Ie(Ve,Ke)},[()=>Q().label||Y().toUpperCase()]),L(Ae,de)},$$slots:{default:!0}})}),L(M,_e)}),L(o,c)};he(jn,o=>{_().show_axes!==!1&&o(Er)})}var Rn=C(jn,2);qe(Rn,17,()=>m().filter(o=>o.visible!==!1),o=>o.id??m().indexOf(o),(o,c)=>{Vi(o,{get config(){return t(c)},get x_range(){return t(Me)},get y_range(){return t(Pe)},get z_range(){return t(je)},scene_x:N,scene_y:D,scene_z:$})});var Hn=C(Rn,2);qe(Hn,19,()=>(f()??[]).filter(o=>o.visible!==!1),(o,c)=>o.id??c,(o,c)=>{{let v=d(()=>({x:t(Me),y:t(Pe),z:t(je)}));Gi(o,{get ref_plane(){return t(c)},scene_size:[N,D,$],get ranges(){return t(v)}})}});var Wn=C(Hn,2);qe(Wn,19,()=>(g()??[]).filter(o=>o.visible!==!1),(o,c)=>o.id??c,(o,c)=>{{let v=d(()=>({x:t(Me),y:t(Pe),z:t(je)}));Hi(o,{get ref_line(){return t(c)},scene_size:[N,D,$],get ranges(){return t(v)}})}});var Gn=C(Wn,2);qe(Gn,17,()=>t(vt),o=>o.series_idx,(o,c)=>{H(o,{get is(){return t(c).line2}})});var Vn=C(Gn,2);qe(Vn,17,()=>t(Lt),o=>o.radius,(o,c)=>{var v=ce(),M=U(v);T(M,()=>Kn,(R,Y)=>{Y(R,{get limit(){return t(c).points.length},get range(){return t(c).points.length},frustumCulled:!1,children:(q,Q)=>{var re=Wt(),me=U(re);{let Z=d(()=>[1,P(),P()]);T(me,()=>H.SphereGeometry,(fe,ae)=>{ae(fe,{get args(){return t(Z)}})})}var xe=C(me,2);T(xe,()=>H.MeshStandardMaterial,(Z,fe)=>{fe(Z,{vertexColors:!1})});var _e=C(xe,2);qe(_e,19,()=>t(c).points,Z=>`${Z.series_idx}-${Z.point_idx}`,(Z,fe,ae)=>{var ie=ce(),Ee=U(ie);{let Ae=d(()=>[t(fe).x,t(fe).y,t(fe).z]);T(Ee,()=>Jn,(ge,de)=>{de(ge,{get position(){return t(Ae)},get scale(){return t(c).radius},get color(){return t(c).colors[t(ae)]},onpointerenter:()=>Et(t(fe)),onpointerleave:()=>{k(null),e.on_point_hover?.(null)},onclick:ze=>kt(t(fe),ze)})})}L(Z,ie)}),L(q,re)},$$slots:{default:!0}})}),L(o,v)});var qn=C(Vn,2);qe(qn,17,()=>t(gn),({key:o,get_pos:c})=>o,(o,c)=>{let v=()=>t(c).key,M=()=>t(c).get_pos;var R=ce(),Y=U(R);qe(Y,17,()=>t(Lt),q=>q.radius,(q,Q)=>{var re=ce(),me=U(re);T(me,()=>Kn,(xe,_e)=>{_e(xe,{get limit(){return t(Q).points.length},get range(){return t(Q).points.length},frustumCulled:!1,children:(Z,fe)=>{var ae=Wt(),ie=U(ae);T(ie,()=>H.SphereGeometry,(ge,de)=>{de(ge,{args:[1,8,8]})});var Ee=C(ie,2);T(Ee,()=>H.MeshBasicMaterial,(ge,de)=>{de(ge,{transparent:!0,get opacity(){return t(un)},depthWrite:!1})});var Ae=C(Ee,2);qe(Ae,19,()=>t(Q).points,ge=>`${v()}-${ge.series_idx}-${ge.point_idx}`,(ge,de,ze)=>{var Ve=ce(),Ke=U(Ve);{let pt=d(()=>M()(t(de))),Fe=d(()=>t(Q).radius*t(mn));T(Ke,()=>Jn,(Qe,_t)=>{_t(Qe,{get position(){return t(pt)},get scale(){return t(Fe)},get color(){return t(Q).colors[t(ze)]}})})}L(ge,Ve)}),L(Z,ae)},$$slots:{default:!0}})}),L(q,re)}),L(o,R)});var Yn=C(qn,2);{var kr=o=>{const c=d(k),v=d(()=>t(Lt).find(Y=>Y.points.some(q=>q.series_idx===t(c).series_idx&&q.point_idx===t(c).point_idx)));var M=ce(),R=U(M);{let Y=d(()=>[t(c).x,t(c).y,t(c).z]),q=d(()=>(t(v)?.radius??.1)*1.5);T(R,()=>H.Mesh,(Q,re)=>{re(Q,{get position(){return t(Y)},get scale(){return t(q)},children:(me,xe)=>{var _e=bt(),Z=U(_e);T(Z,()=>H.SphereGeometry,(ae,ie)=>{ie(ae,{args:[1,16,16]})});var fe=C(Z,2);T(fe,()=>H.MeshStandardMaterial,(ae,ie)=>{ie(ae,{color:"white",transparent:!0,opacity:.4,emissive:"white",emissiveIntensity:.3,depthTest:!1,depthWrite:!1})}),L(me,_e)},$$slots:{default:!0}})})}L(o,M)};he(Yn,o=>{k()&&o(kr)})}var Pr=C(Yn,2);{var Ur=o=>{const c=d(k),v=d(()=>Le(t(c)));var M=ce(),R=U(M);{var Y=q=>{var Q=ce(),re=U(Q);{let me=d(()=>[t(c).x,t(c).y+.3,t(c).z]);T(re,()=>yn,(xe,_e)=>{_e(xe,{get position(){return t(me)},center:!0,children:(Z,fe)=>{var ae=ce(),ie=U(ae);{var Ee=ge=>{var de=ce(),ze=U(de);Cn(ze,()=>e.tooltip,()=>t(v)),L(ge,de)},Ae=ge=>{var de=Xi(),ze=Re(de),Ve=Re(ze);Ne(ze);var Ke=C(ze,2),pt=Re(Ke);Ne(Ke);var Fe=C(Ke,2),Qe=Re(Fe);Ne(Fe);var _t=C(Fe,2);{var yt=ut=>{var Ze=Zi(),Ut=Re(Ze);Ne(Ze),et(mt=>Ie(Ut,`value: ${mt??""}`),[()=>it(t(v).color_value,".3~g")]),L(ut,Ze)};he(_t,ut=>{t(v).color_value!=null&&ut(yt)})}Ne(de),et(()=>{Ie(Ve,`x: ${t(v).x_formatted??""}`),Ie(pt,`y: ${t(v).y_formatted??""}`),Ie(Qe,`z: ${t(v).z_formatted??""}`)}),L(ge,de)};he(ie,ge=>{e.tooltip?ge(Ee):ge(Ae,-1)})}L(Z,ae)},$$slots:{default:!0}})})}L(q,Q)};he(R,q=>{t(v)&&q(Y)})}L(o,M)};he(Pr,o=>{k()&&o(Ur)})}L(a,Jt),Mt()}var Qi=new Set(["$$slots","$$events","$$legacy","series","surfaces","ref_lines","ref_planes","x_axis","y_axis","z_axis","display","styles","color_scale","color_bar","size_scale","legend","camera_position","camera_projection","auto_rotate","rotation_damping","fov","min_zoom","max_zoom","rotate_speed","zoom_speed","pan_speed","ambient_light","directional_light","sphere_segments","gizmo","controls","hovered","tooltip_point","on_point_click","on_point_hover","on_series_visibility_change","fullscreen","fullscreen_toggle","wrapper","scene","camera","orbit_controls","tooltip","children","header_controls","controls_extra"]),$i=He('<div class="header-controls svelte-ik6b6v"><!> <!></div> <!> <!> <!> <!> <!>',1),eo=He("<div><!></div>");function Po(a,e){St(e,!0);let n=y(e,"series",19,()=>[]),r=y(e,"surfaces",19,()=>[]),i=y(e,"ref_lines",19,()=>[]),l=y(e,"ref_planes",19,()=>[]),s=y(e,"x_axis",19,()=>({})),_=y(e,"y_axis",19,()=>({})),u=y(e,"z_axis",19,()=>({})),m=y(e,"display",19,()=>({show_axes:!0,show_grid:!0,show_axis_labels:!0})),g=y(e,"styles",19,()=>({})),f=y(e,"color_scale",19,()=>({type:"linear",scheme:"interpolateViridis",value_range:void 0})),h=y(e,"color_bar",19,()=>({})),x=y(e,"size_scale",19,()=>({type:"linear",radius_range:[.05,.2],value_range:void 0})),b=y(e,"legend",19,()=>({})),p=y(e,"camera_position",27,()=>wt([8,8,8])),W=y(e,"camera_projection",19,()=>"perspective"),ee=y(e,"auto_rotate",3,0),te=y(e,"rotation_damping",3,0),ue=y(e,"fov",3,50),pe=y(e,"min_zoom",3,.1),ke=y(e,"max_zoom",3,100),G=y(e,"rotate_speed",3,1),w=y(e,"zoom_speed",3,2),A=y(e,"pan_speed",3,2),E=y(e,"ambient_light",3,.6),P=y(e,"directional_light",3,.8),X=y(e,"sphere_segments",3,16),k=y(e,"gizmo",3,!0),oe=y(e,"controls",19,()=>({})),se=y(e,"hovered",15,!1),F=y(e,"tooltip_point",15,null),K=y(e,"fullscreen",15,!1),S=y(e,"fullscreen_toggle",3,!0),j=y(e,"wrapper",15),N=y(e,"scene",15),D=y(e,"camera",15),$=y(e,"orbit_controls",15),B=Nn(e,Qi),I=[0,0],ne=d(()=>Ct(I,2)),z=at(wt(t(ne)[0])),J=at(wt(t(ne)[1])),le=at(!1);di(()=>Ue(le,!0));const ye=d(()=>{const O=new Map;for(const V of n())V?.id!==void 0&&V.id!==""&&O.set(V.id,(O.get(V.id)??0)+1);return n().map((V,Le)=>V?.id===void 0||V.id===""?JSON.stringify(["idx",Le]):O.get(V.id)===1?JSON.stringify(["id",V.id]):JSON.stringify(["duplicate-id",Le,V.id]))}),be=new cn;let Te=d(()=>new Ir(t(ye)));$e(()=>{for(const O of be.keys())t(Te).has(O)||be.delete(O)});let Be=d(()=>n().map((O,V)=>be.get(t(ye)[V])??O?.visible??!0));const Me={format:".3~g",scale_type:"linear"};let Pe=d(()=>({label:"X",...Me,...s()})),je=d(()=>({label:"Y",...Me,..._()})),We=d(()=>({label:"Z",...Me,...u()})),Xe=d(()=>({show_axes:!0,show_grid:!0,show_axis_labels:!0,...m()})),lt=d(W),dt=d(ee),gt=d(()=>({show:!0,open:!1,...oe()})),ht=d(()=>typeof f()=="string"?{type:"linear",scheme:f()}:f()),At=d(()=>n().filter(Boolean).flatMap(O=>O.color_values?.filter(V=>V!=null)??[])),Tt=d(()=>{if(t(At).length===0)return[0,1];let[O,V]=[1/0,-1/0];for(const Le of t(At))Le<O&&(O=Le),Le>V&&(V=Le);return[O,V]}),Xt=d(()=>hr(t(ht),t(Tt))),Lt=d(()=>n().map((O,V)=>{const Le=t(Be)[V]??!0,Et=O?.label??`Series ${V+1}`,kt=kn(V);return{series_idx:V,label:Et,visible:Le,display_style:{symbol_type:"Circle",symbol_color:O?.point_style?(Array.isArray(O.point_style)?O.point_style[0]?.fill:O.point_style?.fill)??kt:kt},has_explicit_label:!!O?.label,legend_group:O?.legend_group}})),un=d(()=>h()&&t(At).length>0),mn=d(()=>{if(k()===!1)return!1;const O={left:5,bottom:t(un)?70:5},V={background:{enabled:!1},offset:O,className:"scatter3d-gizmo"};if(k()===!0)return V;const Le=`scatter3d-gizmo ${k().className??""}`.trim();return{...V,...k(),offset:{...O,...k().offset},className:Le}});function gn(O){const V=!t(Be)[O];be.set(t(ye)[O],V),e.on_series_visibility_change?.(O,V)}function vt(O){se(O!==null),F(O?.point??null),e.on_point_hover?.(O)}var Je=eo();oi("keydown",ii,O=>{O.key==="Escape"&&K()&&(O.preventDefault(),K(!1))}),ui(Je,()=>({...B,class:`scatter-3d ${e.class??""??""}`,[mi]:{fullscreen:K()}}),void 0,void 0,void 0,"svelte-ik6b6v");var hn=Re(Je);{var vn=O=>{var V=$i(),Le=U(V),Et=Re(Le);Cn(Et,()=>e.header_controls??Bn,()=>({height:t(J),width:t(z),fullscreen:K()}));var kt=C(Et,2);{var Pt=we=>{jr(we,{get fullscreen(){return K()},set fullscreen(Ge){K(Ge)}})};he(kt,we=>{S()&&we(Pt)})}Ne(Le);var Ft=C(Le,2);{var Nt=we=>{Rr(we,{children:(Ge,ct)=>{Ki(Ge,{get series(){return n()},get series_visibility(){return t(Be)},get surfaces(){return r()},get ref_lines(){return i()},get ref_planes(){return l()},get x_axis(){return t(Pe)},get y_axis(){return t(je)},get z_axis(){return t(We)},get display(){return t(Xe)},get styles(){return g()},get color_scale(){return t(ht)},get size_scale(){return x()},get camera_position(){return p()},get camera_projection(){return t(lt)},get auto_rotate(){return t(dt)},get rotation_damping(){return te()},get fov(){return ue()},get min_zoom(){return pe()},get max_zoom(){return ke()},get rotate_speed(){return G()},get zoom_speed(){return w()},get pan_speed(){return A()},get ambient_light(){return E()},get directional_light(){return P()},get sphere_segments(){return X()},get gizmo(){return t(mn)},get on_point_click(){return e.on_point_click},on_point_hover:vt,get tooltip(){return e.tooltip},get width(){return t(z)},get height(){return t(J)},get hovered_point(){return F()},set hovered_point(ve){F(ve)},get scene(){return N()},set scene(ve){N(ve)},get camera(){return D()},set camera(ve){D(ve)},get orbit_controls(){return $()},set orbit_controls(ve){$(ve)}})},$$slots:{default:!0}})};he(Ft,we=>{t(le)&&typeof WebGLRenderingContext<"u"&&we(Nt)})}var It=C(Ft,2);{var ft=we=>{{let Ge=d(()=>({...t(gt).toggle_props,style:`--ctrl-btn-right: var(--fullscreen-btn-offset, 32px); ${t(gt).toggle_props?.style??""}`})),ct=d(()=>({...t(gt).pane_props,style:`--pane-z-index: var(--z-index-overlay-dialog, 100000002); ${t(gt).pane_props?.style??""}`}));Hr(we,{get toggle_props(){return t(Ge)},get pane_props(){return t(ct)},get series(){return n()},get surfaces(){return r()},get children(){return e.controls_extra},get x_axis(){return t(Pe)},set x_axis(ve){Ue(Pe,ve)},get y_axis(){return t(je)},set y_axis(ve){Ue(je,ve)},get z_axis(){return t(We)},set z_axis(ve){Ue(We,ve)},get display(){return t(Xe)},set display(ve){Ue(Xe,ve)},get camera_projection(){return t(lt)},set camera_projection(ve){Ue(lt,ve)},get auto_rotate(){return t(dt)},set auto_rotate(ve){Ue(dt,ve)}})}};he(It,we=>{t(gt).show&&we(ft)})}var jt=C(It,2);{var Rt=we=>{const Ge=d(()=>[t(ht).value_range?.[0]??t(Tt)[0],t(ht).value_range?.[1]??t(Tt)[1]]);{let ct=d(()=>t(Ge)?.every($t=>$t!=null)?t(Ge):void 0),ve=d(()=>h()?.wrapper_style??""),Qt=d(()=>h()?.style??"");Wr(we,Ye({tick_labels:4,tick_side:"primary",get color_scale_fn(){return t(Xt)},get color_scale_domain(){return t(Ge)},get scale_type(){return t(ht).type},get range(){return t(ct)},get wrapper_style(){return`position: absolute; bottom: 2em; left: 2em; ${t(ve)??""}`},get bar_style(){return`width: 200px; height: 16px; ${t(Qt)??""}`}},h))}};he(jt,we=>{h()&&t(At).length>0&&we(Rt)})}var tt=C(jt,2);{var Jt=we=>{{let Ge=d(()=>F()?.series_idx??null),ct=d(()=>b()?.draggable??!0),ve=d(()=>`position: absolute; top: 2.5em; right: 1em; ${b()?.style??""}`);Gr(we,Ye({get series_data(){return t(Lt)},on_toggle:gn,get active_series_idx(){return t(Ge)},get draggable(){return t(ct)}},b,{get style(){return t(ve)}}))}};he(tt,we=>{b()!=null&&t(Lt).length>1&&we(Jt)})}var Kt=C(tt,2);Cn(Kt,()=>e.children??Bn,()=>({height:t(J),width:t(z),fullscreen:K()})),L(O,V)};he(hn,O=>{t(z)&&t(J)&&O(vn)})}Ne(Je),ci(Je,O=>j(O),()=>j()),ir(Je,"clientWidth",O=>Ue(z,O)),ir(Je,"clientHeight",O=>Ue(J,O)),L(a,Je),Mt()}const to=(a,e=Bn)=>{const n=d(()=>{const{x:m,y:g}=e();return{sg:m,count:g}}),r=d(()=>Pn(t(n).sg));rr();var i=io(),l=U(i),s=C(l,3);{var _=m=>{var g=ro(),f=U(g);rr(),et(()=>Ie(f,`Crystal System: ${t(r)??""}`)),L(m,g)};he(s,m=>{t(r)&&m(_)})}var u=C(s);et((m,g)=>{Ie(l,`Space Group: ${m??""} (${Yr[t(n).sg]??""})`),Ie(u,` Count: ${g??""}`)},[()=>nr(t(n).sg,".0f"),()=>nr(t(n).count,".0f")]),L(a,i)};var no=new Set(["$$slots","$$events","$$legacy","data","show_counts","show_legend","orientation","x_axis","y_axis"]),ro=He(" <br/>",1),io=He(" <br/> <!> ",1),oo=Zt('<text text-anchor="middle" font-size="12" fill="var(--text-color, black)"> </text>'),ao=Zt('<rect opacity="0.15" stroke-width="1" stroke-opacity="0.3"></rect><text text-anchor="start" font-size="14" fill="var(--text-color, black)" opacity="0.6"> </text><!>',1),so=Zt('<text text-anchor="start" dominant-baseline="central" font-size="12" fill="var(--text-color, black)"> </text>'),lo=Zt('<rect opacity="0.15" stroke-width="1" stroke-opacity="0.3"></rect><text text-anchor="end" dominant-baseline="central" font-size="14" fill="var(--text-color, black)" opacity="0.6"> </text><!>',1),co=Zt('<g class="crystal-system-overlays" pointer-events="none"></g>');function Uo(a,e){St(e,!0);const n=(G,w)=>{let A=()=>(w?.()).width,E=()=>(w?.()).height,P=()=>(w?.()).x_scale_fn,X=()=>(w?.()).y_scale_fn,k=()=>(w?.()).pad;var oe=co();qe(oe,21,()=>t(te),se=>se.system,(se,F)=>{var K=ce(),S=U(K);{var j=D=>{const $=d(()=>P()(t(F).sg_start-.5)),B=d(()=>P()(t(F).sg_end+.5)),I=d(()=>(t($)+t(B))/2),ne=d(()=>t(B)-t($));var z=ao(),J=U(z),le=C(J),ye=Re(le,!0);Ne(le);var be=C(le);{var Te=Be=>{const Me=d(()=>t(F).system==="triclinic"?-20:-5);var Pe=oo(),je=Re(Pe);Ne(Pe),et((We,Xe)=>{Se(Pe,"x",t(I)),Se(Pe,"y",k().t+t(Me)),Ie(je,`${We??""} (${Xe??""})`)},[()=>it(t(F).count,",~"),()=>it(t(F).count/t(ue),".1~%")]),L(Be,Pe)};he(be,Be=>{l()&&t(ue)>0&&Be(Te)})}et(()=>{Se(J,"x",t($)),Se(J,"y",k().t),Se(J,"width",t(ne)),Se(J,"height",E()-k().t-k().b),Se(J,"fill",t(F).color),Se(J,"stroke",t(F).color),Se(le,"x",t(I)),Se(le,"y",k().t+15),Se(le,"transform",`rotate(90, ${t(I)??""}, ${k().t+15})`),Ie(ye,t(F).system)}),L(D,z)},N=D=>{const $=d(()=>X()(t(F).sg_end+.5)),B=d(()=>X()(t(F).sg_start-.5)),I=d(()=>(t($)+t(B))/2),ne=d(()=>t(B)-t($));var z=lo(),J=U(z),le=C(J),ye=Re(le,!0);Ne(le);var be=C(le);{var Te=Be=>{var Me=so(),Pe=Re(Me);Ne(Me),et((je,We)=>{Se(Me,"x",A()-k().r+5),Se(Me,"y",t(I)),Ie(Pe,`${je??""} (${We??""})`)},[()=>it(t(F).count,",~"),()=>it(t(F).count/t(ue),".1~%")]),L(Be,Me)};he(be,Be=>{l()&&t(ue)>0&&Be(Te)})}et(()=>{Se(J,"x",k().l),Se(J,"y",t($)),Se(J,"width",A()-k().l-k().r),Se(J,"height",t(ne)),Se(J,"fill",t(F).color),Se(J,"stroke",t(F).color),Se(le,"x",A()-k().r-8),Se(le,"y",t(I)),Ie(ye,t(F).system)}),L(D,z)};he(S,D=>{_()==="vertical"?D(j):D(N,-1)})}L(se,K)}),Ne(oe),L(G,oe)},r=(G,w)=>({...G,label:{...G?.label,rotation:G?.label?.rotation??w}}),i=230;let l=y(e,"show_counts",3,!0),s=y(e,"show_legend",3,!1),_=y(e,"orientation",19,()=>"vertical"),u=y(e,"x_axis",19,()=>({})),m=y(e,"y_axis",19,()=>({})),g=Nn(e,no);const f=d(()=>e.data.map(Zr).filter(G=>G!==null)),h=d(()=>{const G=new cn;for(const w of t(f))G.set(w,(G.get(w)??0)+1);return G}),x=d(()=>{const G=new cn;for(const w of bn)G.set(w,{count:0,spacegroups:[]});for(const[w,A]of t(h)){const E=Pn(w);if(!E)continue;const P=G.get(E);P&&(P.count+=A,P.spacegroups.push(w))}return G}),b=d(()=>Array.from(t(h).keys()).sort((G,w)=>G-w)),p=d(()=>t(b).filter(w=>(t(h).get(w)??0)>0).length>40?t(b).filter(w=>w%5===0):t(b)),W=d(()=>{const G=new cn;for(const A of t(b)){const E=Pn(A);if(E){let P=G.get(E);P||(P={x:[],y:[]},G.set(E,P)),P.x.push(A),P.y.push(t(h).get(A)??0)}}const w=[];for(const A of bn){const E=G.get(A);if(E){const{x:P,y:X}=E,k=tr[A];w.push({x:P,y:X,color:k,label:A,bar_width:.9,visible:!0})}}return w}),ee=[.5,i+.5],te=d(()=>{const[G,w]=ee;return bn.map(A=>{const[E,P]=qr[A],k=t(x).get(A)?.count??0,oe=tr[A];return{system:A,sg_start:E,sg_end:P,count:k,color:oe}}).filter(A=>A.sg_end>=G&&A.sg_start<=w)}),ue=d(()=>t(f).length),pe=d(()=>_()==="horizontal"?{...u(),label:u().label??"Counts"}:{...u(),label:u().label??"International Spacegroup Number",range:ee,ticks:t(p),tick:r(u().tick,90),label_shift:{x:0,y:20,...u().label_shift}}),ke=d(()=>_()==="horizontal"?{...m(),label:m().label??"International Spacegroup Number",range:ee,ticks:t(p),tick:r(m().tick,0)}:{...m(),label:m().label??"Counts"});Vr(a,Ye(()=>g,{get series(){return t(W)},get orientation(){return _()},mode:"overlay",get x_axis(){return t(pe)},get y_axis(){return t(ke)},get show_legend(){return s()},show_controls:!1,get tooltip(){return to},get user_content(){return n}})),Mt()}function Bo(a){const e=a.filter(Number.isFinite);if(e.length===0)return[0,1];let[n,r]=[e[0],e[0]];for(const l of e)l<n?n=l:l>r&&(r=l);const i=(r-n)*.05||.5;return[n-i,r+i]}export{Oo as AXIS_LABEL_HEIGHT,To as AxisLabel,Vr as BarPlot,Fo as BarPlotControls,No as BinnedScatterPlot,Io as CELLS_3X3,jo as CORNER_CELLS,Wr as ColorBar,Ro as ColorScaleSelect,Ho as DEFAULT_GRID_STYLE,Wo as DEFAULT_MARKERS,Go as DEFAULT_SERIES_COLORS,Vo as DEFAULT_SERIES_SYMBOLS,ko as ElementScatter,qo as FILL_CURVE_TYPES,Yo as FillArea,Zo as Histogram,Xo as HistogramControls,Jo as InteractiveAxisLabel,Ko as LABEL_GAP_DEFAULT,Qo as LINE_TYPES,$o as LOG_EPSILON,ea as Line,ta as PINCH_ZOOM_THRESHOLD,na as PlotAxis,ra as PlotControls,Gr as PlotLegend,ia as PlotTooltip,oa as PortalSelect,aa as REF_LINE_STYLE_DEFAULTS,sa as ReferenceLine,Hi as ReferenceLine3D,Gi as ReferencePlane,Or as ScatterPlot,Po as ScatterPlot3D,Hr as ScatterPlot3DControls,Ki as ScatterPlot3DScene,la as ScatterPlotControls,ca as ScatterPoint,Uo as SpacegroupBarPlot,Vi as Surface3D,_a as TICK_LABEL_HEIGHT,da as ZeroLines,fa as ZoomRect,zr as apply_bounds,ua as apply_range_constraints,ma as apply_where_condition,ga as bar_path,ha as calc_auto_padding,Bo as calc_auto_range,va as calculate_annotation_position,pa as calculate_domain,ya as centered_rect,xa as clamp_for_log_scale,Ao as clean_multi_series,Mo as clean_series,Eo as clean_trajectory_props,Lo as clean_xyz,ba as compute_element_placement,wi as compute_local_variance,wa as constrain_tooltip_position,za as convert_error_band_to_fill_region,hr as create_color_scale,Sa as create_scale,Nr as create_size_scale,Ma as create_time_scale,gr as create_to_threejs,Ai as detect_instability,Aa as expand_range_if_needed,La as filter_padding,Ea as generate_arcsinh_ticks,ka as generate_fill_path,Pa as generate_log_ticks,Ua as generate_ticks,Ba as get_arcsinh_threshold,Ca as get_nice_data_range,Da as get_relative_coords,Oa as get_scale_type_name,Ta as get_tick_label,Fa as group_ref_lines_by_z,Ot as handle_invalid_values,Na as index_ref_lines,Ia as interpolate_series,ja as is_fill_gradient,Ra as is_scale_type_name,Ha as is_time_scale,Wa as is_y2_sync_mode,Ga as measure_full_footprint,Va as measure_max_tick_width,qa as measure_text_width,Ya as normalize_point,xn as normalize_to_scene,Za as normalize_value,Xa as normalize_y2_sync,Ja as pad_rect,Ka as pan_range,Qa as pixels_to_data_delta,$a as rect_within_rect,es as rects_overlap,Oi as remove_local_outliers,ts as resolve_boundary,ns as resolve_line_endpoints,rs as resolve_series_ref,is as sample_series_obstacle_points,os as scale_arcsinh,Li as smooth_moving_average,ki as smooth_savitzky_golay,Dt as span_or,So as sync_metadata,as as sync_y2_range};
