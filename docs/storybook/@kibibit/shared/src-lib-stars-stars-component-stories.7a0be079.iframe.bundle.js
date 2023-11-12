(self.webpackChunk_kibibit_source=self.webpackChunk_kibibit_source||[]).push([[250],{"./@kibibit/shared/src/lib/stars/stars.component.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{_:()=>StarsComponent});var tslib_es6=__webpack_require__("./node_modules/tslib/tslib.es6.mjs");var stars_componentngResource=__webpack_require__("./@kibibit/shared/src/lib/stars/stars.component.scss?ngResource"),stars_componentngResource_default=__webpack_require__.n(stars_componentngResource),core=__webpack_require__("./node_modules/@angular/core/fesm2022/core.mjs"),common=__webpack_require__("./node_modules/@angular/common/fesm2022/common.mjs");const sizeClassList=["small","medium","large"];let StarsComponent=class StarsComponent{constructor(){this.MAX_RATING=5,this.ratingPercentage=0,this.modalClassName="kb-medium",this.rating=0,this.size="medium"}ngOnInit(){this.ratingPercentage=+(this.rating/this.MAX_RATING*100).toFixed(2)}ngOnChanges(changes){changes.size&&this.updateModalSize(),changes.rating&&(this.ratingPercentage=+(this.rating/this.MAX_RATING*100).toFixed(2))}updateModalSize(){const isValid=sizeClassList.includes(this.size);this.modalClassName="kb-"+(isValid?this.size:"medium")}static#_=this.propDecorators={rating:[{type:core.Input}],size:[{type:core.Input}]}};StarsComponent=(0,tslib_es6.gn)([(0,core.Component)({selector:"kb-stars",standalone:!0,imports:[common.CommonModule],template:'<svg\n     xmlns="http://www.w3.org/2000/svg"\n     style="position: absolute; width: 0; height: 0"\n>\n  <defs>\n    \x3c!-- gradientTransform="rotate(99)" --\x3e\n    <linearGradient id="gradient" >\n      <stop offset="0%"  stop-color="#4854a2" />\n      <stop offset="100%" stop-color="#772088" />\n    </linearGradient>\n  </defs>\n  \n  <symbol id="fiveStars">\n    <path class="st0" d="M18.6,6.7l-5.8-0.1l-1.9-5.4c-0.5-1.5-1.4-1.5-1.9,0L7.2,6.6L1.4,6.7c-1.6,0-1.8,0.8-0.6,1.8l4.6,3.5l-1.7,5.5\n\t\tc-0.5,1.5,0.2,2,1.5,1.1l4.8-3.3l4.8,3.3c1.3,0.9,2,0.4,1.5-1.1l-1.7-5.5l4.6-3.5C20.5,7.5,20.2,6.7,18.6,6.7z \n\t\t\n\t\tM44.6,6.7l-5.8-0.1l-1.9-5.4c-0.5-1.5-1.4-1.5-1.9,0l-1.9,5.4l-5.8,0.1c-1.6,0-1.8,0.8-0.6,1.8l4.6,3.5\n\t\tl-1.7,5.5c-0.5,1.5,0.2,2,1.5,1.1l4.8-3.3l4.8,3.3c1.3,0.9,2,0.4,1.5-1.1l-1.7-5.5l4.6-3.5C46.5,7.5,46.2,6.7,44.6,6.7z\n\t\t\n\t\tM70.6,6.7l-5.8-0.1l-1.9-5.4c-0.5-1.5-1.4-1.5-1.9,0l-1.9,5.4l-5.8,0.1c-1.6,0-1.8,0.8-0.6,1.8l4.6,3.5\n\t\tl-1.7,5.5c-0.5,1.5,0.2,2,1.5,1.1l4.8-3.3l4.8,3.3c1.3,0.9,2,0.4,1.5-1.1l-1.7-5.5l4.6-3.5C72.5,7.5,72.2,6.7,70.6,6.7z\n\n\t\tM96.6,6.7l-5.8-0.1l-1.9-5.4c-0.5-1.5-1.4-1.5-1.9,0l-1.9,5.4l-5.8,0.1c-1.6,0-1.8,0.8-0.6,1.8l4.6,3.5\n\t\tl-1.7,5.5c-0.5,1.5,0.2,2,1.5,1.1l4.8-3.3l4.8,3.3c1.3,0.9,2,0.4,1.5-1.1l-1.7-5.5l4.6-3.5C98.5,7.5,98.2,6.7,96.6,6.7z\n\n\t\tM122.6,6.7l-5.8-0.1l-1.9-5.4c-0.5-1.5-1.4-1.5-1.9,0l-1.9,5.4l-5.8,0.1c-1.6,0-1.8,0.8-0.6,1.8l4.6,3.5\n\t\tl-1.7,5.5c-0.5,1.5,0.2,2,1.5,1.1l4.8-3.3l4.8,3.3c1.3,0.9,2,0.4,1.5-1.1l-1.7-5.5l4.6-3.5C124.5,7.5,124.2,6.7,122.6,6.7z\t\t\n"/>\n\x3c!--     <path\n      d="\n        M 0 22\n        L 27 22\n        L 34 0\n        L 42 22\n        L 69 22\n        L 48 39\n        L 57 65\n        L 34 51\n        L 12 65\n        L 21 39\n        Z\n\n        M 80 22\n        L 107 22\n        L 114 0\n        L 122 22\n        L 149 22\n        L 128 39\n        L 137 65\n        L 114 51\n        L 92 65\n        L 101 39\n        Z\n\n        M 160 22\n        L 187 22\n        L 194 0\n        L 202 22\n        L 229 22\n        L 208 39\n        L 217 65\n        L 194 51\n        L 172 65\n        L 181 39\n        Z\n\n        M 240 22\n        L 267 22\n        L 274 0\n        L 282 22\n        L 309 22\n        L 288 39\n        L 297 65\n        L 274 51\n        L 252 65\n        L 261 39\n        Z\n\n        M 320 22\n        L 347 22\n        L 354 0\n        L 362 22\n        L 389 22\n        L 368 39\n        L 377 65\n        L 354 51\n        L 332 65\n        L 341 39\n        Z\n    "/> --\x3e\n  </symbol>\n</svg>\n\n\x3c!-- viewBox="0 0 389 25" --\x3e\n\n<svg \n  viewBox="0 0 124 19"\n  [ngClass]="modalClassName"\n>\n  <use xlink:href="#fiveStars" />\n  <use xlink:href="#fiveStars" fill="url(#gradient)" [attr.width]="ratingPercentage + \'%\'" />\n</svg>',styles:[stars_componentngResource_default()]})],StarsComponent)},"./@kibibit/shared/src/lib/stars/stars.component.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,default:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={component:__webpack_require__("./@kibibit/shared/src/lib/stars/stars.component.ts")._,title:"Components/kb-stars",tags:["autodocs"],parameters:{backgrounds:{default:"dark"}}},Primary={args:{},render:args=>({template:'\n    <div><kb-stars [rating]="rating1"></kb-stars></div>\n    <div><kb-stars [rating]="rating2"></kb-stars></div>\n    <div><kb-stars [rating]="rating3"></kb-stars></div>\n    <div><kb-stars [rating]="rating4"></kb-stars></div>\n    <div><kb-stars [rating]="rating5"></kb-stars></div>\n    <div><kb-stars [rating]="rating6"></kb-stars></div>\n    <div><kb-stars [rating]="rating7"></kb-stars></div>\n    <div><kb-stars [rating]="rating8"></kb-stars></div>\n    <div><kb-stars [rating]="rating9"></kb-stars></div>\n    <div><kb-stars [rating]="rating10"></kb-stars></div>\n    <div><kb-stars [rating]="rating11"></kb-stars></div>\n    <div><kb-stars [rating]="rating12"></kb-stars></div>\n    '.trim(),props:{...args,rating1:0,rating2:.5,rating3:1,rating4:1.5,rating5:2,rating6:2.5,rating7:3,rating8:3.25,rating9:3.5,rating10:3.75,rating11:4,rating12:5}})}},"./node_modules/css-loader/dist/runtime/api.js":module=>{"use strict";module.exports=function(cssWithMappingToString){var list=[];return list.toString=function toString(){return this.map((function(item){var content="",needLayer=void 0!==item[5];return item[4]&&(content+="@supports (".concat(item[4],") {")),item[2]&&(content+="@media ".concat(item[2]," {")),needLayer&&(content+="@layer".concat(item[5].length>0?" ".concat(item[5]):""," {")),content+=cssWithMappingToString(item),needLayer&&(content+="}"),item[2]&&(content+="}"),item[4]&&(content+="}"),content})).join("")},list.i=function i(modules,media,dedupe,supports,layer){"string"==typeof modules&&(modules=[[null,modules,void 0]]);var alreadyImportedModules={};if(dedupe)for(var k=0;k<this.length;k++){var id=this[k][0];null!=id&&(alreadyImportedModules[id]=!0)}for(var _k=0;_k<modules.length;_k++){var item=[].concat(modules[_k]);dedupe&&alreadyImportedModules[item[0]]||(void 0!==layer&&(void 0===item[5]||(item[1]="@layer".concat(item[5].length>0?" ".concat(item[5]):""," {").concat(item[1],"}")),item[5]=layer),media&&(item[2]?(item[1]="@media ".concat(item[2]," {").concat(item[1],"}"),item[2]=media):item[2]=media),supports&&(item[4]?(item[1]="@supports (".concat(item[4],") {").concat(item[1],"}"),item[4]=supports):item[4]="".concat(supports)),list.push(item))}},list}},"./node_modules/css-loader/dist/runtime/noSourceMaps.js":module=>{"use strict";module.exports=function(i){return i[1]}},"./@kibibit/shared/src/lib/stars/stars.component.scss?ngResource":(module,__unused_webpack_exports,__webpack_require__)=>{var ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___=__webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js"),___CSS_LOADER_EXPORT___=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);___CSS_LOADER_EXPORT___.push([module.id,":host {\n  display: inline-block;\n  overflow: hidden;\n}\n\n.kb-large {\n  width: 300px;\n}\n\n.kb-medium {\n  width: 142px;\n}\n\n.kb-small {\n  width: 96px;\n}",""]),module.exports=___CSS_LOADER_EXPORT___.toString()}}]);