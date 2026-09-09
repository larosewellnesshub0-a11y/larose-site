/* Login gate for the hosted (read-only) dashboard.
   ---------------------------------------------------------------------------
   GitHub Pages cannot run server-side authentication, so this is a
   client-side gate: it keeps the dashboard away from casual visitors and
   search engines, it is NOT a substitute for real access control. Anything
   sensitive (leads) stays behind the Apps Script READ_TOKEN, which never
   leaves the browser of the person who pasted it.

   Credentials are checked as SHA-256(username + "\n" + password). To change
   them run:  node -e "console.log(require('crypto').createHash('sha256').update('USER\nPASS').digest('hex'))"
   and paste the result into AUTH_HASH below, then publish.
   The gate is skipped on localhost, where the local server is the boundary. */
(() => {
  "use strict";
  const AUTH_HASH = "790e8df7e9b9f8ad131176575fd5b60b6883badfffe4b512d48327b45d32d1ee";
  const SESSION_KEY = "lr_dash_auth";
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (isLocal) return;
  try { if (sessionStorage.getItem(SESSION_KEY) === AUTH_HASH) return; } catch {}

  async function digest(text) {
    const bytes = new TextEncoder().encode(text);
    const buffer = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function gate() {
    document.documentElement.classList.add("is-locked");
    const style = document.createElement("style");
    style.textContent = `
      html.is-locked body > *:not(.auth-gate) { display: none !important; }
      .auth-gate { min-height: 100vh; display: grid; place-items: center; padding: 1.5rem; background: #f3f2e6; font-family: "IBM Plex Sans Arabic", "Segoe UI", sans-serif; color: #23241a; }
      .auth-gate form { width: min(100%, 22rem); background: #fff; border: 1px solid #d6d4ad; border-radius: 1.25rem; padding: 2rem; box-shadow: 0 20px 50px rgba(35,36,26,.12); display: grid; gap: .9rem; }
      .auth-gate h1 { margin: 0; font-size: 1.35rem; }
      .auth-gate p { margin: 0; font-size: .85rem; color: #5f6150; }
      .auth-gate label { display: grid; gap: .3rem; font-size: .9rem; font-weight: 600; }
      .auth-gate input { min-height: 2.75rem; padding: .55rem .75rem; border: 1px solid #bfbd9b; border-radius: .6rem; font: inherit; }
      .auth-gate button { min-height: 2.9rem; border: 0; border-radius: 999px; background: #5c5f3f; color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
      .auth-gate .auth-gate__error { color: #a5595c; font-size: .85rem; min-height: 1.2em; }
    `;
    document.head.appendChild(style);
    const box = document.createElement("div");
    box.className = "auth-gate";
    box.innerHTML = `
      <form autocomplete="on">
        <h1>لوحة إدارة لاروز <small style="display:block;font-weight:400;font-size:.8rem;color:#5f6150" lang="en" dir="ltr">La Rose dashboard · sign in</small></h1>
        <p>الدخول لفريق العيادة فقط. <span lang="en" dir="ltr">Clinic team only.</span></p>
        <label>اسم المستخدم <small lang="en" dir="ltr">Username</small><input name="username" autocomplete="username" required></label>
        <label>كلمة السر <small lang="en" dir="ltr">Password</small><input name="password" type="password" autocomplete="current-password" required></label>
        <div class="auth-gate__error" role="alert" aria-live="polite"></div>
        <button type="submit">دخول <span lang="en" dir="ltr">Sign in</span></button>
      </form>`;
    document.body.prepend(box);
    const form = box.querySelector("form");
    const error = box.querySelector(".auth-gate__error");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const user = form.username.value.trim();
      const pass = form.password.value;
      const hash = await digest(user + "\n" + pass);
      if (hash === AUTH_HASH) {
        try { sessionStorage.setItem(SESSION_KEY, hash); } catch {}
        location.reload();
      } else {
        error.textContent = "بيانات الدخول غير صحيحة · Wrong username or password";
        form.password.value = "";
        form.password.focus();
      }
    });
  }

  if (document.body) gate(); else document.addEventListener("DOMContentLoaded", gate, { once: true });
})();
