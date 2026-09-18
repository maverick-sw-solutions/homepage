(function () {
  var CONTACT_ENDPOINT = "/api/contact";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var modal = null;

  function ensureModal() {
    if (modal) return modal;

    var el = document.createElement("div");
    el.className = "contact-modal";
    el.hidden = true;
    el.innerHTML =
      '<div class="contact-modal__panel" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">' +
      '<button type="button" class="contact-modal__close" data-contact-close aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button>' +
      '<h2 id="contact-modal-title">Fale com a gente</h2>' +
      '<p class="contact-modal__hint">Preencha telefone e/ou e-mail para retornarmos o contato.</p>' +
      '<form class="contact-modal__form" novalidate>' +
      '<label class="contact-modal__field"><span>Nome completo</span><input type="text" name="name" autocomplete="name" required></label>' +
      '<div class="contact-modal__row">' +
      '<label class="contact-modal__field"><span>Telefone</span><input type="tel" name="phone" autocomplete="tel"></label>' +
      '<label class="contact-modal__field"><span>E-mail</span><input type="email" name="email" autocomplete="email"></label>' +
      "</div>" +
      '<label class="contact-modal__field"><span>Assunto</span><input type="text" name="subject" required></label>' +
      '<label class="contact-modal__field"><span>Mensagem</span><textarea name="message" rows="4" required></textarea></label>' +
      '<div class="contact-modal__status" role="status"></div>' +
      '<button type="submit" class="btn btn--primary contact-modal__submit">Enviar<span class="arrow" aria-hidden="true"></span></button>' +
      "</form>" +
      "</div>";
    document.body.appendChild(el);

    var panel = el.querySelector(".contact-modal__panel");
    var closeBtn = el.querySelector("[data-contact-close]");
    var form = el.querySelector("form");
    var status = el.querySelector(".contact-modal__status");
    var nameInput = form.querySelector('[name="name"]');
    var phoneInput = form.querySelector('[name="phone"]');
    var emailInput = form.querySelector('[name="email"]');
    var subjectInput = form.querySelector('[name="subject"]');
    var messageInput = form.querySelector('[name="message"]');
    var submitBtn = form.querySelector('button[type="submit"]');
    var lastFocused = null;

    function setStatus(message, kind) {
      status.textContent = message;
      status.className = "contact-modal__status" + (kind ? " contact-modal__status--" + kind : "");
    }

    function open(subject) {
      lastFocused = document.activeElement;
      subjectInput.value = subject || "";
      setStatus("");
      el.hidden = false;
      document.body.style.overflow = "hidden";
      nameInput.focus();
    }

    function close() {
      el.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    closeBtn.addEventListener("click", close);
    el.addEventListener("click", function (e) {
      if (e.target === el) close();
    });
    document.addEventListener("keydown", function (e) {
      if (el.hidden) return;
      if (e.key === "Escape") close();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = nameInput.value.trim();
      var phone = phoneInput.value.trim();
      var email = emailInput.value.trim();
      var subject = subjectInput.value.trim();
      var message = messageInput.value.trim();

      if (!name) {
        setStatus("Digite seu nome completo.", "err");
        nameInput.focus();
        return;
      }
      if (!phone && !email) {
        setStatus("Informe pelo menos telefone ou e-mail.", "err");
        phoneInput.focus();
        return;
      }
      if (email && !EMAIL_RE.test(email)) {
        setStatus("Digite um e-mail válido.", "err");
        emailInput.focus();
        return;
      }
      if (!subject) {
        setStatus("Digite um assunto.", "err");
        subjectInput.focus();
        return;
      }
      if (!message) {
        setStatus("Digite uma mensagem.", "err");
        messageInput.focus();
        return;
      }

      submitBtn.disabled = true;
      setStatus("Enviando…");

      fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, phone: phone, email: email, subject: subject, message: message }),
      })
        .then(function (res) {
          if (res.status === 429) throw new Error("rate_limit");
          if (!res.ok) throw new Error("network");
          return res.json();
        })
        .then(function () {
          setStatus("Mensagem enviada! Retornaremos em breve.", "ok");
          form.reset();
          window.setTimeout(close, 1800);
        })
        .catch(function (err) {
          var msg =
            err && err.message === "rate_limit"
              ? "Muitas tentativas. Tente novamente em instantes."
              : "Não foi possível enviar agora. Tente novamente mais tarde.";
          setStatus(msg, "err");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });

    modal = { open: open, close: close };
    return modal;
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-contact-open]");
    if (!trigger) return;
    e.preventDefault();
    ensureModal().open(trigger.getAttribute("data-contact-subject") || "");
  });
})();
