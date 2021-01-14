

// 可爱的Title
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        $('[rel="icon"]').attr('href', "/img/favicon.ico");
        document.title = '(つェ⊂) 我藏好了哦~~';
        clearTimeout(titleTime);
    } else {
        $('[rel="icon"]').attr('href', "/img/favicon.ico");
        document.title = '(*´∇｀*) 被你发现啦~~' + OriginTitle;
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 2000);
    }
});



// 气泡
function qipao() {
    $('#page-header').circleMagic({
        radius: 10,
        density: .2,
        color: 'rgba(255,255,255,.4)',
        clearOffset: 0.99
    });
} ! function (p) {
    p.fn.circleMagic = function (t) {
        var o, a, n, r, e = !0,
            i = [],
            d = p.extend({ color: "rgba(255,0,0,.5)", radius: 10, density: .3, clearOffset: .2 }, t),
            l = this[0];

        function c() { e = !(document.body.scrollTop > a) }

        function s() { o = l.clientWidth, a = l.clientHeight, l.height = a + "px", n.width = o, n.height = a }

        function h() {
            if (e)
                for (var t in r.clearRect(0, 0, o, a), i) i[t].draw();
            requestAnimationFrame(h)
        }

        function f() {
            var t = this;

            function e() { t.pos.x = Math.random() * o, t.pos.y = a + 100 * Math.random(), t.alpha = .1 + Math.random() * d.clearOffset, t.scale = .1 + .3 * Math.random(), t.speed = Math.random(), "random" === d.color ? t.color = "rgba(" + Math.floor(255 * Math.random()) + ", " + Math.floor(0 * Math.random()) + ", " + Math.floor(0 * Math.random()) + ", " + Math.random().toPrecision(2) + ")" : t.color = d.color }
            t.pos = {}, e(), this.draw = function () { t.alpha <= 0 && e(), t.pos.y -= t.speed, t.alpha -= 5e-4, r.beginPath(), r.arc(t.pos.x, t.pos.y, t.scale * d.radius, 0, 2 * Math.PI, !1), r.fillStyle = t.color, r.fill(), r.closePath() }
        } ! function () {
            o = l.offsetWidth, a = l.offsetHeight,
                function () {
                    var t = document.createElement("canvas");
                    t.id = "canvas", t.style.top = 0, t.style.zIndex = 0, t.style.position = "absolute", l.appendChild(t), t.parentElement.style.overflow = "hidden"
                }(), (n = document.getElementById("canvas")).width = o, n.height = a, r = n.getContext("2d");
            for (var t = 0; t < o * d.density; t++) {
                var e = new f;
                i.push(e)
            }
            h()
        }(), window.addEventListener("scroll", c, !1), window.addEventListener("resize", s, !1)
    }
}(jQuery);
qipao()

/**
 * 又拍云图表显示底部
 */
function upyun() {
    var node = document.createElement("div");
    node.setAttribute("class", "upy");

    var a = document.createElement("a");
    a.target = "_blank";
    a.rel = "noopener external nofollow noreferrer";
    a.href = "https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral";

    var pre = document.createElement("span");
    var pretext = document.createTextNode("本网站由");
    pre.appendChild(pretext);

    var stf = document.createElement("span");
    var stftext = document.createTextNode("提供CDN加速服务");
    stf.appendChild(stftext);

    var img = document.createElement("img");
    img.setAttribute("class", "icp-icon")
    img.src = "https://gitee.com/lemon_ant/figure_bed/raw/master/img/又拍云_logo5.png";
    img.width = "50";
    img.height = "20";

    node.appendChild(a);
    a.appendChild(pre)
    a.appendChild(img);
    a.appendChild(stf);

    var footer = document.getElementById("footer-wrap");
    footer.appendChild(node);
}
upyun()

/**
 * 侧边栏显示每日一句诗词
 */
function dailyPoetry() {
    // var node=document.createElement("div");
    // node.setAttribute("class","card-widget daily_poetry");

    // var card_content=document.createElement("div");
    // card_content.setAttribute("class","card-content");

    // var headline=document.createElement("div");
    // headline.setAttribute("class","item-headline");

    // var i=document.createElement("i");
    // i.setAttribute("class","fas fa-bullhorn card-announcement-animation");

    // var head_span=document.createElement("span");
    // var poetry=document.createTextNode("每日诗词");

    // head_span.appendChild(poetry);
    // headline.appendChild(i);
    // headline.appendChild(head_span);
    // card_content.appendChild(headline);

    // var content=document.createElement("div");
    // content.setAttribute("class","poetry_content");
    // content.setAttribute("id","poetry_content");
    // var poetry_html_text=document.getElementById("poetry_content");
    // poetry_html_text.innerHTML("<span id='jinrishici-sentence'>正在加载今日诗词....</span><script src='https://sdk.jinrishici.com/v2/browser/jinrishici.js' charset='utf-8'></script>");

    // card_content.appendChild(content);

    var html = "<div class='card-content'><div class='item-headline'><i class='fas fa-bullhorn card-announcement-animation'></i><span>每日一句诗</span></div><div class='announcement_content'><span id='jinrishici-sentence'>正在加载今日诗词....</span></div></div>";
    var sticky_layout = document.getElementsByClassName("sticky_layout")[0];
    var poetry_div = document.createElement("div");
    poetry_div.setAttribute("class","card-widget card-info");
    poetry_div.innerHTML = html;
    sticky_layout.parentNode.insertBefore(poetry_div, sticky_layout);
}
dailyPoetry()