/* ===========================
   Yahia Portfolio (Refactor)
   main.js
   =========================== */

(() => {
  "use strict";

  // --------- Helpers ----------
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

  const toastEl = $("#toast");
  let toastTimer = null;

  function toast(msg, ms = 2200) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
      toastEl.textContent = "";
    }, ms);
  }

  // Base64URL JWT decode (Google credential)
  function decodeJwtPayload(jwt) {
    try {
      const payload = jwt.split(".")[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
      const json = atob(padded);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  // --------- Smooth anchor clicks ----------
  $$(".nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.getAttribute("href");
      const target = $(id);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // --------- Reveal on scroll ----------
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  $$(".reveal").forEach((el) => observer.observe(el));

  // --------- Skills fill (only when in view) ----------
  const skills = $$(".skill-item");
  const skillsObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const pct = Number(el.getAttribute("data-skill") || "0");
        const fill = el.querySelector(".skill-fill");
        if (fill) fill.style.width = Math.max(0, Math.min(100, pct)) + "%";
        obs.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );
  skills.forEach((el) => skillsObserver.observe(el));

  // --------- To top ----------
  const toTop = $("#toTop");
  const onScroll = () => {
    if (!toTop) return;
    if (window.scrollY > 420) toTop.classList.add("show");
    else toTop.classList.remove("show");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --------- Canvas (binary rain) ----------
  const canvas = $("#binary-canvas");
  const ctx = canvas?.getContext("2d");
  if (canvas && ctx) {
    const fontSize = 14;
    const chars = "01";

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops = [];

    function resize() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      width = Math.floor(window.innerWidth);
      height = Math.floor(window.innerHeight);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.max(1, Math.floor(width / fontSize));
      drops = Array(columns).fill(0);
    }

    function draw() {
      // trails
      ctx.fillStyle = "rgba(5, 8, 13, 0.13)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00ff9c";
      ctx.font = fontSize + "px JetBrains Mono";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();

    // Use requestAnimationFrame for smoother timing
    let last = 0;
    const speedMs = 50; // similar to original interval
    function loop(ts) {
      if (ts - last >= speedMs) {
        draw();
        last = ts;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // --------- Buttons ----------
  $("#viewProjectsBtn")?.addEventListener("click", () => {
    window.open("https://github.com/yahiawork?tab=repositories", "_blank", "noopener,noreferrer");
  });

  $("#aboutMeBtn")?.addEventListener("click", () => {
    toast("Hi! I'm Yahia 👋");
    $("#about")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Fiverr buttons (placeholder)
  $$("[data-action='fiverr']").forEach((btn) => {
    btn.addEventListener("click", () => {
      toast("Add your Fiverr link in main.js (search: FIVERR_URL)");
    });
  });

  // --------- Google Sign-In (optional) ----------
  const CONFIG = {
    GOOGLE_CLIENT_ID: "820224417800-hhiocl5acrdphnu7oue56d25ho0usisj.apps.googleusercontent.com",
    // FIVERR_URL: "https://www.fiverr.com/your-username"
  };

  const signInRoot = $("#googleSignIn");
  const logoutBtn = $("#logoutBtn");
  const sendBtn = $("#sendBtn");
  const emailField = $("#email");

  const modal = $("#welcomeModal");
  const closeWelcomeBtn = $("#closeWelcomeBtn");
  const userAvatar = $("#userAvatar");
  const welcomeName = $("#welcomeName");
  const welcomeEmail = $("#welcomeEmail");

  function setSignedInUI(isSignedIn) {
    if (logoutBtn) logoutBtn.hidden = !isSignedIn;
    if (signInRoot) signInRoot.style.display = isSignedIn ? "none" : "flex";
    if (sendBtn) {
      sendBtn.disabled = !isSignedIn;
      sendBtn.textContent = isSignedIn ? "Send Message" : "Sign in to Send";
    }
  }

  function openWelcomeModal(data) {
    if (!modal) return;
    if (userAvatar) userAvatar.src = data.picture || "";
    if (welcomeName) welcomeName.textContent = data.name ? `Welcome, ${data.name}` : "Welcome";
    if (welcomeEmail) welcomeEmail.textContent = data.email || "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeWelcomeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  closeWelcomeBtn?.addEventListener("click", closeWelcomeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeWelcomeModal();
  });

  function saveUser(data) {
    localStorage.setItem("googleUser", JSON.stringify(data));
  }

  function loadUser() {
    const raw = localStorage.getItem("googleUser");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function clearUser() {
    localStorage.removeItem("googleUser");
  }

  // Expose callback for GIS
  window.handleCredentialResponse = (response) => {
    const data = decodeJwtPayload(response?.credential || "");
    if (!data) {
      toast("Sign-in failed (invalid token).");
      return;
    }

    if (emailField) emailField.value = data.email || "";
    saveUser(data);
    setSignedInUI(true);
    openWelcomeModal(data);
  };

  function initGoogleSignIn() {
    // If GIS not available, skip silently (still works as static site)
    if (!window.google?.accounts?.id || !signInRoot) return;

    window.google.accounts.id.initialize({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      callback: window.handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(signInRoot, {
      theme: "filled_black",
      size: "medium",
      shape: "pill",
      text: "signin_with",
    });
  }

  logoutBtn?.addEventListener("click", () => {
    clearUser();
    if (emailField) emailField.value = "";
    setSignedInUI(false);

    // If GIS exists, also disable auto-select
    if (window.google?.accounts?.id?.disableAutoSelect) {
      window.google.accounts.id.disableAutoSelect();
    }

    toast("Logged out.");
  });

  // Restore session if exists
  const saved = loadUser();
  if (saved?.email) {
    if (emailField) emailField.value = saved.email;
    setSignedInUI(true);
  } else {
    setSignedInUI(false);
  }

  // Start GIS (after page load to ensure script is ready)
  window.addEventListener("load", () => {
    initGoogleSignIn();
  });

  // --------- Contact form (demo) ----------
  const contactForm = $("#contactForm");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = ($("#name")?.value || "").trim();
    const message = ($("#message")?.value || "").trim();
    const email = (emailField?.value || "").trim();

    if (!name || !message) {
      toast("Please fill your name and message.");
      return;
    }

    // Demo-only: show toast and reset.
    // You can later wire this to EmailJS / Formspree / your own backend.
    toast("Thanks! Message received (demo).");
    contactForm.reset();
    if (emailField) emailField.value = email; // keep email if signed in
  });
})();
