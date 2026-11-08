
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
      <div id="cloud-notes" hidden>
        <h3>Private Adventure Notes</h3>
        <label for="cloud-note-stop">Location</label>
        <select id="cloud-note-stop"></select>
        <label for="cloud-note-text">Your memory</label>
        <textarea id="cloud-note-text" rows="4" maxlength="10000" placeholder="Write a memory from this stop…"></textarea>
        <button type="button" id="cloud-note-save">✧ Save Private Note</button>
        <p id="cloud-note-status" role="status"></p>
      </div>
      <p id="cloud-status" role="status"></p>
    </section>
  `;

  // Keep cloud note controls readable inside the ornate mobile Settings sheet.
  const cloudStyle = document.createElement("style");
  cloudStyle.textContent = `
    #birthday-cloud-auth, #birthday-cloud-auth * { box-sizing: border-box; }
    #birthday-cloud-auth { width: 100%; min-width: 0; }
    #birthday-cloud-auth #cloud-panel { width: 100%; min-width: 0; }
    #birthday-cloud-auth #cloud-notes { width: 100%; min-width: 0; margin-top: 16px; }
    #birthday-cloud-auth #cloud-notes h3 { margin: 0 0 14px; line-height: 1.3; }
    #birthday-cloud-auth #cloud-notes label {
      display: block !important; position: static !important;
      width: 100% !important; float: none !important;
      margin: 14px 0 6px !important; padding: 0 !important;
      line-height: 1.4 !important; text-align: left !important;
      font-size: 0.95rem !important; font-weight: 700 !important;
      color: #382331 !important;
    }
    #birthday-cloud-auth #cloud-notes select,
    #birthday-cloud-auth #cloud-notes textarea {
      display: block !important; position: static !important;
      width: 100% !important; max-width: 100% !important;
      min-width: 0 !important; float: none !important;
      margin: 0 0 12px !important; padding: 12px !important;
      border: 1px solid #916a54 !important; border-radius: 9px !important;
      background: #f5e8ce !important; color: #33252a !important;
      font: 16px/1.45 system-ui, sans-serif !important;
      box-shadow: inset 0 1px 4px #51352226 !important;
    }
    #birthday-cloud-auth #cloud-notes textarea {
      min-height: 112px !important; resize: vertical !important;
    }
    #birthday-cloud-auth #cloud-notes #cloud-note-save { width: 100%; margin-top: 4px; }
    #birthday-cloud-auth #cloud-notes #cloud-note-status { overflow-wrap: anywhere; }
  `;
  document.head.append(cloudStyle);

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
  const notesPanel = panel.querySelector("#cloud-notes");
  const noteStop = panel.querySelector("#cloud-note-stop");
  const noteText = panel.querySelector("#cloud-note-text");
  const noteSave = panel.querySelector("#cloud-note-save");
  const noteStatus = panel.querySelector("#cloud-note-status");

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
    notesPanel.hidden = !account;
    notesPanel.style.display = account ? "block" : "none";

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

  // Keep native form controls legible within the illustrated Settings panel.
  const noteStyles = document.createElement("style");
  noteStyles.textContent = `
    #cloud-notes { margin-top: 18px; padding: 12px 8px; box-sizing: border-box; min-width: 0; }
    #cloud-notes h3 { margin: 0 0 14px; line-height: 1.25; }
    #cloud-notes label { display: block !important; width: 100%; margin: 12px 0 6px !important; font: 600 0.95rem/1.4 Georgia,serif; }
    #cloud-notes select, #cloud-notes textarea { display: block !important; width: 100% !important; max-width: 100%; min-width: 0; box-sizing: border-box; margin: 0 0 12px !important; padding: 12px !important; border-radius: 9px; border: 1px solid #a7794f; font: 1rem/1.5 system-ui,sans-serif; background: #fff5e2; color: #34232a; }
    #cloud-notes textarea { min-height: 118px; resize: vertical; }
    #cloud-notes button { width: 100%; }
    #cloud-notes #cloud-note-status { overflow-wrap: anywhere; }
  `;
  document.head.append(noteStyles);

  // Private notes are keyed by authenticated account and stop. No local save is modified.
  function availableStops() {
    return typeof chapters !== "undefined" && Array.isArray(chapters) ? chapters : [];
  }
  const stops = availableStops();
  for (const chapter of stops) {
    const option = document.createElement("option");
    option.value = chapter.id;
    option.textContent = chapter.title;
    noteStop.append(option);
  }
  async function loadPrivateNote() {
    const user = window.birthdayCloud.user;
    if (!user || !noteStop.value) return;
    noteStatus.textContent = "Loading private note…";
    noteText.disabled = true;
    try {
      const { data, error } = await client.from("birthday_adventure_keepsakes")
        .select("note").eq("user_id", user.id).eq("stop_id", noteStop.value).maybeSingle();
      if (error) throw error;
      noteText.value = data?.note || "";
      noteStatus.textContent = data ? "Private note loaded." : "No note saved for this stop yet.";
    } catch (error) {
      noteStatus.textContent = "Could not load note: " + error.message;
    } finally { noteText.disabled = false; }
  }
  noteStop.addEventListener("change", loadPrivateNote);
  noteSave.addEventListener("click", async () => {
    const user = window.birthdayCloud.user;
    if (!user || !noteStop.value || noteText.disabled) return;
    noteSave.disabled = true;
    noteStatus.textContent = "Saving private note…";
    try {
      const { error } = await client.from("birthday_adventure_keepsakes").upsert({
        user_id: user.id, stop_id: noteStop.value, note: noteText.value,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,stop_id" });
      if (error) throw error;
      noteStatus.textContent = "Private note saved to your account.";
    } catch (error) {
      noteStatus.textContent = "Note save failed: " + error.message;
    } finally { noteSave.disabled = false; }
  });
  client.auth.onAuthStateChange((_event, session) => {
    if (session?.user && !session.user.is_anonymous) {
      setTimeout(loadPrivateNote, 0);
    } else {
      noteText.value = "";
    }
  });
  client.auth.getUser().then(({data}) => { if (data?.user && !data.user.is_anonymous) loadPrivateNote(); });

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

  // Small non-blocking confirmation above the adventure controls.
  const saveToast = document.createElement("div");
  saveToast.id = "birthday-cloud-save-toast";
  saveToast.setAttribute("role", "status");
  saveToast.setAttribute("aria-live", "polite");
  saveToast.textContent = "☁ Quest saved";
  Object.assign(saveToast.style, {
    position: "fixed", bottom: "calc(6.5rem + env(safe-area-inset-bottom, 0px))",
    left: "50%", transform: "translateX(-50%) translateY(8px)",
    zIndex: "2147483640", padding: "0.6rem 1.15rem",
    background: "linear-gradient(145deg, #4b263f, #2c172c)",
    color: "#f6e6c1", border: "1px solid #c69a58",
    borderRadius: "999px", boxShadow: "0 4px 18px #0009",
    fontFamily: "Georgia, serif", fontSize: "0.95rem",
    pointerEvents: "none", opacity: "0", transition: "opacity 220ms, transform 220ms",
    whiteSpace: "nowrap"
  });
  document.body.append(saveToast);
  let saveToastTimer;
  function showSaveToast(message) {
    clearTimeout(saveToastTimer);
    saveToast.textContent = message;
    saveToast.style.opacity = "1";
    saveToast.style.transform = "translateX(-50%) translateY(0)";
    saveToastTimer = setTimeout(() => {
      saveToast.style.opacity = "0";
      saveToast.style.transform = "translateX(-50%) translateY(8px)";
    }, 2600);
  }

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
      // The retired "town" chapter represented BOTH Glassblowing and ZuZu's.
      // Compare legacy backups against the nine-stop route without silently
      // overwriting or shortening someone's cloud save.
      const compatibleCloudIds = cloudIds.flatMap(id =>
        id === "town" ? ["glass", "zuzu"] : [id]
      );
      if (compatibleCloudIds.length > chapterIds.length ||
          compatibleCloudIds.some((id, index) => chapterIds[index] !== id)) {
        backupStatus.textContent = "Cloud save differs from local progress. No changes made.";
        showSaveToast("☁ Cloud save needs review");
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
      showSaveToast("☁ Quest saved");
    }).catch(error => {
      backupStatus.textContent = "Automatic backup failed: " + error.message;
      showSaveToast("☁ Backup failed");
    });
  });

  signout.addEventListener("click", async () => {
    const { error } = await client.auth.signOut();

    if (error) {
      status.textContent = error.message;
    }
  });
})();
