(function () {
  var INTERVAL_MS = 4000;

  function setupCarousel(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel-slide"));
    if (slides.length < 2) return;

    var index = slides.findIndex(function (s) { return s.classList.contains("is-active"); });
    if (index < 0) index = 0;
    var timer = null;

    function show(newIndex) {
      slides[index].classList.remove("is-active");
      index = (newIndex + slides.length) % slides.length;
      slides[index].classList.add("is-active");
    }

    function start() {
      stop();
      timer = setInterval(function () { show(index + 1); }, INTERVAL_MS);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);

    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");

    function navigate(event, delta) {
      event.preventDefault();
      event.stopPropagation();
      show(index + delta);
    }

    if (prevBtn) prevBtn.addEventListener("click", function (e) { navigate(e, -1); });
    if (nextBtn) nextBtn.addEventListener("click", function (e) { navigate(e, 1); });

    start();
  }

  document.querySelectorAll("[data-carousel]").forEach(setupCarousel);

  var lightbox = null;

  function ensureLightbox() {
    if (lightbox) return lightbox;

    var el = document.createElement("div");
    el.className = "lightbox";
    el.hidden = true;
    el.innerHTML =
      '<button type="button" class="lightbox__close" data-lightbox-close aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button>' +
      '<button type="button" class="lightbox__arrow lightbox__arrow--prev" data-lightbox-prev aria-label="Slide anterior"><i class="fa-solid fa-chevron-left"></i></button>' +
      '<img class="lightbox__image" alt="">' +
      '<button type="button" class="lightbox__arrow lightbox__arrow--next" data-lightbox-next aria-label="Próximo slide"><i class="fa-solid fa-chevron-right"></i></button>';
    document.body.appendChild(el);

    var img = el.querySelector(".lightbox__image");
    var prevBtn = el.querySelector("[data-lightbox-prev]");
    var nextBtn = el.querySelector("[data-lightbox-next]");
    var closeBtn = el.querySelector("[data-lightbox-close]");
    var images = [];
    var index = 0;

    function render(direction) {
      if (direction) {
        img.style.transitionDuration = "0s";
        img.classList.add(direction > 0 ? "lightbox__image--enter-right" : "lightbox__image--enter-left");
      }

      img.src = images[index].src;
      img.alt = images[index].alt;
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= images.length - 1;

      if (direction) {
        void img.offsetWidth;
        img.style.transitionDuration = "";
        img.classList.remove("lightbox__image--enter-right", "lightbox__image--enter-left");
      }
    }

    function open(list, startIndex) {
      images = list;
      index = startIndex;
      render();
      el.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function close() {
      el.hidden = true;
      document.body.style.overflow = "";
    }

    prevBtn.addEventListener("click", function () {
      if (index > 0) { index -= 1; render(-1); }
    });
    nextBtn.addEventListener("click", function () {
      if (index < images.length - 1) { index += 1; render(1); }
    });
    closeBtn.addEventListener("click", close);
    el.addEventListener("click", function (e) {
      if (e.target === el) close();
    });
    document.addEventListener("keydown", function (e) {
      if (el.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prevBtn.click();
      if (e.key === "ArrowRight") nextBtn.click();
    });

    lightbox = { open: open };
    return lightbox;
  }

  function setupScreensCarousel(root) {
    var viewport = root.querySelector(".screens-carousel__viewport");
    var track = root.querySelector("[data-screens-track]");
    var slides = Array.prototype.slice.call(track.children);
    var prevBtn = root.querySelector("[data-screens-prev]");
    var nextBtn = root.querySelector("[data-screens-next]");
    if (!slides.length) return;

    var lb = ensureLightbox();
    var imageList = slides.map(function (slide) {
      var slideImg = slide.querySelector("img");
      return { src: slideImg.src, alt: slideImg.alt };
    });
    slides.forEach(function (slide, i) {
      var slideImg = slide.querySelector("img");
      slideImg.addEventListener("click", function () { lb.open(imageList, i); });
    });

    var index = 0;

    function step() {
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      return slides[0].getBoundingClientRect().width + gap;
    }

    function visibleCount() {
      return Math.max(1, Math.round(viewport.clientWidth / step()));
    }

    function update() {
      var maxIndex = Math.max(0, slides.length - visibleCount());
      index = Math.min(index, maxIndex);
      track.style.transform = "translateX(" + (-index * step()) + "px)";
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= maxIndex;
    }

    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      index = Math.max(0, index - 1);
      update();
    });

    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      var maxIndex = Math.max(0, slides.length - visibleCount());
      index = Math.min(maxIndex, index + 1);
      update();
    });

    window.addEventListener("resize", update);
    update();
  }

  document.querySelectorAll("[data-screens-carousel]").forEach(setupScreensCarousel);

  function setupMobileReorder() {
    var section = document.getElementById("capturas");
    var comoFunciona = document.getElementById("como-funciona");
    if (!section || !comoFunciona) return;

    var mq = window.matchMedia("(max-width: 640px)");
    var originalParent = section.parentNode;
    var originalNext = section.nextSibling;
    var moved = false;

    function apply() {
      if (mq.matches && !moved) {
        comoFunciona.insertAdjacentElement("afterend", section);
        moved = true;
      } else if (!mq.matches && moved) {
        originalParent.insertBefore(section, originalNext);
        moved = false;
      }
    }

    mq.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    apply();
  }

  setupMobileReorder();

  function setupHeaderBadgeReveal() {
    var eyebrow = document.querySelector(".hero__eyebrow");
    var badge = document.querySelector("[data-header-badge]");
    if (!eyebrow || !badge) return;

    var observer = null;

    function createObserver() {
      if (observer) observer.disconnect();
      var headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 80;
      observer = new IntersectionObserver(function (entries) {
        badge.classList.toggle("is-visible", !entries[0].isIntersecting);
      }, { rootMargin: "-" + headerH + "px 0px 0px 0px", threshold: 0 });
      observer.observe(eyebrow);
    }

    createObserver();
    window.addEventListener("resize", createObserver);
  }

  setupHeaderBadgeReveal();
})();
