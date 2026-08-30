/**
 * Quản lý LocalStorage & Sao lưu/Khôi phục dữ liệu
 */
const STORAGE_KEY = "roblox_script_vault_v1";

const StorageManager = {
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
    // Nếu chưa có, nạp mặc định và lưu vào LocalStorage
    this.saveData(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  },

  // Lưu toàn bộ dữ liệu
  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Lỗi lưu dữ liệu vào LocalStorage:", e);
      return false;
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
      // Cập nhật script cũ
      const idx = data.scripts.findIndex(s => s.id === scriptData.id);
      if (idx !== -1) {
        data.scripts[idx] = { ...data.scripts[idx], ...scriptData, updatedAt: new Date().toISOString() };
      } else {
        data.scripts.unshift({ ...scriptData, createdAt: new Date().toISOString() });
      }
    } else {
      // Thêm script mới
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

  // --- CLOUD LINKS & NOTES ---
  getCloudLinks() {
    return this.getData().cloudLinks || [];
  },

  saveCloudLink(linkData) {
    const data = this.getData();
    if (!data.cloudLinks) data.cloudLinks = [];
    if (linkData.id) {
      const idx = data.cloudLinks.findIndex(l => l.id === linkData.id);
      if (idx !== -1) data.cloudLinks[idx] = { ...data.cloudLinks[idx], ...linkData };
      else data.cloudLinks.unshift(linkData);
    } else {
      linkData.id = "cloud_" + Date.now();
      data.cloudLinks.unshift(linkData);
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

  getNotes() {
    return this.getData().notes || [];
  },

  saveNotes(notes) {
    const data = this.getData();
    data.notes = notes;
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
