const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

async function checkRateLimit(env, ip) {
  const key = `rl:${ip}`;
  const current = parseInt((await env.WAITLIST.get(key)) || "0", 10);
  if (current >= RATE_LIMIT_MAX) return false;
  await env.WAITLIST.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  return true;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
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

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(email)) {
      return json({ error: "invalid_email" }, 400);
    }

    await env.WAITLIST.put(`email:${email}`, JSON.stringify({ createdAt: new Date().toISOString() }));

    return json({ ok: true });
  },
};
