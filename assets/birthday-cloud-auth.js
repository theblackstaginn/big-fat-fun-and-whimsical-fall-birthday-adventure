
/* Birthday Adventure: Quest Board account connection */
(() => {
  "use strict";

  const SUPABASE_URL =
    "https://pqifpislzljilqatmtly.supabase.co";

  // Public browser key, not a secret/service-role key.
  const SUPABASE_KEY =
    "sb_publishable_16wAhIyuMsClbOYoAZt6aQ_unXWTJ_n";

  const panel = document.createElement("div");
  panel.id = "birthday-cloud-auth";

  panel.innerHTML = `
    <button type="button" id="cloud-toggle">
      ☁ Quest Board Sign In
    </button>
    <section id="cloud-panel" hidden>
      <h3>Quest Board Cloud Save</h3>
      <p>Use your existing Quest Board account.</p>

      <form id="cloud-form">
        <label>
          Email
          <input name="email" type="email"
                 autocomplete="username" required>
        </label>
        <label>
          Password
          <input name="password" type="password"
                 autocomplete="current-password" required>
        </label>
        <button type="submit">Sign In</button>
      </form>

      <button type="button" id="cloud-signout" hidden>
        Sign Out
      </button>
      <p id="cloud-status" role="status"></p>
    </section>
  `;

  // Adventure Settings is built by adventure.js before this deferred script runs.
  // Mount inside its existing scrollable content, not below the page footer.
  const settings = document.querySelector(".rpg-settings");
  if (settings) {
    settings.append(panel);
  } else {
    document.body.append(panel);
  }

  const toggle = panel.querySelector("#cloud-toggle");
  const section = panel.querySelector("#cloud-panel");
  const form = panel.querySelector("#cloud-form");
  const status = panel.querySelector("#cloud-status");
  const signout = panel.querySelector("#cloud-signout");

  toggle.addEventListener("click", () => {
    section.hidden = !section.hidden;
  });

  if (!window.supabase?.createClient) {
    form.hidden = true;
    status.textContent = "Cloud connection unavailable.";
    return;
  }

  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      auth: {
        storageKey: "birthday-adventure-auth-v1",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    }
  );

  window.birthdayCloud = {
    client,
    user: null
  };

  function updateAccount(user) {
    const account = user && !user.is_anonymous
      ? user
      : null;

    window.birthdayCloud.user = account;

    form.hidden = Boolean(account);
    signout.hidden = !account;

    toggle.textContent = account
      ? "☁ Quest Board Connected"
      : "☁ Quest Board Sign In";

    status.textContent = account
      ? "Signed in as " + account.email +
        ". Cloud synchronization is not enabled yet."
      : "Sign in with your Quest Board account.";
  }

  client.auth.getUser().then(({ data }) => {
    updateAccount(data?.user);
  });

  client.auth.onAuthStateChange((_event, session) => {
    updateAccount(session?.user);
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;

    status.textContent = "Signing in…";

    try {
      const { data, error } =
        await client.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      form.elements.password.value = "";
      updateAccount(data.user);
    } catch (error) {
      status.textContent =
        "Sign-in failed: " + error.message;
    }
  });

  signout.addEventListener("click", async () => {
    const { error } = await client.auth.signOut();

    if (error) {
      status.textContent = error.message;
    }
  });
})();
