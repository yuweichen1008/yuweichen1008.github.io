(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[195],{8542:function(t,e,a){"use strict";var r=a(7146),n=a(1664),i=a(7668);e.Z=function(t){var e=t.text;return(0,r.tZ)(n.default,{href:"/tags/".concat((0,i.Z)(e)),children:(0,r.tZ)("a",{className:"mr-3 text-sm font-medium text-blue-500 uppercase hover:text-blue-600 dark:hover:text-blue-400",children:e.split(" ").join("-")})})}},2807:function(t,e,a){"use strict";a.d(e,{Z:function(){return d}});var r=a(7146),n=a(2345),i=a(8542),l=a(7300),s=a(9748);function c(t){var e=t.totalPages,a=t.currentPage,i=parseInt(a)-1>0,l=parseInt(a)+1<=parseInt(e);return(0,r.tZ)("div",{className:"pt-6 pb-8 space-y-2 md:space-y-5",children:(0,r.BX)("nav",{className:"flex justify-between",children:[!i&&(0,r.tZ)("button",{rel:"previous",className:"cursor-auto disabled:opacity-50",disabled:!i,children:"Previous"}),i&&(0,r.tZ)(n.Z,{href:a-1===1?"/blog/":"/blog/page/".concat(a-1),children:(0,r.tZ)("button",{rel:"previous",children:"Previous"})}),(0,r.BX)("span",{children:[a," of ",e]}),!l&&(0,r.tZ)("button",{rel:"next",className:"cursor-auto disabled:opacity-50",disabled:!l,children:"Next"}),l&&(0,r.tZ)(n.Z,{href:"/blog/page/".concat(a+1),children:(0,r.tZ)("button",{rel:"next",children:"Next"})})]})})}var o={year:"numeric",month:"long",day:"numeric"};function d(t){var e=t.posts,a=t.title,d=t.initialDisplayPosts,u=void 0===d?[]:d,g=t.pagination,h=(0,s.useState)(""),p=h[0],m=h[1],x=e.filter((function(t){return(t.title+t.summary+t.tags.join(" ")).toLowerCase().includes(p.toLowerCase())})),f=u.length>0&&!p?u:x;return(0,r.BX)(r.HY,{children:[(0,r.BX)("div",{className:"divide-y",children:[(0,r.BX)("div",{className:"pt-6 pb-8 space-y-2 md:space-y-5",children:[(0,r.tZ)("h1",{className:"text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14",children:a}),(0,r.BX)("div",{className:"relative max-w-lg",children:[(0,r.tZ)("input",{"aria-label":"Search articles",type:"text",onChange:function(t){return m(t.target.value)},placeholder:"Search articles",className:"block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"}),(0,r.tZ)("svg",{className:"absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,r.tZ)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})]})]}),(0,r.BX)("ul",{children:[!x.length&&"No posts found.",f.map((function(t){var e=t.slug,a=t.date,s=t.title,c=t.summary,d=t.tags;return(0,r.tZ)("li",{className:"py-4",children:(0,r.BX)("article",{className:"space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline",children:[(0,r.BX)("dl",{children:[(0,r.tZ)("dt",{className:"sr-only",children:"Published on"}),(0,r.tZ)("dd",{className:"text-base font-medium leading-6 text-gray-500 dark:text-gray-400",children:(0,r.tZ)("time",{dateTime:a,children:new Date(a).toLocaleDateString(l.SP,o)})})]}),(0,r.BX)("div",{className:"space-y-3 xl:col-span-3",children:[(0,r.BX)("div",{children:[(0,r.tZ)("h3",{className:"text-2xl font-bold leading-8 tracking-tight",children:(0,r.tZ)(n.Z,{href:"/blog/".concat(e),className:"text-gray-900 dark:text-gray-100",children:s})}),(0,r.tZ)("div",{className:"flex flex-wrap",children:d.map((function(t){return(0,r.tZ)(i.Z,{text:t},t)}))})]}),(0,r.tZ)("div",{className:"prose text-gray-500 max-w-none dark:text-gray-400",children:c})]})]})},e)}))]})]}),g&&g.totalPages>1&&!p&&(0,r.tZ)(c,{currentPage:g.currentPage,totalPages:g.totalPages})]})}},7668:function(t,e){"use strict";e.Z=function(t){return t&&t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map((function(t){return t.toLowerCase()})).join("-")}},2695:function(t,e,a){"use strict";a.r(e),a.d(e,{__N_SSG:function(){return s},POSTS_PER_PAGE:function(){return c},default:function(){return o}});var r=a(7146),n=a(7300),i=a(2807),l=a(4629),s=!0,c=10;function o(t){var e=t.posts,a=t.initialDisplayPosts,s=t.pagination;return(0,r.BX)(r.HY,{children:[(0,r.tZ)(l.Is,{title:"Blog - ".concat(n.v),description:n.WL,url:"".concat(n.or,"/blog")}),(0,r.tZ)(i.Z,{posts:e,initialDisplayPosts:a,pagination:s,title:"All Posts"})]})}},5809:function(t,e,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog",function(){return a(2695)}])}},function(t){t.O(0,[888,179],(function(){return e=5809,t(t.s=e);var e}));var e=t.O();_N_E=e}]);