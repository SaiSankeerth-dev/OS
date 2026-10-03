(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function h0(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var hm={exports:{}},Nl={},pm={exports:{}},Be={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var za=Symbol.for("react.element"),p0=Symbol.for("react.portal"),m0=Symbol.for("react.fragment"),g0=Symbol.for("react.strict_mode"),x0=Symbol.for("react.profiler"),v0=Symbol.for("react.provider"),_0=Symbol.for("react.context"),y0=Symbol.for("react.forward_ref"),S0=Symbol.for("react.suspense"),M0=Symbol.for("react.memo"),E0=Symbol.for("react.lazy"),ih=Symbol.iterator;function w0(t){return t===null||typeof t!="object"?null:(t=ih&&t[ih]||t["@@iterator"],typeof t=="function"?t:null)}var mm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},gm=Object.assign,xm={};function ks(t,e,n){this.props=t,this.context=e,this.refs=xm,this.updater=n||mm}ks.prototype.isReactComponent={};ks.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};ks.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function vm(){}vm.prototype=ks.prototype;function jd(t,e,n){this.props=t,this.context=e,this.refs=xm,this.updater=n||mm}var Gd=jd.prototype=new vm;Gd.constructor=jd;gm(Gd,ks.prototype);Gd.isPureReactComponent=!0;var rh=Array.isArray,_m=Object.prototype.hasOwnProperty,Wd={current:null},ym={key:!0,ref:!0,__self:!0,__source:!0};function Sm(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)_m.call(e,i)&&!ym.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:za,type:t,key:s,ref:a,props:r,_owner:Wd.current}}function T0(t,e){return{$$typeof:za,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Xd(t){return typeof t=="object"&&t!==null&&t.$$typeof===za}function A0(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var sh=/\/+/g;function Jl(t,e){return typeof t=="object"&&t!==null&&t.key!=null?A0(""+t.key):e.toString(36)}function Bo(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case za:case p0:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+Jl(a,0):i,rh(r)?(n="",t!=null&&(n=t.replace(sh,"$&/")+"/"),Bo(r,e,n,"",function(c){return c})):r!=null&&(Xd(r)&&(r=T0(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(sh,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",rh(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+Jl(s,o);a+=Bo(s,e,n,l,r)}else if(l=w0(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+Jl(s,o++),a+=Bo(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function Ja(t,e,n){if(t==null)return t;var i=[],r=0;return Bo(t,i,"","",function(s){return e.call(n,s,r++)}),i}function b0(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var qt={current:null},Vo={transition:null},C0={ReactCurrentDispatcher:qt,ReactCurrentBatchConfig:Vo,ReactCurrentOwner:Wd};function Mm(){throw Error("act(...) is not supported in production builds of React.")}Be.Children={map:Ja,forEach:function(t,e,n){Ja(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Ja(t,function(){e++}),e},toArray:function(t){return Ja(t,function(e){return e})||[]},only:function(t){if(!Xd(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Be.Component=ks;Be.Fragment=m0;Be.Profiler=x0;Be.PureComponent=jd;Be.StrictMode=g0;Be.Suspense=S0;Be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=C0;Be.act=Mm;Be.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=gm({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=Wd.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)_m.call(e,l)&&!ym.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:za,type:t.type,key:r,ref:s,props:i,_owner:a}};Be.createContext=function(t){return t={$$typeof:_0,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:v0,_context:t},t.Consumer=t};Be.createElement=Sm;Be.createFactory=function(t){var e=Sm.bind(null,t);return e.type=t,e};Be.createRef=function(){return{current:null}};Be.forwardRef=function(t){return{$$typeof:y0,render:t}};Be.isValidElement=Xd;Be.lazy=function(t){return{$$typeof:E0,_payload:{_status:-1,_result:t},_init:b0}};Be.memo=function(t,e){return{$$typeof:M0,type:t,compare:e===void 0?null:e}};Be.startTransition=function(t){var e=Vo.transition;Vo.transition={};try{t()}finally{Vo.transition=e}};Be.unstable_act=Mm;Be.useCallback=function(t,e){return qt.current.useCallback(t,e)};Be.useContext=function(t){return qt.current.useContext(t)};Be.useDebugValue=function(){};Be.useDeferredValue=function(t){return qt.current.useDeferredValue(t)};Be.useEffect=function(t,e){return qt.current.useEffect(t,e)};Be.useId=function(){return qt.current.useId()};Be.useImperativeHandle=function(t,e,n){return qt.current.useImperativeHandle(t,e,n)};Be.useInsertionEffect=function(t,e){return qt.current.useInsertionEffect(t,e)};Be.useLayoutEffect=function(t,e){return qt.current.useLayoutEffect(t,e)};Be.useMemo=function(t,e){return qt.current.useMemo(t,e)};Be.useReducer=function(t,e,n){return qt.current.useReducer(t,e,n)};Be.useRef=function(t){return qt.current.useRef(t)};Be.useState=function(t){return qt.current.useState(t)};Be.useSyncExternalStore=function(t,e,n){return qt.current.useSyncExternalStore(t,e,n)};Be.useTransition=function(){return qt.current.useTransition()};Be.version="18.3.1";pm.exports=Be;var ee=pm.exports;const R0=h0(ee);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var N0=ee,P0=Symbol.for("react.element"),L0=Symbol.for("react.fragment"),D0=Object.prototype.hasOwnProperty,I0=N0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,U0={key:!0,ref:!0,__self:!0,__source:!0};function Em(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)D0.call(e,i)&&!U0.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:P0,type:t,key:s,ref:a,props:r,_owner:I0.current}}Nl.Fragment=L0;Nl.jsx=Em;Nl.jsxs=Em;hm.exports=Nl;var f=hm.exports,nu={},wm={exports:{}},gn={},Tm={exports:{}},Am={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(L,$){var J=L.length;L.push($);e:for(;0<J;){var oe=J-1>>>1,Me=L[oe];if(0<r(Me,$))L[oe]=$,L[J]=Me,J=oe;else break e}}function n(L){return L.length===0?null:L[0]}function i(L){if(L.length===0)return null;var $=L[0],J=L.pop();if(J!==$){L[0]=J;e:for(var oe=0,Me=L.length,qe=Me>>>1;oe<qe;){var X=2*(oe+1)-1,ie=L[X],me=X+1,ae=L[me];if(0>r(ie,J))me<Me&&0>r(ae,ie)?(L[oe]=ae,L[me]=J,oe=me):(L[oe]=ie,L[X]=J,oe=X);else if(me<Me&&0>r(ae,J))L[oe]=ae,L[me]=J,oe=me;else break e}}return $}function r(L,$){var J=L.sortIndex-$.sortIndex;return J!==0?J:L.id-$.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],c=[],d=1,p=null,h=3,m=!1,x=!1,_=!1,g=typeof setTimeout=="function"?setTimeout:null,u=typeof clearTimeout=="function"?clearTimeout:null,v=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(L){for(var $=n(c);$!==null;){if($.callback===null)i(c);else if($.startTime<=L)i(c),$.sortIndex=$.expirationTime,e(l,$);else break;$=n(c)}}function S(L){if(_=!1,y(L),!x)if(n(l)!==null)x=!0,W(N);else{var $=n(c);$!==null&&Q(S,$.startTime-L)}}function N(L,$){x=!1,_&&(_=!1,u(R),R=-1),m=!0;var J=h;try{for(y($),p=n(l);p!==null&&(!(p.expirationTime>$)||L&&!P());){var oe=p.callback;if(typeof oe=="function"){p.callback=null,h=p.priorityLevel;var Me=oe(p.expirationTime<=$);$=t.unstable_now(),typeof Me=="function"?p.callback=Me:p===n(l)&&i(l),y($)}else i(l);p=n(l)}if(p!==null)var qe=!0;else{var X=n(c);X!==null&&Q(S,X.startTime-$),qe=!1}return qe}finally{p=null,h=J,m=!1}}var b=!1,A=null,R=-1,w=5,M=-1;function P(){return!(t.unstable_now()-M<w)}function H(){if(A!==null){var L=t.unstable_now();M=L;var $=!0;try{$=A(!0,L)}finally{$?F():(b=!1,A=null)}}else b=!1}var F;if(typeof v=="function")F=function(){v(H)};else if(typeof MessageChannel<"u"){var G=new MessageChannel,Y=G.port2;G.port1.onmessage=H,F=function(){Y.postMessage(null)}}else F=function(){g(H,0)};function W(L){A=L,b||(b=!0,F())}function Q(L,$){R=g(function(){L(t.unstable_now())},$)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(L){L.callback=null},t.unstable_continueExecution=function(){x||m||(x=!0,W(N))},t.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):w=0<L?Math.floor(1e3/L):5},t.unstable_getCurrentPriorityLevel=function(){return h},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(L){switch(h){case 1:case 2:case 3:var $=3;break;default:$=h}var J=h;h=$;try{return L()}finally{h=J}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(L,$){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var J=h;h=L;try{return $()}finally{h=J}},t.unstable_scheduleCallback=function(L,$,J){var oe=t.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?oe+J:oe):J=oe,L){case 1:var Me=-1;break;case 2:Me=250;break;case 5:Me=1073741823;break;case 4:Me=1e4;break;default:Me=5e3}return Me=J+Me,L={id:d++,callback:$,priorityLevel:L,startTime:J,expirationTime:Me,sortIndex:-1},J>oe?(L.sortIndex=J,e(c,L),n(l)===null&&L===n(c)&&(_?(u(R),R=-1):_=!0,Q(S,J-oe))):(L.sortIndex=Me,e(l,L),x||m||(x=!0,W(N))),L},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(L){var $=h;return function(){var J=h;h=$;try{return L.apply(this,arguments)}finally{h=J}}}})(Am);Tm.exports=Am;var k0=Tm.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var F0=ee,mn=k0;function ne(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var bm=new Set,Sa={};function kr(t,e){Es(t,e),Es(t+"Capture",e)}function Es(t,e){for(Sa[t]=e,t=0;t<e.length;t++)bm.add(e[t])}var Mi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),iu=Object.prototype.hasOwnProperty,O0=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ah={},oh={};function z0(t){return iu.call(oh,t)?!0:iu.call(ah,t)?!1:O0.test(t)?oh[t]=!0:(ah[t]=!0,!1)}function B0(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function V0(t,e,n,i){if(e===null||typeof e>"u"||B0(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Yt(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var Ft={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Ft[t]=new Yt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Ft[e]=new Yt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Ft[t]=new Yt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Ft[t]=new Yt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Ft[t]=new Yt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Ft[t]=new Yt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Ft[t]=new Yt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Ft[t]=new Yt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Ft[t]=new Yt(t,5,!1,t.toLowerCase(),null,!1,!1)});var $d=/[\-:]([a-z])/g;function qd(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace($d,qd);Ft[e]=new Yt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace($d,qd);Ft[e]=new Yt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace($d,qd);Ft[e]=new Yt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Ft[t]=new Yt(t,1,!1,t.toLowerCase(),null,!1,!1)});Ft.xlinkHref=new Yt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Ft[t]=new Yt(t,1,!1,t.toLowerCase(),null,!0,!0)});function Yd(t,e,n,i){var r=Ft.hasOwnProperty(e)?Ft[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(V0(e,n,r,i)&&(n=null),i||r===null?z0(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Ci=F0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,eo=Symbol.for("react.element"),ts=Symbol.for("react.portal"),ns=Symbol.for("react.fragment"),Kd=Symbol.for("react.strict_mode"),ru=Symbol.for("react.profiler"),Cm=Symbol.for("react.provider"),Rm=Symbol.for("react.context"),Zd=Symbol.for("react.forward_ref"),su=Symbol.for("react.suspense"),au=Symbol.for("react.suspense_list"),Qd=Symbol.for("react.memo"),Oi=Symbol.for("react.lazy"),Nm=Symbol.for("react.offscreen"),lh=Symbol.iterator;function Ws(t){return t===null||typeof t!="object"?null:(t=lh&&t[lh]||t["@@iterator"],typeof t=="function"?t:null)}var xt=Object.assign,ec;function ra(t){if(ec===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);ec=e&&e[1]||""}return`
`+ec+t}var tc=!1;function nc(t,e){if(!t||tc)return"";tc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{tc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?ra(t):""}function H0(t){switch(t.tag){case 5:return ra(t.type);case 16:return ra("Lazy");case 13:return ra("Suspense");case 19:return ra("SuspenseList");case 0:case 2:case 15:return t=nc(t.type,!1),t;case 11:return t=nc(t.type.render,!1),t;case 1:return t=nc(t.type,!0),t;default:return""}}function ou(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ns:return"Fragment";case ts:return"Portal";case ru:return"Profiler";case Kd:return"StrictMode";case su:return"Suspense";case au:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Rm:return(t.displayName||"Context")+".Consumer";case Cm:return(t._context.displayName||"Context")+".Provider";case Zd:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Qd:return e=t.displayName||null,e!==null?e:ou(t.type)||"Memo";case Oi:e=t._payload,t=t._init;try{return ou(t(e))}catch{}}return null}function j0(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ou(e);case 8:return e===Kd?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function tr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Pm(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function G0(t){var e=Pm(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function to(t){t._valueTracker||(t._valueTracker=G0(t))}function Lm(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Pm(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function rl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function lu(t,e){var n=e.checked;return xt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function ch(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=tr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Dm(t,e){e=e.checked,e!=null&&Yd(t,"checked",e,!1)}function cu(t,e){Dm(t,e);var n=tr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?uu(t,e.type,n):e.hasOwnProperty("defaultValue")&&uu(t,e.type,tr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function uh(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function uu(t,e,n){(e!=="number"||rl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var sa=Array.isArray;function ps(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+tr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function du(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ne(91));return xt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function dh(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ne(92));if(sa(n)){if(1<n.length)throw Error(ne(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:tr(n)}}function Im(t,e){var n=tr(e.value),i=tr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function fh(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Um(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function fu(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Um(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var no,km=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(no=no||document.createElement("div"),no.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=no.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Ma(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var da={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},W0=["Webkit","ms","Moz","O"];Object.keys(da).forEach(function(t){W0.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),da[e]=da[t]})});function Fm(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||da.hasOwnProperty(t)&&da[t]?(""+e).trim():e+"px"}function Om(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Fm(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var X0=xt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function hu(t,e){if(e){if(X0[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ne(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ne(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ne(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ne(62))}}function pu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var mu=null;function Jd(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var gu=null,ms=null,gs=null;function hh(t){if(t=Ha(t)){if(typeof gu!="function")throw Error(ne(280));var e=t.stateNode;e&&(e=Ul(e),gu(t.stateNode,t.type,e))}}function zm(t){ms?gs?gs.push(t):gs=[t]:ms=t}function Bm(){if(ms){var t=ms,e=gs;if(gs=ms=null,hh(t),e)for(t=0;t<e.length;t++)hh(e[t])}}function Vm(t,e){return t(e)}function Hm(){}var ic=!1;function jm(t,e,n){if(ic)return t(e,n);ic=!0;try{return Vm(t,e,n)}finally{ic=!1,(ms!==null||gs!==null)&&(Hm(),Bm())}}function Ea(t,e){var n=t.stateNode;if(n===null)return null;var i=Ul(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ne(231,e,typeof n));return n}var xu=!1;if(Mi)try{var Xs={};Object.defineProperty(Xs,"passive",{get:function(){xu=!0}}),window.addEventListener("test",Xs,Xs),window.removeEventListener("test",Xs,Xs)}catch{xu=!1}function $0(t,e,n,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(d){this.onError(d)}}var fa=!1,sl=null,al=!1,vu=null,q0={onError:function(t){fa=!0,sl=t}};function Y0(t,e,n,i,r,s,a,o,l){fa=!1,sl=null,$0.apply(q0,arguments)}function K0(t,e,n,i,r,s,a,o,l){if(Y0.apply(this,arguments),fa){if(fa){var c=sl;fa=!1,sl=null}else throw Error(ne(198));al||(al=!0,vu=c)}}function Fr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Gm(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function ph(t){if(Fr(t)!==t)throw Error(ne(188))}function Z0(t){var e=t.alternate;if(!e){if(e=Fr(t),e===null)throw Error(ne(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return ph(r),t;if(s===i)return ph(r),e;s=s.sibling}throw Error(ne(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(ne(189))}}if(n.alternate!==i)throw Error(ne(190))}if(n.tag!==3)throw Error(ne(188));return n.stateNode.current===n?t:e}function Wm(t){return t=Z0(t),t!==null?Xm(t):null}function Xm(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Xm(t);if(e!==null)return e;t=t.sibling}return null}var $m=mn.unstable_scheduleCallback,mh=mn.unstable_cancelCallback,Q0=mn.unstable_shouldYield,J0=mn.unstable_requestPaint,St=mn.unstable_now,e_=mn.unstable_getCurrentPriorityLevel,ef=mn.unstable_ImmediatePriority,qm=mn.unstable_UserBlockingPriority,ol=mn.unstable_NormalPriority,t_=mn.unstable_LowPriority,Ym=mn.unstable_IdlePriority,Pl=null,ei=null;function n_(t){if(ei&&typeof ei.onCommitFiberRoot=="function")try{ei.onCommitFiberRoot(Pl,t,void 0,(t.current.flags&128)===128)}catch{}}var Hn=Math.clz32?Math.clz32:s_,i_=Math.log,r_=Math.LN2;function s_(t){return t>>>=0,t===0?32:31-(i_(t)/r_|0)|0}var io=64,ro=4194304;function aa(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function ll(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=aa(o):(s&=a,s!==0&&(i=aa(s)))}else a=n&~r,a!==0?i=aa(a):s!==0&&(i=aa(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Hn(e),r=1<<n,i|=t[n],e&=~r;return i}function a_(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function o_(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-Hn(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=a_(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function _u(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Km(){var t=io;return io<<=1,!(io&4194240)&&(io=64),t}function rc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ba(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Hn(e),t[e]=n}function l_(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Hn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function tf(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Hn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var et=0;function Zm(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Qm,nf,Jm,eg,tg,yu=!1,so=[],Wi=null,Xi=null,$i=null,wa=new Map,Ta=new Map,Bi=[],c_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function gh(t,e){switch(t){case"focusin":case"focusout":Wi=null;break;case"dragenter":case"dragleave":Xi=null;break;case"mouseover":case"mouseout":$i=null;break;case"pointerover":case"pointerout":wa.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ta.delete(e.pointerId)}}function $s(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Ha(e),e!==null&&nf(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function u_(t,e,n,i,r){switch(e){case"focusin":return Wi=$s(Wi,t,e,n,i,r),!0;case"dragenter":return Xi=$s(Xi,t,e,n,i,r),!0;case"mouseover":return $i=$s($i,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return wa.set(s,$s(wa.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Ta.set(s,$s(Ta.get(s)||null,t,e,n,i,r)),!0}return!1}function ng(t){var e=Mr(t.target);if(e!==null){var n=Fr(e);if(n!==null){if(e=n.tag,e===13){if(e=Gm(n),e!==null){t.blockedOn=e,tg(t.priority,function(){Jm(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ho(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Su(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);mu=i,n.target.dispatchEvent(i),mu=null}else return e=Ha(n),e!==null&&nf(e),t.blockedOn=n,!1;e.shift()}return!0}function xh(t,e,n){Ho(t)&&n.delete(e)}function d_(){yu=!1,Wi!==null&&Ho(Wi)&&(Wi=null),Xi!==null&&Ho(Xi)&&(Xi=null),$i!==null&&Ho($i)&&($i=null),wa.forEach(xh),Ta.forEach(xh)}function qs(t,e){t.blockedOn===e&&(t.blockedOn=null,yu||(yu=!0,mn.unstable_scheduleCallback(mn.unstable_NormalPriority,d_)))}function Aa(t){function e(r){return qs(r,t)}if(0<so.length){qs(so[0],t);for(var n=1;n<so.length;n++){var i=so[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Wi!==null&&qs(Wi,t),Xi!==null&&qs(Xi,t),$i!==null&&qs($i,t),wa.forEach(e),Ta.forEach(e),n=0;n<Bi.length;n++)i=Bi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Bi.length&&(n=Bi[0],n.blockedOn===null);)ng(n),n.blockedOn===null&&Bi.shift()}var xs=Ci.ReactCurrentBatchConfig,cl=!0;function f_(t,e,n,i){var r=et,s=xs.transition;xs.transition=null;try{et=1,rf(t,e,n,i)}finally{et=r,xs.transition=s}}function h_(t,e,n,i){var r=et,s=xs.transition;xs.transition=null;try{et=4,rf(t,e,n,i)}finally{et=r,xs.transition=s}}function rf(t,e,n,i){if(cl){var r=Su(t,e,n,i);if(r===null)pc(t,e,i,ul,n),gh(t,i);else if(u_(r,t,e,n,i))i.stopPropagation();else if(gh(t,i),e&4&&-1<c_.indexOf(t)){for(;r!==null;){var s=Ha(r);if(s!==null&&Qm(s),s=Su(t,e,n,i),s===null&&pc(t,e,i,ul,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else pc(t,e,i,null,n)}}var ul=null;function Su(t,e,n,i){if(ul=null,t=Jd(i),t=Mr(t),t!==null)if(e=Fr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Gm(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return ul=t,null}function ig(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(e_()){case ef:return 1;case qm:return 4;case ol:case t_:return 16;case Ym:return 536870912;default:return 16}default:return 16}}var ji=null,sf=null,jo=null;function rg(){if(jo)return jo;var t,e=sf,n=e.length,i,r="value"in ji?ji.value:ji.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return jo=r.slice(t,1<i?1-i:void 0)}function Go(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function ao(){return!0}function vh(){return!1}function xn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ao:vh,this.isPropagationStopped=vh,this}return xt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ao)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ao)},persist:function(){},isPersistent:ao}),e}var Fs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},af=xn(Fs),Va=xt({},Fs,{view:0,detail:0}),p_=xn(Va),sc,ac,Ys,Ll=xt({},Va,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:of,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ys&&(Ys&&t.type==="mousemove"?(sc=t.screenX-Ys.screenX,ac=t.screenY-Ys.screenY):ac=sc=0,Ys=t),sc)},movementY:function(t){return"movementY"in t?t.movementY:ac}}),_h=xn(Ll),m_=xt({},Ll,{dataTransfer:0}),g_=xn(m_),x_=xt({},Va,{relatedTarget:0}),oc=xn(x_),v_=xt({},Fs,{animationName:0,elapsedTime:0,pseudoElement:0}),__=xn(v_),y_=xt({},Fs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),S_=xn(y_),M_=xt({},Fs,{data:0}),yh=xn(M_),E_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},w_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},T_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function A_(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=T_[t])?!!e[t]:!1}function of(){return A_}var b_=xt({},Va,{key:function(t){if(t.key){var e=E_[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Go(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?w_[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:of,charCode:function(t){return t.type==="keypress"?Go(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Go(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),C_=xn(b_),R_=xt({},Ll,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Sh=xn(R_),N_=xt({},Va,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:of}),P_=xn(N_),L_=xt({},Fs,{propertyName:0,elapsedTime:0,pseudoElement:0}),D_=xn(L_),I_=xt({},Ll,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),U_=xn(I_),k_=[9,13,27,32],lf=Mi&&"CompositionEvent"in window,ha=null;Mi&&"documentMode"in document&&(ha=document.documentMode);var F_=Mi&&"TextEvent"in window&&!ha,sg=Mi&&(!lf||ha&&8<ha&&11>=ha),Mh=" ",Eh=!1;function ag(t,e){switch(t){case"keyup":return k_.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function og(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var is=!1;function O_(t,e){switch(t){case"compositionend":return og(e);case"keypress":return e.which!==32?null:(Eh=!0,Mh);case"textInput":return t=e.data,t===Mh&&Eh?null:t;default:return null}}function z_(t,e){if(is)return t==="compositionend"||!lf&&ag(t,e)?(t=rg(),jo=sf=ji=null,is=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return sg&&e.locale!=="ko"?null:e.data;default:return null}}var B_={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function wh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!B_[t.type]:e==="textarea"}function lg(t,e,n,i){zm(i),e=dl(e,"onChange"),0<e.length&&(n=new af("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var pa=null,ba=null;function V_(t){_g(t,0)}function Dl(t){var e=as(t);if(Lm(e))return t}function H_(t,e){if(t==="change")return e}var cg=!1;if(Mi){var lc;if(Mi){var cc="oninput"in document;if(!cc){var Th=document.createElement("div");Th.setAttribute("oninput","return;"),cc=typeof Th.oninput=="function"}lc=cc}else lc=!1;cg=lc&&(!document.documentMode||9<document.documentMode)}function Ah(){pa&&(pa.detachEvent("onpropertychange",ug),ba=pa=null)}function ug(t){if(t.propertyName==="value"&&Dl(ba)){var e=[];lg(e,ba,t,Jd(t)),jm(V_,e)}}function j_(t,e,n){t==="focusin"?(Ah(),pa=e,ba=n,pa.attachEvent("onpropertychange",ug)):t==="focusout"&&Ah()}function G_(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Dl(ba)}function W_(t,e){if(t==="click")return Dl(e)}function X_(t,e){if(t==="input"||t==="change")return Dl(e)}function $_(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Wn=typeof Object.is=="function"?Object.is:$_;function Ca(t,e){if(Wn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!iu.call(e,r)||!Wn(t[r],e[r]))return!1}return!0}function bh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Ch(t,e){var n=bh(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=bh(n)}}function dg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?dg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function fg(){for(var t=window,e=rl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=rl(t.document)}return e}function cf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function q_(t){var e=fg(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&dg(n.ownerDocument.documentElement,n)){if(i!==null&&cf(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=Ch(n,s);var a=Ch(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var Y_=Mi&&"documentMode"in document&&11>=document.documentMode,rs=null,Mu=null,ma=null,Eu=!1;function Rh(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Eu||rs==null||rs!==rl(i)||(i=rs,"selectionStart"in i&&cf(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ma&&Ca(ma,i)||(ma=i,i=dl(Mu,"onSelect"),0<i.length&&(e=new af("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=rs)))}function oo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var ss={animationend:oo("Animation","AnimationEnd"),animationiteration:oo("Animation","AnimationIteration"),animationstart:oo("Animation","AnimationStart"),transitionend:oo("Transition","TransitionEnd")},uc={},hg={};Mi&&(hg=document.createElement("div").style,"AnimationEvent"in window||(delete ss.animationend.animation,delete ss.animationiteration.animation,delete ss.animationstart.animation),"TransitionEvent"in window||delete ss.transitionend.transition);function Il(t){if(uc[t])return uc[t];if(!ss[t])return t;var e=ss[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in hg)return uc[t]=e[n];return t}var pg=Il("animationend"),mg=Il("animationiteration"),gg=Il("animationstart"),xg=Il("transitionend"),vg=new Map,Nh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function sr(t,e){vg.set(t,e),kr(e,[t])}for(var dc=0;dc<Nh.length;dc++){var fc=Nh[dc],K_=fc.toLowerCase(),Z_=fc[0].toUpperCase()+fc.slice(1);sr(K_,"on"+Z_)}sr(pg,"onAnimationEnd");sr(mg,"onAnimationIteration");sr(gg,"onAnimationStart");sr("dblclick","onDoubleClick");sr("focusin","onFocus");sr("focusout","onBlur");sr(xg,"onTransitionEnd");Es("onMouseEnter",["mouseout","mouseover"]);Es("onMouseLeave",["mouseout","mouseover"]);Es("onPointerEnter",["pointerout","pointerover"]);Es("onPointerLeave",["pointerout","pointerover"]);kr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));kr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));kr("onBeforeInput",["compositionend","keypress","textInput","paste"]);kr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));kr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));kr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var oa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Q_=new Set("cancel close invalid load scroll toggle".split(" ").concat(oa));function Ph(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,K0(i,e,void 0,t),t.currentTarget=null}function _g(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;Ph(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;Ph(r,o,c),s=l}}}if(al)throw t=vu,al=!1,vu=null,t}function dt(t,e){var n=e[Cu];n===void 0&&(n=e[Cu]=new Set);var i=t+"__bubble";n.has(i)||(yg(e,t,2,!1),n.add(i))}function hc(t,e,n){var i=0;e&&(i|=4),yg(n,t,i,e)}var lo="_reactListening"+Math.random().toString(36).slice(2);function Ra(t){if(!t[lo]){t[lo]=!0,bm.forEach(function(n){n!=="selectionchange"&&(Q_.has(n)||hc(n,!1,t),hc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[lo]||(e[lo]=!0,hc("selectionchange",!1,e))}}function yg(t,e,n,i){switch(ig(e)){case 1:var r=f_;break;case 4:r=h_;break;default:r=rf}n=r.bind(null,e,n,t),r=void 0,!xu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function pc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Mr(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}jm(function(){var c=s,d=Jd(n),p=[];e:{var h=vg.get(t);if(h!==void 0){var m=af,x=t;switch(t){case"keypress":if(Go(n)===0)break e;case"keydown":case"keyup":m=C_;break;case"focusin":x="focus",m=oc;break;case"focusout":x="blur",m=oc;break;case"beforeblur":case"afterblur":m=oc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=_h;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=g_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=P_;break;case pg:case mg:case gg:m=__;break;case xg:m=D_;break;case"scroll":m=p_;break;case"wheel":m=U_;break;case"copy":case"cut":case"paste":m=S_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=Sh}var _=(e&4)!==0,g=!_&&t==="scroll",u=_?h!==null?h+"Capture":null:h;_=[];for(var v=c,y;v!==null;){y=v;var S=y.stateNode;if(y.tag===5&&S!==null&&(y=S,u!==null&&(S=Ea(v,u),S!=null&&_.push(Na(v,S,y)))),g)break;v=v.return}0<_.length&&(h=new m(h,x,null,n,d),p.push({event:h,listeners:_}))}}if(!(e&7)){e:{if(h=t==="mouseover"||t==="pointerover",m=t==="mouseout"||t==="pointerout",h&&n!==mu&&(x=n.relatedTarget||n.fromElement)&&(Mr(x)||x[Ei]))break e;if((m||h)&&(h=d.window===d?d:(h=d.ownerDocument)?h.defaultView||h.parentWindow:window,m?(x=n.relatedTarget||n.toElement,m=c,x=x?Mr(x):null,x!==null&&(g=Fr(x),x!==g||x.tag!==5&&x.tag!==6)&&(x=null)):(m=null,x=c),m!==x)){if(_=_h,S="onMouseLeave",u="onMouseEnter",v="mouse",(t==="pointerout"||t==="pointerover")&&(_=Sh,S="onPointerLeave",u="onPointerEnter",v="pointer"),g=m==null?h:as(m),y=x==null?h:as(x),h=new _(S,v+"leave",m,n,d),h.target=g,h.relatedTarget=y,S=null,Mr(d)===c&&(_=new _(u,v+"enter",x,n,d),_.target=y,_.relatedTarget=g,S=_),g=S,m&&x)t:{for(_=m,u=x,v=0,y=_;y;y=Br(y))v++;for(y=0,S=u;S;S=Br(S))y++;for(;0<v-y;)_=Br(_),v--;for(;0<y-v;)u=Br(u),y--;for(;v--;){if(_===u||u!==null&&_===u.alternate)break t;_=Br(_),u=Br(u)}_=null}else _=null;m!==null&&Lh(p,h,m,_,!1),x!==null&&g!==null&&Lh(p,g,x,_,!0)}}e:{if(h=c?as(c):window,m=h.nodeName&&h.nodeName.toLowerCase(),m==="select"||m==="input"&&h.type==="file")var N=H_;else if(wh(h))if(cg)N=X_;else{N=G_;var b=j_}else(m=h.nodeName)&&m.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(N=W_);if(N&&(N=N(t,c))){lg(p,N,n,d);break e}b&&b(t,h,c),t==="focusout"&&(b=h._wrapperState)&&b.controlled&&h.type==="number"&&uu(h,"number",h.value)}switch(b=c?as(c):window,t){case"focusin":(wh(b)||b.contentEditable==="true")&&(rs=b,Mu=c,ma=null);break;case"focusout":ma=Mu=rs=null;break;case"mousedown":Eu=!0;break;case"contextmenu":case"mouseup":case"dragend":Eu=!1,Rh(p,n,d);break;case"selectionchange":if(Y_)break;case"keydown":case"keyup":Rh(p,n,d)}var A;if(lf)e:{switch(t){case"compositionstart":var R="onCompositionStart";break e;case"compositionend":R="onCompositionEnd";break e;case"compositionupdate":R="onCompositionUpdate";break e}R=void 0}else is?ag(t,n)&&(R="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(R="onCompositionStart");R&&(sg&&n.locale!=="ko"&&(is||R!=="onCompositionStart"?R==="onCompositionEnd"&&is&&(A=rg()):(ji=d,sf="value"in ji?ji.value:ji.textContent,is=!0)),b=dl(c,R),0<b.length&&(R=new yh(R,t,null,n,d),p.push({event:R,listeners:b}),A?R.data=A:(A=og(n),A!==null&&(R.data=A)))),(A=F_?O_(t,n):z_(t,n))&&(c=dl(c,"onBeforeInput"),0<c.length&&(d=new yh("onBeforeInput","beforeinput",null,n,d),p.push({event:d,listeners:c}),d.data=A))}_g(p,e)})}function Na(t,e,n){return{instance:t,listener:e,currentTarget:n}}function dl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Ea(t,n),s!=null&&i.unshift(Na(t,s,r)),s=Ea(t,e),s!=null&&i.push(Na(t,s,r))),t=t.return}return i}function Br(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Lh(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=Ea(n,s),l!=null&&a.unshift(Na(n,l,o))):r||(l=Ea(n,s),l!=null&&a.push(Na(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var J_=/\r\n?/g,ey=/\u0000|\uFFFD/g;function Dh(t){return(typeof t=="string"?t:""+t).replace(J_,`
`).replace(ey,"")}function co(t,e,n){if(e=Dh(e),Dh(t)!==e&&n)throw Error(ne(425))}function fl(){}var wu=null,Tu=null;function Au(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var bu=typeof setTimeout=="function"?setTimeout:void 0,ty=typeof clearTimeout=="function"?clearTimeout:void 0,Ih=typeof Promise=="function"?Promise:void 0,ny=typeof queueMicrotask=="function"?queueMicrotask:typeof Ih<"u"?function(t){return Ih.resolve(null).then(t).catch(iy)}:bu;function iy(t){setTimeout(function(){throw t})}function mc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Aa(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Aa(e)}function qi(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Uh(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Os=Math.random().toString(36).slice(2),Kn="__reactFiber$"+Os,Pa="__reactProps$"+Os,Ei="__reactContainer$"+Os,Cu="__reactEvents$"+Os,ry="__reactListeners$"+Os,sy="__reactHandles$"+Os;function Mr(t){var e=t[Kn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Ei]||n[Kn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Uh(t);t!==null;){if(n=t[Kn])return n;t=Uh(t)}return e}t=n,n=t.parentNode}return null}function Ha(t){return t=t[Kn]||t[Ei],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function as(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ne(33))}function Ul(t){return t[Pa]||null}var Ru=[],os=-1;function ar(t){return{current:t}}function ft(t){0>os||(t.current=Ru[os],Ru[os]=null,os--)}function at(t,e){os++,Ru[os]=t.current,t.current=e}var nr={},Gt=ar(nr),tn=ar(!1),Rr=nr;function ws(t,e){var n=t.type.contextTypes;if(!n)return nr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function nn(t){return t=t.childContextTypes,t!=null}function hl(){ft(tn),ft(Gt)}function kh(t,e,n){if(Gt.current!==nr)throw Error(ne(168));at(Gt,e),at(tn,n)}function Sg(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ne(108,j0(t)||"Unknown",r));return xt({},n,i)}function pl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||nr,Rr=Gt.current,at(Gt,t),at(tn,tn.current),!0}function Fh(t,e,n){var i=t.stateNode;if(!i)throw Error(ne(169));n?(t=Sg(t,e,Rr),i.__reactInternalMemoizedMergedChildContext=t,ft(tn),ft(Gt),at(Gt,t)):ft(tn),at(tn,n)}var pi=null,kl=!1,gc=!1;function Mg(t){pi===null?pi=[t]:pi.push(t)}function ay(t){kl=!0,Mg(t)}function or(){if(!gc&&pi!==null){gc=!0;var t=0,e=et;try{var n=pi;for(et=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}pi=null,kl=!1}catch(r){throw pi!==null&&(pi=pi.slice(t+1)),$m(ef,or),r}finally{et=e,gc=!1}}return null}var ls=[],cs=0,ml=null,gl=0,Mn=[],En=0,Nr=null,gi=1,xi="";function gr(t,e){ls[cs++]=gl,ls[cs++]=ml,ml=t,gl=e}function Eg(t,e,n){Mn[En++]=gi,Mn[En++]=xi,Mn[En++]=Nr,Nr=t;var i=gi;t=xi;var r=32-Hn(i)-1;i&=~(1<<r),n+=1;var s=32-Hn(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,gi=1<<32-Hn(e)+r|n<<r|i,xi=s+t}else gi=1<<s|n<<r|i,xi=t}function uf(t){t.return!==null&&(gr(t,1),Eg(t,1,0))}function df(t){for(;t===ml;)ml=ls[--cs],ls[cs]=null,gl=ls[--cs],ls[cs]=null;for(;t===Nr;)Nr=Mn[--En],Mn[En]=null,xi=Mn[--En],Mn[En]=null,gi=Mn[--En],Mn[En]=null}var pn=null,hn=null,ht=!1,zn=null;function wg(t,e){var n=Tn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Oh(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,pn=t,hn=qi(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,pn=t,hn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Nr!==null?{id:gi,overflow:xi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Tn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,pn=t,hn=null,!0):!1;default:return!1}}function Nu(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Pu(t){if(ht){var e=hn;if(e){var n=e;if(!Oh(t,e)){if(Nu(t))throw Error(ne(418));e=qi(n.nextSibling);var i=pn;e&&Oh(t,e)?wg(i,n):(t.flags=t.flags&-4097|2,ht=!1,pn=t)}}else{if(Nu(t))throw Error(ne(418));t.flags=t.flags&-4097|2,ht=!1,pn=t}}}function zh(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;pn=t}function uo(t){if(t!==pn)return!1;if(!ht)return zh(t),ht=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Au(t.type,t.memoizedProps)),e&&(e=hn)){if(Nu(t))throw Tg(),Error(ne(418));for(;e;)wg(t,e),e=qi(e.nextSibling)}if(zh(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ne(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){hn=qi(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}hn=null}}else hn=pn?qi(t.stateNode.nextSibling):null;return!0}function Tg(){for(var t=hn;t;)t=qi(t.nextSibling)}function Ts(){hn=pn=null,ht=!1}function ff(t){zn===null?zn=[t]:zn.push(t)}var oy=Ci.ReactCurrentBatchConfig;function Ks(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ne(309));var i=n.stateNode}if(!i)throw Error(ne(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(ne(284));if(!n._owner)throw Error(ne(290,t))}return t}function fo(t,e){throw t=Object.prototype.toString.call(e),Error(ne(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Bh(t){var e=t._init;return e(t._payload)}function Ag(t){function e(u,v){if(t){var y=u.deletions;y===null?(u.deletions=[v],u.flags|=16):y.push(v)}}function n(u,v){if(!t)return null;for(;v!==null;)e(u,v),v=v.sibling;return null}function i(u,v){for(u=new Map;v!==null;)v.key!==null?u.set(v.key,v):u.set(v.index,v),v=v.sibling;return u}function r(u,v){return u=Qi(u,v),u.index=0,u.sibling=null,u}function s(u,v,y){return u.index=y,t?(y=u.alternate,y!==null?(y=y.index,y<v?(u.flags|=2,v):y):(u.flags|=2,v)):(u.flags|=1048576,v)}function a(u){return t&&u.alternate===null&&(u.flags|=2),u}function o(u,v,y,S){return v===null||v.tag!==6?(v=Ec(y,u.mode,S),v.return=u,v):(v=r(v,y),v.return=u,v)}function l(u,v,y,S){var N=y.type;return N===ns?d(u,v,y.props.children,S,y.key):v!==null&&(v.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===Oi&&Bh(N)===v.type)?(S=r(v,y.props),S.ref=Ks(u,v,y),S.return=u,S):(S=Zo(y.type,y.key,y.props,null,u.mode,S),S.ref=Ks(u,v,y),S.return=u,S)}function c(u,v,y,S){return v===null||v.tag!==4||v.stateNode.containerInfo!==y.containerInfo||v.stateNode.implementation!==y.implementation?(v=wc(y,u.mode,S),v.return=u,v):(v=r(v,y.children||[]),v.return=u,v)}function d(u,v,y,S,N){return v===null||v.tag!==7?(v=Cr(y,u.mode,S,N),v.return=u,v):(v=r(v,y),v.return=u,v)}function p(u,v,y){if(typeof v=="string"&&v!==""||typeof v=="number")return v=Ec(""+v,u.mode,y),v.return=u,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case eo:return y=Zo(v.type,v.key,v.props,null,u.mode,y),y.ref=Ks(u,null,v),y.return=u,y;case ts:return v=wc(v,u.mode,y),v.return=u,v;case Oi:var S=v._init;return p(u,S(v._payload),y)}if(sa(v)||Ws(v))return v=Cr(v,u.mode,y,null),v.return=u,v;fo(u,v)}return null}function h(u,v,y,S){var N=v!==null?v.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return N!==null?null:o(u,v,""+y,S);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case eo:return y.key===N?l(u,v,y,S):null;case ts:return y.key===N?c(u,v,y,S):null;case Oi:return N=y._init,h(u,v,N(y._payload),S)}if(sa(y)||Ws(y))return N!==null?null:d(u,v,y,S,null);fo(u,y)}return null}function m(u,v,y,S,N){if(typeof S=="string"&&S!==""||typeof S=="number")return u=u.get(y)||null,o(v,u,""+S,N);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case eo:return u=u.get(S.key===null?y:S.key)||null,l(v,u,S,N);case ts:return u=u.get(S.key===null?y:S.key)||null,c(v,u,S,N);case Oi:var b=S._init;return m(u,v,y,b(S._payload),N)}if(sa(S)||Ws(S))return u=u.get(y)||null,d(v,u,S,N,null);fo(v,S)}return null}function x(u,v,y,S){for(var N=null,b=null,A=v,R=v=0,w=null;A!==null&&R<y.length;R++){A.index>R?(w=A,A=null):w=A.sibling;var M=h(u,A,y[R],S);if(M===null){A===null&&(A=w);break}t&&A&&M.alternate===null&&e(u,A),v=s(M,v,R),b===null?N=M:b.sibling=M,b=M,A=w}if(R===y.length)return n(u,A),ht&&gr(u,R),N;if(A===null){for(;R<y.length;R++)A=p(u,y[R],S),A!==null&&(v=s(A,v,R),b===null?N=A:b.sibling=A,b=A);return ht&&gr(u,R),N}for(A=i(u,A);R<y.length;R++)w=m(A,u,R,y[R],S),w!==null&&(t&&w.alternate!==null&&A.delete(w.key===null?R:w.key),v=s(w,v,R),b===null?N=w:b.sibling=w,b=w);return t&&A.forEach(function(P){return e(u,P)}),ht&&gr(u,R),N}function _(u,v,y,S){var N=Ws(y);if(typeof N!="function")throw Error(ne(150));if(y=N.call(y),y==null)throw Error(ne(151));for(var b=N=null,A=v,R=v=0,w=null,M=y.next();A!==null&&!M.done;R++,M=y.next()){A.index>R?(w=A,A=null):w=A.sibling;var P=h(u,A,M.value,S);if(P===null){A===null&&(A=w);break}t&&A&&P.alternate===null&&e(u,A),v=s(P,v,R),b===null?N=P:b.sibling=P,b=P,A=w}if(M.done)return n(u,A),ht&&gr(u,R),N;if(A===null){for(;!M.done;R++,M=y.next())M=p(u,M.value,S),M!==null&&(v=s(M,v,R),b===null?N=M:b.sibling=M,b=M);return ht&&gr(u,R),N}for(A=i(u,A);!M.done;R++,M=y.next())M=m(A,u,R,M.value,S),M!==null&&(t&&M.alternate!==null&&A.delete(M.key===null?R:M.key),v=s(M,v,R),b===null?N=M:b.sibling=M,b=M);return t&&A.forEach(function(H){return e(u,H)}),ht&&gr(u,R),N}function g(u,v,y,S){if(typeof y=="object"&&y!==null&&y.type===ns&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case eo:e:{for(var N=y.key,b=v;b!==null;){if(b.key===N){if(N=y.type,N===ns){if(b.tag===7){n(u,b.sibling),v=r(b,y.props.children),v.return=u,u=v;break e}}else if(b.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===Oi&&Bh(N)===b.type){n(u,b.sibling),v=r(b,y.props),v.ref=Ks(u,b,y),v.return=u,u=v;break e}n(u,b);break}else e(u,b);b=b.sibling}y.type===ns?(v=Cr(y.props.children,u.mode,S,y.key),v.return=u,u=v):(S=Zo(y.type,y.key,y.props,null,u.mode,S),S.ref=Ks(u,v,y),S.return=u,u=S)}return a(u);case ts:e:{for(b=y.key;v!==null;){if(v.key===b)if(v.tag===4&&v.stateNode.containerInfo===y.containerInfo&&v.stateNode.implementation===y.implementation){n(u,v.sibling),v=r(v,y.children||[]),v.return=u,u=v;break e}else{n(u,v);break}else e(u,v);v=v.sibling}v=wc(y,u.mode,S),v.return=u,u=v}return a(u);case Oi:return b=y._init,g(u,v,b(y._payload),S)}if(sa(y))return x(u,v,y,S);if(Ws(y))return _(u,v,y,S);fo(u,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,v!==null&&v.tag===6?(n(u,v.sibling),v=r(v,y),v.return=u,u=v):(n(u,v),v=Ec(y,u.mode,S),v.return=u,u=v),a(u)):n(u,v)}return g}var As=Ag(!0),bg=Ag(!1),xl=ar(null),vl=null,us=null,hf=null;function pf(){hf=us=vl=null}function mf(t){var e=xl.current;ft(xl),t._currentValue=e}function Lu(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function vs(t,e){vl=t,hf=us=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(en=!0),t.firstContext=null)}function Rn(t){var e=t._currentValue;if(hf!==t)if(t={context:t,memoizedValue:e,next:null},us===null){if(vl===null)throw Error(ne(308));us=t,vl.dependencies={lanes:0,firstContext:t}}else us=us.next=t;return e}var Er=null;function gf(t){Er===null?Er=[t]:Er.push(t)}function Cg(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,gf(e)):(n.next=r.next,r.next=n),e.interleaved=n,wi(t,i)}function wi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var zi=!1;function xf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Rg(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function yi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Yi(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,$e&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,wi(t,n)}return r=i.interleaved,r===null?(e.next=e,gf(i)):(e.next=r.next,r.next=e),i.interleaved=e,wi(t,n)}function Wo(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,tf(t,n)}}function Vh(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function _l(t,e,n,i){var r=t.updateQueue;zi=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var d=t.alternate;d!==null&&(d=d.updateQueue,o=d.lastBaseUpdate,o!==a&&(o===null?d.firstBaseUpdate=c:o.next=c,d.lastBaseUpdate=l))}if(s!==null){var p=r.baseState;a=0,d=c=l=null,o=s;do{var h=o.lane,m=o.eventTime;if((i&h)===h){d!==null&&(d=d.next={eventTime:m,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var x=t,_=o;switch(h=e,m=n,_.tag){case 1:if(x=_.payload,typeof x=="function"){p=x.call(m,p,h);break e}p=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=_.payload,h=typeof x=="function"?x.call(m,p,h):x,h==null)break e;p=xt({},p,h);break e;case 2:zi=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,h=r.effects,h===null?r.effects=[o]:h.push(o))}else m={eventTime:m,lane:h,tag:o.tag,payload:o.payload,callback:o.callback,next:null},d===null?(c=d=m,l=p):d=d.next=m,a|=h;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;h=o,o=h.next,h.next=null,r.lastBaseUpdate=h,r.shared.pending=null}}while(!0);if(d===null&&(l=p),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Lr|=a,t.lanes=a,t.memoizedState=p}}function Hh(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ne(191,r));r.call(i)}}}var ja={},ti=ar(ja),La=ar(ja),Da=ar(ja);function wr(t){if(t===ja)throw Error(ne(174));return t}function vf(t,e){switch(at(Da,e),at(La,t),at(ti,ja),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:fu(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=fu(e,t)}ft(ti),at(ti,e)}function bs(){ft(ti),ft(La),ft(Da)}function Ng(t){wr(Da.current);var e=wr(ti.current),n=fu(e,t.type);e!==n&&(at(La,t),at(ti,n))}function _f(t){La.current===t&&(ft(ti),ft(La))}var mt=ar(0);function yl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var xc=[];function yf(){for(var t=0;t<xc.length;t++)xc[t]._workInProgressVersionPrimary=null;xc.length=0}var Xo=Ci.ReactCurrentDispatcher,vc=Ci.ReactCurrentBatchConfig,Pr=0,gt=null,bt=null,Dt=null,Sl=!1,ga=!1,Ia=0,ly=0;function zt(){throw Error(ne(321))}function Sf(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Wn(t[n],e[n]))return!1;return!0}function Mf(t,e,n,i,r,s){if(Pr=s,gt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Xo.current=t===null||t.memoizedState===null?fy:hy,t=n(i,r),ga){s=0;do{if(ga=!1,Ia=0,25<=s)throw Error(ne(301));s+=1,Dt=bt=null,e.updateQueue=null,Xo.current=py,t=n(i,r)}while(ga)}if(Xo.current=Ml,e=bt!==null&&bt.next!==null,Pr=0,Dt=bt=gt=null,Sl=!1,e)throw Error(ne(300));return t}function Ef(){var t=Ia!==0;return Ia=0,t}function qn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Dt===null?gt.memoizedState=Dt=t:Dt=Dt.next=t,Dt}function Nn(){if(bt===null){var t=gt.alternate;t=t!==null?t.memoizedState:null}else t=bt.next;var e=Dt===null?gt.memoizedState:Dt.next;if(e!==null)Dt=e,bt=t;else{if(t===null)throw Error(ne(310));bt=t,t={memoizedState:bt.memoizedState,baseState:bt.baseState,baseQueue:bt.baseQueue,queue:bt.queue,next:null},Dt===null?gt.memoizedState=Dt=t:Dt=Dt.next=t}return Dt}function Ua(t,e){return typeof e=="function"?e(t):e}function _c(t){var e=Nn(),n=e.queue;if(n===null)throw Error(ne(311));n.lastRenderedReducer=t;var i=bt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var d=c.lane;if((Pr&d)===d)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var p={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=p,a=i):l=l.next=p,gt.lanes|=d,Lr|=d}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,Wn(i,e.memoizedState)||(en=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,gt.lanes|=s,Lr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function yc(t){var e=Nn(),n=e.queue;if(n===null)throw Error(ne(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);Wn(s,e.memoizedState)||(en=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function Pg(){}function Lg(t,e){var n=gt,i=Nn(),r=e(),s=!Wn(i.memoizedState,r);if(s&&(i.memoizedState=r,en=!0),i=i.queue,wf(Ug.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Dt!==null&&Dt.memoizedState.tag&1){if(n.flags|=2048,ka(9,Ig.bind(null,n,i,r,e),void 0,null),It===null)throw Error(ne(349));Pr&30||Dg(n,e,r)}return r}function Dg(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=gt.updateQueue,e===null?(e={lastEffect:null,stores:null},gt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Ig(t,e,n,i){e.value=n,e.getSnapshot=i,kg(e)&&Fg(t)}function Ug(t,e,n){return n(function(){kg(e)&&Fg(t)})}function kg(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Wn(t,n)}catch{return!0}}function Fg(t){var e=wi(t,1);e!==null&&jn(e,t,1,-1)}function jh(t){var e=qn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ua,lastRenderedState:t},e.queue=t,t=t.dispatch=dy.bind(null,gt,t),[e.memoizedState,t]}function ka(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=gt.updateQueue,e===null?(e={lastEffect:null,stores:null},gt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function Og(){return Nn().memoizedState}function $o(t,e,n,i){var r=qn();gt.flags|=t,r.memoizedState=ka(1|e,n,void 0,i===void 0?null:i)}function Fl(t,e,n,i){var r=Nn();i=i===void 0?null:i;var s=void 0;if(bt!==null){var a=bt.memoizedState;if(s=a.destroy,i!==null&&Sf(i,a.deps)){r.memoizedState=ka(e,n,s,i);return}}gt.flags|=t,r.memoizedState=ka(1|e,n,s,i)}function Gh(t,e){return $o(8390656,8,t,e)}function wf(t,e){return Fl(2048,8,t,e)}function zg(t,e){return Fl(4,2,t,e)}function Bg(t,e){return Fl(4,4,t,e)}function Vg(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function Hg(t,e,n){return n=n!=null?n.concat([t]):null,Fl(4,4,Vg.bind(null,e,t),n)}function Tf(){}function jg(t,e){var n=Nn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Sf(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function Gg(t,e){var n=Nn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Sf(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function Wg(t,e,n){return Pr&21?(Wn(n,e)||(n=Km(),gt.lanes|=n,Lr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,en=!0),t.memoizedState=n)}function cy(t,e){var n=et;et=n!==0&&4>n?n:4,t(!0);var i=vc.transition;vc.transition={};try{t(!1),e()}finally{et=n,vc.transition=i}}function Xg(){return Nn().memoizedState}function uy(t,e,n){var i=Zi(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},$g(t))qg(e,n);else if(n=Cg(t,e,n,i),n!==null){var r=$t();jn(n,t,i,r),Yg(n,e,i)}}function dy(t,e,n){var i=Zi(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if($g(t))qg(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,Wn(o,a)){var l=e.interleaved;l===null?(r.next=r,gf(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=Cg(t,e,r,i),n!==null&&(r=$t(),jn(n,t,i,r),Yg(n,e,i))}}function $g(t){var e=t.alternate;return t===gt||e!==null&&e===gt}function qg(t,e){ga=Sl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Yg(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,tf(t,n)}}var Ml={readContext:Rn,useCallback:zt,useContext:zt,useEffect:zt,useImperativeHandle:zt,useInsertionEffect:zt,useLayoutEffect:zt,useMemo:zt,useReducer:zt,useRef:zt,useState:zt,useDebugValue:zt,useDeferredValue:zt,useTransition:zt,useMutableSource:zt,useSyncExternalStore:zt,useId:zt,unstable_isNewReconciler:!1},fy={readContext:Rn,useCallback:function(t,e){return qn().memoizedState=[t,e===void 0?null:e],t},useContext:Rn,useEffect:Gh,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,$o(4194308,4,Vg.bind(null,e,t),n)},useLayoutEffect:function(t,e){return $o(4194308,4,t,e)},useInsertionEffect:function(t,e){return $o(4,2,t,e)},useMemo:function(t,e){var n=qn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=qn();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=uy.bind(null,gt,t),[i.memoizedState,t]},useRef:function(t){var e=qn();return t={current:t},e.memoizedState=t},useState:jh,useDebugValue:Tf,useDeferredValue:function(t){return qn().memoizedState=t},useTransition:function(){var t=jh(!1),e=t[0];return t=cy.bind(null,t[1]),qn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=gt,r=qn();if(ht){if(n===void 0)throw Error(ne(407));n=n()}else{if(n=e(),It===null)throw Error(ne(349));Pr&30||Dg(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,Gh(Ug.bind(null,i,s,t),[t]),i.flags|=2048,ka(9,Ig.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=qn(),e=It.identifierPrefix;if(ht){var n=xi,i=gi;n=(i&~(1<<32-Hn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ia++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=ly++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},hy={readContext:Rn,useCallback:jg,useContext:Rn,useEffect:wf,useImperativeHandle:Hg,useInsertionEffect:zg,useLayoutEffect:Bg,useMemo:Gg,useReducer:_c,useRef:Og,useState:function(){return _c(Ua)},useDebugValue:Tf,useDeferredValue:function(t){var e=Nn();return Wg(e,bt.memoizedState,t)},useTransition:function(){var t=_c(Ua)[0],e=Nn().memoizedState;return[t,e]},useMutableSource:Pg,useSyncExternalStore:Lg,useId:Xg,unstable_isNewReconciler:!1},py={readContext:Rn,useCallback:jg,useContext:Rn,useEffect:wf,useImperativeHandle:Hg,useInsertionEffect:zg,useLayoutEffect:Bg,useMemo:Gg,useReducer:yc,useRef:Og,useState:function(){return yc(Ua)},useDebugValue:Tf,useDeferredValue:function(t){var e=Nn();return bt===null?e.memoizedState=t:Wg(e,bt.memoizedState,t)},useTransition:function(){var t=yc(Ua)[0],e=Nn().memoizedState;return[t,e]},useMutableSource:Pg,useSyncExternalStore:Lg,useId:Xg,unstable_isNewReconciler:!1};function Fn(t,e){if(t&&t.defaultProps){e=xt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Du(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:xt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Ol={isMounted:function(t){return(t=t._reactInternals)?Fr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=$t(),r=Zi(t),s=yi(i,r);s.payload=e,n!=null&&(s.callback=n),e=Yi(t,s,r),e!==null&&(jn(e,t,r,i),Wo(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=$t(),r=Zi(t),s=yi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Yi(t,s,r),e!==null&&(jn(e,t,r,i),Wo(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=$t(),i=Zi(t),r=yi(n,i);r.tag=2,e!=null&&(r.callback=e),e=Yi(t,r,i),e!==null&&(jn(e,t,i,n),Wo(e,t,i))}};function Wh(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!Ca(n,i)||!Ca(r,s):!0}function Kg(t,e,n){var i=!1,r=nr,s=e.contextType;return typeof s=="object"&&s!==null?s=Rn(s):(r=nn(e)?Rr:Gt.current,i=e.contextTypes,s=(i=i!=null)?ws(t,r):nr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Ol,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function Xh(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Ol.enqueueReplaceState(e,e.state,null)}function Iu(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},xf(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Rn(s):(s=nn(e)?Rr:Gt.current,r.context=ws(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Du(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Ol.enqueueReplaceState(r,r.state,null),_l(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Cs(t,e){try{var n="",i=e;do n+=H0(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Sc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Uu(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var my=typeof WeakMap=="function"?WeakMap:Map;function Zg(t,e,n){n=yi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){wl||(wl=!0,Wu=i),Uu(t,e)},n}function Qg(t,e,n){n=yi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){Uu(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Uu(t,e),typeof i!="function"&&(Ki===null?Ki=new Set([this]):Ki.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function $h(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new my;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=Ry.bind(null,t,e,n),e.then(t,t))}function qh(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Yh(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=yi(-1,1),e.tag=2,Yi(n,e,1))),n.lanes|=1),t)}var gy=Ci.ReactCurrentOwner,en=!1;function Xt(t,e,n,i){e.child=t===null?bg(e,null,n,i):As(e,t.child,n,i)}function Kh(t,e,n,i,r){n=n.render;var s=e.ref;return vs(e,r),i=Mf(t,e,n,i,s,r),n=Ef(),t!==null&&!en?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ti(t,e,r)):(ht&&n&&uf(e),e.flags|=1,Xt(t,e,i,r),e.child)}function Zh(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Df(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,Jg(t,e,s,i,r)):(t=Zo(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:Ca,n(a,i)&&t.ref===e.ref)return Ti(t,e,r)}return e.flags|=1,t=Qi(s,i),t.ref=e.ref,t.return=e,e.child=t}function Jg(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Ca(s,i)&&t.ref===e.ref)if(en=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(en=!0);else return e.lanes=t.lanes,Ti(t,e,r)}return ku(t,e,n,i,r)}function ex(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},at(fs,fn),fn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,at(fs,fn),fn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,at(fs,fn),fn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,at(fs,fn),fn|=i;return Xt(t,e,r,n),e.child}function tx(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function ku(t,e,n,i,r){var s=nn(n)?Rr:Gt.current;return s=ws(e,s),vs(e,r),n=Mf(t,e,n,i,s,r),i=Ef(),t!==null&&!en?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ti(t,e,r)):(ht&&i&&uf(e),e.flags|=1,Xt(t,e,n,r),e.child)}function Qh(t,e,n,i,r){if(nn(n)){var s=!0;pl(e)}else s=!1;if(vs(e,r),e.stateNode===null)qo(t,e),Kg(e,n,i),Iu(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=n.contextType;typeof c=="object"&&c!==null?c=Rn(c):(c=nn(n)?Rr:Gt.current,c=ws(e,c));var d=n.getDerivedStateFromProps,p=typeof d=="function"||typeof a.getSnapshotBeforeUpdate=="function";p||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&Xh(e,a,i,c),zi=!1;var h=e.memoizedState;a.state=h,_l(e,i,a,r),l=e.memoizedState,o!==i||h!==l||tn.current||zi?(typeof d=="function"&&(Du(e,n,d,i),l=e.memoizedState),(o=zi||Wh(e,n,o,i,h,l,c))?(p||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,Rg(t,e),o=e.memoizedProps,c=e.type===e.elementType?o:Fn(e.type,o),a.props=c,p=e.pendingProps,h=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Rn(l):(l=nn(n)?Rr:Gt.current,l=ws(e,l));var m=n.getDerivedStateFromProps;(d=typeof m=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==p||h!==l)&&Xh(e,a,i,l),zi=!1,h=e.memoizedState,a.state=h,_l(e,i,a,r);var x=e.memoizedState;o!==p||h!==x||tn.current||zi?(typeof m=="function"&&(Du(e,n,m,i),x=e.memoizedState),(c=zi||Wh(e,n,c,i,h,x,l)||!1)?(d||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,x,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,x,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=x),a.props=i,a.state=x,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),i=!1)}return Fu(t,e,n,i,s,r)}function Fu(t,e,n,i,r,s){tx(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&Fh(e,n,!1),Ti(t,e,s);i=e.stateNode,gy.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=As(e,t.child,null,s),e.child=As(e,null,o,s)):Xt(t,e,o,s),e.memoizedState=i.state,r&&Fh(e,n,!0),e.child}function nx(t){var e=t.stateNode;e.pendingContext?kh(t,e.pendingContext,e.pendingContext!==e.context):e.context&&kh(t,e.context,!1),vf(t,e.containerInfo)}function Jh(t,e,n,i,r){return Ts(),ff(r),e.flags|=256,Xt(t,e,n,i),e.child}var Ou={dehydrated:null,treeContext:null,retryLane:0};function zu(t){return{baseLanes:t,cachePool:null,transitions:null}}function ix(t,e,n){var i=e.pendingProps,r=mt.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),at(mt,r&1),t===null)return Pu(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=Vl(a,i,0,null),t=Cr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=zu(n),e.memoizedState=Ou,t):Af(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return xy(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Qi(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=Qi(o,s):(s=Cr(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?zu(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=Ou,i}return s=t.child,t=s.sibling,i=Qi(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Af(t,e){return e=Vl({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function ho(t,e,n,i){return i!==null&&ff(i),As(e,t.child,null,n),t=Af(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function xy(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=Sc(Error(ne(422))),ho(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Vl({mode:"visible",children:i.children},r,0,null),s=Cr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&As(e,t.child,null,a),e.child.memoizedState=zu(a),e.memoizedState=Ou,s);if(!(e.mode&1))return ho(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(ne(419)),i=Sc(s,i,void 0),ho(t,e,a,i)}if(o=(a&t.childLanes)!==0,en||o){if(i=It,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,wi(t,r),jn(i,t,r,-1))}return Lf(),i=Sc(Error(ne(421))),ho(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=Ny.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,hn=qi(r.nextSibling),pn=e,ht=!0,zn=null,t!==null&&(Mn[En++]=gi,Mn[En++]=xi,Mn[En++]=Nr,gi=t.id,xi=t.overflow,Nr=e),e=Af(e,i.children),e.flags|=4096,e)}function ep(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Lu(t.return,e,n)}function Mc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function rx(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(Xt(t,e,i.children,n),i=mt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&ep(t,n,e);else if(t.tag===19)ep(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(at(mt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&yl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Mc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&yl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Mc(e,!0,n,null,s);break;case"together":Mc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function qo(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Ti(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Lr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ne(153));if(e.child!==null){for(t=e.child,n=Qi(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Qi(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function vy(t,e,n){switch(e.tag){case 3:nx(e),Ts();break;case 5:Ng(e);break;case 1:nn(e.type)&&pl(e);break;case 4:vf(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;at(xl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(at(mt,mt.current&1),e.flags|=128,null):n&e.child.childLanes?ix(t,e,n):(at(mt,mt.current&1),t=Ti(t,e,n),t!==null?t.sibling:null);at(mt,mt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return rx(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),at(mt,mt.current),i)break;return null;case 22:case 23:return e.lanes=0,ex(t,e,n)}return Ti(t,e,n)}var sx,Bu,ax,ox;sx=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Bu=function(){};ax=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,wr(ti.current);var s=null;switch(n){case"input":r=lu(t,r),i=lu(t,i),s=[];break;case"select":r=xt({},r,{value:void 0}),i=xt({},i,{value:void 0}),s=[];break;case"textarea":r=du(t,r),i=du(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=fl)}hu(n,i);var a;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Sa.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Sa.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&dt("scroll",t),s||o===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};ox=function(t,e,n,i){n!==i&&(e.flags|=4)};function Zs(t,e){if(!ht)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Bt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function _y(t,e,n){var i=e.pendingProps;switch(df(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Bt(e),null;case 1:return nn(e.type)&&hl(),Bt(e),null;case 3:return i=e.stateNode,bs(),ft(tn),ft(Gt),yf(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(uo(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,zn!==null&&(qu(zn),zn=null))),Bu(t,e),Bt(e),null;case 5:_f(e);var r=wr(Da.current);if(n=e.type,t!==null&&e.stateNode!=null)ax(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ne(166));return Bt(e),null}if(t=wr(ti.current),uo(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[Kn]=e,i[Pa]=s,t=(e.mode&1)!==0,n){case"dialog":dt("cancel",i),dt("close",i);break;case"iframe":case"object":case"embed":dt("load",i);break;case"video":case"audio":for(r=0;r<oa.length;r++)dt(oa[r],i);break;case"source":dt("error",i);break;case"img":case"image":case"link":dt("error",i),dt("load",i);break;case"details":dt("toggle",i);break;case"input":ch(i,s),dt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},dt("invalid",i);break;case"textarea":dh(i,s),dt("invalid",i)}hu(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&co(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&co(i.textContent,o,t),r=["children",""+o]):Sa.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&dt("scroll",i)}switch(n){case"input":to(i),uh(i,s,!0);break;case"textarea":to(i),fh(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=fl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Um(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[Kn]=e,t[Pa]=i,sx(t,e,!1,!1),e.stateNode=t;e:{switch(a=pu(n,i),n){case"dialog":dt("cancel",t),dt("close",t),r=i;break;case"iframe":case"object":case"embed":dt("load",t),r=i;break;case"video":case"audio":for(r=0;r<oa.length;r++)dt(oa[r],t);r=i;break;case"source":dt("error",t),r=i;break;case"img":case"image":case"link":dt("error",t),dt("load",t),r=i;break;case"details":dt("toggle",t),r=i;break;case"input":ch(t,i),r=lu(t,i),dt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=xt({},i,{value:void 0}),dt("invalid",t);break;case"textarea":dh(t,i),r=du(t,i),dt("invalid",t);break;default:r=i}hu(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?Om(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&km(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Ma(t,l):typeof l=="number"&&Ma(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Sa.hasOwnProperty(s)?l!=null&&s==="onScroll"&&dt("scroll",t):l!=null&&Yd(t,s,l,a))}switch(n){case"input":to(t),uh(t,i,!1);break;case"textarea":to(t),fh(t);break;case"option":i.value!=null&&t.setAttribute("value",""+tr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?ps(t,!!i.multiple,s,!1):i.defaultValue!=null&&ps(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=fl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Bt(e),null;case 6:if(t&&e.stateNode!=null)ox(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ne(166));if(n=wr(Da.current),wr(ti.current),uo(e)){if(i=e.stateNode,n=e.memoizedProps,i[Kn]=e,(s=i.nodeValue!==n)&&(t=pn,t!==null))switch(t.tag){case 3:co(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&co(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Kn]=e,e.stateNode=i}return Bt(e),null;case 13:if(ft(mt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(ht&&hn!==null&&e.mode&1&&!(e.flags&128))Tg(),Ts(),e.flags|=98560,s=!1;else if(s=uo(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ne(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ne(317));s[Kn]=e}else Ts(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Bt(e),s=!1}else zn!==null&&(qu(zn),zn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||mt.current&1?Rt===0&&(Rt=3):Lf())),e.updateQueue!==null&&(e.flags|=4),Bt(e),null);case 4:return bs(),Bu(t,e),t===null&&Ra(e.stateNode.containerInfo),Bt(e),null;case 10:return mf(e.type._context),Bt(e),null;case 17:return nn(e.type)&&hl(),Bt(e),null;case 19:if(ft(mt),s=e.memoizedState,s===null)return Bt(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)Zs(s,!1);else{if(Rt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=yl(t),a!==null){for(e.flags|=128,Zs(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return at(mt,mt.current&1|2),e.child}t=t.sibling}s.tail!==null&&St()>Rs&&(e.flags|=128,i=!0,Zs(s,!1),e.lanes=4194304)}else{if(!i)if(t=yl(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Zs(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!ht)return Bt(e),null}else 2*St()-s.renderingStartTime>Rs&&n!==1073741824&&(e.flags|=128,i=!0,Zs(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=St(),e.sibling=null,n=mt.current,at(mt,i?n&1|2:n&1),e):(Bt(e),null);case 22:case 23:return Pf(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?fn&1073741824&&(Bt(e),e.subtreeFlags&6&&(e.flags|=8192)):Bt(e),null;case 24:return null;case 25:return null}throw Error(ne(156,e.tag))}function yy(t,e){switch(df(e),e.tag){case 1:return nn(e.type)&&hl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return bs(),ft(tn),ft(Gt),yf(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return _f(e),null;case 13:if(ft(mt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ne(340));Ts()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return ft(mt),null;case 4:return bs(),null;case 10:return mf(e.type._context),null;case 22:case 23:return Pf(),null;case 24:return null;default:return null}}var po=!1,jt=!1,Sy=typeof WeakSet=="function"?WeakSet:Set,pe=null;function ds(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){_t(t,e,i)}else n.current=null}function Vu(t,e,n){try{n()}catch(i){_t(t,e,i)}}var tp=!1;function My(t,e){if(wu=cl,t=fg(),cf(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,c=0,d=0,p=t,h=null;t:for(;;){for(var m;p!==n||r!==0&&p.nodeType!==3||(o=a+r),p!==s||i!==0&&p.nodeType!==3||(l=a+i),p.nodeType===3&&(a+=p.nodeValue.length),(m=p.firstChild)!==null;)h=p,p=m;for(;;){if(p===t)break t;if(h===n&&++c===r&&(o=a),h===s&&++d===i&&(l=a),(m=p.nextSibling)!==null)break;p=h,h=p.parentNode}p=m}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Tu={focusedElem:t,selectionRange:n},cl=!1,pe=e;pe!==null;)if(e=pe,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,pe=t;else for(;pe!==null;){e=pe;try{var x=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(x!==null){var _=x.memoizedProps,g=x.memoizedState,u=e.stateNode,v=u.getSnapshotBeforeUpdate(e.elementType===e.type?_:Fn(e.type,_),g);u.__reactInternalSnapshotBeforeUpdate=v}break;case 3:var y=e.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ne(163))}}catch(S){_t(e,e.return,S)}if(t=e.sibling,t!==null){t.return=e.return,pe=t;break}pe=e.return}return x=tp,tp=!1,x}function xa(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Vu(e,n,s)}r=r.next}while(r!==i)}}function zl(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Hu(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function lx(t){var e=t.alternate;e!==null&&(t.alternate=null,lx(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Kn],delete e[Pa],delete e[Cu],delete e[ry],delete e[sy])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function cx(t){return t.tag===5||t.tag===3||t.tag===4}function np(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||cx(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function ju(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=fl));else if(i!==4&&(t=t.child,t!==null))for(ju(t,e,n),t=t.sibling;t!==null;)ju(t,e,n),t=t.sibling}function Gu(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Gu(t,e,n),t=t.sibling;t!==null;)Gu(t,e,n),t=t.sibling}var Ut=null,On=!1;function Pi(t,e,n){for(n=n.child;n!==null;)ux(t,e,n),n=n.sibling}function ux(t,e,n){if(ei&&typeof ei.onCommitFiberUnmount=="function")try{ei.onCommitFiberUnmount(Pl,n)}catch{}switch(n.tag){case 5:jt||ds(n,e);case 6:var i=Ut,r=On;Ut=null,Pi(t,e,n),Ut=i,On=r,Ut!==null&&(On?(t=Ut,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Ut.removeChild(n.stateNode));break;case 18:Ut!==null&&(On?(t=Ut,n=n.stateNode,t.nodeType===8?mc(t.parentNode,n):t.nodeType===1&&mc(t,n),Aa(t)):mc(Ut,n.stateNode));break;case 4:i=Ut,r=On,Ut=n.stateNode.containerInfo,On=!0,Pi(t,e,n),Ut=i,On=r;break;case 0:case 11:case 14:case 15:if(!jt&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Vu(n,e,a),r=r.next}while(r!==i)}Pi(t,e,n);break;case 1:if(!jt&&(ds(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){_t(n,e,o)}Pi(t,e,n);break;case 21:Pi(t,e,n);break;case 22:n.mode&1?(jt=(i=jt)||n.memoizedState!==null,Pi(t,e,n),jt=i):Pi(t,e,n);break;default:Pi(t,e,n)}}function ip(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new Sy),e.forEach(function(i){var r=Py.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Dn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Ut=o.stateNode,On=!1;break e;case 3:Ut=o.stateNode.containerInfo,On=!0;break e;case 4:Ut=o.stateNode.containerInfo,On=!0;break e}o=o.return}if(Ut===null)throw Error(ne(160));ux(s,a,r),Ut=null,On=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){_t(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)dx(e,t),e=e.sibling}function dx(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Dn(e,t),$n(t),i&4){try{xa(3,t,t.return),zl(3,t)}catch(_){_t(t,t.return,_)}try{xa(5,t,t.return)}catch(_){_t(t,t.return,_)}}break;case 1:Dn(e,t),$n(t),i&512&&n!==null&&ds(n,n.return);break;case 5:if(Dn(e,t),$n(t),i&512&&n!==null&&ds(n,n.return),t.flags&32){var r=t.stateNode;try{Ma(r,"")}catch(_){_t(t,t.return,_)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&Dm(r,s),pu(o,a);var c=pu(o,s);for(a=0;a<l.length;a+=2){var d=l[a],p=l[a+1];d==="style"?Om(r,p):d==="dangerouslySetInnerHTML"?km(r,p):d==="children"?Ma(r,p):Yd(r,d,p,c)}switch(o){case"input":cu(r,s);break;case"textarea":Im(r,s);break;case"select":var h=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var m=s.value;m!=null?ps(r,!!s.multiple,m,!1):h!==!!s.multiple&&(s.defaultValue!=null?ps(r,!!s.multiple,s.defaultValue,!0):ps(r,!!s.multiple,s.multiple?[]:"",!1))}r[Pa]=s}catch(_){_t(t,t.return,_)}}break;case 6:if(Dn(e,t),$n(t),i&4){if(t.stateNode===null)throw Error(ne(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(_){_t(t,t.return,_)}}break;case 3:if(Dn(e,t),$n(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Aa(e.containerInfo)}catch(_){_t(t,t.return,_)}break;case 4:Dn(e,t),$n(t);break;case 13:Dn(e,t),$n(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Rf=St())),i&4&&ip(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(jt=(c=jt)||d,Dn(e,t),jt=c):Dn(e,t),$n(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!d&&t.mode&1)for(pe=t,d=t.child;d!==null;){for(p=pe=d;pe!==null;){switch(h=pe,m=h.child,h.tag){case 0:case 11:case 14:case 15:xa(4,h,h.return);break;case 1:ds(h,h.return);var x=h.stateNode;if(typeof x.componentWillUnmount=="function"){i=h,n=h.return;try{e=i,x.props=e.memoizedProps,x.state=e.memoizedState,x.componentWillUnmount()}catch(_){_t(i,n,_)}}break;case 5:ds(h,h.return);break;case 22:if(h.memoizedState!==null){sp(p);continue}}m!==null?(m.return=h,pe=m):sp(p)}d=d.sibling}e:for(d=null,p=t;;){if(p.tag===5){if(d===null){d=p;try{r=p.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=p.stateNode,l=p.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=Fm("display",a))}catch(_){_t(t,t.return,_)}}}else if(p.tag===6){if(d===null)try{p.stateNode.nodeValue=c?"":p.memoizedProps}catch(_){_t(t,t.return,_)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===t)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===t)break e;for(;p.sibling===null;){if(p.return===null||p.return===t)break e;d===p&&(d=null),p=p.return}d===p&&(d=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:Dn(e,t),$n(t),i&4&&ip(t);break;case 21:break;default:Dn(e,t),$n(t)}}function $n(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(cx(n)){var i=n;break e}n=n.return}throw Error(ne(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Ma(r,""),i.flags&=-33);var s=np(t);Gu(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=np(t);ju(t,o,a);break;default:throw Error(ne(161))}}catch(l){_t(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Ey(t,e,n){pe=t,fx(t)}function fx(t,e,n){for(var i=(t.mode&1)!==0;pe!==null;){var r=pe,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||po;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||jt;o=po;var c=jt;if(po=a,(jt=l)&&!c)for(pe=r;pe!==null;)a=pe,l=a.child,a.tag===22&&a.memoizedState!==null?ap(r):l!==null?(l.return=a,pe=l):ap(r);for(;s!==null;)pe=s,fx(s),s=s.sibling;pe=r,po=o,jt=c}rp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,pe=s):rp(t)}}function rp(t){for(;pe!==null;){var e=pe;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:jt||zl(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!jt)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Fn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Hh(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Hh(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var p=d.dehydrated;p!==null&&Aa(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ne(163))}jt||e.flags&512&&Hu(e)}catch(h){_t(e,e.return,h)}}if(e===t){pe=null;break}if(n=e.sibling,n!==null){n.return=e.return,pe=n;break}pe=e.return}}function sp(t){for(;pe!==null;){var e=pe;if(e===t){pe=null;break}var n=e.sibling;if(n!==null){n.return=e.return,pe=n;break}pe=e.return}}function ap(t){for(;pe!==null;){var e=pe;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{zl(4,e)}catch(l){_t(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){_t(e,r,l)}}var s=e.return;try{Hu(e)}catch(l){_t(e,s,l)}break;case 5:var a=e.return;try{Hu(e)}catch(l){_t(e,a,l)}}}catch(l){_t(e,e.return,l)}if(e===t){pe=null;break}var o=e.sibling;if(o!==null){o.return=e.return,pe=o;break}pe=e.return}}var wy=Math.ceil,El=Ci.ReactCurrentDispatcher,bf=Ci.ReactCurrentOwner,bn=Ci.ReactCurrentBatchConfig,$e=0,It=null,At=null,kt=0,fn=0,fs=ar(0),Rt=0,Fa=null,Lr=0,Bl=0,Cf=0,va=null,Qt=null,Rf=0,Rs=1/0,hi=null,wl=!1,Wu=null,Ki=null,mo=!1,Gi=null,Tl=0,_a=0,Xu=null,Yo=-1,Ko=0;function $t(){return $e&6?St():Yo!==-1?Yo:Yo=St()}function Zi(t){return t.mode&1?$e&2&&kt!==0?kt&-kt:oy.transition!==null?(Ko===0&&(Ko=Km()),Ko):(t=et,t!==0||(t=window.event,t=t===void 0?16:ig(t.type)),t):1}function jn(t,e,n,i){if(50<_a)throw _a=0,Xu=null,Error(ne(185));Ba(t,n,i),(!($e&2)||t!==It)&&(t===It&&(!($e&2)&&(Bl|=n),Rt===4&&Vi(t,kt)),rn(t,i),n===1&&$e===0&&!(e.mode&1)&&(Rs=St()+500,kl&&or()))}function rn(t,e){var n=t.callbackNode;o_(t,e);var i=ll(t,t===It?kt:0);if(i===0)n!==null&&mh(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&mh(n),e===1)t.tag===0?ay(op.bind(null,t)):Mg(op.bind(null,t)),ny(function(){!($e&6)&&or()}),n=null;else{switch(Zm(i)){case 1:n=ef;break;case 4:n=qm;break;case 16:n=ol;break;case 536870912:n=Ym;break;default:n=ol}n=yx(n,hx.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function hx(t,e){if(Yo=-1,Ko=0,$e&6)throw Error(ne(327));var n=t.callbackNode;if(_s()&&t.callbackNode!==n)return null;var i=ll(t,t===It?kt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Al(t,i);else{e=i;var r=$e;$e|=2;var s=mx();(It!==t||kt!==e)&&(hi=null,Rs=St()+500,br(t,e));do try{by();break}catch(o){px(t,o)}while(!0);pf(),El.current=s,$e=r,At!==null?e=0:(It=null,kt=0,e=Rt)}if(e!==0){if(e===2&&(r=_u(t),r!==0&&(i=r,e=$u(t,r))),e===1)throw n=Fa,br(t,0),Vi(t,i),rn(t,St()),n;if(e===6)Vi(t,i);else{if(r=t.current.alternate,!(i&30)&&!Ty(r)&&(e=Al(t,i),e===2&&(s=_u(t),s!==0&&(i=s,e=$u(t,s))),e===1))throw n=Fa,br(t,0),Vi(t,i),rn(t,St()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ne(345));case 2:xr(t,Qt,hi);break;case 3:if(Vi(t,i),(i&130023424)===i&&(e=Rf+500-St(),10<e)){if(ll(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){$t(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=bu(xr.bind(null,t,Qt,hi),e);break}xr(t,Qt,hi);break;case 4:if(Vi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-Hn(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=St()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*wy(i/1960))-i,10<i){t.timeoutHandle=bu(xr.bind(null,t,Qt,hi),i);break}xr(t,Qt,hi);break;case 5:xr(t,Qt,hi);break;default:throw Error(ne(329))}}}return rn(t,St()),t.callbackNode===n?hx.bind(null,t):null}function $u(t,e){var n=va;return t.current.memoizedState.isDehydrated&&(br(t,e).flags|=256),t=Al(t,e),t!==2&&(e=Qt,Qt=n,e!==null&&qu(e)),t}function qu(t){Qt===null?Qt=t:Qt.push.apply(Qt,t)}function Ty(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!Wn(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Vi(t,e){for(e&=~Cf,e&=~Bl,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Hn(e),i=1<<n;t[n]=-1,e&=~i}}function op(t){if($e&6)throw Error(ne(327));_s();var e=ll(t,0);if(!(e&1))return rn(t,St()),null;var n=Al(t,e);if(t.tag!==0&&n===2){var i=_u(t);i!==0&&(e=i,n=$u(t,i))}if(n===1)throw n=Fa,br(t,0),Vi(t,e),rn(t,St()),n;if(n===6)throw Error(ne(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,xr(t,Qt,hi),rn(t,St()),null}function Nf(t,e){var n=$e;$e|=1;try{return t(e)}finally{$e=n,$e===0&&(Rs=St()+500,kl&&or())}}function Dr(t){Gi!==null&&Gi.tag===0&&!($e&6)&&_s();var e=$e;$e|=1;var n=bn.transition,i=et;try{if(bn.transition=null,et=1,t)return t()}finally{et=i,bn.transition=n,$e=e,!($e&6)&&or()}}function Pf(){fn=fs.current,ft(fs)}function br(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,ty(n)),At!==null)for(n=At.return;n!==null;){var i=n;switch(df(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&hl();break;case 3:bs(),ft(tn),ft(Gt),yf();break;case 5:_f(i);break;case 4:bs();break;case 13:ft(mt);break;case 19:ft(mt);break;case 10:mf(i.type._context);break;case 22:case 23:Pf()}n=n.return}if(It=t,At=t=Qi(t.current,null),kt=fn=e,Rt=0,Fa=null,Cf=Bl=Lr=0,Qt=va=null,Er!==null){for(e=0;e<Er.length;e++)if(n=Er[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}Er=null}return t}function px(t,e){do{var n=At;try{if(pf(),Xo.current=Ml,Sl){for(var i=gt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Sl=!1}if(Pr=0,Dt=bt=gt=null,ga=!1,Ia=0,bf.current=null,n===null||n.return===null){Rt=1,Fa=e,At=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=kt,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,d=o,p=d.tag;if(!(d.mode&1)&&(p===0||p===11||p===15)){var h=d.alternate;h?(d.updateQueue=h.updateQueue,d.memoizedState=h.memoizedState,d.lanes=h.lanes):(d.updateQueue=null,d.memoizedState=null)}var m=qh(a);if(m!==null){m.flags&=-257,Yh(m,a,o,s,e),m.mode&1&&$h(s,c,e),e=m,l=c;var x=e.updateQueue;if(x===null){var _=new Set;_.add(l),e.updateQueue=_}else x.add(l);break e}else{if(!(e&1)){$h(s,c,e),Lf();break e}l=Error(ne(426))}}else if(ht&&o.mode&1){var g=qh(a);if(g!==null){!(g.flags&65536)&&(g.flags|=256),Yh(g,a,o,s,e),ff(Cs(l,o));break e}}s=l=Cs(l,o),Rt!==4&&(Rt=2),va===null?va=[s]:va.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var u=Zg(s,l,e);Vh(s,u);break e;case 1:o=l;var v=s.type,y=s.stateNode;if(!(s.flags&128)&&(typeof v.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(Ki===null||!Ki.has(y)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=Qg(s,o,e);Vh(s,S);break e}}s=s.return}while(s!==null)}xx(n)}catch(N){e=N,At===n&&n!==null&&(At=n=n.return);continue}break}while(!0)}function mx(){var t=El.current;return El.current=Ml,t===null?Ml:t}function Lf(){(Rt===0||Rt===3||Rt===2)&&(Rt=4),It===null||!(Lr&268435455)&&!(Bl&268435455)||Vi(It,kt)}function Al(t,e){var n=$e;$e|=2;var i=mx();(It!==t||kt!==e)&&(hi=null,br(t,e));do try{Ay();break}catch(r){px(t,r)}while(!0);if(pf(),$e=n,El.current=i,At!==null)throw Error(ne(261));return It=null,kt=0,Rt}function Ay(){for(;At!==null;)gx(At)}function by(){for(;At!==null&&!Q0();)gx(At)}function gx(t){var e=_x(t.alternate,t,fn);t.memoizedProps=t.pendingProps,e===null?xx(t):At=e,bf.current=null}function xx(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=yy(n,e),n!==null){n.flags&=32767,At=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Rt=6,At=null;return}}else if(n=_y(n,e,fn),n!==null){At=n;return}if(e=e.sibling,e!==null){At=e;return}At=e=t}while(e!==null);Rt===0&&(Rt=5)}function xr(t,e,n){var i=et,r=bn.transition;try{bn.transition=null,et=1,Cy(t,e,n,i)}finally{bn.transition=r,et=i}return null}function Cy(t,e,n,i){do _s();while(Gi!==null);if($e&6)throw Error(ne(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ne(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(l_(t,s),t===It&&(At=It=null,kt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||mo||(mo=!0,yx(ol,function(){return _s(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=bn.transition,bn.transition=null;var a=et;et=1;var o=$e;$e|=4,bf.current=null,My(t,n),dx(n,t),q_(Tu),cl=!!wu,Tu=wu=null,t.current=n,Ey(n),J0(),$e=o,et=a,bn.transition=s}else t.current=n;if(mo&&(mo=!1,Gi=t,Tl=r),s=t.pendingLanes,s===0&&(Ki=null),n_(n.stateNode),rn(t,St()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(wl)throw wl=!1,t=Wu,Wu=null,t;return Tl&1&&t.tag!==0&&_s(),s=t.pendingLanes,s&1?t===Xu?_a++:(_a=0,Xu=t):_a=0,or(),null}function _s(){if(Gi!==null){var t=Zm(Tl),e=bn.transition,n=et;try{if(bn.transition=null,et=16>t?16:t,Gi===null)var i=!1;else{if(t=Gi,Gi=null,Tl=0,$e&6)throw Error(ne(331));var r=$e;for($e|=4,pe=t.current;pe!==null;){var s=pe,a=s.child;if(pe.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(pe=c;pe!==null;){var d=pe;switch(d.tag){case 0:case 11:case 15:xa(8,d,s)}var p=d.child;if(p!==null)p.return=d,pe=p;else for(;pe!==null;){d=pe;var h=d.sibling,m=d.return;if(lx(d),d===c){pe=null;break}if(h!==null){h.return=m,pe=h;break}pe=m}}}var x=s.alternate;if(x!==null){var _=x.child;if(_!==null){x.child=null;do{var g=_.sibling;_.sibling=null,_=g}while(_!==null)}}pe=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,pe=a;else e:for(;pe!==null;){if(s=pe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:xa(9,s,s.return)}var u=s.sibling;if(u!==null){u.return=s.return,pe=u;break e}pe=s.return}}var v=t.current;for(pe=v;pe!==null;){a=pe;var y=a.child;if(a.subtreeFlags&2064&&y!==null)y.return=a,pe=y;else e:for(a=v;pe!==null;){if(o=pe,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:zl(9,o)}}catch(N){_t(o,o.return,N)}if(o===a){pe=null;break e}var S=o.sibling;if(S!==null){S.return=o.return,pe=S;break e}pe=o.return}}if($e=r,or(),ei&&typeof ei.onPostCommitFiberRoot=="function")try{ei.onPostCommitFiberRoot(Pl,t)}catch{}i=!0}return i}finally{et=n,bn.transition=e}}return!1}function lp(t,e,n){e=Cs(n,e),e=Zg(t,e,1),t=Yi(t,e,1),e=$t(),t!==null&&(Ba(t,1,e),rn(t,e))}function _t(t,e,n){if(t.tag===3)lp(t,t,n);else for(;e!==null;){if(e.tag===3){lp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Ki===null||!Ki.has(i))){t=Cs(n,t),t=Qg(e,t,1),e=Yi(e,t,1),t=$t(),e!==null&&(Ba(e,1,t),rn(e,t));break}}e=e.return}}function Ry(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=$t(),t.pingedLanes|=t.suspendedLanes&n,It===t&&(kt&n)===n&&(Rt===4||Rt===3&&(kt&130023424)===kt&&500>St()-Rf?br(t,0):Cf|=n),rn(t,e)}function vx(t,e){e===0&&(t.mode&1?(e=ro,ro<<=1,!(ro&130023424)&&(ro=4194304)):e=1);var n=$t();t=wi(t,e),t!==null&&(Ba(t,e,n),rn(t,n))}function Ny(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),vx(t,n)}function Py(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ne(314))}i!==null&&i.delete(e),vx(t,n)}var _x;_x=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||tn.current)en=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return en=!1,vy(t,e,n);en=!!(t.flags&131072)}else en=!1,ht&&e.flags&1048576&&Eg(e,gl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;qo(t,e),t=e.pendingProps;var r=ws(e,Gt.current);vs(e,n),r=Mf(null,e,i,t,r,n);var s=Ef();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,nn(i)?(s=!0,pl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,xf(e),r.updater=Ol,e.stateNode=r,r._reactInternals=e,Iu(e,i,t,n),e=Fu(null,e,i,!0,s,n)):(e.tag=0,ht&&s&&uf(e),Xt(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(qo(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=Dy(i),t=Fn(i,t),r){case 0:e=ku(null,e,i,t,n);break e;case 1:e=Qh(null,e,i,t,n);break e;case 11:e=Kh(null,e,i,t,n);break e;case 14:e=Zh(null,e,i,Fn(i.type,t),n);break e}throw Error(ne(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Fn(i,r),ku(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Fn(i,r),Qh(t,e,i,r,n);case 3:e:{if(nx(e),t===null)throw Error(ne(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Rg(t,e),_l(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Cs(Error(ne(423)),e),e=Jh(t,e,i,n,r);break e}else if(i!==r){r=Cs(Error(ne(424)),e),e=Jh(t,e,i,n,r);break e}else for(hn=qi(e.stateNode.containerInfo.firstChild),pn=e,ht=!0,zn=null,n=bg(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ts(),i===r){e=Ti(t,e,n);break e}Xt(t,e,i,n)}e=e.child}return e;case 5:return Ng(e),t===null&&Pu(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,Au(i,r)?a=null:s!==null&&Au(i,s)&&(e.flags|=32),tx(t,e),Xt(t,e,a,n),e.child;case 6:return t===null&&Pu(e),null;case 13:return ix(t,e,n);case 4:return vf(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=As(e,null,i,n):Xt(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Fn(i,r),Kh(t,e,i,r,n);case 7:return Xt(t,e,e.pendingProps,n),e.child;case 8:return Xt(t,e,e.pendingProps.children,n),e.child;case 12:return Xt(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,at(xl,i._currentValue),i._currentValue=a,s!==null)if(Wn(s.value,a)){if(s.children===r.children&&!tn.current){e=Ti(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=yi(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?l.next=l:(l.next=d.next,d.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),Lu(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(ne(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),Lu(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}Xt(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,vs(e,n),r=Rn(r),i=i(r),e.flags|=1,Xt(t,e,i,n),e.child;case 14:return i=e.type,r=Fn(i,e.pendingProps),r=Fn(i.type,r),Zh(t,e,i,r,n);case 15:return Jg(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Fn(i,r),qo(t,e),e.tag=1,nn(i)?(t=!0,pl(e)):t=!1,vs(e,n),Kg(e,i,r),Iu(e,i,r,n),Fu(null,e,i,!0,t,n);case 19:return rx(t,e,n);case 22:return ex(t,e,n)}throw Error(ne(156,e.tag))};function yx(t,e){return $m(t,e)}function Ly(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Tn(t,e,n,i){return new Ly(t,e,n,i)}function Df(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Dy(t){if(typeof t=="function")return Df(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Zd)return 11;if(t===Qd)return 14}return 2}function Qi(t,e){var n=t.alternate;return n===null?(n=Tn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Zo(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")Df(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case ns:return Cr(n.children,r,s,e);case Kd:a=8,r|=8;break;case ru:return t=Tn(12,n,e,r|2),t.elementType=ru,t.lanes=s,t;case su:return t=Tn(13,n,e,r),t.elementType=su,t.lanes=s,t;case au:return t=Tn(19,n,e,r),t.elementType=au,t.lanes=s,t;case Nm:return Vl(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Cm:a=10;break e;case Rm:a=9;break e;case Zd:a=11;break e;case Qd:a=14;break e;case Oi:a=16,i=null;break e}throw Error(ne(130,t==null?t:typeof t,""))}return e=Tn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Cr(t,e,n,i){return t=Tn(7,t,i,e),t.lanes=n,t}function Vl(t,e,n,i){return t=Tn(22,t,i,e),t.elementType=Nm,t.lanes=n,t.stateNode={isHidden:!1},t}function Ec(t,e,n){return t=Tn(6,t,null,e),t.lanes=n,t}function wc(t,e,n){return e=Tn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function Iy(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=rc(0),this.expirationTimes=rc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=rc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function If(t,e,n,i,r,s,a,o,l){return t=new Iy(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Tn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},xf(s),t}function Uy(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ts,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function Sx(t){if(!t)return nr;t=t._reactInternals;e:{if(Fr(t)!==t||t.tag!==1)throw Error(ne(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(nn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ne(171))}if(t.tag===1){var n=t.type;if(nn(n))return Sg(t,n,e)}return e}function Mx(t,e,n,i,r,s,a,o,l){return t=If(n,i,!0,t,r,s,a,o,l),t.context=Sx(null),n=t.current,i=$t(),r=Zi(n),s=yi(i,r),s.callback=e??null,Yi(n,s,r),t.current.lanes=r,Ba(t,r,i),rn(t,i),t}function Hl(t,e,n,i){var r=e.current,s=$t(),a=Zi(r);return n=Sx(n),e.context===null?e.context=n:e.pendingContext=n,e=yi(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Yi(r,e,a),t!==null&&(jn(t,r,a,s),Wo(t,r,a)),a}function bl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function cp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Uf(t,e){cp(t,e),(t=t.alternate)&&cp(t,e)}function ky(){return null}var Ex=typeof reportError=="function"?reportError:function(t){console.error(t)};function kf(t){this._internalRoot=t}jl.prototype.render=kf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ne(409));Hl(t,e,null,null)};jl.prototype.unmount=kf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Dr(function(){Hl(null,t,null,null)}),e[Ei]=null}};function jl(t){this._internalRoot=t}jl.prototype.unstable_scheduleHydration=function(t){if(t){var e=eg();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Bi.length&&e!==0&&e<Bi[n].priority;n++);Bi.splice(n,0,t),n===0&&ng(t)}};function Ff(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Gl(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function up(){}function Fy(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=bl(a);s.call(c)}}var a=Mx(e,i,t,0,null,!1,!1,"",up);return t._reactRootContainer=a,t[Ei]=a.current,Ra(t.nodeType===8?t.parentNode:t),Dr(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=bl(l);o.call(c)}}var l=If(t,0,!1,null,null,!1,!1,"",up);return t._reactRootContainer=l,t[Ei]=l.current,Ra(t.nodeType===8?t.parentNode:t),Dr(function(){Hl(e,l,n,i)}),l}function Wl(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=bl(a);o.call(l)}}Hl(e,a,t,r)}else a=Fy(n,e,t,r,i);return bl(a)}Qm=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=aa(e.pendingLanes);n!==0&&(tf(e,n|1),rn(e,St()),!($e&6)&&(Rs=St()+500,or()))}break;case 13:Dr(function(){var i=wi(t,1);if(i!==null){var r=$t();jn(i,t,1,r)}}),Uf(t,1)}};nf=function(t){if(t.tag===13){var e=wi(t,134217728);if(e!==null){var n=$t();jn(e,t,134217728,n)}Uf(t,134217728)}};Jm=function(t){if(t.tag===13){var e=Zi(t),n=wi(t,e);if(n!==null){var i=$t();jn(n,t,e,i)}Uf(t,e)}};eg=function(){return et};tg=function(t,e){var n=et;try{return et=t,e()}finally{et=n}};gu=function(t,e,n){switch(e){case"input":if(cu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=Ul(i);if(!r)throw Error(ne(90));Lm(i),cu(i,r)}}}break;case"textarea":Im(t,n);break;case"select":e=n.value,e!=null&&ps(t,!!n.multiple,e,!1)}};Vm=Nf;Hm=Dr;var Oy={usingClientEntryPoint:!1,Events:[Ha,as,Ul,zm,Bm,Nf]},Qs={findFiberByHostInstance:Mr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},zy={bundleType:Qs.bundleType,version:Qs.version,rendererPackageName:Qs.rendererPackageName,rendererConfig:Qs.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ci.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Wm(t),t===null?null:t.stateNode},findFiberByHostInstance:Qs.findFiberByHostInstance||ky,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var go=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!go.isDisabled&&go.supportsFiber)try{Pl=go.inject(zy),ei=go}catch{}}gn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Oy;gn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ff(e))throw Error(ne(200));return Uy(t,e,null,n)};gn.createRoot=function(t,e){if(!Ff(t))throw Error(ne(299));var n=!1,i="",r=Ex;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=If(t,1,!1,null,null,n,!1,i,r),t[Ei]=e.current,Ra(t.nodeType===8?t.parentNode:t),new kf(e)};gn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ne(188)):(t=Object.keys(t).join(","),Error(ne(268,t)));return t=Wm(e),t=t===null?null:t.stateNode,t};gn.flushSync=function(t){return Dr(t)};gn.hydrate=function(t,e,n){if(!Gl(e))throw Error(ne(200));return Wl(null,t,e,!0,n)};gn.hydrateRoot=function(t,e,n){if(!Ff(t))throw Error(ne(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=Ex;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=Mx(e,null,t,1,n??null,r,!1,s,a),t[Ei]=e.current,Ra(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new jl(e)};gn.render=function(t,e,n){if(!Gl(e))throw Error(ne(200));return Wl(null,t,e,!1,n)};gn.unmountComponentAtNode=function(t){if(!Gl(t))throw Error(ne(40));return t._reactRootContainer?(Dr(function(){Wl(null,null,t,!1,function(){t._reactRootContainer=null,t[Ei]=null})}),!0):!1};gn.unstable_batchedUpdates=Nf;gn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Gl(n))throw Error(ne(200));if(t==null||t._reactInternals===void 0)throw Error(ne(38));return Wl(t,e,n,!1,i)};gn.version="18.3.1-next-f1338f8080-20240426";function wx(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(wx)}catch(t){console.error(t)}}wx(),wm.exports=gn;var By=wm.exports,dp=By;nu.createRoot=dp.createRoot,nu.hydrateRoot=dp.hydrateRoot;const Vy="";async function ut(t,e={}){const n=`${Vy}${t}`,i=await fetch(n,{headers:{"Content-Type":"application/json",...e.headers},...e});if(!i.ok){let r=`Request failed: ${i.statusText}`;try{const s=await i.json();r=s.detail||s.message||r}catch{}throw new Error(r)}return i.json()}const nt={async getMe(){return ut("/api/me")},async getHomeView(){return ut("/api/v1/home")},async getCommitments(t){const e=t?`?status=${encodeURIComponent(t)}`:"";return ut(`/api/v1/commitments${e}`)},async createCommitment(t){return ut("/api/v1/commitments",{method:"POST",body:JSON.stringify(t)})},async getTasks(t){const e=t?`?status=${encodeURIComponent(t)}`:"";return ut(`/api/v1/tasks${e}`)},async createTask(t,e={}){return ut("/api/v1/tasks",{method:"POST",body:JSON.stringify({title:t,...e})})},async completeTask(t,e){return ut(`/api/v1/tasks/${t}/complete`,{method:"POST",body:JSON.stringify({receipt:e||{}})})},async getPlan(t){const e=t?`?plan_date=${encodeURIComponent(t)}`:"";return ut(`/api/v1/plan${e}`)},async generatePlan(t){const e=t?`?plan_date=${encodeURIComponent(t)}`:"";return ut(`/api/v1/plan/generate${e}`,{method:"POST"})},async getV1Approvals(){return ut("/api/v1/approvals")},async approveV1(t,e){return ut(`/api/v1/approvals/${t}/approve`,{method:"POST",body:JSON.stringify({arguments:e})})},async rejectV1(t,e=""){return ut(`/api/v1/approvals/${t}/reject`,{method:"POST",body:JSON.stringify({reason:e})})},async getPendingActions(){return ut("/api/actions/pending")},async approveAction(t){return ut(`/api/actions/${t}/approve`,{method:"POST"})},async rejectAction(t){return ut(`/api/actions/${t}/reject`,{method:"POST"})},async getAgents(){return ut("/api/v1/agents")},async dispatchAgent(t,e,n={}){return ut("/api/v1/agents/dispatch",{method:"POST",body:JSON.stringify({agent_type:t,instruction:e,parameters:n})})},async getActivity(t=50){return ut(`/api/v1/activity?limit=${t}`)},async getConnectors(){return ut("/api/connectors")},async testConnector(t){return ut(`/api/connectors/${t}/test`,{method:"POST"})},async getMemory(){return ut("/api/memory")},async forgetMemory(t){return ut(`/api/memory/${encodeURIComponent(t)}`,{method:"DELETE"})},async getWatchers(){return ut("/api/watchers")},async markWatcherSeen(t){return ut(`/api/watchers/${t}/seen`,{method:"POST"})},async getAnalytics(){return ut("/api/analytics")}},Tx=ee.createContext(void 0),Hy=({children:t})=>{const[e,n]=ee.useState("home"),[i,r]=ee.useState("dark"),[s,a]=ee.useState(null),[o,l]=ee.useState("IDLE"),[c,d]=ee.useState(0),[p,h]=ee.useState(0),[m,x]=ee.useState([]),[_,g]=ee.useState(!1);ee.useEffect(()=>{const A=localStorage.getItem("os-theme")||"dark";r(A),document.documentElement.setAttribute("data-theme",A)},[]);const u=ee.useCallback(b=>{r(b),localStorage.setItem("os-theme",b),document.documentElement.setAttribute("data-theme",b)},[]),v=ee.useCallback(()=>{u(i==="dark"?"light":"dark")},[i,u]),y=ee.useCallback(b=>{const A=Math.random().toString(36).substring(2,9),R={...b,id:A,timestamp:Date.now()};x(w=>[R,...w.slice(0,4)]),setTimeout(()=>{S(A)},5e3)},[]),S=ee.useCallback(b=>{x(A=>A.filter(R=>R.id!==b))},[]),N=ee.useCallback(async()=>{var b,A,R,w;try{const[M,P,H,F]=await Promise.allSettled([nt.getMe(),nt.getV1Approvals(),nt.getPendingActions(),nt.getAgents()]);M.status==="fulfilled"&&a(M.value);let G=0;if(P.status==="fulfilled"&&(G+=((b=P.value.pending_approvals)==null?void 0:b.length)||0),H.status==="fulfilled"&&(G+=((A=H.value.pending)==null?void 0:A.length)||0),d(G),F.status==="fulfilled"){const Y=((w=(R=F.value.agent_runs)==null?void 0:R.filter(W=>W.status==="running"))==null?void 0:w.length)||0;h(Y),Y>0&&o==="IDLE"&&l("WORKING")}}catch(M){console.error("Failed to refresh app status:",M)}},[o]);return ee.useEffect(()=>{N();const b=setInterval(N,1e4);return()=>clearInterval(b)},[N]),ee.useEffect(()=>{const b=A=>{(A.ctrlKey||A.metaKey)&&A.key==="k"&&(A.preventDefault(),g(R=>!R))};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[]),f.jsx(Tx.Provider,{value:{currentView:e,setCurrentView:n,theme:i,setTheme:u,toggleTheme:v,me:s,orbState:o,setOrbState:l,pendingApprovalsCount:c,activeAgentsCount:p,refreshData:N,notifications:m,addNotification:y,removeNotification:S,isCommandPaletteOpen:_,setIsCommandPaletteOpen:g},children:t})},ln=()=>{const t=ee.useContext(Tx);if(!t)throw new Error("useApp must be used within an AppProvider");return t},Ax=ee.createContext(void 0),jy=({children:t})=>{const{setOrbState:e}=ln(),[n,i]=ee.useState(!1),[r,s]=ee.useState(!1),a=ee.useRef(null),o=ee.useCallback(()=>{if(i(!0),e("LISTENING"),"webkitSpeechRecognition"in window||"SpeechRecognition"in window){const p=window.SpeechRecognition||window.webkitSpeechRecognition;try{const h=new p;h.continuous=!0,h.interimResults=!0,h.onstart=()=>{e("LISTENING")},h.onresult=()=>{e("THINKING")},h.onerror=()=>{e("IDLE")},h.onend=()=>{n&&e("IDLE")},a.current=h,h.start()}catch(h){console.warn("SpeechRecognition error:",h)}}},[n,e]),l=ee.useCallback(()=>{if(i(!1),e("IDLE"),a.current)try{a.current.stop()}catch{}},[e]),c=ee.useCallback(()=>{n?l():o()},[n,o,l]),d=ee.useCallback(()=>{s(p=>!p)},[]);return f.jsx(Ax.Provider,{value:{isVoiceActive:n,toggleVoice:c,startListening:o,stopListening:l,isMuted:r,toggleMute:d},children:t})},bx=()=>{const t=ee.useContext(Ax);if(!t)throw new Error("useVoice must be used within a VoiceProvider");return t};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gy=t=>t==null?void 0:t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function Wy(t,e,n=[]){if(e==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:Gy(t),size:24,node:e,...n.length>0?{aliases:n}:{}}}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xy=t=>{let e="",n=!1;for(const i of t){if(i==="-"||i==="_"||i<=" "){n=e.length>0;continue}e.length===0?e+=i.toLowerCase():e+=n?i.toUpperCase():i,n=!1}return e};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $y=t=>{const e=Xy(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yu=(...t)=>t.filter((e,n,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function Tc(t){return t!=null}function qy(t,e={}){var h,m;const n=e.attributeNames??{},i=x=>n[x]??x,r=t.size??t.width??cr.width,s=t.size??t.height??cr.height,a=((h=t.aliases)==null?void 0:h.filter(x=>typeof x=="string"&&x.trim()!=="").map(x=>`lucide-${x}`))??[],o=[...t.name?[`lucide-${t.name}`]:[],...a],l=((m=e.className)==null?void 0:m.split(" ").filter(Boolean))??[],c=e.includeDefaultClasses===!1?Yu(...l):Yu("lucide",...o,...l),d=e.absoluteStrokeWidth?Number(e.strokeWidth??cr["stroke-width"])*Number(t.size??t.width??cr.width)/Number(e.size??e.width??cr.width):e.strokeWidth??cr["stroke-width"];return["svg",{...Object.entries(cr).reduce((x,[_,g])=>(x[i(_)]=g,x),{}),..."color"in e&&e.color&&{[i("stroke")]:e.color},..."size"in e&&Tc(e.size)&&{[i("width")]:e.size,[i("height")]:e.size},..."width"in e&&Tc(e.width)&&{[i("width")]:e.width},..."height"in e&&Tc(e.height)&&{[i("height")]:e.height},[i("stroke-width")]:d,...c&&{[i("class")]:c},[i("viewBox")]:`0 0 ${r} ${s}`,...e.hasA11yProp===!1?{[i("aria-hidden")]:"true"}:{},..."attributes"in e&&e.attributes},t.node.map(x=>{const[_,g,u]=x,v=e.nonScalingStroke?{[i("vector-effect")]:"non-scaling-stroke",...g}:g;return u?[_,v,u]:[_,v]})]}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function Yy(t,e={}){return qy(t,{...e,attributeNames:{...e.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ky=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},Zy=ee.createContext({}),Qy=()=>ee.useContext(Zy),Jy=ee.forwardRef(({color:t,size:e,width:n,height:i,strokeWidth:r,absoluteStrokeWidth:s,nonScalingStroke:a,className:o="",children:l,iconNode:c=[],icon:d={node:c,aliases:[],size:24},...p},h)=>{const{size:m=24,strokeWidth:x=2,absoluteStrokeWidth:_=!1,nonScalingStroke:g=!1,color:u="currentColor",className:v=""}=Qy()??{},y=!!l||Ky(p),[S,N,b=[]]=Yy(d,{color:t??u,width:n??e??m,height:i??e??m,strokeWidth:r??x,absoluteStrokeWidth:s??_,nonScalingStroke:a??g,className:Yu(v,o),hasA11yProp:y,attributes:p});return ee.createElement(S,{ref:h,...N},[...b.map(([A,R])=>ee.createElement(A,R)),...Array.isArray(l)?l:[l]])});/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function Fe(t,e=[],n=[]){const i=typeof t=="string"?Wy(t,e,n):t,r=ee.forwardRef(({className:s,...a},o)=>ee.createElement(Jy,{ref:o,icon:i,className:s,...a}));return i.name&&(r.displayName=$y(i.name)),r}/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cx={name:"arrow-right",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]};Cx.node;const Rx=Fe(Cx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nx={name:"bot",size:24,node:[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]]};Nx.node;const Px=Fe(Nx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lx={name:"brain",size:24,node:[["path",{d:"M12 18V5",key:"adv99a"}],["path",{d:"M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",key:"1e3is1"}],["path",{d:"M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",key:"1gqd8o"}],["path",{d:"M17.997 5.125a4 4 0 0 1 2.526 5.77",key:"iwvgf7"}],["path",{d:"M18 18a4 4 0 0 0 2-7.464",key:"efp6ie"}],["path",{d:"M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",key:"1gq6am"}],["path",{d:"M6 18a4 4 0 0 1-2-7.464",key:"k1g0md"}],["path",{d:"M6.003 5.125a4 4 0 0 0-2.526 5.77",key:"q97ue3"}]]};Lx.node;const Dx=Fe(Lx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ix={name:"calendar",size:24,node:[["path",{d:"M8 2v3",key:"1ioesn"}],["path",{d:"M16 2v3",key:"otl347"}],["rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",key:"h1oib"}],["path",{d:"M3 9h18",key:"1pudct"}]]};Ix.node;const Or=Fe(Ix);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ux={name:"chevron-down",size:24,node:[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]};Ux.node;const kx=Fe(Ux);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fx={name:"chevron-right",size:24,node:[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]};Fx.node;const ya=Fe(Fx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ox={name:"circle-check",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 9-5.5 5.5L8 12",key:"xofnsj"}]],aliases:["check-circle-2"]};Ox.node;const An=Fe(Ox);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zx={name:"circle-x",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],aliases:["x-circle"]};zx.node;const Ku=Fe(zx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bx={name:"clock",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]]};Bx.node;const Ga=Fe(Bx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vx={name:"code",size:24,node:[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]]};Vx.node;const Hx=Fe(Vx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jx={name:"cpu",size:24,node:[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]]};jx.node;const Gx=Fe(jx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wx={name:"database",size:24,node:[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]};Wx.node;const eS=Fe(Wx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xx={name:"external-link",size:24,node:[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]};Xx.node;const tS=Fe(Xx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $x={name:"globe",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]};$x.node;const Zu=Fe($x);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qx={name:"house",size:24,node:[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],aliases:["home"]};qx.node;const nS=Fe(qx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yx={name:"info",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]};Yx.node;const iS=Fe(Yx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kx={name:"layers",size:24,node:[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],aliases:["layers-3"]};Kx.node;const rS=Fe(Kx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zx={name:"link-2",size:24,node:[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]};Zx.node;const Qx=Fe(Zx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jx={name:"lock",size:24,node:[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]};Jx.node;const ev=Fe(Jx);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tv={name:"mail",size:24,node:[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]};tv.node;const sS=Fe(tv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nv={name:"mic-off",size:24,node:[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M15 9.34V5a3 3 0 0 0-5.68-1.33",key:"1gzdoj"}],["path",{d:"M16.95 16.95A7 7 0 0 1 5 12v-2",key:"cqa7eg"}],["path",{d:"M18.89 13.23A7 7 0 0 0 19 12v-2",key:"16hl24"}],["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M9 9v3a3 3 0 0 0 5.12 2.12",key:"r2i35w"}]]};nv.node;const iv=Fe(nv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rv={name:"mic",size:24,node:[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]]};rv.node;const sv=Fe(rv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const av={name:"moon",size:24,node:[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]]};av.node;const aS=Fe(av);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ov={name:"pause",size:24,node:[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]]};ov.node;const oS=Fe(ov);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lv={name:"play",size:24,node:[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]};lv.node;const cv=Fe(lv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uv={name:"plus",size:24,node:[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]};uv.node;const dv=Fe(uv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fv={name:"refresh-cw",size:24,node:[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]};fv.node;const ii=Fe(fv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hv={name:"search",size:24,node:[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]};hv.node;const zs=Fe(hv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pv={name:"send",size:24,node:[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]};pv.node;const mv=Fe(pv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gv={name:"shield-alert",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]};gv.node;const Xl=Fe(gv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xv={name:"shield-check",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]};xv.node;const vv=Fe(xv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _v={name:"sparkles",size:24,node:[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],aliases:["stars"]};_v.node;const Zn=Fe(_v);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yv={name:"square-check-big",size:24,node:[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],aliases:["check-square"]};yv.node;const Sv=Fe(yv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mv={name:"square",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]};Mv.node;const lS=Fe(Mv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ev={name:"sun",size:24,node:[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]};Ev.node;const cS=Fe(Ev);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wv={name:"terminal",size:24,node:[["path",{d:"M12 19h8",key:"baeox8"}],["path",{d:"m4 17 6-6-6-6",key:"1yngyt"}]]};wv.node;const uS=Fe(wv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tv={name:"trash",size:24,node:[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],aliases:["trash-2"]};Tv.node;const dS=Fe(Tv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Av={name:"triangle-alert",size:24,node:[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],aliases:["alert-triangle"]};Av.node;const Qu=Fe(Av);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bv={name:"x",size:24,node:[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]};bv.node;const Of=Fe(bv);/**
 * @license lucide-react v1.51.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cv={name:"zap",size:24,node:[["path",{d:"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",key:"1v7up4"}]]};Cv.node;const fS=Fe(Cv);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const zf="170",hS=0,fp=1,pS=2,Rv=1,mS=2,fi=3,ir=0,sn=1,mi=2,Ji=0,ys=1,Ju=2,hp=3,pp=4,gS=5,yr=100,xS=101,vS=102,_S=103,yS=104,SS=200,MS=201,ES=202,wS=203,ed=204,td=205,TS=206,AS=207,bS=208,CS=209,RS=210,NS=211,PS=212,LS=213,DS=214,nd=0,id=1,rd=2,Ns=3,sd=4,ad=5,od=6,ld=7,Nv=0,IS=1,US=2,er=0,kS=1,FS=2,OS=3,zS=4,BS=5,VS=6,HS=7,Pv=300,Ps=301,Ls=302,cd=303,ud=304,$l=306,dd=1e3,Tr=1001,fd=1002,Gn=1003,jS=1004,xo=1005,Qn=1006,Ac=1007,Ar=1008,Ai=1009,Lv=1010,Dv=1011,Oa=1012,Bf=1013,Ir=1014,vi=1015,Wa=1016,Vf=1017,Hf=1018,Ds=1020,Iv=35902,Uv=1021,kv=1022,Vn=1023,Fv=1024,Ov=1025,Ss=1026,Is=1027,zv=1028,jf=1029,Bv=1030,Gf=1031,Wf=1033,Qo=33776,Jo=33777,el=33778,tl=33779,hd=35840,pd=35841,md=35842,gd=35843,xd=36196,vd=37492,_d=37496,yd=37808,Sd=37809,Md=37810,Ed=37811,wd=37812,Td=37813,Ad=37814,bd=37815,Cd=37816,Rd=37817,Nd=37818,Pd=37819,Ld=37820,Dd=37821,nl=36492,Id=36494,Ud=36495,Vv=36283,kd=36284,Fd=36285,Od=36286,GS=3200,WS=3201,XS=0,$S=1,Hi="",Sn="srgb",Bs="srgb-linear",ql="linear",tt="srgb",Vr=7680,mp=519,qS=512,YS=513,KS=514,Hv=515,ZS=516,QS=517,JS=518,eM=519,gp=35044,xp="300 es",_i=2e3,Cl=2001;class Vs{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],bc=Math.PI/180,zd=180/Math.PI;function Xa(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Vt[t&255]+Vt[t>>8&255]+Vt[t>>16&255]+Vt[t>>24&255]+"-"+Vt[e&255]+Vt[e>>8&255]+"-"+Vt[e>>16&15|64]+Vt[e>>24&255]+"-"+Vt[n&63|128]+Vt[n>>8&255]+"-"+Vt[n>>16&255]+Vt[n>>24&255]+Vt[i&255]+Vt[i>>8&255]+Vt[i>>16&255]+Vt[i>>24&255]).toLowerCase()}function Jt(t,e,n){return Math.max(e,Math.min(n,t))}function tM(t,e){return(t%e+e)%e}function Cc(t,e,n){return(1-n)*t+n*e}function Js(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function Zt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}class it{constructor(e=0,n=0){it.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Jt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ie{constructor(e,n,i,r,s,a,o,l,c){Ie.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c)}set(e,n,i,r,s,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=o,d[3]=n,d[4]=s,d[5]=l,d[6]=i,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],d=i[4],p=i[7],h=i[2],m=i[5],x=i[8],_=r[0],g=r[3],u=r[6],v=r[1],y=r[4],S=r[7],N=r[2],b=r[5],A=r[8];return s[0]=a*_+o*v+l*N,s[3]=a*g+o*y+l*b,s[6]=a*u+o*S+l*A,s[1]=c*_+d*v+p*N,s[4]=c*g+d*y+p*b,s[7]=c*u+d*S+p*A,s[2]=h*_+m*v+x*N,s[5]=h*g+m*y+x*b,s[8]=h*u+m*S+x*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return n*a*d-n*o*c-i*s*d+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],p=d*a-o*c,h=o*l-d*s,m=c*s-a*l,x=n*p+i*h+r*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=p*_,e[1]=(r*c-d*i)*_,e[2]=(o*i-r*a)*_,e[3]=h*_,e[4]=(d*n-r*l)*_,e[5]=(r*s-o*n)*_,e[6]=m*_,e[7]=(i*l-c*n)*_,e[8]=(a*n-i*s)*_,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(Rc.makeScale(e,n)),this}rotate(e){return this.premultiply(Rc.makeRotation(-e)),this}translate(e,n){return this.premultiply(Rc.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Rc=new Ie;function jv(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Rl(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function nM(){const t=Rl("canvas");return t.style.display="block",t}const vp={};function la(t){t in vp||(vp[t]=!0,console.warn(t))}function iM(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function rM(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function sM(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Xe={enabled:!0,workingColorSpace:Bs,spaces:{},convert:function(t,e,n){return this.enabled===!1||e===n||!e||!n||(this.spaces[e].transfer===tt&&(t.r=Si(t.r),t.g=Si(t.g),t.b=Si(t.b)),this.spaces[e].primaries!==this.spaces[n].primaries&&(t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===tt&&(t.r=Ms(t.r),t.g=Ms(t.g),t.b=Ms(t.b))),t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===Hi?ql:this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function Si(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Ms(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const _p=[.64,.33,.3,.6,.15,.06],yp=[.2126,.7152,.0722],Sp=[.3127,.329],Mp=new Ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ep=new Ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Xe.define({[Bs]:{primaries:_p,whitePoint:Sp,transfer:ql,toXYZ:Mp,fromXYZ:Ep,luminanceCoefficients:yp,workingColorSpaceConfig:{unpackColorSpace:Sn},outputColorSpaceConfig:{drawingBufferColorSpace:Sn}},[Sn]:{primaries:_p,whitePoint:Sp,transfer:tt,toXYZ:Mp,fromXYZ:Ep,luminanceCoefficients:yp,outputColorSpaceConfig:{drawingBufferColorSpace:Sn}}});let Hr;class aM{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Hr===void 0&&(Hr=Rl("canvas")),Hr.width=e.width,Hr.height=e.height;const i=Hr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Hr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Rl("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Si(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Si(n[i]/255)*255):n[i]=Si(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let oM=0;class Gv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:oM++}),this.uuid=Xa(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Nc(r[a].image)):s.push(Nc(r[a]))}else s=Nc(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Nc(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?aM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let lM=0;class an extends Vs{constructor(e=an.DEFAULT_IMAGE,n=an.DEFAULT_MAPPING,i=Tr,r=Tr,s=Qn,a=Ar,o=Vn,l=Ai,c=an.DEFAULT_ANISOTROPY,d=Hi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lM++}),this.uuid=Xa(),this.name="",this.source=new Gv(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Pv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case dd:e.x=e.x-Math.floor(e.x);break;case Tr:e.x=e.x<0?0:1;break;case fd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case dd:e.y=e.y-Math.floor(e.y);break;case Tr:e.y=e.y<0?0:1;break;case fd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}an.DEFAULT_IMAGE=null;an.DEFAULT_MAPPING=Pv;an.DEFAULT_ANISOTROPY=1;class Mt{constructor(e=0,n=0,i=0,r=1){Mt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],d=l[4],p=l[8],h=l[1],m=l[5],x=l[9],_=l[2],g=l[6],u=l[10];if(Math.abs(d-h)<.01&&Math.abs(p-_)<.01&&Math.abs(x-g)<.01){if(Math.abs(d+h)<.1&&Math.abs(p+_)<.1&&Math.abs(x+g)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const y=(c+1)/2,S=(m+1)/2,N=(u+1)/2,b=(d+h)/4,A=(p+_)/4,R=(x+g)/4;return y>S&&y>N?y<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(y),r=b/i,s=A/i):S>N?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=b/r,s=R/r):N<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(N),i=A/s,r=R/s),this.set(i,r,s,n),this}let v=Math.sqrt((g-x)*(g-x)+(p-_)*(p-_)+(h-d)*(h-d));return Math.abs(v)<.001&&(v=1),this.x=(g-x)/v,this.y=(p-_)/v,this.z=(h-d)/v,this.w=Math.acos((c+m+u-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class cM extends Vs{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new Mt(0,0,e,n),this.scissorTest=!1,this.viewport=new Mt(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new an(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Gv(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ur extends cM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class Wv extends an{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=Tr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class uM extends an{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=Tr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $a{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],d=i[r+2],p=i[r+3];const h=s[a+0],m=s[a+1],x=s[a+2],_=s[a+3];if(o===0){e[n+0]=l,e[n+1]=c,e[n+2]=d,e[n+3]=p;return}if(o===1){e[n+0]=h,e[n+1]=m,e[n+2]=x,e[n+3]=_;return}if(p!==_||l!==h||c!==m||d!==x){let g=1-o;const u=l*h+c*m+d*x+p*_,v=u>=0?1:-1,y=1-u*u;if(y>Number.EPSILON){const N=Math.sqrt(y),b=Math.atan2(N,u*v);g=Math.sin(g*b)/N,o=Math.sin(o*b)/N}const S=o*v;if(l=l*g+h*S,c=c*g+m*S,d=d*g+x*S,p=p*g+_*S,g===1-o){const N=1/Math.sqrt(l*l+c*c+d*d+p*p);l*=N,c*=N,d*=N,p*=N}}e[n]=l,e[n+1]=c,e[n+2]=d,e[n+3]=p}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],d=i[r+3],p=s[a],h=s[a+1],m=s[a+2],x=s[a+3];return e[n]=o*x+d*p+l*m-c*h,e[n+1]=l*x+d*h+c*p-o*m,e[n+2]=c*x+d*m+o*h-l*p,e[n+3]=d*x-o*p-l*h-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(r/2),p=o(s/2),h=l(i/2),m=l(r/2),x=l(s/2);switch(a){case"XYZ":this._x=h*d*p+c*m*x,this._y=c*m*p-h*d*x,this._z=c*d*x+h*m*p,this._w=c*d*p-h*m*x;break;case"YXZ":this._x=h*d*p+c*m*x,this._y=c*m*p-h*d*x,this._z=c*d*x-h*m*p,this._w=c*d*p+h*m*x;break;case"ZXY":this._x=h*d*p-c*m*x,this._y=c*m*p+h*d*x,this._z=c*d*x+h*m*p,this._w=c*d*p-h*m*x;break;case"ZYX":this._x=h*d*p-c*m*x,this._y=c*m*p+h*d*x,this._z=c*d*x-h*m*p,this._w=c*d*p+h*m*x;break;case"YZX":this._x=h*d*p+c*m*x,this._y=c*m*p+h*d*x,this._z=c*d*x-h*m*p,this._w=c*d*p-h*m*x;break;case"XZY":this._x=h*d*p-c*m*x,this._y=c*m*p-h*d*x,this._z=c*d*x+h*m*p,this._w=c*d*p+h*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],d=n[6],p=n[10],h=i+o+p;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-l)*m,this._y=(s-c)*m,this._z=(a-r)*m}else if(i>o&&i>p){const m=2*Math.sqrt(1+i-o-p);this._w=(d-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+c)/m}else if(o>p){const m=2*Math.sqrt(1+o-i-p);this._w=(s-c)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+d)/m}else{const m=2*Math.sqrt(1+p-i-o);this._w=(a-r)/m,this._x=(s+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Jt(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,c=n._z,d=n._w;return this._x=i*d+a*o+r*c-s*l,this._y=r*d+a*l+s*o-i*c,this._z=s*d+a*c+i*l-r*o,this._w=a*d-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-n;return this._w=m*a+n*this._w,this._x=m*i+n*this._x,this._y=m*r+n*this._y,this._z=m*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),p=Math.sin((1-n)*d)/c,h=Math.sin(n*d)/c;return this._w=a*p+this._w*h,this._x=i*p+this._x*h,this._y=r*p+this._y*h,this._z=s*p+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class V{constructor(e=0,n=0,i=0){V.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(wp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(wp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),d=2*(o*n-s*r),p=2*(s*i-a*n);return this.x=n+l*c+a*p-o*d,this.y=i+l*d+o*c-s*p,this.z=r+l*p+s*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Pc.copy(this).projectOnVector(e),this.sub(Pc)}reflect(e){return this.sub(Pc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Jt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Pc=new V,wp=new $a;class qa{constructor(e=new V(1/0,1/0,1/0),n=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(In.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(In.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=In.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,In):In.fromBufferAttribute(s,a),In.applyMatrix4(e.matrixWorld),this.expandByPoint(In);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),vo.copy(i.boundingBox)),vo.applyMatrix4(e.matrixWorld),this.union(vo)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,In),In.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ea),_o.subVectors(this.max,ea),jr.subVectors(e.a,ea),Gr.subVectors(e.b,ea),Wr.subVectors(e.c,ea),Li.subVectors(Gr,jr),Di.subVectors(Wr,Gr),ur.subVectors(jr,Wr);let n=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-ur.z,ur.y,Li.z,0,-Li.x,Di.z,0,-Di.x,ur.z,0,-ur.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-ur.y,ur.x,0];return!Lc(n,jr,Gr,Wr,_o)||(n=[1,0,0,0,1,0,0,0,1],!Lc(n,jr,Gr,Wr,_o))?!1:(yo.crossVectors(Li,Di),n=[yo.x,yo.y,yo.z],Lc(n,jr,Gr,Wr,_o))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,In).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(In).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const oi=[new V,new V,new V,new V,new V,new V,new V,new V],In=new V,vo=new qa,jr=new V,Gr=new V,Wr=new V,Li=new V,Di=new V,ur=new V,ea=new V,_o=new V,yo=new V,dr=new V;function Lc(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){dr.fromArray(t,s);const o=r.x*Math.abs(dr.x)+r.y*Math.abs(dr.y)+r.z*Math.abs(dr.z),l=e.dot(dr),c=n.dot(dr),d=i.dot(dr);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const dM=new qa,ta=new V,Dc=new V;class Yl{constructor(e=new V,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):dM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ta.subVectors(e,this.center);const n=ta.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ta,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Dc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ta.copy(e.center).add(Dc)),this.expandByPoint(ta.copy(e.center).sub(Dc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const li=new V,Ic=new V,So=new V,Ii=new V,Uc=new V,Mo=new V,kc=new V;class Xv{constructor(e=new V,n=new V(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,li)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=li.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(li.copy(this.origin).addScaledVector(this.direction,n),li.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Ic.copy(e).add(n).multiplyScalar(.5),So.copy(n).sub(e).normalize(),Ii.copy(this.origin).sub(Ic);const s=e.distanceTo(n)*.5,a=-this.direction.dot(So),o=Ii.dot(this.direction),l=-Ii.dot(So),c=Ii.lengthSq(),d=Math.abs(1-a*a);let p,h,m,x;if(d>0)if(p=a*l-o,h=a*o-l,x=s*d,p>=0)if(h>=-x)if(h<=x){const _=1/d;p*=_,h*=_,m=p*(p+a*h+2*o)+h*(a*p+h+2*l)+c}else h=s,p=Math.max(0,-(a*h+o)),m=-p*p+h*(h+2*l)+c;else h=-s,p=Math.max(0,-(a*h+o)),m=-p*p+h*(h+2*l)+c;else h<=-x?(p=Math.max(0,-(-a*s+o)),h=p>0?-s:Math.min(Math.max(-s,-l),s),m=-p*p+h*(h+2*l)+c):h<=x?(p=0,h=Math.min(Math.max(-s,-l),s),m=h*(h+2*l)+c):(p=Math.max(0,-(a*s+o)),h=p>0?s:Math.min(Math.max(-s,-l),s),m=-p*p+h*(h+2*l)+c);else h=a>0?-s:s,p=Math.max(0,-(a*h+o)),m=-p*p+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,p),r&&r.copy(Ic).addScaledVector(So,h),m}intersectSphere(e,n){li.subVectors(e.center,this.origin);const i=li.dot(this.direction),r=li.dot(li)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,p=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),d>=0?(s=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(s=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),p>=0?(o=(e.min.z-h.z)*p,l=(e.max.z-h.z)*p):(o=(e.max.z-h.z)*p,l=(e.min.z-h.z)*p),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,li)!==null}intersectTriangle(e,n,i,r,s){Uc.subVectors(n,e),Mo.subVectors(i,e),kc.crossVectors(Uc,Mo);let a=this.direction.dot(kc),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ii.subVectors(this.origin,e);const l=o*this.direction.dot(Mo.crossVectors(Ii,Mo));if(l<0)return null;const c=o*this.direction.dot(Uc.cross(Ii));if(c<0||l+c>a)return null;const d=-o*Ii.dot(kc);return d<0?null:this.at(d/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Et{constructor(e,n,i,r,s,a,o,l,c,d,p,h,m,x,_,g){Et.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c,d,p,h,m,x,_,g)}set(e,n,i,r,s,a,o,l,c,d,p,h,m,x,_,g){const u=this.elements;return u[0]=e,u[4]=n,u[8]=i,u[12]=r,u[1]=s,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=d,u[10]=p,u[14]=h,u[3]=m,u[7]=x,u[11]=_,u[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Et().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/Xr.setFromMatrixColumn(e,0).length(),s=1/Xr.setFromMatrixColumn(e,1).length(),a=1/Xr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){const h=a*d,m=a*p,x=o*d,_=o*p;n[0]=l*d,n[4]=-l*p,n[8]=c,n[1]=m+x*c,n[5]=h-_*c,n[9]=-o*l,n[2]=_-h*c,n[6]=x+m*c,n[10]=a*l}else if(e.order==="YXZ"){const h=l*d,m=l*p,x=c*d,_=c*p;n[0]=h+_*o,n[4]=x*o-m,n[8]=a*c,n[1]=a*p,n[5]=a*d,n[9]=-o,n[2]=m*o-x,n[6]=_+h*o,n[10]=a*l}else if(e.order==="ZXY"){const h=l*d,m=l*p,x=c*d,_=c*p;n[0]=h-_*o,n[4]=-a*p,n[8]=x+m*o,n[1]=m+x*o,n[5]=a*d,n[9]=_-h*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const h=a*d,m=a*p,x=o*d,_=o*p;n[0]=l*d,n[4]=x*c-m,n[8]=h*c+_,n[1]=l*p,n[5]=_*c+h,n[9]=m*c-x,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const h=a*l,m=a*c,x=o*l,_=o*c;n[0]=l*d,n[4]=_-h*p,n[8]=x*p+m,n[1]=p,n[5]=a*d,n[9]=-o*d,n[2]=-c*d,n[6]=m*p+x,n[10]=h-_*p}else if(e.order==="XZY"){const h=a*l,m=a*c,x=o*l,_=o*c;n[0]=l*d,n[4]=-p,n[8]=c*d,n[1]=h*p+_,n[5]=a*d,n[9]=m*p-x,n[2]=x*p-m,n[6]=o*d,n[10]=_*p+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(fM,e,hM)}lookAt(e,n,i){const r=this.elements;return un.subVectors(e,n),un.lengthSq()===0&&(un.z=1),un.normalize(),Ui.crossVectors(i,un),Ui.lengthSq()===0&&(Math.abs(i.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),Ui.crossVectors(i,un)),Ui.normalize(),Eo.crossVectors(un,Ui),r[0]=Ui.x,r[4]=Eo.x,r[8]=un.x,r[1]=Ui.y,r[5]=Eo.y,r[9]=un.y,r[2]=Ui.z,r[6]=Eo.z,r[10]=un.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],d=i[1],p=i[5],h=i[9],m=i[13],x=i[2],_=i[6],g=i[10],u=i[14],v=i[3],y=i[7],S=i[11],N=i[15],b=r[0],A=r[4],R=r[8],w=r[12],M=r[1],P=r[5],H=r[9],F=r[13],G=r[2],Y=r[6],W=r[10],Q=r[14],L=r[3],$=r[7],J=r[11],oe=r[15];return s[0]=a*b+o*M+l*G+c*L,s[4]=a*A+o*P+l*Y+c*$,s[8]=a*R+o*H+l*W+c*J,s[12]=a*w+o*F+l*Q+c*oe,s[1]=d*b+p*M+h*G+m*L,s[5]=d*A+p*P+h*Y+m*$,s[9]=d*R+p*H+h*W+m*J,s[13]=d*w+p*F+h*Q+m*oe,s[2]=x*b+_*M+g*G+u*L,s[6]=x*A+_*P+g*Y+u*$,s[10]=x*R+_*H+g*W+u*J,s[14]=x*w+_*F+g*Q+u*oe,s[3]=v*b+y*M+S*G+N*L,s[7]=v*A+y*P+S*Y+N*$,s[11]=v*R+y*H+S*W+N*J,s[15]=v*w+y*F+S*Q+N*oe,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],p=e[6],h=e[10],m=e[14],x=e[3],_=e[7],g=e[11],u=e[15];return x*(+s*l*p-r*c*p-s*o*h+i*c*h+r*o*m-i*l*m)+_*(+n*l*m-n*c*h+s*a*h-r*a*m+r*c*d-s*l*d)+g*(+n*c*p-n*o*m-s*a*p+i*a*m+s*o*d-i*c*d)+u*(-r*o*d-n*l*p+n*o*h+r*a*p-i*a*h+i*l*d)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],p=e[9],h=e[10],m=e[11],x=e[12],_=e[13],g=e[14],u=e[15],v=p*g*c-_*h*c+_*l*m-o*g*m-p*l*u+o*h*u,y=x*h*c-d*g*c-x*l*m+a*g*m+d*l*u-a*h*u,S=d*_*c-x*p*c+x*o*m-a*_*m-d*o*u+a*p*u,N=x*p*l-d*_*l-x*o*h+a*_*h+d*o*g-a*p*g,b=n*v+i*y+r*S+s*N;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/b;return e[0]=v*A,e[1]=(_*h*s-p*g*s-_*r*m+i*g*m+p*r*u-i*h*u)*A,e[2]=(o*g*s-_*l*s+_*r*c-i*g*c-o*r*u+i*l*u)*A,e[3]=(p*l*s-o*h*s-p*r*c+i*h*c+o*r*m-i*l*m)*A,e[4]=y*A,e[5]=(d*g*s-x*h*s+x*r*m-n*g*m-d*r*u+n*h*u)*A,e[6]=(x*l*s-a*g*s-x*r*c+n*g*c+a*r*u-n*l*u)*A,e[7]=(a*h*s-d*l*s+d*r*c-n*h*c-a*r*m+n*l*m)*A,e[8]=S*A,e[9]=(x*p*s-d*_*s-x*i*m+n*_*m+d*i*u-n*p*u)*A,e[10]=(a*_*s-x*o*s+x*i*c-n*_*c-a*i*u+n*o*u)*A,e[11]=(d*o*s-a*p*s-d*i*c+n*p*c+a*i*m-n*o*m)*A,e[12]=N*A,e[13]=(d*_*r-x*p*r+x*i*h-n*_*h-d*i*g+n*p*g)*A,e[14]=(x*o*r-a*_*r-x*i*l+n*_*l+a*i*g-n*o*g)*A,e[15]=(a*p*r-d*o*r+d*i*l-n*p*l-a*i*h+n*o*h)*A,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,d=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,d*o+i,d*l-r*a,0,c*l-r*o,d*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,d=a+a,p=o+o,h=s*c,m=s*d,x=s*p,_=a*d,g=a*p,u=o*p,v=l*c,y=l*d,S=l*p,N=i.x,b=i.y,A=i.z;return r[0]=(1-(_+u))*N,r[1]=(m+S)*N,r[2]=(x-y)*N,r[3]=0,r[4]=(m-S)*b,r[5]=(1-(h+u))*b,r[6]=(g+v)*b,r[7]=0,r[8]=(x+y)*A,r[9]=(g-v)*A,r[10]=(1-(h+_))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=Xr.set(r[0],r[1],r[2]).length();const a=Xr.set(r[4],r[5],r[6]).length(),o=Xr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Un.copy(this);const c=1/s,d=1/a,p=1/o;return Un.elements[0]*=c,Un.elements[1]*=c,Un.elements[2]*=c,Un.elements[4]*=d,Un.elements[5]*=d,Un.elements[6]*=d,Un.elements[8]*=p,Un.elements[9]*=p,Un.elements[10]*=p,n.setFromRotationMatrix(Un),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=_i){const l=this.elements,c=2*s/(n-e),d=2*s/(i-r),p=(n+e)/(n-e),h=(i+r)/(i-r);let m,x;if(o===_i)m=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===Cl)m=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=p,l[12]=0,l[1]=0,l[5]=d,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=_i){const l=this.elements,c=1/(n-e),d=1/(i-r),p=1/(a-s),h=(n+e)*c,m=(i+r)*d;let x,_;if(o===_i)x=(a+s)*p,_=-2*p;else if(o===Cl)x=s*p,_=-1*p;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const Xr=new V,Un=new Et,fM=new V(0,0,0),hM=new V(1,1,1),Ui=new V,Eo=new V,un=new V,Tp=new Et,Ap=new $a;class bi{constructor(e=0,n=0,i=0,r=bi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],d=r[9],p=r[2],h=r[6],m=r[10];switch(n){case"XYZ":this._y=Math.asin(Jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Jt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(Jt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Jt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Jt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Tp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Tp,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Ap.setFromEuler(this),this.setFromQuaternion(Ap,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bi.DEFAULT_ORDER="XYZ";class $v{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let pM=0;const bp=new V,$r=new $a,ci=new Et,wo=new V,na=new V,mM=new V,gM=new $a,Cp=new V(1,0,0),Rp=new V(0,1,0),Np=new V(0,0,1),Pp={type:"added"},xM={type:"removed"},qr={type:"childadded",child:null},Fc={type:"childremoved",child:null};class on extends Vs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pM++}),this.uuid=Xa(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=on.DEFAULT_UP.clone();const e=new V,n=new bi,i=new $a,r=new V(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Et},normalMatrix:{value:new Ie}}),this.matrix=new Et,this.matrixWorld=new Et,this.matrixAutoUpdate=on.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $v,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return $r.setFromAxisAngle(e,n),this.quaternion.multiply($r),this}rotateOnWorldAxis(e,n){return $r.setFromAxisAngle(e,n),this.quaternion.premultiply($r),this}rotateX(e){return this.rotateOnAxis(Cp,e)}rotateY(e){return this.rotateOnAxis(Rp,e)}rotateZ(e){return this.rotateOnAxis(Np,e)}translateOnAxis(e,n){return bp.copy(e).applyQuaternion(this.quaternion),this.position.add(bp.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Cp,e)}translateY(e){return this.translateOnAxis(Rp,e)}translateZ(e){return this.translateOnAxis(Np,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ci.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?wo.copy(e):wo.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),na.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ci.lookAt(na,wo,this.up):ci.lookAt(wo,na,this.up),this.quaternion.setFromRotationMatrix(ci),r&&(ci.extractRotation(r.matrixWorld),$r.setFromRotationMatrix(ci),this.quaternion.premultiply($r.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Pp),qr.child=e,this.dispatchEvent(qr),qr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(xM),Fc.child=e,this.dispatchEvent(Fc),Fc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ci.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ci.multiply(e.parent.matrixWorld)),e.applyMatrix4(ci),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Pp),qr.child=e,this.dispatchEvent(qr),qr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,e,mM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,gM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const p=l[c];s(e.shapes,p)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),p=a(e.shapes),h=a(e.skeletons),m=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),p.length>0&&(i.shapes=p),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),x.length>0&&(i.nodes=x)}return i.object=r,i;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}on.DEFAULT_UP=new V(0,1,0);on.DEFAULT_MATRIX_AUTO_UPDATE=!0;on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const kn=new V,ui=new V,Oc=new V,di=new V,Yr=new V,Kr=new V,Lp=new V,zc=new V,Bc=new V,Vc=new V,Hc=new Mt,jc=new Mt,Gc=new Mt;class Bn{constructor(e=new V,n=new V,i=new V){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),kn.subVectors(e,n),r.cross(kn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){kn.subVectors(r,n),ui.subVectors(i,n),Oc.subVectors(e,n);const a=kn.dot(kn),o=kn.dot(ui),l=kn.dot(Oc),c=ui.dot(ui),d=ui.dot(Oc),p=a*c-o*o;if(p===0)return s.set(0,0,0),null;const h=1/p,m=(c*l-o*d)*h,x=(a*d-o*l)*h;return s.set(1-m-x,x,m)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,di)===null?!1:di.x>=0&&di.y>=0&&di.x+di.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,di)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,di.x),l.addScaledVector(a,di.y),l.addScaledVector(o,di.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return Hc.setScalar(0),jc.setScalar(0),Gc.setScalar(0),Hc.fromBufferAttribute(e,n),jc.fromBufferAttribute(e,i),Gc.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Hc,s.x),a.addScaledVector(jc,s.y),a.addScaledVector(Gc,s.z),a}static isFrontFacing(e,n,i,r){return kn.subVectors(i,n),ui.subVectors(e,n),kn.cross(ui).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kn.subVectors(this.c,this.b),ui.subVectors(this.a,this.b),kn.cross(ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Bn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Bn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Bn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Bn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Bn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;Yr.subVectors(r,i),Kr.subVectors(s,i),zc.subVectors(e,i);const l=Yr.dot(zc),c=Kr.dot(zc);if(l<=0&&c<=0)return n.copy(i);Bc.subVectors(e,r);const d=Yr.dot(Bc),p=Kr.dot(Bc);if(d>=0&&p<=d)return n.copy(r);const h=l*p-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),n.copy(i).addScaledVector(Yr,a);Vc.subVectors(e,s);const m=Yr.dot(Vc),x=Kr.dot(Vc);if(x>=0&&m<=x)return n.copy(s);const _=m*c-l*x;if(_<=0&&c>=0&&x<=0)return o=c/(c-x),n.copy(i).addScaledVector(Kr,o);const g=d*x-m*p;if(g<=0&&p-d>=0&&m-x>=0)return Lp.subVectors(s,r),o=(p-d)/(p-d+(m-x)),n.copy(r).addScaledVector(Lp,o);const u=1/(g+_+h);return a=_*u,o=h*u,n.copy(i).addScaledVector(Yr,a).addScaledVector(Kr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const qv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ki={h:0,s:0,l:0},To={h:0,s:0,l:0};function Wc(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Oe{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Sn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=Xe.workingColorSpace){return this.r=e,this.g=n,this.b=i,Xe.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=Xe.workingColorSpace){if(e=tM(e,1),n=Jt(n,0,1),i=Jt(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=Wc(a,s,e+1/3),this.g=Wc(a,s,e),this.b=Wc(a,s,e-1/3)}return Xe.toWorkingColorSpace(this,r),this}setStyle(e,n=Sn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Sn){const i=qv[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Si(e.r),this.g=Si(e.g),this.b=Si(e.b),this}copyLinearToSRGB(e){return this.r=Ms(e.r),this.g=Ms(e.g),this.b=Ms(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Sn){return Xe.fromWorkingColorSpace(Ht.copy(this),e),Math.round(Jt(Ht.r*255,0,255))*65536+Math.round(Jt(Ht.g*255,0,255))*256+Math.round(Jt(Ht.b*255,0,255))}getHexString(e=Sn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Xe.workingColorSpace){Xe.fromWorkingColorSpace(Ht.copy(this),n);const i=Ht.r,r=Ht.g,s=Ht.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const p=a-o;switch(c=d<=.5?p/(a+o):p/(2-a-o),a){case i:l=(r-s)/p+(r<s?6:0);break;case r:l=(s-i)/p+2;break;case s:l=(i-r)/p+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,n=Xe.workingColorSpace){return Xe.fromWorkingColorSpace(Ht.copy(this),n),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=Sn){Xe.fromWorkingColorSpace(Ht.copy(this),e);const n=Ht.r,i=Ht.g,r=Ht.b;return e!==Sn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(ki),this.setHSL(ki.h+e,ki.s+n,ki.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(ki),e.getHSL(To);const i=Cc(ki.h,To.h,n),r=Cc(ki.s,To.s,n),s=Cc(ki.l,To.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new Oe;Oe.NAMES=qv;let vM=0;class Ya extends Vs{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vM++}),this.uuid=Xa(),this.name="",this.blending=ys,this.side=ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ed,this.blendDst=td,this.blendEquation=yr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=Ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Vr,this.stencilZFail=Vr,this.stencilZPass=Vr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ys&&(i.blending=this.blending),this.side!==ir&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ed&&(i.blendSrc=this.blendSrc),this.blendDst!==td&&(i.blendDst=this.blendDst),this.blendEquation!==yr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ns&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==mp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Vr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Vr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Vr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Xf extends Ya{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=Nv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const wt=new V,Ao=new it;class Cn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=gp,this.updateRanges=[],this.gpuType=vi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Ao.fromBufferAttribute(this,n),Ao.applyMatrix3(e),this.setXY(n,Ao.x,Ao.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)wt.fromBufferAttribute(this,n),wt.applyMatrix3(e),this.setXYZ(n,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)wt.fromBufferAttribute(this,n),wt.applyMatrix4(e),this.setXYZ(n,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)wt.fromBufferAttribute(this,n),wt.applyNormalMatrix(e),this.setXYZ(n,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)wt.fromBufferAttribute(this,n),wt.transformDirection(e),this.setXYZ(n,wt.x,wt.y,wt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Js(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Zt(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Js(n,this.array)),n}setX(e,n){return this.normalized&&(n=Zt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Js(n,this.array)),n}setY(e,n){return this.normalized&&(n=Zt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Js(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Zt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Js(n,this.array)),n}setW(e,n){return this.normalized&&(n=Zt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Zt(n,this.array),i=Zt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=Zt(n,this.array),i=Zt(i,this.array),r=Zt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=Zt(n,this.array),i=Zt(i,this.array),r=Zt(r,this.array),s=Zt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==gp&&(e.usage=this.usage),e}}class Yv extends Cn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Kv extends Cn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class ni extends Cn{constructor(e,n,i){super(new Float32Array(e),n,i)}}let _M=0;const yn=new Et,Xc=new on,Zr=new V,dn=new qa,ia=new qa,Lt=new V;class ri extends Vs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:_M++}),this.uuid=Xa(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(jv(e)?Kv:Yv)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ie().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return yn.makeRotationFromQuaternion(e),this.applyMatrix4(yn),this}rotateX(e){return yn.makeRotationX(e),this.applyMatrix4(yn),this}rotateY(e){return yn.makeRotationY(e),this.applyMatrix4(yn),this}rotateZ(e){return yn.makeRotationZ(e),this.applyMatrix4(yn),this}translate(e,n,i){return yn.makeTranslation(e,n,i),this.applyMatrix4(yn),this}scale(e,n,i){return yn.makeScale(e,n,i),this.applyMatrix4(yn),this}lookAt(e){return Xc.lookAt(e),Xc.updateMatrix(),this.applyMatrix4(Xc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zr).negate(),this.translate(Zr.x,Zr.y,Zr.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ni(i,3))}else{for(let i=0,r=n.count;i<r;i++){const s=e[i];n.setXYZ(i,s.x,s.y,s.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new qa);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];dn.setFromBufferAttribute(s),this.morphTargetsRelative?(Lt.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Lt)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Yl);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){const i=this.boundingSphere.center;if(dn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];ia.setFromBufferAttribute(o),this.morphTargetsRelative?(Lt.addVectors(dn.min,ia.min),dn.expandByPoint(Lt),Lt.addVectors(dn.max,ia.max),dn.expandByPoint(Lt)):(dn.expandByPoint(ia.min),dn.expandByPoint(ia.max))}dn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Lt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Lt));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Lt.fromBufferAttribute(o,c),l&&(Zr.fromBufferAttribute(e,c),Lt.add(Zr)),r=Math.max(r,i.distanceToSquared(Lt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Cn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<i.count;R++)o[R]=new V,l[R]=new V;const c=new V,d=new V,p=new V,h=new it,m=new it,x=new it,_=new V,g=new V;function u(R,w,M){c.fromBufferAttribute(i,R),d.fromBufferAttribute(i,w),p.fromBufferAttribute(i,M),h.fromBufferAttribute(s,R),m.fromBufferAttribute(s,w),x.fromBufferAttribute(s,M),d.sub(c),p.sub(c),m.sub(h),x.sub(h);const P=1/(m.x*x.y-x.x*m.y);isFinite(P)&&(_.copy(d).multiplyScalar(x.y).addScaledVector(p,-m.y).multiplyScalar(P),g.copy(p).multiplyScalar(m.x).addScaledVector(d,-x.x).multiplyScalar(P),o[R].add(_),o[w].add(_),o[M].add(_),l[R].add(g),l[w].add(g),l[M].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,w=v.length;R<w;++R){const M=v[R],P=M.start,H=M.count;for(let F=P,G=P+H;F<G;F+=3)u(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const y=new V,S=new V,N=new V,b=new V;function A(R){N.fromBufferAttribute(r,R),b.copy(N);const w=o[R];y.copy(w),y.sub(N.multiplyScalar(N.dot(w))).normalize(),S.crossVectors(b,w);const P=S.dot(l[R])<0?-1:1;a.setXYZW(R,y.x,y.y,y.z,P)}for(let R=0,w=v.length;R<w;++R){const M=v[R],P=M.start,H=M.count;for(let F=P,G=P+H;F<G;F+=3)A(e.getX(F+0)),A(e.getX(F+1)),A(e.getX(F+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Cn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const r=new V,s=new V,a=new V,o=new V,l=new V,c=new V,d=new V,p=new V;if(e)for(let h=0,m=e.count;h<m;h+=3){const x=e.getX(h+0),_=e.getX(h+1),g=e.getX(h+2);r.fromBufferAttribute(n,x),s.fromBufferAttribute(n,_),a.fromBufferAttribute(n,g),d.subVectors(a,s),p.subVectors(r,s),d.cross(p),o.fromBufferAttribute(i,x),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),o.add(d),l.add(d),c.add(d),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,m=n.count;h<m;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),a.fromBufferAttribute(n,h+2),d.subVectors(a,s),p.subVectors(r,s),d.cross(p),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Lt.fromBufferAttribute(e,n),Lt.normalize(),e.setXYZ(n,Lt.x,Lt.y,Lt.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,p=o.normalized,h=new c.constructor(l.length*d);let m=0,x=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*d;for(let u=0;u<d;u++)h[x++]=c[m++]}return new Cn(h,d,p)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new ri,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let d=0,p=c.length;d<p;d++){const h=c[d],m=e(h,i);l.push(m)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let p=0,h=c.length;p<h;p++){const m=c[p];d.push(m.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(n))}const s=e.morphAttributes;for(const c in s){const d=[],p=s[c];for(let h=0,m=p.length;h<m;h++)d.push(p[h].clone(n));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const p=a[c];this.addGroup(p.start,p.count,p.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Dp=new Et,fr=new Xv,bo=new Yl,Ip=new V,Co=new V,Ro=new V,No=new V,$c=new V,Po=new V,Up=new V,Lo=new V;class Jn extends on{constructor(e=new ri,n=new Xf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Po.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=o[l],p=s[l];d!==0&&($c.fromBufferAttribute(p,e),a?Po.addScaledVector($c,d):Po.addScaledVector($c.sub(n),d))}n.add(Po)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),bo.copy(i.boundingSphere),bo.applyMatrix4(s),fr.copy(e.ray).recast(e.near),!(bo.containsPoint(fr.origin)===!1&&(fr.intersectSphere(bo,Ip)===null||fr.origin.distanceToSquared(Ip)>(e.far-e.near)**2))&&(Dp.copy(s).invert(),fr.copy(e.ray).applyMatrix4(Dp),!(i.boundingBox!==null&&fr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,fr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,p=s.attributes.normal,h=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,_=h.length;x<_;x++){const g=h[x],u=a[g.materialIndex],v=Math.max(g.start,m.start),y=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let S=v,N=y;S<N;S+=3){const b=o.getX(S),A=o.getX(S+1),R=o.getX(S+2);r=Do(this,u,e,i,c,d,p,b,A,R),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const x=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let g=x,u=_;g<u;g+=3){const v=o.getX(g),y=o.getX(g+1),S=o.getX(g+2);r=Do(this,a,e,i,c,d,p,v,y,S),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,_=h.length;x<_;x++){const g=h[x],u=a[g.materialIndex],v=Math.max(g.start,m.start),y=Math.min(l.count,Math.min(g.start+g.count,m.start+m.count));for(let S=v,N=y;S<N;S+=3){const b=S,A=S+1,R=S+2;r=Do(this,u,e,i,c,d,p,b,A,R),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const x=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let g=x,u=_;g<u;g+=3){const v=g,y=g+1,S=g+2;r=Do(this,a,e,i,c,d,p,v,y,S),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}}}function yM(t,e,n,i,r,s,a,o){let l;if(e.side===sn?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===ir,o),l===null)return null;Lo.copy(o),Lo.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(Lo);return c<n.near||c>n.far?null:{distance:c,point:Lo.clone(),object:t}}function Do(t,e,n,i,r,s,a,o,l,c){t.getVertexPosition(o,Co),t.getVertexPosition(l,Ro),t.getVertexPosition(c,No);const d=yM(t,e,n,i,Co,Ro,No,Up);if(d){const p=new V;Bn.getBarycoord(Up,Co,Ro,No,p),r&&(d.uv=Bn.getInterpolatedAttribute(r,o,l,c,p,new it)),s&&(d.uv1=Bn.getInterpolatedAttribute(s,o,l,c,p,new it)),a&&(d.normal=Bn.getInterpolatedAttribute(a,o,l,c,p,new V),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new V,materialIndex:0};Bn.getNormal(Co,Ro,No,h.normal),d.face=h,d.barycoord=p}return d}class Ka extends ri{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],d=[],p=[];let h=0,m=0;x("z","y","x",-1,-1,i,n,e,a,s,0),x("z","y","x",1,-1,i,n,-e,a,s,1),x("x","z","y",1,1,e,i,n,r,a,2),x("x","z","y",1,-1,e,i,-n,r,a,3),x("x","y","z",1,-1,e,n,i,r,s,4),x("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new ni(c,3)),this.setAttribute("normal",new ni(d,3)),this.setAttribute("uv",new ni(p,2));function x(_,g,u,v,y,S,N,b,A,R,w){const M=S/A,P=N/R,H=S/2,F=N/2,G=b/2,Y=A+1,W=R+1;let Q=0,L=0;const $=new V;for(let J=0;J<W;J++){const oe=J*P-F;for(let Me=0;Me<Y;Me++){const qe=Me*M-H;$[_]=qe*v,$[g]=oe*y,$[u]=G,c.push($.x,$.y,$.z),$[_]=0,$[g]=0,$[u]=b>0?1:-1,d.push($.x,$.y,$.z),p.push(Me/A),p.push(1-J/R),Q+=1}}for(let J=0;J<R;J++)for(let oe=0;oe<A;oe++){const Me=h+oe+Y*J,qe=h+oe+Y*(J+1),X=h+(oe+1)+Y*(J+1),ie=h+(oe+1)+Y*J;l.push(Me,qe,ie),l.push(qe,X,ie),L+=6}o.addGroup(m,L,w),m+=L,h+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ka(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Us(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Wt(t){const e={};for(let n=0;n<t.length;n++){const i=Us(t[n]);for(const r in i)e[r]=i[r]}return e}function SM(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Zv(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Xe.workingColorSpace}const MM={clone:Us,merge:Wt};var EM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class rr extends Ya{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=EM,this.fragmentShader=wM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Us(e.uniforms),this.uniformsGroups=SM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Qv extends on{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Et,this.projectionMatrix=new Et,this.projectionMatrixInverse=new Et,this.coordinateSystem=_i}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Fi=new V,kp=new it,Fp=new it;class wn extends Qv{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=zd*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(bc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return zd*2*Math.atan(Math.tan(bc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z)}getViewSize(e,n){return this.getViewBounds(e,kp,Fp),n.subVectors(Fp,kp)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(bc*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const Qr=-90,Jr=1;class TM extends on{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new wn(Qr,Jr,e,n);r.layers=this.layers,this.add(r);const s=new wn(Qr,Jr,e,n);s.layers=this.layers,this.add(s);const a=new wn(Qr,Jr,e,n);a.layers=this.layers,this.add(a);const o=new wn(Qr,Jr,e,n);o.layers=this.layers,this.add(o);const l=new wn(Qr,Jr,e,n);l.layers=this.layers,this.add(l);const c=new wn(Qr,Jr,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(e===_i)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Cl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,d]=this.children,p=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(n,d),e.setRenderTarget(p,h,m),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class Jv extends an{constructor(e,n,i,r,s,a,o,l,c,d){e=e!==void 0?e:[],n=n!==void 0?n:Ps,super(e,n,i,r,s,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class AM extends Ur{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Jv(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Qn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Ka(5,5,5),s=new rr({name:"CubemapFromEquirect",uniforms:Us(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:sn,blending:Ji});s.uniforms.tEquirect.value=n;const a=new Jn(r,s),o=n.minFilter;return n.minFilter===Ar&&(n.minFilter=Qn),new TM(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const qc=new V,bM=new V,CM=new Ie;class vr{constructor(e=new V(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=qc.subVectors(i,n).cross(bM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(qc),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||CM.getNormalMatrix(e),r=this.coplanarPoint(qc).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const hr=new Yl,Io=new V;class e0{constructor(e=new vr,n=new vr,i=new vr,r=new vr,s=new vr,a=new vr){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=_i){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],d=r[5],p=r[6],h=r[7],m=r[8],x=r[9],_=r[10],g=r[11],u=r[12],v=r[13],y=r[14],S=r[15];if(i[0].setComponents(l-s,h-c,g-m,S-u).normalize(),i[1].setComponents(l+s,h+c,g+m,S+u).normalize(),i[2].setComponents(l+a,h+d,g+x,S+v).normalize(),i[3].setComponents(l-a,h-d,g-x,S-v).normalize(),i[4].setComponents(l-o,h-p,g-_,S-y).normalize(),n===_i)i[5].setComponents(l+o,h+p,g+_,S+y).normalize();else if(n===Cl)i[5].setComponents(o,p,_,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),hr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),hr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(hr)}intersectsSprite(e){return hr.center.set(0,0,0),hr.radius=.7071067811865476,hr.applyMatrix4(e.matrixWorld),this.intersectsSphere(hr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Io.x=r.normal.x>0?e.max.x:e.min.x,Io.y=r.normal.y>0?e.max.y:e.min.y,Io.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Io)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function t0(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function RM(t){const e=new WeakMap;function n(o,l){const c=o.array,d=o.usage,p=c.byteLength,h=t.createBuffer();t.bindBuffer(l,h),t.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=t.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=t.HALF_FLOAT:m=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=t.SHORT;else if(c instanceof Uint32Array)m=t.UNSIGNED_INT;else if(c instanceof Int32Array)m=t.INT;else if(c instanceof Int8Array)m=t.BYTE;else if(c instanceof Uint8Array)m=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function i(o,l,c){const d=l.array,p=l.updateRanges;if(t.bindBuffer(c,o),p.length===0)t.bufferSubData(c,0,d);else{p.sort((m,x)=>m.start-x.start);let h=0;for(let m=1;m<p.length;m++){const x=p[h],_=p[m];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++h,p[h]=_)}p.length=h+1;for(let m=0,x=p.length;m<x;m++){const _=p[m];t.bufferSubData(c,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class Kl extends ri{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,d=l+1,p=e/o,h=n/l,m=[],x=[],_=[],g=[];for(let u=0;u<d;u++){const v=u*h-a;for(let y=0;y<c;y++){const S=y*p-s;x.push(S,-v,0),_.push(0,0,1),g.push(y/o),g.push(1-u/l)}}for(let u=0;u<l;u++)for(let v=0;v<o;v++){const y=v+c*u,S=v+c*(u+1),N=v+1+c*(u+1),b=v+1+c*u;m.push(y,S,b),m.push(S,N,b)}this.setIndex(m),this.setAttribute("position",new ni(x,3)),this.setAttribute("normal",new ni(_,3)),this.setAttribute("uv",new ni(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kl(e.width,e.height,e.widthSegments,e.heightSegments)}}var NM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,PM=`#ifdef USE_ALPHAHASH
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
#endif`,LM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,DM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,IM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,UM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,kM=`#ifdef USE_AOMAP
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
#endif`,FM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,OM=`#ifdef USE_BATCHING
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
#endif`,zM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,BM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,VM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,HM=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,jM=`#ifdef USE_IRIDESCENCE
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
#endif`,GM=`#ifdef USE_BUMPMAP
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
#endif`,WM=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,XM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$M=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,YM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,KM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ZM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,QM=`#if defined( USE_COLOR_ALPHA )
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
#endif`,JM=`#define PI 3.141592653589793
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
} // validated`,e1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,t1=`vec3 transformedNormal = objectNormal;
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
#endif`,n1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,i1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,r1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,s1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,a1="gl_FragColor = linearToOutputTexel( gl_FragColor );",o1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,l1=`#ifdef USE_ENVMAP
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
#endif`,c1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,u1=`#ifdef USE_ENVMAP
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
#endif`,d1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,f1=`#ifdef USE_ENVMAP
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
#endif`,h1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,p1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,m1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,g1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,x1=`#ifdef USE_GRADIENTMAP
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
}`,v1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,y1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,S1=`uniform bool receiveShadow;
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
#endif`,M1=`#ifdef USE_ENVMAP
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
#endif`,E1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,w1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,T1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,A1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,b1=`PhysicalMaterial material;
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
#endif`,C1=`struct PhysicalMaterial {
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
}`,R1=`
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
#endif`,N1=`#if defined( RE_IndirectDiffuse )
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
#endif`,P1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,L1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,D1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,I1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,U1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,k1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,F1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,O1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,z1=`#if defined( USE_POINTS_UV )
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
#endif`,B1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,V1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,H1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,j1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,G1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,W1=`#ifdef USE_MORPHTARGETS
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
#endif`,X1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,q1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Y1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,K1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Z1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Q1=`#ifdef USE_NORMALMAP
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
#endif`,J1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,eE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,iE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rE=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,aE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,oE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,uE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pE=`float getShadowMask() {
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
}`,mE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gE=`#ifdef USE_SKINNING
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
#endif`,xE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vE=`#ifdef USE_SKINNING
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
#endif`,_E=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,SE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ME=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,EE=`#ifdef USE_TRANSMISSION
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
#endif`,wE=`#ifdef USE_TRANSMISSION
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
#endif`,TE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,AE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,CE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const RE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,NE=`uniform sampler2D t2D;
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
}`,PE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,LE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,DE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,IE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,UE=`#include <common>
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
}`,kE=`#if DEPTH_PACKING == 3200
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
}`,FE=`#define DISTANCE
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
}`,OE=`#define DISTANCE
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
}`,zE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,BE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,VE=`uniform float scale;
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
}`,HE=`uniform vec3 diffuse;
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
}`,jE=`#include <common>
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
}`,GE=`uniform vec3 diffuse;
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
}`,WE=`#define LAMBERT
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
}`,XE=`#define LAMBERT
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
}`,$E=`#define MATCAP
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
}`,qE=`#define MATCAP
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
}`,YE=`#define NORMAL
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
}`,KE=`#define NORMAL
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
}`,ZE=`#define PHONG
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
}`,QE=`#define PHONG
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
}`,JE=`#define STANDARD
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
}`,ew=`#define STANDARD
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
}`,tw=`#define TOON
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
}`,nw=`#define TOON
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
}`,iw=`uniform float size;
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
}`,rw=`uniform vec3 diffuse;
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
}`,sw=`#include <common>
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
}`,aw=`uniform vec3 color;
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
}`,ow=`uniform float rotation;
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
}`,lw=`uniform vec3 diffuse;
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
}`,ke={alphahash_fragment:NM,alphahash_pars_fragment:PM,alphamap_fragment:LM,alphamap_pars_fragment:DM,alphatest_fragment:IM,alphatest_pars_fragment:UM,aomap_fragment:kM,aomap_pars_fragment:FM,batching_pars_vertex:OM,batching_vertex:zM,begin_vertex:BM,beginnormal_vertex:VM,bsdfs:HM,iridescence_fragment:jM,bumpmap_pars_fragment:GM,clipping_planes_fragment:WM,clipping_planes_pars_fragment:XM,clipping_planes_pars_vertex:$M,clipping_planes_vertex:qM,color_fragment:YM,color_pars_fragment:KM,color_pars_vertex:ZM,color_vertex:QM,common:JM,cube_uv_reflection_fragment:e1,defaultnormal_vertex:t1,displacementmap_pars_vertex:n1,displacementmap_vertex:i1,emissivemap_fragment:r1,emissivemap_pars_fragment:s1,colorspace_fragment:a1,colorspace_pars_fragment:o1,envmap_fragment:l1,envmap_common_pars_fragment:c1,envmap_pars_fragment:u1,envmap_pars_vertex:d1,envmap_physical_pars_fragment:M1,envmap_vertex:f1,fog_vertex:h1,fog_pars_vertex:p1,fog_fragment:m1,fog_pars_fragment:g1,gradientmap_pars_fragment:x1,lightmap_pars_fragment:v1,lights_lambert_fragment:_1,lights_lambert_pars_fragment:y1,lights_pars_begin:S1,lights_toon_fragment:E1,lights_toon_pars_fragment:w1,lights_phong_fragment:T1,lights_phong_pars_fragment:A1,lights_physical_fragment:b1,lights_physical_pars_fragment:C1,lights_fragment_begin:R1,lights_fragment_maps:N1,lights_fragment_end:P1,logdepthbuf_fragment:L1,logdepthbuf_pars_fragment:D1,logdepthbuf_pars_vertex:I1,logdepthbuf_vertex:U1,map_fragment:k1,map_pars_fragment:F1,map_particle_fragment:O1,map_particle_pars_fragment:z1,metalnessmap_fragment:B1,metalnessmap_pars_fragment:V1,morphinstance_vertex:H1,morphcolor_vertex:j1,morphnormal_vertex:G1,morphtarget_pars_vertex:W1,morphtarget_vertex:X1,normal_fragment_begin:$1,normal_fragment_maps:q1,normal_pars_fragment:Y1,normal_pars_vertex:K1,normal_vertex:Z1,normalmap_pars_fragment:Q1,clearcoat_normal_fragment_begin:J1,clearcoat_normal_fragment_maps:eE,clearcoat_pars_fragment:tE,iridescence_pars_fragment:nE,opaque_fragment:iE,packing:rE,premultiplied_alpha_fragment:sE,project_vertex:aE,dithering_fragment:oE,dithering_pars_fragment:lE,roughnessmap_fragment:cE,roughnessmap_pars_fragment:uE,shadowmap_pars_fragment:dE,shadowmap_pars_vertex:fE,shadowmap_vertex:hE,shadowmask_pars_fragment:pE,skinbase_vertex:mE,skinning_pars_vertex:gE,skinning_vertex:xE,skinnormal_vertex:vE,specularmap_fragment:_E,specularmap_pars_fragment:yE,tonemapping_fragment:SE,tonemapping_pars_fragment:ME,transmission_fragment:EE,transmission_pars_fragment:wE,uv_pars_fragment:TE,uv_pars_vertex:AE,uv_vertex:bE,worldpos_vertex:CE,background_vert:RE,background_frag:NE,backgroundCube_vert:PE,backgroundCube_frag:LE,cube_vert:DE,cube_frag:IE,depth_vert:UE,depth_frag:kE,distanceRGBA_vert:FE,distanceRGBA_frag:OE,equirect_vert:zE,equirect_frag:BE,linedashed_vert:VE,linedashed_frag:HE,meshbasic_vert:jE,meshbasic_frag:GE,meshlambert_vert:WE,meshlambert_frag:XE,meshmatcap_vert:$E,meshmatcap_frag:qE,meshnormal_vert:YE,meshnormal_frag:KE,meshphong_vert:ZE,meshphong_frag:QE,meshphysical_vert:JE,meshphysical_frag:ew,meshtoon_vert:tw,meshtoon_frag:nw,points_vert:iw,points_frag:rw,shadow_vert:sw,shadow_frag:aw,sprite_vert:ow,sprite_frag:lw},le={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ie}},envmap:{envMap:{value:null},envMapRotation:{value:new Ie},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ie},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0},uvTransform:{value:new Ie}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}}},Yn={basic:{uniforms:Wt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:ke.meshbasic_vert,fragmentShader:ke.meshbasic_frag},lambert:{uniforms:Wt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Oe(0)}}]),vertexShader:ke.meshlambert_vert,fragmentShader:ke.meshlambert_frag},phong:{uniforms:Wt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30}}]),vertexShader:ke.meshphong_vert,fragmentShader:ke.meshphong_frag},standard:{uniforms:Wt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag},toon:{uniforms:Wt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Oe(0)}}]),vertexShader:ke.meshtoon_vert,fragmentShader:ke.meshtoon_frag},matcap:{uniforms:Wt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:ke.meshmatcap_vert,fragmentShader:ke.meshmatcap_frag},points:{uniforms:Wt([le.points,le.fog]),vertexShader:ke.points_vert,fragmentShader:ke.points_frag},dashed:{uniforms:Wt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ke.linedashed_vert,fragmentShader:ke.linedashed_frag},depth:{uniforms:Wt([le.common,le.displacementmap]),vertexShader:ke.depth_vert,fragmentShader:ke.depth_frag},normal:{uniforms:Wt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:ke.meshnormal_vert,fragmentShader:ke.meshnormal_frag},sprite:{uniforms:Wt([le.sprite,le.fog]),vertexShader:ke.sprite_vert,fragmentShader:ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ke.background_vert,fragmentShader:ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ie}},vertexShader:ke.backgroundCube_vert,fragmentShader:ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ke.cube_vert,fragmentShader:ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ke.equirect_vert,fragmentShader:ke.equirect_frag},distanceRGBA:{uniforms:Wt([le.common,le.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ke.distanceRGBA_vert,fragmentShader:ke.distanceRGBA_frag},shadow:{uniforms:Wt([le.lights,le.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:ke.shadow_vert,fragmentShader:ke.shadow_frag}};Yn.physical={uniforms:Wt([Yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ie},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ie},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ie},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ie},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ie},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ie},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ie}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag};const Uo={r:0,b:0,g:0},pr=new bi,cw=new Et;function uw(t,e,n,i,r,s,a){const o=new Oe(0);let l=s===!0?0:1,c,d,p=null,h=0,m=null;function x(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?n:e).get(y)),y}function _(v){let y=!1;const S=x(v);S===null?u(o,l):S&&S.isColor&&(u(S,1),y=!0);const N=t.xr.getEnvironmentBlendMode();N==="additive"?i.buffers.color.setClear(0,0,0,1,a):N==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function g(v,y){const S=x(y);S&&(S.isCubeTexture||S.mapping===$l)?(d===void 0&&(d=new Jn(new Ka(1,1,1),new rr({name:"BackgroundCubeMaterial",uniforms:Us(Yn.backgroundCube.uniforms),vertexShader:Yn.backgroundCube.vertexShader,fragmentShader:Yn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(N,b,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),pr.copy(y.backgroundRotation),pr.x*=-1,pr.y*=-1,pr.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(pr.y*=-1,pr.z*=-1),d.material.uniforms.envMap.value=S,d.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(cw.makeRotationFromEuler(pr)),d.material.toneMapped=Xe.getTransfer(S.colorSpace)!==tt,(p!==S||h!==S.version||m!==t.toneMapping)&&(d.material.needsUpdate=!0,p=S,h=S.version,m=t.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Jn(new Kl(2,2),new rr({name:"BackgroundMaterial",uniforms:Us(Yn.background.uniforms),vertexShader:Yn.background.vertexShader,fragmentShader:Yn.background.fragmentShader,side:ir,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Xe.getTransfer(S.colorSpace)!==tt,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(p!==S||h!==S.version||m!==t.toneMapping)&&(c.material.needsUpdate=!0,p=S,h=S.version,m=t.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function u(v,y){v.getRGB(Uo,Zv(t)),i.buffers.color.setClear(Uo.r,Uo.g,Uo.b,y,a)}return{getClearColor:function(){return o},setClearColor:function(v,y=1){o.set(v),l=y,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,u(o,l)},render:_,addToRenderList:g}}function dw(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,a=!1;function o(M,P,H,F,G){let Y=!1;const W=p(F,H,P);s!==W&&(s=W,c(s.object)),Y=m(M,F,H,G),Y&&x(M,F,H,G),G!==null&&e.update(G,t.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,S(M,P,H,F),G!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return t.createVertexArray()}function c(M){return t.bindVertexArray(M)}function d(M){return t.deleteVertexArray(M)}function p(M,P,H){const F=H.wireframe===!0;let G=i[M.id];G===void 0&&(G={},i[M.id]=G);let Y=G[P.id];Y===void 0&&(Y={},G[P.id]=Y);let W=Y[F];return W===void 0&&(W=h(l()),Y[F]=W),W}function h(M){const P=[],H=[],F=[];for(let G=0;G<n;G++)P[G]=0,H[G]=0,F[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:H,attributeDivisors:F,object:M,attributes:{},index:null}}function m(M,P,H,F){const G=s.attributes,Y=P.attributes;let W=0;const Q=H.getAttributes();for(const L in Q)if(Q[L].location>=0){const J=G[L];let oe=Y[L];if(oe===void 0&&(L==="instanceMatrix"&&M.instanceMatrix&&(oe=M.instanceMatrix),L==="instanceColor"&&M.instanceColor&&(oe=M.instanceColor)),J===void 0||J.attribute!==oe||oe&&J.data!==oe.data)return!0;W++}return s.attributesNum!==W||s.index!==F}function x(M,P,H,F){const G={},Y=P.attributes;let W=0;const Q=H.getAttributes();for(const L in Q)if(Q[L].location>=0){let J=Y[L];J===void 0&&(L==="instanceMatrix"&&M.instanceMatrix&&(J=M.instanceMatrix),L==="instanceColor"&&M.instanceColor&&(J=M.instanceColor));const oe={};oe.attribute=J,J&&J.data&&(oe.data=J.data),G[L]=oe,W++}s.attributes=G,s.attributesNum=W,s.index=F}function _(){const M=s.newAttributes;for(let P=0,H=M.length;P<H;P++)M[P]=0}function g(M){u(M,0)}function u(M,P){const H=s.newAttributes,F=s.enabledAttributes,G=s.attributeDivisors;H[M]=1,F[M]===0&&(t.enableVertexAttribArray(M),F[M]=1),G[M]!==P&&(t.vertexAttribDivisor(M,P),G[M]=P)}function v(){const M=s.newAttributes,P=s.enabledAttributes;for(let H=0,F=P.length;H<F;H++)P[H]!==M[H]&&(t.disableVertexAttribArray(H),P[H]=0)}function y(M,P,H,F,G,Y,W){W===!0?t.vertexAttribIPointer(M,P,H,G,Y):t.vertexAttribPointer(M,P,H,F,G,Y)}function S(M,P,H,F){_();const G=F.attributes,Y=H.getAttributes(),W=P.defaultAttributeValues;for(const Q in Y){const L=Y[Q];if(L.location>=0){let $=G[Q];if($===void 0&&(Q==="instanceMatrix"&&M.instanceMatrix&&($=M.instanceMatrix),Q==="instanceColor"&&M.instanceColor&&($=M.instanceColor)),$!==void 0){const J=$.normalized,oe=$.itemSize,Me=e.get($);if(Me===void 0)continue;const qe=Me.buffer,X=Me.type,ie=Me.bytesPerElement,me=X===t.INT||X===t.UNSIGNED_INT||$.gpuType===Bf;if($.isInterleavedBufferAttribute){const ae=$.data,Ce=ae.stride,Pe=$.offset;if(ae.isInstancedInterleavedBuffer){for(let ze=0;ze<L.locationSize;ze++)u(L.location+ze,ae.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let ze=0;ze<L.locationSize;ze++)g(L.location+ze);t.bindBuffer(t.ARRAY_BUFFER,qe);for(let ze=0;ze<L.locationSize;ze++)y(L.location+ze,oe/L.locationSize,X,J,Ce*ie,(Pe+oe/L.locationSize*ze)*ie,me)}else{if($.isInstancedBufferAttribute){for(let ae=0;ae<L.locationSize;ae++)u(L.location+ae,$.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ae=0;ae<L.locationSize;ae++)g(L.location+ae);t.bindBuffer(t.ARRAY_BUFFER,qe);for(let ae=0;ae<L.locationSize;ae++)y(L.location+ae,oe/L.locationSize,X,J,oe*ie,oe/L.locationSize*ae*ie,me)}}else if(W!==void 0){const J=W[Q];if(J!==void 0)switch(J.length){case 2:t.vertexAttrib2fv(L.location,J);break;case 3:t.vertexAttrib3fv(L.location,J);break;case 4:t.vertexAttrib4fv(L.location,J);break;default:t.vertexAttrib1fv(L.location,J)}}}}v()}function N(){R();for(const M in i){const P=i[M];for(const H in P){const F=P[H];for(const G in F)d(F[G].object),delete F[G];delete P[H]}delete i[M]}}function b(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const H in P){const F=P[H];for(const G in F)d(F[G].object),delete F[G];delete P[H]}delete i[M.id]}function A(M){for(const P in i){const H=i[P];if(H[M.id]===void 0)continue;const F=H[M.id];for(const G in F)d(F[G].object),delete F[G];delete H[M.id]}}function R(){w(),a=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:w,dispose:N,releaseStatesOfGeometry:b,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:g,disableUnusedAttributes:v}}function fw(t,e,n){let i;function r(c){i=c}function s(c,d){t.drawArrays(i,c,d),n.update(d,i,1)}function a(c,d,p){p!==0&&(t.drawArraysInstanced(i,c,d,p),n.update(d,i,p))}function o(c,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,p);let m=0;for(let x=0;x<p;x++)m+=d[x];n.update(m,i,1)}function l(c,d,p,h){if(p===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<c.length;x++)a(c[x],d[x],h[x]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,d,0,h,0,p);let x=0;for(let _=0;_<p;_++)x+=d[_]*h[_];n.update(x,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function hw(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==Vn&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===Wa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Ai&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==vi&&!R)}function l(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const p=n.logarithmicDepthBuffer===!0,h=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),x=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),u=t.getParameter(t.MAX_VERTEX_ATTRIBS),v=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),y=t.getParameter(t.MAX_VARYING_VECTORS),S=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),N=x>0,b=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reverseDepthBuffer:h,maxTextures:m,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:g,maxAttributes:u,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:S,vertexTextures:N,maxSamples:b}}function pw(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new vr,o=new Ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){const m=p.length!==0||h||i!==0||r;return r=h,i=p.length,m},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,h){n=d(p,h,0)},this.setState=function(p,h,m){const x=p.clippingPlanes,_=p.clipIntersection,g=p.clipShadows,u=t.get(p);if(!r||x===null||x.length===0||s&&!g)s?d(null):c();else{const v=s?0:i,y=v*4;let S=u.clippingState||null;l.value=S,S=d(x,h,y,m);for(let N=0;N!==y;++N)S[N]=n[N];u.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(p,h,m,x){const _=p!==null?p.length:0;let g=null;if(_!==0){if(g=l.value,x!==!0||g===null){const u=m+_*4,v=h.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<u)&&(g=new Float32Array(u));for(let y=0,S=m;y!==_;++y,S+=4)a.copy(p[y]).applyMatrix4(v,o),a.normal.toArray(g,S),g[S+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function mw(t){let e=new WeakMap;function n(a,o){return o===cd?a.mapping=Ps:o===ud&&(a.mapping=Ls),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===cd||o===ud)if(e.has(a)){const l=e.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new AM(l.height);return c.fromEquirectangularTexture(t,a),e.set(a,c),a.addEventListener("dispose",r),n(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class gw extends Qv{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const hs=4,Op=[.125,.215,.35,.446,.526,.582],Sr=20,Yc=new gw,zp=new Oe;let Kc=null,Zc=0,Qc=0,Jc=!1;const _r=(1+Math.sqrt(5))/2,es=1/_r,Bp=[new V(-_r,es,0),new V(_r,es,0),new V(-es,0,_r),new V(es,0,_r),new V(0,_r,-es),new V(0,_r,es),new V(-1,1,-1),new V(1,1,-1),new V(-1,1,1),new V(1,1,1)];class Vp{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){Kc=this._renderer.getRenderTarget(),Zc=this._renderer.getActiveCubeFace(),Qc=this._renderer.getActiveMipmapLevel(),Jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Kc,Zc,Qc),this._renderer.xr.enabled=Jc,e.scissorTest=!1,ko(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Ps||e.mapping===Ls?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Kc=this._renderer.getRenderTarget(),Zc=this._renderer.getActiveCubeFace(),Qc=this._renderer.getActiveMipmapLevel(),Jc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Qn,minFilter:Qn,generateMipmaps:!1,type:Wa,format:Vn,colorSpace:Bs,depthBuffer:!1},r=Hp(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hp(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=xw(s)),this._blurMaterial=vw(s,e,n)}return r}_compileMaterial(e){const n=new Jn(this._lodPlanes[0],e);this._renderer.compile(n,Yc)}_sceneToCubeUV(e,n,i,r){const o=new wn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,p=d.autoClear,h=d.toneMapping;d.getClearColor(zp),d.toneMapping=er,d.autoClear=!1;const m=new Xf({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1}),x=new Jn(new Ka,m);let _=!1;const g=e.background;g?g.isColor&&(m.color.copy(g),e.background=null,_=!0):(m.color.copy(zp),_=!0);for(let u=0;u<6;u++){const v=u%3;v===0?(o.up.set(0,l[u],0),o.lookAt(c[u],0,0)):v===1?(o.up.set(0,0,l[u]),o.lookAt(0,c[u],0)):(o.up.set(0,l[u],0),o.lookAt(0,0,c[u]));const y=this._cubeSize;ko(r,v*y,u>2?y:0,y,y),d.setRenderTarget(r),_&&d.render(x,o),d.render(e,o)}x.geometry.dispose(),x.material.dispose(),d.toneMapping=h,d.autoClear=p,e.background=g}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Ps||e.mapping===Ls;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jp());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Jn(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;ko(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,Yc)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Bp[(r-s-1)%Bp.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,p=new Jn(this._lodPlanes[r],c),h=c.uniforms,m=this._sizeLods[i]-1,x=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Sr-1),_=s/x,g=isFinite(s)?1+Math.floor(d*_):Sr;g>Sr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Sr}`);const u=[];let v=0;for(let A=0;A<Sr;++A){const R=A/_,w=Math.exp(-R*R/2);u.push(w),A===0?v+=w:A<g&&(v+=2*w)}for(let A=0;A<u.length;A++)u[A]=u[A]/v;h.envMap.value=e.texture,h.samples.value=g,h.weights.value=u,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:y}=this;h.dTheta.value=x,h.mipInt.value=y-i;const S=this._sizeLods[r],N=3*S*(r>y-hs?r-y+hs:0),b=4*(this._cubeSize-S);ko(n,N,b,3*S,2*S),l.setRenderTarget(n),l.render(p,Yc)}}function xw(t){const e=[],n=[],i=[];let r=t;const s=t-hs+1+Op.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let l=1/o;a>t-hs?l=Op[a-t+hs-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),d=-c,p=1+c,h=[d,d,p,d,p,p,d,d,p,p,d,p],m=6,x=6,_=3,g=2,u=1,v=new Float32Array(_*x*m),y=new Float32Array(g*x*m),S=new Float32Array(u*x*m);for(let b=0;b<m;b++){const A=b%3*2/3-1,R=b>2?0:-1,w=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];v.set(w,_*x*b),y.set(h,g*x*b);const M=[b,b,b,b,b,b];S.set(M,u*x*b)}const N=new ri;N.setAttribute("position",new Cn(v,_)),N.setAttribute("uv",new Cn(y,g)),N.setAttribute("faceIndex",new Cn(S,u)),e.push(N),r>hs&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Hp(t,e,n){const i=new Ur(t,e,n);return i.texture.mapping=$l,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ko(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function vw(t,e,n){const i=new Float32Array(Sr),r=new V(0,1,0);return new rr({name:"SphericalGaussianBlur",defines:{n:Sr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:$f(),fragmentShader:`

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
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function jp(){return new rr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:$f(),fragmentShader:`

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
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function Gp(){return new rr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:$f(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function $f(){return`

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
	`}function _w(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===cd||l===ud,d=l===Ps||l===Ls;if(c||d){let p=e.get(o);const h=p!==void 0?p.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return n===null&&(n=new Vp(t)),p=c?n.fromEquirectangular(o,p):n.fromCubemap(o,p),p.texture.pmremVersion=o.pmremVersion,e.set(o,p),p.texture;if(p!==void 0)return p.texture;{const m=o.image;return c&&m&&m.height>0||d&&m&&r(m)?(n===null&&(n=new Vp(t)),p=c?n.fromEquirectangular(o):n.fromCubemap(o),p.texture.pmremVersion=o.pmremVersion,e.set(o,p),o.addEventListener("dispose",s),p.texture):null}}}return o}function r(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function yw(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&la("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Sw(t,e,n,i){const r={},s=new WeakMap;function a(p){const h=p.target;h.index!==null&&e.remove(h.index);for(const x in h.attributes)e.remove(h.attributes[x]);for(const x in h.morphAttributes){const _=h.morphAttributes[x];for(let g=0,u=_.length;g<u;g++)e.remove(_[g])}h.removeEventListener("dispose",a),delete r[h.id];const m=s.get(h);m&&(e.remove(m),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function o(p,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,n.memory.geometries++),h}function l(p){const h=p.attributes;for(const x in h)e.update(h[x],t.ARRAY_BUFFER);const m=p.morphAttributes;for(const x in m){const _=m[x];for(let g=0,u=_.length;g<u;g++)e.update(_[g],t.ARRAY_BUFFER)}}function c(p){const h=[],m=p.index,x=p.attributes.position;let _=0;if(m!==null){const v=m.array;_=m.version;for(let y=0,S=v.length;y<S;y+=3){const N=v[y+0],b=v[y+1],A=v[y+2];h.push(N,b,b,A,A,N)}}else if(x!==void 0){const v=x.array;_=x.version;for(let y=0,S=v.length/3-1;y<S;y+=3){const N=y+0,b=y+1,A=y+2;h.push(N,b,b,A,A,N)}}else return;const g=new(jv(h)?Kv:Yv)(h,1);g.version=_;const u=s.get(p);u&&e.remove(u),s.set(p,g)}function d(p){const h=s.get(p);if(h){const m=p.index;m!==null&&h.version<m.version&&c(p)}else c(p);return s.get(p)}return{get:o,update:l,getWireframeAttribute:d}}function Mw(t,e,n){let i;function r(h){i=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function l(h,m){t.drawElements(i,m,s,h*a),n.update(m,i,1)}function c(h,m,x){x!==0&&(t.drawElementsInstanced(i,m,s,h*a,x),n.update(m,i,x))}function d(h,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,s,h,0,x);let g=0;for(let u=0;u<x;u++)g+=m[u];n.update(g,i,1)}function p(h,m,x,_){if(x===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let u=0;u<h.length;u++)c(h[u]/a,m[u],_[u]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,s,h,0,_,0,x);let u=0;for(let v=0;v<x;v++)u+=m[v]*_[v];n.update(u,i,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=p}function Ew(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function ww(t,e,n){const i=new WeakMap,r=new Mt;function s(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=d!==void 0?d.length:0;let h=i.get(o);if(h===void 0||h.count!==p){let M=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",M)};var m=M;h!==void 0&&h.texture.dispose();const x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let S=0;x===!0&&(S=1),_===!0&&(S=2),g===!0&&(S=3);let N=o.attributes.position.count*S,b=1;N>e.maxTextureSize&&(b=Math.ceil(N/e.maxTextureSize),N=e.maxTextureSize);const A=new Float32Array(N*b*4*p),R=new Wv(A,N,b,p);R.type=vi,R.needsUpdate=!0;const w=S*4;for(let P=0;P<p;P++){const H=u[P],F=v[P],G=y[P],Y=N*b*4*P;for(let W=0;W<H.count;W++){const Q=W*w;x===!0&&(r.fromBufferAttribute(H,W),A[Y+Q+0]=r.x,A[Y+Q+1]=r.y,A[Y+Q+2]=r.z,A[Y+Q+3]=0),_===!0&&(r.fromBufferAttribute(F,W),A[Y+Q+4]=r.x,A[Y+Q+5]=r.y,A[Y+Q+6]=r.z,A[Y+Q+7]=0),g===!0&&(r.fromBufferAttribute(G,W),A[Y+Q+8]=r.x,A[Y+Q+9]=r.y,A[Y+Q+10]=r.z,A[Y+Q+11]=G.itemSize===4?r.w:1)}}h={count:p,texture:R,size:new it(N,b)},i.set(o,h),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let x=0;for(let g=0;g<c.length;g++)x+=c[g];const _=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(t,"morphTargetBaseInfluence",_),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:s}}function Tw(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,d=l.geometry,p=e.get(l,d);if(r.get(p)!==c&&(e.update(p),r.set(p,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return p}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:a}}class n0 extends an{constructor(e,n,i,r,s,a,o,l,c,d=Ss){if(d!==Ss&&d!==Is)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Ss&&(i=Ir),i===void 0&&d===Is&&(i=Ds),super(null,r,s,a,o,l,d,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:Gn,this.minFilter=l!==void 0?l:Gn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const i0=new an,Wp=new n0(1,1),r0=new Wv,s0=new uM,a0=new Jv,Xp=[],$p=[],qp=new Float32Array(16),Yp=new Float32Array(9),Kp=new Float32Array(4);function Hs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Xp[r];if(s===void 0&&(s=new Float32Array(r),Xp[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Nt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Pt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Zl(t,e){let n=$p[e];n===void 0&&(n=new Int32Array(e),$p[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function Aw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function bw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2fv(this.addr,e),Pt(n,e)}}function Cw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Nt(n,e))return;t.uniform3fv(this.addr,e),Pt(n,e)}}function Rw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4fv(this.addr,e),Pt(n,e)}}function Nw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Pt(n,e)}else{if(Nt(n,i))return;Kp.set(i),t.uniformMatrix2fv(this.addr,!1,Kp),Pt(n,i)}}function Pw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Pt(n,e)}else{if(Nt(n,i))return;Yp.set(i),t.uniformMatrix3fv(this.addr,!1,Yp),Pt(n,i)}}function Lw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Pt(n,e)}else{if(Nt(n,i))return;qp.set(i),t.uniformMatrix4fv(this.addr,!1,qp),Pt(n,i)}}function Dw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function Iw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2iv(this.addr,e),Pt(n,e)}}function Uw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Nt(n,e))return;t.uniform3iv(this.addr,e),Pt(n,e)}}function kw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4iv(this.addr,e),Pt(n,e)}}function Fw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function Ow(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2uiv(this.addr,e),Pt(n,e)}}function zw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Nt(n,e))return;t.uniform3uiv(this.addr,e),Pt(n,e)}}function Bw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4uiv(this.addr,e),Pt(n,e)}}function Vw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Wp.compareFunction=Hv,s=Wp):s=i0,n.setTexture2D(e||s,r)}function Hw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||s0,r)}function jw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||a0,r)}function Gw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||r0,r)}function Ww(t){switch(t){case 5126:return Aw;case 35664:return bw;case 35665:return Cw;case 35666:return Rw;case 35674:return Nw;case 35675:return Pw;case 35676:return Lw;case 5124:case 35670:return Dw;case 35667:case 35671:return Iw;case 35668:case 35672:return Uw;case 35669:case 35673:return kw;case 5125:return Fw;case 36294:return Ow;case 36295:return zw;case 36296:return Bw;case 35678:case 36198:case 36298:case 36306:case 35682:return Vw;case 35679:case 36299:case 36307:return Hw;case 35680:case 36300:case 36308:case 36293:return jw;case 36289:case 36303:case 36311:case 36292:return Gw}}function Xw(t,e){t.uniform1fv(this.addr,e)}function $w(t,e){const n=Hs(e,this.size,2);t.uniform2fv(this.addr,n)}function qw(t,e){const n=Hs(e,this.size,3);t.uniform3fv(this.addr,n)}function Yw(t,e){const n=Hs(e,this.size,4);t.uniform4fv(this.addr,n)}function Kw(t,e){const n=Hs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function Zw(t,e){const n=Hs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function Qw(t,e){const n=Hs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function Jw(t,e){t.uniform1iv(this.addr,e)}function eT(t,e){t.uniform2iv(this.addr,e)}function tT(t,e){t.uniform3iv(this.addr,e)}function nT(t,e){t.uniform4iv(this.addr,e)}function iT(t,e){t.uniform1uiv(this.addr,e)}function rT(t,e){t.uniform2uiv(this.addr,e)}function sT(t,e){t.uniform3uiv(this.addr,e)}function aT(t,e){t.uniform4uiv(this.addr,e)}function oT(t,e,n){const i=this.cache,r=e.length,s=Zl(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||i0,s[a])}function lT(t,e,n){const i=this.cache,r=e.length,s=Zl(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||s0,s[a])}function cT(t,e,n){const i=this.cache,r=e.length,s=Zl(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||a0,s[a])}function uT(t,e,n){const i=this.cache,r=e.length,s=Zl(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||r0,s[a])}function dT(t){switch(t){case 5126:return Xw;case 35664:return $w;case 35665:return qw;case 35666:return Yw;case 35674:return Kw;case 35675:return Zw;case 35676:return Qw;case 5124:case 35670:return Jw;case 35667:case 35671:return eT;case 35668:case 35672:return tT;case 35669:case 35673:return nT;case 5125:return iT;case 36294:return rT;case 36295:return sT;case 36296:return aT;case 35678:case 36198:case 36298:case 36306:case 35682:return oT;case 35679:case 36299:case 36307:return lT;case 35680:case 36300:case 36308:case 36293:return cT;case 36289:case 36303:case 36311:case 36292:return uT}}class fT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=Ww(n.type)}}class hT{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=dT(n.type)}}class pT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const eu=/(\w+)(\])?(\[|\.)?/g;function Zp(t,e){t.seq.push(e),t.map[e.id]=e}function mT(t,e,n){const i=t.name,r=i.length;for(eu.lastIndex=0;;){const s=eu.exec(i),a=eu.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Zp(n,c===void 0?new fT(o,t,e):new hT(o,t,e));break}else{let p=n.map[o];p===void 0&&(p=new pT(o),Zp(n,p)),n=p}}}class il{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);mT(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function Qp(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const gT=37297;let xT=0;function vT(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const Jp=new Ie;function _T(t){Xe._getMatrix(Jp,Xe.workingColorSpace,t);const e=`mat3( ${Jp.elements.map(n=>n.toFixed(4))} )`;switch(Xe.getTransfer(t)){case ql:return[e,"LinearTransferOETF"];case tt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function em(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+vT(t.getShaderSource(e),a)}else return r}function yT(t,e){const n=_T(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function ST(t,e){let n;switch(e){case kS:n="Linear";break;case FS:n="Reinhard";break;case OS:n="Cineon";break;case zS:n="ACESFilmic";break;case VS:n="AgX";break;case HS:n="Neutral";break;case BS:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Fo=new V;function MT(){Xe.getLuminanceCoefficients(Fo);const t=Fo.x.toFixed(4),e=Fo.y.toFixed(4),n=Fo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ET(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ca).join(`
`)}function wT(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function TT(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function ca(t){return t!==""}function tm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function nm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const AT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Bd(t){return t.replace(AT,CT)}const bT=new Map;function CT(t,e){let n=ke[e];if(n===void 0){const i=bT.get(e);if(i!==void 0)n=ke[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Bd(n)}const RT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function im(t){return t.replace(RT,NT)}function NT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function rm(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}function PT(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===Rv?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===mS?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===fi&&(e="SHADOWMAP_TYPE_VSM"),e}function LT(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Ps:case Ls:e="ENVMAP_TYPE_CUBE";break;case $l:e="ENVMAP_TYPE_CUBE_UV";break}return e}function DT(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Ls:e="ENVMAP_MODE_REFRACTION";break}return e}function IT(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case Nv:e="ENVMAP_BLENDING_MULTIPLY";break;case IS:e="ENVMAP_BLENDING_MIX";break;case US:e="ENVMAP_BLENDING_ADD";break}return e}function UT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function kT(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=PT(n),c=LT(n),d=DT(n),p=IT(n),h=UT(n),m=ET(n),x=wT(s),_=r.createProgram();let g,u,v=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(ca).join(`
`),g.length>0&&(g+=`
`),u=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(ca).join(`
`),u.length>0&&(u+=`
`)):(g=[rm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+d:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ca).join(`
`),u=[rm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+d:"",n.envMap?"#define "+p:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==er?"#define TONE_MAPPING":"",n.toneMapping!==er?ke.tonemapping_pars_fragment:"",n.toneMapping!==er?ST("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ke.colorspace_pars_fragment,yT("linearToOutputTexel",n.outputColorSpace),MT(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ca).join(`
`)),a=Bd(a),a=tm(a,n),a=nm(a,n),o=Bd(o),o=tm(o,n),o=nm(o,n),a=im(a),o=im(o),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,u=["#define varying in",n.glslVersion===xp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===xp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const y=v+g+a,S=v+u+o,N=Qp(r,r.VERTEX_SHADER,y),b=Qp(r,r.FRAGMENT_SHADER,S);r.attachShader(_,N),r.attachShader(_,b),n.index0AttributeName!==void 0?r.bindAttribLocation(_,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function A(P){if(t.debug.checkShaderErrors){const H=r.getProgramInfoLog(_).trim(),F=r.getShaderInfoLog(N).trim(),G=r.getShaderInfoLog(b).trim();let Y=!0,W=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(Y=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,_,N,b);else{const Q=em(r,N,"vertex"),L=em(r,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+H+`
`+Q+`
`+L)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(F===""||G==="")&&(W=!1);W&&(P.diagnostics={runnable:Y,programLog:H,vertexShader:{log:F,prefix:g},fragmentShader:{log:G,prefix:u}})}r.deleteShader(N),r.deleteShader(b),R=new il(r,_),w=TT(r,_)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let M=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,gT)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=xT++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=N,this.fragmentShader=b,this}let FT=0;class OT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new zT(e),n.set(e,i)),i}}class zT{constructor(e){this.id=FT++,this.code=e,this.usedTimes=0}}function BT(t,e,n,i,r,s,a){const o=new $v,l=new OT,c=new Set,d=[],p=r.logarithmicDepthBuffer,h=r.vertexTextures;let m=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return c.add(w),w===0?"uv":`uv${w}`}function g(w,M,P,H,F){const G=H.fog,Y=F.geometry,W=w.isMeshStandardMaterial?H.environment:null,Q=(w.isMeshStandardMaterial?n:e).get(w.envMap||W),L=Q&&Q.mapping===$l?Q.image.height:null,$=x[w.type];w.precision!==null&&(m=r.getMaxPrecision(w.precision),m!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",m,"instead."));const J=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,oe=J!==void 0?J.length:0;let Me=0;Y.morphAttributes.position!==void 0&&(Me=1),Y.morphAttributes.normal!==void 0&&(Me=2),Y.morphAttributes.color!==void 0&&(Me=3);let qe,X,ie,me;if($){const Qe=Yn[$];qe=Qe.vertexShader,X=Qe.fragmentShader}else qe=w.vertexShader,X=w.fragmentShader,l.update(w),ie=l.getVertexShaderID(w),me=l.getFragmentShaderID(w);const ae=t.getRenderTarget(),Ce=t.state.buffers.depth.getReversed(),Pe=F.isInstancedMesh===!0,ze=F.isBatchedMesh===!0,pt=!!w.map,Ge=!!w.matcap,yt=!!Q,k=!!w.aoMap,vn=!!w.lightMap,Ve=!!w.bumpMap,He=!!w.normalMap,Ae=!!w.displacementMap,ot=!!w.emissiveMap,Te=!!w.metalnessMap,C=!!w.roughnessMap,E=w.anisotropy>0,O=w.clearcoat>0,K=w.dispersion>0,te=w.iridescence>0,q=w.sheen>0,Ee=w.transmission>0,ue=E&&!!w.anisotropyMap,ge=O&&!!w.clearcoatMap,We=O&&!!w.clearcoatNormalMap,re=O&&!!w.clearcoatRoughnessMap,xe=te&&!!w.iridescenceMap,be=te&&!!w.iridescenceThicknessMap,Re=q&&!!w.sheenColorMap,ve=q&&!!w.sheenRoughnessMap,je=!!w.specularMap,Ue=!!w.specularColorMap,rt=!!w.specularIntensityMap,D=Ee&&!!w.transmissionMap,ce=Ee&&!!w.thicknessMap,j=!!w.gradientMap,Z=!!w.alphaMap,he=w.alphaTest>0,de=!!w.alphaHash,Le=!!w.extensions;let vt=er;w.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(vt=t.toneMapping);const Ot={shaderID:$,shaderType:w.type,shaderName:w.name,vertexShader:qe,fragmentShader:X,defines:w.defines,customVertexShaderID:ie,customFragmentShaderID:me,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:m,batching:ze,batchingColor:ze&&F._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&F.instanceColor!==null,instancingMorph:Pe&&F.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ae===null?t.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:Bs,alphaToCoverage:!!w.alphaToCoverage,map:pt,matcap:Ge,envMap:yt,envMapMode:yt&&Q.mapping,envMapCubeUVHeight:L,aoMap:k,lightMap:vn,bumpMap:Ve,normalMap:He,displacementMap:h&&Ae,emissiveMap:ot,normalMapObjectSpace:He&&w.normalMapType===$S,normalMapTangentSpace:He&&w.normalMapType===XS,metalnessMap:Te,roughnessMap:C,anisotropy:E,anisotropyMap:ue,clearcoat:O,clearcoatMap:ge,clearcoatNormalMap:We,clearcoatRoughnessMap:re,dispersion:K,iridescence:te,iridescenceMap:xe,iridescenceThicknessMap:be,sheen:q,sheenColorMap:Re,sheenRoughnessMap:ve,specularMap:je,specularColorMap:Ue,specularIntensityMap:rt,transmission:Ee,transmissionMap:D,thicknessMap:ce,gradientMap:j,opaque:w.transparent===!1&&w.blending===ys&&w.alphaToCoverage===!1,alphaMap:Z,alphaTest:he,alphaHash:de,combine:w.combine,mapUv:pt&&_(w.map.channel),aoMapUv:k&&_(w.aoMap.channel),lightMapUv:vn&&_(w.lightMap.channel),bumpMapUv:Ve&&_(w.bumpMap.channel),normalMapUv:He&&_(w.normalMap.channel),displacementMapUv:Ae&&_(w.displacementMap.channel),emissiveMapUv:ot&&_(w.emissiveMap.channel),metalnessMapUv:Te&&_(w.metalnessMap.channel),roughnessMapUv:C&&_(w.roughnessMap.channel),anisotropyMapUv:ue&&_(w.anisotropyMap.channel),clearcoatMapUv:ge&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:We&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:be&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:ve&&_(w.sheenRoughnessMap.channel),specularMapUv:je&&_(w.specularMap.channel),specularColorMapUv:Ue&&_(w.specularColorMap.channel),specularIntensityMapUv:rt&&_(w.specularIntensityMap.channel),transmissionMapUv:D&&_(w.transmissionMap.channel),thicknessMapUv:ce&&_(w.thicknessMap.channel),alphaMapUv:Z&&_(w.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(He||E),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!Y.attributes.uv&&(pt||Z),fog:!!G,useFog:w.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:p,reverseDepthBuffer:Ce,skinning:F.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:oe,morphTextureStride:Me,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:vt,decodeVideoTexture:pt&&w.map.isVideoTexture===!0&&Xe.getTransfer(w.map.colorSpace)===tt,decodeVideoTextureEmissive:ot&&w.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(w.emissiveMap.colorSpace)===tt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===mi,flipSided:w.side===sn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Le&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Le&&w.extensions.multiDraw===!0||ze)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Ot.vertexUv1s=c.has(1),Ot.vertexUv2s=c.has(2),Ot.vertexUv3s=c.has(3),c.clear(),Ot}function u(w){const M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(const P in w.defines)M.push(P),M.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(v(M,w),y(M,w),M.push(t.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function v(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function y(w,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),w.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),w.push(o.mask)}function S(w){const M=x[w.type];let P;if(M){const H=Yn[M];P=MM.clone(H.uniforms)}else P=w.uniforms;return P}function N(w,M){let P;for(let H=0,F=d.length;H<F;H++){const G=d[H];if(G.cacheKey===M){P=G,++P.usedTimes;break}}return P===void 0&&(P=new kT(t,M,w,s),d.push(P)),P}function b(w){if(--w.usedTimes===0){const M=d.indexOf(w);d[M]=d[d.length-1],d.pop(),w.destroy()}}function A(w){l.remove(w)}function R(){l.dispose()}return{getParameters:g,getProgramCacheKey:u,getUniforms:S,acquireProgram:N,releaseProgram:b,releaseShaderCache:A,programs:d,dispose:R}}function VT(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function HT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function sm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function am(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(p,h,m,x,_,g){let u=t[e];return u===void 0?(u={id:p.id,object:p,geometry:h,material:m,groupOrder:x,renderOrder:p.renderOrder,z:_,group:g},t[e]=u):(u.id=p.id,u.object=p,u.geometry=h,u.material=m,u.groupOrder=x,u.renderOrder=p.renderOrder,u.z=_,u.group=g),e++,u}function o(p,h,m,x,_,g){const u=a(p,h,m,x,_,g);m.transmission>0?i.push(u):m.transparent===!0?r.push(u):n.push(u)}function l(p,h,m,x,_,g){const u=a(p,h,m,x,_,g);m.transmission>0?i.unshift(u):m.transparent===!0?r.unshift(u):n.unshift(u)}function c(p,h){n.length>1&&n.sort(p||HT),i.length>1&&i.sort(h||sm),r.length>1&&r.sort(h||sm)}function d(){for(let p=e,h=t.length;p<h;p++){const m=t[p];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:d,sort:c}}function jT(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new am,t.set(i,[a])):r>=s.length?(a=new am,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function GT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new V,color:new Oe};break;case"SpotLight":n={position:new V,direction:new V,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new V,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":n={direction:new V,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":n={color:new Oe,position:new V,halfWidth:new V,halfHeight:new V};break}return t[e.id]=n,n}}}function WT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let XT=0;function $T(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function qT(t){const e=new GT,n=WT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new V);const r=new V,s=new Et,a=new Et;function o(c){let d=0,p=0,h=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let m=0,x=0,_=0,g=0,u=0,v=0,y=0,S=0,N=0,b=0,A=0;c.sort($T);for(let w=0,M=c.length;w<M;w++){const P=c[w],H=P.color,F=P.intensity,G=P.distance,Y=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=H.r*F,p+=H.g*F,h+=H.b*F;else if(P.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(P.sh.coefficients[W],F);A++}else if(P.isDirectionalLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Q=P.shadow,L=n.get(P);L.shadowIntensity=Q.intensity,L.shadowBias=Q.bias,L.shadowNormalBias=Q.normalBias,L.shadowRadius=Q.radius,L.shadowMapSize=Q.mapSize,i.directionalShadow[m]=L,i.directionalShadowMap[m]=Y,i.directionalShadowMatrix[m]=P.shadow.matrix,v++}i.directional[m]=W,m++}else if(P.isSpotLight){const W=e.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(H).multiplyScalar(F),W.distance=G,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,i.spot[_]=W;const Q=P.shadow;if(P.map&&(i.spotLightMap[N]=P.map,N++,Q.updateMatrices(P),P.castShadow&&b++),i.spotLightMatrix[_]=Q.matrix,P.castShadow){const L=n.get(P);L.shadowIntensity=Q.intensity,L.shadowBias=Q.bias,L.shadowNormalBias=Q.normalBias,L.shadowRadius=Q.radius,L.shadowMapSize=Q.mapSize,i.spotShadow[_]=L,i.spotShadowMap[_]=Y,S++}_++}else if(P.isRectAreaLight){const W=e.get(P);W.color.copy(H).multiplyScalar(F),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=W,g++}else if(P.isPointLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){const Q=P.shadow,L=n.get(P);L.shadowIntensity=Q.intensity,L.shadowBias=Q.bias,L.shadowNormalBias=Q.normalBias,L.shadowRadius=Q.radius,L.shadowMapSize=Q.mapSize,L.shadowCameraNear=Q.camera.near,L.shadowCameraFar=Q.camera.far,i.pointShadow[x]=L,i.pointShadowMap[x]=Y,i.pointShadowMatrix[x]=P.shadow.matrix,y++}i.point[x]=W,x++}else if(P.isHemisphereLight){const W=e.get(P);W.skyColor.copy(P.color).multiplyScalar(F),W.groundColor.copy(P.groundColor).multiplyScalar(F),i.hemi[u]=W,u++}}g>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=p,i.ambient[2]=h;const R=i.hash;(R.directionalLength!==m||R.pointLength!==x||R.spotLength!==_||R.rectAreaLength!==g||R.hemiLength!==u||R.numDirectionalShadows!==v||R.numPointShadows!==y||R.numSpotShadows!==S||R.numSpotMaps!==N||R.numLightProbes!==A)&&(i.directional.length=m,i.spot.length=_,i.rectArea.length=g,i.point.length=x,i.hemi.length=u,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=S+N-b,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=A,R.directionalLength=m,R.pointLength=x,R.spotLength=_,R.rectAreaLength=g,R.hemiLength=u,R.numDirectionalShadows=v,R.numPointShadows=y,R.numSpotShadows=S,R.numSpotMaps=N,R.numLightProbes=A,i.version=XT++)}function l(c,d){let p=0,h=0,m=0,x=0,_=0;const g=d.matrixWorldInverse;for(let u=0,v=c.length;u<v;u++){const y=c[u];if(y.isDirectionalLight){const S=i.directional[p];S.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),p++}else if(y.isSpotLight){const S=i.spot[m];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(g),S.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),m++}else if(y.isRectAreaLight){const S=i.rectArea[x];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(g),a.identity(),s.copy(y.matrixWorld),s.premultiply(g),a.extractRotation(s),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){const S=i.point[h];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(g),h++}else if(y.isHemisphereLight){const S=i.hemi[_];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(g),_++}}}return{setup:o,setupView:l,state:i}}function om(t){const e=new qT(t),n=[],i=[];function r(d){c.camera=d,n.length=0,i.length=0}function s(d){n.push(d)}function a(d){i.push(d)}function o(){e.setup(n)}function l(d){e.setupView(n,d)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function YT(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new om(t),e.set(r,[o])):s>=a.length?(o=new om(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class KT extends Ya{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=GS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ZT extends Ya{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const QT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,JT=`uniform sampler2D shadow_pass;
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
}`;function eA(t,e,n){let i=new e0;const r=new it,s=new it,a=new Mt,o=new KT({depthPacking:WS}),l=new ZT,c={},d=n.maxTextureSize,p={[ir]:sn,[sn]:ir,[mi]:mi},h=new rr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:QT,fragmentShader:JT}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const x=new ri;x.setAttribute("position",new Cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Jn(x,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Rv;let u=this.type;this.render=function(b,A,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;const w=t.getRenderTarget(),M=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),H=t.state;H.setBlending(Ji),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const F=u!==fi&&this.type===fi,G=u===fi&&this.type!==fi;for(let Y=0,W=b.length;Y<W;Y++){const Q=b[Y],L=Q.shadow;if(L===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(L.autoUpdate===!1&&L.needsUpdate===!1)continue;r.copy(L.mapSize);const $=L.getFrameExtents();if(r.multiply($),s.copy(L.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/$.x),r.x=s.x*$.x,L.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/$.y),r.y=s.y*$.y,L.mapSize.y=s.y)),L.map===null||F===!0||G===!0){const oe=this.type!==fi?{minFilter:Gn,magFilter:Gn}:{};L.map!==null&&L.map.dispose(),L.map=new Ur(r.x,r.y,oe),L.map.texture.name=Q.name+".shadowMap",L.camera.updateProjectionMatrix()}t.setRenderTarget(L.map),t.clear();const J=L.getViewportCount();for(let oe=0;oe<J;oe++){const Me=L.getViewport(oe);a.set(s.x*Me.x,s.y*Me.y,s.x*Me.z,s.y*Me.w),H.viewport(a),L.updateMatrices(Q,oe),i=L.getFrustum(),S(A,R,L.camera,Q,this.type)}L.isPointLightShadow!==!0&&this.type===fi&&v(L,R),L.needsUpdate=!1}u=this.type,g.needsUpdate=!1,t.setRenderTarget(w,M,P)};function v(b,A){const R=e.update(_);h.defines.VSM_SAMPLES!==b.blurSamples&&(h.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Ur(r.x,r.y)),h.uniforms.shadow_pass.value=b.map.texture,h.uniforms.resolution.value=b.mapSize,h.uniforms.radius.value=b.radius,t.setRenderTarget(b.mapPass),t.clear(),t.renderBufferDirect(A,null,R,h,_,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,t.setRenderTarget(b.map),t.clear(),t.renderBufferDirect(A,null,R,m,_,null)}function y(b,A,R,w){let M=null;const P=R.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)M=P;else if(M=R.isPointLight===!0?l:o,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const H=M.uuid,F=A.uuid;let G=c[H];G===void 0&&(G={},c[H]=G);let Y=G[F];Y===void 0&&(Y=M.clone(),G[F]=Y,A.addEventListener("dispose",N)),M=Y}if(M.visible=A.visible,M.wireframe=A.wireframe,w===fi?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:p[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const H=t.properties.get(M);H.light=R}return M}function S(b,A,R,w,M){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&M===fi)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,b.matrixWorld);const F=e.update(b),G=b.material;if(Array.isArray(G)){const Y=F.groups;for(let W=0,Q=Y.length;W<Q;W++){const L=Y[W],$=G[L.materialIndex];if($&&$.visible){const J=y(b,$,w,M);b.onBeforeShadow(t,b,A,R,F,J,L),t.renderBufferDirect(R,null,F,J,b,L),b.onAfterShadow(t,b,A,R,F,J,L)}}}else if(G.visible){const Y=y(b,G,w,M);b.onBeforeShadow(t,b,A,R,F,Y,null),t.renderBufferDirect(R,null,F,Y,b,null),b.onAfterShadow(t,b,A,R,F,Y,null)}}const H=b.children;for(let F=0,G=H.length;F<G;F++)S(H[F],A,R,w,M)}function N(b){b.target.removeEventListener("dispose",N);for(const R in c){const w=c[R],M=b.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}const tA={[nd]:id,[rd]:od,[sd]:ld,[Ns]:ad,[id]:nd,[od]:rd,[ld]:sd,[ad]:Ns};function nA(t,e){function n(){let D=!1;const ce=new Mt;let j=null;const Z=new Mt(0,0,0,0);return{setMask:function(he){j!==he&&!D&&(t.colorMask(he,he,he,he),j=he)},setLocked:function(he){D=he},setClear:function(he,de,Le,vt,Ot){Ot===!0&&(he*=vt,de*=vt,Le*=vt),ce.set(he,de,Le,vt),Z.equals(ce)===!1&&(t.clearColor(he,de,Le,vt),Z.copy(ce))},reset:function(){D=!1,j=null,Z.set(-1,0,0,0)}}}function i(){let D=!1,ce=!1,j=null,Z=null,he=null;return{setReversed:function(de){if(ce!==de){const Le=e.get("EXT_clip_control");ce?Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.ZERO_TO_ONE_EXT):Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.NEGATIVE_ONE_TO_ONE_EXT);const vt=he;he=null,this.setClear(vt)}ce=de},getReversed:function(){return ce},setTest:function(de){de?ae(t.DEPTH_TEST):Ce(t.DEPTH_TEST)},setMask:function(de){j!==de&&!D&&(t.depthMask(de),j=de)},setFunc:function(de){if(ce&&(de=tA[de]),Z!==de){switch(de){case nd:t.depthFunc(t.NEVER);break;case id:t.depthFunc(t.ALWAYS);break;case rd:t.depthFunc(t.LESS);break;case Ns:t.depthFunc(t.LEQUAL);break;case sd:t.depthFunc(t.EQUAL);break;case ad:t.depthFunc(t.GEQUAL);break;case od:t.depthFunc(t.GREATER);break;case ld:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Z=de}},setLocked:function(de){D=de},setClear:function(de){he!==de&&(ce&&(de=1-de),t.clearDepth(de),he=de)},reset:function(){D=!1,j=null,Z=null,he=null,ce=!1}}}function r(){let D=!1,ce=null,j=null,Z=null,he=null,de=null,Le=null,vt=null,Ot=null;return{setTest:function(Qe){D||(Qe?ae(t.STENCIL_TEST):Ce(t.STENCIL_TEST))},setMask:function(Qe){ce!==Qe&&!D&&(t.stencilMask(Qe),ce=Qe)},setFunc:function(Qe,Pn,si){(j!==Qe||Z!==Pn||he!==si)&&(t.stencilFunc(Qe,Pn,si),j=Qe,Z=Pn,he=si)},setOp:function(Qe,Pn,si){(de!==Qe||Le!==Pn||vt!==si)&&(t.stencilOp(Qe,Pn,si),de=Qe,Le=Pn,vt=si)},setLocked:function(Qe){D=Qe},setClear:function(Qe){Ot!==Qe&&(t.clearStencil(Qe),Ot=Qe)},reset:function(){D=!1,ce=null,j=null,Z=null,he=null,de=null,Le=null,vt=null,Ot=null}}}const s=new n,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let d={},p={},h=new WeakMap,m=[],x=null,_=!1,g=null,u=null,v=null,y=null,S=null,N=null,b=null,A=new Oe(0,0,0),R=0,w=!1,M=null,P=null,H=null,F=null,G=null;const Y=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,Q=0;const L=t.getParameter(t.VERSION);L.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(L)[1]),W=Q>=1):L.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),W=Q>=2);let $=null,J={};const oe=t.getParameter(t.SCISSOR_BOX),Me=t.getParameter(t.VIEWPORT),qe=new Mt().fromArray(oe),X=new Mt().fromArray(Me);function ie(D,ce,j,Z){const he=new Uint8Array(4),de=t.createTexture();t.bindTexture(D,de),t.texParameteri(D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(D,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Le=0;Le<j;Le++)D===t.TEXTURE_3D||D===t.TEXTURE_2D_ARRAY?t.texImage3D(ce,0,t.RGBA,1,1,Z,0,t.RGBA,t.UNSIGNED_BYTE,he):t.texImage2D(ce+Le,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,he);return de}const me={};me[t.TEXTURE_2D]=ie(t.TEXTURE_2D,t.TEXTURE_2D,1),me[t.TEXTURE_CUBE_MAP]=ie(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),me[t.TEXTURE_2D_ARRAY]=ie(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),me[t.TEXTURE_3D]=ie(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ae(t.DEPTH_TEST),a.setFunc(Ns),Ve(!1),He(fp),ae(t.CULL_FACE),k(Ji);function ae(D){d[D]!==!0&&(t.enable(D),d[D]=!0)}function Ce(D){d[D]!==!1&&(t.disable(D),d[D]=!1)}function Pe(D,ce){return p[D]!==ce?(t.bindFramebuffer(D,ce),p[D]=ce,D===t.DRAW_FRAMEBUFFER&&(p[t.FRAMEBUFFER]=ce),D===t.FRAMEBUFFER&&(p[t.DRAW_FRAMEBUFFER]=ce),!0):!1}function ze(D,ce){let j=m,Z=!1;if(D){j=h.get(ce),j===void 0&&(j=[],h.set(ce,j));const he=D.textures;if(j.length!==he.length||j[0]!==t.COLOR_ATTACHMENT0){for(let de=0,Le=he.length;de<Le;de++)j[de]=t.COLOR_ATTACHMENT0+de;j.length=he.length,Z=!0}}else j[0]!==t.BACK&&(j[0]=t.BACK,Z=!0);Z&&t.drawBuffers(j)}function pt(D){return x!==D?(t.useProgram(D),x=D,!0):!1}const Ge={[yr]:t.FUNC_ADD,[xS]:t.FUNC_SUBTRACT,[vS]:t.FUNC_REVERSE_SUBTRACT};Ge[_S]=t.MIN,Ge[yS]=t.MAX;const yt={[SS]:t.ZERO,[MS]:t.ONE,[ES]:t.SRC_COLOR,[ed]:t.SRC_ALPHA,[RS]:t.SRC_ALPHA_SATURATE,[bS]:t.DST_COLOR,[TS]:t.DST_ALPHA,[wS]:t.ONE_MINUS_SRC_COLOR,[td]:t.ONE_MINUS_SRC_ALPHA,[CS]:t.ONE_MINUS_DST_COLOR,[AS]:t.ONE_MINUS_DST_ALPHA,[NS]:t.CONSTANT_COLOR,[PS]:t.ONE_MINUS_CONSTANT_COLOR,[LS]:t.CONSTANT_ALPHA,[DS]:t.ONE_MINUS_CONSTANT_ALPHA};function k(D,ce,j,Z,he,de,Le,vt,Ot,Qe){if(D===Ji){_===!0&&(Ce(t.BLEND),_=!1);return}if(_===!1&&(ae(t.BLEND),_=!0),D!==gS){if(D!==g||Qe!==w){if((u!==yr||S!==yr)&&(t.blendEquation(t.FUNC_ADD),u=yr,S=yr),Qe)switch(D){case ys:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Ju:t.blendFunc(t.ONE,t.ONE);break;case hp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case pp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case ys:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Ju:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case hp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case pp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}v=null,y=null,N=null,b=null,A.set(0,0,0),R=0,g=D,w=Qe}return}he=he||ce,de=de||j,Le=Le||Z,(ce!==u||he!==S)&&(t.blendEquationSeparate(Ge[ce],Ge[he]),u=ce,S=he),(j!==v||Z!==y||de!==N||Le!==b)&&(t.blendFuncSeparate(yt[j],yt[Z],yt[de],yt[Le]),v=j,y=Z,N=de,b=Le),(vt.equals(A)===!1||Ot!==R)&&(t.blendColor(vt.r,vt.g,vt.b,Ot),A.copy(vt),R=Ot),g=D,w=!1}function vn(D,ce){D.side===mi?Ce(t.CULL_FACE):ae(t.CULL_FACE);let j=D.side===sn;ce&&(j=!j),Ve(j),D.blending===ys&&D.transparent===!1?k(Ji):k(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const Z=D.stencilWrite;o.setTest(Z),Z&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ot(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ae(t.SAMPLE_ALPHA_TO_COVERAGE):Ce(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ve(D){M!==D&&(D?t.frontFace(t.CW):t.frontFace(t.CCW),M=D)}function He(D){D!==hS?(ae(t.CULL_FACE),D!==P&&(D===fp?t.cullFace(t.BACK):D===pS?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ce(t.CULL_FACE),P=D}function Ae(D){D!==H&&(W&&t.lineWidth(D),H=D)}function ot(D,ce,j){D?(ae(t.POLYGON_OFFSET_FILL),(F!==ce||G!==j)&&(t.polygonOffset(ce,j),F=ce,G=j)):Ce(t.POLYGON_OFFSET_FILL)}function Te(D){D?ae(t.SCISSOR_TEST):Ce(t.SCISSOR_TEST)}function C(D){D===void 0&&(D=t.TEXTURE0+Y-1),$!==D&&(t.activeTexture(D),$=D)}function E(D,ce,j){j===void 0&&($===null?j=t.TEXTURE0+Y-1:j=$);let Z=J[j];Z===void 0&&(Z={type:void 0,texture:void 0},J[j]=Z),(Z.type!==D||Z.texture!==ce)&&($!==j&&(t.activeTexture(j),$=j),t.bindTexture(D,ce||me[D]),Z.type=D,Z.texture=ce)}function O(){const D=J[$];D!==void 0&&D.type!==void 0&&(t.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function K(){try{t.compressedTexImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function te(){try{t.compressedTexImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{t.texSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{t.texSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ue(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ge(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function We(){try{t.texStorage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function re(){try{t.texStorage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(){try{t.texImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function be(){try{t.texImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Re(D){qe.equals(D)===!1&&(t.scissor(D.x,D.y,D.z,D.w),qe.copy(D))}function ve(D){X.equals(D)===!1&&(t.viewport(D.x,D.y,D.z,D.w),X.copy(D))}function je(D,ce){let j=c.get(ce);j===void 0&&(j=new WeakMap,c.set(ce,j));let Z=j.get(D);Z===void 0&&(Z=t.getUniformBlockIndex(ce,D.name),j.set(D,Z))}function Ue(D,ce){const Z=c.get(ce).get(D);l.get(ce)!==Z&&(t.uniformBlockBinding(ce,Z,D.__bindingPointIndex),l.set(ce,Z))}function rt(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),d={},$=null,J={},p={},h=new WeakMap,m=[],x=null,_=!1,g=null,u=null,v=null,y=null,S=null,N=null,b=null,A=new Oe(0,0,0),R=0,w=!1,M=null,P=null,H=null,F=null,G=null,qe.set(0,0,t.canvas.width,t.canvas.height),X.set(0,0,t.canvas.width,t.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ae,disable:Ce,bindFramebuffer:Pe,drawBuffers:ze,useProgram:pt,setBlending:k,setMaterial:vn,setFlipSided:Ve,setCullFace:He,setLineWidth:Ae,setPolygonOffset:ot,setScissorTest:Te,activeTexture:C,bindTexture:E,unbindTexture:O,compressedTexImage2D:K,compressedTexImage3D:te,texImage2D:xe,texImage3D:be,updateUBOMapping:je,uniformBlockBinding:Ue,texStorage2D:We,texStorage3D:re,texSubImage2D:q,texSubImage3D:Ee,compressedTexSubImage2D:ue,compressedTexSubImage3D:ge,scissor:Re,viewport:ve,reset:rt}}function lm(t,e,n,i){const r=iA(i);switch(n){case Uv:return t*e;case Fv:return t*e;case Ov:return t*e*2;case zv:return t*e/r.components*r.byteLength;case jf:return t*e/r.components*r.byteLength;case Bv:return t*e*2/r.components*r.byteLength;case Gf:return t*e*2/r.components*r.byteLength;case kv:return t*e*3/r.components*r.byteLength;case Vn:return t*e*4/r.components*r.byteLength;case Wf:return t*e*4/r.components*r.byteLength;case Qo:case Jo:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case el:case tl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case pd:case gd:return Math.max(t,16)*Math.max(e,8)/4;case hd:case md:return Math.max(t,8)*Math.max(e,8)/2;case xd:case vd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case _d:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case yd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Sd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Md:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Ed:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case wd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Td:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Ad:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case bd:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Cd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Rd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Nd:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Pd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Ld:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Dd:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case nl:case Id:case Ud:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Vv:case kd:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Fd:case Od:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function iA(t){switch(t){case Ai:case Lv:return{byteLength:1,components:1};case Oa:case Dv:case Wa:return{byteLength:2,components:1};case Vf:case Hf:return{byteLength:2,components:4};case Ir:case Bf:case vi:return{byteLength:4,components:1};case Iv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function rA(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new it,d=new WeakMap;let p;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,E){return m?new OffscreenCanvas(C,E):Rl("canvas")}function _(C,E,O){let K=1;const te=Te(C);if((te.width>O||te.height>O)&&(K=O/Math.max(te.width,te.height)),K<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const q=Math.floor(K*te.width),Ee=Math.floor(K*te.height);p===void 0&&(p=x(q,Ee));const ue=E?x(q,Ee):p;return ue.width=q,ue.height=Ee,ue.getContext("2d").drawImage(C,0,0,q,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+q+"x"+Ee+")."),ue}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),C;return C}function g(C){return C.generateMipmaps}function u(C){t.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?t.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function y(C,E,O,K,te=!1){if(C!==null){if(t[C]!==void 0)return t[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let q=E;if(E===t.RED&&(O===t.FLOAT&&(q=t.R32F),O===t.HALF_FLOAT&&(q=t.R16F),O===t.UNSIGNED_BYTE&&(q=t.R8)),E===t.RED_INTEGER&&(O===t.UNSIGNED_BYTE&&(q=t.R8UI),O===t.UNSIGNED_SHORT&&(q=t.R16UI),O===t.UNSIGNED_INT&&(q=t.R32UI),O===t.BYTE&&(q=t.R8I),O===t.SHORT&&(q=t.R16I),O===t.INT&&(q=t.R32I)),E===t.RG&&(O===t.FLOAT&&(q=t.RG32F),O===t.HALF_FLOAT&&(q=t.RG16F),O===t.UNSIGNED_BYTE&&(q=t.RG8)),E===t.RG_INTEGER&&(O===t.UNSIGNED_BYTE&&(q=t.RG8UI),O===t.UNSIGNED_SHORT&&(q=t.RG16UI),O===t.UNSIGNED_INT&&(q=t.RG32UI),O===t.BYTE&&(q=t.RG8I),O===t.SHORT&&(q=t.RG16I),O===t.INT&&(q=t.RG32I)),E===t.RGB_INTEGER&&(O===t.UNSIGNED_BYTE&&(q=t.RGB8UI),O===t.UNSIGNED_SHORT&&(q=t.RGB16UI),O===t.UNSIGNED_INT&&(q=t.RGB32UI),O===t.BYTE&&(q=t.RGB8I),O===t.SHORT&&(q=t.RGB16I),O===t.INT&&(q=t.RGB32I)),E===t.RGBA_INTEGER&&(O===t.UNSIGNED_BYTE&&(q=t.RGBA8UI),O===t.UNSIGNED_SHORT&&(q=t.RGBA16UI),O===t.UNSIGNED_INT&&(q=t.RGBA32UI),O===t.BYTE&&(q=t.RGBA8I),O===t.SHORT&&(q=t.RGBA16I),O===t.INT&&(q=t.RGBA32I)),E===t.RGB&&O===t.UNSIGNED_INT_5_9_9_9_REV&&(q=t.RGB9_E5),E===t.RGBA){const Ee=te?ql:Xe.getTransfer(K);O===t.FLOAT&&(q=t.RGBA32F),O===t.HALF_FLOAT&&(q=t.RGBA16F),O===t.UNSIGNED_BYTE&&(q=Ee===tt?t.SRGB8_ALPHA8:t.RGBA8),O===t.UNSIGNED_SHORT_4_4_4_4&&(q=t.RGBA4),O===t.UNSIGNED_SHORT_5_5_5_1&&(q=t.RGB5_A1)}return(q===t.R16F||q===t.R32F||q===t.RG16F||q===t.RG32F||q===t.RGBA16F||q===t.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function S(C,E){let O;return C?E===null||E===Ir||E===Ds?O=t.DEPTH24_STENCIL8:E===vi?O=t.DEPTH32F_STENCIL8:E===Oa&&(O=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Ir||E===Ds?O=t.DEPTH_COMPONENT24:E===vi?O=t.DEPTH_COMPONENT32F:E===Oa&&(O=t.DEPTH_COMPONENT16),O}function N(C,E){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Gn&&C.minFilter!==Qn?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function b(C){const E=C.target;E.removeEventListener("dispose",b),R(E),E.isVideoTexture&&d.delete(E)}function A(C){const E=C.target;E.removeEventListener("dispose",A),M(E)}function R(C){const E=i.get(C);if(E.__webglInit===void 0)return;const O=C.source,K=h.get(O);if(K){const te=K[E.__cacheKey];te.usedTimes--,te.usedTimes===0&&w(C),Object.keys(K).length===0&&h.delete(O)}i.remove(C)}function w(C){const E=i.get(C);t.deleteTexture(E.__webglTexture);const O=C.source,K=h.get(O);delete K[E.__cacheKey],a.memory.textures--}function M(C){const E=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(E.__webglFramebuffer[K]))for(let te=0;te<E.__webglFramebuffer[K].length;te++)t.deleteFramebuffer(E.__webglFramebuffer[K][te]);else t.deleteFramebuffer(E.__webglFramebuffer[K]);E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer[K])}else{if(Array.isArray(E.__webglFramebuffer))for(let K=0;K<E.__webglFramebuffer.length;K++)t.deleteFramebuffer(E.__webglFramebuffer[K]);else t.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&t.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let K=0;K<E.__webglColorRenderbuffer.length;K++)E.__webglColorRenderbuffer[K]&&t.deleteRenderbuffer(E.__webglColorRenderbuffer[K]);E.__webglDepthRenderbuffer&&t.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const O=C.textures;for(let K=0,te=O.length;K<te;K++){const q=i.get(O[K]);q.__webglTexture&&(t.deleteTexture(q.__webglTexture),a.memory.textures--),i.remove(O[K])}i.remove(C)}let P=0;function H(){P=0}function F(){const C=P;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),P+=1,C}function G(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function Y(C,E){const O=i.get(C);if(C.isVideoTexture&&Ae(C),C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){const K=C.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(O,C,E);return}}n.bindTexture(t.TEXTURE_2D,O.__webglTexture,t.TEXTURE0+E)}function W(C,E){const O=i.get(C);if(C.version>0&&O.__version!==C.version){X(O,C,E);return}n.bindTexture(t.TEXTURE_2D_ARRAY,O.__webglTexture,t.TEXTURE0+E)}function Q(C,E){const O=i.get(C);if(C.version>0&&O.__version!==C.version){X(O,C,E);return}n.bindTexture(t.TEXTURE_3D,O.__webglTexture,t.TEXTURE0+E)}function L(C,E){const O=i.get(C);if(C.version>0&&O.__version!==C.version){ie(O,C,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,O.__webglTexture,t.TEXTURE0+E)}const $={[dd]:t.REPEAT,[Tr]:t.CLAMP_TO_EDGE,[fd]:t.MIRRORED_REPEAT},J={[Gn]:t.NEAREST,[jS]:t.NEAREST_MIPMAP_NEAREST,[xo]:t.NEAREST_MIPMAP_LINEAR,[Qn]:t.LINEAR,[Ac]:t.LINEAR_MIPMAP_NEAREST,[Ar]:t.LINEAR_MIPMAP_LINEAR},oe={[qS]:t.NEVER,[eM]:t.ALWAYS,[YS]:t.LESS,[Hv]:t.LEQUAL,[KS]:t.EQUAL,[JS]:t.GEQUAL,[ZS]:t.GREATER,[QS]:t.NOTEQUAL};function Me(C,E){if(E.type===vi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Qn||E.magFilter===Ac||E.magFilter===xo||E.magFilter===Ar||E.minFilter===Qn||E.minFilter===Ac||E.minFilter===xo||E.minFilter===Ar)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(C,t.TEXTURE_WRAP_S,$[E.wrapS]),t.texParameteri(C,t.TEXTURE_WRAP_T,$[E.wrapT]),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,$[E.wrapR]),t.texParameteri(C,t.TEXTURE_MAG_FILTER,J[E.magFilter]),t.texParameteri(C,t.TEXTURE_MIN_FILTER,J[E.minFilter]),E.compareFunction&&(t.texParameteri(C,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(C,t.TEXTURE_COMPARE_FUNC,oe[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Gn||E.minFilter!==xo&&E.minFilter!==Ar||E.type===vi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");t.texParameterf(C,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function qe(C,E){let O=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",b));const K=E.source;let te=h.get(K);te===void 0&&(te={},h.set(K,te));const q=G(E);if(q!==C.__cacheKey){te[q]===void 0&&(te[q]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,O=!0),te[q].usedTimes++;const Ee=te[C.__cacheKey];Ee!==void 0&&(te[C.__cacheKey].usedTimes--,Ee.usedTimes===0&&w(E)),C.__cacheKey=q,C.__webglTexture=te[q].texture}return O}function X(C,E,O){let K=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(K=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(K=t.TEXTURE_3D);const te=qe(C,E),q=E.source;n.bindTexture(K,C.__webglTexture,t.TEXTURE0+O);const Ee=i.get(q);if(q.version!==Ee.__version||te===!0){n.activeTexture(t.TEXTURE0+O);const ue=Xe.getPrimaries(Xe.workingColorSpace),ge=E.colorSpace===Hi?null:Xe.getPrimaries(E.colorSpace),We=E.colorSpace===Hi||ue===ge?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,We);let re=_(E.image,!1,r.maxTextureSize);re=ot(E,re);const xe=s.convert(E.format,E.colorSpace),be=s.convert(E.type);let Re=y(E.internalFormat,xe,be,E.colorSpace,E.isVideoTexture);Me(K,E);let ve;const je=E.mipmaps,Ue=E.isVideoTexture!==!0,rt=Ee.__version===void 0||te===!0,D=q.dataReady,ce=N(E,re);if(E.isDepthTexture)Re=S(E.format===Is,E.type),rt&&(Ue?n.texStorage2D(t.TEXTURE_2D,1,Re,re.width,re.height):n.texImage2D(t.TEXTURE_2D,0,Re,re.width,re.height,0,xe,be,null));else if(E.isDataTexture)if(je.length>0){Ue&&rt&&n.texStorage2D(t.TEXTURE_2D,ce,Re,je[0].width,je[0].height);for(let j=0,Z=je.length;j<Z;j++)ve=je[j],Ue?D&&n.texSubImage2D(t.TEXTURE_2D,j,0,0,ve.width,ve.height,xe,be,ve.data):n.texImage2D(t.TEXTURE_2D,j,Re,ve.width,ve.height,0,xe,be,ve.data);E.generateMipmaps=!1}else Ue?(rt&&n.texStorage2D(t.TEXTURE_2D,ce,Re,re.width,re.height),D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,re.width,re.height,xe,be,re.data)):n.texImage2D(t.TEXTURE_2D,0,Re,re.width,re.height,0,xe,be,re.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Ue&&rt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ce,Re,je[0].width,je[0].height,re.depth);for(let j=0,Z=je.length;j<Z;j++)if(ve=je[j],E.format!==Vn)if(xe!==null)if(Ue){if(D)if(E.layerUpdates.size>0){const he=lm(ve.width,ve.height,E.format,E.type);for(const de of E.layerUpdates){const Le=ve.data.subarray(de*he/ve.data.BYTES_PER_ELEMENT,(de+1)*he/ve.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,j,0,0,de,ve.width,ve.height,1,xe,Le)}E.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,j,0,0,0,ve.width,ve.height,re.depth,xe,ve.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,j,Re,ve.width,ve.height,re.depth,0,ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?D&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,j,0,0,0,ve.width,ve.height,re.depth,xe,be,ve.data):n.texImage3D(t.TEXTURE_2D_ARRAY,j,Re,ve.width,ve.height,re.depth,0,xe,be,ve.data)}else{Ue&&rt&&n.texStorage2D(t.TEXTURE_2D,ce,Re,je[0].width,je[0].height);for(let j=0,Z=je.length;j<Z;j++)ve=je[j],E.format!==Vn?xe!==null?Ue?D&&n.compressedTexSubImage2D(t.TEXTURE_2D,j,0,0,ve.width,ve.height,xe,ve.data):n.compressedTexImage2D(t.TEXTURE_2D,j,Re,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?D&&n.texSubImage2D(t.TEXTURE_2D,j,0,0,ve.width,ve.height,xe,be,ve.data):n.texImage2D(t.TEXTURE_2D,j,Re,ve.width,ve.height,0,xe,be,ve.data)}else if(E.isDataArrayTexture)if(Ue){if(rt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ce,Re,re.width,re.height,re.depth),D)if(E.layerUpdates.size>0){const j=lm(re.width,re.height,E.format,E.type);for(const Z of E.layerUpdates){const he=re.data.subarray(Z*j/re.data.BYTES_PER_ELEMENT,(Z+1)*j/re.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Z,re.width,re.height,1,xe,be,he)}E.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,xe,be,re.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Re,re.width,re.height,re.depth,0,xe,be,re.data);else if(E.isData3DTexture)Ue?(rt&&n.texStorage3D(t.TEXTURE_3D,ce,Re,re.width,re.height,re.depth),D&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,xe,be,re.data)):n.texImage3D(t.TEXTURE_3D,0,Re,re.width,re.height,re.depth,0,xe,be,re.data);else if(E.isFramebufferTexture){if(rt)if(Ue)n.texStorage2D(t.TEXTURE_2D,ce,Re,re.width,re.height);else{let j=re.width,Z=re.height;for(let he=0;he<ce;he++)n.texImage2D(t.TEXTURE_2D,he,Re,j,Z,0,xe,be,null),j>>=1,Z>>=1}}else if(je.length>0){if(Ue&&rt){const j=Te(je[0]);n.texStorage2D(t.TEXTURE_2D,ce,Re,j.width,j.height)}for(let j=0,Z=je.length;j<Z;j++)ve=je[j],Ue?D&&n.texSubImage2D(t.TEXTURE_2D,j,0,0,xe,be,ve):n.texImage2D(t.TEXTURE_2D,j,Re,xe,be,ve);E.generateMipmaps=!1}else if(Ue){if(rt){const j=Te(re);n.texStorage2D(t.TEXTURE_2D,ce,Re,j.width,j.height)}D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,xe,be,re)}else n.texImage2D(t.TEXTURE_2D,0,Re,xe,be,re);g(E)&&u(K),Ee.__version=q.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function ie(C,E,O){if(E.image.length!==6)return;const K=qe(C,E),te=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,C.__webglTexture,t.TEXTURE0+O);const q=i.get(te);if(te.version!==q.__version||K===!0){n.activeTexture(t.TEXTURE0+O);const Ee=Xe.getPrimaries(Xe.workingColorSpace),ue=E.colorSpace===Hi?null:Xe.getPrimaries(E.colorSpace),ge=E.colorSpace===Hi||Ee===ue?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);const We=E.isCompressedTexture||E.image[0].isCompressedTexture,re=E.image[0]&&E.image[0].isDataTexture,xe=[];for(let Z=0;Z<6;Z++)!We&&!re?xe[Z]=_(E.image[Z],!0,r.maxCubemapSize):xe[Z]=re?E.image[Z].image:E.image[Z],xe[Z]=ot(E,xe[Z]);const be=xe[0],Re=s.convert(E.format,E.colorSpace),ve=s.convert(E.type),je=y(E.internalFormat,Re,ve,E.colorSpace),Ue=E.isVideoTexture!==!0,rt=q.__version===void 0||K===!0,D=te.dataReady;let ce=N(E,be);Me(t.TEXTURE_CUBE_MAP,E);let j;if(We){Ue&&rt&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ce,je,be.width,be.height);for(let Z=0;Z<6;Z++){j=xe[Z].mipmaps;for(let he=0;he<j.length;he++){const de=j[he];E.format!==Vn?Re!==null?Ue?D&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,he,0,0,de.width,de.height,Re,de.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,he,je,de.width,de.height,0,de.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,he,0,0,de.width,de.height,Re,ve,de.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,he,je,de.width,de.height,0,Re,ve,de.data)}}}else{if(j=E.mipmaps,Ue&&rt){j.length>0&&ce++;const Z=Te(xe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,ce,je,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(re){Ue?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,xe[Z].width,xe[Z].height,Re,ve,xe[Z].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,je,xe[Z].width,xe[Z].height,0,Re,ve,xe[Z].data);for(let he=0;he<j.length;he++){const Le=j[he].image[Z].image;Ue?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,he+1,0,0,Le.width,Le.height,Re,ve,Le.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,he+1,je,Le.width,Le.height,0,Re,ve,Le.data)}}else{Ue?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Re,ve,xe[Z]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,je,Re,ve,xe[Z]);for(let he=0;he<j.length;he++){const de=j[he];Ue?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,he+1,0,0,Re,ve,de.image[Z]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,he+1,je,Re,ve,de.image[Z])}}}g(E)&&u(t.TEXTURE_CUBE_MAP),q.__version=te.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function me(C,E,O,K,te,q){const Ee=s.convert(O.format,O.colorSpace),ue=s.convert(O.type),ge=y(O.internalFormat,Ee,ue,O.colorSpace),We=i.get(E),re=i.get(O);if(re.__renderTarget=E,!We.__hasExternalTextures){const xe=Math.max(1,E.width>>q),be=Math.max(1,E.height>>q);te===t.TEXTURE_3D||te===t.TEXTURE_2D_ARRAY?n.texImage3D(te,q,ge,xe,be,E.depth,0,Ee,ue,null):n.texImage2D(te,q,ge,xe,be,0,Ee,ue,null)}n.bindFramebuffer(t.FRAMEBUFFER,C),He(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,K,te,re.__webglTexture,0,Ve(E)):(te===t.TEXTURE_2D||te>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,K,te,re.__webglTexture,q),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ae(C,E,O){if(t.bindRenderbuffer(t.RENDERBUFFER,C),E.depthBuffer){const K=E.depthTexture,te=K&&K.isDepthTexture?K.type:null,q=S(E.stencilBuffer,te),Ee=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=Ve(E);He(E)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ue,q,E.width,E.height):O?t.renderbufferStorageMultisample(t.RENDERBUFFER,ue,q,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,q,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Ee,t.RENDERBUFFER,C)}else{const K=E.textures;for(let te=0;te<K.length;te++){const q=K[te],Ee=s.convert(q.format,q.colorSpace),ue=s.convert(q.type),ge=y(q.internalFormat,Ee,ue,q.colorSpace),We=Ve(E);O&&He(E)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,We,ge,E.width,E.height):He(E)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,We,ge,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,ge,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Ce(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=i.get(E.depthTexture);K.__renderTarget=E,(!K.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),Y(E.depthTexture,0);const te=K.__webglTexture,q=Ve(E);if(E.depthTexture.format===Ss)He(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,te,0,q):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,te,0);else if(E.depthTexture.format===Is)He(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,te,0,q):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function Pe(C){const E=i.get(C),O=C.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==C.depthTexture){const K=C.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),K){const te=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,K.removeEventListener("dispose",te)};K.addEventListener("dispose",te),E.__depthDisposeCallback=te}E.__boundDepthTexture=K}if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Ce(E.__webglFramebuffer,C)}else if(O){E.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[K]),E.__webglDepthbuffer[K]===void 0)E.__webglDepthbuffer[K]=t.createRenderbuffer(),ae(E.__webglDepthbuffer[K],C,!1);else{const te=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,q=E.__webglDepthbuffer[K];t.bindRenderbuffer(t.RENDERBUFFER,q),t.framebufferRenderbuffer(t.FRAMEBUFFER,te,t.RENDERBUFFER,q)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=t.createRenderbuffer(),ae(E.__webglDepthbuffer,C,!1);else{const K=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,te=E.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,te),t.framebufferRenderbuffer(t.FRAMEBUFFER,K,t.RENDERBUFFER,te)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function ze(C,E,O){const K=i.get(C);E!==void 0&&me(K.__webglFramebuffer,C,C.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),O!==void 0&&Pe(C)}function pt(C){const E=C.texture,O=i.get(C),K=i.get(E);C.addEventListener("dispose",A);const te=C.textures,q=C.isWebGLCubeRenderTarget===!0,Ee=te.length>1;if(Ee||(K.__webglTexture===void 0&&(K.__webglTexture=t.createTexture()),K.__version=E.version,a.memory.textures++),q){O.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(E.mipmaps&&E.mipmaps.length>0){O.__webglFramebuffer[ue]=[];for(let ge=0;ge<E.mipmaps.length;ge++)O.__webglFramebuffer[ue][ge]=t.createFramebuffer()}else O.__webglFramebuffer[ue]=t.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){O.__webglFramebuffer=[];for(let ue=0;ue<E.mipmaps.length;ue++)O.__webglFramebuffer[ue]=t.createFramebuffer()}else O.__webglFramebuffer=t.createFramebuffer();if(Ee)for(let ue=0,ge=te.length;ue<ge;ue++){const We=i.get(te[ue]);We.__webglTexture===void 0&&(We.__webglTexture=t.createTexture(),a.memory.textures++)}if(C.samples>0&&He(C)===!1){O.__webglMultisampledFramebuffer=t.createFramebuffer(),O.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ue=0;ue<te.length;ue++){const ge=te[ue];O.__webglColorRenderbuffer[ue]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,O.__webglColorRenderbuffer[ue]);const We=s.convert(ge.format,ge.colorSpace),re=s.convert(ge.type),xe=y(ge.internalFormat,We,re,ge.colorSpace,C.isXRRenderTarget===!0),be=Ve(C);t.renderbufferStorageMultisample(t.RENDERBUFFER,be,xe,C.width,C.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ue,t.RENDERBUFFER,O.__webglColorRenderbuffer[ue])}t.bindRenderbuffer(t.RENDERBUFFER,null),C.depthBuffer&&(O.__webglDepthRenderbuffer=t.createRenderbuffer(),ae(O.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(q){n.bindTexture(t.TEXTURE_CUBE_MAP,K.__webglTexture),Me(t.TEXTURE_CUBE_MAP,E);for(let ue=0;ue<6;ue++)if(E.mipmaps&&E.mipmaps.length>0)for(let ge=0;ge<E.mipmaps.length;ge++)me(O.__webglFramebuffer[ue][ge],C,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ge);else me(O.__webglFramebuffer[ue],C,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);g(E)&&u(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ee){for(let ue=0,ge=te.length;ue<ge;ue++){const We=te[ue],re=i.get(We);n.bindTexture(t.TEXTURE_2D,re.__webglTexture),Me(t.TEXTURE_2D,We),me(O.__webglFramebuffer,C,We,t.COLOR_ATTACHMENT0+ue,t.TEXTURE_2D,0),g(We)&&u(t.TEXTURE_2D)}n.unbindTexture()}else{let ue=t.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ue=C.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ue,K.__webglTexture),Me(ue,E),E.mipmaps&&E.mipmaps.length>0)for(let ge=0;ge<E.mipmaps.length;ge++)me(O.__webglFramebuffer[ge],C,E,t.COLOR_ATTACHMENT0,ue,ge);else me(O.__webglFramebuffer,C,E,t.COLOR_ATTACHMENT0,ue,0);g(E)&&u(ue),n.unbindTexture()}C.depthBuffer&&Pe(C)}function Ge(C){const E=C.textures;for(let O=0,K=E.length;O<K;O++){const te=E[O];if(g(te)){const q=v(C),Ee=i.get(te).__webglTexture;n.bindTexture(q,Ee),u(q),n.unbindTexture()}}}const yt=[],k=[];function vn(C){if(C.samples>0){if(He(C)===!1){const E=C.textures,O=C.width,K=C.height;let te=t.COLOR_BUFFER_BIT;const q=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ee=i.get(C),ue=E.length>1;if(ue)for(let ge=0;ge<E.length;ge++)n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ge,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ge,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let ge=0;ge<E.length;ge++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(te|=t.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(te|=t.STENCIL_BUFFER_BIT)),ue){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ee.__webglColorRenderbuffer[ge]);const We=i.get(E[ge]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,We,0)}t.blitFramebuffer(0,0,O,K,0,0,O,K,te,t.NEAREST),l===!0&&(yt.length=0,k.length=0,yt.push(t.COLOR_ATTACHMENT0+ge),C.depthBuffer&&C.resolveDepthBuffer===!1&&(yt.push(q),k.push(q),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,k)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,yt))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ue)for(let ge=0;ge<E.length;ge++){n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ge,t.RENDERBUFFER,Ee.__webglColorRenderbuffer[ge]);const We=i.get(E[ge]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ge,t.TEXTURE_2D,We,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const E=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[E])}}}function Ve(C){return Math.min(r.maxSamples,C.samples)}function He(C){const E=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ae(C){const E=a.render.frame;d.get(C)!==E&&(d.set(C,E),C.update())}function ot(C,E){const O=C.colorSpace,K=C.format,te=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||O!==Bs&&O!==Hi&&(Xe.getTransfer(O)===tt?(K!==Vn||te!==Ai)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),E}function Te(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=H,this.setTexture2D=Y,this.setTexture2DArray=W,this.setTexture3D=Q,this.setTextureCube=L,this.rebindTextures=ze,this.setupRenderTarget=pt,this.updateRenderTargetMipmap=Ge,this.updateMultisampleRenderTarget=vn,this.setupDepthRenderbuffer=Pe,this.setupFrameBufferTexture=me,this.useMultisampledRTT=He}function sA(t,e){function n(i,r=Hi){let s;const a=Xe.getTransfer(r);if(i===Ai)return t.UNSIGNED_BYTE;if(i===Vf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Hf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===Iv)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Lv)return t.BYTE;if(i===Dv)return t.SHORT;if(i===Oa)return t.UNSIGNED_SHORT;if(i===Bf)return t.INT;if(i===Ir)return t.UNSIGNED_INT;if(i===vi)return t.FLOAT;if(i===Wa)return t.HALF_FLOAT;if(i===Uv)return t.ALPHA;if(i===kv)return t.RGB;if(i===Vn)return t.RGBA;if(i===Fv)return t.LUMINANCE;if(i===Ov)return t.LUMINANCE_ALPHA;if(i===Ss)return t.DEPTH_COMPONENT;if(i===Is)return t.DEPTH_STENCIL;if(i===zv)return t.RED;if(i===jf)return t.RED_INTEGER;if(i===Bv)return t.RG;if(i===Gf)return t.RG_INTEGER;if(i===Wf)return t.RGBA_INTEGER;if(i===Qo||i===Jo||i===el||i===tl)if(a===tt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Qo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Jo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===el)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===tl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Qo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Jo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===el)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===tl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===hd||i===pd||i===md||i===gd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===hd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===md)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===gd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===xd||i===vd||i===_d)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===xd||i===vd)return a===tt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===_d)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===yd||i===Sd||i===Md||i===Ed||i===wd||i===Td||i===Ad||i===bd||i===Cd||i===Rd||i===Nd||i===Pd||i===Ld||i===Dd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===yd)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Sd)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Md)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ed)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===wd)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Td)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ad)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===bd)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Cd)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Rd)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Nd)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Pd)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ld)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Dd)return a===tt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===nl||i===Id||i===Ud)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===nl)return a===tt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Id)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ud)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Vv||i===kd||i===Fd||i===Od)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===nl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===kd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Fd)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Od)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ds?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class aA extends wn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ua extends on{constructor(){super(),this.isGroup=!0,this.type="Group"}}const oA={type:"move"};class tu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ua,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ua,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ua,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const g=n.getJointPose(_,i),u=this._getHandJoint(c,_);g!==null&&(u.matrix.fromArray(g.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=g.radius),u.visible=g!==null}const d=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],h=d.position.distanceTo(p.position),m=.02,x=.005;c.inputState.pinching&&h>m+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=m-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(oA)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new ua;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const lA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,cA=`
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

}`;class uA{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new an,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new rr({vertexShader:lA,fragmentShader:cA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Jn(new Kl(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dA extends Vs{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,d=null,p=null,h=null,m=null,x=null;const _=new uA,g=n.getContextAttributes();let u=null,v=null;const y=[],S=[],N=new it;let b=null;const A=new wn;A.viewport=new Mt;const R=new wn;R.viewport=new Mt;const w=[A,R],M=new aA;let P=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let ie=y[X];return ie===void 0&&(ie=new tu,y[X]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(X){let ie=y[X];return ie===void 0&&(ie=new tu,y[X]=ie),ie.getGripSpace()},this.getHand=function(X){let ie=y[X];return ie===void 0&&(ie=new tu,y[X]=ie),ie.getHandSpace()};function F(X){const ie=S.indexOf(X.inputSource);if(ie===-1)return;const me=y[ie];me!==void 0&&(me.update(X.inputSource,X.frame,c||a),me.dispatchEvent({type:X.type,data:X.inputSource}))}function G(){r.removeEventListener("select",F),r.removeEventListener("selectstart",F),r.removeEventListener("selectend",F),r.removeEventListener("squeeze",F),r.removeEventListener("squeezestart",F),r.removeEventListener("squeezeend",F),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",Y);for(let X=0;X<y.length;X++){const ie=S[X];ie!==null&&(S[X]=null,y[X].disconnect(ie))}P=null,H=null,_.reset(),e.setRenderTarget(u),m=null,h=null,p=null,r=null,v=null,qe.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(N.width,N.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return p},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",F),r.addEventListener("selectstart",F),r.addEventListener("selectend",F),r.addEventListener("squeeze",F),r.addEventListener("squeezestart",F),r.addEventListener("squeezeend",F),r.addEventListener("end",G),r.addEventListener("inputsourceschange",Y),g.xrCompatible!==!0&&await n.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(N),r.renderState.layers===void 0){const ie={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,n,ie),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),v=new Ur(m.framebufferWidth,m.framebufferHeight,{format:Vn,type:Ai,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let ie=null,me=null,ae=null;g.depth&&(ae=g.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ie=g.stencil?Is:Ss,me=g.stencil?Ds:Ir);const Ce={colorFormat:n.RGBA8,depthFormat:ae,scaleFactor:s};p=new XRWebGLBinding(r,n),h=p.createProjectionLayer(Ce),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new Ur(h.textureWidth,h.textureHeight,{format:Vn,type:Ai,depthTexture:new n0(h.textureWidth,h.textureHeight,me,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),qe.setContext(r),qe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function Y(X){for(let ie=0;ie<X.removed.length;ie++){const me=X.removed[ie],ae=S.indexOf(me);ae>=0&&(S[ae]=null,y[ae].disconnect(me))}for(let ie=0;ie<X.added.length;ie++){const me=X.added[ie];let ae=S.indexOf(me);if(ae===-1){for(let Pe=0;Pe<y.length;Pe++)if(Pe>=S.length){S.push(me),ae=Pe;break}else if(S[Pe]===null){S[Pe]=me,ae=Pe;break}if(ae===-1)break}const Ce=y[ae];Ce&&Ce.connect(me)}}const W=new V,Q=new V;function L(X,ie,me){W.setFromMatrixPosition(ie.matrixWorld),Q.setFromMatrixPosition(me.matrixWorld);const ae=W.distanceTo(Q),Ce=ie.projectionMatrix.elements,Pe=me.projectionMatrix.elements,ze=Ce[14]/(Ce[10]-1),pt=Ce[14]/(Ce[10]+1),Ge=(Ce[9]+1)/Ce[5],yt=(Ce[9]-1)/Ce[5],k=(Ce[8]-1)/Ce[0],vn=(Pe[8]+1)/Pe[0],Ve=ze*k,He=ze*vn,Ae=ae/(-k+vn),ot=Ae*-k;if(ie.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(ot),X.translateZ(Ae),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Ce[10]===-1)X.projectionMatrix.copy(ie.projectionMatrix),X.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const Te=ze+Ae,C=pt+Ae,E=Ve-ot,O=He+(ae-ot),K=Ge*pt/C*Te,te=yt*pt/C*Te;X.projectionMatrix.makePerspective(E,O,K,te,Te,C),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function $(X,ie){ie===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(ie.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let ie=X.near,me=X.far;_.texture!==null&&(_.depthNear>0&&(ie=_.depthNear),_.depthFar>0&&(me=_.depthFar)),M.near=R.near=A.near=ie,M.far=R.far=A.far=me,(P!==M.near||H!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,H=M.far),A.layers.mask=X.layers.mask|2,R.layers.mask=X.layers.mask|4,M.layers.mask=A.layers.mask|R.layers.mask;const ae=X.parent,Ce=M.cameras;$(M,ae);for(let Pe=0;Pe<Ce.length;Pe++)$(Ce[Pe],ae);Ce.length===2?L(M,A,R):M.projectionMatrix.copy(A.projectionMatrix),J(X,M,ae)};function J(X,ie,me){me===null?X.matrix.copy(ie.matrixWorld):(X.matrix.copy(me.matrixWorld),X.matrix.invert(),X.matrix.multiply(ie.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(ie.projectionMatrix),X.projectionMatrixInverse.copy(ie.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=zd*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(X){l=X,h!==null&&(h.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let oe=null;function Me(X,ie){if(d=ie.getViewerPose(c||a),x=ie,d!==null){const me=d.views;m!==null&&(e.setRenderTargetFramebuffer(v,m.framebuffer),e.setRenderTarget(v));let ae=!1;me.length!==M.cameras.length&&(M.cameras.length=0,ae=!0);for(let Pe=0;Pe<me.length;Pe++){const ze=me[Pe];let pt=null;if(m!==null)pt=m.getViewport(ze);else{const yt=p.getViewSubImage(h,ze);pt=yt.viewport,Pe===0&&(e.setRenderTargetTextures(v,yt.colorTexture,h.ignoreDepthValues?void 0:yt.depthStencilTexture),e.setRenderTarget(v))}let Ge=w[Pe];Ge===void 0&&(Ge=new wn,Ge.layers.enable(Pe),Ge.viewport=new Mt,w[Pe]=Ge),Ge.matrix.fromArray(ze.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(ze.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(pt.x,pt.y,pt.width,pt.height),Pe===0&&(M.matrix.copy(Ge.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ae===!0&&M.cameras.push(Ge)}const Ce=r.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")){const Pe=p.getDepthInformation(me[0]);Pe&&Pe.isValid&&Pe.texture&&_.init(e,Pe,r.renderState)}}for(let me=0;me<y.length;me++){const ae=S[me],Ce=y[me];ae!==null&&Ce!==void 0&&Ce.update(ae,ie,c||a)}oe&&oe(X,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),x=null}const qe=new t0;qe.setAnimationLoop(Me),this.setAnimationLoop=function(X){oe=X},this.dispose=function(){}}}const mr=new bi,fA=new Et;function hA(t,e){function n(g,u){g.matrixAutoUpdate===!0&&g.updateMatrix(),u.value.copy(g.matrix)}function i(g,u){u.color.getRGB(g.fogColor.value,Zv(t)),u.isFog?(g.fogNear.value=u.near,g.fogFar.value=u.far):u.isFogExp2&&(g.fogDensity.value=u.density)}function r(g,u,v,y,S){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(g,u):u.isMeshToonMaterial?(s(g,u),p(g,u)):u.isMeshPhongMaterial?(s(g,u),d(g,u)):u.isMeshStandardMaterial?(s(g,u),h(g,u),u.isMeshPhysicalMaterial&&m(g,u,S)):u.isMeshMatcapMaterial?(s(g,u),x(g,u)):u.isMeshDepthMaterial?s(g,u):u.isMeshDistanceMaterial?(s(g,u),_(g,u)):u.isMeshNormalMaterial?s(g,u):u.isLineBasicMaterial?(a(g,u),u.isLineDashedMaterial&&o(g,u)):u.isPointsMaterial?l(g,u,v,y):u.isSpriteMaterial?c(g,u):u.isShadowMaterial?(g.color.value.copy(u.color),g.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(g,u){g.opacity.value=u.opacity,u.color&&g.diffuse.value.copy(u.color),u.emissive&&g.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(g.map.value=u.map,n(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,n(u.alphaMap,g.alphaMapTransform)),u.bumpMap&&(g.bumpMap.value=u.bumpMap,n(u.bumpMap,g.bumpMapTransform),g.bumpScale.value=u.bumpScale,u.side===sn&&(g.bumpScale.value*=-1)),u.normalMap&&(g.normalMap.value=u.normalMap,n(u.normalMap,g.normalMapTransform),g.normalScale.value.copy(u.normalScale),u.side===sn&&g.normalScale.value.negate()),u.displacementMap&&(g.displacementMap.value=u.displacementMap,n(u.displacementMap,g.displacementMapTransform),g.displacementScale.value=u.displacementScale,g.displacementBias.value=u.displacementBias),u.emissiveMap&&(g.emissiveMap.value=u.emissiveMap,n(u.emissiveMap,g.emissiveMapTransform)),u.specularMap&&(g.specularMap.value=u.specularMap,n(u.specularMap,g.specularMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest);const v=e.get(u),y=v.envMap,S=v.envMapRotation;y&&(g.envMap.value=y,mr.copy(S),mr.x*=-1,mr.y*=-1,mr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(mr.y*=-1,mr.z*=-1),g.envMapRotation.value.setFromMatrix4(fA.makeRotationFromEuler(mr)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=u.reflectivity,g.ior.value=u.ior,g.refractionRatio.value=u.refractionRatio),u.lightMap&&(g.lightMap.value=u.lightMap,g.lightMapIntensity.value=u.lightMapIntensity,n(u.lightMap,g.lightMapTransform)),u.aoMap&&(g.aoMap.value=u.aoMap,g.aoMapIntensity.value=u.aoMapIntensity,n(u.aoMap,g.aoMapTransform))}function a(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,u.map&&(g.map.value=u.map,n(u.map,g.mapTransform))}function o(g,u){g.dashSize.value=u.dashSize,g.totalSize.value=u.dashSize+u.gapSize,g.scale.value=u.scale}function l(g,u,v,y){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.size.value=u.size*v,g.scale.value=y*.5,u.map&&(g.map.value=u.map,n(u.map,g.uvTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,n(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function c(g,u){g.diffuse.value.copy(u.color),g.opacity.value=u.opacity,g.rotation.value=u.rotation,u.map&&(g.map.value=u.map,n(u.map,g.mapTransform)),u.alphaMap&&(g.alphaMap.value=u.alphaMap,n(u.alphaMap,g.alphaMapTransform)),u.alphaTest>0&&(g.alphaTest.value=u.alphaTest)}function d(g,u){g.specular.value.copy(u.specular),g.shininess.value=Math.max(u.shininess,1e-4)}function p(g,u){u.gradientMap&&(g.gradientMap.value=u.gradientMap)}function h(g,u){g.metalness.value=u.metalness,u.metalnessMap&&(g.metalnessMap.value=u.metalnessMap,n(u.metalnessMap,g.metalnessMapTransform)),g.roughness.value=u.roughness,u.roughnessMap&&(g.roughnessMap.value=u.roughnessMap,n(u.roughnessMap,g.roughnessMapTransform)),u.envMap&&(g.envMapIntensity.value=u.envMapIntensity)}function m(g,u,v){g.ior.value=u.ior,u.sheen>0&&(g.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),g.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(g.sheenColorMap.value=u.sheenColorMap,n(u.sheenColorMap,g.sheenColorMapTransform)),u.sheenRoughnessMap&&(g.sheenRoughnessMap.value=u.sheenRoughnessMap,n(u.sheenRoughnessMap,g.sheenRoughnessMapTransform))),u.clearcoat>0&&(g.clearcoat.value=u.clearcoat,g.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(g.clearcoatMap.value=u.clearcoatMap,n(u.clearcoatMap,g.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,n(u.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(g.clearcoatNormalMap.value=u.clearcoatNormalMap,n(u.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===sn&&g.clearcoatNormalScale.value.negate())),u.dispersion>0&&(g.dispersion.value=u.dispersion),u.iridescence>0&&(g.iridescence.value=u.iridescence,g.iridescenceIOR.value=u.iridescenceIOR,g.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(g.iridescenceMap.value=u.iridescenceMap,n(u.iridescenceMap,g.iridescenceMapTransform)),u.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=u.iridescenceThicknessMap,n(u.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),u.transmission>0&&(g.transmission.value=u.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),u.transmissionMap&&(g.transmissionMap.value=u.transmissionMap,n(u.transmissionMap,g.transmissionMapTransform)),g.thickness.value=u.thickness,u.thicknessMap&&(g.thicknessMap.value=u.thicknessMap,n(u.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=u.attenuationDistance,g.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(g.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(g.anisotropyMap.value=u.anisotropyMap,n(u.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=u.specularIntensity,g.specularColor.value.copy(u.specularColor),u.specularColorMap&&(g.specularColorMap.value=u.specularColorMap,n(u.specularColorMap,g.specularColorMapTransform)),u.specularIntensityMap&&(g.specularIntensityMap.value=u.specularIntensityMap,n(u.specularIntensityMap,g.specularIntensityMapTransform))}function x(g,u){u.matcap&&(g.matcap.value=u.matcap)}function _(g,u){const v=e.get(u).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function pA(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,y){const S=y.program;i.uniformBlockBinding(v,S)}function c(v,y){let S=r[v.id];S===void 0&&(x(v),S=d(v),r[v.id]=S,v.addEventListener("dispose",g));const N=y.program;i.updateUBOMapping(v,N);const b=e.render.frame;s[v.id]!==b&&(h(v),s[v.id]=b)}function d(v){const y=p();v.__bindingPointIndex=y;const S=t.createBuffer(),N=v.__size,b=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,S),t.bufferData(t.UNIFORM_BUFFER,N,b),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,y,S),S}function p(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const y=r[v.id],S=v.uniforms,N=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,y);for(let b=0,A=S.length;b<A;b++){const R=Array.isArray(S[b])?S[b]:[S[b]];for(let w=0,M=R.length;w<M;w++){const P=R[w];if(m(P,b,w,N)===!0){const H=P.__offset,F=Array.isArray(P.value)?P.value:[P.value];let G=0;for(let Y=0;Y<F.length;Y++){const W=F[Y],Q=_(W);typeof W=="number"||typeof W=="boolean"?(P.__data[0]=W,t.bufferSubData(t.UNIFORM_BUFFER,H+G,P.__data)):W.isMatrix3?(P.__data[0]=W.elements[0],P.__data[1]=W.elements[1],P.__data[2]=W.elements[2],P.__data[3]=0,P.__data[4]=W.elements[3],P.__data[5]=W.elements[4],P.__data[6]=W.elements[5],P.__data[7]=0,P.__data[8]=W.elements[6],P.__data[9]=W.elements[7],P.__data[10]=W.elements[8],P.__data[11]=0):(W.toArray(P.__data,G),G+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,H,P.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(v,y,S,N){const b=v.value,A=y+"_"+S;if(N[A]===void 0)return typeof b=="number"||typeof b=="boolean"?N[A]=b:N[A]=b.clone(),!0;{const R=N[A];if(typeof b=="number"||typeof b=="boolean"){if(R!==b)return N[A]=b,!0}else if(R.equals(b)===!1)return R.copy(b),!0}return!1}function x(v){const y=v.uniforms;let S=0;const N=16;for(let A=0,R=y.length;A<R;A++){const w=Array.isArray(y[A])?y[A]:[y[A]];for(let M=0,P=w.length;M<P;M++){const H=w[M],F=Array.isArray(H.value)?H.value:[H.value];for(let G=0,Y=F.length;G<Y;G++){const W=F[G],Q=_(W),L=S%N,$=L%Q.boundary,J=L+$;S+=$,J!==0&&N-J<Q.storage&&(S+=N-J),H.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=S,S+=Q.storage}}}const b=S%N;return b>0&&(S+=N-b),v.__size=S,v.__cache={},this}function _(v){const y={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(y.boundary=4,y.storage=4):v.isVector2?(y.boundary=8,y.storage=8):v.isVector3||v.isColor?(y.boundary=16,y.storage=12):v.isVector4?(y.boundary=16,y.storage=16):v.isMatrix3?(y.boundary=48,y.storage=48):v.isMatrix4?(y.boundary=64,y.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),y}function g(v){const y=v.target;y.removeEventListener("dispose",g);const S=a.indexOf(y.__bindingPointIndex);a.splice(S,1),t.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function u(){for(const v in r)t.deleteBuffer(r[v]);a=[],r={},s={}}return{bind:l,update:c,dispose:u}}class mA{constructor(e={}){const{canvas:n=nM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:p=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const x=new Uint32Array(4),_=new Int32Array(4);let g=null,u=null;const v=[],y=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Sn,this.toneMapping=er,this.toneMappingExposure=1;const S=this;let N=!1,b=0,A=0,R=null,w=-1,M=null;const P=new Mt,H=new Mt;let F=null;const G=new Oe(0);let Y=0,W=n.width,Q=n.height,L=1,$=null,J=null;const oe=new Mt(0,0,W,Q),Me=new Mt(0,0,W,Q);let qe=!1;const X=new e0;let ie=!1,me=!1;const ae=new Et,Ce=new Et,Pe=new V,ze=new Mt,pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ge=!1;function yt(){return R===null?L:1}let k=i;function vn(T,I){return n.getContext(T,I)}try{const T={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:p};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${zf}`),n.addEventListener("webglcontextlost",Z,!1),n.addEventListener("webglcontextrestored",he,!1),n.addEventListener("webglcontextcreationerror",de,!1),k===null){const I="webgl2";if(k=vn(I,T),k===null)throw vn(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Ve,He,Ae,ot,Te,C,E,O,K,te,q,Ee,ue,ge,We,re,xe,be,Re,ve,je,Ue,rt,D;function ce(){Ve=new yw(k),Ve.init(),Ue=new sA(k,Ve),He=new hw(k,Ve,e,Ue),Ae=new nA(k,Ve),He.reverseDepthBuffer&&h&&Ae.buffers.depth.setReversed(!0),ot=new Ew(k),Te=new VT,C=new rA(k,Ve,Ae,Te,He,Ue,ot),E=new mw(S),O=new _w(S),K=new RM(k),rt=new dw(k,K),te=new Sw(k,K,ot,rt),q=new Tw(k,te,K,ot),Re=new ww(k,He,C),re=new pw(Te),Ee=new BT(S,E,O,Ve,He,rt,re),ue=new hA(S,Te),ge=new jT,We=new YT(Ve),be=new uw(S,E,O,Ae,q,m,l),xe=new eA(S,q,He),D=new pA(k,ot,He,Ae),ve=new fw(k,Ve,ot),je=new Mw(k,Ve,ot),ot.programs=Ee.programs,S.capabilities=He,S.extensions=Ve,S.properties=Te,S.renderLists=ge,S.shadowMap=xe,S.state=Ae,S.info=ot}ce();const j=new dA(S,k);this.xr=j,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const T=Ve.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ve.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return L},this.setPixelRatio=function(T){T!==void 0&&(L=T,this.setSize(W,Q,!1))},this.getSize=function(T){return T.set(W,Q)},this.setSize=function(T,I,z=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=T,Q=I,n.width=Math.floor(T*L),n.height=Math.floor(I*L),z===!0&&(n.style.width=T+"px",n.style.height=I+"px"),this.setViewport(0,0,T,I)},this.getDrawingBufferSize=function(T){return T.set(W*L,Q*L).floor()},this.setDrawingBufferSize=function(T,I,z){W=T,Q=I,L=z,n.width=Math.floor(T*z),n.height=Math.floor(I*z),this.setViewport(0,0,T,I)},this.getCurrentViewport=function(T){return T.copy(P)},this.getViewport=function(T){return T.copy(oe)},this.setViewport=function(T,I,z,B){T.isVector4?oe.set(T.x,T.y,T.z,T.w):oe.set(T,I,z,B),Ae.viewport(P.copy(oe).multiplyScalar(L).round())},this.getScissor=function(T){return T.copy(Me)},this.setScissor=function(T,I,z,B){T.isVector4?Me.set(T.x,T.y,T.z,T.w):Me.set(T,I,z,B),Ae.scissor(H.copy(Me).multiplyScalar(L).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(T){Ae.setScissorTest(qe=T)},this.setOpaqueSort=function(T){$=T},this.setTransparentSort=function(T){J=T},this.getClearColor=function(T){return T.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor.apply(be,arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha.apply(be,arguments)},this.clear=function(T=!0,I=!0,z=!0){let B=0;if(T){let U=!1;if(R!==null){const se=R.texture.format;U=se===Wf||se===Gf||se===jf}if(U){const se=R.texture.type,fe=se===Ai||se===Ir||se===Oa||se===Ds||se===Vf||se===Hf,_e=be.getClearColor(),ye=be.getClearAlpha(),Ne=_e.r,De=_e.g,Se=_e.b;fe?(x[0]=Ne,x[1]=De,x[2]=Se,x[3]=ye,k.clearBufferuiv(k.COLOR,0,x)):(_[0]=Ne,_[1]=De,_[2]=Se,_[3]=ye,k.clearBufferiv(k.COLOR,0,_))}else B|=k.COLOR_BUFFER_BIT}I&&(B|=k.DEPTH_BUFFER_BIT),z&&(B|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Z,!1),n.removeEventListener("webglcontextrestored",he,!1),n.removeEventListener("webglcontextcreationerror",de,!1),ge.dispose(),We.dispose(),Te.dispose(),E.dispose(),O.dispose(),q.dispose(),rt.dispose(),D.dispose(),Ee.dispose(),j.dispose(),j.removeEventListener("sessionstart",Yf),j.removeEventListener("sessionend",Kf),lr.stop()};function Z(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function he(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;const T=ot.autoReset,I=xe.enabled,z=xe.autoUpdate,B=xe.needsUpdate,U=xe.type;ce(),ot.autoReset=T,xe.enabled=I,xe.autoUpdate=z,xe.needsUpdate=B,xe.type=U}function de(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Le(T){const I=T.target;I.removeEventListener("dispose",Le),vt(I)}function vt(T){Ot(T),Te.remove(T)}function Ot(T){const I=Te.get(T).programs;I!==void 0&&(I.forEach(function(z){Ee.releaseProgram(z)}),T.isShaderMaterial&&Ee.releaseShaderCache(T))}this.renderBufferDirect=function(T,I,z,B,U,se){I===null&&(I=pt);const fe=U.isMesh&&U.matrixWorld.determinant()<0,_e=u0(T,I,z,B,U);Ae.setMaterial(B,fe);let ye=z.index,Ne=1;if(B.wireframe===!0){if(ye=te.getWireframeAttribute(z),ye===void 0)return;Ne=2}const De=z.drawRange,Se=z.attributes.position;let Ye=De.start*Ne,st=(De.start+De.count)*Ne;se!==null&&(Ye=Math.max(Ye,se.start*Ne),st=Math.min(st,(se.start+se.count)*Ne)),ye!==null?(Ye=Math.max(Ye,0),st=Math.min(st,ye.count)):Se!=null&&(Ye=Math.max(Ye,0),st=Math.min(st,Se.count));const lt=st-Ye;if(lt<0||lt===1/0)return;rt.setup(U,B,_e,z,ye);let Kt,Ke=ve;if(ye!==null&&(Kt=K.get(ye),Ke=je,Ke.setIndex(Kt)),U.isMesh)B.wireframe===!0?(Ae.setLineWidth(B.wireframeLinewidth*yt()),Ke.setMode(k.LINES)):Ke.setMode(k.TRIANGLES);else if(U.isLine){let we=B.linewidth;we===void 0&&(we=1),Ae.setLineWidth(we*yt()),U.isLineSegments?Ke.setMode(k.LINES):U.isLineLoop?Ke.setMode(k.LINE_LOOP):Ke.setMode(k.LINE_STRIP)}else U.isPoints?Ke.setMode(k.POINTS):U.isSprite&&Ke.setMode(k.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Ke.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Ve.get("WEBGL_multi_draw"))Ke.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const we=U._multiDrawStarts,ai=U._multiDrawCounts,Ze=U._multiDrawCount,Ln=ye?K.get(ye).bytesPerElement:1,zr=Te.get(B).currentProgram.getUniforms();for(let cn=0;cn<Ze;cn++)zr.setValue(k,"_gl_DrawID",cn),Ke.render(we[cn]/Ln,ai[cn])}else if(U.isInstancedMesh)Ke.renderInstances(Ye,lt,U.count);else if(z.isInstancedBufferGeometry){const we=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,ai=Math.min(z.instanceCount,we);Ke.renderInstances(Ye,lt,ai)}else Ke.render(Ye,lt)};function Qe(T,I,z){T.transparent===!0&&T.side===mi&&T.forceSinglePass===!1?(T.side=sn,T.needsUpdate=!0,Qa(T,I,z),T.side=ir,T.needsUpdate=!0,Qa(T,I,z),T.side=mi):Qa(T,I,z)}this.compile=function(T,I,z=null){z===null&&(z=T),u=We.get(z),u.init(I),y.push(u),z.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(u.pushLight(U),U.castShadow&&u.pushShadow(U))}),T!==z&&T.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(u.pushLight(U),U.castShadow&&u.pushShadow(U))}),u.setupLights();const B=new Set;return T.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const se=U.material;if(se)if(Array.isArray(se))for(let fe=0;fe<se.length;fe++){const _e=se[fe];Qe(_e,z,U),B.add(_e)}else Qe(se,z,U),B.add(se)}),y.pop(),u=null,B},this.compileAsync=function(T,I,z=null){const B=this.compile(T,I,z);return new Promise(U=>{function se(){if(B.forEach(function(fe){Te.get(fe).currentProgram.isReady()&&B.delete(fe)}),B.size===0){U(T);return}setTimeout(se,10)}Ve.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Pn=null;function si(T){Pn&&Pn(T)}function Yf(){lr.stop()}function Kf(){lr.start()}const lr=new t0;lr.setAnimationLoop(si),typeof self<"u"&&lr.setContext(self),this.setAnimationLoop=function(T){Pn=T,j.setAnimationLoop(T),T===null?lr.stop():lr.start()},j.addEventListener("sessionstart",Yf),j.addEventListener("sessionend",Kf),this.render=function(T,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(I),I=j.getCamera()),T.isScene===!0&&T.onBeforeRender(S,T,I,R),u=We.get(T,y.length),u.init(I),y.push(u),Ce.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),X.setFromProjectionMatrix(Ce),me=this.localClippingEnabled,ie=re.init(this.clippingPlanes,me),g=ge.get(T,v.length),g.init(),v.push(g),j.enabled===!0&&j.isPresenting===!0){const se=S.xr.getDepthSensingMesh();se!==null&&Ql(se,I,-1/0,S.sortObjects)}Ql(T,I,0,S.sortObjects),g.finish(),S.sortObjects===!0&&g.sort($,J),Ge=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,Ge&&be.addToRenderList(g,T),this.info.render.frame++,ie===!0&&re.beginShadows();const z=u.state.shadowsArray;xe.render(z,T,I),ie===!0&&re.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=g.opaque,U=g.transmissive;if(u.setupLights(),I.isArrayCamera){const se=I.cameras;if(U.length>0)for(let fe=0,_e=se.length;fe<_e;fe++){const ye=se[fe];Qf(B,U,T,ye)}Ge&&be.render(T);for(let fe=0,_e=se.length;fe<_e;fe++){const ye=se[fe];Zf(g,T,ye,ye.viewport)}}else U.length>0&&Qf(B,U,T,I),Ge&&be.render(T),Zf(g,T,I);R!==null&&(C.updateMultisampleRenderTarget(R),C.updateRenderTargetMipmap(R)),T.isScene===!0&&T.onAfterRender(S,T,I),rt.resetDefaultState(),w=-1,M=null,y.pop(),y.length>0?(u=y[y.length-1],ie===!0&&re.setGlobalState(S.clippingPlanes,u.state.camera)):u=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function Ql(T,I,z,B){if(T.visible===!1)return;if(T.layers.test(I.layers)){if(T.isGroup)z=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(I);else if(T.isLight)u.pushLight(T),T.castShadow&&u.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||X.intersectsSprite(T)){B&&ze.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Ce);const fe=q.update(T),_e=T.material;_e.visible&&g.push(T,fe,_e,z,ze.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||X.intersectsObject(T))){const fe=q.update(T),_e=T.material;if(B&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),ze.copy(T.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),ze.copy(fe.boundingSphere.center)),ze.applyMatrix4(T.matrixWorld).applyMatrix4(Ce)),Array.isArray(_e)){const ye=fe.groups;for(let Ne=0,De=ye.length;Ne<De;Ne++){const Se=ye[Ne],Ye=_e[Se.materialIndex];Ye&&Ye.visible&&g.push(T,fe,Ye,z,ze.z,Se)}}else _e.visible&&g.push(T,fe,_e,z,ze.z,null)}}const se=T.children;for(let fe=0,_e=se.length;fe<_e;fe++)Ql(se[fe],I,z,B)}function Zf(T,I,z,B){const U=T.opaque,se=T.transmissive,fe=T.transparent;u.setupLightsView(z),ie===!0&&re.setGlobalState(S.clippingPlanes,z),B&&Ae.viewport(P.copy(B)),U.length>0&&Za(U,I,z),se.length>0&&Za(se,I,z),fe.length>0&&Za(fe,I,z),Ae.buffers.depth.setTest(!0),Ae.buffers.depth.setMask(!0),Ae.buffers.color.setMask(!0),Ae.setPolygonOffset(!1)}function Qf(T,I,z,B){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[B.id]===void 0&&(u.state.transmissionRenderTarget[B.id]=new Ur(1,1,{generateMipmaps:!0,type:Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float")?Wa:Ai,minFilter:Ar,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Xe.workingColorSpace}));const se=u.state.transmissionRenderTarget[B.id],fe=B.viewport||P;se.setSize(fe.z,fe.w);const _e=S.getRenderTarget();S.setRenderTarget(se),S.getClearColor(G),Y=S.getClearAlpha(),Y<1&&S.setClearColor(16777215,.5),S.clear(),Ge&&be.render(z);const ye=S.toneMapping;S.toneMapping=er;const Ne=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),u.setupLightsView(B),ie===!0&&re.setGlobalState(S.clippingPlanes,B),Za(T,z,B),C.updateMultisampleRenderTarget(se),C.updateRenderTargetMipmap(se),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let De=!1;for(let Se=0,Ye=I.length;Se<Ye;Se++){const st=I[Se],lt=st.object,Kt=st.geometry,Ke=st.material,we=st.group;if(Ke.side===mi&&lt.layers.test(B.layers)){const ai=Ke.side;Ke.side=sn,Ke.needsUpdate=!0,Jf(lt,z,B,Kt,Ke,we),Ke.side=ai,Ke.needsUpdate=!0,De=!0}}De===!0&&(C.updateMultisampleRenderTarget(se),C.updateRenderTargetMipmap(se))}S.setRenderTarget(_e),S.setClearColor(G,Y),Ne!==void 0&&(B.viewport=Ne),S.toneMapping=ye}function Za(T,I,z){const B=I.isScene===!0?I.overrideMaterial:null;for(let U=0,se=T.length;U<se;U++){const fe=T[U],_e=fe.object,ye=fe.geometry,Ne=B===null?fe.material:B,De=fe.group;_e.layers.test(z.layers)&&Jf(_e,I,z,ye,Ne,De)}}function Jf(T,I,z,B,U,se){T.onBeforeRender(S,I,z,B,U,se),T.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),U.onBeforeRender(S,I,z,B,T,se),U.transparent===!0&&U.side===mi&&U.forceSinglePass===!1?(U.side=sn,U.needsUpdate=!0,S.renderBufferDirect(z,I,B,U,T,se),U.side=ir,U.needsUpdate=!0,S.renderBufferDirect(z,I,B,U,T,se),U.side=mi):S.renderBufferDirect(z,I,B,U,T,se),T.onAfterRender(S,I,z,B,U,se)}function Qa(T,I,z){I.isScene!==!0&&(I=pt);const B=Te.get(T),U=u.state.lights,se=u.state.shadowsArray,fe=U.state.version,_e=Ee.getParameters(T,U.state,se,I,z),ye=Ee.getProgramCacheKey(_e);let Ne=B.programs;B.environment=T.isMeshStandardMaterial?I.environment:null,B.fog=I.fog,B.envMap=(T.isMeshStandardMaterial?O:E).get(T.envMap||B.environment),B.envMapRotation=B.environment!==null&&T.envMap===null?I.environmentRotation:T.envMapRotation,Ne===void 0&&(T.addEventListener("dispose",Le),Ne=new Map,B.programs=Ne);let De=Ne.get(ye);if(De!==void 0){if(B.currentProgram===De&&B.lightsStateVersion===fe)return th(T,_e),De}else _e.uniforms=Ee.getUniforms(T),T.onBeforeCompile(_e,S),De=Ee.acquireProgram(_e,ye),Ne.set(ye,De),B.uniforms=_e.uniforms;const Se=B.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Se.clippingPlanes=re.uniform),th(T,_e),B.needsLights=f0(T),B.lightsStateVersion=fe,B.needsLights&&(Se.ambientLightColor.value=U.state.ambient,Se.lightProbe.value=U.state.probe,Se.directionalLights.value=U.state.directional,Se.directionalLightShadows.value=U.state.directionalShadow,Se.spotLights.value=U.state.spot,Se.spotLightShadows.value=U.state.spotShadow,Se.rectAreaLights.value=U.state.rectArea,Se.ltc_1.value=U.state.rectAreaLTC1,Se.ltc_2.value=U.state.rectAreaLTC2,Se.pointLights.value=U.state.point,Se.pointLightShadows.value=U.state.pointShadow,Se.hemisphereLights.value=U.state.hemi,Se.directionalShadowMap.value=U.state.directionalShadowMap,Se.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Se.spotShadowMap.value=U.state.spotShadowMap,Se.spotLightMatrix.value=U.state.spotLightMatrix,Se.spotLightMap.value=U.state.spotLightMap,Se.pointShadowMap.value=U.state.pointShadowMap,Se.pointShadowMatrix.value=U.state.pointShadowMatrix),B.currentProgram=De,B.uniformsList=null,De}function eh(T){if(T.uniformsList===null){const I=T.currentProgram.getUniforms();T.uniformsList=il.seqWithValue(I.seq,T.uniforms)}return T.uniformsList}function th(T,I){const z=Te.get(T);z.outputColorSpace=I.outputColorSpace,z.batching=I.batching,z.batchingColor=I.batchingColor,z.instancing=I.instancing,z.instancingColor=I.instancingColor,z.instancingMorph=I.instancingMorph,z.skinning=I.skinning,z.morphTargets=I.morphTargets,z.morphNormals=I.morphNormals,z.morphColors=I.morphColors,z.morphTargetsCount=I.morphTargetsCount,z.numClippingPlanes=I.numClippingPlanes,z.numIntersection=I.numClipIntersection,z.vertexAlphas=I.vertexAlphas,z.vertexTangents=I.vertexTangents,z.toneMapping=I.toneMapping}function u0(T,I,z,B,U){I.isScene!==!0&&(I=pt),C.resetTextureUnits();const se=I.fog,fe=B.isMeshStandardMaterial?I.environment:null,_e=R===null?S.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Bs,ye=(B.isMeshStandardMaterial?O:E).get(B.envMap||fe),Ne=B.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,De=!!z.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Se=!!z.morphAttributes.position,Ye=!!z.morphAttributes.normal,st=!!z.morphAttributes.color;let lt=er;B.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(lt=S.toneMapping);const Kt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Ke=Kt!==void 0?Kt.length:0,we=Te.get(B),ai=u.state.lights;if(ie===!0&&(me===!0||T!==M)){const _n=T===M&&B.id===w;re.setState(B,T,_n)}let Ze=!1;B.version===we.__version?(we.needsLights&&we.lightsStateVersion!==ai.state.version||we.outputColorSpace!==_e||U.isBatchedMesh&&we.batching===!1||!U.isBatchedMesh&&we.batching===!0||U.isBatchedMesh&&we.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&we.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&we.instancing===!1||!U.isInstancedMesh&&we.instancing===!0||U.isSkinnedMesh&&we.skinning===!1||!U.isSkinnedMesh&&we.skinning===!0||U.isInstancedMesh&&we.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&we.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&we.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&we.instancingMorph===!1&&U.morphTexture!==null||we.envMap!==ye||B.fog===!0&&we.fog!==se||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==re.numPlanes||we.numIntersection!==re.numIntersection)||we.vertexAlphas!==Ne||we.vertexTangents!==De||we.morphTargets!==Se||we.morphNormals!==Ye||we.morphColors!==st||we.toneMapping!==lt||we.morphTargetsCount!==Ke)&&(Ze=!0):(Ze=!0,we.__version=B.version);let Ln=we.currentProgram;Ze===!0&&(Ln=Qa(B,I,U));let zr=!1,cn=!1,js=!1;const ct=Ln.getUniforms(),Xn=we.uniforms;if(Ae.useProgram(Ln.program)&&(zr=!0,cn=!0,js=!0),B.id!==w&&(w=B.id,cn=!0),zr||M!==T){Ae.buffers.depth.getReversed()?(ae.copy(T.projectionMatrix),rM(ae),sM(ae),ct.setValue(k,"projectionMatrix",ae)):ct.setValue(k,"projectionMatrix",T.projectionMatrix),ct.setValue(k,"viewMatrix",T.matrixWorldInverse);const Ri=ct.map.cameraPosition;Ri!==void 0&&Ri.setValue(k,Pe.setFromMatrixPosition(T.matrixWorld)),He.logarithmicDepthBuffer&&ct.setValue(k,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&ct.setValue(k,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,cn=!0,js=!0)}if(U.isSkinnedMesh){ct.setOptional(k,U,"bindMatrix"),ct.setOptional(k,U,"bindMatrixInverse");const _n=U.skeleton;_n&&(_n.boneTexture===null&&_n.computeBoneTexture(),ct.setValue(k,"boneTexture",_n.boneTexture,C))}U.isBatchedMesh&&(ct.setOptional(k,U,"batchingTexture"),ct.setValue(k,"batchingTexture",U._matricesTexture,C),ct.setOptional(k,U,"batchingIdTexture"),ct.setValue(k,"batchingIdTexture",U._indirectTexture,C),ct.setOptional(k,U,"batchingColorTexture"),U._colorsTexture!==null&&ct.setValue(k,"batchingColorTexture",U._colorsTexture,C));const Gs=z.morphAttributes;if((Gs.position!==void 0||Gs.normal!==void 0||Gs.color!==void 0)&&Re.update(U,z,Ln),(cn||we.receiveShadow!==U.receiveShadow)&&(we.receiveShadow=U.receiveShadow,ct.setValue(k,"receiveShadow",U.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(Xn.envMap.value=ye,Xn.flipEnvMap.value=ye.isCubeTexture&&ye.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&I.environment!==null&&(Xn.envMapIntensity.value=I.environmentIntensity),cn&&(ct.setValue(k,"toneMappingExposure",S.toneMappingExposure),we.needsLights&&d0(Xn,js),se&&B.fog===!0&&ue.refreshFogUniforms(Xn,se),ue.refreshMaterialUniforms(Xn,B,L,Q,u.state.transmissionRenderTarget[T.id]),il.upload(k,eh(we),Xn,C)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(il.upload(k,eh(we),Xn,C),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&ct.setValue(k,"center",U.center),ct.setValue(k,"modelViewMatrix",U.modelViewMatrix),ct.setValue(k,"normalMatrix",U.normalMatrix),ct.setValue(k,"modelMatrix",U.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const _n=B.uniformsGroups;for(let Ri=0,Ni=_n.length;Ri<Ni;Ri++){const nh=_n[Ri];D.update(nh,Ln),D.bind(nh,Ln)}}return Ln}function d0(T,I){T.ambientLightColor.needsUpdate=I,T.lightProbe.needsUpdate=I,T.directionalLights.needsUpdate=I,T.directionalLightShadows.needsUpdate=I,T.pointLights.needsUpdate=I,T.pointLightShadows.needsUpdate=I,T.spotLights.needsUpdate=I,T.spotLightShadows.needsUpdate=I,T.rectAreaLights.needsUpdate=I,T.hemisphereLights.needsUpdate=I}function f0(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(T,I,z){Te.get(T.texture).__webglTexture=I,Te.get(T.depthTexture).__webglTexture=z;const B=Te.get(T);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=z===void 0,B.__autoAllocateDepthBuffer||Ve.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,I){const z=Te.get(T);z.__webglFramebuffer=I,z.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(T,I=0,z=0){R=T,b=I,A=z;let B=!0,U=null,se=!1,fe=!1;if(T){const ye=Te.get(T);if(ye.__useDefaultFramebuffer!==void 0)Ae.bindFramebuffer(k.FRAMEBUFFER,null),B=!1;else if(ye.__webglFramebuffer===void 0)C.setupRenderTarget(T);else if(ye.__hasExternalTextures)C.rebindTextures(T,Te.get(T.texture).__webglTexture,Te.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Se=T.depthTexture;if(ye.__boundDepthTexture!==Se){if(Se!==null&&Te.has(Se)&&(T.width!==Se.image.width||T.height!==Se.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(T)}}const Ne=T.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(fe=!0);const De=Te.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(De[I])?U=De[I][z]:U=De[I],se=!0):T.samples>0&&C.useMultisampledRTT(T)===!1?U=Te.get(T).__webglMultisampledFramebuffer:Array.isArray(De)?U=De[z]:U=De,P.copy(T.viewport),H.copy(T.scissor),F=T.scissorTest}else P.copy(oe).multiplyScalar(L).floor(),H.copy(Me).multiplyScalar(L).floor(),F=qe;if(Ae.bindFramebuffer(k.FRAMEBUFFER,U)&&B&&Ae.drawBuffers(T,U),Ae.viewport(P),Ae.scissor(H),Ae.setScissorTest(F),se){const ye=Te.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+I,ye.__webglTexture,z)}else if(fe){const ye=Te.get(T.texture),Ne=I||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,ye.__webglTexture,z||0,Ne)}w=-1},this.readRenderTargetPixels=function(T,I,z,B,U,se,fe){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=Te.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&fe!==void 0&&(_e=_e[fe]),_e){Ae.bindFramebuffer(k.FRAMEBUFFER,_e);try{const ye=T.texture,Ne=ye.format,De=ye.type;if(!He.textureFormatReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!He.textureTypeReadable(De)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=T.width-B&&z>=0&&z<=T.height-U&&k.readPixels(I,z,B,U,Ue.convert(Ne),Ue.convert(De),se)}finally{const ye=R!==null?Te.get(R).__webglFramebuffer:null;Ae.bindFramebuffer(k.FRAMEBUFFER,ye)}}},this.readRenderTargetPixelsAsync=async function(T,I,z,B,U,se,fe){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=Te.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&fe!==void 0&&(_e=_e[fe]),_e){const ye=T.texture,Ne=ye.format,De=ye.type;if(!He.textureFormatReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!He.textureTypeReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=T.width-B&&z>=0&&z<=T.height-U){Ae.bindFramebuffer(k.FRAMEBUFFER,_e);const Se=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Se),k.bufferData(k.PIXEL_PACK_BUFFER,se.byteLength,k.STREAM_READ),k.readPixels(I,z,B,U,Ue.convert(Ne),Ue.convert(De),0);const Ye=R!==null?Te.get(R).__webglFramebuffer:null;Ae.bindFramebuffer(k.FRAMEBUFFER,Ye);const st=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await iM(k,st,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Se),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,se),k.deleteBuffer(Se),k.deleteSync(st),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,I=null,z=0){T.isTexture!==!0&&(la("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,T=arguments[1]);const B=Math.pow(2,-z),U=Math.floor(T.image.width*B),se=Math.floor(T.image.height*B),fe=I!==null?I.x:0,_e=I!==null?I.y:0;C.setTexture2D(T,0),k.copyTexSubImage2D(k.TEXTURE_2D,z,0,0,fe,_e,U,se),Ae.unbindTexture()},this.copyTextureToTexture=function(T,I,z=null,B=null,U=0){T.isTexture!==!0&&(la("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,T=arguments[1],I=arguments[2],U=arguments[3]||0,z=null);let se,fe,_e,ye,Ne,De,Se,Ye,st;const lt=T.isCompressedTexture?T.mipmaps[U]:T.image;z!==null?(se=z.max.x-z.min.x,fe=z.max.y-z.min.y,_e=z.isBox3?z.max.z-z.min.z:1,ye=z.min.x,Ne=z.min.y,De=z.isBox3?z.min.z:0):(se=lt.width,fe=lt.height,_e=lt.depth||1,ye=0,Ne=0,De=0),B!==null?(Se=B.x,Ye=B.y,st=B.z):(Se=0,Ye=0,st=0);const Kt=Ue.convert(I.format),Ke=Ue.convert(I.type);let we;I.isData3DTexture?(C.setTexture3D(I,0),we=k.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(C.setTexture2DArray(I,0),we=k.TEXTURE_2D_ARRAY):(C.setTexture2D(I,0),we=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,I.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,I.unpackAlignment);const ai=k.getParameter(k.UNPACK_ROW_LENGTH),Ze=k.getParameter(k.UNPACK_IMAGE_HEIGHT),Ln=k.getParameter(k.UNPACK_SKIP_PIXELS),zr=k.getParameter(k.UNPACK_SKIP_ROWS),cn=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,lt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,lt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,ye),k.pixelStorei(k.UNPACK_SKIP_ROWS,Ne),k.pixelStorei(k.UNPACK_SKIP_IMAGES,De);const js=T.isDataArrayTexture||T.isData3DTexture,ct=I.isDataArrayTexture||I.isData3DTexture;if(T.isRenderTargetTexture||T.isDepthTexture){const Xn=Te.get(T),Gs=Te.get(I),_n=Te.get(Xn.__renderTarget),Ri=Te.get(Gs.__renderTarget);Ae.bindFramebuffer(k.READ_FRAMEBUFFER,_n.__webglFramebuffer),Ae.bindFramebuffer(k.DRAW_FRAMEBUFFER,Ri.__webglFramebuffer);for(let Ni=0;Ni<_e;Ni++)js&&k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Te.get(T).__webglTexture,U,De+Ni),T.isDepthTexture?(ct&&k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Te.get(I).__webglTexture,U,st+Ni),k.blitFramebuffer(ye,Ne,se,fe,Se,Ye,se,fe,k.DEPTH_BUFFER_BIT,k.NEAREST)):ct?k.copyTexSubImage3D(we,U,Se,Ye,st+Ni,ye,Ne,se,fe):k.copyTexSubImage2D(we,U,Se,Ye,st+Ni,ye,Ne,se,fe);Ae.bindFramebuffer(k.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ct?T.isDataTexture||T.isData3DTexture?k.texSubImage3D(we,U,Se,Ye,st,se,fe,_e,Kt,Ke,lt.data):I.isCompressedArrayTexture?k.compressedTexSubImage3D(we,U,Se,Ye,st,se,fe,_e,Kt,lt.data):k.texSubImage3D(we,U,Se,Ye,st,se,fe,_e,Kt,Ke,lt):T.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,U,Se,Ye,se,fe,Kt,Ke,lt.data):T.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,U,Se,Ye,lt.width,lt.height,Kt,lt.data):k.texSubImage2D(k.TEXTURE_2D,U,Se,Ye,se,fe,Kt,Ke,lt);k.pixelStorei(k.UNPACK_ROW_LENGTH,ai),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Ze),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Ln),k.pixelStorei(k.UNPACK_SKIP_ROWS,zr),k.pixelStorei(k.UNPACK_SKIP_IMAGES,cn),U===0&&I.generateMipmaps&&k.generateMipmap(we),Ae.unbindTexture()},this.copyTextureToTexture3D=function(T,I,z=null,B=null,U=0){return T.isTexture!==!0&&(la("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,B=arguments[1]||null,T=arguments[2],I=arguments[3],U=arguments[4]||0),la('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,I,z,B,U)},this.initRenderTarget=function(T){Te.get(T).__webglFramebuffer===void 0&&C.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?C.setTextureCube(T,0):T.isData3DTexture?C.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?C.setTexture2DArray(T,0):C.setTexture2D(T,0),Ae.unbindTexture()},this.resetState=function(){b=0,A=0,R=null,Ae.reset(),rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=Xe._getDrawingBufferColorSpace(e),n.unpackColorSpace=Xe._getUnpackColorSpace()}}class gA extends on{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bi,this.environmentIntensity=1,this.environmentRotation=new bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class o0 extends Ya{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Oe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const cm=new Et,Vd=new Xv,Oo=new Yl,zo=new V;class xA extends on{constructor(e=new ri,n=new o0){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Oo.copy(i.boundingSphere),Oo.applyMatrix4(r),Oo.radius+=s,e.ray.intersectsSphere(Oo)===!1)return;cm.copy(r).invert(),Vd.copy(e.ray).applyMatrix4(cm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,p=i.attributes.position;if(c!==null){const h=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let x=h,_=m;x<_;x++){const g=c.getX(x);zo.fromBufferAttribute(p,g),um(zo,g,l,r,e,n,this)}}else{const h=Math.max(0,a.start),m=Math.min(p.count,a.start+a.count);for(let x=h,_=m;x<_;x++)zo.fromBufferAttribute(p,x),um(zo,x,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function um(t,e,n,i,r,s,a){const o=Vd.distanceSqToPoint(t);if(o<n){const l=new V;Vd.closestPointToPoint(t,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class qf extends ri{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const d=[],p=new V,h=new V,m=[],x=[],_=[],g=[];for(let u=0;u<=i;u++){const v=[],y=u/i;let S=0;u===0&&a===0?S=.5/n:u===i&&l===Math.PI&&(S=-.5/n);for(let N=0;N<=n;N++){const b=N/n;p.x=-e*Math.cos(r+b*s)*Math.sin(a+y*o),p.y=e*Math.cos(a+y*o),p.z=e*Math.sin(r+b*s)*Math.sin(a+y*o),x.push(p.x,p.y,p.z),h.copy(p).normalize(),_.push(h.x,h.y,h.z),g.push(b+S,1-y),v.push(c++)}d.push(v)}for(let u=0;u<i;u++)for(let v=0;v<n;v++){const y=d[u][v+1],S=d[u][v],N=d[u+1][v],b=d[u+1][v+1];(u!==0||a>0)&&m.push(y,S,b),(u!==i-1||l<Math.PI)&&m.push(S,N,b)}this.setIndex(m),this.setAttribute("position",new ni(x,3)),this.setAttribute("normal",new ni(_,3)),this.setAttribute("uv",new ni(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qf(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class vA{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=dm(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=dm();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function dm(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:zf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=zf);const l0=({state:t="IDLE",size:e=40,className:n="",onClick:i})=>{const r=ee.useRef(null),s=ee.useRef(null),a=ee.useRef(0);ee.useEffect(()=>{const l=r.current;if(!l||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const d=new gA,p=new wn(45,1,.1,100);p.position.z=3.6;let h;try{h=new mA({alpha:!0,antialias:!0,powerPreference:"low-power"}),h.setSize(e,e),h.setPixelRatio(Math.min(window.devicePixelRatio,2)),s.current=h,l.appendChild(h.domElement)}catch{return}const m=e>60?420:180,x=new ri,_=new Float32Array(m*3),g=new Float32Array(m*3),u=new Float32Array(m*3),y=(w=>{switch(w){case"LISTENING":return{primary:new Oe("#38bdf8"),secondary:new Oe("#818cf8")};case"THINKING":return{primary:new Oe("#a855f7"),secondary:new Oe("#6366f1")};case"SPEAKING":return{primary:new Oe("#34d399"),secondary:new Oe("#06b6d4")};case"WORKING":return{primary:new Oe("#fbbf24"),secondary:new Oe("#10b981")};case"IDLE":default:return{primary:new Oe("#10b981"),secondary:new Oe("#0ea5e9")}}})(t);for(let w=0;w<m;w++){const M=Math.random(),P=Math.random(),H=M*2*Math.PI,F=Math.acos(2*P-1),G=.95+Math.random()*.15,Y=G*Math.sin(F)*Math.cos(H),W=G*Math.sin(F)*Math.sin(H),Q=G*Math.cos(F);_[w*3]=Y,_[w*3+1]=W,_[w*3+2]=Q,g[w*3]=Y,g[w*3+1]=W,g[w*3+2]=Q;const L=Math.random(),$=y.primary.clone().lerp(y.secondary,L);u[w*3]=$.r,u[w*3+1]=$.g,u[w*3+2]=$.b}x.setAttribute("position",new Cn(_,3)),x.setAttribute("color",new Cn(u,3));const S=new o0({size:e>60?.055:.075,vertexColors:!0,transparent:!0,opacity:.85,blending:Ju}),N=new xA(x,S);d.add(N);const b=new ua;if(t==="WORKING"){const M=new qf(.06,8,8),P=new Xf({color:16498468});for(let H=0;H<3;H++){const F=new Jn(M,P),G=H/3*Math.PI*2;F.position.set(Math.cos(G)*1.35,Math.sin(G)*1.35,0),b.add(F)}d.add(b)}let A=new vA;const R=()=>{a.current=requestAnimationFrame(R);const w=A.getElapsedTime();let M=.5,P=.05;t==="LISTENING"?(M=1.8,P=.16):t==="THINKING"?(M=2.4,P=.12):t==="SPEAKING"?(M=1.4,P=.18):t==="WORKING"&&(M=1,P=.08),N.rotation.y=w*.3*M,N.rotation.x=w*.2*M,t==="WORKING"&&(b.rotation.z=-w*1.2);const H=x.attributes.position,F=H.array;for(let G=0;G<m;G++){const Y=g[G*3],W=g[G*3+1],Q=g[G*3+2],L=Math.sin(w*3*M+Y*4+W*4)*P;F[G*3]=Y*(1+L),F[G*3+1]=W*(1+L),F[G*3+2]=Q*(1+L)}H.needsUpdate=!0,h.render(d,p)};return R(),()=>{cancelAnimationFrame(a.current),s.current&&l.contains(s.current.domElement)&&l.removeChild(s.current.domElement),x.dispose(),S.dispose(),h.dispose()}},[t,e]);const o={IDLE:"from-emerald-500/30 to-cyan-500/20 shadow-emerald-500/20",LISTENING:"from-sky-500/40 to-indigo-500/30 shadow-sky-500/30 animate-pulse",THINKING:"from-purple-500/40 to-indigo-500/30 shadow-purple-500/30 animate-spin-slow",SPEAKING:"from-emerald-500/40 to-cyan-500/30 shadow-emerald-500/30 animate-pulse",WORKING:"from-amber-500/40 to-emerald-500/30 shadow-amber-500/30"}[t];return f.jsxs("div",{onClick:i,style:{width:e,height:e},className:`relative flex items-center justify-center cursor-pointer select-none rounded-full group ${n}`,title:`OS Ambient Presence: ${t}`,children:[f.jsx("div",{className:`absolute inset-0 rounded-full bg-gradient-to-tr ${o} blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}),f.jsx("div",{ref:r,className:"relative z-10 w-full h-full pointer-events-none"}),f.jsx("div",{className:"absolute inset-1 rounded-full border border-white/20 bg-os-surface/40 backdrop-blur-sm -z-0 pointer-events-none"})]})},_A=()=>{const{me:t,theme:e,toggleTheme:n,orbState:i,pendingApprovalsCount:r,activeAgentsCount:s,setCurrentView:a,setIsCommandPaletteOpen:o}=ln(),{isVoiceActive:l,toggleVoice:c}=bx();return f.jsxs("header",{className:"sticky top-0 z-40 w-full h-16 border-b border-os-border bg-os-bg/75 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between",children:[f.jsxs("div",{className:"flex items-center gap-3.5",children:[f.jsxs("div",{className:"flex items-center gap-2.5 cursor-pointer group",onClick:()=>a("home"),children:[f.jsx("div",{className:"relative flex items-center justify-center",children:f.jsx("img",{src:"/static/logo.png",alt:"OS Logo",className:"w-8 h-8 rounded-full object-cover border border-white/10 shadow-glass-glow",onError:d=>{d.target.style.display="none"}})}),f.jsx(l0,{state:i,size:28}),f.jsx("div",{className:"flex flex-col",children:f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx("span",{className:"font-bold text-base tracking-tight text-os-primary group-hover:text-emerald-400 transition-colors",children:"OS"}),f.jsx("span",{className:"text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-os-secondary",children:(t==null?void 0:t.mode)||"Builder Mode"})]})})]}),f.jsx("div",{className:"hidden lg:flex items-center gap-2 pl-3 border-l border-os-border text-xs",children:f.jsxs("div",{className:"flex items-center gap-1.5 text-os-secondary",children:[t!=null&&t.model_ok?f.jsxs("span",{className:"flex h-2 w-2 relative",children:[f.jsx("span",{className:"animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"}),f.jsx("span",{className:"relative inline-flex rounded-full h-2 w-2 bg-emerald-500"})]}):f.jsx("span",{className:"h-2 w-2 rounded-full bg-amber-500"}),f.jsx("span",{className:"font-mono text-[11px] text-os-muted",children:(t==null?void 0:t.model)||"Ollama Connected"})]})})]}),f.jsx("div",{className:"flex-1 max-w-md mx-4 hidden sm:block",children:f.jsxs("button",{onClick:()=>o(!0),className:"w-full flex items-center justify-between px-3.5 py-1.5 rounded-glass-md bg-white/5 hover:bg-white/10 border border-os-border hover:border-os-border-glass text-os-secondary text-xs transition-all duration-150 group",children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx(zs,{className:"w-3.5 h-3.5 text-os-muted group-hover:text-os-primary transition-colors"}),f.jsx("span",{children:"Search tasks, plans, tools, or ask OS..."})]}),f.jsxs("kbd",{className:"hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/20 border border-white/10 text-[10px] font-mono text-os-muted",children:[f.jsx("span",{children:"⌘"}),"K"]})]})}),f.jsxs("div",{className:"flex items-center gap-2 md:gap-3",children:[r>0&&f.jsxs("button",{onClick:()=>a("approvals"),className:"flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono transition-colors",title:`${r} action approvals waiting`,children:[f.jsx(Xl,{className:"w-3.5 h-3.5"}),f.jsx("span",{className:"font-semibold",children:r}),f.jsx("span",{className:"hidden md:inline text-[11px]",children:"waiting"})]}),s>0&&f.jsxs("button",{onClick:()=>a("agents"),className:"flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono transition-colors",title:`${s} background agents running`,children:[f.jsx(Gx,{className:"w-3.5 h-3.5 animate-spin-slow"}),f.jsxs("span",{children:[s," running"]})]}),f.jsx("button",{onClick:c,className:`btn-press p-2 rounded-glass-md border transition-all ${l?"bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glass-glow":"bg-white/5 hover:bg-white/10 text-os-secondary hover:text-os-primary border-os-border"}`,title:l?"Voice active (click to stop)":"Activate Voice Talk",children:l?f.jsx(sv,{className:"w-4 h-4 animate-pulse"}):f.jsx(iv,{className:"w-4 h-4"})}),f.jsx("button",{onClick:n,className:"btn-press p-2 rounded-glass-md bg-white/5 hover:bg-white/10 border border-os-border text-os-secondary hover:text-os-primary transition-colors",title:`Switch to ${e==="dark"?"Light":"Dark"} mode`,children:e==="dark"?f.jsx(cS,{className:"w-4 h-4"}):f.jsx(aS,{className:"w-4 h-4"})}),f.jsx("div",{className:"flex items-center gap-2 pl-2 border-l border-os-border",children:f.jsx("div",{className:"w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-black select-none",children:t!=null&&t.name?t.name.charAt(0).toUpperCase():"S"})})]})]})},yA=()=>{const{currentView:t,setCurrentView:e,pendingApprovalsCount:n,activeAgentsCount:i}=ln(),r=[{id:"home",label:"Overview",icon:nS},{id:"chat",label:"Ask OS",icon:Zn},{id:"plan",label:"Plan & Day",icon:Or},{id:"tasks",label:"Commitments",icon:Sv},{id:"approvals",label:"Approvals & Safety",icon:Xl,badgeCount:n,badgeVariant:"amber"},{id:"agents",label:"Workers & Agents",icon:Px,badgeCount:i,badgeVariant:"cyan"},{id:"activity",label:"Evidence & Audit",icon:Ga},{id:"connectors",label:"Connectors",icon:Qx},{id:"memory",label:"Memory & World",icon:Dx}];return f.jsxs("aside",{className:"w-16 md:w-60 border-r border-os-border bg-os-bg/50 backdrop-blur-md flex flex-col justify-between p-3 select-none flex-shrink-0",children:[f.jsxs("nav",{className:"space-y-1.5",children:[f.jsx("div",{className:"hidden md:block px-3 py-2 text-[10px] font-mono tracking-wider uppercase text-os-muted",children:"Workspace"}),r.map(s=>{const a=s.icon,o=t===s.id;return f.jsxs("button",{onClick:()=>e(s.id),className:`btn-press w-full flex items-center gap-3 px-3 py-2.5 rounded-glass-md text-xs font-medium transition-all group ${o?"bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-glass-glow":"text-os-secondary hover:text-os-primary hover:bg-white/5 border border-transparent"}`,children:[f.jsx(a,{className:`w-4 h-4 flex-shrink-0 transition-colors ${o?"text-emerald-400":"text-os-muted group-hover:text-os-primary"}`}),f.jsx("span",{className:"hidden md:inline truncate",children:s.label}),s.badgeCount!==void 0&&s.badgeCount>0&&f.jsx("span",{className:`hidden md:inline-flex ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${s.badgeVariant==="amber"?"bg-amber-500/20 text-amber-400 border border-amber-500/30":s.badgeVariant==="cyan"?"bg-cyan-500/20 text-cyan-400 border border-cyan-500/30":"bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`,children:s.badgeCount})]},s.id)})]}),f.jsxs("div",{className:"pt-4 border-t border-os-border/50 hidden md:block px-3",children:[f.jsxs("div",{className:"flex items-center justify-between text-[11px] text-os-muted font-mono",children:[f.jsx("span",{children:"OS Core v2.0"}),f.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"})]}),f.jsx("p",{className:"text-[10px] text-os-muted/80 mt-1 leading-tight",children:"Safe execution boundary active."})]})]})},SA=()=>{const{isCommandPaletteOpen:t,setIsCommandPaletteOpen:e,setCurrentView:n,refreshData:i,addNotification:r}=ln(),[s,a]=ee.useState(""),[o,l]=ee.useState(0),c=ee.useRef(null);ee.useEffect(()=>{t&&(a(""),l(0),setTimeout(()=>{var x;return(x=c.current)==null?void 0:x.focus()},50))},[t]);const p=[{id:"ask-plan",title:'Ask OS: "Plan my day and resolve conflicts"',category:"Ask OS",icon:Zn,view:"chat"},{id:"ask-matters",title:'Ask OS: "What matters right now and what is blocked?"',category:"Ask OS",icon:Zn,view:"chat"},{id:"ask-research",title:'Ask OS: "Research recent AI agent breakthroughs"',category:"Ask OS",icon:Zn,view:"chat"},{id:"nav-home",title:'Go to Overview ("What matters now")',category:"Navigation",icon:Rx,view:"home"},{id:"nav-chat",title:"Open Ask OS Canvas",category:"Navigation",icon:Zn,view:"chat"},{id:"nav-plan",title:"Open Day Plan & Schedule",category:"Navigation",icon:Or,view:"plan"},{id:"nav-tasks",title:"View Commitments & Tasks",category:"Navigation",icon:Sv,view:"tasks"},{id:"nav-approvals",title:"Review Safety Approvals",category:"Navigation",icon:Xl,view:"approvals"},{id:"nav-agents",title:"Inspect Specialized Workers",category:"Navigation",icon:Px,view:"agents"},{id:"nav-activity",title:"Audit Evidence & Activity",category:"Navigation",icon:Ga,view:"activity"},{id:"nav-connectors",title:"Manage Connectors & Integrations",category:"Navigation",icon:Qx,view:"connectors"},{id:"nav-memory",title:"Explore OS Memory & Knowledge",category:"Navigation",icon:Dx,view:"memory"},{id:"act-refresh",title:"Refresh All Data & Statuses",category:"Actions",icon:ii,action:async()=>{await i(),r({type:"success",title:"System Synced",message:"All operational data refreshed."})}}].filter(x=>x.title.toLowerCase().includes(s.toLowerCase())||x.category.toLowerCase().includes(s.toLowerCase())),h=x=>{e(!1),x.action?x.action():x.view&&n(x.view)},m=x=>{x.key==="ArrowDown"?(x.preventDefault(),l(_=>(_+1)%(p.length||1))):x.key==="ArrowUp"?(x.preventDefault(),l(_=>(_-1+(p.length||1))%(p.length||1))):x.key==="Enter"?(x.preventDefault(),p[o]&&h(p[o])):x.key==="Escape"&&e(!1)};return t?f.jsxs("div",{className:"fixed inset-0 z-50 flex items-start justify-center pt-24 p-4",children:[f.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity",onClick:()=>e(!1)}),f.jsxs("div",{className:"relative w-full max-w-xl z-10 glass-panel rounded-glass-xl border border-os-border-glass shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150",children:[f.jsxs("div",{className:"flex items-center gap-3 px-4 py-3.5 border-b border-os-border bg-white/5",children:[f.jsx(zs,{className:"w-5 h-5 text-os-muted flex-shrink-0"}),f.jsx("input",{ref:c,type:"text",value:s,onChange:x=>{a(x.target.value),l(0)},onKeyDown:m,placeholder:"Type a command, search tasks, or ask OS...",className:"w-full bg-transparent text-sm text-os-primary placeholder:text-os-muted focus:outline-none"}),f.jsx("button",{onClick:()=>e(!1),className:"p-1 text-os-muted hover:text-os-primary rounded-lg hover:bg-white/5",children:f.jsx(Of,{className:"w-4 h-4"})})]}),f.jsx("div",{className:"max-h-80 overflow-y-auto p-2 space-y-1",children:p.length===0?f.jsx("div",{className:"py-8 text-center text-xs text-os-muted",children:"No matching commands or actions found."}):p.map((x,_)=>{const g=x.icon,u=_===o;return f.jsxs("div",{onClick:()=>h(x),onMouseEnter:()=>l(_),className:`flex items-center justify-between px-3 py-2.5 rounded-glass-md text-xs cursor-pointer transition-colors ${u?"bg-emerald-500/15 text-emerald-400 border border-emerald-500/30":"text-os-secondary hover:text-os-primary hover:bg-white/5 border border-transparent"}`,children:[f.jsxs("div",{className:"flex items-center gap-2.5 truncate",children:[f.jsx(g,{className:`w-4 h-4 flex-shrink-0 ${u?"text-emerald-400":"text-os-muted"}`}),f.jsx("span",{className:"truncate",children:x.title})]}),f.jsx("span",{className:"text-[10px] font-mono uppercase tracking-wider text-os-muted px-2 py-0.5 rounded bg-white/5",children:x.category})]},x.id)})}),f.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-black/20 border-t border-os-border text-[11px] text-os-muted font-mono",children:[f.jsxs("div",{className:"flex items-center gap-3",children:[f.jsx("span",{children:"↑↓ Navigate"}),f.jsx("span",{children:"↵ Select"}),f.jsx("span",{children:"ESC Close"})]}),f.jsx("span",{children:"OS Command Center"})]})]})]}):null},Ct=({children:t,interactive:e=!1,glow:n="none",className:i="",...r})=>{const s={none:"",emerald:"shadow-glass-glow border-emerald-500/30",cyan:"shadow-glass-glow-cyan border-cyan-500/30",amber:"shadow-glass-glow-amber border-amber-500/30",danger:"shadow-glass-glow-danger border-rose-500/30"}[n];return f.jsx("div",{className:`glass-panel rounded-glass-lg p-5 transition-all duration-200 ${e?"glass-card-interactive cursor-pointer hover:border-os-border-glass":""} ${s} ${i}`,...r,children:t})},Tt=({children:t,variant:e="neutral",size:n="md",icon:i,className:r=""})=>{const s={neutral:"bg-white/5 text-os-secondary border-white/10",emerald:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",cyan:"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",amber:"bg-amber-500/10 text-amber-400 border-amber-500/20",danger:"bg-rose-500/10 text-rose-400 border-rose-500/20",purple:"bg-purple-500/10 text-purple-400 border-purple-500/20"}[e],a={sm:"text-xs px-2 py-0.5 gap-1",md:"text-xs font-medium px-2.5 py-1 gap-1.5"}[n];return f.jsxs("span",{className:`inline-flex items-center rounded-full border tracking-wide uppercase font-mono ${s} ${a} ${r}`,children:[i&&f.jsx("span",{className:"flex-shrink-0",children:i}),f.jsx("span",{children:t})]})},Je=({children:t,variant:e="glass",size:n="md",isLoading:i=!1,leftIcon:r,rightIcon:s,disabled:a,className:o="",...l})=>{const c={primary:"bg-emerald-500 text-white font-medium hover:bg-emerald-400 border border-emerald-400/40 shadow-glass-glow",glass:"bg-white/5 hover:bg-white/10 text-os-primary border border-os-border hover:border-os-border-glass backdrop-blur-md",secondary:"bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30",danger:"bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 shadow-glass-glow-danger",ghost:"hover:bg-white/5 text-os-secondary hover:text-os-primary border border-transparent"}[e],d={sm:"text-xs px-2.5 py-1.5 rounded-glass-sm gap-1.5",md:"text-sm px-4 py-2 rounded-glass-md gap-2",lg:"text-base px-5 py-2.5 rounded-glass-lg gap-2.5",icon:"p-2 rounded-glass-md justify-center items-center"}[n];return f.jsxs("button",{className:`btn-press inline-flex items-center justify-center transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none ${c} ${d} ${o}`,disabled:a||i,...l,children:[i?f.jsxs("svg",{className:"animate-spin h-4 w-4 text-current",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[f.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),f.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}):r,t,!i&&s]})},fm=()=>{var p;const{me:t,setCurrentView:e,pendingApprovalsCount:n,activeAgentsCount:i}=ln(),[r,s]=ee.useState(null),[a,o]=ee.useState([]),[l,c]=ee.useState(!0),d=async()=>{c(!0);try{const[h,m]=await Promise.allSettled([nt.getHomeView(),nt.getPlan()]);h.status==="fulfilled"&&s(h.value),m.status==="fulfilled"&&o(m.value.items||[])}catch(h){console.error("Failed to load home view data:",h)}finally{c(!1)}};return ee.useEffect(()=>{d()},[]),f.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-8 animate-in fade-in duration-200",children:[f.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-os-border/50",children:[f.jsxs("div",{children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx("span",{className:"text-xs font-mono text-emerald-400 uppercase tracking-widest",children:"Operational Command"}),f.jsx("span",{className:"h-1 w-1 rounded-full bg-emerald-400"}),f.jsx("span",{className:"text-xs text-os-secondary",children:new Date().toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})})]}),f.jsxs("h1",{className:"text-2xl md:text-3xl font-extrabold text-os-primary tracking-tight mt-1",children:[(t==null?void 0:t.greeting)||"Good afternoon",", ",(t==null?void 0:t.name)||"Sai"]}),f.jsx("p",{className:"text-xs md:text-sm text-os-secondary mt-0.5",children:n>0?`You have ${n} action approval waiting and tasks scheduled for today.`:"All systems nominal. OS is actively observing background feeds and commitments."})]}),f.jsxs("div",{className:"flex items-center gap-2.5",children:[f.jsx(Je,{variant:"glass",size:"sm",onClick:d,isLoading:l,leftIcon:f.jsx(ii,{className:"w-3.5 h-3.5"}),children:"Sync"}),f.jsx(Je,{variant:"primary",size:"sm",onClick:()=>e("chat"),leftIcon:f.jsx(Zn,{className:"w-3.5 h-3.5"}),children:"Ask OS"})]})]}),f.jsxs("section",{className:"space-y-3",children:[f.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[f.jsx("span",{className:"h-2 w-2 rounded-full bg-rose-500 animate-pulse"}),f.jsx("span",{children:"What Matters Right Now"})]}),n>0?f.jsx(Ct,{glow:"amber",className:"p-6 border-amber-500/30 relative overflow-hidden",children:f.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center justify-between gap-4",children:[f.jsxs("div",{className:"space-y-2",children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx(Tt,{variant:"amber",size:"sm",children:"Action Requires Approval"}),f.jsx("span",{className:"text-xs font-mono text-amber-400/90",children:"High Priority Safety Gate"})]}),f.jsx("h3",{className:"text-lg md:text-xl font-bold text-os-primary",children:"OS prepared external actions awaiting your confirmation"}),f.jsx("p",{className:"text-xs text-os-secondary max-w-2xl leading-relaxed",children:"Connector requests (such as email dispatch or calendar changes) are held behind tamper-evident SHA-256 integrity checks until you give explicit approval."})]}),f.jsx("div",{className:"flex items-center gap-3",children:f.jsxs(Je,{variant:"primary",size:"md",onClick:()=>e("approvals"),rightIcon:f.jsx(Rx,{className:"w-4 h-4"}),children:["Review Approvals (",n,")"]})})]})}):(p=r==null?void 0:r.now)!=null&&p.task?f.jsx(Ct,{glow:"emerald",className:"p-6 border-emerald-500/30",children:f.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center justify-between gap-4",children:[f.jsxs("div",{className:"space-y-2",children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx(Tt,{variant:"emerald",size:"sm",children:"Immediate Focus"}),r.now.task.deadline&&f.jsxs("span",{className:"text-xs font-mono text-os-muted",children:["Deadline: ",r.now.task.deadline]})]}),f.jsx("h3",{className:"text-xl font-bold text-os-primary",children:r.now.task.title}),f.jsxs("p",{className:"text-xs text-os-secondary",children:["Estimated duration: ",r.now.task.estimated_duration_minutes||60," mins · Highest priority in today's active plan."]})]}),f.jsx(Je,{variant:"primary",size:"md",onClick:()=>e("tasks"),leftIcon:f.jsx(cv,{className:"w-4 h-4"}),children:"Start Execution"})]})}):f.jsx(Ct,{className:"p-6",children:f.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4",children:[f.jsxs("div",{children:[f.jsx("h3",{className:"text-base font-semibold text-os-primary",children:"Clear Deck — No critical blockers"}),f.jsx("p",{className:"text-xs text-os-secondary mt-1",children:"You are up to date on pending decisions. Would you like OS to organize your schedule or inspect open commitments?"})]}),f.jsx(Je,{variant:"glass",size:"sm",onClick:()=>e("plan"),rightIcon:f.jsx(ya,{className:"w-4 h-4"}),children:"Inspect Schedule"})]})})]}),f.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[f.jsxs("section",{className:"space-y-3 lg:col-span-2",children:[f.jsxs("div",{className:"flex items-center justify-between",children:[f.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[f.jsx(Or,{className:"w-3.5 h-3.5 text-os-secondary"}),f.jsx("span",{children:"Today's Time-Carved Schedule"})]}),f.jsxs("button",{onClick:()=>e("plan"),className:"text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1",children:[f.jsx("span",{children:"View Full Plan"}),f.jsx(ya,{className:"w-3.5 h-3.5"})]})]}),f.jsx(Ct,{className:"p-4 space-y-2.5",children:a.length===0?f.jsxs("div",{className:"py-8 text-center text-xs text-os-muted",children:["No active plan for today yet.",f.jsx("div",{className:"mt-2",children:f.jsx(Je,{variant:"glass",size:"sm",onClick:()=>e("plan"),leftIcon:f.jsx(Zn,{className:"w-3.5 h-3.5 text-emerald-400"}),children:"Generate Daily Plan"})})]}):a.slice(0,5).map((h,m)=>f.jsxs("div",{className:"flex items-center justify-between p-2.5 rounded-glass-sm bg-white/5 hover:bg-white/10 border border-transparent hover:border-os-border transition-all",children:[f.jsxs("div",{className:"flex items-center gap-3",children:[f.jsx("span",{className:"font-mono text-xs text-os-secondary w-16",children:h.start_time||"09:00"}),f.jsx("div",{className:"h-2 w-2 rounded-full bg-emerald-400/80"}),f.jsxs("div",{children:[f.jsx("div",{className:"text-xs font-semibold text-os-primary",children:h.title}),h.why_now&&f.jsx("div",{className:"text-[10px] text-os-muted",children:h.why_now})]})]}),f.jsxs("span",{className:"text-[10px] font-mono text-os-muted",children:[h.duration_minutes||60,"m"]})]},h.id||m))})]}),f.jsxs("section",{className:"space-y-3",children:[f.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[f.jsx(Gx,{className:"w-3.5 h-3.5 text-cyan-400"}),f.jsx("span",{children:"Autonomous Background Work"})]}),f.jsxs(Ct,{className:"p-4 space-y-3",children:[f.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-os-border/50 text-xs",children:[f.jsx("span",{className:"text-os-secondary",children:"Watcher Engine"}),f.jsx("span",{className:"text-emerald-400 font-mono text-[11px]",children:"● ACTIVE"})]}),f.jsxs("div",{className:"space-y-2 text-xs",children:[f.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-black/20 border border-white/5",children:[f.jsx("div",{className:"font-semibold text-os-primary text-xs",children:"Deadline Watcher"}),f.jsx("div",{className:"text-[11px] text-os-muted mt-0.5",children:"Continually evaluating task progress and recalculating critical path."})]}),f.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-black/20 border border-white/5",children:[f.jsx("div",{className:"font-semibold text-os-primary text-xs",children:"Calendar Conflict Guard"}),f.jsx("div",{className:"text-[11px] text-os-muted mt-0.5",children:"Synchronizing busy slots with live Google Calendar adapter."})]}),f.jsxs("div",{className:"p-2.5 rounded-glass-sm bg-black/20 border border-white/5",children:[f.jsx("div",{className:"font-semibold text-os-primary text-xs",children:"Email Ingestion Pipe"}),f.jsx("div",{className:"text-[11px] text-os-muted mt-0.5",children:"Extracting commitments and tasks from incoming communications."})]})]}),f.jsx(Je,{variant:"ghost",size:"sm",className:"w-full text-xs text-os-secondary justify-center",onClick:()=>e("agents"),children:"Inspect Specialized Workers →"})]})]})]}),f.jsxs("section",{className:"space-y-3",children:[f.jsxs("div",{className:"flex items-center justify-between",children:[f.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[f.jsx(Ga,{className:"w-3.5 h-3.5 text-os-secondary"}),f.jsx("span",{children:"Recent Operational Activity & Proofs"})]}),f.jsxs("button",{onClick:()=>e("activity"),className:"text-xs text-os-secondary hover:text-os-primary font-mono flex items-center gap-1",children:[f.jsx("span",{children:"Full Audit Trail"}),f.jsx(ya,{className:"w-3.5 h-3.5"})]})]}),f.jsx(Ct,{className:"p-4 space-y-2",children:r!=null&&r.recent_activity&&r.recent_activity.length>0?r.recent_activity.slice(0,4).map(h=>f.jsxs("div",{className:"flex items-center justify-between p-2 rounded-glass-sm hover:bg-white/5 transition-colors text-xs",children:[f.jsxs("div",{className:"flex items-center gap-3",children:[f.jsx(An,{className:"w-3.5 h-3.5 text-emerald-400 flex-shrink-0"}),f.jsx("span",{className:"text-os-primary",children:h.description})]}),f.jsx("span",{className:"font-mono text-[10px] text-os-muted",children:h.timestamp?new Date(h.timestamp).toLocaleTimeString():"Just now"})]},h.id)):f.jsx("div",{className:"py-4 text-center text-xs text-os-muted",children:"OS initialized. Activity events and proof receipts will be logged here."})})]})]})};function MA(t,e,n,i){const r=new AbortController;return(async()=>{try{const s=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t}),signal:r.signal});if(!s.ok)throw new Error(`Chat error: ${s.statusText}`);if(!s.body)throw new Error("Response body is empty");const a=s.body.getReader(),o=new TextDecoder("utf-8");let l="";for(;;){const{done:c,value:d}=await a.read();if(c)break;l+=o.decode(d,{stream:!0});const p=l.split(`
`);l=p.pop()||"";for(const h of p){const m=h.trim();if(m.startsWith("data: ")){const x=m.slice(6);if(x==="[DONE]")continue;try{const _=JSON.parse(x);_.t==="token"&&typeof _.d=="string"?e(_.d):_.t==="done"&&n(_)}catch(_){console.warn("Failed to parse SSE line:",x,_)}}}}}catch(s){s.name!=="AbortError"&&i(s)}})(),()=>{r.abort()}}const EA=({step:t})=>{const[e,n]=ee.useState(!1),[i,r]=ee.useState(!1),[s,a]=ee.useState(!1),[o,l]=ee.useState(!1),c=(t.tool||"").toLowerCase(),d=c.includes("browser")||c.includes("web"),p=c.includes("research")||c.includes("search"),h=c.includes("computer")||c.includes("terminal")||c.includes("bash"),m=c.includes("code")||c.includes("python"),_=d?Zu:p?zs:h?uS:m?Hx:c.includes("calendar")?Or:c.includes("email")||c.includes("gmail")?sS:rS,g=()=>{if(s)return f.jsx(Tt,{variant:"danger",size:"sm",children:"Stopped"});if(i)return f.jsx(Tt,{variant:"amber",size:"sm",children:"Paused"});switch(t.status){case"completed":return f.jsx(Tt,{variant:"emerald",size:"sm",icon:f.jsx(An,{className:"w-3 h-3"}),children:"Completed"});case"running":return f.jsx(Tt,{variant:"cyan",size:"sm",icon:f.jsx(Ga,{className:"w-3 h-3 animate-spin"}),children:"Executing"});case"failed":return f.jsx(Tt,{variant:"danger",size:"sm",icon:f.jsx(Qu,{className:"w-3 h-3"}),children:"Failed"});case"needs_approval":return f.jsx(Tt,{variant:"amber",size:"sm",icon:f.jsx(Qu,{className:"w-3 h-3"}),children:"Approval Needed"});default:return null}},u=t.input&&(t.input.url||t.input.target_url)||(typeof t.input=="string"&&t.input.includes("http")?t.input:"https://github.com");return f.jsxs("div",{className:"rounded-glass-md border border-os-border bg-os-surface/60 backdrop-blur-md overflow-hidden my-2.5 transition-all",children:[f.jsxs("div",{onClick:()=>n(!e),className:"flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-white/5 transition-colors select-none",children:[f.jsxs("div",{className:"flex items-center gap-2.5",children:[f.jsx("div",{className:"p-1.5 rounded-lg bg-white/5 border border-white/10 text-os-secondary",children:f.jsx(_,{className:"w-3.5 h-3.5 text-emerald-400"})}),f.jsxs("div",{children:[f.jsx("span",{className:"text-xs font-semibold text-os-primary tracking-wide",children:t.tool}),d&&f.jsx("span",{className:"hidden sm:inline text-[11px] text-os-muted ml-2 font-mono truncate max-w-xs",children:u})]})]}),f.jsxs("div",{className:"flex items-center gap-2",children:[g(),f.jsx("button",{className:"text-os-muted hover:text-os-primary p-0.5",children:e?f.jsx(kx,{className:"w-4 h-4"}):f.jsx(ya,{className:"w-4 h-4"})})]})]}),d&&f.jsxs("div",{className:"p-3 border-t border-os-border/50 bg-black/30 space-y-2.5",children:[f.jsxs("div",{className:"flex items-center justify-between gap-2 px-3 py-1.5 rounded-glass-sm bg-black/40 border border-white/5 text-xs font-mono",children:[f.jsxs("div",{className:"flex items-center gap-2 truncate",children:[f.jsx(Zu,{className:"w-3.5 h-3.5 text-cyan-400 flex-shrink-0"}),f.jsx("span",{className:"text-os-secondary truncate",children:u})]}),f.jsx("div",{className:"flex items-center gap-1.5 flex-shrink-0",children:f.jsx("span",{className:"text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20",children:"Step 3 / 5"})})]}),f.jsx("div",{className:"relative rounded-glass-sm border border-white/10 bg-os-bg/80 p-4 min-h-[90px] flex flex-col justify-center items-center text-center",children:o?f.jsxs("div",{className:"space-y-1.5 animate-in fade-in",children:[f.jsx(Tt,{variant:"amber",size:"sm",children:"Manual Takeover Active"}),f.jsx("p",{className:"text-xs text-os-secondary",children:"You are directly controlling the Chromium session. OS will resume when returned."})]}):f.jsxs("div",{className:"space-y-1 text-xs text-os-secondary",children:[f.jsxs("div",{className:"flex items-center justify-center gap-2 text-emerald-400 font-mono text-[11px]",children:[f.jsx("span",{className:"h-2 w-2 rounded-full bg-emerald-400 animate-pulse"}),f.jsx("span",{children:"Navigating DOM · Extracting content"})]}),f.jsx("p",{className:"text-os-muted text-[11px]",children:"Agent-Browser is executing in isolated Playwright context."})]})}),f.jsxs("div",{className:"flex items-center justify-between pt-1 text-xs",children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx(Je,{variant:"glass",size:"sm",onClick:()=>l(!o),leftIcon:f.jsx(tS,{className:"w-3 h-3 text-cyan-400"}),children:o?"Return to OS":"Take Control"}),f.jsx(Je,{variant:"ghost",size:"sm",onClick:()=>r(!i),leftIcon:i?f.jsx(cv,{className:"w-3 h-3 text-emerald-400"}):f.jsx(oS,{className:"w-3 h-3 text-amber-400"}),children:i?"Resume":"Pause"})]}),f.jsx(Je,{variant:"danger",size:"sm",onClick:()=>a(!0),leftIcon:f.jsx(lS,{className:"w-3 h-3"}),children:"Stop"})]})]}),h&&f.jsxs("div",{className:"p-3 border-t border-os-border/50 bg-black/40 space-y-2 text-xs font-mono",children:[f.jsxs("div",{className:"flex items-center justify-between text-[11px] text-os-muted pb-1 border-b border-white/5",children:[f.jsx("span",{children:"Isolated Sandbox: /workspace"}),f.jsx("span",{className:"text-emerald-400",children:"● Docker Container"})]}),f.jsx("div",{className:"p-2.5 rounded bg-black/60 border border-white/5 text-[11px] text-emerald-300",children:f.jsxs("code",{children:["$ ",t.input?JSON.stringify(t.input):"python -m pytest"]})})]}),e&&f.jsxs("div",{className:"p-3 border-t border-os-border/60 bg-black/20 text-xs font-mono space-y-2",children:[t.input&&f.jsxs("div",{children:[f.jsx("div",{className:"text-[10px] uppercase tracking-wider text-os-muted mb-1 font-sans",children:"Input Parameters"}),f.jsx("pre",{className:"p-2 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-os-secondary",children:typeof t.input=="string"?t.input:JSON.stringify(t.input,null,2)})]}),t.output&&f.jsxs("div",{children:[f.jsx("div",{className:"text-[10px] uppercase tracking-wider text-os-muted mb-1 font-sans",children:"Execution Result"}),f.jsx("pre",{className:"p-2 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-emerald-300/90 max-h-48",children:typeof t.output=="string"?t.output:JSON.stringify(t.output,null,2)})]})]})]})},Hd=({approval:t,onDecided:e})=>{const{refreshData:n,addNotification:i}=ln(),[r,s]=ee.useState(t.status||"pending"),[a,o]=ee.useState(!1),l=(t.risk_level||"MEDIUM").toUpperCase(),c=l==="HIGH"?"danger":l==="LOW"?"emerald":"amber",d=async()=>{o(!0);try{t.aid?await nt.approveAction(t.aid):t.id&&await nt.approveV1(t.id,t.params||{}),s("approved"),e==null||e("approved"),i({type:"success",title:"Action Approved & Executed",message:"The safety executor has completed and verified this action."}),n()}catch(h){i({type:"error",title:"Approval Failed",message:h.message||"Execution error occurred."})}finally{o(!1)}},p=async()=>{o(!0);try{t.aid?await nt.rejectAction(t.aid):t.id&&await nt.rejectV1(t.id,"User rejected in Ask OS"),s("rejected"),e==null||e("rejected"),i({type:"info",title:"Action Rejected",message:"The action was discarded safely without execution."}),n()}catch(h){i({type:"error",title:"Rejection Failed",message:h.message})}finally{o(!1)}};return f.jsxs("div",{className:"rounded-glass-lg border border-amber-500/30 bg-os-surface/80 backdrop-blur-md p-4 my-3 shadow-glass-glow-amber",children:[f.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-os-border/60",children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx("div",{className:"p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400",children:f.jsx(Xl,{className:"w-4 h-4"})}),f.jsxs("div",{children:[f.jsx("h4",{className:"text-xs font-semibold text-os-primary uppercase tracking-wider font-mono",children:"Action Approval Required"}),f.jsx("p",{className:"text-[11px] text-os-secondary",children:"OS prepared this action and awaits your confirmation."})]})]}),f.jsxs(Tt,{variant:c,size:"sm",children:[l," RISK"]})]}),f.jsxs("div",{className:"py-3 space-y-2",children:[f.jsxs("div",{className:"text-sm font-medium text-os-primary flex items-center gap-2",children:[f.jsx("span",{className:"font-semibold text-emerald-400",children:t.connector_name||t.action||"External Action"}),t.title&&f.jsxs("span",{className:"text-os-secondary",children:["— ",t.title]})]}),t.params&&Object.keys(t.params).length>0&&f.jsx("div",{className:"rounded-glass-sm bg-black/30 border border-white/5 p-3 space-y-1.5 text-xs font-mono",children:Object.entries(t.params).map(([h,m])=>f.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-start justify-between gap-1",children:[f.jsxs("span",{className:"text-os-muted uppercase text-[10px] tracking-wider sm:w-28 flex-shrink-0",children:[h,":"]}),f.jsx("span",{className:"text-os-secondary text-right sm:text-left flex-1 break-all",children:typeof m=="object"?JSON.stringify(m):String(m)})]},h))}),t.arguments_hash&&f.jsxs("div",{className:"flex items-center gap-1.5 text-[10px] font-mono text-os-muted pt-1",children:[f.jsx(ev,{className:"w-3 h-3 text-emerald-400"}),f.jsxs("span",{className:"truncate",children:["Hash: ",t.arguments_hash.substring(0,24),"..."]})]})]}),f.jsx("div",{className:"pt-2 border-t border-os-border/60 flex items-center justify-between",children:r==="pending"?f.jsxs("div",{className:"flex items-center gap-2.5 w-full justify-end",children:[f.jsx(Je,{variant:"ghost",size:"sm",onClick:p,isLoading:a,leftIcon:f.jsx(Ku,{className:"w-3.5 h-3.5"}),children:"Reject"}),f.jsx(Je,{variant:"primary",size:"sm",onClick:d,isLoading:a,leftIcon:f.jsx(An,{className:"w-3.5 h-3.5"}),children:"Approve & Execute"})]}):r==="approved"?f.jsxs("div",{className:"flex items-center gap-2 text-xs font-medium text-emerald-400 py-1",children:[f.jsx(An,{className:"w-4 h-4"}),f.jsx("span",{children:"Approved & Safely Executed"})]}):f.jsxs("div",{className:"flex items-center gap-2 text-xs font-medium text-rose-400 py-1",children:[f.jsx(Ku,{className:"w-4 h-4"}),f.jsx("span",{children:"Action Rejected"})]})})]})},wA=({execution:t})=>f.jsxs("div",{className:"rounded-glass-md border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm p-3.5 my-2.5",children:[f.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-emerald-500/20",children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx(vv,{className:"w-4 h-4 text-emerald-400"}),f.jsx("span",{className:"text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider",children:"Real-World Verification"})]}),f.jsx(Tt,{variant:"emerald",size:"sm",icon:f.jsx(An,{className:"w-3 h-3"}),children:"VERIFIED"})]}),f.jsxs("div",{className:"pt-2 text-xs space-y-1.5 font-mono",children:[f.jsxs("div",{className:"text-os-secondary",children:["Target Operation: ",f.jsx("span",{className:"text-os-primary font-medium",children:t.tool})]}),f.jsxs("div",{className:"space-y-1 pt-1 text-[11px] text-emerald-300/90",children:[f.jsxs("div",{className:"flex items-center gap-1.5",children:[f.jsx(An,{className:"w-3 h-3 text-emerald-400 flex-shrink-0"}),f.jsx("span",{children:"Action completed via connector safe pipeline"})]}),f.jsxs("div",{className:"flex items-center gap-1.5",children:[f.jsx(An,{className:"w-3 h-3 text-emerald-400 flex-shrink-0"}),f.jsx("span",{children:"External read-back verification confirmed"})]}),f.jsxs("div",{className:"flex items-center gap-1.5",children:[f.jsx(An,{className:"w-3 h-3 text-emerald-400 flex-shrink-0"}),f.jsx("span",{children:"Receipt stored in World Model evidence ledger"})]})]}),t.receipt&&f.jsx("div",{className:"mt-2 p-2 rounded bg-black/30 border border-white/5 text-[10px] text-os-muted overflow-x-auto max-h-28",children:f.jsx("pre",{children:JSON.stringify(t.receipt,null,2)})})]})]}),TA=()=>{const{me:t,orbState:e,setOrbState:n,addNotification:i}=ln(),{isVoiceActive:r,toggleVoice:s}=bx(),[a,o]=ee.useState([{id:"welcome",sender:"os",content:`Hello ${(t==null?void 0:t.name)||"Sai"}. I'm OS, your personal AI operating system. I can plan your day, research topics, execute email and calendar actions with safety verification, and monitor your commitments. How can I help right now?`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]),[l,c]=ee.useState(""),[d,p]=ee.useState(!1),h=ee.useRef(null),m=ee.useRef(null),x=()=>{var u;(u=h.current)==null||u.scrollIntoView({behavior:"smooth"})};ee.useEffect(()=>{x()},[a,d]);const _=u=>{const v=(u||l).trim();if(!v||d)return;const S={id:Math.random().toString(36).substring(2,9),sender:"user",content:v,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},N=Math.random().toString(36).substring(2,9),b={id:N,sender:"os",content:"",timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),streaming:!0};o(A=>[...A,S,b]),c(""),p(!0),n("THINKING"),MA(v,A=>{n("SPEAKING"),o(R=>R.map(w=>w.id===N?{...w,content:w.content+A}:w))},A=>{p(!1),n("IDLE"),o(R=>R.map(w=>w.id===N?{...w,content:A.main||w.content||A.full,streaming:!1,actionApproval:A.action_approval||A.approval||null,execution:A.execution||null}:w))},A=>{p(!1),n("IDLE"),o(R=>R.map(w=>w.id===N?{...w,content:w.content||`I encountered an issue reaching the model or tools: ${A.message}. Please verify local services are running.`,streaming:!1}:w)),i({type:"error",title:"Engine Error",message:A.message})})},g=["Plan my day and resolve conflicts","What matters right now and what is blocked?","Review all pending approvals","Research recent breakthroughs in AI agents"];return f.jsxs("div",{className:"flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-4 md:px-6 py-4",children:[f.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-os-border mb-3 select-none",children:[f.jsxs("div",{className:"flex items-center gap-3",children:[f.jsx(l0,{state:e,size:32}),f.jsxs("div",{children:[f.jsx("h2",{className:"text-sm font-semibold text-os-primary tracking-tight",children:"Ask OS"}),f.jsx("p",{className:"text-[11px] text-os-secondary",children:"Personal intelligence canvas · Safe execution active"})]})]}),f.jsx("div",{className:"flex items-center gap-2",children:d&&f.jsxs("span",{className:"flex items-center gap-1.5 text-xs text-cyan-400 font-mono",children:[f.jsx(ii,{className:"w-3.5 h-3.5 animate-spin"}),"OS is working..."]})})]}),f.jsxs("div",{className:"flex-1 overflow-y-auto pr-2 space-y-4",children:[a.map(u=>f.jsxs("div",{className:`flex flex-col ${u.sender==="user"?"items-end":"items-start"} transition-all`,children:[f.jsx("div",{className:"flex items-center gap-2 mb-1 px-1",children:u.sender==="user"?f.jsxs(f.Fragment,{children:[f.jsx("span",{className:"text-[10px] font-mono text-os-muted",children:u.timestamp}),f.jsx("span",{className:"text-xs font-medium text-os-secondary",children:"You"})]}):f.jsxs(f.Fragment,{children:[f.jsx("div",{className:"w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]",children:f.jsx(Zn,{className:"w-2.5 h-2.5"})}),f.jsx("span",{className:"text-xs font-medium text-os-secondary",children:"OS"}),f.jsx("span",{className:"text-[10px] font-mono text-os-muted",children:u.timestamp})]})}),f.jsxs("div",{className:`max-w-2xl rounded-glass-lg p-4 text-xs md:text-sm leading-relaxed ${u.sender==="user"?"bg-emerald-500/15 border border-emerald-500/25 text-os-primary rounded-br-sm":"glass-panel border-os-border-glass text-os-primary rounded-bl-sm"}`,children:[f.jsx("div",{className:"whitespace-pre-wrap",children:u.content}),u.streaming&&f.jsxs("div",{className:"inline-flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-mono",children:[f.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"}),f.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse delay-75"}),f.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse delay-150"})]}),u.toolCalls&&u.toolCalls.length>0&&f.jsx("div",{className:"mt-3 pt-2 border-t border-white/5 space-y-1",children:u.toolCalls.map(v=>f.jsx(EA,{step:v},v.id))}),u.actionApproval&&f.jsx(Hd,{approval:u.actionApproval}),u.execution&&u.execution.verified&&f.jsx(wA,{execution:u.execution})]})]},u.id)),f.jsx("div",{ref:h})]}),a.length<4&&!d&&f.jsx("div",{className:"py-2 flex flex-wrap gap-2",children:g.map(u=>f.jsx("button",{onClick:()=>_(u),className:"btn-press px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-os-border hover:border-os-border-glass text-xs text-os-secondary hover:text-os-primary transition-all select-none",children:u},u))}),f.jsxs("div",{className:"pt-2 select-none",children:[f.jsxs("div",{className:"glass-panel rounded-glass-xl border-os-border-glass p-2 shadow-2xl flex items-center gap-2",children:[f.jsx("button",{onClick:s,className:`btn-press p-2.5 rounded-glass-md transition-all ${r?"bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glass-glow":"text-os-muted hover:text-os-primary hover:bg-white/5"}`,title:"Voice talk mode",children:r?f.jsx(sv,{className:"w-4 h-4 animate-pulse"}):f.jsx(iv,{className:"w-4 h-4"})}),f.jsx("input",{ref:m,type:"text",value:l,onChange:u=>c(u.target.value),onKeyDown:u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),_())},placeholder:"Ask OS anything or direct an action (e.g., 'Schedule meeting with Alex at 3pm')...",className:"flex-1 bg-transparent px-2 text-xs md:text-sm text-os-primary placeholder:text-os-muted focus:outline-none",disabled:d}),f.jsx("button",{onClick:()=>_(),disabled:!l.trim()||d,className:"btn-press p-2.5 rounded-glass-md bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glass-glow",children:f.jsx(mv,{className:"w-4 h-4"})})]}),f.jsxs("div",{className:"flex items-center justify-between px-3 pt-1.5 text-[10px] text-os-muted font-mono",children:[f.jsx("span",{children:"Press Enter to send"}),f.jsx("span",{children:"End-to-end safe execution boundary active"})]})]})]})},AA=()=>{const{addNotification:t}=ln(),[e,n]=ee.useState(null),[i,r]=ee.useState([]),[s,a]=ee.useState(!0),[o,l]=ee.useState(!1),[c,d]=ee.useState(new Date().toISOString().split("T")[0]),p=async m=>{a(!0);try{const x=await nt.getPlan(m||c);n(x.plan),r(x.items||[])}catch(x){console.error("Failed to load plan:",x)}finally{a(!1)}};ee.useEffect(()=>{p(c)},[c]);const h=async()=>{l(!0);try{const m=await nt.generatePlan(c);n(m.plan),r(m.items||[]),t({type:"success",title:"Plan Generated",message:"Topological dependencies & calendar busy slots reconciled."})}catch(m){t({type:"error",title:"Generation Failed",message:m.message})}finally{l(!1)}};return f.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[f.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[f.jsxs("div",{children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx("span",{className:"text-xs font-mono text-emerald-400 uppercase tracking-widest",children:"Deterministic Planner"}),f.jsx("span",{className:"h-1 w-1 rounded-full bg-emerald-400"}),f.jsx("span",{className:"text-xs text-os-secondary",children:c})]}),f.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight mt-1",children:"Day Schedule & Conflict Carving"}),f.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Strict deadline separation · Busy slot allocation · Dependency preservation"})]}),f.jsxs("div",{className:"flex items-center gap-2.5",children:[f.jsx(Je,{variant:"glass",size:"sm",onClick:()=>p(),isLoading:s,leftIcon:f.jsx(ii,{className:"w-3.5 h-3.5"}),children:"Refresh"}),f.jsx(Je,{variant:"primary",size:"sm",onClick:h,isLoading:o,leftIcon:f.jsx(Zn,{className:"w-3.5 h-3.5"}),children:"Generate / Replan"})]})]}),f.jsx("div",{className:"space-y-4",children:i.length===0?f.jsxs(Ct,{className:"p-12 text-center space-y-3",children:[f.jsx("div",{className:"w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto",children:f.jsx(Or,{className:"w-6 h-6"})}),f.jsxs("h3",{className:"text-base font-semibold text-os-primary",children:["No scheduled plan for ",c]}),f.jsx("p",{className:"text-xs text-os-secondary max-w-sm mx-auto",children:"OS can analyze your open tasks, calendar busy slots, and deadlines to compute an optimal execution order."}),f.jsx(Je,{variant:"primary",size:"md",onClick:h,isLoading:o,leftIcon:f.jsx(Zn,{className:"w-4 h-4"}),children:"Generate Daily Plan"})]}):f.jsx("div",{className:"relative pl-6 md:pl-8 border-l border-os-border/60 space-y-4",children:i.map((m,x)=>{const _=m.item_type==="meeting"||m.item_type==="event",g=m.item_type==="buffer";return f.jsxs("div",{className:"relative group",children:[f.jsx("div",{className:`absolute -left-[31px] md:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-os-bg transition-transform group-hover:scale-110 ${_?"bg-cyan-400":g?"bg-amber-400":"bg-emerald-400"}`}),f.jsxs(Ct,{className:`p-4 transition-all ${_?"border-cyan-500/20":"hover:border-os-border-glass"}`,children:[f.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-os-border/40",children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsxs("span",{className:"font-mono text-xs font-semibold text-emerald-400",children:[m.start_time," - ",m.end_time]}),f.jsx(Tt,{variant:_?"cyan":g?"amber":"emerald",size:"sm",children:m.item_type.toUpperCase()})]}),f.jsxs("span",{className:"text-[11px] font-mono text-os-muted",children:[m.duration_minutes," min slot"]})]}),f.jsxs("div",{className:"pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3",children:[f.jsxs("div",{children:[f.jsx("h4",{className:"text-sm font-semibold text-os-primary",children:m.title}),m.why_now&&f.jsxs("p",{className:"text-xs text-os-secondary mt-1 flex items-center gap-1.5",children:[f.jsx("span",{className:"font-mono text-[10px] uppercase text-os-muted",children:"Rationale:"}),f.jsx("span",{children:m.why_now})]})]}),m.task_id&&f.jsx("div",{className:"flex items-center gap-2",children:f.jsx(Je,{variant:"glass",size:"sm",leftIcon:f.jsx(An,{className:"w-3.5 h-3.5 text-emerald-400"}),onClick:async()=>{try{await nt.completeTask(m.task_id),t({type:"success",title:"Task Completed",message:"Task marked complete and evidence registered."}),p()}catch(u){t({type:"error",title:"Update Failed",message:u.message})}},children:"Mark Done"})})]})]})]},m.id||x)})})})]})},c0=({isOpen:t,onClose:e,title:n,subtitle:i,children:r,maxWidth:s="md"})=>{if(ee.useEffect(()=>{const o=l=>{l.key==="Escape"&&e()};return t&&(document.body.style.overflow="hidden",window.addEventListener("keydown",o)),()=>{document.body.style.overflow="",window.removeEventListener("keydown",o)}},[t,e]),!t)return null;const a={sm:"max-w-md",md:"max-w-xl",lg:"max-w-3xl",xl:"max-w-5xl"}[s];return f.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[f.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-200",onClick:e}),f.jsx("div",{className:`relative w-full ${a} z-10 animate-in fade-in zoom-in-95 duration-200`,children:f.jsxs(Ct,{className:"p-6 border-os-border-glass shadow-2xl",children:[f.jsxs("div",{className:"flex items-start justify-between pb-4 border-b border-os-border",children:[f.jsxs("div",{children:[f.jsx("h3",{className:"text-lg font-semibold text-os-primary",children:n}),i&&f.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:i})]}),f.jsx("button",{onClick:e,className:"text-os-muted hover:text-os-primary p-1.5 rounded-lg hover:bg-white/5 transition-colors",children:f.jsx(Of,{className:"w-5 h-5"})})]}),f.jsx("div",{className:"mt-4",children:r})]})})]})},bA=()=>{const{addNotification:t}=ln(),[e,n]=ee.useState("commitments"),[i,r]=ee.useState([]),[s,a]=ee.useState([]),[o,l]=ee.useState(!0),[c,d]=ee.useState(!1),[p,h]=ee.useState(""),[m,x]=ee.useState(""),[_,g]=ee.useState(""),[u,v]=ee.useState(50),[y,S]=ee.useState(!1),N=async()=>{l(!0);try{const[A,R]=await Promise.allSettled([nt.getCommitments(),nt.getTasks()]);A.status==="fulfilled"&&r(A.value.commitments||[]),R.status==="fulfilled"&&a(R.value.tasks||[])}catch(A){console.error("Failed to load tasks/commitments:",A)}finally{l(!1)}};ee.useEffect(()=>{N()},[]);const b=async()=>{if(p.trim()){S(!0);try{e==="commitments"?(await nt.createCommitment({title:p.trim(),description:m.trim()||void 0,deadline:_||null,priority:u}),t({type:"success",title:"Commitment Registered",message:"Saved to World Model with immutable deadline tracking."})):(await nt.createTask(p.trim(),{priority:u,deadline:_||null}),t({type:"success",title:"Task Created",message:"Task added to execution pool."})),d(!1),h(""),x(""),g(""),N()}catch(A){t({type:"error",title:"Creation Failed",message:A.message})}finally{S(!1)}}};return f.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[f.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[f.jsxs("div",{children:[f.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Commitments & Work"}),f.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Real-world contractual commitments vs tactical execution tasks"})]}),f.jsxs("div",{className:"flex items-center gap-2.5",children:[f.jsx(Je,{variant:"glass",size:"sm",onClick:N,isLoading:o,leftIcon:f.jsx(ii,{className:"w-3.5 h-3.5"}),children:"Refresh"}),f.jsx(Je,{variant:"primary",size:"sm",onClick:()=>d(!0),leftIcon:f.jsx(dv,{className:"w-3.5 h-3.5"}),children:e==="commitments"?"New Commitment":"New Task"})]})]}),f.jsxs("div",{className:"flex items-center gap-2 border-b border-os-border select-none",children:[f.jsxs("button",{onClick:()=>n("commitments"),className:`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${e==="commitments"?"border-emerald-400 text-emerald-400":"border-transparent text-os-secondary hover:text-os-primary"}`,children:["Commitments (",i.length,")"]}),f.jsxs("button",{onClick:()=>n("tasks"),className:`px-4 py-2.5 text-xs font-semibold tracking-wide transition-all border-b-2 ${e==="tasks"?"border-emerald-400 text-emerald-400":"border-transparent text-os-secondary hover:text-os-primary"}`,children:["Tasks (",s.length,")"]})]}),e==="commitments"?f.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:i.length===0?f.jsx("div",{className:"col-span-full py-12 text-center text-xs text-os-muted",children:"No active commitments found. Create one or let OS detect commitments from email."}):i.map(A=>f.jsxs(Ct,{className:"p-5 space-y-3",children:[f.jsxs("div",{className:"flex items-start justify-between gap-2",children:[f.jsxs("div",{children:[f.jsx("span",{className:"text-[10px] font-mono uppercase tracking-wider text-emerald-400",children:"Commitment"}),f.jsx("h3",{className:"text-base font-bold text-os-primary mt-0.5",children:A.title})]}),f.jsx(Tt,{variant:A.status==="active"?"emerald":"neutral",size:"sm",children:A.status.toUpperCase()})]}),A.description&&f.jsx("p",{className:"text-xs text-os-secondary leading-relaxed",children:A.description}),f.jsxs("div",{className:"pt-2 border-t border-os-border/50 grid grid-cols-2 gap-2 text-[11px] font-mono",children:[f.jsxs("div",{children:[f.jsx("span",{className:"text-os-muted block text-[10px]",children:"DEADLINE"}),f.jsx("span",{className:"text-os-primary font-medium",children:A.deadline?new Date(A.deadline).toLocaleDateString():"None set"})]}),f.jsxs("div",{children:[f.jsx("span",{className:"text-os-muted block text-[10px]",children:"PRIORITY"}),f.jsxs("span",{className:"text-emerald-400 font-medium",children:[A.priority," / 100"]})]})]})]},A.id))}):f.jsx("div",{className:"space-y-2.5",children:s.length===0?f.jsx("div",{className:"py-12 text-center text-xs text-os-muted",children:"No tasks currently tracked."}):s.map(A=>{const R=A.status==="DONE";return f.jsxs(Ct,{className:`p-4 flex items-center justify-between transition-all ${R?"opacity-60 bg-white/2":""}`,children:[f.jsxs("div",{className:"flex items-center gap-3",children:[f.jsx("button",{onClick:async()=>{if(!R)try{await nt.completeTask(String(A.id)),t({type:"success",title:"Task Done",message:"Completion recorded with verification."}),N()}catch(w){t({type:"error",title:"Failed",message:w.message})}},className:`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${R?"bg-emerald-500 border-emerald-500 text-black":"border-os-border hover:border-emerald-400 text-transparent"}`,children:f.jsx(An,{className:"w-3.5 h-3.5"})}),f.jsxs("div",{children:[f.jsx("div",{className:`text-xs md:text-sm font-medium ${R?"line-through text-os-muted":"text-os-primary"}`,children:A.title}),f.jsxs("div",{className:"text-[10px] font-mono text-os-muted mt-0.5",children:["Duration: ",A.estimated_duration_minutes||60,"m · Priority: ",A.priority||50]})]})]}),f.jsx(Tt,{variant:R?"neutral":"cyan",size:"sm",children:A.status})]},A.id)})}),f.jsx(c0,{isOpen:c,onClose:()=>d(!1),title:e==="commitments"?"Register New Commitment":"Create Task",subtitle:"Saved to the World Model database.",children:f.jsxs("div",{className:"space-y-4 text-xs",children:[f.jsxs("div",{children:[f.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Title"}),f.jsx("input",{type:"text",value:p,onChange:A=>h(A.target.value),placeholder:"e.g. Send final investment proposal",className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"})]}),e==="commitments"&&f.jsxs("div",{children:[f.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Description"}),f.jsx("textarea",{value:m,onChange:A=>x(A.target.value),placeholder:"Contractual context, scope, or conditions...",rows:3,className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"})]}),f.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[f.jsxs("div",{children:[f.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Deadline"}),f.jsx("input",{type:"date",value:_,onChange:A=>g(A.target.value),className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"})]}),f.jsxs("div",{children:[f.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Priority (1-100)"}),f.jsx("input",{type:"number",min:"1",max:"100",value:u,onChange:A=>v(Number(A.target.value)),className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400"})]})]}),f.jsxs("div",{className:"flex justify-end gap-2 pt-3 border-t border-os-border",children:[f.jsx(Je,{variant:"ghost",size:"sm",onClick:()=>d(!1),children:"Cancel"}),f.jsx(Je,{variant:"primary",size:"sm",onClick:b,isLoading:y,children:"Save"})]})]})})]})},CA=()=>{const{refreshData:t}=ln(),[e,n]=ee.useState([]),[i,r]=ee.useState([]),[s,a]=ee.useState(!0),o=async()=>{a(!0);try{const[c,d]=await Promise.allSettled([nt.getV1Approvals(),nt.getPendingActions()]);c.status==="fulfilled"&&n(c.value.pending_approvals||[]),d.status==="fulfilled"&&r(d.value.pending||[])}catch(c){console.error("Failed to load approvals:",c)}finally{a(!1)}};ee.useEffect(()=>{o()},[]);const l=e.length+i.length;return f.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[f.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[f.jsxs("div",{children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx("span",{className:"text-xs font-mono text-amber-400 uppercase tracking-widest",children:"Governance & Safety"}),f.jsx("span",{className:"h-1 w-1 rounded-full bg-amber-400"}),f.jsxs("span",{className:"text-xs text-os-secondary",children:[l," pending review"]})]}),f.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight mt-1",children:"Safety & Action Approval Center"}),f.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Cryptographic SHA-256 tamper detection · Double-execution prevention · Expiry guards"})]}),f.jsx(Je,{variant:"glass",size:"sm",onClick:o,isLoading:s,leftIcon:f.jsx(ii,{className:"w-3.5 h-3.5"}),children:"Refresh Queue"})]}),f.jsx(Ct,{className:"p-4 border-amber-500/20 bg-amber-500/5",children:f.jsxs("div",{className:"flex items-start gap-3",children:[f.jsx("div",{className:"p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0",children:f.jsx(ev,{className:"w-4 h-4"})}),f.jsxs("div",{className:"text-xs space-y-1",children:[f.jsx("h4",{className:"font-semibold text-os-primary",children:"OS Safe Execution Policy"}),f.jsxs("p",{className:"text-os-secondary leading-relaxed",children:["Every external write operation (sending emails, modifying calendar events, writing to external APIs) is intercepted by the ",f.jsx("code",{children:"SafeExecutor"}),". The exact arguments are hashed; any parameter tampering between approval and execution results in an immediate abort."]})]})]})}),f.jsx("div",{className:"space-y-4",children:l===0?f.jsxs(Ct,{className:"p-12 text-center space-y-3",children:[f.jsx("div",{className:"w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto",children:f.jsx(An,{className:"w-6 h-6"})}),f.jsx("h3",{className:"text-base font-semibold text-os-primary",children:"Queue Clear"}),f.jsx("p",{className:"text-xs text-os-secondary max-w-sm mx-auto",children:"There are no pending actions requiring your authorization. OS is running in safe read-only mode for all external channels."})]}):f.jsxs("div",{className:"space-y-4",children:[i.map(c=>f.jsx(Hd,{approval:{id:c.id,aid:c.id,connector_id:c.connector_id,connector_name:c.connector_name,action:c.action,params:c.params,status:"pending"},onDecided:()=>{o(),t()}},c.id)),e.map(c=>f.jsx(Hd,{approval:{id:c.approval_id,action:c.tool_name,risk_level:c.risk_level,params:c.arguments,arguments_hash:c.arguments_hash,status:"pending"},onDecided:()=>{o(),t()}},c.approval_id))]})})]})},RA=()=>{const{addNotification:t,refreshData:e}=ln(),[n,i]=ee.useState([]),[r,s]=ee.useState(!0),[a,o]=ee.useState(!1),[l,c]=ee.useState("research"),[d,p]=ee.useState(""),[h,m]=ee.useState(!1),x=async()=>{s(!0);try{const u=await nt.getAgents();i(u.agent_runs||[])}catch(u){console.error("Failed to load agent runs:",u)}finally{s(!1)}};ee.useEffect(()=>{x()},[]);const _=async()=>{if(d.trim()){m(!0);try{await nt.dispatchAgent(l,d.trim()),t({type:"success",title:"Worker Dispatched",message:`${l.toUpperCase()} worker launched in background.`}),o(!1),p(""),x(),e()}catch(u){t({type:"error",title:"Dispatch Failed",message:u.message})}finally{m(!1)}}},g=[{name:"OpenCode Assistant",type:"coding",icon:Hx,desc:"Local AST code editing, test running, and repository refactoring.",status:"Ready",color:"emerald"},{name:"Agent-Browser",type:"browser",icon:Zu,desc:"Playwright headless/headful web navigation, form fill, and screenshot extraction.",status:"Ready",color:"cyan"},{name:"GPT-Researcher",type:"research",icon:zs,desc:"Multi-source web evidence gathering, citation cross-checking, and synthesis.",status:"Ready",color:"purple"},{name:"Continuous Planner",type:"planner",icon:Or,desc:"Topological dependency sorting, conflict carving, and deadline monitoring.",status:"Monitoring",color:"amber"}];return f.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[f.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[f.jsxs("div",{children:[f.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Specialized OS Workers"}),f.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Dedicated execution units for coding, browser automation, and deep research"})]}),f.jsxs("div",{className:"flex items-center gap-2.5",children:[f.jsx(Je,{variant:"glass",size:"sm",onClick:x,isLoading:r,leftIcon:f.jsx(ii,{className:"w-3.5 h-3.5"}),children:"Refresh"}),f.jsx(Je,{variant:"primary",size:"sm",onClick:()=>o(!0),leftIcon:f.jsx(dv,{className:"w-3.5 h-3.5"}),children:"Dispatch Task"})]})]}),f.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:g.map(u=>{const v=u.icon;return f.jsxs(Ct,{className:"p-4 space-y-3",children:[f.jsxs("div",{className:"flex items-center justify-between",children:[f.jsx("div",{className:"p-2 rounded-lg bg-white/5 border border-white/10 text-os-secondary",children:f.jsx(v,{className:"w-4 h-4 text-emerald-400"})}),f.jsx(Tt,{variant:u.status==="Monitoring"?"cyan":"emerald",size:"sm",children:u.status})]}),f.jsxs("div",{children:[f.jsx("h3",{className:"text-sm font-bold text-os-primary",children:u.name}),f.jsx("p",{className:"text-[11px] text-os-secondary mt-1 leading-snug",children:u.desc})]}),f.jsx("div",{className:"pt-2 border-t border-os-border/40",children:f.jsxs("button",{onClick:()=>{c(u.type),o(!0)},className:"text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1",children:[f.jsx("span",{children:"Dispatch worker"}),f.jsx("span",{children:"→"})]})})]},u.name)})}),f.jsxs("section",{className:"space-y-3",children:[f.jsxs("div",{className:"text-[11px] font-mono uppercase tracking-wider text-os-muted flex items-center gap-2",children:[f.jsx(Ga,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:"Recent Worker Runs"})]}),f.jsx(Ct,{className:"p-4 space-y-2",children:n.length===0?f.jsx("div",{className:"py-8 text-center text-xs text-os-muted",children:'No recent worker tasks recorded. Use "Dispatch Task" or direct OS in chat.'}):n.map(u=>f.jsxs("div",{className:"flex items-center justify-between p-3 rounded-glass-sm bg-white/5 hover:bg-white/10 transition-colors text-xs",children:[f.jsxs("div",{className:"flex items-center gap-3",children:[f.jsx(Tt,{variant:"cyan",size:"sm",children:u.agent_type.toUpperCase()}),f.jsx("span",{className:"font-medium text-os-primary",children:u.instruction})]}),f.jsxs("div",{className:"flex items-center gap-3 font-mono text-[11px]",children:[f.jsx(Tt,{variant:u.status==="completed"?"emerald":u.status==="running"?"amber":"neutral",size:"sm",children:u.status}),u.created_at&&f.jsx("span",{className:"text-os-muted",children:new Date(u.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]})]},u.id))})]}),f.jsx(c0,{isOpen:a,onClose:()=>o(!1),title:"Dispatch Autonomous Worker",subtitle:"Worker will execute in the background with policy bounds.",children:f.jsxs("div",{className:"space-y-4 text-xs",children:[f.jsxs("div",{children:[f.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Worker Type"}),f.jsxs("select",{value:l,onChange:u=>c(u.target.value),className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2 text-os-primary focus:outline-none focus:border-emerald-400",children:[f.jsx("option",{value:"research",children:"GPT-Researcher (Web & Evidence)"}),f.jsx("option",{value:"browser",children:"Agent-Browser (Playwright Web Automation)"}),f.jsx("option",{value:"coding",children:"OpenCode (Code Writer / Editor)"})]})]}),f.jsxs("div",{children:[f.jsx("label",{className:"block text-os-secondary mb-1 uppercase font-mono text-[10px]",children:"Instruction / Objective"}),f.jsx("textarea",{value:d,onChange:u=>p(u.target.value),placeholder:"e.g. Research the latest benchmarks for reasoning models...",rows:4,className:"w-full rounded-glass-sm bg-black/30 border border-os-border p-2.5 text-os-primary focus:outline-none focus:border-emerald-400"})]}),f.jsxs("div",{className:"flex justify-end gap-2 pt-3 border-t border-os-border",children:[f.jsx(Je,{variant:"ghost",size:"sm",onClick:()=>o(!1),children:"Cancel"}),f.jsx(Je,{variant:"primary",size:"sm",onClick:_,isLoading:h,leftIcon:f.jsx(mv,{className:"w-3.5 h-3.5"}),children:"Dispatch"})]})]})})]})},NA=()=>{const[t,e]=ee.useState([]),[n,i]=ee.useState(!0),[r,s]=ee.useState(null),[a,o]=ee.useState(""),l=async()=>{i(!0);try{const d=await nt.getActivity(100);e(d.activity||[])}catch(d){console.error("Failed to load activity log:",d)}finally{i(!1)}};ee.useEffect(()=>{l()},[]);const c=t.filter(d=>d.description.toLowerCase().includes(a.toLowerCase())||d.action_type.toLowerCase().includes(a.toLowerCase()));return f.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[f.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[f.jsxs("div",{children:[f.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Evidence & Audit Trail"}),f.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Immutable log of system decisions, execution receipts, and external read-back verifications"})]}),f.jsx(Je,{variant:"glass",size:"sm",onClick:l,isLoading:n,leftIcon:f.jsx(ii,{className:"w-3.5 h-3.5"}),children:"Refresh"})]}),f.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 rounded-glass-md bg-white/5 border border-os-border text-xs max-w-md",children:[f.jsx(zs,{className:"w-4 h-4 text-os-muted"}),f.jsx("input",{type:"text",value:a,onChange:d=>o(d.target.value),placeholder:"Filter activity by action or keyword...",className:"w-full bg-transparent text-os-primary focus:outline-none placeholder:text-os-muted"})]}),f.jsx("div",{className:"space-y-3",children:c.length===0?f.jsx(Ct,{className:"p-12 text-center text-xs text-os-muted",children:"No activity records matching your query."}):c.map(d=>{const p=r===d.id,h=!!d.evidence_receipt;return f.jsxs(Ct,{className:"p-4 transition-all",children:[f.jsxs("div",{onClick:()=>h&&s(p?null:d.id),className:`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${h?"cursor-pointer select-none":""}`,children:[f.jsxs("div",{className:"flex items-center gap-3",children:[f.jsx("div",{className:"p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400",children:f.jsx(vv,{className:"w-4 h-4"})}),f.jsxs("div",{children:[f.jsx("div",{className:"text-xs font-semibold text-os-primary",children:d.description}),f.jsxs("div",{className:"text-[10px] font-mono text-os-muted",children:["Type: ",d.action_type]})]})]}),f.jsxs("div",{className:"flex items-center gap-3 font-mono text-[11px]",children:[f.jsx("span",{className:"text-os-muted",children:d.timestamp?new Date(d.timestamp).toLocaleTimeString():"Recorded"}),f.jsx(Tt,{variant:"emerald",size:"sm",children:d.status||"VERIFIED"}),h&&f.jsx("button",{className:"text-os-muted hover:text-os-primary",children:p?f.jsx(kx,{className:"w-4 h-4"}):f.jsx(ya,{className:"w-4 h-4"})})]})]}),p&&d.evidence_receipt&&f.jsxs("div",{className:"mt-3 pt-3 border-t border-os-border/50 text-xs font-mono",children:[f.jsxs("div",{className:"flex items-center gap-1.5 text-emerald-400 text-[11px] mb-1.5",children:[f.jsx(eS,{className:"w-3.5 h-3.5"}),f.jsx("span",{children:"World Model Evidence Receipt"})]}),f.jsx("pre",{className:"p-2.5 rounded bg-black/40 border border-white/5 overflow-x-auto text-[11px] text-os-secondary max-h-40",children:JSON.stringify(d.evidence_receipt,null,2)})]})]},d.id)})})]})},PA=()=>{const{addNotification:t}=ln(),[e,n]=ee.useState([]),[i,r]=ee.useState(!0),[s,a]=ee.useState(null),o=async()=>{r(!0);try{const c=await nt.getConnectors();n(c.connectors||[])}catch(c){console.error("Failed to load connectors:",c)}finally{r(!1)}};ee.useEffect(()=>{o()},[]);const l=async c=>{var d;a(c);try{const p=await nt.testConnector(c);p.ok?t({type:"success",title:"Connector Healthy",message:`${c} passed live API verification.`}):t({type:"warning",title:"Connection Notice",message:((d=p.status)==null?void 0:d.health_msg)||"Requires credential or permission review."}),o()}catch(p){t({type:"error",title:"Health Check Failed",message:p.message})}finally{a(null)}};return f.jsxs("div",{className:"max-w-6xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[f.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[f.jsxs("div",{children:[f.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"Connectors & Integrations"}),f.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"Permission-gated live external adapters for email, calendar, and workplace services"})]}),f.jsx(Je,{variant:"glass",size:"sm",onClick:o,isLoading:i,leftIcon:f.jsx(ii,{className:"w-3.5 h-3.5"}),children:"Refresh All"})]}),f.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",children:e.map(c=>{var h;const d=c.state==="connected",p=s===c.id;return f.jsxs(Ct,{className:`p-4 space-y-3 transition-all ${d?"border-emerald-500/25":""}`,children:[f.jsxs("div",{className:"flex items-center justify-between",children:[f.jsxs("div",{className:"flex items-center gap-2.5",children:[f.jsx("span",{className:"text-xl select-none",children:c.icon||"🔌"}),f.jsxs("div",{children:[f.jsx("h3",{className:"text-sm font-bold text-os-primary",children:c.name}),f.jsx("span",{className:"text-[10px] font-mono uppercase text-os-muted",children:c.category||"Connector"})]})]}),f.jsx(Tt,{variant:d?"emerald":c.state==="setup_error"?"danger":"neutral",size:"sm",children:c.state.toUpperCase()})]}),c.health_msg&&f.jsx("p",{className:"text-[11px] text-os-secondary leading-snug line-clamp-2",children:c.health_msg}),f.jsxs("div",{className:"pt-2 border-t border-os-border/40 flex items-center justify-between",children:[f.jsxs("span",{className:"text-[10px] font-mono text-os-muted",children:[((h=c.scopes_granted)==null?void 0:h.length)||0," permissions"]}),f.jsx(Je,{variant:"glass",size:"sm",onClick:()=>l(c.id),isLoading:p,leftIcon:f.jsx(fS,{className:"w-3 h-3 text-emerald-400"}),children:"Test Connection"})]})]},c.id)})})]})},LA=()=>{const{addNotification:t}=ln(),[e,n]=ee.useState([]),[i,r]=ee.useState(!0),[s,a]=ee.useState(""),o=async()=>{r(!0);try{const d=await nt.getMemory();n(d.memories||[])}catch(d){console.error("Failed to load memory:",d)}finally{r(!1)}};ee.useEffect(()=>{o()},[]);const l=async d=>{try{await nt.forgetMemory(d),t({type:"info",title:"Memory Cleared",message:`OS has forgotten: "${d}"`}),o()}catch(p){t({type:"error",title:"Delete Failed",message:p.message})}},c=e.filter(d=>d.key.toLowerCase().includes(s.toLowerCase())||d.value.toLowerCase().includes(s.toLowerCase())||d.type.toLowerCase().includes(s.toLowerCase()));return f.jsxs("div",{className:"max-w-5xl mx-auto w-full px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-200",children:[f.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-os-border/50",children:[f.jsxs("div",{children:[f.jsx("h1",{className:"text-2xl font-bold text-os-primary tracking-tight",children:"OS Memory & Knowledge"}),f.jsx("p",{className:"text-xs text-os-secondary mt-0.5",children:"What OS knows about your preferences, projects, context, and working style"})]}),f.jsx(Je,{variant:"glass",size:"sm",onClick:o,isLoading:i,leftIcon:f.jsx(ii,{className:"w-3.5 h-3.5"}),children:"Refresh"})]}),f.jsxs("div",{className:"flex items-center gap-2 px-3 py-2 rounded-glass-md bg-white/5 border border-os-border text-xs max-w-md",children:[f.jsx(zs,{className:"w-4 h-4 text-os-muted"}),f.jsx("input",{type:"text",value:s,onChange:d=>a(d.target.value),placeholder:"Search what OS remembers...",className:"w-full bg-transparent text-os-primary focus:outline-none placeholder:text-os-muted"})]}),f.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:c.length===0?f.jsx("div",{className:"col-span-full py-12 text-center text-xs text-os-muted",children:"No memories match your query. OS learns preferences naturally as you converse and assign tasks."}):c.map(d=>f.jsxs(Ct,{className:"p-4 space-y-2.5",children:[f.jsxs("div",{className:"flex items-start justify-between gap-2",children:[f.jsxs("div",{className:"flex items-center gap-2",children:[f.jsx(Tt,{variant:"purple",size:"sm",children:d.type.toUpperCase()}),f.jsx("h4",{className:"text-xs font-bold text-os-primary font-mono",children:d.key})]}),f.jsx("button",{onClick:()=>l(d.key),className:"text-os-muted hover:text-rose-400 p-1 rounded hover:bg-white/5 transition-colors",title:"Forget this memory",children:f.jsx(dS,{className:"w-3.5 h-3.5"})})]}),f.jsx("p",{className:"text-xs text-os-secondary leading-relaxed bg-black/20 p-2.5 rounded-glass-sm border border-white/5",children:d.value}),f.jsxs("div",{className:"text-[10px] font-mono text-os-muted flex items-center gap-1 pt-1",children:[f.jsx(Or,{className:"w-3 h-3"}),f.jsxs("span",{children:["Updated: ",d.updated_at||"Recently"]})]})]},d.key))})]})},DA=()=>{const{currentView:t,notifications:e,removeNotification:n}=ln(),i=()=>{switch(t){case"home":return f.jsx(fm,{});case"chat":return f.jsx(TA,{});case"plan":return f.jsx(AA,{});case"tasks":return f.jsx(bA,{});case"approvals":return f.jsx(CA,{});case"agents":return f.jsx(RA,{});case"activity":return f.jsx(NA,{});case"connectors":return f.jsx(PA,{});case"memory":return f.jsx(LA,{});default:return f.jsx(fm,{})}};return f.jsxs("div",{className:"min-h-screen bg-os-bg text-os-primary flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-400",children:[f.jsx(_A,{}),f.jsxs("div",{className:"flex-1 flex overflow-hidden",children:[f.jsx(yA,{}),f.jsx("main",{className:"flex-1 overflow-y-auto relative",children:i()})]}),f.jsx(SA,{}),f.jsx("div",{className:"fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none",children:e.map(r=>{const s=r.type==="success"?An:r.type==="warning"?Qu:r.type==="error"?Ku:iS,a=r.type==="success"?"border-emerald-500/40 text-emerald-400 shadow-glass-glow":r.type==="warning"?"border-amber-500/40 text-amber-400 shadow-glass-glow-amber":r.type==="error"?"border-rose-500/40 text-rose-400 shadow-glass-glow-danger":"border-cyan-500/40 text-cyan-400 shadow-glass-glow-cyan";return f.jsxs("div",{className:`pointer-events-auto p-3.5 rounded-glass-md glass-panel border ${a} flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200`,children:[f.jsx(s,{className:"w-4 h-4 flex-shrink-0 mt-0.5"}),f.jsxs("div",{className:"flex-1 text-xs",children:[f.jsx("div",{className:"font-bold text-os-primary",children:r.title}),r.message&&f.jsx("div",{className:"text-os-secondary mt-0.5",children:r.message})]}),f.jsx("button",{onClick:()=>n(r.id),className:"text-os-muted hover:text-os-primary p-0.5",children:f.jsx(Of,{className:"w-3.5 h-3.5"})})]},r.id)})})]})},IA=()=>f.jsx(Hy,{children:f.jsx(jy,{children:f.jsx(DA,{})})});nu.createRoot(document.getElementById("root")).render(f.jsx(R0.StrictMode,{children:f.jsx(IA,{})}));
