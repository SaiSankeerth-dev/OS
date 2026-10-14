var Nv=Object.defineProperty;var Pv=(t,e,n)=>e in t?Nv(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var Ja=(t,e,n)=>Pv(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function Dv(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var ym={exports:{}},Il={},Sm={exports:{}},Ye={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var za=Symbol.for("react.element"),Lv=Symbol.for("react.portal"),Iv=Symbol.for("react.fragment"),kv=Symbol.for("react.strict_mode"),Uv=Symbol.for("react.profiler"),Ov=Symbol.for("react.provider"),Fv=Symbol.for("react.context"),zv=Symbol.for("react.forward_ref"),Bv=Symbol.for("react.suspense"),jv=Symbol.for("react.memo"),Vv=Symbol.for("react.lazy"),ch=Symbol.iterator;function Hv(t){return t===null||typeof t!="object"?null:(t=ch&&t[ch]||t["@@iterator"],typeof t=="function"?t:null)}var Mm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},wm=Object.assign,Em={};function Os(t,e,n){this.props=t,this.context=e,this.refs=Em,this.updater=n||Mm}Os.prototype.isReactComponent={};Os.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Os.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function bm(){}bm.prototype=Os.prototype;function $d(t,e,n){this.props=t,this.context=e,this.refs=Em,this.updater=n||Mm}var qd=$d.prototype=new bm;qd.constructor=$d;wm(qd,Os.prototype);qd.isPureReactComponent=!0;var uh=Array.isArray,Tm=Object.prototype.hasOwnProperty,Yd={current:null},Am={key:!0,ref:!0,__self:!0,__source:!0};function Cm(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)Tm.call(e,i)&&!Am.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var c=Array(o),d=0;d<o;d++)c[d]=arguments[d+2];r.children=c}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:za,type:t,key:s,ref:a,props:r,_owner:Yd.current}}function Gv(t,e){return{$$typeof:za,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Kd(t){return typeof t=="object"&&t!==null&&t.$$typeof===za}function Wv(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var dh=/\/+/g;function ic(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Wv(""+t.key):e.toString(36)}function jo(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case za:case Lv:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+ic(a,0):i,uh(r)?(n="",t!=null&&(n=t.replace(dh,"$&/")+"/"),jo(r,e,n,"",function(d){return d})):r!=null&&(Kd(r)&&(r=Gv(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(dh,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",uh(t))for(var o=0;o<t.length;o++){s=t[o];var c=i+ic(s,o);a+=jo(s,e,n,c,r)}else if(c=Hv(t),typeof c=="function")for(t=c.call(t),o=0;!(s=t.next()).done;)s=s.value,c=i+ic(s,o++),a+=jo(s,e,n,c,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function eo(t,e,n){if(t==null)return t;var i=[],r=0;return jo(t,i,"","",function(s){return e.call(n,s,r++)}),i}function Xv(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Yt={current:null},Vo={transition:null},$v={ReactCurrentDispatcher:Yt,ReactCurrentBatchConfig:Vo,ReactCurrentOwner:Yd};function Rm(){throw Error("act(...) is not supported in production builds of React.")}Ye.Children={map:eo,forEach:function(t,e,n){eo(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return eo(t,function(){e++}),e},toArray:function(t){return eo(t,function(e){return e})||[]},only:function(t){if(!Kd(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Ye.Component=Os;Ye.Fragment=Iv;Ye.Profiler=Uv;Ye.PureComponent=$d;Ye.StrictMode=kv;Ye.Suspense=Bv;Ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=$v;Ye.act=Rm;Ye.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=wm({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=Yd.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(c in e)Tm.call(e,c)&&!Am.hasOwnProperty(c)&&(i[c]=e[c]===void 0&&o!==void 0?o[c]:e[c])}var c=arguments.length-2;if(c===1)i.children=n;else if(1<c){o=Array(c);for(var d=0;d<c;d++)o[d]=arguments[d+2];i.children=o}return{$$typeof:za,type:t.type,key:r,ref:s,props:i,_owner:a}};Ye.createContext=function(t){return t={$$typeof:Fv,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Ov,_context:t},t.Consumer=t};Ye.createElement=Cm;Ye.createFactory=function(t){var e=Cm.bind(null,t);return e.type=t,e};Ye.createRef=function(){return{current:null}};Ye.forwardRef=function(t){return{$$typeof:zv,render:t}};Ye.isValidElement=Kd;Ye.lazy=function(t){return{$$typeof:Vv,_payload:{_status:-1,_result:t},_init:Xv}};Ye.memo=function(t,e){return{$$typeof:jv,type:t,compare:e===void 0?null:e}};Ye.startTransition=function(t){var e=Vo.transition;Vo.transition={};try{t()}finally{Vo.transition=e}};Ye.unstable_act=Rm;Ye.useCallback=function(t,e){return Yt.current.useCallback(t,e)};Ye.useContext=function(t){return Yt.current.useContext(t)};Ye.useDebugValue=function(){};Ye.useDeferredValue=function(t){return Yt.current.useDeferredValue(t)};Ye.useEffect=function(t,e){return Yt.current.useEffect(t,e)};Ye.useId=function(){return Yt.current.useId()};Ye.useImperativeHandle=function(t,e,n){return Yt.current.useImperativeHandle(t,e,n)};Ye.useInsertionEffect=function(t,e){return Yt.current.useInsertionEffect(t,e)};Ye.useLayoutEffect=function(t,e){return Yt.current.useLayoutEffect(t,e)};Ye.useMemo=function(t,e){return Yt.current.useMemo(t,e)};Ye.useReducer=function(t,e,n){return Yt.current.useReducer(t,e,n)};Ye.useRef=function(t){return Yt.current.useRef(t)};Ye.useState=function(t){return Yt.current.useState(t)};Ye.useSyncExternalStore=function(t,e,n){return Yt.current.useSyncExternalStore(t,e,n)};Ye.useTransition=function(){return Yt.current.useTransition()};Ye.version="18.3.1";Sm.exports=Ye;var W=Sm.exports;const qv=Dv(W);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yv=W,Kv=Symbol.for("react.element"),Zv=Symbol.for("react.fragment"),Qv=Object.prototype.hasOwnProperty,Jv=Yv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,e_={key:!0,ref:!0,__self:!0,__source:!0};function Nm(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)Qv.call(e,i)&&!e_.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Kv,type:t,key:s,ref:a,props:r,_owner:Jv.current}}Il.Fragment=Zv;Il.jsx=Nm;Il.jsxs=Nm;ym.exports=Il;var l=ym.exports,au={},Pm={exports:{}},vn={},Dm={exports:{}},Lm={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(D,Z){var ee=D.length;D.push(Z);e:for(;0<ee;){var ue=ee-1>>>1,B=D[ue];if(0<r(B,Z))D[ue]=Z,D[ee]=B,ee=ue;else break e}}function n(D){return D.length===0?null:D[0]}function i(D){if(D.length===0)return null;var Z=D[0],ee=D.pop();if(ee!==Z){D[0]=ee;e:for(var ue=0,B=D.length,se=B>>>1;ue<se;){var G=2*(ue+1)-1,ie=D[G],de=G+1,ne=D[de];if(0>r(ie,ee))de<B&&0>r(ne,ie)?(D[ue]=ne,D[de]=ee,ue=de):(D[ue]=ie,D[G]=ee,ue=G);else if(de<B&&0>r(ne,ee))D[ue]=ne,D[de]=ee,ue=de;else break e}}return Z}function r(D,Z){var ee=D.sortIndex-Z.sortIndex;return ee!==0?ee:D.id-Z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var c=[],d=[],h=1,p=null,f=3,m=!1,x=!1,_=!1,g=typeof setTimeout=="function"?setTimeout:null,u=typeof clearTimeout=="function"?clearTimeout:null,v=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(D){for(var Z=n(d);Z!==null;){if(Z.callback===null)i(d);else if(Z.startTime<=D)i(d),Z.sortIndex=Z.expirationTime,e(c,Z);else break;Z=n(d)}}function S(D){if(_=!1,y(D),!x)if(n(c)!==null)x=!0,q(N);else{var Z=n(d);Z!==null&&Q(S,Z.startTime-D)}}function N(D,Z){x=!1,_&&(_=!1,u(R),R=-1),m=!0;var ee=f;try{for(y(Z),p=n(c);p!==null&&(!(p.expirationTime>Z)||D&&!P());){var ue=p.callback;if(typeof ue=="function"){p.callback=null,f=p.priorityLevel;var B=ue(p.expirationTime<=Z);Z=t.unstable_now(),typeof B=="function"?p.callback=B:p===n(c)&&i(c),y(Z)}else i(c);p=n(c)}if(p!==null)var se=!0;else{var G=n(d);G!==null&&Q(S,G.startTime-Z),se=!1}return se}finally{p=null,f=ee,m=!1}}var A=!1,E=null,R=-1,T=5,M=-1;function P(){return!(t.unstable_now()-M<T)}function X(){if(E!==null){var D=t.unstable_now();M=D;var Z=!0;try{Z=E(!0,D)}finally{Z?F():(A=!1,E=null)}}else A=!1}var F;if(typeof v=="function")F=function(){v(X)};else if(typeof MessageChannel<"u"){var K=new MessageChannel,$=K.port2;K.port1.onmessage=X,F=function(){$.postMessage(null)}}else F=function(){g(X,0)};function q(D){E=D,A||(A=!0,F())}function Q(D,Z){R=g(function(){D(t.unstable_now())},Z)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(D){D.callback=null},t.unstable_continueExecution=function(){x||m||(x=!0,q(N))},t.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<D?Math.floor(1e3/D):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return n(c)},t.unstable_next=function(D){switch(f){case 1:case 2:case 3:var Z=3;break;default:Z=f}var ee=f;f=Z;try{return D()}finally{f=ee}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(D,Z){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var ee=f;f=D;try{return Z()}finally{f=ee}},t.unstable_scheduleCallback=function(D,Z,ee){var ue=t.unstable_now();switch(typeof ee=="object"&&ee!==null?(ee=ee.delay,ee=typeof ee=="number"&&0<ee?ue+ee:ue):ee=ue,D){case 1:var B=-1;break;case 2:B=250;break;case 5:B=1073741823;break;case 4:B=1e4;break;default:B=5e3}return B=ee+B,D={id:h++,callback:Z,priorityLevel:D,startTime:ee,expirationTime:B,sortIndex:-1},ee>ue?(D.sortIndex=ee,e(d,D),n(c)===null&&D===n(d)&&(_?(u(R),R=-1):_=!0,Q(S,ee-ue))):(D.sortIndex=B,e(c,D),x||m||(x=!0,q(N))),D},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(D){var Z=f;return function(){var ee=f;f=Z;try{return D.apply(this,arguments)}finally{f=ee}}}})(Lm);Dm.exports=Lm;var t_=Dm.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n_=W,xn=t_;function oe(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Im=new Set,Sa={};function Ur(t,e){Es(t,e),Es(t+"Capture",e)}function Es(t,e){for(Sa[t]=e,t=0;t<e.length;t++)Im.add(e[t])}var Mi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ou=Object.prototype.hasOwnProperty,i_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,fh={},hh={};function r_(t){return ou.call(hh,t)?!0:ou.call(fh,t)?!1:i_.test(t)?hh[t]=!0:(fh[t]=!0,!1)}function s_(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function a_(t,e,n,i){if(e===null||typeof e>"u"||s_(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Kt(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var Ft={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Ft[t]=new Kt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Ft[e]=new Kt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Ft[t]=new Kt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Ft[t]=new Kt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Ft[t]=new Kt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Ft[t]=new Kt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Ft[t]=new Kt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Ft[t]=new Kt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Ft[t]=new Kt(t,5,!1,t.toLowerCase(),null,!1,!1)});var Zd=/[\-:]([a-z])/g;function Qd(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Zd,Qd);Ft[e]=new Kt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Zd,Qd);Ft[e]=new Kt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Zd,Qd);Ft[e]=new Kt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Ft[t]=new Kt(t,1,!1,t.toLowerCase(),null,!1,!1)});Ft.xlinkHref=new Kt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Ft[t]=new Kt(t,1,!1,t.toLowerCase(),null,!0,!0)});function Jd(t,e,n,i){var r=Ft.hasOwnProperty(e)?Ft[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(a_(e,n,r,i)&&(n=null),i||r===null?r_(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Ci=n_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,to=Symbol.for("react.element"),ns=Symbol.for("react.portal"),is=Symbol.for("react.fragment"),ef=Symbol.for("react.strict_mode"),lu=Symbol.for("react.profiler"),km=Symbol.for("react.provider"),Um=Symbol.for("react.context"),tf=Symbol.for("react.forward_ref"),cu=Symbol.for("react.suspense"),uu=Symbol.for("react.suspense_list"),nf=Symbol.for("react.memo"),Fi=Symbol.for("react.lazy"),Om=Symbol.for("react.offscreen"),ph=Symbol.iterator;function Ws(t){return t===null||typeof t!="object"?null:(t=ph&&t[ph]||t["@@iterator"],typeof t=="function"?t:null)}var _t=Object.assign,rc;function ra(t){if(rc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);rc=e&&e[1]||""}return`
`+rc+t}var sc=!1;function ac(t,e){if(!t||sc)return"";sc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(d){var i=d}Reflect.construct(t,[],e)}else{try{e.call()}catch(d){i=d}t.call(e.prototype)}else{try{throw Error()}catch(d){i=d}t()}}catch(d){if(d&&i&&typeof d.stack=="string"){for(var r=d.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var c=`
`+r[a].replace(" at new "," at ");return t.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",t.displayName)),c}while(1<=a&&0<=o);break}}}finally{sc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?ra(t):""}function o_(t){switch(t.tag){case 5:return ra(t.type);case 16:return ra("Lazy");case 13:return ra("Suspense");case 19:return ra("SuspenseList");case 0:case 2:case 15:return t=ac(t.type,!1),t;case 11:return t=ac(t.type.render,!1),t;case 1:return t=ac(t.type,!0),t;default:return""}}function du(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case is:return"Fragment";case ns:return"Portal";case lu:return"Profiler";case ef:return"StrictMode";case cu:return"Suspense";case uu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Um:return(t.displayName||"Context")+".Consumer";case km:return(t._context.displayName||"Context")+".Provider";case tf:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case nf:return e=t.displayName||null,e!==null?e:du(t.type)||"Memo";case Fi:e=t._payload,t=t._init;try{return du(t(e))}catch{}}return null}function l_(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return du(e);case 8:return e===ef?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function tr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Fm(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function c_(t){var e=Fm(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function no(t){t._valueTracker||(t._valueTracker=c_(t))}function zm(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Fm(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function al(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function fu(t,e){var n=e.checked;return _t({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function mh(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=tr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Bm(t,e){e=e.checked,e!=null&&Jd(t,"checked",e,!1)}function hu(t,e){Bm(t,e);var n=tr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?pu(t,e.type,n):e.hasOwnProperty("defaultValue")&&pu(t,e.type,tr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function gh(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function pu(t,e,n){(e!=="number"||al(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var sa=Array.isArray;function ms(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+tr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function mu(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(oe(91));return _t({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function xh(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(oe(92));if(sa(n)){if(1<n.length)throw Error(oe(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:tr(n)}}function jm(t,e){var n=tr(e.value),i=tr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function vh(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Vm(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function gu(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Vm(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var io,Hm=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(io=io||document.createElement("div"),io.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=io.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Ma(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var da={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},u_=["Webkit","ms","Moz","O"];Object.keys(da).forEach(function(t){u_.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),da[e]=da[t]})});function Gm(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||da.hasOwnProperty(t)&&da[t]?(""+e).trim():e+"px"}function Wm(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Gm(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var d_=_t({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function xu(t,e){if(e){if(d_[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(oe(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(oe(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(oe(61))}if(e.style!=null&&typeof e.style!="object")throw Error(oe(62))}}function vu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var _u=null;function rf(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var yu=null,gs=null,xs=null;function _h(t){if(t=Va(t)){if(typeof yu!="function")throw Error(oe(280));var e=t.stateNode;e&&(e=zl(e),yu(t.stateNode,t.type,e))}}function Xm(t){gs?xs?xs.push(t):xs=[t]:gs=t}function $m(){if(gs){var t=gs,e=xs;if(xs=gs=null,_h(t),e)for(t=0;t<e.length;t++)_h(e[t])}}function qm(t,e){return t(e)}function Ym(){}var oc=!1;function Km(t,e,n){if(oc)return t(e,n);oc=!0;try{return qm(t,e,n)}finally{oc=!1,(gs!==null||xs!==null)&&(Ym(),$m())}}function wa(t,e){var n=t.stateNode;if(n===null)return null;var i=zl(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(oe(231,e,typeof n));return n}var Su=!1;if(Mi)try{var Xs={};Object.defineProperty(Xs,"passive",{get:function(){Su=!0}}),window.addEventListener("test",Xs,Xs),window.removeEventListener("test",Xs,Xs)}catch{Su=!1}function f_(t,e,n,i,r,s,a,o,c){var d=Array.prototype.slice.call(arguments,3);try{e.apply(n,d)}catch(h){this.onError(h)}}var fa=!1,ol=null,ll=!1,Mu=null,h_={onError:function(t){fa=!0,ol=t}};function p_(t,e,n,i,r,s,a,o,c){fa=!1,ol=null,f_.apply(h_,arguments)}function m_(t,e,n,i,r,s,a,o,c){if(p_.apply(this,arguments),fa){if(fa){var d=ol;fa=!1,ol=null}else throw Error(oe(198));ll||(ll=!0,Mu=d)}}function Or(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Zm(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function yh(t){if(Or(t)!==t)throw Error(oe(188))}function g_(t){var e=t.alternate;if(!e){if(e=Or(t),e===null)throw Error(oe(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return yh(r),t;if(s===i)return yh(r),e;s=s.sibling}throw Error(oe(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(oe(189))}}if(n.alternate!==i)throw Error(oe(190))}if(n.tag!==3)throw Error(oe(188));return n.stateNode.current===n?t:e}function Qm(t){return t=g_(t),t!==null?Jm(t):null}function Jm(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Jm(t);if(e!==null)return e;t=t.sibling}return null}var eg=xn.unstable_scheduleCallback,Sh=xn.unstable_cancelCallback,x_=xn.unstable_shouldYield,v_=xn.unstable_requestPaint,wt=xn.unstable_now,__=xn.unstable_getCurrentPriorityLevel,sf=xn.unstable_ImmediatePriority,tg=xn.unstable_UserBlockingPriority,cl=xn.unstable_NormalPriority,y_=xn.unstable_LowPriority,ng=xn.unstable_IdlePriority,kl=null,ti=null;function S_(t){if(ti&&typeof ti.onCommitFiberRoot=="function")try{ti.onCommitFiberRoot(kl,t,void 0,(t.current.flags&128)===128)}catch{}}var Vn=Math.clz32?Math.clz32:E_,M_=Math.log,w_=Math.LN2;function E_(t){return t>>>=0,t===0?32:31-(M_(t)/w_|0)|0}var ro=64,so=4194304;function aa(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function ul(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=aa(o):(s&=a,s!==0&&(i=aa(s)))}else a=n&~r,a!==0?i=aa(a):s!==0&&(i=aa(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Vn(e),r=1<<n,i|=t[n],e&=~r;return i}function b_(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function T_(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-Vn(s),o=1<<a,c=r[a];c===-1?(!(o&n)||o&i)&&(r[a]=b_(o,e)):c<=e&&(t.expiredLanes|=o),s&=~o}}function wu(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function ig(){var t=ro;return ro<<=1,!(ro&4194240)&&(ro=64),t}function lc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ba(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Vn(e),t[e]=n}function A_(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Vn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function af(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Vn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var rt=0;function rg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var sg,of,ag,og,lg,Eu=!1,ao=[],Wi=null,Xi=null,$i=null,Ea=new Map,ba=new Map,Bi=[],C_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Mh(t,e){switch(t){case"focusin":case"focusout":Wi=null;break;case"dragenter":case"dragleave":Xi=null;break;case"mouseover":case"mouseout":$i=null;break;case"pointerover":case"pointerout":Ea.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ba.delete(e.pointerId)}}function $s(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Va(e),e!==null&&of(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function R_(t,e,n,i,r){switch(e){case"focusin":return Wi=$s(Wi,t,e,n,i,r),!0;case"dragenter":return Xi=$s(Xi,t,e,n,i,r),!0;case"mouseover":return $i=$s($i,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Ea.set(s,$s(Ea.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,ba.set(s,$s(ba.get(s)||null,t,e,n,i,r)),!0}return!1}function cg(t){var e=Mr(t.target);if(e!==null){var n=Or(e);if(n!==null){if(e=n.tag,e===13){if(e=Zm(n),e!==null){t.blockedOn=e,lg(t.priority,function(){ag(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ho(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=bu(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);_u=i,n.target.dispatchEvent(i),_u=null}else return e=Va(n),e!==null&&of(e),t.blockedOn=n,!1;e.shift()}return!0}function wh(t,e,n){Ho(t)&&n.delete(e)}function N_(){Eu=!1,Wi!==null&&Ho(Wi)&&(Wi=null),Xi!==null&&Ho(Xi)&&(Xi=null),$i!==null&&Ho($i)&&($i=null),Ea.forEach(wh),ba.forEach(wh)}function qs(t,e){t.blockedOn===e&&(t.blockedOn=null,Eu||(Eu=!0,xn.unstable_scheduleCallback(xn.unstable_NormalPriority,N_)))}function Ta(t){function e(r){return qs(r,t)}if(0<ao.length){qs(ao[0],t);for(var n=1;n<ao.length;n++){var i=ao[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Wi!==null&&qs(Wi,t),Xi!==null&&qs(Xi,t),$i!==null&&qs($i,t),Ea.forEach(e),ba.forEach(e),n=0;n<Bi.length;n++)i=Bi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Bi.length&&(n=Bi[0],n.blockedOn===null);)cg(n),n.blockedOn===null&&Bi.shift()}var vs=Ci.ReactCurrentBatchConfig,dl=!0;function P_(t,e,n,i){var r=rt,s=vs.transition;vs.transition=null;try{rt=1,lf(t,e,n,i)}finally{rt=r,vs.transition=s}}function D_(t,e,n,i){var r=rt,s=vs.transition;vs.transition=null;try{rt=4,lf(t,e,n,i)}finally{rt=r,vs.transition=s}}function lf(t,e,n,i){if(dl){var r=bu(t,e,n,i);if(r===null)vc(t,e,i,fl,n),Mh(t,i);else if(R_(r,t,e,n,i))i.stopPropagation();else if(Mh(t,i),e&4&&-1<C_.indexOf(t)){for(;r!==null;){var s=Va(r);if(s!==null&&sg(s),s=bu(t,e,n,i),s===null&&vc(t,e,i,fl,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else vc(t,e,i,null,n)}}var fl=null;function bu(t,e,n,i){if(fl=null,t=rf(i),t=Mr(t),t!==null)if(e=Or(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Zm(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return fl=t,null}function ug(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(__()){case sf:return 1;case tg:return 4;case cl:case y_:return 16;case ng:return 536870912;default:return 16}default:return 16}}var Hi=null,cf=null,Go=null;function dg(){if(Go)return Go;var t,e=cf,n=e.length,i,r="value"in Hi?Hi.value:Hi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return Go=r.slice(t,1<i?1-i:void 0)}function Wo(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function oo(){return!0}function Eh(){return!1}function _n(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?oo:Eh,this.isPropagationStopped=Eh,this}return _t(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=oo)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=oo)},persist:function(){},isPersistent:oo}),e}var Fs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},uf=_n(Fs),ja=_t({},Fs,{view:0,detail:0}),L_=_n(ja),cc,uc,Ys,Ul=_t({},ja,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:df,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ys&&(Ys&&t.type==="mousemove"?(cc=t.screenX-Ys.screenX,uc=t.screenY-Ys.screenY):uc=cc=0,Ys=t),cc)},movementY:function(t){return"movementY"in t?t.movementY:uc}}),bh=_n(Ul),I_=_t({},Ul,{dataTransfer:0}),k_=_n(I_),U_=_t({},ja,{relatedTarget:0}),dc=_n(U_),O_=_t({},Fs,{animationName:0,elapsedTime:0,pseudoElement:0}),F_=_n(O_),z_=_t({},Fs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),B_=_n(z_),j_=_t({},Fs,{data:0}),Th=_n(j_),V_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},H_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},G_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function W_(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=G_[t])?!!e[t]:!1}function df(){return W_}var X_=_t({},ja,{key:function(t){if(t.key){var e=V_[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Wo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?H_[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:df,charCode:function(t){return t.type==="keypress"?Wo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Wo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),$_=_n(X_),q_=_t({},Ul,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ah=_n(q_),Y_=_t({},ja,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:df}),K_=_n(Y_),Z_=_t({},Fs,{propertyName:0,elapsedTime:0,pseudoElement:0}),Q_=_n(Z_),J_=_t({},Ul,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),ey=_n(J_),ty=[9,13,27,32],ff=Mi&&"CompositionEvent"in window,ha=null;Mi&&"documentMode"in document&&(ha=document.documentMode);var ny=Mi&&"TextEvent"in window&&!ha,fg=Mi&&(!ff||ha&&8<ha&&11>=ha),Ch=" ",Rh=!1;function hg(t,e){switch(t){case"keyup":return ty.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function pg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var rs=!1;function iy(t,e){switch(t){case"compositionend":return pg(e);case"keypress":return e.which!==32?null:(Rh=!0,Ch);case"textInput":return t=e.data,t===Ch&&Rh?null:t;default:return null}}function ry(t,e){if(rs)return t==="compositionend"||!ff&&hg(t,e)?(t=dg(),Go=cf=Hi=null,rs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return fg&&e.locale!=="ko"?null:e.data;default:return null}}var sy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Nh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!sy[t.type]:e==="textarea"}function mg(t,e,n,i){Xm(i),e=hl(e,"onChange"),0<e.length&&(n=new uf("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var pa=null,Aa=null;function ay(t){Tg(t,0)}function Ol(t){var e=os(t);if(zm(e))return t}function oy(t,e){if(t==="change")return e}var gg=!1;if(Mi){var fc;if(Mi){var hc="oninput"in document;if(!hc){var Ph=document.createElement("div");Ph.setAttribute("oninput","return;"),hc=typeof Ph.oninput=="function"}fc=hc}else fc=!1;gg=fc&&(!document.documentMode||9<document.documentMode)}function Dh(){pa&&(pa.detachEvent("onpropertychange",xg),Aa=pa=null)}function xg(t){if(t.propertyName==="value"&&Ol(Aa)){var e=[];mg(e,Aa,t,rf(t)),Km(ay,e)}}function ly(t,e,n){t==="focusin"?(Dh(),pa=e,Aa=n,pa.attachEvent("onpropertychange",xg)):t==="focusout"&&Dh()}function cy(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Ol(Aa)}function uy(t,e){if(t==="click")return Ol(e)}function dy(t,e){if(t==="input"||t==="change")return Ol(e)}function fy(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Wn=typeof Object.is=="function"?Object.is:fy;function Ca(t,e){if(Wn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!ou.call(e,r)||!Wn(t[r],e[r]))return!1}return!0}function Lh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Ih(t,e){var n=Lh(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Lh(n)}}function vg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?vg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function _g(){for(var t=window,e=al();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=al(t.document)}return e}function hf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function hy(t){var e=_g(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&vg(n.ownerDocument.documentElement,n)){if(i!==null&&hf(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=Ih(n,s);var a=Ih(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var py=Mi&&"documentMode"in document&&11>=document.documentMode,ss=null,Tu=null,ma=null,Au=!1;function kh(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Au||ss==null||ss!==al(i)||(i=ss,"selectionStart"in i&&hf(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ma&&Ca(ma,i)||(ma=i,i=hl(Tu,"onSelect"),0<i.length&&(e=new uf("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=ss)))}function lo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var as={animationend:lo("Animation","AnimationEnd"),animationiteration:lo("Animation","AnimationIteration"),animationstart:lo("Animation","AnimationStart"),transitionend:lo("Transition","TransitionEnd")},pc={},yg={};Mi&&(yg=document.createElement("div").style,"AnimationEvent"in window||(delete as.animationend.animation,delete as.animationiteration.animation,delete as.animationstart.animation),"TransitionEvent"in window||delete as.transitionend.transition);function Fl(t){if(pc[t])return pc[t];if(!as[t])return t;var e=as[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in yg)return pc[t]=e[n];return t}var Sg=Fl("animationend"),Mg=Fl("animationiteration"),wg=Fl("animationstart"),Eg=Fl("transitionend"),bg=new Map,Uh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function sr(t,e){bg.set(t,e),Ur(e,[t])}for(var mc=0;mc<Uh.length;mc++){var gc=Uh[mc],my=gc.toLowerCase(),gy=gc[0].toUpperCase()+gc.slice(1);sr(my,"on"+gy)}sr(Sg,"onAnimationEnd");sr(Mg,"onAnimationIteration");sr(wg,"onAnimationStart");sr("dblclick","onDoubleClick");sr("focusin","onFocus");sr("focusout","onBlur");sr(Eg,"onTransitionEnd");Es("onMouseEnter",["mouseout","mouseover"]);Es("onMouseLeave",["mouseout","mouseover"]);Es("onPointerEnter",["pointerout","pointerover"]);Es("onPointerLeave",["pointerout","pointerover"]);Ur("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ur("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ur("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ur("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ur("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ur("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var oa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),xy=new Set("cancel close invalid load scroll toggle".split(" ").concat(oa));function Oh(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,m_(i,e,void 0,t),t.currentTarget=null}function Tg(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],c=o.instance,d=o.currentTarget;if(o=o.listener,c!==s&&r.isPropagationStopped())break e;Oh(r,o,d),s=c}else for(a=0;a<i.length;a++){if(o=i[a],c=o.instance,d=o.currentTarget,o=o.listener,c!==s&&r.isPropagationStopped())break e;Oh(r,o,d),s=c}}}if(ll)throw t=Mu,ll=!1,Mu=null,t}function ht(t,e){var n=e[Du];n===void 0&&(n=e[Du]=new Set);var i=t+"__bubble";n.has(i)||(Ag(e,t,2,!1),n.add(i))}function xc(t,e,n){var i=0;e&&(i|=4),Ag(n,t,i,e)}var co="_reactListening"+Math.random().toString(36).slice(2);function Ra(t){if(!t[co]){t[co]=!0,Im.forEach(function(n){n!=="selectionchange"&&(xy.has(n)||xc(n,!1,t),xc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[co]||(e[co]=!0,xc("selectionchange",!1,e))}}function Ag(t,e,n,i){switch(ug(e)){case 1:var r=P_;break;case 4:r=D_;break;default:r=lf}n=r.bind(null,e,n,t),r=void 0,!Su||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function vc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var c=a.tag;if((c===3||c===4)&&(c=a.stateNode.containerInfo,c===r||c.nodeType===8&&c.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Mr(o),a===null)return;if(c=a.tag,c===5||c===6){i=s=a;continue e}o=o.parentNode}}i=i.return}Km(function(){var d=s,h=rf(n),p=[];e:{var f=bg.get(t);if(f!==void 0){var m=uf,x=t;switch(t){case"keypress":if(Wo(n)===0)break e;case"keydown":case"keyup":m=$_;break;case"focusin":x="focus",m=dc;break;case"focusout":x="blur",m=dc;break;case"beforeblur":case"afterblur":m=dc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=bh;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=k_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=K_;break;case Sg:case Mg:case wg:m=F_;break;case Eg:m=Q_;break;case"scroll":m=L_;break;case"wheel":m=ey;break;case"copy":case"cut":case"paste":m=B_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=Ah}var _=(e&4)!==0,g=!_&&t==="scroll",u=_?f!==null?f+"Capture":null:f;_=[];for(var v=d,y;v!==null;){y=v;var S=y.stateNode;if(y.tag===5&&S!==null&&(y=S,u!==null&&(S=wa(v,u),S!=null&&_.push(Na(v,S,y)))),g)break;v=v.return}0<_.length&&(f=new m(f,x,null,n,h),p.push({event:f,listeners:_}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",m=t==="mouseout"||t==="pointerout",f&&n!==_u&&(x=n.relatedTarget||n.fromElement)&&(Mr(x)||x[wi]))break e;if((m||f)&&(f=h.window===h?h:(f=h.ownerDocument)?f.defaultView||f.parentWindow:window,m?(x=n.relatedTarget||n.toElement,m=d,x=x?Mr(x):null,x!==null&&(g=Or(x),x!==g||x.tag!==5&&x.tag!==6)&&(x=null)):(m=null,x=d),m!==x)){if(_=bh,S="onMouseLeave",u="onMouseEnter",v="mouse",(t==="pointerout"||t==="pointerover")&&(_=Ah,S="onPointerLeave",u="onPointerEnter",v="pointer"),g=m==null?f:os(m),y=x==null?f:os(x),f=new _(S,v+"leave",m,n,h),f.target=g,f.relatedTarget=y,S=null,Mr(h)===d&&(_=new _(u,v+"enter",x,n,h),_.target=y,_.relatedTarget=g,S=_),g=S,m&&x)t:{for(_=m,u=x,v=0,y=_;y;y=jr(y))v++;for(y=0,S=u;S;S=jr(S))y++;for(;0<v-y;)_=jr(_),v--;for(;0<y-v;)u=jr(u),y--;for(;v--;){if(_===u||u!==null&&_===u.alternate)break t;_=jr(_),u=jr(u)}_=null}else _=null;m!==null&&Fh(p,f,m,_,!1),x!==null&&g!==null&&Fh(p,g,x,_,!0)}}e:{if(f=d?os(d):window,m=f.nodeName&&f.nodeName.toLowerCase(),m==="select"||m==="input"&&f.type==="file")var N=oy;else if(Nh(f))if(gg)N=dy;else{N=cy;var A=ly}else(m=f.nodeName)&&m.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(N=uy);if(N&&(N=N(t,d))){mg(p,N,n,h);break e}A&&A(t,f,d),t==="focusout"&&(A=f._wrapperState)&&A.controlled&&f.type==="number"&&pu(f,"number",f.value)}switch(A=d?os(d):window,t){case"focusin":(Nh(A)||A.contentEditable==="true")&&(ss=A,Tu=d,ma=null);break;case"focusout":ma=Tu=ss=null;break;case"mousedown":Au=!0;break;case"contextmenu":case"mouseup":case"dragend":Au=!1,kh(p,n,h);break;case"selectionchange":if(py)break;case"keydown":case"keyup":kh(p,n,h)}var E;if(ff)e:{switch(t){case"compositionstart":var R="onCompositionStart";break e;case"compositionend":R="onCompositionEnd";break e;case"compositionupdate":R="onCompositionUpdate";break e}R=void 0}else rs?hg(t,n)&&(R="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(R="onCompositionStart");R&&(fg&&n.locale!=="ko"&&(rs||R!=="onCompositionStart"?R==="onCompositionEnd"&&rs&&(E=dg()):(Hi=h,cf="value"in Hi?Hi.value:Hi.textContent,rs=!0)),A=hl(d,R),0<A.length&&(R=new Th(R,t,null,n,h),p.push({event:R,listeners:A}),E?R.data=E:(E=pg(n),E!==null&&(R.data=E)))),(E=ny?iy(t,n):ry(t,n))&&(d=hl(d,"onBeforeInput"),0<d.length&&(h=new Th("onBeforeInput","beforeinput",null,n,h),p.push({event:h,listeners:d}),h.data=E))}Tg(p,e)})}function Na(t,e,n){return{instance:t,listener:e,currentTarget:n}}function hl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=wa(t,n),s!=null&&i.unshift(Na(t,s,r)),s=wa(t,e),s!=null&&i.push(Na(t,s,r))),t=t.return}return i}function jr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Fh(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,c=o.alternate,d=o.stateNode;if(c!==null&&c===i)break;o.tag===5&&d!==null&&(o=d,r?(c=wa(n,s),c!=null&&a.unshift(Na(n,c,o))):r||(c=wa(n,s),c!=null&&a.push(Na(n,c,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var vy=/\r\n?/g,_y=/\u0000|\uFFFD/g;function zh(t){return(typeof t=="string"?t:""+t).replace(vy,`
`).replace(_y,"")}function uo(t,e,n){if(e=zh(e),zh(t)!==e&&n)throw Error(oe(425))}function pl(){}var Cu=null,Ru=null;function Nu(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Pu=typeof setTimeout=="function"?setTimeout:void 0,yy=typeof clearTimeout=="function"?clearTimeout:void 0,Bh=typeof Promise=="function"?Promise:void 0,Sy=typeof queueMicrotask=="function"?queueMicrotask:typeof Bh<"u"?function(t){return Bh.resolve(null).then(t).catch(My)}:Pu;function My(t){setTimeout(function(){throw t})}function _c(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Ta(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Ta(e)}function qi(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function jh(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var zs=Math.random().toString(36).slice(2),Zn="__reactFiber$"+zs,Pa="__reactProps$"+zs,wi="__reactContainer$"+zs,Du="__reactEvents$"+zs,wy="__reactListeners$"+zs,Ey="__reactHandles$"+zs;function Mr(t){var e=t[Zn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[wi]||n[Zn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=jh(t);t!==null;){if(n=t[Zn])return n;t=jh(t)}return e}t=n,n=t.parentNode}return null}function Va(t){return t=t[Zn]||t[wi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function os(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(oe(33))}function zl(t){return t[Pa]||null}var Lu=[],ls=-1;function ar(t){return{current:t}}function pt(t){0>ls||(t.current=Lu[ls],Lu[ls]=null,ls--)}function ut(t,e){ls++,Lu[ls]=t.current,t.current=e}var nr={},Wt=ar(nr),rn=ar(!1),Rr=nr;function bs(t,e){var n=t.type.contextTypes;if(!n)return nr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function sn(t){return t=t.childContextTypes,t!=null}function ml(){pt(rn),pt(Wt)}function Vh(t,e,n){if(Wt.current!==nr)throw Error(oe(168));ut(Wt,e),ut(rn,n)}function Cg(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(oe(108,l_(t)||"Unknown",r));return _t({},n,i)}function gl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||nr,Rr=Wt.current,ut(Wt,t),ut(rn,rn.current),!0}function Hh(t,e,n){var i=t.stateNode;if(!i)throw Error(oe(169));n?(t=Cg(t,e,Rr),i.__reactInternalMemoizedMergedChildContext=t,pt(rn),pt(Wt),ut(Wt,t)):pt(rn),ut(rn,n)}var pi=null,Bl=!1,yc=!1;function Rg(t){pi===null?pi=[t]:pi.push(t)}function by(t){Bl=!0,Rg(t)}function or(){if(!yc&&pi!==null){yc=!0;var t=0,e=rt;try{var n=pi;for(rt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}pi=null,Bl=!1}catch(r){throw pi!==null&&(pi=pi.slice(t+1)),eg(sf,or),r}finally{rt=e,yc=!1}}return null}var cs=[],us=0,xl=null,vl=0,wn=[],En=0,Nr=null,gi=1,xi="";function gr(t,e){cs[us++]=vl,cs[us++]=xl,xl=t,vl=e}function Ng(t,e,n){wn[En++]=gi,wn[En++]=xi,wn[En++]=Nr,Nr=t;var i=gi;t=xi;var r=32-Vn(i)-1;i&=~(1<<r),n+=1;var s=32-Vn(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,gi=1<<32-Vn(e)+r|n<<r|i,xi=s+t}else gi=1<<s|n<<r|i,xi=t}function pf(t){t.return!==null&&(gr(t,1),Ng(t,1,0))}function mf(t){for(;t===xl;)xl=cs[--us],cs[us]=null,vl=cs[--us],cs[us]=null;for(;t===Nr;)Nr=wn[--En],wn[En]=null,xi=wn[--En],wn[En]=null,gi=wn[--En],wn[En]=null}var gn=null,mn=null,mt=!1,zn=null;function Pg(t,e){var n=Tn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Gh(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,gn=t,mn=qi(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,gn=t,mn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Nr!==null?{id:gi,overflow:xi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Tn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,gn=t,mn=null,!0):!1;default:return!1}}function Iu(t){return(t.mode&1)!==0&&(t.flags&128)===0}function ku(t){if(mt){var e=mn;if(e){var n=e;if(!Gh(t,e)){if(Iu(t))throw Error(oe(418));e=qi(n.nextSibling);var i=gn;e&&Gh(t,e)?Pg(i,n):(t.flags=t.flags&-4097|2,mt=!1,gn=t)}}else{if(Iu(t))throw Error(oe(418));t.flags=t.flags&-4097|2,mt=!1,gn=t}}}function Wh(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;gn=t}function fo(t){if(t!==gn)return!1;if(!mt)return Wh(t),mt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Nu(t.type,t.memoizedProps)),e&&(e=mn)){if(Iu(t))throw Dg(),Error(oe(418));for(;e;)Pg(t,e),e=qi(e.nextSibling)}if(Wh(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(oe(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){mn=qi(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}mn=null}}else mn=gn?qi(t.stateNode.nextSibling):null;return!0}function Dg(){for(var t=mn;t;)t=qi(t.nextSibling)}function Ts(){mn=gn=null,mt=!1}function gf(t){zn===null?zn=[t]:zn.push(t)}var Ty=Ci.ReactCurrentBatchConfig;function Ks(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(oe(309));var i=n.stateNode}if(!i)throw Error(oe(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(oe(284));if(!n._owner)throw Error(oe(290,t))}return t}function ho(t,e){throw t=Object.prototype.toString.call(e),Error(oe(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Xh(t){var e=t._init;return e(t._payload)}function Lg(t){function e(u,v){if(t){var y=u.deletions;y===null?(u.deletions=[v],u.flags|=16):y.push(v)}}function n(u,v){if(!t)return null;for(;v!==null;)e(u,v),v=v.sibling;return null}function i(u,v){for(u=new Map;v!==null;)v.key!==null?u.set(v.key,v):u.set(v.index,v),v=v.sibling;return u}function r(u,v){return u=Qi(u,v),u.index=0,u.sibling=null,u}function s(u,v,y){return u.index=y,t?(y=u.alternate,y!==null?(y=y.index,y<v?(u.flags|=2,v):y):(u.flags|=2,v)):(u.flags|=1048576,v)}function a(u){return t&&u.alternate===null&&(u.flags|=2),u}function o(u,v,y,S){return v===null||v.tag!==6?(v=Ac(y,u.mode,S),v.return=u,v):(v=r(v,y),v.return=u,v)}function c(u,v,y,S){var N=y.type;return N===is?h(u,v,y.props.children,S,y.key):v!==null&&(v.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===Fi&&Xh(N)===v.type)?(S=r(v,y.props),S.ref=Ks(u,v,y),S.return=u,S):(S=Qo(y.type,y.key,y.props,null,u.mode,S),S.ref=Ks(u,v,y),S.return=u,S)}function d(u,v,y,S){return v===null||v.tag!==4||v.stateNode.containerInfo!==y.containerInfo||v.stateNode.implementation!==y.implementation?(v=Cc(y,u.mode,S),v.return=u,v):(v=r(v,y.children||[]),v.return=u,v)}function h(u,v,y,S,N){return v===null||v.tag!==7?(v=Cr(y,u.mode,S,N),v.return=u,v):(v=r(v,y),v.return=u,v)}function p(u,v,y){if(typeof v=="string"&&v!==""||typeof v=="number")return v=Ac(""+v,u.mode,y),v.return=u,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case to:return y=Qo(v.type,v.key,v.props,null,u.mode,y),y.ref=Ks(u,null,v),y.return=u,y;case ns:return v=Cc(v,u.mode,y),v.return=u,v;case Fi:var S=v._init;return p(u,S(v._payload),y)}if(sa(v)||Ws(v))return v=Cr(v,u.mode,y,null),v.return=u,v;ho(u,v)}return null}function f(u,v,y,S){var N=v!==null?v.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return N!==null?null:o(u,v,""+y,S);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case to:return y.key===N?c(u,v,y,S):null;case ns:return y.key===N?d(u,v,y,S):null;case Fi:return N=y._init,f(u,v,N(y._payload),S)}if(sa(y)||Ws(y))return N!==null?null:h(u,v,y,S,null);ho(u,y)}return null}function m(u,v,y,S,N){if(typeof S=="string"&&S!==""||typeof S=="number")return u=u.get(y)||null,o(v,u,""+S,N);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case to:return u=u.get(S.key===null?y:S.key)||null,c(v,u,S,N);case ns:return u=u.get(S.key===null?y:S.key)||null,d(v,u,S,N);case Fi:var A=S._init;return m(u,v,y,A(S._payload),N)}if(sa(S)||Ws(S))return u=u.get(y)||null,h(v,u,S,N,null);ho(v,S)}return null}function x(u,v,y,S){for(var N=null,A=null,E=v,R=v=0,T=null;E!==null&&R<y.length;R++){E.index>R?(T=E,E=null):T=E.sibling;var M=f(u,E,y[R],S);if(M===null){E===null&&(E=T);break}t&&E&&M.alternate===null&&e(u,E),v=s(M,v,R),A===null?N=M:A.sibling=M,A=M,E=T}if(R===y.length)return n(u,E),mt&&gr(u,R),N;if(E===null){for(;R<y.length;R++)E=p(u,y[R],S),E!==null&&(v=s(E,v,R),A===null?N=E:A.sibling=E,A=E);return mt&&gr(u,R),N}for(E=i(u,E);R<y.length;R++)T=m(E,u,R,y[R],S),T!==null&&(t&&T.alternate!==null&&E.delete(T.key===null?R:T.key),v=s(T,v,R),A===null?N=T:A.sibling=T,A=T);return t&&E.forEach(function(P){return e(u,P)}),mt&&gr(u,R),N}function _(u,v,y,S){var N=Ws(y);if(typeof N!="function")throw Error(oe(150));if(y=N.call(y),y==null)throw Error(oe(151));for(var A=N=null,E=v,R=v=0,T=null,M=y.next();E!==null&&!M.done;R++,M=y.next()){E.index>R?(T=E,E=null):T=E.sibling;var P=f(u,E,M.value,S);if(P===null){E===null&&(E=T);break}t&&E&&P.alternate===null&&e(u,E),v=s(P,v,R),A===null?N=P:A.sibling=P,A=P,E=T}if(M.done)return n(u,E),mt&&gr(u,R),N;if(E===null){for(;!M.done;R++,M=y.next())M=p(u,M.value,S),M!==null&&(v=s(M,v,R),A===null?N=M:A.sibling=M,A=M);return mt&&gr(u,R),N}for(E=i(u,E);!M.done;R++,M=y.next())M=m(E,u,R,M.value,S),M!==null&&(t&&M.alternate!==null&&E.delete(M.key===null?R:M.key),v=s(M,v,R),A===null?N=M:A.sibling=M,A=M);return t&&E.forEach(function(X){return e(u,X)}),mt&&gr(u,R),N}function g(u,v,y,S){if(typeof y=="object"&&y!==null&&y.type===is&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case to:e:{for(var N=y.key,A=v;A!==null;){if(A.key===N){if(N=y.type,N===is){if(A.tag===7){n(u,A.sibling),v=r(A,y.props.children),v.return=u,u=v;break e}}else if(A.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===Fi&&Xh(N)===A.type){n(u,A.sibling),v=r(A,y.props),v.ref=Ks(u,A,y),v.return=u,u=v;break e}n(u,A);break}else e(u,A);A=A.sibling}y.type===is?(v=Cr(y.props.children,u.mode,S,y.key),v.return=u,u=v):(S=Qo(y.type,y.key,y.props,null,u.mode,S),S.ref=Ks(u,v,y),S.return=u,u=S)}return a(u);case ns:e:{for(A=y.key;v!==null;){if(v.key===A)if(v.tag===4&&v.stateNode.containerInfo===y.containerInfo&&v.stateNode.implementation===y.implementation){n(u,v.sibling),v=r(v,y.children||[]),v.return=u,u=v;break e}else{n(u,v);break}else e(u,v);v=v.sibling}v=Cc(y,u.mode,S),v.return=u,u=v}return a(u);case Fi:return A=y._init,g(u,v,A(y._payload),S)}if(sa(y))return x(u,v,y,S);if(Ws(y))return _(u,v,y,S);ho(u,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,v!==null&&v.tag===6?(n(u,v.sibling),v=r(v,y),v.return=u,u=v):(n(u,v),v=Ac(y,u.mode,S),v.return=u,u=v),a(u)):n(u,v)}return g}var As=Lg(!0),Ig=Lg(!1),_l=ar(null),yl=null,ds=null,xf=null;function vf(){xf=ds=yl=null}function _f(t){var e=_l.current;pt(_l),t._currentValue=e}function Uu(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function _s(t,e){yl=t,xf=ds=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(tn=!0),t.firstContext=null)}function Rn(t){var e=t._currentValue;if(xf!==t)if(t={context:t,memoizedValue:e,next:null},ds===null){if(yl===null)throw Error(oe(308));ds=t,yl.dependencies={lanes:0,firstContext:t}}else ds=ds.next=t;return e}var wr=null;function yf(t){wr===null?wr=[t]:wr.push(t)}function kg(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,yf(e)):(n.next=r.next,r.next=n),e.interleaved=n,Ei(t,i)}function Ei(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var zi=!1;function Sf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Ug(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function yi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Yi(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Je&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ei(t,n)}return r=i.interleaved,r===null?(e.next=e,yf(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ei(t,n)}function Xo(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,af(t,n)}}function $h(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Sl(t,e,n,i){var r=t.updateQueue;zi=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var c=o,d=c.next;c.next=null,a===null?s=d:a.next=d,a=c;var h=t.alternate;h!==null&&(h=h.updateQueue,o=h.lastBaseUpdate,o!==a&&(o===null?h.firstBaseUpdate=d:o.next=d,h.lastBaseUpdate=c))}if(s!==null){var p=r.baseState;a=0,h=d=c=null,o=s;do{var f=o.lane,m=o.eventTime;if((i&f)===f){h!==null&&(h=h.next={eventTime:m,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var x=t,_=o;switch(f=e,m=n,_.tag){case 1:if(x=_.payload,typeof x=="function"){p=x.call(m,p,f);break e}p=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=_.payload,f=typeof x=="function"?x.call(m,p,f):x,f==null)break e;p=_t({},p,f);break e;case 2:zi=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,f=r.effects,f===null?r.effects=[o]:f.push(o))}else m={eventTime:m,lane:f,tag:o.tag,payload:o.payload,callback:o.callback,next:null},h===null?(d=h=m,c=p):h=h.next=m,a|=f;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;f=o,o=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(h===null&&(c=p),r.baseState=c,r.firstBaseUpdate=d,r.lastBaseUpdate=h,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Dr|=a,t.lanes=a,t.memoizedState=p}}function qh(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(oe(191,r));r.call(i)}}}var Ha={},ni=ar(Ha),Da=ar(Ha),La=ar(Ha);function Er(t){if(t===Ha)throw Error(oe(174));return t}function Mf(t,e){switch(ut(La,e),ut(Da,t),ut(ni,Ha),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:gu(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=gu(e,t)}pt(ni),ut(ni,e)}function Cs(){pt(ni),pt(Da),pt(La)}function Og(t){Er(La.current);var e=Er(ni.current),n=gu(e,t.type);e!==n&&(ut(Da,t),ut(ni,n))}function wf(t){Da.current===t&&(pt(ni),pt(Da))}var xt=ar(0);function Ml(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Sc=[];function Ef(){for(var t=0;t<Sc.length;t++)Sc[t]._workInProgressVersionPrimary=null;Sc.length=0}var $o=Ci.ReactCurrentDispatcher,Mc=Ci.ReactCurrentBatchConfig,Pr=0,vt=null,Rt=null,It=null,wl=!1,ga=!1,Ia=0,Ay=0;function Bt(){throw Error(oe(321))}function bf(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Wn(t[n],e[n]))return!1;return!0}function Tf(t,e,n,i,r,s){if(Pr=s,vt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,$o.current=t===null||t.memoizedState===null?Py:Dy,t=n(i,r),ga){s=0;do{if(ga=!1,Ia=0,25<=s)throw Error(oe(301));s+=1,It=Rt=null,e.updateQueue=null,$o.current=Ly,t=n(i,r)}while(ga)}if($o.current=El,e=Rt!==null&&Rt.next!==null,Pr=0,It=Rt=vt=null,wl=!1,e)throw Error(oe(300));return t}function Af(){var t=Ia!==0;return Ia=0,t}function Yn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return It===null?vt.memoizedState=It=t:It=It.next=t,It}function Nn(){if(Rt===null){var t=vt.alternate;t=t!==null?t.memoizedState:null}else t=Rt.next;var e=It===null?vt.memoizedState:It.next;if(e!==null)It=e,Rt=t;else{if(t===null)throw Error(oe(310));Rt=t,t={memoizedState:Rt.memoizedState,baseState:Rt.baseState,baseQueue:Rt.baseQueue,queue:Rt.queue,next:null},It===null?vt.memoizedState=It=t:It=It.next=t}return It}function ka(t,e){return typeof e=="function"?e(t):e}function wc(t){var e=Nn(),n=e.queue;if(n===null)throw Error(oe(311));n.lastRenderedReducer=t;var i=Rt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,c=null,d=s;do{var h=d.lane;if((Pr&h)===h)c!==null&&(c=c.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),i=d.hasEagerState?d.eagerState:t(i,d.action);else{var p={lane:h,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};c===null?(o=c=p,a=i):c=c.next=p,vt.lanes|=h,Dr|=h}d=d.next}while(d!==null&&d!==s);c===null?a=i:c.next=o,Wn(i,e.memoizedState)||(tn=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=c,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,vt.lanes|=s,Dr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Ec(t){var e=Nn(),n=e.queue;if(n===null)throw Error(oe(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);Wn(s,e.memoizedState)||(tn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function Fg(){}function zg(t,e){var n=vt,i=Nn(),r=e(),s=!Wn(i.memoizedState,r);if(s&&(i.memoizedState=r,tn=!0),i=i.queue,Cf(Vg.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||It!==null&&It.memoizedState.tag&1){if(n.flags|=2048,Ua(9,jg.bind(null,n,i,r,e),void 0,null),kt===null)throw Error(oe(349));Pr&30||Bg(n,e,r)}return r}function Bg(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=vt.updateQueue,e===null?(e={lastEffect:null,stores:null},vt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function jg(t,e,n,i){e.value=n,e.getSnapshot=i,Hg(e)&&Gg(t)}function Vg(t,e,n){return n(function(){Hg(e)&&Gg(t)})}function Hg(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Wn(t,n)}catch{return!0}}function Gg(t){var e=Ei(t,1);e!==null&&Hn(e,t,1,-1)}function Yh(t){var e=Yn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ka,lastRenderedState:t},e.queue=t,t=t.dispatch=Ny.bind(null,vt,t),[e.memoizedState,t]}function Ua(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=vt.updateQueue,e===null?(e={lastEffect:null,stores:null},vt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function Wg(){return Nn().memoizedState}function qo(t,e,n,i){var r=Yn();vt.flags|=t,r.memoizedState=Ua(1|e,n,void 0,i===void 0?null:i)}function jl(t,e,n,i){var r=Nn();i=i===void 0?null:i;var s=void 0;if(Rt!==null){var a=Rt.memoizedState;if(s=a.destroy,i!==null&&bf(i,a.deps)){r.memoizedState=Ua(e,n,s,i);return}}vt.flags|=t,r.memoizedState=Ua(1|e,n,s,i)}function Kh(t,e){return qo(8390656,8,t,e)}function Cf(t,e){return jl(2048,8,t,e)}function Xg(t,e){return jl(4,2,t,e)}function $g(t,e){return jl(4,4,t,e)}function qg(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Yg(t,e,n){return n=n!=null?n.concat([t]):null,jl(4,4,qg.bind(null,e,t),n)}function Rf(){}function Kg(t,e){var n=Nn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&bf(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function Zg(t,e){var n=Nn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&bf(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function Qg(t,e,n){return Pr&21?(Wn(n,e)||(n=ig(),vt.lanes|=n,Dr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,tn=!0),t.memoizedState=n)}function Cy(t,e){var n=rt;rt=n!==0&&4>n?n:4,t(!0);var i=Mc.transition;Mc.transition={};try{t(!1),e()}finally{rt=n,Mc.transition=i}}function Jg(){return Nn().memoizedState}function Ry(t,e,n){var i=Zi(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},ex(t))tx(e,n);else if(n=kg(t,e,n,i),n!==null){var r=qt();Hn(n,t,i,r),nx(n,e,i)}}function Ny(t,e,n){var i=Zi(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(ex(t))tx(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,Wn(o,a)){var c=e.interleaved;c===null?(r.next=r,yf(e)):(r.next=c.next,c.next=r),e.interleaved=r;return}}catch{}finally{}n=kg(t,e,r,i),n!==null&&(r=qt(),Hn(n,t,i,r),nx(n,e,i))}}function ex(t){var e=t.alternate;return t===vt||e!==null&&e===vt}function tx(t,e){ga=wl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function nx(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,af(t,n)}}var El={readContext:Rn,useCallback:Bt,useContext:Bt,useEffect:Bt,useImperativeHandle:Bt,useInsertionEffect:Bt,useLayoutEffect:Bt,useMemo:Bt,useReducer:Bt,useRef:Bt,useState:Bt,useDebugValue:Bt,useDeferredValue:Bt,useTransition:Bt,useMutableSource:Bt,useSyncExternalStore:Bt,useId:Bt,unstable_isNewReconciler:!1},Py={readContext:Rn,useCallback:function(t,e){return Yn().memoizedState=[t,e===void 0?null:e],t},useContext:Rn,useEffect:Kh,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,qo(4194308,4,qg.bind(null,e,t),n)},useLayoutEffect:function(t,e){return qo(4194308,4,t,e)},useInsertionEffect:function(t,e){return qo(4,2,t,e)},useMemo:function(t,e){var n=Yn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Yn();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=Ry.bind(null,vt,t),[i.memoizedState,t]},useRef:function(t){var e=Yn();return t={current:t},e.memoizedState=t},useState:Yh,useDebugValue:Rf,useDeferredValue:function(t){return Yn().memoizedState=t},useTransition:function(){var t=Yh(!1),e=t[0];return t=Cy.bind(null,t[1]),Yn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=vt,r=Yn();if(mt){if(n===void 0)throw Error(oe(407));n=n()}else{if(n=e(),kt===null)throw Error(oe(349));Pr&30||Bg(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,Kh(Vg.bind(null,i,s,t),[t]),i.flags|=2048,Ua(9,jg.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=Yn(),e=kt.identifierPrefix;if(mt){var n=xi,i=gi;n=(i&~(1<<32-Vn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ia++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Ay++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},Dy={readContext:Rn,useCallback:Kg,useContext:Rn,useEffect:Cf,useImperativeHandle:Yg,useInsertionEffect:Xg,useLayoutEffect:$g,useMemo:Zg,useReducer:wc,useRef:Wg,useState:function(){return wc(ka)},useDebugValue:Rf,useDeferredValue:function(t){var e=Nn();return Qg(e,Rt.memoizedState,t)},useTransition:function(){var t=wc(ka)[0],e=Nn().memoizedState;return[t,e]},useMutableSource:Fg,useSyncExternalStore:zg,useId:Jg,unstable_isNewReconciler:!1},Ly={readContext:Rn,useCallback:Kg,useContext:Rn,useEffect:Cf,useImperativeHandle:Yg,useInsertionEffect:Xg,useLayoutEffect:$g,useMemo:Zg,useReducer:Ec,useRef:Wg,useState:function(){return Ec(ka)},useDebugValue:Rf,useDeferredValue:function(t){var e=Nn();return Rt===null?e.memoizedState=t:Qg(e,Rt.memoizedState,t)},useTransition:function(){var t=Ec(ka)[0],e=Nn().memoizedState;return[t,e]},useMutableSource:Fg,useSyncExternalStore:zg,useId:Jg,unstable_isNewReconciler:!1};function On(t,e){if(t&&t.defaultProps){e=_t({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Ou(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:_t({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Vl={isMounted:function(t){return(t=t._reactInternals)?Or(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=qt(),r=Zi(t),s=yi(i,r);s.payload=e,n!=null&&(s.callback=n),e=Yi(t,s,r),e!==null&&(Hn(e,t,r,i),Xo(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=qt(),r=Zi(t),s=yi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Yi(t,s,r),e!==null&&(Hn(e,t,r,i),Xo(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=qt(),i=Zi(t),r=yi(n,i);r.tag=2,e!=null&&(r.callback=e),e=Yi(t,r,i),e!==null&&(Hn(e,t,i,n),Xo(e,t,i))}};function Zh(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!Ca(n,i)||!Ca(r,s):!0}function ix(t,e,n){var i=!1,r=nr,s=e.contextType;return typeof s=="object"&&s!==null?s=Rn(s):(r=sn(e)?Rr:Wt.current,i=e.contextTypes,s=(i=i!=null)?bs(t,r):nr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Vl,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function Qh(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Vl.enqueueReplaceState(e,e.state,null)}function Fu(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Sf(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Rn(s):(s=sn(e)?Rr:Wt.current,r.context=bs(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Ou(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Vl.enqueueReplaceState(r,r.state,null),Sl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Rs(t,e){try{var n="",i=e;do n+=o_(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function bc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function zu(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Iy=typeof WeakMap=="function"?WeakMap:Map;function rx(t,e,n){n=yi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Tl||(Tl=!0,Yu=i),zu(t,e)},n}function sx(t,e,n){n=yi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){zu(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){zu(t,e),typeof i!="function"&&(Ki===null?Ki=new Set([this]):Ki.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function Jh(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Iy;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=qy.bind(null,t,e,n),e.then(t,t))}function ep(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function tp(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=yi(-1,1),e.tag=2,Yi(n,e,1))),n.lanes|=1),t)}var ky=Ci.ReactCurrentOwner,tn=!1;function $t(t,e,n,i){e.child=t===null?Ig(e,null,n,i):As(e,t.child,n,i)}function np(t,e,n,i,r){n=n.render;var s=e.ref;return _s(e,r),i=Tf(t,e,n,i,s,r),n=Af(),t!==null&&!tn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,bi(t,e,r)):(mt&&n&&pf(e),e.flags|=1,$t(t,e,i,r),e.child)}function ip(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Of(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,ax(t,e,s,i,r)):(t=Qo(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:Ca,n(a,i)&&t.ref===e.ref)return bi(t,e,r)}return e.flags|=1,t=Qi(s,i),t.ref=e.ref,t.return=e,e.child=t}function ax(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Ca(s,i)&&t.ref===e.ref)if(tn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(tn=!0);else return e.lanes=t.lanes,bi(t,e,r)}return Bu(t,e,n,i,r)}function ox(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ut(hs,pn),pn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ut(hs,pn),pn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,ut(hs,pn),pn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,ut(hs,pn),pn|=i;return $t(t,e,r,n),e.child}function lx(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Bu(t,e,n,i,r){var s=sn(n)?Rr:Wt.current;return s=bs(e,s),_s(e,r),n=Tf(t,e,n,i,s,r),i=Af(),t!==null&&!tn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,bi(t,e,r)):(mt&&i&&pf(e),e.flags|=1,$t(t,e,n,r),e.child)}function rp(t,e,n,i,r){if(sn(n)){var s=!0;gl(e)}else s=!1;if(_s(e,r),e.stateNode===null)Yo(t,e),ix(e,n,i),Fu(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var c=a.context,d=n.contextType;typeof d=="object"&&d!==null?d=Rn(d):(d=sn(n)?Rr:Wt.current,d=bs(e,d));var h=n.getDerivedStateFromProps,p=typeof h=="function"||typeof a.getSnapshotBeforeUpdate=="function";p||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||c!==d)&&Qh(e,a,i,d),zi=!1;var f=e.memoizedState;a.state=f,Sl(e,i,a,r),c=e.memoizedState,o!==i||f!==c||rn.current||zi?(typeof h=="function"&&(Ou(e,n,h,i),c=e.memoizedState),(o=zi||Zh(e,n,o,i,f,c,d))?(p||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=c),a.props=i,a.state=c,a.context=d,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,Ug(t,e),o=e.memoizedProps,d=e.type===e.elementType?o:On(e.type,o),a.props=d,p=e.pendingProps,f=a.context,c=n.contextType,typeof c=="object"&&c!==null?c=Rn(c):(c=sn(n)?Rr:Wt.current,c=bs(e,c));var m=n.getDerivedStateFromProps;(h=typeof m=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==p||f!==c)&&Qh(e,a,i,c),zi=!1,f=e.memoizedState,a.state=f,Sl(e,i,a,r);var x=e.memoizedState;o!==p||f!==x||rn.current||zi?(typeof m=="function"&&(Ou(e,n,m,i),x=e.memoizedState),(d=zi||Zh(e,n,d,i,f,x,c)||!1)?(h||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,x,c),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,x,c)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=x),a.props=i,a.state=x,a.context=c,i=d):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),i=!1)}return ju(t,e,n,i,s,r)}function ju(t,e,n,i,r,s){lx(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&Hh(e,n,!1),bi(t,e,s);i=e.stateNode,ky.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=As(e,t.child,null,s),e.child=As(e,null,o,s)):$t(t,e,o,s),e.memoizedState=i.state,r&&Hh(e,n,!0),e.child}function cx(t){var e=t.stateNode;e.pendingContext?Vh(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Vh(t,e.context,!1),Mf(t,e.containerInfo)}function sp(t,e,n,i,r){return Ts(),gf(r),e.flags|=256,$t(t,e,n,i),e.child}var Vu={dehydrated:null,treeContext:null,retryLane:0};function Hu(t){return{baseLanes:t,cachePool:null,transitions:null}}function ux(t,e,n){var i=e.pendingProps,r=xt.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),ut(xt,r&1),t===null)return ku(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=Wl(a,i,0,null),t=Cr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Hu(n),e.memoizedState=Vu,t):Nf(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return Uy(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var c={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=c,e.deletions=null):(i=Qi(r,c),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=Qi(o,s):(s=Cr(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?Hu(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=Vu,i}return s=t.child,t=s.sibling,i=Qi(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Nf(t,e){return e=Wl({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function po(t,e,n,i){return i!==null&&gf(i),As(e,t.child,null,n),t=Nf(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Uy(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=bc(Error(oe(422))),po(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Wl({mode:"visible",children:i.children},r,0,null),s=Cr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&As(e,t.child,null,a),e.child.memoizedState=Hu(a),e.memoizedState=Vu,s);if(!(e.mode&1))return po(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(oe(419)),i=bc(s,i,void 0),po(t,e,a,i)}if(o=(a&t.childLanes)!==0,tn||o){if(i=kt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ei(t,r),Hn(i,t,r,-1))}return Uf(),i=bc(Error(oe(421))),po(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=Yy.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,mn=qi(r.nextSibling),gn=e,mt=!0,zn=null,t!==null&&(wn[En++]=gi,wn[En++]=xi,wn[En++]=Nr,gi=t.id,xi=t.overflow,Nr=e),e=Nf(e,i.children),e.flags|=4096,e)}function ap(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Uu(t.return,e,n)}function Tc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function dx(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if($t(t,e,i.children,n),i=xt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&ap(t,n,e);else if(t.tag===19)ap(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(ut(xt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Ml(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Tc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Ml(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Tc(e,!0,n,null,s);break;case"together":Tc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Yo(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function bi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Dr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(oe(153));if(e.child!==null){for(t=e.child,n=Qi(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Qi(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Oy(t,e,n){switch(e.tag){case 3:cx(e),Ts();break;case 5:Og(e);break;case 1:sn(e.type)&&gl(e);break;case 4:Mf(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ut(_l,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ut(xt,xt.current&1),e.flags|=128,null):n&e.child.childLanes?ux(t,e,n):(ut(xt,xt.current&1),t=bi(t,e,n),t!==null?t.sibling:null);ut(xt,xt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return dx(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ut(xt,xt.current),i)break;return null;case 22:case 23:return e.lanes=0,ox(t,e,n)}return bi(t,e,n)}var fx,Gu,hx,px;fx=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Gu=function(){};hx=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Er(ni.current);var s=null;switch(n){case"input":r=fu(t,r),i=fu(t,i),s=[];break;case"select":r=_t({},r,{value:void 0}),i=_t({},i,{value:void 0}),s=[];break;case"textarea":r=mu(t,r),i=mu(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=pl)}xu(n,i);var a;n=null;for(d in r)if(!i.hasOwnProperty(d)&&r.hasOwnProperty(d)&&r[d]!=null)if(d==="style"){var o=r[d];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(Sa.hasOwnProperty(d)?s||(s=[]):(s=s||[]).push(d,null));for(d in i){var c=i[d];if(o=r!=null?r[d]:void 0,i.hasOwnProperty(d)&&c!==o&&(c!=null||o!=null))if(d==="style")if(o){for(a in o)!o.hasOwnProperty(a)||c&&c.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in c)c.hasOwnProperty(a)&&o[a]!==c[a]&&(n||(n={}),n[a]=c[a])}else n||(s||(s=[]),s.push(d,n)),n=c;else d==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,o=o?o.__html:void 0,c!=null&&o!==c&&(s=s||[]).push(d,c)):d==="children"?typeof c!="string"&&typeof c!="number"||(s=s||[]).push(d,""+c):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(Sa.hasOwnProperty(d)?(c!=null&&d==="onScroll"&&ht("scroll",t),s||o===c||(s=[])):(s=s||[]).push(d,c))}n&&(s=s||[]).push("style",n);var d=s;(e.updateQueue=d)&&(e.flags|=4)}};px=function(t,e,n,i){n!==i&&(e.flags|=4)};function Zs(t,e){if(!mt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function jt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Fy(t,e,n){var i=e.pendingProps;switch(mf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return jt(e),null;case 1:return sn(e.type)&&ml(),jt(e),null;case 3:return i=e.stateNode,Cs(),pt(rn),pt(Wt),Ef(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(fo(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,zn!==null&&(Qu(zn),zn=null))),Gu(t,e),jt(e),null;case 5:wf(e);var r=Er(La.current);if(n=e.type,t!==null&&e.stateNode!=null)hx(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(oe(166));return jt(e),null}if(t=Er(ni.current),fo(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[Zn]=e,i[Pa]=s,t=(e.mode&1)!==0,n){case"dialog":ht("cancel",i),ht("close",i);break;case"iframe":case"object":case"embed":ht("load",i);break;case"video":case"audio":for(r=0;r<oa.length;r++)ht(oa[r],i);break;case"source":ht("error",i);break;case"img":case"image":case"link":ht("error",i),ht("load",i);break;case"details":ht("toggle",i);break;case"input":mh(i,s),ht("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},ht("invalid",i);break;case"textarea":xh(i,s),ht("invalid",i)}xu(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&uo(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&uo(i.textContent,o,t),r=["children",""+o]):Sa.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&ht("scroll",i)}switch(n){case"input":no(i),gh(i,s,!0);break;case"textarea":no(i),vh(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=pl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Vm(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[Zn]=e,t[Pa]=i,fx(t,e,!1,!1),e.stateNode=t;e:{switch(a=vu(n,i),n){case"dialog":ht("cancel",t),ht("close",t),r=i;break;case"iframe":case"object":case"embed":ht("load",t),r=i;break;case"video":case"audio":for(r=0;r<oa.length;r++)ht(oa[r],t);r=i;break;case"source":ht("error",t),r=i;break;case"img":case"image":case"link":ht("error",t),ht("load",t),r=i;break;case"details":ht("toggle",t),r=i;break;case"input":mh(t,i),r=fu(t,i),ht("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=_t({},i,{value:void 0}),ht("invalid",t);break;case"textarea":xh(t,i),r=mu(t,i),ht("invalid",t);break;default:r=i}xu(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var c=o[s];s==="style"?Wm(t,c):s==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&Hm(t,c)):s==="children"?typeof c=="string"?(n!=="textarea"||c!=="")&&Ma(t,c):typeof c=="number"&&Ma(t,""+c):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Sa.hasOwnProperty(s)?c!=null&&s==="onScroll"&&ht("scroll",t):c!=null&&Jd(t,s,c,a))}switch(n){case"input":no(t),gh(t,i,!1);break;case"textarea":no(t),vh(t);break;case"option":i.value!=null&&t.setAttribute("value",""+tr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?ms(t,!!i.multiple,s,!1):i.defaultValue!=null&&ms(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=pl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return jt(e),null;case 6:if(t&&e.stateNode!=null)px(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(oe(166));if(n=Er(La.current),Er(ni.current),fo(e)){if(i=e.stateNode,n=e.memoizedProps,i[Zn]=e,(s=i.nodeValue!==n)&&(t=gn,t!==null))switch(t.tag){case 3:uo(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&uo(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Zn]=e,e.stateNode=i}return jt(e),null;case 13:if(pt(xt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(mt&&mn!==null&&e.mode&1&&!(e.flags&128))Dg(),Ts(),e.flags|=98560,s=!1;else if(s=fo(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(oe(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(oe(317));s[Zn]=e}else Ts(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;jt(e),s=!1}else zn!==null&&(Qu(zn),zn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||xt.current&1?Nt===0&&(Nt=3):Uf())),e.updateQueue!==null&&(e.flags|=4),jt(e),null);case 4:return Cs(),Gu(t,e),t===null&&Ra(e.stateNode.containerInfo),jt(e),null;case 10:return _f(e.type._context),jt(e),null;case 17:return sn(e.type)&&ml(),jt(e),null;case 19:if(pt(xt),s=e.memoizedState,s===null)return jt(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)Zs(s,!1);else{if(Nt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Ml(t),a!==null){for(e.flags|=128,Zs(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ut(xt,xt.current&1|2),e.child}t=t.sibling}s.tail!==null&&wt()>Ns&&(e.flags|=128,i=!0,Zs(s,!1),e.lanes=4194304)}else{if(!i)if(t=Ml(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Zs(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!mt)return jt(e),null}else 2*wt()-s.renderingStartTime>Ns&&n!==1073741824&&(e.flags|=128,i=!0,Zs(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=wt(),e.sibling=null,n=xt.current,ut(xt,i?n&1|2:n&1),e):(jt(e),null);case 22:case 23:return kf(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?pn&1073741824&&(jt(e),e.subtreeFlags&6&&(e.flags|=8192)):jt(e),null;case 24:return null;case 25:return null}throw Error(oe(156,e.tag))}function zy(t,e){switch(mf(e),e.tag){case 1:return sn(e.type)&&ml(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Cs(),pt(rn),pt(Wt),Ef(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return wf(e),null;case 13:if(pt(xt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(oe(340));Ts()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return pt(xt),null;case 4:return Cs(),null;case 10:return _f(e.type._context),null;case 22:case 23:return kf(),null;case 24:return null;default:return null}}var mo=!1,Gt=!1,By=typeof WeakSet=="function"?WeakSet:Set,ye=null;function fs(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){St(t,e,i)}else n.current=null}function Wu(t,e,n){try{n()}catch(i){St(t,e,i)}}var op=!1;function jy(t,e){if(Cu=dl,t=_g(),hf(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,c=-1,d=0,h=0,p=t,f=null;t:for(;;){for(var m;p!==n||r!==0&&p.nodeType!==3||(o=a+r),p!==s||i!==0&&p.nodeType!==3||(c=a+i),p.nodeType===3&&(a+=p.nodeValue.length),(m=p.firstChild)!==null;)f=p,p=m;for(;;){if(p===t)break t;if(f===n&&++d===r&&(o=a),f===s&&++h===i&&(c=a),(m=p.nextSibling)!==null)break;p=f,f=p.parentNode}p=m}n=o===-1||c===-1?null:{start:o,end:c}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ru={focusedElem:t,selectionRange:n},dl=!1,ye=e;ye!==null;)if(e=ye,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,ye=t;else for(;ye!==null;){e=ye;try{var x=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(x!==null){var _=x.memoizedProps,g=x.memoizedState,u=e.stateNode,v=u.getSnapshotBeforeUpdate(e.elementType===e.type?_:On(e.type,_),g);u.__reactInternalSnapshotBeforeUpdate=v}break;case 3:var y=e.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(oe(163))}}catch(S){St(e,e.return,S)}if(t=e.sibling,t!==null){t.return=e.return,ye=t;break}ye=e.return}return x=op,op=!1,x}function xa(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Wu(e,n,s)}r=r.next}while(r!==i)}}function Hl(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Xu(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function mx(t){var e=t.alternate;e!==null&&(t.alternate=null,mx(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Zn],delete e[Pa],delete e[Du],delete e[wy],delete e[Ey])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function gx(t){return t.tag===5||t.tag===3||t.tag===4}function lp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||gx(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function $u(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=pl));else if(i!==4&&(t=t.child,t!==null))for($u(t,e,n),t=t.sibling;t!==null;)$u(t,e,n),t=t.sibling}function qu(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(qu(t,e,n),t=t.sibling;t!==null;)qu(t,e,n),t=t.sibling}var Ut=null,Fn=!1;function Pi(t,e,n){for(n=n.child;n!==null;)xx(t,e,n),n=n.sibling}function xx(t,e,n){if(ti&&typeof ti.onCommitFiberUnmount=="function")try{ti.onCommitFiberUnmount(kl,n)}catch{}switch(n.tag){case 5:Gt||fs(n,e);case 6:var i=Ut,r=Fn;Ut=null,Pi(t,e,n),Ut=i,Fn=r,Ut!==null&&(Fn?(t=Ut,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Ut.removeChild(n.stateNode));break;case 18:Ut!==null&&(Fn?(t=Ut,n=n.stateNode,t.nodeType===8?_c(t.parentNode,n):t.nodeType===1&&_c(t,n),Ta(t)):_c(Ut,n.stateNode));break;case 4:i=Ut,r=Fn,Ut=n.stateNode.containerInfo,Fn=!0,Pi(t,e,n),Ut=i,Fn=r;break;case 0:case 11:case 14:case 15:if(!Gt&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Wu(n,e,a),r=r.next}while(r!==i)}Pi(t,e,n);break;case 1:if(!Gt&&(fs(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){St(n,e,o)}Pi(t,e,n);break;case 21:Pi(t,e,n);break;case 22:n.mode&1?(Gt=(i=Gt)||n.memoizedState!==null,Pi(t,e,n),Gt=i):Pi(t,e,n);break;default:Pi(t,e,n)}}function cp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new By),e.forEach(function(i){var r=Ky.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Ln(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Ut=o.stateNode,Fn=!1;break e;case 3:Ut=o.stateNode.containerInfo,Fn=!0;break e;case 4:Ut=o.stateNode.containerInfo,Fn=!0;break e}o=o.return}if(Ut===null)throw Error(oe(160));xx(s,a,r),Ut=null,Fn=!1;var c=r.alternate;c!==null&&(c.return=null),r.return=null}catch(d){St(r,e,d)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)vx(e,t),e=e.sibling}function vx(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Ln(e,t),qn(t),i&4){try{xa(3,t,t.return),Hl(3,t)}catch(_){St(t,t.return,_)}try{xa(5,t,t.return)}catch(_){St(t,t.return,_)}}break;case 1:Ln(e,t),qn(t),i&512&&n!==null&&fs(n,n.return);break;case 5:if(Ln(e,t),qn(t),i&512&&n!==null&&fs(n,n.return),t.flags&32){var r=t.stateNode;try{Ma(r,"")}catch(_){St(t,t.return,_)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,c=t.updateQueue;if(t.updateQueue=null,c!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&Bm(r,s),vu(o,a);var d=vu(o,s);for(a=0;a<c.length;a+=2){var h=c[a],p=c[a+1];h==="style"?Wm(r,p):h==="dangerouslySetInnerHTML"?Hm(r,p):h==="children"?Ma(r,p):Jd(r,h,p,d)}switch(o){case"input":hu(r,s);break;case"textarea":jm(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var m=s.value;m!=null?ms(r,!!s.multiple,m,!1):f!==!!s.multiple&&(s.defaultValue!=null?ms(r,!!s.multiple,s.defaultValue,!0):ms(r,!!s.multiple,s.multiple?[]:"",!1))}r[Pa]=s}catch(_){St(t,t.return,_)}}break;case 6:if(Ln(e,t),qn(t),i&4){if(t.stateNode===null)throw Error(oe(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(_){St(t,t.return,_)}}break;case 3:if(Ln(e,t),qn(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Ta(e.containerInfo)}catch(_){St(t,t.return,_)}break;case 4:Ln(e,t),qn(t);break;case 13:Ln(e,t),qn(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Lf=wt())),i&4&&cp(t);break;case 22:if(h=n!==null&&n.memoizedState!==null,t.mode&1?(Gt=(d=Gt)||h,Ln(e,t),Gt=d):Ln(e,t),qn(t),i&8192){if(d=t.memoizedState!==null,(t.stateNode.isHidden=d)&&!h&&t.mode&1)for(ye=t,h=t.child;h!==null;){for(p=ye=h;ye!==null;){switch(f=ye,m=f.child,f.tag){case 0:case 11:case 14:case 15:xa(4,f,f.return);break;case 1:fs(f,f.return);var x=f.stateNode;if(typeof x.componentWillUnmount=="function"){i=f,n=f.return;try{e=i,x.props=e.memoizedProps,x.state=e.memoizedState,x.componentWillUnmount()}catch(_){St(i,n,_)}}break;case 5:fs(f,f.return);break;case 22:if(f.memoizedState!==null){dp(p);continue}}m!==null?(m.return=f,ye=m):dp(p)}h=h.sibling}e:for(h=null,p=t;;){if(p.tag===5){if(h===null){h=p;try{r=p.stateNode,d?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=p.stateNode,c=p.memoizedProps.style,a=c!=null&&c.hasOwnProperty("display")?c.display:null,o.style.display=Gm("display",a))}catch(_){St(t,t.return,_)}}}else if(p.tag===6){if(h===null)try{p.stateNode.nodeValue=d?"":p.memoizedProps}catch(_){St(t,t.return,_)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===t)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===t)break e;for(;p.sibling===null;){if(p.return===null||p.return===t)break e;h===p&&(h=null),p=p.return}h===p&&(h=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:Ln(e,t),qn(t),i&4&&cp(t);break;case 21:break;default:Ln(e,t),qn(t)}}function qn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(gx(n)){var i=n;break e}n=n.return}throw Error(oe(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Ma(r,""),i.flags&=-33);var s=lp(t);qu(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=lp(t);$u(t,o,a);break;default:throw Error(oe(161))}}catch(c){St(t,t.return,c)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Vy(t,e,n){ye=t,_x(t)}function _x(t,e,n){for(var i=(t.mode&1)!==0;ye!==null;){var r=ye,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||mo;if(!a){var o=r.alternate,c=o!==null&&o.memoizedState!==null||Gt;o=mo;var d=Gt;if(mo=a,(Gt=c)&&!d)for(ye=r;ye!==null;)a=ye,c=a.child,a.tag===22&&a.memoizedState!==null?fp(r):c!==null?(c.return=a,ye=c):fp(r);for(;s!==null;)ye=s,_x(s),s=s.sibling;ye=r,mo=o,Gt=d}up(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,ye=s):up(t)}}function up(t){for(;ye!==null;){var e=ye;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Gt||Hl(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Gt)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:On(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&qh(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}qh(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var c=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&n.focus();break;case"img":c.src&&(n.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var d=e.alternate;if(d!==null){var h=d.memoizedState;if(h!==null){var p=h.dehydrated;p!==null&&Ta(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(oe(163))}Gt||e.flags&512&&Xu(e)}catch(f){St(e,e.return,f)}}if(e===t){ye=null;break}if(n=e.sibling,n!==null){n.return=e.return,ye=n;break}ye=e.return}}function dp(t){for(;ye!==null;){var e=ye;if(e===t){ye=null;break}var n=e.sibling;if(n!==null){n.return=e.return,ye=n;break}ye=e.return}}function fp(t){for(;ye!==null;){var e=ye;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Hl(4,e)}catch(c){St(e,n,c)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(c){St(e,r,c)}}var s=e.return;try{Xu(e)}catch(c){St(e,s,c)}break;case 5:var a=e.return;try{Xu(e)}catch(c){St(e,a,c)}}}catch(c){St(e,e.return,c)}if(e===t){ye=null;break}var o=e.sibling;if(o!==null){o.return=e.return,ye=o;break}ye=e.return}}var Hy=Math.ceil,bl=Ci.ReactCurrentDispatcher,Pf=Ci.ReactCurrentOwner,An=Ci.ReactCurrentBatchConfig,Je=0,kt=null,Ct=null,Ot=0,pn=0,hs=ar(0),Nt=0,Oa=null,Dr=0,Gl=0,Df=0,va=null,Jt=null,Lf=0,Ns=1/0,hi=null,Tl=!1,Yu=null,Ki=null,go=!1,Gi=null,Al=0,_a=0,Ku=null,Ko=-1,Zo=0;function qt(){return Je&6?wt():Ko!==-1?Ko:Ko=wt()}function Zi(t){return t.mode&1?Je&2&&Ot!==0?Ot&-Ot:Ty.transition!==null?(Zo===0&&(Zo=ig()),Zo):(t=rt,t!==0||(t=window.event,t=t===void 0?16:ug(t.type)),t):1}function Hn(t,e,n,i){if(50<_a)throw _a=0,Ku=null,Error(oe(185));Ba(t,n,i),(!(Je&2)||t!==kt)&&(t===kt&&(!(Je&2)&&(Gl|=n),Nt===4&&ji(t,Ot)),an(t,i),n===1&&Je===0&&!(e.mode&1)&&(Ns=wt()+500,Bl&&or()))}function an(t,e){var n=t.callbackNode;T_(t,e);var i=ul(t,t===kt?Ot:0);if(i===0)n!==null&&Sh(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Sh(n),e===1)t.tag===0?by(hp.bind(null,t)):Rg(hp.bind(null,t)),Sy(function(){!(Je&6)&&or()}),n=null;else{switch(rg(i)){case 1:n=sf;break;case 4:n=tg;break;case 16:n=cl;break;case 536870912:n=ng;break;default:n=cl}n=Ax(n,yx.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function yx(t,e){if(Ko=-1,Zo=0,Je&6)throw Error(oe(327));var n=t.callbackNode;if(ys()&&t.callbackNode!==n)return null;var i=ul(t,t===kt?Ot:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Cl(t,i);else{e=i;var r=Je;Je|=2;var s=Mx();(kt!==t||Ot!==e)&&(hi=null,Ns=wt()+500,Ar(t,e));do try{Xy();break}catch(o){Sx(t,o)}while(!0);vf(),bl.current=s,Je=r,Ct!==null?e=0:(kt=null,Ot=0,e=Nt)}if(e!==0){if(e===2&&(r=wu(t),r!==0&&(i=r,e=Zu(t,r))),e===1)throw n=Oa,Ar(t,0),ji(t,i),an(t,wt()),n;if(e===6)ji(t,i);else{if(r=t.current.alternate,!(i&30)&&!Gy(r)&&(e=Cl(t,i),e===2&&(s=wu(t),s!==0&&(i=s,e=Zu(t,s))),e===1))throw n=Oa,Ar(t,0),ji(t,i),an(t,wt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(oe(345));case 2:xr(t,Jt,hi);break;case 3:if(ji(t,i),(i&130023424)===i&&(e=Lf+500-wt(),10<e)){if(ul(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){qt(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Pu(xr.bind(null,t,Jt,hi),e);break}xr(t,Jt,hi);break;case 4:if(ji(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-Vn(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=wt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Hy(i/1960))-i,10<i){t.timeoutHandle=Pu(xr.bind(null,t,Jt,hi),i);break}xr(t,Jt,hi);break;case 5:xr(t,Jt,hi);break;default:throw Error(oe(329))}}}return an(t,wt()),t.callbackNode===n?yx.bind(null,t):null}function Zu(t,e){var n=va;return t.current.memoizedState.isDehydrated&&(Ar(t,e).flags|=256),t=Cl(t,e),t!==2&&(e=Jt,Jt=n,e!==null&&Qu(e)),t}function Qu(t){Jt===null?Jt=t:Jt.push.apply(Jt,t)}function Gy(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!Wn(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function ji(t,e){for(e&=~Df,e&=~Gl,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Vn(e),i=1<<n;t[n]=-1,e&=~i}}function hp(t){if(Je&6)throw Error(oe(327));ys();var e=ul(t,0);if(!(e&1))return an(t,wt()),null;var n=Cl(t,e);if(t.tag!==0&&n===2){var i=wu(t);i!==0&&(e=i,n=Zu(t,i))}if(n===1)throw n=Oa,Ar(t,0),ji(t,e),an(t,wt()),n;if(n===6)throw Error(oe(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,xr(t,Jt,hi),an(t,wt()),null}function If(t,e){var n=Je;Je|=1;try{return t(e)}finally{Je=n,Je===0&&(Ns=wt()+500,Bl&&or())}}function Lr(t){Gi!==null&&Gi.tag===0&&!(Je&6)&&ys();var e=Je;Je|=1;var n=An.transition,i=rt;try{if(An.transition=null,rt=1,t)return t()}finally{rt=i,An.transition=n,Je=e,!(Je&6)&&or()}}function kf(){pn=hs.current,pt(hs)}function Ar(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,yy(n)),Ct!==null)for(n=Ct.return;n!==null;){var i=n;switch(mf(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&ml();break;case 3:Cs(),pt(rn),pt(Wt),Ef();break;case 5:wf(i);break;case 4:Cs();break;case 13:pt(xt);break;case 19:pt(xt);break;case 10:_f(i.type._context);break;case 22:case 23:kf()}n=n.return}if(kt=t,Ct=t=Qi(t.current,null),Ot=pn=e,Nt=0,Oa=null,Df=Gl=Dr=0,Jt=va=null,wr!==null){for(e=0;e<wr.length;e++)if(n=wr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}wr=null}return t}function Sx(t,e){do{var n=Ct;try{if(vf(),$o.current=El,wl){for(var i=vt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}wl=!1}if(Pr=0,It=Rt=vt=null,ga=!1,Ia=0,Pf.current=null,n===null||n.return===null){Nt=1,Oa=e,Ct=null;break}e:{var s=t,a=n.return,o=n,c=e;if(e=Ot,o.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var d=c,h=o,p=h.tag;if(!(h.mode&1)&&(p===0||p===11||p===15)){var f=h.alternate;f?(h.updateQueue=f.updateQueue,h.memoizedState=f.memoizedState,h.lanes=f.lanes):(h.updateQueue=null,h.memoizedState=null)}var m=ep(a);if(m!==null){m.flags&=-257,tp(m,a,o,s,e),m.mode&1&&Jh(s,d,e),e=m,c=d;var x=e.updateQueue;if(x===null){var _=new Set;_.add(c),e.updateQueue=_}else x.add(c);break e}else{if(!(e&1)){Jh(s,d,e),Uf();break e}c=Error(oe(426))}}else if(mt&&o.mode&1){var g=ep(a);if(g!==null){!(g.flags&65536)&&(g.flags|=256),tp(g,a,o,s,e),gf(Rs(c,o));break e}}s=c=Rs(c,o),Nt!==4&&(Nt=2),va===null?va=[s]:va.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var u=rx(s,c,e);$h(s,u);break e;case 1:o=c;var v=s.type,y=s.stateNode;if(!(s.flags&128)&&(typeof v.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(Ki===null||!Ki.has(y)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=sx(s,o,e);$h(s,S);break e}}s=s.return}while(s!==null)}Ex(n)}catch(N){e=N,Ct===n&&n!==null&&(Ct=n=n.return);continue}break}while(!0)}function Mx(){var t=bl.current;return bl.current=El,t===null?El:t}function Uf(){(Nt===0||Nt===3||Nt===2)&&(Nt=4),kt===null||!(Dr&268435455)&&!(Gl&268435455)||ji(kt,Ot)}function Cl(t,e){var n=Je;Je|=2;var i=Mx();(kt!==t||Ot!==e)&&(hi=null,Ar(t,e));do try{Wy();break}catch(r){Sx(t,r)}while(!0);if(vf(),Je=n,bl.current=i,Ct!==null)throw Error(oe(261));return kt=null,Ot=0,Nt}function Wy(){for(;Ct!==null;)wx(Ct)}function Xy(){for(;Ct!==null&&!x_();)wx(Ct)}function wx(t){var e=Tx(t.alternate,t,pn);t.memoizedProps=t.pendingProps,e===null?Ex(t):Ct=e,Pf.current=null}function Ex(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=zy(n,e),n!==null){n.flags&=32767,Ct=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Nt=6,Ct=null;return}}else if(n=Fy(n,e,pn),n!==null){Ct=n;return}if(e=e.sibling,e!==null){Ct=e;return}Ct=e=t}while(e!==null);Nt===0&&(Nt=5)}function xr(t,e,n){var i=rt,r=An.transition;try{An.transition=null,rt=1,$y(t,e,n,i)}finally{An.transition=r,rt=i}return null}function $y(t,e,n,i){do ys();while(Gi!==null);if(Je&6)throw Error(oe(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(oe(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(A_(t,s),t===kt&&(Ct=kt=null,Ot=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||go||(go=!0,Ax(cl,function(){return ys(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=An.transition,An.transition=null;var a=rt;rt=1;var o=Je;Je|=4,Pf.current=null,jy(t,n),vx(n,t),hy(Ru),dl=!!Cu,Ru=Cu=null,t.current=n,Vy(n),v_(),Je=o,rt=a,An.transition=s}else t.current=n;if(go&&(go=!1,Gi=t,Al=r),s=t.pendingLanes,s===0&&(Ki=null),S_(n.stateNode),an(t,wt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Tl)throw Tl=!1,t=Yu,Yu=null,t;return Al&1&&t.tag!==0&&ys(),s=t.pendingLanes,s&1?t===Ku?_a++:(_a=0,Ku=t):_a=0,or(),null}function ys(){if(Gi!==null){var t=rg(Al),e=An.transition,n=rt;try{if(An.transition=null,rt=16>t?16:t,Gi===null)var i=!1;else{if(t=Gi,Gi=null,Al=0,Je&6)throw Error(oe(331));var r=Je;for(Je|=4,ye=t.current;ye!==null;){var s=ye,a=s.child;if(ye.flags&16){var o=s.deletions;if(o!==null){for(var c=0;c<o.length;c++){var d=o[c];for(ye=d;ye!==null;){var h=ye;switch(h.tag){case 0:case 11:case 15:xa(8,h,s)}var p=h.child;if(p!==null)p.return=h,ye=p;else for(;ye!==null;){h=ye;var f=h.sibling,m=h.return;if(mx(h),h===d){ye=null;break}if(f!==null){f.return=m,ye=f;break}ye=m}}}var x=s.alternate;if(x!==null){var _=x.child;if(_!==null){x.child=null;do{var g=_.sibling;_.sibling=null,_=g}while(_!==null)}}ye=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,ye=a;else e:for(;ye!==null;){if(s=ye,s.flags&2048)switch(s.tag){case 0:case 11:case 15:xa(9,s,s.return)}var u=s.sibling;if(u!==null){u.return=s.return,ye=u;break e}ye=s.return}}var v=t.current;for(ye=v;ye!==null;){a=ye;var y=a.child;if(a.subtreeFlags&2064&&y!==null)y.return=a,ye=y;else e:for(a=v;ye!==null;){if(o=ye,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:Hl(9,o)}}catch(N){St(o,o.return,N)}if(o===a){ye=null;break e}var S=o.sibling;if(S!==null){S.return=o.return,ye=S;break e}ye=o.return}}if(Je=r,or(),ti&&typeof ti.onPostCommitFiberRoot=="function")try{ti.onPostCommitFiberRoot(kl,t)}catch{}i=!0}return i}finally{rt=n,An.transition=e}}return!1}function pp(t,e,n){e=Rs(n,e),e=rx(t,e,1),t=Yi(t,e,1),e=qt(),t!==null&&(Ba(t,1,e),an(t,e))}function St(t,e,n){if(t.tag===3)pp(t,t,n);else for(;e!==null;){if(e.tag===3){pp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Ki===null||!Ki.has(i))){t=Rs(n,t),t=sx(e,t,1),e=Yi(e,t,1),t=qt(),e!==null&&(Ba(e,1,t),an(e,t));break}}e=e.return}}function qy(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=qt(),t.pingedLanes|=t.suspendedLanes&n,kt===t&&(Ot&n)===n&&(Nt===4||Nt===3&&(Ot&130023424)===Ot&&500>wt()-Lf?Ar(t,0):Df|=n),an(t,e)}function bx(t,e){e===0&&(t.mode&1?(e=so,so<<=1,!(so&130023424)&&(so=4194304)):e=1);var n=qt();t=Ei(t,e),t!==null&&(Ba(t,e,n),an(t,n))}function Yy(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),bx(t,n)}function Ky(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(oe(314))}i!==null&&i.delete(e),bx(t,n)}var Tx;Tx=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||rn.current)tn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return tn=!1,Oy(t,e,n);tn=!!(t.flags&131072)}else tn=!1,mt&&e.flags&1048576&&Ng(e,vl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Yo(t,e),t=e.pendingProps;var r=bs(e,Wt.current);_s(e,n),r=Tf(null,e,i,t,r,n);var s=Af();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,sn(i)?(s=!0,gl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Sf(e),r.updater=Vl,e.stateNode=r,r._reactInternals=e,Fu(e,i,t,n),e=ju(null,e,i,!0,s,n)):(e.tag=0,mt&&s&&pf(e),$t(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(Yo(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=Qy(i),t=On(i,t),r){case 0:e=Bu(null,e,i,t,n);break e;case 1:e=rp(null,e,i,t,n);break e;case 11:e=np(null,e,i,t,n);break e;case 14:e=ip(null,e,i,On(i.type,t),n);break e}throw Error(oe(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:On(i,r),Bu(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:On(i,r),rp(t,e,i,r,n);case 3:e:{if(cx(e),t===null)throw Error(oe(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Ug(t,e),Sl(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Rs(Error(oe(423)),e),e=sp(t,e,i,n,r);break e}else if(i!==r){r=Rs(Error(oe(424)),e),e=sp(t,e,i,n,r);break e}else for(mn=qi(e.stateNode.containerInfo.firstChild),gn=e,mt=!0,zn=null,n=Ig(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ts(),i===r){e=bi(t,e,n);break e}$t(t,e,i,n)}e=e.child}return e;case 5:return Og(e),t===null&&ku(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,Nu(i,r)?a=null:s!==null&&Nu(i,s)&&(e.flags|=32),lx(t,e),$t(t,e,a,n),e.child;case 6:return t===null&&ku(e),null;case 13:return ux(t,e,n);case 4:return Mf(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=As(e,null,i,n):$t(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:On(i,r),np(t,e,i,r,n);case 7:return $t(t,e,e.pendingProps,n),e.child;case 8:return $t(t,e,e.pendingProps.children,n),e.child;case 12:return $t(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,ut(_l,i._currentValue),i._currentValue=a,s!==null)if(Wn(s.value,a)){if(s.children===r.children&&!rn.current){e=bi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var c=o.firstContext;c!==null;){if(c.context===i){if(s.tag===1){c=yi(-1,n&-n),c.tag=2;var d=s.updateQueue;if(d!==null){d=d.shared;var h=d.pending;h===null?c.next=c:(c.next=h.next,h.next=c),d.pending=c}}s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),Uu(s.return,n,e),o.lanes|=n;break}c=c.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(oe(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),Uu(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}$t(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,_s(e,n),r=Rn(r),i=i(r),e.flags|=1,$t(t,e,i,n),e.child;case 14:return i=e.type,r=On(i,e.pendingProps),r=On(i.type,r),ip(t,e,i,r,n);case 15:return ax(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:On(i,r),Yo(t,e),e.tag=1,sn(i)?(t=!0,gl(e)):t=!1,_s(e,n),ix(e,i,r),Fu(e,i,r,n),ju(null,e,i,!0,t,n);case 19:return dx(t,e,n);case 22:return ox(t,e,n)}throw Error(oe(156,e.tag))};function Ax(t,e){return eg(t,e)}function Zy(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Tn(t,e,n,i){return new Zy(t,e,n,i)}function Of(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Qy(t){if(typeof t=="function")return Of(t)?1:0;if(t!=null){if(t=t.$$typeof,t===tf)return 11;if(t===nf)return 14}return 2}function Qi(t,e){var n=t.alternate;return n===null?(n=Tn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Qo(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")Of(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case is:return Cr(n.children,r,s,e);case ef:a=8,r|=8;break;case lu:return t=Tn(12,n,e,r|2),t.elementType=lu,t.lanes=s,t;case cu:return t=Tn(13,n,e,r),t.elementType=cu,t.lanes=s,t;case uu:return t=Tn(19,n,e,r),t.elementType=uu,t.lanes=s,t;case Om:return Wl(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case km:a=10;break e;case Um:a=9;break e;case tf:a=11;break e;case nf:a=14;break e;case Fi:a=16,i=null;break e}throw Error(oe(130,t==null?t:typeof t,""))}return e=Tn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Cr(t,e,n,i){return t=Tn(7,t,i,e),t.lanes=n,t}function Wl(t,e,n,i){return t=Tn(22,t,i,e),t.elementType=Om,t.lanes=n,t.stateNode={isHidden:!1},t}function Ac(t,e,n){return t=Tn(6,t,null,e),t.lanes=n,t}function Cc(t,e,n){return e=Tn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function Jy(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=lc(0),this.expirationTimes=lc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=lc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Ff(t,e,n,i,r,s,a,o,c){return t=new Jy(t,e,n,o,c),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Tn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Sf(s),t}function eS(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ns,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function Cx(t){if(!t)return nr;t=t._reactInternals;e:{if(Or(t)!==t||t.tag!==1)throw Error(oe(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(sn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(oe(171))}if(t.tag===1){var n=t.type;if(sn(n))return Cg(t,n,e)}return e}function Rx(t,e,n,i,r,s,a,o,c){return t=Ff(n,i,!0,t,r,s,a,o,c),t.context=Cx(null),n=t.current,i=qt(),r=Zi(n),s=yi(i,r),s.callback=e??null,Yi(n,s,r),t.current.lanes=r,Ba(t,r,i),an(t,i),t}function Xl(t,e,n,i){var r=e.current,s=qt(),a=Zi(r);return n=Cx(n),e.context===null?e.context=n:e.pendingContext=n,e=yi(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Yi(r,e,a),t!==null&&(Hn(t,r,a,s),Xo(t,r,a)),a}function Rl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function mp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function zf(t,e){mp(t,e),(t=t.alternate)&&mp(t,e)}function tS(){return null}var Nx=typeof reportError=="function"?reportError:function(t){console.error(t)};function Bf(t){this._internalRoot=t}$l.prototype.render=Bf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(oe(409));Xl(t,e,null,null)};$l.prototype.unmount=Bf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Lr(function(){Xl(null,t,null,null)}),e[wi]=null}};function $l(t){this._internalRoot=t}$l.prototype.unstable_scheduleHydration=function(t){if(t){var e=og();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Bi.length&&e!==0&&e<Bi[n].priority;n++);Bi.splice(n,0,t),n===0&&cg(t)}};function jf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function ql(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function gp(){}function nS(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var d=Rl(a);s.call(d)}}var a=Rx(e,i,t,0,null,!1,!1,"",gp);return t._reactRootContainer=a,t[wi]=a.current,Ra(t.nodeType===8?t.parentNode:t),Lr(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var d=Rl(c);o.call(d)}}var c=Ff(t,0,!1,null,null,!1,!1,"",gp);return t._reactRootContainer=c,t[wi]=c.current,Ra(t.nodeType===8?t.parentNode:t),Lr(function(){Xl(e,c,n,i)}),c}function Yl(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var c=Rl(a);o.call(c)}}Xl(e,a,t,r)}else a=nS(n,e,t,r,i);return Rl(a)}sg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=aa(e.pendingLanes);n!==0&&(af(e,n|1),an(e,wt()),!(Je&6)&&(Ns=wt()+500,or()))}break;case 13:Lr(function(){var i=Ei(t,1);if(i!==null){var r=qt();Hn(i,t,1,r)}}),zf(t,1)}};of=function(t){if(t.tag===13){var e=Ei(t,134217728);if(e!==null){var n=qt();Hn(e,t,134217728,n)}zf(t,134217728)}};ag=function(t){if(t.tag===13){var e=Zi(t),n=Ei(t,e);if(n!==null){var i=qt();Hn(n,t,e,i)}zf(t,e)}};og=function(){return rt};lg=function(t,e){var n=rt;try{return rt=t,e()}finally{rt=n}};yu=function(t,e,n){switch(e){case"input":if(hu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=zl(i);if(!r)throw Error(oe(90));zm(i),hu(i,r)}}}break;case"textarea":jm(t,n);break;case"select":e=n.value,e!=null&&ms(t,!!n.multiple,e,!1)}};qm=If;Ym=Lr;var iS={usingClientEntryPoint:!1,Events:[Va,os,zl,Xm,$m,If]},Qs={findFiberByHostInstance:Mr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},rS={bundleType:Qs.bundleType,version:Qs.version,rendererPackageName:Qs.rendererPackageName,rendererConfig:Qs.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ci.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Qm(t),t===null?null:t.stateNode},findFiberByHostInstance:Qs.findFiberByHostInstance||tS,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var xo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!xo.isDisabled&&xo.supportsFiber)try{kl=xo.inject(rS),ti=xo}catch{}}vn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=iS;vn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!jf(e))throw Error(oe(200));return eS(t,e,null,n)};vn.createRoot=function(t,e){if(!jf(t))throw Error(oe(299));var n=!1,i="",r=Nx;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Ff(t,1,!1,null,null,n,!1,i,r),t[wi]=e.current,Ra(t.nodeType===8?t.parentNode:t),new Bf(e)};vn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(oe(188)):(t=Object.keys(t).join(","),Error(oe(268,t)));return t=Qm(e),t=t===null?null:t.stateNode,t};vn.flushSync=function(t){return Lr(t)};vn.hydrate=function(t,e,n){if(!ql(e))throw Error(oe(200));return Yl(null,t,e,!0,n)};vn.hydrateRoot=function(t,e,n){if(!jf(t))throw Error(oe(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=Nx;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=Rx(e,null,t,1,n??null,r,!1,s,a),t[wi]=e.current,Ra(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new $l(e)};vn.render=function(t,e,n){if(!ql(e))throw Error(oe(200));return Yl(null,t,e,!1,n)};vn.unmountComponentAtNode=function(t){if(!ql(t))throw Error(oe(40));return t._reactRootContainer?(Lr(function(){Yl(null,null,t,!1,function(){t._reactRootContainer=null,t[wi]=null})}),!0):!1};vn.unstable_batchedUpdates=If;vn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!ql(n))throw Error(oe(200));if(t==null||t._reactInternals===void 0)throw Error(oe(38));return Yl(t,e,n,!1,i)};vn.version="18.3.1-next-f1338f8080-20240426";function Px(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Px)}catch(t){console.error(t)}}Px(),Pm.exports=vn;var sS=Pm.exports,xp=sS;au.createRoot=xp.createRoot,au.hydrateRoot=xp.hydrateRoot;const aS="";async function ze(t,e={}){const n=`${aS}${t}`,i=await fetch(n,{headers:{"Content-Type":"application/json",...e.headers},...e});if(!i.ok){let r=`Request failed: ${i.statusText}`;try{const s=await i.json();r=s.detail||s.message||r}catch{}throw new Error(r)}return i.json()}const ke={async getMe(){return ze("/api/me")},async getHomeView(){return ze("/api/v1/home")},async getCommitments(t){const e=t?`?status=${encodeURIComponent(t)}`:"";return ze(`/api/v1/commitments${e}`)},async createCommitment(t){return ze("/api/v1/commitments",{method:"POST",body:JSON.stringify(t)})},async getTasks(t){const e=t?`?status=${encodeURIComponent(t)}`:"";return ze(`/api/v1/tasks${e}`)},async createTask(t,e={}){return ze("/api/v1/tasks",{method:"POST",body:JSON.stringify({title:t,...e})})},async completeTask(t,e){return ze(`/api/v1/tasks/${t}/complete`,{method:"POST",body:JSON.stringify({receipt:e||{}})})},async getPlan(t){const e=t?`?plan_date=${encodeURIComponent(t)}`:"";return ze(`/api/v1/plan${e}`)},async generatePlan(t){const e=t?`?plan_date=${encodeURIComponent(t)}`:"";return ze(`/api/v1/plan/generate${e}`,{method:"POST"})},async getV1Approvals(){return ze("/api/v1/approvals")},async approveV1(t,e){return ze(`/api/v1/approvals/${t}/approve`,{method:"POST",body:JSON.stringify({arguments:e})})},async rejectV1(t,e=""){return ze(`/api/v1/approvals/${t}/reject`,{method:"POST",body:JSON.stringify({reason:e})})},async getPendingActions(){return ze("/api/actions/pending")},async approveAction(t){return ze(`/api/actions/${t}/approve`,{method:"POST"})},async rejectAction(t){return ze(`/api/actions/${t}/reject`,{method:"POST"})},async getAgents(){return ze("/api/v1/agents")},async dispatchAgent(t,e,n={}){return ze("/api/v1/agents/dispatch",{method:"POST",body:JSON.stringify({agent_type:t,instruction:e,parameters:n})})},async getActivity(t=50){return ze(`/api/v1/activity?limit=${t}`)},async getConnectors(){return ze("/api/connectors")},async getConnector(t){return ze(`/api/connectors/${t}`)},async grantConnector(t,e){return ze(`/api/connectors/${t}/grant`,{method:"POST",body:JSON.stringify({scopes:e||[]})})},async denyConnector(t){return ze(`/api/connectors/${t}/deny`,{method:"POST"})},async revokeConnector(t){return ze(`/api/connectors/${t}/revoke`,{method:"POST"})},async saveConnectorCredentials(t,e,n){return ze(`/api/connectors/${t}/credentials`,{method:"POST",body:JSON.stringify({label:e,fields:n})})},async startConnectorOAuth(t){return ze(`/api/connectors/${t}/oauth/start`)},async testConnector(t){return ze(`/api/connectors/${t}/test`,{method:"POST"})},async getConnectorSettings(t){return ze(`/api/connectors/${t}/settings`)},async saveConnectorSettings(t,e){return ze(`/api/connectors/${t}/settings`,{method:"POST",body:JSON.stringify({settings:e})})},async getMemory(){return ze("/api/memory")},async forgetMemory(t){return ze(`/api/memory/${encodeURIComponent(t)}`,{method:"DELETE"})},async getWatchers(){return ze("/api/watchers")},async markWatcherSeen(t){return ze(`/api/watchers/${t}/seen`,{method:"POST"})},async getAnalytics(){return ze("/api/analytics")},async getHudState(){return ze("/api/hud/state")},async sendHudCommand(t,e,n,i){return ze("/api/hud/command",{method:"POST",body:JSON.stringify({query:t,dot:e,action_type:n,action_payload:i})})},async resolveHudApproval(t,e){return ze("/api/hud/approval",{method:"POST",body:JSON.stringify({approval_id:t,decision:e})})},async toggleHudTakeover(t){return ze("/api/hud/computer/takeover",{method:"POST",body:JSON.stringify({take_control:t})})},async saveHudSpacePage(t,e,n,i,r="Sai",s){return ze("/api/hud/spaces/save",{method:"POST",body:JSON.stringify({space_id:t,page_id:e,title:n,markdown:i,author:r,expected_revision:s})})},async optimizeHudTraces(){return ze("/api/hud/optimize",{method:"POST"})},async draftLinkedInPost(t,e=[]){return ze("/api/hud/social/linkedin/draft",{method:"POST",body:JSON.stringify({topic:t,highlights:e})})},async publishLinkedInPost(t,e){return ze("/api/hud/social/linkedin/publish",{method:"POST",body:JSON.stringify({post_text:t,token:e})})},async summarizeYouTubeVideo(t,e=""){return ze("/api/hud/social/youtube/summarize",{method:"POST",body:JSON.stringify({video_url:t,title:e})})},async speakHudVoice(t){return ze("/api/hud/voice/speak",{method:"POST",body:JSON.stringify({text:t})})}},Dx=W.createContext(void 0),oS=({children:t})=>{const[e,n]=W.useState("home"),[i,r]=W.useState("dark"),[s,a]=W.useState(null),[o,c]=W.useState("IDLE"),[d,h]=W.useState(0),[p,f]=W.useState(0),[m,x]=W.useState([]),[_,g]=W.useState(!1);W.useEffect(()=>{const E=localStorage.getItem("os-theme")||"dark";r(E),document.documentElement.setAttribute("data-theme",E)},[]);const u=W.useCallback(A=>{r(A),localStorage.setItem("os-theme",A),document.documentElement.setAttribute("data-theme",A)},[]),v=W.useCallback(()=>{u(i==="dark"?"light":"dark")},[i,u]),y=W.useCallback(A=>{const E=Math.random().toString(36).substring(2,9),R={...A,id:E,timestamp:Date.now()};x(T=>[R,...T.slice(0,4)]),setTimeout(()=>{S(E)},5e3)},[]),S=W.useCallback(A=>{x(E=>E.filter(R=>R.id!==A))},[]),N=W.useCallback(async()=>{var A,E,R,T;try{const[M,P,X,F]=await Promise.allSettled([ke.getMe(),ke.getV1Approvals(),ke.getPendingActions(),ke.getAgents()]);M.status==="fulfilled"&&a(M.value);let K=0;if(P.status==="fulfilled"&&(K+=((A=P.value.pending_approvals)==null?void 0:A.length)||0),X.status==="fulfilled"&&(K+=((E=X.value.pending)==null?void 0:E.length)||0),h(K),F.status==="fulfilled"){const $=((T=(R=F.value.agent_runs)==null?void 0:R.filter(q=>q.status==="running"))==null?void 0:T.length)||0;f($),$>0&&o==="IDLE"&&c("WORKING")}}catch(M){console.error("Failed to refresh app status:",M)}},[o]);return W.useEffect(()=>{N();const A=setInterval(N,1e4);return()=>clearInterval(A)},[N]),W.useEffect(()=>{const A=E=>{(E.ctrlKey||E.metaKey)&&E.key==="k"&&(E.preventDefault(),g(R=>!R))};return window.addEventListener("keydown",A),()=>window.removeEventListener("keydown",A)},[]),l.jsx(Dx.Provider,{value:{currentView:e,setCurrentView:n,theme:i,setTheme:u,toggleTheme:v,me:s,orbState:o,setOrbState:c,pendingApprovalsCount:d,activeAgentsCount:p,refreshData:N,notifications:m,addNotification:y,removeNotification:S,isCommandPaletteOpen:_,setIsCommandPaletteOpen:g},children:t})},un=()=>{const t=W.useContext(Dx);if(!t)throw new Error("useApp must be used within an AppProvider");return t},Lx=W.createContext(void 0),lS=({children:t})=>{const{setOrbState:e}=un(),[n,i]=W.useState(!1),[r,s]=W.useState(!1),a=W.useRef(null),o=W.useCallback(()=>{if(i(!0),e("LISTENING"),"webkitSpeechRecognition"in window||"SpeechRecognition"in window){const p=window.SpeechRecognition||window.webkitSpeechRecognition;try{const f=new p;f.continuous=!0,f.interimResults=!0,f.onstart=()=>{e("LISTENING")},f.onresult=()=>{e("THINKING")},f.onerror=()=>{e("IDLE")},f.onend=()=>{n&&e("IDLE")},a.current=f,f.start()}catch(f){console.warn("SpeechRecognition error:",f)}}},[n,e]),c=W.useCallback(()=>{if(i(!1),e("IDLE"),a.current)try{a.current.stop()}catch{}},[e]),d=W.useCallback(()=>{n?c():o()},[n,o,c]),h=W.useCallback(()=>{s(p=>!p)},[]);return l.jsx(Lx.Provider,{value:{isVoiceActive:n,toggleVoice:d,startListening:o,stopListening:c,isMuted:r,toggleMute:h},children:t})},Ix=()=>{const t=W.useContext(Lx);if(!t)throw new Error("useVoice must be used within a VoiceProvider");return t};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cS=t=>t==null?void 0:t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function uS(t,e,n=[]){if(e==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:cS(t),size:24,node:e,...n.length>0?{aliases:n}:{}}}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dS=t=>{let e="",n=!1;for(const i of t){if(i==="-"||i==="_"||i<=" "){n=e.length>0;continue}e.length===0?e+=i.toLowerCase():e+=n?i.toUpperCase():i,n=!1}return e};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fS=t=>{const e=dS(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ju=(...t)=>t.filter((e,n,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function Rc(t){return t!=null}function hS(t,e={}){var f,m;const n=e.attributeNames??{},i=x=>n[x]??x,r=t.size??t.width??cr.width,s=t.size??t.height??cr.height,a=((f=t.aliases)==null?void 0:f.filter(x=>typeof x=="string"&&x.trim()!=="").map(x=>`lucide-${x}`))??[],o=[...t.name?[`lucide-${t.name}`]:[],...a],c=((m=e.className)==null?void 0:m.split(" ").filter(Boolean))??[],d=e.includeDefaultClasses===!1?Ju(...c):Ju("lucide",...o,...c),h=e.absoluteStrokeWidth?Number(e.strokeWidth??cr["stroke-width"])*Number(t.size??t.width??cr.width)/Number(e.size??e.width??cr.width):e.strokeWidth??cr["stroke-width"];return["svg",{...Object.entries(cr).reduce((x,[_,g])=>(x[i(_)]=g,x),{}),..."color"in e&&e.color&&{[i("stroke")]:e.color},..."size"in e&&Rc(e.size)&&{[i("width")]:e.size,[i("height")]:e.size},..."width"in e&&Rc(e.width)&&{[i("width")]:e.width},..."height"in e&&Rc(e.height)&&{[i("height")]:e.height},[i("stroke-width")]:h,...d&&{[i("class")]:d},[i("viewBox")]:`0 0 ${r} ${s}`,...e.hasA11yProp===!1?{[i("aria-hidden")]:"true"}:{},..."attributes"in e&&e.attributes},t.node.map(x=>{const[_,g,u]=x,v=e.nonScalingStroke?{[i("vector-effect")]:"non-scaling-stroke",...g}:g;return u?[_,v,u]:[_,v]})]}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function pS(t,e={}){return hS(t,{...e,attributeNames:{...e.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mS=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},gS=W.createContext({}),xS=()=>W.useContext(gS),vS=W.forwardRef(({color:t,size:e,width:n,height:i,strokeWidth:r,absoluteStrokeWidth:s,nonScalingStroke:a,className:o="",children:c,iconNode:d=[],icon:h={node:d,aliases:[],size:24},...p},f)=>{const{size:m=24,strokeWidth:x=2,absoluteStrokeWidth:_=!1,nonScalingStroke:g=!1,color:u="currentColor",className:v=""}=xS()??{},y=!!c||mS(p),[S,N,A=[]]=pS(h,{color:t??u,width:n??e??m,height:i??e??m,strokeWidth:r??x,absoluteStrokeWidth:s??_,nonScalingStroke:a??g,className:Ju(v,o),hasA11yProp:y,attributes:p});return W.createElement(S,{ref:f,...N},[...A.map(([E,R])=>W.createElement(E,R)),...Array.isArray(c)?c:[c]])});/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function Le(t,e=[],n=[]){const i=typeof t=="string"?uS(t,e,n):t,r=W.forwardRef(({className:s,...a},o)=>W.createElement(vS,{ref:o,icon:i,className:s,...a}));return i.name&&(r.displayName=fS(i.name)),r}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kx={name:"arrow-right",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]};kx.node;const Vf=Le(kx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ux={name:"bot",size:24,node:[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]};Ux.node;const Ox=Le(Ux);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fx={name:"brain",size:24,node:[["path",{d:"M12 18V5",key:"adv99a"}],["path",{d:"M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",key:"1e3is1"}],["path",{d:"M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",key:"1gqd8o"}],["path",{d:"M17.997 5.125a4 4 0 0 1 2.526 5.77",key:"iwvgf7"}],["path",{d:"M18 18a4 4 0 0 0 2-7.464",key:"efp6ie"}],["path",{d:"M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",key:"1gq6am"}],["path",{d:"M6 18a4 4 0 0 1-2-7.464",key:"k1g0md"}],["path",{d:"M6.003 5.125a4 4 0 0 0-2.526 5.77",key:"q97ue3"}]]};Fx.node;const zx=Le(Fx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bx={name:"calendar",size:24,node:[["path",{d:"M8 2v3",key:"1ioesn"}],["path",{d:"M16 2v3",key:"otl347"}],["rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",key:"h1oib"}],["path",{d:"M3 9h18",key:"1pudct"}]]};Bx.node;const Fr=Le(Bx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jx={name:"check",size:24,node:[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]};jx.node;const _S=Le(jx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vx={name:"chevron-down",size:24,node:[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]};Vx.node;const Hx=Le(Vx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gx={name:"chevron-right",size:24,node:[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]};Gx.node;const ya=Le(Gx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wx={name:"circle-alert",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],aliases:["alert-circle"]};Wx.node;const yS=Le(Wx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xx={name:"circle-check",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 9-5.5 5.5L8 12",key:"xofnsj"}]],aliases:["check-circle-2"]};Xx.node;const nn=Le(Xx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $x={name:"circle-question-mark",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],aliases:["help-circle","circle-help"]};$x.node;const SS=Le($x);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qx={name:"circle-x",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],aliases:["x-circle"]};qx.node;const ed=Le(qx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yx={name:"clock",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]]};Yx.node;const Ga=Le(Yx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kx={name:"code",size:24,node:[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]]};Kx.node;const Zx=Le(Kx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qx={name:"copy",size:24,node:[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]};Qx.node;const MS=Le(Qx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jx={name:"cpu",size:24,node:[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]]};Jx.node;const Hf=Le(Jx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const e0={name:"database",size:24,node:[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]};e0.node;const wS=Le(e0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const t0={name:"external-link",size:24,node:[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]};t0.node;const n0=Le(t0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i0={name:"eye-off",size:24,node:[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]};i0.node;const ES=Le(i0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r0={name:"eye",size:24,node:[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]};r0.node;const bS=Le(r0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s0={name:"globe",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]};s0.node;const td=Le(s0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a0={name:"house",size:24,node:[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],aliases:["home"]};a0.node;const o0=Le(a0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l0={name:"info",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]};l0.node;const TS=Le(l0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c0={name:"key-round",size:24,node:[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]]};c0.node;const AS=Le(c0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u0={name:"layers",size:24,node:[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],aliases:["layers-3"]};u0.node;const d0=Le(u0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f0={name:"link-2",size:24,node:[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]};f0.node;const h0=Le(f0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p0={name:"lock",size:24,node:[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]};p0.node;const Nl=Le(p0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m0={name:"mail",size:24,node:[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]};m0.node;const CS=Le(m0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g0={name:"mic-off",size:24,node:[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M15 9.34V5a3 3 0 0 0-5.68-1.33",key:"1gzdoj"}],["path",{d:"M16.95 16.95A7 7 0 0 1 5 12v-2",key:"cqa7eg"}],["path",{d:"M18.89 13.23A7 7 0 0 0 19 12v-2",key:"16hl24"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M9 9v3a3 3 0 0 0 5.12 2.12",key:"r2i35w"}]]};g0.node;const x0=Le(g0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v0={name:"mic",size:24,node:[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]]};v0.node;const _0=Le(v0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y0={name:"moon",size:24,node:[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]]};y0.node;const RS=Le(y0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S0={name:"octagon-alert",size:24,node:[["path",{d:"M12 16h.01",key:"1drbdi"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",key:"1fd625"}]],aliases:["alert-octagon"]};S0.node;const NS=Le(S0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M0={name:"pause",size:24,node:[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]]};M0.node;const PS=Le(M0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w0={name:"play",size:24,node:[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]};w0.node;const E0=Le(w0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b0={name:"plus",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]};b0.node;const T0=Le(b0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A0={name:"refresh-cw",size:24,node:[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]};A0.node;const Xn=Le(A0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C0={name:"search",size:24,node:[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]};C0.node;const zr=Le(C0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R0={name:"send",size:24,node:[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]};R0.node;const N0=Le(R0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P0={name:"shield-alert",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]};P0.node;const Kl=Le(P0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D0={name:"shield-check",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]};D0.node;const L0=Le(D0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I0={name:"shield",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]};I0.node;const DS=Le(I0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k0={name:"sliders-vertical",size:24,node:[["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M12 21v-9",key:"17s77i"}],["path",{d:"M12 8V3",key:"13r4qs"}],["path",{d:"M17 16h4",key:"h1uq16"}],["path",{d:"M19 12V3",key:"o1uvq1"}],["path",{d:"M19 21v-5",key:"qua636"}],["path",{d:"M3 14h4",key:"bcjad9"}],["path",{d:"M5 10V3",key:"cb8scm"}],["path",{d:"M5 21v-7",key:"1w1uti"}]],aliases:["sliders"]};k0.node;const LS=Le(k0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U0={name:"sparkles",size:24,node:[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],aliases:["stars"]};U0.node;const Qn=Le(U0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O0={name:"square-check-big",size:24,node:[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],aliases:["check-square"]};O0.node;const F0=Le(O0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z0={name:"square",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]};z0.node;const IS=Le(z0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B0={name:"sun",size:24,node:[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]};B0.node;const kS=Le(B0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j0={name:"terminal",size:24,node:[["path",{d:"M12 19h8",key:"baeox8"}],["path",{d:"m4 17 6-6-6-6",key:"1yngyt"}]]};j0.node;const US=Le(j0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V0={name:"trash",size:24,node:[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],aliases:["trash-2"]};V0.node;const Jo=Le(V0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H0={name:"triangle-alert",size:24,node:[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],aliases:["alert-triangle"]};H0.node;const nd=Le(H0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G0={name:"volume-2",size:24,node:[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]};G0.node;const OS=Le(G0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W0={name:"x",size:24,node:[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]};W0.node;const Gf=Le(W0);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X0={name:"zap",size:24,node:[["path",{d:"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",key:"1v7up4"}]]};X0.node;const vp=Le(X0);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Wf="170",FS=0,_p=1,zS=2,$0=1,BS=2,fi=3,ir=0,on=1,mi=2,Ji=0,Ss=1,id=2,yp=3,Sp=4,jS=5,yr=100,VS=101,HS=102,GS=103,WS=104,XS=200,$S=201,qS=202,YS=203,rd=204,sd=205,KS=206,ZS=207,QS=208,JS=209,e1=210,t1=211,n1=212,i1=213,r1=214,ad=0,od=1,ld=2,Ps=3,cd=4,ud=5,dd=6,fd=7,q0=0,s1=1,a1=2,er=0,o1=1,l1=2,c1=3,u1=4,d1=5,f1=6,h1=7,Y0=300,Ds=301,Ls=302,hd=303,pd=304,Zl=306,md=1e3,br=1001,gd=1002,Gn=1003,p1=1004,vo=1005,Jn=1006,Nc=1007,Tr=1008,Ti=1009,K0=1010,Z0=1011,Fa=1012,Xf=1013,Ir=1014,vi=1015,Wa=1016,$f=1017,qf=1018,Is=1020,Q0=35902,J0=1021,ev=1022,jn=1023,tv=1024,nv=1025,Ms=1026,ks=1027,iv=1028,Yf=1029,rv=1030,Kf=1031,Zf=1033,el=33776,tl=33777,nl=33778,il=33779,xd=35840,vd=35841,_d=35842,yd=35843,Sd=36196,Md=37492,wd=37496,Ed=37808,bd=37809,Td=37810,Ad=37811,Cd=37812,Rd=37813,Nd=37814,Pd=37815,Dd=37816,Ld=37817,Id=37818,kd=37819,Ud=37820,Od=37821,rl=36492,Fd=36494,zd=36495,sv=36283,Bd=36284,jd=36285,Vd=36286,m1=3200,g1=3201,x1=0,v1=1,Vi="",Mn="srgb",Bs="srgb-linear",Ql="linear",at="srgb",Vr=7680,Mp=519,_1=512,y1=513,S1=514,av=515,M1=516,w1=517,E1=518,b1=519,wp=35044,Ep="300 es",_i=2e3,Pl=2001;class js{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Pc=Math.PI/180,Hd=180/Math.PI;function Xa(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Vt[t&255]+Vt[t>>8&255]+Vt[t>>16&255]+Vt[t>>24&255]+"-"+Vt[e&255]+Vt[e>>8&255]+"-"+Vt[e>>16&15|64]+Vt[e>>24&255]+"-"+Vt[n&63|128]+Vt[n>>8&255]+"-"+Vt[n>>16&255]+Vt[n>>24&255]+Vt[i&255]+Vt[i>>8&255]+Vt[i>>16&255]+Vt[i>>24&255]).toLowerCase()}function en(t,e,n){return Math.max(e,Math.min(n,t))}function T1(t,e){return(t%e+e)%e}function Dc(t,e,n){return(1-n)*t+n*e}function Js(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function Qt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}class ot{constructor(e=0,n=0){ot.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(en(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ve{constructor(e,n,i,r,s,a,o,c,d){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,c,d)}set(e,n,i,r,s,a,o,c,d){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=n,h[4]=s,h[5]=c,h[6]=i,h[7]=a,h[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],c=i[6],d=i[1],h=i[4],p=i[7],f=i[2],m=i[5],x=i[8],_=r[0],g=r[3],u=r[6],v=r[1],y=r[4],S=r[7],N=r[2],A=r[5],E=r[8];return s[0]=a*_+o*v+c*N,s[3]=a*g+o*y+c*A,s[6]=a*u+o*S+c*E,s[1]=d*_+h*v+p*N,s[4]=d*g+h*y+p*A,s[7]=d*u+h*S+p*E,s[2]=f*_+m*v+x*N,s[5]=f*g+m*y+x*A,s[8]=f*u+m*S+x*E,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],d=e[7],h=e[8];return n*a*h-n*o*d-i*s*h+i*o*c+r*s*d-r*a*c}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],d=e[7],h=e[8],p=h*a-o*d,f=o*c-h*s,m=d*s-a*c,x=n*p+i*f+r*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=p*_,e[1]=(r*d-h*i)*_,e[2]=(o*i-r*a)*_,e[3]=f*_,e[4]=(h*n-r*c)*_,e[5]=(r*s-o*n)*_,e[6]=m*_,e[7]=(i*c-d*n)*_,e[8]=(a*n-i*s)*_,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const c=Math.cos(s),d=Math.sin(s);return this.set(i*c,i*d,-i*(c*a+d*o)+a+e,-r*d,r*c,-r*(-d*a+c*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(Lc.makeScale(e,n)),this}rotate(e){return this.premultiply(Lc.makeRotation(-e)),this}translate(e,n){return this.premultiply(Lc.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Lc=new Ve;function ov(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Dl(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function A1(){const t=Dl("canvas");return t.style.display="block",t}const bp={};function la(t){t in bp||(bp[t]=!0,console.warn(t))}function C1(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function R1(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function N1(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Qe={enabled:!0,workingColorSpace:Bs,spaces:{},convert:function(t,e,n){return this.enabled===!1||e===n||!e||!n||(this.spaces[e].transfer===at&&(t.r=Si(t.r),t.g=Si(t.g),t.b=Si(t.b)),this.spaces[e].primaries!==this.spaces[n].primaries&&(t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===at&&(t.r=ws(t.r),t.g=ws(t.g),t.b=ws(t.b))),t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===Vi?Ql:this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function Si(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function ws(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const Tp=[.64,.33,.3,.6,.15,.06],Ap=[.2126,.7152,.0722],Cp=[.3127,.329],Rp=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Np=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Qe.define({[Bs]:{primaries:Tp,whitePoint:Cp,transfer:Ql,toXYZ:Rp,fromXYZ:Np,luminanceCoefficients:Ap,workingColorSpaceConfig:{unpackColorSpace:Mn},outputColorSpaceConfig:{drawingBufferColorSpace:Mn}},[Mn]:{primaries:Tp,whitePoint:Cp,transfer:at,toXYZ:Rp,fromXYZ:Np,luminanceCoefficients:Ap,outputColorSpaceConfig:{drawingBufferColorSpace:Mn}}});let Hr;class P1{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Hr===void 0&&(Hr=Dl("canvas")),Hr.width=e.width,Hr.height=e.height;const i=Hr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Hr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Dl("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Si(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Si(n[i]/255)*255):n[i]=Si(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let D1=0;class lv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:D1++}),this.uuid=Xa(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Ic(r[a].image)):s.push(Ic(r[a]))}else s=Ic(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Ic(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?P1.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let L1=0;class ln extends js{constructor(e=ln.DEFAULT_IMAGE,n=ln.DEFAULT_MAPPING,i=br,r=br,s=Jn,a=Tr,o=jn,c=Ti,d=ln.DEFAULT_ANISOTROPY,h=Vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:L1++}),this.uuid=Xa(),this.name="",this.source=new lv(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=d,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Y0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case md:e.x=e.x-Math.floor(e.x);break;case br:e.x=e.x<0?0:1;break;case gd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case md:e.y=e.y-Math.floor(e.y);break;case br:e.y=e.y<0?0:1;break;case gd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=Y0;ln.DEFAULT_ANISOTROPY=1;class Et{constructor(e=0,n=0,i=0,r=1){Et.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const c=e.elements,d=c[0],h=c[4],p=c[8],f=c[1],m=c[5],x=c[9],_=c[2],g=c[6],u=c[10];if(Math.abs(h-f)<.01&&Math.abs(p-_)<.01&&Math.abs(x-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(p+_)<.1&&Math.abs(x+g)<.1&&Math.abs(d+m+u-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const y=(d+1)/2,S=(m+1)/2,N=(u+1)/2,A=(h+f)/4,E=(p+_)/4,R=(x+g)/4;return y>S&&y>N?y<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(y),r=A/i,s=E/i):S>N?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=A/r,s=R/r):N<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(N),i=E/s,r=R/s),this.set(i,r,s,n),this}let v=Math.sqrt((g-x)*(g-x)+(p-_)*(p-_)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(g-x)/v,this.y=(p-_)/v,this.z=(f-h)/v,this.w=Math.acos((d+m+u-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class I1 extends js{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new Et(0,0,e,n),this.scissorTest=!1,this.viewport=new Et(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new ln(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new lv(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class kr extends I1{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class cv extends ln{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=br,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class k1 extends ln{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=br,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $a{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let c=i[r+0],d=i[r+1],h=i[r+2],p=i[r+3];const f=s[a+0],m=s[a+1],x=s[a+2],_=s[a+3];if(o===0){e[n+0]=c,e[n+1]=d,e[n+2]=h,e[n+3]=p;return}if(o===1){e[n+0]=f,e[n+1]=m,e[n+2]=x,e[n+3]=_;return}if(p!==_||c!==f||d!==m||h!==x){let g=1-o;const u=c*f+d*m+h*x+p*_,v=u>=0?1:-1,y=1-u*u;if(y>Number.EPSILON){const N=Math.sqrt(y),A=Math.atan2(N,u*v);g=Math.sin(g*A)/N,o=Math.sin(o*A)/N}const S=o*v;if(c=c*g+f*S,d=d*g+m*S,h=h*g+x*S,p=p*g+_*S,g===1-o){const N=1/Math.sqrt(c*c+d*d+h*h+p*p);c*=N,d*=N,h*=N,p*=N}}e[n]=c,e[n+1]=d,e[n+2]=h,e[n+3]=p}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],c=i[r+1],d=i[r+2],h=i[r+3],p=s[a],f=s[a+1],m=s[a+2],x=s[a+3];return e[n]=o*x+h*p+c*m-d*f,e[n+1]=c*x+h*f+d*p-o*m,e[n+2]=d*x+h*m+o*f-c*p,e[n+3]=h*x-o*p-c*f-d*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,d=o(i/2),h=o(r/2),p=o(s/2),f=c(i/2),m=c(r/2),x=c(s/2);switch(a){case"XYZ":this._x=f*h*p+d*m*x,this._y=d*m*p-f*h*x,this._z=d*h*x+f*m*p,this._w=d*h*p-f*m*x;break;case"YXZ":this._x=f*h*p+d*m*x,this._y=d*m*p-f*h*x,this._z=d*h*x-f*m*p,this._w=d*h*p+f*m*x;break;case"ZXY":this._x=f*h*p-d*m*x,this._y=d*m*p+f*h*x,this._z=d*h*x+f*m*p,this._w=d*h*p-f*m*x;break;case"ZYX":this._x=f*h*p-d*m*x,this._y=d*m*p+f*h*x,this._z=d*h*x-f*m*p,this._w=d*h*p+f*m*x;break;case"YZX":this._x=f*h*p+d*m*x,this._y=d*m*p+f*h*x,this._z=d*h*x-f*m*p,this._w=d*h*p-f*m*x;break;case"XZY":this._x=f*h*p-d*m*x,this._y=d*m*p-f*h*x,this._z=d*h*x+f*m*p,this._w=d*h*p+f*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],c=n[9],d=n[2],h=n[6],p=n[10],f=i+o+p;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-c)*m,this._y=(s-d)*m,this._z=(a-r)*m}else if(i>o&&i>p){const m=2*Math.sqrt(1+i-o-p);this._w=(h-c)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+d)/m}else if(o>p){const m=2*Math.sqrt(1+o-i-p);this._w=(s-d)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+p-i-o);this._w=(a-r)/m,this._x=(s+d)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(en(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,c=n._y,d=n._z,h=n._w;return this._x=i*h+a*o+r*d-s*c,this._y=r*h+a*c+s*o-i*d,this._z=s*h+a*d+i*c-r*o,this._w=a*h-i*o-r*c-s*d,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const m=1-n;return this._w=m*a+n*this._w,this._x=m*i+n*this._x,this._y=m*r+n*this._y,this._z=m*s+n*this._z,this.normalize(),this}const d=Math.sqrt(c),h=Math.atan2(d,o),p=Math.sin((1-n)*h)/d,f=Math.sin(n*h)/d;return this._w=a*p+this._w*f,this._x=i*p+this._x*f,this._y=r*p+this._y*f,this._z=s*p+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(e=0,n=0,i=0){H.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Pp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Pp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,d=2*(a*r-o*i),h=2*(o*n-s*r),p=2*(s*i-a*n);return this.x=n+c*d+a*p-o*h,this.y=i+c*h+o*d-s*p,this.z=r+c*p+s*h-a*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,c=n.z;return this.x=r*c-s*o,this.y=s*a-i*c,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return kc.copy(this).projectOnVector(e),this.sub(kc)}reflect(e){return this.sub(kc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(en(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const kc=new H,Pp=new $a;class qa{constructor(e=new H(1/0,1/0,1/0),n=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(In.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(In.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=In.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,In):In.fromBufferAttribute(s,a),In.applyMatrix4(e.matrixWorld),this.expandByPoint(In);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_o.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),_o.copy(i.boundingBox)),_o.applyMatrix4(e.matrixWorld),this.union(_o)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,In),In.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ea),yo.subVectors(this.max,ea),Gr.subVectors(e.a,ea),Wr.subVectors(e.b,ea),Xr.subVectors(e.c,ea),Di.subVectors(Wr,Gr),Li.subVectors(Xr,Wr),ur.subVectors(Gr,Xr);let n=[0,-Di.z,Di.y,0,-Li.z,Li.y,0,-ur.z,ur.y,Di.z,0,-Di.x,Li.z,0,-Li.x,ur.z,0,-ur.x,-Di.y,Di.x,0,-Li.y,Li.x,0,-ur.y,ur.x,0];return!Uc(n,Gr,Wr,Xr,yo)||(n=[1,0,0,0,1,0,0,0,1],!Uc(n,Gr,Wr,Xr,yo))?!1:(So.crossVectors(Di,Li),n=[So.x,So.y,So.z],Uc(n,Gr,Wr,Xr,yo))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,In).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(In).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const oi=[new H,new H,new H,new H,new H,new H,new H,new H],In=new H,_o=new qa,Gr=new H,Wr=new H,Xr=new H,Di=new H,Li=new H,ur=new H,ea=new H,yo=new H,So=new H,dr=new H;function Uc(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){dr.fromArray(t,s);const o=r.x*Math.abs(dr.x)+r.y*Math.abs(dr.y)+r.z*Math.abs(dr.z),c=e.dot(dr),d=n.dot(dr),h=i.dot(dr);if(Math.max(-Math.max(c,d,h),Math.min(c,d,h))>o)return!1}return!0}const U1=new qa,ta=new H,Oc=new H;class Jl{constructor(e=new H,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):U1.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ta.subVectors(e,this.center);const n=ta.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ta,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Oc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ta.copy(e.center).add(Oc)),this.expandByPoint(ta.copy(e.center).sub(Oc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const li=new H,Fc=new H,Mo=new H,Ii=new H,zc=new H,wo=new H,Bc=new H;class uv{constructor(e=new H,n=new H(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,li)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=li.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(li.copy(this.origin).addScaledVector(this.direction,n),li.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Fc.copy(e).add(n).multiplyScalar(.5),Mo.copy(n).sub(e).normalize(),Ii.copy(this.origin).sub(Fc);const s=e.distanceTo(n)*.5,a=-this.direction.dot(Mo),o=Ii.dot(this.direction),c=-Ii.dot(Mo),d=Ii.lengthSq(),h=Math.abs(1-a*a);let p,f,m,x;if(h>0)if(p=a*c-o,f=a*o-c,x=s*h,p>=0)if(f>=-x)if(f<=x){const _=1/h;p*=_,f*=_,m=p*(p+a*f+2*o)+f*(a*p+f+2*c)+d}else f=s,p=Math.max(0,-(a*f+o)),m=-p*p+f*(f+2*c)+d;else f=-s,p=Math.max(0,-(a*f+o)),m=-p*p+f*(f+2*c)+d;else f<=-x?(p=Math.max(0,-(-a*s+o)),f=p>0?-s:Math.min(Math.max(-s,-c),s),m=-p*p+f*(f+2*c)+d):f<=x?(p=0,f=Math.min(Math.max(-s,-c),s),m=f*(f+2*c)+d):(p=Math.max(0,-(a*s+o)),f=p>0?s:Math.min(Math.max(-s,-c),s),m=-p*p+f*(f+2*c)+d);else f=a>0?-s:s,p=Math.max(0,-(a*f+o)),m=-p*p+f*(f+2*c)+d;return i&&i.copy(this.origin).addScaledVector(this.direction,p),r&&r.copy(Fc).addScaledVector(Mo,f),m}intersectSphere(e,n){li.subVectors(e.center,this.origin);const i=li.dot(this.direction),r=li.dot(li)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,c;const d=1/this.direction.x,h=1/this.direction.y,p=1/this.direction.z,f=this.origin;return d>=0?(i=(e.min.x-f.x)*d,r=(e.max.x-f.x)*d):(i=(e.max.x-f.x)*d,r=(e.min.x-f.x)*d),h>=0?(s=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(s=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),p>=0?(o=(e.min.z-f.z)*p,c=(e.max.z-f.z)*p):(o=(e.max.z-f.z)*p,c=(e.min.z-f.z)*p),i>c||o>r)||((o>i||i!==i)&&(i=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,li)!==null}intersectTriangle(e,n,i,r,s){zc.subVectors(n,e),wo.subVectors(i,e),Bc.crossVectors(zc,wo);let a=this.direction.dot(Bc),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ii.subVectors(this.origin,e);const c=o*this.direction.dot(wo.crossVectors(Ii,wo));if(c<0)return null;const d=o*this.direction.dot(zc.cross(Ii));if(d<0||c+d>a)return null;const h=-o*Ii.dot(Bc);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class bt{constructor(e,n,i,r,s,a,o,c,d,h,p,f,m,x,_,g){bt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,c,d,h,p,f,m,x,_,g)}set(e,n,i,r,s,a,o,c,d,h,p,f,m,x,_,g){const u=this.elements;return u[0]=e,u[4]=n,u[8]=i,u[12]=r,u[1]=s,u[5]=a,u[9]=o,u[13]=c,u[2]=d,u[6]=h,u[10]=p,u[14]=f,u[3]=m,u[7]=x,u[11]=_,u[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new bt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/$r.setFromMatrixColumn(e,0).length(),s=1/$r.setFromMatrixColumn(e,1).length(),a=1/$r.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(r),d=Math.sin(r),h=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){const f=a*h,m=a*p,x=o*h,_=o*p;n[0]=c*h,n[4]=-c*p,n[8]=d,n[1]=m+x*d,n[5]=f-_*d,n[9]=-o*c,n[2]=_-f*d,n[6]=x+m*d,n[10]=a*c}else if(e.order==="YXZ"){const f=c*h,m=c*p,x=d*h,_=d*p;n[0]=f+_*o,n[4]=x*o-m,n[8]=a*d,n[1]=a*p,n[5]=a*h,n[9]=-o,n[2]=m*o-x,n[6]=_+f*o,n[10]=a*c}else if(e.order==="ZXY"){const f=c*h,m=c*p,x=d*h,_=d*p;n[0]=f-_*o,n[4]=-a*p,n[8]=x+m*o,n[1]=m+x*o,n[5]=a*h,n[9]=_-f*o,n[2]=-a*d,n[6]=o,n[10]=a*c}else if(e.order==="ZYX"){const f=a*h,m=a*p,x=o*h,_=o*p;n[0]=c*h,n[4]=x*d-m,n[8]=f*d+_,n[1]=c*p,n[5]=_*d+f,n[9]=m*d-x,n[2]=-d,n[6]=o*c,n[10]=a*c}else if(e.order==="YZX"){const f=a*c,m=a*d,x=o*c,_=o*d;n[0]=c*h,n[4]=_-f*p,n[8]=x*p+m,n[1]=p,n[5]=a*h,n[9]=-o*h,n[2]=-d*h,n[6]=m*p+x,n[10]=f-_*p}else if(e.order==="XZY"){const f=a*c,m=a*d,x=o*c,_=o*d;n[0]=c*h,n[4]=-p,n[8]=d*h,n[1]=f*p+_,n[5]=a*h,n[9]=m*p-x,n[2]=x*p-m,n[6]=o*h,n[10]=_*p+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(O1,e,F1)}lookAt(e,n,i){const r=this.elements;return fn.subVectors(e,n),fn.lengthSq()===0&&(fn.z=1),fn.normalize(),ki.crossVectors(i,fn),ki.lengthSq()===0&&(Math.abs(i.z)===1?fn.x+=1e-4:fn.z+=1e-4,fn.normalize(),ki.crossVectors(i,fn)),ki.normalize(),Eo.crossVectors(fn,ki),r[0]=ki.x,r[4]=Eo.x,r[8]=fn.x,r[1]=ki.y,r[5]=Eo.y,r[9]=fn.y,r[2]=ki.z,r[6]=Eo.z,r[10]=fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],c=i[8],d=i[12],h=i[1],p=i[5],f=i[9],m=i[13],x=i[2],_=i[6],g=i[10],u=i[14],v=i[3],y=i[7],S=i[11],N=i[15],A=r[0],E=r[4],R=r[8],T=r[12],M=r[1],P=r[5],X=r[9],F=r[13],K=r[2],$=r[6],q=r[10],Q=r[14],D=r[3],Z=r[7],ee=r[11],ue=r[15];return s[0]=a*A+o*M+c*K+d*D,s[4]=a*E+o*P+c*$+d*Z,s[8]=a*R+o*X+c*q+d*ee,s[12]=a*T+o*F+c*Q+d*ue,s[1]=h*A+p*M+f*K+m*D,s[5]=h*E+p*P+f*$+m*Z,s[9]=h*R+p*X+f*q+m*ee,s[13]=h*T+p*F+f*Q+m*ue,s[2]=x*A+_*M+g*K+u*D,s[6]=x*E+_*P+g*$+u*Z,s[10]=x*R+_*X+g*q+u*ee,s[14]=x*T+_*F+g*Q+u*ue,s[3]=v*A+y*M+S*K+N*D,s[7]=v*E+y*P+S*$+N*Z,s[11]=v*R+y*X+S*q+N*ee,s[15]=v*T+y*F+S*Q+N*ue,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],d=e[13],h=e[2],p=e[6],f=e[10],m=e[14],x=e[3],_=e[7],g=e[11],u=e[15];return x*(+s*c*p-r*d*p-s*o*f+i*d*f+r*o*m-i*c*m)+_*(+n*c*m-n*d*f+s*a*f-r*a*m+r*d*h-s*c*h)+g*(+n*d*p-n*o*m-s*a*p+i*a*m+s*o*h-i*d*h)+u*(-r*o*h-n*c*p+n*o*f+r*a*p-i*a*f+i*c*h)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],d=e[7],h=e[8],p=e[9],f=e[10],m=e[11],x=e[12],_=e[13],g=e[14],u=e[15],v=p*g*d-_*f*d+_*c*m-o*g*m-p*c*u+o*f*u,y=x*f*d-h*g*d-x*c*m+a*g*m+h*c*u-a*f*u,S=h*_*d-x*p*d+x*o*m-a*_*m-h*o*u+a*p*u,N=x*p*c-h*_*c-x*o*f+a*_*f+h*o*g-a*p*g,A=n*v+i*y+r*S+s*N;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/A;return e[0]=v*E,e[1]=(_*f*s-p*g*s-_*r*m+i*g*m+p*r*u-i*f*u)*E,e[2]=(o*g*s-_*c*s+_*r*d-i*g*d-o*r*u+i*c*u)*E,e[3]=(p*c*s-o*f*s-p*r*d+i*f*d+o*r*m-i*c*m)*E,e[4]=y*E,e[5]=(h*g*s-x*f*s+x*r*m-n*g*m-h*r*u+n*f*u)*E,e[6]=(x*c*s-a*g*s-x*r*d+n*g*d+a*r*u-n*c*u)*E,e[7]=(a*f*s-h*c*s+h*r*d-n*f*d-a*r*m+n*c*m)*E,e[8]=S*E,e[9]=(x*p*s-h*_*s-x*i*m+n*_*m+h*i*u-n*p*u)*E,e[10]=(a*_*s-x*o*s+x*i*d-n*_*d-a*i*u+n*o*u)*E,e[11]=(h*o*s-a*p*s-h*i*d+n*p*d+a*i*m-n*o*m)*E,e[12]=N*E,e[13]=(h*_*r-x*p*r+x*i*f-n*_*f-h*i*g+n*p*g)*E,e[14]=(x*o*r-a*_*r-x*i*c+n*_*c+a*i*g-n*o*g)*E,e[15]=(a*p*r-h*o*r+h*i*c-n*p*c-a*i*f+n*o*f)*E,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,c=e.z,d=s*a,h=s*o;return this.set(d*a+i,d*o-r*c,d*c+r*o,0,d*o+r*c,h*o+i,h*c-r*a,0,d*c-r*o,h*c+r*a,s*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,c=n._w,d=s+s,h=a+a,p=o+o,f=s*d,m=s*h,x=s*p,_=a*h,g=a*p,u=o*p,v=c*d,y=c*h,S=c*p,N=i.x,A=i.y,E=i.z;return r[0]=(1-(_+u))*N,r[1]=(m+S)*N,r[2]=(x-y)*N,r[3]=0,r[4]=(m-S)*A,r[5]=(1-(f+u))*A,r[6]=(g+v)*A,r[7]=0,r[8]=(x+y)*E,r[9]=(g-v)*E,r[10]=(1-(f+_))*E,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=$r.set(r[0],r[1],r[2]).length();const a=$r.set(r[4],r[5],r[6]).length(),o=$r.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],kn.copy(this);const d=1/s,h=1/a,p=1/o;return kn.elements[0]*=d,kn.elements[1]*=d,kn.elements[2]*=d,kn.elements[4]*=h,kn.elements[5]*=h,kn.elements[6]*=h,kn.elements[8]*=p,kn.elements[9]*=p,kn.elements[10]*=p,n.setFromRotationMatrix(kn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=_i){const c=this.elements,d=2*s/(n-e),h=2*s/(i-r),p=(n+e)/(n-e),f=(i+r)/(i-r);let m,x;if(o===_i)m=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===Pl)m=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=p,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=_i){const c=this.elements,d=1/(n-e),h=1/(i-r),p=1/(a-s),f=(n+e)*d,m=(i+r)*h;let x,_;if(o===_i)x=(a+s)*p,_=-2*p;else if(o===Pl)x=s*p,_=-1*p;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*d,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=_,c[14]=-x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const $r=new H,kn=new bt,O1=new H(0,0,0),F1=new H(1,1,1),ki=new H,Eo=new H,fn=new H,Dp=new bt,Lp=new $a;class Ai{constructor(e=0,n=0,i=0,r=Ai.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],d=r[5],h=r[9],p=r[2],f=r[6],m=r[10];switch(n){case"XYZ":this._y=Math.asin(en(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,d),this._z=0);break;case"YXZ":this._x=Math.asin(-en(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,d)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(en(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-p,m),this._z=Math.atan2(-a,d)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-en(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,d));break;case"YZX":this._z=Math.asin(en(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,d),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-en(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,d),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Dp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Dp,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Lp.setFromEuler(this),this.setFromQuaternion(Lp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ai.DEFAULT_ORDER="XYZ";class dv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let z1=0;const Ip=new H,qr=new $a,ci=new bt,bo=new H,na=new H,B1=new H,j1=new $a,kp=new H(1,0,0),Up=new H(0,1,0),Op=new H(0,0,1),Fp={type:"added"},V1={type:"removed"},Yr={type:"childadded",child:null},jc={type:"childremoved",child:null};class cn extends js{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:z1++}),this.uuid=Xa(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=cn.DEFAULT_UP.clone();const e=new H,n=new Ai,i=new $a,r=new H(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new bt},normalMatrix:{value:new Ve}}),this.matrix=new bt,this.matrixWorld=new bt,this.matrixAutoUpdate=cn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return qr.setFromAxisAngle(e,n),this.quaternion.multiply(qr),this}rotateOnWorldAxis(e,n){return qr.setFromAxisAngle(e,n),this.quaternion.premultiply(qr),this}rotateX(e){return this.rotateOnAxis(kp,e)}rotateY(e){return this.rotateOnAxis(Up,e)}rotateZ(e){return this.rotateOnAxis(Op,e)}translateOnAxis(e,n){return Ip.copy(e).applyQuaternion(this.quaternion),this.position.add(Ip.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(kp,e)}translateY(e){return this.translateOnAxis(Up,e)}translateZ(e){return this.translateOnAxis(Op,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ci.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?bo.copy(e):bo.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),na.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ci.lookAt(na,bo,this.up):ci.lookAt(bo,na,this.up),this.quaternion.setFromRotationMatrix(ci),r&&(ci.extractRotation(r.matrixWorld),qr.setFromRotationMatrix(ci),this.quaternion.premultiply(qr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fp),Yr.child=e,this.dispatchEvent(Yr),Yr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(V1),jc.child=e,this.dispatchEvent(jc),jc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ci.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ci.multiply(e.parent.matrixWorld)),e.applyMatrix4(ci),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fp),Yr.child=e,this.dispatchEvent(Yr),Yr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,e,B1),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,j1,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let d=0,h=c.length;d<h;d++){const p=c[d];s(e.shapes,p)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,d=this.material.length;c<d;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(n){const o=a(e.geometries),c=a(e.materials),d=a(e.textures),h=a(e.images),p=a(e.shapes),f=a(e.skeletons),m=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),d.length>0&&(i.textures=d),h.length>0&&(i.images=h),p.length>0&&(i.shapes=p),f.length>0&&(i.skeletons=f),m.length>0&&(i.animations=m),x.length>0&&(i.nodes=x)}return i.object=r,i;function a(o){const c=[];for(const d in o){const h=o[d];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}cn.DEFAULT_UP=new H(0,1,0);cn.DEFAULT_MATRIX_AUTO_UPDATE=!0;cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Un=new H,ui=new H,Vc=new H,di=new H,Kr=new H,Zr=new H,zp=new H,Hc=new H,Gc=new H,Wc=new H,Xc=new Et,$c=new Et,qc=new Et;class Bn{constructor(e=new H,n=new H,i=new H){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Un.subVectors(e,n),r.cross(Un);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Un.subVectors(r,n),ui.subVectors(i,n),Vc.subVectors(e,n);const a=Un.dot(Un),o=Un.dot(ui),c=Un.dot(Vc),d=ui.dot(ui),h=ui.dot(Vc),p=a*d-o*o;if(p===0)return s.set(0,0,0),null;const f=1/p,m=(d*c-o*h)*f,x=(a*h-o*c)*f;return s.set(1-m-x,x,m)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,di)===null?!1:di.x>=0&&di.y>=0&&di.x+di.y<=1}static getInterpolation(e,n,i,r,s,a,o,c){return this.getBarycoord(e,n,i,r,di)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,di.x),c.addScaledVector(a,di.y),c.addScaledVector(o,di.z),c)}static getInterpolatedAttribute(e,n,i,r,s,a){return Xc.setScalar(0),$c.setScalar(0),qc.setScalar(0),Xc.fromBufferAttribute(e,n),$c.fromBufferAttribute(e,i),qc.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Xc,s.x),a.addScaledVector($c,s.y),a.addScaledVector(qc,s.z),a}static isFrontFacing(e,n,i,r){return Un.subVectors(i,n),ui.subVectors(e,n),Un.cross(ui).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),ui.subVectors(this.a,this.b),Un.cross(ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Bn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Bn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Bn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Bn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Bn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;Kr.subVectors(r,i),Zr.subVectors(s,i),Hc.subVectors(e,i);const c=Kr.dot(Hc),d=Zr.dot(Hc);if(c<=0&&d<=0)return n.copy(i);Gc.subVectors(e,r);const h=Kr.dot(Gc),p=Zr.dot(Gc);if(h>=0&&p<=h)return n.copy(r);const f=c*p-h*d;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),n.copy(i).addScaledVector(Kr,a);Wc.subVectors(e,s);const m=Kr.dot(Wc),x=Zr.dot(Wc);if(x>=0&&m<=x)return n.copy(s);const _=m*d-c*x;if(_<=0&&d>=0&&x<=0)return o=d/(d-x),n.copy(i).addScaledVector(Zr,o);const g=h*x-m*p;if(g<=0&&p-h>=0&&m-x>=0)return zp.subVectors(s,r),o=(p-h)/(p-h+(m-x)),n.copy(r).addScaledVector(zp,o);const u=1/(g+_+f);return a=_*u,o=f*u,n.copy(i).addScaledVector(Kr,a).addScaledVector(Zr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const fv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ui={h:0,s:0,l:0},To={h:0,s:0,l:0};function Yc(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class $e{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Mn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=Qe.workingColorSpace){return this.r=e,this.g=n,this.b=i,Qe.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=Qe.workingColorSpace){if(e=T1(e,1),n=en(n,0,1),i=en(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=Yc(a,s,e+1/3),this.g=Yc(a,s,e),this.b=Yc(a,s,e-1/3)}return Qe.toWorkingColorSpace(this,r),this}setStyle(e,n=Mn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Mn){const i=fv[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Si(e.r),this.g=Si(e.g),this.b=Si(e.b),this}copyLinearToSRGB(e){return this.r=ws(e.r),this.g=ws(e.g),this.b=ws(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mn){return Qe.fromWorkingColorSpace(Ht.copy(this),e),Math.round(en(Ht.r*255,0,255))*65536+Math.round(en(Ht.g*255,0,255))*256+Math.round(en(Ht.b*255,0,255))}getHexString(e=Mn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Qe.workingColorSpace){Qe.fromWorkingColorSpace(Ht.copy(this),n);const i=Ht.r,r=Ht.g,s=Ht.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let c,d;const h=(o+a)/2;if(o===a)c=0,d=0;else{const p=a-o;switch(d=h<=.5?p/(a+o):p/(2-a-o),a){case i:c=(r-s)/p+(r<s?6:0);break;case r:c=(s-i)/p+2;break;case s:c=(i-r)/p+4;break}c/=6}return e.h=c,e.s=d,e.l=h,e}getRGB(e,n=Qe.workingColorSpace){return Qe.fromWorkingColorSpace(Ht.copy(this),n),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=Mn){Qe.fromWorkingColorSpace(Ht.copy(this),e);const n=Ht.r,i=Ht.g,r=Ht.b;return e!==Mn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Ui),this.setHSL(Ui.h+e,Ui.s+n,Ui.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Ui),e.getHSL(To);const i=Dc(Ui.h,To.h,n),r=Dc(Ui.s,To.s,n),s=Dc(Ui.l,To.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new $e;$e.NAMES=fv;let H1=0;class Ya extends js{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:H1++}),this.uuid=Xa(),this.name="",this.blending=Ss,this.side=ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rd,this.blendDst=sd,this.blendEquation=yr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $e(0,0,0),this.blendAlpha=0,this.depthFunc=Ps,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Vr,this.stencilZFail=Vr,this.stencilZPass=Vr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ss&&(i.blending=this.blending),this.side!==ir&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==rd&&(i.blendSrc=this.blendSrc),this.blendDst!==sd&&(i.blendDst=this.blendDst),this.blendEquation!==yr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ps&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Vr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Vr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Vr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Qf extends Ya{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ai,this.combine=q0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Tt=new H,Ao=new ot;class Cn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=wp,this.updateRanges=[],this.gpuType=vi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Ao.fromBufferAttribute(this,n),Ao.applyMatrix3(e),this.setXY(n,Ao.x,Ao.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Tt.fromBufferAttribute(this,n),Tt.applyMatrix3(e),this.setXYZ(n,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Tt.fromBufferAttribute(this,n),Tt.applyMatrix4(e),this.setXYZ(n,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Tt.fromBufferAttribute(this,n),Tt.applyNormalMatrix(e),this.setXYZ(n,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Tt.fromBufferAttribute(this,n),Tt.transformDirection(e),this.setXYZ(n,Tt.x,Tt.y,Tt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Js(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Qt(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Js(n,this.array)),n}setX(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Js(n,this.array)),n}setY(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Js(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Js(n,this.array)),n}setW(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Qt(n,this.array),i=Qt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=Qt(n,this.array),i=Qt(i,this.array),r=Qt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=Qt(n,this.array),i=Qt(i,this.array),r=Qt(r,this.array),s=Qt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==wp&&(e.usage=this.usage),e}}class hv extends Cn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class pv extends Cn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class ii extends Cn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let G1=0;const Sn=new bt,Kc=new cn,Qr=new H,hn=new qa,ia=new qa,Lt=new H;class ri extends js{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:G1++}),this.uuid=Xa(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ov(e)?pv:hv)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ve().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Sn.makeRotationFromQuaternion(e),this.applyMatrix4(Sn),this}rotateX(e){return Sn.makeRotationX(e),this.applyMatrix4(Sn),this}rotateY(e){return Sn.makeRotationY(e),this.applyMatrix4(Sn),this}rotateZ(e){return Sn.makeRotationZ(e),this.applyMatrix4(Sn),this}translate(e,n,i){return Sn.makeTranslation(e,n,i),this.applyMatrix4(Sn),this}scale(e,n,i){return Sn.makeScale(e,n,i),this.applyMatrix4(Sn),this}lookAt(e){return Kc.lookAt(e),Kc.updateMatrix(),this.applyMatrix4(Kc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qr).negate(),this.translate(Qr.x,Qr.y,Qr.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ii(i,3))}else{for(let i=0,r=n.count;i<r;i++){const s=e[i];n.setXYZ(i,s.x,s.y,s.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qa);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];hn.setFromBufferAttribute(s),this.morphTargetsRelative?(Lt.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(Lt)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jl);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const i=this.boundingSphere.center;if(hn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];ia.setFromBufferAttribute(o),this.morphTargetsRelative?(Lt.addVectors(hn.min,ia.min),hn.expandByPoint(Lt),Lt.addVectors(hn.max,ia.max),hn.expandByPoint(Lt)):(hn.expandByPoint(ia.min),hn.expandByPoint(ia.max))}hn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Lt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Lt));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],c=this.morphTargetsRelative;for(let d=0,h=o.count;d<h;d++)Lt.fromBufferAttribute(o,d),c&&(Qr.fromBufferAttribute(e,d),Lt.add(Qr)),r=Math.max(r,i.distanceToSquared(Lt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Cn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<i.count;R++)o[R]=new H,c[R]=new H;const d=new H,h=new H,p=new H,f=new ot,m=new ot,x=new ot,_=new H,g=new H;function u(R,T,M){d.fromBufferAttribute(i,R),h.fromBufferAttribute(i,T),p.fromBufferAttribute(i,M),f.fromBufferAttribute(s,R),m.fromBufferAttribute(s,T),x.fromBufferAttribute(s,M),h.sub(d),p.sub(d),m.sub(f),x.sub(f);const P=1/(m.x*x.y-x.x*m.y);isFinite(P)&&(_.copy(h).multiplyScalar(x.y).addScaledVector(p,-m.y).multiplyScalar(P),g.copy(p).multiplyScalar(m.x).addScaledVector(h,-x.x).multiplyScalar(P),o[R].add(_),o[T].add(_),o[M].add(_),c[R].add(g),c[T].add(g),c[M].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,T=v.length;R<T;++R){const M=v[R],P=M.start,X=M.count;for(let F=P,K=P+X;F<K;F+=3)u(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const y=new H,S=new H,N=new H,A=new H;function E(R){N.fromBufferAttribute(r,R),A.copy(N);const T=o[R];y.copy(T),y.sub(N.multiplyScalar(N.dot(T))).normalize(),S.crossVectors(A,T);const P=S.dot(c[R])<0?-1:1;a.setXYZW(R,y.x,y.y,y.z,P)}for(let R=0,T=v.length;R<T;++R){const M=v[R],P=M.start,X=M.count;for(let F=P,K=P+X;F<K;F+=3)E(e.getX(F+0)),E(e.getX(F+1)),E(e.getX(F+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Cn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,m=i.count;f<m;f++)i.setXYZ(f,0,0,0);const r=new H,s=new H,a=new H,o=new H,c=new H,d=new H,h=new H,p=new H;if(e)for(let f=0,m=e.count;f<m;f+=3){const x=e.getX(f+0),_=e.getX(f+1),g=e.getX(f+2);r.fromBufferAttribute(n,x),s.fromBufferAttribute(n,_),a.fromBufferAttribute(n,g),h.subVectors(a,s),p.subVectors(r,s),h.cross(p),o.fromBufferAttribute(i,x),c.fromBufferAttribute(i,_),d.fromBufferAttribute(i,g),o.add(h),c.add(h),d.add(h),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(g,d.x,d.y,d.z)}else for(let f=0,m=n.count;f<m;f+=3)r.fromBufferAttribute(n,f+0),s.fromBufferAttribute(n,f+1),a.fromBufferAttribute(n,f+2),h.subVectors(a,s),p.subVectors(r,s),h.cross(p),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Lt.fromBufferAttribute(e,n),Lt.normalize(),e.setXYZ(n,Lt.x,Lt.y,Lt.z)}toNonIndexed(){function e(o,c){const d=o.array,h=o.itemSize,p=o.normalized,f=new d.constructor(c.length*h);let m=0,x=0;for(let _=0,g=c.length;_<g;_++){o.isInterleavedBufferAttribute?m=c[_]*o.data.stride+o.offset:m=c[_]*h;for(let u=0;u<h;u++)f[x++]=d[m++]}return new Cn(f,h,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new ri,i=this.index.array,r=this.attributes;for(const o in r){const c=r[o],d=e(c,i);n.setAttribute(o,d)}const s=this.morphAttributes;for(const o in s){const c=[],d=s[o];for(let h=0,p=d.length;h<p;h++){const f=d[h],m=e(f,i);c.push(m)}n.morphAttributes[o]=c}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const d=a[o];n.addGroup(d.start,d.count,d.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const d in c)c[d]!==void 0&&(e[d]=c[d]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const c in i){const d=i[c];e.data.attributes[c]=d.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const d=this.morphAttributes[c],h=[];for(let p=0,f=d.length;p<f;p++){const m=d[p];h.push(m.toJSON(e.data))}h.length>0&&(r[c]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const d in r){const h=r[d];this.setAttribute(d,h.clone(n))}const s=e.morphAttributes;for(const d in s){const h=[],p=s[d];for(let f=0,m=p.length;f<m;f++)h.push(p[f].clone(n));this.morphAttributes[d]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let d=0,h=a.length;d<h;d++){const p=a[d];this.addGroup(p.start,p.count,p.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bp=new bt,fr=new uv,Co=new Jl,jp=new H,Ro=new H,No=new H,Po=new H,Zc=new H,Do=new H,Vp=new H,Lo=new H;class ei extends cn{constructor(e=new ri,n=new Qf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Do.set(0,0,0);for(let c=0,d=s.length;c<d;c++){const h=o[c],p=s[c];h!==0&&(Zc.fromBufferAttribute(p,e),a?Do.addScaledVector(Zc,h):Do.addScaledVector(Zc.sub(n),h))}n.add(Do)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Co.copy(i.boundingSphere),Co.applyMatrix4(s),fr.copy(e.ray).recast(e.near),!(Co.containsPoint(fr.origin)===!1&&(fr.intersectSphere(Co,jp)===null||fr.origin.distanceToSquared(jp)>(e.far-e.near)**2))&&(Bp.copy(s).invert(),fr.copy(e.ray).applyMatrix4(Bp),!(i.boundingBox!==null&&fr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,fr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,d=s.attributes.uv,h=s.attributes.uv1,p=s.attributes.normal,f=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,_=f.length;x<_;x++){const g=f[x],u=a[g.materialIndex],v=Math.max(g.start,m.start),y=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let S=v,N=y;S<N;S+=3){const A=o.getX(S),E=o.getX(S+1),R=o.getX(S+2);r=Io(this,u,e,i,d,h,p,A,E,R),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const x=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let g=x,u=_;g<u;g+=3){const v=o.getX(g),y=o.getX(g+1),S=o.getX(g+2);r=Io(this,a,e,i,d,h,p,v,y,S),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,_=f.length;x<_;x++){const g=f[x],u=a[g.materialIndex],v=Math.max(g.start,m.start),y=Math.min(c.count,Math.min(g.start+g.count,m.start+m.count));for(let S=v,N=y;S<N;S+=3){const A=S,E=S+1,R=S+2;r=Io(this,u,e,i,d,h,p,A,E,R),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const x=Math.max(0,m.start),_=Math.min(c.count,m.start+m.count);for(let g=x,u=_;g<u;g+=3){const v=g,y=g+1,S=g+2;r=Io(this,a,e,i,d,h,p,v,y,S),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}}}function W1(t,e,n,i,r,s,a,o){let c;if(e.side===on?c=i.intersectTriangle(a,s,r,!0,o):c=i.intersectTriangle(r,s,a,e.side===ir,o),c===null)return null;Lo.copy(o),Lo.applyMatrix4(t.matrixWorld);const d=n.ray.origin.distanceTo(Lo);return d<n.near||d>n.far?null:{distance:d,point:Lo.clone(),object:t}}function Io(t,e,n,i,r,s,a,o,c,d){t.getVertexPosition(o,Ro),t.getVertexPosition(c,No),t.getVertexPosition(d,Po);const h=W1(t,e,n,i,Ro,No,Po,Vp);if(h){const p=new H;Bn.getBarycoord(Vp,Ro,No,Po,p),r&&(h.uv=Bn.getInterpolatedAttribute(r,o,c,d,p,new ot)),s&&(h.uv1=Bn.getInterpolatedAttribute(s,o,c,d,p,new ot)),a&&(h.normal=Bn.getInterpolatedAttribute(a,o,c,d,p,new H),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:c,c:d,normal:new H,materialIndex:0};Bn.getNormal(Ro,No,Po,f.normal),h.face=f,h.barycoord=p}return h}class Ka extends ri{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],d=[],h=[],p=[];let f=0,m=0;x("z","y","x",-1,-1,i,n,e,a,s,0),x("z","y","x",1,-1,i,n,-e,a,s,1),x("x","z","y",1,1,e,i,n,r,a,2),x("x","z","y",1,-1,e,i,-n,r,a,3),x("x","y","z",1,-1,e,n,i,r,s,4),x("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new ii(d,3)),this.setAttribute("normal",new ii(h,3)),this.setAttribute("uv",new ii(p,2));function x(_,g,u,v,y,S,N,A,E,R,T){const M=S/E,P=N/R,X=S/2,F=N/2,K=A/2,$=E+1,q=R+1;let Q=0,D=0;const Z=new H;for(let ee=0;ee<q;ee++){const ue=ee*P-F;for(let B=0;B<$;B++){const se=B*M-X;Z[_]=se*v,Z[g]=ue*y,Z[u]=K,d.push(Z.x,Z.y,Z.z),Z[_]=0,Z[g]=0,Z[u]=A>0?1:-1,h.push(Z.x,Z.y,Z.z),p.push(B/E),p.push(1-ee/R),Q+=1}}for(let ee=0;ee<R;ee++)for(let ue=0;ue<E;ue++){const B=f+ue+$*ee,se=f+ue+$*(ee+1),G=f+(ue+1)+$*(ee+1),ie=f+(ue+1)+$*ee;c.push(B,se,ie),c.push(se,G,ie),D+=6}o.addGroup(m,D,T),m+=D,f+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ka(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Us(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Xt(t){const e={};for(let n=0;n<t.length;n++){const i=Us(t[n]);for(const r in i)e[r]=i[r]}return e}function X1(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function mv(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}const $1={clone:Us,merge:Xt};var q1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Y1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class rr extends Ya{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=q1,this.fragmentShader=Y1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Us(e.uniforms),this.uniformsGroups=X1(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class gv extends cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new bt,this.projectionMatrix=new bt,this.projectionMatrixInverse=new bt,this.coordinateSystem=_i}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Oi=new H,Hp=new ot,Gp=new ot;class bn extends gv{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Hd*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Pc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Hd*2*Math.atan(Math.tan(Pc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Oi.x,Oi.y).multiplyScalar(-e/Oi.z),Oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Oi.x,Oi.y).multiplyScalar(-e/Oi.z)}getViewSize(e,n){return this.getViewBounds(e,Hp,Gp),n.subVectors(Gp,Hp)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Pc*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,d=a.fullHeight;s+=a.offsetX*r/c,n-=a.offsetY*i/d,r*=a.width/c,i*=a.height/d}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Jr=-90,es=1;class K1 extends cn{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new bn(Jr,es,e,n);r.layers=this.layers,this.add(r);const s=new bn(Jr,es,e,n);s.layers=this.layers,this.add(s);const a=new bn(Jr,es,e,n);a.layers=this.layers,this.add(a);const o=new bn(Jr,es,e,n);o.layers=this.layers,this.add(o);const c=new bn(Jr,es,e,n);c.layers=this.layers,this.add(c);const d=new bn(Jr,es,e,n);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,c]=n;for(const d of n)this.remove(d);if(e===_i)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Pl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const d of n)this.add(d),d.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,d,h]=this.children,p=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,c),e.setRenderTarget(i,4,r),e.render(n,d),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(n,h),e.setRenderTarget(p,f,m),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class xv extends ln{constructor(e,n,i,r,s,a,o,c,d,h){e=e!==void 0?e:[],n=n!==void 0?n:Ds,super(e,n,i,r,s,a,o,c,d,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Z1 extends kr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new xv(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Jn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Ka(5,5,5),s=new rr({name:"CubemapFromEquirect",uniforms:Us(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:on,blending:Ji});s.uniforms.tEquirect.value=n;const a=new ei(r,s),o=n.minFilter;return n.minFilter===Tr&&(n.minFilter=Jn),new K1(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const Qc=new H,Q1=new H,J1=new Ve;class vr{constructor(e=new H(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Qc.subVectors(i,n).cross(Q1.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Qc),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||J1.getNormalMatrix(e),r=this.coplanarPoint(Qc).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const hr=new Jl,ko=new H;class vv{constructor(e=new vr,n=new vr,i=new vr,r=new vr,s=new vr,a=new vr){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=_i){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],c=r[3],d=r[4],h=r[5],p=r[6],f=r[7],m=r[8],x=r[9],_=r[10],g=r[11],u=r[12],v=r[13],y=r[14],S=r[15];if(i[0].setComponents(c-s,f-d,g-m,S-u).normalize(),i[1].setComponents(c+s,f+d,g+m,S+u).normalize(),i[2].setComponents(c+a,f+h,g+x,S+v).normalize(),i[3].setComponents(c-a,f-h,g-x,S-v).normalize(),i[4].setComponents(c-o,f-p,g-_,S-y).normalize(),n===_i)i[5].setComponents(c+o,f+p,g+_,S+y).normalize();else if(n===Pl)i[5].setComponents(o,p,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),hr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),hr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(hr)}intersectsSprite(e){return hr.center.set(0,0,0),hr.radius=.7071067811865476,hr.applyMatrix4(e.matrixWorld),this.intersectsSphere(hr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(ko.x=r.normal.x>0?e.max.x:e.min.x,ko.y=r.normal.y>0?e.max.y:e.min.y,ko.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ko)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function _v(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function eM(t){const e=new WeakMap;function n(o,c){const d=o.array,h=o.usage,p=d.byteLength,f=t.createBuffer();t.bindBuffer(c,f),t.bufferData(c,d,h),o.onUploadCallback();let m;if(d instanceof Float32Array)m=t.FLOAT;else if(d instanceof Uint16Array)o.isFloat16BufferAttribute?m=t.HALF_FLOAT:m=t.UNSIGNED_SHORT;else if(d instanceof Int16Array)m=t.SHORT;else if(d instanceof Uint32Array)m=t.UNSIGNED_INT;else if(d instanceof Int32Array)m=t.INT;else if(d instanceof Int8Array)m=t.BYTE;else if(d instanceof Uint8Array)m=t.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)m=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:f,type:m,bytesPerElement:d.BYTES_PER_ELEMENT,version:o.version,size:p}}function i(o,c,d){const h=c.array,p=c.updateRanges;if(t.bindBuffer(d,o),p.length===0)t.bufferSubData(d,0,h);else{p.sort((m,x)=>m.start-x.start);let f=0;for(let m=1;m<p.length;m++){const x=p[f],_=p[m];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++f,p[f]=_)}p.length=f+1;for(let m=0,x=p.length;m<x;m++){const _=p[m];t.bufferSubData(d,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(t.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const d=e.get(o);if(d===void 0)e.set(o,n(o,c));else if(d.version<o.version){if(d.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(d.buffer,o,c),d.version=o.version}}return{get:r,remove:s,update:a}}class ec extends ri{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),c=Math.floor(r),d=o+1,h=c+1,p=e/o,f=n/c,m=[],x=[],_=[],g=[];for(let u=0;u<h;u++){const v=u*f-a;for(let y=0;y<d;y++){const S=y*p-s;x.push(S,-v,0),_.push(0,0,1),g.push(y/o),g.push(1-u/c)}}for(let u=0;u<c;u++)for(let v=0;v<o;v++){const y=v+d*u,S=v+d*(u+1),N=v+1+d*(u+1),A=v+1+d*u;m.push(y,S,A),m.push(S,N,A)}this.setIndex(m),this.setAttribute("position",new ii(x,3)),this.setAttribute("normal",new ii(_,3)),this.setAttribute("uv",new ii(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ec(e.width,e.height,e.widthSegments,e.heightSegments)}}var tM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,nM=`#ifdef USE_ALPHAHASH
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
#endif`,iM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,aM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,oM=`#ifdef USE_AOMAP
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
#endif`,lM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,cM=`#ifdef USE_BATCHING
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
#endif`,uM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,dM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hM=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,pM=`#ifdef USE_IRIDESCENCE
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
#endif`,mM=`#ifdef USE_BUMPMAP
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
#endif`,gM=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,xM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_M=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,SM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,MM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,wM=`#if defined( USE_COLOR_ALPHA )
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
#endif`,EM=`#define PI 3.141592653589793
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
} // validated`,bM=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,TM=`vec3 transformedNormal = objectNormal;
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
#endif`,AM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,CM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,RM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,NM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,PM="gl_FragColor = linearToOutputTexel( gl_FragColor );",DM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,LM=`#ifdef USE_ENVMAP
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
#endif`,IM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,kM=`#ifdef USE_ENVMAP
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
#endif`,UM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,OM=`#ifdef USE_ENVMAP
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
#endif`,FM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,BM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,jM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,VM=`#ifdef USE_GRADIENTMAP
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
}`,HM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,GM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,WM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,XM=`uniform bool receiveShadow;
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
#endif`,$M=`#ifdef USE_ENVMAP
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
#endif`,qM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,YM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,KM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ZM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,QM=`PhysicalMaterial material;
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
#endif`,JM=`struct PhysicalMaterial {
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
}`,ew=`
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
#endif`,tw=`#if defined( RE_IndirectDiffuse )
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
#endif`,nw=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,iw=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rw=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sw=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,aw=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ow=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,lw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,cw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,uw=`#if defined( USE_POINTS_UV )
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
#endif`,dw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,fw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,hw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,pw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,mw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gw=`#ifdef USE_MORPHTARGETS
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
#endif`,xw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,_w=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,yw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Sw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ww=`#ifdef USE_NORMALMAP
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
#endif`,Ew=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Tw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Aw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Cw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Rw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Nw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Pw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Dw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Lw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Iw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Uw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ow=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Fw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,zw=`float getShadowMask() {
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
}`,Bw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jw=`#ifdef USE_SKINNING
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
#endif`,Vw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Hw=`#ifdef USE_SKINNING
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
#endif`,Gw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ww=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$w=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,qw=`#ifdef USE_TRANSMISSION
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
#endif`,Yw=`#ifdef USE_TRANSMISSION
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
#endif`,Kw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const eE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tE=`uniform sampler2D t2D;
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
}`,nE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,iE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,rE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,aE=`#include <common>
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
}`,oE=`#if DEPTH_PACKING == 3200
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
}`,lE=`#define DISTANCE
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
}`,cE=`#define DISTANCE
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
}`,uE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,dE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fE=`uniform float scale;
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
}`,hE=`uniform vec3 diffuse;
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
}`,pE=`#include <common>
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
}`,mE=`uniform vec3 diffuse;
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
}`,gE=`#define LAMBERT
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
}`,xE=`#define LAMBERT
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
}`,vE=`#define MATCAP
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
}`,_E=`#define MATCAP
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
}`,yE=`#define NORMAL
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
}`,SE=`#define NORMAL
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
}`,ME=`#define PHONG
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
}`,wE=`#define PHONG
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
}`,EE=`#define STANDARD
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
}`,bE=`#define STANDARD
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
}`,TE=`#define TOON
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
}`,AE=`#define TOON
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
}`,CE=`uniform float size;
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
}`,RE=`uniform vec3 diffuse;
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
}`,NE=`#include <common>
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
}`,PE=`uniform vec3 color;
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
}`,DE=`uniform float rotation;
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
}`,LE=`uniform vec3 diffuse;
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
}`,We={alphahash_fragment:tM,alphahash_pars_fragment:nM,alphamap_fragment:iM,alphamap_pars_fragment:rM,alphatest_fragment:sM,alphatest_pars_fragment:aM,aomap_fragment:oM,aomap_pars_fragment:lM,batching_pars_vertex:cM,batching_vertex:uM,begin_vertex:dM,beginnormal_vertex:fM,bsdfs:hM,iridescence_fragment:pM,bumpmap_pars_fragment:mM,clipping_planes_fragment:gM,clipping_planes_pars_fragment:xM,clipping_planes_pars_vertex:vM,clipping_planes_vertex:_M,color_fragment:yM,color_pars_fragment:SM,color_pars_vertex:MM,color_vertex:wM,common:EM,cube_uv_reflection_fragment:bM,defaultnormal_vertex:TM,displacementmap_pars_vertex:AM,displacementmap_vertex:CM,emissivemap_fragment:RM,emissivemap_pars_fragment:NM,colorspace_fragment:PM,colorspace_pars_fragment:DM,envmap_fragment:LM,envmap_common_pars_fragment:IM,envmap_pars_fragment:kM,envmap_pars_vertex:UM,envmap_physical_pars_fragment:$M,envmap_vertex:OM,fog_vertex:FM,fog_pars_vertex:zM,fog_fragment:BM,fog_pars_fragment:jM,gradientmap_pars_fragment:VM,lightmap_pars_fragment:HM,lights_lambert_fragment:GM,lights_lambert_pars_fragment:WM,lights_pars_begin:XM,lights_toon_fragment:qM,lights_toon_pars_fragment:YM,lights_phong_fragment:KM,lights_phong_pars_fragment:ZM,lights_physical_fragment:QM,lights_physical_pars_fragment:JM,lights_fragment_begin:ew,lights_fragment_maps:tw,lights_fragment_end:nw,logdepthbuf_fragment:iw,logdepthbuf_pars_fragment:rw,logdepthbuf_pars_vertex:sw,logdepthbuf_vertex:aw,map_fragment:ow,map_pars_fragment:lw,map_particle_fragment:cw,map_particle_pars_fragment:uw,metalnessmap_fragment:dw,metalnessmap_pars_fragment:fw,morphinstance_vertex:hw,morphcolor_vertex:pw,morphnormal_vertex:mw,morphtarget_pars_vertex:gw,morphtarget_vertex:xw,normal_fragment_begin:vw,normal_fragment_maps:_w,normal_pars_fragment:yw,normal_pars_vertex:Sw,normal_vertex:Mw,normalmap_pars_fragment:ww,clearcoat_normal_fragment_begin:Ew,clearcoat_normal_fragment_maps:bw,clearcoat_pars_fragment:Tw,iridescence_pars_fragment:Aw,opaque_fragment:Cw,packing:Rw,premultiplied_alpha_fragment:Nw,project_vertex:Pw,dithering_fragment:Dw,dithering_pars_fragment:Lw,roughnessmap_fragment:Iw,roughnessmap_pars_fragment:kw,shadowmap_pars_fragment:Uw,shadowmap_pars_vertex:Ow,shadowmap_vertex:Fw,shadowmask_pars_fragment:zw,skinbase_vertex:Bw,skinning_pars_vertex:jw,skinning_vertex:Vw,skinnormal_vertex:Hw,specularmap_fragment:Gw,specularmap_pars_fragment:Ww,tonemapping_fragment:Xw,tonemapping_pars_fragment:$w,transmission_fragment:qw,transmission_pars_fragment:Yw,uv_pars_fragment:Kw,uv_pars_vertex:Zw,uv_vertex:Qw,worldpos_vertex:Jw,background_vert:eE,background_frag:tE,backgroundCube_vert:nE,backgroundCube_frag:iE,cube_vert:rE,cube_frag:sE,depth_vert:aE,depth_frag:oE,distanceRGBA_vert:lE,distanceRGBA_frag:cE,equirect_vert:uE,equirect_frag:dE,linedashed_vert:fE,linedashed_frag:hE,meshbasic_vert:pE,meshbasic_frag:mE,meshlambert_vert:gE,meshlambert_frag:xE,meshmatcap_vert:vE,meshmatcap_frag:_E,meshnormal_vert:yE,meshnormal_frag:SE,meshphong_vert:ME,meshphong_frag:wE,meshphysical_vert:EE,meshphysical_frag:bE,meshtoon_vert:TE,meshtoon_frag:AE,points_vert:CE,points_frag:RE,shadow_vert:NE,shadow_frag:PE,sprite_vert:DE,sprite_frag:LE},fe={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},Kn={basic:{uniforms:Xt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:Xt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new $e(0)}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:Xt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:Xt([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:Xt([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new $e(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:Xt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:Xt([fe.points,fe.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:Xt([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:Xt([fe.common,fe.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:Xt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:Xt([fe.sprite,fe.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distanceRGBA:{uniforms:Xt([fe.common,fe.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distanceRGBA_vert,fragmentShader:We.distanceRGBA_frag},shadow:{uniforms:Xt([fe.lights,fe.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};Kn.physical={uniforms:Xt([Kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};const Uo={r:0,b:0,g:0},pr=new Ai,IE=new bt;function kE(t,e,n,i,r,s,a){const o=new $e(0);let c=s===!0?0:1,d,h,p=null,f=0,m=null;function x(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?n:e).get(y)),y}function _(v){let y=!1;const S=x(v);S===null?u(o,c):S&&S.isColor&&(u(S,1),y=!0);const N=t.xr.getEnvironmentBlendMode();N==="additive"?i.buffers.color.setClear(0,0,0,1,a):N==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function g(v,y){const S=x(y);S&&(S.isCubeTexture||S.mapping===Zl)?(h===void 0&&(h=new ei(new Ka(1,1,1),new rr({name:"BackgroundCubeMaterial",uniforms:Us(Kn.backgroundCube.uniforms),vertexShader:Kn.backgroundCube.vertexShader,fragmentShader:Kn.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(N,A,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),pr.copy(y.backgroundRotation),pr.x*=-1,pr.y*=-1,pr.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(pr.y*=-1,pr.z*=-1),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(IE.makeRotationFromEuler(pr)),h.material.toneMapped=Qe.getTransfer(S.colorSpace)!==at,(p!==S||f!==S.version||m!==t.toneMapping)&&(h.material.needsUpdate=!0,p=S,f=S.version,m=t.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(d===void 0&&(d=new ei(new ec(2,2),new rr({name:"BackgroundMaterial",uniforms:Us(Kn.background.uniforms),vertexShader:Kn.background.vertexShader,fragmentShader:Kn.background.fragmentShader,side:ir,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),Object.defineProperty(d.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(d)),d.material.uniforms.t2D.value=S,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.toneMapped=Qe.getTransfer(S.colorSpace)!==at,S.matrixAutoUpdate===!0&&S.updateMatrix(),d.material.uniforms.uvTransform.value.copy(S.matrix),(p!==S||f!==S.version||m!==t.toneMapping)&&(d.material.needsUpdate=!0,p=S,f=S.version,m=t.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null))}function u(v,y){v.getRGB(Uo,mv(t)),i.buffers.color.setClear(Uo.r,Uo.g,Uo.b,y,a)}return{getClearColor:function(){return o},setClearColor:function(v,y=1){o.set(v),c=y,u(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,u(o,c)},render:_,addToRenderList:g}}function UE(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,a=!1;function o(M,P,X,F,K){let $=!1;const q=p(F,X,P);s!==q&&(s=q,d(s.object)),$=m(M,F,X,K),$&&x(M,F,X,K),K!==null&&e.update(K,t.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,S(M,P,X,F),K!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(K).buffer))}function c(){return t.createVertexArray()}function d(M){return t.bindVertexArray(M)}function h(M){return t.deleteVertexArray(M)}function p(M,P,X){const F=X.wireframe===!0;let K=i[M.id];K===void 0&&(K={},i[M.id]=K);let $=K[P.id];$===void 0&&($={},K[P.id]=$);let q=$[F];return q===void 0&&(q=f(c()),$[F]=q),q}function f(M){const P=[],X=[],F=[];for(let K=0;K<n;K++)P[K]=0,X[K]=0,F[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:X,attributeDivisors:F,object:M,attributes:{},index:null}}function m(M,P,X,F){const K=s.attributes,$=P.attributes;let q=0;const Q=X.getAttributes();for(const D in Q)if(Q[D].location>=0){const ee=K[D];let ue=$[D];if(ue===void 0&&(D==="instanceMatrix"&&M.instanceMatrix&&(ue=M.instanceMatrix),D==="instanceColor"&&M.instanceColor&&(ue=M.instanceColor)),ee===void 0||ee.attribute!==ue||ue&&ee.data!==ue.data)return!0;q++}return s.attributesNum!==q||s.index!==F}function x(M,P,X,F){const K={},$=P.attributes;let q=0;const Q=X.getAttributes();for(const D in Q)if(Q[D].location>=0){let ee=$[D];ee===void 0&&(D==="instanceMatrix"&&M.instanceMatrix&&(ee=M.instanceMatrix),D==="instanceColor"&&M.instanceColor&&(ee=M.instanceColor));const ue={};ue.attribute=ee,ee&&ee.data&&(ue.data=ee.data),K[D]=ue,q++}s.attributes=K,s.attributesNum=q,s.index=F}function _(){const M=s.newAttributes;for(let P=0,X=M.length;P<X;P++)M[P]=0}function g(M){u(M,0)}function u(M,P){const X=s.newAttributes,F=s.enabledAttributes,K=s.attributeDivisors;X[M]=1,F[M]===0&&(t.enableVertexAttribArray(M),F[M]=1),K[M]!==P&&(t.vertexAttribDivisor(M,P),K[M]=P)}function v(){const M=s.newAttributes,P=s.enabledAttributes;for(let X=0,F=P.length;X<F;X++)P[X]!==M[X]&&(t.disableVertexAttribArray(X),P[X]=0)}function y(M,P,X,F,K,$,q){q===!0?t.vertexAttribIPointer(M,P,X,K,$):t.vertexAttribPointer(M,P,X,F,K,$)}function S(M,P,X,F){_();const K=F.attributes,$=X.getAttributes(),q=P.defaultAttributeValues;for(const Q in $){const D=$[Q];if(D.location>=0){let Z=K[Q];if(Z===void 0&&(Q==="instanceMatrix"&&M.instanceMatrix&&(Z=M.instanceMatrix),Q==="instanceColor"&&M.instanceColor&&(Z=M.instanceColor)),Z!==void 0){const ee=Z.normalized,ue=Z.itemSize,B=e.get(Z);if(B===void 0)continue;const se=B.buffer,G=B.type,ie=B.bytesPerElement,de=G===t.INT||G===t.UNSIGNED_INT||Z.gpuType===Xf;if(Z.isInterleavedBufferAttribute){const ne=Z.data,he=ne.stride,pe=Z.offset;if(ne.isInstancedInterleavedBuffer){for(let O=0;O<D.locationSize;O++)u(D.location+O,ne.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let O=0;O<D.locationSize;O++)g(D.location+O);t.bindBuffer(t.ARRAY_BUFFER,se);for(let O=0;O<D.locationSize;O++)y(D.location+O,ue/D.locationSize,G,ee,he*ie,(pe+ue/D.locationSize*O)*ie,de)}else{if(Z.isInstancedBufferAttribute){for(let ne=0;ne<D.locationSize;ne++)u(D.location+ne,Z.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let ne=0;ne<D.locationSize;ne++)g(D.location+ne);t.bindBuffer(t.ARRAY_BUFFER,se);for(let ne=0;ne<D.locationSize;ne++)y(D.location+ne,ue/D.locationSize,G,ee,ue*ie,ue/D.locationSize*ne*ie,de)}}else if(q!==void 0){const ee=q[Q];if(ee!==void 0)switch(ee.length){case 2:t.vertexAttrib2fv(D.location,ee);break;case 3:t.vertexAttrib3fv(D.location,ee);break;case 4:t.vertexAttrib4fv(D.location,ee);break;default:t.vertexAttrib1fv(D.location,ee)}}}}v()}function N(){R();for(const M in i){const P=i[M];for(const X in P){const F=P[X];for(const K in F)h(F[K].object),delete F[K];delete P[X]}delete i[M]}}function A(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const X in P){const F=P[X];for(const K in F)h(F[K].object),delete F[K];delete P[X]}delete i[M.id]}function E(M){for(const P in i){const X=i[P];if(X[M.id]===void 0)continue;const F=X[M.id];for(const K in F)h(F[K].object),delete F[K];delete X[M.id]}}function R(){T(),a=!0,s!==r&&(s=r,d(s.object))}function T(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:T,dispose:N,releaseStatesOfGeometry:A,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:g,disableUnusedAttributes:v}}function OE(t,e,n){let i;function r(d){i=d}function s(d,h){t.drawArrays(i,d,h),n.update(h,i,1)}function a(d,h,p){p!==0&&(t.drawArraysInstanced(i,d,h,p),n.update(h,i,p))}function o(d,h,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,d,0,h,0,p);let m=0;for(let x=0;x<p;x++)m+=h[x];n.update(m,i,1)}function c(d,h,p,f){if(p===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<d.length;x++)a(d[x],h[x],f[x]);else{m.multiDrawArraysInstancedWEBGL(i,d,0,h,0,f,0,p);let x=0;for(let _=0;_<p;_++)x+=h[_]*f[_];n.update(x,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function FE(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const E=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(E){return!(E!==jn&&i.convert(E)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(E){const R=E===Wa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==Ti&&i.convert(E)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==vi&&!R)}function c(E){if(E==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=n.precision!==void 0?n.precision:"highp";const h=c(d);h!==d&&(console.warn("THREE.WebGLRenderer:",d,"not supported, using",h,"instead."),d=h);const p=n.logarithmicDepthBuffer===!0,f=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),x=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),u=t.getParameter(t.MAX_VERTEX_ATTRIBS),v=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),y=t.getParameter(t.MAX_VARYING_VECTORS),S=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),N=x>0,A=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:d,logarithmicDepthBuffer:p,reverseDepthBuffer:f,maxTextures:m,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:g,maxAttributes:u,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:S,vertexTextures:N,maxSamples:A}}function zE(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new vr,o=new Ve,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(p,f){const m=p.length!==0||f||i!==0||r;return r=f,i=p.length,m},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,f){n=h(p,f,0)},this.setState=function(p,f,m){const x=p.clippingPlanes,_=p.clipIntersection,g=p.clipShadows,u=t.get(p);if(!r||x===null||x.length===0||s&&!g)s?h(null):d();else{const v=s?0:i,y=v*4;let S=u.clippingState||null;c.value=S,S=h(x,f,y,m);for(let N=0;N!==y;++N)S[N]=n[N];u.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function d(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(p,f,m,x){const _=p!==null?p.length:0;let g=null;if(_!==0){if(g=c.value,x!==!0||g===null){const u=m+_*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<u)&&(g=new Float32Array(u));for(let y=0,S=m;y!==_;++y,S+=4)a.copy(p[y]).applyMatrix4(v,o),a.normal.toArray(g,S),g[S+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function BE(t){let e=new WeakMap;function n(a,o){return o===hd?a.mapping=Ds:o===pd&&(a.mapping=Ls),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===hd||o===pd)if(e.has(a)){const c=e.get(a).texture;return n(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const d=new Z1(c.height);return d.fromEquirectangularTexture(t,a),e.set(a,d),a.addEventListener("dispose",r),n(d.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class jE extends gv{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,c=r-n;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=d*this.view.offsetX,a=s+d*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const ps=4,Wp=[.125,.215,.35,.446,.526,.582],Sr=20,Jc=new jE,Xp=new $e;let eu=null,tu=0,nu=0,iu=!1;const _r=(1+Math.sqrt(5))/2,ts=1/_r,$p=[new H(-_r,ts,0),new H(_r,ts,0),new H(-ts,0,_r),new H(ts,0,_r),new H(0,_r,-ts),new H(0,_r,ts),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class qp{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){eu=this._renderer.getRenderTarget(),tu=this._renderer.getActiveCubeFace(),nu=this._renderer.getActiveMipmapLevel(),iu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(eu,tu,nu),this._renderer.xr.enabled=iu,e.scissorTest=!1,Oo(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Ds||e.mapping===Ls?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),eu=this._renderer.getRenderTarget(),tu=this._renderer.getActiveCubeFace(),nu=this._renderer.getActiveMipmapLevel(),iu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Jn,minFilter:Jn,generateMipmaps:!1,type:Wa,format:jn,colorSpace:Bs,depthBuffer:!1},r=Yp(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Yp(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=VE(s)),this._blurMaterial=HE(s,e,n)}return r}_compileMaterial(e){const n=new ei(this._lodPlanes[0],e);this._renderer.compile(n,Jc)}_sceneToCubeUV(e,n,i,r){const o=new bn(90,1,n,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,p=h.autoClear,f=h.toneMapping;h.getClearColor(Xp),h.toneMapping=er,h.autoClear=!1;const m=new Qf({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1}),x=new ei(new Ka,m);let _=!1;const g=e.background;g?g.isColor&&(m.color.copy(g),e.background=null,_=!0):(m.color.copy(Xp),_=!0);for(let u=0;u<6;u++){const v=u%3;v===0?(o.up.set(0,c[u],0),o.lookAt(d[u],0,0)):v===1?(o.up.set(0,0,c[u]),o.lookAt(0,d[u],0)):(o.up.set(0,c[u],0),o.lookAt(0,0,d[u]));const y=this._cubeSize;Oo(r,v*y,u>2?y:0,y,y),h.setRenderTarget(r),_&&h.render(x,o),h.render(e,o)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=f,h.autoClear=p,e.background=g}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Ds||e.mapping===Ls;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kp());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new ei(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;Oo(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(a,Jc)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=$p[(r-s-1)%$p.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const c=this._renderer,d=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,p=new ei(this._lodPlanes[r],d),f=d.uniforms,m=this._sizeLods[i]-1,x=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Sr-1),_=s/x,g=isFinite(s)?1+Math.floor(h*_):Sr;g>Sr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Sr}`);const u=[];let v=0;for(let E=0;E<Sr;++E){const R=E/_,T=Math.exp(-R*R/2);u.push(T),E===0?v+=T:E<g&&(v+=2*T)}for(let E=0;E<u.length;E++)u[E]=u[E]/v;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=u,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:y}=this;f.dTheta.value=x,f.mipInt.value=y-i;const S=this._sizeLods[r],N=3*S*(r>y-ps?r-y+ps:0),A=4*(this._cubeSize-S);Oo(n,N,A,3*S,2*S),c.setRenderTarget(n),c.render(p,Jc)}}function VE(t){const e=[],n=[],i=[];let r=t;const s=t-ps+1+Wp.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let c=1/o;a>t-ps?c=Wp[a-t+ps-1]:a===0&&(c=0),i.push(c);const d=1/(o-2),h=-d,p=1+d,f=[h,h,p,h,p,p,h,h,p,p,h,p],m=6,x=6,_=3,g=2,u=1,v=new Float32Array(_*x*m),y=new Float32Array(g*x*m),S=new Float32Array(u*x*m);for(let A=0;A<m;A++){const E=A%3*2/3-1,R=A>2?0:-1,T=[E,R,0,E+2/3,R,0,E+2/3,R+1,0,E,R,0,E+2/3,R+1,0,E,R+1,0];v.set(T,_*x*A),y.set(f,g*x*A);const M=[A,A,A,A,A,A];S.set(M,u*x*A)}const N=new ri;N.setAttribute("position",new Cn(v,_)),N.setAttribute("uv",new Cn(y,g)),N.setAttribute("faceIndex",new Cn(S,u)),e.push(N),r>ps&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Yp(t,e,n){const i=new kr(t,e,n);return i.texture.mapping=Zl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Oo(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function HE(t,e,n){const i=new Float32Array(Sr),r=new H(0,1,0);return new rr({name:"SphericalGaussianBlur",defines:{n:Sr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Jf(),fragmentShader:`

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
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Kp(){return new rr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jf(),fragmentShader:`

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
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Zp(){return new rr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Jf(){return`

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
	`}function GE(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const c=o.mapping,d=c===hd||c===pd,h=c===Ds||c===Ls;if(d||h){let p=e.get(o);const f=p!==void 0?p.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return n===null&&(n=new qp(t)),p=d?n.fromEquirectangular(o,p):n.fromCubemap(o,p),p.texture.pmremVersion=o.pmremVersion,e.set(o,p),p.texture;if(p!==void 0)return p.texture;{const m=o.image;return d&&m&&m.height>0||h&&m&&r(m)?(n===null&&(n=new qp(t)),p=d?n.fromEquirectangular(o):n.fromCubemap(o),p.texture.pmremVersion=o.pmremVersion,e.set(o,p),o.addEventListener("dispose",s),p.texture):null}}}return o}function r(o){let c=0;const d=6;for(let h=0;h<d;h++)o[h]!==void 0&&c++;return c===d}function s(o){const c=o.target;c.removeEventListener("dispose",s);const d=e.get(c);d!==void 0&&(e.delete(c),d.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function WE(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&la("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function XE(t,e,n,i){const r={},s=new WeakMap;function a(p){const f=p.target;f.index!==null&&e.remove(f.index);for(const x in f.attributes)e.remove(f.attributes[x]);for(const x in f.morphAttributes){const _=f.morphAttributes[x];for(let g=0,u=_.length;g<u;g++)e.remove(_[g])}f.removeEventListener("dispose",a),delete r[f.id];const m=s.get(f);m&&(e.remove(m),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function o(p,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,n.memory.geometries++),f}function c(p){const f=p.attributes;for(const x in f)e.update(f[x],t.ARRAY_BUFFER);const m=p.morphAttributes;for(const x in m){const _=m[x];for(let g=0,u=_.length;g<u;g++)e.update(_[g],t.ARRAY_BUFFER)}}function d(p){const f=[],m=p.index,x=p.attributes.position;let _=0;if(m!==null){const v=m.array;_=m.version;for(let y=0,S=v.length;y<S;y+=3){const N=v[y+0],A=v[y+1],E=v[y+2];f.push(N,A,A,E,E,N)}}else if(x!==void 0){const v=x.array;_=x.version;for(let y=0,S=v.length/3-1;y<S;y+=3){const N=y+0,A=y+1,E=y+2;f.push(N,A,A,E,E,N)}}else return;const g=new(ov(f)?pv:hv)(f,1);g.version=_;const u=s.get(p);u&&e.remove(u),s.set(p,g)}function h(p){const f=s.get(p);if(f){const m=p.index;m!==null&&f.version<m.version&&d(p)}else d(p);return s.get(p)}return{get:o,update:c,getWireframeAttribute:h}}function $E(t,e,n){let i;function r(f){i=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function c(f,m){t.drawElements(i,m,s,f*a),n.update(m,i,1)}function d(f,m,x){x!==0&&(t.drawElementsInstanced(i,m,s,f*a,x),n.update(m,i,x))}function h(f,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,s,f,0,x);let g=0;for(let u=0;u<x;u++)g+=m[u];n.update(g,i,1)}function p(f,m,x,_){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let u=0;u<f.length;u++)d(f[u]/a,m[u],_[u]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,s,f,0,_,0,x);let u=0;for(let v=0;v<x;v++)u+=m[v]*_[v];n.update(u,i,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=d,this.renderMultiDraw=h,this.renderMultiDrawInstances=p}function qE(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function YE(t,e,n){const i=new WeakMap,r=new Et;function s(a,o,c){const d=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=h!==void 0?h.length:0;let f=i.get(o);if(f===void 0||f.count!==p){let M=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",M)};var m=M;f!==void 0&&f.texture.dispose();const x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let S=0;x===!0&&(S=1),_===!0&&(S=2),g===!0&&(S=3);let N=o.attributes.position.count*S,A=1;N>e.maxTextureSize&&(A=Math.ceil(N/e.maxTextureSize),N=e.maxTextureSize);const E=new Float32Array(N*A*4*p),R=new cv(E,N,A,p);R.type=vi,R.needsUpdate=!0;const T=S*4;for(let P=0;P<p;P++){const X=u[P],F=v[P],K=y[P],$=N*A*4*P;for(let q=0;q<X.count;q++){const Q=q*T;x===!0&&(r.fromBufferAttribute(X,q),E[$+Q+0]=r.x,E[$+Q+1]=r.y,E[$+Q+2]=r.z,E[$+Q+3]=0),_===!0&&(r.fromBufferAttribute(F,q),E[$+Q+4]=r.x,E[$+Q+5]=r.y,E[$+Q+6]=r.z,E[$+Q+7]=0),g===!0&&(r.fromBufferAttribute(K,q),E[$+Q+8]=r.x,E[$+Q+9]=r.y,E[$+Q+10]=r.z,E[$+Q+11]=K.itemSize===4?r.w:1)}}f={count:p,texture:R,size:new ot(N,A)},i.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let x=0;for(let g=0;g<d.length;g++)x+=d[g];const _=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(t,"morphTargetBaseInfluence",_),c.getUniforms().setValue(t,"morphTargetInfluences",d)}c.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:s}}function KE(t,e,n,i){let r=new WeakMap;function s(c){const d=i.render.frame,h=c.geometry,p=e.get(c,h);if(r.get(p)!==d&&(e.update(p),r.set(p,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==d&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),r.set(c,d))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==d&&(f.update(),r.set(f,d))}return p}function a(){r=new WeakMap}function o(c){const d=c.target;d.removeEventListener("dispose",o),n.remove(d.instanceMatrix),d.instanceColor!==null&&n.remove(d.instanceColor)}return{update:s,dispose:a}}class yv extends ln{constructor(e,n,i,r,s,a,o,c,d,h=Ms){if(h!==Ms&&h!==ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ms&&(i=Ir),i===void 0&&h===ks&&(i=Is),super(null,r,s,a,o,c,h,i,d),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:Gn,this.minFilter=c!==void 0?c:Gn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const Sv=new ln,Qp=new yv(1,1),Mv=new cv,wv=new k1,Ev=new xv,Jp=[],em=[],tm=new Float32Array(16),nm=new Float32Array(9),im=new Float32Array(4);function Vs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Jp[r];if(s===void 0&&(s=new Float32Array(r),Jp[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Pt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Dt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function tc(t,e){let n=em[e];n===void 0&&(n=new Int32Array(e),em[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function ZE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function QE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Pt(n,e))return;t.uniform2fv(this.addr,e),Dt(n,e)}}function JE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Pt(n,e))return;t.uniform3fv(this.addr,e),Dt(n,e)}}function eb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Pt(n,e))return;t.uniform4fv(this.addr,e),Dt(n,e)}}function tb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Pt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Dt(n,e)}else{if(Pt(n,i))return;im.set(i),t.uniformMatrix2fv(this.addr,!1,im),Dt(n,i)}}function nb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Pt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Dt(n,e)}else{if(Pt(n,i))return;nm.set(i),t.uniformMatrix3fv(this.addr,!1,nm),Dt(n,i)}}function ib(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Pt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Dt(n,e)}else{if(Pt(n,i))return;tm.set(i),t.uniformMatrix4fv(this.addr,!1,tm),Dt(n,i)}}function rb(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function sb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Pt(n,e))return;t.uniform2iv(this.addr,e),Dt(n,e)}}function ab(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Pt(n,e))return;t.uniform3iv(this.addr,e),Dt(n,e)}}function ob(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Pt(n,e))return;t.uniform4iv(this.addr,e),Dt(n,e)}}function lb(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function cb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Pt(n,e))return;t.uniform2uiv(this.addr,e),Dt(n,e)}}function ub(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Pt(n,e))return;t.uniform3uiv(this.addr,e),Dt(n,e)}}function db(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Pt(n,e))return;t.uniform4uiv(this.addr,e),Dt(n,e)}}function fb(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Qp.compareFunction=av,s=Qp):s=Sv,n.setTexture2D(e||s,r)}function hb(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||wv,r)}function pb(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Ev,r)}function mb(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Mv,r)}function gb(t){switch(t){case 5126:return ZE;case 35664:return QE;case 35665:return JE;case 35666:return eb;case 35674:return tb;case 35675:return nb;case 35676:return ib;case 5124:case 35670:return rb;case 35667:case 35671:return sb;case 35668:case 35672:return ab;case 35669:case 35673:return ob;case 5125:return lb;case 36294:return cb;case 36295:return ub;case 36296:return db;case 35678:case 36198:case 36298:case 36306:case 35682:return fb;case 35679:case 36299:case 36307:return hb;case 35680:case 36300:case 36308:case 36293:return pb;case 36289:case 36303:case 36311:case 36292:return mb}}function xb(t,e){t.uniform1fv(this.addr,e)}function vb(t,e){const n=Vs(e,this.size,2);t.uniform2fv(this.addr,n)}function _b(t,e){const n=Vs(e,this.size,3);t.uniform3fv(this.addr,n)}function yb(t,e){const n=Vs(e,this.size,4);t.uniform4fv(this.addr,n)}function Sb(t,e){const n=Vs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function Mb(t,e){const n=Vs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function wb(t,e){const n=Vs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function Eb(t,e){t.uniform1iv(this.addr,e)}function bb(t,e){t.uniform2iv(this.addr,e)}function Tb(t,e){t.uniform3iv(this.addr,e)}function Ab(t,e){t.uniform4iv(this.addr,e)}function Cb(t,e){t.uniform1uiv(this.addr,e)}function Rb(t,e){t.uniform2uiv(this.addr,e)}function Nb(t,e){t.uniform3uiv(this.addr,e)}function Pb(t,e){t.uniform4uiv(this.addr,e)}function Db(t,e,n){const i=this.cache,r=e.length,s=tc(n,r);Pt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||Sv,s[a])}function Lb(t,e,n){const i=this.cache,r=e.length,s=tc(n,r);Pt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||wv,s[a])}function Ib(t,e,n){const i=this.cache,r=e.length,s=tc(n,r);Pt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||Ev,s[a])}function kb(t,e,n){const i=this.cache,r=e.length,s=tc(n,r);Pt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||Mv,s[a])}function Ub(t){switch(t){case 5126:return xb;case 35664:return vb;case 35665:return _b;case 35666:return yb;case 35674:return Sb;case 35675:return Mb;case 35676:return wb;case 5124:case 35670:return Eb;case 35667:case 35671:return bb;case 35668:case 35672:return Tb;case 35669:case 35673:return Ab;case 5125:return Cb;case 36294:return Rb;case 36295:return Nb;case 36296:return Pb;case 35678:case 36198:case 36298:case 36306:case 35682:return Db;case 35679:case 36299:case 36307:return Lb;case 35680:case 36300:case 36308:case 36293:return Ib;case 36289:case 36303:case 36311:case 36292:return kb}}class Ob{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=gb(n.type)}}class Fb{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=Ub(n.type)}}class zb{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const ru=/(\w+)(\])?(\[|\.)?/g;function rm(t,e){t.seq.push(e),t.map[e.id]=e}function Bb(t,e,n){const i=t.name,r=i.length;for(ru.lastIndex=0;;){const s=ru.exec(i),a=ru.lastIndex;let o=s[1];const c=s[2]==="]",d=s[3];if(c&&(o=o|0),d===void 0||d==="["&&a+2===r){rm(n,d===void 0?new Ob(o,t,e):new Fb(o,t,e));break}else{let p=n.map[o];p===void 0&&(p=new zb(o),rm(n,p)),n=p}}}class sl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);Bb(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function sm(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const jb=37297;let Vb=0;function Hb(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const am=new Ve;function Gb(t){Qe._getMatrix(am,Qe.workingColorSpace,t);const e=`mat3( ${am.elements.map(n=>n.toFixed(4))} )`;switch(Qe.getTransfer(t)){case Ql:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function om(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+Hb(t.getShaderSource(e),a)}else return r}function Wb(t,e){const n=Gb(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function Xb(t,e){let n;switch(e){case o1:n="Linear";break;case l1:n="Reinhard";break;case c1:n="Cineon";break;case u1:n="ACESFilmic";break;case f1:n="AgX";break;case h1:n="Neutral";break;case d1:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Fo=new H;function $b(){Qe.getLuminanceCoefficients(Fo);const t=Fo.x.toFixed(4),e=Fo.y.toFixed(4),n=Fo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function qb(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ca).join(`
`)}function Yb(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function Kb(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function ca(t){return t!==""}function lm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function cm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Zb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gd(t){return t.replace(Zb,Jb)}const Qb=new Map;function Jb(t,e){let n=We[e];if(n===void 0){const i=Qb.get(e);if(i!==void 0)n=We[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Gd(n)}const eT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function um(t){return t.replace(eT,tT)}function tT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function dm(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}function nT(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===$0?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===BS?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===fi&&(e="SHADOWMAP_TYPE_VSM"),e}function iT(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Ds:case Ls:e="ENVMAP_TYPE_CUBE";break;case Zl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function rT(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Ls:e="ENVMAP_MODE_REFRACTION";break}return e}function sT(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case q0:e="ENVMAP_BLENDING_MULTIPLY";break;case s1:e="ENVMAP_BLENDING_MIX";break;case a1:e="ENVMAP_BLENDING_ADD";break}return e}function aT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function oT(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const c=nT(n),d=iT(n),h=rT(n),p=sT(n),f=aT(n),m=qb(n),x=Yb(s),_=r.createProgram();let g,u,v=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(ca).join(`
`),g.length>0&&(g+=`
`),u=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(ca).join(`
`),u.length>0&&(u+=`
`)):(g=[dm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ca).join(`
`),u=[dm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+d:"",n.envMap?"#define "+h:"",n.envMap?"#define "+p:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==er?"#define TONE_MAPPING":"",n.toneMapping!==er?We.tonemapping_pars_fragment:"",n.toneMapping!==er?Xb("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,Wb("linearToOutputTexel",n.outputColorSpace),$b(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ca).join(`
`)),a=Gd(a),a=lm(a,n),a=cm(a,n),o=Gd(o),o=lm(o,n),o=cm(o,n),a=um(a),o=um(o),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,u=["#define varying in",n.glslVersion===Ep?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Ep?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const y=v+g+a,S=v+u+o,N=sm(r,r.VERTEX_SHADER,y),A=sm(r,r.FRAGMENT_SHADER,S);r.attachShader(_,N),r.attachShader(_,A),n.index0AttributeName!==void 0?r.bindAttribLocation(_,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function E(P){if(t.debug.checkShaderErrors){const X=r.getProgramInfoLog(_).trim(),F=r.getShaderInfoLog(N).trim(),K=r.getShaderInfoLog(A).trim();let $=!0,q=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if($=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,_,N,A);else{const Q=om(r,N,"vertex"),D=om(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+X+`
`+Q+`
`+D)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(F===""||K==="")&&(q=!1);q&&(P.diagnostics={runnable:$,programLog:X,vertexShader:{log:F,prefix:g},fragmentShader:{log:K,prefix:u}})}r.deleteShader(N),r.deleteShader(A),R=new sl(r,_),T=Kb(r,_)}let R;this.getUniforms=function(){return R===void 0&&E(this),R};let T;this.getAttributes=function(){return T===void 0&&E(this),T};let M=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,jb)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Vb++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=N,this.fragmentShader=A,this}let lT=0;class cT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new uT(e),n.set(e,i)),i}}class uT{constructor(e){this.id=lT++,this.code=e,this.usedTimes=0}}function dT(t,e,n,i,r,s,a){const o=new dv,c=new cT,d=new Set,h=[],p=r.logarithmicDepthBuffer,f=r.vertexTextures;let m=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(T){return d.add(T),T===0?"uv":`uv${T}`}function g(T,M,P,X,F){const K=X.fog,$=F.geometry,q=T.isMeshStandardMaterial?X.environment:null,Q=(T.isMeshStandardMaterial?n:e).get(T.envMap||q),D=Q&&Q.mapping===Zl?Q.image.height:null,Z=x[T.type];T.precision!==null&&(m=r.getMaxPrecision(T.precision),m!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",m,"instead."));const ee=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,ue=ee!==void 0?ee.length:0;let B=0;$.morphAttributes.position!==void 0&&(B=1),$.morphAttributes.normal!==void 0&&(B=2),$.morphAttributes.color!==void 0&&(B=3);let se,G,ie,de;if(Z){const it=Kn[Z];se=it.vertexShader,G=it.fragmentShader}else se=T.vertexShader,G=T.fragmentShader,c.update(T),ie=c.getVertexShaderID(T),de=c.getFragmentShaderID(T);const ne=t.getRenderTarget(),he=t.state.buffers.depth.getReversed(),pe=F.isInstancedMesh===!0,O=F.isBatchedMesh===!0,Re=!!T.map,Ne=!!T.matcap,Xe=!!Q,I=!!T.aoMap,gt=!!T.lightMap,Ue=!!T.bumpMap,He=!!T.normalMap,De=!!T.displacementMap,st=!!T.emissiveMap,Pe=!!T.metalnessMap,C=!!T.roughnessMap,w=T.anisotropy>0,z=T.clearcoat>0,te=T.dispersion>0,ae=T.iridescence>0,J=T.sheen>0,Ee=T.transmission>0,ge=w&&!!T.anisotropyMap,Se=z&&!!T.clearcoatMap,Ze=z&&!!T.clearcoatNormalMap,le=z&&!!T.clearcoatRoughnessMap,Me=ae&&!!T.iridescenceMap,Ie=ae&&!!T.iridescenceThicknessMap,Oe=J&&!!T.sheenColorMap,we=J&&!!T.sheenRoughnessMap,Ke=!!T.specularMap,Ge=!!T.specularColorMap,lt=!!T.specularIntensityMap,L=Ee&&!!T.transmissionMap,me=Ee&&!!T.thicknessMap,Y=!!T.gradientMap,re=!!T.alphaMap,_e=T.alphaTest>0,xe=!!T.alphaHash,Be=!!T.extensions;let yt=er;T.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(yt=t.toneMapping);const zt={shaderID:Z,shaderType:T.type,shaderName:T.name,vertexShader:se,fragmentShader:G,defines:T.defines,customVertexShaderID:ie,customFragmentShaderID:de,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:m,batching:O,batchingColor:O&&F._colorsTexture!==null,instancing:pe,instancingColor:pe&&F.instanceColor!==null,instancingMorph:pe&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ne===null?t.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Bs,alphaToCoverage:!!T.alphaToCoverage,map:Re,matcap:Ne,envMap:Xe,envMapMode:Xe&&Q.mapping,envMapCubeUVHeight:D,aoMap:I,lightMap:gt,bumpMap:Ue,normalMap:He,displacementMap:f&&De,emissiveMap:st,normalMapObjectSpace:He&&T.normalMapType===v1,normalMapTangentSpace:He&&T.normalMapType===x1,metalnessMap:Pe,roughnessMap:C,anisotropy:w,anisotropyMap:ge,clearcoat:z,clearcoatMap:Se,clearcoatNormalMap:Ze,clearcoatRoughnessMap:le,dispersion:te,iridescence:ae,iridescenceMap:Me,iridescenceThicknessMap:Ie,sheen:J,sheenColorMap:Oe,sheenRoughnessMap:we,specularMap:Ke,specularColorMap:Ge,specularIntensityMap:lt,transmission:Ee,transmissionMap:L,thicknessMap:me,gradientMap:Y,opaque:T.transparent===!1&&T.blending===Ss&&T.alphaToCoverage===!1,alphaMap:re,alphaTest:_e,alphaHash:xe,combine:T.combine,mapUv:Re&&_(T.map.channel),aoMapUv:I&&_(T.aoMap.channel),lightMapUv:gt&&_(T.lightMap.channel),bumpMapUv:Ue&&_(T.bumpMap.channel),normalMapUv:He&&_(T.normalMap.channel),displacementMapUv:De&&_(T.displacementMap.channel),emissiveMapUv:st&&_(T.emissiveMap.channel),metalnessMapUv:Pe&&_(T.metalnessMap.channel),roughnessMapUv:C&&_(T.roughnessMap.channel),anisotropyMapUv:ge&&_(T.anisotropyMap.channel),clearcoatMapUv:Se&&_(T.clearcoatMap.channel),clearcoatNormalMapUv:Ze&&_(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:le&&_(T.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&_(T.iridescenceMap.channel),iridescenceThicknessMapUv:Ie&&_(T.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&_(T.sheenColorMap.channel),sheenRoughnessMapUv:we&&_(T.sheenRoughnessMap.channel),specularMapUv:Ke&&_(T.specularMap.channel),specularColorMapUv:Ge&&_(T.specularColorMap.channel),specularIntensityMapUv:lt&&_(T.specularIntensityMap.channel),transmissionMapUv:L&&_(T.transmissionMap.channel),thicknessMapUv:me&&_(T.thicknessMap.channel),alphaMapUv:re&&_(T.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(He||w),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!$.attributes.uv&&(Re||re),fog:!!K,useFog:T.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:T.flatShading===!0,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:he,skinning:F.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:B,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:T.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:yt,decodeVideoTexture:Re&&T.map.isVideoTexture===!0&&Qe.getTransfer(T.map.colorSpace)===at,decodeVideoTextureEmissive:st&&T.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(T.emissiveMap.colorSpace)===at,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===mi,flipSided:T.side===on,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Be&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Be&&T.extensions.multiDraw===!0||O)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return zt.vertexUv1s=d.has(1),zt.vertexUv2s=d.has(2),zt.vertexUv3s=d.has(3),d.clear(),zt}function u(T){const M=[];if(T.shaderID?M.push(T.shaderID):(M.push(T.customVertexShaderID),M.push(T.customFragmentShaderID)),T.defines!==void 0)for(const P in T.defines)M.push(P),M.push(T.defines[P]);return T.isRawShaderMaterial===!1&&(v(M,T),y(M,T),M.push(t.outputColorSpace)),M.push(T.customProgramCacheKey),M.join()}function v(T,M){T.push(M.precision),T.push(M.outputColorSpace),T.push(M.envMapMode),T.push(M.envMapCubeUVHeight),T.push(M.mapUv),T.push(M.alphaMapUv),T.push(M.lightMapUv),T.push(M.aoMapUv),T.push(M.bumpMapUv),T.push(M.normalMapUv),T.push(M.displacementMapUv),T.push(M.emissiveMapUv),T.push(M.metalnessMapUv),T.push(M.roughnessMapUv),T.push(M.anisotropyMapUv),T.push(M.clearcoatMapUv),T.push(M.clearcoatNormalMapUv),T.push(M.clearcoatRoughnessMapUv),T.push(M.iridescenceMapUv),T.push(M.iridescenceThicknessMapUv),T.push(M.sheenColorMapUv),T.push(M.sheenRoughnessMapUv),T.push(M.specularMapUv),T.push(M.specularColorMapUv),T.push(M.specularIntensityMapUv),T.push(M.transmissionMapUv),T.push(M.thicknessMapUv),T.push(M.combine),T.push(M.fogExp2),T.push(M.sizeAttenuation),T.push(M.morphTargetsCount),T.push(M.morphAttributeCount),T.push(M.numDirLights),T.push(M.numPointLights),T.push(M.numSpotLights),T.push(M.numSpotLightMaps),T.push(M.numHemiLights),T.push(M.numRectAreaLights),T.push(M.numDirLightShadows),T.push(M.numPointLightShadows),T.push(M.numSpotLightShadows),T.push(M.numSpotLightShadowsWithMaps),T.push(M.numLightProbes),T.push(M.shadowMapType),T.push(M.toneMapping),T.push(M.numClippingPlanes),T.push(M.numClipIntersection),T.push(M.depthPacking)}function y(T,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),T.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),T.push(o.mask)}function S(T){const M=x[T.type];let P;if(M){const X=Kn[M];P=$1.clone(X.uniforms)}else P=T.uniforms;return P}function N(T,M){let P;for(let X=0,F=h.length;X<F;X++){const K=h[X];if(K.cacheKey===M){P=K,++P.usedTimes;break}}return P===void 0&&(P=new oT(t,M,T,s),h.push(P)),P}function A(T){if(--T.usedTimes===0){const M=h.indexOf(T);h[M]=h[h.length-1],h.pop(),T.destroy()}}function E(T){c.remove(T)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:u,getUniforms:S,acquireProgram:N,releaseProgram:A,releaseShaderCache:E,programs:h,dispose:R}}function fT(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,c){t.get(a)[o]=c}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function hT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function fm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function hm(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(p,f,m,x,_,g){let u=t[e];return u===void 0?(u={id:p.id,object:p,geometry:f,material:m,groupOrder:x,renderOrder:p.renderOrder,z:_,group:g},t[e]=u):(u.id=p.id,u.object=p,u.geometry=f,u.material=m,u.groupOrder=x,u.renderOrder=p.renderOrder,u.z=_,u.group=g),e++,u}function o(p,f,m,x,_,g){const u=a(p,f,m,x,_,g);m.transmission>0?i.push(u):m.transparent===!0?r.push(u):n.push(u)}function c(p,f,m,x,_,g){const u=a(p,f,m,x,_,g);m.transmission>0?i.unshift(u):m.transparent===!0?r.unshift(u):n.unshift(u)}function d(p,f){n.length>1&&n.sort(p||hT),i.length>1&&i.sort(f||fm),r.length>1&&r.sort(f||fm)}function h(){for(let p=e,f=t.length;p<f;p++){const m=t[p];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:c,finish:h,sort:d}}function pT(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new hm,t.set(i,[a])):r>=s.length?(a=new hm,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function mT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new H,color:new $e};break;case"SpotLight":n={position:new H,direction:new H,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new H,color:new $e,distance:0,decay:0};break;case"HemisphereLight":n={direction:new H,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":n={color:new $e,position:new H,halfWidth:new H,halfHeight:new H};break}return t[e.id]=n,n}}}function gT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let xT=0;function vT(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function _T(t){const e=new mT,n=gT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)i.probe.push(new H);const r=new H,s=new bt,a=new bt;function o(d){let h=0,p=0,f=0;for(let T=0;T<9;T++)i.probe[T].set(0,0,0);let m=0,x=0,_=0,g=0,u=0,v=0,y=0,S=0,N=0,A=0,E=0;d.sort(vT);for(let T=0,M=d.length;T<M;T++){const P=d[T],X=P.color,F=P.intensity,K=P.distance,$=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=X.r*F,p+=X.g*F,f+=X.b*F;else if(P.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(P.sh.coefficients[q],F);E++}else if(P.isDirectionalLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Q=P.shadow,D=n.get(P);D.shadowIntensity=Q.intensity,D.shadowBias=Q.bias,D.shadowNormalBias=Q.normalBias,D.shadowRadius=Q.radius,D.shadowMapSize=Q.mapSize,i.directionalShadow[m]=D,i.directionalShadowMap[m]=$,i.directionalShadowMatrix[m]=P.shadow.matrix,v++}i.directional[m]=q,m++}else if(P.isSpotLight){const q=e.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(X).multiplyScalar(F),q.distance=K,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,i.spot[_]=q;const Q=P.shadow;if(P.map&&(i.spotLightMap[N]=P.map,N++,Q.updateMatrices(P),P.castShadow&&A++),i.spotLightMatrix[_]=Q.matrix,P.castShadow){const D=n.get(P);D.shadowIntensity=Q.intensity,D.shadowBias=Q.bias,D.shadowNormalBias=Q.normalBias,D.shadowRadius=Q.radius,D.shadowMapSize=Q.mapSize,i.spotShadow[_]=D,i.spotShadowMap[_]=$,S++}_++}else if(P.isRectAreaLight){const q=e.get(P);q.color.copy(X).multiplyScalar(F),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=q,g++}else if(P.isPointLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){const Q=P.shadow,D=n.get(P);D.shadowIntensity=Q.intensity,D.shadowBias=Q.bias,D.shadowNormalBias=Q.normalBias,D.shadowRadius=Q.radius,D.shadowMapSize=Q.mapSize,D.shadowCameraNear=Q.camera.near,D.shadowCameraFar=Q.camera.far,i.pointShadow[x]=D,i.pointShadowMap[x]=$,i.pointShadowMatrix[x]=P.shadow.matrix,y++}i.point[x]=q,x++}else if(P.isHemisphereLight){const q=e.get(P);q.skyColor.copy(P.color).multiplyScalar(F),q.groundColor.copy(P.groundColor).multiplyScalar(F),i.hemi[u]=q,u++}}g>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=fe.LTC_FLOAT_1,i.rectAreaLTC2=fe.LTC_FLOAT_2):(i.rectAreaLTC1=fe.LTC_HALF_1,i.rectAreaLTC2=fe.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=p,i.ambient[2]=f;const R=i.hash;(R.directionalLength!==m||R.pointLength!==x||R.spotLength!==_||R.rectAreaLength!==g||R.hemiLength!==u||R.numDirectionalShadows!==v||R.numPointShadows!==y||R.numSpotShadows!==S||R.numSpotMaps!==N||R.numLightProbes!==E)&&(i.directional.length=m,i.spot.length=_,i.rectArea.length=g,i.point.length=x,i.hemi.length=u,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=S+N-A,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=E,R.directionalLength=m,R.pointLength=x,R.spotLength=_,R.rectAreaLength=g,R.hemiLength=u,R.numDirectionalShadows=v,R.numPointShadows=y,R.numSpotShadows=S,R.numSpotMaps=N,R.numLightProbes=E,i.version=xT++)}function c(d,h){let p=0,f=0,m=0,x=0,_=0;const g=h.matrixWorldInverse;for(let u=0,v=d.length;u<v;u++){const y=d[u];if(y.isDirectionalLight){const S=i.directional[p];S.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),p++}else if(y.isSpotLight){const S=i.spot[m];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(g),S.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),m++}else if(y.isRectAreaLight){const S=i.rectArea[x];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(g),a.identity(),s.copy(y.matrixWorld),s.premultiply(g),a.extractRotation(s),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){const S=i.point[f];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(g),f++}else if(y.isHemisphereLight){const S=i.hemi[_];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(g),_++}}}return{setup:o,setupView:c,state:i}}function pm(t){const e=new _T(t),n=[],i=[];function r(h){d.camera=h,n.length=0,i.length=0}function s(h){n.push(h)}function a(h){i.push(h)}function o(){e.setup(n)}function c(h){e.setupView(n,h)}const d={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:d,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function yT(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new pm(t),e.set(r,[o])):s>=a.length?(o=new pm(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class ST extends Ya{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=m1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class MT extends Ya{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const wT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ET=`uniform sampler2D shadow_pass;
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
}`;function bT(t,e,n){let i=new vv;const r=new ot,s=new ot,a=new Et,o=new ST({depthPacking:g1}),c=new MT,d={},h=n.maxTextureSize,p={[ir]:on,[on]:ir,[mi]:mi},f=new rr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:wT,fragmentShader:ET}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const x=new ri;x.setAttribute("position",new Cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ei(x,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$0;let u=this.type;this.render=function(A,E,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;const T=t.getRenderTarget(),M=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),X=t.state;X.setBlending(Ji),X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);const F=u!==fi&&this.type===fi,K=u===fi&&this.type!==fi;for(let $=0,q=A.length;$<q;$++){const Q=A[$],D=Q.shadow;if(D===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;r.copy(D.mapSize);const Z=D.getFrameExtents();if(r.multiply(Z),s.copy(D.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/Z.x),r.x=s.x*Z.x,D.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/Z.y),r.y=s.y*Z.y,D.mapSize.y=s.y)),D.map===null||F===!0||K===!0){const ue=this.type!==fi?{minFilter:Gn,magFilter:Gn}:{};D.map!==null&&D.map.dispose(),D.map=new kr(r.x,r.y,ue),D.map.texture.name=Q.name+".shadowMap",D.camera.updateProjectionMatrix()}t.setRenderTarget(D.map),t.clear();const ee=D.getViewportCount();for(let ue=0;ue<ee;ue++){const B=D.getViewport(ue);a.set(s.x*B.x,s.y*B.y,s.x*B.z,s.y*B.w),X.viewport(a),D.updateMatrices(Q,ue),i=D.getFrustum(),S(E,R,D.camera,Q,this.type)}D.isPointLightShadow!==!0&&this.type===fi&&v(D,R),D.needsUpdate=!1}u=this.type,g.needsUpdate=!1,t.setRenderTarget(T,M,P)};function v(A,E){const R=e.update(_);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new kr(r.x,r.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,t.setRenderTarget(A.mapPass),t.clear(),t.renderBufferDirect(E,null,R,f,_,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,t.setRenderTarget(A.map),t.clear(),t.renderBufferDirect(E,null,R,m,_,null)}function y(A,E,R,T){let M=null;const P=R.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)M=P;else if(M=R.isPointLight===!0?c:o,t.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const X=M.uuid,F=E.uuid;let K=d[X];K===void 0&&(K={},d[X]=K);let $=K[F];$===void 0&&($=M.clone(),K[F]=$,E.addEventListener("dispose",N)),M=$}if(M.visible=E.visible,M.wireframe=E.wireframe,T===fi?M.side=E.shadowSide!==null?E.shadowSide:E.side:M.side=E.shadowSide!==null?E.shadowSide:p[E.side],M.alphaMap=E.alphaMap,M.alphaTest=E.alphaTest,M.map=E.map,M.clipShadows=E.clipShadows,M.clippingPlanes=E.clippingPlanes,M.clipIntersection=E.clipIntersection,M.displacementMap=E.displacementMap,M.displacementScale=E.displacementScale,M.displacementBias=E.displacementBias,M.wireframeLinewidth=E.wireframeLinewidth,M.linewidth=E.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const X=t.properties.get(M);X.light=R}return M}function S(A,E,R,T,M){if(A.visible===!1)return;if(A.layers.test(E.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&M===fi)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,A.matrixWorld);const F=e.update(A),K=A.material;if(Array.isArray(K)){const $=F.groups;for(let q=0,Q=$.length;q<Q;q++){const D=$[q],Z=K[D.materialIndex];if(Z&&Z.visible){const ee=y(A,Z,T,M);A.onBeforeShadow(t,A,E,R,F,ee,D),t.renderBufferDirect(R,null,F,ee,A,D),A.onAfterShadow(t,A,E,R,F,ee,D)}}}else if(K.visible){const $=y(A,K,T,M);A.onBeforeShadow(t,A,E,R,F,$,null),t.renderBufferDirect(R,null,F,$,A,null),A.onAfterShadow(t,A,E,R,F,$,null)}}const X=A.children;for(let F=0,K=X.length;F<K;F++)S(X[F],E,R,T,M)}function N(A){A.target.removeEventListener("dispose",N);for(const R in d){const T=d[R],M=A.target.uuid;M in T&&(T[M].dispose(),delete T[M])}}}const TT={[ad]:od,[ld]:dd,[cd]:fd,[Ps]:ud,[od]:ad,[dd]:ld,[fd]:cd,[ud]:Ps};function AT(t,e){function n(){let L=!1;const me=new Et;let Y=null;const re=new Et(0,0,0,0);return{setMask:function(_e){Y!==_e&&!L&&(t.colorMask(_e,_e,_e,_e),Y=_e)},setLocked:function(_e){L=_e},setClear:function(_e,xe,Be,yt,zt){zt===!0&&(_e*=yt,xe*=yt,Be*=yt),me.set(_e,xe,Be,yt),re.equals(me)===!1&&(t.clearColor(_e,xe,Be,yt),re.copy(me))},reset:function(){L=!1,Y=null,re.set(-1,0,0,0)}}}function i(){let L=!1,me=!1,Y=null,re=null,_e=null;return{setReversed:function(xe){if(me!==xe){const Be=e.get("EXT_clip_control");me?Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.ZERO_TO_ONE_EXT):Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.NEGATIVE_ONE_TO_ONE_EXT);const yt=_e;_e=null,this.setClear(yt)}me=xe},getReversed:function(){return me},setTest:function(xe){xe?ne(t.DEPTH_TEST):he(t.DEPTH_TEST)},setMask:function(xe){Y!==xe&&!L&&(t.depthMask(xe),Y=xe)},setFunc:function(xe){if(me&&(xe=TT[xe]),re!==xe){switch(xe){case ad:t.depthFunc(t.NEVER);break;case od:t.depthFunc(t.ALWAYS);break;case ld:t.depthFunc(t.LESS);break;case Ps:t.depthFunc(t.LEQUAL);break;case cd:t.depthFunc(t.EQUAL);break;case ud:t.depthFunc(t.GEQUAL);break;case dd:t.depthFunc(t.GREATER);break;case fd:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}re=xe}},setLocked:function(xe){L=xe},setClear:function(xe){_e!==xe&&(me&&(xe=1-xe),t.clearDepth(xe),_e=xe)},reset:function(){L=!1,Y=null,re=null,_e=null,me=!1}}}function r(){let L=!1,me=null,Y=null,re=null,_e=null,xe=null,Be=null,yt=null,zt=null;return{setTest:function(it){L||(it?ne(t.STENCIL_TEST):he(t.STENCIL_TEST))},setMask:function(it){me!==it&&!L&&(t.stencilMask(it),me=it)},setFunc:function(it,Pn,si){(Y!==it||re!==Pn||_e!==si)&&(t.stencilFunc(it,Pn,si),Y=it,re=Pn,_e=si)},setOp:function(it,Pn,si){(xe!==it||Be!==Pn||yt!==si)&&(t.stencilOp(it,Pn,si),xe=it,Be=Pn,yt=si)},setLocked:function(it){L=it},setClear:function(it){zt!==it&&(t.clearStencil(it),zt=it)},reset:function(){L=!1,me=null,Y=null,re=null,_e=null,xe=null,Be=null,yt=null,zt=null}}}const s=new n,a=new i,o=new r,c=new WeakMap,d=new WeakMap;let h={},p={},f=new WeakMap,m=[],x=null,_=!1,g=null,u=null,v=null,y=null,S=null,N=null,A=null,E=new $e(0,0,0),R=0,T=!1,M=null,P=null,X=null,F=null,K=null;const $=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,Q=0;const D=t.getParameter(t.VERSION);D.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(D)[1]),q=Q>=1):D.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(D)[1]),q=Q>=2);let Z=null,ee={};const ue=t.getParameter(t.SCISSOR_BOX),B=t.getParameter(t.VIEWPORT),se=new Et().fromArray(ue),G=new Et().fromArray(B);function ie(L,me,Y,re){const _e=new Uint8Array(4),xe=t.createTexture();t.bindTexture(L,xe),t.texParameteri(L,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(L,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Be=0;Be<Y;Be++)L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY?t.texImage3D(me,0,t.RGBA,1,1,re,0,t.RGBA,t.UNSIGNED_BYTE,_e):t.texImage2D(me+Be,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,_e);return xe}const de={};de[t.TEXTURE_2D]=ie(t.TEXTURE_2D,t.TEXTURE_2D,1),de[t.TEXTURE_CUBE_MAP]=ie(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),de[t.TEXTURE_2D_ARRAY]=ie(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),de[t.TEXTURE_3D]=ie(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(t.DEPTH_TEST),a.setFunc(Ps),Ue(!1),He(_p),ne(t.CULL_FACE),I(Ji);function ne(L){h[L]!==!0&&(t.enable(L),h[L]=!0)}function he(L){h[L]!==!1&&(t.disable(L),h[L]=!1)}function pe(L,me){return p[L]!==me?(t.bindFramebuffer(L,me),p[L]=me,L===t.DRAW_FRAMEBUFFER&&(p[t.FRAMEBUFFER]=me),L===t.FRAMEBUFFER&&(p[t.DRAW_FRAMEBUFFER]=me),!0):!1}function O(L,me){let Y=m,re=!1;if(L){Y=f.get(me),Y===void 0&&(Y=[],f.set(me,Y));const _e=L.textures;if(Y.length!==_e.length||Y[0]!==t.COLOR_ATTACHMENT0){for(let xe=0,Be=_e.length;xe<Be;xe++)Y[xe]=t.COLOR_ATTACHMENT0+xe;Y.length=_e.length,re=!0}}else Y[0]!==t.BACK&&(Y[0]=t.BACK,re=!0);re&&t.drawBuffers(Y)}function Re(L){return x!==L?(t.useProgram(L),x=L,!0):!1}const Ne={[yr]:t.FUNC_ADD,[VS]:t.FUNC_SUBTRACT,[HS]:t.FUNC_REVERSE_SUBTRACT};Ne[GS]=t.MIN,Ne[WS]=t.MAX;const Xe={[XS]:t.ZERO,[$S]:t.ONE,[qS]:t.SRC_COLOR,[rd]:t.SRC_ALPHA,[e1]:t.SRC_ALPHA_SATURATE,[QS]:t.DST_COLOR,[KS]:t.DST_ALPHA,[YS]:t.ONE_MINUS_SRC_COLOR,[sd]:t.ONE_MINUS_SRC_ALPHA,[JS]:t.ONE_MINUS_DST_COLOR,[ZS]:t.ONE_MINUS_DST_ALPHA,[t1]:t.CONSTANT_COLOR,[n1]:t.ONE_MINUS_CONSTANT_COLOR,[i1]:t.CONSTANT_ALPHA,[r1]:t.ONE_MINUS_CONSTANT_ALPHA};function I(L,me,Y,re,_e,xe,Be,yt,zt,it){if(L===Ji){_===!0&&(he(t.BLEND),_=!1);return}if(_===!1&&(ne(t.BLEND),_=!0),L!==jS){if(L!==g||it!==T){if((u!==yr||S!==yr)&&(t.blendEquation(t.FUNC_ADD),u=yr,S=yr),it)switch(L){case Ss:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case id:t.blendFunc(t.ONE,t.ONE);break;case yp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Sp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Ss:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case id:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case yp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Sp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}v=null,y=null,N=null,A=null,E.set(0,0,0),R=0,g=L,T=it}return}_e=_e||me,xe=xe||Y,Be=Be||re,(me!==u||_e!==S)&&(t.blendEquationSeparate(Ne[me],Ne[_e]),u=me,S=_e),(Y!==v||re!==y||xe!==N||Be!==A)&&(t.blendFuncSeparate(Xe[Y],Xe[re],Xe[xe],Xe[Be]),v=Y,y=re,N=xe,A=Be),(yt.equals(E)===!1||zt!==R)&&(t.blendColor(yt.r,yt.g,yt.b,zt),E.copy(yt),R=zt),g=L,T=!1}function gt(L,me){L.side===mi?he(t.CULL_FACE):ne(t.CULL_FACE);let Y=L.side===on;me&&(Y=!Y),Ue(Y),L.blending===Ss&&L.transparent===!1?I(Ji):I(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),s.setMask(L.colorWrite);const re=L.stencilWrite;o.setTest(re),re&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),st(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?ne(t.SAMPLE_ALPHA_TO_COVERAGE):he(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(L){M!==L&&(L?t.frontFace(t.CW):t.frontFace(t.CCW),M=L)}function He(L){L!==FS?(ne(t.CULL_FACE),L!==P&&(L===_p?t.cullFace(t.BACK):L===zS?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):he(t.CULL_FACE),P=L}function De(L){L!==X&&(q&&t.lineWidth(L),X=L)}function st(L,me,Y){L?(ne(t.POLYGON_OFFSET_FILL),(F!==me||K!==Y)&&(t.polygonOffset(me,Y),F=me,K=Y)):he(t.POLYGON_OFFSET_FILL)}function Pe(L){L?ne(t.SCISSOR_TEST):he(t.SCISSOR_TEST)}function C(L){L===void 0&&(L=t.TEXTURE0+$-1),Z!==L&&(t.activeTexture(L),Z=L)}function w(L,me,Y){Y===void 0&&(Z===null?Y=t.TEXTURE0+$-1:Y=Z);let re=ee[Y];re===void 0&&(re={type:void 0,texture:void 0},ee[Y]=re),(re.type!==L||re.texture!==me)&&(Z!==Y&&(t.activeTexture(Y),Z=Y),t.bindTexture(L,me||de[L]),re.type=L,re.texture=me)}function z(){const L=ee[Z];L!==void 0&&L.type!==void 0&&(t.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function te(){try{t.compressedTexImage2D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ae(){try{t.compressedTexImage3D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{t.texSubImage2D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ee(){try{t.texSubImage3D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ge(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Se(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ze(){try{t.texStorage2D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function le(){try{t.texStorage3D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Me(){try{t.texImage2D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ie(){try{t.texImage3D.apply(t,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Oe(L){se.equals(L)===!1&&(t.scissor(L.x,L.y,L.z,L.w),se.copy(L))}function we(L){G.equals(L)===!1&&(t.viewport(L.x,L.y,L.z,L.w),G.copy(L))}function Ke(L,me){let Y=d.get(me);Y===void 0&&(Y=new WeakMap,d.set(me,Y));let re=Y.get(L);re===void 0&&(re=t.getUniformBlockIndex(me,L.name),Y.set(L,re))}function Ge(L,me){const re=d.get(me).get(L);c.get(me)!==re&&(t.uniformBlockBinding(me,re,L.__bindingPointIndex),c.set(me,re))}function lt(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),h={},Z=null,ee={},p={},f=new WeakMap,m=[],x=null,_=!1,g=null,u=null,v=null,y=null,S=null,N=null,A=null,E=new $e(0,0,0),R=0,T=!1,M=null,P=null,X=null,F=null,K=null,se.set(0,0,t.canvas.width,t.canvas.height),G.set(0,0,t.canvas.width,t.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ne,disable:he,bindFramebuffer:pe,drawBuffers:O,useProgram:Re,setBlending:I,setMaterial:gt,setFlipSided:Ue,setCullFace:He,setLineWidth:De,setPolygonOffset:st,setScissorTest:Pe,activeTexture:C,bindTexture:w,unbindTexture:z,compressedTexImage2D:te,compressedTexImage3D:ae,texImage2D:Me,texImage3D:Ie,updateUBOMapping:Ke,uniformBlockBinding:Ge,texStorage2D:Ze,texStorage3D:le,texSubImage2D:J,texSubImage3D:Ee,compressedTexSubImage2D:ge,compressedTexSubImage3D:Se,scissor:Oe,viewport:we,reset:lt}}function mm(t,e,n,i){const r=CT(i);switch(n){case J0:return t*e;case tv:return t*e;case nv:return t*e*2;case iv:return t*e/r.components*r.byteLength;case Yf:return t*e/r.components*r.byteLength;case rv:return t*e*2/r.components*r.byteLength;case Kf:return t*e*2/r.components*r.byteLength;case ev:return t*e*3/r.components*r.byteLength;case jn:return t*e*4/r.components*r.byteLength;case Zf:return t*e*4/r.components*r.byteLength;case el:case tl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case nl:case il:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case vd:case yd:return Math.max(t,16)*Math.max(e,8)/4;case xd:case _d:return Math.max(t,8)*Math.max(e,8)/2;case Sd:case Md:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case wd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ed:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case bd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Td:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Ad:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Cd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Rd:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Nd:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Pd:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Dd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Ld:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Id:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case kd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Ud:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Od:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case rl:case Fd:case zd:return Math.ceil(t/4)*Math.ceil(e/4)*16;case sv:case Bd:return Math.ceil(t/4)*Math.ceil(e/4)*8;case jd:case Vd:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function CT(t){switch(t){case Ti:case K0:return{byteLength:1,components:1};case Fa:case Z0:case Wa:return{byteLength:2,components:1};case $f:case qf:return{byteLength:2,components:4};case Ir:case Xf:case vi:return{byteLength:4,components:1};case Q0:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function RT(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new ot,h=new WeakMap;let p;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,w){return m?new OffscreenCanvas(C,w):Dl("canvas")}function _(C,w,z){let te=1;const ae=Pe(C);if((ae.width>z||ae.height>z)&&(te=z/Math.max(ae.width,ae.height)),te<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const J=Math.floor(te*ae.width),Ee=Math.floor(te*ae.height);p===void 0&&(p=x(J,Ee));const ge=w?x(J,Ee):p;return ge.width=J,ge.height=Ee,ge.getContext("2d").drawImage(C,0,0,J,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ae.width+"x"+ae.height+") to ("+J+"x"+Ee+")."),ge}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ae.width+"x"+ae.height+")."),C;return C}function g(C){return C.generateMipmaps}function u(C){t.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?t.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function y(C,w,z,te,ae=!1){if(C!==null){if(t[C]!==void 0)return t[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let J=w;if(w===t.RED&&(z===t.FLOAT&&(J=t.R32F),z===t.HALF_FLOAT&&(J=t.R16F),z===t.UNSIGNED_BYTE&&(J=t.R8)),w===t.RED_INTEGER&&(z===t.UNSIGNED_BYTE&&(J=t.R8UI),z===t.UNSIGNED_SHORT&&(J=t.R16UI),z===t.UNSIGNED_INT&&(J=t.R32UI),z===t.BYTE&&(J=t.R8I),z===t.SHORT&&(J=t.R16I),z===t.INT&&(J=t.R32I)),w===t.RG&&(z===t.FLOAT&&(J=t.RG32F),z===t.HALF_FLOAT&&(J=t.RG16F),z===t.UNSIGNED_BYTE&&(J=t.RG8)),w===t.RG_INTEGER&&(z===t.UNSIGNED_BYTE&&(J=t.RG8UI),z===t.UNSIGNED_SHORT&&(J=t.RG16UI),z===t.UNSIGNED_INT&&(J=t.RG32UI),z===t.BYTE&&(J=t.RG8I),z===t.SHORT&&(J=t.RG16I),z===t.INT&&(J=t.RG32I)),w===t.RGB_INTEGER&&(z===t.UNSIGNED_BYTE&&(J=t.RGB8UI),z===t.UNSIGNED_SHORT&&(J=t.RGB16UI),z===t.UNSIGNED_INT&&(J=t.RGB32UI),z===t.BYTE&&(J=t.RGB8I),z===t.SHORT&&(J=t.RGB16I),z===t.INT&&(J=t.RGB32I)),w===t.RGBA_INTEGER&&(z===t.UNSIGNED_BYTE&&(J=t.RGBA8UI),z===t.UNSIGNED_SHORT&&(J=t.RGBA16UI),z===t.UNSIGNED_INT&&(J=t.RGBA32UI),z===t.BYTE&&(J=t.RGBA8I),z===t.SHORT&&(J=t.RGBA16I),z===t.INT&&(J=t.RGBA32I)),w===t.RGB&&z===t.UNSIGNED_INT_5_9_9_9_REV&&(J=t.RGB9_E5),w===t.RGBA){const Ee=ae?Ql:Qe.getTransfer(te);z===t.FLOAT&&(J=t.RGBA32F),z===t.HALF_FLOAT&&(J=t.RGBA16F),z===t.UNSIGNED_BYTE&&(J=Ee===at?t.SRGB8_ALPHA8:t.RGBA8),z===t.UNSIGNED_SHORT_4_4_4_4&&(J=t.RGBA4),z===t.UNSIGNED_SHORT_5_5_5_1&&(J=t.RGB5_A1)}return(J===t.R16F||J===t.R32F||J===t.RG16F||J===t.RG32F||J===t.RGBA16F||J===t.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function S(C,w){let z;return C?w===null||w===Ir||w===Is?z=t.DEPTH24_STENCIL8:w===vi?z=t.DEPTH32F_STENCIL8:w===Fa&&(z=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ir||w===Is?z=t.DEPTH_COMPONENT24:w===vi?z=t.DEPTH_COMPONENT32F:w===Fa&&(z=t.DEPTH_COMPONENT16),z}function N(C,w){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Gn&&C.minFilter!==Jn?Math.log2(Math.max(w.width,w.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?w.mipmaps.length:1}function A(C){const w=C.target;w.removeEventListener("dispose",A),R(w),w.isVideoTexture&&h.delete(w)}function E(C){const w=C.target;w.removeEventListener("dispose",E),M(w)}function R(C){const w=i.get(C);if(w.__webglInit===void 0)return;const z=C.source,te=f.get(z);if(te){const ae=te[w.__cacheKey];ae.usedTimes--,ae.usedTimes===0&&T(C),Object.keys(te).length===0&&f.delete(z)}i.remove(C)}function T(C){const w=i.get(C);t.deleteTexture(w.__webglTexture);const z=C.source,te=f.get(z);delete te[w.__cacheKey],a.memory.textures--}function M(C){const w=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(w.__webglFramebuffer[te]))for(let ae=0;ae<w.__webglFramebuffer[te].length;ae++)t.deleteFramebuffer(w.__webglFramebuffer[te][ae]);else t.deleteFramebuffer(w.__webglFramebuffer[te]);w.__webglDepthbuffer&&t.deleteRenderbuffer(w.__webglDepthbuffer[te])}else{if(Array.isArray(w.__webglFramebuffer))for(let te=0;te<w.__webglFramebuffer.length;te++)t.deleteFramebuffer(w.__webglFramebuffer[te]);else t.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&t.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&t.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let te=0;te<w.__webglColorRenderbuffer.length;te++)w.__webglColorRenderbuffer[te]&&t.deleteRenderbuffer(w.__webglColorRenderbuffer[te]);w.__webglDepthRenderbuffer&&t.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const z=C.textures;for(let te=0,ae=z.length;te<ae;te++){const J=i.get(z[te]);J.__webglTexture&&(t.deleteTexture(J.__webglTexture),a.memory.textures--),i.remove(z[te])}i.remove(C)}let P=0;function X(){P=0}function F(){const C=P;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),P+=1,C}function K(C){const w=[];return w.push(C.wrapS),w.push(C.wrapT),w.push(C.wrapR||0),w.push(C.magFilter),w.push(C.minFilter),w.push(C.anisotropy),w.push(C.internalFormat),w.push(C.format),w.push(C.type),w.push(C.generateMipmaps),w.push(C.premultiplyAlpha),w.push(C.flipY),w.push(C.unpackAlignment),w.push(C.colorSpace),w.join()}function $(C,w){const z=i.get(C);if(C.isVideoTexture&&De(C),C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){const te=C.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{G(z,C,w);return}}n.bindTexture(t.TEXTURE_2D,z.__webglTexture,t.TEXTURE0+w)}function q(C,w){const z=i.get(C);if(C.version>0&&z.__version!==C.version){G(z,C,w);return}n.bindTexture(t.TEXTURE_2D_ARRAY,z.__webglTexture,t.TEXTURE0+w)}function Q(C,w){const z=i.get(C);if(C.version>0&&z.__version!==C.version){G(z,C,w);return}n.bindTexture(t.TEXTURE_3D,z.__webglTexture,t.TEXTURE0+w)}function D(C,w){const z=i.get(C);if(C.version>0&&z.__version!==C.version){ie(z,C,w);return}n.bindTexture(t.TEXTURE_CUBE_MAP,z.__webglTexture,t.TEXTURE0+w)}const Z={[md]:t.REPEAT,[br]:t.CLAMP_TO_EDGE,[gd]:t.MIRRORED_REPEAT},ee={[Gn]:t.NEAREST,[p1]:t.NEAREST_MIPMAP_NEAREST,[vo]:t.NEAREST_MIPMAP_LINEAR,[Jn]:t.LINEAR,[Nc]:t.LINEAR_MIPMAP_NEAREST,[Tr]:t.LINEAR_MIPMAP_LINEAR},ue={[_1]:t.NEVER,[b1]:t.ALWAYS,[y1]:t.LESS,[av]:t.LEQUAL,[S1]:t.EQUAL,[E1]:t.GEQUAL,[M1]:t.GREATER,[w1]:t.NOTEQUAL};function B(C,w){if(w.type===vi&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===Jn||w.magFilter===Nc||w.magFilter===vo||w.magFilter===Tr||w.minFilter===Jn||w.minFilter===Nc||w.minFilter===vo||w.minFilter===Tr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(C,t.TEXTURE_WRAP_S,Z[w.wrapS]),t.texParameteri(C,t.TEXTURE_WRAP_T,Z[w.wrapT]),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,Z[w.wrapR]),t.texParameteri(C,t.TEXTURE_MAG_FILTER,ee[w.magFilter]),t.texParameteri(C,t.TEXTURE_MIN_FILTER,ee[w.minFilter]),w.compareFunction&&(t.texParameteri(C,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(C,t.TEXTURE_COMPARE_FUNC,ue[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Gn||w.minFilter!==vo&&w.minFilter!==Tr||w.type===vi&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");t.texParameterf(C,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,r.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function se(C,w){let z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,w.addEventListener("dispose",A));const te=w.source;let ae=f.get(te);ae===void 0&&(ae={},f.set(te,ae));const J=K(w);if(J!==C.__cacheKey){ae[J]===void 0&&(ae[J]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,z=!0),ae[J].usedTimes++;const Ee=ae[C.__cacheKey];Ee!==void 0&&(ae[C.__cacheKey].usedTimes--,Ee.usedTimes===0&&T(w)),C.__cacheKey=J,C.__webglTexture=ae[J].texture}return z}function G(C,w,z){let te=t.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(te=t.TEXTURE_2D_ARRAY),w.isData3DTexture&&(te=t.TEXTURE_3D);const ae=se(C,w),J=w.source;n.bindTexture(te,C.__webglTexture,t.TEXTURE0+z);const Ee=i.get(J);if(J.version!==Ee.__version||ae===!0){n.activeTexture(t.TEXTURE0+z);const ge=Qe.getPrimaries(Qe.workingColorSpace),Se=w.colorSpace===Vi?null:Qe.getPrimaries(w.colorSpace),Ze=w.colorSpace===Vi||ge===Se?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ze);let le=_(w.image,!1,r.maxTextureSize);le=st(w,le);const Me=s.convert(w.format,w.colorSpace),Ie=s.convert(w.type);let Oe=y(w.internalFormat,Me,Ie,w.colorSpace,w.isVideoTexture);B(te,w);let we;const Ke=w.mipmaps,Ge=w.isVideoTexture!==!0,lt=Ee.__version===void 0||ae===!0,L=J.dataReady,me=N(w,le);if(w.isDepthTexture)Oe=S(w.format===ks,w.type),lt&&(Ge?n.texStorage2D(t.TEXTURE_2D,1,Oe,le.width,le.height):n.texImage2D(t.TEXTURE_2D,0,Oe,le.width,le.height,0,Me,Ie,null));else if(w.isDataTexture)if(Ke.length>0){Ge&&lt&&n.texStorage2D(t.TEXTURE_2D,me,Oe,Ke[0].width,Ke[0].height);for(let Y=0,re=Ke.length;Y<re;Y++)we=Ke[Y],Ge?L&&n.texSubImage2D(t.TEXTURE_2D,Y,0,0,we.width,we.height,Me,Ie,we.data):n.texImage2D(t.TEXTURE_2D,Y,Oe,we.width,we.height,0,Me,Ie,we.data);w.generateMipmaps=!1}else Ge?(lt&&n.texStorage2D(t.TEXTURE_2D,me,Oe,le.width,le.height),L&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,le.width,le.height,Me,Ie,le.data)):n.texImage2D(t.TEXTURE_2D,0,Oe,le.width,le.height,0,Me,Ie,le.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Ge&&lt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,me,Oe,Ke[0].width,Ke[0].height,le.depth);for(let Y=0,re=Ke.length;Y<re;Y++)if(we=Ke[Y],w.format!==jn)if(Me!==null)if(Ge){if(L)if(w.layerUpdates.size>0){const _e=mm(we.width,we.height,w.format,w.type);for(const xe of w.layerUpdates){const Be=we.data.subarray(xe*_e/we.data.BYTES_PER_ELEMENT,(xe+1)*_e/we.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,Y,0,0,xe,we.width,we.height,1,Me,Be)}w.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,Y,0,0,0,we.width,we.height,le.depth,Me,we.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,Y,Oe,we.width,we.height,le.depth,0,we.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ge?L&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,Y,0,0,0,we.width,we.height,le.depth,Me,Ie,we.data):n.texImage3D(t.TEXTURE_2D_ARRAY,Y,Oe,we.width,we.height,le.depth,0,Me,Ie,we.data)}else{Ge&&lt&&n.texStorage2D(t.TEXTURE_2D,me,Oe,Ke[0].width,Ke[0].height);for(let Y=0,re=Ke.length;Y<re;Y++)we=Ke[Y],w.format!==jn?Me!==null?Ge?L&&n.compressedTexSubImage2D(t.TEXTURE_2D,Y,0,0,we.width,we.height,Me,we.data):n.compressedTexImage2D(t.TEXTURE_2D,Y,Oe,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ge?L&&n.texSubImage2D(t.TEXTURE_2D,Y,0,0,we.width,we.height,Me,Ie,we.data):n.texImage2D(t.TEXTURE_2D,Y,Oe,we.width,we.height,0,Me,Ie,we.data)}else if(w.isDataArrayTexture)if(Ge){if(lt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,me,Oe,le.width,le.height,le.depth),L)if(w.layerUpdates.size>0){const Y=mm(le.width,le.height,w.format,w.type);for(const re of w.layerUpdates){const _e=le.data.subarray(re*Y/le.data.BYTES_PER_ELEMENT,(re+1)*Y/le.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,re,le.width,le.height,1,Me,Ie,_e)}w.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,Me,Ie,le.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Oe,le.width,le.height,le.depth,0,Me,Ie,le.data);else if(w.isData3DTexture)Ge?(lt&&n.texStorage3D(t.TEXTURE_3D,me,Oe,le.width,le.height,le.depth),L&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,Me,Ie,le.data)):n.texImage3D(t.TEXTURE_3D,0,Oe,le.width,le.height,le.depth,0,Me,Ie,le.data);else if(w.isFramebufferTexture){if(lt)if(Ge)n.texStorage2D(t.TEXTURE_2D,me,Oe,le.width,le.height);else{let Y=le.width,re=le.height;for(let _e=0;_e<me;_e++)n.texImage2D(t.TEXTURE_2D,_e,Oe,Y,re,0,Me,Ie,null),Y>>=1,re>>=1}}else if(Ke.length>0){if(Ge&&lt){const Y=Pe(Ke[0]);n.texStorage2D(t.TEXTURE_2D,me,Oe,Y.width,Y.height)}for(let Y=0,re=Ke.length;Y<re;Y++)we=Ke[Y],Ge?L&&n.texSubImage2D(t.TEXTURE_2D,Y,0,0,Me,Ie,we):n.texImage2D(t.TEXTURE_2D,Y,Oe,Me,Ie,we);w.generateMipmaps=!1}else if(Ge){if(lt){const Y=Pe(le);n.texStorage2D(t.TEXTURE_2D,me,Oe,Y.width,Y.height)}L&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,Me,Ie,le)}else n.texImage2D(t.TEXTURE_2D,0,Oe,Me,Ie,le);g(w)&&u(te),Ee.__version=J.version,w.onUpdate&&w.onUpdate(w)}C.__version=w.version}function ie(C,w,z){if(w.image.length!==6)return;const te=se(C,w),ae=w.source;n.bindTexture(t.TEXTURE_CUBE_MAP,C.__webglTexture,t.TEXTURE0+z);const J=i.get(ae);if(ae.version!==J.__version||te===!0){n.activeTexture(t.TEXTURE0+z);const Ee=Qe.getPrimaries(Qe.workingColorSpace),ge=w.colorSpace===Vi?null:Qe.getPrimaries(w.colorSpace),Se=w.colorSpace===Vi||Ee===ge?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);const Ze=w.isCompressedTexture||w.image[0].isCompressedTexture,le=w.image[0]&&w.image[0].isDataTexture,Me=[];for(let re=0;re<6;re++)!Ze&&!le?Me[re]=_(w.image[re],!0,r.maxCubemapSize):Me[re]=le?w.image[re].image:w.image[re],Me[re]=st(w,Me[re]);const Ie=Me[0],Oe=s.convert(w.format,w.colorSpace),we=s.convert(w.type),Ke=y(w.internalFormat,Oe,we,w.colorSpace),Ge=w.isVideoTexture!==!0,lt=J.__version===void 0||te===!0,L=ae.dataReady;let me=N(w,Ie);B(t.TEXTURE_CUBE_MAP,w);let Y;if(Ze){Ge&&lt&&n.texStorage2D(t.TEXTURE_CUBE_MAP,me,Ke,Ie.width,Ie.height);for(let re=0;re<6;re++){Y=Me[re].mipmaps;for(let _e=0;_e<Y.length;_e++){const xe=Y[_e];w.format!==jn?Oe!==null?Ge?L&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,_e,0,0,xe.width,xe.height,Oe,xe.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,_e,Ke,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ge?L&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,_e,0,0,xe.width,xe.height,Oe,we,xe.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,_e,Ke,xe.width,xe.height,0,Oe,we,xe.data)}}}else{if(Y=w.mipmaps,Ge&&lt){Y.length>0&&me++;const re=Pe(Me[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,me,Ke,re.width,re.height)}for(let re=0;re<6;re++)if(le){Ge?L&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Me[re].width,Me[re].height,Oe,we,Me[re].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ke,Me[re].width,Me[re].height,0,Oe,we,Me[re].data);for(let _e=0;_e<Y.length;_e++){const Be=Y[_e].image[re].image;Ge?L&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,_e+1,0,0,Be.width,Be.height,Oe,we,Be.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,_e+1,Ke,Be.width,Be.height,0,Oe,we,Be.data)}}else{Ge?L&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Oe,we,Me[re]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ke,Oe,we,Me[re]);for(let _e=0;_e<Y.length;_e++){const xe=Y[_e];Ge?L&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,_e+1,0,0,Oe,we,xe.image[re]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,_e+1,Ke,Oe,we,xe.image[re])}}}g(w)&&u(t.TEXTURE_CUBE_MAP),J.__version=ae.version,w.onUpdate&&w.onUpdate(w)}C.__version=w.version}function de(C,w,z,te,ae,J){const Ee=s.convert(z.format,z.colorSpace),ge=s.convert(z.type),Se=y(z.internalFormat,Ee,ge,z.colorSpace),Ze=i.get(w),le=i.get(z);if(le.__renderTarget=w,!Ze.__hasExternalTextures){const Me=Math.max(1,w.width>>J),Ie=Math.max(1,w.height>>J);ae===t.TEXTURE_3D||ae===t.TEXTURE_2D_ARRAY?n.texImage3D(ae,J,Se,Me,Ie,w.depth,0,Ee,ge,null):n.texImage2D(ae,J,Se,Me,Ie,0,Ee,ge,null)}n.bindFramebuffer(t.FRAMEBUFFER,C),He(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,te,ae,le.__webglTexture,0,Ue(w)):(ae===t.TEXTURE_2D||ae>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ae<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,te,ae,le.__webglTexture,J),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ne(C,w,z){if(t.bindRenderbuffer(t.RENDERBUFFER,C),w.depthBuffer){const te=w.depthTexture,ae=te&&te.isDepthTexture?te.type:null,J=S(w.stencilBuffer,ae),Ee=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ge=Ue(w);He(w)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ge,J,w.width,w.height):z?t.renderbufferStorageMultisample(t.RENDERBUFFER,ge,J,w.width,w.height):t.renderbufferStorage(t.RENDERBUFFER,J,w.width,w.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Ee,t.RENDERBUFFER,C)}else{const te=w.textures;for(let ae=0;ae<te.length;ae++){const J=te[ae],Ee=s.convert(J.format,J.colorSpace),ge=s.convert(J.type),Se=y(J.internalFormat,Ee,ge,J.colorSpace),Ze=Ue(w);z&&He(w)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ze,Se,w.width,w.height):He(w)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ze,Se,w.width,w.height):t.renderbufferStorage(t.RENDERBUFFER,Se,w.width,w.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function he(C,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,C),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const te=i.get(w.depthTexture);te.__renderTarget=w,(!te.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),$(w.depthTexture,0);const ae=te.__webglTexture,J=Ue(w);if(w.depthTexture.format===Ms)He(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,ae,0,J):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,ae,0);else if(w.depthTexture.format===ks)He(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,ae,0,J):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,ae,0);else throw new Error("Unknown depthTexture format")}function pe(C){const w=i.get(C),z=C.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==C.depthTexture){const te=C.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),te){const ae=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,te.removeEventListener("dispose",ae)};te.addEventListener("dispose",ae),w.__depthDisposeCallback=ae}w.__boundDepthTexture=te}if(C.depthTexture&&!w.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");he(w.__webglFramebuffer,C)}else if(z){w.__webglDepthbuffer=[];for(let te=0;te<6;te++)if(n.bindFramebuffer(t.FRAMEBUFFER,w.__webglFramebuffer[te]),w.__webglDepthbuffer[te]===void 0)w.__webglDepthbuffer[te]=t.createRenderbuffer(),ne(w.__webglDepthbuffer[te],C,!1);else{const ae=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,J=w.__webglDepthbuffer[te];t.bindRenderbuffer(t.RENDERBUFFER,J),t.framebufferRenderbuffer(t.FRAMEBUFFER,ae,t.RENDERBUFFER,J)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=t.createRenderbuffer(),ne(w.__webglDepthbuffer,C,!1);else{const te=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ae=w.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,ae),t.framebufferRenderbuffer(t.FRAMEBUFFER,te,t.RENDERBUFFER,ae)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function O(C,w,z){const te=i.get(C);w!==void 0&&de(te.__webglFramebuffer,C,C.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),z!==void 0&&pe(C)}function Re(C){const w=C.texture,z=i.get(C),te=i.get(w);C.addEventListener("dispose",E);const ae=C.textures,J=C.isWebGLCubeRenderTarget===!0,Ee=ae.length>1;if(Ee||(te.__webglTexture===void 0&&(te.__webglTexture=t.createTexture()),te.__version=w.version,a.memory.textures++),J){z.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)if(w.mipmaps&&w.mipmaps.length>0){z.__webglFramebuffer[ge]=[];for(let Se=0;Se<w.mipmaps.length;Se++)z.__webglFramebuffer[ge][Se]=t.createFramebuffer()}else z.__webglFramebuffer[ge]=t.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){z.__webglFramebuffer=[];for(let ge=0;ge<w.mipmaps.length;ge++)z.__webglFramebuffer[ge]=t.createFramebuffer()}else z.__webglFramebuffer=t.createFramebuffer();if(Ee)for(let ge=0,Se=ae.length;ge<Se;ge++){const Ze=i.get(ae[ge]);Ze.__webglTexture===void 0&&(Ze.__webglTexture=t.createTexture(),a.memory.textures++)}if(C.samples>0&&He(C)===!1){z.__webglMultisampledFramebuffer=t.createFramebuffer(),z.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ge=0;ge<ae.length;ge++){const Se=ae[ge];z.__webglColorRenderbuffer[ge]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,z.__webglColorRenderbuffer[ge]);const Ze=s.convert(Se.format,Se.colorSpace),le=s.convert(Se.type),Me=y(Se.internalFormat,Ze,le,Se.colorSpace,C.isXRRenderTarget===!0),Ie=Ue(C);t.renderbufferStorageMultisample(t.RENDERBUFFER,Ie,Me,C.width,C.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ge,t.RENDERBUFFER,z.__webglColorRenderbuffer[ge])}t.bindRenderbuffer(t.RENDERBUFFER,null),C.depthBuffer&&(z.__webglDepthRenderbuffer=t.createRenderbuffer(),ne(z.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(J){n.bindTexture(t.TEXTURE_CUBE_MAP,te.__webglTexture),B(t.TEXTURE_CUBE_MAP,w);for(let ge=0;ge<6;ge++)if(w.mipmaps&&w.mipmaps.length>0)for(let Se=0;Se<w.mipmaps.length;Se++)de(z.__webglFramebuffer[ge][Se],C,w,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Se);else de(z.__webglFramebuffer[ge],C,w,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0);g(w)&&u(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ee){for(let ge=0,Se=ae.length;ge<Se;ge++){const Ze=ae[ge],le=i.get(Ze);n.bindTexture(t.TEXTURE_2D,le.__webglTexture),B(t.TEXTURE_2D,Ze),de(z.__webglFramebuffer,C,Ze,t.COLOR_ATTACHMENT0+ge,t.TEXTURE_2D,0),g(Ze)&&u(t.TEXTURE_2D)}n.unbindTexture()}else{let ge=t.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ge=C.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ge,te.__webglTexture),B(ge,w),w.mipmaps&&w.mipmaps.length>0)for(let Se=0;Se<w.mipmaps.length;Se++)de(z.__webglFramebuffer[Se],C,w,t.COLOR_ATTACHMENT0,ge,Se);else de(z.__webglFramebuffer,C,w,t.COLOR_ATTACHMENT0,ge,0);g(w)&&u(ge),n.unbindTexture()}C.depthBuffer&&pe(C)}function Ne(C){const w=C.textures;for(let z=0,te=w.length;z<te;z++){const ae=w[z];if(g(ae)){const J=v(C),Ee=i.get(ae).__webglTexture;n.bindTexture(J,Ee),u(J),n.unbindTexture()}}}const Xe=[],I=[];function gt(C){if(C.samples>0){if(He(C)===!1){const w=C.textures,z=C.width,te=C.height;let ae=t.COLOR_BUFFER_BIT;const J=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ee=i.get(C),ge=w.length>1;if(ge)for(let Se=0;Se<w.length;Se++)n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Se,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Se,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let Se=0;Se<w.length;Se++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ae|=t.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ae|=t.STENCIL_BUFFER_BIT)),ge){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ee.__webglColorRenderbuffer[Se]);const Ze=i.get(w[Se]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ze,0)}t.blitFramebuffer(0,0,z,te,0,0,z,te,ae,t.NEAREST),c===!0&&(Xe.length=0,I.length=0,Xe.push(t.COLOR_ATTACHMENT0+Se),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Xe.push(J),I.push(J),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,I)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Xe))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ge)for(let Se=0;Se<w.length;Se++){n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Se,t.RENDERBUFFER,Ee.__webglColorRenderbuffer[Se]);const Ze=i.get(w[Se]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Se,t.TEXTURE_2D,Ze,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const w=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[w])}}}function Ue(C){return Math.min(r.maxSamples,C.samples)}function He(C){const w=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function De(C){const w=a.render.frame;h.get(C)!==w&&(h.set(C,w),C.update())}function st(C,w){const z=C.colorSpace,te=C.format,ae=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||z!==Bs&&z!==Vi&&(Qe.getTransfer(z)===at?(te!==jn||ae!==Ti)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),w}function Pe(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(d.width=C.naturalWidth||C.width,d.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(d.width=C.displayWidth,d.height=C.displayHeight):(d.width=C.width,d.height=C.height),d}this.allocateTextureUnit=F,this.resetTextureUnits=X,this.setTexture2D=$,this.setTexture2DArray=q,this.setTexture3D=Q,this.setTextureCube=D,this.rebindTextures=O,this.setupRenderTarget=Re,this.updateRenderTargetMipmap=Ne,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=pe,this.setupFrameBufferTexture=de,this.useMultisampledRTT=He}function NT(t,e){function n(i,r=Vi){let s;const a=Qe.getTransfer(r);if(i===Ti)return t.UNSIGNED_BYTE;if(i===$f)return t.UNSIGNED_SHORT_4_4_4_4;if(i===qf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===Q0)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===K0)return t.BYTE;if(i===Z0)return t.SHORT;if(i===Fa)return t.UNSIGNED_SHORT;if(i===Xf)return t.INT;if(i===Ir)return t.UNSIGNED_INT;if(i===vi)return t.FLOAT;if(i===Wa)return t.HALF_FLOAT;if(i===J0)return t.ALPHA;if(i===ev)return t.RGB;if(i===jn)return t.RGBA;if(i===tv)return t.LUMINANCE;if(i===nv)return t.LUMINANCE_ALPHA;if(i===Ms)return t.DEPTH_COMPONENT;if(i===ks)return t.DEPTH_STENCIL;if(i===iv)return t.RED;if(i===Yf)return t.RED_INTEGER;if(i===rv)return t.RG;if(i===Kf)return t.RG_INTEGER;if(i===Zf)return t.RGBA_INTEGER;if(i===el||i===tl||i===nl||i===il)if(a===at)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===el)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===tl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===nl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===il)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===el)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===tl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===nl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===il)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===xd||i===vd||i===_d||i===yd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===xd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===vd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===_d)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===yd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Sd||i===Md||i===wd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Sd||i===Md)return a===at?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===wd)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ed||i===bd||i===Td||i===Ad||i===Cd||i===Rd||i===Nd||i===Pd||i===Dd||i===Ld||i===Id||i===kd||i===Ud||i===Od)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ed)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===bd)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Td)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ad)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Cd)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Rd)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Nd)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Pd)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Dd)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ld)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Id)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===kd)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ud)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Od)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===rl||i===Fd||i===zd)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===rl)return a===at?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Fd)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===zd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===sv||i===Bd||i===jd||i===Vd)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===rl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Bd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===jd)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Vd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Is?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class PT extends bn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ua extends cn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const DT={type:"move"};class su{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ua,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ua,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ua,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,d=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(d&&e.hand){a=!0;for(const _ of e.hand.values()){const g=n.getJointPose(_,i),u=this._getHandJoint(d,_);g!==null&&(u.matrix.fromArray(g.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=g.radius),u.visible=g!==null}const h=d.joints["index-finger-tip"],p=d.joints["thumb-tip"],f=h.position.distanceTo(p.position),m=.02,x=.005;d.inputState.pinching&&f>m+x?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&f<=m-x&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(DT)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),d!==null&&(d.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new ua;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const LT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,IT=`
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

}`;class kT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new ln,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new rr({vertexShader:LT,fragmentShader:IT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new ei(new ec(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class UT extends js{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",c=1,d=null,h=null,p=null,f=null,m=null,x=null;const _=new kT,g=n.getContextAttributes();let u=null,v=null;const y=[],S=[],N=new ot;let A=null;const E=new bn;E.viewport=new Et;const R=new bn;R.viewport=new Et;const T=[E,R],M=new PT;let P=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let ie=y[G];return ie===void 0&&(ie=new su,y[G]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(G){let ie=y[G];return ie===void 0&&(ie=new su,y[G]=ie),ie.getGripSpace()},this.getHand=function(G){let ie=y[G];return ie===void 0&&(ie=new su,y[G]=ie),ie.getHandSpace()};function F(G){const ie=S.indexOf(G.inputSource);if(ie===-1)return;const de=y[ie];de!==void 0&&(de.update(G.inputSource,G.frame,d||a),de.dispatchEvent({type:G.type,data:G.inputSource}))}function K(){r.removeEventListener("select",F),r.removeEventListener("selectstart",F),r.removeEventListener("selectend",F),r.removeEventListener("squeeze",F),r.removeEventListener("squeezestart",F),r.removeEventListener("squeezeend",F),r.removeEventListener("end",K),r.removeEventListener("inputsourceschange",$);for(let G=0;G<y.length;G++){const ie=S[G];ie!==null&&(S[G]=null,y[G].disconnect(ie))}P=null,X=null,_.reset(),e.setRenderTarget(u),m=null,f=null,p=null,r=null,v=null,se.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(N.width,N.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){s=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){o=G,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||a},this.setReferenceSpace=function(G){d=G},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return p},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(G){if(r=G,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",F),r.addEventListener("selectstart",F),r.addEventListener("selectend",F),r.addEventListener("squeeze",F),r.addEventListener("squeezestart",F),r.addEventListener("squeezeend",F),r.addEventListener("end",K),r.addEventListener("inputsourceschange",$),g.xrCompatible!==!0&&await n.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(N),r.renderState.layers===void 0){const ie={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,n,ie),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),v=new kr(m.framebufferWidth,m.framebufferHeight,{format:jn,type:Ti,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let ie=null,de=null,ne=null;g.depth&&(ne=g.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ie=g.stencil?ks:Ms,de=g.stencil?Is:Ir);const he={colorFormat:n.RGBA8,depthFormat:ne,scaleFactor:s};p=new XRWebGLBinding(r,n),f=p.createProjectionLayer(he),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new kr(f.textureWidth,f.textureHeight,{format:jn,type:Ti,depthTexture:new yv(f.textureWidth,f.textureHeight,de,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),d=null,a=await r.requestReferenceSpace(o),se.setContext(r),se.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function $(G){for(let ie=0;ie<G.removed.length;ie++){const de=G.removed[ie],ne=S.indexOf(de);ne>=0&&(S[ne]=null,y[ne].disconnect(de))}for(let ie=0;ie<G.added.length;ie++){const de=G.added[ie];let ne=S.indexOf(de);if(ne===-1){for(let pe=0;pe<y.length;pe++)if(pe>=S.length){S.push(de),ne=pe;break}else if(S[pe]===null){S[pe]=de,ne=pe;break}if(ne===-1)break}const he=y[ne];he&&he.connect(de)}}const q=new H,Q=new H;function D(G,ie,de){q.setFromMatrixPosition(ie.matrixWorld),Q.setFromMatrixPosition(de.matrixWorld);const ne=q.distanceTo(Q),he=ie.projectionMatrix.elements,pe=de.projectionMatrix.elements,O=he[14]/(he[10]-1),Re=he[14]/(he[10]+1),Ne=(he[9]+1)/he[5],Xe=(he[9]-1)/he[5],I=(he[8]-1)/he[0],gt=(pe[8]+1)/pe[0],Ue=O*I,He=O*gt,De=ne/(-I+gt),st=De*-I;if(ie.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(st),G.translateZ(De),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert(),he[10]===-1)G.projectionMatrix.copy(ie.projectionMatrix),G.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const Pe=O+De,C=Re+De,w=Ue-st,z=He+(ne-st),te=Ne*Re/C*Pe,ae=Xe*Re/C*Pe;G.projectionMatrix.makePerspective(w,z,te,ae,Pe,C),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}}function Z(G,ie){ie===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(ie.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(r===null)return;let ie=G.near,de=G.far;_.texture!==null&&(_.depthNear>0&&(ie=_.depthNear),_.depthFar>0&&(de=_.depthFar)),M.near=R.near=E.near=ie,M.far=R.far=E.far=de,(P!==M.near||X!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,X=M.far),E.layers.mask=G.layers.mask|2,R.layers.mask=G.layers.mask|4,M.layers.mask=E.layers.mask|R.layers.mask;const ne=G.parent,he=M.cameras;Z(M,ne);for(let pe=0;pe<he.length;pe++)Z(he[pe],ne);he.length===2?D(M,E,R):M.projectionMatrix.copy(E.projectionMatrix),ee(G,M,ne)};function ee(G,ie,de){de===null?G.matrix.copy(ie.matrixWorld):(G.matrix.copy(de.matrixWorld),G.matrix.invert(),G.matrix.multiply(ie.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(ie.projectionMatrix),G.projectionMatrixInverse.copy(ie.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=Hd*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&m===null))return c},this.setFoveation=function(G){c=G,f!==null&&(f.fixedFoveation=G),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=G)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let ue=null;function B(G,ie){if(h=ie.getViewerPose(d||a),x=ie,h!==null){const de=h.views;m!==null&&(e.setRenderTargetFramebuffer(v,m.framebuffer),e.setRenderTarget(v));let ne=!1;de.length!==M.cameras.length&&(M.cameras.length=0,ne=!0);for(let pe=0;pe<de.length;pe++){const O=de[pe];let Re=null;if(m!==null)Re=m.getViewport(O);else{const Xe=p.getViewSubImage(f,O);Re=Xe.viewport,pe===0&&(e.setRenderTargetTextures(v,Xe.colorTexture,f.ignoreDepthValues?void 0:Xe.depthStencilTexture),e.setRenderTarget(v))}let Ne=T[pe];Ne===void 0&&(Ne=new bn,Ne.layers.enable(pe),Ne.viewport=new Et,T[pe]=Ne),Ne.matrix.fromArray(O.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(O.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(Re.x,Re.y,Re.width,Re.height),pe===0&&(M.matrix.copy(Ne.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ne===!0&&M.cameras.push(Ne)}const he=r.enabledFeatures;if(he&&he.includes("depth-sensing")){const pe=p.getDepthInformation(de[0]);pe&&pe.isValid&&pe.texture&&_.init(e,pe,r.renderState)}}for(let de=0;de<y.length;de++){const ne=S[de],he=y[de];ne!==null&&he!==void 0&&he.update(ne,ie,d||a)}ue&&ue(G,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),x=null}const se=new _v;se.setAnimationLoop(B),this.setAnimationLoop=function(G){ue=G},this.dispose=function(){}}}const mr=new Ai,OT=new bt;function FT(t,e){function n(g,u){g.matrixAutoUpdate===!0&&g.updateMatrix(),u.value.copy(g.matrix)}function i(g,u){u.color.getRGB(g.fogColor.value,mv(t)),u.isFog?(g.fogNear.value=u.near,g.fogFar.value=u.far):u.isFogExp2&&(g.fogDensity.value=u.density)}function r(g,u,v,y,S){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(g,u):u.isMeshToonMaterial?(s(g,u),p(g,u)):u.isMeshPhongMaterial?(s(g,u),h(g,u)):u.isMeshStandardMaterial?(s(g,u),f(g,u),u.isMeshPhysicalMaterial&&m(g,u,S)):u.isMeshMatcapMaterial?(s(g,u),x(g,u)):u.isMeshDepthMaterial?s(g,u):u.isMeshDistanceMaterial?(s(g,u),_(g,u)):u.isMeshNormalMaterial?s(g,u):u.isLineBasicMaterial?(a(g,u),u.isLineDashedMaterial&&o(g,u)):u.isPointsMaterial?c(g,u,v,y):u.isSpriteMaterial?d(g,u):u.isShadowMaterial?(g.color.value.copy(u.color),g.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(g,u){g.opacity.value=u.opacity,u.color&&g.diffuse.value.copy(u.color),u.emissive&&g.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(g.map.value=u.map,n(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,n(u.alphaMap,g.alphaMapTransform)),u.bumpMap&&(g.bumpMap.value=u.bumpMap,n(u.bumpMap,g.bumpMapTransform),g.bumpScale.value=u.bumpScale,u.side===on&&(g.bumpScale.value*=-1)),u.normalMap&&(g.normalMap.value=u.normalMap,n(u.normalMap,g.normalMapTransform),g.normalScale.value.copy(u.normalScale),u.side===on&&g.normalScale.value.negate()),u.displacementMap&&(g.displacementMap.value=u.displacementMap,n(u.displacementMap,g.displacementMapTransform),g.displacementScale.value=u.displacementScale,g.displacementBias.value=u.displacementBias),u.emissiveMap&&(g.emissiveMap.value=u.emissiveMap,n(u.emissiveMap,g.emissiveMapTransform)),u.specularMap&&(g.specularMap.value=u.specularMap,n(u.specularMap,g.specularMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest);const v=e.get(u),y=v.envMap,S=v.envMapRotation;y&&(g.envMap.value=y,mr.copy(S),mr.x*=-1,mr.y*=-1,mr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(mr.y*=-1,mr.z*=-1),g.envMapRotation.value.setFromMatrix4(OT.makeRotationFromEuler(mr)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=u.reflectivity,g.ior.value=u.ior,g.refractionRatio.value=u.refractionRatio),u.lightMap&&(g.lightMap.value=u.lightMap,g.lightMapIntensity.value=u.lightMapIntensity,n(u.lightMap,g.lightMapTransform)),u.aoMap&&(g.aoMap.value=u.aoMap,g.aoMapIntensity.value=u.aoMapIntensity,n(u.aoMap,g.aoMapTransform))}function a(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,u.map&&(g.map.value=u.map,n(u.map,g.mapTransform))}function o(g,u){g.dashSize.value=u.dashSize,g.totalSize.value=u.dashSize+u.gapSize,g.scale.value=u.scale}function c(g,u,v,y){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.size.value=u.size*v,g.scale.value=y*.5,u.map&&(g.map.value=u.map,n(u.map,g.uvTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,n(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function d(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.rotation.value=u.rotation,u.map&&(g.map.value=u.map,n(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,n(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function h(g,u){g.specular.value.copy(u.specular),g.shininess.value=Math.max(u.shininess,1e-4)}function p(g,u){u.gradientMap&&(g.gradientMap.value=u.gradientMap)}function f(g,u){g.metalness.value=u.metalness,u.metalnessMap&&(g.metalnessMap.value=u.metalnessMap,n(u.metalnessMap,g.metalnessMapTransform)),g.roughness.value=u.roughness,u.roughnessMap&&(g.roughnessMap.value=u.roughnessMap,n(u.roughnessMap,g.roughnessMapTransform)),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)}function m(g,u,v){g.ior.value=u.ior,u.sheen>0&&(g.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),g.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(g.sheenColorMap.value=u.sheenColorMap,n(u.sheenColorMap,g.sheenColorMapTransform)),u.sheenRoughnessMap&&(g.sheenRoughnessMap.value=u.sheenRoughnessMap,n(u.sheenRoughnessMap,g.sheenRoughnessMapTransform))),u.clearcoat>0&&(g.clearcoat.value=u.clearcoat,g.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(g.clearcoatMap.value=u.clearcoatMap,n(u.clearcoatMap,g.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,n(u.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(g.clearcoatNormalMap.value=u.clearcoatNormalMap,n(u.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===on&&g.clearcoatNormalScale.value.negate())),u.dispersion>0&&(g.dispersion.value=u.dispersion),u.iridescence>0&&(g.iridescence.value=u.iridescence,g.iridescenceIOR.value=u.iridescenceIOR,g.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(g.iridescenceMap.value=u.iridescenceMap,n(u.iridescenceMap,g.iridescenceMapTransform)),u.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=u.iridescenceThicknessMap,n(u.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),u.transmission>0&&(g.transmission.value=u.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),u.transmissionMap&&(g.transmissionMap.value=u.transmissionMap,n(u.transmissionMap,g.transmissionMapTransform)),g.thickness.value=u.thickness,u.thicknessMap&&(g.thicknessMap.value=u.thicknessMap,n(u.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=u.attenuationDistance,g.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(g.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(g.anisotropyMap.value=u.anisotropyMap,n(u.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=u.specularIntensity,g.specularColor.value.copy(u.specularColor),u.specularColorMap&&(g.specularColorMap.value=u.specularColorMap,n(u.specularColorMap,g.specularColorMapTransform)),u.specularIntensityMap&&(g.specularIntensityMap.value=u.specularIntensityMap,n(u.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,u){u.matcap&&(g.matcap.value=u.matcap)}function _(g,u){const v=e.get(u).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function zT(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,y){const S=y.program;i.uniformBlockBinding(v,S)}function d(v,y){let S=r[v.id];S===void 0&&(x(v),S=h(v),r[v.id]=S,v.addEventListener("dispose",g));const N=y.program;i.updateUBOMapping(v,N);const A=e.render.frame;s[v.id]!==A&&(f(v),s[v.id]=A)}function h(v){const y=p();v.__bindingPointIndex=y;const S=t.createBuffer(),N=v.__size,A=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,S),t.bufferData(t.UNIFORM_BUFFER,N,A),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,y,S),S}function p(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const y=r[v.id],S=v.uniforms,N=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,y);for(let A=0,E=S.length;A<E;A++){const R=Array.isArray(S[A])?S[A]:[S[A]];for(let T=0,M=R.length;T<M;T++){const P=R[T];if(m(P,A,T,N)===!0){const X=P.__offset,F=Array.isArray(P.value)?P.value:[P.value];let K=0;for(let $=0;$<F.length;$++){const q=F[$],Q=_(q);typeof q=="number"||typeof q=="boolean"?(P.__data[0]=q,t.bufferSubData(t.UNIFORM_BUFFER,X+K,P.__data)):q.isMatrix3?(P.__data[0]=q.elements[0],P.__data[1]=q.elements[1],P.__data[2]=q.elements[2],P.__data[3]=0,P.__data[4]=q.elements[3],P.__data[5]=q.elements[4],P.__data[6]=q.elements[5],P.__data[7]=0,P.__data[8]=q.elements[6],P.__data[9]=q.elements[7],P.__data[10]=q.elements[8],P.__data[11]=0):(q.toArray(P.__data,K),K+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,X,P.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(v,y,S,N){const A=v.value,E=y+"_"+S;if(N[E]===void 0)return typeof A=="number"||typeof A=="boolean"?N[E]=A:N[E]=A.clone(),!0;{const R=N[E];if(typeof A=="number"||typeof A=="boolean"){if(R!==A)return N[E]=A,!0}else if(R.equals(A)===!1)return R.copy(A),!0}return!1}function x(v){const y=v.uniforms;let S=0;const N=16;for(let E=0,R=y.length;E<R;E++){const T=Array.isArray(y[E])?y[E]:[y[E]];for(let M=0,P=T.length;M<P;M++){const X=T[M],F=Array.isArray(X.value)?X.value:[X.value];for(let K=0,$=F.length;K<$;K++){const q=F[K],Q=_(q),D=S%N,Z=D%Q.boundary,ee=D+Z;S+=Z,ee!==0&&N-ee<Q.storage&&(S+=N-ee),X.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=S,S+=Q.storage}}}const A=S%N;return A>0&&(S+=N-A),v.__size=S,v.__cache={},this}function _(v){const y={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(y.boundary=4,y.storage=4):v.isVector2?(y.boundary=8,y.storage=8):v.isVector3||v.isColor?(y.boundary=16,y.storage=12):v.isVector4?(y.boundary=16,y.storage=16):v.isMatrix3?(y.boundary=48,y.storage=48):v.isMatrix4?(y.boundary=64,y.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),y}function g(v){const y=v.target;y.removeEventListener("dispose",g);const S=a.indexOf(y.__bindingPointIndex);a.splice(S,1),t.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function u(){for(const v in r)t.deleteBuffer(r[v]);a=[],r={},s={}}return{bind:c,update:d,dispose:u}}class BT{constructor(e={}){const{canvas:n=A1(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:d=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:p=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const x=new Uint32Array(4),_=new Int32Array(4);let g=null,u=null;const v=[],y=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Mn,this.toneMapping=er,this.toneMappingExposure=1;const S=this;let N=!1,A=0,E=0,R=null,T=-1,M=null;const P=new Et,X=new Et;let F=null;const K=new $e(0);let $=0,q=n.width,Q=n.height,D=1,Z=null,ee=null;const ue=new Et(0,0,q,Q),B=new Et(0,0,q,Q);let se=!1;const G=new vv;let ie=!1,de=!1;const ne=new bt,he=new bt,pe=new H,O=new Et,Re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ne=!1;function Xe(){return R===null?D:1}let I=i;function gt(b,k){return n.getContext(b,k)}try{const b={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:d,powerPreference:h,failIfMajorPerformanceCaveat:p};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Wf}`),n.addEventListener("webglcontextlost",re,!1),n.addEventListener("webglcontextrestored",_e,!1),n.addEventListener("webglcontextcreationerror",xe,!1),I===null){const k="webgl2";if(I=gt(k,b),I===null)throw gt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Ue,He,De,st,Pe,C,w,z,te,ae,J,Ee,ge,Se,Ze,le,Me,Ie,Oe,we,Ke,Ge,lt,L;function me(){Ue=new WE(I),Ue.init(),Ge=new NT(I,Ue),He=new FE(I,Ue,e,Ge),De=new AT(I,Ue),He.reverseDepthBuffer&&f&&De.buffers.depth.setReversed(!0),st=new qE(I),Pe=new fT,C=new RT(I,Ue,De,Pe,He,Ge,st),w=new BE(S),z=new GE(S),te=new eM(I),lt=new UE(I,te),ae=new XE(I,te,st,lt),J=new KE(I,ae,te,st),Oe=new YE(I,He,C),le=new zE(Pe),Ee=new dT(S,w,z,Ue,He,lt,le),ge=new FT(S,Pe),Se=new pT,Ze=new yT(Ue),Ie=new kE(S,w,z,De,J,m,c),Me=new bT(S,J,He),L=new zT(I,st,He,De),we=new OE(I,Ue,st),Ke=new $E(I,Ue,st),st.programs=Ee.programs,S.capabilities=He,S.extensions=Ue,S.properties=Pe,S.renderLists=Se,S.shadowMap=Me,S.state=De,S.info=st}me();const Y=new UT(S,I);this.xr=Y,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const b=Ue.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Ue.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return D},this.setPixelRatio=function(b){b!==void 0&&(D=b,this.setSize(q,Q,!1))},this.getSize=function(b){return b.set(q,Q)},this.setSize=function(b,k,j=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=b,Q=k,n.width=Math.floor(b*D),n.height=Math.floor(k*D),j===!0&&(n.style.width=b+"px",n.style.height=k+"px"),this.setViewport(0,0,b,k)},this.getDrawingBufferSize=function(b){return b.set(q*D,Q*D).floor()},this.setDrawingBufferSize=function(b,k,j){q=b,Q=k,D=j,n.width=Math.floor(b*j),n.height=Math.floor(k*j),this.setViewport(0,0,b,k)},this.getCurrentViewport=function(b){return b.copy(P)},this.getViewport=function(b){return b.copy(ue)},this.setViewport=function(b,k,j,V){b.isVector4?ue.set(b.x,b.y,b.z,b.w):ue.set(b,k,j,V),De.viewport(P.copy(ue).multiplyScalar(D).round())},this.getScissor=function(b){return b.copy(B)},this.setScissor=function(b,k,j,V){b.isVector4?B.set(b.x,b.y,b.z,b.w):B.set(b,k,j,V),De.scissor(X.copy(B).multiplyScalar(D).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(b){De.setScissorTest(se=b)},this.setOpaqueSort=function(b){Z=b},this.setTransparentSort=function(b){ee=b},this.getClearColor=function(b){return b.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor.apply(Ie,arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha.apply(Ie,arguments)},this.clear=function(b=!0,k=!0,j=!0){let V=0;if(b){let U=!1;if(R!==null){const ce=R.texture.format;U=ce===Zf||ce===Kf||ce===Yf}if(U){const ce=R.texture.type,ve=ce===Ti||ce===Ir||ce===Fa||ce===Is||ce===$f||ce===qf,be=Ie.getClearColor(),Te=Ie.getClearAlpha(),Fe=be.r,je=be.g,Ae=be.b;ve?(x[0]=Fe,x[1]=je,x[2]=Ae,x[3]=Te,I.clearBufferuiv(I.COLOR,0,x)):(_[0]=Fe,_[1]=je,_[2]=Ae,_[3]=Te,I.clearBufferiv(I.COLOR,0,_))}else V|=I.COLOR_BUFFER_BIT}k&&(V|=I.DEPTH_BUFFER_BIT),j&&(V|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",re,!1),n.removeEventListener("webglcontextrestored",_e,!1),n.removeEventListener("webglcontextcreationerror",xe,!1),Se.dispose(),Ze.dispose(),Pe.dispose(),w.dispose(),z.dispose(),J.dispose(),lt.dispose(),L.dispose(),Ee.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",th),Y.removeEventListener("sessionend",nh),lr.stop()};function re(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function _e(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;const b=st.autoReset,k=Me.enabled,j=Me.autoUpdate,V=Me.needsUpdate,U=Me.type;me(),st.autoReset=b,Me.enabled=k,Me.autoUpdate=j,Me.needsUpdate=V,Me.type=U}function xe(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Be(b){const k=b.target;k.removeEventListener("dispose",Be),yt(k)}function yt(b){zt(b),Pe.remove(b)}function zt(b){const k=Pe.get(b).programs;k!==void 0&&(k.forEach(function(j){Ee.releaseProgram(j)}),b.isShaderMaterial&&Ee.releaseShaderCache(b))}this.renderBufferDirect=function(b,k,j,V,U,ce){k===null&&(k=Re);const ve=U.isMesh&&U.matrixWorld.determinant()<0,be=Av(b,k,j,V,U);De.setMaterial(V,ve);let Te=j.index,Fe=1;if(V.wireframe===!0){if(Te=ae.getWireframeAttribute(j),Te===void 0)return;Fe=2}const je=j.drawRange,Ae=j.attributes.position;let et=je.start*Fe,ct=(je.start+je.count)*Fe;ce!==null&&(et=Math.max(et,ce.start*Fe),ct=Math.min(ct,(ce.start+ce.count)*Fe)),Te!==null?(et=Math.max(et,0),ct=Math.min(ct,Te.count)):Ae!=null&&(et=Math.max(et,0),ct=Math.min(ct,Ae.count));const dt=ct-et;if(dt<0||dt===1/0)return;lt.setup(U,V,be,j,Te);let Zt,tt=we;if(Te!==null&&(Zt=te.get(Te),tt=Ke,tt.setIndex(Zt)),U.isMesh)V.wireframe===!0?(De.setLineWidth(V.wireframeLinewidth*Xe()),tt.setMode(I.LINES)):tt.setMode(I.TRIANGLES);else if(U.isLine){let Ce=V.linewidth;Ce===void 0&&(Ce=1),De.setLineWidth(Ce*Xe()),U.isLineSegments?tt.setMode(I.LINES):U.isLineLoop?tt.setMode(I.LINE_LOOP):tt.setMode(I.LINE_STRIP)}else U.isPoints?tt.setMode(I.POINTS):U.isSprite&&tt.setMode(I.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)tt.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Ue.get("WEBGL_multi_draw"))tt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Ce=U._multiDrawStarts,ai=U._multiDrawCounts,nt=U._multiDrawCount,Dn=Te?te.get(Te).bytesPerElement:1,Br=Pe.get(V).currentProgram.getUniforms();for(let dn=0;dn<nt;dn++)Br.setValue(I,"_gl_DrawID",dn),tt.render(Ce[dn]/Dn,ai[dn])}else if(U.isInstancedMesh)tt.renderInstances(et,dt,U.count);else if(j.isInstancedBufferGeometry){const Ce=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,ai=Math.min(j.instanceCount,Ce);tt.renderInstances(et,dt,ai)}else tt.render(et,dt)};function it(b,k,j){b.transparent===!0&&b.side===mi&&b.forceSinglePass===!1?(b.side=on,b.needsUpdate=!0,Qa(b,k,j),b.side=ir,b.needsUpdate=!0,Qa(b,k,j),b.side=mi):Qa(b,k,j)}this.compile=function(b,k,j=null){j===null&&(j=b),u=Ze.get(j),u.init(k),y.push(u),j.traverseVisible(function(U){U.isLight&&U.layers.test(k.layers)&&(u.pushLight(U),U.castShadow&&u.pushShadow(U))}),b!==j&&b.traverseVisible(function(U){U.isLight&&U.layers.test(k.layers)&&(u.pushLight(U),U.castShadow&&u.pushShadow(U))}),u.setupLights();const V=new Set;return b.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const ce=U.material;if(ce)if(Array.isArray(ce))for(let ve=0;ve<ce.length;ve++){const be=ce[ve];it(be,j,U),V.add(be)}else it(ce,j,U),V.add(ce)}),y.pop(),u=null,V},this.compileAsync=function(b,k,j=null){const V=this.compile(b,k,j);return new Promise(U=>{function ce(){if(V.forEach(function(ve){Pe.get(ve).currentProgram.isReady()&&V.delete(ve)}),V.size===0){U(b);return}setTimeout(ce,10)}Ue.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let Pn=null;function si(b){Pn&&Pn(b)}function th(){lr.stop()}function nh(){lr.start()}const lr=new _v;lr.setAnimationLoop(si),typeof self<"u"&&lr.setContext(self),this.setAnimationLoop=function(b){Pn=b,Y.setAnimationLoop(b),b===null?lr.stop():lr.start()},Y.addEventListener("sessionstart",th),Y.addEventListener("sessionend",nh),this.render=function(b,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(k),k=Y.getCamera()),b.isScene===!0&&b.onBeforeRender(S,b,k,R),u=Ze.get(b,y.length),u.init(k),y.push(u),he.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),G.setFromProjectionMatrix(he),de=this.localClippingEnabled,ie=le.init(this.clippingPlanes,de),g=Se.get(b,v.length),g.init(),v.push(g),Y.enabled===!0&&Y.isPresenting===!0){const ce=S.xr.getDepthSensingMesh();ce!==null&&nc(ce,k,-1/0,S.sortObjects)}nc(b,k,0,S.sortObjects),g.finish(),S.sortObjects===!0&&g.sort(Z,ee),Ne=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Ne&&Ie.addToRenderList(g,b),this.info.render.frame++,ie===!0&&le.beginShadows();const j=u.state.shadowsArray;Me.render(j,b,k),ie===!0&&le.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=g.opaque,U=g.transmissive;if(u.setupLights(),k.isArrayCamera){const ce=k.cameras;if(U.length>0)for(let ve=0,be=ce.length;ve<be;ve++){const Te=ce[ve];rh(V,U,b,Te)}Ne&&Ie.render(b);for(let ve=0,be=ce.length;ve<be;ve++){const Te=ce[ve];ih(g,b,Te,Te.viewport)}}else U.length>0&&rh(V,U,b,k),Ne&&Ie.render(b),ih(g,b,k);R!==null&&(C.updateMultisampleRenderTarget(R),C.updateRenderTargetMipmap(R)),b.isScene===!0&&b.onAfterRender(S,b,k),lt.resetDefaultState(),T=-1,M=null,y.pop(),y.length>0?(u=y[y.length-1],ie===!0&&le.setGlobalState(S.clippingPlanes,u.state.camera)):u=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function nc(b,k,j,V){if(b.visible===!1)return;if(b.layers.test(k.layers)){if(b.isGroup)j=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(k);else if(b.isLight)u.pushLight(b),b.castShadow&&u.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||G.intersectsSprite(b)){V&&O.setFromMatrixPosition(b.matrixWorld).applyMatrix4(he);const ve=J.update(b),be=b.material;be.visible&&g.push(b,ve,be,j,O.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||G.intersectsObject(b))){const ve=J.update(b),be=b.material;if(V&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),O.copy(b.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),O.copy(ve.boundingSphere.center)),O.applyMatrix4(b.matrixWorld).applyMatrix4(he)),Array.isArray(be)){const Te=ve.groups;for(let Fe=0,je=Te.length;Fe<je;Fe++){const Ae=Te[Fe],et=be[Ae.materialIndex];et&&et.visible&&g.push(b,ve,et,j,O.z,Ae)}}else be.visible&&g.push(b,ve,be,j,O.z,null)}}const ce=b.children;for(let ve=0,be=ce.length;ve<be;ve++)nc(ce[ve],k,j,V)}function ih(b,k,j,V){const U=b.opaque,ce=b.transmissive,ve=b.transparent;u.setupLightsView(j),ie===!0&&le.setGlobalState(S.clippingPlanes,j),V&&De.viewport(P.copy(V)),U.length>0&&Za(U,k,j),ce.length>0&&Za(ce,k,j),ve.length>0&&Za(ve,k,j),De.buffers.depth.setTest(!0),De.buffers.depth.setMask(!0),De.buffers.color.setMask(!0),De.setPolygonOffset(!1)}function rh(b,k,j,V){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[V.id]===void 0&&(u.state.transmissionRenderTarget[V.id]=new kr(1,1,{generateMipmaps:!0,type:Ue.has("EXT_color_buffer_half_float")||Ue.has("EXT_color_buffer_float")?Wa:Ti,minFilter:Tr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace}));const ce=u.state.transmissionRenderTarget[V.id],ve=V.viewport||P;ce.setSize(ve.z,ve.w);const be=S.getRenderTarget();S.setRenderTarget(ce),S.getClearColor(K),$=S.getClearAlpha(),$<1&&S.setClearColor(16777215,.5),S.clear(),Ne&&Ie.render(j);const Te=S.toneMapping;S.toneMapping=er;const Fe=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),u.setupLightsView(V),ie===!0&&le.setGlobalState(S.clippingPlanes,V),Za(b,j,V),C.updateMultisampleRenderTarget(ce),C.updateRenderTargetMipmap(ce),Ue.has("WEBGL_multisampled_render_to_texture")===!1){let je=!1;for(let Ae=0,et=k.length;Ae<et;Ae++){const ct=k[Ae],dt=ct.object,Zt=ct.geometry,tt=ct.material,Ce=ct.group;if(tt.side===mi&&dt.layers.test(V.layers)){const ai=tt.side;tt.side=on,tt.needsUpdate=!0,sh(dt,j,V,Zt,tt,Ce),tt.side=ai,tt.needsUpdate=!0,je=!0}}je===!0&&(C.updateMultisampleRenderTarget(ce),C.updateRenderTargetMipmap(ce))}S.setRenderTarget(be),S.setClearColor(K,$),Fe!==void 0&&(V.viewport=Fe),S.toneMapping=Te}function Za(b,k,j){const V=k.isScene===!0?k.overrideMaterial:null;for(let U=0,ce=b.length;U<ce;U++){const ve=b[U],be=ve.object,Te=ve.geometry,Fe=V===null?ve.material:V,je=ve.group;be.layers.test(j.layers)&&sh(be,k,j,Te,Fe,je)}}function sh(b,k,j,V,U,ce){b.onBeforeRender(S,k,j,V,U,ce),b.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),U.onBeforeRender(S,k,j,V,b,ce),U.transparent===!0&&U.side===mi&&U.forceSinglePass===!1?(U.side=on,U.needsUpdate=!0,S.renderBufferDirect(j,k,V,U,b,ce),U.side=ir,U.needsUpdate=!0,S.renderBufferDirect(j,k,V,U,b,ce),U.side=mi):S.renderBufferDirect(j,k,V,U,b,ce),b.onAfterRender(S,k,j,V,U,ce)}function Qa(b,k,j){k.isScene!==!0&&(k=Re);const V=Pe.get(b),U=u.state.lights,ce=u.state.shadowsArray,ve=U.state.version,be=Ee.getParameters(b,U.state,ce,k,j),Te=Ee.getProgramCacheKey(be);let Fe=V.programs;V.environment=b.isMeshStandardMaterial?k.environment:null,V.fog=k.fog,V.envMap=(b.isMeshStandardMaterial?z:w).get(b.envMap||V.environment),V.envMapRotation=V.environment!==null&&b.envMap===null?k.environmentRotation:b.envMapRotation,Fe===void 0&&(b.addEventListener("dispose",Be),Fe=new Map,V.programs=Fe);let je=Fe.get(Te);if(je!==void 0){if(V.currentProgram===je&&V.lightsStateVersion===ve)return oh(b,be),je}else be.uniforms=Ee.getUniforms(b),b.onBeforeCompile(be,S),je=Ee.acquireProgram(be,Te),Fe.set(Te,je),V.uniforms=be.uniforms;const Ae=V.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ae.clippingPlanes=le.uniform),oh(b,be),V.needsLights=Rv(b),V.lightsStateVersion=ve,V.needsLights&&(Ae.ambientLightColor.value=U.state.ambient,Ae.lightProbe.value=U.state.probe,Ae.directionalLights.value=U.state.directional,Ae.directionalLightShadows.value=U.state.directionalShadow,Ae.spotLights.value=U.state.spot,Ae.spotLightShadows.value=U.state.spotShadow,Ae.rectAreaLights.value=U.state.rectArea,Ae.ltc_1.value=U.state.rectAreaLTC1,Ae.ltc_2.value=U.state.rectAreaLTC2,Ae.pointLights.value=U.state.point,Ae.pointLightShadows.value=U.state.pointShadow,Ae.hemisphereLights.value=U.state.hemi,Ae.directionalShadowMap.value=U.state.directionalShadowMap,Ae.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Ae.spotShadowMap.value=U.state.spotShadowMap,Ae.spotLightMatrix.value=U.state.spotLightMatrix,Ae.spotLightMap.value=U.state.spotLightMap,Ae.pointShadowMap.value=U.state.pointShadowMap,Ae.pointShadowMatrix.value=U.state.pointShadowMatrix),V.currentProgram=je,V.uniformsList=null,je}function ah(b){if(b.uniformsList===null){const k=b.currentProgram.getUniforms();b.uniformsList=sl.seqWithValue(k.seq,b.uniforms)}return b.uniformsList}function oh(b,k){const j=Pe.get(b);j.outputColorSpace=k.outputColorSpace,j.batching=k.batching,j.batchingColor=k.batchingColor,j.instancing=k.instancing,j.instancingColor=k.instancingColor,j.instancingMorph=k.instancingMorph,j.skinning=k.skinning,j.morphTargets=k.morphTargets,j.morphNormals=k.morphNormals,j.morphColors=k.morphColors,j.morphTargetsCount=k.morphTargetsCount,j.numClippingPlanes=k.numClippingPlanes,j.numIntersection=k.numClipIntersection,j.vertexAlphas=k.vertexAlphas,j.vertexTangents=k.vertexTangents,j.toneMapping=k.toneMapping}function Av(b,k,j,V,U){k.isScene!==!0&&(k=Re),C.resetTextureUnits();const ce=k.fog,ve=V.isMeshStandardMaterial?k.environment:null,be=R===null?S.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Bs,Te=(V.isMeshStandardMaterial?z:w).get(V.envMap||ve),Fe=V.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,je=!!j.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ae=!!j.morphAttributes.position,et=!!j.morphAttributes.normal,ct=!!j.morphAttributes.color;let dt=er;V.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(dt=S.toneMapping);const Zt=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,tt=Zt!==void 0?Zt.length:0,Ce=Pe.get(V),ai=u.state.lights;if(ie===!0&&(de===!0||b!==M)){const yn=b===M&&V.id===T;le.setState(V,b,yn)}let nt=!1;V.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==ai.state.version||Ce.outputColorSpace!==be||U.isBatchedMesh&&Ce.batching===!1||!U.isBatchedMesh&&Ce.batching===!0||U.isBatchedMesh&&Ce.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ce.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ce.instancing===!1||!U.isInstancedMesh&&Ce.instancing===!0||U.isSkinnedMesh&&Ce.skinning===!1||!U.isSkinnedMesh&&Ce.skinning===!0||U.isInstancedMesh&&Ce.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ce.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ce.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ce.instancingMorph===!1&&U.morphTexture!==null||Ce.envMap!==Te||V.fog===!0&&Ce.fog!==ce||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==le.numPlanes||Ce.numIntersection!==le.numIntersection)||Ce.vertexAlphas!==Fe||Ce.vertexTangents!==je||Ce.morphTargets!==Ae||Ce.morphNormals!==et||Ce.morphColors!==ct||Ce.toneMapping!==dt||Ce.morphTargetsCount!==tt)&&(nt=!0):(nt=!0,Ce.__version=V.version);let Dn=Ce.currentProgram;nt===!0&&(Dn=Qa(V,k,U));let Br=!1,dn=!1,Hs=!1;const ft=Dn.getUniforms(),$n=Ce.uniforms;if(De.useProgram(Dn.program)&&(Br=!0,dn=!0,Hs=!0),V.id!==T&&(T=V.id,dn=!0),Br||M!==b){De.buffers.depth.getReversed()?(ne.copy(b.projectionMatrix),R1(ne),N1(ne),ft.setValue(I,"projectionMatrix",ne)):ft.setValue(I,"projectionMatrix",b.projectionMatrix),ft.setValue(I,"viewMatrix",b.matrixWorldInverse);const Ri=ft.map.cameraPosition;Ri!==void 0&&Ri.setValue(I,pe.setFromMatrixPosition(b.matrixWorld)),He.logarithmicDepthBuffer&&ft.setValue(I,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&ft.setValue(I,"isOrthographic",b.isOrthographicCamera===!0),M!==b&&(M=b,dn=!0,Hs=!0)}if(U.isSkinnedMesh){ft.setOptional(I,U,"bindMatrix"),ft.setOptional(I,U,"bindMatrixInverse");const yn=U.skeleton;yn&&(yn.boneTexture===null&&yn.computeBoneTexture(),ft.setValue(I,"boneTexture",yn.boneTexture,C))}U.isBatchedMesh&&(ft.setOptional(I,U,"batchingTexture"),ft.setValue(I,"batchingTexture",U._matricesTexture,C),ft.setOptional(I,U,"batchingIdTexture"),ft.setValue(I,"batchingIdTexture",U._indirectTexture,C),ft.setOptional(I,U,"batchingColorTexture"),U._colorsTexture!==null&&ft.setValue(I,"batchingColorTexture",U._colorsTexture,C));const Gs=j.morphAttributes;if((Gs.position!==void 0||Gs.normal!==void 0||Gs.color!==void 0)&&Oe.update(U,j,Dn),(dn||Ce.receiveShadow!==U.receiveShadow)&&(Ce.receiveShadow=U.receiveShadow,ft.setValue(I,"receiveShadow",U.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&($n.envMap.value=Te,$n.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&k.environment!==null&&($n.envMapIntensity.value=k.environmentIntensity),dn&&(ft.setValue(I,"toneMappingExposure",S.toneMappingExposure),Ce.needsLights&&Cv($n,Hs),ce&&V.fog===!0&&ge.refreshFogUniforms($n,ce),ge.refreshMaterialUniforms($n,V,D,Q,u.state.transmissionRenderTarget[b.id]),sl.upload(I,ah(Ce),$n,C)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(sl.upload(I,ah(Ce),$n,C),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&ft.setValue(I,"center",U.center),ft.setValue(I,"modelViewMatrix",U.modelViewMatrix),ft.setValue(I,"normalMatrix",U.normalMatrix),ft.setValue(I,"modelMatrix",U.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const yn=V.uniformsGroups;for(let Ri=0,Ni=yn.length;Ri<Ni;Ri++){const lh=yn[Ri];L.update(lh,Dn),L.bind(lh,Dn)}}return Dn}function Cv(b,k){b.ambientLightColor.needsUpdate=k,b.lightProbe.needsUpdate=k,b.directionalLights.needsUpdate=k,b.directionalLightShadows.needsUpdate=k,b.pointLights.needsUpdate=k,b.pointLightShadows.needsUpdate=k,b.spotLights.needsUpdate=k,b.spotLightShadows.needsUpdate=k,b.rectAreaLights.needsUpdate=k,b.hemisphereLights.needsUpdate=k}function Rv(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(b,k,j){Pe.get(b.texture).__webglTexture=k,Pe.get(b.depthTexture).__webglTexture=j;const V=Pe.get(b);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=j===void 0,V.__autoAllocateDepthBuffer||Ue.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,k){const j=Pe.get(b);j.__webglFramebuffer=k,j.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(b,k=0,j=0){R=b,A=k,E=j;let V=!0,U=null,ce=!1,ve=!1;if(b){const Te=Pe.get(b);if(Te.__useDefaultFramebuffer!==void 0)De.bindFramebuffer(I.FRAMEBUFFER,null),V=!1;else if(Te.__webglFramebuffer===void 0)C.setupRenderTarget(b);else if(Te.__hasExternalTextures)C.rebindTextures(b,Pe.get(b.texture).__webglTexture,Pe.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Ae=b.depthTexture;if(Te.__boundDepthTexture!==Ae){if(Ae!==null&&Pe.has(Ae)&&(b.width!==Ae.image.width||b.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(b)}}const Fe=b.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(ve=!0);const je=Pe.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(je[k])?U=je[k][j]:U=je[k],ce=!0):b.samples>0&&C.useMultisampledRTT(b)===!1?U=Pe.get(b).__webglMultisampledFramebuffer:Array.isArray(je)?U=je[j]:U=je,P.copy(b.viewport),X.copy(b.scissor),F=b.scissorTest}else P.copy(ue).multiplyScalar(D).floor(),X.copy(B).multiplyScalar(D).floor(),F=se;if(De.bindFramebuffer(I.FRAMEBUFFER,U)&&V&&De.drawBuffers(b,U),De.viewport(P),De.scissor(X),De.setScissorTest(F),ce){const Te=Pe.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+k,Te.__webglTexture,j)}else if(ve){const Te=Pe.get(b.texture),Fe=k||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,Te.__webglTexture,j||0,Fe)}T=-1},this.readRenderTargetPixels=function(b,k,j,V,U,ce,ve){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=Pe.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ve!==void 0&&(be=be[ve]),be){De.bindFramebuffer(I.FRAMEBUFFER,be);try{const Te=b.texture,Fe=Te.format,je=Te.type;if(!He.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!He.textureTypeReadable(je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=b.width-V&&j>=0&&j<=b.height-U&&I.readPixels(k,j,V,U,Ge.convert(Fe),Ge.convert(je),ce)}finally{const Te=R!==null?Pe.get(R).__webglFramebuffer:null;De.bindFramebuffer(I.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(b,k,j,V,U,ce,ve){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=Pe.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ve!==void 0&&(be=be[ve]),be){const Te=b.texture,Fe=Te.format,je=Te.type;if(!He.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!He.textureTypeReadable(je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=b.width-V&&j>=0&&j<=b.height-U){De.bindFramebuffer(I.FRAMEBUFFER,be);const Ae=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Ae),I.bufferData(I.PIXEL_PACK_BUFFER,ce.byteLength,I.STREAM_READ),I.readPixels(k,j,V,U,Ge.convert(Fe),Ge.convert(je),0);const et=R!==null?Pe.get(R).__webglFramebuffer:null;De.bindFramebuffer(I.FRAMEBUFFER,et);const ct=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await C1(I,ct,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Ae),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ce),I.deleteBuffer(Ae),I.deleteSync(ct),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(b,k=null,j=0){b.isTexture!==!0&&(la("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,b=arguments[1]);const V=Math.pow(2,-j),U=Math.floor(b.image.width*V),ce=Math.floor(b.image.height*V),ve=k!==null?k.x:0,be=k!==null?k.y:0;C.setTexture2D(b,0),I.copyTexSubImage2D(I.TEXTURE_2D,j,0,0,ve,be,U,ce),De.unbindTexture()},this.copyTextureToTexture=function(b,k,j=null,V=null,U=0){b.isTexture!==!0&&(la("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,b=arguments[1],k=arguments[2],U=arguments[3]||0,j=null);let ce,ve,be,Te,Fe,je,Ae,et,ct;const dt=b.isCompressedTexture?b.mipmaps[U]:b.image;j!==null?(ce=j.max.x-j.min.x,ve=j.max.y-j.min.y,be=j.isBox3?j.max.z-j.min.z:1,Te=j.min.x,Fe=j.min.y,je=j.isBox3?j.min.z:0):(ce=dt.width,ve=dt.height,be=dt.depth||1,Te=0,Fe=0,je=0),V!==null?(Ae=V.x,et=V.y,ct=V.z):(Ae=0,et=0,ct=0);const Zt=Ge.convert(k.format),tt=Ge.convert(k.type);let Ce;k.isData3DTexture?(C.setTexture3D(k,0),Ce=I.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(C.setTexture2DArray(k,0),Ce=I.TEXTURE_2D_ARRAY):(C.setTexture2D(k,0),Ce=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,k.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,k.unpackAlignment);const ai=I.getParameter(I.UNPACK_ROW_LENGTH),nt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Dn=I.getParameter(I.UNPACK_SKIP_PIXELS),Br=I.getParameter(I.UNPACK_SKIP_ROWS),dn=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,dt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,dt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Te),I.pixelStorei(I.UNPACK_SKIP_ROWS,Fe),I.pixelStorei(I.UNPACK_SKIP_IMAGES,je);const Hs=b.isDataArrayTexture||b.isData3DTexture,ft=k.isDataArrayTexture||k.isData3DTexture;if(b.isRenderTargetTexture||b.isDepthTexture){const $n=Pe.get(b),Gs=Pe.get(k),yn=Pe.get($n.__renderTarget),Ri=Pe.get(Gs.__renderTarget);De.bindFramebuffer(I.READ_FRAMEBUFFER,yn.__webglFramebuffer),De.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ri.__webglFramebuffer);for(let Ni=0;Ni<be;Ni++)Hs&&I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Pe.get(b).__webglTexture,U,je+Ni),b.isDepthTexture?(ft&&I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Pe.get(k).__webglTexture,U,ct+Ni),I.blitFramebuffer(Te,Fe,ce,ve,Ae,et,ce,ve,I.DEPTH_BUFFER_BIT,I.NEAREST)):ft?I.copyTexSubImage3D(Ce,U,Ae,et,ct+Ni,Te,Fe,ce,ve):I.copyTexSubImage2D(Ce,U,Ae,et,ct+Ni,Te,Fe,ce,ve);De.bindFramebuffer(I.READ_FRAMEBUFFER,null),De.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else ft?b.isDataTexture||b.isData3DTexture?I.texSubImage3D(Ce,U,Ae,et,ct,ce,ve,be,Zt,tt,dt.data):k.isCompressedArrayTexture?I.compressedTexSubImage3D(Ce,U,Ae,et,ct,ce,ve,be,Zt,dt.data):I.texSubImage3D(Ce,U,Ae,et,ct,ce,ve,be,Zt,tt,dt):b.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,U,Ae,et,ce,ve,Zt,tt,dt.data):b.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,U,Ae,et,dt.width,dt.height,Zt,dt.data):I.texSubImage2D(I.TEXTURE_2D,U,Ae,et,ce,ve,Zt,tt,dt);I.pixelStorei(I.UNPACK_ROW_LENGTH,ai),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,nt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Dn),I.pixelStorei(I.UNPACK_SKIP_ROWS,Br),I.pixelStorei(I.UNPACK_SKIP_IMAGES,dn),U===0&&k.generateMipmaps&&I.generateMipmap(Ce),De.unbindTexture()},this.copyTextureToTexture3D=function(b,k,j=null,V=null,U=0){return b.isTexture!==!0&&(la("WebGLRenderer: copyTextureToTexture3D function signature has changed."),j=arguments[0]||null,V=arguments[1]||null,b=arguments[2],k=arguments[3],U=arguments[4]||0),la('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,k,j,V,U)},this.initRenderTarget=function(b){Pe.get(b).__webglFramebuffer===void 0&&C.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?C.setTextureCube(b,0):b.isData3DTexture?C.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?C.setTexture2DArray(b,0):C.setTexture2D(b,0),De.unbindTexture()},this.resetState=function(){A=0,E=0,R=null,De.reset(),lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=Qe._getDrawingBufferColorSpace(e),n.unpackColorSpace=Qe._getUnpackColorSpace()}}class jT extends cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ai,this.environmentIntensity=1,this.environmentRotation=new Ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class bv extends Ya{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new $e(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const gm=new bt,Wd=new uv,zo=new Jl,Bo=new H;class VT extends cn{constructor(e=new ri,n=new bv){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),zo.copy(i.boundingSphere),zo.applyMatrix4(r),zo.radius+=s,e.ray.intersectsSphere(zo)===!1)return;gm.copy(r).invert(),Wd.copy(e.ray).applyMatrix4(gm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,d=i.index,p=i.attributes.position;if(d!==null){const f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let x=f,_=m;x<_;x++){const g=d.getX(x);Bo.fromBufferAttribute(p,g),xm(Bo,g,c,r,e,n,this)}}else{const f=Math.max(0,a.start),m=Math.min(p.count,a.start+a.count);for(let x=f,_=m;x<_;x++)Bo.fromBufferAttribute(p,x),xm(Bo,x,c,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function xm(t,e,n,i,r,s,a){const o=Wd.distanceSqToPoint(t);if(o<n){const c=new H;Wd.closestPointToPoint(t,c),c.applyMatrix4(i);const d=r.ray.origin.distanceTo(c);if(d<r.near||d>r.far)return;s.push({distance:d,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class eh extends ri{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let d=0;const h=[],p=new H,f=new H,m=[],x=[],_=[],g=[];for(let u=0;u<=i;u++){const v=[],y=u/i;let S=0;u===0&&a===0?S=.5/n:u===i&&c===Math.PI&&(S=-.5/n);for(let N=0;N<=n;N++){const A=N/n;p.x=-e*Math.cos(r+A*s)*Math.sin(a+y*o),p.y=e*Math.cos(a+y*o),p.z=e*Math.sin(r+A*s)*Math.sin(a+y*o),x.push(p.x,p.y,p.z),f.copy(p).normalize(),_.push(f.x,f.y,f.z),g.push(A+S,1-y),v.push(d++)}h.push(v)}for(let u=0;u<i;u++)for(let v=0;v<n;v++){const y=h[u][v+1],S=h[u][v],N=h[u+1][v],A=h[u+1][v+1];(u!==0||a>0)&&m.push(y,S,A),(u!==i-1||c<Math.PI)&&m.push(S,N,A)}this.setIndex(m),this.setAttribute("position",new ii(x,3)),this.setAttribute("normal",new ii(_,3)),this.setAttribute("uv",new ii(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new eh(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class HT{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=vm(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=vm();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function vm(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Wf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Wf);const Tv=({state:t="IDLE",size:e=40,className:n="",onClick:i})=>{const r=W.useRef(null),s=W.useRef(null),a=W.useRef(0);W.useEffect(()=>{const c=r.current;if(!c||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const h=new jT,p=new bn(45,1,.1,100);p.position.z=3.6;let f;try{f=new BT({alpha:!0,antialias:!0,powerPreference:"low-power"}),f.setSize(e,e),f.setPixelRatio(Math.min(window.devicePixelRatio,2)),s.current=f,c.appendChild(f.domElement)}catch{return}const m=e>60?420:180,x=new ri,_=new Float32Array(m*3),g=new Float32Array(m*3),u=new Float32Array(m*3),y=(M=>{switch(M){case"LISTENING":return{primary:new $e("#38bdf8"),secondary:new $e("#818cf8")};case"THINKING":return{primary:new $e("#a855f7"),secondary:new $e("#6366f1")};case"SPEAKING":return{primary:new $e("#34d399"),secondary:new $e("#06b6d4")};case"WORKING":return{primary:new $e("#fbbf24"),secondary:new $e("#10b981")};case"IDLE":default:return{primary:new $e("#10b981"),secondary:new $e("#0ea5e9")}}})(t);for(let M=0;M<m;M++){const P=Math.random(),X=Math.random(),F=P*2*Math.PI,K=Math.acos(2*X-1),$=.95+Math.random()*.15,q=$*Math.sin(K)*Math.cos(F),Q=$*Math.sin(K)*Math.sin(F),D=$*Math.cos(K);_[M*3]=q,_[M*3+1]=Q,_[M*3+2]=D,g[M*3]=q,g[M*3+1]=Q,g[M*3+2]=D;const Z=Math.random(),ee=y.primary.clone().lerp(y.secondary,Z);u[M*3]=ee.r,u[M*3+1]=ee.g,u[M*3+2]=ee.b}x.setAttribute("position",new Cn(_,3)),x.setAttribute("color",new Cn(u,3));const S=new bv({size:e>60?.055:.075,vertexColors:!0,transparent:!0,opacity:.85,blending:id}),N=new VT(x,S);h.add(N);const A=new ua;if(t==="WORKING"){const P=new eh(.06,8,8),X=new Qf({color:16498468});for(let F=0;F<3;F++){const K=new ei(P,X),$=F/3*Math.PI*2;K.position.set(Math.cos($)*1.35,Math.sin($)*1.35,0),A.add(K)}h.add(A)}let E=new HT,R=!1;const T=()=>{if(!R){a.current=requestAnimationFrame(T);try{const M=E.getElapsedTime();let P=.5,X=.05;t==="LISTENING"?(P=1.8,X=.16):t==="THINKING"?(P=2.4,X=.12):t==="SPEAKING"?(P=1.4,X=.18):t==="WORKING"&&(P=1,X=.08),N.rotation.y=M*.3*P,N.rotation.x=M*.2*P,t==="WORKING"&&(A.rotation.z=-M*1.2);const F=x.attributes.position,K=F.array;for(let $=0;$<m;$++){const q=g[$*3],Q=g[$*3+1],D=g[$*3+2],Z=Math.sin(M*3*P+q*4+Q*4)*X;K[$*3]=q*(1+Z),K[$*3+1]=Q*(1+Z),K[$*3+2]=D*(1+Z)}F.needsUpdate=!0,f.render(h,p)}catch{}}};return T(),()=>{R=!0,cancelAnimationFrame(a.current);try{s.current&&c.contains(s.current.domElement)&&c.removeChild(s.current.domElement),x.dispose(),S.dispose(),f.dispose()}catch{}}},[t,e]);const o={IDLE:"from-emerald-500/30 to-cyan-500/20 shadow-emerald-500/20",LISTENING:"from-sky-500/40 to-indigo-500/30 shadow-sky-500/30 animate-pulse",THINKING:"from-purple-500/40 to-indigo-500/30 shadow-purple-500/30 animate-spin-slow",SPEAKING:"from-emerald-500/40 to-cyan-500/30 shadow-emerald-500/30 animate-pulse",WORKING:"from-amber-500/40 to-emerald-500/30 shadow-amber-500/30"}[t];return l.jsxs("div",{onClick:i,style:{width:e,height:e},className:`relative flex items-center justify-center cursor-pointer select-none rounded-full group ${n}`,title:`OS Ambient Presence: ${t}`,children:[l.jsx("div",{className:`absolute inset-0 rounded-full bg-gradient-to-tr ${o} blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}),l.jsx("div",{ref:r,className:"relative z-10 w-full h-full pointer-events-none"}),l.jsx("div",{className:"absolute inset-1 rounded-full border border-white/20 bg-os-surface/40 backdrop-blur-sm -z-0 pointer-events-none"})]})},GT=()=>{const{me:t,theme:e,toggleTheme:n,orbState:i,pendingApprovalsCount:r,activeAgentsCount:s,setCurrentView:a,setIsCommandPaletteOpen:o}=un(),{isVoiceActive:c,toggleVoice:d}=Ix();return l.jsxs("header",{className:"sticky top-0 z-40 w-full h-16 border-b border-os-border bg-os-bg/75 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsxs("div",{className:"flex items-center gap-2.5 cursor-pointer group select-none",onClick:()=>a("home"),children:[l.jsx("img",{src:"/static/logo.png",alt:"OS Logo",className:"w-8 h-8 rounded-full object-contain filter drop-shadow-[0_0_12px_rgba(99,102,241,0.35)] transition-transform duration-200 group-hover:scale-105"}),l.jsx(Tv,{state:i,size:28}),l.jsx("div",{className:"flex flex-col",children:l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{className:"font-extrabold text-base tracking-tight text-os-primary group-hover:text-indigo-400 transition-colors",children:"OS"}),l.jsx("span",{className:"text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-os-secondary",children:(t==null?void 0:t.mode)||"Builder Mode"})]})})]}),l.jsx("div",{className:"hidden lg:flex items-center gap-2 pl-3 border-l border-os-border text-xs",children:l.jsxs("div",{className:"flex items-center gap-1.5 text-os-secondary",children:[t!=null&&t.model_ok?l.jsxs("span",{className:"flex h-2 w-2 relative",children:[l.jsx("span",{className:"animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"}),l.jsx("span",{className:"relative inline-flex rounded-full h-2 w-2 bg-emerald-500"})]}):l.jsx("span",{className:"h-2 w-2 rounded-full bg-amber-500"}),l.jsx("span",{className:"font-mono text-[11px] text-os-muted",children:(t==null?void 0:t.model)||"Ollama Connected"})]})})]}),l.jsx("div",{className:"flex-1 max-w-md mx-4 hidden sm:block",children:l.jsxs("button",{onClick:()=>o(!0),className:"w-full flex items-center justify-between px-3.5 py-1.5 rounded-glass-md bg-white/5 hover:bg-white/10 border border-os-border hover:border-os-border-glass text-os-secondary text-xs transition-all duration-150 group",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(zr,{className:"w-3.5 h-3.5 text-os-muted group-hover:text-os-primary transition-colors"}),l.jsx("span",{children:"Search tasks, plans, tools, or ask OS..."})]}),l.jsxs("kbd",{className:"hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/20 border border-white/10 text-[10px] font-mono text-os-muted",children:[l.jsx("span",{children:"⌘"}),"K"]})]})}),l.jsxs("div",{className:"flex items-center gap-2 md:gap-3",children:[r>0&&l.jsxs("button",{onClick:()=>a("approvals"),className:"flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono transition-colors",title:`${r} action approvals waiting`,children:[l.jsx(Kl,{className:"w-3.5 h-3.5"}),l.jsx("span",{className:"font-semibold",children:r}),l.jsx("span",{className:"hidden md:inline text-[11px]",children:"waiting"})]}),s>0&&l.jsxs("button",{onClick:()=>a("agents"),className:"flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono transition-colors",title:`${s} background agents running`,children:[l.jsx(Hf,{className:"w-3.5 h-3.5 animate-spin-slow"}),l.jsxs("span",{children:[s," running"]})]}),l.jsx("button",{onClick:d,className:`btn-press p-2 rounded-glass-md border transition-all ${c?"bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glass-glow":"bg-white/5 hover:bg-white/10 text-os-secondary hover:text-os-primary border-os-border"}`,title:c?"Voice active (click to stop)":"Activate Voice Talk",children:c?l.jsx(_0,{className:"w-4 h-4 animate-pulse"}):l.jsx(x0,{className:"w-4 h-4"})}),l.jsx("button",{onClick:n,className:"btn-press p-2 rounded-glass-md bg-white/5 hover:bg-white/10 border border-os-border text-os-secondary hover:text-os-primary transition-colors",title:`Switch to ${e==="dark"?"Light":"Dark"} mode`,children:e==="dark"?l.jsx(kS,{className:"w-4 h-4"}):l.jsx(RS,{className:"w-4 h-4"})}),l.jsx("div",{className:"flex items-center gap-2 pl-2 border-l border-os-border",children:l.jsx("div",{className:"w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-black select-none",children:t!=null&&t.name?t.name.charAt(0).toUpperCase():"S"})})]})]})},WT=()=>{const{currentView:t,setCurrentView:e,pendingApprovalsCount:n,activeAgentsCount:i}=un(),r=[{id:"home",label:"Overview",icon:o0},{id:"hud",label:"Cyber HUD",icon:Hf,badgeVariant:"cyan"},{id:"chat",label:"Ask OS",icon:Qn},{id:"plan",label:"Plan & Day",icon:Fr},{id:"tasks",label:"Commitments",icon:F0},{id:"approvals",label:"Approvals & Safety",icon:Kl,badgeCount:n,badgeVariant:"amber"},{id:"agents",label:"Workers & Agents",icon:Ox,badgeCount:i,badgeVariant:"cyan"},{id:"activity",label:"Evidence & Audit",icon:Ga},{id:"connectors",label:"Connectors",icon:h0},{id:"memory",label:"Memory & World",icon:zx}];return l.jsxs("aside",{className:"w-16 md:w-60 border-r border-os-border bg-os-bg/50 backdrop-blur-md flex flex-col justify-between p-3 select-none flex-shrink-0",children:[l.jsxs("nav",{className:"space-y-1.5",children:[l.jsx("div",{className:"hidden md:block px-3 py-2 text-[10px] font-mono tracking-wider uppercase text-os-muted",children:"Workspace"}),r.map(s=>{const a=s.icon,o=t===s.id;return l.jsxs("button",{onClick:()=>e(s.id),className:`btn-press w-full flex items-center gap-3 px-3 py-2.5 rounded-glass-md text-xs font-medium transition-all group ${o?"bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-glass-glow":"text-os-secondary hover:text-os-primary hover:bg-white/5 border border-transparent"}`,children:[l.jsx(a,{className:`w-4 h-4 flex-shrink-0 transition-colors ${o?"text-emerald-400":"text-os-muted group-hover:text-os-primary"}`}),l.jsx("span",{className:"hidden md:inline truncate",children:s.label}),s.badgeCount!==void 0&&s.badgeCount>0&&l.jsx("span",{className:`hidden md:inline-flex ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${s.badgeVariant==="amber"?"bg-amber-500/20 text-amber-400 border border-amber-500/30":s.badgeVariant==="cyan"?"bg-cyan-500/20 text-cyan-400 border border-cyan-500/30":"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`,children:s.badgeCount})]},s.id)})]}),l.jsxs("div",{className:"pt-4 border-t border-os-border/50 hidden md:block px-3",children:[l.jsxs("div",{className:"flex items-center justify-between text-[11px] text-os-muted font-mono",children:[l.jsx("span",{children:"OS Core v2.0"}),l.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"})]}),l.jsx("p",{className:"text-[10px] text-os-muted/80 mt-1 leading-tight",children:"Safe execution boundary active."})]})]})},XT=()=>{const{isCommandPaletteOpen:t,setIsCommandPaletteOpen:e,setCurrentView:n,refreshData:i,addNotification:r}=un(),[s,a]=W.useState(""),[o,c]=W.useState(0),d=W.useRef(null);W.useEffect(()=>{t&&(a(""),c(0),setTimeout(()=>{var x;return(x=d.current)==null?void 0:x.focus()},50))},[t]);const p=[{id:"ask-plan",title:'Ask OS: "Plan my day and resolve conflicts"',category:"Ask OS",icon:Qn,view:"chat"},{id:"ask-matters",title:'Ask OS: "What matters right now and what is blocked?"',category:"Ask OS",icon:Qn,view:"chat"},{id:"ask-research",title:'Ask OS: "Research recent AI agent breakthroughs"',category:"Ask OS",icon:Qn,view:"chat"},{id:"nav-home",title:'Go to Overview ("What matters now")',category:"Navigation",icon:Vf,view:"home"},{id:"nav-chat",title:"Open Ask OS Canvas",category:"Navigation",icon:Qn,view:"chat"},{id:"nav-plan",title:"Open Day Plan & Schedule",category:"Navigation",icon:Fr,view:"plan"},{id:"nav-tasks",title:"View Commitments & Tasks",category:"Navigation",icon:F0,view:"tasks"},{id:"nav-approvals",title:"Review Safety Approvals",category:"Navigation",icon:Kl,view:"approvals"},{id:"nav-agents",title:"Inspect Specialized Workers",category:"Navigation",icon:Ox,view:"agents"},{id:"nav-activity",title:"Audit Evidence & Activity",category:"Navigation",icon:Ga,view:"activity"},{id:"nav-connectors",title:"Manage Connectors & Integrations",category:"Navigation",icon:h0,view:"connectors"},{id:"nav-memory",title:"Explore OS Memory & Knowledge",category:"Navigation",icon:zx,view:"memory"},{id:"act-refresh",title:"Refresh All Data & Statuses",category:"Actions",icon:Xn,action:async()=>{await i(),r({type:"success",title:"System Synced",message:"All operational data refreshed."})}}].filter(x=>x.title.toLowerCase().includes(s.toLowerCase())||x.category.toLowerCase().includes(s.toLowerCase())),f=x=>{e(!1),x.action?x.action():x.view&&n(x.view)},m=x=>{x.key==="ArrowDown"?(x.preventDefault(),c(_=>(_+1)%(p.length||1))):x.key==="ArrowUp"?(x.preventDefault(),c(_=>(_-1+(p.length||1))%(p.length||1))):x.key==="Enter"?(x.preventDefault(),p[o]&&f(p[o])):x.key==="Escape"&&e(!1)};return t?l.jsxs("div",{className:"fixed inset-0 z-50 flex items-start justify-center pt-24 p-4",children:[l.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity",onClick:()=>e(!1)}),l.jsxs("div",{className:"relative w-full max-w-xl z-10 glass-panel rounded-glass-xl border border-os-border-glass shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150",children:[l.jsxs("div",{className:"flex items-center gap-3 px-4 py-3.5 border-b border-os-border bg-white/5",children:[l.jsx(zr,{className:"w-5 h-5 text-os-muted flex-shrink-0"}),l.jsx("input",{ref:d,type:"text",value:s,onChange:x=>{a(x.target.value),c(0)},onKeyDown:m,placeholder:"Type a command, search tasks, or ask OS...",className:"w-full bg-transparent text-sm text-os-primary placeholder:text-os-muted focus:outline-none"}),l.jsx("button",{onClick:()=>e(!1),className:"p-1 text-os-muted hover:text-os-primary rounded-lg hover:bg-white/5",children:l.jsx(Gf,{className:"w-4 h-4"})})]}),l.jsx("div",{className:"max-h-80 overflow-y-auto p-2 space-y-1",children:p.length===0?l.jsx("div",{className:"py-8 text-center text-xs text-os-muted",children:"No matching commands or actions found."}):p.map((x,_)=>{const g=x.icon,u=_===o;return l.jsxs("div",{onClick:()=>f(x),onMouseEnter:()=>c(_),className:`flex items-center justify-between px-3 py-2.5 rounded-glass-md text-xs cursor-pointer transition-colors ${u?"bg-emerald-500/15 text-emerald-400 border border-emerald-500/30":"text-os-secondary hover:text-os-primary hover:bg-white/5 border border-transparent"}`,children:[l.jsxs("div",{className:"flex items-center gap-2.5 truncate",children:[l.jsx(g,{className:`w-4 h-4 flex-shrink-0 ${u?"text-emerald-400":"text-os-muted"}`}),l.jsx("span",{className:"truncate",children:x.title})]}),l.jsx("span",{className:"text-[10px] font-mono uppercase tracking-wider text-os-muted px-2 py-0.5 rounded bg-white/5",children:x.category})]},x.id)})}),l.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-black/20 border-t border-os-border text-[11px] text-os-muted font-mono",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("span",{children:"↑↓ Navigate"}),l.jsx("span",{children:"↵ Select"}),l.jsx("span",{children:"ESC Close"})]}),l.jsx("span",{children:"OS Command Center"})]})]})]}):null},At=({children:t,interactive:e=!1,glow:n="none",className:i="",...r})=>{const s={none:"",emerald:"shadow-glass-glow border-emerald-500/30",cyan:"shadow-glass-glow-cyan border-cyan-500/30",amber:"shadow-glass-glow-amber border-amber-500/30",danger:"shadow-glass-glow-danger border-rose-500/30"}[n];return l.jsx("div",{className:`glass-panel rounded-glass-lg p-5 transition-all duration-200 ${e?"glass-card-interactive cursor-pointer hover:border-os-border-glass":""} ${s} ${i}`,...r,children:t})},Mt=({children:t,variant:e="neutral",size:n="md",icon:i,className:r=""})=>{const s={neutral:"bg-white/5 text-os-secondary border-white/10",emerald:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",cyan:"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",amber:"bg-amber-500/10 text-amber-400 border-amber-500/20",danger:"bg-rose-500/10 text-rose-400 border-rose-500/20",purple:"bg-purple-500/10 text-purple-400 border-purple-500/20"}[e],a={sm:"text-xs px-2 py-0.5 gap-1",md:"text-xs font-medium px-2.5 py-1 gap-1.5"}[n];return l.jsxs("span",{className:`inline-flex items-center rounded-full border tracking-wide uppercase font-mono ${s} ${a} ${r}`,children:[i&&l.jsx("span",{className:"flex-shrink-0",children:i}),l.jsx("span",{children:t})]})},qe=({children:t,variant:e="glass",size:n="md",isLoading:i=!1,leftIcon:r,rightIcon:s,disabled:a,className:o="",...c})=>{const d={primary:"bg-emerald-500 text-white font-medium hover:bg-emerald-400 border border-emerald-400/40 shadow-glass-glow",glass:"bg-white/5 hover:bg-white/10 text-os-primary border border-os-border hover:border-os-border-glass backdrop-blur-md",secondary:"bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30",danger:"bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 shadow-glass-glow-danger",ghost:"hover:bg-white/5 text-os-secondary hover:text-os-primary border border-transparent"}[e],h={sm:"text-xs px-2.5 py-1.5 rounded-glass-sm gap-1.5",md:"text-sm px-4 py-2 rounded-glass-md gap-2",lg:"text-base px-5 py-2.5 rounded-glass-lg gap-2.5",icon:"p-2 rounded-glass-md justify-center items-center"}[n];return l.jsxs("button",{className:`btn-press inline-flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none ${d} ${h} ${o}`,disabled:a||i,...c,children:[i?l.jsxs("svg",{className:"animate-spin h-4 w-4 text-current",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[l.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),l.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}):r,t,!i&&s]})},_m=()=>{const{me:t,setCurrentView:e,pendingApprovalsCount:n,activeAgentsCount:i}=un(),[r,s]=W.useState(null),[a,o]=W.useState([]),[c,d]=W.useState(!0),h=async()=>{d(!0);try{const[p,f]=await Promise.allSettled([ke.getHomeView(),ke.getPlan()]);p.status==="fulfilled"&&s(p.value),f.status==="fulfilled"&&o(f.value.items||[])}catch(p){console.error("Failed to load home view data:",p)}finally{d(!1)}};return W.useEffect(()=>{h()},[]),l.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-8 animate-in fade-in duration-200",children:[l.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-os-border/50",children:[l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{className:"text-xs font-mono text-emerald-400 uppercase tracking-widest",children:"Operational Command"}),l.jsx("span",{className:"h-1 w-1 rounded-full bg-emerald-400"}),l.jsx("span",{className:"text-xs text-os-secondary",children:new Date().toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})})]}),l.jsxs("h1",{className:"text-2xl md:text-3xl font-extrabold text-os-primary tracking-tight mt-1",children:[(t==null?void 0:t.greeting)||"Good afternoon",", ",(t==null?void 0:t.name)||"Sai"]}),l.jsx("p",{className:"text-xs md:text-sm text-os-secondary mt-0.5",children:n>0?`You have ${n} action approval waiting and tasks scheduled for today.`:"All systems nominal. OS is actively observing background feeds and commitments."})]}),l.jsxs("div",{className:"flex items-center gap-2.5",children:[l.jsx(qe,{variant:"glass",size:"sm",onClick:h,isLoading:c,leftIcon:l.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Sync"}),l.jsx(qe,{variant:"primary",size:"sm",onClick:()=>e("chat"),leftIcon:l.jsx(Qn,{className:"w-3.5 h-3.5"}),children:"Ask OS"})]})]}),l.jsxs("section",{className:"space-y-3",children:[l.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[l.jsx("span",{className:"h-2 w-2 rounded-full bg-rose-500 animate-pulse"}),l.jsx("span",{children:"What Matters Right Now"})]}),n>0?l.jsx(At,{glow:"amber",className:"p-6 border-amber-500/30 relative overflow-hidden",children:l.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center justify-between gap-4",children:[l.jsxs("div",{className:"space-y-2",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(Mt,{variant:"amber",size:"sm",children:"Action Requires Approval"}),l.jsx("span",{className:"text-xs font-mono text-amber-400/90",children:"High Priority Safety Gate"})]}),l.jsx("h3",{className:"text-lg md:text-xl font-bold text-os-primary",children:"OS prepared external actions awaiting your confirmation"}),l.jsx("p",{className:"text-xs text-os-secondary max-w-2xl leading-relaxed",children:"Connector requests (such as email dispatch or calendar changes) are held behind tamper-evident SHA-256 integrity checks until you give explicit approval."})]}),l.jsx("div",{className:"flex items-center gap-3",children:l.jsxs(qe,{variant:"primary",size:"md",onClick:()=>e("approvals"),rightIcon:l.jsx(Vf,{className:"w-4 h-4"}),children:["Review Approvals (",n,")"]})})]})}):(()=>{var f,m;const p=((f=r==null?void 0:r.now)==null?void 0:f.task)||((m=r==null?void 0:r.now)!=null&&m.title?r.now:null);return p?l.jsx(At,{glow:"emerald",className:"p-6 border-emerald-500/30",children:l.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center justify-between gap-4",children:[l.jsxs("div",{className:"space-y-2",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(Mt,{variant:"emerald",size:"sm",children:"Immediate Focus"}),p.deadline&&l.jsxs("span",{className:"text-xs font-mono text-os-muted",children:["Deadline: ",new Date(p.deadline).toLocaleDateString()]})]}),l.jsx("h3",{className:"text-xl font-bold text-os-primary",children:p.title}),l.jsxs("p",{className:"text-xs text-os-secondary",children:["Estimated duration: ",p.estimated_duration_minutes||p.estimated_minutes||60," mins ·"," ",p.reason||"Highest priority in today's active plan."]})]}),l.jsx(qe,{variant:"primary",size:"md",onClick:()=>e("tasks"),leftIcon:l.jsx(E0,{className:"w-4 h-4"}),children:"Start Execution"})]})}):l.jsx(At,{className:"p-6",children:l.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[l.jsxs("div",{children:[l.jsx("h3",{className:"text-base font-semibold text-os-primary",children:"Clear Deck — No critical blockers"}),l.jsx("p",{className:"text-xs text-os-secondary mt-1",children:"You are up to date on pending decisions. Would you like OS to organize your schedule or inspect open commitments?"})]}),l.jsx(qe,{variant:"glass",size:"sm",onClick:()=>e("plan"),rightIcon:l.jsx(ya,{className:"w-4 h-4"}),children:"Inspect Schedule"})]})})})()]}),l.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[l.jsxs("section",{className:"space-y-3 lg:col-span-2",children:[l.jsxs("div",{className:"flex items-center justify-between",children:[l.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[l.jsx(Fr,{className:"w-3.5 h-3.5 text-os-secondary"}),l.jsx("span",{children:"Today's Time-Carved Schedule"})]}),l.jsxs("button",{onClick:()=>e("plan"),className:"text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1",children:[l.jsx("span",{children:"View Full Plan"}),l.jsx(ya,{className:"w-3.5 h-3.5"})]})]}),l.jsx(At,{className:"p-4 space-y-2.5",children:(()=>{const p=a.length>0?a:(r==null?void 0:r.today_plan)||[];return p.length===0?l.jsxs("div",{className:"py-8 text-center text-xs text-os-muted",children:["No active plan for today yet.",l.jsx("div",{className:"mt-2",children:l.jsx(qe,{variant:"glass",size:"sm",onClick:()=>e("plan"),leftIcon:l.jsx(Qn,{className:"w-3.5 h-3.5 text-emerald-400"}),children:"Generate Daily Plan"})})]}):p.slice(0,5).map((f,m)=>{var u,v;const x=f.start_time||(f.scheduled_start?new Date(f.scheduled_start).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):f.start?new Date(f.start).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"09:00"),_=f.duration_minutes||f.estimated_minutes||((u=f.why_now)==null?void 0:u.duration_minutes)||60,g=typeof f.why_now=="string"?f.why_now:((v=f.why_now)==null?void 0:v.rationale)||"";return l.jsxs("div",{className:"flex items-center justify-between p-2.5 rounded-glass-sm bg-white/5 hover:bg-white/10 border border-transparent hover:border-os-border transition-all",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("span",{className:"font-mono text-xs text-os-secondary w-16",children:x}),l.jsx("div",{className:"h-2 w-2 rounded-full bg-emerald-400/80"}),l.jsxs("div",{children:[l.jsx("div",{className:"text-xs font-semibold text-os-primary",children:f.title}),g&&l.jsx("div",{className:"text-[10px] text-os-muted line-clamp-1",children:g})]})]}),l.jsxs("span",{className:"text-[10px] font-mono text-os-muted",children:[_,"m"]})]},f.id||m)})})()})]}),l.jsxs("section",{className:"space-y-3",children:[l.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[l.jsx(Hf,{className:"w-3.5 h-3.5 text-cyan-400"}),l.jsx("span",{children:"Autonomous Background Work"})]}),l.jsxs(At,{className:"p-4 space-y-3",children:[l.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-os-border/50 text-xs",children:[l.jsx("span",{className:"text-os-secondary",children:"Watcher Engine"}),l.jsx("span",{className:"text-emerald-400 font-mono text-[11px]",children:"● ACTIVE"})]}),l.jsxs("div",{className:"space-y-2 text-xs",children:[l.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-black/20 border border-white/5",children:[l.jsx("div",{className:"font-semibold text-os-primary text-xs",children:"Deadline Watcher"}),l.jsx("div",{className:"text-[11px] text-os-muted mt-0.5",children:"Continually evaluating task progress and recalculating critical path."})]}),l.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-black/20 border border-white/5",children:[l.jsx("div",{className:"font-semibold text-os-primary text-xs",children:"Calendar Conflict Guard"}),l.jsx("div",{className:"text-[11px] text-os-muted mt-0.5",children:"Synchronizing busy slots with live Google Calendar adapter."})]}),l.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-black/20 border border-white/5",children:[l.jsx("div",{className:"font-semibold text-os-primary text-xs",children:"Email Ingestion Pipe"}),l.jsx("div",{className:"text-[11px] text-os-muted mt-0.5",children:"Extracting commitments and tasks from incoming communications."})]})]}),l.jsx(qe,{variant:"ghost",size:"sm",className:"w-full text-xs text-os-secondary justify-center",onClick:()=>e("agents"),children:"Inspect Specialized Workers →"})]})]})]}),l.jsxs("section",{className:"space-y-3",children:[l.jsxs("div",{className:"flex items-center justify-between",children:[l.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[l.jsx(Ga,{className:"w-3.5 h-3.5 text-os-secondary"}),l.jsx("span",{children:"Recent Operational Activity & Proofs"})]}),l.jsxs("button",{onClick:()=>e("activity"),className:"text-xs text-os-secondary hover:text-os-primary font-mono flex items-center gap-1",children:[l.jsx("span",{children:"Full Audit Trail"}),l.jsx(ya,{className:"w-3.5 h-3.5"})]})]}),l.jsx(At,{className:"p-4 space-y-2",children:r!=null&&r.recent_activity&&r.recent_activity.length>0?r.recent_activity.slice(0,4).map(p=>l.jsxs("div",{className:"flex items-center justify-between p-2 rounded-glass-sm hover:bg-white/5 transition-colors text-xs",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx(nn,{className:"w-3.5 h-3.5 text-emerald-400 flex-shrink-0"}),l.jsx("span",{className:"text-os-primary",children:p.summary||p.description||p.event_type||"Activity verified"})]}),l.jsx("span",{className:"font-mono text-[10px] text-os-muted",children:p.timestamp||p.created_at?new Date(p.timestamp||p.created_at).toLocaleTimeString():"Just now"})]},p.id)):l.jsx("div",{className:"py-4 text-center text-xs text-os-muted",children:"OS initialized. Activity events and proof receipts will be logged here."})})]})]})};function $T(t,e,n,i){const r=new AbortController;return(async()=>{try{const s=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t}),signal:r.signal});if(!s.ok)throw new Error(`Chat error: ${s.statusText}`);if(!s.body)throw new Error("Response body is empty");const a=s.body.getReader(),o=new TextDecoder("utf-8");let c="";for(;;){const{done:d,value:h}=await a.read();if(d)break;c+=o.decode(h,{stream:!0});const p=c.split(`
`);c=p.pop()||"";for(const f of p){const m=f.trim();if(m.startsWith("data: ")){const x=m.slice(6);if(x==="[DONE]")continue;try{const _=JSON.parse(x);_.t==="token"&&typeof _.d=="string"?e(_.d):_.t==="done"&&n(_)}catch(_){console.warn("Failed to parse SSE line:",x,_)}}}}}catch(s){s.name!=="AbortError"&&i(s)}})(),()=>{r.abort()}}const qT=({step:t})=>{const[e,n]=W.useState(!1),[i,r]=W.useState(!1),[s,a]=W.useState(!1),[o,c]=W.useState(!1),d=(t.tool||"").toLowerCase(),h=d.includes("browser")||d.includes("web"),p=d.includes("research")||d.includes("search"),f=d.includes("computer")||d.includes("terminal")||d.includes("bash"),m=d.includes("code")||d.includes("python"),_=h?td:p?zr:f?US:m?Zx:d.includes("calendar")?Fr:d.includes("email")||d.includes("gmail")?CS:d0,g=()=>{if(s)return l.jsx(Mt,{variant:"danger",size:"sm",children:"Stopped"});if(i)return l.jsx(Mt,{variant:"amber",size:"sm",children:"Paused"});switch(t.status){case"completed":return l.jsx(Mt,{variant:"emerald",size:"sm",icon:l.jsx(nn,{className:"w-3 h-3"}),children:"Completed"});case"running":return l.jsx(Mt,{variant:"cyan",size:"sm",icon:l.jsx(Ga,{className:"w-3 h-3 animate-spin"}),children:"Executing"});case"failed":return l.jsx(Mt,{variant:"danger",size:"sm",icon:l.jsx(nd,{className:"w-3 h-3"}),children:"Failed"});case"needs_approval":return l.jsx(Mt,{variant:"amber",size:"sm",icon:l.jsx(nd,{className:"w-3 h-3"}),children:"Approval Needed"});default:return null}},u=t.input&&(t.input.url||t.input.target_url)||(typeof t.input=="string"&&t.input.includes("http")?t.input:"https://github.com");return l.jsxs("div",{className:"rounded-glass-md border border-os-border bg-os-surface/60 backdrop-blur-md overflow-hidden my-2.5 transition-all",children:[l.jsxs("div",{onClick:()=>n(!e),className:"flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-white/5 transition-colors select-none",children:[l.jsxs("div",{className:"flex items-center gap-2.5",children:[l.jsx("div",{className:"p-1.5 rounded-lg bg-white/5 border border-white/10 text-os-secondary",children:l.jsx(_,{className:"w-3.5 h-3.5 text-emerald-400"})}),l.jsxs("div",{children:[l.jsx("span",{className:"text-xs font-semibold text-os-primary tracking-wide",children:t.tool}),h&&l.jsx("span",{className:"hidden sm:inline text-[11px] text-os-muted ml-2 font-mono truncate max-w-xs",children:u})]})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[g(),l.jsx("button",{className:"text-os-muted hover:text-os-primary p-0.5",children:e?l.jsx(Hx,{className:"w-4 h-4"}):l.jsx(ya,{className:"w-4 h-4"})})]})]}),h&&l.jsxs("div",{className:"p-3 border-t border-os-border/50 bg-black/30 space-y-2.5",children:[l.jsxs("div",{className:"flex items-center justify-between gap-2 px-3 py-1.5 rounded-glass-sm bg-black/40 border border-white/5 text-xs font-mono",children:[l.jsxs("div",{className:"flex items-center gap-2 truncate",children:[l.jsx(td,{className:"w-3.5 h-3.5 text-cyan-400 flex-shrink-0"}),l.jsx("span",{className:"text-os-secondary truncate",children:u})]}),l.jsx("div",{className:"flex items-center gap-1.5 flex-shrink-0",children:l.jsx("span",{className:"text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20",children:"Step 3 / 5"})})]}),l.jsx("div",{className:"relative rounded-glass-sm border border-white/10 bg-os-bg/80 p-4 min-h-[90px] flex flex-col justify-center items-center text-center",children:o?l.jsxs("div",{className:"space-y-1.5 animate-in fade-in",children:[l.jsx(Mt,{variant:"amber",size:"sm",children:"Manual Takeover Active"}),l.jsx("p",{className:"text-xs text-os-secondary",children:"You are directly controlling the Chromium session. OS will resume when returned."})]}):l.jsxs("div",{className:"space-y-1 text-xs text-os-secondary",children:[l.jsxs("div",{className:"flex items-center justify-center gap-2 text-emerald-400 font-mono text-[11px]",children:[l.jsx("span",{className:"h-2 w-2 rounded-full bg-emerald-400 animate-pulse"}),l.jsx("span",{children:"Navigating DOM · Extracting content"})]}),l.jsx("p",{className:"text-os-muted text-[11px]",children:"Agent-Browser is executing in isolated Playwright context."})]})}),l.jsxs("div",{className:"flex items-center justify-between pt-1 text-xs",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(qe,{variant:"glass",size:"sm",onClick:()=>c(!o),leftIcon:l.jsx(n0,{className:"w-3 h-3 text-cyan-400"}),children:o?"Return to OS":"Take Control"}),l.jsx(qe,{variant:"ghost",size:"sm",onClick:()=>r(!i),leftIcon:i?l.jsx(E0,{className:"w-3 h-3 text-emerald-400"}):l.jsx(PS,{className:"w-3 h-3 text-amber-400"}),children:i?"Resume":"Pause"})]}),l.jsx(qe,{variant:"danger",size:"sm",onClick:()=>a(!0),leftIcon:l.jsx(IS,{className:"w-3 h-3"}),children:"Stop"})]})]}),f&&l.jsxs("div",{className:"p-3 border-t border-os-border/50 bg-black/40 space-y-2 text-xs font-mono",children:[l.jsxs("div",{className:"flex items-center justify-between text-[11px] text-os-muted pb-1 border-b border-white/5",children:[l.jsx("span",{children:"Isolated Sandbox: /workspace"}),l.jsx("span",{className:"text-emerald-400",children:"● Docker Container"})]}),l.jsx("div",{className:"p-2.5 rounded bg-black/60 border border-white/5 text-[11px] text-emerald-300",children:l.jsxs("code",{children:["$ ",t.input?JSON.stringify(t.input):"python -m pytest"]})})]}),e&&l.jsxs("div",{className:"p-3 border-t border-os-border/60 bg-black/20 text-xs font-mono space-y-2",children:[t.input&&l.jsxs("div",{children:[l.jsx("div",{className:"text-[10px] uppercase tracking-wider text-os-muted mb-1 font-sans",children:"Input Parameters"}),l.jsx("pre",{className:"p-2 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-os-secondary",children:typeof t.input=="string"?t.input:JSON.stringify(t.input,null,2)})]}),t.output&&l.jsxs("div",{children:[l.jsx("div",{className:"text-[10px] uppercase tracking-wider text-os-muted mb-1 font-sans",children:"Execution Result"}),l.jsx("pre",{className:"p-2 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-emerald-300/90 max-h-48",children:typeof t.output=="string"?t.output:JSON.stringify(t.output,null,2)})]})]})]})},Xd=({approval:t,onDecided:e})=>{const{refreshData:n,addNotification:i}=un(),[r,s]=W.useState(t.status||"pending"),[a,o]=W.useState(!1),c=(t.risk_level||"MEDIUM").toUpperCase(),d=c==="HIGH"?"danger":c==="LOW"?"emerald":"amber",h=async()=>{o(!0);try{t.aid?await ke.approveAction(t.aid):t.id&&await ke.approveV1(t.id,t.params||{}),s("approved"),e==null||e("approved"),i({type:"success",title:"Action Approved & Executed",message:"The safety executor has completed and verified this action."}),n()}catch(f){i({type:"error",title:"Approval Failed",message:f.message||"Execution error occurred."})}finally{o(!1)}},p=async()=>{o(!0);try{t.aid?await ke.rejectAction(t.aid):t.id&&await ke.rejectV1(t.id,"User rejected in Ask OS"),s("rejected"),e==null||e("rejected"),i({type:"info",title:"Action Rejected",message:"The action was discarded safely without execution."}),n()}catch(f){i({type:"error",title:"Rejection Failed",message:f.message})}finally{o(!1)}};return l.jsxs("div",{className:"rounded-glass-lg border border-amber-500/30 bg-os-surface/80 backdrop-blur-md p-4 my-3 shadow-glass-glow-amber",children:[l.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-os-border/60",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("div",{className:"p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400",children:l.jsx(Kl,{className:"w-4 h-4"})}),l.jsxs("div",{children:[l.jsx("h4",{className:"text-xs font-semibold text-os-primary uppercase tracking-wider font-mono",children:"Action Approval Required"}),l.jsx("p",{className:"text-[11px] text-os-secondary",children:"OS prepared this action and awaits your confirmation."})]})]}),l.jsxs(Mt,{variant:d,size:"sm",children:[c," RISK"]})]}),l.jsxs("div",{className:"py-3 space-y-2",children:[l.jsxs("div",{className:"text-sm font-medium text-os-primary flex items-center gap-2",children:[l.jsx("span",{className:"font-semibold text-emerald-400",children:t.connector_name||t.action||"External Action"}),t.title&&l.jsxs("span",{className:"text-os-secondary",children:["— ",t.title]})]}),t.params&&Object.keys(t.params).length>0&&l.jsx("div",{className:"rounded-glass-sm bg-black/30 border border-white/5 p-3 space-y-1.5 text-xs font-mono",children:Object.entries(t.params).map(([f,m])=>l.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-start justify-between gap-1",children:[l.jsxs("span",{className:"text-os-muted uppercase text-[10px] tracking-wider sm:w-28 flex-shrink-0",children:[f,":"]}),l.jsx("span",{className:"text-os-secondary text-right sm:text-left flex-1 break-all",children:typeof m=="object"?JSON.stringify(m):String(m)})]},f))}),t.arguments_hash&&l.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-mono text-os-muted pt-1",children:[l.jsx(Nl,{className:"w-3 h-3 text-emerald-400"}),l.jsxs("span",{className:"truncate",children:["Hash: ",t.arguments_hash.substring(0,24),"..."]})]})]}),l.jsx("div",{className:"pt-2 border-t border-os-border/60 flex items-center justify-between",children:r==="pending"?l.jsxs("div",{className:"flex items-center gap-2.5 w-full justify-end",children:[l.jsx(qe,{variant:"ghost",size:"sm",onClick:p,isLoading:a,leftIcon:l.jsx(ed,{className:"w-3.5 h-3.5"}),children:"Reject"}),l.jsx(qe,{variant:"primary",size:"sm",onClick:h,isLoading:a,leftIcon:l.jsx(nn,{className:"w-3.5 h-3.5"}),children:"Approve & Execute"})]}):r==="approved"?l.jsxs("div",{className:"flex items-center gap-2 text-xs font-medium text-emerald-400 py-1",children:[l.jsx(nn,{className:"w-4 h-4"}),l.jsx("span",{children:"Approved & Safely Executed"})]}):l.jsxs("div",{className:"flex items-center gap-2 text-xs font-medium text-rose-400 py-1",children:[l.jsx(ed,{className:"w-4 h-4"}),l.jsx("span",{children:"Action Rejected"})]})})]})},YT=({execution:t})=>l.jsxs("div",{className:"rounded-glass-md border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm p-3.5 my-2.5",children:[l.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-emerald-500/20",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(L0,{className:"w-4 h-4 text-emerald-400"}),l.jsx("span",{className:"text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider",children:"Real-World Verification"})]}),l.jsx(Mt,{variant:"emerald",size:"sm",icon:l.jsx(nn,{className:"w-3 h-3"}),children:"VERIFIED"})]}),l.jsxs("div",{className:"pt-2 text-xs space-y-1.5 font-mono",children:[l.jsxs("div",{className:"text-os-secondary",children:["Target Operation: ",l.jsx("span",{className:"text-os-primary font-medium",children:t.tool})]}),l.jsxs("div",{className:"space-y-1 pt-1 text-[11px] text-emerald-300/90",children:[l.jsxs("div",{className:"flex items-center gap-1.5",children:[l.jsx(nn,{className:"w-3 h-3 text-emerald-400 flex-shrink-0"}),l.jsx("span",{children:"Action completed via connector safe pipeline"})]}),l.jsxs("div",{className:"flex items-center gap-1.5",children:[l.jsx(nn,{className:"w-3 h-3 text-emerald-400 flex-shrink-0"}),l.jsx("span",{children:"External read-back verification confirmed"})]}),l.jsxs("div",{className:"flex items-center gap-1.5",children:[l.jsx(nn,{className:"w-3 h-3 text-emerald-400 flex-shrink-0"}),l.jsx("span",{children:"Receipt stored in World Model evidence ledger"})]})]}),t.receipt&&l.jsx("div",{className:"mt-2 p-2 rounded bg-black/30 border border-white/5 text-[10px] text-os-muted overflow-x-auto max-h-28",children:l.jsx("pre",{children:JSON.stringify(t.receipt,null,2)})})]})]}),KT=()=>{const{me:t,orbState:e,setOrbState:n,addNotification:i}=un(),{isVoiceActive:r,toggleVoice:s}=Ix(),[a,o]=W.useState([{id:"welcome",sender:"os",content:`Hello ${(t==null?void 0:t.name)||"Sai"}. I'm OS, your personal AI operating system. I can plan your day, research topics, execute email and calendar actions with safety verification, and monitor your commitments. How can I help right now?`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),[c,d]=W.useState(""),[h,p]=W.useState(!1),f=W.useRef(null),m=W.useRef(null),x=()=>{var u;(u=f.current)==null||u.scrollIntoView({behavior:"smooth"})};W.useEffect(()=>{x()},[a,h]),W.useEffect(()=>{const u=localStorage.getItem("os_pending_chat_prompt");u&&(localStorage.removeItem("os_pending_chat_prompt"),_(u))},[]);const _=u=>{const v=(u||c).trim();if(!v||h)return;const S={id:Math.random().toString(36).substring(2,9),sender:"user",content:v,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},N=Math.random().toString(36).substring(2,9),A={id:N,sender:"os",content:"",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),streaming:!0};o(E=>[...E,S,A]),d(""),p(!0),n("THINKING"),$T(v,E=>{n("SPEAKING"),o(R=>R.map(T=>T.id===N?{...T,content:T.content+E}:T))},E=>{p(!1),n("IDLE"),o(R=>R.map(T=>T.id===N?{...T,content:E.main||T.content||E.full,streaming:!1,actionApproval:E.action_approval||E.approval||null,execution:E.execution||null}:T))},E=>{p(!1),n("IDLE"),o(R=>R.map(T=>T.id===N?{...T,content:T.content||`I encountered an issue reaching the model or tools: ${E.message}. Please verify local services are running.`,streaming:!1}:T)),i({type:"error",title:"Engine Error",message:E.message})})},g=["Plan my day and resolve conflicts","What matters right now and what is blocked?","Review all pending approvals","Research recent breakthroughs in AI agents"];return l.jsxs("div",{className:"flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-4 md:px-6 py-4",children:[l.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-os-border mb-3 select-none",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx(Tv,{state:e,size:32}),l.jsxs("div",{children:[l.jsx("h2",{className:"text-sm font-semibold text-os-primary tracking-tight",children:"Ask OS"}),l.jsx("p",{className:"text-[11px] text-os-secondary",children:"Personal intelligence canvas · Safe execution active"})]})]}),l.jsx("div",{className:"flex items-center gap-2",children:h&&l.jsxs("span",{className:"flex items-center gap-1.5 text-xs text-cyan-400 font-mono",children:[l.jsx(Xn,{className:"w-3.5 h-3.5 animate-spin"}),"OS is working..."]})})]}),l.jsxs("div",{className:"flex-1 overflow-y-auto pr-2 space-y-4",children:[a.map(u=>l.jsxs("div",{className:`flex flex-col ${u.sender==="user"?"items-end":"items-start"} transition-all`,children:[l.jsx("div",{className:"flex items-center gap-2 mb-1 px-1",children:u.sender==="user"?l.jsxs(l.Fragment,{children:[l.jsx("span",{className:"text-[10px] font-mono text-os-muted",children:u.timestamp}),l.jsx("span",{className:"text-xs font-medium text-os-secondary",children:"You"})]}):l.jsxs(l.Fragment,{children:[l.jsx("img",{src:"/static/logo.png",alt:"OS",className:"w-4 h-4 rounded-full object-contain filter drop-shadow-[0_0_6px_rgba(99,102,241,0.4)]"}),l.jsx("span",{className:"text-xs font-semibold text-os-secondary",children:"OS"}),l.jsx("span",{className:"text-[10px] font-mono text-os-muted",children:u.timestamp})]})}),l.jsxs("div",{className:`max-w-2xl rounded-glass-lg p-4 text-xs md:text-sm leading-relaxed ${u.sender==="user"?"bg-emerald-500/15 border border-emerald-500/25 text-os-primary rounded-br-sm":"glass-panel border-os-border-glass text-os-primary rounded-bl-sm"}`,children:[l.jsx("div",{className:"whitespace-pre-wrap",children:u.content}),u.streaming&&l.jsxs("div",{className:"inline-flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-mono",children:[l.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"}),l.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse delay-75"}),l.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse delay-150"})]}),u.toolCalls&&u.toolCalls.length>0&&l.jsx("div",{className:"mt-3 pt-2 border-t border-white/5 space-y-1",children:u.toolCalls.map(v=>l.jsx(qT,{step:v},v.id))}),u.actionApproval&&l.jsx(Xd,{approval:u.actionApproval}),u.execution&&u.execution.verified&&l.jsx(YT,{execution:u.execution})]})]},u.id)),l.jsx("div",{ref:f})]}),a.length<4&&!h&&l.jsx("div",{className:"py-2 flex flex-wrap gap-2",children:g.map(u=>l.jsx("button",{onClick:()=>_(u),className:"btn-press px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-os-border hover:border-os-border-glass text-xs text-os-secondary hover:text-os-primary transition-all select-none",children:u},u))}),l.jsxs("div",{className:"pt-2 select-none",children:[l.jsxs("div",{className:"glass-panel rounded-glass-xl border-os-border-glass p-2 shadow-2xl flex items-center gap-2",children:[l.jsx("button",{onClick:s,className:`btn-press p-2.5 rounded-glass-md transition-all ${r?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glass-glow":"text-os-muted hover:text-os-primary hover:bg-white/5"}`,title:"Voice talk mode",children:r?l.jsx(_0,{className:"w-4 h-4 animate-pulse"}):l.jsx(x0,{className:"w-4 h-4"})}),l.jsx("input",{ref:m,type:"text",value:c,onChange:u=>d(u.target.value),onKeyDown:u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),_())},placeholder:"Ask OS anything or direct an action (e.g., 'Schedule meeting with Alex at 3pm')...",className:"flex-1 bg-transparent px-2 text-xs md:text-sm text-os-primary placeholder:text-os-muted focus:outline-none",disabled:h}),l.jsx("button",{onClick:()=>_(),disabled:!c.trim()||h,className:"btn-press p-2.5 rounded-glass-md bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glass-glow",children:l.jsx(N0,{className:"w-4 h-4"})})]}),l.jsxs("div",{className:"flex items-center justify-between px-3 pt-1.5 text-[10px] text-os-muted font-mono",children:[l.jsx("span",{children:"Press Enter to send"}),l.jsx("span",{children:"End-to-end safe execution boundary active"})]})]})]})},ZT=()=>{const{addNotification:t}=un(),[e,n]=W.useState(null),[i,r]=W.useState([]),[s,a]=W.useState(!0),[o,c]=W.useState(!1),[d,h]=W.useState(new Date().toISOString().split("T")[0]),p=async m=>{a(!0);try{const x=await ke.getPlan(m||d);n(x.plan),r(x.items||[])}catch(x){console.error("Failed to load plan:",x)}finally{a(!1)}};W.useEffect(()=>{p(d)},[d]);const f=async()=>{c(!0);try{const m=await ke.generatePlan(d);n(m.plan),r(m.items||[]),t({type:"success",title:"Plan Generated",message:"Topological dependencies & calendar busy slots reconciled."})}catch(m){t({type:"error",title:"Generation Failed",message:m.message})}finally{c(!1)}};return l.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[l.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{className:"text-xs font-mono text-emerald-400 uppercase tracking-widest",children:"Deterministic Planner"}),l.jsx("span",{className:"h-1 w-1 rounded-full bg-emerald-400"}),l.jsx("span",{className:"text-xs text-os-secondary",children:d})]}),l.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight mt-1",children:"Day Schedule & Conflict Carving"}),l.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Strict deadline separation · Busy slot allocation · Dependency preservation"})]}),l.jsxs("div",{className:"flex items-center gap-2.5",children:[l.jsx(qe,{variant:"glass",size:"sm",onClick:()=>p(),isLoading:s,leftIcon:l.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"}),l.jsx(qe,{variant:"primary",size:"sm",onClick:f,isLoading:o,leftIcon:l.jsx(Qn,{className:"w-3.5 h-3.5"}),children:"Generate / Replan"})]})]}),l.jsx("div",{className:"space-y-4",children:i.length===0?l.jsxs(At,{className:"p-12 text-center space-y-3",children:[l.jsx("div",{className:"w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto",children:l.jsx(Fr,{className:"w-6 h-6"})}),l.jsxs("h3",{className:"text-base font-semibold text-os-primary",children:["No scheduled plan for ",d]}),l.jsx("p",{className:"text-xs text-os-secondary max-w-sm mx-auto",children:"OS can analyze your open tasks, calendar busy slots, and deadlines to compute an optimal execution order."}),l.jsx(qe,{variant:"primary",size:"md",onClick:f,isLoading:o,leftIcon:l.jsx(Qn,{className:"w-4 h-4"}),children:"Generate Daily Plan"})]}):l.jsx("div",{className:"relative pl-6 md:pl-8 border-l border-os-border/60 space-y-4",children:i.map((m,x)=>{var A,E;const _=(m.item_type||m.type||m.status||"TASK").toLowerCase(),g=_==="meeting"||_==="event",u=_==="buffer",v=m.start_time||(m.scheduled_start?new Date(m.scheduled_start).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"09:00"),y=m.end_time||(m.scheduled_end?new Date(m.scheduled_end).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"10:00"),S=m.duration_minutes||((A=m.why_now)==null?void 0:A.duration_minutes)||60,N=typeof m.why_now=="string"?m.why_now:((E=m.why_now)==null?void 0:E.rationale)||"";return l.jsxs("div",{className:"relative group",children:[l.jsx("div",{className:`absolute -left-[31px] md:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-os-bg transition-transform group-hover:scale-110 ${g?"bg-cyan-400":u?"bg-amber-400":"bg-emerald-400"}`}),l.jsxs(At,{className:`p-4 transition-all ${g?"border-cyan-500/20":"hover:border-os-border-glass"}`,children:[l.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-os-border/40",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsxs("span",{className:"font-mono text-xs font-semibold text-emerald-400",children:[v," - ",y]}),l.jsx(Mt,{variant:g?"cyan":u?"amber":"emerald",size:"sm",children:_.toUpperCase()})]}),l.jsxs("span",{className:"text-[11px] font-mono text-os-muted",children:[S," min slot"]})]}),l.jsxs("div",{className:"pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[l.jsxs("div",{children:[l.jsx("h4",{className:"text-sm font-semibold text-os-primary",children:m.title||m.summary||"Scheduled Item"}),N&&l.jsxs("p",{className:"text-xs text-os-secondary mt-1 flex items-center gap-1.5",children:[l.jsx("span",{className:"font-mono text-[10px] uppercase text-os-muted",children:"Rationale:"}),l.jsx("span",{children:N})]})]}),m.task_id&&l.jsx("div",{className:"flex items-center gap-2",children:l.jsx(qe,{variant:"glass",size:"sm",leftIcon:l.jsx(nn,{className:"w-3.5 h-3.5 text-emerald-400"}),onClick:async()=>{try{await ke.completeTask(m.task_id),t({type:"success",title:"Task Completed",message:"Task marked complete and evidence registered."}),p()}catch(R){t({type:"error",title:"Update Failed",message:R.message})}},children:"Mark Done"})})]})]})]},m.id||x)})})})]})},Ll=({isOpen:t,onClose:e,title:n,subtitle:i,children:r,maxWidth:s="md"})=>{if(W.useEffect(()=>{const o=c=>{c.key==="Escape"&&e()};return t&&(document.body.style.overflow="hidden",window.addEventListener("keydown",o)),()=>{document.body.style.overflow="",window.removeEventListener("keydown",o)}},[t,e]),!t)return null;const a={sm:"max-w-md",md:"max-w-xl",lg:"max-w-3xl",xl:"max-w-5xl"}[s];return l.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[l.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200",onClick:e}),l.jsx("div",{className:`relative w-full ${a} z-10 animate-in fade-in zoom-in-95 duration-200`,children:l.jsxs(At,{className:"p-6 border-os-border-glass shadow-2xl",children:[l.jsxs("div",{className:"flex items-start justify-between pb-4 border-b border-os-border",children:[l.jsxs("div",{children:[l.jsx("h3",{className:"text-lg font-semibold text-os-primary",children:n}),i&&l.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:i})]}),l.jsx("button",{onClick:e,className:"text-os-muted hover:text-os-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors",children:l.jsx(Gf,{className:"w-5 h-5"})})]}),l.jsx("div",{className:"mt-4",children:r})]})})]})},QT=()=>{const{addNotification:t}=un(),[e,n]=W.useState("commitments"),[i,r]=W.useState([]),[s,a]=W.useState([]),[o,c]=W.useState(!0),[d,h]=W.useState(!1),[p,f]=W.useState(""),[m,x]=W.useState(""),[_,g]=W.useState(""),[u,v]=W.useState(50),[y,S]=W.useState(!1),N=async()=>{c(!0);try{const[E,R]=await Promise.allSettled([ke.getCommitments(),ke.getTasks()]);E.status==="fulfilled"&&r(E.value.commitments||[]),R.status==="fulfilled"&&a(R.value.tasks||[])}catch(E){console.error("Failed to load tasks/commitments:",E)}finally{c(!1)}};W.useEffect(()=>{N()},[]);const A=async()=>{if(p.trim()){S(!0);try{e==="commitments"?(await ke.createCommitment({title:p.trim(),description:m.trim()||void 0,deadline:_||null,priority:u}),t({type:"success",title:"Commitment Registered",message:"Saved to World Model with immutable deadline tracking."})):(await ke.createTask(p.trim(),{priority:u,deadline:_||null}),t({type:"success",title:"Task Created",message:"Task added to execution pool."})),h(!1),f(""),x(""),g(""),N()}catch(E){t({type:"error",title:"Creation Failed",message:E.message})}finally{S(!1)}}};return l.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[l.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[l.jsxs("div",{children:[l.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Commitments & Work"}),l.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Real-world contractual commitments vs tactical execution tasks"})]}),l.jsxs("div",{className:"flex items-center gap-2.5",children:[l.jsx(qe,{variant:"glass",size:"sm",onClick:N,isLoading:o,leftIcon:l.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"}),l.jsx(qe,{variant:"primary",size:"sm",onClick:()=>h(!0),leftIcon:l.jsx(T0,{className:"w-3.5 h-3.5"}),children:e==="commitments"?"New Commitment":"New Task"})]})]}),l.jsxs("div",{className:"flex items-center gap-2 border-b border-os-border select-none",children:[l.jsxs("button",{onClick:()=>n("commitments"),className:`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${e==="commitments"?"border-emerald-400 text-emerald-400":"border-transparent text-os-secondary hover:text-os-primary"}`,children:["Commitments (",i.length,")"]}),l.jsxs("button",{onClick:()=>n("tasks"),className:`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${e==="tasks"?"border-emerald-400 text-emerald-400":"border-transparent text-os-secondary hover:text-os-primary"}`,children:["Tasks (",s.length,")"]})]}),e==="commitments"?l.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:i.length===0?l.jsx("div",{className:"col-span-full py-12 text-center text-xs text-os-muted",children:"No active commitments found. Create one or let OS detect commitments from email."}):i.map(E=>l.jsxs(At,{className:"p-5 space-y-3",children:[l.jsxs("div",{className:"flex items-start justify-between gap-2",children:[l.jsxs("div",{children:[l.jsx("span",{className:"text-[10px] font-mono uppercase tracking-wider text-emerald-400",children:"Commitment"}),l.jsx("h3",{className:"text-base font-bold text-os-primary mt-0.5",children:E.title})]}),l.jsx(Mt,{variant:E.status==="active"?"emerald":"neutral",size:"sm",children:E.status.toUpperCase()})]}),E.description&&l.jsx("p",{className:"text-xs text-os-secondary leading-relaxed",children:E.description}),l.jsxs("div",{className:"pt-2 border-t border-os-border/50 grid grid-cols-2 gap-2 text-[11px] font-mono",children:[l.jsxs("div",{children:[l.jsx("span",{className:"text-os-muted block text-[10px]",children:"DEADLINE"}),l.jsx("span",{className:"text-os-primary font-medium",children:E.deadline?new Date(E.deadline).toLocaleDateString():"None set"})]}),l.jsxs("div",{children:[l.jsx("span",{className:"text-os-muted block text-[10px]",children:"PRIORITY"}),l.jsxs("span",{className:"text-emerald-400 font-medium",children:[E.priority," / 100"]})]})]})]},E.id))}):l.jsx("div",{className:"space-y-2.5",children:s.length===0?l.jsx("div",{className:"py-12 text-center text-xs text-os-muted",children:"No tasks currently tracked."}):s.map(E=>{const R=E.status==="DONE";return l.jsxs(At,{className:`p-4 flex items-center justify-between transition-all ${R?"opacity-60 bg-white/2":""}`,children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("button",{onClick:async()=>{if(!R)try{await ke.completeTask(String(E.id)),t({type:"success",title:"Task Done",message:"Completion recorded with verification."}),N()}catch(T){t({type:"error",title:"Failed",message:T.message})}},className:`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${R?"bg-emerald-500 border-emerald-500 text-black":"border-os-border hover:border-emerald-400 text-transparent"}`,children:l.jsx(nn,{className:"w-3.5 h-3.5"})}),l.jsxs("div",{children:[l.jsx("div",{className:`text-xs md:text-sm font-medium ${R?"line-through text-os-muted":"text-os-primary"}`,children:E.title}),l.jsxs("div",{className:"text-[10px] font-mono text-os-muted mt-0.5",children:["Duration: ",E.estimated_duration_minutes||60,"m · Priority: ",E.priority||50]})]})]}),l.jsx(Mt,{variant:R?"neutral":"cyan",size:"sm",children:E.status})]},E.id)})}),l.jsx(Ll,{isOpen:d,onClose:()=>h(!1),title:e==="commitments"?"Register New Commitment":"Create Task",subtitle:"Saved to the World Model database.",children:l.jsxs("div",{className:"space-y-4 text-xs",children:[l.jsxs("div",{children:[l.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Title"}),l.jsx("input",{type:"text",value:p,onChange:E=>f(E.target.value),placeholder:"e.g. Send final investment proposal",className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"})]}),e==="commitments"&&l.jsxs("div",{children:[l.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Description"}),l.jsx("textarea",{value:m,onChange:E=>x(E.target.value),placeholder:"Contractual context, scope, or conditions...",rows:3,className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"})]}),l.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[l.jsxs("div",{children:[l.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Deadline"}),l.jsx("input",{type:"date",value:_,onChange:E=>g(E.target.value),className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Priority (1-100)"}),l.jsx("input",{type:"number",min:"1",max:"100",value:u,onChange:E=>v(Number(E.target.value)),className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"})]})]}),l.jsxs("div",{className:"flex justify-end gap-2 pt-3 border-t border-os-border",children:[l.jsx(qe,{variant:"ghost",size:"sm",onClick:()=>h(!1),children:"Cancel"}),l.jsx(qe,{variant:"primary",size:"sm",onClick:A,isLoading:y,children:"Save"})]})]})})]})},JT=()=>{const{refreshData:t}=un(),[e,n]=W.useState([]),[i,r]=W.useState([]),[s,a]=W.useState(!0),o=async()=>{a(!0);try{const[d,h]=await Promise.allSettled([ke.getV1Approvals(),ke.getPendingActions()]);d.status==="fulfilled"&&n(d.value.pending_approvals||[]),h.status==="fulfilled"&&r(h.value.pending||[])}catch(d){console.error("Failed to load approvals:",d)}finally{a(!1)}};W.useEffect(()=>{o()},[]);const c=e.length+i.length;return l.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[l.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{className:"text-xs font-mono text-amber-400 uppercase tracking-widest",children:"Governance & Safety"}),l.jsx("span",{className:"h-1 w-1 rounded-full bg-amber-400"}),l.jsxs("span",{className:"text-xs text-os-secondary",children:[c," pending review"]})]}),l.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight mt-1",children:"Safety & Action Approval Center"}),l.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Cryptographic SHA-256 tamper detection · Double-execution prevention · Expiry guards"})]}),l.jsx(qe,{variant:"glass",size:"sm",onClick:o,isLoading:s,leftIcon:l.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh Queue"})]}),l.jsx(At,{className:"p-4 border-amber-500/20 bg-amber-500/5",children:l.jsxs("div",{className:"flex items-start gap-3",children:[l.jsx("div",{className:"p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0",children:l.jsx(Nl,{className:"w-4 h-4"})}),l.jsxs("div",{className:"text-xs space-y-1",children:[l.jsx("h4",{className:"font-semibold text-os-primary",children:"OS Safe Execution Policy"}),l.jsxs("p",{className:"text-os-secondary leading-relaxed",children:["Every external write operation (sending emails, modifying calendar events, writing to external APIs) is intercepted by the ",l.jsx("code",{children:"SafeExecutor"}),". The exact arguments are hashed; any parameter tampering between approval and execution results in an immediate abort."]})]})]})}),l.jsx("div",{className:"space-y-4",children:c===0?l.jsxs(At,{className:"p-12 text-center space-y-3",children:[l.jsx("div",{className:"w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto",children:l.jsx(nn,{className:"w-6 h-6"})}),l.jsx("h3",{className:"text-base font-semibold text-os-primary",children:"Queue Clear"}),l.jsx("p",{className:"text-xs text-os-secondary max-w-sm mx-auto",children:"There are no pending actions requiring your authorization. OS is running in safe read-only mode for all external channels."})]}):l.jsxs("div",{className:"space-y-4",children:[i.map(d=>l.jsx(Xd,{approval:{id:d.id,aid:d.id,connector_id:d.connector_id,connector_name:d.connector_name,action:d.action,params:d.params,status:"pending"},onDecided:()=>{o(),t()}},d.id)),e.map(d=>l.jsx(Xd,{approval:{id:d.approval_id,action:d.tool_name,risk_level:d.risk_level,params:d.arguments,arguments_hash:d.arguments_hash,status:"pending"},onDecided:()=>{o(),t()}},d.approval_id))]})})]})},e2=()=>{const{addNotification:t,refreshData:e}=un(),[n,i]=W.useState([]),[r,s]=W.useState(!0),[a,o]=W.useState(!1),[c,d]=W.useState("research"),[h,p]=W.useState(""),[f,m]=W.useState(!1),x=async()=>{s(!0);try{const u=await ke.getAgents();i(u.agent_runs||[])}catch(u){console.error("Failed to load agent runs:",u)}finally{s(!1)}};W.useEffect(()=>{x()},[]);const _=async()=>{if(h.trim()){m(!0);try{await ke.dispatchAgent(c,h.trim()),t({type:"success",title:"Worker Dispatched",message:`${c.toUpperCase()} worker launched in background.`}),o(!1),p(""),x(),e()}catch(u){t({type:"error",title:"Dispatch Failed",message:u.message})}finally{m(!1)}}},g=[{name:"OpenCode Assistant",type:"coding",icon:Zx,desc:"Local AST code editing, test running, and repository refactoring.",status:"Ready",color:"emerald"},{name:"Agent-Browser",type:"browser",icon:td,desc:"Playwright headless/headful web navigation, form fill, and screenshot extraction.",status:"Ready",color:"cyan"},{name:"GPT-Researcher",type:"research",icon:zr,desc:"Multi-source web evidence gathering, citation cross-checking, and synthesis.",status:"Ready",color:"purple"},{name:"Continuous Planner",type:"planner",icon:Fr,desc:"Topological dependency sorting, conflict carving, and deadline monitoring.",status:"Monitoring",color:"amber"}];return l.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[l.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[l.jsxs("div",{children:[l.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Specialized OS Workers"}),l.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Dedicated execution units for coding, browser automation, and deep research"})]}),l.jsxs("div",{className:"flex items-center gap-2.5",children:[l.jsx(qe,{variant:"glass",size:"sm",onClick:x,isLoading:r,leftIcon:l.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"}),l.jsx(qe,{variant:"primary",size:"sm",onClick:()=>o(!0),leftIcon:l.jsx(T0,{className:"w-3.5 h-3.5"}),children:"Dispatch Task"})]})]}),l.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:g.map(u=>{const v=u.icon;return l.jsxs(At,{className:"p-4 space-y-3",children:[l.jsxs("div",{className:"flex items-center justify-between",children:[l.jsx("div",{className:"p-2 rounded-lg bg-white/5 border border-white/10 text-os-secondary",children:l.jsx(v,{className:"w-4 h-4 text-emerald-400"})}),l.jsx(Mt,{variant:u.status==="Monitoring"?"cyan":"emerald",size:"sm",children:u.status})]}),l.jsxs("div",{children:[l.jsx("h3",{className:"text-sm font-bold text-os-primary",children:u.name}),l.jsx("p",{className:"text-[11px] text-os-secondary mt-1 leading-snug",children:u.desc})]}),l.jsx("div",{className:"pt-2 border-t border-os-border/40",children:l.jsxs("button",{onClick:()=>{d(u.type),o(!0)},className:"text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1",children:[l.jsx("span",{children:"Dispatch worker"}),l.jsx("span",{children:"→"})]})})]},u.name)})}),l.jsxs("section",{className:"space-y-3",children:[l.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[l.jsx(Ga,{className:"w-3.5 h-3.5"}),l.jsx("span",{children:"Recent Worker Runs"})]}),l.jsx(At,{className:"p-4 space-y-2",children:n.length===0?l.jsx("div",{className:"py-8 text-center text-xs text-os-muted",children:'No recent worker tasks recorded. Use "Dispatch Task" or direct OS in chat.'}):n.map(u=>{var N;const v=u.instruction||((N=u.input_reference)==null?void 0:N.instruction)||u.workflow_type||"Worker execution",y=(u.status||"").toLowerCase(),S=y==="completed"||y==="succeeded"?"emerald":y==="running"?"amber":y==="failed"?"danger":"neutral";return l.jsxs("div",{className:"flex items-center justify-between p-3 rounded-glass-sm bg-white/5 hover:bg-white/10 transition-colors text-xs",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx(Mt,{variant:"cyan",size:"sm",children:u.agent_type.toUpperCase()}),l.jsx("span",{className:"font-medium text-os-primary",children:v})]}),l.jsxs("div",{className:"flex items-center gap-3 font-mono text-[11px]",children:[l.jsx(Mt,{variant:S,size:"sm",children:u.status}),u.created_at&&l.jsx("span",{className:"text-os-muted",children:new Date(u.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]})]},u.id)})})]}),l.jsx(Ll,{isOpen:a,onClose:()=>o(!1),title:"Dispatch Autonomous Worker",subtitle:"Worker will execute in the background with policy bounds.",children:l.jsxs("div",{className:"space-y-4 text-xs",children:[l.jsxs("div",{children:[l.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Worker Type"}),l.jsxs("select",{value:c,onChange:u=>d(u.target.value),className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400",children:[l.jsx("option",{value:"research",children:"GPT-Researcher (Web & Evidence)"}),l.jsx("option",{value:"browser",children:"Agent-Browser (Playwright Web Automation)"}),l.jsx("option",{value:"coding",children:"OpenCode (Code Writer / Editor)"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Instruction / Objective"}),l.jsx("textarea",{value:h,onChange:u=>p(u.target.value),placeholder:"e.g. Research the latest benchmarks for reasoning models...",rows:4,className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"})]}),l.jsxs("div",{className:"flex justify-end gap-2 pt-3 border-t border-os-border",children:[l.jsx(qe,{variant:"ghost",size:"sm",onClick:()=>o(!1),children:"Cancel"}),l.jsx(qe,{variant:"primary",size:"sm",onClick:_,isLoading:f,leftIcon:l.jsx(N0,{className:"w-3.5 h-3.5"}),children:"Dispatch"})]})]})})]})},t2=()=>{const[t,e]=W.useState([]),[n,i]=W.useState(!0),[r,s]=W.useState(null),[a,o]=W.useState(""),c=async()=>{i(!0);try{const h=await ke.getActivity(100);e(h.activity||[])}catch(h){console.error("Failed to load activity log:",h)}finally{i(!1)}};W.useEffect(()=>{c()},[]);const d=t.filter(h=>{const p=h.summary||h.description||h.event_type||"",f=h.action_type||h.event_type||"";return p.toLowerCase().includes(a.toLowerCase())||f.toLowerCase().includes(a.toLowerCase())});return l.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[l.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[l.jsxs("div",{children:[l.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Evidence & Audit Trail"}),l.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Immutable log of system decisions, execution receipts, and external read-back verifications"})]}),l.jsx(qe,{variant:"glass",size:"sm",onClick:c,isLoading:n,leftIcon:l.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"})]}),l.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 rounded-glass-md bg-white/5 border border-os-border text-xs max-w-md",children:[l.jsx(zr,{className:"w-4 h-4 text-os-muted"}),l.jsx("input",{type:"text",value:a,onChange:h=>o(h.target.value),placeholder:"Filter activity by action or keyword...",className:"w-full bg-transparent text-os-primary focus:outline-none placeholder:text-os-muted"})]}),l.jsx("div",{className:"space-y-3",children:d.length===0?l.jsx(At,{className:"p-12 text-center text-xs text-os-muted",children:"No activity records matching your query."}):d.map(h=>{var u;const p=r===h.id,f=h.evidence_receipt||h.metadata,m=!!f&&Object.keys(f).length>0,x=h.summary||h.description||h.event_type||"Activity logged",_=h.event_type||h.action_type||"Event",g=h.timestamp||h.created_at?new Date(h.timestamp||h.created_at).toLocaleTimeString():"Recorded";return l.jsxs(At,{className:"p-4 transition-all",children:[l.jsxs("div",{onClick:()=>m&&s(p?null:h.id),className:`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${m?"cursor-pointer select-none":""}`,children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("div",{className:"p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400",children:l.jsx(L0,{className:"w-4 h-4"})}),l.jsxs("div",{children:[l.jsx("div",{className:"text-xs font-semibold text-os-primary",children:x}),l.jsxs("div",{className:"text-[10px] font-mono text-os-muted",children:["Type: ",_]})]})]}),l.jsxs("div",{className:"flex items-center gap-3 font-mono text-[11px]",children:[l.jsx("span",{className:"text-os-muted",children:g}),l.jsx(Mt,{variant:"emerald",size:"sm",children:h.status||((u=h.metadata)==null?void 0:u.status)||"VERIFIED"}),m&&l.jsx("button",{className:"text-os-muted hover:text-os-primary",children:p?l.jsx(Hx,{className:"w-4 h-4"}):l.jsx(ya,{className:"w-4 h-4"})})]})]}),p&&f&&l.jsxs("div",{className:"mt-3 pt-3 border-t border-os-border/50 text-xs font-mono",children:[l.jsxs("div",{className:"flex items-center gap-1.5 text-emerald-400 text-[11px] mb-1.5",children:[l.jsx(wS,{className:"w-3.5 h-3.5"}),l.jsx("span",{children:"World Model Evidence Receipt"})]}),l.jsx("pre",{className:"p-2.5 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-os-secondary max-h-40",children:JSON.stringify(f,null,2)})]})]},h.id)})})]})},n2=()=>l.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",className:"flex-shrink-0",children:[l.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"}),l.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"}),l.jsx("path",{fill:"#FBBC05",d:"M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"}),l.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"})]}),i2=()=>l.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 23 23",className:"flex-shrink-0",children:[l.jsx("path",{fill:"#f35325",d:"M1 1h10.5v10.5H1z"}),l.jsx("path",{fill:"#81bc06",d:"M12.5 1H23v10.5H12.5z"}),l.jsx("path",{fill:"#05a6f0",d:"M1 12.5h10.5V23H1z"}),l.jsx("path",{fill:"#ffba08",d:"M12.5 12.5H23V23H12.5z"})]}),r2=()=>{var pe;const{addNotification:t,setCurrentView:e}=un(),[n,i]=W.useState([]),[r,s]=W.useState(!0),[a,o]=W.useState(""),[c,d]=W.useState("all"),[h,p]=W.useState(null),[f,m]=W.useState(null),[x,_]=W.useState("setup"),[g,u]=W.useState({}),[v,y]=W.useState({}),[S,N]=W.useState([]),[A,E]=W.useState({}),[R,T]=W.useState(!1),[M,P]=W.useState(!1),[X,F]=W.useState(!1),[K,$]=W.useState(!1),[q,Q]=W.useState(!1),D=async()=>{s(!0);try{const O=await ke.getConnectors();i(O.connectors||[])}catch(O){t({type:"error",title:"Failed to load connectors",message:O.message||"Unknown network error"})}finally{s(!1)}};W.useEffect(()=>{D()},[]);const Z=async O=>{var Re;try{const Ne=await ke.getConnector(O.id);m(Ne),N((Re=Ne.scopes_granted)!=null&&Re.length?Ne.scopes_granted:Ne.scopes||[]),u({}),E({}),_("setup");try{const Xe=await ke.getConnectorSettings(O.id);y(Xe.settings||{})}catch{y({})}}catch(Ne){t({type:"error",title:"Error loading connector detail",message:Ne.message})}},ee=async O=>{var Re;p(O);try{const Ne=await ke.testConnector(O);if(Ne.ok?t({type:"success",title:"Connector Healthy",message:`${O} passed live API verification.`}):t({type:"warning",title:"Connection Notice",message:((Re=Ne.status)==null?void 0:Re.health_msg)||"Requires credential or permission review."}),await D(),f&&f.id===O){const Xe=await ke.getConnector(O);m(Xe)}}catch(Ne){t({type:"error",title:"Health Check Failed",message:Ne.message})}finally{p(null)}},ue=async()=>{if(f){T(!0);try{await ke.saveConnectorCredentials(f.id,f.name,g),t({type:"success",title:"Credentials Encrypted & Saved",message:"Credentials safely stored in machine vault. Running live health check..."});const O=await ke.getConnector(f.id);m(O),D()}catch(O){t({type:"error",title:"Save Failed",message:O.message})}finally{T(!1)}}},B=async()=>{if(f)try{const O=await ke.startConnectorOAuth(f.id);if(!O.url)throw new Error("OAuth URL not returned from server");const Ne=f.auth_kind==="microsoft_oauth"?"Microsoft":"Google",Xe=window.open(O.url,"oauth_window","width=540,height=680,scrollbars=yes,status=yes"),I=async gt=>{if(gt.data&&(gt.data.oauth_done||gt.data.type==="oauth-done")){window.removeEventListener("message",I),Xe&&!Xe.closed&&Xe.close(),t({type:"success",title:`${Ne} Connected`,message:"Tokens exchanged and safely stored in the vault."});const Ue=await ke.getConnector(f.id);m(Ue),D()}};window.addEventListener("message",I)}catch(O){t({type:"error",title:"OAuth Error",message:O.message||"Make sure OAuth Client ID and Secret are saved first."})}},se=async()=>{if(f){F(!0);try{await ke.grantConnector(f.id,S),t({type:"success",title:"Permissions Granted",message:`Granted ${S.length} scopes to ${f.name}.`});const O=await ke.getConnector(f.id);m(O),D()}catch(O){t({type:"error",title:"Grant Failed",message:O.message})}finally{F(!1)}}},G=async()=>{if(f){$(!0);try{await ke.revokeConnector(f.id),t({type:"info",title:"Connector Revoked",message:`${f.name} disconnected and its credentials deleted from vault.`});const O=await ke.getConnector(f.id);m(O),D()}catch(O){t({type:"error",title:"Revoke Failed",message:O.message})}finally{$(!1)}}},ie=async()=>{if(f){P(!0);try{await ke.saveConnectorSettings(f.id,v),t({type:"success",title:"Defaults Saved",message:`Updated default settings for ${f.name}.`})}catch(O){t({type:"error",title:"Save Failed",message:O.message})}finally{P(!1)}}},de=async()=>{Q(!1),s(!0);try{const O=n.filter(Re=>Re.state!=="available");for(const Re of O)await ke.revokeConnector(Re.id).catch(()=>{});t({type:"success",title:"All Connectors Disconnected",message:"All external credentials wiped and permissions reset."}),D()}catch(O){t({type:"error",title:"Revoke All Failed",message:O.message})}finally{s(!1)}},ne=W.useMemo(()=>n.filter(O=>!a||O.name.toLowerCase().includes(a.toLowerCase())||O.tagline&&O.tagline.toLowerCase().includes(a.toLowerCase())||O.id.toLowerCase().includes(a.toLowerCase())?c==="connected"?O.state==="connected":c==="available"?O.state!=="connected":!0:!1),[n,a,c]),he=n.filter(O=>O.state==="connected").length;return l.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[l.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-os-border/50",children:[l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{className:"text-xs font-mono text-emerald-400 uppercase tracking-widest",children:"Integrations & Services"}),l.jsx("span",{className:"h-1 w-1 rounded-full bg-emerald-400"}),l.jsxs("span",{className:"text-xs text-os-secondary",children:[he," of ",n.length," live"]})]}),l.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight mt-1",children:"Connectors & Integrations"}),l.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Permission-gated adapters with Fernet-encrypted vault storage, OAuth 2.0, and HITL safety rails."})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[he>0&&l.jsx(qe,{variant:"danger",size:"sm",onClick:()=>Q(!0),leftIcon:l.jsx(Jo,{className:"w-3.5 h-3.5"}),children:"Revoke All"}),l.jsx(qe,{variant:"glass",size:"sm",onClick:D,isLoading:r,leftIcon:l.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"})]})]}),l.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between gap-3",children:[l.jsxs("div",{className:"relative w-full sm:w-80",children:[l.jsx(zr,{className:"w-4 h-4 text-os-muted absolute left-3 top-1/2 -translate-y-1/2"}),l.jsx("input",{type:"text",placeholder:"Search integrations (e.g. Gmail, GitHub, Notion)...",value:a,onChange:O=>o(O.target.value),className:"w-full bg-os-surface/80 border border-os-border rounded-glass-sm pl-9 pr-3 py-1.5 text-xs text-os-primary placeholder:text-os-muted focus:outline-none focus:border-emerald-500/50"})]}),l.jsxs("div",{className:"flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0",children:[l.jsxs("button",{onClick:()=>d("all"),className:`px-3 py-1.5 rounded-glass-sm text-xs font-medium transition-colors ${c==="all"?"bg-white/10 text-os-primary border border-white/20":"text-os-muted hover:text-os-secondary hover:bg-white/5"}`,children:["All (",n.length,")"]}),l.jsxs("button",{onClick:()=>d("connected"),className:`px-3 py-1.5 rounded-glass-sm text-xs font-medium transition-colors ${c==="connected"?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30":"text-os-muted hover:text-os-secondary hover:bg-white/5"}`,children:["Connected (",he,")"]}),l.jsxs("button",{onClick:()=>d("available"),className:`px-3 py-1.5 rounded-glass-sm text-xs font-medium transition-colors ${c==="available"?"bg-white/10 text-os-primary border border-white/20":"text-os-muted hover:text-os-secondary hover:bg-white/5"}`,children:["Available (",n.length-he,")"]})]})]}),l.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",children:ne.map(O=>{var gt,Ue;const Re=O.state==="connected",Ne=O.state==="granted",Xe=O.state==="setup_error",I=h===O.id;return l.jsxs(At,{className:`p-4 space-y-3.5 transition-all hover:border-os-border-light flex flex-col justify-between ${Re?"border-emerald-500/30 bg-emerald-500/[0.03] shadow-glass-glow":Xe?"border-rose-500/30 bg-rose-500/[0.02]":""}`,children:[l.jsxs("div",{className:"space-y-2.5",children:[l.jsxs("div",{className:"flex items-start justify-between gap-2",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("div",{className:"w-9 h-9 rounded-glass-sm flex items-center justify-center text-xl flex-shrink-0 border border-white/10 shadow-sm",style:{backgroundColor:O.color?`${O.color}25`:"#4285F425"},children:O.icon||"🔌"}),l.jsxs("div",{children:[l.jsx("h3",{className:"text-sm font-bold text-os-primary tracking-tight",children:O.name}),l.jsx("p",{className:"text-[11px] text-os-secondary line-clamp-1",children:O.tagline||"External API connector"})]})]}),l.jsx(Mt,{variant:Re?"emerald":Ne?"cyan":Xe?"danger":"neutral",size:"sm",children:O.state.toUpperCase()})]}),O.health_msg?l.jsx("div",{className:`p-2 rounded-glass-sm text-[11px] leading-snug line-clamp-2 ${Re?"bg-emerald-500/10 text-emerald-300 border border-emerald-500/20":"bg-rose-500/10 text-rose-300 border border-rose-500/20"}`,children:O.health_msg}):l.jsx("p",{className:"text-[11px] text-os-muted leading-relaxed line-clamp-2",children:O.note||"Permission-gated live external adapter."})]}),l.jsxs("div",{className:"pt-3 border-t border-os-border/40 flex items-center justify-between gap-2",children:[l.jsxs("span",{className:"text-[10px] font-mono text-os-muted",children:[((gt=O.scopes_granted)==null?void 0:gt.length)||0," / ",((Ue=O.scopes)==null?void 0:Ue.length)||0," scopes"]}),l.jsxs("div",{className:"flex items-center gap-1.5",children:[l.jsx(qe,{variant:"glass",size:"sm",onClick:()=>ee(O.id),isLoading:I,title:"Run live health check",leftIcon:l.jsx(vp,{className:"w-3 h-3 text-emerald-400"}),children:"Test"}),l.jsx(qe,{variant:Re?"glass":"primary",size:"sm",onClick:()=>Z(O),leftIcon:l.jsx(LS,{className:"w-3 h-3"}),children:"Configure"})]})]})]},O.id)})}),ne.length===0&&l.jsxs(At,{className:"p-12 text-center space-y-3",children:[l.jsx(SS,{className:"w-8 h-8 text-os-muted mx-auto"}),l.jsx("h3",{className:"text-sm font-semibold text-os-primary",children:"No connectors match your search"}),l.jsx("p",{className:"text-xs text-os-secondary max-w-sm mx-auto",children:'Try searching for a different keyword or switch to the "All" filter to view all available adapters.'})]}),f&&l.jsx(Ll,{isOpen:!0,onClose:()=>m(null),title:"",maxWidth:"lg",children:l.jsxs("div",{className:"space-y-5 -mt-2",children:[l.jsxs("div",{className:"flex items-start justify-between gap-4 pb-3 border-b border-os-border/50",children:[l.jsxs("div",{className:"flex items-center gap-3.5",children:[l.jsx("div",{className:"w-12 h-12 rounded-glass-md flex items-center justify-center text-2xl flex-shrink-0 border border-white/10",style:{backgroundColor:f.color?`${f.color}30`:"#4285F430"},children:f.icon||"🔌"}),l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("h2",{className:"text-lg font-bold text-os-primary tracking-tight",children:f.name}),l.jsx(Mt,{variant:f.state==="connected"?"emerald":f.state==="granted"?"cyan":f.state==="setup_error"?"danger":"neutral",size:"sm",children:f.state.toUpperCase()})]}),l.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:f.tagline})]})]}),f.docs_url&&l.jsxs("a",{href:f.docs_url,target:"_blank",rel:"noreferrer",className:"flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium py-1 px-2 rounded-glass-sm bg-emerald-500/10 border border-emerald-500/20 transition-colors",children:[l.jsx("span",{children:"Official Docs"}),l.jsx(n0,{className:"w-3 h-3"})]})]}),l.jsxs("div",{className:"space-y-2",children:[f.state==="connected"?l.jsxs("div",{className:"p-3 rounded-glass-sm bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300",children:[l.jsx(nn,{className:"w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5"}),l.jsxs("div",{children:[l.jsx("span",{className:"font-semibold",children:"Live API Verified: "}),"Connected to ",f.name,". Safe read operations execute immediately; sensitive writes pause for your approval."]})]}):f.state==="setup_error"?l.jsxs("div",{className:"p-3 rounded-glass-sm bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300",children:[l.jsx(yS,{className:"w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5"}),l.jsxs("div",{children:[l.jsx("span",{className:"font-semibold",children:"Setup / Health Check Failed: "}),f.health_msg||"Credentials could not be verified by the service."]})]}):l.jsxs("div",{className:"p-3 rounded-glass-sm bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-os-secondary",children:[l.jsx(Nl,{className:"w-4 h-4 text-os-muted flex-shrink-0 mt-0.5"}),l.jsxs("div",{children:[l.jsx("span",{className:"font-semibold text-os-primary",children:"Vault Encrypted: "}),"OS will never touch external endpoints until you configure credentials and grant permission."]})]}),f.note&&l.jsxs("p",{className:"text-[11px] text-os-muted italic px-1 leading-relaxed",children:["Note: ",f.note]})]}),l.jsxs("div",{className:"flex border-b border-os-border/50 text-xs gap-1",children:[l.jsx("button",{onClick:()=>_("setup"),className:`px-3 py-2 border-b-2 font-medium transition-colors ${x==="setup"?"border-emerald-400 text-emerald-400":"border-transparent text-os-muted hover:text-os-secondary"}`,children:"1. Credentials & Setup"}),l.jsxs("button",{onClick:()=>_("scopes"),className:`px-3 py-2 border-b-2 font-medium transition-colors ${x==="scopes"?"border-emerald-400 text-emerald-400":"border-transparent text-os-muted hover:text-os-secondary"}`,children:["2. Permissions (",((pe=f.scopes)==null?void 0:pe.length)||0,")"]}),f.defaults&&f.defaults.length>0&&l.jsx("button",{onClick:()=>_("settings"),className:`px-3 py-2 border-b-2 font-medium transition-colors ${x==="settings"?"border-emerald-400 text-emerald-400":"border-transparent text-os-muted hover:text-os-secondary"}`,children:"3. Defaults"}),f.actions&&f.actions.length>0&&l.jsx("button",{onClick:()=>_("actions"),className:`px-3 py-2 border-b-2 font-medium transition-colors ${x==="actions"?"border-emerald-400 text-emerald-400":"border-transparent text-os-muted hover:text-os-secondary"}`,children:"4. Actions & Prompts"})]}),x==="setup"&&l.jsxs("div",{className:"space-y-4",children:[f.setup_steps&&f.setup_steps.length>0&&l.jsxs("div",{className:"p-3.5 rounded-glass-sm bg-black/30 border border-white/5 space-y-2 text-xs",children:[l.jsxs("h4",{className:"font-semibold text-os-primary flex items-center gap-1.5",children:[l.jsx(AS,{className:"w-3.5 h-3.5 text-emerald-400"}),l.jsx("span",{children:"Setup Instructions"})]}),l.jsx("ol",{className:"list-decimal list-inside space-y-1 text-os-secondary leading-relaxed",children:f.setup_steps.map((O,Re)=>l.jsx("li",{className:"pl-1",children:O},Re))})]}),l.jsxs("div",{className:"space-y-3",children:[f.cred_fields&&f.cred_fields.length>0&&l.jsxs("div",{className:"space-y-3",children:[f.cred_fields.map(O=>l.jsxs("div",{className:"space-y-1",children:[l.jsxs("label",{className:"text-xs font-semibold text-os-primary flex items-center justify-between",children:[l.jsx("span",{children:O.label||O.key}),O.help&&l.jsx("span",{className:"text-[10px] text-os-muted font-normal",children:O.help})]}),l.jsxs("div",{className:"relative",children:[l.jsx("input",{type:O.secret&&!A[O.key]?"password":"text",placeholder:O.placeholder||`Enter ${O.label||O.key}`,value:g[O.key]||"",onChange:Re=>u({...g,[O.key]:Re.target.value}),className:"w-full bg-os-surface/80 border border-os-border rounded-glass-sm px-3 py-1.5 text-xs text-os-primary placeholder:text-os-muted focus:outline-none focus:border-emerald-500/50"}),O.secret&&l.jsx("button",{type:"button",onClick:()=>E({...A,[O.key]:!A[O.key]}),className:"absolute right-2.5 top-1/2 -translate-y-1/2 text-os-muted hover:text-os-primary",children:A[O.key]?l.jsx(ES,{className:"w-3.5 h-3.5"}):l.jsx(bS,{className:"w-3.5 h-3.5"})})]})]},O.key)),l.jsxs("div",{className:"flex items-center justify-between pt-2",children:[l.jsx(qe,{variant:"glass",size:"sm",onClick:ue,isLoading:R,leftIcon:l.jsx(Nl,{className:"w-3.5 h-3.5 text-emerald-400"}),children:"Save Credentials in Vault"}),l.jsx(qe,{variant:"glass",size:"sm",onClick:()=>ee(f.id),isLoading:h===f.id,leftIcon:l.jsx(vp,{className:"w-3 h-3 text-emerald-400"}),children:"Test Live Connection"})]})]}),(f.auth_kind==="google_oauth"||f.auth_kind==="microsoft_oauth")&&l.jsxs("div",{className:"pt-3 border-t border-os-border/40 space-y-2",children:[l.jsx("div",{className:"text-xs font-semibold text-os-primary",children:"OAuth 2.0 Authorization"}),l.jsx("p",{className:"text-[11px] text-os-secondary",children:"Once Client ID & Secret are saved above, click below to authorize access with your account."}),l.jsxs("div",{className:"flex items-center gap-3 pt-1",children:[l.jsxs("button",{onClick:B,className:"flex items-center gap-2.5 px-4 py-2 rounded-glass-sm bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-os-primary transition-all shadow-sm",children:[f.auth_kind==="microsoft_oauth"?l.jsx(i2,{}):l.jsx(n2,{}),l.jsx("span",{children:f.auth_kind==="microsoft_oauth"?"Sign in with Microsoft":"Sign in with Google"})]}),f.state==="connected"&&l.jsxs("span",{className:"text-xs text-emerald-400 flex items-center gap-1",children:[l.jsx(nn,{className:"w-4 h-4"}),l.jsx("span",{children:"Signed In & Token Refresh Active"})]})]})]})]})]}),x==="scopes"&&l.jsxs("div",{className:"space-y-4 text-xs",children:[l.jsx("p",{className:"text-os-secondary",children:"Configure which permissions OS is authorized to use. You can revoke access at any time."}),l.jsx("div",{className:"space-y-2 rounded-glass-sm bg-black/25 border border-white/5 p-3",children:(f.scopes||[]).map(O=>{const Re=S.includes(O);return l.jsxs("label",{className:"flex items-center gap-2.5 p-1.5 rounded hover:bg-white/5 cursor-pointer text-os-primary",children:[l.jsx("input",{type:"checkbox",checked:Re,onChange:Ne=>{Ne.target.checked?N([...S,O]):N(S.filter(Xe=>Xe!==O))},className:"rounded border-os-border bg-black/40 text-emerald-500 focus:ring-0"}),l.jsx("span",{className:"leading-snug",children:O})]},O)})}),l.jsxs("div",{className:"flex items-center justify-between pt-2",children:[l.jsx(qe,{variant:"danger",size:"sm",onClick:G,isLoading:K,leftIcon:l.jsx(Jo,{className:"w-3.5 h-3.5"}),children:"Disconnect & Revoke"}),l.jsxs(qe,{variant:"primary",size:"sm",onClick:se,isLoading:X,leftIcon:l.jsx(DS,{className:"w-3.5 h-3.5"}),children:["Grant Permissions (",S.length,")"]})]})]}),x==="settings"&&l.jsxs("div",{className:"space-y-4 text-xs",children:[l.jsx("p",{className:"text-os-secondary",children:"Configure default targets (e.g. default repository, channel ID, calendar) used when no parameter is explicitly passed."}),l.jsx("div",{className:"space-y-3",children:(f.defaults||[]).map(O=>l.jsxs("div",{className:"space-y-1",children:[l.jsxs("label",{className:"font-semibold text-os-primary flex items-center justify-between",children:[l.jsx("span",{children:O.label||O.key}),O.help&&l.jsx("span",{className:"text-[10px] text-os-muted",children:O.help})]}),l.jsx("input",{type:"text",placeholder:O.placeholder||`Default ${O.label}`,value:v[O.key]||"",onChange:Re=>y({...v,[O.key]:Re.target.value}),className:"w-full bg-os-surface/80 border border-os-border rounded-glass-sm px-3 py-1.5 text-xs text-os-primary focus:outline-none focus:border-emerald-500/50"})]},O.key))}),l.jsx("div",{className:"flex justify-end pt-2",children:l.jsx(qe,{variant:"glass",size:"sm",onClick:ie,isLoading:M,leftIcon:l.jsx(_S,{className:"w-3.5 h-3.5 text-emerald-400"}),children:"Save Defaults"})})]}),x==="actions"&&l.jsxs("div",{className:"space-y-4 text-xs",children:[f.actions&&f.actions.length>0&&l.jsxs("div",{className:"space-y-2",children:[l.jsxs("h4",{className:"font-semibold text-os-primary flex items-center gap-1.5",children:[l.jsx(d0,{className:"w-3.5 h-3.5 text-emerald-400"}),l.jsx("span",{children:"Supported Tool Actions"})]}),l.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2",children:f.actions.map(O=>l.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-black/25 border border-white/5 space-y-1",children:[l.jsxs("div",{className:"flex items-center justify-between",children:[l.jsx("span",{className:"font-mono font-semibold text-emerald-400",children:O.name}),l.jsx(Mt,{variant:O.needs_approval?"amber":"neutral",size:"sm",children:O.needs_approval?"ASKS APPROVAL":"DIRECT READ"})]}),l.jsx("p",{className:"text-[11px] text-os-secondary",children:O.description})]},O.name))})]}),f.try_it&&f.try_it.length>0&&l.jsxs("div",{className:"pt-2 border-t border-os-border/40 space-y-2",children:[l.jsxs("h4",{className:"font-semibold text-os-primary flex items-center gap-1.5",children:[l.jsx(Qn,{className:"w-3.5 h-3.5 text-emerald-400"}),l.jsx("span",{children:"Try It in Ask OS"})]}),l.jsx("div",{className:"space-y-1.5",children:f.try_it.map((O,Re)=>l.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-colors",children:[l.jsxs("span",{className:"text-xs text-os-primary font-mono italic",children:['"',O,'"']}),l.jsxs("div",{className:"flex items-center gap-1.5",children:[l.jsx("button",{onClick:()=>{navigator.clipboard.writeText(O),t({type:"info",title:"Prompt Copied",message:O})},className:"p-1 rounded text-os-muted hover:text-os-primary hover:bg-white/5",title:"Copy prompt",children:l.jsx(MS,{className:"w-3.5 h-3.5"})}),l.jsxs("button",{onClick:()=>{m(null),e("chat"),localStorage.setItem("os_pending_chat_prompt",O)},className:"flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors",children:[l.jsx("span",{children:"Send"}),l.jsx(Vf,{className:"w-3 h-3"})]})]})]},Re))})]})]})]})}),q&&l.jsx(Ll,{isOpen:!0,onClose:()=>Q(!1),title:"Disconnect All Connectors?",maxWidth:"sm",children:l.jsxs("div",{className:"space-y-4 text-xs",children:[l.jsx("p",{className:"text-os-secondary leading-relaxed",children:"This will disconnect all integrations, revoke granted scopes, and permanently wipe all credentials from your machine's encrypted vault."}),l.jsxs("div",{className:"flex items-center justify-end gap-2 pt-2",children:[l.jsx(qe,{variant:"ghost",size:"sm",onClick:()=>Q(!1),children:"Cancel"}),l.jsx(qe,{variant:"danger",size:"sm",onClick:de,leftIcon:l.jsx(Jo,{className:"w-3.5 h-3.5"}),children:"Revoke All"})]})]})})]})},s2=()=>{const{addNotification:t}=un(),[e,n]=W.useState([]),[i,r]=W.useState(!0),[s,a]=W.useState(""),o=async()=>{r(!0);try{const h=await ke.getMemory();n(h.memories||[])}catch(h){console.error("Failed to load memory:",h)}finally{r(!1)}};W.useEffect(()=>{o()},[]);const c=async h=>{try{await ke.forgetMemory(h),t({type:"info",title:"Memory Cleared",message:`OS has forgotten: "${h}"`}),o()}catch(p){t({type:"error",title:"Delete Failed",message:p.message})}},d=e.filter(h=>{const p=(h.key||"").toLowerCase(),f=(typeof h.value=="string"?h.value:JSON.stringify(h.value||"")).toLowerCase(),m=(h.type||"").toLowerCase(),x=s.toLowerCase();return p.includes(x)||f.includes(x)||m.includes(x)});return l.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[l.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[l.jsxs("div",{children:[l.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"OS Memory & Knowledge"}),l.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"What OS knows about your preferences, projects, context, and working style"})]}),l.jsx(qe,{variant:"glass",size:"sm",onClick:o,isLoading:i,leftIcon:l.jsx(Xn,{className:"w-3.5 h-3.5"}),children:"Refresh"})]}),l.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 rounded-glass-md bg-white/5 border border-os-border text-xs max-w-md",children:[l.jsx(zr,{className:"w-4 h-4 text-os-muted"}),l.jsx("input",{type:"text",value:s,onChange:h=>a(h.target.value),placeholder:"Search what OS remembers...",className:"w-full bg-transparent text-os-primary focus:outline-none placeholder:text-os-muted"})]}),l.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:d.length===0?l.jsx("div",{className:"col-span-full py-12 text-center text-xs text-os-muted",children:"No memories match your query. OS learns preferences naturally as you converse and assign tasks."}):d.map(h=>l.jsxs(At,{className:"p-4 space-y-2.5",children:[l.jsxs("div",{className:"flex items-start justify-between gap-2",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx(Mt,{variant:"purple",size:"sm",children:h.type.toUpperCase()}),l.jsx("h4",{className:"text-xs font-bold text-os-primary font-mono",children:h.key})]}),l.jsx("button",{onClick:()=>c(h.key),className:"text-os-muted hover:text-rose-400 p-1 rounded hover:bg-white/5 transition-colors",title:"Forget this memory",children:l.jsx(Jo,{className:"w-3.5 h-3.5"})})]}),l.jsx("p",{className:"text-xs text-os-secondary leading-relaxed bg-black/20 p-2.5 rounded-glass-sm border border-white/5",children:h.value}),l.jsxs("div",{className:"text-[10px] font-mono text-os-muted flex items-center gap-1 pt-1",children:[l.jsx(Fr,{className:"w-3 h-3"}),l.jsxs("span",{children:["Updated: ",h.updated_at||"Recently"]})]})]},h.key))})]})},a2=()=>{var ue;const[t,e]=W.useState({forge:{dot_id:"forge",name:"Forge",role:"Coding & Autonomous Terminal Engineer",permissions:["files","shell","memory"]},scout:{dot_id:"scout",name:"Scout",role:"Deep Research & Web Specialist",permissions:["browser","memory"]},scribe:{dot_id:"scribe",name:"Scribe",role:"Space & Documentation Architect",permissions:["files","memory"]},sentinel:{dot_id:"sentinel",name:"Sentinel",role:"System Diagnostics & Security Monitor",permissions:["memory"]}}),[n,i]=W.useState("forge"),[r,s]=W.useState("STANDBY"),[a,o]=W.useState(null),[c,d]=W.useState("ollama/qwen3.5:35b"),[h,p]=W.useState({traces:2,energy:"0.064 J",latency:"4.2 ms"}),[f,m]=W.useState(!1),[x,_]=W.useState([`$ os init --hardware-aware
[OK] Detected hardware architecture + local engine active.`,`$ os doctor
[OK] All 5 Composable Primitives verified. Safety gates active.`]),[g,u]=W.useState("OS Architecture & Lab Roadmap"),[v,y]=W.useState(`# OS Synthesis
- OpenJarvis: Local-first 5 primitives + energy telemetry
- OpenMuse: Agent Computer container + Take Control
- OpenDots: Scoped Dots + Revision-checked Spaces`),[S,N]=W.useState(1),[A,E]=W.useState([{id:"init-1",sender:"os",text:`OS v1.0 Control Plane Online.
• OpenJarvis: 5 Composable Primitives active.
• OpenMuse: Agent Computer & Sandbox Worker connected.
• OpenDots: 4 Specialist Coworkers (@forge, @scout, @scribe, @sentinel) & Revision-Safe Spaces verified.`}]),[R,T]=W.useState(""),[M,P]=W.useState("OS online and standing by, Sai."),X=W.useRef(null),F=W.useRef(null),K=W.useCallback(async()=>{try{const B=await ke.getHudState();if(B.dots&&e(B.dots),B.runtime_state&&s(B.runtime_state),B.hardware&&(o(B.hardware),d(`${B.hardware.preferred_engine||"ollama"}/${B.hardware.recommended_local_model||"qwen3.5:35b"}`)),B.telemetry&&p({traces:B.telemetry.total_traces||2,energy:`${B.telemetry.total_energy_joules||.064} J`,latency:`${B.telemetry.avg_latency_ms||4.2} ms`}),B.computer&&m(B.computer.user_took_control||!1),B.spaces&&B.spaces.pages&&B.spaces.pages.length>0){const se=B.spaces.pages[0];u(se.title),y(se.markdown),N(se.revision)}}catch(B){console.warn("Failed to load initial HUD state:",B)}},[]);W.useEffect(()=>{K()},[K]),W.useEffect(()=>{F.current&&(F.current.scrollTop=F.current.scrollHeight)},[A]),W.useEffect(()=>{const B=X.current;if(!B)return;const se=B.getContext("2d");if(!se)return;let G,ie=0;const de=()=>{B.width=B.clientWidth,B.height=B.clientHeight};de(),window.addEventListener("resize",de);const ne=()=>{se.clearRect(0,0,B.width,B.height);const he=B.width/2,pe=B.height/2;ie+=.018,se.save(),se.translate(he,pe),se.rotate(ie*.6),se.strokeStyle="rgba(0, 240, 255, 0.35)",se.lineWidth=2,se.setLineDash([12,8,4,8]),se.beginPath(),se.arc(0,0,78,0,Math.PI*2),se.stroke(),se.restore(),se.save(),se.translate(he,pe),se.rotate(-ie*1.1),se.strokeStyle="rgba(0, 255, 157, 0.55)",se.lineWidth=3,se.setLineDash([22,14]),se.beginPath(),se.arc(0,0,58,0,Math.PI*2),se.stroke(),se.restore();const O=36,Re=[[0,-O,0],[0,O,0],[-O,0,0],[O,0,0],[0,0,-O],[0,0,O]],Ne=[[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]],Xe=Re.map(([Ue,He,De])=>{const st=Math.cos(ie),Pe=Math.sin(ie),C=Math.cos(ie*.7),w=Math.sin(ie*.7),z=Ue*st-De*Pe,te=De*st+Ue*Pe,ae=He*C-te*w,Ee=220/(220+(te*C+He*w));return[he+z*Ee,pe+ae*Ee]});se.strokeStyle="#00f0ff",se.lineWidth=1.6,Ne.forEach(([Ue,He])=>{se.beginPath(),se.moveTo(Xe[Ue][0],Xe[Ue][1]),se.lineTo(Xe[He][0],Xe[He][1]),se.stroke()});const I=10+Math.sin(ie*3)*3,gt=se.createRadialGradient(he,pe,1,he,pe,I*2.5);gt.addColorStop(0,"rgba(0, 240, 255, 0.95)"),gt.addColorStop(1,"rgba(0, 240, 255, 0)"),se.fillStyle=gt,se.beginPath(),se.arc(he,pe,I*2.5,0,Math.PI*2),se.fill(),G=requestAnimationFrame(ne)};return ne(),()=>{window.removeEventListener("resize",de),cancelAnimationFrame(G)}},[]);const $=async B=>{const se=B||R.trim();if(!se)return;B||T(""),E(ne=>[...ne,{id:Math.random().toString(),sender:"user",text:se}]),s("PROCESSING");const G=se.toLowerCase();let ie,de;G.includes("rm -rf")||G.includes("format c:")||G.includes("deploy")||G.includes("docker")||G.includes("shell")||G.includes("git push")?(ie="shell_exec",de=se):(G.startsWith("save ")||G.includes("write file"))&&(ie="file_write",de=se);try{const ne=await ke.sendHudCommand(se,n,ie,de);if(s(ne.state||"STANDBY"),ne.status==="blocked"){E(pe=>[...pe,{id:Math.random().toString(),sender:"os",text:`🛑 SECURITY BLOCK: ${ne.reason}`}]),_(pe=>[...pe,`[SECURITY GATE BLOCKED] ${se}`]);return}if(ne.status==="permission_denied"){E(pe=>[...pe,{id:Math.random().toString(),sender:"os",text:`⚠️ Permission Denied: ${ne.error}`}]),_(pe=>[...pe,`[PERMISSION DENIED] ${se}`]);return}if(ne.status==="waiting_approval"&&ne.approval_card){E(pe=>[...pe,{id:Math.random().toString(),sender:"os",text:`[${ne.dot}] Task Paused — Human Approval Required`,isApproval:!0,approvalData:{approval_id:ne.approval_card.approval_id,action_type:ne.approval_card.action_type,payload:ne.approval_card.payload,arguments_hash:ne.approval_card.arguments_hash}}]);return}const he=ne.response||"Executed successfully.";P(he.replace(/<[^>]*>?/gm,"")),E(pe=>[...pe,{id:Math.random().toString(),sender:"os",text:he}]),ne.telemetry&&p({traces:h.traces+1,energy:`${ne.telemetry.energy_joules} J`,latency:`${ne.telemetry.latency_ms} ms`}),_(pe=>{var O;return[...pe,`$ os ask --dot ${n} "${se}"
[OK] Latency: ${((O=ne.telemetry)==null?void 0:O.latency_ms)||4.2}ms`]})}catch(ne){s("ERROR"),E(he=>[...he,{id:Math.random().toString(),sender:"os",text:`Error: ${ne.message}`}])}},q=async(B,se,G)=>{var ie,de,ne;try{const he=await ke.resolveHudApproval(B,se);if(E(pe=>pe.map(O=>{var Re;return((Re=O.approvalData)==null?void 0:Re.approval_id)===B?{...O,isApproval:!1,text:`${O.text}
✓ Resolved by Operator: ${se}`}:O})),se==="deny")_(pe=>[...pe,`[DENIED BY OPERATOR] ${G}`]),s("STANDBY");else{const pe=((de=(ie=he==null?void 0:he.execution_result)==null?void 0:ie.stdout)==null?void 0:de.trim())||((ne=he==null?void 0:he.execution_result)==null?void 0:ne.status)||`Executed under policy '${se}'`;_(O=>[...O,`$ ${G}
[AGENT COMPUTER] ${pe}`]),s("STANDBY")}}catch(he){console.error("Failed to resolve approval:",he)}},Q=async()=>{const B=!f;m(B);try{await ke.toggleHudTakeover(B),_(se=>[...se,B?"[OPENMUSE] Human operator took interactive control of browser & terminal.":"[OPENMUSE] Returned terminal & browser session to autonomous agent worker."])}catch(se){console.error(se)}},D=async()=>{try{const B=await ke.saveHudSpacePage("engineering-hq","engineering-notes",g,v,"Sai",S);N(B.revision),_(se=>[...se,`[OPENDOTS SPACE] Saved '${g}' at Revision v${B.revision} (optimistic lock verified).`]),E(se=>[...se,{id:Math.random().toString(),sender:"os",text:`[Scribe] Saved page '${g}' to Space engineering-hq (Revision v${B.revision} verified).`}])}catch{E(se=>[...se,{id:Math.random().toString(),sender:"os",text:"⚠️ Revision Conflict: Another actor modified this page. Your draft was preserved."}])}},Z=async()=>{try{const B=await ke.optimizeHudTraces();p({traces:B.total_traces,energy:`${B.total_energy_joules} J`,latency:`${B.avg_latency_ms} ms`}),E(se=>[...se,{id:Math.random().toString(),sender:"os",text:`[OS Learning Loop] Synthesized ${B.total_traces} local interaction traces.
Learned: ${B.learned_skills[B.learned_skills.length-1]||"Routing weights tuned."}`}])}catch(B){console.error(B)}},ee=()=>{if("speechSynthesis"in window){const B=new SpeechSynthesisUtterance(M);B.rate=1.02,B.pitch=.95,window.speechSynthesis.speak(B)}ke.speakHudVoice(M).catch(()=>{})};return l.jsxs("div",{className:"flex-1 p-4 flex flex-col gap-3 font-mono text-cyan-50 min-h-screen bg-[#050811]",children:[l.jsxs("div",{className:"flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#0a1324]/90 border border-cyan-500/20 backdrop-blur-md shadow-lg shadow-cyan-950/20",children:[l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsxs("span",{className:"text-cyan-400 font-bold tracking-widest text-sm flex items-center gap-2",children:[l.jsx("span",{className:"text-cyan-300",children:"◈"})," OS // CYBER-HUD v1.0"]}),l.jsx("span",{className:"text-[11px] text-cyan-200/50 hidden md:inline",children:"OpenJarvis + OpenMuse + OpenDots Architecture"})]}),l.jsxs("div",{className:"flex items-center gap-3",children:[l.jsx("span",{className:`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${r==="WAITING_APPROVAL"?"border-amber-400 text-amber-300 bg-amber-500/10":r==="ERROR"?"border-rose-500 text-rose-400 bg-rose-500/10":"border-emerald-400 text-emerald-300 bg-emerald-500/10"}`,children:r}),l.jsxs("button",{onClick:ee,className:"flex items-center gap-1.5 px-3 py-1 text-xs rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors",children:[l.jsx(OS,{className:"w-3.5 h-3.5"}),l.jsx("span",{children:"Voice Readout"})]})]})]}),l.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-3 flex-1",children:[l.jsxs("div",{className:"flex flex-col gap-3",children:[l.jsxs("div",{className:"p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md",children:[l.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2",children:[l.jsx("span",{children:"Specialist Coworkers"}),l.jsx("span",{className:"text-[10px] text-cyan-200/50 font-normal",children:"Scoped RBAC"})]}),l.jsx("div",{className:"flex flex-col gap-2",children:Object.entries(t).map(([B,se])=>l.jsxs("div",{onClick:()=>i(B),className:`p-2.5 rounded border transition-all cursor-pointer ${n===B?"border-cyan-400 bg-cyan-500/15 shadow-sm shadow-cyan-500/30":"border-cyan-500/15 bg-black/40 hover:border-cyan-500/40 hover:bg-cyan-500/5"}`,children:[l.jsxs("div",{className:"flex items-center justify-between text-xs font-bold",children:[l.jsxs("span",{className:"flex items-center gap-1.5",children:[l.jsx("span",{className:"text-cyan-400",children:"●"})," ",se.name]}),l.jsxs("span",{className:"text-[10px] text-cyan-400/80",children:["@",B]})]}),l.jsx("div",{className:"text-[11px] text-cyan-200/60 mt-0.5 line-clamp-1",children:se.role}),l.jsx("div",{className:"flex gap-1 flex-wrap mt-1.5",children:(se.permissions||[]).map(G=>l.jsx("span",{className:"text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300",children:G},G))})]},B))})]}),l.jsxs("div",{className:"p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md",children:[l.jsx("div",{className:"flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2",children:l.jsx("span",{children:"5 Primitives Telemetry"})}),l.jsxs("div",{className:"text-[11px] space-y-1.5 text-cyan-200/70",children:[l.jsxs("div",{className:"flex justify-between",children:[l.jsx("span",{children:"• Intelligence:"}),l.jsx("span",{className:"text-cyan-300 font-semibold",children:a?`${a.cpu_cores} Cores / ${a.ram_gb} GB`:"Auto-Detected"})]}),l.jsxs("div",{className:"flex justify-between",children:[l.jsx("span",{children:"• Engine:"}),l.jsx("span",{className:"text-cyan-400 font-mono text-[10px] truncate max-w-[170px]",children:c})]}),l.jsxs("div",{className:"flex justify-between",children:[l.jsx("span",{children:"• Energy / Latency:"}),l.jsxs("span",{className:"text-emerald-400 font-mono",children:[h.energy," / ",h.latency]})]}),l.jsxs("div",{className:"flex justify-between",children:[l.jsx("span",{children:"• Safety Gate:"}),l.jsx("span",{className:"text-emerald-400",children:"Patterns Guarded"})]}),l.jsxs("div",{className:"flex justify-between",children:[l.jsx("span",{children:"• Learning Loop:"}),l.jsxs("span",{className:"text-cyan-300",children:[h.traces," traces tuned"]})]})]}),l.jsxs("div",{className:"grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-cyan-500/20",children:[l.jsx("button",{onClick:()=>$("Generate my morning briefing"),className:"px-2.5 py-1.5 text-[11px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors",children:"☀ Morning Digest"}),l.jsx("button",{onClick:Z,className:"px-2.5 py-1.5 text-[11px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors",children:"⚡ OS Optimize"})]})]})]}),l.jsxs("div",{className:"flex flex-col gap-3",children:[l.jsxs("div",{className:"relative h-[220px] rounded-lg bg-[#0a1324]/90 border border-cyan-500/20 overflow-hidden shadow-md flex items-center justify-center",children:[l.jsx("canvas",{ref:X,className:"w-full h-full"}),l.jsxs("div",{className:"absolute bottom-2.5 left-4 right-4 flex justify-between text-[11px] text-cyan-200/50 pointer-events-none font-mono",children:[l.jsxs("span",{children:["ACTIVE DOT: ",((ue=t[n])==null?void 0:ue.name.toUpperCase())||"FORGE"]}),l.jsx("span",{children:"LOCAL-FIRST // VERIFIED SECURE"})]})]}),l.jsxs("div",{className:"flex-1 p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col justify-between shadow-md min-h-[340px]",children:[l.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2 mb-2",children:[l.jsx("span",{children:"AG-UI Live Stream & Human-in-the-Loop Approvals"}),l.jsx("button",{onClick:()=>$("deploy docker container openmuse-computer:local --port 8790"),className:"text-[10px] px-2 py-0.5 rounded border border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20",children:"Test HITL Gate"})]}),l.jsx("div",{ref:F,className:"flex-1 overflow-y-auto space-y-2 pr-1 max-h-[350px]",children:A.map(B=>l.jsxs("div",{className:`p-2.5 rounded text-xs leading-relaxed ${B.sender==="user"?"ml-auto max-w-[85%] bg-cyan-500/15 border border-cyan-500/30 text-cyan-100":"mr-auto max-w-[92%] bg-black/60 border-l-2 border-cyan-400 text-cyan-50"}`,children:[l.jsx("div",{className:"whitespace-pre-wrap",children:B.text}),B.isApproval&&B.approvalData&&l.jsxs("div",{className:"mt-2.5 p-2.5 rounded bg-amber-950/30 border border-amber-500/40 text-[11px] space-y-1.5",children:[l.jsxs("div",{children:["Action: ",l.jsx("code",{children:B.approvalData.action_type})]}),l.jsxs("div",{children:["Payload: ",l.jsx("code",{children:B.approvalData.payload})]}),B.approvalData.arguments_hash&&l.jsxs("div",{className:"text-[10px] text-amber-300/60 truncate",children:["Hash: ",B.approvalData.arguments_hash]}),l.jsxs("div",{className:"flex gap-2 pt-1 flex-wrap",children:[l.jsx("button",{onClick:()=>q(B.approvalData.approval_id,"allow_once",B.approvalData.payload),className:"px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30",children:"✓ Allow Once"}),l.jsx("button",{onClick:()=>q(B.approvalData.approval_id,"always_allow",B.approvalData.payload),className:"px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30",children:"⚡ Always Allow"}),l.jsx("button",{onClick:()=>q(B.approvalData.approval_id,"deny",B.approvalData.payload),className:"px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30",children:"✕ Deny"})]})]})]},B.id))}),l.jsxs("div",{className:"flex gap-2 mt-3 pt-2 border-t border-cyan-500/20",children:[l.jsx("input",{type:"text",value:R,onChange:B=>T(B.target.value),onKeyDown:B=>B.key==="Enter"&&$(),placeholder:"Command OS or active Dot (e.g. 'calculate 137 * 42', 'deploy container')...",className:"flex-1 px-3 py-2 text-xs rounded bg-black/60 border border-cyan-500/30 text-cyan-100 placeholder-cyan-500/40 focus:outline-none focus:border-cyan-400"}),l.jsx("button",{onClick:()=>$(),className:"px-4 py-2 text-xs rounded bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors",children:"EXECUTE"})]})]})]}),l.jsxs("div",{className:"flex flex-col gap-3",children:[l.jsxs("div",{className:"p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md",children:[l.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2",children:[l.jsx("span",{children:"OpenMuse // Agent Computer"}),l.jsx("button",{onClick:Q,className:`text-[10px] px-2 py-0.5 rounded border transition-colors ${f?"border-amber-400 text-amber-300 bg-amber-500/20":"border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20"}`,children:f?"🤖 Return to Agent":"🕹 Take Control"})]}),l.jsxs("div",{className:"text-[11px] text-cyan-200/60",children:["Mode:"," ",l.jsx("b",{className:f?"text-amber-400":"text-emerald-400",children:f?"HUMAN_OVERRIDE (TAKE CONTROL)":"AGENT_AUTONOMOUS"})]}),l.jsx("div",{className:"h-[140px] p-2 rounded bg-black border border-cyan-500/20 font-mono text-[10px] text-emerald-400 overflow-y-auto whitespace-pre-wrap",children:x.join(`
`)})]}),l.jsxs("div",{className:"p-3.5 rounded-lg bg-[#0a1324]/85 border border-cyan-500/20 flex flex-col gap-2.5 shadow-md flex-1",children:[l.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/20 pb-2",children:[l.jsx("span",{children:"OpenDots Space // Page Editor"}),l.jsxs("span",{className:"text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300",children:["Rev v",S]})]}),l.jsx("input",{type:"text",value:g,onChange:B=>u(B.target.value),className:"px-2.5 py-1.5 text-xs rounded bg-black/60 border border-cyan-500/30 text-cyan-100 focus:outline-none focus:border-cyan-400"}),l.jsx("textarea",{value:v,onChange:B=>y(B.target.value),className:"flex-1 min-h-[120px] p-2 text-xs rounded bg-black/60 border border-cyan-500/30 text-cyan-100 focus:outline-none focus:border-cyan-400 resize-none font-mono"}),l.jsxs("div",{className:"grid grid-cols-2 gap-2 pt-1",children:[l.jsx("button",{onClick:D,className:"px-2.5 py-1.5 text-[11px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors",children:"💾 Save (Revision Check)"}),l.jsx("button",{onClick:()=>{i("scribe"),y(B=>B+`
- [Added by @scribe Dot]: Verified local-first routing, HITL safety gates, and revision-safe documents.`)},className:"px-2.5 py-1.5 text-[11px] rounded border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 transition-colors",children:"✍ Ask Scribe"})]})]})]})]})]})},o2=()=>{const{currentView:t,notifications:e,removeNotification:n}=un(),i=()=>{switch(t){case"home":return l.jsx(_m,{});case"hud":return l.jsx(a2,{});case"chat":return l.jsx(KT,{});case"plan":return l.jsx(ZT,{});case"tasks":return l.jsx(QT,{});case"approvals":return l.jsx(JT,{});case"agents":return l.jsx(e2,{});case"activity":return l.jsx(t2,{});case"connectors":return l.jsx(r2,{});case"memory":return l.jsx(s2,{});default:return l.jsx(_m,{})}};return l.jsxs("div",{className:"min-h-screen bg-os-bg text-os-primary flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-400",children:[l.jsx(GT,{}),l.jsxs("div",{className:"flex-1 flex overflow-hidden",children:[l.jsx(WT,{}),l.jsx("main",{className:"flex-1 overflow-y-auto relative",children:i()})]}),l.jsx(XT,{}),l.jsx("div",{className:"fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none",children:e.map(r=>{const s=r.type==="success"?nn:r.type==="warning"?nd:r.type==="error"?ed:TS,a=r.type==="success"?"border-emerald-500/40 text-emerald-400 shadow-glass-glow":r.type==="warning"?"border-amber-500/40 text-amber-400 shadow-glass-glow-amber":r.type==="error"?"border-rose-500/40 text-rose-400 shadow-glass-glow-danger":"border-cyan-500/40 text-cyan-400 shadow-glass-glow-cyan";return l.jsxs("div",{className:`pointer-events-auto p-3.5 rounded-glass-md glass-panel border ${a} flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200`,children:[l.jsx(s,{className:"w-4 h-4 flex-shrink-0 mt-0.5"}),l.jsxs("div",{className:"flex-1 text-xs",children:[l.jsx("div",{className:"font-bold text-os-primary",children:r.title}),r.message&&l.jsx("div",{className:"text-os-secondary mt-0.5",children:r.message})]}),l.jsx("button",{onClick:()=>n(r.id),className:"text-os-muted hover:text-os-primary p-0.5",children:l.jsx(Gf,{className:"w-3.5 h-3.5"})})]},r.id)})})]})},l2=()=>l.jsx(oS,{children:l.jsx(lS,{children:l.jsx(o2,{})})});class c2 extends W.Component{constructor(){super(...arguments);Ja(this,"state",{hasError:!1,error:null,errorInfo:null});Ja(this,"handleReload",()=>{window.location.reload()});Ja(this,"handleReset",()=>{localStorage.removeItem("os-current-view"),window.location.href="/"})}static getDerivedStateFromError(n){return{hasError:!0,error:n,errorInfo:null}}componentDidCatch(n,i){console.error("OS Uncaught React Error:",n,i),this.setState({error:n,errorInfo:i})}render(){return this.state.hasError?l.jsx("div",{className:"min-h-screen bg-os-bg text-os-primary flex items-center justify-center p-6 antialiased",children:l.jsxs("div",{className:"max-w-lg w-full p-8 rounded-glass-xl glass-panel border border-rose-500/30 shadow-glass-glow-danger text-center space-y-6 animate-in fade-in zoom-in-95 duration-200",children:[l.jsx("div",{className:"w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner",children:l.jsx(NS,{className:"w-8 h-8"})}),l.jsxs("div",{className:"space-y-2",children:[l.jsx("span",{className:"text-[11px] font-mono uppercase tracking-widest text-rose-400",children:"System Interface Fault"}),l.jsx("h2",{className:"text-xl font-bold text-os-primary",children:"OS Interface Encountered a Render Error"}),l.jsx("p",{className:"text-xs text-os-secondary leading-relaxed",children:"The core OS daemon and database remain fully active and safe. A visual surface component caught an unhandled exception."})]}),this.state.error&&l.jsxs("div",{className:"text-left p-3.5 rounded-glass-md bg-black/40 border border-white/5 overflow-x-auto text-[11px] font-mono text-rose-300 max-h-36",children:[l.jsxs("div",{className:"font-semibold text-rose-200 mb-1",children:[this.state.error.name,": ",this.state.error.message]}),this.state.error.stack&&l.jsx("pre",{className:"text-[10px] text-os-muted whitespace-pre-wrap",children:this.state.error.stack.split(`
`).slice(0,4).join(`
`)})]}),l.jsxs("div",{className:"flex items-center justify-center gap-3 pt-2",children:[l.jsxs("button",{onClick:this.handleReload,className:"btn-press px-4 py-2 rounded-glass-md bg-white/10 hover:bg-white/15 border border-os-border text-xs font-medium text-os-primary flex items-center gap-2 transition-all",children:[l.jsx(Xn,{className:"w-3.5 h-3.5"}),l.jsx("span",{children:"Reload OS"})]}),l.jsxs("button",{onClick:this.handleReset,className:"btn-press px-4 py-2 rounded-glass-md bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold flex items-center gap-2 transition-all shadow-glass-glow",children:[l.jsx(o0,{className:"w-3.5 h-3.5"}),l.jsx("span",{children:"Reset to Home"})]})]})]})}):this.props.children}}au.createRoot(document.getElementById("root")).render(l.jsx(qv.StrictMode,{children:l.jsx(c2,{children:l.jsx(l2,{})})}));
