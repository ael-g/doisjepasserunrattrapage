(this.webpackJsonpdoisjepasserunrattrapage=this.webpackJsonpdoisjepasserunrattrapage||[]).push([[0],{27:function(e,t,n){},28:function(e,t,n){},36:function(e,t,n){"use strict";n.r(t);var c=n(0),a=n.n(c),i=n(4),r=n.n(i),s=(n(27),n(18)),o=n(19),u=n(64),j=(n(28),n(6));var d=function(e){var t=Object(c.useState)(0),n=Object(s.a)(t,2),a=n[0],i=n[1];return Object(c.useEffect)((function(){console.log("Fetching things"),fetch("/diploma/nanterre-l1-histoiredelart-ead.json").then((function(e){return e.json()})).then((function(e){i(e)}))}),[]),Object(j.jsx)(o.a,{basename:"/doisjepasserunrattrapage",children:Object(j.jsx)("div",{className:"App",children:a?a.semestres.map((function(e){return Object(j.jsxs)("div",{children:[e.name,e.ue.map((function(e){return Object(j.jsxs)("div",{children:[e.name,e.ec.map((function(e){return Object(j.jsxs)("div",{children:[e.name," - ",e.credit," ",Object(j.jsx)(u.a,{id:"outlined-basic",variant:"outlined"})]})}))]})}))]})})):Object(j.jsx)(j.Fragment,{})})})},b=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,65)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,i=t.getLCP,r=t.getTTFB;n(e),c(e),a(e),i(e),r(e)}))};r.a.render(Object(j.jsx)(a.a.StrictMode,{children:Object(j.jsx)(d,{})}),document.getElementById("root")),b()}},[[36,1,2]]]);
//# sourceMappingURL=main.37282c51.chunk.js.map