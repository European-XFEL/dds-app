const O=typeof __SENTRY_DEBUG__>"u"||__SENTRY_DEBUG__,L=globalThis,Me="10.65.0";function Oe(){return rt(L),L}function rt(e){const t=e.__SENTRY__=e.__SENTRY__||{};return t.version=t.version||Me,t[Me]=t[Me]||{}}function Le(e,t,n=L){const r=n.__SENTRY__=n.__SENTRY__||{},o=r[Me]=r[Me]||{};return o[e]||(o[e]=t())}const Qs=["debug","info","warn","error","log","assert","trace"],Pr="Sentry Logger ",Jt={};function Ot(e){if(!("console"in L))return e();const t=L.console,n={},r=Object.keys(Jt);r.forEach(o=>{const i=Jt[o];n[o]=t[o],t[o]=i});try{return e()}finally{r.forEach(o=>{t[o]=n[o]})}}function $r(){Ft().enabled=!0}function Ur(){Ft().enabled=!1}function Mn(){return Ft().enabled}function Br(...e){Lt("log",...e)}function Hr(...e){Lt("warn",...e)}function jr(...e){Lt("error",...e)}function Lt(e,...t){O&&Mn()&&Ot(()=>{L.console[e](`${Pr}[${e}]:`,...t)})}function Ft(){return O?Le("loggerSettings",()=>({enabled:!1})):{enabled:!1}}const k={enable:$r,disable:Ur,isEnabled:Mn,log:Br,warn:Hr,error:jr},Dn=50,Gr="?",Zt=/\(error: (.*)\)/,Qt=/captureMessage|captureException/;function zr(...e){const t=e.sort((n,r)=>n[0]-r[0]).map(n=>n[1]);return(n,r=0,o=0)=>{const i=[],a=n.split(`
`);for(let c=r;c<a.length;c++){let l=a[c];l.length>1024&&(l=l.slice(0,1024));const u=Zt.test(l)?l.replace(Zt,"$1"):l;if(!u.includes("Error: ")){for(const d of t){const s=d(u);if(s){i.push(s);break}}if(i.length>=Dn+o)break}}return Wr(i.slice(o))}}function ea(e){return Array.isArray(e)?zr(...e):e}function Wr(e){if(!e.length)return[];const t=Array.from(e);return/sentryWrapped/.test(Ge(t).function||"")&&t.pop(),t.reverse(),Qt.test(Ge(t).function||"")&&(t.pop(),Qt.test(Ge(t).function||"")&&t.pop()),t.slice(0,Dn).map(n=>({...n,filename:n.filename||Ge(t).filename,function:n.function||Gr}))}function Ge(e){return e[e.length-1]||{}}const dt="<anonymous>";function Vr(e){try{return!e||typeof e!="function"?dt:e.name||dt}catch{return dt}}function ta(e){const t=e.exception;if(t){const n=[];try{return t.values.forEach(r=>{r.stacktrace.frames&&n.push(...r.stacktrace.frames)}),n}catch{return}}}function na(e){let t=e?.startsWith("file://")?e.slice(7):e;return t?.match(/\/[A-Z]:/)&&(t=t.slice(1)),t}const On=Object.prototype.toString;function qr(e){switch(On.call(e)){case"[object Error]":case"[object Exception]":case"[object DOMException]":case"[object WebAssembly.Exception]":return!0;default:return Pt(e,Error)}}function xe(e,t){return On.call(e)===`[object ${t}]`}function ra(e){return xe(e,"ErrorEvent")}function oa(e){return xe(e,"DOMError")}function ia(e){return xe(e,"DOMException")}function vt(e){return xe(e,"String")}function Yr(e){return typeof e=="object"&&e!==null&&"__sentry_template_string__"in e&&"__sentry_template_values__"in e}function Xr(e){return e===null||Yr(e)||typeof e!="object"&&typeof e!="function"}function Kr(e){return xe(e,"Object")}function Jr(e){return typeof e=="object"&&e!==null}function Zr(e){return typeof Event<"u"&&Pt(e,Event)}function Qr(e){return xe(e,"RegExp")}function eo(e){return!!(e?.then&&typeof e.then=="function")}function Pt(e,t){try{return e instanceof t}catch{return!1}}function sa(e){return typeof Request<"u"&&Pt(e,Request)}function aa(e,t,n){if(!(t in e))return;const r=e[t];if(typeof r!="function")return;const o=n(r);typeof o=="function"&&to(o,r);try{e[t]=o}catch{O&&k.log(`Failed to replace method "${t}" in object`,e)}}function K(e,t,n){try{Object.defineProperty(e,t,{value:n,writable:!0,configurable:!0})}catch{O&&k.log(`Failed to add non-enumerable property "${String(t)}" to object`,e)}}function to(e,t){try{const n=t.prototype||{};e.prototype=t.prototype=n,K(e,"__sentry_original__",t)}catch{}}function ca(e){return e.__sentry_original__}function Ln(e){if(qr(e))return{message:e.message,name:e.name,stack:e.stack,...en(e)};if(Zr(e)){const{type:t,target:n,currentTarget:r,detail:o}=e;return{type:t,target:n,currentTarget:r,...o?{detail:o}:{},...en(e)}}return e}function en(e){return Jr(e)?Object.fromEntries(Object.entries(e)):{}}function ua(e){const t=Object.keys(Ln(e));return t.sort(),t[0]?t.join(", "):"[object has no keys]"}let Se;function Fe(e){if(Se!==void 0)return Se?Se(e):e();const t=Symbol.for("__SENTRY_SAFE_RANDOM_ID_WRAPPER__"),n=L;return t in n&&typeof n[t]=="function"?(Se=n[t],Se(e)):(Se=null,e())}function pe(){return Fe(()=>Math.random())}function $t(){return Fe(()=>Date.now())}const no=Symbol.for("sentry.skipNormalization"),ro=Symbol.for("sentry.overrideNormalizationDepth");function oo(e){return!!e[no]}function io(e){const t=e[ro];return typeof t=="number"?t:void 0}let Et;function la(e){Et=e}function Fn(e,t=100,n=1/0){try{return Tt("",e,t,n)}catch(r){return{ERROR:`**non-serializable** (${r})`}}}function so(e,t=3,n=100*1024){const r=Fn(e,t);return uo(r)>n?so(e,t-1,n):r}function Tt(e,t,n=1/0,r=1/0,o=lo()){const[i,a]=o;if(t==null||["boolean","string"].includes(typeof t)||typeof t=="number"&&Number.isFinite(t))return t;const c=Pn(e,t);if(!c.startsWith("[object "))return c;if(oo(t))return t;const l=io(t),u=l!==void 0?l:n;if(u===0)return c.replace("object ","");if(i(t))return"[Circular ~]";const d=t;if(d&&typeof d.toJSON=="function")try{const p=d.toJSON();return Tt("",p,u-1,r,o)}catch{}const s=Array.isArray(t)?[]:{};let f=0;const _=Ln(t);for(const p in _){if(!Object.prototype.hasOwnProperty.call(_,p))continue;if(f>=r){s[p]="[MaxProperties ~]";break}const b=_[p];s[p]=Tt(p,b,u-1,r,o),f++}return a(t),s}function Pn(e,t){try{if(Et){const r=Et(t);if(r)return r}return typeof global<"u"&&t===global?"[Global]":typeof t=="number"&&!Number.isFinite(t)?`[${t}]`:typeof t=="function"?`[Function: ${Vr(t)}]`:typeof t=="symbol"?`[${String(t)}]`:typeof t=="bigint"?`[BigInt: ${String(t)}]`:`[object ${ao(t)}]`}catch(n){return`**non-serializable** (${n})`}}function ao(e){const t=Object.getPrototypeOf(e);return t?.constructor?t.constructor.name:"null prototype"}function co(e){return~-encodeURI(e).split(/%..|./).length}function uo(e){return co(JSON.stringify(e))}function lo(){const e=new WeakSet;function t(r){return e.has(r)?!0:(e.add(r),!1)}function n(r){e.delete(r)}return[t,n]}function _o(e,t=0){return typeof e!="string"||t===0||e.length<=t?e:`${e.slice(0,t)}...`}function da(e,t){if(!Array.isArray(e))return"";const n=[];for(let r=0;r<e.length;r++){const o=e[r];Xr(o)?n.push(String(o)):o instanceof Error?n.push(o.message?`${o.name}: ${o.message}`:o.name):n.push(Pn(void 0,o))}return n.join(t)}function fo(e,t,n=!1){return vt(e)?Qr(t)?t.test(e):vt(t)?n?e===t:e.includes(t):typeof t=="function"?t(e):!1:!1}function _a(e,t=[],n=!1){for(const r of t)if(fo(e,r,n))return!0;return!1}function po(){const e=L;return e.crypto||e.msCrypto}let _t;function go(){return pe()*16}function ge(e=po()){try{if(e?.randomUUID)return Fe(()=>e.randomUUID()).replace(/-/g,"")}catch{}return _t||(_t="10000000100040008000"+1e11),_t.replace(/[018]/g,t=>(t^(go()&15)>>t/4).toString(16))}function $n(e){return e.exception?.values?.[0]}function fa(e){const{message:t,event_id:n}=e;if(t)return t;const r=$n(e);return r?r.type&&r.value?`${r.type}: ${r.value}`:r.type||r.value||n||"<unknown>":n||"<unknown>"}function pa(e,t,n){const r=e.exception=e.exception||{},o=r.values=r.values||[],i=o[0]=o[0]||{};i.value||(i.value=t||""),i.type||(i.type="Error")}function ga(e,t){const n=$n(e);if(!n)return;const r={type:"generic",handled:!0},o=n.mechanism;if(n.mechanism={...r,...o,...t},t&&"data"in t){const i={...o?.data,...t.data};n.mechanism.data=i}}function ha(e){if(ho(e))return!0;try{K(e,"__sentry_captured__",!0)}catch{}return!1}function ho(e){try{return e.__sentry_captured__}catch{}}const Un=1e3;function Bn(){return $t()/Un}function mo(){const{performance:e}=L;if(!e?.now||!e.timeOrigin)return Bn;const t=e.timeOrigin;return()=>(t+Fe(()=>e.now()))/Un}let tn;function ot(){return(tn??(tn=mo()))()}let ft=null;function bo(){const{performance:e}=L;if(!e?.now)return;const t=3e5,n=Fe(()=>e.now()),r=$t(),o=e.timeOrigin;if(typeof o=="number"&&Math.abs(o+n-r)<t)return o;const i=e.timing?.navigationStart;return typeof i=="number"&&Math.abs(i+n-r)<t?i:r-n}function ma(){return ft===null&&(ft=bo()),ft}function ba(e){const t=ot(),n={sid:ge(),init:!0,timestamp:t,started:t,duration:0,status:"ok",errors:0,ignoreDuration:!1,toJSON:()=>yo(n)};return e&&Ut(n,e),n}function Ut(e,t={}){if(t.user&&(!e.ipAddress&&t.user.ip_address&&(e.ipAddress=t.user.ip_address),!e.did&&!t.did&&(e.did=t.user.id||t.user.email||t.user.username)),e.timestamp=t.timestamp||ot(),t.abnormal_mechanism&&(e.abnormal_mechanism=t.abnormal_mechanism),t.ignoreDuration&&(e.ignoreDuration=t.ignoreDuration),t.sid&&(e.sid=t.sid.length===32?t.sid:ge()),t.init!==void 0&&(e.init=t.init),!e.did&&t.did&&(e.did=`${t.did}`),typeof t.started=="number"&&(e.started=t.started),e.ignoreDuration)e.duration=void 0;else if(typeof t.duration=="number")e.duration=t.duration;else{const n=e.timestamp-e.started;e.duration=n>=0?n:0}t.release&&(e.release=t.release),t.environment&&(e.environment=t.environment),!e.ipAddress&&t.ipAddress&&(e.ipAddress=t.ipAddress),!e.userAgent&&t.userAgent&&(e.userAgent=t.userAgent),typeof t.errors=="number"&&(e.errors=t.errors),t.status&&(e.status=t.status)}function ya(e,t){let n={};e.status==="ok"&&(n={status:"exited"}),Ut(e,n)}function yo(e){return{sid:`${e.sid}`,init:e.init,started:new Date(e.started*1e3).toISOString(),timestamp:new Date(e.timestamp*1e3).toISOString(),status:e.status,errors:e.errors,did:typeof e.did=="number"||typeof e.did=="string"?`${e.did}`:void 0,duration:e.duration,abnormal_mechanism:e.abnormal_mechanism,attrs:{release:e.release,environment:e.environment,ip_address:e.ipAddress,user_agent:e.userAgent}}}function it(e,t,n=2){if(!t||typeof t!="object"||n<=0)return t;if(e&&Object.keys(t).length===0)return e;const r={...e};for(const o in t)Object.prototype.hasOwnProperty.call(t,o)&&(r[o]=it(r[o],t[o],n-1));return r}function Te(){return ge()}function Pe(){return ge().substring(16)}function Hn(e){try{const t=L.WeakRef;if(typeof t=="function")return new t(e)}catch{}return e}function jn(e){if(e){if(typeof e=="object"&&"deref"in e&&typeof e.deref=="function")try{return e.deref()}catch{return}return e}}const Ct="_sentrySpan";function nn(e,t){t?K(e,Ct,Hn(t)):delete e[Ct]}function Qe(e){return jn(e[Ct])}const So=100;class se{constructor(){this._notifyingListeners=!1,this._scopeListeners=[],this._eventProcessors=[],this._breadcrumbs=[],this._attachments=[],this._user={},this._tags={},this._attributes={},this._extra={},this._contexts={},this._sdkProcessingMetadata={},this._propagationContext={traceId:Te(),sampleRand:pe()}}clone(){const t=new se;return t._breadcrumbs=[...this._breadcrumbs],t._tags={...this._tags},t._attributes={...this._attributes},t._extra={...this._extra},t._contexts={...this._contexts},this._contexts.flags&&(t._contexts.flags={values:[...this._contexts.flags.values]}),t._user=this._user,t._level=this._level,t._session=this._session,t._transactionName=this._transactionName,t._fingerprint=this._fingerprint,t._eventProcessors=[...this._eventProcessors],t._attachments=[...this._attachments],t._sdkProcessingMetadata={...this._sdkProcessingMetadata},t._propagationContext={...this._propagationContext},t._client=this._client,t._lastEventId=this._lastEventId,t._conversationId=this._conversationId,nn(t,Qe(this)),t}setClient(t){this._client=t}setLastEventId(t){this._lastEventId=t}getClient(){return this._client}lastEventId(){return this._lastEventId}addScopeListener(t){this._scopeListeners.push(t)}addEventProcessor(t){return this._eventProcessors.push(t),this}setUser(t){return this._user=t||{email:void 0,id:void 0,ip_address:void 0,username:void 0},this._session&&Ut(this._session,{user:t}),this._notifyScopeListeners(),this}getUser(){return this._user}setConversationId(t){return this._conversationId=t||void 0,this._notifyScopeListeners(),this}setTags(t){return this._tags={...this._tags,...t},this._notifyScopeListeners(),this}setTag(t,n){return this.setTags({[t]:n})}setAttributes(t){return this._attributes={...this._attributes,...t},this._notifyScopeListeners(),this}setAttribute(t,n){return this.setAttributes({[t]:n})}removeAttribute(t){return t in this._attributes&&(delete this._attributes[t],this._notifyScopeListeners()),this}setExtras(t){return this._extra={...this._extra,...t},this._notifyScopeListeners(),this}setExtra(t,n){return this._extra={...this._extra,[t]:n},this._notifyScopeListeners(),this}setFingerprint(t){return this._fingerprint=t,this._notifyScopeListeners(),this}setLevel(t){return this._level=t,this._notifyScopeListeners(),this}setTransactionName(t){return this._transactionName=t,this._notifyScopeListeners(),this}setContext(t,n){return n===null?delete this._contexts[t]:this._contexts[t]=n,this._notifyScopeListeners(),this}setSession(t){return t?this._session=t:delete this._session,this._notifyScopeListeners(),this}getSession(){return this._session}update(t){if(!t)return this;const n=typeof t=="function"?t(this):t,r=n instanceof se?n.getScopeData():Kr(n)?t:void 0,{tags:o,attributes:i,extra:a,user:c,contexts:l,level:u,fingerprint:d=[],propagationContext:s,conversationId:f}=r||{};return this._tags={...this._tags,...o},this._attributes={...this._attributes,...i},this._extra={...this._extra,...a},this._contexts={...this._contexts,...l},c&&Object.keys(c).length&&(this._user=c),u&&(this._level=u),d.length&&(this._fingerprint=d),s&&(this._propagationContext=s),f&&(this._conversationId=f),this}clear(){return this._breadcrumbs=[],this._tags={},this._attributes={},this._extra={},this._user={},this._contexts={},this._level=void 0,this._transactionName=void 0,this._fingerprint=void 0,this._session=void 0,this._conversationId=void 0,nn(this,void 0),this._attachments=[],this.setPropagationContext({traceId:Te(),sampleRand:pe()}),this._notifyScopeListeners(),this}addBreadcrumb(t,n){const r=typeof n=="number"?n:So;if(r<=0)return this;const o={timestamp:Bn(),...t,message:t.message?_o(t.message,2048):t.message};return this._breadcrumbs.push(o),this._breadcrumbs.length>r&&(this._breadcrumbs=this._breadcrumbs.slice(-r),this._client?.recordDroppedEvent("buffer_overflow","log_item")),this._notifyScopeListeners(),this}getLastBreadcrumb(){return this._breadcrumbs[this._breadcrumbs.length-1]}clearBreadcrumbs(){return this._breadcrumbs=[],this._notifyScopeListeners(),this}addAttachment(t){return this._attachments.push(t),this}clearAttachments(){return this._attachments=[],this}getScopeData(){return{breadcrumbs:this._breadcrumbs,attachments:this._attachments,contexts:this._contexts,tags:this._tags,attributes:this._attributes,extra:this._extra,user:this._user,level:this._level,fingerprint:this._fingerprint||[],eventProcessors:this._eventProcessors,propagationContext:this._propagationContext,sdkProcessingMetadata:this._sdkProcessingMetadata,transactionName:this._transactionName,span:Qe(this),conversationId:this._conversationId}}setSDKProcessingMetadata(t){return this._sdkProcessingMetadata=it(this._sdkProcessingMetadata,t,2),this}setPropagationContext(t){return this._propagationContext=t,this}getPropagationContext(){return this._propagationContext}captureException(t,n){const r=n?.event_id||ge();if(!this._client)return O&&k.warn("No client configured on scope - will not capture exception!"),r;const o=new Error("Sentry syntheticException");return this._client.captureException(t,{originalException:t,syntheticException:o,...n,event_id:r},this),r}captureMessage(t,n,r){const o=r?.event_id||ge();if(!this._client)return O&&k.warn("No client configured on scope - will not capture message!"),o;const i=r?.syntheticException??new Error(t);return this._client.captureMessage(t,n,{originalException:t,syntheticException:i,...r,event_id:o},this),o}captureEvent(t,n){const r=t.event_id||n?.event_id||ge();return this._client?(this._client.captureEvent(t,{...n,event_id:r},this),r):(O&&k.warn("No client configured on scope - will not capture event!"),r)}_notifyScopeListeners(){this._notifyingListeners||(this._notifyingListeners=!0,this._scopeListeners.forEach(t=>{t(this)}),this._notifyingListeners=!1)}}function vo(){return Le("defaultCurrentScope",()=>new se)}function Eo(){return Le("defaultIsolationScope",()=>new se)}const rn=e=>e instanceof Promise&&!e[Gn],Gn=Symbol("chained PromiseLike"),To=(e,t,n)=>{const r=e.then(o=>(t(o),o),o=>{throw n(o),o});return rn(r)&&rn(e)?r:Co(e,r)},Co=(e,t)=>{if(!t)return e;let n=!1;for(const r in e){if(r in t)continue;n=!0;const o=e[r];typeof o=="function"?Object.defineProperty(t,r,{value:(...i)=>o.apply(e,i),enumerable:!0,configurable:!0,writable:!0}):t[r]=o}return n&&Object.assign(t,{[Gn]:!0}),t};class Io{constructor(t,n){let r;t?r=t:r=new se;let o;n?o=n:o=new se,this._stack=[{scope:r}],this._isolationScope=o}withScope(t){const n=this._pushScope();let r;try{r=t(n)}catch(o){throw this._popScope(),o}return eo(r)?To(r,()=>this._popScope(),()=>this._popScope()):(this._popScope(),r)}getClient(){return this.getStackTop().client}getScope(){return this.getStackTop().scope}getIsolationScope(){return this._isolationScope}getStackTop(){return this._stack[this._stack.length-1]}_pushScope(){const t=this.getScope().clone();return this._stack.push({client:this.getClient(),scope:t}),t}_popScope(){return this._stack.length<=1?!1:!!this._stack.pop()}}function Ce(){const e=Oe(),t=rt(e);return t.stack=t.stack||new Io(vo(),Eo())}function Ro(e){return Ce().withScope(e)}function xo(e,t){const n=Ce();return n.withScope(()=>(n.getStackTop().scope=e,t(e)))}function on(e){return Ce().withScope(()=>e(Ce().getIsolationScope()))}function ko(){return{withIsolationScope:on,withScope:Ro,withSetScope:xo,withSetIsolationScope:(e,t)=>on(t),getCurrentScope:()=>Ce().getScope(),getIsolationScope:()=>Ce().getIsolationScope()}}function st(e){const t=rt(e);return t.acs?t.acs:ko()}function wo(e){return typeof e=="object"&&e!=null&&!Array.isArray(e)&&Object.keys(e).includes("value")}function Ao(e,t){const{value:n,unit:r}=wo(e)?e:{value:e,unit:void 0},o=No(n),i=r&&typeof r=="string"?{unit:r}:{};if(o)return{...o,...i};if(!t||t==="skip-undefined"&&n===void 0)return;let a="";try{a=JSON.stringify(n)??""}catch{}return{value:a,type:"string",...i}}function et(e,t=!1){const n={};for(const[r,o]of Object.entries(e??{})){const i=Ao(o,t);i&&(n[r]=i)}return n}function No(e){if(Array.isArray(e))return{value:e,type:"array"};const t=typeof e=="string"?"string":typeof e=="boolean"?"boolean":typeof e=="number"&&!Number.isNaN(e)?Number.isInteger(e)?"integer":"double":null;if(t)return{value:e,type:t}}function ke(){const e=Oe();return st(e).getCurrentScope()}function zn(){const e=Oe();return st(e).getIsolationScope()}function Wn(){return Le("globalScope",()=>new se)}function Mo(...e){const t=Oe(),n=st(t);if(e.length===2){const[r,o]=e;return r?n.withSetScope(r,o):n.withScope(o)}return n.withScope(e[0])}function ae(){return ke().getClient()}function Do(e){const t=e.getPropagationContext(),{traceId:n,parentSpanId:r,propagationSpanId:o}=t,i={trace_id:n,span_id:o||Pe()};return r&&(i.parent_span_id=r),i}const Oo="sentry.source",Lo="sentry.sample_rate",Fo="sentry.previous_trace_sample_rate",Po="sentry.op",$o="sentry.origin",Uo="sentry.status.message",Sa="sentry.idle_span_finish_reason",va="sentry.measurement_unit",Ea="sentry.measurement_value",Ta="sentry.custom_span_name",Ca="sentry.profile_id",Ia="sentry.exclusive_time",Ra="url.full",xa="sentry.link.type",ka="gen_ai.conversation.id",Vn=0,Bt=1,j=2;function Bo(e){if(e<400&&e>=100)return{code:Bt};if(e>=400&&e<500)switch(e){case 401:return{code:j,message:"unauthenticated"};case 403:return{code:j,message:"permission_denied"};case 404:return{code:j,message:"not_found"};case 409:return{code:j,message:"already_exists"};case 413:return{code:j,message:"failed_precondition"};case 429:return{code:j,message:"resource_exhausted"};case 499:return{code:j,message:"cancelled"};default:return{code:j,message:"invalid_argument"}}if(e>=500&&e<600)switch(e){case 501:return{code:j,message:"unimplemented"};case 503:return{code:j,message:"unavailable"};case 504:return{code:j,message:"deadline_exceeded"};default:return{code:j,message:"internal_error"}}return{code:j,message:"internal_error"}}function wa(e,t){e.setAttribute("http.response.status_code",t);const n=Bo(t);n.message!=="unknown_error"&&e.setStatus(n)}const qn="_sentryScope",Yn="_sentryIsolationScope",Ho=Symbol.for("sentry.otelSourceInference"),jo=Symbol.for("sentry.otelSourceExplicitlySet"),Go=Symbol.for("sentry.tracerProviderSpan");function Aa(e,t,n){e&&(K(e,Yn,Hn(n)),K(e,qn,t))}function It(e){const t=e;return{scope:t[qn],isolationScope:jn(t[Yn])}}function Na(e){return e[Ho]===!0}function Ma(e){K(e,jo,!0)}function Da(e){return e[Go]===!0}const Rt="sentry-",zo=8192;function Xn(e){const t=Wo(e);if(!t)return;const n=Object.entries(t).reduce((r,[o,i])=>{if(o.startsWith(Rt)){const a=o.slice(Rt.length);r[a]=i}return r},{});if(Object.keys(n).length>0)return n}function Oa(e){if(!e)return;const t=Object.entries(e).reduce((n,[r,o])=>(o&&(n[`${Rt}${r}`]=o),n),{});return Vo(t)}function Wo(e){if(!(!e||!vt(e)&&!Array.isArray(e)))return Array.isArray(e)?e.reduce((t,n)=>{const r=sn(n);return Object.entries(r).forEach(([o,i])=>{t[o]=i}),t},{}):sn(e)}function sn(e){return e.split(",").map(t=>{const n=t.indexOf("=");if(n===-1)return[];const r=t.slice(0,n),o=t.slice(n+1);return[r,o].map(i=>{try{return decodeURIComponent(i.trim())}catch{return}})}).reduce((t,[n,r])=>(n&&r&&(t[n]=r),t),{})}function Vo(e){if(Object.keys(e).length!==0)return Object.entries(e).reduce((t,[n,r],o)=>{const i=`${encodeURIComponent(n)}=${encodeURIComponent(r)}`,a=o===0?i:`${t},${i}`;return a.length>zo?(O&&k.warn(`Not adding key: ${n} with val: ${r} to baggage header due to exceeding baggage size limits.`),t):a},"")}const qo=/^o(\d+)\./,Yo=/^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)((?:\[[:.%\w]+\]|[\w.-]+))(?::(\d+))?\/(.+)/;function Xo(e){return e==="http"||e==="https"}function Kn(e,t=!1){const{host:n,path:r,pass:o,port:i,projectId:a,protocol:c,publicKey:l}=e;return`${c}://${l}${t&&o?`:${o}`:""}@${n}${i?`:${i}`:""}/${r&&`${r}/`}${a}`}function Ko(e){const t=Yo.exec(e);if(!t){Ot(()=>{console.error(`Invalid Sentry Dsn: ${e}`)});return}const[n,r,o="",i="",a="",c=""]=t.slice(1);let l="",u=c;const d=u.split("/");if(d.length>1&&(l=d.slice(0,-1).join("/"),u=d.pop()),u){const s=u.match(/^\d+/);s&&(u=s[0])}return Jn({host:i,pass:o,path:l,projectId:u,port:a,protocol:n,publicKey:r})}function Jn(e){return{protocol:e.protocol,publicKey:e.publicKey||"",pass:e.pass||"",host:e.host,port:e.port||"",path:e.path||"",projectId:e.projectId}}function Jo(e){if(!O)return!0;const{port:t,projectId:n,protocol:r}=e;return["protocol","publicKey","host","projectId"].find(a=>e[a]?!1:(k.error(`Invalid Sentry Dsn: ${a} missing`),!0))?!1:n.match(/^\d+$/)?Xo(r)?t&&isNaN(parseInt(t,10))?(k.error(`Invalid Sentry Dsn: Invalid port ${t}`),!1):!0:(k.error(`Invalid Sentry Dsn: Invalid protocol ${r}`),!1):(k.error(`Invalid Sentry Dsn: Invalid projectId ${n}`),!1)}function Zo(e){return e.match(qo)?.[1]}function Qo(e){const t=e.getOptions(),{host:n}=e.getDsn()||{};let r;return t.orgId?r=String(t.orgId):n&&(r=Zo(n)),r}function La(e){const t=typeof e=="string"?Ko(e):Jn(e);if(!(!t||!Jo(t)))return t}function an(e){if(typeof e=="boolean")return Number(e);const t=typeof e=="string"?parseFloat(e):e;if(!(typeof t!="number"||isNaN(t)||t<0||t>1))return t}const ei=new RegExp("^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$");function ti(e){if(!e)return;const t=e.match(ei);if(!t)return;let n;return t[3]==="1"?n=!0:t[3]==="0"&&(n=!1),{traceId:t[1],parentSampled:n,parentSpanId:t[2]}}function Fa(e,t){const n=ti(e),r=Xn(t);if(!n?.traceId)return{traceId:Te(),sampleRand:pe()};const o=oi(n,r);r&&(r.sample_rand=o.toString());const{traceId:i,parentSpanId:a,parentSampled:c}=n;return{traceId:i,parentSpanId:a,sampled:c,dsc:r||{},sampleRand:o}}function ni(e=Te(),t=Pe(),n){let r="";return n!==void 0&&(r=n?"-1":"-0"),`${e}-${t}${r}`}function ri(e=Te(),t=Pe(),n){return`00-${e}-${t}-${n?"01":"00"}`}function oi(e,t){const n=an(t?.sample_rand);if(n!==void 0)return n;const r=an(t?.sample_rate);return r&&e?.parentSampled!==void 0?e.parentSampled?pe()*r:r+pe()*(1-r):pe()}const ii=0,Ht=1;let cn=!1;function Pa(e){const{spanId:t,traceId:n}=e.spanContext(),{data:r,op:o,parent_span_id:i,status:a,origin:c,links:l}=at(e);return{parent_span_id:i,span_id:t,trace_id:n,data:r,op:o,status:a,origin:c,links:l}}function Zn(e){const{spanId:t,traceId:n,isRemote:r}=e.spanContext(),o=r?t:at(e).parent_span_id,i=It(e).scope,a=r?i?.getPropagationContext().propagationSpanId||Pe():t;return{parent_span_id:o,span_id:a,trace_id:n}}function $a(e){const{traceId:t,spanId:n}=e.spanContext(),r=ct(e);return ni(t,n,r)}function Ua(e){const{traceId:t,spanId:n}=e.spanContext(),r=ct(e);return ri(t,n,r)}function si(e){if(e&&e.length>0)return e.map(({context:{spanId:t,traceId:n,traceFlags:r,...o},attributes:i})=>({span_id:t,trace_id:n,sampled:r===Ht,attributes:i,...o}))}function ai(e){if(e?.length)return e.map(({context:{spanId:t,traceId:n,traceFlags:r},attributes:o})=>({span_id:t,trace_id:n,sampled:r===Ht,attributes:o}))}function tt(e){return typeof e=="number"?un(e):Array.isArray(e)?e[0]+e[1]/1e9:e instanceof Date?un(e.getTime()):ot()}function un(e){return e>9999999999?e/1e3:e}function at(e){if(tr(e))return e.getSpanJSON();const{spanId:t,traceId:n}=e.spanContext();if(er(e)){const{attributes:r,startTime:o,name:i,endTime:a,status:c,links:l}=e;return{span_id:t,trace_id:n,data:r,description:i,parent_span_id:Qn(e),start_timestamp:tt(o),timestamp:tt(a)||void 0,status:ci(c),op:r[Po],origin:r[$o],links:si(l)}}return{span_id:t,trace_id:n,start_timestamp:0,data:{}}}function Ba(e){if(tr(e))return e.getStreamedSpanJSON();const{spanId:t,traceId:n}=e.spanContext();if(er(e)){const{attributes:r,startTime:o,name:i,endTime:a,status:c,links:l}=e;return{name:i,span_id:t,trace_id:n,parent_span_id:Qn(e),start_timestamp:tt(o),end_timestamp:tt(a),is_segment:e===kt(e),status:nr(c),attributes:ui(r,c),links:ai(l)}}return{span_id:t,trace_id:n,start_timestamp:0,name:"",end_timestamp:0,status:"ok",is_segment:e===kt(e)}}function Qn(e){return"parentSpanId"in e?e.parentSpanId:"parentSpanContext"in e?e.parentSpanContext?.spanId:void 0}function Ha(e){return{...e,attributes:et(e.attributes),links:e.links?.map(t=>({...t,attributes:et(t.attributes)}))}}function er(e){const t=e;return!!t.attributes&&!!t.startTime&&!!t.name&&!!t.endTime&&!!t.status}function tr(e){return typeof e.getSpanJSON=="function"}function ct(e){const{traceFlags:t}=e.spanContext();return t===Ht}function ci(e){if(!(!e||e.code===Vn))return e.code===Bt?"ok":e.message||"internal_error"}function nr(e){return!e||e.code===Bt||e.code===Vn||e.message==="cancelled"?"ok":"error"}function ui(e,t){const n=nr(t)==="error"?t?.message:void 0;return{...n&&{[Uo]:n},...e}}const he="_sentryChildSpans",xt="_sentryRootSpan";function ja(e,t){const n=e[xt]||e;K(t,xt,n),e[he]?e[he].add(t):K(e,he,new Set([t]))}function Ga(e,t){e[he]&&e[he].delete(t)}function za(e){const t=new Set;function n(r){if(!t.has(r)&&ct(r)){t.add(r);const o=r[he]?Array.from(r[he]):[];for(const i of o)n(i)}}return n(e),Array.from(t)}const rr=kt;function kt(e){return e[xt]||e}function li(){const e=Oe(),t=st(e);return t.getActiveSpan?t.getActiveSpan():Qe(ke())}function Wa(){cn||(Ot(()=>{console.warn("[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.")}),cn=!0)}function ln(e){if(typeof __SENTRY_TRACING__=="boolean"&&!__SENTRY_TRACING__)return!1;const t=e||ae()?.getOptions();return!!t&&(t.tracesSampleRate!=null||!!t.tracesSampler)}const or=Symbol.for("sentry.nonRecordingSpan");class Va{constructor(t={}){this._traceId=t.traceId||Te(),this._spanId=t.spanId||Pe(),this.dropReason=t.dropReason,K(this,or,!0)}spanContext(){return{spanId:this._spanId,traceId:this._traceId,traceFlags:ii}}end(t){}setAttribute(t,n){return this}setAttributes(t){return this}setStatus(t){return this}updateName(t){return this}isRecording(){return!1}addEvent(t,n,r){return this}addLink(t){return this}addLinks(t){return this}recordException(t,n){}}function di(e){return!!e&&e[or]===!0}const qa="sentry.segment.name",_i="sentry.span.source",Ya="sentry.transaction",Xa="url.full",Ka="url.path",Ja="url.template",fi="production",ir="_frozenDsc";function Za(e,t){K(e,ir,t)}function sr(e,t){const n=t.getOptions(),{publicKey:r}=t.getDsn()||{},o={environment:n.environment||fi,release:n.release,public_key:r,trace_id:e,org_id:Qo(t)};return t.emit("createDsc",o),o}function ar(e,t){const n=t.getPropagationContext();return n.dsc||sr(n.traceId,e)}function cr(e){const t=ae();if(!t)return{};const n=rr(e),r=at(n),o=r.data,i=n.spanContext().traceState,a=i?.get("sentry.sample_rate")??o[Lo]??o[Fo];function c(p){return(typeof a=="number"||typeof a=="string")&&(p.sample_rate=`${a}`),p}const l=n[ir];if(l)return c(l);if(di(n)&&!ln(t.getOptions())){const p=It(n).scope;if(p)return c({...ar(t,p)})}const u=i?.get("sentry.dsc"),d=u&&Xn(u);if(d)return c(d);const s=sr(e.spanContext().traceId,t),f=o[Oo]??o[_i],_=r.description;return f!=="url"&&_&&(s.transaction=_),ln()&&(s.sampled=String(ct(n)),s.sample_rand=i?.get("sentry.sample_rand")??It(n).scope?.getPropagationContext().sampleRand.toString()),c(s),t.emit("createDsc",s,n),s}function pi(e,t=[]){return[e,t]}function Qa(e,t){const[n,r]=e;return[n,[...r,t]]}function gi(e,t){const n=e[1];for(const r of n){const o=r[0].type;if(t(r,o))return!0}return!1}function ec(e,t){return gi(e,(n,r)=>t.includes(r))}function wt(e){const t=rt(L);return t.encodePolyfill?t.encodePolyfill(e):new TextEncoder().encode(e)}function tc(e){const[t,n]=e;let r=JSON.stringify(t);function o(i){typeof r=="string"?r=typeof i=="string"?r+i:[wt(r),i]:r.push(typeof i=="string"?wt(i):i)}for(const i of n){const[a,c]=i;if(o(`
${JSON.stringify(a)}
`),typeof c=="string"||c instanceof Uint8Array)o(c);else{let l;try{l=JSON.stringify(c)}catch{l=JSON.stringify(Fn(c))}o(l)}}return typeof r=="string"?r:hi(r)}function hi(e){const t=e.reduce((o,i)=>o+i.length,0),n=new Uint8Array(t);let r=0;for(const o of e)n.set(o,r),r+=o.length;return n}function nc(e){return[{type:"span"},e]}function rc(e){const t=typeof e.data=="string"?wt(e.data):e.data;return[{type:"attachment",length:t.length,filename:e.filename,content_type:e.contentType,attachment_type:e.attachmentType},t]}const ur={sessions:"session",event:"error",client_report:"internal",user_report:"default",profile_chunk:"profile",replay_event:"replay",replay_recording:"replay",check_in:"monitor",raw_security:"security",log:"log_item",trace_metric:"metric"};function mi(e){return e in ur}function oc(e){return mi(e)?ur[e]:e}function ic(e){if(!e?.sdk)return;const{name:t,version:n}=e.sdk;return{name:t,version:n}}function sc(e,t,n,r){const o=e.sdkProcessingMetadata?.dynamicSamplingContext;return{event_id:e.event_id,sent_at:new Date($t()).toISOString(),...t&&{sdk:t},...!!n&&r&&{dsn:Kn(r)},...o&&{trace:o}}}function ac(e,t){const{fingerprint:n,span:r,breadcrumbs:o,sdkProcessingMetadata:i}=t;yi(e,t),r&&Ei(e,r),Ti(e,n),Si(e,o),vi(e,i)}function dn(e,t){const{extra:n,tags:r,attributes:o,user:i,contexts:a,level:c,sdkProcessingMetadata:l,breadcrumbs:u,fingerprint:d,eventProcessors:s,attachments:f,propagationContext:_,transactionName:p,span:b}=t;Ae(e,"extra",n),Ae(e,"tags",r),Ae(e,"attributes",o),Ae(e,"user",i),Ae(e,"contexts",a),e.sdkProcessingMetadata=it(e.sdkProcessingMetadata,l,2),c&&(e.level=c),p&&(e.transactionName=p),b&&(e.span=b),u.length&&(e.breadcrumbs=[...e.breadcrumbs,...u]),d.length&&(e.fingerprint=[...e.fingerprint,...d]),s.length&&(e.eventProcessors=[...e.eventProcessors,...s]),f.length&&(e.attachments=[...e.attachments,...f]),e.propagationContext={...e.propagationContext,..._}}function Ae(e,t,n){e[t]=it(e[t],n,1)}function bi(e,t){const n=Wn().getScopeData();return e&&dn(n,e.getScopeData()),t&&dn(n,t.getScopeData()),n}function yi(e,t){const{extra:n,tags:r,user:o,contexts:i,level:a,transactionName:c}=t;Object.keys(n).length&&(e.extra={...n,...e.extra}),Object.keys(r).length&&(e.tags={...r,...e.tags}),Object.keys(o).length&&(e.user={...o,...e.user}),Object.keys(i).length&&(e.contexts={...i,...e.contexts}),a&&(e.level=a),c&&e.type!=="transaction"&&(e.transaction=c)}function Si(e,t){const n=[...e.breadcrumbs||[],...t];e.breadcrumbs=n.length?n:void 0}function vi(e,t){e.sdkProcessingMetadata={...e.sdkProcessingMetadata,...t}}function Ei(e,t){e.contexts={trace:Zn(t),...e.contexts},e.sdkProcessingMetadata={dynamicSamplingContext:cr(t),...e.sdkProcessingMetadata};const n=rr(t),r=at(n).description;r&&!e.transaction&&e.type==="transaction"&&(e.transaction=r)}function Ti(e,t){e.fingerprint=e.fingerprint?Array.isArray(e.fingerprint)?e.fingerprint:[e.fingerprint]:[],t&&(e.fingerprint=e.fingerprint.concat(t)),e.fingerprint.length||delete e.fingerprint}const _n=[];function Ci(e){const t={};return e.forEach(n=>{const{name:r}=n,o=t[r];o&&!o.isDefaultInstance&&n.isDefaultInstance||(t[r]=n)}),Object.values(t)}function cc(e){const t=e.defaultIntegrations||[],n=e.integrations;t.forEach(o=>{o.isDefaultInstance=!0});let r;if(Array.isArray(n))r=[...t,...n];else if(typeof n=="function"){const o=n(t);r=Array.isArray(o)?o:[o]}else r=t;return Ci(r)}function uc(e,t){const n={};return t.forEach(r=>{r?.beforeSetup&&r.beforeSetup(e)}),t.forEach(r=>{r&&Ii(e,r,n)}),n}function lc(e,t){for(const n of t)n?.afterAllSetup&&n.afterAllSetup(e)}function Ii(e,t,n){if(n[t.name]){O&&k.log(`Integration skipped because it was already installed: ${t.name}`);return}if(n[t.name]=t,!_n.includes(t.name)&&typeof t.setupOnce=="function"&&(t.setupOnce(),_n.push(t.name)),t.setup&&typeof t.setup=="function"&&t.setup(e),typeof t.preprocessEvent=="function"){const r=t.preprocessEvent.bind(t);e.on("preprocessEvent",(o,i)=>r(o,i,e))}if(typeof t.processEvent=="function"){const r=t.processEvent.bind(t),o=Object.assign((i,a)=>r(i,a,e),{id:t.name});e.addEventProcessor(o)}["processSpan","processSegmentSpan"].forEach(r=>{const o=t[r];typeof o=="function"&&e.on(r,i=>o.call(t,i,e))}),O&&k.log(`Integration installed: ${t.name}`)}function fn(e){const t=ae();if(!t){O&&k.warn(`Cannot add integration "${e.name}" because no SDK Client is available.`);return}t.addIntegration(e)}function dc(e){return e}const Ri="sentry.timestamp.sequence";let pt=0,gt;function xi(e){const t=Math.floor(e*1e3);gt!==void 0&&t!==gt&&(pt=0);const n=pt;return pt++,gt=t,{key:Ri,value:{value:n,type:"integer"}}}function ki(e,t){return t?Mo(t,()=>{const n=li(),r=n?Zn(n):Do(t);return[n?cr(n):ar(e,t),r]}):[void 0,void 0]}function wi(){return typeof __SENTRY_BROWSER_BUNDLE__<"u"&&!!__SENTRY_BROWSER_BUNDLE__}function _c(){return"npm"}function Ai(){return!wi()&&Object.prototype.toString.call(typeof process<"u"?process:0)==="[object process]"}function lr(){return typeof window<"u"&&(!Ai()||Ni())}function Ni(){return L.process?.type==="renderer"}function Mi(e,t){const n=t?"auto":"never";return[{type:"trace_metric",item_count:e.length,content_type:"application/vnd.sentry.items.trace-metric+json"},{version:2,...lr()&&{ingest_settings:{infer_ip:n,infer_user_agent:n}},items:e}]}function Di(e,t,n,r,o){const i={};return t?.sdk&&(i.sdk={name:t.sdk.name,version:t.sdk.version}),n&&r&&(i.dsn=Kn(r)),pi(i,[Mi(e,o)])}const Oi=1e3;function Z(e,t,n,r=!0){n&&(r||!(t in e))&&(e[t]=n)}function Li(e,t){const n=jt(),r=dr(e);r===void 0?n.set(e,[t]):r.length>=Oi?($i(e,r),n.set(e,[t])):n.set(e,[...r,t])}function Fi(e,t,n){const{release:r,environment:o}=t.getOptions(),i={...e.attributes};Z(i,"user.id",n.id,!1),Z(i,"user.email",n.email,!1),Z(i,"user.name",n.username,!1),Z(i,"sentry.release",r),Z(i,"sentry.environment",o);const{name:a,version:c}=t.getSdkMetadata()?.sdk??{};Z(i,"sentry.sdk.name",a),Z(i,"sentry.sdk.version",c);const l=t.getIntegrationByName("Replay"),u=l?.getReplayId(!0);return Z(i,"sentry.replay_id",u),u&&l?.getRecordingMode()==="buffer"&&Z(i,"sentry._internal.replay_is_buffering",!0),{...e,attributes:i}}function Pi(e,t,n,r){const[,o]=ki(t,n),i=Qe(n),a=i?i.spanContext().traceId:o?.trace_id,c=i?i.spanContext().spanId:void 0,l=ot(),u=xi(l);return{timestamp:l,trace_id:a??"",span_id:c,name:e.name,type:e.type,unit:e.unit,value:e.value,attributes:{...et(r),...et(e.attributes,"skip-undefined"),[u.key]:u.value}}}function fc(e,t){const n=ke(),r=t?.captureSerializedMetric??Li,o=n?.getClient()??ae();if(!o){O&&k.warn("No client available to capture metric.");return}const{_experiments:i,enableMetrics:a,beforeSendMetric:c}=o.getOptions();if(!(a??i?.enableMetrics??!0)){O&&k.warn("metrics option not enabled, metric will not be captured.");return}const{user:u,attributes:d}=bi(zn(),n),s=Fi(e,o,u);o.emit("processMetric",s);const f=c||i?.beforeSendMetric,_=f?f(s):s;if(!_){O&&k.log("`beforeSendMetric` returned `null`, will not send metric.");return}const p=Pi(_,o,n,d);O&&k.log("[Metric]",p),r(o,p),o.emit("afterCaptureMetric",_)}function $i(e,t){const n=t??dr(e)??[];if(n.length===0)return;const r=e.getOptions(),o=Di(n,r._metadata,r.tunnel,e.getDsn(),e.getDataCollectionOptions().userInfo);jt().set(e,[]),e.emit("flushMetrics"),e.sendEnvelope(o)}function dr(e){return jt().get(e)}function jt(){return Le("clientToMetricBufferMap",()=>new WeakMap)}function Ui(e,t={},n=ke()){const{message:r,name:o,email:i,url:a,source:c,associatedEventId:l,tags:u}=e,d={contexts:{feedback:{contact_email:i,name:o,message:r,url:a,source:c,associated_event_id:l}},type:"feedback",level:"info",tags:u},s=n?.getClient()||ae();return s&&s.emit("beforeSendFeedback",d,t),n.captureEvent(d,t)}const _r=L;function Bi(){try{return _r.document.location.href}catch{return""}}function pc(e,t=5){if(!_r.HTMLElement)return null;let n=e;for(let r=0;r<t;r++){if(!n)return null;if(n instanceof HTMLElement){if(n.dataset.sentryComponent)return n.dataset.sentryComponent;if(n.dataset.sentryElement)return n.dataset.sentryElement}n=n.parentNode}return null}const Y=L,T=Y.document,Ne=Y.navigator,fr="Report a Bug",Hi="Cancel",ji="Send Bug Report",Gi="Confirm",zi="Report a Bug",Wi="your.email@example.org",Vi="Email",qi="What's the bug? What did you expect?",Yi="Description",Xi="Your Name",Ki="Name",Ji="Thank you for your report!",Zi="(required)",Qi="Add a screenshot",es="Remove screenshot",ts="Highlight",ns="Hide",rs="Remove",pr="Unable to submit feedback with empty message",gr="No client setup, cannot send feedback.",hr="Unable to determine if Feedback was correctly sent.",mr="Unable to send feedback. This could be because this domain is not in your list of allowed domains.",br="Unable to send feedback. This could be because of network issues, or because you are using an ad-blocker.",os="widget",is="api",ss=5e3,as={ERROR_EMPTY_MESSAGE:pr,ERROR_NO_CLIENT:gr,ERROR_TIMEOUT:hr,ERROR_FORBIDDEN:mr,ERROR_GENERIC:br};function qe(e,t){return t?.[e]??as[e]}function pn(e,t){return new Error(qe(e,t))}const cs=(e,t={includeReplay:!0})=>{const n=t.errorMessages;if(!e.message)throw pn("ERROR_EMPTY_MESSAGE",n);const r=ae();if(!r)throw pn("ERROR_NO_CLIENT",n);e.tags&&Object.keys(e.tags).length&&ke().setTags(e.tags);const o=Ui({source:is,url:Bi(),...e},t);return new Promise((i,a)=>{const c=setTimeout(()=>{l(),a(qe("ERROR_TIMEOUT",n))},3e4),l=r.on("afterSendEvent",(u,d)=>{if(u.event_id===o)return clearTimeout(c),l(),d?.statusCode&&d.statusCode>=200&&d.statusCode<300?i(o):d?.statusCode===403?a(qe("ERROR_FORBIDDEN",n)):a(qe("ERROR_GENERIC",n))})})},Ye=typeof __SENTRY_DEBUG__>"u"||__SENTRY_DEBUG__;function us(){return!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(Ne.userAgent)||/Macintosh/i.test(Ne.userAgent)&&Ne.maxTouchPoints&&Ne.maxTouchPoints>1||!isSecureContext)}function ze(e,t){return{...e,...t,tags:{...e.tags,...t.tags},onFormOpen:()=>{t.onFormOpen?.(),e.onFormOpen?.()},onFormClose:()=>{t.onFormClose?.(),e.onFormClose?.()},onSubmitSuccess:(n,r)=>{t.onSubmitSuccess?.(n,r),e.onSubmitSuccess?.(n,r)},onSubmitError:n=>{t.onSubmitError?.(n),e.onSubmitError?.(n)},onFormSubmitted:()=>{t.onFormSubmitted?.(),e.onFormSubmitted?.()},themeDark:{...e.themeDark,...t.themeDark},themeLight:{...e.themeLight,...t.themeLight}}}function ls(e){const t=T.createElement("style");return t.textContent=`
.widget__actor {
  position: fixed;
  z-index: var(--z-index);
  margin: var(--page-margin);
  inset: var(--actor-inset);

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;

  font-family: inherit;
  font-size: var(--font-size);
  font-weight: 600;
  line-height: 1.14em;
  text-decoration: none;

  background: var(--actor-background, var(--background));
  border-radius: var(--actor-border-radius, 1.7em/50%);
  border: var(--actor-border, var(--border));
  box-shadow: var(--actor-box-shadow, var(--box-shadow));
  color: var(--actor-color, var(--foreground));
  fill: var(--actor-color, var(--foreground));
  cursor: pointer;
  opacity: 1;
  transition: transform 0.2s ease-in-out;
  transform: translate(0, 0) scale(1);
}
.widget__actor[aria-hidden="true"] {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translate(0, 16px) scale(0.98);
}

.widget__actor:hover {
  background: var(--actor-hover-background, var(--background));
  filter: var(--interactive-filter);
}

.widget__actor svg {
  width: 1.14em;
  height: 1.14em;
}

@media (max-width: 600px) {
  .widget__actor span {
    display: none;
  }
}
`,e&&t.setAttribute("nonce",e),t}function G(e,t){return Object.entries(t).forEach(([n,r])=>{e.setAttributeNS(null,n,r)}),e}const ve=20,ds="http://www.w3.org/2000/svg";function _s(){const e=c=>Y.document.createElementNS(ds,c),t=G(e("svg"),{width:`${ve}`,height:`${ve}`,viewBox:`0 0 ${ve} ${ve}`,fill:"var(--actor-color, var(--foreground))"}),n=G(e("g"),{clipPath:"url(#clip0_57_80)"}),r=G(e("path"),{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M15.6622 15H12.3997C12.2129 14.9959 12.031 14.9396 11.8747 14.8375L8.04965 12.2H7.49956V19.1C7.4875 19.3348 7.3888 19.5568 7.22256 19.723C7.05632 19.8892 6.83435 19.9879 6.59956 20H2.04956C1.80193 19.9968 1.56535 19.8969 1.39023 19.7218C1.21511 19.5467 1.1153 19.3101 1.11206 19.0625V12.2H0.949652C0.824431 12.2017 0.700142 12.1783 0.584123 12.1311C0.468104 12.084 0.362708 12.014 0.274155 11.9255C0.185602 11.8369 0.115689 11.7315 0.0685419 11.6155C0.0213952 11.4995 -0.00202913 11.3752 -0.00034808 11.25V3.75C-0.00900498 3.62067 0.0092504 3.49095 0.0532651 3.36904C0.0972798 3.24712 0.166097 3.13566 0.255372 3.04168C0.344646 2.94771 0.452437 2.87327 0.571937 2.82307C0.691437 2.77286 0.82005 2.74798 0.949652 2.75H8.04965L11.8747 0.1625C12.031 0.0603649 12.2129 0.00407221 12.3997 0H15.6622C15.9098 0.00323746 16.1464 0.103049 16.3215 0.278167C16.4966 0.453286 16.5964 0.689866 16.5997 0.9375V3.25269C17.3969 3.42959 18.1345 3.83026 18.7211 4.41679C19.5322 5.22788 19.9878 6.32796 19.9878 7.47502C19.9878 8.62209 19.5322 9.72217 18.7211 10.5333C18.1345 11.1198 17.3969 11.5205 16.5997 11.6974V14.0125C16.6047 14.1393 16.5842 14.2659 16.5395 14.3847C16.4948 14.5035 16.4268 14.6121 16.3394 14.7042C16.252 14.7962 16.147 14.8698 16.0307 14.9206C15.9144 14.9714 15.7891 14.9984 15.6622 15ZM1.89695 10.325H1.88715V4.625H8.33715C8.52423 4.62301 8.70666 4.56654 8.86215 4.4625L12.6872 1.875H14.7247V13.125H12.6872L8.86215 10.4875C8.70666 10.3835 8.52423 10.327 8.33715 10.325H2.20217C2.15205 10.3167 2.10102 10.3125 2.04956 10.3125C1.9981 10.3125 1.94708 10.3167 1.89695 10.325ZM2.98706 12.2V18.1625H5.66206V12.2H2.98706ZM16.5997 9.93612V5.01393C16.6536 5.02355 16.7072 5.03495 16.7605 5.04814C17.1202 5.13709 17.4556 5.30487 17.7425 5.53934C18.0293 5.77381 18.2605 6.06912 18.4192 6.40389C18.578 6.73866 18.6603 7.10452 18.6603 7.47502C18.6603 7.84552 18.578 8.21139 18.4192 8.54616C18.2605 8.88093 18.0293 9.17624 17.7425 9.41071C17.4556 9.64518 17.1202 9.81296 16.7605 9.90191C16.7072 9.91509 16.6536 9.9265 16.5997 9.93612Z"});t.appendChild(n).appendChild(r);const o=e("defs"),i=G(e("clipPath"),{id:"clip0_57_80"}),a=G(e("rect"),{width:`${ve}`,height:`${ve}`,fill:"white"});return i.appendChild(a),o.appendChild(i),t.appendChild(o).appendChild(i).appendChild(a),t}function fs({triggerLabel:e,triggerAriaLabel:t,shadow:n,styleNonce:r}){const o=T.createElement("button");if(o.type="button",o.className="widget__actor",o.ariaHidden="false",o.ariaLabel=t||e||fr,o.appendChild(_s()),e){const a=T.createElement("span");a.appendChild(T.createTextNode(e)),o.appendChild(a)}const i=ls(r);return{el:o,appendToDom(){n.appendChild(i),n.appendChild(o)},removeFromDom(){o.remove(),i.remove()},show(){o.ariaHidden="false"},hide(){o.ariaHidden="true"}}}const yr="rgba(88, 74, 192, 1)",ps={foreground:"#2b2233",background:"#ffffff",accentForeground:"white",accentBackground:yr,successColor:"#268d75",errorColor:"#df3338",border:"1.5px solid rgba(41, 35, 47, 0.13)",boxShadow:"0px 4px 24px 0px rgba(43, 34, 51, 0.12)",outline:"1px auto var(--accent-background)",interactiveFilter:"brightness(95%)"},gn={foreground:"#ebe6ef",background:"#29232f",accentForeground:"white",accentBackground:yr,successColor:"#2da98c",errorColor:"#f55459",border:"1.5px solid rgba(235, 230, 239, 0.15)",boxShadow:"0px 4px 24px 0px rgba(43, 34, 51, 0.12)",outline:"1px auto var(--accent-background)",interactiveFilter:"brightness(150%)"};function hn(e){return`
  --foreground: ${e.foreground};
  --background: ${e.background};
  --accent-foreground: ${e.accentForeground};
  --accent-background: ${e.accentBackground};
  --success-color: ${e.successColor};
  --error-color: ${e.errorColor};
  --border: ${e.border};
  --box-shadow: ${e.boxShadow};
  --outline: ${e.outline};
  --interactive-filter: ${e.interactiveFilter};
  `}function mn({colorScheme:e,themeDark:t,themeLight:n,styleNonce:r}){const o=T.createElement("style");return o.textContent=`
:host {
  --font-family: system-ui, 'Helvetica Neue', Arial, sans-serif;
  --font-size: 14px;
  --z-index: 100000;

  --page-margin: 16px;
  --inset: auto 0 0 auto;
  --actor-inset: var(--inset);

  font-family: var(--font-family);
  font-size: var(--font-size);

  ${e!=="system"?`color-scheme: only ${e};`:""}

  ${hn(e==="dark"?{...gn,...t}:{...ps,...n})}
}

${e==="system"?`
@media (prefers-color-scheme: dark) {
  :host {
    color-scheme: only dark;

    ${hn({...gn,...t})}
  }
}`:""}
`,r&&o.setAttribute("nonce",r),o}const gc=({lazyLoadIntegration:e,getModalIntegration:t,getScreenshotIntegration:n})=>(({id:o="sentry-feedback",autoInject:i=!0,showBranding:a=!0,isEmailRequired:c=!1,isNameRequired:l=!1,showEmail:u=!0,showName:d=!0,enableScreenshot:s=!0,useSentryUser:f={email:"email",name:"username"},tags:_,styleNonce:p,scriptNonce:b,colorScheme:S="system",themeLight:g={},themeDark:y={},addScreenshotButtonLabel:M=Qi,cancelButtonLabel:R=Hi,confirmButtonLabel:q=Gi,emailLabel:z=Vi,emailPlaceholder:F=Wi,formTitle:W=zi,isRequiredLabel:w=Zi,messageLabel:$=Yi,messagePlaceholder:ee=qi,nameLabel:m=Ki,namePlaceholder:v=Xi,removeScreenshotButtonLabel:D=es,submitButtonLabel:P=ji,successMessageText:ce=Ji,triggerLabel:be=fr,triggerAriaLabel:U="",highlightToolText:B=ts,hideToolText:N=ns,removeHighlightText:V=rs,errorEmptyMessageText:Be=pr,errorNoClientText:te=gr,errorTimeoutText:ne=hr,errorForbiddenText:He=mr,errorGenericText:Ar=br,onFormOpen:Nr,onFormClose:Mr,onSubmitSuccess:Dr,onSubmitError:Or,onFormSubmitted:Lr}={})=>{const ue={id:o,autoInject:i,showBranding:a,isEmailRequired:c,isNameRequired:l,showEmail:u,showName:d,enableScreenshot:s,useSentryUser:f,tags:_,styleNonce:p,scriptNonce:b,colorScheme:S,themeDark:y,themeLight:g,triggerLabel:be,triggerAriaLabel:U,cancelButtonLabel:R,submitButtonLabel:P,confirmButtonLabel:q,formTitle:W,emailLabel:z,emailPlaceholder:F,messageLabel:$,messagePlaceholder:ee,nameLabel:m,namePlaceholder:v,successMessageText:ce,isRequiredLabel:w,addScreenshotButtonLabel:M,removeScreenshotButtonLabel:D,highlightToolText:B,hideToolText:N,removeHighlightText:V,errorEmptyMessageText:Be,errorNoClientText:te,errorTimeoutText:ne,errorForbiddenText:He,errorGenericText:Ar,onFormClose:Mr,onFormOpen:Nr,onSubmitError:Or,onSubmitSuccess:Dr,onFormSubmitted:Lr};let X=null,ye=null,we=[];const Yt=E=>{if(!X){const A=T.createElement("div");A.id=String(E.id),T.body.appendChild(A),X=A.attachShadow({mode:"open"}),ye=mn(E),X.appendChild(ye)}return X},Xt=async E=>{const A=E.enableScreenshot&&us();let re,H;try{re=(t?t():await e("feedbackModalIntegration",b))(),fn(re)}catch{throw Ye&&k.error("[Feedback] Error when trying to load feedback integrations. Try using `feedbackSyncIntegration` in your `Sentry.init`."),new Error("[Feedback] Missing feedback modal integration!")}try{const de=A?n?n():await e("feedbackScreenshotIntegration",b):void 0;de&&(H=de(),fn(H))}catch{Ye&&k.error("[Feedback] Missing feedback screenshot integration. Proceeding without screenshots.")}const J={ERROR_EMPTY_MESSAGE:E.errorEmptyMessageText,ERROR_NO_CLIENT:E.errorNoClientText,ERROR_TIMEOUT:E.errorTimeoutText,ERROR_FORBIDDEN:E.errorForbiddenText,ERROR_GENERIC:E.errorGenericText},je=(de,Fr)=>cs(de,{includeReplay:!0,...Fr,errorMessages:J}),le=re.createDialog({options:{...E,onFormClose:()=>{le?.close(),E.onFormClose?.()},onFormSubmitted:()=>{le?.close(),E.onFormSubmitted?.()}},screenshotIntegration:H,sendFeedback:je,shadow:Yt(E)});return le},Kt=(E,A={})=>{const re=ze(ue,A),H=typeof E=="string"?T.querySelector(E):typeof E.addEventListener=="function"?E:null;if(!H)throw Ye&&k.error("[Feedback] Unable to attach to target element"),new Error("Unable to attach to target element");let J=null;const je=async()=>{J||(J=await Xt({...re,onFormSubmitted:()=>{J?.removeFromDom(),re.onFormSubmitted?.()}})),J.appendToDom(),J.open()};H.addEventListener("click",je);const le=()=>{we=we.filter(de=>de!==le),J?.removeFromDom(),J=null,H.removeEventListener("click",je)};return we.push(le),le},lt=(E={})=>{const A=ze(ue,E),re=Yt(A),H=fs({triggerLabel:A.triggerLabel,triggerAriaLabel:A.triggerAriaLabel,shadow:re,styleNonce:p});return Kt(H.el,{...A,onFormOpen(){H.hide()},onFormClose(){H.show()},onFormSubmitted(){H.show()}}),H};return{name:"Feedback",setupOnce(){!lr()||!ue.autoInject||(T.readyState==="loading"?T.addEventListener("DOMContentLoaded",()=>lt().appendToDom()):lt().appendToDom())},attachTo:Kt,createWidget(E={}){const A=lt(ze(ue,E));return A.appendToDom(),A},async createForm(E={}){return Xt(ze(ue,E))},setTheme(E){if(ue.colorScheme=E,X){const A=mn(ue);ye?X.replaceChild(A,ye):X.prepend(A),ye=A}},remove(){X&&(X.parentElement?.remove(),X=null,ye=null),we.forEach(E=>E()),we=[]}}});function hc(){return ae()?.getIntegrationByName("Feedback")}var ut,I,Sr,_e,bn,vr,At,De={},Gt=[],gs=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,zt=Array.isArray;function ie(e,t){for(var n in t)e[n]=t[n];return e}function Er(e){var t=e.parentNode;t&&t.removeChild(e)}function h(e,t,n){var r,o,i,a={};for(i in t)i=="key"?r=t[i]:i=="ref"?o=t[i]:a[i]=t[i];if(arguments.length>2&&(a.children=arguments.length>3?ut.call(arguments,2):n),typeof e=="function"&&e.defaultProps!=null)for(i in e.defaultProps)a[i]===void 0&&(a[i]=e.defaultProps[i]);return Xe(e,a,r,o,null)}function Xe(e,t,n,r,o){var i={type:e,props:t,key:n,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o??++Sr,__i:-1,__u:0};return o==null&&I.vnode!=null&&I.vnode(i),i}function $e(e){return e.children}function Ke(e,t){this.props=e,this.context=t}function Ie(e,t){if(t==null)return e.__?Ie(e.__,e.__i+1):null;for(var n;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null)return n.__e;return typeof e.type=="function"?Ie(e):null}function hs(e,t,n){var r,o=e.__v,i=o.__e,a=e.__P;if(a)return(r=ie({},o)).__v=o.__v+1,I.vnode&&I.vnode(r),Wt(a,r,o,e.__n,a.ownerSVGElement!==void 0,32&o.__u?[i]:null,t,i??Ie(o),!!(32&o.__u),n),r.__.__k[r.__i]=r,r.__d=void 0,r.__e!=i&&Tr(r),r}function Tr(e){var t,n;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null){e.__e=e.__c.base=n.__e;break}return Tr(e)}}function yn(e){(!e.__d&&(e.__d=!0)&&_e.push(e)&&!nt.__r++||bn!==I.debounceRendering)&&((bn=I.debounceRendering)||vr)(nt)}function nt(){var e,t,n,r=[],o=[];for(_e.sort(At);e=_e.shift();)e.__d&&(n=_e.length,t=hs(e,r,o)||t,n===0||_e.length>n?(Nt(r,t,o),o.length=r.length=0,t=void 0,_e.sort(At)):t&&I.__c&&I.__c(t,Gt));t&&Nt(r,t,o),nt.__r=0}function Cr(e,t,n,r,o,i,a,c,l,u,d){var s,f,_,p,b,S=r&&r.__k||Gt,g=t.length;for(n.__d=l,ms(n,t,S),l=n.__d,s=0;s<g;s++)(_=n.__k[s])!=null&&typeof _!="boolean"&&typeof _!="function"&&(f=_.__i===-1?De:S[_.__i]||De,_.__i=s,Wt(e,_,f,o,i,a,c,l,u,d),p=_.__e,_.ref&&f.ref!=_.ref&&(f.ref&&Vt(f.ref,null,_),d.push(_.ref,_.__c||p,_)),b==null&&p!=null&&(b=p),65536&_.__u||f.__k===_.__k?l=Ir(_,l,e):typeof _.type=="function"&&_.__d!==void 0?l=_.__d:p&&(l=p.nextSibling),_.__d=void 0,_.__u&=-196609);n.__d=l,n.__e=b}function ms(e,t,n){var r,o,i,a,c,l=t.length,u=n.length,d=u,s=0;for(e.__k=[],r=0;r<l;r++)(o=e.__k[r]=(o=t[r])==null||typeof o=="boolean"||typeof o=="function"?null:typeof o=="string"||typeof o=="number"||typeof o=="bigint"||o.constructor==String?Xe(null,o,null,null,o):zt(o)?Xe($e,{children:o},null,null,null):o.constructor===void 0&&o.__b>0?Xe(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):o)!=null?(o.__=e,o.__b=e.__b+1,c=bs(o,n,a=r+s,d),o.__i=c,i=null,c!==-1&&(d--,(i=n[c])&&(i.__u|=131072)),i==null||i.__v===null?(c==-1&&s--,typeof o.type!="function"&&(o.__u|=65536)):c!==a&&(c===a+1?s++:c>a?d>l-a?s+=c-a:s--:s=c<a&&c==a-1?c-a:0,c!==r+s&&(o.__u|=65536))):(i=n[r])&&i.key==null&&i.__e&&(i.__e==e.__d&&(e.__d=Ie(i)),Mt(i,i,!1),n[r]=null,d--);if(d)for(r=0;r<u;r++)(i=n[r])!=null&&(131072&i.__u)==0&&(i.__e==e.__d&&(e.__d=Ie(i)),Mt(i,i))}function Ir(e,t,n){var r,o;if(typeof e.type=="function"){for(r=e.__k,o=0;r&&o<r.length;o++)r[o]&&(r[o].__=e,t=Ir(r[o],t,n));return t}e.__e!=t&&(n.insertBefore(e.__e,t||null),t=e.__e);do t=t&&t.nextSibling;while(t!=null&&t.nodeType===8);return t}function bs(e,t,n,r){var o=e.key,i=e.type,a=n-1,c=n+1,l=t[n];if(l===null||l&&o==l.key&&i===l.type)return n;if(r>(l!=null&&(131072&l.__u)==0?1:0))for(;a>=0||c<t.length;){if(a>=0){if((l=t[a])&&(131072&l.__u)==0&&o==l.key&&i===l.type)return a;a--}if(c<t.length){if((l=t[c])&&(131072&l.__u)==0&&o==l.key&&i===l.type)return c;c++}}return-1}function Sn(e,t,n){t[0]==="-"?e.setProperty(t,n??""):e[t]=n==null?"":typeof n!="number"||gs.test(t)?n:n+"px"}function We(e,t,n,r,o){var i;e:if(t==="style")if(typeof n=="string")e.style.cssText=n;else{if(typeof r=="string"&&(e.style.cssText=r=""),r)for(t in r)n&&t in n||Sn(e.style,t,"");if(n)for(t in n)r&&n[t]===r[t]||Sn(e.style,t,n[t])}else if(t[0]==="o"&&t[1]==="n")i=t!==(t=t.replace(/(PointerCapture)$|Capture$/i,"$1")),t=t.toLowerCase()in e?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=n,n?r?n.u=r.u:(n.u=Date.now(),e.addEventListener(t,i?En:vn,i)):e.removeEventListener(t,i?En:vn,i);else{if(o)t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!=="width"&&t!=="height"&&t!=="href"&&t!=="list"&&t!=="form"&&t!=="tabIndex"&&t!=="download"&&t!=="rowSpan"&&t!=="colSpan"&&t!=="role"&&t in e)try{e[t]=n??"";break e}catch{}typeof n=="function"||(n==null||n===!1&&t[4]!=="-"?e.removeAttribute(t):e.setAttribute(t,n))}}function vn(e){if(this.l){var t=this.l[e.type+!1];if(e.t){if(e.t<=t.u)return}else e.t=Date.now();return t(I.event?I.event(e):e)}}function En(e){if(this.l)return this.l[e.type+!0](I.event?I.event(e):e)}function Wt(e,t,n,r,o,i,a,c,l,u){var d,s,f,_,p,b,S,g,y,M,R,q,z,F,W,w=t.type;if(t.constructor!==void 0)return null;128&n.__u&&(l=!!(32&n.__u),i=[c=t.__e=n.__e]),(d=I.__b)&&d(t);e:if(typeof w=="function")try{if(g=t.props,y=(d=w.contextType)&&r[d.__c],M=d?y?y.props.value:d.__:r,n.__c?S=(s=t.__c=n.__c).__=s.__E:("prototype"in w&&w.prototype.render?t.__c=s=new w(g,M):(t.__c=s=new Ke(g,M),s.constructor=w,s.render=Ss),y&&y.sub(s),s.props=g,s.state||(s.state={}),s.context=M,s.__n=r,f=s.__d=!0,s.__h=[],s._sb=[]),s.__s==null&&(s.__s=s.state),w.getDerivedStateFromProps!=null&&(s.__s==s.state&&(s.__s=ie({},s.__s)),ie(s.__s,w.getDerivedStateFromProps(g,s.__s))),_=s.props,p=s.state,s.__v=t,f)w.getDerivedStateFromProps==null&&s.componentWillMount!=null&&s.componentWillMount(),s.componentDidMount!=null&&s.__h.push(s.componentDidMount);else{if(w.getDerivedStateFromProps==null&&g!==_&&s.componentWillReceiveProps!=null&&s.componentWillReceiveProps(g,M),!s.__e&&(s.shouldComponentUpdate!=null&&s.shouldComponentUpdate(g,s.__s,M)===!1||t.__v===n.__v)){for(t.__v!==n.__v&&(s.props=g,s.state=s.__s,s.__d=!1),t.__e=n.__e,t.__k=n.__k,t.__k.forEach(function($){$&&($.__=t)}),R=0;R<s._sb.length;R++)s.__h.push(s._sb[R]);s._sb=[],s.__h.length&&a.push(s);break e}s.componentWillUpdate!=null&&s.componentWillUpdate(g,s.__s,M),s.componentDidUpdate!=null&&s.__h.push(function(){s.componentDidUpdate(_,p,b)})}if(s.context=M,s.props=g,s.__P=e,s.__e=!1,q=I.__r,z=0,"prototype"in w&&w.prototype.render){for(s.state=s.__s,s.__d=!1,q&&q(t),d=s.render(s.props,s.state,s.context),F=0;F<s._sb.length;F++)s.__h.push(s._sb[F]);s._sb=[]}else do s.__d=!1,q&&q(t),d=s.render(s.props,s.state,s.context),s.state=s.__s;while(s.__d&&++z<25);s.state=s.__s,s.getChildContext!=null&&(r=ie(ie({},r),s.getChildContext())),f||s.getSnapshotBeforeUpdate==null||(b=s.getSnapshotBeforeUpdate(_,p)),Cr(e,zt(W=d!=null&&d.type===$e&&d.key==null?d.props.children:d)?W:[W],t,n,r,o,i,a,c,l,u),s.base=t.__e,t.__u&=-161,s.__h.length&&a.push(s),S&&(s.__E=s.__=null)}catch($){t.__v=null,l||i!=null?(t.__e=c,t.__u|=l?160:32,i[i.indexOf(c)]=null):(t.__e=n.__e,t.__k=n.__k),I.__e($,t,n)}else i==null&&t.__v===n.__v?(t.__k=n.__k,t.__e=n.__e):t.__e=ys(n.__e,t,n,r,o,i,a,l,u);(d=I.diffed)&&d(t)}function Nt(e,t,n){for(var r=0;r<n.length;r++)Vt(n[r],n[++r],n[++r]);I.__c&&I.__c(t,e),e.some(function(o){try{e=o.__h,o.__h=[],e.some(function(i){i.call(o)})}catch(i){I.__e(i,o.__v)}})}function ys(e,t,n,r,o,i,a,c,l){var u,d,s,f,_,p,b,S=n.props,g=t.props,y=t.type;if(y==="svg"&&(o=!0),i!=null){for(u=0;u<i.length;u++)if((_=i[u])&&"setAttribute"in _==!!y&&(y?_.localName===y:_.nodeType===3)){e=_,i[u]=null;break}}if(e==null){if(y===null)return document.createTextNode(g);e=o?document.createElementNS("http://www.w3.org/2000/svg",y):document.createElement(y,g.is&&g),i=null,c=!1}if(y===null)S===g||c&&e.data===g||(e.data=g);else{if(i=i&&ut.call(e.childNodes),S=n.props||De,!c&&i!=null)for(S={},u=0;u<e.attributes.length;u++)S[(_=e.attributes[u]).name]=_.value;for(u in S)_=S[u],u=="children"||(u=="dangerouslySetInnerHTML"?s=_:u==="key"||u in g||We(e,u,null,_,o));for(u in g)_=g[u],u=="children"?f=_:u=="dangerouslySetInnerHTML"?d=_:u=="value"?p=_:u=="checked"?b=_:u==="key"||c&&typeof _!="function"||S[u]===_||We(e,u,_,S[u],o);if(d)c||s&&(d.__html===s.__html||d.__html===e.innerHTML)||(e.innerHTML=d.__html),t.__k=[];else if(s&&(e.innerHTML=""),Cr(e,zt(f)?f:[f],t,n,r,o&&y!=="foreignObject",i,a,i?i[0]:n.__k&&Ie(n,0),c,l),i!=null)for(u=i.length;u--;)i[u]!=null&&Er(i[u]);c||(u="value",p!==void 0&&(p!==e[u]||y==="progress"&&!p||y==="option"&&p!==S[u])&&We(e,u,p,S[u],!1),u="checked",b!==void 0&&b!==e[u]&&We(e,u,b,S[u],!1))}return e}function Vt(e,t,n){try{typeof e=="function"?e(t):e.current=t}catch(r){I.__e(r,n)}}function Mt(e,t,n){var r,o;if(I.unmount&&I.unmount(e),(r=e.ref)&&(r.current&&r.current!==e.__e||Vt(r,null,t)),(r=e.__c)!=null){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(i){I.__e(i,t)}r.base=r.__P=null,e.__c=void 0}if(r=e.__k)for(o=0;o<r.length;o++)r[o]&&Mt(r[o],t,n||typeof e.type!="function");n||e.__e==null||Er(e.__e),e.__=e.__e=e.__d=void 0}function Ss(e,t,n){return this.constructor(e,n)}function vs(e,t,n){var r,o,i,a;I.__&&I.__(e,t),o=(r=!1)?null:t.__k,i=[],a=[],Wt(t,e=t.__k=h($e,null,[e]),o||De,De,t.ownerSVGElement!==void 0,o?null:t.firstChild?ut.call(t.childNodes):null,i,o?o.__e:t.firstChild,r,a),e.__d=void 0,Nt(i,e,a)}ut=Gt.slice,I={__e:function(e,t,n,r){for(var o,i,a;t=t.__;)if((o=t.__c)&&!o.__)try{if((i=o.constructor)&&i.getDerivedStateFromError!=null&&(o.setState(i.getDerivedStateFromError(e)),a=o.__d),o.componentDidCatch!=null&&(o.componentDidCatch(e,r||{}),a=o.__d),a)return o.__E=o}catch(c){e=c}throw e}},Sr=0,Ke.prototype.setState=function(e,t){var n;n=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=ie({},this.state),typeof e=="function"&&(e=e(ie({},n),this.props)),e&&ie(n,e),e!=null&&this.__v&&(t&&this._sb.push(t),yn(this))},Ke.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),yn(this))},Ke.prototype.render=$e,_e=[],vr=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,At=function(e,t){return e.__v.__b-t.__v.__b},nt.__r=0;var Q,C,ht,Tn,Re=0,Rr=[],Je=[],x=I,Cn=x.__b,In=x.__r,Rn=x.diffed,xn=x.__c,kn=x.unmount,wn=x.__;function me(e,t){x.__h&&x.__h(C,e,Re||t),Re=0;var n=C.__H||(C.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({__V:Je}),n.__[e]}function fe(e){return Re=1,xr(wr,e)}function xr(e,t,n){var r=me(Q++,2);if(r.t=e,!r.__c&&(r.__=[n?n(t):wr(void 0,t),function(c){var l=r.__N?r.__N[0]:r.__[0],u=r.t(l,c);l!==u&&(r.__N=[u,r.__[1]],r.__c.setState({}))}],r.__c=C,!C.u)){var o=function(c,l,u){if(!r.__c.__H)return!0;var d=r.__c.__H.__.filter(function(f){return!!f.__c});if(d.every(function(f){return!f.__N}))return!i||i.call(this,c,l,u);var s=!1;return d.forEach(function(f){if(f.__N){var _=f.__[0];f.__=f.__N,f.__N=void 0,_!==f.__[0]&&(s=!0)}}),!(!s&&r.__c.props===c)&&(!i||i.call(this,c,l,u))};C.u=!0;var i=C.shouldComponentUpdate,a=C.componentWillUpdate;C.componentWillUpdate=function(c,l,u){if(this.__e){var d=i;i=void 0,o(c,l,u),i=d}a&&a.call(this,c,l,u)},C.shouldComponentUpdate=o}return r.__N||r.__}function Es(e,t){var n=me(Q++,3);!x.__s&&qt(n.__H,t)&&(n.__=e,n.i=t,C.__H.__h.push(n))}function kr(e,t){var n=me(Q++,4);!x.__s&&qt(n.__H,t)&&(n.__=e,n.i=t,C.__h.push(n))}function Ts(e){return Re=5,Ue(function(){return{current:e}},[])}function Cs(e,t,n){Re=6,kr(function(){return typeof e=="function"?(e(t()),function(){return e(null)}):e?(e.current=t(),function(){return e.current=null}):void 0},n==null?n:n.concat(e))}function Ue(e,t){var n=me(Q++,7);return qt(n.__H,t)?(n.__V=e(),n.i=t,n.__h=e,n.__V):n.__}function Ee(e,t){return Re=8,Ue(function(){return e},t)}function Is(e){var t=C.context[e.__c],n=me(Q++,9);return n.c=e,t?(n.__==null&&(n.__=!0,t.sub(C)),t.props.value):e.__}function Rs(e,t){x.useDebugValue&&x.useDebugValue(t?t(e):e)}function xs(e){var t=me(Q++,10),n=fe();return t.__=e,C.componentDidCatch||(C.componentDidCatch=function(r,o){t.__&&t.__(r,o),n[1](r)}),[n[0],function(){n[1](void 0)}]}function ks(){var e=me(Q++,11);if(!e.__){for(var t=C.__v;t!==null&&!t.__m&&t.__!==null;)t=t.__;var n=t.__m||(t.__m=[0,0]);e.__="P"+n[0]+"-"+n[1]++}return e.__}function ws(){for(var e;e=Rr.shift();)if(e.__P&&e.__H)try{e.__H.__h.forEach(Ze),e.__H.__h.forEach(Dt),e.__H.__h=[]}catch(t){e.__H.__h=[],x.__e(t,e.__v)}}x.__b=function(e){C=null,Cn&&Cn(e)},x.__=function(e,t){t.__k&&t.__k.__m&&(e.__m=t.__k.__m),wn&&wn(e,t)},x.__r=function(e){In&&In(e),Q=0;var t=(C=e.__c).__H;t&&(ht===C?(t.__h=[],C.__h=[],t.__.forEach(function(n){n.__N&&(n.__=n.__N),n.__V=Je,n.__N=n.i=void 0})):(t.__h.forEach(Ze),t.__h.forEach(Dt),t.__h=[],Q=0)),ht=C},x.diffed=function(e){Rn&&Rn(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Rr.push(t)!==1&&Tn===x.requestAnimationFrame||((Tn=x.requestAnimationFrame)||As)(ws)),t.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.__V!==Je&&(n.__=n.__V),n.i=void 0,n.__V=Je})),ht=C=null},x.__c=function(e,t){t.some(function(n){try{n.__h.forEach(Ze),n.__h=n.__h.filter(function(r){return!r.__||Dt(r)})}catch(r){t.some(function(o){o.__h&&(o.__h=[])}),t=[],x.__e(r,n.__v)}}),xn&&xn(e,t)},x.unmount=function(e){kn&&kn(e);var t,n=e.__c;n&&n.__H&&(n.__H.__.forEach(function(r){try{Ze(r)}catch(o){t=o}}),n.__H=void 0,t&&x.__e(t,n.__v))};var An=typeof requestAnimationFrame=="function";function As(e){var t,n=function(){clearTimeout(r),An&&cancelAnimationFrame(t),setTimeout(e)},r=setTimeout(n,100);An&&(t=requestAnimationFrame(n))}function Ze(e){var t=C,n=e.__c;typeof n=="function"&&(e.__c=void 0,n()),C=t}function Dt(e){var t=C;e.__c=e.__(),C=t}function qt(e,t){return!e||e.length!==t.length||t.some(function(n,r){return n!==e[r]})}function wr(e,t){return typeof t=="function"?t(e):t}const Ns=Object.defineProperty({__proto__:null,useCallback:Ee,useContext:Is,useDebugValue:Rs,useEffect:Es,useErrorBoundary:xs,useId:ks,useImperativeHandle:Cs,useLayoutEffect:kr,useMemo:Ue,useReducer:xr,useRef:Ts,useState:fe},Symbol.toStringTag,{value:"Module"}),Ms="http://www.w3.org/2000/svg";function Ds(){const e=r=>T.createElementNS(Ms,r),t=G(e("svg"),{width:"32",height:"30",viewBox:"0 0 72 66",fill:"inherit"}),n=G(e("path"),{transform:"translate(11, 11)",d:"M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z"});return t.appendChild(n),t}function Os({options:e}){const t=Ue(()=>({__html:Ds().outerHTML}),[]);return h("h2",{class:"dialog__header"},h("span",{class:"dialog__title"},e.formTitle),e.showBranding?h("a",{class:"brand-link",target:"_blank",href:"https://sentry.io/welcome/",title:"Powered by Sentry",rel:"noopener noreferrer",dangerouslySetInnerHTML:t}):null)}function Ls(e,t){const n=[];return t.isNameRequired&&!e.name&&n.push(t.nameLabel),t.isEmailRequired&&!e.email&&n.push(t.emailLabel),e.message||n.push(t.messageLabel),n}function mt(e,t){const n=e.get(t);return typeof n=="string"?n.trim():""}function Fs({options:e,defaultEmail:t,defaultName:n,onFormClose:r,onSubmit:o,onSubmitSuccess:i,onSubmitError:a,showEmail:c,showName:l,screenshotInput:u}){const{tags:d,addScreenshotButtonLabel:s,removeScreenshotButtonLabel:f,cancelButtonLabel:_,emailLabel:p,emailPlaceholder:b,isEmailRequired:S,isNameRequired:g,messageLabel:y,messagePlaceholder:M,nameLabel:R,namePlaceholder:q,submitButtonLabel:z,isRequiredLabel:F}=e,[W,w]=fe(!1),[$,ee]=fe(null),[m,v]=fe(!1),D=u?.input,[P,ce]=fe(null),be=Ee(N=>{ce(N),v(!1)},[]),U=Ee(N=>{const V=Ls(N,{emailLabel:p,isEmailRequired:S,isNameRequired:g,messageLabel:y,nameLabel:R});return V.length>0?ee(`Please enter in the following required fields: ${V.join(", ")}`):ee(null),V.length===0},[p,S,g,y,R]),B=Ee(async N=>{w(!0);try{if(N.preventDefault(),!(N.target instanceof HTMLFormElement))return;const V=new FormData(N.target),Be=await(u&&m?u.value():void 0),te={name:mt(V,"name"),email:mt(V,"email"),message:mt(V,"message"),attachments:Be?[Be]:void 0};if(!U(te))return;try{const ne=await o({name:te.name,email:te.email,message:te.message,source:os,tags:d},{attachments:te.attachments});i(te,ne)}catch(ne){Ye&&k.error(ne);const He=ne instanceof Error?ne:new Error(String(ne));ee(He.message),a(He)}}finally{w(!1)}},[u&&m,i,a]);return h("form",{class:"form",onSubmit:B},D&&m?h(D,{onError:be}):null,h("fieldset",{class:"form__right","data-sentry-feedback":!0,disabled:W},h("div",{class:"form__top"},$?h("div",{class:"form__error-container"},$):null,l?h("label",{for:"name",class:"form__label"},h(bt,{label:R,isRequiredLabel:F,isRequired:g}),h("input",{class:"form__input",defaultValue:n,id:"name",name:"name",placeholder:q,required:g,type:"text"})):h("input",{"aria-hidden":!0,value:n,name:"name",type:"hidden"}),c?h("label",{for:"email",class:"form__label"},h(bt,{label:p,isRequiredLabel:F,isRequired:S}),h("input",{class:"form__input",defaultValue:t,id:"email",name:"email",placeholder:b,required:S,type:"email"})):h("input",{"aria-hidden":!0,value:t,name:"email",type:"hidden"}),h("label",{for:"message",class:"form__label"},h(bt,{label:y,isRequiredLabel:F,isRequired:!0}),h("textarea",{autoFocus:!0,class:"form__input form__input--textarea",id:"message",name:"message",placeholder:M,required:!0,rows:5})),D?h("label",{for:"screenshot",class:"form__label"},h("button",{class:"btn btn--default",disabled:W,type:"button",onClick:()=>{ce(null),v(N=>!N)}},m?f:s),P?h("div",{class:"form__error-container"},P.message):null):null),h("div",{class:"btn-group"},h("button",{class:"btn btn--primary",disabled:W,type:"submit"},z),h("button",{class:"btn btn--default",disabled:W,type:"button",onClick:r},_))))}function bt({label:e,isRequired:t,isRequiredLabel:n}){return h("span",{class:"form__label__text"},e,t&&h("span",{class:"form__label__text--required"},n))}const Ve=16,Nn=17,Ps="http://www.w3.org/2000/svg";function $s(){const e=l=>Y.document.createElementNS(Ps,l),t=G(e("svg"),{width:`${Ve}`,height:`${Nn}`,viewBox:`0 0 ${Ve} ${Nn}`,fill:"inherit"}),n=G(e("g"),{clipPath:"url(#clip0_57_156)"}),r=G(e("path"),{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M3.55544 15.1518C4.87103 16.0308 6.41775 16.5 8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 6.91775 15.5308 5.37103 14.6518 4.05544C13.7727 2.73985 12.5233 1.71447 11.0615 1.10897C9.59966 0.503466 7.99113 0.34504 6.43928 0.653721C4.88743 0.962403 3.46197 1.72433 2.34315 2.84315C1.22433 3.96197 0.462403 5.38743 0.153721 6.93928C-0.15496 8.49113 0.00346625 10.0997 0.608967 11.5615C1.21447 13.0233 2.23985 14.2727 3.55544 15.1518ZM4.40546 3.1204C5.46945 2.40946 6.72036 2.03 8 2.03C9.71595 2.03 11.3616 2.71166 12.575 3.92502C13.7883 5.13838 14.47 6.78405 14.47 8.5C14.47 9.77965 14.0905 11.0306 13.3796 12.0945C12.6687 13.1585 11.6582 13.9878 10.476 14.4775C9.29373 14.9672 7.99283 15.0953 6.73777 14.8457C5.48271 14.596 4.32987 13.9798 3.42502 13.075C2.52018 12.1701 1.90397 11.0173 1.65432 9.76224C1.40468 8.50718 1.5328 7.20628 2.0225 6.02404C2.5122 4.8418 3.34148 3.83133 4.40546 3.1204Z"}),o=G(e("path"),{d:"M6.68775 12.4297C6.78586 12.4745 6.89218 12.4984 7 12.5C7.11275 12.4955 7.22315 12.4664 7.32337 12.4145C7.4236 12.3627 7.51121 12.2894 7.58 12.2L12 5.63999C12.0848 5.47724 12.1071 5.28902 12.0625 5.11098C12.0178 4.93294 11.9095 4.77744 11.7579 4.67392C11.6064 4.57041 11.4221 4.52608 11.24 4.54931C11.0579 4.57254 10.8907 4.66173 10.77 4.79999L6.88 10.57L5.13 8.56999C5.06508 8.49566 4.98613 8.43488 4.89768 8.39111C4.80922 8.34735 4.713 8.32148 4.61453 8.31498C4.51605 8.30847 4.41727 8.32147 4.32382 8.35322C4.23038 8.38497 4.14413 8.43484 4.07 8.49999C3.92511 8.63217 3.83692 8.81523 3.82387 9.01092C3.81083 9.2066 3.87393 9.39976 4 9.54999L6.43 12.24C6.50187 12.3204 6.58964 12.385 6.68775 12.4297Z"});t.appendChild(n).append(o,r);const i=e("defs"),a=G(e("clipPath"),{id:"clip0_57_156"}),c=G(e("rect"),{width:`${Ve}`,height:`${Ve}`,fill:"white",transform:"translate(0 0.5)"});return a.appendChild(c),i.appendChild(a),t.appendChild(i).appendChild(a).appendChild(c),t}function Us({open:e,onFormSubmitted:t,...n}){const r=n.options,o=Ue(()=>({__html:$s().outerHTML}),[]),[i,a]=fe(null),c=Ee(()=>{i&&(clearTimeout(i),a(null)),t()},[i]),l=Ee((u,d)=>{n.onSubmitSuccess(u,d),a(setTimeout(()=>{t(),a(null)},ss))},[t]);return h($e,null,i?h("div",{class:"success__position",onClick:c},h("div",{class:"success__content"},r.successMessageText,h("span",{class:"success__icon",dangerouslySetInnerHTML:o}))):h("dialog",{class:"dialog",onClick:r.onFormClose,open:e},h("div",{class:"dialog__position"},h("div",{class:"dialog__content",onClick:u=>{u.stopPropagation()}},h(Os,{options:r}),h(Fs,{...n,onSubmitSuccess:l})))))}const Bs=`
.dialog {
  position: fixed;
  z-index: var(--z-index);
  margin: 0;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 100vh;
  width: 100vw;

  color: var(--dialog-color, var(--foreground));
  fill: var(--dialog-color, var(--foreground));
  line-height: 1.75em;

  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  inset: 0;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.dialog__position {
  position: fixed;
  z-index: var(--z-index);
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  display: flex;
  max-height: calc(100vh - (2 * var(--page-margin)));
}
@media (max-width: 600px) {
  .dialog__position {
    inset: var(--page-margin);
    padding: 0;
  }
}

.dialog__position:has(.editor) {
  inset: var(--page-margin);
  padding: 0;
}

.dialog:not([open]) {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
.dialog:not([open]) .dialog__content {
  transform: translate(0, -16px) scale(0.98);
}

.dialog__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: var(--dialog-padding, 24px);
  max-width: 100%;
  width: 100%;
  max-height: 100%;
  overflow: auto;

  background: var(--dialog-background, var(--background));
  border-radius: var(--dialog-border-radius, 20px);
  border: var(--dialog-border, var(--border));
  box-shadow: var(--dialog-box-shadow, var(--box-shadow));
  transform: translate(0, 0) scale(1);
  transition: transform 0.2s ease-in-out;
}

`,Hs=`
.dialog__header {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  font-weight: var(--dialog-header-weight, 600);
  margin: 0;
}
.dialog__title {
  align-self: center;
  width: var(--form-width, 272px);
}

@media (max-width: 600px) {
  .dialog__title {
    width: auto;
  }
}

.dialog__position:has(.editor) .dialog__title {
  width: auto;
}


.brand-link {
  display: inline-flex;
}
.brand-link:focus-visible {
  outline: var(--outline);
}
`,js=`
.form {
  display: flex;
  overflow: auto;
  flex-direction: row;
  gap: 16px;
  flex: 1 0;
}

.form fieldset {
  border: none;
  margin: 0;
  padding: 0;
}

.form__right {
  flex: 0 0 auto;
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  width: var(--form-width, 100%);
}

.dialog__position:has(.editor) .form__right {
  width: var(--form-width, 272px);
}

.form__top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form__error-container {
  color: var(--error-color);
  fill: var(--error-color);
}

.form__label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0px;
}

.form__label__text {
  display: flex;
  gap: 4px;
  align-items: center;
}

.form__label__text--required {
  font-size: 0.85em;
}

.form__input {
  font-family: inherit;
  line-height: inherit;
  background: transparent;
  box-sizing: border-box;
  border: var(--input-border, var(--border));
  border-radius: var(--input-border-radius, 6px);
  color: var(--input-color, inherit);
  fill: var(--input-color, inherit);
  font-size: var(--input-font-size, inherit);
  font-weight: var(--input-font-weight, 500);
  padding: 6px 12px;
}

.form__input::placeholder {
  opacity: 0.65;
  color: var(--input-placeholder-color, inherit);
  filter: var(--interactive-filter);
}

.form__input:focus-visible {
  outline: var(--input-focus-outline, var(--outline));
}

.form__input--textarea {
  font-family: inherit;
  resize: vertical;
}

.error {
  color: var(--error-color);
  fill: var(--error-color);
}
`,Gs=`
.btn-group {
  display: grid;
  gap: 8px;
}

.btn {
  line-height: inherit;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--button-font-size, inherit);
  font-weight: var(--button-font-weight, 600);
  padding: var(--button-padding, 6px 16px);
}
.btn[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

.btn--primary {
  color: var(--button-primary-color, var(--accent-foreground));
  fill: var(--button-primary-color, var(--accent-foreground));
  background: var(--button-primary-background, var(--accent-background));
  border: var(--button-primary-border, var(--border));
  border-radius: var(--button-primary-border-radius, 6px);
  font-weight: var(--button-primary-font-weight, 500);
}
.btn--primary:hover {
  color: var(--button-primary-hover-color, var(--accent-foreground));
  fill: var(--button-primary-hover-color, var(--accent-foreground));
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
}
.btn--primary:focus-visible {
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
  outline: var(--button-primary-focus-outline, var(--outline));
}

.btn--default {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-background, var(--background));
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  font-weight: var(--button-font-weight, 500);
}
.btn--default:hover {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
}
.btn--default:focus-visible {
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
  outline: var(--button-focus-outline, var(--outline));
}
`,zs=`
.success__position {
  position: fixed;
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  z-index: var(--z-index);
}
.success__content {
  background: var(--success-background, var(--background));
  border: var(--success-border, var(--border));
  border-radius: var(--success-border-radius, 1.7em/50%);
  box-shadow: var(--success-box-shadow, var(--box-shadow));
  font-weight: var(--success-font-weight, 600);
  color: var(--success-color);
  fill: var(--success-color);
  padding: 12px 24px;
  line-height: 1.75em;

  display: grid;
  align-items: center;
  grid-auto-flow: column;
  gap: 6px;
  cursor: default;
}

.success__icon {
  display: flex;
}
`;function Ws(e){const t=T.createElement("style");return t.textContent=`
:host {
  --dialog-inset: var(--inset);
}

${Bs}
${Hs}
${js}
${Gs}
${zs}
`,e&&t.setAttribute("nonce",e),t}function Vs(){const e=ke().getUser(),t=zn().getUser(),n=Wn().getUser();return e&&Object.keys(e).length?e:t&&Object.keys(t).length?t:n}const mc=(()=>({name:"FeedbackModal",setupOnce(){},createDialog:({options:e,screenshotIntegration:t,sendFeedback:n,shadow:r})=>{const o=r,i=e.useSentryUser,a=Vs(),c=T.createElement("div"),l=Ws(e.styleNonce);let u="";const d={get el(){return c},appendToDom(){!o.contains(l)&&!o.contains(c)&&(o.appendChild(l),o.appendChild(c))},removeFromDom(){c.remove(),l.remove(),T.body.style.overflow=u},open(){f(!0),e.onFormOpen?.(),ae()?.emit("openFeedbackWidget"),u=T.body.style.overflow,T.body.style.overflow="hidden"},close(){f(!1),T.body.style.overflow=u}},s=t?.createInput({h,hooks:Ns,dialog:d,options:e}),f=_=>{vs(h(Us,{options:e,screenshotInput:s,showName:e.showName||e.isNameRequired,showEmail:e.showEmail||e.isEmailRequired,defaultName:String(i&&a?.[i.name]||""),defaultEmail:String(i&&a?.[i.email]||""),onFormClose:()=>{f(!1),e.onFormClose?.()},onSubmit:n,onSubmitSuccess:(p,b)=>{f(!1),e.onSubmitSuccess?.(p,b)},onSubmitError:p=>{e.onSubmitError?.(p)},onFormSubmitted:()=>{e.onFormSubmitted?.()},open:_}),c)};return d}}));function qs({h:e}){return function(){return e("svg",{"data-test-id":"icon-close",viewBox:"0 0 16 16",fill:"#2B2233",height:"25px",width:"25px"},e("circle",{r:"7",cx:"8",cy:"8",fill:"white"}),e("path",{strokeWidth:"1.5",d:"M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM8,1.53A6.47,6.47,0,1,0,14.47,8,6.47,6.47,0,0,0,8,1.53Z"}),e("path",{strokeWidth:"1.5",d:"M5.34,11.41a.71.71,0,0,1-.53-.22.74.74,0,0,1,0-1.06l5.32-5.32a.75.75,0,0,1,1.06,1.06L5.87,11.19A.74.74,0,0,1,5.34,11.41Z"}),e("path",{strokeWidth:"1.5",d:"M10.66,11.41a.74.74,0,0,1-.53-.22L4.81,5.87A.75.75,0,0,1,5.87,4.81l5.32,5.32a.74.74,0,0,1,0,1.06A.71.71,0,0,1,10.66,11.41Z"}))}}function Ys(e){const t=T.createElement("style"),n="#1A141F",r="#302735";return t.textContent=`
.editor {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.editor__image-container {
  justify-items: center;
  padding: 15px;
  position: relative;
  height: 100%;
  border-radius: var(--menu-border-radius, 6px);

  background-color: ${n};
  background-image: repeating-linear-gradient(
      -145deg,
      transparent,
      transparent 8px,
      ${n} 8px,
      ${n} 11px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 15px,
      ${r} 15px,
      ${r} 16px
    );
}

.editor__canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor__canvas-container > * {
  object-fit: contain;
  position: absolute;
}

.editor__tool-container {
  padding-top: 8px;
  display: flex;
  justify-content: center;
}

.editor__tool-bar {
  display: flex;
  gap: 8px;
}

.editor__tool {
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  background: var(--button-background, var(--background));
  color: var(--button-color, var(--foreground));
}

.editor__tool--active {
  background: var(--button-primary-background, var(--accent-background));
  color: var(--button-primary-color, var(--accent-foreground));
}

.editor__rect {
  position: absolute;
  z-index: 2;
}

.editor__rect button {
  opacity: 0;
  position: absolute;
  top: -12px;
  right: -12px;
  cursor: pointer;
  padding: 0;
  z-index: 3;
  border: none;
  background: none;
}

.editor__rect:hover button {
  opacity: 1;
}
`,e&&t.setAttribute("nonce",e),t}function Xs({h:e}){return function({action:n,setAction:r,options:o}){return e("div",{class:"editor__tool-container"},e("div",{class:"editor__tool-bar"},e("button",{type:"button",class:`editor__tool ${n==="highlight"?"editor__tool--active":""}`,onClick:()=>{r(n==="highlight"?"":"highlight")}},o.highlightToolText),e("button",{type:"button",class:`editor__tool ${n==="hide"?"editor__tool--active":""}`,onClick:()=>{r(n==="hide"?"":"hide")}},o.hideToolText)))}}function Ks({hooks:e}){function t(){const[n,r]=e.useState(Y.devicePixelRatio??1);return e.useEffect(()=>{const o=()=>{r(Y.devicePixelRatio)},i=matchMedia(`(resolution: ${Y.devicePixelRatio}dppx)`);return i.addEventListener("change",o),()=>{i.removeEventListener("change",o)}},[]),n}return function({onBeforeScreenshot:r,onScreenshot:o,onAfterScreenshot:i,onError:a}){const c=t();e.useEffect(()=>{(async()=>{r();const u=await Ne.mediaDevices.getDisplayMedia({video:{width:Y.innerWidth*c,height:Y.innerHeight*c},audio:!1,monitorTypeSurfaces:"exclude",preferCurrentTab:!0,selfBrowserSurface:"include",surfaceSwitching:"exclude"}),d=T.createElement("video");await new Promise((s,f)=>{d.srcObject=u,d.onloadedmetadata=()=>{o(d,c),u.getTracks().forEach(_=>_.stop()),s()},d.play().catch(f)}),i()})().catch(a)},[])}}function Js(e,t,n){switch(e.type){case"highlight":{t.shadowColor="rgba(0, 0, 0, 0.7)",t.shadowBlur=50,t.fillStyle=n,t.fillRect(e.x-1,e.y-1,e.w+2,e.h+2),t.clearRect(e.x,e.y,e.w,e.h);break}case"hide":t.fillStyle="rgb(0, 0, 0)",t.fillRect(e.x,e.y,e.w,e.h);break}}function oe(e,t,n){if(!e)return;const r=e.getContext("2d",t);r&&n(e,r)}function yt(e,t){oe(e,{alpha:!0},(n,r)=>{r.drawImage(t,0,0,t.width,t.height,0,0,n.width,n.height)})}function St(e,t,n){oe(e,{alpha:!0},(r,o)=>{n.length&&(o.fillStyle="rgba(0, 0, 0, 0.25)",o.fillRect(0,0,r.width,r.height)),n.forEach(i=>{Js(i,o,t)})})}function Zs({h:e,hooks:t,outputBuffer:n,dialog:r,options:o}){const i=Ks({hooks:t}),a=Xs({h:e}),c=qs({h:e}),l={__html:Ys(o.styleNonce).innerText},u=r.el.style,d=({screenshot:s})=>{const[f,_]=t.useState("highlight"),[p,b]=t.useState([]),S=t.useRef(null),g=t.useRef(null),y=t.useRef(null),M=t.useRef(null),[R,q]=t.useState(1),z=t.useMemo(()=>{const m=T.getElementById(o.id);if(!m)return"white";const v=getComputedStyle(m);return v.getPropertyValue("--button-primary-background")||v.getPropertyValue("--accent-background")},[o.id]);t.useLayoutEffect(()=>{const m=()=>{const v=S.current;v&&(oe(s.canvas,{alpha:!1},D=>{const P=Math.min(v.clientWidth/D.width,v.clientHeight/D.height);q(P)}),(v.clientHeight===0||v.clientWidth===0)&&setTimeout(m,0))};return m(),Y.addEventListener("resize",m),()=>{Y.removeEventListener("resize",m)}},[s]);const F=t.useCallback((m,v)=>{oe(m,{alpha:!0},(D,P)=>{P.scale(v,v),D.width=s.canvas.width,D.height=s.canvas.height})},[s]);t.useEffect(()=>{F(g.current,s.dpi),yt(g.current,s.canvas)},[s]),t.useEffect(()=>{F(y.current,s.dpi),oe(y.current,{alpha:!0},(m,v)=>{v.clearRect(0,0,m.width,m.height)}),St(y.current,z,p)},[p,z]),t.useEffect(()=>{F(n,s.dpi),yt(n,s.canvas),oe(T.createElement("canvas"),{alpha:!0},(m,v)=>{v.scale(s.dpi,s.dpi),m.width=s.canvas.width,m.height=s.canvas.height,St(m,z,p),yt(n,m)})},[p,s,z]);const W=m=>{if(!f||!M.current)return;const v=M.current.getBoundingClientRect(),D={type:f,x:m.offsetX/R,y:m.offsetY/R},P=(U,B)=>{const N=(B.clientX-v.x)/R,V=(B.clientY-v.y)/R;return{type:U.type,x:Math.min(U.x,N),y:Math.min(U.y,V),w:Math.abs(N-U.x),h:Math.abs(V-U.y)}},ce=U=>{oe(y.current,{alpha:!0},(B,N)=>{N.clearRect(0,0,B.width,B.height)}),St(y.current,z,[...p,P(D,U)])},be=U=>{const B=P(D,U);B.w*R>=1&&B.h*R>=1&&b(N=>[...N,B]),T.removeEventListener("mousemove",ce),T.removeEventListener("mouseup",be)};T.addEventListener("mousemove",ce),T.addEventListener("mouseup",be)},w=t.useCallback(m=>v=>{v.preventDefault(),v.stopPropagation(),b(D=>{const P=[...D];return P.splice(m,1),P})},[]),$={width:`${s.canvas.width*R}px`,height:`${s.canvas.height*R}px`},ee=m=>{m.stopPropagation()};return e("div",{class:"editor"},e("style",{nonce:o.styleNonce,dangerouslySetInnerHTML:l}),e("div",{class:"editor__image-container"},e("div",{class:"editor__canvas-container",ref:S},e("canvas",{ref:g,id:"background",style:$}),e("canvas",{ref:y,id:"foreground",style:$}),e("div",{ref:M,onMouseDown:W,style:$},p.map((m,v)=>e("div",{key:v,class:"editor__rect",style:{top:`${m.y*R}px`,left:`${m.x*R}px`,width:`${m.w*R}px`,height:`${m.h*R}px`}},e("button",{"aria-label":o.removeHighlightText,onClick:w(v),onMouseDown:ee,onMouseUp:ee,type:"button"},e(c,null))))))),e(a,{options:o,action:f,setAction:_}))};return function({onError:f}){const[_,p]=t.useState();return i({onBeforeScreenshot:t.useCallback(()=>{u.display="none"},[]),onScreenshot:t.useCallback((b,S)=>{oe(T.createElement("canvas"),{alpha:!1},(g,y)=>{y.scale(S,S),g.width=b.videoWidth,g.height=b.videoHeight,y.drawImage(b,0,0,g.width,g.height),p({canvas:g,dpi:S})}),n.width=b.videoWidth,n.height=b.videoHeight},[]),onAfterScreenshot:t.useCallback(()=>{u.display="block"},[]),onError:t.useCallback(b=>{u.display="block",f(b)},[])}),_?e(d,{screenshot:_}):e("div",null)}}const bc=(()=>({name:"FeedbackScreenshot",setupOnce(){},createInput:({h:e,hooks:t,dialog:n,options:r})=>{const o=T.createElement("canvas");return{input:Zs({h:e,hooks:t,outputBuffer:o,dialog:n,options:r}),value:async()=>{const i=await new Promise(a=>{o.toBlob(a,"image/png")});if(i)return{data:new Uint8Array(await i.arrayBuffer()),filename:"screenshot.png",contentType:"application/png"}}}}}));export{Qe as $,Oo as A,Na as B,Ma as C,O as D,tt as E,Da as F,L as G,si as H,Ia as I,Ca as J,ci as K,ai as L,ui as M,nr as N,ae as O,It as P,ke as Q,za as R,j as S,Ht as T,Ta as U,Pa as V,ln as W,an as X,st as Y,Mo as Z,fc as _,Vr as a,aa as a$,Va as a0,Aa as a1,zn as a2,ja as a3,Za as a4,di as a5,Lo as a6,nn as a7,Sa as a8,Bt as a9,Qa as aA,rc as aB,uc as aC,Do as aD,ar as aE,pe as aF,Yr as aG,Xr as aH,Jr as aI,it as aJ,Kr as aK,$i as aL,Ot as aM,Me as aN,$a as aO,Oa as aP,ei as aQ,Ua as aR,ni as aS,ri as aT,dc as aU,ca as aV,fa as aW,_a as aX,Pt as aY,qr as aZ,Qs as a_,Ga as aa,eo as ab,na as ac,Bn as ad,ge as ae,ga as af,bi as ag,ac as ah,fi as ai,_o as aj,se as ak,Fn as al,ba as am,Ut as an,ya as ao,lr as ap,Le as aq,Ha as ar,gi as as,tc as at,ec as au,oc as av,La as aw,ha as ax,Ii as ay,lc as az,li as b,Jt as b0,ta as b1,ka as b2,wa as b3,sa as b4,Rt as b5,K as b6,Bi as b7,to as b8,pa as b9,Xa as bA,Ka as bB,Wn as bC,Ja as bD,gc as ba,bc as bb,mc as bc,ra as bd,oa as be,ia as bf,Zr as bg,so as bh,ua as bi,_c as bj,vt as bk,ma as bl,Ra as bm,pc as bn,Ba as bo,qa as bp,Ya as bq,zr as br,Gr as bs,da as bt,cc as bu,ea as bv,la as bw,Fo as bx,xa as by,Fa as bz,rr as c,k as d,cr as e,Kn as f,hc as g,at as h,fo as i,pi as j,Wa as k,nc as l,ic as m,sc as n,ct as o,va as p,Ea as q,rt as r,$t as s,Oe as t,Te as u,Pe as v,ot as w,Po as x,$o as y,ii as z};
