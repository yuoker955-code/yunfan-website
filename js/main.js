(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 年份 ---------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 吸顶导航 & 返回顶部 ---------- */
  var header = $("#siteHeader");
  var toTop = $("#toTop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (toTop) toTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 移动端菜单 ---------- */
  var navToggle = $("#navToggle");
  var navLinks = $("#navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });
    $$(".nav-link", navLinks).forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("open")) return;
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 滚动显现 ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 数字统计动画 ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1500;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* easeOutCubic */
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var statNums = $$(".stat strong[data-count]");
  if (statNums.length) {
    if ("IntersectionObserver" in window) {
      var statObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      statNums.forEach(function (el) { statObs.observe(el); });
    } else {
      statNums.forEach(animateCount);
    }
  }

  /* ---------- 当前导航高亮 ---------- */
  var sections = $$("main section[id]");
  var navAnchors = $$(".nav-link[href^='#']");
  if ("IntersectionObserver" in window && sections.length && navAnchors.length) {
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = "#" + entry.target.id;
          navAnchors.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (sec) { spyObs.observe(sec); });
  }

  /* ---------- FAQ 手风琴 ---------- */
  $$(".faq-item").forEach(function (item) {
    var q = $(".faq-q", item);
    var a = $(".faq-a", item);
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      $$(".faq-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          $(".faq-q", other).setAttribute("aria-expanded", "false");
          $(".faq-a", other).style.maxHeight = "0px";
        }
      });
      item.classList.toggle("open", !isOpen);
      q.setAttribute("aria-expanded", isOpen ? "false" : "true");
      a.style.maxHeight = isOpen ? "0px" : a.scrollHeight + "px";
    });
  });

  /* ---------- 在线咨询悬浮按钮 ---------- */
  var chatFab = $("#chatFab");
  var fabToggle = $("#fabToggle");
  var fabClose = $("#fabClose");
  var wechatBtn = $("#fabWechatBtn");
  var fabQr = $("#fabQr");

  function setFab(open) {
    if (!chatFab) return;
    chatFab.classList.toggle("open", open);
    if (fabToggle) {
      fabToggle.setAttribute("aria-expanded", open ? "true" : "false");
      fabToggle.setAttribute("aria-label", open ? "关闭在线咨询" : "打开在线咨询");
    }
  }
  if (fabToggle) fabToggle.addEventListener("click", function () {
    setFab(!chatFab.classList.contains("open"));
  });
  if (fabClose) fabClose.addEventListener("click", function () { setFab(false); });
  if (wechatBtn && fabQr) {
    wechatBtn.addEventListener("click", function () {
      var show = fabQr.hidden;
      fabQr.hidden = !show;
      wechatBtn.setAttribute("aria-expanded", show ? "true" : "false");
    });
  }
  document.addEventListener("click", function (e) {
    if (chatFab && chatFab.classList.contains("open") && !chatFab.contains(e.target)) setFab(false);
  });
  if (typeof document.addEventListener === "function") {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && chatFab && chatFab.classList.contains("open")) setFab(false);
    });
  }

  /* ---------- 预约 / 留言表单 ---------- */
  var form = $("#contactForm");
  if (form) {
    var errorEl = $("#formError");
    var successEl = $("#formSuccess");

    function validPhone(v) {
      if (!v) return true; /* 选填 */
      var digits = v.replace(/\D/g, "");
      return /^1[3-9]\d{9}$/.test(digits) || /^0\d{2,3}\d{7,8}$/.test(digits);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#name").value.trim();
      var email = $("#email").value.trim();
      var phone = $("#phone").value.trim();
      var topic = $("#topic").value;
      var contactTime = $("#contactTime").value;
      var budget = $("#budget").value;
      var message = $("#message").value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var msg = "";

      if (!name) msg = "请填写您的称呼";
      else if (!email) msg = "请填写联系邮箱";
      else if (!emailOk) msg = "邮箱格式不正确，请检查后重试";
      else if (phone && !validPhone(phone)) msg = "联系电话格式不正确（示例：138-0000-0000）";
      else if (!message) msg = "请简单描述一下您的项目需求";

      if (msg) {
        if (successEl) successEl.classList.remove("show");
        if (errorEl) {
          errorEl.textContent = "⚠ " + msg;
          errorEl.classList.add("show");
        }
        return;
      }

      /* 演示站点：这里可替换为真实后端接口（如 fetch 提交到 API） */
      if (errorEl) errorEl.classList.remove("show");
      var btn = form.querySelector("button[type='submit']");
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "提交中…";

      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = original;
        form.reset();

        /* 保存一条记录（演示用，存在浏览器本地 localStorage） */
        try {
          var key = "yf_contacts";
          var records = JSON.parse(localStorage.getItem(key) || "[]");
          records.push({
            name: name, email: email, phone: phone,
            topic: topic, contactTime: contactTime, budget: budget,
            message: message, at: new Date().toISOString()
          });
          localStorage.setItem(key, JSON.stringify(records));
        } catch (err) { /* 忽略存储异常 */ }

        if (successEl) {
          successEl.classList.add("show");
          successEl.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(function () { successEl.classList.remove("show"); }, 8000);
        }
      }, 800);
    });
  }
})();

/* ---------- 深空星空背景（Planet 主题） ---------- */
(function () {
  "use strict";
  var canvas = document.getElementById("starfield");
  if (!canvas) return;
  var hero = document.getElementById("home");
  if (!hero) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var stars = [];
  var raf = null;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function makeStars() {
    var w = canvas.width / (window.devicePixelRatio || 1);
    var h = canvas.height / (window.devicePixelRatio || 1);
    var target = Math.floor((w * h) / 6500);
    var count = Math.max(40, Math.min(260, target));
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.3,
        base: 0.25 + Math.random() * 0.75,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.8
      });
    }
  }

  function resize() {
    var rect = hero.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars();
  }

  function draw(t) {
    var w = canvas.width / (window.devicePixelRatio || 1);
    var h = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, w, h);
    var time = t || 0;
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var a = reduced ? s.base : s.base * (0.45 + 0.55 * Math.sin((time / 1000) * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + Math.max(0, Math.min(1, a)).toFixed(3) + ")";
      ctx.fill();
    }
  }

  function loop(t) { draw(t); raf = requestAnimationFrame(loop); }

  resize();
  draw(0);
  if (!reduced) raf = requestAnimationFrame(loop);
  window.addEventListener("resize", function () {
    resize();
    draw(0);
  });
})();
