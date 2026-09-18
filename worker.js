const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const MAX_FIELD_LEN = 200;
const MAX_MESSAGE_LEN = 4000;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function checkRateLimit(env, ip) {
  const key = `rl:contact:${ip}`;
  const current = parseInt((await env.RATE_LIMIT.get(key)) || "0", 10);
  if (current >= RATE_LIMIT_MAX) return false;
  await env.RATE_LIMIT.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  return true;
}

function slugPart(value) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

function localPartFromName(fullName, domain) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts.length ? slugPart(parts[0]) : "";
  const last = parts.length > 1 ? slugPart(parts[parts.length - 1]) : "";
  const local = last && first ? `${first}.${last}` : first || last;
  return `${local || "contato-site"}@${domain}`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function handleContact(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const allowed = await checkRateLimit(env, ip);
  if (!allowed) {
    return json({ error: "rate_limited" }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, MAX_FIELD_LEN) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, MAX_FIELD_LEN) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, MAX_FIELD_LEN) : "";
  const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, MAX_FIELD_LEN) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE_LEN) : "";

  if (!name) return json({ error: "invalid_name" }, 400);
  if (!subject) return json({ error: "invalid_subject" }, 400);
  if (!message) return json({ error: "invalid_message" }, 400);
  if (!phone && !email) return json({ error: "missing_contact" }, 400);
  if (email && !EMAIL_RE.test(email)) return json({ error: "invalid_email" }, 400);

  const from = `${name} (via site) <${localPartFromName(name, env.CONTACT_FROM_DOMAIN)}>`;
  const replyTo = email && EMAIL_RE.test(email) ? email : undefined;

  const textLines = [
    `Nome: ${name}`,
    phone ? `Telefone: ${phone}` : null,
    email ? `E-mail: ${email}` : null,
    "",
    message,
  ].filter((line) => line !== null);

  const htmlLines = [
    `<p><strong>Nome:</strong> ${escapeHtml(name)}</p>`,
    phone ? `<p><strong>Telefone:</strong> ${escapeHtml(phone)}</p>` : "",
    email ? `<p><strong>E-mail:</strong> ${escapeHtml(email)}</p>` : "",
    `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
  ].join("\n");

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to: [env.CONTACT_TO],
      reply_to: replyTo,
      subject: `[Site] ${subject}`,
      text: textLines.join("\n"),
      html: htmlLines,
    }),
  });

  if (!resendRes.ok) {
    return json({ error: "send_failed" }, 502);
  }

  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
