/**
 * Quản lý LocalStorage & Đồng bộ hóa đám mây GitHub (Cloud Sync)
 */
const STORAGE_KEY = "roblox_script_vault_v1";
const GITHUB_TOKEN_KEY = "roblox_vault_gh_token";
const GITHUB_REPO_OWNER = "giakiet10102012-lab";
const GITHUB_REPO_NAME = "roblox-script-vault";

const StorageManager = {
  syncStatus: "idle", // 'idle' | 'syncing' | 'synced' | 'error'

  // Lấy toàn bộ dữ liệu Vault
  getData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Lỗi đọc dữ liệu từ LocalStorage:", e);
    }
    this.saveData(DEFAULT_DATA, false);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  },

  // Lưu toàn bộ dữ liệu (tự động kích hoạt đồng bộ GitHub nếu có token)
  saveData(data, autoSync = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (autoSync && this.getGitHubToken()) {
        this.syncToGitHub(data);
      }
      return true;
    } catch (e) {
      console.error("Lỗi lưu dữ liệu vào LocalStorage:", e);
      return false;
    }
  },

  getGitHubToken() {
    return localStorage.getItem(GITHUB_TOKEN_KEY) || "";
  },

  setGitHubToken(token) {
    if (token) {
      localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
    } else {
      localStorage.removeItem(GITHUB_TOKEN_KEY);
    }
  },

  async fetchFromGitHub() {
    try {
      this.syncStatus = "syncing";
      this.updateSyncUI();
      
      const url = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/main/data.json?_t=${Date.now()}`;
      const response = await fetch(url, { cache: "no-store" });
      
      if (response.ok) {
        const remoteData = await response.json();
        if (remoteData && remoteData.scripts) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
          this.syncStatus = "synced";
          this.updateSyncUI();
          return { success: true, data: remoteData };
        }
      }
    } catch (e) {
      console.warn("Chưa thể tải dữ liệu từ GitHub:", e);
    }
    this.syncStatus = this.getGitHubToken() ? "synced" : "local-only";
    this.updateSyncUI();
    return { success: false };
  },

  async syncToGitHub(customData = null) {
    const token = this.getGitHubToken();
    if (!token) return { success: false, error: "Chưa cấu hình Token GitHub" };

    try {
      this.syncStatus = "syncing";
      this.updateSyncUI();

      const dataToSave = customData || this.getData();
      const contentJson = JSON.stringify(dataToSave, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(contentJson)));

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      };

      const getUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/data.json`;
      let sha = null;
      try {
        const getRes = await fetch(getUrl, { headers, cache: "no-store" });
        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        }
      } catch (err) {}

      const putBody = {
        message: "Cập nhật dữ liệu Roblox Vault (Auto-Sync)",
        content: base64Content,
        branch: "main"
      };
      if (sha) putBody.sha = sha;

      const putRes = await fetch(getUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify(putBody)
      });

      if (putRes.ok) {
        this.syncStatus = "synced";
        this.updateSyncUI();
        return { success: true };
      } else {
        const errJson = await putRes.json();
        throw new Error(errJson.message || "Lỗi tải lên GitHub");
      }
    } catch (e) {
      console.error("Lỗi đồng bộ lên GitHub:", e);
      this.syncStatus = "error";
      this.updateSyncUI();
      return { success: false, error: e.message };
    }
  },

  updateSyncUI() {
    const badge = document.getElementById("cloud-sync-badge");
    const statusText = document.getElementById("sync-status-text");
    if (!badge) return;

    if (this.syncStatus === "syncing") {
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span><span class="text-amber-400">Đang đồng bộ Cloud...</span>`;
      if (statusText) statusText.textContent = "Đang gửi dữ liệu lên GitHub Cloud...";
    } else if (this.syncStatus === "synced") {
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span class="text-emerald-400">Cloud Sync: Đã kết nối</span>`;
      if (statusText) statusText.textContent = "Dữ liệu đã được lưu trữ an toàn trên GitHub Cloud!";
    } else if (this.syncStatus === "error") {
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-400"></span><span class="text-rose-400">Cloud Sync: Lỗi</span>`;
      if (statusText) statusText.textContent = "Không thể đồng bộ. Hãy kiểm tra lại Token trong Cài đặt.";
    } else {
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-slate-500"></span><span class="text-slate-400">Cloud Sync: Chưa bật</span>`;
      if (statusText) statusText.textContent = "Chưa kết nối Token. Dữ liệu đang chỉ lưu cục bộ.";
    }
  },

  // --- SCRIPT OPERATIONS ---
  getScripts() {
    return this.getData().scripts || [];
  },

  getScriptById(id) {
    const scripts = this.getScripts();
    return scripts.find(s => s.id === id);
  },

  saveScript(scriptData) {
    const data = this.getData();
    if (!data.scripts) data.scripts = [];

    if (scriptData.id) {
      const idx = data.scripts.findIndex(s => s.id === scriptData.id);
      if (idx !== -1) {
        data.scripts[idx] = { ...data.scripts[idx], ...scriptData, updatedAt: new Date().toISOString() };
      } else {
        data.scripts.unshift({ ...scriptData, createdAt: new Date().toISOString() });
      }
    } else {
      const newScript = {
        ...scriptData,
        id: "script_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        createdAt: new Date().toISOString(),
        isFavorite: scriptData.isFavorite || false
      };
      data.scripts.unshift(newScript);
    }
    this.saveData(data);
    return true;
  },

  deleteScript(id) {
    const data = this.getData();
    data.scripts = (data.scripts || []).filter(s => s.id !== id);
    this.saveData(data);
    return true;
  },

  toggleFavorite(id) {
    const data = this.getData();
    const script = (data.scripts || []).find(s => s.id === id);
    if (script) {
      script.isFavorite = !script.isFavorite;
      this.saveData(data);
      return script.isFavorite;
    }
    return false;
  },

  // --- ACCOUNT OPERATIONS ---
  getAccounts() {
    return this.getData().accounts || [];
  },

  saveAccount(accData) {
    const data = this.getData();
    if (!data.accounts) data.accounts = [];

    if (accData.id) {
      const idx = data.accounts.findIndex(a => a.id === accData.id);
      if (idx !== -1) {
        data.accounts[idx] = { ...data.accounts[idx], ...accData, updatedAt: new Date().toISOString() };
      } else {
        data.accounts.unshift({ ...accData, createdAt: new Date().toISOString() });
      }
    } else {
      const newAcc = {
        ...accData,
        id: "acc_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        createdAt: new Date().toISOString()
      };
      data.accounts.unshift(newAcc);
    }
    this.saveData(data);
    return true;
  },

  deleteAccount(id) {
    const data = this.getData();
    data.accounts = (data.accounts || []).filter(a => a.id !== id);
    this.saveData(data);
    return true;
  },

  // --- CLOUD LINKS OPERATIONS ---
  getCloudLinks() {
    return this.getData().cloudLinks || [];
  },

  saveCloudLink(linkData) {
    const data = this.getData();
    if (!data.cloudLinks) data.cloudLinks = [];

    if (linkData.id) {
      const idx = data.cloudLinks.findIndex(l => l.id === linkData.id);
      if (idx !== -1) {
        data.cloudLinks[idx] = { ...data.cloudLinks[idx], ...linkData };
      } else {
        data.cloudLinks.unshift(linkData);
      }
    } else {
      const newLink = {
        ...linkData,
        id: "cloud_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6)
      };
      data.cloudLinks.unshift(newLink);
    }
    this.saveData(data);
    return true;
  },

  deleteCloudLink(id) {
    const data = this.getData();
    data.cloudLinks = (data.cloudLinks || []).filter(l => l.id !== id);
    this.saveData(data);
    return true;
  },

  // --- NOTES OPERATIONS ---
  getNotes() {
    return this.getData().notes || [];
  },

  saveNote(noteData) {
    const data = this.getData();
    if (!data.notes) data.notes = [];

    if (noteData.id) {
      const idx = data.notes.findIndex(n => n.id === noteData.id);
      if (idx !== -1) {
        data.notes[idx] = { ...data.notes[idx], ...noteData };
      } else {
        data.notes.unshift(noteData);
      }
    } else {
      const newNote = {
        ...noteData,
        id: "note_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6)
      };
      data.notes.unshift(newNote);
    }
    this.saveData(data);
    return true;
  },

  deleteNote(id) {
    const data = this.getData();
    data.notes = (data.notes || []).filter(n => n.id !== id);
    this.saveData(data);
    return true;
  },

  // --- EXPORT & IMPORT ---
  exportBackupJSON() {
    const data = this.getData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `roblox-vault-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importBackupJSON(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.scripts || !Array.isArray(data.scripts)) {
        throw new Error("File sao lưu không đúng định dạng Vault!");
      }
      this.saveData(data);
      return { success: true, count: data.scripts.length, accCount: (data.accounts || []).length };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  exportAccountsComboText() {
    const accounts = this.getAccounts();
    if (accounts.length === 0) {
      return false;
    }
    const lines = accounts.map(a => `${a.username}:${a.password}`);
    const textContent = lines.join("\n");
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `roblox-accounts-combo-${dateStr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  },

  resetToDefault() {
    this.saveData(DEFAULT_DATA);
    return true;
  }
};
