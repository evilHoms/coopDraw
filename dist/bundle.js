!function(e){function t(o){if(n[o])return n[o].exports;var s=n[o]={i:o,l:!1,exports:{}};return e[o].call(s.exports,s,s.exports,t),s.l=!0,s.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=2)}([function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();t.Requests=function(){function e(){o(this,e)}return s(e,null,[{key:"getRooms",value:function(e){return new Promise(function(t,n){fetch(e).then(function(e){return e.json()}).then(function(e){t(e)})})}},{key:"newRoom",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return new Promise(function(o,s){var i=new FormData;i.append("host",t),i.append("password",n),i.append("roomId",function(e){var t=document.querySelectorAll(".room"),n=void 0,o=void 0;do{n=!0,o=Math.round(1e4*Math.random()),t.forEach(function(t){t.dataset.roomId===e+o&&(n=!1)})}while(!n);return e+o}("room")),fetch(e,{method:"POST",body:i}).then(function(e){return e.json()}).then(function(e){o(e)})})}},{key:"connectRoom",value:function(e,t,n){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null;return new Promise(function(s,i){var r=new FormData;r.append("name",t),r.append("password",o),r.append("action","connect"),r.append("roomId",n),console.log(e),fetch(e,{method:"PUT",body:r}).then(function(e){return e.json()}).then(function(e){s(e)})})}},{key:"disconnectRoom",value:function(e,t,n){return new Promise(function(o,s){var i=new FormData;i.append("name",t),i.append("action","disconnect"),i.append("roomId",n),console.log(e),fetch(e,{method:"PUT",body:i}).then(function(e){return e.json()}).then(function(e){o(e)})})}},{key:"deleteRoom",value:function(e,t){return new Promise(function(n,o){var s=new FormData;s.append("roomId",t),console.log(e),fetch(e,{method:"DELETE",body:s}).then(function(e){return e.json()}).then(function(e){n(e)})})}},{key:"newImage",value:function(e,t,n){return new Promise(function(o,s){var i=new FormData;i.append("title",n),i.append("image",t);var r={method:"POST",body:i};fetch(e,r).then(function(e){if(200===e.status)return e.json();s(e)}).then(function(e){console.log(e),o(e)}).catch(s)})}},{key:"setImageId",value:function(e,t,n){return new Promise(function(o,s){var i=new FormData;i.append("roomId",t),i.append("imageId",n);var r={method:"PATCH",body:i};fetch(e,r).then(function(e){return e.json()}).then(o).catch(s)})}}]),e}()},function(e,t){e.exports={hostname:"https://afternoon-cove-50884.herokuapp.com/"}},function(e,t,n){"use strict";function o(e,t){e.textContent="",t.forEach(function(t){var n=new a.Room(t.host,t.roomId,t.users.length-1,s);e.appendChild(n.room)})}function s(e){e.preventDefault();var t=e.currentTarget.dataset.roomId;if(e.target.classList.contains("room__connect--btn")){var n=new u.Popup("connectRoom",r,t);m.appendChild(n.popup),document.querySelector(".popup").querySelector("input").focus()}}function i(e){e.preventDefault();var t=new u.Popup("newRoom",r);m.appendChild(t.popup),document.querySelector(".popup").querySelector("input").focus()}function r(e){if(e&&e.preventDefault(),e.target.classList.contains("popup__submit--btn")){var t=this.querySelector("#nameInput").value,n=this.querySelector("#passInput").value;if(console.log(t,n),"newRoom"===this.dataset.type)c.Requests.newRoom(f,t,n).then(function(e){document.querySelector(".rooms").classList.add("hidden"),document.querySelector(".controlls").classList.add("hidden"),g=new l.Canvas(document.querySelector(".editor"),e.host,e.users,t,!0,e.roomId)}).catch(function(e){return console.log(e)});else if("connectRoom"===this.dataset.type){var o=e.currentTarget.dataset.roomId;console.log(o),c.Requests.connectRoom(f,t,o,n).then(function(e){document.querySelector(".rooms").classList.add("hidden"),document.querySelector(".controlls").classList.add("hidden"),g=new l.Canvas(document.querySelector(".editor"),e.host,e.users,t,!1,o,e.imageId,e.background)}).catch(function(e){return console.log(e)})}this.parentElement.removeChild(this)}}n(3);var a=n(4),c=n(0),u=n(6),l=n(8),d=n(1),h=function(e){return e&&e.__esModule?e:{default:e}}(d),p=h.default.hostname,f=p+"/rooms",m=document.querySelector("#root"),v=document.querySelector(".new-room--btn"),y=document.querySelector(".rooms__list"),g=null;c.Requests.getRooms(f).then(function(e){e.length?(console.log(e),o(y,e)):document.querySelector(".rooms__title").textContent="No Rooms"}).catch(function(e){return console.log(e)}),v.addEventListener("click",i)},function(e,t){},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.Room=void 0;var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();n(5);t.Room=function(){function e(t,n,s,i){o(this,e),this.hostName=t,this.guestsCount=s,this.roomId=n,this.room=null,this.updateRoom(this.guestsCount),this.room.addEventListener("click",i)}return s(e,[{key:"updateRoom",value:function(e){var t=this;this.guestsCount=e,this.room=function(){var e=document.createElement("div");e.classList.add("room"),e.dataset.roomId=t.roomId;var n=document.createElement("div");n.classList.add("room__host"),n.textContent="Host: "+t.hostName;var o=document.createElement("div");o.classList.add("room__guests"),o.textContent="Guests: "+t.guestsCount;var s=document.createElement("button");return s.classList.add("room__connect--btn"),s.textContent="Connect",e.appendChild(n),e.appendChild(o),e.appendChild(s),e}()}}]),e}()},function(e,t){},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.Popup=void 0;var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}();n(7);t.Popup=function(){function e(t,n,s){o(this,e),this.type=t,this.popup=null,this.roomId=s,this.createPopup(),this.popup.addEventListener("click",n)}return s(e,[{key:"createPopup",value:function(){var e=this;this.popup=function(){var t=document.createElement("div");t.classList.add("popup"),t.dataset.type=e.type,t.dataset.roomId=e.roomId;var n=document.createElement("div");n.classList.add("popup__main");var o=document.createElement("h3");o.classList.add("popup__title"),"newRoom"===e.type?o.textContent="Creating New Room":"connectRoom"===e.type&&(o.textContent="Connecting The Room");var s=document.createElement("div");s.classList.add("input-wrapper");var i=document.createElement("label");i.classList.add("popup__label"),i.setAttribute("for","nameInput"),i.textContent="Name: ";var r=document.createElement("input");r.classList.add("popup__input"),r.id="nameInput",s.appendChild(i),s.appendChild(r);var a=document.createElement("div");a.classList.add("input-wrapper");var c=document.createElement("label");c.classList.add("popup__label"),c.setAttribute("for","passInput"),c.textContent="Password: ";var u=document.createElement("input");u.classList.add("popup__input"),u.id="passInput",a.appendChild(c),a.appendChild(u);var l=document.createElement("button");return l.classList.add("popup__submit--btn"),l.textContent="submit",n.appendChild(o),n.appendChild(s),n.appendChild(a),n.appendChild(l),t.appendChild(n),t}()}}]),e}()},function(e,t){},function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.Canvas=void 0;var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n(0);n(9);var r=n(1),a=function(e){return e&&e.__esModule?e:{default:e}}(r),c=a.default.hostname,u=c+"/rooms";t.Canvas=function(){function e(t,n,s,r,a,c){var l=this,d=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null,h=arguments.length>7&&void 0!==arguments[7]?arguments[7]:"#fff";o(this,e),this.editor=t,this.host=n,this.users=s,this.userName=r,this.isHost=a,this.ableToDraw=!0,this.roomId=c,this.imageId=d,this.loader=document.querySelector(".canvas-loader"),this.buffer=[],this.lastBufferItem=null,this.pathBuffer=[],this.isQueue=!1,this.image=this.editor.querySelector(".editor__image"),this.image.addEventListener("load",function(e){l.clearCanvas(),console.log("loaded new image"),l.ctx.drawImage(l.image,0,0),l.drawBuffered(),l.buffer.length>1?l.ws.send():l.isQueue=!1}),this.canvasBuffer=new Image,this.canvas=this.editor.querySelector("#canvas"),this.ctx=canvas.getContext("2d"),this.drawOpts={isFirstPoint:!0,isLastPoint:!1},this.tool={current:"pen"},this.coords={x1:null,y1:null,x2:null,y2:null,xCur:null,yCur:null},this.options={lineJoin:"round",lineCap:"round",lineWidth:10,strokeStyle:"#000",fillStyle:"#999",backgroundColor:h},this.ws={url:null,connection:null,setListeners:function(){l.ws.connection.addEventListener("open",function(e){return console.log("connection opened")}),l.ws.connection.addEventListener("message",function(e){console.log("new ws message: "+e.data);var t=JSON.parse(e.data);switch(t.event){case"pic":l.image.src=t.pic.mask?t.pic.mask:t.pic.url,l.editor.classList.remove("hidden"),l.loader.classList.add("hidden");break;case"mask":l.image.src=t.url}}),l.ws.connection.addEventListener("close",function(e){return console.log("connection closed")}),l.ws.connection.addEventListener("error",function(e){return console.log("some ws error: "+e.data)}),window.addEventListener("beforeunload",function(e){l.ws.connection.close(),l.isHost&&(console.log(l),i.Requests.deleteRoom(u,l.roomId))})},send:function(){l.canvasToImage().then(function(e){l.ws.connection.send(e)}).catch(console.log)}},this.init(),this.editor.querySelector("#pen").classList.add("selected")}return s(e,[{key:"canvasToImage",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return new Promise(function(o){e.clearCanvas(),n||(e.ctx.drawImage(e.canvasBuffer,0,0),e.drawBuffered()),e.buffer.splice(0,e.buffer.length-1),t.canvas.toBlob(function(e){t.canvasBuffer.src=URL.createObjectURL(e),o(e)})})}},{key:"init",value:function(){this.loader.classList.remove("hidden"),this.buildUsersPanel(),this.buildAsideMenu(),this.initCanvas()}},{key:"buildUsersPanel",value:function(){function e(e,t){switch(e.target.dataset.btn){case"close":console.log("close"),document.querySelector(".rooms").classList.remove("hidden"),document.querySelector(".controlls").classList.remove("hidden"),document.querySelector(".editor").classList.add("hidden"),console.log("roomId: "+t.roomId),t.ws.connection.close(),t.isHost?i.Requests.deleteRoom(u,t.roomId):i.Requests.disconnectRoom(u,t.userName,t.roomId),t=null;break;case"clear":t.isHost&&(console.log("clear"),t.canvasToImage(t,!0).then(function(e){return t.ws.connection.send(e)}).catch(console.log))}}function t(e,t){var n=document.createElement("div");n.classList.add("user");var o=document.createElement("h3");o.classList.add("user__title"),o.textContent=e.isHost?"Host: ":"Guest: ";var s=document.createElement("div");s.classList.add("user__name"),s.textContent=e.name;var i=document.createElement("div");i.classList.add("user__controls");var r=document.createElement("button");r.classList.add("user__btn"),r.textContent="D";var a=document.createElement("button");a.classList.add("user__btn"),a.textContent="X",i.appendChild(r),i.appendChild(a);var c=document.createElement("div");c.classList.add("user__permissions");var u=document.createElement("div");u.classList.add("user__permission-title"),u.textContent="Drawing";var l=document.createElement("div");return l.classList.add("user__permission-status"),c.appendChild(u),c.appendChild(l),n.appendChild(o),n.appendChild(s),n.appendChild(t.isHost?i:c),e.isHost&&(i.style.opacity=0,c.style.opacity=0),n}var n=this,o=this.editor.querySelector(".users");o.textContent="";var s=document.createElement("div");this.users.forEach(function(e){s.appendChild(t(e,n))});var r=document.createElement("div");r.classList.add("users__control-btns--wrapper");var a=document.createElement("button");a.classList.add("users__control-btn"),a.textContent="exit",a.dataset.btn="close";var c=document.createElement("button");c.classList.add("users__control-btn"),c.textContent="clear",c.dataset.btn="clear",this.isHost&&r.appendChild(c),r.appendChild(a),o.appendChild(s),o.appendChild(r),r.addEventListener("click",function(t,o){return e(t,n)})}},{key:"buildAsideMenu",value:function(){function e(e,t,o){var s=document.createElement("div");""===t?s.classList.add("hidden-tool"):(s.classList.add("tool"),s.id=t,s.textContent=t,s.addEventListener("click",function(e){n(e,o)})),e.appendChild(s)}function t(e,t,n){var s=document.createElement("div");s.classList.add("setting"),s.id=t,s.addEventListener("click",function(e){o(e,n)});var i=document.createElement("div"),r=document.createElement("div");r.classList.add("setting__name");var a=document.createElement("div");switch(a.classList.add("setting__value"),r.textContent=t+": ",t){case"lineWidth":var c=document.createElement("input");c.classList.add("setting__input"),c.value=n.options.lineWidth,c.addEventListener("input",function(e){n.options.lineWidth=e.currentTarget.value}),a.appendChild(c);break;case"strokeStyle":a.textContent=n.options.strokeStyle;break;case"fillStyle":a.textContent=n.options.fillStyle;break;case"backgroundColor":a.textContent=n.options.backgroundColor}i.appendChild(r),i.appendChild(a),s.appendChild(i),e.appendChild(s)}function n(e,t){t.editor.querySelector(".selected").classList.remove("selected"),t.tool.current=e.currentTarget.id,e.currentTarget.classList.add("selected")}function o(e,t){switch(e.currentTarget.id){case"lineWidth":i.querySelector("#lineWidth").querySelector(".setting__input").focus();break;case"strokeStyle":case"fillStyle":case"backgroundColor":t.editor.querySelector(".option-menu")&&i.removeChild(t.editor.querySelector(".option-menu")),i.appendChild(t.showOptionMenu(e.currentTarget.id));break;default:t.editor.querySelector(".option-menu")&&i.removeChild(t.editor.querySelector(".option-menu"))}}var s=this,i=this.editor.querySelector(".editor__menu"),r=["pen","line","rectangle","ellipse","","","erase"],a=["lineWidth","fillStyle","strokeStyle","backgroundColor"],c=document.createElement("div");c.classList.add("users__tools-wrapper");var u=document.createElement("div");u.classList.add("users__settings-wrapper"),i.textContent="",r.forEach(function(t){e(c,t,s)}),a.forEach(function(e){t(u,e,s)}),i.appendChild(c),i.appendChild(u)}},{key:"showOptionMenu",value:function(e){function t(e,t){switch(e.target.dataset.btn){case"cansel":e.currentTarget.parentElement.removeChild(e.currentTarget)}}function n(e,t){o(e.currentTarget.dataset.type,d.value,t),i.querySelector(".setting__value").textContent=d.value}function o(e,t,n){switch(e){case"strokeStyle":n.options.strokeStyle=t;break;case"fillStyle":n.options.fillStyle=t;break;case"backgroundColor":n.options.backgroundColor=t,n.canvas.style.backgroundColor=t,n.clearCanvas(),console.log(n.options.backgroundColor)}}var s=this,i=document.getElementById(e),r=document.querySelector(".users"),a=["white","black","red","orange","yellow","green","blue","purple"],c=document.createElement("div");c.classList.add("option-menu");var u=document.createElement("h3"),l=document.createElement("div");l.classList.add("option-menu__colors"),function(t){a.forEach(function(n){var s=document.createElement("div");s.classList.add("option-menu__color"),s.style.backgroundColor=n,s.dataset.color=n,s.addEventListener("click",function(n){d.value=n.target.dataset.color,i.querySelector(".setting__value").textContent=d.value,o(e,n.target.dataset.color,t)}),l.appendChild(s)})}(this);var d=document.createElement("input");d.classList.add("option-menu__input"),d.value=this.options[e];var h=document.createElement("button");switch(h.textContent="Cansel",h.dataset.btn="cansel",e){case"strokeStyle":u.textContent="Stroke Color:",c.dataset.type="strokeStyle";break;case"fillStyle":u.textContent="Fill Color:",c.dataset.type="fillStyle";break;case"backgroundColor":u.textContent="Background Color:",c.dataset.type="backgroundColor"}return c.addEventListener("click",function(e){return t(e,s)}),c.addEventListener("input",function(e){return n(e,s)}),c.appendChild(u),c.appendChild(l),c.appendChild(d),c.appendChild(h),console.log(i.getBoundingClientRect().y,parseFloat(getComputedStyle(r).height),i.offsetHeight),c}},{key:"initCanvas",value:function(){function e(e){s.addEventListener("mousemove",t),c.isLastPoint=!1,c.isFirstPoint=!0;var n=s.getBoundingClientRect();r.x1=Math.round(e.pageX-n.x),r.y1=Math.round(e.pageY-n.y),d(a.current,l),c.isFirstPoint=!1}function t(e){var t=s.getBoundingClientRect();r.xCur=Math.round(e.pageX-t.x),r.yCur=Math.round(e.pageY-t.y),d(a.current,l)}function n(e){s.removeEventListener("mousemove",t);var n=s.getBoundingClientRect();r.x2=Math.round(e.pageX-n.x),r.y2=Math.round(e.pageY-n.y),c.isLastPoint=!0,d(a.current,l)}var o=this,s=this.canvas,r=this.coords,a=this.tool,c=this.drawOpts,l=this,d=this.draw,h=this.ws;s.width=4.2*window.innerWidth/5,s.height=91*window.innerHeight/100,this.clearCanvas(),s.style.backgroundColor=this.options.backgroundColor,this.image.style.left=this.canvas.getBoundingClientRect().left+"px",console.log(this.canvas.getBoundingClientRect().left),this.isHost?this.canvasToImage().then(function(e){return i.Requests.newImage("https://neto-api.herokuapp.com/pic",e,o.host).then(function(e){o.imageId=e.id,i.Requests.setImageId(u,o.roomId,o.imageId).then(console.log).catch(console.log),h.url="wss://neto-api.herokuapp.com/pic/"+o.imageId,h.connection=new WebSocket(h.url),h.setListeners()})}).catch(console.log):(h.url="wss://neto-api.herokuapp.com/pic/"+this.imageId,h.connection=new WebSocket(h.url),h.setListeners()),s.addEventListener("mousedown",e),s.addEventListener("mouseup",n)}},{key:"clearCanvas",value:function(){var e=this.ctx,t=this.canvas;e.clearRect(0,0,t.width,t.height)}},{key:"draw",value:function(e,t){if(t.ableToDraw)switch(e){case"pen":t.drawPoint();break;case"line":t.drawLine();break;case"rectangle":t.drawRect();break;case"ellipse":t.drawEllipse();break;case"erase":t.erase()}}},{key:"drawBuffered",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.buffer,t=this.ctx;if(e.length>0)for(var n=0;n<e.length;n++)switch(e[n].type){case"point":console.log(this.isQueue,this.lastBufferItem),"first"===e[n].pos||0===n&&("last"===e[n].pos||"reg"===e[n].pos)?t.moveTo(e[n].x,e[n].y):(t.lineTo(e[n].x,e[n].y),t.stroke()),this.lastBufferItem="point";break;case"line":if(console.log("draw line"),0!==n||e[n].isPath||"first"===e[n].pos){e[n-1]&&"line"===e[n-1].type?(t.lineTo(e[n].x,e[n].y),t.stroke()):(t.beginPath(),t.moveTo(e[n].x,e[n].y)),this.lastBufferItem="line";break}case"rect":(e[n].isPath||0!==n)&&(t.beginPath(),t.rect(e[n].x1,e[n].y1,e[n].x2,e[n].y2),t.stroke(),t.fill(),t.closePath());break;case"ellipse":(e[n].isPath||0!==n)&&(t.beginPath(),t.ellipse(e[n].x,e[n].y,e[n].dx,e[n].dy,0,0,2*Math.PI),t.stroke(),t.fill(),t.closePath())}}},{key:"drawPoint",value:function(){var e=this.ctx,t=this.coords,n=this.options;this.drawOpts.isFirstPoint?(t.xCur=t.x1+n.strokeWidth,t.yCur=t.y1+n.strokeWidth,e.beginPath(),e.strokeStyle=this.options.strokeStyle,e.lineWidth=this.options.lineWidth,e.lineCap=this.options.lineCap,e.lineJoin=this.options.lineJoin,this.clearCanvas(),this.ctx.drawImage(this.canvasBuffer,0,0),console.log(this.buffer),this.buffer.push({x:t.x1,y:t.y1,type:"point",pos:"first"}),this.drawBuffered()):this.drawOpts.isLastPoint?(this.clearCanvas(),this.ctx.drawImage(this.canvasBuffer,0,0),this.buffer.push({x:t.x2,y:t.y2,type:"point",pos:"last"}),this.drawBuffered(),this.isQueue||(this.isQueue=!0,this.ws.send()),t.x1=t.xCur,t.y1=t.yCur):(this.clearCanvas(),this.ctx.drawImage(this.canvasBuffer,0,0),this.buffer.push({x:t.xCur,y:t.yCur,type:"point",pos:"reg"}),this.drawBuffered(),!this.isQueue&&this.buffer.length>20&&(this.isQueue=!0,this.ws.send()))}},{key:"drawLine",value:function(){var e=this.ctx,t=this.coords,n=this.options;this.drawOpts.isFirstPoint?(t.xCur=t.x1+n.strokeWidth,t.yCur=t.y1+n.strokeWidth,e.strokeStyle=this.options.strokeStyle,e.lineWidth=this.options.lineWidth,e.lineCap=this.options.lineCap,e.lineJoin=this.options.lineJoin):this.drawOpts.isLastPoint?(this.clearCanvas(),this.ctx.drawImage(this.canvasBuffer,0,0),this.buffer.push({x:t.x1,y:t.y1,type:"line",pos:"first"}),this.buffer.push({x:t.x2,y:t.y2,type:"line",pos:"last"}),this.drawBuffered(),this.ws.send()):(this.clearCanvas(),this.ctx.drawImage(this.canvasBuffer,0,0),this.pathBuffer.length&&this.pathBuffer.splice(0,this.pathBuffer.length),this.pathBuffer.push({x:t.x1,y:t.y1,type:"line",isPath:"true"}),this.pathBuffer.push({x:t.xCur,y:t.yCur,type:"line",isPath:"true"}),this.drawBuffered(this.pathBuffer))}},{key:"drawRect",value:function(){var e=this.ctx,t=this.coords,n=this.options;this.actions;this.drawOpts.isFirstPoint?(t.xCur=t.x1+n.strokeWidth,t.yCur=t.y1+n.strokeWidth,e.fillStyle=this.options.fillStyle,e.strokeStyle=this.options.strokeStyle,e.lineWidth=this.options.lineWidth):this.drawOpts.isLastPoint?(this.clearCanvas(),this.ctx.drawImage(this.canvasBuffer,0,0),this.buffer.push({type:"rect",pos:"first"}),this.buffer.push({x1:t.x1,y1:t.y1,x2:t.xCur-t.x1,y2:t.yCur-t.y1,type:"rect"}),this.drawBuffered(),this.ws.send()):(this.clearCanvas(),e.drawImage(this.image,0,0),this.pathBuffer.length&&this.pathBuffer.splice(0,this.pathBuffer.length),this.pathBuffer.push({x1:t.x1,y1:t.y1,x2:t.xCur-t.x1,y2:t.yCur-t.y1,type:"rect",isPath:!0}),this.drawBuffered(this.pathBuffer))}},{key:"drawEllipse",value:function(){var e=this.ctx,t=this.coords,n=this.options;this.actions;this.drawOpts.isFirstPoint?(t.xCur=t.x1+n.strokeWidth,t.yCur=t.y1+n.strokeWidth,e.fillStyle=this.options.fillStyle,e.strokeStyle=this.options.strokeStyle,e.lineWidth=this.options.lineWidth):this.drawOpts.isLastPoint?(this.clearCanvas(),this.ctx.drawImage(this.canvasBuffer,0,0),this.buffer.push({type:"ellipse",pos:"first"}),this.buffer.push({x:t.x1,y:t.y1,dx:Math.abs(t.xCur-t.x1),dy:Math.abs(t.yCur-t.y1),type:"ellipse"}),this.drawBuffered(),this.ws.send()):(this.clearCanvas(),e.drawImage(this.image,0,0),this.pathBuffer.length&&this.pathBuffer.splice(0,this.pathBuffer.length),this.pathBuffer.push({x:t.x1,y:t.y1,dx:Math.abs(t.xCur-t.x1),dy:Math.abs(t.yCur-t.y1),type:"ellipse",isPath:!0}),this.drawBuffered(this.pathBuffer))}},{key:"erase",value:function(){var e=this.ctx,t=this.coords,n=this.options;this.drawOpts.isFirstPoint?(t.xCur=t.x1+n.strokeWidth,t.yCur=t.y1+n.strokeWidth,e.beginPath(),e.moveTo(t.x1,t.y1)):this.drawOpts.isLastPoint?(e.lineTo(t.x2,t.y2),e.save(),e.strokeStyle="#000",e.globalCompositeOperation="destination-out",e.lineWidth=n.lineWidth,e.stroke(),e.restore(),this.ws.send(),t.x1=t.xCur,t.y1=t.yCur):(e.lineTo(t.xCur,t.yCur),e.save(),e.strokeStyle="#000",e.globalCompositeOperation="destination-out",console.log(this.options.lineWidth),e.lineWidth=n.lineWidth,e.stroke(),e.restore())}}]),e}()},function(e,t){}]);
//# sourceMappingURL=bundle.js.map