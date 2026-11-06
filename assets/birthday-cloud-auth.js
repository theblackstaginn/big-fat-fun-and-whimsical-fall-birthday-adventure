
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
      <button type="button" id="cloud-backup" hidden>☁ Back Up Quest Progress</button>
      <p id="cloud-backup-status" role="status"></p>
      <p id="cloud-status" role="status"></p>
    </section>
  `;

  // The adventure creates Settings later during DOMContentLoaded.
  // Wait for that panel, including when it is not yet attached to the page.
  function mountInSettings() {
    const settings = document.querySelector(".rpg-settings");
    if (!settings) return false;
    if (panel.parentElement !== settings) settings.append(panel);
    return true;
  }
  document.body.append(panel);
  if (!mountInSettings()) {
    const observer = new MutationObserver(() => {
      if (mountInSettings()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  const toggle = panel.querySelector("#cloud-toggle");
  const section = panel.querySelector("#cloud-panel");
  const form = panel.querySelector("#cloud-form");
  const status = panel.querySelector("#cloud-status");
  const signout = panel.querySelector("#cloud-signout");
  const backup = panel.querySelector("#cloud-backup");
  const backupStatus = panel.querySelector("#cloud-backup-status");
  const progressKey = "jess-birthday-quest-progress-v3";

  // Some adventure styles override the browser's default [hidden] display.
  // Control visibility explicitly so the sign-in form opens on iOS Safari.
  section.style.display = "none";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "cloud-panel");
  toggle.addEventListener("click", () => {
    const opening = section.style.display === "none";
    section.hidden = !opening;
    section.style.display = opening ? "block" : "none";
    toggle.setAttribute("aria-expanded", String(opening));
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
    backup.hidden = !account;

    toggle.textContent = account
      ? "☁ Quest Board Connected"
      : "☁ Quest Board Sign In";

    status.textContent = account
      ? "Signed in as " + account.email +
        ". Manual progress backup is available below."
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

  // Explicit, non-destructive backup: never download over local progress or overwrite an existing cloud record.
  backup.addEventListener("click", async () => {
    const user = window.birthdayCloud.user;
    if (!user || user.is_anonymous) return;
    backup.disabled = true;
    backupStatus.textContent = "Checking your cloud backup…";
    try {
      const raw = localStorage.getItem(progressKey);
      const chapters = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(chapters) || !chapters.every(id => typeof id === "string")) {
        throw new Error("Local quest progress is not in the expected format.");
      }
      const { data: existing, error: lookupError } = await client
        .from("birthday_adventure_progress")
        .select("user_id, completed_chapters")
        .eq("user_id", user.id)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) {
        backupStatus.textContent = "A cloud backup already exists. Nothing was overwritten.";
        return;
      }
      const { error } = await client.from("birthday_adventure_progress").insert({
        user_id: user.id,
        completed_chapters: chapters,
        current_chapter: null
      });
      if (error) throw error;
      backupStatus.textContent = "Quest progress backed up safely. Your local save is unchanged.";
    } catch (error) {
      backupStatus.textContent = "Backup failed: " + error.message;
    } finally {
      backup.disabled = false;
    }
  });

  // Automatic backup only after a quest is completed, never during login or reset.
  // Cloud writes are serialized and do not replace local progress.
  let backupQueue = Promise.resolve();
  window.addEventListener("birthday:progress-saved", event => {
    const user = window.birthdayCloud.user;
    if (!user || user.is_anonymous) return;
    const chapterIds = event.detail?.completed;
    if (!Array.isArray(chapterIds) || chapterIds.length === 0) return;
    backupQueue = backupQueue.catch(() => {}).then(async () => {
      const active = window.birthdayCloud.user;
      if (!active || active.id !== user.id) return;
      const { data: existing, error: readError } = await client
        .from("birthday_adventure_progress")
        .select("completed_chapters")
        .eq("user_id", user.id)
        .maybeSingle();
      if (readError) throw readError;
      const cloudIds = Array.isArray(existing?.completed_chapters)
        ? existing.completed_chapters : [];
      // Never regress an existing cloud save or import progress from a different path.
      if (cloudIds.length > chapterIds.length ||
          cloudIds.some((id, index) => chapterIds[index] !== id)) {
        backupStatus.textContent = "Cloud save differs from local progress. No changes made.";
        return;
      }
      const { error } = await client.from("birthday_adventure_progress").upsert({
        user_id: user.id,
        completed_chapters: chapterIds,
        current_chapter: null,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      if (error) throw error;
      backupStatus.textContent = "☁ Quest progress synced to your account.";
    }).catch(error => {
      backupStatus.textContent = "Automatic backup failed: " + error.message;
    });
  });

  signout.addEventListener("click", async () => {
    const { error } = await client.auth.signOut();

    if (error) {
      status.textContent = error.message;
    }
  });
})();
