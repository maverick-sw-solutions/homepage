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
})();
