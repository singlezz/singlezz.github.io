"use strict";var titleTime,OriginTitle=document.title;function qipao(){$("#page-header").circleMagic({radius:10,density:.2,color:"rgba(255,255,255,.4)",clearOffset:.99})}function upyun(){var e=document.createElement("div");e.setAttribute("class","upy");var t=document.createElement("a");t.target="_blank",t.rel="noopener external nofollow noreferrer",t.href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral";var n=document.createElement("span"),i=document.createTextNode("本网站由");n.appendChild(i);var a=document.createElement("span"),o=document.createTextNode("提供CDN加速服务");a.appendChild(o);var r=document.createElement("img");r.setAttribute("class","icp-icon"),r.src="https://surpassers.oss-cn-beijing.aliyuncs.com/img/又拍云_logo5.png",r.width="50",r.height="20",e.appendChild(t),t.appendChild(n),t.appendChild(r),t.appendChild(a),document.getElementById("footer-wrap").appendChild(e)}function dailyPoetry(){var e=document.getElementsByClassName("sticky_layout")[0],t=document.createElement("div");t.setAttribute("class","card-widget card-info"),t.innerHTML="<div class='card-content'><div class='item-headline'><i class='fas fa-bullhorn card-announcement-animation'></i><span>每日一句诗</span></div><div class='announcement_content'><span id='jinrishici-sentence'>正在加载今日诗词....</span></div></div>",e.parentNode.insertBefore(t,e)}document.addEventListener("visibilitychange",function(){document.hidden?($('[rel="icon"]').attr("href","/img/favicon.ico"),document.title="(つェ⊂) 我藏好了哦~~",clearTimeout(titleTime)):($('[rel="icon"]').attr("href","/img/favicon.ico"),document.title="(*´∇｀*) 被你发现啦~~"+OriginTitle,titleTime=setTimeout(function(){document.title=OriginTitle},2e3))}),function(n){n.fn.circleMagic=function(e){var i,a,o,r,t=!0,c=[],d=n.extend({color:"rgba(255,0,0,.5)",radius:10,density:.3,clearOffset:.2},e),l=this[0];function s(){if(t)for(var e in r.clearRect(0,0,i,a),c)c[e].draw();requestAnimationFrame(s)}function m(){var e=this;function t(){e.pos.x=Math.random()*i,e.pos.y=a+100*Math.random(),e.alpha=.1+Math.random()*d.clearOffset,e.scale=.1+.3*Math.random(),e.speed=Math.random(),"random"===d.color?e.color="rgba("+Math.floor(255*Math.random())+", "+Math.floor(0*Math.random())+", "+Math.floor(0*Math.random())+", "+Math.random().toPrecision(2)+")":e.color=d.color}e.pos={},t(),this.draw=function(){e.alpha<=0&&t(),e.pos.y-=e.speed,e.alpha-=5e-4,r.beginPath(),r.arc(e.pos.x,e.pos.y,e.scale*d.radius,0,2*Math.PI,!1),r.fillStyle=e.color,r.fill(),r.closePath()}}!function(){var e;i=l.offsetWidth,a=l.offsetHeight,(e=document.createElement("canvas")).id="canvas",e.style.top=0,e.style.zIndex=0,e.style.position="absolute",l.appendChild(e),e.parentElement.style.overflow="hidden",(o=document.getElementById("canvas")).width=i,o.height=a,r=o.getContext("2d");for(var t=0;t<i*d.density;t++){var n=new m;c.push(n)}s()}(),window.addEventListener("scroll",function(){t=!(document.body.scrollTop>a)},!1),window.addEventListener("resize",function(){i=l.clientWidth,a=l.clientHeight,l.height=a+"px",o.width=i,o.height=a},!1)}}(jQuery),qipao(),upyun(),dailyPoetry();