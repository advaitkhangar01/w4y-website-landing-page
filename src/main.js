// ==========================================
// W4Y — Official Elite Script
// Advanced GSAP & Lenis scrolling physics
// ==========================================

import { createIcons, ChevronDown, Check, Play, Pause, RefreshCw, Award, Lock, ShieldAlert, Sparkles, MapPin, Users, Settings as SettingsIcon, Undo, Edit3, ShieldCheck, Database, Compass, Activity, Building, Radar } from 'lucide';

// Register ScrollTrigger to GSAP
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Render Lucide Icons
  createIcons({
    icons: {
      ChevronDown,
      Check,
      Play,
      Pause,
      RefreshCw,
      Award,
      Lock,
      ShieldAlert,
      Sparkles,
      MapPin,
      Users,
      SettingsIcon,
      Undo,
      Edit3,
      ShieldCheck,
      Database,
      Compass,
      Activity,
      Building,
      Radar
    }
  });

  // Initialize Engines & UI Modules
  const lenis = initLenisSmoothScroll();
  initHeroMockupScroll(lenis);
  initHero3DWebGLScene();
  initHeroMouseParallax();
  initTextClipReveals();
  initStickyStackCards();
  initPinnedSplitConsole();
  initThemeColorInterpolation();
  initMagneticCTAs();
  initGeneralRevealCards();
  
  // Sandbox Utilities
  initSignatureSandbox();
  initSandboxTabs();
  initRoiCalculator();
  initPricingToggle();
  initFaqAccordions();
  initAttendanceCalendar();
  initGeofenceSandbox();
  initContactForm();
  initTestimonialSlider();
  initConsoleLightbox();
});

/* ==========================================
   1. Lenis Smooth Scroll Configuration
   ========================================== */
function initLenisSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium exponential easing
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Hook ScrollTrigger updates to Lenis scroll
  lenis.on('scroll', ScrollTrigger.update);

  // Standard requestAnimationFrame loop for Lenis (smoother, avoids ticker desync)
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
}

// Global variables for mockup 3D animation blending
let mockupTilt = { x: 8, y: -4 }; // Gentle starting tilt
let scrollTiltFactor = { value: 1 }; // Multiplier (1 at top, fades to 0 as we scroll)

function initHeroMockupScroll() {
  const mockup = document.getElementById('hero-main-mockup');
  if (!mockup) return;

  // Set initial 3D state
  gsap.set(mockup, {
    transformPerspective: 1200,
    rotateX: mockupTilt.x,
    rotateY: mockupTilt.y,
    scale: 0.92,
    y: 40,
    opacity: 1
  });

  // Create ScrollTrigger to animate the tilt factor down from 1 to 0
  gsap.to(scrollTiltFactor, {
    value: 0,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero-section",
      start: "top top",
      end: "bottom 30%",
      scrub: true,
      onUpdate: () => {
        // Dynamically apply rotation as we scroll, blending target tilt with scale factor
        gsap.set(mockup, {
          rotateX: mockupTilt.x * scrollTiltFactor.value,
          rotateY: mockupTilt.y * scrollTiltFactor.value,
          overwrite: "auto"
        });
      }
    }
  });

  // Create ScrollTrigger to level out scale and translation as we scroll
  gsap.to(mockup, {
    scale: 1,
    y: 0,
    ease: "power1.out",
    scrollTrigger: {
      trigger: "#hero-section",
      start: "top top",
      end: "bottom 30%",
      scrub: true
    }
  });
}

/* ==========================================
   3. GSAP ScrollTrigger — Word Reveal Masks
   ========================================== */
function initTextClipReveals() {
  const titles = gsap.utils.toArray(".reveal-text");
  
  titles.forEach(title => {
    const lines = title.querySelectorAll(".reveal-line");
    gsap.to(lines, {
      y: 0,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });
}

/* ==========================================
   4. GSAP ScrollTrigger — Card Stacking Deck
   ========================================== */
function initStickyStackCards() {
  const cards = gsap.utils.toArray(".sticky-card");
  if (cards.length === 0) return;

  cards.forEach((card, index) => {
    // Parallax background translation tween
    const bgImage = card.querySelector(".card-parallax-bg");
    if (bgImage) {
      gsap.to(bgImage, {
        y: "15%",
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // We scale down previous cards as next cards stack on top
    if (index === cards.length - 1) return; // Last card stays flat
    
    const nextCard = cards[index + 1];
    
    gsap.to(card, {
      scale: 0.94 - (cards.length - 1 - index) * 0.02,
      opacity: 0.85,
      ease: "none",
      scrollTrigger: {
        trigger: nextCard,
        start: "top 160px",
        end: "top 120px",
        scrub: true
      }
    });
  });
}

/* ==========================================
   5. GSAP ScrollTrigger — Pinned Split-Screen Console
   ========================================== */
function initPinnedSplitConsole() {
  const narrativeCards = gsap.utils.toArray(".console-narrative-col .narrative-card");
  const consoleImgs = document.querySelectorAll('.console-img');
  const consoleHeading = document.getElementById('console-heading');
  const consoleSubheading = document.getElementById('console-subheading');
  const activeRoleName = document.getElementById('active-role-name');
  const quickBtns = document.querySelectorAll('.quick-btn');

  // Metadata logs
  const contentMeta = {
    admin: {
      title: "Administrator Command Center",
      subtitle: "Absolute administrative authorization & staff logs checks.",
      tag: "Admin Control"
    },
    accounts: {
      title: "Accounts & Bookkeeping Room",
      subtitle: "payroll compliance matrices & local/state tax invoices compiling.",
      tag: "Accounts"
    },
    designhead: {
      title: "Design & Project Workspace",
      subtitle: "Manage sequential construction phases and blueprints.",
      tag: "Design Head"
    },
    employee: {
      title: "Employee Portal Dashboard",
      subtitle: "Clock coordinates check, tasks, and leave logs.",
      tag: "Employee Portal"
    }
  };

  // Helper to trigger interface updates
  function activateView(triggerKey) {
    // 1. Toggle Narrative Card active class
    narrativeCards.forEach(card => {
      if (card.dataset.trigger === triggerKey) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // 2. Toggle Quick controller buttons active state
    quickBtns.forEach(btn => {
      if (btn.dataset.target === triggerKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const meta = contentMeta[triggerKey];
    if (!meta) return;

    // 3. Update Headings
    consoleHeading.textContent = meta.title;
    consoleSubheading.textContent = meta.subtitle;
    activeRoleName.innerHTML = `<span class="active-role-indicator"></span>${meta.tag}`;

    // Toggle images cross-fade
    consoleImgs.forEach(img => {
      if (img.dataset.role === triggerKey) {
        img.classList.add('active');
      } else {
        img.classList.remove('active');
      }
    });
  }

  // Bind ScrollTriggers to scroll-based narrative cards
  narrativeCards.forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => activateView(card.dataset.trigger),
      onEnterBack: () => activateView(card.dataset.trigger),
      // Clean up trigger markers on destroy
      invalidateOnRefresh: true
    });
  });

  // Quick Controller manual override button binds
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      activateView(target);
      
      // Smoothly scroll to the corresponding narrative card
      const correspondingCard = document.querySelector(`.narrative-card[data-trigger="${target}"]`);
      if (correspondingCard) {
        correspondingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Direct skip selectors on buttons inside cards
  document.querySelectorAll('.select-narrative-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activateView(btn.dataset.trigger);
    });
  });
}

/* ==========================================
   6. Theme Color Interpolation (Scroll-driven)
   ========================================== */
function initThemeColorInterpolation() {
  ScrollTrigger.create({
    trigger: "#console",
    start: "top 60%",
    end: "bottom 35%",
    onEnter: () => {
      document.body.classList.add('dark-theme');
    },
    onLeave: () => {
      document.body.classList.remove('dark-theme');
    },
    onEnterBack: () => {
      document.body.classList.add('dark-theme');
    },
    onLeaveBack: () => {
      document.body.classList.remove('dark-theme');
    }
  });
}

/* ==========================================
   7. Magnetic Interactive Buttons
   ========================================== */
function initMagneticCTAs() {
  const magnetics = document.querySelectorAll(".magnetic-wrapper");
  
  magnetics.forEach(wrapper => {
    const btn = wrapper.querySelector(".btn");
    if (!btn) return;

    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      // Calculate cursor position offset relative to center of button bounds
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      
      // Pull element magnetic focus towards coordinates (45% attraction vector)
      gsap.to(btn, {
        x: relX * 0.45,
        y: relY * 0.45,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    wrapper.addEventListener("mouseleave", () => {
      // Spring bounce return back to starting position (0,0)
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1.1, 0.4)"
      });
    });
  });
}

/* ==========================================
   8. Subtle Fade-In/Blur cards
   ========================================== */
function initGeneralRevealCards() {
  const cards = gsap.utils.toArray(".reveal-card");
  cards.forEach(card => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none none"
      }
    });
  });

  const scaleItems = gsap.utils.toArray(".reveal-scale");
  scaleItems.forEach(item => {
    gsap.to(item, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 88%",
        toggleActions: "play none none none"
      }
    });
  });
}

/* ==========================================
   9. Handwritten Invoice Canvas Sandbox
   ========================================== */
function initSignatureSandbox() {
  const canvas = document.getElementById('sig-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const clearBtn = document.getElementById('sig-clear');
  const verifyBtn = document.getElementById('sig-verify');
  const undoBtn = document.getElementById('sig-undo');
  const placeholder = document.getElementById('sig-placeholder');
  const message = document.getElementById('sig-msg');
  const scanner = document.getElementById('sig-scanner');
  const thicknessInput = document.getElementById('pen-thickness');
  const colorPickers = document.querySelectorAll('.color-picker');

  const invoiceStamp = document.getElementById('invoice-stamp');
  const sigMirror = document.getElementById('invoice-sig-mirror');

  const valStrokes = document.getElementById('val-strokes');
  const valNodes = document.getElementById('val-nodes');
  const valSecurity = document.getElementById('val-security');
  const valHash = document.getElementById('val-hash');

  let drawing = false;
  let strokesHistory = [];
  let currentStroke = [];
  let activeColor = '#0A1128';
  let activeThickness = 3;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height || 250;
    
    redrawCanvas();
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function getMousePos(canvasDom, touchOrMouseEvent) {
    const rect = canvasDom.getBoundingClientRect();
    const clientX = touchOrMouseEvent.touches ? touchOrMouseEvent.touches[0].clientX : touchOrMouseEvent.clientX;
    const clientY = touchOrMouseEvent.touches ? touchOrMouseEvent.touches[0].clientY : touchOrMouseEvent.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDrawing(e) {
    drawing = true;
    placeholder.style.opacity = '0';
    message.classList.remove('show');
    
    // Reset invoice verification state when drawing new strokes
    if (invoiceStamp.classList.contains('verified')) {
      invoiceStamp.classList.remove('verified');
      invoiceStamp.textContent = 'DRAFT';
    }

    const pos = getMousePos(canvas, e);
    currentStroke = [{ x: pos.x, y: pos.y }];
    
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = activeThickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
  }

  function draw(e) {
    if (!drawing) return;
    const pos = getMousePos(canvas, e);
    currentStroke.push({ x: pos.x, y: pos.y });
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    updateMirror();
    updateDiagnostics();
    e.preventDefault();
  }

  function stopDrawing() {
    if (drawing) {
      drawing = false;
      if (currentStroke.length > 0) {
        currentStroke.strokeStyle = activeColor;
        currentStroke.lineWidth = activeThickness;
        strokesHistory.push(currentStroke);
        currentStroke = [];
      }
      updateDiagnostics();
    }
  }

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);

  // Undo last stroke
  if (undoBtn) {
    undoBtn.addEventListener('click', () => {
      strokesHistory.pop();
      redrawCanvas();
      if (strokesHistory.length === 0) {
        placeholder.style.opacity = '1';
        sigMirror.style.opacity = '0';
      }
    });
  }

  // Clear Canvas
  clearBtn.addEventListener('click', () => {
    strokesHistory = [];
    currentStroke = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    placeholder.style.opacity = '1';
    message.classList.remove('show');
    sigMirror.style.opacity = '0';
    sigMirror.src = '';
    
    invoiceStamp.classList.remove('verified');
    invoiceStamp.textContent = 'DRAFT';
    
    updateDiagnostics();
  });

  // Color selection
  colorPickers.forEach(picker => {
    picker.addEventListener('click', () => {
      colorPickers.forEach(p => p.classList.remove('active'));
      picker.classList.add('active');
      activeColor = picker.dataset.color;
    });
  });

  // Pen thickness slider
  if (thicknessInput) {
    thicknessInput.addEventListener('input', (e) => {
      activeThickness = parseInt(e.target.value);
    });
  }

  function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    strokesHistory.forEach(stroke => {
      if (stroke.length === 0) return;
      ctx.strokeStyle = stroke.strokeStyle || '#0A1128';
      ctx.lineWidth = stroke.lineWidth || 3;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
    
    updateMirror();
    updateDiagnostics();
  }

  function updateMirror() {
    if (strokesHistory.length > 0 || drawing) {
      const dataURL = canvas.toDataURL();
      sigMirror.src = dataURL;
      sigMirror.style.opacity = '1';
    } else {
      sigMirror.style.opacity = '0';
    }
  }

  function updateDiagnostics() {
    const totalStrokes = strokesHistory.length + (drawing ? 1 : 0);
    let totalNodes = 0;
    
    strokesHistory.forEach(s => { totalNodes += s.length; });
    if (drawing) { totalNodes += currentStroke.length; }

    valStrokes.textContent = totalStrokes;
    valNodes.textContent = totalNodes;

    if (totalNodes > 0) {
      // Calculate a pseudo-security score based on complexity/nodes
      const securityScore = Math.min(65 + Math.floor(totalNodes * 0.15), 99.8);
      valSecurity.textContent = `${securityScore}%`;
      
      // Calculate a pseudo-sha256 hash
      const mockHash = 'SHA256:' + Array.from({length: 6}, () => Math.floor(Math.random()*16).toString(16)).join('') + '...' + Array.from({length: 4}, () => Math.floor(Math.random()*16).toString(16)).join('');
      valHash.textContent = mockHash.toUpperCase();
    } else {
      valSecurity.textContent = '--';
      valHash.textContent = '--';
    }
  }

  // Digitize & Sign (Verify)
  verifyBtn.addEventListener('click', () => {
    if (strokesHistory.length === 0) {
      message.textContent = "Please sign first before digitizing.";
      message.style.color = '#ef4444';
      message.classList.add('show');
      return;
    }

    // Trigger Laser Scan animation
    scanner.classList.add('scanning');
    message.classList.remove('show');
    verifyBtn.disabled = true;

    setTimeout(() => {
      scanner.classList.remove('scanning');
      verifyBtn.disabled = false;

      // Update stamp
      invoiceStamp.classList.add('verified');
      invoiceStamp.textContent = 'VERIFIED';

      // Update success message
      message.textContent = "Vector signature digitized, encrypted, and locked to INV-2026-084!";
      message.style.color = 'var(--deep-sage)';
      message.classList.add('show');
      
      // Animate invoice stamp scale bump
      gsap.fromTo(invoiceStamp, { scale: 1.4 }, { scale: 1, duration: 0.5, ease: "back.out(1.7)" });
    }, 1500);
  });
}

/* ==========================================
   9.5 Sandbox Tab Switcher
   ========================================== */
function initSandboxTabs() {
  const btnSignature = document.getElementById('tab-btn-signature');
  const btnRoi = document.getElementById('tab-btn-roi');
  const panelSignature = document.getElementById('sandbox-panel-signature');
  const panelRoi = document.getElementById('sandbox-panel-roi');

  if (!btnSignature || !btnRoi || !panelSignature || !panelRoi) return;

  btnSignature.addEventListener('click', () => {
    btnSignature.classList.add('active');
    btnRoi.classList.remove('active');
    panelSignature.style.display = 'block';
    panelRoi.style.display = 'none';
  });

  btnRoi.addEventListener('click', () => {
    btnRoi.classList.add('active');
    btnSignature.classList.remove('active');
    panelSignature.style.display = 'none';
    panelRoi.style.display = 'block';
  });
}

/* ==========================================
   9.6 Operations ROI Calculator
   ========================================== */
function initRoiCalculator() {
  const sliderTeam = document.getElementById('roi-slider-team');
  const sliderRate = document.getElementById('roi-slider-rate');
  const sliderHours = document.getElementById('roi-slider-hours');

  const valTeam = document.getElementById('roi-val-team');
  const valRate = document.getElementById('roi-val-rate');
  const valHours = document.getElementById('roi-val-hours');

  const outTime = document.getElementById('roi-out-time');
  const outCapital = document.getElementById('roi-out-capital');
  const outLeakage = document.getElementById('roi-out-leakage');
  const ctaBtn = document.getElementById('roi-cta-btn');

  if (!sliderTeam || !sliderRate || !sliderHours || !outTime || !outCapital || !outLeakage || !ctaBtn) return;

  function recalculate() {
    const teamSize = parseInt(sliderTeam.value);
    const hourlyRate = parseInt(sliderRate.value);
    const manualHours = parseInt(sliderHours.value);

    // Update labels
    valTeam.textContent = `${teamSize} staff member${teamSize > 1 ? 's' : ''}`;
    valRate.textContent = `₹${hourlyRate.toLocaleString('en-IN')} / hr`;
    valHours.textContent = `${manualHours} hour${manualHours > 1 ? 's' : ''}`;

    // Math
    const totalTimeSaved = Math.round(manualHours * 4.3 * teamSize);
    const capitalSaved = Math.round(totalTimeSaved * hourlyRate);
    // Leakage assumed at 3% timesheet discrepancy on typical 160 hrs month
    const leakageSafeguard = Math.round(0.03 * (teamSize * hourlyRate * 160));
    const totalBenefit = capitalSaved + leakageSafeguard;

    // Direct text update for instant response
    outTime.textContent = `${totalTimeSaved.toLocaleString('en-IN')} hrs`;
    outCapital.textContent = `₹${capitalSaved.toLocaleString('en-IN')}`;
    outLeakage.textContent = `₹${leakageSafeguard.toLocaleString('en-IN')}`;
    
    ctaBtn.textContent = `Reclaim ₹${totalBenefit.toLocaleString('en-IN')} / month`;
  }

  // Bind Event Listeners
  [sliderTeam, sliderRate, sliderHours].forEach(slider => {
    slider.addEventListener('input', recalculate);
  });

  // Run initial state load
  recalculate();
}

/* ==========================================
   10. Price Switches (Monthly vs Annually)
   ========================================== */
function initPricingToggle() {
  const toggle = document.getElementById('pricing-switch-btn');
  const labelMonthly = document.getElementById('price-label-monthly');
  const labelYearly = document.getElementById('price-label-yearly');
  
  const studioPrice = document.getElementById('price-studio');
  const officePrice = document.getElementById('price-office');
  
  if (!toggle) return;

  const prices = {
    monthly: { studio: "49", office: "99" },
    yearly: { studio: "39", office: "79" }
  };

  function updatePrices(billingMode) {
    studioPrice.style.opacity = '0';
    officePrice.style.opacity = '0';

    setTimeout(() => {
      studioPrice.textContent = prices[billingMode].studio;
      officePrice.textContent = prices[billingMode].office;
      
      studioPrice.style.opacity = '1';
      officePrice.style.opacity = '1';
    }, 200);
  }

  toggle.addEventListener('click', () => {
    const isYearlyActive = toggle.classList.toggle('active');
    
    if (isYearlyActive) {
      labelYearly.classList.add('active');
      labelMonthly.classList.remove('active');
      updatePrices('yearly');
    } else {
      labelMonthly.classList.add('active');
      labelYearly.classList.remove('active');
      updatePrices('monthly');
    }
  });

  labelMonthly.addEventListener('click', () => {
    if (toggle.classList.contains('active')) {
      toggle.classList.remove('active');
      labelMonthly.classList.add('active');
      labelYearly.classList.remove('active');
      updatePrices('monthly');
    }
  });

  labelYearly.addEventListener('click', () => {
    if (!toggle.classList.contains('active')) {
      toggle.classList.add('active');
      labelYearly.classList.add('active');
      labelMonthly.classList.remove('active');
      updatePrices('yearly');
    }
  });
}

/* ==========================================
   11. FAQ Accordions
   ========================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================
   12. Calendar Simulator
   ========================================== */
function initAttendanceCalendar() {
  const grid = document.getElementById('calendar-sandbox-grid');
  if (!grid) return;

  const emptyCells = 5;
  const daysInMonth = 31;
  const teamLogs = {
    5: { present: 3, late: 1 },
    8: { present: 4 },
    12: { present: 2, late: 1, leave: 1 },
    15: { present: 3, absent: 1 },
    19: { present: 4 },
    22: { present: 2, half: 2 },
    26: { present: 3, leave: 1 }
  };

  grid.innerHTML = '';

  const headers = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  headers.forEach(h => {
    const el = document.createElement('div');
    el.className = 'calendar-day-header';
    el.textContent = h;
    grid.appendChild(el);
  });

  for (let i = 0; i < emptyCells; i++) {
    const el = document.createElement('div');
    el.className = 'calendar-cell';
    el.style.opacity = '0.2';
    grid.appendChild(el);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const el = document.createElement('div');
    el.className = 'calendar-cell';
    
    if (day === 24) {
      el.classList.add('today');
    }

    el.innerHTML = `<span>${day}</span>`;

    const dotsWrapper = document.createElement('div');
    dotsWrapper.className = 'calendar-badge-group';

    const logs = teamLogs[day] || { present: 4 };
    
    if (day % 7 === 0) {
      dotsWrapper.innerHTML = '';
      el.style.background = 'rgba(15, 23, 42, 0.02)';
    } else if ((day + 1) % 7 === 0) {
      const satLogs = { present: 2, leave: 1, absent: 1 };
      renderDots(satLogs, dotsWrapper);
    } else {
      renderDots(logs, dotsWrapper);
    }

    el.appendChild(dotsWrapper);
    grid.appendChild(el);
  }

  function renderDots(statusData, parentEl) {
    if (statusData.present) {
      for(let i=0; i<statusData.present; i++) {
        parentEl.innerHTML += `<div class="cal-dot present" title="Present"></div>`;
      }
    }
    if (statusData.late) {
      for(let i=0; i<statusData.late; i++) {
        parentEl.innerHTML += `<div class="cal-dot late" title="Late Arrival"></div>`;
      }
    }
    if (statusData.half) {
      for(let i=0; i<statusData.half; i++) {
        parentEl.innerHTML += `<div class="cal-dot half" title="Half Day"></div>`;
      }
    }
    if (statusData.absent) {
      for(let i=0; i<statusData.absent; i++) {
        parentEl.innerHTML += `<div class="cal-dot absent" title="Absent"></div>`;
      }
    }
    if (statusData.leave) {
      for(let i=0; i<statusData.leave; i++) {
        parentEl.innerHTML += `<div class="cal-dot leave" title="On Approved Leave"></div>`;
      }
    }
  }
}

/* ==========================================
   12.5. Geofence Compliance Simulator
   ========================================== */
function initGeofenceSandbox() {
  const mapContainer = document.getElementById('geo-map-container');
  const employeeMarker = document.getElementById('marker-employee-device');
  const tracerLine = document.getElementById('geo-tracer-line');
  
  const distanceSlider = document.getElementById('geo-distance-slider');
  const sliderValText = document.getElementById('geo-slider-val');

  const complianceBadge = document.getElementById('geo-compliance-badge');
  const inputLat = document.getElementById('geo-input-lat');
  const inputLng = document.getElementById('geo-input-lng');
  const distanceText = document.getElementById('geo-telemetry-distance');

  const inputHqLat = document.getElementById('geo-hq-lat');
  const inputHqLng = document.getElementById('geo-hq-lng');

  const clockInBtn = document.getElementById('geo-clock-in-btn');
  const journalLog = document.getElementById('geo-journal-log');

  if (!mapContainer || !employeeMarker || !tracerLine) return;

  // 1. Drag-and-Drop Event Bindings
  let isDragging = false;

  function onStartDrag(e) {
    isDragging = true;
    updatePosition(e);
    e.preventDefault();
  }

  // Binds event listeners
  function onDrag(e) {
    if (!isDragging) return;
    updatePosition(e);
    e.preventDefault();
  }

  function onStopDrag() {
    if (isDragging) {
      isDragging = false;
      employeeMarker.style.transform = 'translate(-50%, -50%)';
    }
  }

  employeeMarker.addEventListener('mousedown', onStartDrag);
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', onStopDrag);

  employeeMarker.addEventListener('touchstart', onStartDrag, { passive: false });
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('touchend', onStopDrag);

  // Click direct move trigger on map
  mapContainer.addEventListener('mousedown', (e) => {
    if (e.target === mapContainer || e.target.classList.contains('geofence-radial-line') || e.target.classList.contains('geofence-boundary-circle') || e.target.classList.contains('radar-concentric-circle') || e.target.classList.contains('radar-sweep-effect')) {
      isDragging = true;
      updatePosition(e);
    }
  });

  // 2. Core Positioning Calculations
  function updatePosition(e) {
    const rect = mapContainer.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Bounding square constraint to keep employee dot visible inside map box
    x = Math.max(8, Math.min(rect.width - 8, x));
    y = Math.max(8, Math.min(rect.height - 8, y));

    employeeMarker.style.left = x + 'px';
    employeeMarker.style.top = y + 'px';
    employeeMarker.style.transform = 'translate(-50%, -50%) scale(1.08)';

    // Update SVG Tracer Vector Coordinates
    const x2Pct = (x / rect.width) * 100 + '%';
    const y2Pct = (y / rect.height) * 100 + '%';
    tracerLine.setAttribute('x2', x2Pct);
    tracerLine.setAttribute('y2', y2Pct);

    // Compute coordinate shifts relative to center
    const dx = x - rect.width / 2;
    const dy = y - rect.height / 2;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);

    // Scaling rules: zone-safe circle width is 50%, meaning its radius is 25% of map width
    const safeRadiusPixels = rect.width * 0.25;
    const metersPerPixel = 100 / safeRadiusPixels;
    const distanceMeters = pixelDistance * metersPerPixel;

    // Sync values to range slider
    distanceSlider.value = Math.min(220, Math.round(distanceMeters));
    
    updateTelemetry(dx, dy, distanceMeters, metersPerPixel);
  }

  // 3. Update Telemetry Dashboard Values
  function updateTelemetry(dx, dy, distanceMeters, metersPerPixel) {
    distanceText.textContent = distanceMeters.toFixed(1) + ' meters';
    sliderValText.textContent = Math.round(distanceMeters) + 'm';

    // Dynamic HQ Center values (default back to Mumbai baseline if empty/invalid)
    const hqLat = parseFloat(inputHqLat?.value) || 18.92200;
    const hqLng = parseFloat(inputHqLng?.value) || 72.83400;

    const latShift = (dy * -1) * (0.000009 * metersPerPixel); // Negative Y pixel represents Northward travel
    const lngShift = dx * (0.000009 * metersPerPixel);        // Positive X pixel represents Eastward travel
    const userLat = hqLat + latShift;
    const userLng = hqLng + lngShift;

    if (document.activeElement !== inputLat) inputLat.value = userLat.toFixed(5);
    if (document.activeElement !== inputLng) inputLng.value = userLng.toFixed(5);

    // Set Access Status Badge and tracer line vector colors
    complianceBadge.className = 'telemetry-badge';
    
    // Toggle state-safe/state-warning/state-danger glow classes on input wrappers
    const allWrappers = document.querySelectorAll('.coordinate-input-wrapper');
    allWrappers.forEach(w => {
      w.classList.remove('state-safe', 'state-warning', 'state-danger');
    });

    if (distanceMeters <= 100) {
      complianceBadge.classList.add('badge-safe');
      complianceBadge.textContent = 'SAFE — IN BOUNDS';
      tracerLine.style.stroke = 'var(--sage-green)';
      allWrappers.forEach(w => w.classList.add('state-safe'));
    } else if (distanceMeters <= 150) {
      complianceBadge.classList.add('badge-warning');
      complianceBadge.textContent = 'WARNING — BUFFER ZONE';
      tracerLine.style.stroke = '#eab308';
      allWrappers.forEach(w => w.classList.add('state-warning'));
    } else {
      complianceBadge.classList.add('badge-danger');
      complianceBadge.textContent = 'BLOCKED — OUT OF BOUNDS';
      tracerLine.style.stroke = '#ef4444';
      allWrappers.forEach(w => w.classList.add('state-danger'));
    }
  }

  // 4. Update UI from Distance Range Slider
  function updateGeofenceFromSlider(distanceMeters) {
    const rect = mapContainer.getBoundingClientRect();
    if (rect.width === 0) return; // Map is not currently rendered

    const safeRadiusPixels = rect.width * 0.25;
    const metersPerPixel = 100 / safeRadiusPixels;

    // Get current marker offsets or default to a standard 45-degree angle
    const markerX = parseFloat(employeeMarker.style.left) || (rect.width * 0.5 + 35);
    const markerY = parseFloat(employeeMarker.style.top) || (rect.height * 0.5 + 35);
    let dx = markerX - rect.width / 2;
    let dy = markerY - rect.height / 2;

    let angle = Math.atan2(dy, dx);
    if (dx === 0 && dy === 0) {
      angle = -Math.PI / 4; // default to upper-right angle
    }

    const targetPixelDistance = distanceMeters / metersPerPixel;
    const newDx = Math.cos(angle) * targetPixelDistance;
    const newDy = Math.sin(angle) * targetPixelDistance;

    const x = rect.width / 2 + newDx;
    const y = rect.height / 2 + newDy;

    employeeMarker.style.left = x + 'px';
    employeeMarker.style.top = y + 'px';
    employeeMarker.style.transform = 'translate(-50%, -50%)';

    const x2Pct = (x / rect.width) * 100 + '%';
    const y2Pct = (y / rect.height) * 100 + '%';
    tracerLine.setAttribute('x2', x2Pct);
    tracerLine.setAttribute('y2', y2Pct);

    updateTelemetry(newDx, newDy, distanceMeters, metersPerPixel);
  }

  distanceSlider.addEventListener('input', (e) => {
    updateGeofenceFromSlider(parseFloat(e.target.value));
  });

  // Trigger alignment on window resizing events
  window.addEventListener('resize', () => {
    updateGeofenceFromSlider(parseFloat(distanceSlider.value));
  });

  // 4.5. Update UI from Manual Coordinates Inputs
  function updateGeofenceFromInputs() {
    const lat = parseFloat(inputLat.value);
    const lng = parseFloat(inputLng.value);

    if (isNaN(lat) || isNaN(lng)) return;

    const rect = mapContainer.getBoundingClientRect();
    if (rect.width === 0) return;

    const safeRadiusPixels = rect.width * 0.25;
    const metersPerPixel = 100 / safeRadiusPixels;

    // Dynamic HQ Center values (default back to Mumbai baseline if empty/invalid)
    const hqLat = parseFloat(inputHqLat?.value) || 18.92200;
    const hqLng = parseFloat(inputHqLng?.value) || 72.83400;

    // Compute shifts from dynamic HQ coordinates
    const latDiff = lat - hqLat;
    const lngDiff = lng - hqLng;

    // Convert shifts back to pixel offsets
    const dy = -latDiff / (0.000009 * metersPerPixel);
    const dx = lngDiff / (0.000009 * metersPerPixel);

    // Bounding constraints for marker position (keep it visible on square grid)
    let x = rect.width / 2 + dx;
    let y = rect.height / 2 + dy;

    // We can position the marker at the edge if it's way out of bounds
    x = Math.max(8, Math.min(rect.width - 8, x));
    y = Math.max(8, Math.min(rect.height - 8, y));

    employeeMarker.style.left = x + 'px';
    employeeMarker.style.top = y + 'px';
    employeeMarker.style.transform = 'translate(-50%, -50%)';

    const x2Pct = (x / rect.width) * 100 + '%';
    const y2Pct = (y / rect.height) * 100 + '%';
    tracerLine.setAttribute('x2', x2Pct);
    tracerLine.setAttribute('y2', y2Pct);

    // Compute actual distance
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    const distanceMeters = pixelDistance * metersPerPixel;

    // Sync values to range slider
    distanceSlider.value = Math.min(220, Math.round(distanceMeters));

    // Update telemetry without overwriting active input values
    updateTelemetry(dx, dy, distanceMeters, metersPerPixel);
  }

  inputLat.addEventListener('input', updateGeofenceFromInputs);
  inputLng.addEventListener('input', updateGeofenceFromInputs);

  if (inputHqLat) inputHqLat.addEventListener('input', updateGeofenceFromInputs);
  if (inputHqLng) inputHqLng.addEventListener('input', updateGeofenceFromInputs);

  // 5. Force initial layout alignment on page load
  setTimeout(() => {
    updateGeofenceFromSlider(parseFloat(distanceSlider.value));
  }, 100);

  // 6. Simulate Site Clock-In click handler
  if (clockInBtn) {
    clockInBtn.addEventListener('click', () => {
      const distanceMeters = parseFloat(distanceSlider.value);
      
      journalLog.innerHTML = '';
      
      const originalText = clockInBtn.textContent;
      clockInBtn.innerHTML = `<span class="lucide-refresh-cw" style="animation: spin 1s linear infinite; display: inline-block;"></span> Normalizing Coordinates...`;
      clockInBtn.disabled = true;

      setTimeout(() => {
        clockInBtn.innerHTML = originalText;
        clockInBtn.disabled = false;

        const timestamp = new Date();
        // Indian Standard Time (IST) offset +05:30 formatting
        const tzOffset = 330; // in minutes
        const istTime = new Date(timestamp.getTime() + tzOffset * 60000);
        const formattedIST = istTime.toISOString().replace('Z', '+05:30').replace(/\.\d{3}/, '');

        const currentHqLat = parseFloat(inputHqLat?.value) || 18.92200;
        const currentHqLng = parseFloat(inputHqLng?.value) || 72.83400;
        const currentDeviceLat = parseFloat(inputLat?.value) || 18.92244;
        const currentDeviceLng = parseFloat(inputLng?.value) || 72.83451;

        if (distanceMeters <= 150) {
          const statusType = distanceMeters <= 100 ? 'SUCCESS' : 'WARNING';
          const classLog = distanceMeters <= 100 ? 'journal-line-success' : 'journal-line-warn';
          const randHex = Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
          const auditHash = `SHA256:IST_GEOFENCE_TXN_${randHex}`;

          journalLog.innerHTML = `
            <div class="${classLog}">[${statusType}] GPS coordinates check passed.</div>
            <div class="journal-line-msg">[CENTER] Dynamic HQ Location verified at: ${currentHqLat.toFixed(5)}°N, ${currentHqLng.toFixed(5)}°E</div>
            <div class="journal-line-msg">[DEVICE] Clock-in coordinates: ${currentDeviceLat.toFixed(5)}°N, ${currentDeviceLng.toFixed(5)}°E (Deviation: ${distanceMeters.toFixed(1)}m)</div>
            <div class="journal-line-msg">[SECURE] Audit Verification Hash: ${auditHash}</div>
            <div class="journal-line-msg">[CALIBRATE] Time normalized to server IST clock: ${formattedIST}</div>
            <div class="journal-line-success">[SUCCESS] Clock-in logs finalized and locked into company ledger!</div>
          `;
        } else {
          const randHex = Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
          const threatHash = `SHA256:ERR_OUT_OF_BOUNDS_${randHex}`;

          journalLog.innerHTML = `
            <div class="journal-line-alert">[FAILED] GPS coordinates verification failed!</div>
            <div class="journal-line-msg">[CENTER] Dynamic HQ Location: ${currentHqLat.toFixed(5)}°N, ${currentHqLng.toFixed(5)}°E</div>
            <div class="journal-line-msg">[DEVICE] Clock-in coordinates: ${currentDeviceLat.toFixed(5)}°N, ${currentDeviceLng.toFixed(5)}°E (Deviation: ${distanceMeters.toFixed(1)}m)</div>
            <div class="journal-line-alert">[REJECT] Access Denied: ERR_GPS_OUT_OF_BOUNDS (Limit: 150.0m).</div>
            <div class="journal-line-msg">[SECURE] Threat audit hash logged: ${threatHash}</div>
            <div class="journal-line-alert">[ALERT] Clock-in transaction rejected. Office access audit flagged!</div>
          `;
        }
        
        // Scroll journal logs to bottom
        journalLog.scrollTop = journalLog.scrollHeight;
      }, 1200);
    });
  }

  // 7. Auto-Read Device Location (Hardware GPS integration)
  const autoReadBtn = document.getElementById('geo-btn-auto-read');

  function autoReadDeviceLocation(isAutoTrigger = false) {
    if (!navigator.geolocation) {
      if (!isAutoTrigger) logJournalLine("SYSTEM ERROR: Geolocation is not supported by your browser.", "alert");
      return;
    }

    if (!isAutoTrigger) {
      logJournalLine("SYSTEM: Querying device hardware GPS sensors...", "msg");
    }

    if (autoReadBtn) {
      autoReadBtn.disabled = true;
      autoReadBtn.innerHTML = `<span class="lucide-refresh-cw" style="animation: spin 1s linear infinite; display: inline-block; width: 10px; height: 10px; margin-right: 2px;"></span> Reading...`;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        logJournalLine(`SYSTEM: Hardware GPS read successful! LAT: ${lat.toFixed(5)}°N, LNG: ${lng.toFixed(5)}°E`, "success");

        inputLat.value = lat.toFixed(5);
        inputLng.value = lng.toFixed(5);

        // Update radar display and calculations
        updateGeofenceFromInputs();

        // Restore button state
        if (autoReadBtn) {
          autoReadBtn.disabled = false;
          autoReadBtn.innerHTML = `<i data-lucide="map-pin" style="width: 10px; height: 10px; display: inline-block; margin-right: 2px;"></i> Auto-Read GPS`;
          createIcons({ icons: { MapPin } }); // Re-render Lucide icon specifically
        }
      },
      (error) => {
        if (!isAutoTrigger) {
          let errorMsg = "GPS hardware access failed.";
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = "Permission Denied: Location request rejected.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = "Signal Error: Location info unavailable.";
          } else if (error.code === error.TIMEOUT) {
            errorMsg = "Timeout: Coordinate retrieval request timed out.";
          }
          logJournalLine(`SYSTEM ERROR: ${errorMsg}`, "alert");
        }

        // Restore button state
        if (autoReadBtn) {
          autoReadBtn.disabled = false;
          autoReadBtn.innerHTML = `<i data-lucide="map-pin" style="width: 10px; height: 10px; display: inline-block; margin-right: 2px;"></i> Auto-Read GPS`;
          createIcons({ icons: { MapPin } }); // Re-render Lucide icon specifically
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  function logJournalLine(message, type = "msg") {
    if (!journalLog) return;
    const line = document.createElement('div');
    if (type === "success") line.className = "journal-line-success";
    else if (type === "warn") line.className = "journal-line-warn";
    else if (type === "alert") line.className = "journal-line-alert";
    else line.className = "journal-line-msg";
    
    line.textContent = message;
    journalLog.appendChild(line);
    journalLog.scrollTop = journalLog.scrollHeight;
  }

  if (autoReadBtn) {
    autoReadBtn.addEventListener('click', () => autoReadDeviceLocation(false));
  }

  // Attempt automatic reading on startup
  setTimeout(() => {
    autoReadDeviceLocation(true);
  }, 1200);
}

/* ==========================================
   13. Contact Form Submission
   ========================================== */
function initContactForm() {
  const form = document.getElementById('demo-contact-form');
  const status = document.getElementById('form-status-msg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = `<span class="lucide-refresh-cw" style="animation: spin 1s linear infinite"></span> Scheduling...`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      status.className = "form-status success";
      status.textContent = "Thank you! Our systems coordinator will email your personal W4Y setup credentials shortly.";
      form.reset();
    }, 1800);
  });
}

/* ==========================================
   14. Testimonials Slideshow
   ========================================== */
function initTestimonialSlider() {
  const slider = document.getElementById('testimonial-slide-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const indicators = document.querySelectorAll('.test-indicator');
  
  if (!slider || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;

  function goToSlide(index) {
    if (index < 0 || index >= slideCount) return;
    currentIndex = index;
    slider.style.transform = `translateX(-${index * 100}%)`;
    
    indicators.forEach((ind, i) => {
      if (i === index) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });
  }

  indicators.forEach(ind => {
    ind.addEventListener('click', () => {
      const targetIdx = parseInt(ind.dataset.index);
      goToSlide(targetIdx);
    });
  });

  setInterval(() => {
    let nextIdx = currentIndex + 1;
    if (nextIdx >= slideCount) nextIdx = 0;
    goToSlide(nextIdx);
  }, 8000);
}

// Spin animations helper styles
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

/* ==========================================
   15. Elite Mouse-Tracking Spotlight Glow
   ========================================== */

/* ==========================================
   16. Three.js Interactive 3D Architectural WebGL Scene
   ========================================== */
function initHero3DWebGLScene() {
  const container = document.getElementById('hero-3d-canvas-container');
  if (!container) return;

  // IntersectionObserver to pause Three.js rendering when out of viewport
  let isSceneVisible = true;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isSceneVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(container);
  }

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene, Camera & Transparent Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 14.5, 16); // Elevated camera to match new higher baseline
  camera.lookAt(0, 11.0, -2); // Centered camera framing on the high-level baseline

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(width, height);
  renderer.setPixelRatio(1);
  container.appendChild(renderer.domElement);

  // Fade in container smoothly once loaded
  requestAnimationFrame(() => {
    container.classList.add('loaded');
  });

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x10B981, 1.8, 40); // Sage Green glow
  pointLight1.position.set(6, 6, 4);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x047857, 1.2, 30); // Deep Teal glow
  pointLight2.position.set(-6, -2, -4);
  scene.add(pointLight2);

  // Architectural Blueprint Perspective Grid
  const gridHelper = new THREE.GridHelper(36, 36, 0x047857, 0x94A3B8); // Center line deep sage, other lines slate
  gridHelper.position.y = 9.0; // Shifted baseline significantly upward
  if (gridHelper.material) {
    gridHelper.material.opacity = 0.35; // Increased grid opacity for high visibility
    gridHelper.material.transparent = true;
  }
  scene.add(gridHelper);

  // Secondary sub-grid for a "double blueprint layout" feel
  const subGridHelper = new THREE.GridHelper(36, 72, 0x047857, 0xe2e8f0);
  subGridHelper.position.y = 9.02; // Shifted sub-grid upward
  if (subGridHelper.material) {
    subGridHelper.material.opacity = 0.22; // Increased sub-grid visibility
    subGridHelper.material.transparent = true;
  }
  scene.add(subGridHelper);

  // Floating Architectural Wireframe solids
  const structuresGroup = new THREE.Group();
  scene.add(structuresGroup);

  const structuresData = [
    { w: 2.2, h: 5.0, d: 2.2, x: -7.5, y: 9.0, z: -6.0 },
    { w: 3.5, h: 3.5, d: 3.5, x: 7.0, y: 9.0, z: -5.0 },
    { w: 1.8, h: 7.0, d: 1.8, x: -3.5, y: 9.0, z: -9.0 },
    { w: 4.5, h: 2.5, d: 3.0, x: 4.5, y: 9.0, z: -1.0 },
    { w: 2.8, h: 4.5, d: 2.8, x: 0.0, y: 9.0, z: -11.0 },
    { w: 1.5, h: 3.0, d: 1.5, x: -8.0, y: 9.0, z: 0.0 },
    { w: 2.0, h: 6.0, d: 2.0, x: 8.5, y: 9.0, z: -10.0 }
  ];

  const wireframeMeshes = [];

  structuresData.forEach((s) => {
    const geom = new THREE.BoxGeometry(s.w, s.h, s.d);
    
    // Shift geometry origin so that scaling on Y keeps baseline flat on the grid floor
    geom.translate(0, s.h / 2, 0);

    const edges = new THREE.EdgesGeometry(geom);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x047857, // Muted deep sage green
      transparent: true,
      opacity: 0.32 // Increased wireframe border opacity for crisp definition
    });
    const lineSegments = new THREE.LineSegments(edges, lineMat);
    lineSegments.position.set(s.x, s.y, s.z);
    
    // Add custom rotation speeds
    lineSegments.userData = {
      rotSpeedY: 0.0015 + Math.random() * 0.002,
      rotSpeedX: 0.0005 + Math.random() * 0.001,
      floatSpeed: 0.004 + Math.random() * 0.005,
      floatRange: 0.15 + Math.random() * 0.15,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: s.y
    };

    structuresGroup.add(lineSegments);
    wireframeMeshes.push(lineSegments);

    // Light translucent glassmorphic faces
    const meshMat = new THREE.MeshBasicMaterial({
      color: 0x0F172A,
      transparent: true,
      opacity: 0.008,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geom, meshMat);
    mesh.position.copy(lineSegments.position);
    structuresGroup.add(mesh);
    lineSegments.userData.meshPartner = mesh; // bind together for animation sync
  });

  // Floating Blueprint Nodes (Vertices)
  const particleCount = 140;
  const positions = new Float32Array(particleCount * 3);
  const particleMeta = [];

  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    positions[idx] = (Math.random() - 0.5) * 36;     // X
    positions[idx + 1] = 9.0 + Math.random() * 12;   // Y
    positions[idx + 2] = (Math.random() - 0.5) * 24;  // Z

    particleMeta.push({
      speedX: (Math.random() - 0.5) * 0.006,
      speedY: 0.005 + Math.random() * 0.008,
      speedZ: (Math.random() - 0.5) * 0.006,
      baseX: positions[idx],
      baseY: positions[idx + 1],
      baseZ: positions[idx + 2],
      rangeX: 1.0 + Math.random() * 2.0,
      rangeZ: 1.0 + Math.random() * 2.0,
      time: Math.random() * Math.PI * 2
    });
  }

  const particleGeom = new THREE.BufferGeometry();
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Circular point texture generated in code dynamically (no external asset needed)
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 16;
  pCanvas.height = 16;
  const pCtx = pCanvas.getContext('2d');
  const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.3, 'rgba(4, 120, 87, 0.65)'); // Deep Sage green shade
  grad.addColorStop(1, 'rgba(4, 120, 87, 0)');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 16, 16);
  const pTexture = new THREE.CanvasTexture(pCanvas);

  const pMaterial = new THREE.PointsMaterial({
    size: 0.38, // Slightly larger coordinate nodes for clear visual feedback
    map: pTexture,
    transparent: true,
    opacity: 0.65, // Increased node opacity
    blending: THREE.AdditiveBlending,
    color: 0x047857, // Brand deep sage
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeom, pMaterial);
  scene.add(particleSystem);

  // Interactive Mouse & Scroll tracking
  let mouseX = 0;
  let mouseY = 0;
  let targetCameraRotY = 0;
  let targetCameraRotX = 0;

  window.addEventListener('mousemove', (e) => {
    // Normalize coordinates between -0.5 and 0.5
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  // GSAP ScrollTrigger to tilt the 3D scene grid on scroll
  gsap.to(scene.rotation, {
    x: -0.45, // tilt grid forward as we scroll
    y: 0.15,
    scrollTrigger: {
      trigger: "#hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Render loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    // Skip all animation logic and rendering if the canvas is out of the viewport
    if (!isSceneVisible) return;

    const time = clock.getElapsedTime();

    // Rotate and float the building shapes
    wireframeMeshes.forEach((mesh) => {
      const data = mesh.userData;
      mesh.rotation.y += data.rotSpeedY;
      mesh.rotation.x += data.rotSpeedX;

      const yOffset = Math.sin(time * 0.8 + data.floatOffset) * data.floatRange;
      mesh.position.y = data.baseY + yOffset;

      if (data.meshPartner) {
        data.meshPartner.rotation.y = mesh.rotation.y;
        data.meshPartner.rotation.x = mesh.rotation.x;
        data.meshPartner.position.y = mesh.position.y;
      }
    });

    // Animate the particles
    const positionsAttr = particleGeom.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const meta = particleMeta[i];
      meta.time += 0.005;

      // Drift upward and reset if past top bounds
      positionsAttr.array[idx + 1] += meta.speedY;
      if (positionsAttr.array[idx + 1] > 21.0) { // 9.0 + 12
        positionsAttr.array[idx + 1] = 9.0;
      }

      // Drift in circular paths on X-Z plane
      positionsAttr.array[idx] = meta.baseX + Math.sin(meta.time) * meta.rangeX;
      positionsAttr.array[idx + 2] = meta.baseZ + Math.cos(meta.time) * meta.rangeZ;
    }
    positionsAttr.needsUpdate = true;

    // Smooth camera mouse tracking (lerp camera rotation target coordinates)
    targetCameraRotY += (mouseX * 0.22 - targetCameraRotY) * 0.06;
    targetCameraRotX += (mouseY * 0.12 - targetCameraRotX) * 0.06;

    camera.position.x = 16 * Math.sin(targetCameraRotY);
    camera.position.z = 16 * Math.cos(targetCameraRotY);
    camera.position.y = 14.5 + targetCameraRotX * 12; // Camera baseline matches elevated baseline
    camera.lookAt(0, 11.0, -2);

    renderer.render(scene, camera);
  }

  animate();

  // Responsive resize
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/* ==========================================
   17. GSAP 3D Interactive Mouse Parallax Mockup Tilt
   ========================================== */
function initHeroMouseParallax() {
  const heroSection = document.getElementById('hero-section');
  const mockup = document.getElementById('hero-main-mockup');

  if (!heroSection || !mockup) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    
    // Calculate cursor positions normalized between -0.5 and 0.5
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Smoothly animate the target rotation coordinates
    gsap.to(mockupTilt, {
      x: -y * 14, // tilt on X based on Y coordinate
      y: x * 14,  // tilt on Y based on X coordinate
      duration: 0.65,
      ease: "power2.out",
      onUpdate: () => {
        // Apply rotation to mockup element, scaled by scroll Tilt factor
        gsap.set(mockup, {
          rotateX: mockupTilt.x * scrollTiltFactor.value,
          rotateY: mockupTilt.y * scrollTiltFactor.value,
          overwrite: "auto"
        });
      }
    });
  });

  // When cursor leaves the hero area, spring mockup back to gentle resting tilt
  heroSection.addEventListener('mouseleave', () => {
    gsap.to(mockupTilt, {
      x: 8,
      y: -4,
      duration: 0.85,
      ease: "elastic.out(1.0, 0.55)",
      onUpdate: () => {
        gsap.set(mockup, {
          rotateX: mockupTilt.x * scrollTiltFactor.value,
          rotateY: mockupTilt.y * scrollTiltFactor.value,
          overwrite: "auto"
        });
      }
    });
  });
}

/* ==========================================
   18. Pinned Console - Click-to-Expand Lightbox Modal
   ========================================== */
function initConsoleLightbox() {
  const wrapper = document.querySelector('.console-screen-wrapper');
  const lightbox = document.getElementById('console-lightbox');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const lightboxImg = document.getElementById('lightbox-img');
  
  if (!wrapper || !lightbox) return;

  wrapper.addEventListener('click', () => {
    // 1. Find the active media element inside the console screen
    const activeImg = document.querySelector('.console-img.active');

    // Reset lightbox media states
    lightboxImg.classList.remove('active');
    lightboxImg.src = '';
    
    let mediaFound = false;

    if (activeImg && activeImg.classList.contains('active')) {
      // It's a role screenshot image
      lightboxImg.src = activeImg.getAttribute('src');
      lightboxImg.classList.add('active');
      mediaFound = true;
    }

    if (mediaFound) {
      // 2. Open Lightbox modal
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      
      // Pause scroll engine temporarily (lock viewport body scroll)
      document.body.style.overflow = 'hidden';
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Close on close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
