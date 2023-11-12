(self.webpackChunk_kibibit_source=self.webpackChunk_kibibit_source||[]).push([[409],{"./@kibibit/shared/src/lib/roulette/roulette.component.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,default:()=>roulette_component_stories});var tslib_es6=__webpack_require__("./node_modules/tslib/tslib.es6.mjs");var roulette_componentngResource=__webpack_require__("./@kibibit/shared/src/lib/roulette/roulette.component.scss?ngResource"),roulette_componentngResource_default=__webpack_require__.n(roulette_componentngResource),debounce=__webpack_require__("./node_modules/lodash-es/debounce.js"),common=__webpack_require__("./node_modules/@angular/common/fesm2022/common.mjs"),core=__webpack_require__("./node_modules/@angular/core/fesm2022/core.mjs");let RouletteComponent=class RouletteComponent{onResize(){this.debouncedCalculateItemsPerScreen(!0)}constructor(baseHref,el){this.baseHref=baseHref,this.el=el,this.playlistData={},this.listData=[],this.currentIndex=0,this.itemsPerScreen=0,this.itemsOnScreen=[],this.maxSpeed=100,this.acceleration=30,this.currentSpeed=300,this.itemHeight=40,this.spin=!1,this.currentItemIndex=new core.EventEmitter,this.rouletteStopped=new core.EventEmitter,this.debouncedCalculateItemsPerScreen=(0,debounce.Z)(this.calculateItemsPerScreen.bind(this),50)}ngOnChanges(changes){const spinChange=changes.spin;spinChange&&(spinChange.currentValue&&!spinChange.previousValue&&this.startSpinning(),!spinChange.currentValue&&spinChange.previousValue&&this.stopSpinning()),changes.listData&&this.calculateItemsPerScreen()}ngOnInit(){console.log("started")}ngAfterViewInit(){this.calculateItemsPerScreen()}ngOnDestroy(){this.speedInterval&&clearInterval(this.speedInterval)}calculateItemsPerScreen(onResizeEvent=!1){const componentHeight=this.el.nativeElement.clientHeight,itemsCount=Math.floor(componentHeight/this.itemHeight);this.itemsPerScreen=itemsCount%2==0?itemsCount-1:itemsCount,this.itemsOnScreen=this.listData.slice(this.currentIndex,this.currentIndex+this.itemsPerScreen),this.setCurrentSelectedItem(onResizeEvent)}setCurrentSelectedItem(onResizeEvent=!1){const middleIndex=Math.floor(this.itemsPerScreen/2);this.currentIndex=(this.currentSelectedItemIndex&&onResizeEvent?this.currentSelectedItemIndex:this.currentIndex+middleIndex)-middleIndex,this.currentSelectedItem=this.listData[this.currentIndex+middleIndex],this.currentSelectedItemIndex=middleIndex,this.currentOriginalListSelectedItemIndex=this.currentIndex+middleIndex,this.currentItemIndex.emit(this.currentOriginalListSelectedItemIndex)}updateCurrentIndex(){this.currentIndex>=this.listData.length-this.itemsPerScreen?this.currentIndex=0:this.currentIndex++,this.itemsOnScreen=this.listData.slice(this.currentIndex,this.currentIndex+this.itemsPerScreen),this.setCurrentSelectedItem()}startSpinning(){clearInterval(this.speedInterval),this.speedInterval=setTimeout((()=>{this.currentSpeed>this.maxSpeed&&(this.currentSpeed-=this.acceleration,this.currentSpeed=this.currentSpeed<this.maxSpeed?this.maxSpeed:this.currentSpeed),this.updateCurrentIndex(),this.startSpinning()}),this.currentSpeed)}stopSpinning(){clearInterval(this.speedInterval),this.speedInterval=setTimeout((()=>{const shouldStop=this.currentSpeed>=300;shouldStop?clearInterval(this.speedInterval):this.currentSpeed+=this.acceleration,shouldStop?(clearInterval(this.speedInterval),this.rouletteStopped.emit(this.currentOriginalListSelectedItemIndex)):(this.updateCurrentIndex(),this.stopSpinning())}),this.currentSpeed)}static#_=this.ctorParameters=()=>[{type:String,decorators:[{type:core.Inject,args:[common.APP_BASE_HREF]}]},{type:core.ElementRef}];static#_2=this.propDecorators={listData:[{type:core.Input}],itemHeight:[{type:core.Input}],spin:[{type:core.Input}],currentItemIndex:[{type:core.Output}],rouletteStopped:[{type:core.Output}],onResize:[{type:core.HostListener,args:["window:resize",["$event"]]}]}};RouletteComponent=(0,tslib_es6.gn)([(0,core.Component)({selector:"kb-roulette",standalone:!0,imports:[common.CommonModule],providers:[{provide:common.APP_BASE_HREF,useValue:"foobar"}],template:'<div\n  *ngFor="let item of itemsOnScreen; let i = index"\n  class="roulette-item"\n  [style.height.px]="itemHeight"\n  [style.line-height.px]="itemHeight"\n  [class.selected]="i === currentSelectedItemIndex"\n>\n  {{ item }}\n</div>',styles:[roulette_componentngResource_default()]}),(0,tslib_es6.w6)("design:paramtypes",[String,core.ElementRef])],RouletteComponent);const roulette_component_stories={component:RouletteComponent,title:"Components/kb-roulette",tags:["autodocs"],parameters:{layout:"fullscreen",docs:{story:{inline:!1,iframeHeight:400}},backgrounds:{default:"lightblue",values:[{name:"lightblue",value:"#209CEE"}]}}},Primary={args:{listData:Array.from({length:100},(()=>Math.random().toString(36).substring(7))),spin:!1}}},"./node_modules/css-loader/dist/runtime/api.js":module=>{"use strict";module.exports=function(cssWithMappingToString){var list=[];return list.toString=function toString(){return this.map((function(item){var content="",needLayer=void 0!==item[5];return item[4]&&(content+="@supports (".concat(item[4],") {")),item[2]&&(content+="@media ".concat(item[2]," {")),needLayer&&(content+="@layer".concat(item[5].length>0?" ".concat(item[5]):""," {")),content+=cssWithMappingToString(item),needLayer&&(content+="}"),item[2]&&(content+="}"),item[4]&&(content+="}"),content})).join("")},list.i=function i(modules,media,dedupe,supports,layer){"string"==typeof modules&&(modules=[[null,modules,void 0]]);var alreadyImportedModules={};if(dedupe)for(var k=0;k<this.length;k++){var id=this[k][0];null!=id&&(alreadyImportedModules[id]=!0)}for(var _k=0;_k<modules.length;_k++){var item=[].concat(modules[_k]);dedupe&&alreadyImportedModules[item[0]]||(void 0!==layer&&(void 0===item[5]||(item[1]="@layer".concat(item[5].length>0?" ".concat(item[5]):""," {").concat(item[1],"}")),item[5]=layer),media&&(item[2]?(item[1]="@media ".concat(item[2]," {").concat(item[1],"}"),item[2]=media):item[2]=media),supports&&(item[4]?(item[1]="@supports (".concat(item[4],") {").concat(item[1],"}"),item[4]=supports):item[4]="".concat(supports)),list.push(item))}},list}},"./node_modules/css-loader/dist/runtime/noSourceMaps.js":module=>{"use strict";module.exports=function(i){return i[1]}},"./node_modules/lodash-es/debounce.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>lodash_es_debounce});const lodash_es_isObject=function isObject(value){var type=typeof value;return null!=value&&("object"==type||"function"==type)};const _freeGlobal="object"==typeof __webpack_require__.g&&__webpack_require__.g&&__webpack_require__.g.Object===Object&&__webpack_require__.g;var freeSelf="object"==typeof self&&self&&self.Object===Object&&self;const _root=_freeGlobal||freeSelf||Function("return this")();const lodash_es_now=function(){return _root.Date.now()};var reWhitespace=/\s/;const _trimmedEndIndex=function trimmedEndIndex(string){for(var index=string.length;index--&&reWhitespace.test(string.charAt(index)););return index};var reTrimStart=/^\s+/;const _baseTrim=function baseTrim(string){return string?string.slice(0,_trimmedEndIndex(string)+1).replace(reTrimStart,""):string};const _Symbol=_root.Symbol;var objectProto=Object.prototype,_getRawTag_hasOwnProperty=objectProto.hasOwnProperty,nativeObjectToString=objectProto.toString,symToStringTag=_Symbol?_Symbol.toStringTag:void 0;const _getRawTag=function getRawTag(value){var isOwn=_getRawTag_hasOwnProperty.call(value,symToStringTag),tag=value[symToStringTag];try{value[symToStringTag]=void 0;var unmasked=!0}catch(e){}var result=nativeObjectToString.call(value);return unmasked&&(isOwn?value[symToStringTag]=tag:delete value[symToStringTag]),result};var _objectToString_nativeObjectToString=Object.prototype.toString;const _objectToString=function objectToString(value){return _objectToString_nativeObjectToString.call(value)};var _baseGetTag_symToStringTag=_Symbol?_Symbol.toStringTag:void 0;const _baseGetTag=function baseGetTag(value){return null==value?void 0===value?"[object Undefined]":"[object Null]":_baseGetTag_symToStringTag&&_baseGetTag_symToStringTag in Object(value)?_getRawTag(value):_objectToString(value)};const lodash_es_isObjectLike=function isObjectLike(value){return null!=value&&"object"==typeof value};const lodash_es_isSymbol=function isSymbol(value){return"symbol"==typeof value||lodash_es_isObjectLike(value)&&"[object Symbol]"==_baseGetTag(value)};var reIsBadHex=/^[-+]0x[0-9a-f]+$/i,reIsBinary=/^0b[01]+$/i,reIsOctal=/^0o[0-7]+$/i,freeParseInt=parseInt;const lodash_es_toNumber=function toNumber(value){if("number"==typeof value)return value;if(lodash_es_isSymbol(value))return NaN;if(lodash_es_isObject(value)){var other="function"==typeof value.valueOf?value.valueOf():value;value=lodash_es_isObject(other)?other+"":other}if("string"!=typeof value)return 0===value?value:+value;value=_baseTrim(value);var isBinary=reIsBinary.test(value);return isBinary||reIsOctal.test(value)?freeParseInt(value.slice(2),isBinary?2:8):reIsBadHex.test(value)?NaN:+value};var nativeMax=Math.max,nativeMin=Math.min;const lodash_es_debounce=function debounce(func,wait,options){var lastArgs,lastThis,maxWait,result,timerId,lastCallTime,lastInvokeTime=0,leading=!1,maxing=!1,trailing=!0;if("function"!=typeof func)throw new TypeError("Expected a function");function invokeFunc(time){var args=lastArgs,thisArg=lastThis;return lastArgs=lastThis=void 0,lastInvokeTime=time,result=func.apply(thisArg,args)}function shouldInvoke(time){var timeSinceLastCall=time-lastCallTime;return void 0===lastCallTime||timeSinceLastCall>=wait||timeSinceLastCall<0||maxing&&time-lastInvokeTime>=maxWait}function timerExpired(){var time=lodash_es_now();if(shouldInvoke(time))return trailingEdge(time);timerId=setTimeout(timerExpired,function remainingWait(time){var timeWaiting=wait-(time-lastCallTime);return maxing?nativeMin(timeWaiting,maxWait-(time-lastInvokeTime)):timeWaiting}(time))}function trailingEdge(time){return timerId=void 0,trailing&&lastArgs?invokeFunc(time):(lastArgs=lastThis=void 0,result)}function debounced(){var time=lodash_es_now(),isInvoking=shouldInvoke(time);if(lastArgs=arguments,lastThis=this,lastCallTime=time,isInvoking){if(void 0===timerId)return function leadingEdge(time){return lastInvokeTime=time,timerId=setTimeout(timerExpired,wait),leading?invokeFunc(time):result}(lastCallTime);if(maxing)return clearTimeout(timerId),timerId=setTimeout(timerExpired,wait),invokeFunc(lastCallTime)}return void 0===timerId&&(timerId=setTimeout(timerExpired,wait)),result}return wait=lodash_es_toNumber(wait)||0,lodash_es_isObject(options)&&(leading=!!options.leading,maxWait=(maxing="maxWait"in options)?nativeMax(lodash_es_toNumber(options.maxWait)||0,wait):maxWait,trailing="trailing"in options?!!options.trailing:trailing),debounced.cancel=function cancel(){void 0!==timerId&&clearTimeout(timerId),lastInvokeTime=0,lastArgs=lastCallTime=lastThis=timerId=void 0},debounced.flush=function flush(){return void 0===timerId?result:trailingEdge(lodash_es_now())},debounced}},"./@kibibit/shared/src/lib/roulette/roulette.component.scss?ngResource":(module,__unused_webpack_exports,__webpack_require__)=>{var ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___=__webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js"),___CSS_LOADER_EXPORT___=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);___CSS_LOADER_EXPORT___.push([module.id,":host {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  height: 100%;\n}\n\n.roulette-item {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  padding-inline-start: 2em;\n  padding-inline-end: 1em;\n  border-start-end-radius: 3em;\n  border-end-end-radius: 3em;\n}\n.roulette-item.selected {\n  background: white;\n  color: black;\n}",""]),module.exports=___CSS_LOADER_EXPORT___.toString()}}]);