(function () {
  var STORAGE_KEY = "mss-site-theme";

  function apply(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-theme-btn") === theme;
      btn.classList.toggle("is-active", isActive);
    });
  }

  function setTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    apply(theme);
  }

  var stored = "system";
  try { stored = localStorage.getItem(STORAGE_KEY) || "system"; } catch (e) {}
  apply(stored);

  document.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-theme-btn]");
    if (btn) setTheme(btn.getAttribute("data-theme-btn"));
  });
})();
