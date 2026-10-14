var xv=Object.defineProperty;var vv=(t,e,n)=>e in t?xv(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Ja=(t,e,n)=>vv(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function _v(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var mm={exports:{}},Pl={},gm={exports:{}},He={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var za=Symbol.for("react.element"),yv=Symbol.for("react.portal"),Sv=Symbol.for("react.fragment"),Mv=Symbol.for("react.strict_mode"),Ev=Symbol.for("react.profiler"),wv=Symbol.for("react.provider"),Tv=Symbol.for("react.context"),bv=Symbol.for("react.forward_ref"),Av=Symbol.for("react.suspense"),Cv=Symbol.for("react.memo"),Rv=Symbol.for("react.lazy"),sh=Symbol.iterator;function Nv(t){return t===null||typeof t!="object"?null:(t=sh&&t[sh]||t["@@iterator"],typeof t=="function"?t:null)}var xm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},vm=Object.assign,_m={};function ks(t,e,n){this.props=t,this.context=e,this.refs=_m,this.updater=n||xm}ks.prototype.isReactComponent={};ks.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};ks.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function ym(){}ym.prototype=ks.prototype;function Gd(t,e,n){this.props=t,this.context=e,this.refs=_m,this.updater=n||xm}var Wd=Gd.prototype=new ym;Wd.constructor=Gd;vm(Wd,ks.prototype);Wd.isPureReactComponent=!0;var ah=Array.isArray,Sm=Object.prototype.hasOwnProperty,Xd={current:null},Mm={key:!0,ref:!0,__self:!0,__source:!0};function Em(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)Sm.call(e,i)&&!Mm.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:za,type:t,key:s,ref:a,props:r,_owner:Xd.current}}function Pv(t,e){return{$$typeof:za,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function $d(t){return typeof t=="object"&&t!==null&&t.$$typeof===za}function Lv(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var oh=/\/+/g;function ec(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Lv(""+t.key):e.toString(36)}function jo(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case za:case yv:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+ec(a,0):i,ah(r)?(n="",t!=null&&(n=t.replace(oh,"$&/")+"/"),jo(r,e,n,"",function(c){return c})):r!=null&&($d(r)&&(r=Pv(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(oh,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",ah(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+ec(s,o);a+=jo(s,e,n,l,r)}else if(l=Nv(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+ec(s,o++),a+=jo(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function eo(t,e,n){if(t==null)return t;var i=[],r=0;return jo(t,i,"","",function(s){return e.call(n,s,r++)}),i}function Dv(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Yt={current:null},Vo={transition:null},Iv={ReactCurrentDispatcher:Yt,ReactCurrentBatchConfig:Vo,ReactCurrentOwner:Xd};function wm(){throw Error("act(...) is not supported in production builds of React.")}He.Children={map:eo,forEach:function(t,e,n){eo(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return eo(t,function(){e++}),e},toArray:function(t){return eo(t,function(e){return e})||[]},only:function(t){if(!$d(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};He.Component=ks;He.Fragment=Sv;He.Profiler=Ev;He.PureComponent=Gd;He.StrictMode=Mv;He.Suspense=Av;He.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Iv;He.act=wm;He.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=vm({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=Xd.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)Sm.call(e,l)&&!Mm.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:za,type:t.type,key:r,ref:s,props:i,_owner:a}};He.createContext=function(t){return t={$$typeof:Tv,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:wv,_context:t},t.Consumer=t};He.createElement=Em;He.createFactory=function(t){var e=Em.bind(null,t);return e.type=t,e};He.createRef=function(){return{current:null}};He.forwardRef=function(t){return{$$typeof:bv,render:t}};He.isValidElement=$d;He.lazy=function(t){return{$$typeof:Rv,_payload:{_status:-1,_result:t},_init:Dv}};He.memo=function(t,e){return{$$typeof:Cv,type:t,compare:e===void 0?null:e}};He.startTransition=function(t){var e=Vo.transition;Vo.transition={};try{t()}finally{Vo.transition=e}};He.unstable_act=wm;He.useCallback=function(t,e){return Yt.current.useCallback(t,e)};He.useContext=function(t){return Yt.current.useContext(t)};He.useDebugValue=function(){};He.useDeferredValue=function(t){return Yt.current.useDeferredValue(t)};He.useEffect=function(t,e){return Yt.current.useEffect(t,e)};He.useId=function(){return Yt.current.useId()};He.useImperativeHandle=function(t,e,n){return Yt.current.useImperativeHandle(t,e,n)};He.useInsertionEffect=function(t,e){return Yt.current.useInsertionEffect(t,e)};He.useLayoutEffect=function(t,e){return Yt.current.useLayoutEffect(t,e)};He.useMemo=function(t,e){return Yt.current.useMemo(t,e)};He.useReducer=function(t,e,n){return Yt.current.useReducer(t,e,n)};He.useRef=function(t){return Yt.current.useRef(t)};He.useState=function(t){return Yt.current.useState(t)};He.useSyncExternalStore=function(t,e,n){return Yt.current.useSyncExternalStore(t,e,n)};He.useTransition=function(){return Yt.current.useTransition()};He.version="18.3.1";gm.exports=He;var q=gm.exports;const Uv=_v(q);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var kv=q,Ov=Symbol.for("react.element"),Fv=Symbol.for("react.fragment"),zv=Object.prototype.hasOwnProperty,Bv=kv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,jv={key:!0,ref:!0,__self:!0,__source:!0};function Tm(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)zv.call(e,i)&&!jv.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Ov,type:t,key:s,ref:a,props:r,_owner:Bv.current}}Pl.Fragment=Fv;Pl.jsx=Tm;Pl.jsxs=Tm;mm.exports=Pl;var d=mm.exports,iu={},bm={exports:{}},xn={},Am={exports:{}},Cm={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(L,K){var Q=L.length;L.push(K);e:for(;0<Q;){var ce=Q-1>>>1,z=L[ce];if(0<r(z,K))L[ce]=K,L[Q]=z,Q=ce;else break e}}function n(L){return L.length===0?null:L[0]}function i(L){if(L.length===0)return null;var K=L[0],Q=L.pop();if(Q!==K){L[0]=Q;e:for(var ce=0,z=L.length,re=z>>>1;ce<re;){var H=2*(ce+1)-1,ne=L[H],ue=H+1,ie=L[ue];if(0>r(ne,Q))ue<z&&0>r(ie,ne)?(L[ce]=ie,L[ue]=Q,ce=ue):(L[ce]=ne,L[H]=Q,ce=H);else if(ue<z&&0>r(ie,Q))L[ce]=ie,L[ue]=Q,ce=ue;else break e}}return K}function r(L,K){var Q=L.sortIndex-K.sortIndex;return Q!==0?Q:L.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],c=[],f=1,p=null,h=3,m=!1,x=!1,_=!1,g=typeof setTimeout=="function"?setTimeout:null,u=typeof clearTimeout=="function"?clearTimeout:null,v=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(L){for(var K=n(c);K!==null;){if(K.callback===null)i(c);else if(K.startTime<=L)i(c),K.sortIndex=K.expirationTime,e(l,K);else break;K=n(c)}}function S(L){if(_=!1,y(L),!x)if(n(l)!==null)x=!0,$(N);else{var K=n(c);K!==null&&ee(S,K.startTime-L)}}function N(L,K){x=!1,_&&(_=!1,u(R),R=-1),m=!0;var Q=h;try{for(y(K),p=n(l);p!==null&&(!(p.expirationTime>K)||L&&!P());){var ce=p.callback;if(typeof ce=="function"){p.callback=null,h=p.priorityLevel;var z=ce(p.expirationTime<=K);K=t.unstable_now(),typeof z=="function"?p.callback=z:p===n(l)&&i(l),y(K)}else i(l);p=n(l)}if(p!==null)var re=!0;else{var H=n(c);H!==null&&ee(S,H.startTime-K),re=!1}return re}finally{p=null,h=Q,m=!1}}var A=!1,w=null,R=-1,b=5,M=-1;function P(){return!(t.unstable_now()-M<b)}function G(){if(w!==null){var L=t.unstable_now();M=L;var K=!0;try{K=w(!0,L)}finally{K?O():(A=!1,w=null)}}else A=!1}var O;if(typeof v=="function")O=function(){v(G)};else if(typeof MessageChannel<"u"){var Y=new MessageChannel,X=Y.port2;Y.port1.onmessage=G,O=function(){X.postMessage(null)}}else O=function(){g(G,0)};function $(L){w=L,A||(A=!0,O())}function ee(L,K){R=g(function(){L(t.unstable_now())},K)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(L){L.callback=null},t.unstable_continueExecution=function(){x||m||(x=!0,$(N))},t.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):b=0<L?Math.floor(1e3/L):5},t.unstable_getCurrentPriorityLevel=function(){return h},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(L){switch(h){case 1:case 2:case 3:var K=3;break;default:K=h}var Q=h;h=K;try{return L()}finally{h=Q}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(L,K){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var Q=h;h=L;try{return K()}finally{h=Q}},t.unstable_scheduleCallback=function(L,K,Q){var ce=t.unstable_now();switch(typeof Q=="object"&&Q!==null?(Q=Q.delay,Q=typeof Q=="number"&&0<Q?ce+Q:ce):Q=ce,L){case 1:var z=-1;break;case 2:z=250;break;case 5:z=1073741823;break;case 4:z=1e4;break;default:z=5e3}return z=Q+z,L={id:f++,callback:K,priorityLevel:L,startTime:Q,expirationTime:z,sortIndex:-1},Q>ce?(L.sortIndex=Q,e(c,L),n(l)===null&&L===n(c)&&(_?(u(R),R=-1):_=!0,ee(S,Q-ce))):(L.sortIndex=z,e(l,L),x||m||(x=!0,$(N))),L},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(L){var K=h;return function(){var Q=h;h=K;try{return L.apply(this,arguments)}finally{h=Q}}}})(Cm);Am.exports=Cm;var Vv=Am.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Hv=q,gn=Vv;function ae(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Rm=new Set,Sa={};function kr(t,e){Es(t,e),Es(t+"Capture",e)}function Es(t,e){for(Sa[t]=e,t=0;t<e.length;t++)Rm.add(e[t])}var Mi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ru=Object.prototype.hasOwnProperty,Gv=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,lh={},ch={};function Wv(t){return ru.call(ch,t)?!0:ru.call(lh,t)?!1:Gv.test(t)?ch[t]=!0:(lh[t]=!0,!1)}function Xv(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function $v(t,e,n,i){if(e===null||typeof e>"u"||Xv(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Kt(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var Ot={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Ot[t]=new Kt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Ot[e]=new Kt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Ot[t]=new Kt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Ot[t]=new Kt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Ot[t]=new Kt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Ot[t]=new Kt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Ot[t]=new Kt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Ot[t]=new Kt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Ot[t]=new Kt(t,5,!1,t.toLowerCase(),null,!1,!1)});var qd=/[\-:]([a-z])/g;function Yd(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(qd,Yd);Ot[e]=new Kt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(qd,Yd);Ot[e]=new Kt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(qd,Yd);Ot[e]=new Kt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Ot[t]=new Kt(t,1,!1,t.toLowerCase(),null,!1,!1)});Ot.xlinkHref=new Kt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Ot[t]=new Kt(t,1,!1,t.toLowerCase(),null,!0,!0)});function Kd(t,e,n,i){var r=Ot.hasOwnProperty(e)?Ot[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&($v(e,n,r,i)&&(n=null),i||r===null?Wv(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Ci=Hv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,to=Symbol.for("react.element"),ts=Symbol.for("react.portal"),ns=Symbol.for("react.fragment"),Zd=Symbol.for("react.strict_mode"),su=Symbol.for("react.profiler"),Nm=Symbol.for("react.provider"),Pm=Symbol.for("react.context"),Qd=Symbol.for("react.forward_ref"),au=Symbol.for("react.suspense"),ou=Symbol.for("react.suspense_list"),Jd=Symbol.for("react.memo"),Fi=Symbol.for("react.lazy"),Lm=Symbol.for("react.offscreen"),uh=Symbol.iterator;function Ws(t){return t===null||typeof t!="object"?null:(t=uh&&t[uh]||t["@@iterator"],typeof t=="function"?t:null)}var vt=Object.assign,tc;function ra(t){if(tc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);tc=e&&e[1]||""}return`
`+tc+t}var nc=!1;function ic(t,e){if(!t||nc)return"";nc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{nc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?ra(t):""}function qv(t){switch(t.tag){case 5:return ra(t.type);case 16:return ra("Lazy");case 13:return ra("Suspense");case 19:return ra("SuspenseList");case 0:case 2:case 15:return t=ic(t.type,!1),t;case 11:return t=ic(t.type.render,!1),t;case 1:return t=ic(t.type,!0),t;default:return""}}function lu(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ns:return"Fragment";case ts:return"Portal";case su:return"Profiler";case Zd:return"StrictMode";case au:return"Suspense";case ou:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Pm:return(t.displayName||"Context")+".Consumer";case Nm:return(t._context.displayName||"Context")+".Provider";case Qd:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Jd:return e=t.displayName||null,e!==null?e:lu(t.type)||"Memo";case Fi:e=t._payload,t=t._init;try{return lu(t(e))}catch{}}return null}function Yv(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return lu(e);case 8:return e===Zd?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function tr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Dm(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Kv(t){var e=Dm(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function no(t){t._valueTracker||(t._valueTracker=Kv(t))}function Im(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Dm(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function sl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function cu(t,e){var n=e.checked;return vt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function dh(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=tr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Um(t,e){e=e.checked,e!=null&&Kd(t,"checked",e,!1)}function uu(t,e){Um(t,e);var n=tr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?du(t,e.type,n):e.hasOwnProperty("defaultValue")&&du(t,e.type,tr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function fh(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function du(t,e,n){(e!=="number"||sl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var sa=Array.isArray;function ps(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+tr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function fu(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ae(91));return vt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function hh(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ae(92));if(sa(n)){if(1<n.length)throw Error(ae(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:tr(n)}}function km(t,e){var n=tr(e.value),i=tr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function ph(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Om(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function hu(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Om(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var io,Fm=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(io=io||document.createElement("div"),io.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=io.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Ma(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var da={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Zv=["Webkit","ms","Moz","O"];Object.keys(da).forEach(function(t){Zv.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),da[e]=da[t]})});function zm(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||da.hasOwnProperty(t)&&da[t]?(""+e).trim():e+"px"}function Bm(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=zm(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var Qv=vt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function pu(t,e){if(e){if(Qv[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ae(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ae(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ae(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ae(62))}}function mu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var gu=null;function ef(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var xu=null,ms=null,gs=null;function mh(t){if(t=Va(t)){if(typeof xu!="function")throw Error(ae(280));var e=t.stateNode;e&&(e=kl(e),xu(t.stateNode,t.type,e))}}function jm(t){ms?gs?gs.push(t):gs=[t]:ms=t}function Vm(){if(ms){var t=ms,e=gs;if(gs=ms=null,mh(t),e)for(t=0;t<e.length;t++)mh(e[t])}}function Hm(t,e){return t(e)}function Gm(){}var rc=!1;function Wm(t,e,n){if(rc)return t(e,n);rc=!0;try{return Hm(t,e,n)}finally{rc=!1,(ms!==null||gs!==null)&&(Gm(),Vm())}}function Ea(t,e){var n=t.stateNode;if(n===null)return null;var i=kl(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ae(231,e,typeof n));return n}var vu=!1;if(Mi)try{var Xs={};Object.defineProperty(Xs,"passive",{get:function(){vu=!0}}),window.addEventListener("test",Xs,Xs),window.removeEventListener("test",Xs,Xs)}catch{vu=!1}function Jv(t,e,n,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(f){this.onError(f)}}var fa=!1,al=null,ol=!1,_u=null,e_={onError:function(t){fa=!0,al=t}};function t_(t,e,n,i,r,s,a,o,l){fa=!1,al=null,Jv.apply(e_,arguments)}function n_(t,e,n,i,r,s,a,o,l){if(t_.apply(this,arguments),fa){if(fa){var c=al;fa=!1,al=null}else throw Error(ae(198));ol||(ol=!0,_u=c)}}function Or(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Xm(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function gh(t){if(Or(t)!==t)throw Error(ae(188))}function i_(t){var e=t.alternate;if(!e){if(e=Or(t),e===null)throw Error(ae(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return gh(r),t;if(s===i)return gh(r),e;s=s.sibling}throw Error(ae(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(ae(189))}}if(n.alternate!==i)throw Error(ae(190))}if(n.tag!==3)throw Error(ae(188));return n.stateNode.current===n?t:e}function $m(t){return t=i_(t),t!==null?qm(t):null}function qm(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=qm(t);if(e!==null)return e;t=t.sibling}return null}var Ym=gn.unstable_scheduleCallback,xh=gn.unstable_cancelCallback,r_=gn.unstable_shouldYield,s_=gn.unstable_requestPaint,St=gn.unstable_now,a_=gn.unstable_getCurrentPriorityLevel,tf=gn.unstable_ImmediatePriority,Km=gn.unstable_UserBlockingPriority,ll=gn.unstable_NormalPriority,o_=gn.unstable_LowPriority,Zm=gn.unstable_IdlePriority,Ll=null,ei=null;function l_(t){if(ei&&typeof ei.onCommitFiberRoot=="function")try{ei.onCommitFiberRoot(Ll,t,void 0,(t.current.flags&128)===128)}catch{}}var Vn=Math.clz32?Math.clz32:d_,c_=Math.log,u_=Math.LN2;function d_(t){return t>>>=0,t===0?32:31-(c_(t)/u_|0)|0}var ro=64,so=4194304;function aa(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function cl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=aa(o):(s&=a,s!==0&&(i=aa(s)))}else a=n&~r,a!==0?i=aa(a):s!==0&&(i=aa(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Vn(e),r=1<<n,i|=t[n],e&=~r;return i}function f_(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function h_(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-Vn(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=f_(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function yu(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Qm(){var t=ro;return ro<<=1,!(ro&4194240)&&(ro=64),t}function sc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ba(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Vn(e),t[e]=n}function p_(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Vn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function nf(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Vn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var nt=0;function Jm(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var eg,rf,tg,ng,ig,Su=!1,ao=[],Wi=null,Xi=null,$i=null,wa=new Map,Ta=new Map,Bi=[],m_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function vh(t,e){switch(t){case"focusin":case"focusout":Wi=null;break;case"dragenter":case"dragleave":Xi=null;break;case"mouseover":case"mouseout":$i=null;break;case"pointerover":case"pointerout":wa.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ta.delete(e.pointerId)}}function $s(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Va(e),e!==null&&rf(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function g_(t,e,n,i,r){switch(e){case"focusin":return Wi=$s(Wi,t,e,n,i,r),!0;case"dragenter":return Xi=$s(Xi,t,e,n,i,r),!0;case"mouseover":return $i=$s($i,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return wa.set(s,$s(wa.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Ta.set(s,$s(Ta.get(s)||null,t,e,n,i,r)),!0}return!1}function rg(t){var e=Mr(t.target);if(e!==null){var n=Or(e);if(n!==null){if(e=n.tag,e===13){if(e=Xm(n),e!==null){t.blockedOn=e,ig(t.priority,function(){tg(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ho(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Mu(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);gu=i,n.target.dispatchEvent(i),gu=null}else return e=Va(n),e!==null&&rf(e),t.blockedOn=n,!1;e.shift()}return!0}function _h(t,e,n){Ho(t)&&n.delete(e)}function x_(){Su=!1,Wi!==null&&Ho(Wi)&&(Wi=null),Xi!==null&&Ho(Xi)&&(Xi=null),$i!==null&&Ho($i)&&($i=null),wa.forEach(_h),Ta.forEach(_h)}function qs(t,e){t.blockedOn===e&&(t.blockedOn=null,Su||(Su=!0,gn.unstable_scheduleCallback(gn.unstable_NormalPriority,x_)))}function ba(t){function e(r){return qs(r,t)}if(0<ao.length){qs(ao[0],t);for(var n=1;n<ao.length;n++){var i=ao[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Wi!==null&&qs(Wi,t),Xi!==null&&qs(Xi,t),$i!==null&&qs($i,t),wa.forEach(e),Ta.forEach(e),n=0;n<Bi.length;n++)i=Bi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Bi.length&&(n=Bi[0],n.blockedOn===null);)rg(n),n.blockedOn===null&&Bi.shift()}var xs=Ci.ReactCurrentBatchConfig,ul=!0;function v_(t,e,n,i){var r=nt,s=xs.transition;xs.transition=null;try{nt=1,sf(t,e,n,i)}finally{nt=r,xs.transition=s}}function __(t,e,n,i){var r=nt,s=xs.transition;xs.transition=null;try{nt=4,sf(t,e,n,i)}finally{nt=r,xs.transition=s}}function sf(t,e,n,i){if(ul){var r=Mu(t,e,n,i);if(r===null)mc(t,e,i,dl,n),vh(t,i);else if(g_(r,t,e,n,i))i.stopPropagation();else if(vh(t,i),e&4&&-1<m_.indexOf(t)){for(;r!==null;){var s=Va(r);if(s!==null&&eg(s),s=Mu(t,e,n,i),s===null&&mc(t,e,i,dl,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else mc(t,e,i,null,n)}}var dl=null;function Mu(t,e,n,i){if(dl=null,t=ef(i),t=Mr(t),t!==null)if(e=Or(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Xm(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return dl=t,null}function sg(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(a_()){case tf:return 1;case Km:return 4;case ll:case o_:return 16;case Zm:return 536870912;default:return 16}default:return 16}}var Hi=null,af=null,Go=null;function ag(){if(Go)return Go;var t,e=af,n=e.length,i,r="value"in Hi?Hi.value:Hi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return Go=r.slice(t,1<i?1-i:void 0)}function Wo(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function oo(){return!0}function yh(){return!1}function vn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?oo:yh,this.isPropagationStopped=yh,this}return vt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=oo)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=oo)},persist:function(){},isPersistent:oo}),e}var Os={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},of=vn(Os),ja=vt({},Os,{view:0,detail:0}),y_=vn(ja),ac,oc,Ys,Dl=vt({},ja,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:lf,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ys&&(Ys&&t.type==="mousemove"?(ac=t.screenX-Ys.screenX,oc=t.screenY-Ys.screenY):oc=ac=0,Ys=t),ac)},movementY:function(t){return"movementY"in t?t.movementY:oc}}),Sh=vn(Dl),S_=vt({},Dl,{dataTransfer:0}),M_=vn(S_),E_=vt({},ja,{relatedTarget:0}),lc=vn(E_),w_=vt({},Os,{animationName:0,elapsedTime:0,pseudoElement:0}),T_=vn(w_),b_=vt({},Os,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),A_=vn(b_),C_=vt({},Os,{data:0}),Mh=vn(C_),R_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},N_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},P_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function L_(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=P_[t])?!!e[t]:!1}function lf(){return L_}var D_=vt({},ja,{key:function(t){if(t.key){var e=R_[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Wo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?N_[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:lf,charCode:function(t){return t.type==="keypress"?Wo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Wo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),I_=vn(D_),U_=vt({},Dl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Eh=vn(U_),k_=vt({},ja,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:lf}),O_=vn(k_),F_=vt({},Os,{propertyName:0,elapsedTime:0,pseudoElement:0}),z_=vn(F_),B_=vt({},Dl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),j_=vn(B_),V_=[9,13,27,32],cf=Mi&&"CompositionEvent"in window,ha=null;Mi&&"documentMode"in document&&(ha=document.documentMode);var H_=Mi&&"TextEvent"in window&&!ha,og=Mi&&(!cf||ha&&8<ha&&11>=ha),wh=" ",Th=!1;function lg(t,e){switch(t){case"keyup":return V_.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function cg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var is=!1;function G_(t,e){switch(t){case"compositionend":return cg(e);case"keypress":return e.which!==32?null:(Th=!0,wh);case"textInput":return t=e.data,t===wh&&Th?null:t;default:return null}}function W_(t,e){if(is)return t==="compositionend"||!cf&&lg(t,e)?(t=ag(),Go=af=Hi=null,is=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return og&&e.locale!=="ko"?null:e.data;default:return null}}var X_={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function bh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!X_[t.type]:e==="textarea"}function ug(t,e,n,i){jm(i),e=fl(e,"onChange"),0<e.length&&(n=new of("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var pa=null,Aa=null;function $_(t){Sg(t,0)}function Il(t){var e=as(t);if(Im(e))return t}function q_(t,e){if(t==="change")return e}var dg=!1;if(Mi){var cc;if(Mi){var uc="oninput"in document;if(!uc){var Ah=document.createElement("div");Ah.setAttribute("oninput","return;"),uc=typeof Ah.oninput=="function"}cc=uc}else cc=!1;dg=cc&&(!document.documentMode||9<document.documentMode)}function Ch(){pa&&(pa.detachEvent("onpropertychange",fg),Aa=pa=null)}function fg(t){if(t.propertyName==="value"&&Il(Aa)){var e=[];ug(e,Aa,t,ef(t)),Wm($_,e)}}function Y_(t,e,n){t==="focusin"?(Ch(),pa=e,Aa=n,pa.attachEvent("onpropertychange",fg)):t==="focusout"&&Ch()}function K_(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Il(Aa)}function Z_(t,e){if(t==="click")return Il(e)}function Q_(t,e){if(t==="input"||t==="change")return Il(e)}function J_(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Wn=typeof Object.is=="function"?Object.is:J_;function Ca(t,e){if(Wn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!ru.call(e,r)||!Wn(t[r],e[r]))return!1}return!0}function Rh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Nh(t,e){var n=Rh(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Rh(n)}}function hg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?hg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function pg(){for(var t=window,e=sl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=sl(t.document)}return e}function uf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function ey(t){var e=pg(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&hg(n.ownerDocument.documentElement,n)){if(i!==null&&uf(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=Nh(n,s);var a=Nh(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var ty=Mi&&"documentMode"in document&&11>=document.documentMode,rs=null,Eu=null,ma=null,wu=!1;function Ph(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;wu||rs==null||rs!==sl(i)||(i=rs,"selectionStart"in i&&uf(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ma&&Ca(ma,i)||(ma=i,i=fl(Eu,"onSelect"),0<i.length&&(e=new of("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=rs)))}function lo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var ss={animationend:lo("Animation","AnimationEnd"),animationiteration:lo("Animation","AnimationIteration"),animationstart:lo("Animation","AnimationStart"),transitionend:lo("Transition","TransitionEnd")},dc={},mg={};Mi&&(mg=document.createElement("div").style,"AnimationEvent"in window||(delete ss.animationend.animation,delete ss.animationiteration.animation,delete ss.animationstart.animation),"TransitionEvent"in window||delete ss.transitionend.transition);function Ul(t){if(dc[t])return dc[t];if(!ss[t])return t;var e=ss[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in mg)return dc[t]=e[n];return t}var gg=Ul("animationend"),xg=Ul("animationiteration"),vg=Ul("animationstart"),_g=Ul("transitionend"),yg=new Map,Lh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function sr(t,e){yg.set(t,e),kr(e,[t])}for(var fc=0;fc<Lh.length;fc++){var hc=Lh[fc],ny=hc.toLowerCase(),iy=hc[0].toUpperCase()+hc.slice(1);sr(ny,"on"+iy)}sr(gg,"onAnimationEnd");sr(xg,"onAnimationIteration");sr(vg,"onAnimationStart");sr("dblclick","onDoubleClick");sr("focusin","onFocus");sr("focusout","onBlur");sr(_g,"onTransitionEnd");Es("onMouseEnter",["mouseout","mouseover"]);Es("onMouseLeave",["mouseout","mouseover"]);Es("onPointerEnter",["pointerout","pointerover"]);Es("onPointerLeave",["pointerout","pointerover"]);kr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));kr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));kr("onBeforeInput",["compositionend","keypress","textInput","paste"]);kr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));kr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));kr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var oa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ry=new Set("cancel close invalid load scroll toggle".split(" ").concat(oa));function Dh(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,n_(i,e,void 0,t),t.currentTarget=null}function Sg(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;Dh(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;Dh(r,o,c),s=l}}}if(ol)throw t=_u,ol=!1,_u=null,t}function ht(t,e){var n=e[Ru];n===void 0&&(n=e[Ru]=new Set);var i=t+"__bubble";n.has(i)||(Mg(e,t,2,!1),n.add(i))}function pc(t,e,n){var i=0;e&&(i|=4),Mg(n,t,i,e)}var co="_reactListening"+Math.random().toString(36).slice(2);function Ra(t){if(!t[co]){t[co]=!0,Rm.forEach(function(n){n!=="selectionchange"&&(ry.has(n)||pc(n,!1,t),pc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[co]||(e[co]=!0,pc("selectionchange",!1,e))}}function Mg(t,e,n,i){switch(sg(e)){case 1:var r=v_;break;case 4:r=__;break;default:r=sf}n=r.bind(null,e,n,t),r=void 0,!vu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function mc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Mr(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}Wm(function(){var c=s,f=ef(n),p=[];e:{var h=yg.get(t);if(h!==void 0){var m=of,x=t;switch(t){case"keypress":if(Wo(n)===0)break e;case"keydown":case"keyup":m=I_;break;case"focusin":x="focus",m=lc;break;case"focusout":x="blur",m=lc;break;case"beforeblur":case"afterblur":m=lc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=Sh;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=M_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=O_;break;case gg:case xg:case vg:m=T_;break;case _g:m=z_;break;case"scroll":m=y_;break;case"wheel":m=j_;break;case"copy":case"cut":case"paste":m=A_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=Eh}var _=(e&4)!==0,g=!_&&t==="scroll",u=_?h!==null?h+"Capture":null:h;_=[];for(var v=c,y;v!==null;){y=v;var S=y.stateNode;if(y.tag===5&&S!==null&&(y=S,u!==null&&(S=Ea(v,u),S!=null&&_.push(Na(v,S,y)))),g)break;v=v.return}0<_.length&&(h=new m(h,x,null,n,f),p.push({event:h,listeners:_}))}}if(!(e&7)){e:{if(h=t==="mouseover"||t==="pointerover",m=t==="mouseout"||t==="pointerout",h&&n!==gu&&(x=n.relatedTarget||n.fromElement)&&(Mr(x)||x[Ei]))break e;if((m||h)&&(h=f.window===f?f:(h=f.ownerDocument)?h.defaultView||h.parentWindow:window,m?(x=n.relatedTarget||n.toElement,m=c,x=x?Mr(x):null,x!==null&&(g=Or(x),x!==g||x.tag!==5&&x.tag!==6)&&(x=null)):(m=null,x=c),m!==x)){if(_=Sh,S="onMouseLeave",u="onMouseEnter",v="mouse",(t==="pointerout"||t==="pointerover")&&(_=Eh,S="onPointerLeave",u="onPointerEnter",v="pointer"),g=m==null?h:as(m),y=x==null?h:as(x),h=new _(S,v+"leave",m,n,f),h.target=g,h.relatedTarget=y,S=null,Mr(f)===c&&(_=new _(u,v+"enter",x,n,f),_.target=y,_.relatedTarget=g,S=_),g=S,m&&x)t:{for(_=m,u=x,v=0,y=_;y;y=Br(y))v++;for(y=0,S=u;S;S=Br(S))y++;for(;0<v-y;)_=Br(_),v--;for(;0<y-v;)u=Br(u),y--;for(;v--;){if(_===u||u!==null&&_===u.alternate)break t;_=Br(_),u=Br(u)}_=null}else _=null;m!==null&&Ih(p,h,m,_,!1),x!==null&&g!==null&&Ih(p,g,x,_,!0)}}e:{if(h=c?as(c):window,m=h.nodeName&&h.nodeName.toLowerCase(),m==="select"||m==="input"&&h.type==="file")var N=q_;else if(bh(h))if(dg)N=Q_;else{N=K_;var A=Y_}else(m=h.nodeName)&&m.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(N=Z_);if(N&&(N=N(t,c))){ug(p,N,n,f);break e}A&&A(t,h,c),t==="focusout"&&(A=h._wrapperState)&&A.controlled&&h.type==="number"&&du(h,"number",h.value)}switch(A=c?as(c):window,t){case"focusin":(bh(A)||A.contentEditable==="true")&&(rs=A,Eu=c,ma=null);break;case"focusout":ma=Eu=rs=null;break;case"mousedown":wu=!0;break;case"contextmenu":case"mouseup":case"dragend":wu=!1,Ph(p,n,f);break;case"selectionchange":if(ty)break;case"keydown":case"keyup":Ph(p,n,f)}var w;if(cf)e:{switch(t){case"compositionstart":var R="onCompositionStart";break e;case"compositionend":R="onCompositionEnd";break e;case"compositionupdate":R="onCompositionUpdate";break e}R=void 0}else is?lg(t,n)&&(R="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(R="onCompositionStart");R&&(og&&n.locale!=="ko"&&(is||R!=="onCompositionStart"?R==="onCompositionEnd"&&is&&(w=ag()):(Hi=f,af="value"in Hi?Hi.value:Hi.textContent,is=!0)),A=fl(c,R),0<A.length&&(R=new Mh(R,t,null,n,f),p.push({event:R,listeners:A}),w?R.data=w:(w=cg(n),w!==null&&(R.data=w)))),(w=H_?G_(t,n):W_(t,n))&&(c=fl(c,"onBeforeInput"),0<c.length&&(f=new Mh("onBeforeInput","beforeinput",null,n,f),p.push({event:f,listeners:c}),f.data=w))}Sg(p,e)})}function Na(t,e,n){return{instance:t,listener:e,currentTarget:n}}function fl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Ea(t,n),s!=null&&i.unshift(Na(t,s,r)),s=Ea(t,e),s!=null&&i.push(Na(t,s,r))),t=t.return}return i}function Br(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Ih(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=Ea(n,s),l!=null&&a.unshift(Na(n,l,o))):r||(l=Ea(n,s),l!=null&&a.push(Na(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var sy=/\r\n?/g,ay=/\u0000|\uFFFD/g;function Uh(t){return(typeof t=="string"?t:""+t).replace(sy,`
`).replace(ay,"")}function uo(t,e,n){if(e=Uh(e),Uh(t)!==e&&n)throw Error(ae(425))}function hl(){}var Tu=null,bu=null;function Au(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Cu=typeof setTimeout=="function"?setTimeout:void 0,oy=typeof clearTimeout=="function"?clearTimeout:void 0,kh=typeof Promise=="function"?Promise:void 0,ly=typeof queueMicrotask=="function"?queueMicrotask:typeof kh<"u"?function(t){return kh.resolve(null).then(t).catch(cy)}:Cu;function cy(t){setTimeout(function(){throw t})}function gc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),ba(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);ba(e)}function qi(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Oh(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Fs=Math.random().toString(36).slice(2),Zn="__reactFiber$"+Fs,Pa="__reactProps$"+Fs,Ei="__reactContainer$"+Fs,Ru="__reactEvents$"+Fs,uy="__reactListeners$"+Fs,dy="__reactHandles$"+Fs;function Mr(t){var e=t[Zn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Ei]||n[Zn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Oh(t);t!==null;){if(n=t[Zn])return n;t=Oh(t)}return e}t=n,n=t.parentNode}return null}function Va(t){return t=t[Zn]||t[Ei],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function as(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ae(33))}function kl(t){return t[Pa]||null}var Nu=[],os=-1;function ar(t){return{current:t}}function pt(t){0>os||(t.current=Nu[os],Nu[os]=null,os--)}function ut(t,e){os++,Nu[os]=t.current,t.current=e}var nr={},Wt=ar(nr),nn=ar(!1),Rr=nr;function ws(t,e){var n=t.type.contextTypes;if(!n)return nr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function rn(t){return t=t.childContextTypes,t!=null}function pl(){pt(nn),pt(Wt)}function Fh(t,e,n){if(Wt.current!==nr)throw Error(ae(168));ut(Wt,e),ut(nn,n)}function Eg(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ae(108,Yv(t)||"Unknown",r));return vt({},n,i)}function ml(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||nr,Rr=Wt.current,ut(Wt,t),ut(nn,nn.current),!0}function zh(t,e,n){var i=t.stateNode;if(!i)throw Error(ae(169));n?(t=Eg(t,e,Rr),i.__reactInternalMemoizedMergedChildContext=t,pt(nn),pt(Wt),ut(Wt,t)):pt(nn),ut(nn,n)}var hi=null,Ol=!1,xc=!1;function wg(t){hi===null?hi=[t]:hi.push(t)}function fy(t){Ol=!0,wg(t)}function or(){if(!xc&&hi!==null){xc=!0;var t=0,e=nt;try{var n=hi;for(nt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}hi=null,Ol=!1}catch(r){throw hi!==null&&(hi=hi.slice(t+1)),Ym(tf,or),r}finally{nt=e,xc=!1}}return null}var ls=[],cs=0,gl=null,xl=0,Mn=[],En=0,Nr=null,mi=1,gi="";function gr(t,e){ls[cs++]=xl,ls[cs++]=gl,gl=t,xl=e}function Tg(t,e,n){Mn[En++]=mi,Mn[En++]=gi,Mn[En++]=Nr,Nr=t;var i=mi;t=gi;var r=32-Vn(i)-1;i&=~(1<<r),n+=1;var s=32-Vn(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,mi=1<<32-Vn(e)+r|n<<r|i,gi=s+t}else mi=1<<s|n<<r|i,gi=t}function df(t){t.return!==null&&(gr(t,1),Tg(t,1,0))}function ff(t){for(;t===gl;)gl=ls[--cs],ls[cs]=null,xl=ls[--cs],ls[cs]=null;for(;t===Nr;)Nr=Mn[--En],Mn[En]=null,gi=Mn[--En],Mn[En]=null,mi=Mn[--En],Mn[En]=null}var mn=null,pn=null,mt=!1,zn=null;function bg(t,e){var n=Tn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Bh(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,mn=t,pn=qi(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,mn=t,pn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Nr!==null?{id:mi,overflow:gi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Tn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,mn=t,pn=null,!0):!1;default:return!1}}function Pu(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Lu(t){if(mt){var e=pn;if(e){var n=e;if(!Bh(t,e)){if(Pu(t))throw Error(ae(418));e=qi(n.nextSibling);var i=mn;e&&Bh(t,e)?bg(i,n):(t.flags=t.flags&-4097|2,mt=!1,mn=t)}}else{if(Pu(t))throw Error(ae(418));t.flags=t.flags&-4097|2,mt=!1,mn=t}}}function jh(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;mn=t}function fo(t){if(t!==mn)return!1;if(!mt)return jh(t),mt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Au(t.type,t.memoizedProps)),e&&(e=pn)){if(Pu(t))throw Ag(),Error(ae(418));for(;e;)bg(t,e),e=qi(e.nextSibling)}if(jh(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ae(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){pn=qi(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}pn=null}}else pn=mn?qi(t.stateNode.nextSibling):null;return!0}function Ag(){for(var t=pn;t;)t=qi(t.nextSibling)}function Ts(){pn=mn=null,mt=!1}function hf(t){zn===null?zn=[t]:zn.push(t)}var hy=Ci.ReactCurrentBatchConfig;function Ks(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ae(309));var i=n.stateNode}if(!i)throw Error(ae(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(ae(284));if(!n._owner)throw Error(ae(290,t))}return t}function ho(t,e){throw t=Object.prototype.toString.call(e),Error(ae(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Vh(t){var e=t._init;return e(t._payload)}function Cg(t){function e(u,v){if(t){var y=u.deletions;y===null?(u.deletions=[v],u.flags|=16):y.push(v)}}function n(u,v){if(!t)return null;for(;v!==null;)e(u,v),v=v.sibling;return null}function i(u,v){for(u=new Map;v!==null;)v.key!==null?u.set(v.key,v):u.set(v.index,v),v=v.sibling;return u}function r(u,v){return u=Qi(u,v),u.index=0,u.sibling=null,u}function s(u,v,y){return u.index=y,t?(y=u.alternate,y!==null?(y=y.index,y<v?(u.flags|=2,v):y):(u.flags|=2,v)):(u.flags|=1048576,v)}function a(u){return t&&u.alternate===null&&(u.flags|=2),u}function o(u,v,y,S){return v===null||v.tag!==6?(v=wc(y,u.mode,S),v.return=u,v):(v=r(v,y),v.return=u,v)}function l(u,v,y,S){var N=y.type;return N===ns?f(u,v,y.props.children,S,y.key):v!==null&&(v.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===Fi&&Vh(N)===v.type)?(S=r(v,y.props),S.ref=Ks(u,v,y),S.return=u,S):(S=Qo(y.type,y.key,y.props,null,u.mode,S),S.ref=Ks(u,v,y),S.return=u,S)}function c(u,v,y,S){return v===null||v.tag!==4||v.stateNode.containerInfo!==y.containerInfo||v.stateNode.implementation!==y.implementation?(v=Tc(y,u.mode,S),v.return=u,v):(v=r(v,y.children||[]),v.return=u,v)}function f(u,v,y,S,N){return v===null||v.tag!==7?(v=Cr(y,u.mode,S,N),v.return=u,v):(v=r(v,y),v.return=u,v)}function p(u,v,y){if(typeof v=="string"&&v!==""||typeof v=="number")return v=wc(""+v,u.mode,y),v.return=u,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case to:return y=Qo(v.type,v.key,v.props,null,u.mode,y),y.ref=Ks(u,null,v),y.return=u,y;case ts:return v=Tc(v,u.mode,y),v.return=u,v;case Fi:var S=v._init;return p(u,S(v._payload),y)}if(sa(v)||Ws(v))return v=Cr(v,u.mode,y,null),v.return=u,v;ho(u,v)}return null}function h(u,v,y,S){var N=v!==null?v.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return N!==null?null:o(u,v,""+y,S);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case to:return y.key===N?l(u,v,y,S):null;case ts:return y.key===N?c(u,v,y,S):null;case Fi:return N=y._init,h(u,v,N(y._payload),S)}if(sa(y)||Ws(y))return N!==null?null:f(u,v,y,S,null);ho(u,y)}return null}function m(u,v,y,S,N){if(typeof S=="string"&&S!==""||typeof S=="number")return u=u.get(y)||null,o(v,u,""+S,N);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case to:return u=u.get(S.key===null?y:S.key)||null,l(v,u,S,N);case ts:return u=u.get(S.key===null?y:S.key)||null,c(v,u,S,N);case Fi:var A=S._init;return m(u,v,y,A(S._payload),N)}if(sa(S)||Ws(S))return u=u.get(y)||null,f(v,u,S,N,null);ho(v,S)}return null}function x(u,v,y,S){for(var N=null,A=null,w=v,R=v=0,b=null;w!==null&&R<y.length;R++){w.index>R?(b=w,w=null):b=w.sibling;var M=h(u,w,y[R],S);if(M===null){w===null&&(w=b);break}t&&w&&M.alternate===null&&e(u,w),v=s(M,v,R),A===null?N=M:A.sibling=M,A=M,w=b}if(R===y.length)return n(u,w),mt&&gr(u,R),N;if(w===null){for(;R<y.length;R++)w=p(u,y[R],S),w!==null&&(v=s(w,v,R),A===null?N=w:A.sibling=w,A=w);return mt&&gr(u,R),N}for(w=i(u,w);R<y.length;R++)b=m(w,u,R,y[R],S),b!==null&&(t&&b.alternate!==null&&w.delete(b.key===null?R:b.key),v=s(b,v,R),A===null?N=b:A.sibling=b,A=b);return t&&w.forEach(function(P){return e(u,P)}),mt&&gr(u,R),N}function _(u,v,y,S){var N=Ws(y);if(typeof N!="function")throw Error(ae(150));if(y=N.call(y),y==null)throw Error(ae(151));for(var A=N=null,w=v,R=v=0,b=null,M=y.next();w!==null&&!M.done;R++,M=y.next()){w.index>R?(b=w,w=null):b=w.sibling;var P=h(u,w,M.value,S);if(P===null){w===null&&(w=b);break}t&&w&&P.alternate===null&&e(u,w),v=s(P,v,R),A===null?N=P:A.sibling=P,A=P,w=b}if(M.done)return n(u,w),mt&&gr(u,R),N;if(w===null){for(;!M.done;R++,M=y.next())M=p(u,M.value,S),M!==null&&(v=s(M,v,R),A===null?N=M:A.sibling=M,A=M);return mt&&gr(u,R),N}for(w=i(u,w);!M.done;R++,M=y.next())M=m(w,u,R,M.value,S),M!==null&&(t&&M.alternate!==null&&w.delete(M.key===null?R:M.key),v=s(M,v,R),A===null?N=M:A.sibling=M,A=M);return t&&w.forEach(function(G){return e(u,G)}),mt&&gr(u,R),N}function g(u,v,y,S){if(typeof y=="object"&&y!==null&&y.type===ns&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case to:e:{for(var N=y.key,A=v;A!==null;){if(A.key===N){if(N=y.type,N===ns){if(A.tag===7){n(u,A.sibling),v=r(A,y.props.children),v.return=u,u=v;break e}}else if(A.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===Fi&&Vh(N)===A.type){n(u,A.sibling),v=r(A,y.props),v.ref=Ks(u,A,y),v.return=u,u=v;break e}n(u,A);break}else e(u,A);A=A.sibling}y.type===ns?(v=Cr(y.props.children,u.mode,S,y.key),v.return=u,u=v):(S=Qo(y.type,y.key,y.props,null,u.mode,S),S.ref=Ks(u,v,y),S.return=u,u=S)}return a(u);case ts:e:{for(A=y.key;v!==null;){if(v.key===A)if(v.tag===4&&v.stateNode.containerInfo===y.containerInfo&&v.stateNode.implementation===y.implementation){n(u,v.sibling),v=r(v,y.children||[]),v.return=u,u=v;break e}else{n(u,v);break}else e(u,v);v=v.sibling}v=Tc(y,u.mode,S),v.return=u,u=v}return a(u);case Fi:return A=y._init,g(u,v,A(y._payload),S)}if(sa(y))return x(u,v,y,S);if(Ws(y))return _(u,v,y,S);ho(u,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,v!==null&&v.tag===6?(n(u,v.sibling),v=r(v,y),v.return=u,u=v):(n(u,v),v=wc(y,u.mode,S),v.return=u,u=v),a(u)):n(u,v)}return g}var bs=Cg(!0),Rg=Cg(!1),vl=ar(null),_l=null,us=null,pf=null;function mf(){pf=us=_l=null}function gf(t){var e=vl.current;pt(vl),t._currentValue=e}function Du(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function vs(t,e){_l=t,pf=us=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(tn=!0),t.firstContext=null)}function Rn(t){var e=t._currentValue;if(pf!==t)if(t={context:t,memoizedValue:e,next:null},us===null){if(_l===null)throw Error(ae(308));us=t,_l.dependencies={lanes:0,firstContext:t}}else us=us.next=t;return e}var Er=null;function xf(t){Er===null?Er=[t]:Er.push(t)}function Ng(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,xf(e)):(n.next=r.next,r.next=n),e.interleaved=n,wi(t,i)}function wi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var zi=!1;function vf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Pg(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function yi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Yi(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Ke&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,wi(t,n)}return r=i.interleaved,r===null?(e.next=e,xf(i)):(e.next=r.next,r.next=e),i.interleaved=e,wi(t,n)}function Xo(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,nf(t,n)}}function Hh(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function yl(t,e,n,i){var r=t.updateQueue;zi=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var f=t.alternate;f!==null&&(f=f.updateQueue,o=f.lastBaseUpdate,o!==a&&(o===null?f.firstBaseUpdate=c:o.next=c,f.lastBaseUpdate=l))}if(s!==null){var p=r.baseState;a=0,f=c=l=null,o=s;do{var h=o.lane,m=o.eventTime;if((i&h)===h){f!==null&&(f=f.next={eventTime:m,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var x=t,_=o;switch(h=e,m=n,_.tag){case 1:if(x=_.payload,typeof x=="function"){p=x.call(m,p,h);break e}p=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=_.payload,h=typeof x=="function"?x.call(m,p,h):x,h==null)break e;p=vt({},p,h);break e;case 2:zi=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,h=r.effects,h===null?r.effects=[o]:h.push(o))}else m={eventTime:m,lane:h,tag:o.tag,payload:o.payload,callback:o.callback,next:null},f===null?(c=f=m,l=p):f=f.next=m,a|=h;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;h=o,o=h.next,h.next=null,r.lastBaseUpdate=h,r.shared.pending=null}}while(!0);if(f===null&&(l=p),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=f,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Lr|=a,t.lanes=a,t.memoizedState=p}}function Gh(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ae(191,r));r.call(i)}}}var Ha={},ti=ar(Ha),La=ar(Ha),Da=ar(Ha);function wr(t){if(t===Ha)throw Error(ae(174));return t}function _f(t,e){switch(ut(Da,e),ut(La,t),ut(ti,Ha),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:hu(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=hu(e,t)}pt(ti),ut(ti,e)}function As(){pt(ti),pt(La),pt(Da)}function Lg(t){wr(Da.current);var e=wr(ti.current),n=hu(e,t.type);e!==n&&(ut(La,t),ut(ti,n))}function yf(t){La.current===t&&(pt(ti),pt(La))}var gt=ar(0);function Sl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var vc=[];function Sf(){for(var t=0;t<vc.length;t++)vc[t]._workInProgressVersionPrimary=null;vc.length=0}var $o=Ci.ReactCurrentDispatcher,_c=Ci.ReactCurrentBatchConfig,Pr=0,xt=null,At=null,Dt=null,Ml=!1,ga=!1,Ia=0,py=0;function Bt(){throw Error(ae(321))}function Mf(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Wn(t[n],e[n]))return!1;return!0}function Ef(t,e,n,i,r,s){if(Pr=s,xt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,$o.current=t===null||t.memoizedState===null?vy:_y,t=n(i,r),ga){s=0;do{if(ga=!1,Ia=0,25<=s)throw Error(ae(301));s+=1,Dt=At=null,e.updateQueue=null,$o.current=yy,t=n(i,r)}while(ga)}if($o.current=El,e=At!==null&&At.next!==null,Pr=0,Dt=At=xt=null,Ml=!1,e)throw Error(ae(300));return t}function wf(){var t=Ia!==0;return Ia=0,t}function Yn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Dt===null?xt.memoizedState=Dt=t:Dt=Dt.next=t,Dt}function Nn(){if(At===null){var t=xt.alternate;t=t!==null?t.memoizedState:null}else t=At.next;var e=Dt===null?xt.memoizedState:Dt.next;if(e!==null)Dt=e,At=t;else{if(t===null)throw Error(ae(310));At=t,t={memoizedState:At.memoizedState,baseState:At.baseState,baseQueue:At.baseQueue,queue:At.queue,next:null},Dt===null?xt.memoizedState=Dt=t:Dt=Dt.next=t}return Dt}function Ua(t,e){return typeof e=="function"?e(t):e}function yc(t){var e=Nn(),n=e.queue;if(n===null)throw Error(ae(311));n.lastRenderedReducer=t;var i=At,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var f=c.lane;if((Pr&f)===f)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var p={lane:f,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=p,a=i):l=l.next=p,xt.lanes|=f,Lr|=f}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,Wn(i,e.memoizedState)||(tn=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,xt.lanes|=s,Lr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Sc(t){var e=Nn(),n=e.queue;if(n===null)throw Error(ae(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);Wn(s,e.memoizedState)||(tn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function Dg(){}function Ig(t,e){var n=xt,i=Nn(),r=e(),s=!Wn(i.memoizedState,r);if(s&&(i.memoizedState=r,tn=!0),i=i.queue,Tf(Og.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Dt!==null&&Dt.memoizedState.tag&1){if(n.flags|=2048,ka(9,kg.bind(null,n,i,r,e),void 0,null),It===null)throw Error(ae(349));Pr&30||Ug(n,e,r)}return r}function Ug(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=xt.updateQueue,e===null?(e={lastEffect:null,stores:null},xt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function kg(t,e,n,i){e.value=n,e.getSnapshot=i,Fg(e)&&zg(t)}function Og(t,e,n){return n(function(){Fg(e)&&zg(t)})}function Fg(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Wn(t,n)}catch{return!0}}function zg(t){var e=wi(t,1);e!==null&&Hn(e,t,1,-1)}function Wh(t){var e=Yn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ua,lastRenderedState:t},e.queue=t,t=t.dispatch=xy.bind(null,xt,t),[e.memoizedState,t]}function ka(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=xt.updateQueue,e===null?(e={lastEffect:null,stores:null},xt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function Bg(){return Nn().memoizedState}function qo(t,e,n,i){var r=Yn();xt.flags|=t,r.memoizedState=ka(1|e,n,void 0,i===void 0?null:i)}function Fl(t,e,n,i){var r=Nn();i=i===void 0?null:i;var s=void 0;if(At!==null){var a=At.memoizedState;if(s=a.destroy,i!==null&&Mf(i,a.deps)){r.memoizedState=ka(e,n,s,i);return}}xt.flags|=t,r.memoizedState=ka(1|e,n,s,i)}function Xh(t,e){return qo(8390656,8,t,e)}function Tf(t,e){return Fl(2048,8,t,e)}function jg(t,e){return Fl(4,2,t,e)}function Vg(t,e){return Fl(4,4,t,e)}function Hg(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Gg(t,e,n){return n=n!=null?n.concat([t]):null,Fl(4,4,Hg.bind(null,e,t),n)}function bf(){}function Wg(t,e){var n=Nn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Mf(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function Xg(t,e){var n=Nn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Mf(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function $g(t,e,n){return Pr&21?(Wn(n,e)||(n=Qm(),xt.lanes|=n,Lr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,tn=!0),t.memoizedState=n)}function my(t,e){var n=nt;nt=n!==0&&4>n?n:4,t(!0);var i=_c.transition;_c.transition={};try{t(!1),e()}finally{nt=n,_c.transition=i}}function qg(){return Nn().memoizedState}function gy(t,e,n){var i=Zi(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},Yg(t))Kg(e,n);else if(n=Ng(t,e,n,i),n!==null){var r=qt();Hn(n,t,i,r),Zg(n,e,i)}}function xy(t,e,n){var i=Zi(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(Yg(t))Kg(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,Wn(o,a)){var l=e.interleaved;l===null?(r.next=r,xf(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=Ng(t,e,r,i),n!==null&&(r=qt(),Hn(n,t,i,r),Zg(n,e,i))}}function Yg(t){var e=t.alternate;return t===xt||e!==null&&e===xt}function Kg(t,e){ga=Ml=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Zg(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,nf(t,n)}}var El={readContext:Rn,useCallback:Bt,useContext:Bt,useEffect:Bt,useImperativeHandle:Bt,useInsertionEffect:Bt,useLayoutEffect:Bt,useMemo:Bt,useReducer:Bt,useRef:Bt,useState:Bt,useDebugValue:Bt,useDeferredValue:Bt,useTransition:Bt,useMutableSource:Bt,useSyncExternalStore:Bt,useId:Bt,unstable_isNewReconciler:!1},vy={readContext:Rn,useCallback:function(t,e){return Yn().memoizedState=[t,e===void 0?null:e],t},useContext:Rn,useEffect:Xh,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,qo(4194308,4,Hg.bind(null,e,t),n)},useLayoutEffect:function(t,e){return qo(4194308,4,t,e)},useInsertionEffect:function(t,e){return qo(4,2,t,e)},useMemo:function(t,e){var n=Yn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Yn();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=gy.bind(null,xt,t),[i.memoizedState,t]},useRef:function(t){var e=Yn();return t={current:t},e.memoizedState=t},useState:Wh,useDebugValue:bf,useDeferredValue:function(t){return Yn().memoizedState=t},useTransition:function(){var t=Wh(!1),e=t[0];return t=my.bind(null,t[1]),Yn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=xt,r=Yn();if(mt){if(n===void 0)throw Error(ae(407));n=n()}else{if(n=e(),It===null)throw Error(ae(349));Pr&30||Ug(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,Xh(Og.bind(null,i,s,t),[t]),i.flags|=2048,ka(9,kg.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=Yn(),e=It.identifierPrefix;if(mt){var n=gi,i=mi;n=(i&~(1<<32-Vn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ia++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=py++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},_y={readContext:Rn,useCallback:Wg,useContext:Rn,useEffect:Tf,useImperativeHandle:Gg,useInsertionEffect:jg,useLayoutEffect:Vg,useMemo:Xg,useReducer:yc,useRef:Bg,useState:function(){return yc(Ua)},useDebugValue:bf,useDeferredValue:function(t){var e=Nn();return $g(e,At.memoizedState,t)},useTransition:function(){var t=yc(Ua)[0],e=Nn().memoizedState;return[t,e]},useMutableSource:Dg,useSyncExternalStore:Ig,useId:qg,unstable_isNewReconciler:!1},yy={readContext:Rn,useCallback:Wg,useContext:Rn,useEffect:Tf,useImperativeHandle:Gg,useInsertionEffect:jg,useLayoutEffect:Vg,useMemo:Xg,useReducer:Sc,useRef:Bg,useState:function(){return Sc(Ua)},useDebugValue:bf,useDeferredValue:function(t){var e=Nn();return At===null?e.memoizedState=t:$g(e,At.memoizedState,t)},useTransition:function(){var t=Sc(Ua)[0],e=Nn().memoizedState;return[t,e]},useMutableSource:Dg,useSyncExternalStore:Ig,useId:qg,unstable_isNewReconciler:!1};function On(t,e){if(t&&t.defaultProps){e=vt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Iu(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:vt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var zl={isMounted:function(t){return(t=t._reactInternals)?Or(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=qt(),r=Zi(t),s=yi(i,r);s.payload=e,n!=null&&(s.callback=n),e=Yi(t,s,r),e!==null&&(Hn(e,t,r,i),Xo(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=qt(),r=Zi(t),s=yi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Yi(t,s,r),e!==null&&(Hn(e,t,r,i),Xo(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=qt(),i=Zi(t),r=yi(n,i);r.tag=2,e!=null&&(r.callback=e),e=Yi(t,r,i),e!==null&&(Hn(e,t,i,n),Xo(e,t,i))}};function $h(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!Ca(n,i)||!Ca(r,s):!0}function Qg(t,e,n){var i=!1,r=nr,s=e.contextType;return typeof s=="object"&&s!==null?s=Rn(s):(r=rn(e)?Rr:Wt.current,i=e.contextTypes,s=(i=i!=null)?ws(t,r):nr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=zl,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function qh(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&zl.enqueueReplaceState(e,e.state,null)}function Uu(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},vf(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Rn(s):(s=rn(e)?Rr:Wt.current,r.context=ws(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Iu(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&zl.enqueueReplaceState(r,r.state,null),yl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Cs(t,e){try{var n="",i=e;do n+=qv(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Mc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function ku(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Sy=typeof WeakMap=="function"?WeakMap:Map;function Jg(t,e,n){n=yi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Tl||(Tl=!0,Xu=i),ku(t,e)},n}function ex(t,e,n){n=yi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){ku(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){ku(t,e),typeof i!="function"&&(Ki===null?Ki=new Set([this]):Ki.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function Yh(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Sy;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=Uy.bind(null,t,e,n),e.then(t,t))}function Kh(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Zh(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=yi(-1,1),e.tag=2,Yi(n,e,1))),n.lanes|=1),t)}var My=Ci.ReactCurrentOwner,tn=!1;function $t(t,e,n,i){e.child=t===null?Rg(e,null,n,i):bs(e,t.child,n,i)}function Qh(t,e,n,i,r){n=n.render;var s=e.ref;return vs(e,r),i=Ef(t,e,n,i,s,r),n=wf(),t!==null&&!tn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ti(t,e,r)):(mt&&n&&df(e),e.flags|=1,$t(t,e,i,r),e.child)}function Jh(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!If(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,tx(t,e,s,i,r)):(t=Qo(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:Ca,n(a,i)&&t.ref===e.ref)return Ti(t,e,r)}return e.flags|=1,t=Qi(s,i),t.ref=e.ref,t.return=e,e.child=t}function tx(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Ca(s,i)&&t.ref===e.ref)if(tn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(tn=!0);else return e.lanes=t.lanes,Ti(t,e,r)}return Ou(t,e,n,i,r)}function nx(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ut(fs,hn),hn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ut(fs,hn),hn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,ut(fs,hn),hn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,ut(fs,hn),hn|=i;return $t(t,e,r,n),e.child}function ix(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Ou(t,e,n,i,r){var s=rn(n)?Rr:Wt.current;return s=ws(e,s),vs(e,r),n=Ef(t,e,n,i,s,r),i=wf(),t!==null&&!tn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ti(t,e,r)):(mt&&i&&df(e),e.flags|=1,$t(t,e,n,r),e.child)}function ep(t,e,n,i,r){if(rn(n)){var s=!0;ml(e)}else s=!1;if(vs(e,r),e.stateNode===null)Yo(t,e),Qg(e,n,i),Uu(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=n.contextType;typeof c=="object"&&c!==null?c=Rn(c):(c=rn(n)?Rr:Wt.current,c=ws(e,c));var f=n.getDerivedStateFromProps,p=typeof f=="function"||typeof a.getSnapshotBeforeUpdate=="function";p||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&qh(e,a,i,c),zi=!1;var h=e.memoizedState;a.state=h,yl(e,i,a,r),l=e.memoizedState,o!==i||h!==l||nn.current||zi?(typeof f=="function"&&(Iu(e,n,f,i),l=e.memoizedState),(o=zi||$h(e,n,o,i,h,l,c))?(p||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,Pg(t,e),o=e.memoizedProps,c=e.type===e.elementType?o:On(e.type,o),a.props=c,p=e.pendingProps,h=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Rn(l):(l=rn(n)?Rr:Wt.current,l=ws(e,l));var m=n.getDerivedStateFromProps;(f=typeof m=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==p||h!==l)&&qh(e,a,i,l),zi=!1,h=e.memoizedState,a.state=h,yl(e,i,a,r);var x=e.memoizedState;o!==p||h!==x||nn.current||zi?(typeof m=="function"&&(Iu(e,n,m,i),x=e.memoizedState),(c=zi||$h(e,n,c,i,h,x,l)||!1)?(f||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,x,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,x,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=x),a.props=i,a.state=x,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),i=!1)}return Fu(t,e,n,i,s,r)}function Fu(t,e,n,i,r,s){ix(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&zh(e,n,!1),Ti(t,e,s);i=e.stateNode,My.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=bs(e,t.child,null,s),e.child=bs(e,null,o,s)):$t(t,e,o,s),e.memoizedState=i.state,r&&zh(e,n,!0),e.child}function rx(t){var e=t.stateNode;e.pendingContext?Fh(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Fh(t,e.context,!1),_f(t,e.containerInfo)}function tp(t,e,n,i,r){return Ts(),hf(r),e.flags|=256,$t(t,e,n,i),e.child}var zu={dehydrated:null,treeContext:null,retryLane:0};function Bu(t){return{baseLanes:t,cachePool:null,transitions:null}}function sx(t,e,n){var i=e.pendingProps,r=gt.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),ut(gt,r&1),t===null)return Lu(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=Vl(a,i,0,null),t=Cr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Bu(n),e.memoizedState=zu,t):Af(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return Ey(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Qi(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=Qi(o,s):(s=Cr(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?Bu(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=zu,i}return s=t.child,t=s.sibling,i=Qi(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Af(t,e){return e=Vl({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function po(t,e,n,i){return i!==null&&hf(i),bs(e,t.child,null,n),t=Af(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Ey(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=Mc(Error(ae(422))),po(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Vl({mode:"visible",children:i.children},r,0,null),s=Cr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&bs(e,t.child,null,a),e.child.memoizedState=Bu(a),e.memoizedState=zu,s);if(!(e.mode&1))return po(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(ae(419)),i=Mc(s,i,void 0),po(t,e,a,i)}if(o=(a&t.childLanes)!==0,tn||o){if(i=It,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,wi(t,r),Hn(i,t,r,-1))}return Df(),i=Mc(Error(ae(421))),po(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=ky.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,pn=qi(r.nextSibling),mn=e,mt=!0,zn=null,t!==null&&(Mn[En++]=mi,Mn[En++]=gi,Mn[En++]=Nr,mi=t.id,gi=t.overflow,Nr=e),e=Af(e,i.children),e.flags|=4096,e)}function np(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Du(t.return,e,n)}function Ec(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function ax(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if($t(t,e,i.children,n),i=gt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&np(t,n,e);else if(t.tag===19)np(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(ut(gt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Sl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Ec(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Sl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Ec(e,!0,n,null,s);break;case"together":Ec(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Yo(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Ti(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Lr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ae(153));if(e.child!==null){for(t=e.child,n=Qi(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Qi(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function wy(t,e,n){switch(e.tag){case 3:rx(e),Ts();break;case 5:Lg(e);break;case 1:rn(e.type)&&ml(e);break;case 4:_f(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ut(vl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ut(gt,gt.current&1),e.flags|=128,null):n&e.child.childLanes?sx(t,e,n):(ut(gt,gt.current&1),t=Ti(t,e,n),t!==null?t.sibling:null);ut(gt,gt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return ax(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ut(gt,gt.current),i)break;return null;case 22:case 23:return e.lanes=0,nx(t,e,n)}return Ti(t,e,n)}var ox,ju,lx,cx;ox=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};ju=function(){};lx=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,wr(ti.current);var s=null;switch(n){case"input":r=cu(t,r),i=cu(t,i),s=[];break;case"select":r=vt({},r,{value:void 0}),i=vt({},i,{value:void 0}),s=[];break;case"textarea":r=fu(t,r),i=fu(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=hl)}pu(n,i);var a;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Sa.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Sa.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&ht("scroll",t),s||o===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};cx=function(t,e,n,i){n!==i&&(e.flags|=4)};function Zs(t,e){if(!mt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function jt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Ty(t,e,n){var i=e.pendingProps;switch(ff(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return jt(e),null;case 1:return rn(e.type)&&pl(),jt(e),null;case 3:return i=e.stateNode,As(),pt(nn),pt(Wt),Sf(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(fo(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,zn!==null&&(Yu(zn),zn=null))),ju(t,e),jt(e),null;case 5:yf(e);var r=wr(Da.current);if(n=e.type,t!==null&&e.stateNode!=null)lx(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ae(166));return jt(e),null}if(t=wr(ti.current),fo(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[Zn]=e,i[Pa]=s,t=(e.mode&1)!==0,n){case"dialog":ht("cancel",i),ht("close",i);break;case"iframe":case"object":case"embed":ht("load",i);break;case"video":case"audio":for(r=0;r<oa.length;r++)ht(oa[r],i);break;case"source":ht("error",i);break;case"img":case"image":case"link":ht("error",i),ht("load",i);break;case"details":ht("toggle",i);break;case"input":dh(i,s),ht("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},ht("invalid",i);break;case"textarea":hh(i,s),ht("invalid",i)}pu(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&uo(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&uo(i.textContent,o,t),r=["children",""+o]):Sa.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&ht("scroll",i)}switch(n){case"input":no(i),fh(i,s,!0);break;case"textarea":no(i),ph(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=hl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Om(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[Zn]=e,t[Pa]=i,ox(t,e,!1,!1),e.stateNode=t;e:{switch(a=mu(n,i),n){case"dialog":ht("cancel",t),ht("close",t),r=i;break;case"iframe":case"object":case"embed":ht("load",t),r=i;break;case"video":case"audio":for(r=0;r<oa.length;r++)ht(oa[r],t);r=i;break;case"source":ht("error",t),r=i;break;case"img":case"image":case"link":ht("error",t),ht("load",t),r=i;break;case"details":ht("toggle",t),r=i;break;case"input":dh(t,i),r=cu(t,i),ht("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=vt({},i,{value:void 0}),ht("invalid",t);break;case"textarea":hh(t,i),r=fu(t,i),ht("invalid",t);break;default:r=i}pu(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?Bm(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Fm(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Ma(t,l):typeof l=="number"&&Ma(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Sa.hasOwnProperty(s)?l!=null&&s==="onScroll"&&ht("scroll",t):l!=null&&Kd(t,s,l,a))}switch(n){case"input":no(t),fh(t,i,!1);break;case"textarea":no(t),ph(t);break;case"option":i.value!=null&&t.setAttribute("value",""+tr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?ps(t,!!i.multiple,s,!1):i.defaultValue!=null&&ps(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=hl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return jt(e),null;case 6:if(t&&e.stateNode!=null)cx(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ae(166));if(n=wr(Da.current),wr(ti.current),fo(e)){if(i=e.stateNode,n=e.memoizedProps,i[Zn]=e,(s=i.nodeValue!==n)&&(t=mn,t!==null))switch(t.tag){case 3:uo(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&uo(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Zn]=e,e.stateNode=i}return jt(e),null;case 13:if(pt(gt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(mt&&pn!==null&&e.mode&1&&!(e.flags&128))Ag(),Ts(),e.flags|=98560,s=!1;else if(s=fo(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ae(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ae(317));s[Zn]=e}else Ts(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;jt(e),s=!1}else zn!==null&&(Yu(zn),zn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||gt.current&1?Rt===0&&(Rt=3):Df())),e.updateQueue!==null&&(e.flags|=4),jt(e),null);case 4:return As(),ju(t,e),t===null&&Ra(e.stateNode.containerInfo),jt(e),null;case 10:return gf(e.type._context),jt(e),null;case 17:return rn(e.type)&&pl(),jt(e),null;case 19:if(pt(gt),s=e.memoizedState,s===null)return jt(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)Zs(s,!1);else{if(Rt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Sl(t),a!==null){for(e.flags|=128,Zs(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ut(gt,gt.current&1|2),e.child}t=t.sibling}s.tail!==null&&St()>Rs&&(e.flags|=128,i=!0,Zs(s,!1),e.lanes=4194304)}else{if(!i)if(t=Sl(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Zs(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!mt)return jt(e),null}else 2*St()-s.renderingStartTime>Rs&&n!==1073741824&&(e.flags|=128,i=!0,Zs(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=St(),e.sibling=null,n=gt.current,ut(gt,i?n&1|2:n&1),e):(jt(e),null);case 22:case 23:return Lf(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?hn&1073741824&&(jt(e),e.subtreeFlags&6&&(e.flags|=8192)):jt(e),null;case 24:return null;case 25:return null}throw Error(ae(156,e.tag))}function by(t,e){switch(ff(e),e.tag){case 1:return rn(e.type)&&pl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return As(),pt(nn),pt(Wt),Sf(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return yf(e),null;case 13:if(pt(gt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ae(340));Ts()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return pt(gt),null;case 4:return As(),null;case 10:return gf(e.type._context),null;case 22:case 23:return Lf(),null;case 24:return null;default:return null}}var mo=!1,Gt=!1,Ay=typeof WeakSet=="function"?WeakSet:Set,_e=null;function ds(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){yt(t,e,i)}else n.current=null}function Vu(t,e,n){try{n()}catch(i){yt(t,e,i)}}var ip=!1;function Cy(t,e){if(Tu=ul,t=pg(),uf(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,c=0,f=0,p=t,h=null;t:for(;;){for(var m;p!==n||r!==0&&p.nodeType!==3||(o=a+r),p!==s||i!==0&&p.nodeType!==3||(l=a+i),p.nodeType===3&&(a+=p.nodeValue.length),(m=p.firstChild)!==null;)h=p,p=m;for(;;){if(p===t)break t;if(h===n&&++c===r&&(o=a),h===s&&++f===i&&(l=a),(m=p.nextSibling)!==null)break;p=h,h=p.parentNode}p=m}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(bu={focusedElem:t,selectionRange:n},ul=!1,_e=e;_e!==null;)if(e=_e,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,_e=t;else for(;_e!==null;){e=_e;try{var x=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(x!==null){var _=x.memoizedProps,g=x.memoizedState,u=e.stateNode,v=u.getSnapshotBeforeUpdate(e.elementType===e.type?_:On(e.type,_),g);u.__reactInternalSnapshotBeforeUpdate=v}break;case 3:var y=e.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ae(163))}}catch(S){yt(e,e.return,S)}if(t=e.sibling,t!==null){t.return=e.return,_e=t;break}_e=e.return}return x=ip,ip=!1,x}function xa(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Vu(e,n,s)}r=r.next}while(r!==i)}}function Bl(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Hu(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function ux(t){var e=t.alternate;e!==null&&(t.alternate=null,ux(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Zn],delete e[Pa],delete e[Ru],delete e[uy],delete e[dy])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function dx(t){return t.tag===5||t.tag===3||t.tag===4}function rp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||dx(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Gu(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=hl));else if(i!==4&&(t=t.child,t!==null))for(Gu(t,e,n),t=t.sibling;t!==null;)Gu(t,e,n),t=t.sibling}function Wu(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Wu(t,e,n),t=t.sibling;t!==null;)Wu(t,e,n),t=t.sibling}var Ut=null,Fn=!1;function Pi(t,e,n){for(n=n.child;n!==null;)fx(t,e,n),n=n.sibling}function fx(t,e,n){if(ei&&typeof ei.onCommitFiberUnmount=="function")try{ei.onCommitFiberUnmount(Ll,n)}catch{}switch(n.tag){case 5:Gt||ds(n,e);case 6:var i=Ut,r=Fn;Ut=null,Pi(t,e,n),Ut=i,Fn=r,Ut!==null&&(Fn?(t=Ut,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Ut.removeChild(n.stateNode));break;case 18:Ut!==null&&(Fn?(t=Ut,n=n.stateNode,t.nodeType===8?gc(t.parentNode,n):t.nodeType===1&&gc(t,n),ba(t)):gc(Ut,n.stateNode));break;case 4:i=Ut,r=Fn,Ut=n.stateNode.containerInfo,Fn=!0,Pi(t,e,n),Ut=i,Fn=r;break;case 0:case 11:case 14:case 15:if(!Gt&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Vu(n,e,a),r=r.next}while(r!==i)}Pi(t,e,n);break;case 1:if(!Gt&&(ds(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){yt(n,e,o)}Pi(t,e,n);break;case 21:Pi(t,e,n);break;case 22:n.mode&1?(Gt=(i=Gt)||n.memoizedState!==null,Pi(t,e,n),Gt=i):Pi(t,e,n);break;default:Pi(t,e,n)}}function sp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new Ay),e.forEach(function(i){var r=Oy.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Dn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Ut=o.stateNode,Fn=!1;break e;case 3:Ut=o.stateNode.containerInfo,Fn=!0;break e;case 4:Ut=o.stateNode.containerInfo,Fn=!0;break e}o=o.return}if(Ut===null)throw Error(ae(160));fx(s,a,r),Ut=null,Fn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){yt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)hx(e,t),e=e.sibling}function hx(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Dn(e,t),qn(t),i&4){try{xa(3,t,t.return),Bl(3,t)}catch(_){yt(t,t.return,_)}try{xa(5,t,t.return)}catch(_){yt(t,t.return,_)}}break;case 1:Dn(e,t),qn(t),i&512&&n!==null&&ds(n,n.return);break;case 5:if(Dn(e,t),qn(t),i&512&&n!==null&&ds(n,n.return),t.flags&32){var r=t.stateNode;try{Ma(r,"")}catch(_){yt(t,t.return,_)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&Um(r,s),mu(o,a);var c=mu(o,s);for(a=0;a<l.length;a+=2){var f=l[a],p=l[a+1];f==="style"?Bm(r,p):f==="dangerouslySetInnerHTML"?Fm(r,p):f==="children"?Ma(r,p):Kd(r,f,p,c)}switch(o){case"input":uu(r,s);break;case"textarea":km(r,s);break;case"select":var h=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var m=s.value;m!=null?ps(r,!!s.multiple,m,!1):h!==!!s.multiple&&(s.defaultValue!=null?ps(r,!!s.multiple,s.defaultValue,!0):ps(r,!!s.multiple,s.multiple?[]:"",!1))}r[Pa]=s}catch(_){yt(t,t.return,_)}}break;case 6:if(Dn(e,t),qn(t),i&4){if(t.stateNode===null)throw Error(ae(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(_){yt(t,t.return,_)}}break;case 3:if(Dn(e,t),qn(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{ba(e.containerInfo)}catch(_){yt(t,t.return,_)}break;case 4:Dn(e,t),qn(t);break;case 13:Dn(e,t),qn(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Nf=St())),i&4&&sp(t);break;case 22:if(f=n!==null&&n.memoizedState!==null,t.mode&1?(Gt=(c=Gt)||f,Dn(e,t),Gt=c):Dn(e,t),qn(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!f&&t.mode&1)for(_e=t,f=t.child;f!==null;){for(p=_e=f;_e!==null;){switch(h=_e,m=h.child,h.tag){case 0:case 11:case 14:case 15:xa(4,h,h.return);break;case 1:ds(h,h.return);var x=h.stateNode;if(typeof x.componentWillUnmount=="function"){i=h,n=h.return;try{e=i,x.props=e.memoizedProps,x.state=e.memoizedState,x.componentWillUnmount()}catch(_){yt(i,n,_)}}break;case 5:ds(h,h.return);break;case 22:if(h.memoizedState!==null){op(p);continue}}m!==null?(m.return=h,_e=m):op(p)}f=f.sibling}e:for(f=null,p=t;;){if(p.tag===5){if(f===null){f=p;try{r=p.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=p.stateNode,l=p.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=zm("display",a))}catch(_){yt(t,t.return,_)}}}else if(p.tag===6){if(f===null)try{p.stateNode.nodeValue=c?"":p.memoizedProps}catch(_){yt(t,t.return,_)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===t)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===t)break e;for(;p.sibling===null;){if(p.return===null||p.return===t)break e;f===p&&(f=null),p=p.return}f===p&&(f=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:Dn(e,t),qn(t),i&4&&sp(t);break;case 21:break;default:Dn(e,t),qn(t)}}function qn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(dx(n)){var i=n;break e}n=n.return}throw Error(ae(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Ma(r,""),i.flags&=-33);var s=rp(t);Wu(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=rp(t);Gu(t,o,a);break;default:throw Error(ae(161))}}catch(l){yt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Ry(t,e,n){_e=t,px(t)}function px(t,e,n){for(var i=(t.mode&1)!==0;_e!==null;){var r=_e,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||mo;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||Gt;o=mo;var c=Gt;if(mo=a,(Gt=l)&&!c)for(_e=r;_e!==null;)a=_e,l=a.child,a.tag===22&&a.memoizedState!==null?lp(r):l!==null?(l.return=a,_e=l):lp(r);for(;s!==null;)_e=s,px(s),s=s.sibling;_e=r,mo=o,Gt=c}ap(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,_e=s):ap(t)}}function ap(t){for(;_e!==null;){var e=_e;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Gt||Bl(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Gt)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:On(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Gh(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Gh(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var f=c.memoizedState;if(f!==null){var p=f.dehydrated;p!==null&&ba(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ae(163))}Gt||e.flags&512&&Hu(e)}catch(h){yt(e,e.return,h)}}if(e===t){_e=null;break}if(n=e.sibling,n!==null){n.return=e.return,_e=n;break}_e=e.return}}function op(t){for(;_e!==null;){var e=_e;if(e===t){_e=null;break}var n=e.sibling;if(n!==null){n.return=e.return,_e=n;break}_e=e.return}}function lp(t){for(;_e!==null;){var e=_e;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Bl(4,e)}catch(l){yt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){yt(e,r,l)}}var s=e.return;try{Hu(e)}catch(l){yt(e,s,l)}break;case 5:var a=e.return;try{Hu(e)}catch(l){yt(e,a,l)}}}catch(l){yt(e,e.return,l)}if(e===t){_e=null;break}var o=e.sibling;if(o!==null){o.return=e.return,_e=o;break}_e=e.return}}var Ny=Math.ceil,wl=Ci.ReactCurrentDispatcher,Cf=Ci.ReactCurrentOwner,An=Ci.ReactCurrentBatchConfig,Ke=0,It=null,bt=null,kt=0,hn=0,fs=ar(0),Rt=0,Oa=null,Lr=0,jl=0,Rf=0,va=null,Jt=null,Nf=0,Rs=1/0,fi=null,Tl=!1,Xu=null,Ki=null,go=!1,Gi=null,bl=0,_a=0,$u=null,Ko=-1,Zo=0;function qt(){return Ke&6?St():Ko!==-1?Ko:Ko=St()}function Zi(t){return t.mode&1?Ke&2&&kt!==0?kt&-kt:hy.transition!==null?(Zo===0&&(Zo=Qm()),Zo):(t=nt,t!==0||(t=window.event,t=t===void 0?16:sg(t.type)),t):1}function Hn(t,e,n,i){if(50<_a)throw _a=0,$u=null,Error(ae(185));Ba(t,n,i),(!(Ke&2)||t!==It)&&(t===It&&(!(Ke&2)&&(jl|=n),Rt===4&&ji(t,kt)),sn(t,i),n===1&&Ke===0&&!(e.mode&1)&&(Rs=St()+500,Ol&&or()))}function sn(t,e){var n=t.callbackNode;h_(t,e);var i=cl(t,t===It?kt:0);if(i===0)n!==null&&xh(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&xh(n),e===1)t.tag===0?fy(cp.bind(null,t)):wg(cp.bind(null,t)),ly(function(){!(Ke&6)&&or()}),n=null;else{switch(Jm(i)){case 1:n=tf;break;case 4:n=Km;break;case 16:n=ll;break;case 536870912:n=Zm;break;default:n=ll}n=Mx(n,mx.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function mx(t,e){if(Ko=-1,Zo=0,Ke&6)throw Error(ae(327));var n=t.callbackNode;if(_s()&&t.callbackNode!==n)return null;var i=cl(t,t===It?kt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Al(t,i);else{e=i;var r=Ke;Ke|=2;var s=xx();(It!==t||kt!==e)&&(fi=null,Rs=St()+500,Ar(t,e));do try{Dy();break}catch(o){gx(t,o)}while(!0);mf(),wl.current=s,Ke=r,bt!==null?e=0:(It=null,kt=0,e=Rt)}if(e!==0){if(e===2&&(r=yu(t),r!==0&&(i=r,e=qu(t,r))),e===1)throw n=Oa,Ar(t,0),ji(t,i),sn(t,St()),n;if(e===6)ji(t,i);else{if(r=t.current.alternate,!(i&30)&&!Py(r)&&(e=Al(t,i),e===2&&(s=yu(t),s!==0&&(i=s,e=qu(t,s))),e===1))throw n=Oa,Ar(t,0),ji(t,i),sn(t,St()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ae(345));case 2:xr(t,Jt,fi);break;case 3:if(ji(t,i),(i&130023424)===i&&(e=Nf+500-St(),10<e)){if(cl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){qt(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Cu(xr.bind(null,t,Jt,fi),e);break}xr(t,Jt,fi);break;case 4:if(ji(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-Vn(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=St()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Ny(i/1960))-i,10<i){t.timeoutHandle=Cu(xr.bind(null,t,Jt,fi),i);break}xr(t,Jt,fi);break;case 5:xr(t,Jt,fi);break;default:throw Error(ae(329))}}}return sn(t,St()),t.callbackNode===n?mx.bind(null,t):null}function qu(t,e){var n=va;return t.current.memoizedState.isDehydrated&&(Ar(t,e).flags|=256),t=Al(t,e),t!==2&&(e=Jt,Jt=n,e!==null&&Yu(e)),t}function Yu(t){Jt===null?Jt=t:Jt.push.apply(Jt,t)}function Py(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!Wn(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function ji(t,e){for(e&=~Rf,e&=~jl,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Vn(e),i=1<<n;t[n]=-1,e&=~i}}function cp(t){if(Ke&6)throw Error(ae(327));_s();var e=cl(t,0);if(!(e&1))return sn(t,St()),null;var n=Al(t,e);if(t.tag!==0&&n===2){var i=yu(t);i!==0&&(e=i,n=qu(t,i))}if(n===1)throw n=Oa,Ar(t,0),ji(t,e),sn(t,St()),n;if(n===6)throw Error(ae(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,xr(t,Jt,fi),sn(t,St()),null}function Pf(t,e){var n=Ke;Ke|=1;try{return t(e)}finally{Ke=n,Ke===0&&(Rs=St()+500,Ol&&or())}}function Dr(t){Gi!==null&&Gi.tag===0&&!(Ke&6)&&_s();var e=Ke;Ke|=1;var n=An.transition,i=nt;try{if(An.transition=null,nt=1,t)return t()}finally{nt=i,An.transition=n,Ke=e,!(Ke&6)&&or()}}function Lf(){hn=fs.current,pt(fs)}function Ar(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,oy(n)),bt!==null)for(n=bt.return;n!==null;){var i=n;switch(ff(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&pl();break;case 3:As(),pt(nn),pt(Wt),Sf();break;case 5:yf(i);break;case 4:As();break;case 13:pt(gt);break;case 19:pt(gt);break;case 10:gf(i.type._context);break;case 22:case 23:Lf()}n=n.return}if(It=t,bt=t=Qi(t.current,null),kt=hn=e,Rt=0,Oa=null,Rf=jl=Lr=0,Jt=va=null,Er!==null){for(e=0;e<Er.length;e++)if(n=Er[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}Er=null}return t}function gx(t,e){do{var n=bt;try{if(mf(),$o.current=El,Ml){for(var i=xt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Ml=!1}if(Pr=0,Dt=At=xt=null,ga=!1,Ia=0,Cf.current=null,n===null||n.return===null){Rt=1,Oa=e,bt=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=kt,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,f=o,p=f.tag;if(!(f.mode&1)&&(p===0||p===11||p===15)){var h=f.alternate;h?(f.updateQueue=h.updateQueue,f.memoizedState=h.memoizedState,f.lanes=h.lanes):(f.updateQueue=null,f.memoizedState=null)}var m=Kh(a);if(m!==null){m.flags&=-257,Zh(m,a,o,s,e),m.mode&1&&Yh(s,c,e),e=m,l=c;var x=e.updateQueue;if(x===null){var _=new Set;_.add(l),e.updateQueue=_}else x.add(l);break e}else{if(!(e&1)){Yh(s,c,e),Df();break e}l=Error(ae(426))}}else if(mt&&o.mode&1){var g=Kh(a);if(g!==null){!(g.flags&65536)&&(g.flags|=256),Zh(g,a,o,s,e),hf(Cs(l,o));break e}}s=l=Cs(l,o),Rt!==4&&(Rt=2),va===null?va=[s]:va.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var u=Jg(s,l,e);Hh(s,u);break e;case 1:o=l;var v=s.type,y=s.stateNode;if(!(s.flags&128)&&(typeof v.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(Ki===null||!Ki.has(y)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=ex(s,o,e);Hh(s,S);break e}}s=s.return}while(s!==null)}_x(n)}catch(N){e=N,bt===n&&n!==null&&(bt=n=n.return);continue}break}while(!0)}function xx(){var t=wl.current;return wl.current=El,t===null?El:t}function Df(){(Rt===0||Rt===3||Rt===2)&&(Rt=4),It===null||!(Lr&268435455)&&!(jl&268435455)||ji(It,kt)}function Al(t,e){var n=Ke;Ke|=2;var i=xx();(It!==t||kt!==e)&&(fi=null,Ar(t,e));do try{Ly();break}catch(r){gx(t,r)}while(!0);if(mf(),Ke=n,wl.current=i,bt!==null)throw Error(ae(261));return It=null,kt=0,Rt}function Ly(){for(;bt!==null;)vx(bt)}function Dy(){for(;bt!==null&&!r_();)vx(bt)}function vx(t){var e=Sx(t.alternate,t,hn);t.memoizedProps=t.pendingProps,e===null?_x(t):bt=e,Cf.current=null}function _x(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=by(n,e),n!==null){n.flags&=32767,bt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Rt=6,bt=null;return}}else if(n=Ty(n,e,hn),n!==null){bt=n;return}if(e=e.sibling,e!==null){bt=e;return}bt=e=t}while(e!==null);Rt===0&&(Rt=5)}function xr(t,e,n){var i=nt,r=An.transition;try{An.transition=null,nt=1,Iy(t,e,n,i)}finally{An.transition=r,nt=i}return null}function Iy(t,e,n,i){do _s();while(Gi!==null);if(Ke&6)throw Error(ae(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ae(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(p_(t,s),t===It&&(bt=It=null,kt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||go||(go=!0,Mx(ll,function(){return _s(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=An.transition,An.transition=null;var a=nt;nt=1;var o=Ke;Ke|=4,Cf.current=null,Cy(t,n),hx(n,t),ey(bu),ul=!!Tu,bu=Tu=null,t.current=n,Ry(n),s_(),Ke=o,nt=a,An.transition=s}else t.current=n;if(go&&(go=!1,Gi=t,bl=r),s=t.pendingLanes,s===0&&(Ki=null),l_(n.stateNode),sn(t,St()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Tl)throw Tl=!1,t=Xu,Xu=null,t;return bl&1&&t.tag!==0&&_s(),s=t.pendingLanes,s&1?t===$u?_a++:(_a=0,$u=t):_a=0,or(),null}function _s(){if(Gi!==null){var t=Jm(bl),e=An.transition,n=nt;try{if(An.transition=null,nt=16>t?16:t,Gi===null)var i=!1;else{if(t=Gi,Gi=null,bl=0,Ke&6)throw Error(ae(331));var r=Ke;for(Ke|=4,_e=t.current;_e!==null;){var s=_e,a=s.child;if(_e.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(_e=c;_e!==null;){var f=_e;switch(f.tag){case 0:case 11:case 15:xa(8,f,s)}var p=f.child;if(p!==null)p.return=f,_e=p;else for(;_e!==null;){f=_e;var h=f.sibling,m=f.return;if(ux(f),f===c){_e=null;break}if(h!==null){h.return=m,_e=h;break}_e=m}}}var x=s.alternate;if(x!==null){var _=x.child;if(_!==null){x.child=null;do{var g=_.sibling;_.sibling=null,_=g}while(_!==null)}}_e=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,_e=a;else e:for(;_e!==null;){if(s=_e,s.flags&2048)switch(s.tag){case 0:case 11:case 15:xa(9,s,s.return)}var u=s.sibling;if(u!==null){u.return=s.return,_e=u;break e}_e=s.return}}var v=t.current;for(_e=v;_e!==null;){a=_e;var y=a.child;if(a.subtreeFlags&2064&&y!==null)y.return=a,_e=y;else e:for(a=v;_e!==null;){if(o=_e,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:Bl(9,o)}}catch(N){yt(o,o.return,N)}if(o===a){_e=null;break e}var S=o.sibling;if(S!==null){S.return=o.return,_e=S;break e}_e=o.return}}if(Ke=r,or(),ei&&typeof ei.onPostCommitFiberRoot=="function")try{ei.onPostCommitFiberRoot(Ll,t)}catch{}i=!0}return i}finally{nt=n,An.transition=e}}return!1}function up(t,e,n){e=Cs(n,e),e=Jg(t,e,1),t=Yi(t,e,1),e=qt(),t!==null&&(Ba(t,1,e),sn(t,e))}function yt(t,e,n){if(t.tag===3)up(t,t,n);else for(;e!==null;){if(e.tag===3){up(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Ki===null||!Ki.has(i))){t=Cs(n,t),t=ex(e,t,1),e=Yi(e,t,1),t=qt(),e!==null&&(Ba(e,1,t),sn(e,t));break}}e=e.return}}function Uy(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=qt(),t.pingedLanes|=t.suspendedLanes&n,It===t&&(kt&n)===n&&(Rt===4||Rt===3&&(kt&130023424)===kt&&500>St()-Nf?Ar(t,0):Rf|=n),sn(t,e)}function yx(t,e){e===0&&(t.mode&1?(e=so,so<<=1,!(so&130023424)&&(so=4194304)):e=1);var n=qt();t=wi(t,e),t!==null&&(Ba(t,e,n),sn(t,n))}function ky(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),yx(t,n)}function Oy(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ae(314))}i!==null&&i.delete(e),yx(t,n)}var Sx;Sx=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||nn.current)tn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return tn=!1,wy(t,e,n);tn=!!(t.flags&131072)}else tn=!1,mt&&e.flags&1048576&&Tg(e,xl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Yo(t,e),t=e.pendingProps;var r=ws(e,Wt.current);vs(e,n),r=Ef(null,e,i,t,r,n);var s=wf();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,rn(i)?(s=!0,ml(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,vf(e),r.updater=zl,e.stateNode=r,r._reactInternals=e,Uu(e,i,t,n),e=Fu(null,e,i,!0,s,n)):(e.tag=0,mt&&s&&df(e),$t(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(Yo(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=zy(i),t=On(i,t),r){case 0:e=Ou(null,e,i,t,n);break e;case 1:e=ep(null,e,i,t,n);break e;case 11:e=Qh(null,e,i,t,n);break e;case 14:e=Jh(null,e,i,On(i.type,t),n);break e}throw Error(ae(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:On(i,r),Ou(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:On(i,r),ep(t,e,i,r,n);case 3:e:{if(rx(e),t===null)throw Error(ae(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Pg(t,e),yl(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Cs(Error(ae(423)),e),e=tp(t,e,i,n,r);break e}else if(i!==r){r=Cs(Error(ae(424)),e),e=tp(t,e,i,n,r);break e}else for(pn=qi(e.stateNode.containerInfo.firstChild),mn=e,mt=!0,zn=null,n=Rg(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ts(),i===r){e=Ti(t,e,n);break e}$t(t,e,i,n)}e=e.child}return e;case 5:return Lg(e),t===null&&Lu(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,Au(i,r)?a=null:s!==null&&Au(i,s)&&(e.flags|=32),ix(t,e),$t(t,e,a,n),e.child;case 6:return t===null&&Lu(e),null;case 13:return sx(t,e,n);case 4:return _f(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=bs(e,null,i,n):$t(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:On(i,r),Qh(t,e,i,r,n);case 7:return $t(t,e,e.pendingProps,n),e.child;case 8:return $t(t,e,e.pendingProps.children,n),e.child;case 12:return $t(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,ut(vl,i._currentValue),i._currentValue=a,s!==null)if(Wn(s.value,a)){if(s.children===r.children&&!nn.current){e=Ti(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=yi(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var f=c.pending;f===null?l.next=l:(l.next=f.next,f.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),Du(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(ae(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),Du(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}$t(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,vs(e,n),r=Rn(r),i=i(r),e.flags|=1,$t(t,e,i,n),e.child;case 14:return i=e.type,r=On(i,e.pendingProps),r=On(i.type,r),Jh(t,e,i,r,n);case 15:return tx(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:On(i,r),Yo(t,e),e.tag=1,rn(i)?(t=!0,ml(e)):t=!1,vs(e,n),Qg(e,i,r),Uu(e,i,r,n),Fu(null,e,i,!0,t,n);case 19:return ax(t,e,n);case 22:return nx(t,e,n)}throw Error(ae(156,e.tag))};function Mx(t,e){return Ym(t,e)}function Fy(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Tn(t,e,n,i){return new Fy(t,e,n,i)}function If(t){return t=t.prototype,!(!t||!t.isReactComponent)}function zy(t){if(typeof t=="function")return If(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Qd)return 11;if(t===Jd)return 14}return 2}function Qi(t,e){var n=t.alternate;return n===null?(n=Tn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Qo(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")If(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case ns:return Cr(n.children,r,s,e);case Zd:a=8,r|=8;break;case su:return t=Tn(12,n,e,r|2),t.elementType=su,t.lanes=s,t;case au:return t=Tn(13,n,e,r),t.elementType=au,t.lanes=s,t;case ou:return t=Tn(19,n,e,r),t.elementType=ou,t.lanes=s,t;case Lm:return Vl(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Nm:a=10;break e;case Pm:a=9;break e;case Qd:a=11;break e;case Jd:a=14;break e;case Fi:a=16,i=null;break e}throw Error(ae(130,t==null?t:typeof t,""))}return e=Tn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Cr(t,e,n,i){return t=Tn(7,t,i,e),t.lanes=n,t}function Vl(t,e,n,i){return t=Tn(22,t,i,e),t.elementType=Lm,t.lanes=n,t.stateNode={isHidden:!1},t}function wc(t,e,n){return t=Tn(6,t,null,e),t.lanes=n,t}function Tc(t,e,n){return e=Tn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function By(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=sc(0),this.expirationTimes=sc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=sc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Uf(t,e,n,i,r,s,a,o,l){return t=new By(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Tn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},vf(s),t}function jy(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ts,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function Ex(t){if(!t)return nr;t=t._reactInternals;e:{if(Or(t)!==t||t.tag!==1)throw Error(ae(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(rn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ae(171))}if(t.tag===1){var n=t.type;if(rn(n))return Eg(t,n,e)}return e}function wx(t,e,n,i,r,s,a,o,l){return t=Uf(n,i,!0,t,r,s,a,o,l),t.context=Ex(null),n=t.current,i=qt(),r=Zi(n),s=yi(i,r),s.callback=e??null,Yi(n,s,r),t.current.lanes=r,Ba(t,r,i),sn(t,i),t}function Hl(t,e,n,i){var r=e.current,s=qt(),a=Zi(r);return n=Ex(n),e.context===null?e.context=n:e.pendingContext=n,e=yi(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Yi(r,e,a),t!==null&&(Hn(t,r,a,s),Xo(t,r,a)),a}function Cl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function dp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function kf(t,e){dp(t,e),(t=t.alternate)&&dp(t,e)}function Vy(){return null}var Tx=typeof reportError=="function"?reportError:function(t){console.error(t)};function Of(t){this._internalRoot=t}Gl.prototype.render=Of.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ae(409));Hl(t,e,null,null)};Gl.prototype.unmount=Of.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Dr(function(){Hl(null,t,null,null)}),e[Ei]=null}};function Gl(t){this._internalRoot=t}Gl.prototype.unstable_scheduleHydration=function(t){if(t){var e=ng();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Bi.length&&e!==0&&e<Bi[n].priority;n++);Bi.splice(n,0,t),n===0&&rg(t)}};function Ff(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Wl(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function fp(){}function Hy(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Cl(a);s.call(c)}}var a=wx(e,i,t,0,null,!1,!1,"",fp);return t._reactRootContainer=a,t[Ei]=a.current,Ra(t.nodeType===8?t.parentNode:t),Dr(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=Cl(l);o.call(c)}}var l=Uf(t,0,!1,null,null,!1,!1,"",fp);return t._reactRootContainer=l,t[Ei]=l.current,Ra(t.nodeType===8?t.parentNode:t),Dr(function(){Hl(e,l,n,i)}),l}function Xl(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=Cl(a);o.call(l)}}Hl(e,a,t,r)}else a=Hy(n,e,t,r,i);return Cl(a)}eg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=aa(e.pendingLanes);n!==0&&(nf(e,n|1),sn(e,St()),!(Ke&6)&&(Rs=St()+500,or()))}break;case 13:Dr(function(){var i=wi(t,1);if(i!==null){var r=qt();Hn(i,t,1,r)}}),kf(t,1)}};rf=function(t){if(t.tag===13){var e=wi(t,134217728);if(e!==null){var n=qt();Hn(e,t,134217728,n)}kf(t,134217728)}};tg=function(t){if(t.tag===13){var e=Zi(t),n=wi(t,e);if(n!==null){var i=qt();Hn(n,t,e,i)}kf(t,e)}};ng=function(){return nt};ig=function(t,e){var n=nt;try{return nt=t,e()}finally{nt=n}};xu=function(t,e,n){switch(e){case"input":if(uu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=kl(i);if(!r)throw Error(ae(90));Im(i),uu(i,r)}}}break;case"textarea":km(t,n);break;case"select":e=n.value,e!=null&&ps(t,!!n.multiple,e,!1)}};Hm=Pf;Gm=Dr;var Gy={usingClientEntryPoint:!1,Events:[Va,as,kl,jm,Vm,Pf]},Qs={findFiberByHostInstance:Mr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Wy={bundleType:Qs.bundleType,version:Qs.version,rendererPackageName:Qs.rendererPackageName,rendererConfig:Qs.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ci.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=$m(t),t===null?null:t.stateNode},findFiberByHostInstance:Qs.findFiberByHostInstance||Vy,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var xo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!xo.isDisabled&&xo.supportsFiber)try{Ll=xo.inject(Wy),ei=xo}catch{}}xn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Gy;xn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ff(e))throw Error(ae(200));return jy(t,e,null,n)};xn.createRoot=function(t,e){if(!Ff(t))throw Error(ae(299));var n=!1,i="",r=Tx;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Uf(t,1,!1,null,null,n,!1,i,r),t[Ei]=e.current,Ra(t.nodeType===8?t.parentNode:t),new Of(e)};xn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ae(188)):(t=Object.keys(t).join(","),Error(ae(268,t)));return t=$m(e),t=t===null?null:t.stateNode,t};xn.flushSync=function(t){return Dr(t)};xn.hydrate=function(t,e,n){if(!Wl(e))throw Error(ae(200));return Xl(null,t,e,!0,n)};xn.hydrateRoot=function(t,e,n){if(!Ff(t))throw Error(ae(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=Tx;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=wx(e,null,t,1,n??null,r,!1,s,a),t[Ei]=e.current,Ra(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new Gl(e)};xn.render=function(t,e,n){if(!Wl(e))throw Error(ae(200));return Xl(null,t,e,!1,n)};xn.unmountComponentAtNode=function(t){if(!Wl(t))throw Error(ae(40));return t._reactRootContainer?(Dr(function(){Xl(null,null,t,!1,function(){t._reactRootContainer=null,t[Ei]=null})}),!0):!1};xn.unstable_batchedUpdates=Pf;xn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Wl(n))throw Error(ae(200));if(t==null||t._reactInternals===void 0)throw Error(ae(38));return Xl(t,e,n,!1,i)};xn.version="18.3.1-next-f1338f8080-20240426";function bx(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(bx)}catch(t){console.error(t)}}bx(),bm.exports=xn;var Xy=bm.exports,hp=Xy;iu.createRoot=hp.createRoot,iu.hydrateRoot=hp.hydrateRoot;const $y="";async function We(t,e={}){const n=`${$y}${t}`,i=await fetch(n,{headers:{"Content-Type":"application/json",...e.headers},...e});if(!i.ok){let r=`Request failed: ${i.statusText}`;try{const s=await i.json();r=s.detail||s.message||r}catch{}throw new Error(r)}return i.json()}const $e={async getMe(){return We("/api/me")},async getHomeView(){return We("/api/v1/home")},async getCommitments(t){const e=t?`?status=${encodeURIComponent(t)}`:"";return We(`/api/v1/commitments${e}`)},async createCommitment(t){return We("/api/v1/commitments",{method:"POST",body:JSON.stringify(t)})},async getTasks(t){const e=t?`?status=${encodeURIComponent(t)}`:"";return We(`/api/v1/tasks${e}`)},async createTask(t,e={}){return We("/api/v1/tasks",{method:"POST",body:JSON.stringify({title:t,...e})})},async completeTask(t,e){return We(`/api/v1/tasks/${t}/complete`,{method:"POST",body:JSON.stringify({receipt:e||{}})})},async getPlan(t){const e=t?`?plan_date=${encodeURIComponent(t)}`:"";return We(`/api/v1/plan${e}`)},async generatePlan(t){const e=t?`?plan_date=${encodeURIComponent(t)}`:"";return We(`/api/v1/plan/generate${e}`,{method:"POST"})},async getV1Approvals(){return We("/api/v1/approvals")},async approveV1(t,e){return We(`/api/v1/approvals/${t}/approve`,{method:"POST",body:JSON.stringify({arguments:e})})},async rejectV1(t,e=""){return We(`/api/v1/approvals/${t}/reject`,{method:"POST",body:JSON.stringify({reason:e})})},async getPendingActions(){return We("/api/actions/pending")},async approveAction(t){return We(`/api/actions/${t}/approve`,{method:"POST"})},async rejectAction(t){return We(`/api/actions/${t}/reject`,{method:"POST"})},async getAgents(){return We("/api/v1/agents")},async dispatchAgent(t,e,n={}){return We("/api/v1/agents/dispatch",{method:"POST",body:JSON.stringify({agent_type:t,instruction:e,parameters:n})})},async getActivity(t=50){return We(`/api/v1/activity?limit=${t}`)},async getConnectors(){return We("/api/connectors")},async testConnector(t){return We(`/api/connectors/${t}/test`,{method:"POST"})},async getMemory(){return We("/api/memory")},async forgetMemory(t){return We(`/api/memory/${encodeURIComponent(t)}`,{method:"DELETE"})},async getWatchers(){return We("/api/watchers")},async markWatcherSeen(t){return We(`/api/watchers/${t}/seen`,{method:"POST"})},async getAnalytics(){return We("/api/analytics")},async getHudState(){return We("/api/hud/state")},async sendHudCommand(t,e,n,i){return We("/api/hud/command",{method:"POST",body:JSON.stringify({query:t,dot:e,action_type:n,action_payload:i})})},async resolveHudApproval(t,e){return We("/api/hud/approval",{method:"POST",body:JSON.stringify({approval_id:t,decision:e})})},async toggleHudTakeover(t){return We("/api/hud/computer/takeover",{method:"POST",body:JSON.stringify({take_control:t})})},async saveHudSpacePage(t,e,n,i,r="Sai",s){return We("/api/hud/spaces/save",{method:"POST",body:JSON.stringify({space_id:t,page_id:e,title:n,markdown:i,author:r,expected_revision:s})})},async optimizeHudTraces(){return We("/api/hud/optimize",{method:"POST"})},async draftLinkedInPost(t,e=[]){return We("/api/hud/social/linkedin/draft",{method:"POST",body:JSON.stringify({topic:t,highlights:e})})},async publishLinkedInPost(t,e){return We("/api/hud/social/linkedin/publish",{method:"POST",body:JSON.stringify({post_text:t,token:e})})},async summarizeYouTubeVideo(t,e=""){return We("/api/hud/social/youtube/summarize",{method:"POST",body:JSON.stringify({video_url:t,title:e})})},async speakHudVoice(t){return We("/api/hud/voice/speak",{method:"POST",body:JSON.stringify({text:t})})}},Ax=q.createContext(void 0),qy=({children:t})=>{const[e,n]=q.useState("home"),[i,r]=q.useState("dark"),[s,a]=q.useState(null),[o,l]=q.useState("IDLE"),[c,f]=q.useState(0),[p,h]=q.useState(0),[m,x]=q.useState([]),[_,g]=q.useState(!1);q.useEffect(()=>{const w=localStorage.getItem("os-theme")||"dark";r(w),document.documentElement.setAttribute("data-theme",w)},[]);const u=q.useCallback(A=>{r(A),localStorage.setItem("os-theme",A),document.documentElement.setAttribute("data-theme",A)},[]),v=q.useCallback(()=>{u(i==="dark"?"light":"dark")},[i,u]),y=q.useCallback(A=>{const w=Math.random().toString(36).substring(2,9),R={...A,id:w,timestamp:Date.now()};x(b=>[R,...b.slice(0,4)]),setTimeout(()=>{S(w)},5e3)},[]),S=q.useCallback(A=>{x(w=>w.filter(R=>R.id!==A))},[]),N=q.useCallback(async()=>{var A,w,R,b;try{const[M,P,G,O]=await Promise.allSettled([$e.getMe(),$e.getV1Approvals(),$e.getPendingActions(),$e.getAgents()]);M.status==="fulfilled"&&a(M.value);let Y=0;if(P.status==="fulfilled"&&(Y+=((A=P.value.pending_approvals)==null?void 0:A.length)||0),G.status==="fulfilled"&&(Y+=((w=G.value.pending)==null?void 0:w.length)||0),f(Y),O.status==="fulfilled"){const X=((b=(R=O.value.agent_runs)==null?void 0:R.filter($=>$.status==="running"))==null?void 0:b.length)||0;h(X),X>0&&o==="IDLE"&&l("WORKING")}}catch(M){console.error("Failed to refresh app status:",M)}},[o]);return q.useEffect(()=>{N();const A=setInterval(N,1e4);return()=>clearInterval(A)},[N]),q.useEffect(()=>{const A=w=>{(w.ctrlKey||w.metaKey)&&w.key==="k"&&(w.preventDefault(),g(R=>!R))};return window.addEventListener("keydown",A),()=>window.removeEventListener("keydown",A)},[]),d.jsx(Ax.Provider,{value:{currentView:e,setCurrentView:n,theme:i,setTheme:u,toggleTheme:v,me:s,orbState:o,setOrbState:l,pendingApprovalsCount:c,activeAgentsCount:p,refreshData:N,notifications:m,addNotification:y,removeNotification:S,isCommandPaletteOpen:_,setIsCommandPaletteOpen:g},children:t})},cn=()=>{const t=q.useContext(Ax);if(!t)throw new Error("useApp must be used within an AppProvider");return t},Cx=q.createContext(void 0),Yy=({children:t})=>{const{setOrbState:e}=cn(),[n,i]=q.useState(!1),[r,s]=q.useState(!1),a=q.useRef(null),o=q.useCallback(()=>{if(i(!0),e("LISTENING"),"webkitSpeechRecognition"in window||"SpeechRecognition"in window){const p=window.SpeechRecognition||window.webkitSpeechRecognition;try{const h=new p;h.continuous=!0,h.interimResults=!0,h.onstart=()=>{e("LISTENING")},h.onresult=()=>{e("THINKING")},h.onerror=()=>{e("IDLE")},h.onend=()=>{n&&e("IDLE")},a.current=h,h.start()}catch(h){console.warn("SpeechRecognition error:",h)}}},[n,e]),l=q.useCallback(()=>{if(i(!1),e("IDLE"),a.current)try{a.current.stop()}catch{}},[e]),c=q.useCallback(()=>{n?l():o()},[n,o,l]),f=q.useCallback(()=>{s(p=>!p)},[]);return d.jsx(Cx.Provider,{value:{isVoiceActive:n,toggleVoice:c,startListening:o,stopListening:l,isMuted:r,toggleMute:f},children:t})},Rx=()=>{const t=q.useContext(Cx);if(!t)throw new Error("useVoice must be used within a VoiceProvider");return t};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ky=t=>t==null?void 0:t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function Zy(t,e,n=[]){if(e==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:Ky(t),size:24,node:e,...n.length>0?{aliases:n}:{}}}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qy=t=>{let e="",n=!1;for(const i of t){if(i==="-"||i==="_"||i<=" "){n=e.length>0;continue}e.length===0?e+=i.toLowerCase():e+=n?i.toUpperCase():i,n=!1}return e};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jy=t=>{const e=Qy(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ku=(...t)=>t.filter((e,n,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function bc(t){return t!=null}function eS(t,e={}){var h,m;const n=e.attributeNames??{},i=x=>n[x]??x,r=t.size??t.width??cr.width,s=t.size??t.height??cr.height,a=((h=t.aliases)==null?void 0:h.filter(x=>typeof x=="string"&&x.trim()!=="").map(x=>`lucide-${x}`))??[],o=[...t.name?[`lucide-${t.name}`]:[],...a],l=((m=e.className)==null?void 0:m.split(" ").filter(Boolean))??[],c=e.includeDefaultClasses===!1?Ku(...l):Ku("lucide",...o,...l),f=e.absoluteStrokeWidth?Number(e.strokeWidth??cr["stroke-width"])*Number(t.size??t.width??cr.width)/Number(e.size??e.width??cr.width):e.strokeWidth??cr["stroke-width"];return["svg",{...Object.entries(cr).reduce((x,[_,g])=>(x[i(_)]=g,x),{}),..."color"in e&&e.color&&{[i("stroke")]:e.color},..."size"in e&&bc(e.size)&&{[i("width")]:e.size,[i("height")]:e.size},..."width"in e&&bc(e.width)&&{[i("width")]:e.width},..."height"in e&&bc(e.height)&&{[i("height")]:e.height},[i("stroke-width")]:f,...c&&{[i("class")]:c},[i("viewBox")]:`0 0 ${r} ${s}`,...e.hasA11yProp===!1?{[i("aria-hidden")]:"true"}:{},..."attributes"in e&&e.attributes},t.node.map(x=>{const[_,g,u]=x,v=e.nonScalingStroke?{[i("vector-effect")]:"non-scaling-stroke",...g}:g;return u?[_,v,u]:[_,v]})]}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function tS(t,e={}){return eS(t,{...e,attributeNames:{...e.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nS=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},iS=q.createContext({}),rS=()=>q.useContext(iS),sS=q.forwardRef(({color:t,size:e,width:n,height:i,strokeWidth:r,absoluteStrokeWidth:s,nonScalingStroke:a,className:o="",children:l,iconNode:c=[],icon:f={node:c,aliases:[],size:24},...p},h)=>{const{size:m=24,strokeWidth:x=2,absoluteStrokeWidth:_=!1,nonScalingStroke:g=!1,color:u="currentColor",className:v=""}=rS()??{},y=!!l||nS(p),[S,N,A=[]]=tS(f,{color:t??u,width:n??e??m,height:i??e??m,strokeWidth:r??x,absoluteStrokeWidth:s??_,nonScalingStroke:a??g,className:Ku(v,o),hasA11yProp:y,attributes:p});return q.createElement(S,{ref:h,...N},[...A.map(([w,R])=>q.createElement(w,R)),...Array.isArray(l)?l:[l]])});/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function Ie(t,e=[],n=[]){const i=typeof t=="string"?Zy(t,e,n):t,r=q.forwardRef(({className:s,...a},o)=>q.createElement(sS,{ref:o,icon:i,className:s,...a}));return i.name&&(r.displayName=Jy(i.name)),r}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nx={name:"arrow-right",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]};Nx.node;const Px=Ie(Nx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lx={name:"bot",size:24,node:[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]};Lx.node;const Dx=Ie(Lx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ix={name:"brain",size:24,node:[["path",{d:"M12 18V5",key:"adv99a"}],["path",{d:"M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",key:"1e3is1"}],["path",{d:"M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",key:"1gqd8o"}],["path",{d:"M17.997 5.125a4 4 0 0 1 2.526 5.77",key:"iwvgf7"}],["path",{d:"M18 18a4 4 0 0 0 2-7.464",key:"efp6ie"}],["path",{d:"M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",key:"1gq6am"}],["path",{d:"M6 18a4 4 0 0 1-2-7.464",key:"k1g0md"}],["path",{d:"M6.003 5.125a4 4 0 0 0-2.526 5.77",key:"q97ue3"}]]};Ix.node;const Ux=Ie(Ix);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kx={name:"calendar",size:24,node:[["path",{d:"M8 2v3",key:"1ioesn"}],["path",{d:"M16 2v3",key:"otl347"}],["rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",key:"h1oib"}],["path",{d:"M3 9h18",key:"1pudct"}]]};kx.node;const Fr=Ie(kx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ox={name:"chevron-down",size:24,node:[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]};Ox.node;const Fx=Ie(Ox);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zx={name:"chevron-right",size:24,node:[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]};zx.node;const ya=Ie(zx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bx={name:"circle-check",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 9-5.5 5.5L8 12",key:"xofnsj"}]],aliases:["check-circle-2"]};Bx.node;const bn=Ie(Bx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jx={name:"circle-x",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],aliases:["x-circle"]};jx.node;const Zu=Ie(jx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vx={name:"clock",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]]};Vx.node;const Ga=Ie(Vx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hx={name:"code",size:24,node:[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]]};Hx.node;const Gx=Ie(Hx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wx={name:"cpu",size:24,node:[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]]};Wx.node;const zf=Ie(Wx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xx={name:"database",size:24,node:[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]};Xx.node;const aS=Ie(Xx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $x={name:"external-link",size:24,node:[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]};$x.node;const oS=Ie($x);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qx={name:"globe",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]};qx.node;const Qu=Ie(qx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yx={name:"house",size:24,node:[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],aliases:["home"]};Yx.node;const Kx=Ie(Yx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zx={name:"info",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]};Zx.node;const lS=Ie(Zx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qx={name:"layers",size:24,node:[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],aliases:["layers-3"]};Qx.node;const cS=Ie(Qx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jx={name:"link-2",size:24,node:[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]};Jx.node;const e0=Ie(Jx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t0={name:"lock",size:24,node:[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]};t0.node;const n0=Ie(t0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i0={name:"mail",size:24,node:[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]};i0.node;const uS=Ie(i0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r0={name:"mic-off",size:24,node:[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M15 9.34V5a3 3 0 0 0-5.68-1.33",key:"1gzdoj"}],["path",{d:"M16.95 16.95A7 7 0 0 1 5 12v-2",key:"cqa7eg"}],["path",{d:"M18.89 13.23A7 7 0 0 0 19 12v-2",key:"16hl24"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M9 9v3a3 3 0 0 0 5.12 2.12",key:"r2i35w"}]]};r0.node;const s0=Ie(r0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a0={name:"mic",size:24,node:[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]]};a0.node;const o0=Ie(a0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l0={name:"moon",size:24,node:[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]]};l0.node;const dS=Ie(l0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c0={name:"octagon-alert",size:24,node:[["path",{d:"M12 16h.01",key:"1drbdi"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",key:"1fd625"}]],aliases:["alert-octagon"]};c0.node;const fS=Ie(c0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u0={name:"pause",size:24,node:[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]]};u0.node;const hS=Ie(u0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d0={name:"play",size:24,node:[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]};d0.node;const f0=Ie(d0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h0={name:"plus",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]};h0.node;const p0=Ie(h0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m0={name:"refresh-cw",size:24,node:[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]};m0.node;const Xn=Ie(m0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g0={name:"search",size:24,node:[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]};g0.node;const zs=Ie(g0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x0={name:"send",size:24,node:[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]};x0.node;const v0=Ie(x0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _0={name:"shield-alert",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]};_0.node;const $l=Ie(_0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y0={name:"shield-check",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]};y0.node;const S0=Ie(y0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M0={name:"sparkles",size:24,node:[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],aliases:["stars"]};M0.node;const xi=Ie(M0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E0={name:"square-check-big",size:24,node:[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],aliases:["check-square"]};E0.node;const w0=Ie(E0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T0={name:"square",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]};T0.node;const pS=Ie(T0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b0={name:"sun",size:24,node:[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]};b0.node;const mS=Ie(b0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A0={name:"terminal",size:24,node:[["path",{d:"M12 19h8",key:"baeox8"}],["path",{d:"m4 17 6-6-6-6",key:"1yngyt"}]]};A0.node;const gS=Ie(A0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C0={name:"trash",size:24,node:[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],aliases:["trash-2"]};C0.node;const xS=Ie(C0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R0={name:"triangle-alert",size:24,node:[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],aliases:["alert-triangle"]};R0.node;const Ju=Ie(R0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N0={name:"volume-2",size:24,node:[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]};N0.node;const vS=Ie(N0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P0={name:"x",size:24,node:[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]};P0.node;const Bf=Ie(P0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L0={name:"zap",size:24,node:[["path",{d:"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",key:"1v7up4"}]]};L0.node;const _S=Ie(L0);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jf="170",yS=0,pp=1,SS=2,D0=1,MS=2,di=3,ir=0,an=1,pi=2,Ji=0,ys=1,ed=2,mp=3,gp=4,ES=5,yr=100,wS=101,TS=102,bS=103,AS=104,CS=200,RS=201,NS=202,PS=203,td=204,nd=205,LS=206,DS=207,IS=208,US=209,kS=210,OS=211,FS=212,zS=213,BS=214,id=0,rd=1,sd=2,Ns=3,ad=4,od=5,ld=6,cd=7,I0=0,jS=1,VS=2,er=0,HS=1,GS=2,WS=3,XS=4,$S=5,qS=6,YS=7,U0=300,Ps=301,Ls=302,ud=303,dd=304,ql=306,fd=1e3,Tr=1001,hd=1002,Gn=1003,KS=1004,vo=1005,Qn=1006,Ac=1007,br=1008,bi=1009,k0=1010,O0=1011,Fa=1012,Vf=1013,Ir=1014,vi=1015,Wa=1016,Hf=1017,Gf=1018,Ds=1020,F0=35902,z0=1021,B0=1022,jn=1023,j0=1024,V0=1025,Ss=1026,Is=1027,H0=1028,Wf=1029,G0=1030,Xf=1031,$f=1033,Jo=33776,el=33777,tl=33778,nl=33779,pd=35840,md=35841,gd=35842,xd=35843,vd=36196,_d=37492,yd=37496,Sd=37808,Md=37809,Ed=37810,wd=37811,Td=37812,bd=37813,Ad=37814,Cd=37815,Rd=37816,Nd=37817,Pd=37818,Ld=37819,Dd=37820,Id=37821,il=36492,Ud=36494,kd=36495,W0=36283,Od=36284,Fd=36285,zd=36286,ZS=3200,QS=3201,JS=0,e1=1,Vi="",Sn="srgb",Bs="srgb-linear",Yl="linear",st="srgb",jr=7680,xp=519,t1=512,n1=513,i1=514,X0=515,r1=516,s1=517,a1=518,o1=519,vp=35044,_p="300 es",_i=2e3,Rl=2001;class js{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Cc=Math.PI/180,Bd=180/Math.PI;function Xa(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Vt[t&255]+Vt[t>>8&255]+Vt[t>>16&255]+Vt[t>>24&255]+"-"+Vt[e&255]+Vt[e>>8&255]+"-"+Vt[e>>16&15|64]+Vt[e>>24&255]+"-"+Vt[n&63|128]+Vt[n>>8&255]+"-"+Vt[n>>16&255]+Vt[n>>24&255]+Vt[i&255]+Vt[i>>8&255]+Vt[i>>16&255]+Vt[i>>24&255]).toLowerCase()}function en(t,e,n){return Math.max(e,Math.min(n,t))}function l1(t,e){return(t%e+e)%e}function Rc(t,e,n){return(1-n)*t+n*e}function Js(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function Qt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}class at{constructor(e=0,n=0){at.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(en(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Oe{constructor(e,n,i,r,s,a,o,l,c){Oe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c)}set(e,n,i,r,s,a,o,l,c){const f=this.elements;return f[0]=e,f[1]=r,f[2]=o,f[3]=n,f[4]=s,f[5]=l,f[6]=i,f[7]=a,f[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],f=i[4],p=i[7],h=i[2],m=i[5],x=i[8],_=r[0],g=r[3],u=r[6],v=r[1],y=r[4],S=r[7],N=r[2],A=r[5],w=r[8];return s[0]=a*_+o*v+l*N,s[3]=a*g+o*y+l*A,s[6]=a*u+o*S+l*w,s[1]=c*_+f*v+p*N,s[4]=c*g+f*y+p*A,s[7]=c*u+f*S+p*w,s[2]=h*_+m*v+x*N,s[5]=h*g+m*y+x*A,s[8]=h*u+m*S+x*w,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8];return n*a*f-n*o*c-i*s*f+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8],p=f*a-o*c,h=o*l-f*s,m=c*s-a*l,x=n*p+i*h+r*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=p*_,e[1]=(r*c-f*i)*_,e[2]=(o*i-r*a)*_,e[3]=h*_,e[4]=(f*n-r*l)*_,e[5]=(r*s-o*n)*_,e[6]=m*_,e[7]=(i*l-c*n)*_,e[8]=(a*n-i*s)*_,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(Nc.makeScale(e,n)),this}rotate(e){return this.premultiply(Nc.makeRotation(-e)),this}translate(e,n){return this.premultiply(Nc.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Nc=new Oe;function $0(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Nl(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function c1(){const t=Nl("canvas");return t.style.display="block",t}const yp={};function la(t){t in yp||(yp[t]=!0,console.warn(t))}function u1(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function d1(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function f1(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ye={enabled:!0,workingColorSpace:Bs,spaces:{},convert:function(t,e,n){return this.enabled===!1||e===n||!e||!n||(this.spaces[e].transfer===st&&(t.r=Si(t.r),t.g=Si(t.g),t.b=Si(t.b)),this.spaces[e].primaries!==this.spaces[n].primaries&&(t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===st&&(t.r=Ms(t.r),t.g=Ms(t.g),t.b=Ms(t.b))),t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===Vi?Yl:this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function Si(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Ms(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const Sp=[.64,.33,.3,.6,.15,.06],Mp=[.2126,.7152,.0722],Ep=[.3127,.329],wp=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tp=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ye.define({[Bs]:{primaries:Sp,whitePoint:Ep,transfer:Yl,toXYZ:wp,fromXYZ:Tp,luminanceCoefficients:Mp,workingColorSpaceConfig:{unpackColorSpace:Sn},outputColorSpaceConfig:{drawingBufferColorSpace:Sn}},[Sn]:{primaries:Sp,whitePoint:Ep,transfer:st,toXYZ:wp,fromXYZ:Tp,luminanceCoefficients:Mp,outputColorSpaceConfig:{drawingBufferColorSpace:Sn}}});let Vr;class h1{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Vr===void 0&&(Vr=Nl("canvas")),Vr.width=e.width,Vr.height=e.height;const i=Vr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Vr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Nl("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Si(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Si(n[i]/255)*255):n[i]=Si(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let p1=0;class q0{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:p1++}),this.uuid=Xa(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Pc(r[a].image)):s.push(Pc(r[a]))}else s=Pc(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Pc(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?h1.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let m1=0;class on extends js{constructor(e=on.DEFAULT_IMAGE,n=on.DEFAULT_MAPPING,i=Tr,r=Tr,s=Qn,a=br,o=jn,l=bi,c=on.DEFAULT_ANISOTROPY,f=Vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:m1++}),this.uuid=Xa(),this.name="",this.source=new q0(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new at(0,0),this.repeat=new at(1,1),this.center=new at(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==U0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fd:e.x=e.x-Math.floor(e.x);break;case Tr:e.x=e.x<0?0:1;break;case hd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case fd:e.y=e.y-Math.floor(e.y);break;case Tr:e.y=e.y<0?0:1;break;case hd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}on.DEFAULT_IMAGE=null;on.DEFAULT_MAPPING=U0;on.DEFAULT_ANISOTROPY=1;class Mt{constructor(e=0,n=0,i=0,r=1){Mt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],f=l[4],p=l[8],h=l[1],m=l[5],x=l[9],_=l[2],g=l[6],u=l[10];if(Math.abs(f-h)<.01&&Math.abs(p-_)<.01&&Math.abs(x-g)<.01){if(Math.abs(f+h)<.1&&Math.abs(p+_)<.1&&Math.abs(x+g)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const y=(c+1)/2,S=(m+1)/2,N=(u+1)/2,A=(f+h)/4,w=(p+_)/4,R=(x+g)/4;return y>S&&y>N?y<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(y),r=A/i,s=w/i):S>N?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=A/r,s=R/r):N<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(N),i=w/s,r=R/s),this.set(i,r,s,n),this}let v=Math.sqrt((g-x)*(g-x)+(p-_)*(p-_)+(h-f)*(h-f));return Math.abs(v)<.001&&(v=1),this.x=(g-x)/v,this.y=(p-_)/v,this.z=(h-f)/v,this.w=Math.acos((c+m+u-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class g1 extends js{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new Mt(0,0,e,n),this.scissorTest=!1,this.viewport=new Mt(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new on(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new q0(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ur extends g1{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class Y0 extends on{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=Tr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class x1 extends on{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=Tr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $a{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],f=i[r+2],p=i[r+3];const h=s[a+0],m=s[a+1],x=s[a+2],_=s[a+3];if(o===0){e[n+0]=l,e[n+1]=c,e[n+2]=f,e[n+3]=p;return}if(o===1){e[n+0]=h,e[n+1]=m,e[n+2]=x,e[n+3]=_;return}if(p!==_||l!==h||c!==m||f!==x){let g=1-o;const u=l*h+c*m+f*x+p*_,v=u>=0?1:-1,y=1-u*u;if(y>Number.EPSILON){const N=Math.sqrt(y),A=Math.atan2(N,u*v);g=Math.sin(g*A)/N,o=Math.sin(o*A)/N}const S=o*v;if(l=l*g+h*S,c=c*g+m*S,f=f*g+x*S,p=p*g+_*S,g===1-o){const N=1/Math.sqrt(l*l+c*c+f*f+p*p);l*=N,c*=N,f*=N,p*=N}}e[n]=l,e[n+1]=c,e[n+2]=f,e[n+3]=p}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],f=i[r+3],p=s[a],h=s[a+1],m=s[a+2],x=s[a+3];return e[n]=o*x+f*p+l*m-c*h,e[n+1]=l*x+f*h+c*p-o*m,e[n+2]=c*x+f*m+o*h-l*p,e[n+3]=f*x-o*p-l*h-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),f=o(r/2),p=o(s/2),h=l(i/2),m=l(r/2),x=l(s/2);switch(a){case"XYZ":this._x=h*f*p+c*m*x,this._y=c*m*p-h*f*x,this._z=c*f*x+h*m*p,this._w=c*f*p-h*m*x;break;case"YXZ":this._x=h*f*p+c*m*x,this._y=c*m*p-h*f*x,this._z=c*f*x-h*m*p,this._w=c*f*p+h*m*x;break;case"ZXY":this._x=h*f*p-c*m*x,this._y=c*m*p+h*f*x,this._z=c*f*x+h*m*p,this._w=c*f*p-h*m*x;break;case"ZYX":this._x=h*f*p-c*m*x,this._y=c*m*p+h*f*x,this._z=c*f*x-h*m*p,this._w=c*f*p+h*m*x;break;case"YZX":this._x=h*f*p+c*m*x,this._y=c*m*p+h*f*x,this._z=c*f*x-h*m*p,this._w=c*f*p-h*m*x;break;case"XZY":this._x=h*f*p-c*m*x,this._y=c*m*p-h*f*x,this._z=c*f*x+h*m*p,this._w=c*f*p+h*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],f=n[6],p=n[10],h=i+o+p;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(f-l)*m,this._y=(s-c)*m,this._z=(a-r)*m}else if(i>o&&i>p){const m=2*Math.sqrt(1+i-o-p);this._w=(f-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+c)/m}else if(o>p){const m=2*Math.sqrt(1+o-i-p);this._w=(s-c)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+f)/m}else{const m=2*Math.sqrt(1+p-i-o);this._w=(a-r)/m,this._x=(s+c)/m,this._y=(l+f)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(en(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,c=n._z,f=n._w;return this._x=i*f+a*o+r*c-s*l,this._y=r*f+a*l+s*o-i*c,this._z=s*f+a*c+i*l-r*o,this._w=a*f-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-n;return this._w=m*a+n*this._w,this._x=m*i+n*this._x,this._y=m*r+n*this._y,this._z=m*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),f=Math.atan2(c,o),p=Math.sin((1-n)*f)/c,h=Math.sin(n*f)/c;return this._w=a*p+this._w*h,this._x=i*p+this._x*h,this._y=r*p+this._y*h,this._z=s*p+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class V{constructor(e=0,n=0,i=0){V.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(bp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(bp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),f=2*(o*n-s*r),p=2*(s*i-a*n);return this.x=n+l*c+a*p-o*f,this.y=i+l*f+o*c-s*p,this.z=r+l*p+s*f-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Lc.copy(this).projectOnVector(e),this.sub(Lc)}reflect(e){return this.sub(Lc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(en(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Lc=new V,bp=new $a;class qa{constructor(e=new V(1/0,1/0,1/0),n=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(In.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(In.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=In.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,In):In.fromBufferAttribute(s,a),In.applyMatrix4(e.matrixWorld),this.expandByPoint(In);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_o.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),_o.copy(i.boundingBox)),_o.applyMatrix4(e.matrixWorld),this.union(_o)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,In),In.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ea),yo.subVectors(this.max,ea),Hr.subVectors(e.a,ea),Gr.subVectors(e.b,ea),Wr.subVectors(e.c,ea),Li.subVectors(Gr,Hr),Di.subVectors(Wr,Gr),ur.subVectors(Hr,Wr);let n=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-ur.z,ur.y,Li.z,0,-Li.x,Di.z,0,-Di.x,ur.z,0,-ur.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-ur.y,ur.x,0];return!Dc(n,Hr,Gr,Wr,yo)||(n=[1,0,0,0,1,0,0,0,1],!Dc(n,Hr,Gr,Wr,yo))?!1:(So.crossVectors(Li,Di),n=[So.x,So.y,So.z],Dc(n,Hr,Gr,Wr,yo))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,In).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(In).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ai[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ai[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ai[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ai[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ai[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ai[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ai[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ai[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ai),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ai=[new V,new V,new V,new V,new V,new V,new V,new V],In=new V,_o=new qa,Hr=new V,Gr=new V,Wr=new V,Li=new V,Di=new V,ur=new V,ea=new V,yo=new V,So=new V,dr=new V;function Dc(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){dr.fromArray(t,s);const o=r.x*Math.abs(dr.x)+r.y*Math.abs(dr.y)+r.z*Math.abs(dr.z),l=e.dot(dr),c=n.dot(dr),f=i.dot(dr);if(Math.max(-Math.max(l,c,f),Math.min(l,c,f))>o)return!1}return!0}const v1=new qa,ta=new V,Ic=new V;class Kl{constructor(e=new V,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):v1.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ta.subVectors(e,this.center);const n=ta.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ta,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ic.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ta.copy(e.center).add(Ic)),this.expandByPoint(ta.copy(e.center).sub(Ic))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const oi=new V,Uc=new V,Mo=new V,Ii=new V,kc=new V,Eo=new V,Oc=new V;class K0{constructor(e=new V,n=new V(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,oi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=oi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(oi.copy(this.origin).addScaledVector(this.direction,n),oi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Uc.copy(e).add(n).multiplyScalar(.5),Mo.copy(n).sub(e).normalize(),Ii.copy(this.origin).sub(Uc);const s=e.distanceTo(n)*.5,a=-this.direction.dot(Mo),o=Ii.dot(this.direction),l=-Ii.dot(Mo),c=Ii.lengthSq(),f=Math.abs(1-a*a);let p,h,m,x;if(f>0)if(p=a*l-o,h=a*o-l,x=s*f,p>=0)if(h>=-x)if(h<=x){const _=1/f;p*=_,h*=_,m=p*(p+a*h+2*o)+h*(a*p+h+2*l)+c}else h=s,p=Math.max(0,-(a*h+o)),m=-p*p+h*(h+2*l)+c;else h=-s,p=Math.max(0,-(a*h+o)),m=-p*p+h*(h+2*l)+c;else h<=-x?(p=Math.max(0,-(-a*s+o)),h=p>0?-s:Math.min(Math.max(-s,-l),s),m=-p*p+h*(h+2*l)+c):h<=x?(p=0,h=Math.min(Math.max(-s,-l),s),m=h*(h+2*l)+c):(p=Math.max(0,-(a*s+o)),h=p>0?s:Math.min(Math.max(-s,-l),s),m=-p*p+h*(h+2*l)+c);else h=a>0?-s:s,p=Math.max(0,-(a*h+o)),m=-p*p+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,p),r&&r.copy(Uc).addScaledVector(Mo,h),m}intersectSphere(e,n){oi.subVectors(e.center,this.origin);const i=oi.dot(this.direction),r=oi.dot(oi)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const c=1/this.direction.x,f=1/this.direction.y,p=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),f>=0?(s=(e.min.y-h.y)*f,a=(e.max.y-h.y)*f):(s=(e.max.y-h.y)*f,a=(e.min.y-h.y)*f),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),p>=0?(o=(e.min.z-h.z)*p,l=(e.max.z-h.z)*p):(o=(e.max.z-h.z)*p,l=(e.min.z-h.z)*p),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,oi)!==null}intersectTriangle(e,n,i,r,s){kc.subVectors(n,e),Eo.subVectors(i,e),Oc.crossVectors(kc,Eo);let a=this.direction.dot(Oc),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ii.subVectors(this.origin,e);const l=o*this.direction.dot(Eo.crossVectors(Ii,Eo));if(l<0)return null;const c=o*this.direction.dot(kc.cross(Ii));if(c<0||l+c>a)return null;const f=-o*Ii.dot(Oc);return f<0?null:this.at(f/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Et{constructor(e,n,i,r,s,a,o,l,c,f,p,h,m,x,_,g){Et.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c,f,p,h,m,x,_,g)}set(e,n,i,r,s,a,o,l,c,f,p,h,m,x,_,g){const u=this.elements;return u[0]=e,u[4]=n,u[8]=i,u[12]=r,u[1]=s,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=f,u[10]=p,u[14]=h,u[3]=m,u[7]=x,u[11]=_,u[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Et().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/Xr.setFromMatrixColumn(e,0).length(),s=1/Xr.setFromMatrixColumn(e,1).length(),a=1/Xr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),f=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){const h=a*f,m=a*p,x=o*f,_=o*p;n[0]=l*f,n[4]=-l*p,n[8]=c,n[1]=m+x*c,n[5]=h-_*c,n[9]=-o*l,n[2]=_-h*c,n[6]=x+m*c,n[10]=a*l}else if(e.order==="YXZ"){const h=l*f,m=l*p,x=c*f,_=c*p;n[0]=h+_*o,n[4]=x*o-m,n[8]=a*c,n[1]=a*p,n[5]=a*f,n[9]=-o,n[2]=m*o-x,n[6]=_+h*o,n[10]=a*l}else if(e.order==="ZXY"){const h=l*f,m=l*p,x=c*f,_=c*p;n[0]=h-_*o,n[4]=-a*p,n[8]=x+m*o,n[1]=m+x*o,n[5]=a*f,n[9]=_-h*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const h=a*f,m=a*p,x=o*f,_=o*p;n[0]=l*f,n[4]=x*c-m,n[8]=h*c+_,n[1]=l*p,n[5]=_*c+h,n[9]=m*c-x,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const h=a*l,m=a*c,x=o*l,_=o*c;n[0]=l*f,n[4]=_-h*p,n[8]=x*p+m,n[1]=p,n[5]=a*f,n[9]=-o*f,n[2]=-c*f,n[6]=m*p+x,n[10]=h-_*p}else if(e.order==="XZY"){const h=a*l,m=a*c,x=o*l,_=o*c;n[0]=l*f,n[4]=-p,n[8]=c*f,n[1]=h*p+_,n[5]=a*f,n[9]=m*p-x,n[2]=x*p-m,n[6]=o*f,n[10]=_*p+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(_1,e,y1)}lookAt(e,n,i){const r=this.elements;return dn.subVectors(e,n),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),Ui.crossVectors(i,dn),Ui.lengthSq()===0&&(Math.abs(i.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),Ui.crossVectors(i,dn)),Ui.normalize(),wo.crossVectors(dn,Ui),r[0]=Ui.x,r[4]=wo.x,r[8]=dn.x,r[1]=Ui.y,r[5]=wo.y,r[9]=dn.y,r[2]=Ui.z,r[6]=wo.z,r[10]=dn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],f=i[1],p=i[5],h=i[9],m=i[13],x=i[2],_=i[6],g=i[10],u=i[14],v=i[3],y=i[7],S=i[11],N=i[15],A=r[0],w=r[4],R=r[8],b=r[12],M=r[1],P=r[5],G=r[9],O=r[13],Y=r[2],X=r[6],$=r[10],ee=r[14],L=r[3],K=r[7],Q=r[11],ce=r[15];return s[0]=a*A+o*M+l*Y+c*L,s[4]=a*w+o*P+l*X+c*K,s[8]=a*R+o*G+l*$+c*Q,s[12]=a*b+o*O+l*ee+c*ce,s[1]=f*A+p*M+h*Y+m*L,s[5]=f*w+p*P+h*X+m*K,s[9]=f*R+p*G+h*$+m*Q,s[13]=f*b+p*O+h*ee+m*ce,s[2]=x*A+_*M+g*Y+u*L,s[6]=x*w+_*P+g*X+u*K,s[10]=x*R+_*G+g*$+u*Q,s[14]=x*b+_*O+g*ee+u*ce,s[3]=v*A+y*M+S*Y+N*L,s[7]=v*w+y*P+S*X+N*K,s[11]=v*R+y*G+S*$+N*Q,s[15]=v*b+y*O+S*ee+N*ce,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],f=e[2],p=e[6],h=e[10],m=e[14],x=e[3],_=e[7],g=e[11],u=e[15];return x*(+s*l*p-r*c*p-s*o*h+i*c*h+r*o*m-i*l*m)+_*(+n*l*m-n*c*h+s*a*h-r*a*m+r*c*f-s*l*f)+g*(+n*c*p-n*o*m-s*a*p+i*a*m+s*o*f-i*c*f)+u*(-r*o*f-n*l*p+n*o*h+r*a*p-i*a*h+i*l*f)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],f=e[8],p=e[9],h=e[10],m=e[11],x=e[12],_=e[13],g=e[14],u=e[15],v=p*g*c-_*h*c+_*l*m-o*g*m-p*l*u+o*h*u,y=x*h*c-f*g*c-x*l*m+a*g*m+f*l*u-a*h*u,S=f*_*c-x*p*c+x*o*m-a*_*m-f*o*u+a*p*u,N=x*p*l-f*_*l-x*o*h+a*_*h+f*o*g-a*p*g,A=n*v+i*y+r*S+s*N;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/A;return e[0]=v*w,e[1]=(_*h*s-p*g*s-_*r*m+i*g*m+p*r*u-i*h*u)*w,e[2]=(o*g*s-_*l*s+_*r*c-i*g*c-o*r*u+i*l*u)*w,e[3]=(p*l*s-o*h*s-p*r*c+i*h*c+o*r*m-i*l*m)*w,e[4]=y*w,e[5]=(f*g*s-x*h*s+x*r*m-n*g*m-f*r*u+n*h*u)*w,e[6]=(x*l*s-a*g*s-x*r*c+n*g*c+a*r*u-n*l*u)*w,e[7]=(a*h*s-f*l*s+f*r*c-n*h*c-a*r*m+n*l*m)*w,e[8]=S*w,e[9]=(x*p*s-f*_*s-x*i*m+n*_*m+f*i*u-n*p*u)*w,e[10]=(a*_*s-x*o*s+x*i*c-n*_*c-a*i*u+n*o*u)*w,e[11]=(f*o*s-a*p*s-f*i*c+n*p*c+a*i*m-n*o*m)*w,e[12]=N*w,e[13]=(f*_*r-x*p*r+x*i*h-n*_*h-f*i*g+n*p*g)*w,e[14]=(x*o*r-a*_*r-x*i*l+n*_*l+a*i*g-n*o*g)*w,e[15]=(a*p*r-f*o*r+f*i*l-n*p*l-a*i*h+n*o*h)*w,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,f=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,f*o+i,f*l-r*a,0,c*l-r*o,f*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,f=a+a,p=o+o,h=s*c,m=s*f,x=s*p,_=a*f,g=a*p,u=o*p,v=l*c,y=l*f,S=l*p,N=i.x,A=i.y,w=i.z;return r[0]=(1-(_+u))*N,r[1]=(m+S)*N,r[2]=(x-y)*N,r[3]=0,r[4]=(m-S)*A,r[5]=(1-(h+u))*A,r[6]=(g+v)*A,r[7]=0,r[8]=(x+y)*w,r[9]=(g-v)*w,r[10]=(1-(h+_))*w,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=Xr.set(r[0],r[1],r[2]).length();const a=Xr.set(r[4],r[5],r[6]).length(),o=Xr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Un.copy(this);const c=1/s,f=1/a,p=1/o;return Un.elements[0]*=c,Un.elements[1]*=c,Un.elements[2]*=c,Un.elements[4]*=f,Un.elements[5]*=f,Un.elements[6]*=f,Un.elements[8]*=p,Un.elements[9]*=p,Un.elements[10]*=p,n.setFromRotationMatrix(Un),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=_i){const l=this.elements,c=2*s/(n-e),f=2*s/(i-r),p=(n+e)/(n-e),h=(i+r)/(i-r);let m,x;if(o===_i)m=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===Rl)m=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=p,l[12]=0,l[1]=0,l[5]=f,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=_i){const l=this.elements,c=1/(n-e),f=1/(i-r),p=1/(a-s),h=(n+e)*c,m=(i+r)*f;let x,_;if(o===_i)x=(a+s)*p,_=-2*p;else if(o===Rl)x=s*p,_=-1*p;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*f,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const Xr=new V,Un=new Et,_1=new V(0,0,0),y1=new V(1,1,1),Ui=new V,wo=new V,dn=new V,Ap=new Et,Cp=new $a;class Ai{constructor(e=0,n=0,i=0,r=Ai.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],f=r[9],p=r[2],h=r[6],m=r[10];switch(n){case"XYZ":this._y=Math.asin(en(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-f,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-en(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(en(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-en(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(en(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,c),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-en(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-f,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Ap.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ap,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Cp.setFromEuler(this),this.setFromQuaternion(Cp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ai.DEFAULT_ORDER="XYZ";class Z0{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let S1=0;const Rp=new V,$r=new $a,li=new Et,To=new V,na=new V,M1=new V,E1=new $a,Np=new V(1,0,0),Pp=new V(0,1,0),Lp=new V(0,0,1),Dp={type:"added"},w1={type:"removed"},qr={type:"childadded",child:null},Fc={type:"childremoved",child:null};class ln extends js{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:S1++}),this.uuid=Xa(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ln.DEFAULT_UP.clone();const e=new V,n=new Ai,i=new $a,r=new V(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Et},normalMatrix:{value:new Oe}}),this.matrix=new Et,this.matrixWorld=new Et,this.matrixAutoUpdate=ln.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Z0,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return $r.setFromAxisAngle(e,n),this.quaternion.multiply($r),this}rotateOnWorldAxis(e,n){return $r.setFromAxisAngle(e,n),this.quaternion.premultiply($r),this}rotateX(e){return this.rotateOnAxis(Np,e)}rotateY(e){return this.rotateOnAxis(Pp,e)}rotateZ(e){return this.rotateOnAxis(Lp,e)}translateOnAxis(e,n){return Rp.copy(e).applyQuaternion(this.quaternion),this.position.add(Rp.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Np,e)}translateY(e){return this.translateOnAxis(Pp,e)}translateZ(e){return this.translateOnAxis(Lp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(li.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?To.copy(e):To.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),na.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?li.lookAt(na,To,this.up):li.lookAt(To,na,this.up),this.quaternion.setFromRotationMatrix(li),r&&(li.extractRotation(r.matrixWorld),$r.setFromRotationMatrix(li),this.quaternion.premultiply($r.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Dp),qr.child=e,this.dispatchEvent(qr),qr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(w1),Fc.child=e,this.dispatchEvent(Fc),Fc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),li.multiply(e.parent.matrixWorld)),e.applyMatrix4(li),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Dp),qr.child=e,this.dispatchEvent(qr),qr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,e,M1),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,E1,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,f=l.length;c<f;c++){const p=l[c];s(e.shapes,p)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),f=a(e.images),p=a(e.shapes),h=a(e.skeletons),m=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),f.length>0&&(i.images=f),p.length>0&&(i.shapes=p),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),x.length>0&&(i.nodes=x)}return i.object=r,i;function a(o){const l=[];for(const c in o){const f=o[c];delete f.metadata,l.push(f)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}ln.DEFAULT_UP=new V(0,1,0);ln.DEFAULT_MATRIX_AUTO_UPDATE=!0;ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const kn=new V,ci=new V,zc=new V,ui=new V,Yr=new V,Kr=new V,Ip=new V,Bc=new V,jc=new V,Vc=new V,Hc=new Mt,Gc=new Mt,Wc=new Mt;class Bn{constructor(e=new V,n=new V,i=new V){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),kn.subVectors(e,n),r.cross(kn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){kn.subVectors(r,n),ci.subVectors(i,n),zc.subVectors(e,n);const a=kn.dot(kn),o=kn.dot(ci),l=kn.dot(zc),c=ci.dot(ci),f=ci.dot(zc),p=a*c-o*o;if(p===0)return s.set(0,0,0),null;const h=1/p,m=(c*l-o*f)*h,x=(a*f-o*l)*h;return s.set(1-m-x,x,m)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,ui)===null?!1:ui.x>=0&&ui.y>=0&&ui.x+ui.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,ui)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ui.x),l.addScaledVector(a,ui.y),l.addScaledVector(o,ui.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return Hc.setScalar(0),Gc.setScalar(0),Wc.setScalar(0),Hc.fromBufferAttribute(e,n),Gc.fromBufferAttribute(e,i),Wc.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Hc,s.x),a.addScaledVector(Gc,s.y),a.addScaledVector(Wc,s.z),a}static isFrontFacing(e,n,i,r){return kn.subVectors(i,n),ci.subVectors(e,n),kn.cross(ci).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kn.subVectors(this.c,this.b),ci.subVectors(this.a,this.b),kn.cross(ci).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Bn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Bn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Bn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Bn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Bn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;Yr.subVectors(r,i),Kr.subVectors(s,i),Bc.subVectors(e,i);const l=Yr.dot(Bc),c=Kr.dot(Bc);if(l<=0&&c<=0)return n.copy(i);jc.subVectors(e,r);const f=Yr.dot(jc),p=Kr.dot(jc);if(f>=0&&p<=f)return n.copy(r);const h=l*p-f*c;if(h<=0&&l>=0&&f<=0)return a=l/(l-f),n.copy(i).addScaledVector(Yr,a);Vc.subVectors(e,s);const m=Yr.dot(Vc),x=Kr.dot(Vc);if(x>=0&&m<=x)return n.copy(s);const _=m*c-l*x;if(_<=0&&c>=0&&x<=0)return o=c/(c-x),n.copy(i).addScaledVector(Kr,o);const g=f*x-m*p;if(g<=0&&p-f>=0&&m-x>=0)return Ip.subVectors(s,r),o=(p-f)/(p-f+(m-x)),n.copy(r).addScaledVector(Ip,o);const u=1/(g+_+h);return a=_*u,o=h*u,n.copy(i).addScaledVector(Yr,a).addScaledVector(Kr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Q0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ki={h:0,s:0,l:0},bo={h:0,s:0,l:0};function Xc(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Ve{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Sn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=Ye.workingColorSpace){return this.r=e,this.g=n,this.b=i,Ye.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=Ye.workingColorSpace){if(e=l1(e,1),n=en(n,0,1),i=en(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=Xc(a,s,e+1/3),this.g=Xc(a,s,e),this.b=Xc(a,s,e-1/3)}return Ye.toWorkingColorSpace(this,r),this}setStyle(e,n=Sn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Sn){const i=Q0[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Si(e.r),this.g=Si(e.g),this.b=Si(e.b),this}copyLinearToSRGB(e){return this.r=Ms(e.r),this.g=Ms(e.g),this.b=Ms(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Sn){return Ye.fromWorkingColorSpace(Ht.copy(this),e),Math.round(en(Ht.r*255,0,255))*65536+Math.round(en(Ht.g*255,0,255))*256+Math.round(en(Ht.b*255,0,255))}getHexString(e=Sn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Ye.workingColorSpace){Ye.fromWorkingColorSpace(Ht.copy(this),n);const i=Ht.r,r=Ht.g,s=Ht.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const f=(o+a)/2;if(o===a)l=0,c=0;else{const p=a-o;switch(c=f<=.5?p/(a+o):p/(2-a-o),a){case i:l=(r-s)/p+(r<s?6:0);break;case r:l=(s-i)/p+2;break;case s:l=(i-r)/p+4;break}l/=6}return e.h=l,e.s=c,e.l=f,e}getRGB(e,n=Ye.workingColorSpace){return Ye.fromWorkingColorSpace(Ht.copy(this),n),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=Sn){Ye.fromWorkingColorSpace(Ht.copy(this),e);const n=Ht.r,i=Ht.g,r=Ht.b;return e!==Sn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(ki),this.setHSL(ki.h+e,ki.s+n,ki.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(ki),e.getHSL(bo);const i=Rc(ki.h,bo.h,n),r=Rc(ki.s,bo.s,n),s=Rc(ki.l,bo.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new Ve;Ve.NAMES=Q0;let T1=0;class Ya extends js{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:T1++}),this.uuid=Xa(),this.name="",this.blending=ys,this.side=ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=td,this.blendDst=nd,this.blendEquation=yr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ve(0,0,0),this.blendAlpha=0,this.depthFunc=Ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jr,this.stencilZFail=jr,this.stencilZPass=jr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ys&&(i.blending=this.blending),this.side!==ir&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==td&&(i.blendSrc=this.blendSrc),this.blendDst!==nd&&(i.blendDst=this.blendDst),this.blendEquation!==yr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ns&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==jr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==jr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class qf extends Ya{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.combine=I0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const wt=new V,Ao=new at;class Cn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=vp,this.updateRanges=[],this.gpuType=vi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Ao.fromBufferAttribute(this,n),Ao.applyMatrix3(e),this.setXY(n,Ao.x,Ao.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)wt.fromBufferAttribute(this,n),wt.applyMatrix3(e),this.setXYZ(n,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)wt.fromBufferAttribute(this,n),wt.applyMatrix4(e),this.setXYZ(n,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)wt.fromBufferAttribute(this,n),wt.applyNormalMatrix(e),this.setXYZ(n,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)wt.fromBufferAttribute(this,n),wt.transformDirection(e),this.setXYZ(n,wt.x,wt.y,wt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Js(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Qt(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Js(n,this.array)),n}setX(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Js(n,this.array)),n}setY(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Js(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Js(n,this.array)),n}setW(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Qt(n,this.array),i=Qt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=Qt(n,this.array),i=Qt(i,this.array),r=Qt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=Qt(n,this.array),i=Qt(i,this.array),r=Qt(r,this.array),s=Qt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vp&&(e.usage=this.usage),e}}class J0 extends Cn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class ev extends Cn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class ni extends Cn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let b1=0;const yn=new Et,$c=new ln,Zr=new V,fn=new qa,ia=new qa,Lt=new V;class ii extends js{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:b1++}),this.uuid=Xa(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new($0(e)?ev:J0)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Oe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return yn.makeRotationFromQuaternion(e),this.applyMatrix4(yn),this}rotateX(e){return yn.makeRotationX(e),this.applyMatrix4(yn),this}rotateY(e){return yn.makeRotationY(e),this.applyMatrix4(yn),this}rotateZ(e){return yn.makeRotationZ(e),this.applyMatrix4(yn),this}translate(e,n,i){return yn.makeTranslation(e,n,i),this.applyMatrix4(yn),this}scale(e,n,i){return yn.makeScale(e,n,i),this.applyMatrix4(yn),this}lookAt(e){return $c.lookAt(e),$c.updateMatrix(),this.applyMatrix4($c.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zr).negate(),this.translate(Zr.x,Zr.y,Zr.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ni(i,3))}else{for(let i=0,r=n.count;i<r;i++){const s=e[i];n.setXYZ(i,s.x,s.y,s.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qa);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];fn.setFromBufferAttribute(s),this.morphTargetsRelative?(Lt.addVectors(this.boundingBox.min,fn.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,fn.max),this.boundingBox.expandByPoint(Lt)):(this.boundingBox.expandByPoint(fn.min),this.boundingBox.expandByPoint(fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Kl);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){const i=this.boundingSphere.center;if(fn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];ia.setFromBufferAttribute(o),this.morphTargetsRelative?(Lt.addVectors(fn.min,ia.min),fn.expandByPoint(Lt),Lt.addVectors(fn.max,ia.max),fn.expandByPoint(Lt)):(fn.expandByPoint(ia.min),fn.expandByPoint(ia.max))}fn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Lt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Lt));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,f=o.count;c<f;c++)Lt.fromBufferAttribute(o,c),l&&(Zr.fromBufferAttribute(e,c),Lt.add(Zr)),r=Math.max(r,i.distanceToSquared(Lt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Cn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<i.count;R++)o[R]=new V,l[R]=new V;const c=new V,f=new V,p=new V,h=new at,m=new at,x=new at,_=new V,g=new V;function u(R,b,M){c.fromBufferAttribute(i,R),f.fromBufferAttribute(i,b),p.fromBufferAttribute(i,M),h.fromBufferAttribute(s,R),m.fromBufferAttribute(s,b),x.fromBufferAttribute(s,M),f.sub(c),p.sub(c),m.sub(h),x.sub(h);const P=1/(m.x*x.y-x.x*m.y);isFinite(P)&&(_.copy(f).multiplyScalar(x.y).addScaledVector(p,-m.y).multiplyScalar(P),g.copy(p).multiplyScalar(m.x).addScaledVector(f,-x.x).multiplyScalar(P),o[R].add(_),o[b].add(_),o[M].add(_),l[R].add(g),l[b].add(g),l[M].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,b=v.length;R<b;++R){const M=v[R],P=M.start,G=M.count;for(let O=P,Y=P+G;O<Y;O+=3)u(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const y=new V,S=new V,N=new V,A=new V;function w(R){N.fromBufferAttribute(r,R),A.copy(N);const b=o[R];y.copy(b),y.sub(N.multiplyScalar(N.dot(b))).normalize(),S.crossVectors(A,b);const P=S.dot(l[R])<0?-1:1;a.setXYZW(R,y.x,y.y,y.z,P)}for(let R=0,b=v.length;R<b;++R){const M=v[R],P=M.start,G=M.count;for(let O=P,Y=P+G;O<Y;O+=3)w(e.getX(O+0)),w(e.getX(O+1)),w(e.getX(O+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Cn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const r=new V,s=new V,a=new V,o=new V,l=new V,c=new V,f=new V,p=new V;if(e)for(let h=0,m=e.count;h<m;h+=3){const x=e.getX(h+0),_=e.getX(h+1),g=e.getX(h+2);r.fromBufferAttribute(n,x),s.fromBufferAttribute(n,_),a.fromBufferAttribute(n,g),f.subVectors(a,s),p.subVectors(r,s),f.cross(p),o.fromBufferAttribute(i,x),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),o.add(f),l.add(f),c.add(f),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,m=n.count;h<m;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),a.fromBufferAttribute(n,h+2),f.subVectors(a,s),p.subVectors(r,s),f.cross(p),i.setXYZ(h+0,f.x,f.y,f.z),i.setXYZ(h+1,f.x,f.y,f.z),i.setXYZ(h+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Lt.fromBufferAttribute(e,n),Lt.normalize(),e.setXYZ(n,Lt.x,Lt.y,Lt.z)}toNonIndexed(){function e(o,l){const c=o.array,f=o.itemSize,p=o.normalized,h=new c.constructor(l.length*f);let m=0,x=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*f;for(let u=0;u<f;u++)h[x++]=c[m++]}return new Cn(h,f,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new ii,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let f=0,p=c.length;f<p;f++){const h=c[f],m=e(h,i);l.push(m)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],f=[];for(let p=0,h=c.length;p<h;p++){const m=c[p];f.push(m.toJSON(e.data))}f.length>0&&(r[l]=f,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const f=r[c];this.setAttribute(c,f.clone(n))}const s=e.morphAttributes;for(const c in s){const f=[],p=s[c];for(let h=0,m=p.length;h<m;h++)f.push(p[h].clone(n));this.morphAttributes[c]=f}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,f=a.length;c<f;c++){const p=a[c];this.addGroup(p.start,p.count,p.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Up=new Et,fr=new K0,Co=new Kl,kp=new V,Ro=new V,No=new V,Po=new V,qc=new V,Lo=new V,Op=new V,Do=new V;class Jn extends ln{constructor(e=new ii,n=new qf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Lo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const f=o[l],p=s[l];f!==0&&(qc.fromBufferAttribute(p,e),a?Lo.addScaledVector(qc,f):Lo.addScaledVector(qc.sub(n),f))}n.add(Lo)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Co.copy(i.boundingSphere),Co.applyMatrix4(s),fr.copy(e.ray).recast(e.near),!(Co.containsPoint(fr.origin)===!1&&(fr.intersectSphere(Co,kp)===null||fr.origin.distanceToSquared(kp)>(e.far-e.near)**2))&&(Up.copy(s).invert(),fr.copy(e.ray).applyMatrix4(Up),!(i.boundingBox!==null&&fr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,fr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,f=s.attributes.uv1,p=s.attributes.normal,h=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,_=h.length;x<_;x++){const g=h[x],u=a[g.materialIndex],v=Math.max(g.start,m.start),y=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let S=v,N=y;S<N;S+=3){const A=o.getX(S),w=o.getX(S+1),R=o.getX(S+2);r=Io(this,u,e,i,c,f,p,A,w,R),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const x=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let g=x,u=_;g<u;g+=3){const v=o.getX(g),y=o.getX(g+1),S=o.getX(g+2);r=Io(this,a,e,i,c,f,p,v,y,S),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,_=h.length;x<_;x++){const g=h[x],u=a[g.materialIndex],v=Math.max(g.start,m.start),y=Math.min(l.count,Math.min(g.start+g.count,m.start+m.count));for(let S=v,N=y;S<N;S+=3){const A=S,w=S+1,R=S+2;r=Io(this,u,e,i,c,f,p,A,w,R),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const x=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let g=x,u=_;g<u;g+=3){const v=g,y=g+1,S=g+2;r=Io(this,a,e,i,c,f,p,v,y,S),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}}}function A1(t,e,n,i,r,s,a,o){let l;if(e.side===an?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===ir,o),l===null)return null;Do.copy(o),Do.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(Do);return c<n.near||c>n.far?null:{distance:c,point:Do.clone(),object:t}}function Io(t,e,n,i,r,s,a,o,l,c){t.getVertexPosition(o,Ro),t.getVertexPosition(l,No),t.getVertexPosition(c,Po);const f=A1(t,e,n,i,Ro,No,Po,Op);if(f){const p=new V;Bn.getBarycoord(Op,Ro,No,Po,p),r&&(f.uv=Bn.getInterpolatedAttribute(r,o,l,c,p,new at)),s&&(f.uv1=Bn.getInterpolatedAttribute(s,o,l,c,p,new at)),a&&(f.normal=Bn.getInterpolatedAttribute(a,o,l,c,p,new V),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new V,materialIndex:0};Bn.getNormal(Ro,No,Po,h.normal),f.face=h,f.barycoord=p}return f}class Ka extends ii{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],f=[],p=[];let h=0,m=0;x("z","y","x",-1,-1,i,n,e,a,s,0),x("z","y","x",1,-1,i,n,-e,a,s,1),x("x","z","y",1,1,e,i,n,r,a,2),x("x","z","y",1,-1,e,i,-n,r,a,3),x("x","y","z",1,-1,e,n,i,r,s,4),x("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new ni(c,3)),this.setAttribute("normal",new ni(f,3)),this.setAttribute("uv",new ni(p,2));function x(_,g,u,v,y,S,N,A,w,R,b){const M=S/w,P=N/R,G=S/2,O=N/2,Y=A/2,X=w+1,$=R+1;let ee=0,L=0;const K=new V;for(let Q=0;Q<$;Q++){const ce=Q*P-O;for(let z=0;z<X;z++){const re=z*M-G;K[_]=re*v,K[g]=ce*y,K[u]=Y,c.push(K.x,K.y,K.z),K[_]=0,K[g]=0,K[u]=A>0?1:-1,f.push(K.x,K.y,K.z),p.push(z/w),p.push(1-Q/R),ee+=1}}for(let Q=0;Q<R;Q++)for(let ce=0;ce<w;ce++){const z=h+ce+X*Q,re=h+ce+X*(Q+1),H=h+(ce+1)+X*(Q+1),ne=h+(ce+1)+X*Q;l.push(z,re,ne),l.push(re,H,ne),L+=6}o.addGroup(m,L,b),m+=L,h+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ka(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Us(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Xt(t){const e={};for(let n=0;n<t.length;n++){const i=Us(t[n]);for(const r in i)e[r]=i[r]}return e}function C1(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function tv(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const R1={clone:Us,merge:Xt};var N1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,P1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class rr extends Ya{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=N1,this.fragmentShader=P1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Us(e.uniforms),this.uniformsGroups=C1(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class nv extends ln{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Et,this.projectionMatrix=new Et,this.projectionMatrixInverse=new Et,this.coordinateSystem=_i}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Oi=new V,Fp=new at,zp=new at;class wn extends nv{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Bd*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Cc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Bd*2*Math.atan(Math.tan(Cc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Oi.x,Oi.y).multiplyScalar(-e/Oi.z),Oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Oi.x,Oi.y).multiplyScalar(-e/Oi.z)}getViewSize(e,n){return this.getViewBounds(e,Fp,zp),n.subVectors(zp,Fp)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Cc*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Qr=-90,Jr=1;class L1 extends ln{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new wn(Qr,Jr,e,n);r.layers=this.layers,this.add(r);const s=new wn(Qr,Jr,e,n);s.layers=this.layers,this.add(s);const a=new wn(Qr,Jr,e,n);a.layers=this.layers,this.add(a);const o=new wn(Qr,Jr,e,n);o.layers=this.layers,this.add(o);const l=new wn(Qr,Jr,e,n);l.layers=this.layers,this.add(l);const c=new wn(Qr,Jr,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(e===_i)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Rl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,f]=this.children,p=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(n,f),e.setRenderTarget(p,h,m),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class iv extends on{constructor(e,n,i,r,s,a,o,l,c,f){e=e!==void 0?e:[],n=n!==void 0?n:Ps,super(e,n,i,r,s,a,o,l,c,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class D1 extends Ur{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new iv(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Qn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ka(5,5,5),s=new rr({name:"CubemapFromEquirect",uniforms:Us(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:an,blending:Ji});s.uniforms.tEquirect.value=n;const a=new Jn(r,s),o=n.minFilter;return n.minFilter===br&&(n.minFilter=Qn),new L1(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const Yc=new V,I1=new V,U1=new Oe;class vr{constructor(e=new V(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Yc.subVectors(i,n).cross(I1.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Yc),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||U1.getNormalMatrix(e),r=this.coplanarPoint(Yc).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const hr=new Kl,Uo=new V;class rv{constructor(e=new vr,n=new vr,i=new vr,r=new vr,s=new vr,a=new vr){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=_i){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],f=r[5],p=r[6],h=r[7],m=r[8],x=r[9],_=r[10],g=r[11],u=r[12],v=r[13],y=r[14],S=r[15];if(i[0].setComponents(l-s,h-c,g-m,S-u).normalize(),i[1].setComponents(l+s,h+c,g+m,S+u).normalize(),i[2].setComponents(l+a,h+f,g+x,S+v).normalize(),i[3].setComponents(l-a,h-f,g-x,S-v).normalize(),i[4].setComponents(l-o,h-p,g-_,S-y).normalize(),n===_i)i[5].setComponents(l+o,h+p,g+_,S+y).normalize();else if(n===Rl)i[5].setComponents(o,p,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),hr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),hr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(hr)}intersectsSprite(e){return hr.center.set(0,0,0),hr.radius=.7071067811865476,hr.applyMatrix4(e.matrixWorld),this.intersectsSphere(hr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Uo.x=r.normal.x>0?e.max.x:e.min.x,Uo.y=r.normal.y>0?e.max.y:e.min.y,Uo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Uo)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function sv(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function k1(t){const e=new WeakMap;function n(o,l){const c=o.array,f=o.usage,p=c.byteLength,h=t.createBuffer();t.bindBuffer(l,h),t.bufferData(l,c,f),o.onUploadCallback();let m;if(c instanceof Float32Array)m=t.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=t.HALF_FLOAT:m=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=t.SHORT;else if(c instanceof Uint32Array)m=t.UNSIGNED_INT;else if(c instanceof Int32Array)m=t.INT;else if(c instanceof Int8Array)m=t.BYTE;else if(c instanceof Uint8Array)m=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function i(o,l,c){const f=l.array,p=l.updateRanges;if(t.bindBuffer(c,o),p.length===0)t.bufferSubData(c,0,f);else{p.sort((m,x)=>m.start-x.start);let h=0;for(let m=1;m<p.length;m++){const x=p[h],_=p[m];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++h,p[h]=_)}p.length=h+1;for(let m=0,x=p.length;m<x;m++){const _=p[m];t.bufferSubData(c,_.start*f.BYTES_PER_ELEMENT,f,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const f=e.get(o);(!f||f.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class Zl extends ii{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,f=l+1,p=e/o,h=n/l,m=[],x=[],_=[],g=[];for(let u=0;u<f;u++){const v=u*h-a;for(let y=0;y<c;y++){const S=y*p-s;x.push(S,-v,0),_.push(0,0,1),g.push(y/o),g.push(1-u/l)}}for(let u=0;u<l;u++)for(let v=0;v<o;v++){const y=v+c*u,S=v+c*(u+1),N=v+1+c*(u+1),A=v+1+c*u;m.push(y,S,A),m.push(S,N,A)}this.setIndex(m),this.setAttribute("position",new ni(x,3)),this.setAttribute("normal",new ni(_,3)),this.setAttribute("uv",new ni(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zl(e.width,e.height,e.widthSegments,e.heightSegments)}}var O1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,F1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,z1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,B1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,j1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,V1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,H1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,G1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,W1=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,X1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,q1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Y1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,K1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Z1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Q1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,J1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,eM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,iM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,rM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,sM=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,aM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,oM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,lM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,cM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,uM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,dM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,hM="gl_FragColor = linearToOutputTexel( gl_FragColor );",pM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,gM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,xM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,vM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_M=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,yM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,SM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,MM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,EM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,TM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,AM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,CM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,RM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,NM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,PM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,LM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,DM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,IM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,UM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,kM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,OM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,FM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,zM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,BM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jM=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,VM=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,HM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,GM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,WM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,XM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$M=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,qM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,YM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,KM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ZM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,QM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,JM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,eE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,tE=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,nE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,iE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rE=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,sE=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,aE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,oE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,uE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,dE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,fE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,mE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,xE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,vE=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,_E=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,yE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,SE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ME=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,EE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,wE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,TE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,bE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,AE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,CE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,RE=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,NE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,PE=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,LE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,DE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,IE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,UE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const kE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,OE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,FE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,BE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,VE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,HE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,GE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,WE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,XE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,$E=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,YE=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,KE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ZE=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,QE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,JE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ew=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,tw=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nw=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,iw=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,rw=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sw=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,aw=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ow=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lw=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cw=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uw=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,dw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,fw=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hw=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,pw=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,je={alphahash_fragment:O1,alphahash_pars_fragment:F1,alphamap_fragment:z1,alphamap_pars_fragment:B1,alphatest_fragment:j1,alphatest_pars_fragment:V1,aomap_fragment:H1,aomap_pars_fragment:G1,batching_pars_vertex:W1,batching_vertex:X1,begin_vertex:$1,beginnormal_vertex:q1,bsdfs:Y1,iridescence_fragment:K1,bumpmap_pars_fragment:Z1,clipping_planes_fragment:Q1,clipping_planes_pars_fragment:J1,clipping_planes_pars_vertex:eM,clipping_planes_vertex:tM,color_fragment:nM,color_pars_fragment:iM,color_pars_vertex:rM,color_vertex:sM,common:aM,cube_uv_reflection_fragment:oM,defaultnormal_vertex:lM,displacementmap_pars_vertex:cM,displacementmap_vertex:uM,emissivemap_fragment:dM,emissivemap_pars_fragment:fM,colorspace_fragment:hM,colorspace_pars_fragment:pM,envmap_fragment:mM,envmap_common_pars_fragment:gM,envmap_pars_fragment:xM,envmap_pars_vertex:vM,envmap_physical_pars_fragment:RM,envmap_vertex:_M,fog_vertex:yM,fog_pars_vertex:SM,fog_fragment:MM,fog_pars_fragment:EM,gradientmap_pars_fragment:wM,lightmap_pars_fragment:TM,lights_lambert_fragment:bM,lights_lambert_pars_fragment:AM,lights_pars_begin:CM,lights_toon_fragment:NM,lights_toon_pars_fragment:PM,lights_phong_fragment:LM,lights_phong_pars_fragment:DM,lights_physical_fragment:IM,lights_physical_pars_fragment:UM,lights_fragment_begin:kM,lights_fragment_maps:OM,lights_fragment_end:FM,logdepthbuf_fragment:zM,logdepthbuf_pars_fragment:BM,logdepthbuf_pars_vertex:jM,logdepthbuf_vertex:VM,map_fragment:HM,map_pars_fragment:GM,map_particle_fragment:WM,map_particle_pars_fragment:XM,metalnessmap_fragment:$M,metalnessmap_pars_fragment:qM,morphinstance_vertex:YM,morphcolor_vertex:KM,morphnormal_vertex:ZM,morphtarget_pars_vertex:QM,morphtarget_vertex:JM,normal_fragment_begin:eE,normal_fragment_maps:tE,normal_pars_fragment:nE,normal_pars_vertex:iE,normal_vertex:rE,normalmap_pars_fragment:sE,clearcoat_normal_fragment_begin:aE,clearcoat_normal_fragment_maps:oE,clearcoat_pars_fragment:lE,iridescence_pars_fragment:cE,opaque_fragment:uE,packing:dE,premultiplied_alpha_fragment:fE,project_vertex:hE,dithering_fragment:pE,dithering_pars_fragment:mE,roughnessmap_fragment:gE,roughnessmap_pars_fragment:xE,shadowmap_pars_fragment:vE,shadowmap_pars_vertex:_E,shadowmap_vertex:yE,shadowmask_pars_fragment:SE,skinbase_vertex:ME,skinning_pars_vertex:EE,skinning_vertex:wE,skinnormal_vertex:TE,specularmap_fragment:bE,specularmap_pars_fragment:AE,tonemapping_fragment:CE,tonemapping_pars_fragment:RE,transmission_fragment:NE,transmission_pars_fragment:PE,uv_pars_fragment:LE,uv_pars_vertex:DE,uv_vertex:IE,worldpos_vertex:UE,background_vert:kE,background_frag:OE,backgroundCube_vert:FE,backgroundCube_frag:zE,cube_vert:BE,cube_frag:jE,depth_vert:VE,depth_frag:HE,distanceRGBA_vert:GE,distanceRGBA_frag:WE,equirect_vert:XE,equirect_frag:$E,linedashed_vert:qE,linedashed_frag:YE,meshbasic_vert:KE,meshbasic_frag:ZE,meshlambert_vert:QE,meshlambert_frag:JE,meshmatcap_vert:ew,meshmatcap_frag:tw,meshnormal_vert:nw,meshnormal_frag:iw,meshphong_vert:rw,meshphong_frag:sw,meshphysical_vert:aw,meshphysical_frag:ow,meshtoon_vert:lw,meshtoon_frag:cw,points_vert:uw,points_frag:dw,shadow_vert:fw,shadow_frag:hw,sprite_vert:pw,sprite_frag:mw},de={common:{diffuse:{value:new Ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new at(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new Ve(16777215)},opacity:{value:1},center:{value:new at(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},Kn={basic:{uniforms:Xt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:Xt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ve(0)}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:Xt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ve(0)},specular:{value:new Ve(1118481)},shininess:{value:30}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:Xt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new Ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:Xt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new Ve(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:Xt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:Xt([de.points,de.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:Xt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:Xt([de.common,de.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:Xt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:Xt([de.sprite,de.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distanceRGBA:{uniforms:Xt([de.common,de.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distanceRGBA_vert,fragmentShader:je.distanceRGBA_frag},shadow:{uniforms:Xt([de.lights,de.fog,{color:{value:new Ve(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};Kn.physical={uniforms:Xt([Kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new at(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new Ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new at},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new Ve(0)},specularColor:{value:new Ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new at},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const ko={r:0,b:0,g:0},pr=new Ai,gw=new Et;function xw(t,e,n,i,r,s,a){const o=new Ve(0);let l=s===!0?0:1,c,f,p=null,h=0,m=null;function x(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?n:e).get(y)),y}function _(v){let y=!1;const S=x(v);S===null?u(o,l):S&&S.isColor&&(u(S,1),y=!0);const N=t.xr.getEnvironmentBlendMode();N==="additive"?i.buffers.color.setClear(0,0,0,1,a):N==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function g(v,y){const S=x(y);S&&(S.isCubeTexture||S.mapping===ql)?(f===void 0&&(f=new Jn(new Ka(1,1,1),new rr({name:"BackgroundCubeMaterial",uniforms:Us(Kn.backgroundCube.uniforms),vertexShader:Kn.backgroundCube.vertexShader,fragmentShader:Kn.backgroundCube.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(N,A,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(f)),pr.copy(y.backgroundRotation),pr.x*=-1,pr.y*=-1,pr.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(pr.y*=-1,pr.z*=-1),f.material.uniforms.envMap.value=S,f.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(gw.makeRotationFromEuler(pr)),f.material.toneMapped=Ye.getTransfer(S.colorSpace)!==st,(p!==S||h!==S.version||m!==t.toneMapping)&&(f.material.needsUpdate=!0,p=S,h=S.version,m=t.toneMapping),f.layers.enableAll(),v.unshift(f,f.geometry,f.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Jn(new Zl(2,2),new rr({name:"BackgroundMaterial",uniforms:Us(Kn.background.uniforms),vertexShader:Kn.background.vertexShader,fragmentShader:Kn.background.fragmentShader,side:ir,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Ye.getTransfer(S.colorSpace)!==st,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(p!==S||h!==S.version||m!==t.toneMapping)&&(c.material.needsUpdate=!0,p=S,h=S.version,m=t.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function u(v,y){v.getRGB(ko,tv(t)),i.buffers.color.setClear(ko.r,ko.g,ko.b,y,a)}return{getClearColor:function(){return o},setClearColor:function(v,y=1){o.set(v),l=y,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,u(o,l)},render:_,addToRenderList:g}}function vw(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,a=!1;function o(M,P,G,O,Y){let X=!1;const $=p(O,G,P);s!==$&&(s=$,c(s.object)),X=m(M,O,G,Y),X&&x(M,O,G,Y),Y!==null&&e.update(Y,t.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,S(M,P,G,O),Y!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return t.createVertexArray()}function c(M){return t.bindVertexArray(M)}function f(M){return t.deleteVertexArray(M)}function p(M,P,G){const O=G.wireframe===!0;let Y=i[M.id];Y===void 0&&(Y={},i[M.id]=Y);let X=Y[P.id];X===void 0&&(X={},Y[P.id]=X);let $=X[O];return $===void 0&&($=h(l()),X[O]=$),$}function h(M){const P=[],G=[],O=[];for(let Y=0;Y<n;Y++)P[Y]=0,G[Y]=0,O[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:G,attributeDivisors:O,object:M,attributes:{},index:null}}function m(M,P,G,O){const Y=s.attributes,X=P.attributes;let $=0;const ee=G.getAttributes();for(const L in ee)if(ee[L].location>=0){const Q=Y[L];let ce=X[L];if(ce===void 0&&(L==="instanceMatrix"&&M.instanceMatrix&&(ce=M.instanceMatrix),L==="instanceColor"&&M.instanceColor&&(ce=M.instanceColor)),Q===void 0||Q.attribute!==ce||ce&&Q.data!==ce.data)return!0;$++}return s.attributesNum!==$||s.index!==O}function x(M,P,G,O){const Y={},X=P.attributes;let $=0;const ee=G.getAttributes();for(const L in ee)if(ee[L].location>=0){let Q=X[L];Q===void 0&&(L==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),L==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor));const ce={};ce.attribute=Q,Q&&Q.data&&(ce.data=Q.data),Y[L]=ce,$++}s.attributes=Y,s.attributesNum=$,s.index=O}function _(){const M=s.newAttributes;for(let P=0,G=M.length;P<G;P++)M[P]=0}function g(M){u(M,0)}function u(M,P){const G=s.newAttributes,O=s.enabledAttributes,Y=s.attributeDivisors;G[M]=1,O[M]===0&&(t.enableVertexAttribArray(M),O[M]=1),Y[M]!==P&&(t.vertexAttribDivisor(M,P),Y[M]=P)}function v(){const M=s.newAttributes,P=s.enabledAttributes;for(let G=0,O=P.length;G<O;G++)P[G]!==M[G]&&(t.disableVertexAttribArray(G),P[G]=0)}function y(M,P,G,O,Y,X,$){$===!0?t.vertexAttribIPointer(M,P,G,Y,X):t.vertexAttribPointer(M,P,G,O,Y,X)}function S(M,P,G,O){_();const Y=O.attributes,X=G.getAttributes(),$=P.defaultAttributeValues;for(const ee in X){const L=X[ee];if(L.location>=0){let K=Y[ee];if(K===void 0&&(ee==="instanceMatrix"&&M.instanceMatrix&&(K=M.instanceMatrix),ee==="instanceColor"&&M.instanceColor&&(K=M.instanceColor)),K!==void 0){const Q=K.normalized,ce=K.itemSize,z=e.get(K);if(z===void 0)continue;const re=z.buffer,H=z.type,ne=z.bytesPerElement,ue=H===t.INT||H===t.UNSIGNED_INT||K.gpuType===Vf;if(K.isInterleavedBufferAttribute){const ie=K.data,ve=ie.stride,ge=K.offset;if(ie.isInstancedInterleavedBuffer){for(let Ce=0;Ce<L.locationSize;Ce++)u(L.location+Ce,ie.meshPerAttribute);M.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Ce=0;Ce<L.locationSize;Ce++)g(L.location+Ce);t.bindBuffer(t.ARRAY_BUFFER,re);for(let Ce=0;Ce<L.locationSize;Ce++)y(L.location+Ce,ce/L.locationSize,H,Q,ve*ne,(ge+ce/L.locationSize*Ce)*ne,ue)}else{if(K.isInstancedBufferAttribute){for(let ie=0;ie<L.locationSize;ie++)u(L.location+ie,K.meshPerAttribute);M.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ie=0;ie<L.locationSize;ie++)g(L.location+ie);t.bindBuffer(t.ARRAY_BUFFER,re);for(let ie=0;ie<L.locationSize;ie++)y(L.location+ie,ce/L.locationSize,H,Q,ce*ne,ce/L.locationSize*ie*ne,ue)}}else if($!==void 0){const Q=$[ee];if(Q!==void 0)switch(Q.length){case 2:t.vertexAttrib2fv(L.location,Q);break;case 3:t.vertexAttrib3fv(L.location,Q);break;case 4:t.vertexAttrib4fv(L.location,Q);break;default:t.vertexAttrib1fv(L.location,Q)}}}}v()}function N(){R();for(const M in i){const P=i[M];for(const G in P){const O=P[G];for(const Y in O)f(O[Y].object),delete O[Y];delete P[G]}delete i[M]}}function A(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const G in P){const O=P[G];for(const Y in O)f(O[Y].object),delete O[Y];delete P[G]}delete i[M.id]}function w(M){for(const P in i){const G=i[P];if(G[M.id]===void 0)continue;const O=G[M.id];for(const Y in O)f(O[Y].object),delete O[Y];delete G[M.id]}}function R(){b(),a=!0,s!==r&&(s=r,c(s.object))}function b(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:b,dispose:N,releaseStatesOfGeometry:A,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:g,disableUnusedAttributes:v}}function _w(t,e,n){let i;function r(c){i=c}function s(c,f){t.drawArrays(i,c,f),n.update(f,i,1)}function a(c,f,p){p!==0&&(t.drawArraysInstanced(i,c,f,p),n.update(f,i,p))}function o(c,f,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,f,0,p);let m=0;for(let x=0;x<p;x++)m+=f[x];n.update(m,i,1)}function l(c,f,p,h){if(p===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<c.length;x++)a(c[x],f[x],h[x]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,f,0,h,0,p);let x=0;for(let _=0;_<p;_++)x+=f[_]*h[_];n.update(x,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function yw(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(w){return!(w!==jn&&i.convert(w)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const R=w===Wa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==bi&&i.convert(w)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==vi&&!R)}function l(w){if(w==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const f=l(c);f!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",f,"instead."),c=f);const p=n.logarithmicDepthBuffer===!0,h=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),x=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),u=t.getParameter(t.MAX_VERTEX_ATTRIBS),v=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),y=t.getParameter(t.MAX_VARYING_VECTORS),S=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),N=x>0,A=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reverseDepthBuffer:h,maxTextures:m,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:g,maxAttributes:u,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:S,vertexTextures:N,maxSamples:A}}function Sw(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new vr,o=new Oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){const m=p.length!==0||h||i!==0||r;return r=h,i=p.length,m},this.beginShadows=function(){s=!0,f(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,h){n=f(p,h,0)},this.setState=function(p,h,m){const x=p.clippingPlanes,_=p.clipIntersection,g=p.clipShadows,u=t.get(p);if(!r||x===null||x.length===0||s&&!g)s?f(null):c();else{const v=s?0:i,y=v*4;let S=u.clippingState||null;l.value=S,S=f(x,h,y,m);for(let N=0;N!==y;++N)S[N]=n[N];u.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(p,h,m,x){const _=p!==null?p.length:0;let g=null;if(_!==0){if(g=l.value,x!==!0||g===null){const u=m+_*4,v=h.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<u)&&(g=new Float32Array(u));for(let y=0,S=m;y!==_;++y,S+=4)a.copy(p[y]).applyMatrix4(v,o),a.normal.toArray(g,S),g[S+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function Mw(t){let e=new WeakMap;function n(a,o){return o===ud?a.mapping=Ps:o===dd&&(a.mapping=Ls),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===ud||o===dd)if(e.has(a)){const l=e.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new D1(l.height);return c.fromEquirectangularTexture(t,a),e.set(a,c),a.addEventListener("dispose",r),n(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Ew extends nv{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=f*this.view.offsetY,l=o-f*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const hs=4,Bp=[.125,.215,.35,.446,.526,.582],Sr=20,Kc=new Ew,jp=new Ve;let Zc=null,Qc=0,Jc=0,eu=!1;const _r=(1+Math.sqrt(5))/2,es=1/_r,Vp=[new V(-_r,es,0),new V(_r,es,0),new V(-es,0,_r),new V(es,0,_r),new V(0,_r,-es),new V(0,_r,es),new V(-1,1,-1),new V(1,1,-1),new V(-1,1,1),new V(1,1,1)];class Hp{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){Zc=this._renderer.getRenderTarget(),Qc=this._renderer.getActiveCubeFace(),Jc=this._renderer.getActiveMipmapLevel(),eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Zc,Qc,Jc),this._renderer.xr.enabled=eu,e.scissorTest=!1,Oo(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Ps||e.mapping===Ls?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Zc=this._renderer.getRenderTarget(),Qc=this._renderer.getActiveCubeFace(),Jc=this._renderer.getActiveMipmapLevel(),eu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Qn,minFilter:Qn,generateMipmaps:!1,type:Wa,format:jn,colorSpace:Bs,depthBuffer:!1},r=Gp(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Gp(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ww(s)),this._blurMaterial=Tw(s,e,n)}return r}_compileMaterial(e){const n=new Jn(this._lodPlanes[0],e);this._renderer.compile(n,Kc)}_sceneToCubeUV(e,n,i,r){const o=new wn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],f=this._renderer,p=f.autoClear,h=f.toneMapping;f.getClearColor(jp),f.toneMapping=er,f.autoClear=!1;const m=new qf({name:"PMREM.Background",side:an,depthWrite:!1,depthTest:!1}),x=new Jn(new Ka,m);let _=!1;const g=e.background;g?g.isColor&&(m.color.copy(g),e.background=null,_=!0):(m.color.copy(jp),_=!0);for(let u=0;u<6;u++){const v=u%3;v===0?(o.up.set(0,l[u],0),o.lookAt(c[u],0,0)):v===1?(o.up.set(0,0,l[u]),o.lookAt(0,c[u],0)):(o.up.set(0,l[u],0),o.lookAt(0,0,c[u]));const y=this._cubeSize;Oo(r,v*y,u>2?y:0,y,y),f.setRenderTarget(r),_&&f.render(x,o),f.render(e,o)}x.geometry.dispose(),x.material.dispose(),f.toneMapping=h,f.autoClear=p,e.background=g}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Ps||e.mapping===Ls;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wp());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Jn(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Oo(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,Kc)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Vp[(r-s-1)%Vp.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const f=3,p=new Jn(this._lodPlanes[r],c),h=c.uniforms,m=this._sizeLods[i]-1,x=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Sr-1),_=s/x,g=isFinite(s)?1+Math.floor(f*_):Sr;g>Sr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Sr}`);const u=[];let v=0;for(let w=0;w<Sr;++w){const R=w/_,b=Math.exp(-R*R/2);u.push(b),w===0?v+=b:w<g&&(v+=2*b)}for(let w=0;w<u.length;w++)u[w]=u[w]/v;h.envMap.value=e.texture,h.samples.value=g,h.weights.value=u,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:y}=this;h.dTheta.value=x,h.mipInt.value=y-i;const S=this._sizeLods[r],N=3*S*(r>y-hs?r-y+hs:0),A=4*(this._cubeSize-S);Oo(n,N,A,3*S,2*S),l.setRenderTarget(n),l.render(p,Kc)}}function ww(t){const e=[],n=[],i=[];let r=t;const s=t-hs+1+Bp.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let l=1/o;a>t-hs?l=Bp[a-t+hs-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),f=-c,p=1+c,h=[f,f,p,f,p,p,f,f,p,p,f,p],m=6,x=6,_=3,g=2,u=1,v=new Float32Array(_*x*m),y=new Float32Array(g*x*m),S=new Float32Array(u*x*m);for(let A=0;A<m;A++){const w=A%3*2/3-1,R=A>2?0:-1,b=[w,R,0,w+2/3,R,0,w+2/3,R+1,0,w,R,0,w+2/3,R+1,0,w,R+1,0];v.set(b,_*x*A),y.set(h,g*x*A);const M=[A,A,A,A,A,A];S.set(M,u*x*A)}const N=new ii;N.setAttribute("position",new Cn(v,_)),N.setAttribute("uv",new Cn(y,g)),N.setAttribute("faceIndex",new Cn(S,u)),e.push(N),r>hs&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Gp(t,e,n){const i=new Ur(t,e,n);return i.texture.mapping=ql,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Oo(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function Tw(t,e,n){const i=new Float32Array(Sr),r=new V(0,1,0);return new rr({name:"SphericalGaussianBlur",defines:{n:Sr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Yf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Wp(){return new rr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Yf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Xp(){return new rr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Yf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Yf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function bw(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===ud||l===dd,f=l===Ps||l===Ls;if(c||f){let p=e.get(o);const h=p!==void 0?p.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return n===null&&(n=new Hp(t)),p=c?n.fromEquirectangular(o,p):n.fromCubemap(o,p),p.texture.pmremVersion=o.pmremVersion,e.set(o,p),p.texture;if(p!==void 0)return p.texture;{const m=o.image;return c&&m&&m.height>0||f&&m&&r(m)?(n===null&&(n=new Hp(t)),p=c?n.fromEquirectangular(o):n.fromCubemap(o),p.texture.pmremVersion=o.pmremVersion,e.set(o,p),o.addEventListener("dispose",s),p.texture):null}}}return o}function r(o){let l=0;const c=6;for(let f=0;f<c;f++)o[f]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function Aw(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&la("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Cw(t,e,n,i){const r={},s=new WeakMap;function a(p){const h=p.target;h.index!==null&&e.remove(h.index);for(const x in h.attributes)e.remove(h.attributes[x]);for(const x in h.morphAttributes){const _=h.morphAttributes[x];for(let g=0,u=_.length;g<u;g++)e.remove(_[g])}h.removeEventListener("dispose",a),delete r[h.id];const m=s.get(h);m&&(e.remove(m),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function o(p,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,n.memory.geometries++),h}function l(p){const h=p.attributes;for(const x in h)e.update(h[x],t.ARRAY_BUFFER);const m=p.morphAttributes;for(const x in m){const _=m[x];for(let g=0,u=_.length;g<u;g++)e.update(_[g],t.ARRAY_BUFFER)}}function c(p){const h=[],m=p.index,x=p.attributes.position;let _=0;if(m!==null){const v=m.array;_=m.version;for(let y=0,S=v.length;y<S;y+=3){const N=v[y+0],A=v[y+1],w=v[y+2];h.push(N,A,A,w,w,N)}}else if(x!==void 0){const v=x.array;_=x.version;for(let y=0,S=v.length/3-1;y<S;y+=3){const N=y+0,A=y+1,w=y+2;h.push(N,A,A,w,w,N)}}else return;const g=new($0(h)?ev:J0)(h,1);g.version=_;const u=s.get(p);u&&e.remove(u),s.set(p,g)}function f(p){const h=s.get(p);if(h){const m=p.index;m!==null&&h.version<m.version&&c(p)}else c(p);return s.get(p)}return{get:o,update:l,getWireframeAttribute:f}}function Rw(t,e,n){let i;function r(h){i=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,m){t.drawElements(i,m,s,h*a),n.update(m,i,1)}function c(h,m,x){x!==0&&(t.drawElementsInstanced(i,m,s,h*a,x),n.update(m,i,x))}function f(h,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,s,h,0,x);let g=0;for(let u=0;u<x;u++)g+=m[u];n.update(g,i,1)}function p(h,m,x,_){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let u=0;u<h.length;u++)c(h[u]/a,m[u],_[u]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,s,h,0,_,0,x);let u=0;for(let v=0;v<x;v++)u+=m[v]*_[v];n.update(u,i,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=f,this.renderMultiDrawInstances=p}function Nw(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function Pw(t,e,n){const i=new WeakMap,r=new Mt;function s(a,o,l){const c=a.morphTargetInfluences,f=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=f!==void 0?f.length:0;let h=i.get(o);if(h===void 0||h.count!==p){let M=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",M)};var m=M;h!==void 0&&h.texture.dispose();const x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let S=0;x===!0&&(S=1),_===!0&&(S=2),g===!0&&(S=3);let N=o.attributes.position.count*S,A=1;N>e.maxTextureSize&&(A=Math.ceil(N/e.maxTextureSize),N=e.maxTextureSize);const w=new Float32Array(N*A*4*p),R=new Y0(w,N,A,p);R.type=vi,R.needsUpdate=!0;const b=S*4;for(let P=0;P<p;P++){const G=u[P],O=v[P],Y=y[P],X=N*A*4*P;for(let $=0;$<G.count;$++){const ee=$*b;x===!0&&(r.fromBufferAttribute(G,$),w[X+ee+0]=r.x,w[X+ee+1]=r.y,w[X+ee+2]=r.z,w[X+ee+3]=0),_===!0&&(r.fromBufferAttribute(O,$),w[X+ee+4]=r.x,w[X+ee+5]=r.y,w[X+ee+6]=r.z,w[X+ee+7]=0),g===!0&&(r.fromBufferAttribute(Y,$),w[X+ee+8]=r.x,w[X+ee+9]=r.y,w[X+ee+10]=r.z,w[X+ee+11]=Y.itemSize===4?r.w:1)}}h={count:p,texture:R,size:new at(N,A)},i.set(o,h),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let x=0;for(let g=0;g<c.length;g++)x+=c[g];const _=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(t,"morphTargetBaseInfluence",_),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:s}}function Lw(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,f=l.geometry,p=e.get(l,f);if(r.get(p)!==c&&(e.update(p),r.set(p,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return p}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:a}}class av extends on{constructor(e,n,i,r,s,a,o,l,c,f=Ss){if(f!==Ss&&f!==Is)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&f===Ss&&(i=Ir),i===void 0&&f===Is&&(i=Ds),super(null,r,s,a,o,l,f,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:Gn,this.minFilter=l!==void 0?l:Gn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const ov=new on,$p=new av(1,1),lv=new Y0,cv=new x1,uv=new iv,qp=[],Yp=[],Kp=new Float32Array(16),Zp=new Float32Array(9),Qp=new Float32Array(4);function Vs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=qp[r];if(s===void 0&&(s=new Float32Array(r),qp[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Nt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Pt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Ql(t,e){let n=Yp[e];n===void 0&&(n=new Int32Array(e),Yp[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function Dw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function Iw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2fv(this.addr,e),Pt(n,e)}}function Uw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Nt(n,e))return;t.uniform3fv(this.addr,e),Pt(n,e)}}function kw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4fv(this.addr,e),Pt(n,e)}}function Ow(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Pt(n,e)}else{if(Nt(n,i))return;Qp.set(i),t.uniformMatrix2fv(this.addr,!1,Qp),Pt(n,i)}}function Fw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Pt(n,e)}else{if(Nt(n,i))return;Zp.set(i),t.uniformMatrix3fv(this.addr,!1,Zp),Pt(n,i)}}function zw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Pt(n,e)}else{if(Nt(n,i))return;Kp.set(i),t.uniformMatrix4fv(this.addr,!1,Kp),Pt(n,i)}}function Bw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function jw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2iv(this.addr,e),Pt(n,e)}}function Vw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Nt(n,e))return;t.uniform3iv(this.addr,e),Pt(n,e)}}function Hw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4iv(this.addr,e),Pt(n,e)}}function Gw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function Ww(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2uiv(this.addr,e),Pt(n,e)}}function Xw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Nt(n,e))return;t.uniform3uiv(this.addr,e),Pt(n,e)}}function $w(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4uiv(this.addr,e),Pt(n,e)}}function qw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?($p.compareFunction=X0,s=$p):s=ov,n.setTexture2D(e||s,r)}function Yw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||cv,r)}function Kw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||uv,r)}function Zw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||lv,r)}function Qw(t){switch(t){case 5126:return Dw;case 35664:return Iw;case 35665:return Uw;case 35666:return kw;case 35674:return Ow;case 35675:return Fw;case 35676:return zw;case 5124:case 35670:return Bw;case 35667:case 35671:return jw;case 35668:case 35672:return Vw;case 35669:case 35673:return Hw;case 5125:return Gw;case 36294:return Ww;case 36295:return Xw;case 36296:return $w;case 35678:case 36198:case 36298:case 36306:case 35682:return qw;case 35679:case 36299:case 36307:return Yw;case 35680:case 36300:case 36308:case 36293:return Kw;case 36289:case 36303:case 36311:case 36292:return Zw}}function Jw(t,e){t.uniform1fv(this.addr,e)}function eT(t,e){const n=Vs(e,this.size,2);t.uniform2fv(this.addr,n)}function tT(t,e){const n=Vs(e,this.size,3);t.uniform3fv(this.addr,n)}function nT(t,e){const n=Vs(e,this.size,4);t.uniform4fv(this.addr,n)}function iT(t,e){const n=Vs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function rT(t,e){const n=Vs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function sT(t,e){const n=Vs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function aT(t,e){t.uniform1iv(this.addr,e)}function oT(t,e){t.uniform2iv(this.addr,e)}function lT(t,e){t.uniform3iv(this.addr,e)}function cT(t,e){t.uniform4iv(this.addr,e)}function uT(t,e){t.uniform1uiv(this.addr,e)}function dT(t,e){t.uniform2uiv(this.addr,e)}function fT(t,e){t.uniform3uiv(this.addr,e)}function hT(t,e){t.uniform4uiv(this.addr,e)}function pT(t,e,n){const i=this.cache,r=e.length,s=Ql(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||ov,s[a])}function mT(t,e,n){const i=this.cache,r=e.length,s=Ql(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||cv,s[a])}function gT(t,e,n){const i=this.cache,r=e.length,s=Ql(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||uv,s[a])}function xT(t,e,n){const i=this.cache,r=e.length,s=Ql(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||lv,s[a])}function vT(t){switch(t){case 5126:return Jw;case 35664:return eT;case 35665:return tT;case 35666:return nT;case 35674:return iT;case 35675:return rT;case 35676:return sT;case 5124:case 35670:return aT;case 35667:case 35671:return oT;case 35668:case 35672:return lT;case 35669:case 35673:return cT;case 5125:return uT;case 36294:return dT;case 36295:return fT;case 36296:return hT;case 35678:case 36198:case 36298:case 36306:case 35682:return pT;case 35679:case 36299:case 36307:return mT;case 35680:case 36300:case 36308:case 36293:return gT;case 36289:case 36303:case 36311:case 36292:return xT}}class _T{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=Qw(n.type)}}class yT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=vT(n.type)}}class ST{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const tu=/(\w+)(\])?(\[|\.)?/g;function Jp(t,e){t.seq.push(e),t.map[e.id]=e}function MT(t,e,n){const i=t.name,r=i.length;for(tu.lastIndex=0;;){const s=tu.exec(i),a=tu.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Jp(n,c===void 0?new _T(o,t,e):new yT(o,t,e));break}else{let p=n.map[o];p===void 0&&(p=new ST(o),Jp(n,p)),n=p}}}class rl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);MT(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function em(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const ET=37297;let wT=0;function TT(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const tm=new Oe;function bT(t){Ye._getMatrix(tm,Ye.workingColorSpace,t);const e=`mat3( ${tm.elements.map(n=>n.toFixed(4))} )`;switch(Ye.getTransfer(t)){case Yl:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function nm(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+TT(t.getShaderSource(e),a)}else return r}function AT(t,e){const n=bT(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function CT(t,e){let n;switch(e){case HS:n="Linear";break;case GS:n="Reinhard";break;case WS:n="Cineon";break;case XS:n="ACESFilmic";break;case qS:n="AgX";break;case YS:n="Neutral";break;case $S:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Fo=new V;function RT(){Ye.getLuminanceCoefficients(Fo);const t=Fo.x.toFixed(4),e=Fo.y.toFixed(4),n=Fo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function NT(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ca).join(`
`)}function PT(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function LT(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function ca(t){return t!==""}function im(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function rm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const DT=/^[ \t]*#include +<([\w\d./]+)>/gm;function jd(t){return t.replace(DT,UT)}const IT=new Map;function UT(t,e){let n=je[e];if(n===void 0){const i=IT.get(e);if(i!==void 0)n=je[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return jd(n)}const kT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sm(t){return t.replace(kT,OT)}function OT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function am(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function FT(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===D0?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===MS?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===di&&(e="SHADOWMAP_TYPE_VSM"),e}function zT(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Ps:case Ls:e="ENVMAP_TYPE_CUBE";break;case ql:e="ENVMAP_TYPE_CUBE_UV";break}return e}function BT(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Ls:e="ENVMAP_MODE_REFRACTION";break}return e}function jT(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case I0:e="ENVMAP_BLENDING_MULTIPLY";break;case jS:e="ENVMAP_BLENDING_MIX";break;case VS:e="ENVMAP_BLENDING_ADD";break}return e}function VT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function HT(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=FT(n),c=zT(n),f=BT(n),p=jT(n),h=VT(n),m=NT(n),x=PT(s),_=r.createProgram();let g,u,v=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(ca).join(`
`),g.length>0&&(g+=`
`),u=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(ca).join(`
`),u.length>0&&(u+=`
`)):(g=[am(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+f:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ca).join(`
`),u=[am(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+f:"",n.envMap?"#define "+p:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==er?"#define TONE_MAPPING":"",n.toneMapping!==er?je.tonemapping_pars_fragment:"",n.toneMapping!==er?CT("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,AT("linearToOutputTexel",n.outputColorSpace),RT(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ca).join(`
`)),a=jd(a),a=im(a,n),a=rm(a,n),o=jd(o),o=im(o,n),o=rm(o,n),a=sm(a),o=sm(o),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,u=["#define varying in",n.glslVersion===_p?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===_p?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const y=v+g+a,S=v+u+o,N=em(r,r.VERTEX_SHADER,y),A=em(r,r.FRAGMENT_SHADER,S);r.attachShader(_,N),r.attachShader(_,A),n.index0AttributeName!==void 0?r.bindAttribLocation(_,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function w(P){if(t.debug.checkShaderErrors){const G=r.getProgramInfoLog(_).trim(),O=r.getShaderInfoLog(N).trim(),Y=r.getShaderInfoLog(A).trim();let X=!0,$=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(X=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,_,N,A);else{const ee=nm(r,N,"vertex"),L=nm(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+G+`
`+ee+`
`+L)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(O===""||Y==="")&&($=!1);$&&(P.diagnostics={runnable:X,programLog:G,vertexShader:{log:O,prefix:g},fragmentShader:{log:Y,prefix:u}})}r.deleteShader(N),r.deleteShader(A),R=new rl(r,_),b=LT(r,_)}let R;this.getUniforms=function(){return R===void 0&&w(this),R};let b;this.getAttributes=function(){return b===void 0&&w(this),b};let M=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,ET)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=wT++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=N,this.fragmentShader=A,this}let GT=0;class WT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new XT(e),n.set(e,i)),i}}class XT{constructor(e){this.id=GT++,this.code=e,this.usedTimes=0}}function $T(t,e,n,i,r,s,a){const o=new Z0,l=new WT,c=new Set,f=[],p=r.logarithmicDepthBuffer,h=r.vertexTextures;let m=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,M,P,G,O){const Y=G.fog,X=O.geometry,$=b.isMeshStandardMaterial?G.environment:null,ee=(b.isMeshStandardMaterial?n:e).get(b.envMap||$),L=ee&&ee.mapping===ql?ee.image.height:null,K=x[b.type];b.precision!==null&&(m=r.getMaxPrecision(b.precision),m!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",m,"instead."));const Q=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ce=Q!==void 0?Q.length:0;let z=0;X.morphAttributes.position!==void 0&&(z=1),X.morphAttributes.normal!==void 0&&(z=2),X.morphAttributes.color!==void 0&&(z=3);let re,H,ne,ue;if(K){const et=Kn[K];re=et.vertexShader,H=et.fragmentShader}else re=b.vertexShader,H=b.fragmentShader,l.update(b),ne=l.getVertexShaderID(b),ue=l.getFragmentShaderID(b);const ie=t.getRenderTarget(),ve=t.state.buffers.depth.getReversed(),ge=O.isInstancedMesh===!0,Ce=O.isBatchedMesh===!0,it=!!b.map,Ge=!!b.matcap,ot=!!ee,U=!!b.aoMap,Ft=!!b.lightMap,Fe=!!b.bumpMap,ze=!!b.normalMap,Ne=!!b.displacementMap,rt=!!b.emissiveMap,Re=!!b.metalnessMap,C=!!b.roughnessMap,E=b.anisotropy>0,F=b.clearcoat>0,J=b.dispersion>0,se=b.iridescence>0,Z=b.sheen>0,Ee=b.transmission>0,he=E&&!!b.anisotropyMap,ye=F&&!!b.clearcoatMap,qe=F&&!!b.clearcoatNormalMap,oe=F&&!!b.clearcoatRoughnessMap,Se=se&&!!b.iridescenceMap,Pe=se&&!!b.iridescenceThicknessMap,Le=Z&&!!b.sheenColorMap,Me=Z&&!!b.sheenRoughnessMap,Xe=!!b.specularMap,Be=!!b.specularColorMap,lt=!!b.specularIntensityMap,D=Ee&&!!b.transmissionMap,fe=Ee&&!!b.thicknessMap,W=!!b.gradientMap,te=!!b.alphaMap,xe=b.alphaTest>0,pe=!!b.alphaHash,Ue=!!b.extensions;let _t=er;b.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(_t=t.toneMapping);const zt={shaderID:K,shaderType:b.type,shaderName:b.name,vertexShader:re,fragmentShader:H,defines:b.defines,customVertexShaderID:ne,customFragmentShaderID:ue,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:m,batching:Ce,batchingColor:Ce&&O._colorsTexture!==null,instancing:ge,instancingColor:ge&&O.instanceColor!==null,instancingMorph:ge&&O.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ie===null?t.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Bs,alphaToCoverage:!!b.alphaToCoverage,map:it,matcap:Ge,envMap:ot,envMapMode:ot&&ee.mapping,envMapCubeUVHeight:L,aoMap:U,lightMap:Ft,bumpMap:Fe,normalMap:ze,displacementMap:h&&Ne,emissiveMap:rt,normalMapObjectSpace:ze&&b.normalMapType===e1,normalMapTangentSpace:ze&&b.normalMapType===JS,metalnessMap:Re,roughnessMap:C,anisotropy:E,anisotropyMap:he,clearcoat:F,clearcoatMap:ye,clearcoatNormalMap:qe,clearcoatRoughnessMap:oe,dispersion:J,iridescence:se,iridescenceMap:Se,iridescenceThicknessMap:Pe,sheen:Z,sheenColorMap:Le,sheenRoughnessMap:Me,specularMap:Xe,specularColorMap:Be,specularIntensityMap:lt,transmission:Ee,transmissionMap:D,thicknessMap:fe,gradientMap:W,opaque:b.transparent===!1&&b.blending===ys&&b.alphaToCoverage===!1,alphaMap:te,alphaTest:xe,alphaHash:pe,combine:b.combine,mapUv:it&&_(b.map.channel),aoMapUv:U&&_(b.aoMap.channel),lightMapUv:Ft&&_(b.lightMap.channel),bumpMapUv:Fe&&_(b.bumpMap.channel),normalMapUv:ze&&_(b.normalMap.channel),displacementMapUv:Ne&&_(b.displacementMap.channel),emissiveMapUv:rt&&_(b.emissiveMap.channel),metalnessMapUv:Re&&_(b.metalnessMap.channel),roughnessMapUv:C&&_(b.roughnessMap.channel),anisotropyMapUv:he&&_(b.anisotropyMap.channel),clearcoatMapUv:ye&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:qe&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:oe&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Pe&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Me&&_(b.sheenRoughnessMap.channel),specularMapUv:Xe&&_(b.specularMap.channel),specularColorMapUv:Be&&_(b.specularColorMap.channel),specularIntensityMapUv:lt&&_(b.specularIntensityMap.channel),transmissionMapUv:D&&_(b.transmissionMap.channel),thicknessMapUv:fe&&_(b.thicknessMap.channel),alphaMapUv:te&&_(b.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(ze||E),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!X.attributes.uv&&(it||te),fog:!!Y,useFog:b.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:ve,skinning:O.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:z,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:_t,decodeVideoTexture:it&&b.map.isVideoTexture===!0&&Ye.getTransfer(b.map.colorSpace)===st,decodeVideoTextureEmissive:rt&&b.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(b.emissiveMap.colorSpace)===st,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===pi,flipSided:b.side===an,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ue&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ue&&b.extensions.multiDraw===!0||Ce)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return zt.vertexUv1s=c.has(1),zt.vertexUv2s=c.has(2),zt.vertexUv3s=c.has(3),c.clear(),zt}function u(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)M.push(P),M.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(v(M,b),y(M,b),M.push(t.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function v(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function y(b,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),b.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),b.push(o.mask)}function S(b){const M=x[b.type];let P;if(M){const G=Kn[M];P=R1.clone(G.uniforms)}else P=b.uniforms;return P}function N(b,M){let P;for(let G=0,O=f.length;G<O;G++){const Y=f[G];if(Y.cacheKey===M){P=Y,++P.usedTimes;break}}return P===void 0&&(P=new HT(t,M,b,s),f.push(P)),P}function A(b){if(--b.usedTimes===0){const M=f.indexOf(b);f[M]=f[f.length-1],f.pop(),b.destroy()}}function w(b){l.remove(b)}function R(){l.dispose()}return{getParameters:g,getProgramCacheKey:u,getUniforms:S,acquireProgram:N,releaseProgram:A,releaseShaderCache:w,programs:f,dispose:R}}function qT(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function YT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function om(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function lm(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(p,h,m,x,_,g){let u=t[e];return u===void 0?(u={id:p.id,object:p,geometry:h,material:m,groupOrder:x,renderOrder:p.renderOrder,z:_,group:g},t[e]=u):(u.id=p.id,u.object=p,u.geometry=h,u.material=m,u.groupOrder=x,u.renderOrder=p.renderOrder,u.z=_,u.group=g),e++,u}function o(p,h,m,x,_,g){const u=a(p,h,m,x,_,g);m.transmission>0?i.push(u):m.transparent===!0?r.push(u):n.push(u)}function l(p,h,m,x,_,g){const u=a(p,h,m,x,_,g);m.transmission>0?i.unshift(u):m.transparent===!0?r.unshift(u):n.unshift(u)}function c(p,h){n.length>1&&n.sort(p||YT),i.length>1&&i.sort(h||om),r.length>1&&r.sort(h||om)}function f(){for(let p=e,h=t.length;p<h;p++){const m=t[p];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:f,sort:c}}function KT(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new lm,t.set(i,[a])):r>=s.length?(a=new lm,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function ZT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new V,color:new Ve};break;case"SpotLight":n={position:new V,direction:new V,color:new Ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new V,color:new Ve,distance:0,decay:0};break;case"HemisphereLight":n={direction:new V,skyColor:new Ve,groundColor:new Ve};break;case"RectAreaLight":n={color:new Ve,position:new V,halfWidth:new V,halfHeight:new V};break}return t[e.id]=n,n}}}function QT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let JT=0;function eb(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function tb(t){const e=new ZT,n=QT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const r=new V,s=new Et,a=new Et;function o(c){let f=0,p=0,h=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let m=0,x=0,_=0,g=0,u=0,v=0,y=0,S=0,N=0,A=0,w=0;c.sort(eb);for(let b=0,M=c.length;b<M;b++){const P=c[b],G=P.color,O=P.intensity,Y=P.distance,X=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)f+=G.r*O,p+=G.g*O,h+=G.b*O;else if(P.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(P.sh.coefficients[$],O);w++}else if(P.isDirectionalLight){const $=e.get(P);if($.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const ee=P.shadow,L=n.get(P);L.shadowIntensity=ee.intensity,L.shadowBias=ee.bias,L.shadowNormalBias=ee.normalBias,L.shadowRadius=ee.radius,L.shadowMapSize=ee.mapSize,i.directionalShadow[m]=L,i.directionalShadowMap[m]=X,i.directionalShadowMatrix[m]=P.shadow.matrix,v++}i.directional[m]=$,m++}else if(P.isSpotLight){const $=e.get(P);$.position.setFromMatrixPosition(P.matrixWorld),$.color.copy(G).multiplyScalar(O),$.distance=Y,$.coneCos=Math.cos(P.angle),$.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),$.decay=P.decay,i.spot[_]=$;const ee=P.shadow;if(P.map&&(i.spotLightMap[N]=P.map,N++,ee.updateMatrices(P),P.castShadow&&A++),i.spotLightMatrix[_]=ee.matrix,P.castShadow){const L=n.get(P);L.shadowIntensity=ee.intensity,L.shadowBias=ee.bias,L.shadowNormalBias=ee.normalBias,L.shadowRadius=ee.radius,L.shadowMapSize=ee.mapSize,i.spotShadow[_]=L,i.spotShadowMap[_]=X,S++}_++}else if(P.isRectAreaLight){const $=e.get(P);$.color.copy(G).multiplyScalar(O),$.halfWidth.set(P.width*.5,0,0),$.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=$,g++}else if(P.isPointLight){const $=e.get(P);if($.color.copy(P.color).multiplyScalar(P.intensity),$.distance=P.distance,$.decay=P.decay,P.castShadow){const ee=P.shadow,L=n.get(P);L.shadowIntensity=ee.intensity,L.shadowBias=ee.bias,L.shadowNormalBias=ee.normalBias,L.shadowRadius=ee.radius,L.shadowMapSize=ee.mapSize,L.shadowCameraNear=ee.camera.near,L.shadowCameraFar=ee.camera.far,i.pointShadow[x]=L,i.pointShadowMap[x]=X,i.pointShadowMatrix[x]=P.shadow.matrix,y++}i.point[x]=$,x++}else if(P.isHemisphereLight){const $=e.get(P);$.skyColor.copy(P.color).multiplyScalar(O),$.groundColor.copy(P.groundColor).multiplyScalar(O),i.hemi[u]=$,u++}}g>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2):(i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=p,i.ambient[2]=h;const R=i.hash;(R.directionalLength!==m||R.pointLength!==x||R.spotLength!==_||R.rectAreaLength!==g||R.hemiLength!==u||R.numDirectionalShadows!==v||R.numPointShadows!==y||R.numSpotShadows!==S||R.numSpotMaps!==N||R.numLightProbes!==w)&&(i.directional.length=m,i.spot.length=_,i.rectArea.length=g,i.point.length=x,i.hemi.length=u,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=S+N-A,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=w,R.directionalLength=m,R.pointLength=x,R.spotLength=_,R.rectAreaLength=g,R.hemiLength=u,R.numDirectionalShadows=v,R.numPointShadows=y,R.numSpotShadows=S,R.numSpotMaps=N,R.numLightProbes=w,i.version=JT++)}function l(c,f){let p=0,h=0,m=0,x=0,_=0;const g=f.matrixWorldInverse;for(let u=0,v=c.length;u<v;u++){const y=c[u];if(y.isDirectionalLight){const S=i.directional[p];S.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),p++}else if(y.isSpotLight){const S=i.spot[m];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(g),S.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),m++}else if(y.isRectAreaLight){const S=i.rectArea[x];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(g),a.identity(),s.copy(y.matrixWorld),s.premultiply(g),a.extractRotation(s),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){const S=i.point[h];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(g),h++}else if(y.isHemisphereLight){const S=i.hemi[_];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(g),_++}}}return{setup:o,setupView:l,state:i}}function cm(t){const e=new tb(t),n=[],i=[];function r(f){c.camera=f,n.length=0,i.length=0}function s(f){n.push(f)}function a(f){i.push(f)}function o(){e.setup(n)}function l(f){e.setupView(n,f)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function nb(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new cm(t),e.set(r,[o])):s>=a.length?(o=new cm(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class ib extends Ya{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=ZS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class rb extends Ya{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const sb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ab=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function ob(t,e,n){let i=new rv;const r=new at,s=new at,a=new Mt,o=new ib({depthPacking:QS}),l=new rb,c={},f=n.maxTextureSize,p={[ir]:an,[an]:ir,[pi]:pi},h=new rr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new at},radius:{value:4}},vertexShader:sb,fragmentShader:ab}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const x=new ii;x.setAttribute("position",new Cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Jn(x,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=D0;let u=this.type;this.render=function(A,w,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;const b=t.getRenderTarget(),M=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),G=t.state;G.setBlending(Ji),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const O=u!==di&&this.type===di,Y=u===di&&this.type!==di;for(let X=0,$=A.length;X<$;X++){const ee=A[X],L=ee.shadow;if(L===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(L.autoUpdate===!1&&L.needsUpdate===!1)continue;r.copy(L.mapSize);const K=L.getFrameExtents();if(r.multiply(K),s.copy(L.mapSize),(r.x>f||r.y>f)&&(r.x>f&&(s.x=Math.floor(f/K.x),r.x=s.x*K.x,L.mapSize.x=s.x),r.y>f&&(s.y=Math.floor(f/K.y),r.y=s.y*K.y,L.mapSize.y=s.y)),L.map===null||O===!0||Y===!0){const ce=this.type!==di?{minFilter:Gn,magFilter:Gn}:{};L.map!==null&&L.map.dispose(),L.map=new Ur(r.x,r.y,ce),L.map.texture.name=ee.name+".shadowMap",L.camera.updateProjectionMatrix()}t.setRenderTarget(L.map),t.clear();const Q=L.getViewportCount();for(let ce=0;ce<Q;ce++){const z=L.getViewport(ce);a.set(s.x*z.x,s.y*z.y,s.x*z.z,s.y*z.w),G.viewport(a),L.updateMatrices(ee,ce),i=L.getFrustum(),S(w,R,L.camera,ee,this.type)}L.isPointLightShadow!==!0&&this.type===di&&v(L,R),L.needsUpdate=!1}u=this.type,g.needsUpdate=!1,t.setRenderTarget(b,M,P)};function v(A,w){const R=e.update(_);h.defines.VSM_SAMPLES!==A.blurSamples&&(h.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Ur(r.x,r.y)),h.uniforms.shadow_pass.value=A.map.texture,h.uniforms.resolution.value=A.mapSize,h.uniforms.radius.value=A.radius,t.setRenderTarget(A.mapPass),t.clear(),t.renderBufferDirect(w,null,R,h,_,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,t.setRenderTarget(A.map),t.clear(),t.renderBufferDirect(w,null,R,m,_,null)}function y(A,w,R,b){let M=null;const P=R.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)M=P;else if(M=R.isPointLight===!0?l:o,t.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const G=M.uuid,O=w.uuid;let Y=c[G];Y===void 0&&(Y={},c[G]=Y);let X=Y[O];X===void 0&&(X=M.clone(),Y[O]=X,w.addEventListener("dispose",N)),M=X}if(M.visible=w.visible,M.wireframe=w.wireframe,b===di?M.side=w.shadowSide!==null?w.shadowSide:w.side:M.side=w.shadowSide!==null?w.shadowSide:p[w.side],M.alphaMap=w.alphaMap,M.alphaTest=w.alphaTest,M.map=w.map,M.clipShadows=w.clipShadows,M.clippingPlanes=w.clippingPlanes,M.clipIntersection=w.clipIntersection,M.displacementMap=w.displacementMap,M.displacementScale=w.displacementScale,M.displacementBias=w.displacementBias,M.wireframeLinewidth=w.wireframeLinewidth,M.linewidth=w.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const G=t.properties.get(M);G.light=R}return M}function S(A,w,R,b,M){if(A.visible===!1)return;if(A.layers.test(w.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===di)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,A.matrixWorld);const O=e.update(A),Y=A.material;if(Array.isArray(Y)){const X=O.groups;for(let $=0,ee=X.length;$<ee;$++){const L=X[$],K=Y[L.materialIndex];if(K&&K.visible){const Q=y(A,K,b,M);A.onBeforeShadow(t,A,w,R,O,Q,L),t.renderBufferDirect(R,null,O,Q,A,L),A.onAfterShadow(t,A,w,R,O,Q,L)}}}else if(Y.visible){const X=y(A,Y,b,M);A.onBeforeShadow(t,A,w,R,O,X,null),t.renderBufferDirect(R,null,O,X,A,null),A.onAfterShadow(t,A,w,R,O,X,null)}}const G=A.children;for(let O=0,Y=G.length;O<Y;O++)S(G[O],w,R,b,M)}function N(A){A.target.removeEventListener("dispose",N);for(const R in c){const b=c[R],M=A.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const lb={[id]:rd,[sd]:ld,[ad]:cd,[Ns]:od,[rd]:id,[ld]:sd,[cd]:ad,[od]:Ns};function cb(t,e){function n(){let D=!1;const fe=new Mt;let W=null;const te=new Mt(0,0,0,0);return{setMask:function(xe){W!==xe&&!D&&(t.colorMask(xe,xe,xe,xe),W=xe)},setLocked:function(xe){D=xe},setClear:function(xe,pe,Ue,_t,zt){zt===!0&&(xe*=_t,pe*=_t,Ue*=_t),fe.set(xe,pe,Ue,_t),te.equals(fe)===!1&&(t.clearColor(xe,pe,Ue,_t),te.copy(fe))},reset:function(){D=!1,W=null,te.set(-1,0,0,0)}}}function i(){let D=!1,fe=!1,W=null,te=null,xe=null;return{setReversed:function(pe){if(fe!==pe){const Ue=e.get("EXT_clip_control");fe?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT);const _t=xe;xe=null,this.setClear(_t)}fe=pe},getReversed:function(){return fe},setTest:function(pe){pe?ie(t.DEPTH_TEST):ve(t.DEPTH_TEST)},setMask:function(pe){W!==pe&&!D&&(t.depthMask(pe),W=pe)},setFunc:function(pe){if(fe&&(pe=lb[pe]),te!==pe){switch(pe){case id:t.depthFunc(t.NEVER);break;case rd:t.depthFunc(t.ALWAYS);break;case sd:t.depthFunc(t.LESS);break;case Ns:t.depthFunc(t.LEQUAL);break;case ad:t.depthFunc(t.EQUAL);break;case od:t.depthFunc(t.GEQUAL);break;case ld:t.depthFunc(t.GREATER);break;case cd:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}te=pe}},setLocked:function(pe){D=pe},setClear:function(pe){xe!==pe&&(fe&&(pe=1-pe),t.clearDepth(pe),xe=pe)},reset:function(){D=!1,W=null,te=null,xe=null,fe=!1}}}function r(){let D=!1,fe=null,W=null,te=null,xe=null,pe=null,Ue=null,_t=null,zt=null;return{setTest:function(et){D||(et?ie(t.STENCIL_TEST):ve(t.STENCIL_TEST))},setMask:function(et){fe!==et&&!D&&(t.stencilMask(et),fe=et)},setFunc:function(et,Pn,ri){(W!==et||te!==Pn||xe!==ri)&&(t.stencilFunc(et,Pn,ri),W=et,te=Pn,xe=ri)},setOp:function(et,Pn,ri){(pe!==et||Ue!==Pn||_t!==ri)&&(t.stencilOp(et,Pn,ri),pe=et,Ue=Pn,_t=ri)},setLocked:function(et){D=et},setClear:function(et){zt!==et&&(t.clearStencil(et),zt=et)},reset:function(){D=!1,fe=null,W=null,te=null,xe=null,pe=null,Ue=null,_t=null,zt=null}}}const s=new n,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let f={},p={},h=new WeakMap,m=[],x=null,_=!1,g=null,u=null,v=null,y=null,S=null,N=null,A=null,w=new Ve(0,0,0),R=0,b=!1,M=null,P=null,G=null,O=null,Y=null;const X=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,ee=0;const L=t.getParameter(t.VERSION);L.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(L)[1]),$=ee>=1):L.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),$=ee>=2);let K=null,Q={};const ce=t.getParameter(t.SCISSOR_BOX),z=t.getParameter(t.VIEWPORT),re=new Mt().fromArray(ce),H=new Mt().fromArray(z);function ne(D,fe,W,te){const xe=new Uint8Array(4),pe=t.createTexture();t.bindTexture(D,pe),t.texParameteri(D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(D,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ue=0;Ue<W;Ue++)D===t.TEXTURE_3D||D===t.TEXTURE_2D_ARRAY?t.texImage3D(fe,0,t.RGBA,1,1,te,0,t.RGBA,t.UNSIGNED_BYTE,xe):t.texImage2D(fe+Ue,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,xe);return pe}const ue={};ue[t.TEXTURE_2D]=ne(t.TEXTURE_2D,t.TEXTURE_2D,1),ue[t.TEXTURE_CUBE_MAP]=ne(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[t.TEXTURE_2D_ARRAY]=ne(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),ue[t.TEXTURE_3D]=ne(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(t.DEPTH_TEST),a.setFunc(Ns),Fe(!1),ze(pp),ie(t.CULL_FACE),U(Ji);function ie(D){f[D]!==!0&&(t.enable(D),f[D]=!0)}function ve(D){f[D]!==!1&&(t.disable(D),f[D]=!1)}function ge(D,fe){return p[D]!==fe?(t.bindFramebuffer(D,fe),p[D]=fe,D===t.DRAW_FRAMEBUFFER&&(p[t.FRAMEBUFFER]=fe),D===t.FRAMEBUFFER&&(p[t.DRAW_FRAMEBUFFER]=fe),!0):!1}function Ce(D,fe){let W=m,te=!1;if(D){W=h.get(fe),W===void 0&&(W=[],h.set(fe,W));const xe=D.textures;if(W.length!==xe.length||W[0]!==t.COLOR_ATTACHMENT0){for(let pe=0,Ue=xe.length;pe<Ue;pe++)W[pe]=t.COLOR_ATTACHMENT0+pe;W.length=xe.length,te=!0}}else W[0]!==t.BACK&&(W[0]=t.BACK,te=!0);te&&t.drawBuffers(W)}function it(D){return x!==D?(t.useProgram(D),x=D,!0):!1}const Ge={[yr]:t.FUNC_ADD,[wS]:t.FUNC_SUBTRACT,[TS]:t.FUNC_REVERSE_SUBTRACT};Ge[bS]=t.MIN,Ge[AS]=t.MAX;const ot={[CS]:t.ZERO,[RS]:t.ONE,[NS]:t.SRC_COLOR,[td]:t.SRC_ALPHA,[kS]:t.SRC_ALPHA_SATURATE,[IS]:t.DST_COLOR,[LS]:t.DST_ALPHA,[PS]:t.ONE_MINUS_SRC_COLOR,[nd]:t.ONE_MINUS_SRC_ALPHA,[US]:t.ONE_MINUS_DST_COLOR,[DS]:t.ONE_MINUS_DST_ALPHA,[OS]:t.CONSTANT_COLOR,[FS]:t.ONE_MINUS_CONSTANT_COLOR,[zS]:t.CONSTANT_ALPHA,[BS]:t.ONE_MINUS_CONSTANT_ALPHA};function U(D,fe,W,te,xe,pe,Ue,_t,zt,et){if(D===Ji){_===!0&&(ve(t.BLEND),_=!1);return}if(_===!1&&(ie(t.BLEND),_=!0),D!==ES){if(D!==g||et!==b){if((u!==yr||S!==yr)&&(t.blendEquation(t.FUNC_ADD),u=yr,S=yr),et)switch(D){case ys:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case ed:t.blendFunc(t.ONE,t.ONE);break;case mp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case gp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case ys:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case ed:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case mp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case gp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}v=null,y=null,N=null,A=null,w.set(0,0,0),R=0,g=D,b=et}return}xe=xe||fe,pe=pe||W,Ue=Ue||te,(fe!==u||xe!==S)&&(t.blendEquationSeparate(Ge[fe],Ge[xe]),u=fe,S=xe),(W!==v||te!==y||pe!==N||Ue!==A)&&(t.blendFuncSeparate(ot[W],ot[te],ot[pe],ot[Ue]),v=W,y=te,N=pe,A=Ue),(_t.equals(w)===!1||zt!==R)&&(t.blendColor(_t.r,_t.g,_t.b,zt),w.copy(_t),R=zt),g=D,b=!1}function Ft(D,fe){D.side===pi?ve(t.CULL_FACE):ie(t.CULL_FACE);let W=D.side===an;fe&&(W=!W),Fe(W),D.blending===ys&&D.transparent===!1?U(Ji):U(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const te=D.stencilWrite;o.setTest(te),te&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),rt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ie(t.SAMPLE_ALPHA_TO_COVERAGE):ve(t.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(D){M!==D&&(D?t.frontFace(t.CW):t.frontFace(t.CCW),M=D)}function ze(D){D!==yS?(ie(t.CULL_FACE),D!==P&&(D===pp?t.cullFace(t.BACK):D===SS?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):ve(t.CULL_FACE),P=D}function Ne(D){D!==G&&($&&t.lineWidth(D),G=D)}function rt(D,fe,W){D?(ie(t.POLYGON_OFFSET_FILL),(O!==fe||Y!==W)&&(t.polygonOffset(fe,W),O=fe,Y=W)):ve(t.POLYGON_OFFSET_FILL)}function Re(D){D?ie(t.SCISSOR_TEST):ve(t.SCISSOR_TEST)}function C(D){D===void 0&&(D=t.TEXTURE0+X-1),K!==D&&(t.activeTexture(D),K=D)}function E(D,fe,W){W===void 0&&(K===null?W=t.TEXTURE0+X-1:W=K);let te=Q[W];te===void 0&&(te={type:void 0,texture:void 0},Q[W]=te),(te.type!==D||te.texture!==fe)&&(K!==W&&(t.activeTexture(W),K=W),t.bindTexture(D,fe||ue[D]),te.type=D,te.texture=fe)}function F(){const D=Q[K];D!==void 0&&D.type!==void 0&&(t.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function J(){try{t.compressedTexImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function se(){try{t.compressedTexImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Z(){try{t.texSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{t.texSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function he(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ye(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function qe(){try{t.texStorage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function oe(){try{t.texStorage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Se(){try{t.texImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Pe(){try{t.texImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Le(D){re.equals(D)===!1&&(t.scissor(D.x,D.y,D.z,D.w),re.copy(D))}function Me(D){H.equals(D)===!1&&(t.viewport(D.x,D.y,D.z,D.w),H.copy(D))}function Xe(D,fe){let W=c.get(fe);W===void 0&&(W=new WeakMap,c.set(fe,W));let te=W.get(D);te===void 0&&(te=t.getUniformBlockIndex(fe,D.name),W.set(D,te))}function Be(D,fe){const te=c.get(fe).get(D);l.get(fe)!==te&&(t.uniformBlockBinding(fe,te,D.__bindingPointIndex),l.set(fe,te))}function lt(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),f={},K=null,Q={},p={},h=new WeakMap,m=[],x=null,_=!1,g=null,u=null,v=null,y=null,S=null,N=null,A=null,w=new Ve(0,0,0),R=0,b=!1,M=null,P=null,G=null,O=null,Y=null,re.set(0,0,t.canvas.width,t.canvas.height),H.set(0,0,t.canvas.width,t.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ie,disable:ve,bindFramebuffer:ge,drawBuffers:Ce,useProgram:it,setBlending:U,setMaterial:Ft,setFlipSided:Fe,setCullFace:ze,setLineWidth:Ne,setPolygonOffset:rt,setScissorTest:Re,activeTexture:C,bindTexture:E,unbindTexture:F,compressedTexImage2D:J,compressedTexImage3D:se,texImage2D:Se,texImage3D:Pe,updateUBOMapping:Xe,uniformBlockBinding:Be,texStorage2D:qe,texStorage3D:oe,texSubImage2D:Z,texSubImage3D:Ee,compressedTexSubImage2D:he,compressedTexSubImage3D:ye,scissor:Le,viewport:Me,reset:lt}}function um(t,e,n,i){const r=ub(i);switch(n){case z0:return t*e;case j0:return t*e;case V0:return t*e*2;case H0:return t*e/r.components*r.byteLength;case Wf:return t*e/r.components*r.byteLength;case G0:return t*e*2/r.components*r.byteLength;case Xf:return t*e*2/r.components*r.byteLength;case B0:return t*e*3/r.components*r.byteLength;case jn:return t*e*4/r.components*r.byteLength;case $f:return t*e*4/r.components*r.byteLength;case Jo:case el:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case tl:case nl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case md:case xd:return Math.max(t,16)*Math.max(e,8)/4;case pd:case gd:return Math.max(t,8)*Math.max(e,8)/2;case vd:case _d:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case yd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Sd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Md:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Ed:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case wd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Td:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case bd:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Ad:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Cd:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Rd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Nd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Pd:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Ld:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Dd:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Id:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case il:case Ud:case kd:return Math.ceil(t/4)*Math.ceil(e/4)*16;case W0:case Od:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Fd:case zd:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function ub(t){switch(t){case bi:case k0:return{byteLength:1,components:1};case Fa:case O0:case Wa:return{byteLength:2,components:1};case Hf:case Gf:return{byteLength:2,components:4};case Ir:case Vf:case vi:return{byteLength:4,components:1};case F0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function db(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new at,f=new WeakMap;let p;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,E){return m?new OffscreenCanvas(C,E):Nl("canvas")}function _(C,E,F){let J=1;const se=Re(C);if((se.width>F||se.height>F)&&(J=F/Math.max(se.width,se.height)),J<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const Z=Math.floor(J*se.width),Ee=Math.floor(J*se.height);p===void 0&&(p=x(Z,Ee));const he=E?x(Z,Ee):p;return he.width=Z,he.height=Ee,he.getContext("2d").drawImage(C,0,0,Z,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+Z+"x"+Ee+")."),he}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),C;return C}function g(C){return C.generateMipmaps}function u(C){t.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?t.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function y(C,E,F,J,se=!1){if(C!==null){if(t[C]!==void 0)return t[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Z=E;if(E===t.RED&&(F===t.FLOAT&&(Z=t.R32F),F===t.HALF_FLOAT&&(Z=t.R16F),F===t.UNSIGNED_BYTE&&(Z=t.R8)),E===t.RED_INTEGER&&(F===t.UNSIGNED_BYTE&&(Z=t.R8UI),F===t.UNSIGNED_SHORT&&(Z=t.R16UI),F===t.UNSIGNED_INT&&(Z=t.R32UI),F===t.BYTE&&(Z=t.R8I),F===t.SHORT&&(Z=t.R16I),F===t.INT&&(Z=t.R32I)),E===t.RG&&(F===t.FLOAT&&(Z=t.RG32F),F===t.HALF_FLOAT&&(Z=t.RG16F),F===t.UNSIGNED_BYTE&&(Z=t.RG8)),E===t.RG_INTEGER&&(F===t.UNSIGNED_BYTE&&(Z=t.RG8UI),F===t.UNSIGNED_SHORT&&(Z=t.RG16UI),F===t.UNSIGNED_INT&&(Z=t.RG32UI),F===t.BYTE&&(Z=t.RG8I),F===t.SHORT&&(Z=t.RG16I),F===t.INT&&(Z=t.RG32I)),E===t.RGB_INTEGER&&(F===t.UNSIGNED_BYTE&&(Z=t.RGB8UI),F===t.UNSIGNED_SHORT&&(Z=t.RGB16UI),F===t.UNSIGNED_INT&&(Z=t.RGB32UI),F===t.BYTE&&(Z=t.RGB8I),F===t.SHORT&&(Z=t.RGB16I),F===t.INT&&(Z=t.RGB32I)),E===t.RGBA_INTEGER&&(F===t.UNSIGNED_BYTE&&(Z=t.RGBA8UI),F===t.UNSIGNED_SHORT&&(Z=t.RGBA16UI),F===t.UNSIGNED_INT&&(Z=t.RGBA32UI),F===t.BYTE&&(Z=t.RGBA8I),F===t.SHORT&&(Z=t.RGBA16I),F===t.INT&&(Z=t.RGBA32I)),E===t.RGB&&F===t.UNSIGNED_INT_5_9_9_9_REV&&(Z=t.RGB9_E5),E===t.RGBA){const Ee=se?Yl:Ye.getTransfer(J);F===t.FLOAT&&(Z=t.RGBA32F),F===t.HALF_FLOAT&&(Z=t.RGBA16F),F===t.UNSIGNED_BYTE&&(Z=Ee===st?t.SRGB8_ALPHA8:t.RGBA8),F===t.UNSIGNED_SHORT_4_4_4_4&&(Z=t.RGBA4),F===t.UNSIGNED_SHORT_5_5_5_1&&(Z=t.RGB5_A1)}return(Z===t.R16F||Z===t.R32F||Z===t.RG16F||Z===t.RG32F||Z===t.RGBA16F||Z===t.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function S(C,E){let F;return C?E===null||E===Ir||E===Ds?F=t.DEPTH24_STENCIL8:E===vi?F=t.DEPTH32F_STENCIL8:E===Fa&&(F=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Ir||E===Ds?F=t.DEPTH_COMPONENT24:E===vi?F=t.DEPTH_COMPONENT32F:E===Fa&&(F=t.DEPTH_COMPONENT16),F}function N(C,E){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Gn&&C.minFilter!==Qn?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function A(C){const E=C.target;E.removeEventListener("dispose",A),R(E),E.isVideoTexture&&f.delete(E)}function w(C){const E=C.target;E.removeEventListener("dispose",w),M(E)}function R(C){const E=i.get(C);if(E.__webglInit===void 0)return;const F=C.source,J=h.get(F);if(J){const se=J[E.__cacheKey];se.usedTimes--,se.usedTimes===0&&b(C),Object.keys(J).length===0&&h.delete(F)}i.remove(C)}function b(C){const E=i.get(C);t.deleteTexture(E.__webglTexture);const F=C.source,J=h.get(F);delete J[E.__cacheKey],a.memory.textures--}function M(C){const E=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(E.__webglFramebuffer[J]))for(let se=0;se<E.__webglFramebuffer[J].length;se++)t.deleteFramebuffer(E.__webglFramebuffer[J][se]);else t.deleteFramebuffer(E.__webglFramebuffer[J]);E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer[J])}else{if(Array.isArray(E.__webglFramebuffer))for(let J=0;J<E.__webglFramebuffer.length;J++)t.deleteFramebuffer(E.__webglFramebuffer[J]);else t.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&t.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let J=0;J<E.__webglColorRenderbuffer.length;J++)E.__webglColorRenderbuffer[J]&&t.deleteRenderbuffer(E.__webglColorRenderbuffer[J]);E.__webglDepthRenderbuffer&&t.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const F=C.textures;for(let J=0,se=F.length;J<se;J++){const Z=i.get(F[J]);Z.__webglTexture&&(t.deleteTexture(Z.__webglTexture),a.memory.textures--),i.remove(F[J])}i.remove(C)}let P=0;function G(){P=0}function O(){const C=P;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),P+=1,C}function Y(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function X(C,E){const F=i.get(C);if(C.isVideoTexture&&Ne(C),C.isRenderTargetTexture===!1&&C.version>0&&F.__version!==C.version){const J=C.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{H(F,C,E);return}}n.bindTexture(t.TEXTURE_2D,F.__webglTexture,t.TEXTURE0+E)}function $(C,E){const F=i.get(C);if(C.version>0&&F.__version!==C.version){H(F,C,E);return}n.bindTexture(t.TEXTURE_2D_ARRAY,F.__webglTexture,t.TEXTURE0+E)}function ee(C,E){const F=i.get(C);if(C.version>0&&F.__version!==C.version){H(F,C,E);return}n.bindTexture(t.TEXTURE_3D,F.__webglTexture,t.TEXTURE0+E)}function L(C,E){const F=i.get(C);if(C.version>0&&F.__version!==C.version){ne(F,C,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,F.__webglTexture,t.TEXTURE0+E)}const K={[fd]:t.REPEAT,[Tr]:t.CLAMP_TO_EDGE,[hd]:t.MIRRORED_REPEAT},Q={[Gn]:t.NEAREST,[KS]:t.NEAREST_MIPMAP_NEAREST,[vo]:t.NEAREST_MIPMAP_LINEAR,[Qn]:t.LINEAR,[Ac]:t.LINEAR_MIPMAP_NEAREST,[br]:t.LINEAR_MIPMAP_LINEAR},ce={[t1]:t.NEVER,[o1]:t.ALWAYS,[n1]:t.LESS,[X0]:t.LEQUAL,[i1]:t.EQUAL,[a1]:t.GEQUAL,[r1]:t.GREATER,[s1]:t.NOTEQUAL};function z(C,E){if(E.type===vi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Qn||E.magFilter===Ac||E.magFilter===vo||E.magFilter===br||E.minFilter===Qn||E.minFilter===Ac||E.minFilter===vo||E.minFilter===br)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(C,t.TEXTURE_WRAP_S,K[E.wrapS]),t.texParameteri(C,t.TEXTURE_WRAP_T,K[E.wrapT]),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,K[E.wrapR]),t.texParameteri(C,t.TEXTURE_MAG_FILTER,Q[E.magFilter]),t.texParameteri(C,t.TEXTURE_MIN_FILTER,Q[E.minFilter]),E.compareFunction&&(t.texParameteri(C,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(C,t.TEXTURE_COMPARE_FUNC,ce[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Gn||E.minFilter!==vo&&E.minFilter!==br||E.type===vi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");t.texParameterf(C,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function re(C,E){let F=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",A));const J=E.source;let se=h.get(J);se===void 0&&(se={},h.set(J,se));const Z=Y(E);if(Z!==C.__cacheKey){se[Z]===void 0&&(se[Z]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,F=!0),se[Z].usedTimes++;const Ee=se[C.__cacheKey];Ee!==void 0&&(se[C.__cacheKey].usedTimes--,Ee.usedTimes===0&&b(E)),C.__cacheKey=Z,C.__webglTexture=se[Z].texture}return F}function H(C,E,F){let J=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(J=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(J=t.TEXTURE_3D);const se=re(C,E),Z=E.source;n.bindTexture(J,C.__webglTexture,t.TEXTURE0+F);const Ee=i.get(Z);if(Z.version!==Ee.__version||se===!0){n.activeTexture(t.TEXTURE0+F);const he=Ye.getPrimaries(Ye.workingColorSpace),ye=E.colorSpace===Vi?null:Ye.getPrimaries(E.colorSpace),qe=E.colorSpace===Vi||he===ye?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let oe=_(E.image,!1,r.maxTextureSize);oe=rt(E,oe);const Se=s.convert(E.format,E.colorSpace),Pe=s.convert(E.type);let Le=y(E.internalFormat,Se,Pe,E.colorSpace,E.isVideoTexture);z(J,E);let Me;const Xe=E.mipmaps,Be=E.isVideoTexture!==!0,lt=Ee.__version===void 0||se===!0,D=Z.dataReady,fe=N(E,oe);if(E.isDepthTexture)Le=S(E.format===Is,E.type),lt&&(Be?n.texStorage2D(t.TEXTURE_2D,1,Le,oe.width,oe.height):n.texImage2D(t.TEXTURE_2D,0,Le,oe.width,oe.height,0,Se,Pe,null));else if(E.isDataTexture)if(Xe.length>0){Be&&lt&&n.texStorage2D(t.TEXTURE_2D,fe,Le,Xe[0].width,Xe[0].height);for(let W=0,te=Xe.length;W<te;W++)Me=Xe[W],Be?D&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,Me.width,Me.height,Se,Pe,Me.data):n.texImage2D(t.TEXTURE_2D,W,Le,Me.width,Me.height,0,Se,Pe,Me.data);E.generateMipmaps=!1}else Be?(lt&&n.texStorage2D(t.TEXTURE_2D,fe,Le,oe.width,oe.height),D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,oe.width,oe.height,Se,Pe,oe.data)):n.texImage2D(t.TEXTURE_2D,0,Le,oe.width,oe.height,0,Se,Pe,oe.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Be&&lt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,fe,Le,Xe[0].width,Xe[0].height,oe.depth);for(let W=0,te=Xe.length;W<te;W++)if(Me=Xe[W],E.format!==jn)if(Se!==null)if(Be){if(D)if(E.layerUpdates.size>0){const xe=um(Me.width,Me.height,E.format,E.type);for(const pe of E.layerUpdates){const Ue=Me.data.subarray(pe*xe/Me.data.BYTES_PER_ELEMENT,(pe+1)*xe/Me.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,pe,Me.width,Me.height,1,Se,Ue)}E.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,0,Me.width,Me.height,oe.depth,Se,Me.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,W,Le,Me.width,Me.height,oe.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?D&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,W,0,0,0,Me.width,Me.height,oe.depth,Se,Pe,Me.data):n.texImage3D(t.TEXTURE_2D_ARRAY,W,Le,Me.width,Me.height,oe.depth,0,Se,Pe,Me.data)}else{Be&&lt&&n.texStorage2D(t.TEXTURE_2D,fe,Le,Xe[0].width,Xe[0].height);for(let W=0,te=Xe.length;W<te;W++)Me=Xe[W],E.format!==jn?Se!==null?Be?D&&n.compressedTexSubImage2D(t.TEXTURE_2D,W,0,0,Me.width,Me.height,Se,Me.data):n.compressedTexImage2D(t.TEXTURE_2D,W,Le,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?D&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,Me.width,Me.height,Se,Pe,Me.data):n.texImage2D(t.TEXTURE_2D,W,Le,Me.width,Me.height,0,Se,Pe,Me.data)}else if(E.isDataArrayTexture)if(Be){if(lt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,fe,Le,oe.width,oe.height,oe.depth),D)if(E.layerUpdates.size>0){const W=um(oe.width,oe.height,E.format,E.type);for(const te of E.layerUpdates){const xe=oe.data.subarray(te*W/oe.data.BYTES_PER_ELEMENT,(te+1)*W/oe.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,te,oe.width,oe.height,1,Se,Pe,xe)}E.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,Se,Pe,oe.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Le,oe.width,oe.height,oe.depth,0,Se,Pe,oe.data);else if(E.isData3DTexture)Be?(lt&&n.texStorage3D(t.TEXTURE_3D,fe,Le,oe.width,oe.height,oe.depth),D&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,Se,Pe,oe.data)):n.texImage3D(t.TEXTURE_3D,0,Le,oe.width,oe.height,oe.depth,0,Se,Pe,oe.data);else if(E.isFramebufferTexture){if(lt)if(Be)n.texStorage2D(t.TEXTURE_2D,fe,Le,oe.width,oe.height);else{let W=oe.width,te=oe.height;for(let xe=0;xe<fe;xe++)n.texImage2D(t.TEXTURE_2D,xe,Le,W,te,0,Se,Pe,null),W>>=1,te>>=1}}else if(Xe.length>0){if(Be&&lt){const W=Re(Xe[0]);n.texStorage2D(t.TEXTURE_2D,fe,Le,W.width,W.height)}for(let W=0,te=Xe.length;W<te;W++)Me=Xe[W],Be?D&&n.texSubImage2D(t.TEXTURE_2D,W,0,0,Se,Pe,Me):n.texImage2D(t.TEXTURE_2D,W,Le,Se,Pe,Me);E.generateMipmaps=!1}else if(Be){if(lt){const W=Re(oe);n.texStorage2D(t.TEXTURE_2D,fe,Le,W.width,W.height)}D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,Se,Pe,oe)}else n.texImage2D(t.TEXTURE_2D,0,Le,Se,Pe,oe);g(E)&&u(J),Ee.__version=Z.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function ne(C,E,F){if(E.image.length!==6)return;const J=re(C,E),se=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,C.__webglTexture,t.TEXTURE0+F);const Z=i.get(se);if(se.version!==Z.__version||J===!0){n.activeTexture(t.TEXTURE0+F);const Ee=Ye.getPrimaries(Ye.workingColorSpace),he=E.colorSpace===Vi?null:Ye.getPrimaries(E.colorSpace),ye=E.colorSpace===Vi||Ee===he?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);const qe=E.isCompressedTexture||E.image[0].isCompressedTexture,oe=E.image[0]&&E.image[0].isDataTexture,Se=[];for(let te=0;te<6;te++)!qe&&!oe?Se[te]=_(E.image[te],!0,r.maxCubemapSize):Se[te]=oe?E.image[te].image:E.image[te],Se[te]=rt(E,Se[te]);const Pe=Se[0],Le=s.convert(E.format,E.colorSpace),Me=s.convert(E.type),Xe=y(E.internalFormat,Le,Me,E.colorSpace),Be=E.isVideoTexture!==!0,lt=Z.__version===void 0||J===!0,D=se.dataReady;let fe=N(E,Pe);z(t.TEXTURE_CUBE_MAP,E);let W;if(qe){Be&&lt&&n.texStorage2D(t.TEXTURE_CUBE_MAP,fe,Xe,Pe.width,Pe.height);for(let te=0;te<6;te++){W=Se[te].mipmaps;for(let xe=0;xe<W.length;xe++){const pe=W[xe];E.format!==jn?Le!==null?Be?D&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,0,0,pe.width,pe.height,Le,pe.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,Xe,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Be?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,0,0,pe.width,pe.height,Le,Me,pe.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,Xe,pe.width,pe.height,0,Le,Me,pe.data)}}}else{if(W=E.mipmaps,Be&&lt){W.length>0&&fe++;const te=Re(Se[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,fe,Xe,te.width,te.height)}for(let te=0;te<6;te++)if(oe){Be?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Se[te].width,Se[te].height,Le,Me,Se[te].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Xe,Se[te].width,Se[te].height,0,Le,Me,Se[te].data);for(let xe=0;xe<W.length;xe++){const Ue=W[xe].image[te].image;Be?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,0,0,Ue.width,Ue.height,Le,Me,Ue.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,Xe,Ue.width,Ue.height,0,Le,Me,Ue.data)}}else{Be?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Le,Me,Se[te]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Xe,Le,Me,Se[te]);for(let xe=0;xe<W.length;xe++){const pe=W[xe];Be?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,0,0,Le,Me,pe.image[te]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,Xe,Le,Me,pe.image[te])}}}g(E)&&u(t.TEXTURE_CUBE_MAP),Z.__version=se.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function ue(C,E,F,J,se,Z){const Ee=s.convert(F.format,F.colorSpace),he=s.convert(F.type),ye=y(F.internalFormat,Ee,he,F.colorSpace),qe=i.get(E),oe=i.get(F);if(oe.__renderTarget=E,!qe.__hasExternalTextures){const Se=Math.max(1,E.width>>Z),Pe=Math.max(1,E.height>>Z);se===t.TEXTURE_3D||se===t.TEXTURE_2D_ARRAY?n.texImage3D(se,Z,ye,Se,Pe,E.depth,0,Ee,he,null):n.texImage2D(se,Z,ye,Se,Pe,0,Ee,he,null)}n.bindFramebuffer(t.FRAMEBUFFER,C),ze(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,J,se,oe.__webglTexture,0,Fe(E)):(se===t.TEXTURE_2D||se>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,J,se,oe.__webglTexture,Z),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ie(C,E,F){if(t.bindRenderbuffer(t.RENDERBUFFER,C),E.depthBuffer){const J=E.depthTexture,se=J&&J.isDepthTexture?J.type:null,Z=S(E.stencilBuffer,se),Ee=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,he=Fe(E);ze(E)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,he,Z,E.width,E.height):F?t.renderbufferStorageMultisample(t.RENDERBUFFER,he,Z,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,Z,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Ee,t.RENDERBUFFER,C)}else{const J=E.textures;for(let se=0;se<J.length;se++){const Z=J[se],Ee=s.convert(Z.format,Z.colorSpace),he=s.convert(Z.type),ye=y(Z.internalFormat,Ee,he,Z.colorSpace),qe=Fe(E);F&&ze(E)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,qe,ye,E.width,E.height):ze(E)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,qe,ye,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,ye,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function ve(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=i.get(E.depthTexture);J.__renderTarget=E,(!J.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),X(E.depthTexture,0);const se=J.__webglTexture,Z=Fe(E);if(E.depthTexture.format===Ss)ze(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,se,0,Z):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,se,0);else if(E.depthTexture.format===Is)ze(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,se,0,Z):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,se,0);else throw new Error("Unknown depthTexture format")}function ge(C){const E=i.get(C),F=C.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==C.depthTexture){const J=C.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),J){const se=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,J.removeEventListener("dispose",se)};J.addEventListener("dispose",se),E.__depthDisposeCallback=se}E.__boundDepthTexture=J}if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");ve(E.__webglFramebuffer,C)}else if(F){E.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[J]),E.__webglDepthbuffer[J]===void 0)E.__webglDepthbuffer[J]=t.createRenderbuffer(),ie(E.__webglDepthbuffer[J],C,!1);else{const se=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Z=E.__webglDepthbuffer[J];t.bindRenderbuffer(t.RENDERBUFFER,Z),t.framebufferRenderbuffer(t.FRAMEBUFFER,se,t.RENDERBUFFER,Z)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=t.createRenderbuffer(),ie(E.__webglDepthbuffer,C,!1);else{const J=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=E.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,se),t.framebufferRenderbuffer(t.FRAMEBUFFER,J,t.RENDERBUFFER,se)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ce(C,E,F){const J=i.get(C);E!==void 0&&ue(J.__webglFramebuffer,C,C.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),F!==void 0&&ge(C)}function it(C){const E=C.texture,F=i.get(C),J=i.get(E);C.addEventListener("dispose",w);const se=C.textures,Z=C.isWebGLCubeRenderTarget===!0,Ee=se.length>1;if(Ee||(J.__webglTexture===void 0&&(J.__webglTexture=t.createTexture()),J.__version=E.version,a.memory.textures++),Z){F.__webglFramebuffer=[];for(let he=0;he<6;he++)if(E.mipmaps&&E.mipmaps.length>0){F.__webglFramebuffer[he]=[];for(let ye=0;ye<E.mipmaps.length;ye++)F.__webglFramebuffer[he][ye]=t.createFramebuffer()}else F.__webglFramebuffer[he]=t.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){F.__webglFramebuffer=[];for(let he=0;he<E.mipmaps.length;he++)F.__webglFramebuffer[he]=t.createFramebuffer()}else F.__webglFramebuffer=t.createFramebuffer();if(Ee)for(let he=0,ye=se.length;he<ye;he++){const qe=i.get(se[he]);qe.__webglTexture===void 0&&(qe.__webglTexture=t.createTexture(),a.memory.textures++)}if(C.samples>0&&ze(C)===!1){F.__webglMultisampledFramebuffer=t.createFramebuffer(),F.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let he=0;he<se.length;he++){const ye=se[he];F.__webglColorRenderbuffer[he]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,F.__webglColorRenderbuffer[he]);const qe=s.convert(ye.format,ye.colorSpace),oe=s.convert(ye.type),Se=y(ye.internalFormat,qe,oe,ye.colorSpace,C.isXRRenderTarget===!0),Pe=Fe(C);t.renderbufferStorageMultisample(t.RENDERBUFFER,Pe,Se,C.width,C.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+he,t.RENDERBUFFER,F.__webglColorRenderbuffer[he])}t.bindRenderbuffer(t.RENDERBUFFER,null),C.depthBuffer&&(F.__webglDepthRenderbuffer=t.createRenderbuffer(),ie(F.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(Z){n.bindTexture(t.TEXTURE_CUBE_MAP,J.__webglTexture),z(t.TEXTURE_CUBE_MAP,E);for(let he=0;he<6;he++)if(E.mipmaps&&E.mipmaps.length>0)for(let ye=0;ye<E.mipmaps.length;ye++)ue(F.__webglFramebuffer[he][ye],C,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+he,ye);else ue(F.__webglFramebuffer[he],C,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);g(E)&&u(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ee){for(let he=0,ye=se.length;he<ye;he++){const qe=se[he],oe=i.get(qe);n.bindTexture(t.TEXTURE_2D,oe.__webglTexture),z(t.TEXTURE_2D,qe),ue(F.__webglFramebuffer,C,qe,t.COLOR_ATTACHMENT0+he,t.TEXTURE_2D,0),g(qe)&&u(t.TEXTURE_2D)}n.unbindTexture()}else{let he=t.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(he=C.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(he,J.__webglTexture),z(he,E),E.mipmaps&&E.mipmaps.length>0)for(let ye=0;ye<E.mipmaps.length;ye++)ue(F.__webglFramebuffer[ye],C,E,t.COLOR_ATTACHMENT0,he,ye);else ue(F.__webglFramebuffer,C,E,t.COLOR_ATTACHMENT0,he,0);g(E)&&u(he),n.unbindTexture()}C.depthBuffer&&ge(C)}function Ge(C){const E=C.textures;for(let F=0,J=E.length;F<J;F++){const se=E[F];if(g(se)){const Z=v(C),Ee=i.get(se).__webglTexture;n.bindTexture(Z,Ee),u(Z),n.unbindTexture()}}}const ot=[],U=[];function Ft(C){if(C.samples>0){if(ze(C)===!1){const E=C.textures,F=C.width,J=C.height;let se=t.COLOR_BUFFER_BIT;const Z=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ee=i.get(C),he=E.length>1;if(he)for(let ye=0;ye<E.length;ye++)n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ye,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ye,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let ye=0;ye<E.length;ye++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(se|=t.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(se|=t.STENCIL_BUFFER_BIT)),he){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ee.__webglColorRenderbuffer[ye]);const qe=i.get(E[ye]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,qe,0)}t.blitFramebuffer(0,0,F,J,0,0,F,J,se,t.NEAREST),l===!0&&(ot.length=0,U.length=0,ot.push(t.COLOR_ATTACHMENT0+ye),C.depthBuffer&&C.resolveDepthBuffer===!1&&(ot.push(Z),U.push(Z),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,U)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,ot))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),he)for(let ye=0;ye<E.length;ye++){n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ye,t.RENDERBUFFER,Ee.__webglColorRenderbuffer[ye]);const qe=i.get(E[ye]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ye,t.TEXTURE_2D,qe,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const E=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[E])}}}function Fe(C){return Math.min(r.maxSamples,C.samples)}function ze(C){const E=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ne(C){const E=a.render.frame;f.get(C)!==E&&(f.set(C,E),C.update())}function rt(C,E){const F=C.colorSpace,J=C.format,se=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||F!==Bs&&F!==Vi&&(Ye.getTransfer(F)===st?(J!==jn||se!==bi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),E}function Re(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=G,this.setTexture2D=X,this.setTexture2DArray=$,this.setTexture3D=ee,this.setTextureCube=L,this.rebindTextures=Ce,this.setupRenderTarget=it,this.updateRenderTargetMipmap=Ge,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=ge,this.setupFrameBufferTexture=ue,this.useMultisampledRTT=ze}function fb(t,e){function n(i,r=Vi){let s;const a=Ye.getTransfer(r);if(i===bi)return t.UNSIGNED_BYTE;if(i===Hf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Gf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===F0)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===k0)return t.BYTE;if(i===O0)return t.SHORT;if(i===Fa)return t.UNSIGNED_SHORT;if(i===Vf)return t.INT;if(i===Ir)return t.UNSIGNED_INT;if(i===vi)return t.FLOAT;if(i===Wa)return t.HALF_FLOAT;if(i===z0)return t.ALPHA;if(i===B0)return t.RGB;if(i===jn)return t.RGBA;if(i===j0)return t.LUMINANCE;if(i===V0)return t.LUMINANCE_ALPHA;if(i===Ss)return t.DEPTH_COMPONENT;if(i===Is)return t.DEPTH_STENCIL;if(i===H0)return t.RED;if(i===Wf)return t.RED_INTEGER;if(i===G0)return t.RG;if(i===Xf)return t.RG_INTEGER;if(i===$f)return t.RGBA_INTEGER;if(i===Jo||i===el||i===tl||i===nl)if(a===st)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Jo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===el)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===tl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===nl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Jo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===el)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===tl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===nl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===pd||i===md||i===gd||i===xd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===pd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===md)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===gd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===xd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===vd||i===_d||i===yd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===vd||i===_d)return a===st?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===yd)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Sd||i===Md||i===Ed||i===wd||i===Td||i===bd||i===Ad||i===Cd||i===Rd||i===Nd||i===Pd||i===Ld||i===Dd||i===Id)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Sd)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Md)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ed)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===wd)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Td)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===bd)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ad)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Cd)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Rd)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Nd)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pd)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ld)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Dd)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Id)return a===st?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===il||i===Ud||i===kd)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===il)return a===st?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ud)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===kd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===W0||i===Od||i===Fd||i===zd)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===il)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Od)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Fd)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===zd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ds?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class hb extends wn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ua extends ln{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pb={type:"move"};class nu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ua,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ua,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ua,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const g=n.getJointPose(_,i),u=this._getHandJoint(c,_);g!==null&&(u.matrix.fromArray(g.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=g.radius),u.visible=g!==null}const f=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],h=f.position.distanceTo(p.position),m=.02,x=.005;c.inputState.pinching&&h>m+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=m-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(pb)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new ua;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const mb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gb=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class xb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new on,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new rr({vertexShader:mb,fragmentShader:gb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Jn(new Zl(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class vb extends js{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,f=null,p=null,h=null,m=null,x=null;const _=new xb,g=n.getContextAttributes();let u=null,v=null;const y=[],S=[],N=new at;let A=null;const w=new wn;w.viewport=new Mt;const R=new wn;R.viewport=new Mt;const b=[w,R],M=new hb;let P=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let ne=y[H];return ne===void 0&&(ne=new nu,y[H]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(H){let ne=y[H];return ne===void 0&&(ne=new nu,y[H]=ne),ne.getGripSpace()},this.getHand=function(H){let ne=y[H];return ne===void 0&&(ne=new nu,y[H]=ne),ne.getHandSpace()};function O(H){const ne=S.indexOf(H.inputSource);if(ne===-1)return;const ue=y[ne];ue!==void 0&&(ue.update(H.inputSource,H.frame,c||a),ue.dispatchEvent({type:H.type,data:H.inputSource}))}function Y(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",Y),r.removeEventListener("inputsourceschange",X);for(let H=0;H<y.length;H++){const ne=S[H];ne!==null&&(S[H]=null,y[H].disconnect(ne))}P=null,G=null,_.reset(),e.setRenderTarget(u),m=null,h=null,p=null,r=null,v=null,re.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(N.width,N.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){s=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){o=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(H){c=H},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return p},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(H){if(r=H,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",Y),r.addEventListener("inputsourceschange",X),g.xrCompatible!==!0&&await n.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(N),r.renderState.layers===void 0){const ne={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,n,ne),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),v=new Ur(m.framebufferWidth,m.framebufferHeight,{format:jn,type:bi,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let ne=null,ue=null,ie=null;g.depth&&(ie=g.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ne=g.stencil?Is:Ss,ue=g.stencil?Ds:Ir);const ve={colorFormat:n.RGBA8,depthFormat:ie,scaleFactor:s};p=new XRWebGLBinding(r,n),h=p.createProjectionLayer(ve),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new Ur(h.textureWidth,h.textureHeight,{format:jn,type:bi,depthTexture:new av(h.textureWidth,h.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),re.setContext(r),re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function X(H){for(let ne=0;ne<H.removed.length;ne++){const ue=H.removed[ne],ie=S.indexOf(ue);ie>=0&&(S[ie]=null,y[ie].disconnect(ue))}for(let ne=0;ne<H.added.length;ne++){const ue=H.added[ne];let ie=S.indexOf(ue);if(ie===-1){for(let ge=0;ge<y.length;ge++)if(ge>=S.length){S.push(ue),ie=ge;break}else if(S[ge]===null){S[ge]=ue,ie=ge;break}if(ie===-1)break}const ve=y[ie];ve&&ve.connect(ue)}}const $=new V,ee=new V;function L(H,ne,ue){$.setFromMatrixPosition(ne.matrixWorld),ee.setFromMatrixPosition(ue.matrixWorld);const ie=$.distanceTo(ee),ve=ne.projectionMatrix.elements,ge=ue.projectionMatrix.elements,Ce=ve[14]/(ve[10]-1),it=ve[14]/(ve[10]+1),Ge=(ve[9]+1)/ve[5],ot=(ve[9]-1)/ve[5],U=(ve[8]-1)/ve[0],Ft=(ge[8]+1)/ge[0],Fe=Ce*U,ze=Ce*Ft,Ne=ie/(-U+Ft),rt=Ne*-U;if(ne.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(rt),H.translateZ(Ne),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert(),ve[10]===-1)H.projectionMatrix.copy(ne.projectionMatrix),H.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const Re=Ce+Ne,C=it+Ne,E=Fe-rt,F=ze+(ie-rt),J=Ge*it/C*Re,se=ot*it/C*Re;H.projectionMatrix.makePerspective(E,F,J,se,Re,C),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}}function K(H,ne){ne===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(ne.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(r===null)return;let ne=H.near,ue=H.far;_.texture!==null&&(_.depthNear>0&&(ne=_.depthNear),_.depthFar>0&&(ue=_.depthFar)),M.near=R.near=w.near=ne,M.far=R.far=w.far=ue,(P!==M.near||G!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,G=M.far),w.layers.mask=H.layers.mask|2,R.layers.mask=H.layers.mask|4,M.layers.mask=w.layers.mask|R.layers.mask;const ie=H.parent,ve=M.cameras;K(M,ie);for(let ge=0;ge<ve.length;ge++)K(ve[ge],ie);ve.length===2?L(M,w,R):M.projectionMatrix.copy(w.projectionMatrix),Q(H,M,ie)};function Q(H,ne,ue){ue===null?H.matrix.copy(ne.matrixWorld):(H.matrix.copy(ue.matrixWorld),H.matrix.invert(),H.matrix.multiply(ne.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(ne.projectionMatrix),H.projectionMatrixInverse.copy(ne.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=Bd*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(H){l=H,h!==null&&(h.fixedFoveation=H),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=H)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let ce=null;function z(H,ne){if(f=ne.getViewerPose(c||a),x=ne,f!==null){const ue=f.views;m!==null&&(e.setRenderTargetFramebuffer(v,m.framebuffer),e.setRenderTarget(v));let ie=!1;ue.length!==M.cameras.length&&(M.cameras.length=0,ie=!0);for(let ge=0;ge<ue.length;ge++){const Ce=ue[ge];let it=null;if(m!==null)it=m.getViewport(Ce);else{const ot=p.getViewSubImage(h,Ce);it=ot.viewport,ge===0&&(e.setRenderTargetTextures(v,ot.colorTexture,h.ignoreDepthValues?void 0:ot.depthStencilTexture),e.setRenderTarget(v))}let Ge=b[ge];Ge===void 0&&(Ge=new wn,Ge.layers.enable(ge),Ge.viewport=new Mt,b[ge]=Ge),Ge.matrix.fromArray(Ce.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(Ce.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(it.x,it.y,it.width,it.height),ge===0&&(M.matrix.copy(Ge.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ie===!0&&M.cameras.push(Ge)}const ve=r.enabledFeatures;if(ve&&ve.includes("depth-sensing")){const ge=p.getDepthInformation(ue[0]);ge&&ge.isValid&&ge.texture&&_.init(e,ge,r.renderState)}}for(let ue=0;ue<y.length;ue++){const ie=S[ue],ve=y[ue];ie!==null&&ve!==void 0&&ve.update(ie,ne,c||a)}ce&&ce(H,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),x=null}const re=new sv;re.setAnimationLoop(z),this.setAnimationLoop=function(H){ce=H},this.dispose=function(){}}}const mr=new Ai,_b=new Et;function yb(t,e){function n(g,u){g.matrixAutoUpdate===!0&&g.updateMatrix(),u.value.copy(g.matrix)}function i(g,u){u.color.getRGB(g.fogColor.value,tv(t)),u.isFog?(g.fogNear.value=u.near,g.fogFar.value=u.far):u.isFogExp2&&(g.fogDensity.value=u.density)}function r(g,u,v,y,S){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(g,u):u.isMeshToonMaterial?(s(g,u),p(g,u)):u.isMeshPhongMaterial?(s(g,u),f(g,u)):u.isMeshStandardMaterial?(s(g,u),h(g,u),u.isMeshPhysicalMaterial&&m(g,u,S)):u.isMeshMatcapMaterial?(s(g,u),x(g,u)):u.isMeshDepthMaterial?s(g,u):u.isMeshDistanceMaterial?(s(g,u),_(g,u)):u.isMeshNormalMaterial?s(g,u):u.isLineBasicMaterial?(a(g,u),u.isLineDashedMaterial&&o(g,u)):u.isPointsMaterial?l(g,u,v,y):u.isSpriteMaterial?c(g,u):u.isShadowMaterial?(g.color.value.copy(u.color),g.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(g,u){g.opacity.value=u.opacity,u.color&&g.diffuse.value.copy(u.color),u.emissive&&g.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(g.map.value=u.map,n(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,n(u.alphaMap,g.alphaMapTransform)),u.bumpMap&&(g.bumpMap.value=u.bumpMap,n(u.bumpMap,g.bumpMapTransform),g.bumpScale.value=u.bumpScale,u.side===an&&(g.bumpScale.value*=-1)),u.normalMap&&(g.normalMap.value=u.normalMap,n(u.normalMap,g.normalMapTransform),g.normalScale.value.copy(u.normalScale),u.side===an&&g.normalScale.value.negate()),u.displacementMap&&(g.displacementMap.value=u.displacementMap,n(u.displacementMap,g.displacementMapTransform),g.displacementScale.value=u.displacementScale,g.displacementBias.value=u.displacementBias),u.emissiveMap&&(g.emissiveMap.value=u.emissiveMap,n(u.emissiveMap,g.emissiveMapTransform)),u.specularMap&&(g.specularMap.value=u.specularMap,n(u.specularMap,g.specularMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest);const v=e.get(u),y=v.envMap,S=v.envMapRotation;y&&(g.envMap.value=y,mr.copy(S),mr.x*=-1,mr.y*=-1,mr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(mr.y*=-1,mr.z*=-1),g.envMapRotation.value.setFromMatrix4(_b.makeRotationFromEuler(mr)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=u.reflectivity,g.ior.value=u.ior,g.refractionRatio.value=u.refractionRatio),u.lightMap&&(g.lightMap.value=u.lightMap,g.lightMapIntensity.value=u.lightMapIntensity,n(u.lightMap,g.lightMapTransform)),u.aoMap&&(g.aoMap.value=u.aoMap,g.aoMapIntensity.value=u.aoMapIntensity,n(u.aoMap,g.aoMapTransform))}function a(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,u.map&&(g.map.value=u.map,n(u.map,g.mapTransform))}function o(g,u){g.dashSize.value=u.dashSize,g.totalSize.value=u.dashSize+u.gapSize,g.scale.value=u.scale}function l(g,u,v,y){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.size.value=u.size*v,g.scale.value=y*.5,u.map&&(g.map.value=u.map,n(u.map,g.uvTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,n(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function c(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.rotation.value=u.rotation,u.map&&(g.map.value=u.map,n(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,n(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function f(g,u){g.specular.value.copy(u.specular),g.shininess.value=Math.max(u.shininess,1e-4)}function p(g,u){u.gradientMap&&(g.gradientMap.value=u.gradientMap)}function h(g,u){g.metalness.value=u.metalness,u.metalnessMap&&(g.metalnessMap.value=u.metalnessMap,n(u.metalnessMap,g.metalnessMapTransform)),g.roughness.value=u.roughness,u.roughnessMap&&(g.roughnessMap.value=u.roughnessMap,n(u.roughnessMap,g.roughnessMapTransform)),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)}function m(g,u,v){g.ior.value=u.ior,u.sheen>0&&(g.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),g.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(g.sheenColorMap.value=u.sheenColorMap,n(u.sheenColorMap,g.sheenColorMapTransform)),u.sheenRoughnessMap&&(g.sheenRoughnessMap.value=u.sheenRoughnessMap,n(u.sheenRoughnessMap,g.sheenRoughnessMapTransform))),u.clearcoat>0&&(g.clearcoat.value=u.clearcoat,g.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(g.clearcoatMap.value=u.clearcoatMap,n(u.clearcoatMap,g.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,n(u.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(g.clearcoatNormalMap.value=u.clearcoatNormalMap,n(u.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===an&&g.clearcoatNormalScale.value.negate())),u.dispersion>0&&(g.dispersion.value=u.dispersion),u.iridescence>0&&(g.iridescence.value=u.iridescence,g.iridescenceIOR.value=u.iridescenceIOR,g.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(g.iridescenceMap.value=u.iridescenceMap,n(u.iridescenceMap,g.iridescenceMapTransform)),u.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=u.iridescenceThicknessMap,n(u.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),u.transmission>0&&(g.transmission.value=u.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),u.transmissionMap&&(g.transmissionMap.value=u.transmissionMap,n(u.transmissionMap,g.transmissionMapTransform)),g.thickness.value=u.thickness,u.thicknessMap&&(g.thicknessMap.value=u.thicknessMap,n(u.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=u.attenuationDistance,g.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(g.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(g.anisotropyMap.value=u.anisotropyMap,n(u.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=u.specularIntensity,g.specularColor.value.copy(u.specularColor),u.specularColorMap&&(g.specularColorMap.value=u.specularColorMap,n(u.specularColorMap,g.specularColorMapTransform)),u.specularIntensityMap&&(g.specularIntensityMap.value=u.specularIntensityMap,n(u.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,u){u.matcap&&(g.matcap.value=u.matcap)}function _(g,u){const v=e.get(u).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Sb(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,y){const S=y.program;i.uniformBlockBinding(v,S)}function c(v,y){let S=r[v.id];S===void 0&&(x(v),S=f(v),r[v.id]=S,v.addEventListener("dispose",g));const N=y.program;i.updateUBOMapping(v,N);const A=e.render.frame;s[v.id]!==A&&(h(v),s[v.id]=A)}function f(v){const y=p();v.__bindingPointIndex=y;const S=t.createBuffer(),N=v.__size,A=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,S),t.bufferData(t.UNIFORM_BUFFER,N,A),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,y,S),S}function p(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const y=r[v.id],S=v.uniforms,N=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,y);for(let A=0,w=S.length;A<w;A++){const R=Array.isArray(S[A])?S[A]:[S[A]];for(let b=0,M=R.length;b<M;b++){const P=R[b];if(m(P,A,b,N)===!0){const G=P.__offset,O=Array.isArray(P.value)?P.value:[P.value];let Y=0;for(let X=0;X<O.length;X++){const $=O[X],ee=_($);typeof $=="number"||typeof $=="boolean"?(P.__data[0]=$,t.bufferSubData(t.UNIFORM_BUFFER,G+Y,P.__data)):$.isMatrix3?(P.__data[0]=$.elements[0],P.__data[1]=$.elements[1],P.__data[2]=$.elements[2],P.__data[3]=0,P.__data[4]=$.elements[3],P.__data[5]=$.elements[4],P.__data[6]=$.elements[5],P.__data[7]=0,P.__data[8]=$.elements[6],P.__data[9]=$.elements[7],P.__data[10]=$.elements[8],P.__data[11]=0):($.toArray(P.__data,Y),Y+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,G,P.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(v,y,S,N){const A=v.value,w=y+"_"+S;if(N[w]===void 0)return typeof A=="number"||typeof A=="boolean"?N[w]=A:N[w]=A.clone(),!0;{const R=N[w];if(typeof A=="number"||typeof A=="boolean"){if(R!==A)return N[w]=A,!0}else if(R.equals(A)===!1)return R.copy(A),!0}return!1}function x(v){const y=v.uniforms;let S=0;const N=16;for(let w=0,R=y.length;w<R;w++){const b=Array.isArray(y[w])?y[w]:[y[w]];for(let M=0,P=b.length;M<P;M++){const G=b[M],O=Array.isArray(G.value)?G.value:[G.value];for(let Y=0,X=O.length;Y<X;Y++){const $=O[Y],ee=_($),L=S%N,K=L%ee.boundary,Q=L+K;S+=K,Q!==0&&N-Q<ee.storage&&(S+=N-Q),G.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=S,S+=ee.storage}}}const A=S%N;return A>0&&(S+=N-A),v.__size=S,v.__cache={},this}function _(v){const y={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(y.boundary=4,y.storage=4):v.isVector2?(y.boundary=8,y.storage=8):v.isVector3||v.isColor?(y.boundary=16,y.storage=12):v.isVector4?(y.boundary=16,y.storage=16):v.isMatrix3?(y.boundary=48,y.storage=48):v.isMatrix4?(y.boundary=64,y.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),y}function g(v){const y=v.target;y.removeEventListener("dispose",g);const S=a.indexOf(y.__bindingPointIndex);a.splice(S,1),t.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function u(){for(const v in r)t.deleteBuffer(r[v]);a=[],r={},s={}}return{bind:l,update:c,dispose:u}}class Mb{constructor(e={}){const{canvas:n=c1(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:p=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const x=new Uint32Array(4),_=new Int32Array(4);let g=null,u=null;const v=[],y=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Sn,this.toneMapping=er,this.toneMappingExposure=1;const S=this;let N=!1,A=0,w=0,R=null,b=-1,M=null;const P=new Mt,G=new Mt;let O=null;const Y=new Ve(0);let X=0,$=n.width,ee=n.height,L=1,K=null,Q=null;const ce=new Mt(0,0,$,ee),z=new Mt(0,0,$,ee);let re=!1;const H=new rv;let ne=!1,ue=!1;const ie=new Et,ve=new Et,ge=new V,Ce=new Mt,it={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ge=!1;function ot(){return R===null?L:1}let U=i;function Ft(T,I){return n.getContext(T,I)}try{const T={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:f,failIfMajorPerformanceCaveat:p};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${jf}`),n.addEventListener("webglcontextlost",te,!1),n.addEventListener("webglcontextrestored",xe,!1),n.addEventListener("webglcontextcreationerror",pe,!1),U===null){const I="webgl2";if(U=Ft(I,T),U===null)throw Ft(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Fe,ze,Ne,rt,Re,C,E,F,J,se,Z,Ee,he,ye,qe,oe,Se,Pe,Le,Me,Xe,Be,lt,D;function fe(){Fe=new Aw(U),Fe.init(),Be=new fb(U,Fe),ze=new yw(U,Fe,e,Be),Ne=new cb(U,Fe),ze.reverseDepthBuffer&&h&&Ne.buffers.depth.setReversed(!0),rt=new Nw(U),Re=new qT,C=new db(U,Fe,Ne,Re,ze,Be,rt),E=new Mw(S),F=new bw(S),J=new k1(U),lt=new vw(U,J),se=new Cw(U,J,rt,lt),Z=new Lw(U,se,J,rt),Le=new Pw(U,ze,C),oe=new Sw(Re),Ee=new $T(S,E,F,Fe,ze,lt,oe),he=new yb(S,Re),ye=new KT,qe=new nb(Fe),Pe=new xw(S,E,F,Ne,Z,m,l),Se=new ob(S,Z,ze),D=new Sb(U,rt,ze,Ne),Me=new _w(U,Fe,rt),Xe=new Rw(U,Fe,rt),rt.programs=Ee.programs,S.capabilities=ze,S.extensions=Fe,S.properties=Re,S.renderLists=ye,S.shadowMap=Se,S.state=Ne,S.info=rt}fe();const W=new vb(S,U);this.xr=W,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const T=Fe.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Fe.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return L},this.setPixelRatio=function(T){T!==void 0&&(L=T,this.setSize($,ee,!1))},this.getSize=function(T){return T.set($,ee)},this.setSize=function(T,I,B=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=T,ee=I,n.width=Math.floor(T*L),n.height=Math.floor(I*L),B===!0&&(n.style.width=T+"px",n.style.height=I+"px"),this.setViewport(0,0,T,I)},this.getDrawingBufferSize=function(T){return T.set($*L,ee*L).floor()},this.setDrawingBufferSize=function(T,I,B){$=T,ee=I,L=B,n.width=Math.floor(T*B),n.height=Math.floor(I*B),this.setViewport(0,0,T,I)},this.getCurrentViewport=function(T){return T.copy(P)},this.getViewport=function(T){return T.copy(ce)},this.setViewport=function(T,I,B,j){T.isVector4?ce.set(T.x,T.y,T.z,T.w):ce.set(T,I,B,j),Ne.viewport(P.copy(ce).multiplyScalar(L).round())},this.getScissor=function(T){return T.copy(z)},this.setScissor=function(T,I,B,j){T.isVector4?z.set(T.x,T.y,T.z,T.w):z.set(T,I,B,j),Ne.scissor(G.copy(z).multiplyScalar(L).round())},this.getScissorTest=function(){return re},this.setScissorTest=function(T){Ne.setScissorTest(re=T)},this.setOpaqueSort=function(T){K=T},this.setTransparentSort=function(T){Q=T},this.getClearColor=function(T){return T.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor.apply(Pe,arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha.apply(Pe,arguments)},this.clear=function(T=!0,I=!0,B=!0){let j=0;if(T){let k=!1;if(R!==null){const le=R.texture.format;k=le===$f||le===Xf||le===Wf}if(k){const le=R.texture.type,me=le===bi||le===Ir||le===Fa||le===Ds||le===Hf||le===Gf,we=Pe.getClearColor(),Te=Pe.getClearAlpha(),De=we.r,ke=we.g,be=we.b;me?(x[0]=De,x[1]=ke,x[2]=be,x[3]=Te,U.clearBufferuiv(U.COLOR,0,x)):(_[0]=De,_[1]=ke,_[2]=be,_[3]=Te,U.clearBufferiv(U.COLOR,0,_))}else j|=U.COLOR_BUFFER_BIT}I&&(j|=U.DEPTH_BUFFER_BIT),B&&(j|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",te,!1),n.removeEventListener("webglcontextrestored",xe,!1),n.removeEventListener("webglcontextcreationerror",pe,!1),ye.dispose(),qe.dispose(),Re.dispose(),E.dispose(),F.dispose(),Z.dispose(),lt.dispose(),D.dispose(),Ee.dispose(),W.dispose(),W.removeEventListener("sessionstart",Zf),W.removeEventListener("sessionend",Qf),lr.stop()};function te(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;const T=rt.autoReset,I=Se.enabled,B=Se.autoUpdate,j=Se.needsUpdate,k=Se.type;fe(),rt.autoReset=T,Se.enabled=I,Se.autoUpdate=B,Se.needsUpdate=j,Se.type=k}function pe(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Ue(T){const I=T.target;I.removeEventListener("dispose",Ue),_t(I)}function _t(T){zt(T),Re.remove(T)}function zt(T){const I=Re.get(T).programs;I!==void 0&&(I.forEach(function(B){Ee.releaseProgram(B)}),T.isShaderMaterial&&Ee.releaseShaderCache(T))}this.renderBufferDirect=function(T,I,B,j,k,le){I===null&&(I=it);const me=k.isMesh&&k.matrixWorld.determinant()<0,we=pv(T,I,B,j,k);Ne.setMaterial(j,me);let Te=B.index,De=1;if(j.wireframe===!0){if(Te=se.getWireframeAttribute(B),Te===void 0)return;De=2}const ke=B.drawRange,be=B.attributes.position;let Ze=ke.start*De,ct=(ke.start+ke.count)*De;le!==null&&(Ze=Math.max(Ze,le.start*De),ct=Math.min(ct,(le.start+le.count)*De)),Te!==null?(Ze=Math.max(Ze,0),ct=Math.min(ct,Te.count)):be!=null&&(Ze=Math.max(Ze,0),ct=Math.min(ct,be.count));const dt=ct-Ze;if(dt<0||dt===1/0)return;lt.setup(k,j,we,B,Te);let Zt,Qe=Me;if(Te!==null&&(Zt=J.get(Te),Qe=Xe,Qe.setIndex(Zt)),k.isMesh)j.wireframe===!0?(Ne.setLineWidth(j.wireframeLinewidth*ot()),Qe.setMode(U.LINES)):Qe.setMode(U.TRIANGLES);else if(k.isLine){let Ae=j.linewidth;Ae===void 0&&(Ae=1),Ne.setLineWidth(Ae*ot()),k.isLineSegments?Qe.setMode(U.LINES):k.isLineLoop?Qe.setMode(U.LINE_LOOP):Qe.setMode(U.LINE_STRIP)}else k.isPoints?Qe.setMode(U.POINTS):k.isSprite&&Qe.setMode(U.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Qe.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Fe.get("WEBGL_multi_draw"))Qe.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Ae=k._multiDrawStarts,si=k._multiDrawCounts,Je=k._multiDrawCount,Ln=Te?J.get(Te).bytesPerElement:1,zr=Re.get(j).currentProgram.getUniforms();for(let un=0;un<Je;un++)zr.setValue(U,"_gl_DrawID",un),Qe.render(Ae[un]/Ln,si[un])}else if(k.isInstancedMesh)Qe.renderInstances(Ze,dt,k.count);else if(B.isInstancedBufferGeometry){const Ae=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,si=Math.min(B.instanceCount,Ae);Qe.renderInstances(Ze,dt,si)}else Qe.render(Ze,dt)};function et(T,I,B){T.transparent===!0&&T.side===pi&&T.forceSinglePass===!1?(T.side=an,T.needsUpdate=!0,Qa(T,I,B),T.side=ir,T.needsUpdate=!0,Qa(T,I,B),T.side=pi):Qa(T,I,B)}this.compile=function(T,I,B=null){B===null&&(B=T),u=qe.get(B),u.init(I),y.push(u),B.traverseVisible(function(k){k.isLight&&k.layers.test(I.layers)&&(u.pushLight(k),k.castShadow&&u.pushShadow(k))}),T!==B&&T.traverseVisible(function(k){k.isLight&&k.layers.test(I.layers)&&(u.pushLight(k),k.castShadow&&u.pushShadow(k))}),u.setupLights();const j=new Set;return T.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const le=k.material;if(le)if(Array.isArray(le))for(let me=0;me<le.length;me++){const we=le[me];et(we,B,k),j.add(we)}else et(le,B,k),j.add(le)}),y.pop(),u=null,j},this.compileAsync=function(T,I,B=null){const j=this.compile(T,I,B);return new Promise(k=>{function le(){if(j.forEach(function(me){Re.get(me).currentProgram.isReady()&&j.delete(me)}),j.size===0){k(T);return}setTimeout(le,10)}Fe.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let Pn=null;function ri(T){Pn&&Pn(T)}function Zf(){lr.stop()}function Qf(){lr.start()}const lr=new sv;lr.setAnimationLoop(ri),typeof self<"u"&&lr.setContext(self),this.setAnimationLoop=function(T){Pn=T,W.setAnimationLoop(T),T===null?lr.stop():lr.start()},W.addEventListener("sessionstart",Zf),W.addEventListener("sessionend",Qf),this.render=function(T,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(I),I=W.getCamera()),T.isScene===!0&&T.onBeforeRender(S,T,I,R),u=qe.get(T,y.length),u.init(I),y.push(u),ve.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),H.setFromProjectionMatrix(ve),ue=this.localClippingEnabled,ne=oe.init(this.clippingPlanes,ue),g=ye.get(T,v.length),g.init(),v.push(g),W.enabled===!0&&W.isPresenting===!0){const le=S.xr.getDepthSensingMesh();le!==null&&Jl(le,I,-1/0,S.sortObjects)}Jl(T,I,0,S.sortObjects),g.finish(),S.sortObjects===!0&&g.sort(K,Q),Ge=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,Ge&&Pe.addToRenderList(g,T),this.info.render.frame++,ne===!0&&oe.beginShadows();const B=u.state.shadowsArray;Se.render(B,T,I),ne===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=g.opaque,k=g.transmissive;if(u.setupLights(),I.isArrayCamera){const le=I.cameras;if(k.length>0)for(let me=0,we=le.length;me<we;me++){const Te=le[me];eh(j,k,T,Te)}Ge&&Pe.render(T);for(let me=0,we=le.length;me<we;me++){const Te=le[me];Jf(g,T,Te,Te.viewport)}}else k.length>0&&eh(j,k,T,I),Ge&&Pe.render(T),Jf(g,T,I);R!==null&&(C.updateMultisampleRenderTarget(R),C.updateRenderTargetMipmap(R)),T.isScene===!0&&T.onAfterRender(S,T,I),lt.resetDefaultState(),b=-1,M=null,y.pop(),y.length>0?(u=y[y.length-1],ne===!0&&oe.setGlobalState(S.clippingPlanes,u.state.camera)):u=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function Jl(T,I,B,j){if(T.visible===!1)return;if(T.layers.test(I.layers)){if(T.isGroup)B=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(I);else if(T.isLight)u.pushLight(T),T.castShadow&&u.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||H.intersectsSprite(T)){j&&Ce.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ve);const me=Z.update(T),we=T.material;we.visible&&g.push(T,me,we,B,Ce.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||H.intersectsObject(T))){const me=Z.update(T),we=T.material;if(j&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ce.copy(T.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),Ce.copy(me.boundingSphere.center)),Ce.applyMatrix4(T.matrixWorld).applyMatrix4(ve)),Array.isArray(we)){const Te=me.groups;for(let De=0,ke=Te.length;De<ke;De++){const be=Te[De],Ze=we[be.materialIndex];Ze&&Ze.visible&&g.push(T,me,Ze,B,Ce.z,be)}}else we.visible&&g.push(T,me,we,B,Ce.z,null)}}const le=T.children;for(let me=0,we=le.length;me<we;me++)Jl(le[me],I,B,j)}function Jf(T,I,B,j){const k=T.opaque,le=T.transmissive,me=T.transparent;u.setupLightsView(B),ne===!0&&oe.setGlobalState(S.clippingPlanes,B),j&&Ne.viewport(P.copy(j)),k.length>0&&Za(k,I,B),le.length>0&&Za(le,I,B),me.length>0&&Za(me,I,B),Ne.buffers.depth.setTest(!0),Ne.buffers.depth.setMask(!0),Ne.buffers.color.setMask(!0),Ne.setPolygonOffset(!1)}function eh(T,I,B,j){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[j.id]===void 0&&(u.state.transmissionRenderTarget[j.id]=new Ur(1,1,{generateMipmaps:!0,type:Fe.has("EXT_color_buffer_half_float")||Fe.has("EXT_color_buffer_float")?Wa:bi,minFilter:br,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace}));const le=u.state.transmissionRenderTarget[j.id],me=j.viewport||P;le.setSize(me.z,me.w);const we=S.getRenderTarget();S.setRenderTarget(le),S.getClearColor(Y),X=S.getClearAlpha(),X<1&&S.setClearColor(16777215,.5),S.clear(),Ge&&Pe.render(B);const Te=S.toneMapping;S.toneMapping=er;const De=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),u.setupLightsView(j),ne===!0&&oe.setGlobalState(S.clippingPlanes,j),Za(T,B,j),C.updateMultisampleRenderTarget(le),C.updateRenderTargetMipmap(le),Fe.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let be=0,Ze=I.length;be<Ze;be++){const ct=I[be],dt=ct.object,Zt=ct.geometry,Qe=ct.material,Ae=ct.group;if(Qe.side===pi&&dt.layers.test(j.layers)){const si=Qe.side;Qe.side=an,Qe.needsUpdate=!0,th(dt,B,j,Zt,Qe,Ae),Qe.side=si,Qe.needsUpdate=!0,ke=!0}}ke===!0&&(C.updateMultisampleRenderTarget(le),C.updateRenderTargetMipmap(le))}S.setRenderTarget(we),S.setClearColor(Y,X),De!==void 0&&(j.viewport=De),S.toneMapping=Te}function Za(T,I,B){const j=I.isScene===!0?I.overrideMaterial:null;for(let k=0,le=T.length;k<le;k++){const me=T[k],we=me.object,Te=me.geometry,De=j===null?me.material:j,ke=me.group;we.layers.test(B.layers)&&th(we,I,B,Te,De,ke)}}function th(T,I,B,j,k,le){T.onBeforeRender(S,I,B,j,k,le),T.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),k.onBeforeRender(S,I,B,j,T,le),k.transparent===!0&&k.side===pi&&k.forceSinglePass===!1?(k.side=an,k.needsUpdate=!0,S.renderBufferDirect(B,I,j,k,T,le),k.side=ir,k.needsUpdate=!0,S.renderBufferDirect(B,I,j,k,T,le),k.side=pi):S.renderBufferDirect(B,I,j,k,T,le),T.onAfterRender(S,I,B,j,k,le)}function Qa(T,I,B){I.isScene!==!0&&(I=it);const j=Re.get(T),k=u.state.lights,le=u.state.shadowsArray,me=k.state.version,we=Ee.getParameters(T,k.state,le,I,B),Te=Ee.getProgramCacheKey(we);let De=j.programs;j.environment=T.isMeshStandardMaterial?I.environment:null,j.fog=I.fog,j.envMap=(T.isMeshStandardMaterial?F:E).get(T.envMap||j.environment),j.envMapRotation=j.environment!==null&&T.envMap===null?I.environmentRotation:T.envMapRotation,De===void 0&&(T.addEventListener("dispose",Ue),De=new Map,j.programs=De);let ke=De.get(Te);if(ke!==void 0){if(j.currentProgram===ke&&j.lightsStateVersion===me)return ih(T,we),ke}else we.uniforms=Ee.getUniforms(T),T.onBeforeCompile(we,S),ke=Ee.acquireProgram(we,Te),De.set(Te,ke),j.uniforms=we.uniforms;const be=j.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(be.clippingPlanes=oe.uniform),ih(T,we),j.needsLights=gv(T),j.lightsStateVersion=me,j.needsLights&&(be.ambientLightColor.value=k.state.ambient,be.lightProbe.value=k.state.probe,be.directionalLights.value=k.state.directional,be.directionalLightShadows.value=k.state.directionalShadow,be.spotLights.value=k.state.spot,be.spotLightShadows.value=k.state.spotShadow,be.rectAreaLights.value=k.state.rectArea,be.ltc_1.value=k.state.rectAreaLTC1,be.ltc_2.value=k.state.rectAreaLTC2,be.pointLights.value=k.state.point,be.pointLightShadows.value=k.state.pointShadow,be.hemisphereLights.value=k.state.hemi,be.directionalShadowMap.value=k.state.directionalShadowMap,be.directionalShadowMatrix.value=k.state.directionalShadowMatrix,be.spotShadowMap.value=k.state.spotShadowMap,be.spotLightMatrix.value=k.state.spotLightMatrix,be.spotLightMap.value=k.state.spotLightMap,be.pointShadowMap.value=k.state.pointShadowMap,be.pointShadowMatrix.value=k.state.pointShadowMatrix),j.currentProgram=ke,j.uniformsList=null,ke}function nh(T){if(T.uniformsList===null){const I=T.currentProgram.getUniforms();T.uniformsList=rl.seqWithValue(I.seq,T.uniforms)}return T.uniformsList}function ih(T,I){const B=Re.get(T);B.outputColorSpace=I.outputColorSpace,B.batching=I.batching,B.batchingColor=I.batchingColor,B.instancing=I.instancing,B.instancingColor=I.instancingColor,B.instancingMorph=I.instancingMorph,B.skinning=I.skinning,B.morphTargets=I.morphTargets,B.morphNormals=I.morphNormals,B.morphColors=I.morphColors,B.morphTargetsCount=I.morphTargetsCount,B.numClippingPlanes=I.numClippingPlanes,B.numIntersection=I.numClipIntersection,B.vertexAlphas=I.vertexAlphas,B.vertexTangents=I.vertexTangents,B.toneMapping=I.toneMapping}function pv(T,I,B,j,k){I.isScene!==!0&&(I=it),C.resetTextureUnits();const le=I.fog,me=j.isMeshStandardMaterial?I.environment:null,we=R===null?S.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Bs,Te=(j.isMeshStandardMaterial?F:E).get(j.envMap||me),De=j.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,ke=!!B.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),be=!!B.morphAttributes.position,Ze=!!B.morphAttributes.normal,ct=!!B.morphAttributes.color;let dt=er;j.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(dt=S.toneMapping);const Zt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Qe=Zt!==void 0?Zt.length:0,Ae=Re.get(j),si=u.state.lights;if(ne===!0&&(ue===!0||T!==M)){const _n=T===M&&j.id===b;oe.setState(j,T,_n)}let Je=!1;j.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==si.state.version||Ae.outputColorSpace!==we||k.isBatchedMesh&&Ae.batching===!1||!k.isBatchedMesh&&Ae.batching===!0||k.isBatchedMesh&&Ae.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Ae.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Ae.instancing===!1||!k.isInstancedMesh&&Ae.instancing===!0||k.isSkinnedMesh&&Ae.skinning===!1||!k.isSkinnedMesh&&Ae.skinning===!0||k.isInstancedMesh&&Ae.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Ae.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Ae.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Ae.instancingMorph===!1&&k.morphTexture!==null||Ae.envMap!==Te||j.fog===!0&&Ae.fog!==le||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==oe.numPlanes||Ae.numIntersection!==oe.numIntersection)||Ae.vertexAlphas!==De||Ae.vertexTangents!==ke||Ae.morphTargets!==be||Ae.morphNormals!==Ze||Ae.morphColors!==ct||Ae.toneMapping!==dt||Ae.morphTargetsCount!==Qe)&&(Je=!0):(Je=!0,Ae.__version=j.version);let Ln=Ae.currentProgram;Je===!0&&(Ln=Qa(j,I,k));let zr=!1,un=!1,Hs=!1;const ft=Ln.getUniforms(),$n=Ae.uniforms;if(Ne.useProgram(Ln.program)&&(zr=!0,un=!0,Hs=!0),j.id!==b&&(b=j.id,un=!0),zr||M!==T){Ne.buffers.depth.getReversed()?(ie.copy(T.projectionMatrix),d1(ie),f1(ie),ft.setValue(U,"projectionMatrix",ie)):ft.setValue(U,"projectionMatrix",T.projectionMatrix),ft.setValue(U,"viewMatrix",T.matrixWorldInverse);const Ri=ft.map.cameraPosition;Ri!==void 0&&Ri.setValue(U,ge.setFromMatrixPosition(T.matrixWorld)),ze.logarithmicDepthBuffer&&ft.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&ft.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,un=!0,Hs=!0)}if(k.isSkinnedMesh){ft.setOptional(U,k,"bindMatrix"),ft.setOptional(U,k,"bindMatrixInverse");const _n=k.skeleton;_n&&(_n.boneTexture===null&&_n.computeBoneTexture(),ft.setValue(U,"boneTexture",_n.boneTexture,C))}k.isBatchedMesh&&(ft.setOptional(U,k,"batchingTexture"),ft.setValue(U,"batchingTexture",k._matricesTexture,C),ft.setOptional(U,k,"batchingIdTexture"),ft.setValue(U,"batchingIdTexture",k._indirectTexture,C),ft.setOptional(U,k,"batchingColorTexture"),k._colorsTexture!==null&&ft.setValue(U,"batchingColorTexture",k._colorsTexture,C));const Gs=B.morphAttributes;if((Gs.position!==void 0||Gs.normal!==void 0||Gs.color!==void 0)&&Le.update(k,B,Ln),(un||Ae.receiveShadow!==k.receiveShadow)&&(Ae.receiveShadow=k.receiveShadow,ft.setValue(U,"receiveShadow",k.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&($n.envMap.value=Te,$n.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&I.environment!==null&&($n.envMapIntensity.value=I.environmentIntensity),un&&(ft.setValue(U,"toneMappingExposure",S.toneMappingExposure),Ae.needsLights&&mv($n,Hs),le&&j.fog===!0&&he.refreshFogUniforms($n,le),he.refreshMaterialUniforms($n,j,L,ee,u.state.transmissionRenderTarget[T.id]),rl.upload(U,nh(Ae),$n,C)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(rl.upload(U,nh(Ae),$n,C),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&ft.setValue(U,"center",k.center),ft.setValue(U,"modelViewMatrix",k.modelViewMatrix),ft.setValue(U,"normalMatrix",k.normalMatrix),ft.setValue(U,"modelMatrix",k.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const _n=j.uniformsGroups;for(let Ri=0,Ni=_n.length;Ri<Ni;Ri++){const rh=_n[Ri];D.update(rh,Ln),D.bind(rh,Ln)}}return Ln}function mv(T,I){T.ambientLightColor.needsUpdate=I,T.lightProbe.needsUpdate=I,T.directionalLights.needsUpdate=I,T.directionalLightShadows.needsUpdate=I,T.pointLights.needsUpdate=I,T.pointLightShadows.needsUpdate=I,T.spotLights.needsUpdate=I,T.spotLightShadows.needsUpdate=I,T.rectAreaLights.needsUpdate=I,T.hemisphereLights.needsUpdate=I}function gv(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(T,I,B){Re.get(T.texture).__webglTexture=I,Re.get(T.depthTexture).__webglTexture=B;const j=Re.get(T);j.__hasExternalTextures=!0,j.__autoAllocateDepthBuffer=B===void 0,j.__autoAllocateDepthBuffer||Fe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),j.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,I){const B=Re.get(T);B.__webglFramebuffer=I,B.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(T,I=0,B=0){R=T,A=I,w=B;let j=!0,k=null,le=!1,me=!1;if(T){const Te=Re.get(T);if(Te.__useDefaultFramebuffer!==void 0)Ne.bindFramebuffer(U.FRAMEBUFFER,null),j=!1;else if(Te.__webglFramebuffer===void 0)C.setupRenderTarget(T);else if(Te.__hasExternalTextures)C.rebindTextures(T,Re.get(T.texture).__webglTexture,Re.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const be=T.depthTexture;if(Te.__boundDepthTexture!==be){if(be!==null&&Re.has(be)&&(T.width!==be.image.width||T.height!==be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(T)}}const De=T.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(me=!0);const ke=Re.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(ke[I])?k=ke[I][B]:k=ke[I],le=!0):T.samples>0&&C.useMultisampledRTT(T)===!1?k=Re.get(T).__webglMultisampledFramebuffer:Array.isArray(ke)?k=ke[B]:k=ke,P.copy(T.viewport),G.copy(T.scissor),O=T.scissorTest}else P.copy(ce).multiplyScalar(L).floor(),G.copy(z).multiplyScalar(L).floor(),O=re;if(Ne.bindFramebuffer(U.FRAMEBUFFER,k)&&j&&Ne.drawBuffers(T,k),Ne.viewport(P),Ne.scissor(G),Ne.setScissorTest(O),le){const Te=Re.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+I,Te.__webglTexture,B)}else if(me){const Te=Re.get(T.texture),De=I||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Te.__webglTexture,B||0,De)}b=-1},this.readRenderTargetPixels=function(T,I,B,j,k,le,me){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=Re.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&me!==void 0&&(we=we[me]),we){Ne.bindFramebuffer(U.FRAMEBUFFER,we);try{const Te=T.texture,De=Te.format,ke=Te.type;if(!ze.textureFormatReadable(De)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ze.textureTypeReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=T.width-j&&B>=0&&B<=T.height-k&&U.readPixels(I,B,j,k,Be.convert(De),Be.convert(ke),le)}finally{const Te=R!==null?Re.get(R).__webglFramebuffer:null;Ne.bindFramebuffer(U.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(T,I,B,j,k,le,me){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=Re.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&me!==void 0&&(we=we[me]),we){const Te=T.texture,De=Te.format,ke=Te.type;if(!ze.textureFormatReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ze.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=T.width-j&&B>=0&&B<=T.height-k){Ne.bindFramebuffer(U.FRAMEBUFFER,we);const be=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,be),U.bufferData(U.PIXEL_PACK_BUFFER,le.byteLength,U.STREAM_READ),U.readPixels(I,B,j,k,Be.convert(De),Be.convert(ke),0);const Ze=R!==null?Re.get(R).__webglFramebuffer:null;Ne.bindFramebuffer(U.FRAMEBUFFER,Ze);const ct=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await u1(U,ct,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,be),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,le),U.deleteBuffer(be),U.deleteSync(ct),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,I=null,B=0){T.isTexture!==!0&&(la("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,T=arguments[1]);const j=Math.pow(2,-B),k=Math.floor(T.image.width*j),le=Math.floor(T.image.height*j),me=I!==null?I.x:0,we=I!==null?I.y:0;C.setTexture2D(T,0),U.copyTexSubImage2D(U.TEXTURE_2D,B,0,0,me,we,k,le),Ne.unbindTexture()},this.copyTextureToTexture=function(T,I,B=null,j=null,k=0){T.isTexture!==!0&&(la("WebGLRenderer: copyTextureToTexture function signature has changed."),j=arguments[0]||null,T=arguments[1],I=arguments[2],k=arguments[3]||0,B=null);let le,me,we,Te,De,ke,be,Ze,ct;const dt=T.isCompressedTexture?T.mipmaps[k]:T.image;B!==null?(le=B.max.x-B.min.x,me=B.max.y-B.min.y,we=B.isBox3?B.max.z-B.min.z:1,Te=B.min.x,De=B.min.y,ke=B.isBox3?B.min.z:0):(le=dt.width,me=dt.height,we=dt.depth||1,Te=0,De=0,ke=0),j!==null?(be=j.x,Ze=j.y,ct=j.z):(be=0,Ze=0,ct=0);const Zt=Be.convert(I.format),Qe=Be.convert(I.type);let Ae;I.isData3DTexture?(C.setTexture3D(I,0),Ae=U.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(C.setTexture2DArray(I,0),Ae=U.TEXTURE_2D_ARRAY):(C.setTexture2D(I,0),Ae=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,I.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,I.unpackAlignment);const si=U.getParameter(U.UNPACK_ROW_LENGTH),Je=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ln=U.getParameter(U.UNPACK_SKIP_PIXELS),zr=U.getParameter(U.UNPACK_SKIP_ROWS),un=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,dt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,dt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Te),U.pixelStorei(U.UNPACK_SKIP_ROWS,De),U.pixelStorei(U.UNPACK_SKIP_IMAGES,ke);const Hs=T.isDataArrayTexture||T.isData3DTexture,ft=I.isDataArrayTexture||I.isData3DTexture;if(T.isRenderTargetTexture||T.isDepthTexture){const $n=Re.get(T),Gs=Re.get(I),_n=Re.get($n.__renderTarget),Ri=Re.get(Gs.__renderTarget);Ne.bindFramebuffer(U.READ_FRAMEBUFFER,_n.__webglFramebuffer),Ne.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ri.__webglFramebuffer);for(let Ni=0;Ni<we;Ni++)Hs&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Re.get(T).__webglTexture,k,ke+Ni),T.isDepthTexture?(ft&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Re.get(I).__webglTexture,k,ct+Ni),U.blitFramebuffer(Te,De,le,me,be,Ze,le,me,U.DEPTH_BUFFER_BIT,U.NEAREST)):ft?U.copyTexSubImage3D(Ae,k,be,Ze,ct+Ni,Te,De,le,me):U.copyTexSubImage2D(Ae,k,be,Ze,ct+Ni,Te,De,le,me);Ne.bindFramebuffer(U.READ_FRAMEBUFFER,null),Ne.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else ft?T.isDataTexture||T.isData3DTexture?U.texSubImage3D(Ae,k,be,Ze,ct,le,me,we,Zt,Qe,dt.data):I.isCompressedArrayTexture?U.compressedTexSubImage3D(Ae,k,be,Ze,ct,le,me,we,Zt,dt.data):U.texSubImage3D(Ae,k,be,Ze,ct,le,me,we,Zt,Qe,dt):T.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,k,be,Ze,le,me,Zt,Qe,dt.data):T.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,k,be,Ze,dt.width,dt.height,Zt,dt.data):U.texSubImage2D(U.TEXTURE_2D,k,be,Ze,le,me,Zt,Qe,dt);U.pixelStorei(U.UNPACK_ROW_LENGTH,si),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Je),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ln),U.pixelStorei(U.UNPACK_SKIP_ROWS,zr),U.pixelStorei(U.UNPACK_SKIP_IMAGES,un),k===0&&I.generateMipmaps&&U.generateMipmap(Ae),Ne.unbindTexture()},this.copyTextureToTexture3D=function(T,I,B=null,j=null,k=0){return T.isTexture!==!0&&(la("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,j=arguments[1]||null,T=arguments[2],I=arguments[3],k=arguments[4]||0),la('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,I,B,j,k)},this.initRenderTarget=function(T){Re.get(T).__webglFramebuffer===void 0&&C.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?C.setTextureCube(T,0):T.isData3DTexture?C.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?C.setTexture2DArray(T,0):C.setTexture2D(T,0),Ne.unbindTexture()},this.resetState=function(){A=0,w=0,R=null,Ne.reset(),lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=Ye._getDrawingBufferColorSpace(e),n.unpackColorSpace=Ye._getUnpackColorSpace()}}class Eb extends ln{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ai,this.environmentIntensity=1,this.environmentRotation=new Ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class dv extends Ya{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Ve(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const dm=new Et,Vd=new K0,zo=new Kl,Bo=new V;class wb extends ln{constructor(e=new ii,n=new dv){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),zo.copy(i.boundingSphere),zo.applyMatrix4(r),zo.radius+=s,e.ray.intersectsSphere(zo)===!1)return;dm.copy(r).invert(),Vd.copy(e.ray).applyMatrix4(dm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,p=i.attributes.position;if(c!==null){const h=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let x=h,_=m;x<_;x++){const g=c.getX(x);Bo.fromBufferAttribute(p,g),fm(Bo,g,l,r,e,n,this)}}else{const h=Math.max(0,a.start),m=Math.min(p.count,a.start+a.count);for(let x=h,_=m;x<_;x++)Bo.fromBufferAttribute(p,x),fm(Bo,x,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function fm(t,e,n,i,r,s,a){const o=Vd.distanceSqToPoint(t);if(o<n){const l=new V;Vd.closestPointToPoint(t,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Kf extends ii{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const f=[],p=new V,h=new V,m=[],x=[],_=[],g=[];for(let u=0;u<=i;u++){const v=[],y=u/i;let S=0;u===0&&a===0?S=.5/n:u===i&&l===Math.PI&&(S=-.5/n);for(let N=0;N<=n;N++){const A=N/n;p.x=-e*Math.cos(r+A*s)*Math.sin(a+y*o),p.y=e*Math.cos(a+y*o),p.z=e*Math.sin(r+A*s)*Math.sin(a+y*o),x.push(p.x,p.y,p.z),h.copy(p).normalize(),_.push(h.x,h.y,h.z),g.push(A+S,1-y),v.push(c++)}f.push(v)}for(let u=0;u<i;u++)for(let v=0;v<n;v++){const y=f[u][v+1],S=f[u][v],N=f[u+1][v],A=f[u+1][v+1];(u!==0||a>0)&&m.push(y,S,A),(u!==i-1||l<Math.PI)&&m.push(S,N,A)}this.setIndex(m),this.setAttribute("position",new ni(x,3)),this.setAttribute("normal",new ni(_,3)),this.setAttribute("uv",new ni(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kf(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Tb{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=hm(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=hm();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function hm(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jf);const fv=({state:t="IDLE",size:e=40,className:n="",onClick:i})=>{const r=q.useRef(null),s=q.useRef(null),a=q.useRef(0);q.useEffect(()=>{const l=r.current;if(!l||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const f=new Eb,p=new wn(45,1,.1,100);p.position.z=3.6;let h;try{h=new Mb({alpha:!0,antialias:!0,powerPreference:"low-power"}),h.setSize(e,e),h.setPixelRatio(Math.min(window.devicePixelRatio,2)),s.current=h,l.appendChild(h.domElement)}catch{return}const m=e>60?420:180,x=new ii,_=new Float32Array(m*3),g=new Float32Array(m*3),u=new Float32Array(m*3),y=(M=>{switch(M){case"LISTENING":return{primary:new Ve("#38bdf8"),secondary:new Ve("#818cf8")};case"THINKING":return{primary:new Ve("#a855f7"),secondary:new Ve("#6366f1")};case"SPEAKING":return{primary:new Ve("#34d399"),secondary:new Ve("#06b6d4")};case"WORKING":return{primary:new Ve("#fbbf24"),secondary:new Ve("#10b981")};case"IDLE":default:return{primary:new Ve("#10b981"),secondary:new Ve("#0ea5e9")}}})(t);for(let M=0;M<m;M++){const P=Math.random(),G=Math.random(),O=P*2*Math.PI,Y=Math.acos(2*G-1),X=.95+Math.random()*.15,$=X*Math.sin(Y)*Math.cos(O),ee=X*Math.sin(Y)*Math.sin(O),L=X*Math.cos(Y);_[M*3]=$,_[M*3+1]=ee,_[M*3+2]=L,g[M*3]=$,g[M*3+1]=ee,g[M*3+2]=L;const K=Math.random(),Q=y.primary.clone().lerp(y.secondary,K);u[M*3]=Q.r,u[M*3+1]=Q.g,u[M*3+2]=Q.b}x.setAttribute("position",new Cn(_,3)),x.setAttribute("color",new Cn(u,3));const S=new dv({size:e>60?.055:.075,vertexColors:!0,transparent:!0,opacity:.85,blending:ed}),N=new wb(x,S);f.add(N);const A=new ua;if(t==="WORKING"){const P=new Kf(.06,8,8),G=new qf({color:16498468});for(let O=0;O<3;O++){const Y=new Jn(P,G),X=O/3*Math.PI*2;Y.position.set(Math.cos(X)*1.35,Math.sin(X)*1.35,0),A.add(Y)}f.add(A)}let w=new Tb,R=!1;const b=()=>{if(!R){a.current=requestAnimationFrame(b);try{const M=w.getElapsedTime();let P=.5,G=.05;t==="LISTENING"?(P=1.8,G=.16):t==="THINKING"?(P=2.4,G=.12):t==="SPEAKING"?(P=1.4,G=.18):t==="WORKING"&&(P=1,G=.08),N.rotation.y=M*.3*P,N.rotation.x=M*.2*P,t==="WORKING"&&(A.rotation.z=-M*1.2);const O=x.attributes.position,Y=O.array;for(let X=0;X<m;X++){const $=g[X*3],ee=g[X*3+1],L=g[X*3+2],K=Math.sin(M*3*P+$*4+ee*4)*G;Y[X*3]=$*(1+K),Y[X*3+1]=ee*(1+K),Y[X*3+2]=L*(1+K)}O.needsUpdate=!0,h.render(f,p)}catch{}}};return b(),()=>{R=!0,cancelAnimationFrame(a.current);try{s.current&&l.contains(s.current.domElement)&&l.removeChild(s.current.domElement),x.dispose(),S.dispose(),h.dispose()}catch{}}},[t,e]);const o={IDLE:"from-emerald-500/30 to-cyan-500/20 shadow-emerald-500/20",LISTENING:"from-sky-500/40 to-indigo-500/30 shadow-sky-500/30 animate-pulse",THINKING:"from-purple-500/40 to-indigo-500/30 shadow-purple-500/30 animate-spin-slow",SPEAKING:"from-emerald-500/40 to-cyan-500/30 shadow-emerald-500/30 animate-pulse",WORKING:"from-amber-500/40 to-emerald-500/30 shadow-amber-500/30"}[t];return d.jsxs("div",{onClick:i,style:{width:e,height:e},className:`relative flex items-center justify-center cursor-pointer select-none rounded-full group ${n}`,title:`OS Ambient Presence: ${t}`,children:[d.jsx("div",{className:`absolute inset-0 rounded-full bg-gradient-to-tr ${o} blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}),d.jsx("div",{ref:r,className:"relative z-10 w-full h-full pointer-events-none"}),d.jsx("div",{className:"absolute inset-1 rounded-full border border-white/20 bg-os-surface/40 backdrop-blur-sm -z-0 pointer-events-none"})]})},bb=()=>{const{me:t,theme:e,toggleTheme:n,orbState:i,pendingApprovalsCount:r,activeAgentsCount:s,setCurrentView:a,setIsCommandPaletteOpen:o}=cn(),{isVoiceActive:l,toggleVoice:c}=Rx();return d.jsxs("header",{className:"sticky top-0 z-40 w-full h-16 border-b border-os-border bg-os-bg/75 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between",children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsxs("div",{className:"flex items-center gap-2.5 cursor-pointer group select-none",onClick:()=>a("home"),children:[d.jsx("img",{src:"/static/logo.png",alt:"OS Logo",className:"w-8 h-8 rounded-full object-contain filter drop-shadow-[0_0_12px_rgba(99,102,241,0.35)] transition-transform duration-200 group-hover:scale-105"}),d.jsx(fv,{state:i,size:28}),d.jsx("div",{className:"flex flex-col",children:d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx("span",{className:"font-extrabold text-base tracking-tight text-os-primary group-hover:text-indigo-400 transition-colors",children:"OS"}),d.jsx("span",{className:"text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-os-secondary",children:(t==null?void 0:t.mode)||"Builder Mode"})]})})]}),d.jsx("div",{className:"hidden lg:flex items-center gap-2 pl-3 border-l border-os-border text-xs",children:d.jsxs("div",{className:"flex items-center gap-1.5 text-os-secondary",children:[t!=null&&t.model_ok?d.jsxs("span",{className:"flex h-2 w-2 relative",children:[d.jsx("span",{className:"animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"}),d.jsx("span",{className:"relative inline-flex rounded-full h-2 w-2 bg-emerald-500"})]}):d.jsx("span",{className:"h-2 w-2 rounded-full bg-amber-500"}),d.jsx("span",{className:"font-mono text-[11px] text-os-muted",children:(t==null?void 0:t.model)||"Ollama Connected"})]})})]}),d.jsx("div",{className:"flex-1 max-w-md mx-4 hidden sm:block",children:d.jsxs("button",{onClick:()=>o(!0),className:"w-full flex items-center justify-between px-3.5 py-1.5 rounded-glass-md bg-white/5 hover:bg-white/10 border border-os-border hover:border-os-border-glass text-os-secondary text-xs transition-all duration-150 group",children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx(zs,{className:"w-3.5 h-3.5 text-os-muted group-hover:text-os-primary transition-colors"}),d.jsx("span",{children:"Search tasks, plans, tools, or ask OS..."})]}),d.jsxs("kbd",{className:"hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/20 border border-white/10 text-[10px] font-mono text-os-muted",children:[d.jsx("span",{children:"⌘"}),"K"]})]})}),d.jsxs("div",{className:"flex items-center gap-2 md:gap-3",children:[r>0&&d.jsxs("button",{onClick:()=>a("approvals"),className:"flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono transition-colors",title:`${r} action approvals waiting`,children:[d.jsx($l,{className:"w-3.5 h-3.5"}),d.jsx("span",{className:"font-semibold",children:r}),d.jsx("span",{className:"hidden md:inline text-[11px]",children:"waiting"})]}),s>0&&d.jsxs("button",{onClick:()=>a("agents"),className:"flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono transition-colors",title:`${s} background agents running`,children:[d.jsx(zf,{className:"w-3.5 h-3.5 animate-spin-slow"}),d.jsxs("span",{children:[s," running"]})]}),d.jsx("button",{onClick:c,className:`btn-press p-2 rounded-glass-md border transition-all ${l?"bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glass-glow":"bg-white/5 hover:bg-white/10 text-os-secondary hover:text-os-primary border-os-border"}`,title:l?"Voice active (click to stop)":"Activate Voice Talk",children:l?d.jsx(o0,{className:"w-4 h-4 animate-pulse"}):d.jsx(s0,{className:"w-4 h-4"})}),d.jsx("button",{onClick:n,className:"btn-press p-2 rounded-glass-md bg-white/5 hover:bg-white/10 border border-os-border text-os-secondary hover:text-os-primary transition-colors",title:`Switch to ${e==="dark"?"Light":"Dark"} mode`,children:e==="dark"?d.jsx(mS,{className:"w-4 h-4"}):d.jsx(dS,{className:"w-4 h-4"})}),d.jsx("div",{className:"flex items-center gap-2 pl-2 border-l border-os-border",children:d.jsx("div",{className:"w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-black select-none",children:t!=null&&t.name?t.name.charAt(0).toUpperCase():"S"})})]})]})},Ab=()=>{const{currentView:t,setCurrentView:e,pendingApprovalsCount:n,activeAgentsCount:i}=cn(),r=[{id:"home",label:"Overview",icon:Kx},{id:"hud",label:"Cyber HUD",icon:zf,badgeVariant:"cyan"},{id:"chat",label:"Ask OS",icon:xi},{id:"plan",label:"Plan & Day",icon:Fr},{id:"tasks",label:"Commitments",icon:w0},{id:"approvals",label:"Approvals & Safety",icon:$l,badgeCount:n,badgeVariant:"amber"},{id:"agents",label:"Workers & Agents",icon:Dx,badgeCount:i,badgeVariant:"cyan"},{id:"activity",label:"Evidence & Audit",icon:Ga},{id:"connectors",label:"Connectors",icon:e0},{id:"memory",label:"Memory & World",icon:Ux}];return d.jsxs("aside",{className:"w-16 md:w-60 border-r border-os-border bg-os-bg/50 backdrop-blur-md flex flex-col justify-between p-3 select-none flex-shrink-0",children:[d.jsxs("nav",{className:"space-y-1.5",children:[d.jsx("div",{className:"hidden md:block px-3 py-2 text-[10px] font-mono tracking-wider uppercase text-os-muted",children:"Workspace"}),r.map(s=>{const a=s.icon,o=t===s.id;return d.jsxs("button",{onClick:()=>e(s.id),className:`btn-press w-full flex items-center gap-3 px-3 py-2.5 rounded-glass-md text-xs font-medium transition-all group ${o?"bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-glass-glow":"text-os-secondary hover:text-os-primary hover:bg-white/5 border border-transparent"}`,children:[d.jsx(a,{className:`w-4 h-4 flex-shrink-0 transition-colors ${o?"text-emerald-400":"text-os-muted group-hover:text-os-primary"}`}),d.jsx("span",{className:"hidden md:inline truncate",children:s.label}),s.badgeCount!==void 0&&s.badgeCount>0&&d.jsx("span",{className:`hidden md:inline-flex ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${s.badgeVariant==="amber"?"bg-amber-500/20 text-amber-400 border border-amber-500/30":s.badgeVariant==="cyan"?"bg-cyan-500/20 text-cyan-400 border border-cyan-500/30":"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`,children:s.badgeCount})]},s.id)})]}),d.jsxs("div",{className:"pt-4 border-t border-os-border/50 hidden md:block px-3",children:[d.jsxs("div",{className:"flex items-center justify-between text-[11px] text-os-muted font-mono",children:[d.jsx("span",{children:"OS Core v2.0"}),d.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"})]}),d.jsx("p",{className:"text-[10px] text-os-muted/80 mt-1 leading-tight",children:"Safe execution boundary active."})]})]})},Cb=()=>{const{isCommandPaletteOpen:t,setIsCommandPaletteOpen:e,setCurrentView:n,refreshData:i,addNotification:r}=cn(),[s,a]=q.useState(""),[o,l]=q.useState(0),c=q.useRef(null);q.useEffect(()=>{t&&(a(""),l(0),setTimeout(()=>{var x;return(x=c.current)==null?void 0:x.focus()},50))},[t]);const p=[{id:"ask-plan",title:'Ask OS: "Plan my day and resolve conflicts"',category:"Ask OS",icon:xi,view:"chat"},{id:"ask-matters",title:'Ask OS: "What matters right now and what is blocked?"',category:"Ask OS",icon:xi,view:"chat"},{id:"ask-research",title:'Ask OS: "Research recent AI agent breakthroughs"',category:"Ask OS",icon:xi,view:"chat"},{id:"nav-home",title:'Go to Overview ("What matters now")',category:"Navigation",icon:Px,view:"home"},{id:"nav-chat",title:"Open Ask OS Canvas",category:"Navigation",icon:xi,view:"chat"},{id:"nav-plan",title:"Open Day Plan & Schedule",category:"Navigation",icon:Fr,view:"plan"},{id:"nav-tasks",title:"View Commitments & Tasks",category:"Navigation",icon:w0,view:"tasks"},{id:"nav-approvals",title:"Review Safety Approvals",category:"Navigation",icon:$l,view:"approvals"},{id:"nav-agents",title:"Inspect Specialized Workers",category:"Navigation",icon:Dx,view:"agents"},{id:"nav-activity",title:"Audit Evidence & Activity",category:"Navigation",icon:Ga,view:"activity"},{id:"nav-connectors",title:"Manage Connectors & Integrations",category:"Navigation",icon:e0,view:"connectors"},{id:"nav-memory",title:"Explore OS Memory & Knowledge",category:"Navigation",icon:Ux,view:"memory"},{id:"act-refresh",title:"Refresh All Data & Statuses",category:"Actions",icon:Xn,action:async()=>{await i(),r({type:"success",title:"System Synced",message:"All operational data refreshed."})}}].filter(x=>x.title.toLowerCase().includes(s.toLowerCase())||x.category.toLowerCase().includes(s.toLowerCase())),h=x=>{e(!1),x.action?x.action():x.view&&n(x.view)},m=x=>{x.key==="ArrowDown"?(x.preventDefault(),l(_=>(_+1)%(p.length||1))):x.key==="ArrowUp"?(x.preventDefault(),l(_=>(_-1+(p.length||1))%(p.length||1))):x.key==="Enter"?(x.preventDefault(),p[o]&&h(p[o])):x.key==="Escape"&&e(!1)};return t?d.jsxs("div",{className:"fixed inset-0 z-50 flex items-start justify-center pt-24 p-4",children:[d.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity",onClick:()=>e(!1)}),d.jsxs("div",{className:"relative w-full max-w-xl z-10 glass-panel rounded-glass-xl border border-os-border-glass shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150",children:[d.jsxs("div",{className:"flex items-center gap-3 px-4 py-3.5 border-b border-os-border bg-white/5",children:[d.jsx(zs,{className:"w-5 h-5 text-os-muted flex-shrink-0"}),d.jsx("input",{ref:c,type:"text",value:s,onChange:x=>{a(x.target.value),l(0)},onKeyDown:m,placeholder:"Type a command, search tasks, or ask OS...",className:"w-full bg-transparent text-sm text-os-primary placeholder:text-os-muted focus:outline-none"}),d.jsx("button",{onClick:()=>e(!1),className:"p-1 text-os-muted hover:text-os-primary rounded-lg hover:bg-white/5",children:d.jsx(Bf,{className:"w-4 h-4"})})]}),d.jsx("div",{className:"max-h-80 overflow-y-auto p-2 space-y-1",children:p.length===0?d.jsx("div",{className:"py-8 text-center text-xs text-os-muted",children:"No matching commands or actions found."}):p.map((x,_)=>{const g=x.icon,u=_===o;return d.jsxs("div",{onClick:()=>h(x),onMouseEnter:()=>l(_),className:`flex items-center justify-between px-3 py-2.5 rounded-glass-md text-xs cursor-pointer transition-colors ${u?"bg-emerald-500/15 text-emerald-400 border border-emerald-500/30":"text-os-secondary hover:text-os-primary hover:bg-white/5 border border-transparent"}`,children:[d.jsxs("div",{className:"flex items-center gap-2.5 truncate",children:[d.jsx(g,{className:`w-4 h-4 flex-shrink-0 ${u?"text-emerald-400":"text-os-muted"}`}),d.jsx("span",{className:"truncate",children:x.title})]}),d.jsx("span",{className:"text-[10px] font-mono uppercase tracking-wider text-os-muted px-2 py-0.5 rounded bg-white/5",children:x.category})]},x.id)})}),d.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-black/20 border-t border-os-border text-[11px] text-os-muted font-mono",children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsx("span",{children:"↑↓ Navigate"}),d.jsx("span",{children:"↵ Select"}),d.jsx("span",{children:"ESC Close"})]}),d.jsx("span",{children:"OS Command Center"})]})]})]}):null},Ct=({children:t,interactive:e=!1,glow:n="none",className:i="",...r})=>{const s={none:"",emerald:"shadow-glass-glow border-emerald-500/30",cyan:"shadow-glass-glow-cyan border-cyan-500/30",amber:"shadow-glass-glow-amber border-amber-500/30",danger:"shadow-glass-glow-danger border-rose-500/30"}[n];return d.jsx("div",{className:`glass-panel rounded-glass-lg p-5 transition-all duration-200 ${e?"glass-card-interactive cursor-pointer hover:border-os-border-glass":""} ${s} ${i}`,...r,children:t})},Tt=({children:t,variant:e="neutral",size:n="md",icon:i,className:r=""})=>{const s={neutral:"bg-white/5 text-os-secondary border-white/10",emerald:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",cyan:"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",amber:"bg-amber-500/10 text-amber-400 border-amber-500/20",danger:"bg-rose-500/10 text-rose-400 border-rose-500/20",purple:"bg-purple-500/10 text-purple-400 border-purple-500/20"}[e],a={sm:"text-xs px-2 py-0.5 gap-1",md:"text-xs font-medium px-2.5 py-1 gap-1.5"}[n];return d.jsxs("span",{className:`inline-flex items-center rounded-full border tracking-wide uppercase font-mono ${s} ${a} ${r}`,children:[i&&d.jsx("span",{className:"flex-shrink-0",children:i}),d.jsx("span",{children:t})]})},tt=({children:t,variant:e="glass",size:n="md",isLoading:i=!1,leftIcon:r,rightIcon:s,disabled:a,className:o="",...l})=>{const c={primary:"bg-emerald-500 text-white font-medium hover:bg-emerald-400 border border-emerald-400/40 shadow-glass-glow",glass:"bg-white/5 hover:bg-white/10 text-os-primary border border-os-border hover:border-os-border-glass backdrop-blur-md",secondary:"bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30",danger:"bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 shadow-glass-glow-danger",ghost:"hover:bg-white/5 text-os-secondary hover:text-os-primary border border-transparent"}[e],f={sm:"text-xs px-2.5 py-1.5 rounded-glass-sm gap-1.5",md:"text-sm px-4 py-2 rounded-glass-md gap-2",lg:"text-base px-5 py-2.5 rounded-glass-lg gap-2.5",icon:"p-2 rounded-glass-md justify-center items-center"}[n];return d.jsxs("button",{className:`btn-press inline-flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none ${c} ${f} ${o}`,disabled:a||i,...l,children:[i?d.jsxs("svg",{className:"animate-spin h-4 w-4 text-current",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[d.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),d.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}):r,t,!i&&s]})},pm=()=>{const{me:t,setCurrentView:e,pendingApprovalsCount:n,activeAgentsCount:i}=cn(),[r,s]=q.useState(null),[a,o]=q.useState([]),[l,c]=q.useState(!0),f=async()=>{c(!0);try{const[p,h]=await Promise.allSettled([$e.getHomeView(),$e.getPlan()]);p.status==="fulfilled"&&s(p.value),h.status==="fulfilled"&&o(h.value.items||[])}catch(p){console.error("Failed to load home view data:",p)}finally{c(!1)}};return q.useEffect(()=>{f()},[]),d.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-8 animate-in fade-in duration-200",children:[d.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-os-border/50",children:[d.jsxs("div",{children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx("span",{className:"text-xs font-mono text-emerald-400 uppercase tracking-widest",children:"Operational Command"}),d.jsx("span",{className:"h-1 w-1 rounded-full bg-emerald-400"}),d.jsx("span",{className:"text-xs text-os-secondary",children:new Date().toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})})]}),d.jsxs("h1",{className:"text-2xl md:text-3xl font-extrabold text-os-primary tracking-tight mt-1",children:[(t==null?void 0:t.greeting)||"Good afternoon",", ",(t==null?void 0:t.name)||"Sai"]}),d.jsx("p",{className:"text-xs md:text-sm text-os-secondary mt-0.5",children:n>0?`You have ${n} action approval waiting and tasks scheduled for today.`:"All systems nominal. OS is actively observing background feeds and commitments."})]}),d.jsxs("div",{className:"flex items-center gap-2.5",children:[d.jsx(tt,{variant:"glass",size:"sm",onClick:f,isLoading:l,leftIcon:d.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Sync"}),d.jsx(tt,{variant:"primary",size:"sm",onClick:()=>e("chat"),leftIcon:d.jsx(xi,{className:"w-3.5 h-3.5"}),children:"Ask OS"})]})]}),d.jsxs("section",{className:"space-y-3",children:[d.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[d.jsx("span",{className:"h-2 w-2 rounded-full bg-rose-500 animate-pulse"}),d.jsx("span",{children:"What Matters Right Now"})]}),n>0?d.jsx(Ct,{glow:"amber",className:"p-6 border-amber-500/30 relative overflow-hidden",children:d.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center justify-between gap-4",children:[d.jsxs("div",{className:"space-y-2",children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx(Tt,{variant:"amber",size:"sm",children:"Action Requires Approval"}),d.jsx("span",{className:"text-xs font-mono text-amber-400/90",children:"High Priority Safety Gate"})]}),d.jsx("h3",{className:"text-lg md:text-xl font-bold text-os-primary",children:"OS prepared external actions awaiting your confirmation"}),d.jsx("p",{className:"text-xs text-os-secondary max-w-2xl leading-relaxed",children:"Connector requests (such as email dispatch or calendar changes) are held behind tamper-evident SHA-256 integrity checks until you give explicit approval."})]}),d.jsx("div",{className:"flex items-center gap-3",children:d.jsxs(tt,{variant:"primary",size:"md",onClick:()=>e("approvals"),rightIcon:d.jsx(Px,{className:"w-4 h-4"}),children:["Review Approvals (",n,")"]})})]})}):(()=>{var h,m;const p=((h=r==null?void 0:r.now)==null?void 0:h.task)||((m=r==null?void 0:r.now)!=null&&m.title?r.now:null);return p?d.jsx(Ct,{glow:"emerald",className:"p-6 border-emerald-500/30",children:d.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center justify-between gap-4",children:[d.jsxs("div",{className:"space-y-2",children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx(Tt,{variant:"emerald",size:"sm",children:"Immediate Focus"}),p.deadline&&d.jsxs("span",{className:"text-xs font-mono text-os-muted",children:["Deadline: ",new Date(p.deadline).toLocaleDateString()]})]}),d.jsx("h3",{className:"text-xl font-bold text-os-primary",children:p.title}),d.jsxs("p",{className:"text-xs text-os-secondary",children:["Estimated duration: ",p.estimated_duration_minutes||p.estimated_minutes||60," mins ·"," ",p.reason||"Highest priority in today's active plan."]})]}),d.jsx(tt,{variant:"primary",size:"md",onClick:()=>e("tasks"),leftIcon:d.jsx(f0,{className:"w-4 h-4"}),children:"Start Execution"})]})}):d.jsx(Ct,{className:"p-6",children:d.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[d.jsxs("div",{children:[d.jsx("h3",{className:"text-base font-semibold text-os-primary",children:"Clear Deck — No critical blockers"}),d.jsx("p",{className:"text-xs text-os-secondary mt-1",children:"You are up to date on pending decisions. Would you like OS to organize your schedule or inspect open commitments?"})]}),d.jsx(tt,{variant:"glass",size:"sm",onClick:()=>e("plan"),rightIcon:d.jsx(ya,{className:"w-4 h-4"}),children:"Inspect Schedule"})]})})})()]}),d.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[d.jsxs("section",{className:"space-y-3 lg:col-span-2",children:[d.jsxs("div",{className:"flex items-center justify-between",children:[d.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[d.jsx(Fr,{className:"w-3.5 h-3.5 text-os-secondary"}),d.jsx("span",{children:"Today's Time-Carved Schedule"})]}),d.jsxs("button",{onClick:()=>e("plan"),className:"text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1",children:[d.jsx("span",{children:"View Full Plan"}),d.jsx(ya,{className:"w-3.5 h-3.5"})]})]}),d.jsx(Ct,{className:"p-4 space-y-2.5",children:(()=>{const p=a.length>0?a:(r==null?void 0:r.today_plan)||[];return p.length===0?d.jsxs("div",{className:"py-8 text-center text-xs text-os-muted",children:["No active plan for today yet.",d.jsx("div",{className:"mt-2",children:d.jsx(tt,{variant:"glass",size:"sm",onClick:()=>e("plan"),leftIcon:d.jsx(xi,{className:"w-3.5 h-3.5 text-emerald-400"}),children:"Generate Daily Plan"})})]}):p.slice(0,5).map((h,m)=>{var u,v;const x=h.start_time||(h.scheduled_start?new Date(h.scheduled_start).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):h.start?new Date(h.start).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"09:00"),_=h.duration_minutes||h.estimated_minutes||((u=h.why_now)==null?void 0:u.duration_minutes)||60,g=typeof h.why_now=="string"?h.why_now:((v=h.why_now)==null?void 0:v.rationale)||"";return d.jsxs("div",{className:"flex items-center justify-between p-2.5 rounded-glass-sm bg-white/5 hover:bg-white/10 border border-transparent hover:border-os-border transition-all",children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsx("span",{className:"font-mono text-xs text-os-secondary w-16",children:x}),d.jsx("div",{className:"h-2 w-2 rounded-full bg-emerald-400/80"}),d.jsxs("div",{children:[d.jsx("div",{className:"text-xs font-semibold text-os-primary",children:h.title}),g&&d.jsx("div",{className:"text-[10px] text-os-muted line-clamp-1",children:g})]})]}),d.jsxs("span",{className:"text-[10px] font-mono text-os-muted",children:[_,"m"]})]},h.id||m)})})()})]}),d.jsxs("section",{className:"space-y-3",children:[d.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[d.jsx(zf,{className:"w-3.5 h-3.5 text-cyan-400"}),d.jsx("span",{children:"Autonomous Background Work"})]}),d.jsxs(Ct,{className:"p-4 space-y-3",children:[d.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-os-border/50 text-xs",children:[d.jsx("span",{className:"text-os-secondary",children:"Watcher Engine"}),d.jsx("span",{className:"text-emerald-400 font-mono text-[11px]",children:"● ACTIVE"})]}),d.jsxs("div",{className:"space-y-2 text-xs",children:[d.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-black/20 border border-white/5",children:[d.jsx("div",{className:"font-semibold text-os-primary text-xs",children:"Deadline Watcher"}),d.jsx("div",{className:"text-[11px] text-os-muted mt-0.5",children:"Continually evaluating task progress and recalculating critical path."})]}),d.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-black/20 border border-white/5",children:[d.jsx("div",{className:"font-semibold text-os-primary text-xs",children:"Calendar Conflict Guard"}),d.jsx("div",{className:"text-[11px] text-os-muted mt-0.5",children:"Synchronizing busy slots with live Google Calendar adapter."})]}),d.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-black/20 border border-white/5",children:[d.jsx("div",{className:"font-semibold text-os-primary text-xs",children:"Email Ingestion Pipe"}),d.jsx("div",{className:"text-[11px] text-os-muted mt-0.5",children:"Extracting commitments and tasks from incoming communications."})]})]}),d.jsx(tt,{variant:"ghost",size:"sm",className:"w-full text-xs text-os-secondary justify-center",onClick:()=>e("agents"),children:"Inspect Specialized Workers →"})]})]})]}),d.jsxs("section",{className:"space-y-3",children:[d.jsxs("div",{className:"flex items-center justify-between",children:[d.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[d.jsx(Ga,{className:"w-3.5 h-3.5 text-os-secondary"}),d.jsx("span",{children:"Recent Operational Activity & Proofs"})]}),d.jsxs("button",{onClick:()=>e("activity"),className:"text-xs text-os-secondary hover:text-os-primary font-mono flex items-center gap-1",children:[d.jsx("span",{children:"Full Audit Trail"}),d.jsx(ya,{className:"w-3.5 h-3.5"})]})]}),d.jsx(Ct,{className:"p-4 space-y-2",children:r!=null&&r.recent_activity&&r.recent_activity.length>0?r.recent_activity.slice(0,4).map(p=>d.jsxs("div",{className:"flex items-center justify-between p-2 rounded-glass-sm hover:bg-white/5 transition-colors text-xs",children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsx(bn,{className:"w-3.5 h-3.5 text-emerald-400 flex-shrink-0"}),d.jsx("span",{className:"text-os-primary",children:p.summary||p.description||p.event_type||"Activity verified"})]}),d.jsx("span",{className:"font-mono text-[10px] text-os-muted",children:p.timestamp||p.created_at?new Date(p.timestamp||p.created_at).toLocaleTimeString():"Just now"})]},p.id)):d.jsx("div",{className:"py-4 text-center text-xs text-os-muted",children:"OS initialized. Activity events and proof receipts will be logged here."})})]})]})};function Rb(t,e,n,i){const r=new AbortController;return(async()=>{try{const s=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t}),signal:r.signal});if(!s.ok)throw new Error(`Chat error: ${s.statusText}`);if(!s.body)throw new Error("Response body is empty");const a=s.body.getReader(),o=new TextDecoder("utf-8");let l="";for(;;){const{done:c,value:f}=await a.read();if(c)break;l+=o.decode(f,{stream:!0});const p=l.split(`
`);l=p.pop()||"";for(const h of p){const m=h.trim();if(m.startsWith("data: ")){const x=m.slice(6);if(x==="[DONE]")continue;try{const _=JSON.parse(x);_.t==="token"&&typeof _.d=="string"?e(_.d):_.t==="done"&&n(_)}catch(_){console.warn("Failed to parse SSE line:",x,_)}}}}}catch(s){s.name!=="AbortError"&&i(s)}})(),()=>{r.abort()}}const Nb=({step:t})=>{const[e,n]=q.useState(!1),[i,r]=q.useState(!1),[s,a]=q.useState(!1),[o,l]=q.useState(!1),c=(t.tool||"").toLowerCase(),f=c.includes("browser")||c.includes("web"),p=c.includes("research")||c.includes("search"),h=c.includes("computer")||c.includes("terminal")||c.includes("bash"),m=c.includes("code")||c.includes("python"),_=f?Qu:p?zs:h?gS:m?Gx:c.includes("calendar")?Fr:c.includes("email")||c.includes("gmail")?uS:cS,g=()=>{if(s)return d.jsx(Tt,{variant:"danger",size:"sm",children:"Stopped"});if(i)return d.jsx(Tt,{variant:"amber",size:"sm",children:"Paused"});switch(t.status){case"completed":return d.jsx(Tt,{variant:"emerald",size:"sm",icon:d.jsx(bn,{className:"w-3 h-3"}),children:"Completed"});case"running":return d.jsx(Tt,{variant:"cyan",size:"sm",icon:d.jsx(Ga,{className:"w-3 h-3 animate-spin"}),children:"Executing"});case"failed":return d.jsx(Tt,{variant:"danger",size:"sm",icon:d.jsx(Ju,{className:"w-3 h-3"}),children:"Failed"});case"needs_approval":return d.jsx(Tt,{variant:"amber",size:"sm",icon:d.jsx(Ju,{className:"w-3 h-3"}),children:"Approval Needed"});default:return null}},u=t.input&&(t.input.url||t.input.target_url)||(typeof t.input=="string"&&t.input.includes("http")?t.input:"https://github.com");return d.jsxs("div",{className:"rounded-glass-md border border-os-border bg-os-surface/60 backdrop-blur-md overflow-hidden my-2.5 transition-all",children:[d.jsxs("div",{onClick:()=>n(!e),className:"flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-white/5 transition-colors select-none",children:[d.jsxs("div",{className:"flex items-center gap-2.5",children:[d.jsx("div",{className:"p-1.5 rounded-lg bg-white/5 border border-white/10 text-os-secondary",children:d.jsx(_,{className:"w-3.5 h-3.5 text-emerald-400"})}),d.jsxs("div",{children:[d.jsx("span",{className:"text-xs font-semibold text-os-primary tracking-wide",children:t.tool}),f&&d.jsx("span",{className:"hidden sm:inline text-[11px] text-os-muted ml-2 font-mono truncate max-w-xs",children:u})]})]}),d.jsxs("div",{className:"flex items-center gap-2",children:[g(),d.jsx("button",{className:"text-os-muted hover:text-os-primary p-0.5",children:e?d.jsx(Fx,{className:"w-4 h-4"}):d.jsx(ya,{className:"w-4 h-4"})})]})]}),f&&d.jsxs("div",{className:"p-3 border-t border-os-border/50 bg-black/30 space-y-2.5",children:[d.jsxs("div",{className:"flex items-center justify-between gap-2 px-3 py-1.5 rounded-glass-sm bg-black/40 border border-white/5 text-xs font-mono",children:[d.jsxs("div",{className:"flex items-center gap-2 truncate",children:[d.jsx(Qu,{className:"w-3.5 h-3.5 text-cyan-400 flex-shrink-0"}),d.jsx("span",{className:"text-os-secondary truncate",children:u})]}),d.jsx("div",{className:"flex items-center gap-1.5 flex-shrink-0",children:d.jsx("span",{className:"text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20",children:"Step 3 / 5"})})]}),d.jsx("div",{className:"relative rounded-glass-sm border border-white/10 bg-os-bg/80 p-4 min-h-[90px] flex flex-col justify-center items-center text-center",children:o?d.jsxs("div",{className:"space-y-1.5 animate-in fade-in",children:[d.jsx(Tt,{variant:"amber",size:"sm",children:"Manual Takeover Active"}),d.jsx("p",{className:"text-xs text-os-secondary",children:"You are directly controlling the Chromium session. OS will resume when returned."})]}):d.jsxs("div",{className:"space-y-1 text-xs text-os-secondary",children:[d.jsxs("div",{className:"flex items-center justify-center gap-2 text-emerald-400 font-mono text-[11px]",children:[d.jsx("span",{className:"h-2 w-2 rounded-full bg-emerald-400 animate-pulse"}),d.jsx("span",{children:"Navigating DOM · Extracting content"})]}),d.jsx("p",{className:"text-os-muted text-[11px]",children:"Agent-Browser is executing in isolated Playwright context."})]})}),d.jsxs("div",{className:"flex items-center justify-between pt-1 text-xs",children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx(tt,{variant:"glass",size:"sm",onClick:()=>l(!o),leftIcon:d.jsx(oS,{className:"w-3 h-3 text-cyan-400"}),children:o?"Return to OS":"Take Control"}),d.jsx(tt,{variant:"ghost",size:"sm",onClick:()=>r(!i),leftIcon:i?d.jsx(f0,{className:"w-3 h-3 text-emerald-400"}):d.jsx(hS,{className:"w-3 h-3 text-amber-400"}),children:i?"Resume":"Pause"})]}),d.jsx(tt,{variant:"danger",size:"sm",onClick:()=>a(!0),leftIcon:d.jsx(pS,{className:"w-3 h-3"}),children:"Stop"})]})]}),h&&d.jsxs("div",{className:"p-3 border-t border-os-border/50 bg-black/40 space-y-2 text-xs font-mono",children:[d.jsxs("div",{className:"flex items-center justify-between text-[11px] text-os-muted pb-1 border-b border-white/5",children:[d.jsx("span",{children:"Isolated Sandbox: /workspace"}),d.jsx("span",{className:"text-emerald-400",children:"● Docker Container"})]}),d.jsx("div",{className:"p-2.5 rounded bg-black/60 border border-white/5 text-[11px] text-emerald-300",children:d.jsxs("code",{children:["$ ",t.input?JSON.stringify(t.input):"python -m pytest"]})})]}),e&&d.jsxs("div",{className:"p-3 border-t border-os-border/60 bg-black/20 text-xs font-mono space-y-2",children:[t.input&&d.jsxs("div",{children:[d.jsx("div",{className:"text-[10px] uppercase tracking-wider text-os-muted mb-1 font-sans",children:"Input Parameters"}),d.jsx("pre",{className:"p-2 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-os-secondary",children:typeof t.input=="string"?t.input:JSON.stringify(t.input,null,2)})]}),t.output&&d.jsxs("div",{children:[d.jsx("div",{className:"text-[10px] uppercase tracking-wider text-os-muted mb-1 font-sans",children:"Execution Result"}),d.jsx("pre",{className:"p-2 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-emerald-300/90 max-h-48",children:typeof t.output=="string"?t.output:JSON.stringify(t.output,null,2)})]})]})]})},Hd=({approval:t,onDecided:e})=>{const{refreshData:n,addNotification:i}=cn(),[r,s]=q.useState(t.status||"pending"),[a,o]=q.useState(!1),l=(t.risk_level||"MEDIUM").toUpperCase(),c=l==="HIGH"?"danger":l==="LOW"?"emerald":"amber",f=async()=>{o(!0);try{t.aid?await $e.approveAction(t.aid):t.id&&await $e.approveV1(t.id,t.params||{}),s("approved"),e==null||e("approved"),i({type:"success",title:"Action Approved & Executed",message:"The safety executor has completed and verified this action."}),n()}catch(h){i({type:"error",title:"Approval Failed",message:h.message||"Execution error occurred."})}finally{o(!1)}},p=async()=>{o(!0);try{t.aid?await $e.rejectAction(t.aid):t.id&&await $e.rejectV1(t.id,"User rejected in Ask OS"),s("rejected"),e==null||e("rejected"),i({type:"info",title:"Action Rejected",message:"The action was discarded safely without execution."}),n()}catch(h){i({type:"error",title:"Rejection Failed",message:h.message})}finally{o(!1)}};return d.jsxs("div",{className:"rounded-glass-lg border border-amber-500/30 bg-os-surface/80 backdrop-blur-md p-4 my-3 shadow-glass-glow-amber",children:[d.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-os-border/60",children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx("div",{className:"p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400",children:d.jsx($l,{className:"w-4 h-4"})}),d.jsxs("div",{children:[d.jsx("h4",{className:"text-xs font-semibold text-os-primary uppercase tracking-wider font-mono",children:"Action Approval Required"}),d.jsx("p",{className:"text-[11px] text-os-secondary",children:"OS prepared this action and awaits your confirmation."})]})]}),d.jsxs(Tt,{variant:c,size:"sm",children:[l," RISK"]})]}),d.jsxs("div",{className:"py-3 space-y-2",children:[d.jsxs("div",{className:"text-sm font-medium text-os-primary flex items-center gap-2",children:[d.jsx("span",{className:"font-semibold text-emerald-400",children:t.connector_name||t.action||"External Action"}),t.title&&d.jsxs("span",{className:"text-os-secondary",children:["— ",t.title]})]}),t.params&&Object.keys(t.params).length>0&&d.jsx("div",{className:"rounded-glass-sm bg-black/30 border border-white/5 p-3 space-y-1.5 text-xs font-mono",children:Object.entries(t.params).map(([h,m])=>d.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-start justify-between gap-1",children:[d.jsxs("span",{className:"text-os-muted uppercase text-[10px] tracking-wider sm:w-28 flex-shrink-0",children:[h,":"]}),d.jsx("span",{className:"text-os-secondary text-right sm:text-left flex-1 break-all",children:typeof m=="object"?JSON.stringify(m):String(m)})]},h))}),t.arguments_hash&&d.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-mono text-os-muted pt-1",children:[d.jsx(n0,{className:"w-3 h-3 text-emerald-400"}),d.jsxs("span",{className:"truncate",children:["Hash: ",t.arguments_hash.substring(0,24),"..."]})]})]}),d.jsx("div",{className:"pt-2 border-t border-os-border/60 flex items-center justify-between",children:r==="pending"?d.jsxs("div",{className:"flex items-center gap-2.5 w-full justify-end",children:[d.jsx(tt,{variant:"ghost",size:"sm",onClick:p,isLoading:a,leftIcon:d.jsx(Zu,{className:"w-3.5 h-3.5"}),children:"Reject"}),d.jsx(tt,{variant:"primary",size:"sm",onClick:f,isLoading:a,leftIcon:d.jsx(bn,{className:"w-3.5 h-3.5"}),children:"Approve & Execute"})]}):r==="approved"?d.jsxs("div",{className:"flex items-center gap-2 text-xs font-medium text-emerald-400 py-1",children:[d.jsx(bn,{className:"w-4 h-4"}),d.jsx("span",{children:"Approved & Safely Executed"})]}):d.jsxs("div",{className:"flex items-center gap-2 text-xs font-medium text-rose-400 py-1",children:[d.jsx(Zu,{className:"w-4 h-4"}),d.jsx("span",{children:"Action Rejected"})]})})]})},Pb=({execution:t})=>d.jsxs("div",{className:"rounded-glass-md border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm p-3.5 my-2.5",children:[d.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-emerald-500/20",children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx(S0,{className:"w-4 h-4 text-emerald-400"}),d.jsx("span",{className:"text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider",children:"Real-World Verification"})]}),d.jsx(Tt,{variant:"emerald",size:"sm",icon:d.jsx(bn,{className:"w-3 h-3"}),children:"VERIFIED"})]}),d.jsxs("div",{className:"pt-2 text-xs space-y-1.5 font-mono",children:[d.jsxs("div",{className:"text-os-secondary",children:["Target Operation: ",d.jsx("span",{className:"text-os-primary font-medium",children:t.tool})]}),d.jsxs("div",{className:"space-y-1 pt-1 text-[11px] text-emerald-300/90",children:[d.jsxs("div",{className:"flex items-center gap-1.5",children:[d.jsx(bn,{className:"w-3 h-3 text-emerald-400 flex-shrink-0"}),d.jsx("span",{children:"Action completed via connector safe pipeline"})]}),d.jsxs("div",{className:"flex items-center gap-1.5",children:[d.jsx(bn,{className:"w-3 h-3 text-emerald-400 flex-shrink-0"}),d.jsx("span",{children:"External read-back verification confirmed"})]}),d.jsxs("div",{className:"flex items-center gap-1.5",children:[d.jsx(bn,{className:"w-3 h-3 text-emerald-400 flex-shrink-0"}),d.jsx("span",{children:"Receipt stored in World Model evidence ledger"})]})]}),t.receipt&&d.jsx("div",{className:"mt-2 p-2 rounded bg-black/30 border border-white/5 text-[10px] text-os-muted overflow-x-auto max-h-28",children:d.jsx("pre",{children:JSON.stringify(t.receipt,null,2)})})]})]}),Lb=()=>{const{me:t,orbState:e,setOrbState:n,addNotification:i}=cn(),{isVoiceActive:r,toggleVoice:s}=Rx(),[a,o]=q.useState([{id:"welcome",sender:"os",content:`Hello ${(t==null?void 0:t.name)||"Sai"}. I'm OS, your personal AI operating system. I can plan your day, research topics, execute email and calendar actions with safety verification, and monitor your commitments. How can I help right now?`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),[l,c]=q.useState(""),[f,p]=q.useState(!1),h=q.useRef(null),m=q.useRef(null),x=()=>{var u;(u=h.current)==null||u.scrollIntoView({behavior:"smooth"})};q.useEffect(()=>{x()},[a,f]);const _=u=>{const v=(u||l).trim();if(!v||f)return;const S={id:Math.random().toString(36).substring(2,9),sender:"user",content:v,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},N=Math.random().toString(36).substring(2,9),A={id:N,sender:"os",content:"",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),streaming:!0};o(w=>[...w,S,A]),c(""),p(!0),n("THINKING"),Rb(v,w=>{n("SPEAKING"),o(R=>R.map(b=>b.id===N?{...b,content:b.content+w}:b))},w=>{p(!1),n("IDLE"),o(R=>R.map(b=>b.id===N?{...b,content:w.main||b.content||w.full,streaming:!1,actionApproval:w.action_approval||w.approval||null,execution:w.execution||null}:b))},w=>{p(!1),n("IDLE"),o(R=>R.map(b=>b.id===N?{...b,content:b.content||`I encountered an issue reaching the model or tools: ${w.message}. Please verify local services are running.`,streaming:!1}:b)),i({type:"error",title:"Engine Error",message:w.message})})},g=["Plan my day and resolve conflicts","What matters right now and what is blocked?","Review all pending approvals","Research recent breakthroughs in AI agents"];return d.jsxs("div",{className:"flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-4 md:px-6 py-4",children:[d.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-os-border mb-3 select-none",children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsx(fv,{state:e,size:32}),d.jsxs("div",{children:[d.jsx("h2",{className:"text-sm font-semibold text-os-primary tracking-tight",children:"Ask OS"}),d.jsx("p",{className:"text-[11px] text-os-secondary",children:"Personal intelligence canvas · Safe execution active"})]})]}),d.jsx("div",{className:"flex items-center gap-2",children:f&&d.jsxs("span",{className:"flex items-center gap-1.5 text-xs text-cyan-400 font-mono",children:[d.jsx(Xn,{className:"w-3.5 h-3.5 animate-spin"}),"OS is working..."]})})]}),d.jsxs("div",{className:"flex-1 overflow-y-auto pr-2 space-y-4",children:[a.map(u=>d.jsxs("div",{className:`flex flex-col ${u.sender==="user"?"items-end":"items-start"} transition-all`,children:[d.jsx("div",{className:"flex items-center gap-2 mb-1 px-1",children:u.sender==="user"?d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"text-[10px] font-mono text-os-muted",children:u.timestamp}),d.jsx("span",{className:"text-xs font-medium text-os-secondary",children:"You"})]}):d.jsxs(d.Fragment,{children:[d.jsx("img",{src:"/static/logo.png",alt:"OS",className:"w-4 h-4 rounded-full object-contain filter drop-shadow-[0_0_6px_rgba(99,102,241,0.4)]"}),d.jsx("span",{className:"text-xs font-semibold text-os-secondary",children:"OS"}),d.jsx("span",{className:"text-[10px] font-mono text-os-muted",children:u.timestamp})]})}),d.jsxs("div",{className:`max-w-2xl rounded-glass-lg p-4 text-xs md:text-sm leading-relaxed ${u.sender==="user"?"bg-emerald-500/15 border border-emerald-500/25 text-os-primary rounded-br-sm":"glass-panel border-os-border-glass text-os-primary rounded-bl-sm"}`,children:[d.jsx("div",{className:"whitespace-pre-wrap",children:u.content}),u.streaming&&d.jsxs("div",{className:"inline-flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-mono",children:[d.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"}),d.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse delay-75"}),d.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse delay-150"})]}),u.toolCalls&&u.toolCalls.length>0&&d.jsx("div",{className:"mt-3 pt-2 border-t border-white/5 space-y-1",children:u.toolCalls.map(v=>d.jsx(Nb,{step:v},v.id))}),u.actionApproval&&d.jsx(Hd,{approval:u.actionApproval}),u.execution&&u.execution.verified&&d.jsx(Pb,{execution:u.execution})]})]},u.id)),d.jsx("div",{ref:h})]}),a.length<4&&!f&&d.jsx("div",{className:"py-2 flex flex-wrap gap-2",children:g.map(u=>d.jsx("button",{onClick:()=>_(u),className:"btn-press px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-os-border hover:border-os-border-glass text-xs text-os-secondary hover:text-os-primary transition-all select-none",children:u},u))}),d.jsxs("div",{className:"pt-2 select-none",children:[d.jsxs("div",{className:"glass-panel rounded-glass-xl border-os-border-glass p-2 shadow-2xl flex items-center gap-2",children:[d.jsx("button",{onClick:s,className:`btn-press p-2.5 rounded-glass-md transition-all ${r?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glass-glow":"text-os-muted hover:text-os-primary hover:bg-white/5"}`,title:"Voice talk mode",children:r?d.jsx(o0,{className:"w-4 h-4 animate-pulse"}):d.jsx(s0,{className:"w-4 h-4"})}),d.jsx("input",{ref:m,type:"text",value:l,onChange:u=>c(u.target.value),onKeyDown:u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),_())},placeholder:"Ask OS anything or direct an action (e.g., 'Schedule meeting with Alex at 3pm')...",className:"flex-1 bg-transparent px-2 text-xs md:text-sm text-os-primary placeholder:text-os-muted focus:outline-none",disabled:f}),d.jsx("button",{onClick:()=>_(),disabled:!l.trim()||f,className:"btn-press p-2.5 rounded-glass-md bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glass-glow",children:d.jsx(v0,{className:"w-4 h-4"})})]}),d.jsxs("div",{className:"flex items-center justify-between px-3 pt-1.5 text-[10px] text-os-muted font-mono",children:[d.jsx("span",{children:"Press Enter to send"}),d.jsx("span",{children:"End-to-end safe execution boundary active"})]})]})]})},Db=()=>{const{addNotification:t}=cn(),[e,n]=q.useState(null),[i,r]=q.useState([]),[s,a]=q.useState(!0),[o,l]=q.useState(!1),[c,f]=q.useState(new Date().toISOString().split("T")[0]),p=async m=>{a(!0);try{const x=await $e.getPlan(m||c);n(x.plan),r(x.items||[])}catch(x){console.error("Failed to load plan:",x)}finally{a(!1)}};q.useEffect(()=>{p(c)},[c]);const h=async()=>{l(!0);try{const m=await $e.generatePlan(c);n(m.plan),r(m.items||[]),t({type:"success",title:"Plan Generated",message:"Topological dependencies & calendar busy slots reconciled."})}catch(m){t({type:"error",title:"Generation Failed",message:m.message})}finally{l(!1)}};return d.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[d.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[d.jsxs("div",{children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx("span",{className:"text-xs font-mono text-emerald-400 uppercase tracking-widest",children:"Deterministic Planner"}),d.jsx("span",{className:"h-1 w-1 rounded-full bg-emerald-400"}),d.jsx("span",{className:"text-xs text-os-secondary",children:c})]}),d.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight mt-1",children:"Day Schedule & Conflict Carving"}),d.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Strict deadline separation · Busy slot allocation · Dependency preservation"})]}),d.jsxs("div",{className:"flex items-center gap-2.5",children:[d.jsx(tt,{variant:"glass",size:"sm",onClick:()=>p(),isLoading:s,leftIcon:d.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"}),d.jsx(tt,{variant:"primary",size:"sm",onClick:h,isLoading:o,leftIcon:d.jsx(xi,{className:"w-3.5 h-3.5"}),children:"Generate / Replan"})]})]}),d.jsx("div",{className:"space-y-4",children:i.length===0?d.jsxs(Ct,{className:"p-12 text-center space-y-3",children:[d.jsx("div",{className:"w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto",children:d.jsx(Fr,{className:"w-6 h-6"})}),d.jsxs("h3",{className:"text-base font-semibold text-os-primary",children:["No scheduled plan for ",c]}),d.jsx("p",{className:"text-xs text-os-secondary max-w-sm mx-auto",children:"OS can analyze your open tasks, calendar busy slots, and deadlines to compute an optimal execution order."}),d.jsx(tt,{variant:"primary",size:"md",onClick:h,isLoading:o,leftIcon:d.jsx(xi,{className:"w-4 h-4"}),children:"Generate Daily Plan"})]}):d.jsx("div",{className:"relative pl-6 md:pl-8 border-l border-os-border/60 space-y-4",children:i.map((m,x)=>{var A,w;const _=(m.item_type||m.type||m.status||"TASK").toLowerCase(),g=_==="meeting"||_==="event",u=_==="buffer",v=m.start_time||(m.scheduled_start?new Date(m.scheduled_start).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"09:00"),y=m.end_time||(m.scheduled_end?new Date(m.scheduled_end).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"10:00"),S=m.duration_minutes||((A=m.why_now)==null?void 0:A.duration_minutes)||60,N=typeof m.why_now=="string"?m.why_now:((w=m.why_now)==null?void 0:w.rationale)||"";return d.jsxs("div",{className:"relative group",children:[d.jsx("div",{className:`absolute -left-[31px] md:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-os-bg transition-transform group-hover:scale-110 ${g?"bg-cyan-400":u?"bg-amber-400":"bg-emerald-400"}`}),d.jsxs(Ct,{className:`p-4 transition-all ${g?"border-cyan-500/20":"hover:border-os-border-glass"}`,children:[d.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-os-border/40",children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsxs("span",{className:"font-mono text-xs font-semibold text-emerald-400",children:[v," - ",y]}),d.jsx(Tt,{variant:g?"cyan":u?"amber":"emerald",size:"sm",children:_.toUpperCase()})]}),d.jsxs("span",{className:"text-[11px] font-mono text-os-muted",children:[S," min slot"]})]}),d.jsxs("div",{className:"pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[d.jsxs("div",{children:[d.jsx("h4",{className:"text-sm font-semibold text-os-primary",children:m.title||m.summary||"Scheduled Item"}),N&&d.jsxs("p",{className:"text-xs text-os-secondary mt-1 flex items-center gap-1.5",children:[d.jsx("span",{className:"font-mono text-[10px] uppercase text-os-muted",children:"Rationale:"}),d.jsx("span",{children:N})]})]}),m.task_id&&d.jsx("div",{className:"flex items-center gap-2",children:d.jsx(tt,{variant:"glass",size:"sm",leftIcon:d.jsx(bn,{className:"w-3.5 h-3.5 text-emerald-400"}),onClick:async()=>{try{await $e.completeTask(m.task_id),t({type:"success",title:"Task Completed",message:"Task marked complete and evidence registered."}),p()}catch(R){t({type:"error",title:"Update Failed",message:R.message})}},children:"Mark Done"})})]})]})]},m.id||x)})})})]})},hv=({isOpen:t,onClose:e,title:n,subtitle:i,children:r,maxWidth:s="md"})=>{if(q.useEffect(()=>{const o=l=>{l.key==="Escape"&&e()};return t&&(document.body.style.overflow="hidden",window.addEventListener("keydown",o)),()=>{document.body.style.overflow="",window.removeEventListener("keydown",o)}},[t,e]),!t)return null;const a={sm:"max-w-md",md:"max-w-xl",lg:"max-w-3xl",xl:"max-w-5xl"}[s];return d.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[d.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200",onClick:e}),d.jsx("div",{className:`relative w-full ${a} z-10 animate-in fade-in zoom-in-95 duration-200`,children:d.jsxs(Ct,{className:"p-6 border-os-border-glass shadow-2xl",children:[d.jsxs("div",{className:"flex items-start justify-between pb-4 border-b border-os-border",children:[d.jsxs("div",{children:[d.jsx("h3",{className:"text-lg font-semibold text-os-primary",children:n}),i&&d.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:i})]}),d.jsx("button",{onClick:e,className:"text-os-muted hover:text-os-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors",children:d.jsx(Bf,{className:"w-5 h-5"})})]}),d.jsx("div",{className:"mt-4",children:r})]})})]})},Ib=()=>{const{addNotification:t}=cn(),[e,n]=q.useState("commitments"),[i,r]=q.useState([]),[s,a]=q.useState([]),[o,l]=q.useState(!0),[c,f]=q.useState(!1),[p,h]=q.useState(""),[m,x]=q.useState(""),[_,g]=q.useState(""),[u,v]=q.useState(50),[y,S]=q.useState(!1),N=async()=>{l(!0);try{const[w,R]=await Promise.allSettled([$e.getCommitments(),$e.getTasks()]);w.status==="fulfilled"&&r(w.value.commitments||[]),R.status==="fulfilled"&&a(R.value.tasks||[])}catch(w){console.error("Failed to load tasks/commitments:",w)}finally{l(!1)}};q.useEffect(()=>{N()},[]);const A=async()=>{if(p.trim()){S(!0);try{e==="commitments"?(await $e.createCommitment({title:p.trim(),description:m.trim()||void 0,deadline:_||null,priority:u}),t({type:"success",title:"Commitment Registered",message:"Saved to World Model with immutable deadline tracking."})):(await $e.createTask(p.trim(),{priority:u,deadline:_||null}),t({type:"success",title:"Task Created",message:"Task added to execution pool."})),f(!1),h(""),x(""),g(""),N()}catch(w){t({type:"error",title:"Creation Failed",message:w.message})}finally{S(!1)}}};return d.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[d.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[d.jsxs("div",{children:[d.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Commitments & Work"}),d.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Real-world contractual commitments vs tactical execution tasks"})]}),d.jsxs("div",{className:"flex items-center gap-2.5",children:[d.jsx(tt,{variant:"glass",size:"sm",onClick:N,isLoading:o,leftIcon:d.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"}),d.jsx(tt,{variant:"primary",size:"sm",onClick:()=>f(!0),leftIcon:d.jsx(p0,{className:"w-3.5 h-3.5"}),children:e==="commitments"?"New Commitment":"New Task"})]})]}),d.jsxs("div",{className:"flex items-center gap-2 border-b border-os-border select-none",children:[d.jsxs("button",{onClick:()=>n("commitments"),className:`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${e==="commitments"?"border-emerald-400 text-emerald-400":"border-transparent text-os-secondary hover:text-os-primary"}`,children:["Commitments (",i.length,")"]}),d.jsxs("button",{onClick:()=>n("tasks"),className:`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${e==="tasks"?"border-emerald-400 text-emerald-400":"border-transparent text-os-secondary hover:text-os-primary"}`,children:["Tasks (",s.length,")"]})]}),e==="commitments"?d.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:i.length===0?d.jsx("div",{className:"col-span-full py-12 text-center text-xs text-os-muted",children:"No active commitments found. Create one or let OS detect commitments from email."}):i.map(w=>d.jsxs(Ct,{className:"p-5 space-y-3",children:[d.jsxs("div",{className:"flex items-start justify-between gap-2",children:[d.jsxs("div",{children:[d.jsx("span",{className:"text-[10px] font-mono uppercase tracking-wider text-emerald-400",children:"Commitment"}),d.jsx("h3",{className:"text-base font-bold text-os-primary mt-0.5",children:w.title})]}),d.jsx(Tt,{variant:w.status==="active"?"emerald":"neutral",size:"sm",children:w.status.toUpperCase()})]}),w.description&&d.jsx("p",{className:"text-xs text-os-secondary leading-relaxed",children:w.description}),d.jsxs("div",{className:"pt-2 border-t border-os-border/50 grid grid-cols-2 gap-2 text-[11px] font-mono",children:[d.jsxs("div",{children:[d.jsx("span",{className:"text-os-muted block text-[10px]",children:"DEADLINE"}),d.jsx("span",{className:"text-os-primary font-medium",children:w.deadline?new Date(w.deadline).toLocaleDateString():"None set"})]}),d.jsxs("div",{children:[d.jsx("span",{className:"text-os-muted block text-[10px]",children:"PRIORITY"}),d.jsxs("span",{className:"text-emerald-400 font-medium",children:[w.priority," / 100"]})]})]})]},w.id))}):d.jsx("div",{className:"space-y-2.5",children:s.length===0?d.jsx("div",{className:"py-12 text-center text-xs text-os-muted",children:"No tasks currently tracked."}):s.map(w=>{const R=w.status==="DONE";return d.jsxs(Ct,{className:`p-4 flex items-center justify-between transition-all ${R?"opacity-60 bg-white/2":""}`,children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsx("button",{onClick:async()=>{if(!R)try{await $e.completeTask(String(w.id)),t({type:"success",title:"Task Done",message:"Completion recorded with verification."}),N()}catch(b){t({type:"error",title:"Failed",message:b.message})}},className:`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${R?"bg-emerald-500 border-emerald-500 text-black":"border-os-border hover:border-emerald-400 text-transparent"}`,children:d.jsx(bn,{className:"w-3.5 h-3.5"})}),d.jsxs("div",{children:[d.jsx("div",{className:`text-xs md:text-sm font-medium ${R?"line-through text-os-muted":"text-os-primary"}`,children:w.title}),d.jsxs("div",{className:"text-[10px] font-mono text-os-muted mt-0.5",children:["Duration: ",w.estimated_duration_minutes||60,"m · Priority: ",w.priority||50]})]})]}),d.jsx(Tt,{variant:R?"neutral":"cyan",size:"sm",children:w.status})]},w.id)})}),d.jsx(hv,{isOpen:c,onClose:()=>f(!1),title:e==="commitments"?"Register New Commitment":"Create Task",subtitle:"Saved to the World Model database.",children:d.jsxs("div",{className:"space-y-4 text-xs",children:[d.jsxs("div",{children:[d.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Title"}),d.jsx("input",{type:"text",value:p,onChange:w=>h(w.target.value),placeholder:"e.g. Send final investment proposal",className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"})]}),e==="commitments"&&d.jsxs("div",{children:[d.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Description"}),d.jsx("textarea",{value:m,onChange:w=>x(w.target.value),placeholder:"Contractual context, scope, or conditions...",rows:3,className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"})]}),d.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[d.jsxs("div",{children:[d.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Deadline"}),d.jsx("input",{type:"date",value:_,onChange:w=>g(w.target.value),className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"})]}),d.jsxs("div",{children:[d.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Priority (1-100)"}),d.jsx("input",{type:"number",min:"1",max:"100",value:u,onChange:w=>v(Number(w.target.value)),className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"})]})]}),d.jsxs("div",{className:"flex justify-end gap-2 pt-3 border-t border-os-border",children:[d.jsx(tt,{variant:"ghost",size:"sm",onClick:()=>f(!1),children:"Cancel"}),d.jsx(tt,{variant:"primary",size:"sm",onClick:A,isLoading:y,children:"Save"})]})]})})]})},Ub=()=>{const{refreshData:t}=cn(),[e,n]=q.useState([]),[i,r]=q.useState([]),[s,a]=q.useState(!0),o=async()=>{a(!0);try{const[c,f]=await Promise.allSettled([$e.getV1Approvals(),$e.getPendingActions()]);c.status==="fulfilled"&&n(c.value.pending_approvals||[]),f.status==="fulfilled"&&r(f.value.pending||[])}catch(c){console.error("Failed to load approvals:",c)}finally{a(!1)}};q.useEffect(()=>{o()},[]);const l=e.length+i.length;return d.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[d.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[d.jsxs("div",{children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx("span",{className:"text-xs font-mono text-amber-400 uppercase tracking-widest",children:"Governance & Safety"}),d.jsx("span",{className:"h-1 w-1 rounded-full bg-amber-400"}),d.jsxs("span",{className:"text-xs text-os-secondary",children:[l," pending review"]})]}),d.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight mt-1",children:"Safety & Action Approval Center"}),d.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Cryptographic SHA-256 tamper detection · Double-execution prevention · Expiry guards"})]}),d.jsx(tt,{variant:"glass",size:"sm",onClick:o,isLoading:s,leftIcon:d.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh Queue"})]}),d.jsx(Ct,{className:"p-4 border-amber-500/20 bg-amber-500/5",children:d.jsxs("div",{className:"flex items-start gap-3",children:[d.jsx("div",{className:"p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0",children:d.jsx(n0,{className:"w-4 h-4"})}),d.jsxs("div",{className:"text-xs space-y-1",children:[d.jsx("h4",{className:"font-semibold text-os-primary",children:"OS Safe Execution Policy"}),d.jsxs("p",{className:"text-os-secondary leading-relaxed",children:["Every external write operation (sending emails, modifying calendar events, writing to external APIs) is intercepted by the ",d.jsx("code",{children:"SafeExecutor"}),". The exact arguments are hashed; any parameter tampering between approval and execution results in an immediate abort."]})]})]})}),d.jsx("div",{className:"space-y-4",children:l===0?d.jsxs(Ct,{className:"p-12 text-center space-y-3",children:[d.jsx("div",{className:"w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto",children:d.jsx(bn,{className:"w-6 h-6"})}),d.jsx("h3",{className:"text-base font-semibold text-os-primary",children:"Queue Clear"}),d.jsx("p",{className:"text-xs text-os-secondary max-w-sm mx-auto",children:"There are no pending actions requiring your authorization. OS is running in safe read-only mode for all external channels."})]}):d.jsxs("div",{className:"space-y-4",children:[i.map(c=>d.jsx(Hd,{approval:{id:c.id,aid:c.id,connector_id:c.connector_id,connector_name:c.connector_name,action:c.action,params:c.params,status:"pending"},onDecided:()=>{o(),t()}},c.id)),e.map(c=>d.jsx(Hd,{approval:{id:c.approval_id,action:c.tool_name,risk_level:c.risk_level,params:c.arguments,arguments_hash:c.arguments_hash,status:"pending"},onDecided:()=>{o(),t()}},c.approval_id))]})})]})},kb=()=>{const{addNotification:t,refreshData:e}=cn(),[n,i]=q.useState([]),[r,s]=q.useState(!0),[a,o]=q.useState(!1),[l,c]=q.useState("research"),[f,p]=q.useState(""),[h,m]=q.useState(!1),x=async()=>{s(!0);try{const u=await $e.getAgents();i(u.agent_runs||[])}catch(u){console.error("Failed to load agent runs:",u)}finally{s(!1)}};q.useEffect(()=>{x()},[]);const _=async()=>{if(f.trim()){m(!0);try{await $e.dispatchAgent(l,f.trim()),t({type:"success",title:"Worker Dispatched",message:`${l.toUpperCase()} worker launched in background.`}),o(!1),p(""),x(),e()}catch(u){t({type:"error",title:"Dispatch Failed",message:u.message})}finally{m(!1)}}},g=[{name:"OpenCode Assistant",type:"coding",icon:Gx,desc:"Local AST code editing, test running, and repository refactoring.",status:"Ready",color:"emerald"},{name:"Agent-Browser",type:"browser",icon:Qu,desc:"Playwright headless/headful web navigation, form fill, and screenshot extraction.",status:"Ready",color:"cyan"},{name:"GPT-Researcher",type:"research",icon:zs,desc:"Multi-source web evidence gathering, citation cross-checking, and synthesis.",status:"Ready",color:"purple"},{name:"Continuous Planner",type:"planner",icon:Fr,desc:"Topological dependency sorting, conflict carving, and deadline monitoring.",status:"Monitoring",color:"amber"}];return d.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[d.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[d.jsxs("div",{children:[d.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Specialized OS Workers"}),d.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Dedicated execution units for coding, browser automation, and deep research"})]}),d.jsxs("div",{className:"flex items-center gap-2.5",children:[d.jsx(tt,{variant:"glass",size:"sm",onClick:x,isLoading:r,leftIcon:d.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"}),d.jsx(tt,{variant:"primary",size:"sm",onClick:()=>o(!0),leftIcon:d.jsx(p0,{className:"w-3.5 h-3.5"}),children:"Dispatch Task"})]})]}),d.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:g.map(u=>{const v=u.icon;return d.jsxs(Ct,{className:"p-4 space-y-3",children:[d.jsxs("div",{className:"flex items-center justify-between",children:[d.jsx("div",{className:"p-2 rounded-lg bg-white/5 border border-white/10 text-os-secondary",children:d.jsx(v,{className:"w-4 h-4 text-emerald-400"})}),d.jsx(Tt,{variant:u.status==="Monitoring"?"cyan":"emerald",size:"sm",children:u.status})]}),d.jsxs("div",{children:[d.jsx("h3",{className:"text-sm font-bold text-os-primary",children:u.name}),d.jsx("p",{className:"text-[11px] text-os-secondary mt-1 leading-snug",children:u.desc})]}),d.jsx("div",{className:"pt-2 border-t border-os-border/40",children:d.jsxs("button",{onClick:()=>{c(u.type),o(!0)},className:"text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1",children:[d.jsx("span",{children:"Dispatch worker"}),d.jsx("span",{children:"→"})]})})]},u.name)})}),d.jsxs("section",{className:"space-y-3",children:[d.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[d.jsx(Ga,{className:"w-3.5 h-3.5"}),d.jsx("span",{children:"Recent Worker Runs"})]}),d.jsx(Ct,{className:"p-4 space-y-2",children:n.length===0?d.jsx("div",{className:"py-8 text-center text-xs text-os-muted",children:'No recent worker tasks recorded. Use "Dispatch Task" or direct OS in chat.'}):n.map(u=>{var N;const v=u.instruction||((N=u.input_reference)==null?void 0:N.instruction)||u.workflow_type||"Worker execution",y=(u.status||"").toLowerCase(),S=y==="completed"||y==="succeeded"?"emerald":y==="running"?"amber":y==="failed"?"danger":"neutral";return d.jsxs("div",{className:"flex items-center justify-between p-3 rounded-glass-sm bg-white/5 hover:bg-white/10 transition-colors text-xs",children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsx(Tt,{variant:"cyan",size:"sm",children:u.agent_type.toUpperCase()}),d.jsx("span",{className:"font-medium text-os-primary",children:v})]}),d.jsxs("div",{className:"flex items-center gap-3 font-mono text-[11px]",children:[d.jsx(Tt,{variant:S,size:"sm",children:u.status}),u.created_at&&d.jsx("span",{className:"text-os-muted",children:new Date(u.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]})]},u.id)})})]}),d.jsx(hv,{isOpen:a,onClose:()=>o(!1),title:"Dispatch Autonomous Worker",subtitle:"Worker will execute in the background with policy bounds.",children:d.jsxs("div",{className:"space-y-4 text-xs",children:[d.jsxs("div",{children:[d.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Worker Type"}),d.jsxs("select",{value:l,onChange:u=>c(u.target.value),className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400",children:[d.jsx("option",{value:"research",children:"GPT-Researcher (Web & Evidence)"}),d.jsx("option",{value:"browser",children:"Agent-Browser (Playwright Web Automation)"}),d.jsx("option",{value:"coding",children:"OpenCode (Code Writer / Editor)"})]})]}),d.jsxs("div",{children:[d.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Instruction / Objective"}),d.jsx("textarea",{value:f,onChange:u=>p(u.target.value),placeholder:"e.g. Research the latest benchmarks for reasoning models...",rows:4,className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"})]}),d.jsxs("div",{className:"flex justify-end gap-2 pt-3 border-t border-os-border",children:[d.jsx(tt,{variant:"ghost",size:"sm",onClick:()=>o(!1),children:"Cancel"}),d.jsx(tt,{variant:"primary",size:"sm",onClick:_,isLoading:h,leftIcon:d.jsx(v0,{className:"w-3.5 h-3.5"}),children:"Dispatch"})]})]})})]})},Ob=()=>{const[t,e]=q.useState([]),[n,i]=q.useState(!0),[r,s]=q.useState(null),[a,o]=q.useState(""),l=async()=>{i(!0);try{const f=await $e.getActivity(100);e(f.activity||[])}catch(f){console.error("Failed to load activity log:",f)}finally{i(!1)}};q.useEffect(()=>{l()},[]);const c=t.filter(f=>{const p=f.summary||f.description||f.event_type||"",h=f.action_type||f.event_type||"";return p.toLowerCase().includes(a.toLowerCase())||h.toLowerCase().includes(a.toLowerCase())});return d.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[d.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[d.jsxs("div",{children:[d.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Evidence & Audit Trail"}),d.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Immutable log of system decisions, execution receipts, and external read-back verifications"})]}),d.jsx(tt,{variant:"glass",size:"sm",onClick:l,isLoading:n,leftIcon:d.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"})]}),d.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 rounded-glass-md bg-white/5 border border-os-border text-xs max-w-md",children:[d.jsx(zs,{className:"w-4 h-4 text-os-muted"}),d.jsx("input",{type:"text",value:a,onChange:f=>o(f.target.value),placeholder:"Filter activity by action or keyword...",className:"w-full bg-transparent text-os-primary focus:outline-none placeholder:text-os-muted"})]}),d.jsx("div",{className:"space-y-3",children:c.length===0?d.jsx(Ct,{className:"p-12 text-center text-xs text-os-muted",children:"No activity records matching your query."}):c.map(f=>{var u;const p=r===f.id,h=f.evidence_receipt||f.metadata,m=!!h&&Object.keys(h).length>0,x=f.summary||f.description||f.event_type||"Activity logged",_=f.event_type||f.action_type||"Event",g=f.timestamp||f.created_at?new Date(f.timestamp||f.created_at).toLocaleTimeString():"Recorded";return d.jsxs(Ct,{className:"p-4 transition-all",children:[d.jsxs("div",{onClick:()=>m&&s(p?null:f.id),className:`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${m?"cursor-pointer select-none":""}`,children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsx("div",{className:"p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400",children:d.jsx(S0,{className:"w-4 h-4"})}),d.jsxs("div",{children:[d.jsx("div",{className:"text-xs font-semibold text-os-primary",children:x}),d.jsxs("div",{className:"text-[10px] font-mono text-os-muted",children:["Type: ",_]})]})]}),d.jsxs("div",{className:"flex items-center gap-3 font-mono text-[11px]",children:[d.jsx("span",{className:"text-os-muted",children:g}),d.jsx(Tt,{variant:"emerald",size:"sm",children:f.status||((u=f.metadata)==null?void 0:u.status)||"VERIFIED"}),m&&d.jsx("button",{className:"text-os-muted hover:text-os-primary",children:p?d.jsx(Fx,{className:"w-4 h-4"}):d.jsx(ya,{className:"w-4 h-4"})})]})]}),p&&h&&d.jsxs("div",{className:"mt-3 pt-3 border-t border-os-border/50 text-xs font-mono",children:[d.jsxs("div",{className:"flex items-center gap-1.5 text-emerald-400 text-[11px] mb-1.5",children:[d.jsx(aS,{className:"w-3.5 h-3.5"}),d.jsx("span",{children:"World Model Evidence Receipt"})]}),d.jsx("pre",{className:"p-2.5 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-os-secondary max-h-40",children:JSON.stringify(h,null,2)})]})]},f.id)})})]})},Fb=()=>{const{addNotification:t}=cn(),[e,n]=q.useState([]),[i,r]=q.useState(!0),[s,a]=q.useState(null),o=async()=>{r(!0);try{const c=await $e.getConnectors();n(c.connectors||[])}catch(c){console.error("Failed to load connectors:",c)}finally{r(!1)}};q.useEffect(()=>{o()},[]);const l=async c=>{var f;a(c);try{const p=await $e.testConnector(c);p.ok?t({type:"success",title:"Connector Healthy",message:`${c} passed live API verification.`}):t({type:"warning",title:"Connection Notice",message:((f=p.status)==null?void 0:f.health_msg)||"Requires credential or permission review."}),o()}catch(p){t({type:"error",title:"Health Check Failed",message:p.message})}finally{a(null)}};return d.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[d.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[d.jsxs("div",{children:[d.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Connectors & Integrations"}),d.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Permission-gated live external adapters for email, calendar, and workplace services"})]}),d.jsx(tt,{variant:"glass",size:"sm",onClick:o,isLoading:i,leftIcon:d.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh All"})]}),d.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",children:e.map(c=>{var h;const f=c.state==="connected",p=s===c.id;return d.jsxs(Ct,{className:`p-4 space-y-3 transition-all ${f?"border-emerald-500/25":""}`,children:[d.jsxs("div",{className:"flex items-center justify-between",children:[d.jsxs("div",{className:"flex items-center gap-2.5",children:[d.jsx("span",{className:"text-xl select-none",children:c.icon||"🔌"}),d.jsxs("div",{children:[d.jsx("h3",{className:"text-sm font-bold text-os-primary",children:c.name}),d.jsx("span",{className:"text-[10px] font-mono uppercase text-os-muted",children:c.category||"Connector"})]})]}),d.jsx(Tt,{variant:f?"emerald":c.state==="setup_error"?"danger":"neutral",size:"sm",children:c.state.toUpperCase()})]}),c.health_msg&&d.jsx("p",{className:"text-[11px] text-os-secondary leading-snug line-clamp-2",children:c.health_msg}),d.jsxs("div",{className:"pt-2 border-t border-os-border/40 flex items-center justify-between",children:[d.jsxs("span",{className:"text-[10px] font-mono text-os-muted",children:[((h=c.scopes_granted)==null?void 0:h.length)||0," permissions"]}),d.jsx(tt,{variant:"glass",size:"sm",onClick:()=>l(c.id),isLoading:p,leftIcon:d.jsx(_S,{className:"w-3 h-3 text-emerald-400"}),children:"Test Connection"})]})]},c.id)})})]})},zb=()=>{const{addNotification:t}=cn(),[e,n]=q.useState([]),[i,r]=q.useState(!0),[s,a]=q.useState(""),o=async()=>{r(!0);try{const f=await $e.getMemory();n(f.memories||[])}catch(f){console.error("Failed to load memory:",f)}finally{r(!1)}};q.useEffect(()=>{o()},[]);const l=async f=>{try{await $e.forgetMemory(f),t({type:"info",title:"Memory Cleared",message:`OS has forgotten: "${f}"`}),o()}catch(p){t({type:"error",title:"Delete Failed",message:p.message})}},c=e.filter(f=>{const p=(f.key||"").toLowerCase(),h=(typeof f.value=="string"?f.value:JSON.stringify(f.value||"")).toLowerCase(),m=(f.type||"").toLowerCase(),x=s.toLowerCase();return p.includes(x)||h.includes(x)||m.includes(x)});return d.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[d.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[d.jsxs("div",{children:[d.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"OS Memory & Knowledge"}),d.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"What OS knows about your preferences, projects, context, and working style"})]}),d.jsx(tt,{variant:"glass",size:"sm",onClick:o,isLoading:i,leftIcon:d.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"})]}),d.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 rounded-glass-md bg-white/5 border border-os-border text-xs max-w-md",children:[d.jsx(zs,{className:"w-4 h-4 text-os-muted"}),d.jsx("input",{type:"text",value:s,onChange:f=>a(f.target.value),placeholder:"Search what OS remembers...",className:"w-full bg-transparent text-os-primary focus:outline-none placeholder:text-os-muted"})]}),d.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:c.length===0?d.jsx("div",{className:"col-span-full py-12 text-center text-xs text-os-muted",children:"No memories match your query. OS learns preferences naturally as you converse and assign tasks."}):c.map(f=>d.jsxs(Ct,{className:"p-4 space-y-2.5",children:[d.jsxs("div",{className:"flex items-start justify-between gap-2",children:[d.jsxs("div",{className:"flex items-center gap-2",children:[d.jsx(Tt,{variant:"purple",size:"sm",children:f.type.toUpperCase()}),d.jsx("h4",{className:"text-xs font-bold text-os-primary font-mono",children:f.key})]}),d.jsx("button",{onClick:()=>l(f.key),className:"text-os-muted hover:text-rose-400 p-1 rounded hover:bg-white/5 transition-colors",title:"Forget this memory",children:d.jsx(xS,{className:"w-3.5 h-3.5"})})]}),d.jsx("p",{className:"text-xs text-os-secondary leading-relaxed bg-black/20 p-2.5 rounded-glass-sm border border-white/5",children:f.value}),d.jsxs("div",{className:"text-[10px] font-mono text-os-muted flex items-center gap-1 pt-1",children:[d.jsx(Fr,{className:"w-3 h-3"}),d.jsxs("span",{children:["Updated: ",f.updated_at||"Recently"]})]})]},f.key))})]})},Bb=()=>{var ce;const[t,e]=q.useState({forge:{dot_id:"forge",name:"Forge",role:"Coding & Autonomous Terminal Engineer",permissions:["files","shell","memory"]},scout:{dot_id:"scout",name:"Scout",role:"Deep Research & Web Specialist",permissions:["browser","memory"]},scribe:{dot_id:"scribe",name:"Scribe",role:"Space & Documentation Architect",permissions:["files","memory"]},sentinel:{dot_id:"sentinel",name:"Sentinel",role:"System Diagnostics & Security Monitor",permissions:["memory"]}}),[n,i]=q.useState("forge"),[r,s]=q.useState("STANDBY"),[a,o]=q.useState(null),[l,c]=q.useState("ollama/qwen3.5:35b"),[f,p]=q.useState({traces:2,energy:"0.064 J",latency:"4.2 ms"}),[h,m]=q.useState(!1),[x,_]=q.useState([`$ os init --hardware-aware
[OK] Detected hardware architecture + local engine active.`,`$ os doctor
[OK] All 5 Composable Primitives verified. Safety gates active.`]),[g,u]=q.useState("OS Architecture & Lab Roadmap"),[v,y]=q.useState(`# OS Synthesis
- OpenJarvis: Local-first 5 primitives + energy telemetry
- OpenMuse: Agent Computer container + Take Control
- OpenDots: Scoped Dots + Revision-checked Spaces`),[S,N]=q.useState(1),[A,w]=q.useState([{id:"init-1",sender:"os",text:`OS v1.0 Control Plane Online.
• OpenJarvis: 5 Composable Primitives active.
• OpenMuse: Agent Computer & Sandbox Worker connected.
• OpenDots: 4 Specialist Coworkers (@forge, @scout, @scribe, @sentinel) & Revision-Safe Spaces verified.`}]),[R,b]=q.useState(""),[M,P]=q.useState("OS online and standing by, Sai."),G=q.useRef(null),O=q.useRef(null),Y=q.useCallback(async()=>{try{const z=await $e.getHudState();if(z.dots&&e(z.dots),z.runtime_state&&s(z.runtime_state),z.hardware&&(o(z.hardware),c(`${z.hardware.preferred_engine||"ollama"}/${z.hardware.recommended_local_model||"qwen3.5:35b"}`)),z.telemetry&&p({traces:z.telemetry.total_traces||2,energy:`${z.telemetry.total_energy_joules||.064} J`,latency:`${z.telemetry.avg_latency_ms||4.2} ms`}),z.computer&&m(z.computer.user_took_control||!1),z.spaces&&z.spaces.pages&&z.spaces.pages.length>0){const re=z.spaces.pages[0];u(re.title),y(re.markdown),N(re.revision)}}catch(z){console.warn("Failed to load initial HUD state:",z)}},[]);q.useEffect(()=>{Y()},[Y]),q.useEffect(()=>{O.current&&(O.current.scrollTop=O.current.scrollHeight)},[A]),q.useEffect(()=>{const z=G.current;if(!z)return;const re=z.getContext("2d");if(!re)return;let H,ne=0;const ue=()=>{z.width=z.clientWidth,z.height=z.clientHeight};ue(),window.addEventListener("resize",ue);const ie=()=>{re.clearRect(0,0,z.width,z.height);const ve=z.width/2,ge=z.height/2;ne+=.018,re.save(),re.translate(ve,ge),re.rotate(ne*.6),re.strokeStyle="rgba(0, 240, 255, 0.35)",re.lineWidth=2,re.setLineDash([12,8,4,8]),re.beginPath(),re.arc(0,0,78,0,Math.PI*2),re.stroke(),re.restore(),re.save(),re.translate(ve,ge),re.rotate(-ne*1.1),re.strokeStyle="rgba(0, 255, 157, 0.55)",re.lineWidth=3,re.setLineDash([22,14]),re.beginPath(),re.arc(0,0,58,0,Math.PI*2),re.stroke(),re.restore();const Ce=36,it=[[0,-Ce,0],[0,Ce,0],[-Ce,0,0],[Ce,0,0],[0,0,-Ce],[0,0,Ce]],Ge=[[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]],ot=it.map(([Fe,ze,Ne])=>{const rt=Math.cos(ne),Re=Math.sin(ne),C=Math.cos(ne*.7),E=Math.sin(ne*.7),F=Fe*rt-Ne*Re,J=Ne*rt+Fe*Re,se=ze*C-J*E,Ee=220/(220+(J*C+ze*E));return[ve+F*Ee,ge+se*Ee]});re.strokeStyle="#00f0ff",re.lineWidth=1.6,Ge.forEach(([Fe,ze])=>{re.beginPath(),re.moveTo(ot[Fe][0],ot[Fe][1]),re.lineTo(ot[ze][0],ot[ze][1]),re.stroke()});const U=10+Math.sin(ne*3)*3,Ft=re.createRadialGradient(ve,ge,1,ve,ge,U*2.5);Ft.addColorStop(0,"rgba(0, 240, 255, 0.95)"),Ft.addColorStop(1,"rgba(0, 240, 255, 0)"),re.fillStyle=Ft,re.beginPath(),re.arc(ve,ge,U*2.5,0,Math.PI*2),re.fill(),H=requestAnimationFrame(ie)};return ie(),()=>{window.removeEventListener("resize",ue),cancelAnimationFrame(H)}},[]);const X=async z=>{const re=z||R.trim();if(!re)return;z||b(""),w(ie=>[...ie,{id:Math.random().toString(),sender:"user",text:re}]),s("PROCESSING");const H=re.toLowerCase();let ne,ue;H.includes("rm -rf")||H.includes("format c:")||H.includes("deploy")||H.includes("docker")||H.includes("shell")||H.includes("git push")?(ne="shell_exec",ue=re):(H.startsWith("save ")||H.includes("write file"))&&(ne="file_write",ue=re);try{const ie=await $e.sendHudCommand(re,n,ne,ue);if(s(ie.state||"STANDBY"),ie.status==="blocked"){w(ge=>[...ge,{id:Math.random().toString(),sender:"os",text:`🛑 SECURITY BLOCK: ${ie.reason}`}]),_(ge=>[...ge,`[SECURITY GATE BLOCKED] ${re}`]);return}if(ie.status==="permission_denied"){w(ge=>[...ge,{id:Math.random().toString(),sender:"os",text:`⚠️ Permission Denied: ${ie.error}`}]),_(ge=>[...ge,`[PERMISSION DENIED] ${re}`]);return}if(ie.status==="waiting_approval"&&ie.approval_card){w(ge=>[...ge,{id:Math.random().toString(),sender:"os",text:`[${ie.dot}] Task Paused — Human Approval Required`,isApproval:!0,approvalData:{approval_id:ie.approval_card.approval_id,action_type:ie.approval_card.action_type,payload:ie.approval_card.payload,arguments_hash:ie.approval_card.arguments_hash}}]);return}const ve=ie.response||"Executed successfully.";P(ve.replace(/<[^>]*>?/gm,"")),w(ge=>[...ge,{id:Math.random().toString(),sender:"os",text:ve}]),ie.telemetry&&p({traces:f.traces+1,energy:`${ie.telemetry.energy_joules} J`,latency:`${ie.telemetry.latency_ms} ms`}),_(ge=>{var Ce;return[...ge,`$ os ask --dot ${n} "${re}"
[OK] Latency: ${((Ce=ie.telemetry)==null?void 0:Ce.latency_ms)||4.2}ms`]})}catch(ie){s("ERROR"),w(ve=>[...ve,{id:Math.random().toString(),sender:"os",text:`Error: ${ie.message}`}])}},$=async(z,re,H)=>{var ne,ue,ie;try{const ve=await $e.resolveHudApproval(z,re);if(w(ge=>ge.map(Ce=>{var it;return((it=Ce.approvalData)==null?void 0:it.approval_id)===z?{...Ce,isApproval:!1,text:`${Ce.text}
✓ Resolved by Operator: ${re}`}:Ce})),re==="deny")_(ge=>[...ge,`[DENIED BY OPERATOR] ${H}`]),s("STANDBY");else{const ge=((ue=(ne=ve==null?void 0:ve.execution_result)==null?void 0:ne.stdout)==null?void 0:ue.trim())||((ie=ve==null?void 0:ve.execution_result)==null?void 0:ie.status)||`Executed under policy '${re}'`;_(Ce=>[...Ce,`$ ${H}
[AGENT COMPUTER] ${ge}`]),s("STANDBY")}}catch(ve){console.error("Failed to resolve approval:",ve)}},ee=async()=>{const z=!h;m(z);try{await $e.toggleHudTakeover(z),_(re=>[...re,z?"[OPENMUSE] Human operator took interactive control of browser & terminal.":"[OPENMUSE] Returned terminal & browser session to autonomous agent worker."])}catch(re){console.error(re)}},L=async()=>{try{const z=await $e.saveHudSpacePage("engineering-hq","engineering-notes",g,v,"Sai",S);N(z.revision),_(re=>[...re,`[OPENDOTS SPACE] Saved '${g}' at Revision v${z.revision} (optimistic lock verified).`]),w(re=>[...re,{id:Math.random().toString(),sender:"os",text:`[Scribe] Saved page '${g}' to Space engineering-hq (Revision v${z.revision} verified).`}])}catch{w(re=>[...re,{id:Math.random().toString(),sender:"os",text:"⚠️ Revision Conflict: Another actor modified this page. Your draft was preserved."}])}},K=async()=>{try{const z=await $e.optimizeHudTraces();p({traces:z.total_traces,energy:`${z.total_energy_joules} J`,latency:`${z.avg_latency_ms} ms`}),w(re=>[...re,{id:Math.random().toString(),sender:"os",text:`[OS Learning Loop] Synthesized ${z.total_traces} local interaction traces.
Learned: ${z.learned_skills[z.learned_skills.length-1]||"Routing weights tuned."}`}])}catch(z){console.error(z)}},Q=()=>{if("speechSynthesis"in window){const z=new SpeechSynthesisUtterance(M);z.rate=1.02,z.pitch=.95,window.speechSynthesis.speak(z)}$e.speakHudVoice(M).catch(()=>{})};return d.jsxs("div",{className:"flex-1 p-4 flex flex-col gap-3 font-mono text-cyan-50 min-h-screen bg-[#050811]",children:[d.jsxs("div",{className:"flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#0a1324]/90 border border-cyan-500/20 backdrop-blur-md shadow-lg shadow-cyan-950/20",children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsxs("span",{className:"text-cyan-400 font-bold tracking-widest text-sm flex items-center gap-2",children:[d.jsx("span",{className:"text-cyan-300",children:"◈"})," OS // CYBER-HUD v1.0"]}),d.jsx("span",{className:"text-[11px] text-cyan-200/50 hidden md:inline",children:"OpenJarvis + OpenMuse + OpenDots Architecture"})]}),d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsx("span",{className:`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${r==="WAITING_APPROVAL"?"border-amber-400 text-amber-300 bg-amber-500/10":r==="ERROR"?"border-rose-500 text-rose-400 bg-rose-500/10":"border-emerald-400 text-emerald-300 bg-emerald-500/10"}`,children:r}),d.jsxs("button",{onClick:Q,className:"flex items-center gap-1.5 px-3 py-1 text-xs rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors",children:[d.jsx(vS,{className:"w-3.5 h-3.5"}),d.jsx("span",{children:"Voice Readout"})]})]})]}),d.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-3 flex-1",children:[d.jsxs("div",{className:"flex flex-col gap-3",children:[d.jsxs("div",{className:"p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md",children:[d.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2",children:[d.jsx("span",{children:"Specialist Coworkers"}),d.jsx("span",{className:"text-[10px] text-cyan-200/50 font-normal",children:"Scoped RBAC"})]}),d.jsx("div",{className:"flex flex-col gap-2",children:Object.entries(t).map(([z,re])=>d.jsxs("div",{onClick:()=>i(z),className:`p-2.5 rounded border transition-all cursor-pointer ${n===z?"border-cyan-400 bg-cyan-500/15 shadow-sm shadow-cyan-500/30":"border-cyan-500/15 bg-black/40 hover:border-cyan-500/40 hover:bg-cyan-500/5"}`,children:[d.jsxs("div",{className:"flex items-center justify-between text-xs font-bold",children:[d.jsxs("span",{className:"flex items-center gap-1.5",children:[d.jsx("span",{className:"text-cyan-400",children:"●"})," ",re.name]}),d.jsxs("span",{className:"text-[10px] text-cyan-400/80",children:["@",z]})]}),d.jsx("div",{className:"text-[11px] text-cyan-200/60 mt-0.5 line-clamp-1",children:re.role}),d.jsx("div",{className:"flex gap-1 flex-wrap mt-1.5",children:(re.permissions||[]).map(H=>d.jsx("span",{className:"text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300",children:H},H))})]},z))})]}),d.jsxs("div",{className:"p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md",children:[d.jsx("div",{className:"flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2",children:d.jsx("span",{children:"5 Primitives Telemetry"})}),d.jsxs("div",{className:"text-[11px] space-y-1.5 text-cyan-200/70",children:[d.jsxs("div",{className:"flex justify-between",children:[d.jsx("span",{children:"• Intelligence:"}),d.jsx("span",{className:"text-cyan-300 font-semibold",children:a?`${a.cpu_cores} Cores / ${a.ram_gb} GB`:"Auto-Detected"})]}),d.jsxs("div",{className:"flex justify-between",children:[d.jsx("span",{children:"• Engine:"}),d.jsx("span",{className:"text-cyan-400 font-mono text-[10px] truncate max-w-[170px]",children:l})]}),d.jsxs("div",{className:"flex justify-between",children:[d.jsx("span",{children:"• Energy / Latency:"}),d.jsxs("span",{className:"text-emerald-400 font-mono",children:[f.energy," / ",f.latency]})]}),d.jsxs("div",{className:"flex justify-between",children:[d.jsx("span",{children:"• Safety Gate:"}),d.jsx("span",{className:"text-emerald-400",children:"Patterns Guarded"})]}),d.jsxs("div",{className:"flex justify-between",children:[d.jsx("span",{children:"• Learning Loop:"}),d.jsxs("span",{className:"text-cyan-300",children:[f.traces," traces tuned"]})]})]}),d.jsxs("div",{className:"grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-cyan-500/20",children:[d.jsx("button",{onClick:()=>X("Generate my morning briefing"),className:"px-2.5 py-1.5 text-[11px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors",children:"☀ Morning Digest"}),d.jsx("button",{onClick:K,className:"px-2.5 py-1.5 text-[11px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors",children:"⚡ OS Optimize"})]})]})]}),d.jsxs("div",{className:"flex flex-col gap-3",children:[d.jsxs("div",{className:"relative h-[220px] rounded-lg bg-[#0a1324]/90 border border-cyan-500/20 overflow-hidden shadow-md flex items-center justify-center",children:[d.jsx("canvas",{ref:G,className:"w-full h-full"}),d.jsxs("div",{className:"absolute bottom-2.5 left-4 right-4 flex justify-between text-[11px] text-cyan-200/50 pointer-events-none font-mono",children:[d.jsxs("span",{children:["ACTIVE DOT: ",((ce=t[n])==null?void 0:ce.name.toUpperCase())||"FORGE"]}),d.jsx("span",{children:"LOCAL-FIRST // VERIFIED SECURE"})]})]}),d.jsxs("div",{className:"flex-1 p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col justify-between shadow-md min-h-[340px]",children:[d.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2 mb-2",children:[d.jsx("span",{children:"AG-UI Live Stream & Human-in-the-Loop Approvals"}),d.jsx("button",{onClick:()=>X("deploy docker container openmuse-computer:local --port 8790"),className:"text-[10px] px-2 py-0.5 rounded border border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20",children:"Test HITL Gate"})]}),d.jsx("div",{ref:O,className:"flex-1 overflow-y-auto space-y-2 pr-1 max-h-[350px]",children:A.map(z=>d.jsxs("div",{className:`p-2.5 rounded text-xs leading-relaxed ${z.sender==="user"?"ml-auto max-w-[85%] bg-cyan-500/15 border border-cyan-500/30 text-cyan-100":"mr-auto max-w-[92%] bg-black/60 border-l-2 border-cyan-400 text-cyan-50"}`,children:[d.jsx("div",{className:"whitespace-pre-wrap",children:z.text}),z.isApproval&&z.approvalData&&d.jsxs("div",{className:"mt-2.5 p-2.5 rounded bg-amber-950/30 border border-amber-500/40 text-[11px] space-y-1.5",children:[d.jsxs("div",{children:["Action: ",d.jsx("code",{children:z.approvalData.action_type})]}),d.jsxs("div",{children:["Payload: ",d.jsx("code",{children:z.approvalData.payload})]}),z.approvalData.arguments_hash&&d.jsxs("div",{className:"text-[10px] text-amber-300/60 truncate",children:["Hash: ",z.approvalData.arguments_hash]}),d.jsxs("div",{className:"flex gap-2 pt-1 flex-wrap",children:[d.jsx("button",{onClick:()=>$(z.approvalData.approval_id,"allow_once",z.approvalData.payload),className:"px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30",children:"✓ Allow Once"}),d.jsx("button",{onClick:()=>$(z.approvalData.approval_id,"always_allow",z.approvalData.payload),className:"px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30",children:"⚡ Always Allow"}),d.jsx("button",{onClick:()=>$(z.approvalData.approval_id,"deny",z.approvalData.payload),className:"px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30",children:"✕ Deny"})]})]})]},z.id))}),d.jsxs("div",{className:"flex gap-2 mt-3 pt-2 border-t border-cyan-500/20",children:[d.jsx("input",{type:"text",value:R,onChange:z=>b(z.target.value),onKeyDown:z=>z.key==="Enter"&&X(),placeholder:"Command OS or active Dot (e.g. 'calculate 137 * 42', 'deploy container')...",className:"flex-1 px-3 py-2 text-xs rounded bg-black/60 border border-cyan-500/30 text-cyan-100 placeholder-cyan-500/40 focus:outline-none focus:border-cyan-400"}),d.jsx("button",{onClick:()=>X(),className:"px-4 py-2 text-xs rounded bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors",children:"EXECUTE"})]})]})]}),d.jsxs("div",{className:"flex flex-col gap-3",children:[d.jsxs("div",{className:"p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md",children:[d.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2",children:[d.jsx("span",{children:"OpenMuse // Agent Computer"}),d.jsx("button",{onClick:ee,className:`text-[10px] px-2 py-0.5 rounded border transition-colors ${h?"border-amber-400 text-amber-300 bg-amber-500/20":"border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20"}`,children:h?"🤖 Return to Agent":"🕹 Take Control"})]}),d.jsxs("div",{className:"text-[11px] text-cyan-200/60",children:["Mode:"," ",d.jsx("b",{className:h?"text-amber-400":"text-emerald-400",children:h?"HUMAN_OVERRIDE (TAKE CONTROL)":"AGENT_AUTONOMOUS"})]}),d.jsx("div",{className:"h-[140px] p-2 rounded bg-black border border-cyan-500/20 font-mono text-[10px] text-emerald-400 overflow-y-auto whitespace-pre-wrap",children:x.join(`
`)})]}),d.jsxs("div",{className:"p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md flex-1",children:[d.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2",children:[d.jsx("span",{children:"OpenDots Space // Page Editor"}),d.jsxs("span",{className:"text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300",children:["Rev v",S]})]}),d.jsx("input",{type:"text",value:g,onChange:z=>u(z.target.value),className:"px-2.5 py-1.5 text-xs rounded bg-black/60 border border-cyan-500/30 text-cyan-100 focus:outline-none focus:border-cyan-400"}),d.jsx("textarea",{value:v,onChange:z=>y(z.target.value),className:"flex-1 min-h-[120px] p-2 text-xs rounded bg-black/60 border border-cyan-500/30 text-cyan-100 focus:outline-none focus:border-cyan-400 resize-none font-mono"}),d.jsxs("div",{className:"grid grid-cols-2 gap-2 pt-1",children:[d.jsx("button",{onClick:L,className:"px-2.5 py-1.5 text-[11px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors",children:"💾 Save (Revision Check)"}),d.jsx("button",{onClick:()=>{i("scribe"),y(z=>z+`
- [Added by @scribe Dot]: Verified local-first routing, HITL safety gates, and revision-safe documents.`)},className:"px-2.5 py-1.5 text-[11px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors",children:"✍ Ask Scribe"})]})]})]})]})]})},jb=()=>{const{currentView:t,notifications:e,removeNotification:n}=cn(),i=()=>{switch(t){case"home":return d.jsx(pm,{});case"hud":return d.jsx(Bb,{});case"chat":return d.jsx(Lb,{});case"plan":return d.jsx(Db,{});case"tasks":return d.jsx(Ib,{});case"approvals":return d.jsx(Ub,{});case"agents":return d.jsx(kb,{});case"activity":return d.jsx(Ob,{});case"connectors":return d.jsx(Fb,{});case"memory":return d.jsx(zb,{});default:return d.jsx(pm,{})}};return d.jsxs("div",{className:"min-h-screen bg-os-bg text-os-primary flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-400",children:[d.jsx(bb,{}),d.jsxs("div",{className:"flex-1 flex overflow-hidden",children:[d.jsx(Ab,{}),d.jsx("main",{className:"flex-1 overflow-y-auto relative",children:i()})]}),d.jsx(Cb,{}),d.jsx("div",{className:"fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none",children:e.map(r=>{const s=r.type==="success"?bn:r.type==="warning"?Ju:r.type==="error"?Zu:lS,a=r.type==="success"?"border-emerald-500/40 text-emerald-400 shadow-glass-glow":r.type==="warning"?"border-amber-500/40 text-amber-400 shadow-glass-glow-amber":r.type==="error"?"border-rose-500/40 text-rose-400 shadow-glass-glow-danger":"border-cyan-500/40 text-cyan-400 shadow-glass-glow-cyan";return d.jsxs("div",{className:`pointer-events-auto p-3.5 rounded-glass-md glass-panel border ${a} flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200`,children:[d.jsx(s,{className:"w-4 h-4 flex-shrink-0 mt-0.5"}),d.jsxs("div",{className:"flex-1 text-xs",children:[d.jsx("div",{className:"font-bold text-os-primary",children:r.title}),r.message&&d.jsx("div",{className:"text-os-secondary mt-0.5",children:r.message})]}),d.jsx("button",{onClick:()=>n(r.id),className:"text-os-muted hover:text-os-primary p-0.5",children:d.jsx(Bf,{className:"w-3.5 h-3.5"})})]},r.id)})})]})},Vb=()=>d.jsx(qy,{children:d.jsx(Yy,{children:d.jsx(jb,{})})});class Hb extends q.Component{constructor(){super(...arguments);Ja(this,"state",{hasError:!1,error:null,errorInfo:null});Ja(this,"handleReload",()=>{window.location.reload()});Ja(this,"handleReset",()=>{localStorage.removeItem("os-current-view"),window.location.href="/"})}static getDerivedStateFromError(n){return{hasError:!0,error:n,errorInfo:null}}componentDidCatch(n,i){console.error("OS Uncaught React Error:",n,i),this.setState({error:n,errorInfo:i})}render(){return this.state.hasError?d.jsx("div",{className:"min-h-screen bg-os-bg text-os-primary flex items-center justify-center p-6 antialiased",children:d.jsxs("div",{className:"max-w-lg w-full p-8 rounded-glass-xl glass-panel border border-rose-500/30 shadow-glass-glow-danger text-center space-y-6 animate-in fade-in zoom-in-95 duration-200",children:[d.jsx("div",{className:"w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner",children:d.jsx(fS,{className:"w-8 h-8"})}),d.jsxs("div",{className:"space-y-2",children:[d.jsx("span",{className:"text-[11px] font-mono uppercase tracking-widest text-rose-400",children:"System Interface Fault"}),d.jsx("h2",{className:"text-xl font-bold text-os-primary",children:"OS Interface Encountered a Render Error"}),d.jsx("p",{className:"text-xs text-os-secondary leading-relaxed",children:"The core OS daemon and database remain fully active and safe. A visual surface component caught an unhandled exception."})]}),this.state.error&&d.jsxs("div",{className:"text-left p-3.5 rounded-glass-md bg-black/40 border border-white/5 overflow-x-auto text-[11px] font-mono text-rose-300 max-h-36",children:[d.jsxs("div",{className:"font-semibold text-rose-200 mb-1",children:[this.state.error.name,": ",this.state.error.message]}),this.state.error.stack&&d.jsx("pre",{className:"text-[10px] text-os-muted whitespace-pre-wrap",children:this.state.error.stack.split(`
`).slice(0,4).join(`
`)})]}),d.jsxs("div",{className:"flex items-center justify-center gap-3 pt-2",children:[d.jsxs("button",{onClick:this.handleReload,className:"btn-press px-4 py-2 rounded-glass-md bg-white/10 hover:bg-white/15 border border-os-border text-xs font-medium text-os-primary flex items-center gap-2 transition-all",children:[d.jsx(Xn,{className:"w-3.5 h-3.5"}),d.jsx("span",{children:"Reload OS"})]}),d.jsxs("button",{onClick:this.handleReset,className:"btn-press px-4 py-2 rounded-glass-md bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold flex items-center gap-2 transition-all shadow-glass-glow",children:[d.jsx(Kx,{className:"w-3.5 h-3.5"}),d.jsx("span",{children:"Reset to Home"})]})]})]})}):this.props.children}}iu.createRoot(document.getElementById("root")).render(d.jsx(Uv.StrictMode,{children:d.jsx(Hb,{children:d.jsx(Vb,{})})}));
