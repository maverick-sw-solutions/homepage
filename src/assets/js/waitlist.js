(function () {
  // TODO: trocar para uma rota no mesmo domínio (ex.: /api/waitlist) quando o
  // site tiver domínio de produção definido e o Worker puder ser mapeado nele.
  var WAITLIST_ENDPOINT = "https://mss-tupijua-waitlist.heitormvl12.workers.dev/";

  var form = document.getElementById("waitlist-form");
  if (!form) return;

  var status = document.getElementById("waitlist-status");
  var emailInput = form.querySelector('input[name="email"]');

  function setStatus(message, kind) {
    status.textContent = message;
    status.className = "waitlist-form__status" + (kind ? " waitlist-form__status--" + kind : "");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      setStatus("Digite um e-mail válido.", "err");
      emailInput.focus();
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    setStatus("Enviando…");

    fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    })
      .then(function (res) {
        if (res.status === 429) throw new Error("rate_limit");
        if (!res.ok) throw new Error("network");
        return res.json();
      })
      .then(function () {
        setStatus("Pronto! Você será avisado quando o TupiJuá for lançado.", "ok");
        form.reset();
      })
      .catch(function (err) {
        var message =
          err && err.message === "rate_limit"
            ? "Muitas tentativas. Tente novamente em instantes."
            : "Não foi possível registrar seu e-mail agora. Tente novamente mais tarde.";
        setStatus(message, "err");
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
