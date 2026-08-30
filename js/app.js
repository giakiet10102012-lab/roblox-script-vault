/**
 * Điều khiển chính ứng dụng: Tab navigation, Generator UI, Cloud Tools, Settings & Toasts
 */
const App = {
  currentTab: "scripts",
  lastGenerated: { username: "", password: "", combo: "" },

  init() {
    this.setupTabs();
    this.setupGenerator();
    this.renderCloudTools();
    this.setupSettings();
    this.setupModals();
    this.updateStats();

    // Khởi tạo các module con
    ScriptManager.init();
    AccountManager.init();

    // Lắng nghe phím tắt
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const search = document.getElementById("script-search-input");
        if (search) search.focus();
      }
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-container").forEach(m => m.classList.add("hidden"));
        const contextMenu = document.getElementById("script-context-menu");
        if (contextMenu) contextMenu.remove();
      }
    });

    console.log("Roblox Script & Account Vault initialized successfully.");
  },

  setupTabs() {
    const tabButtons = document.querySelectorAll(".nav-tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.dataset.tab;
        this.switchTab(targetTab);
      });
    });
  },

  switchTab(tabId) {
    this.currentTab = tabId;
    const tabButtons = document.querySelectorAll(".nav-tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach(btn => {
      const isTarget = btn.dataset.tab === tabId;
      btn.classList.toggle("active-tab", isTarget);
      btn.classList.toggle("bg-cyan-500/20", isTarget);
      btn.classList.toggle("text-cyan-400", isTarget);
      btn.classList.toggle("border-cyan-500/50", isTarget);
      btn.classList.toggle("text-slate-400", !isTarget);
      btn.classList.toggle("border-transparent", !isTarget);
    });

    tabPanels.forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    });

    if (tabId === "scripts") ScriptManager.renderScripts();
    if (tabId === "accounts") AccountManager.renderAccounts();
    if (tabId === "cloud") this.renderCloudTools();
    this.updateStats();
  },

  setupGenerator() {
    const userLengthInput = document.getElementById("gen-user-length");
    const userLengthVal = document.getElementById("gen-user-length-val");
    const passLengthInput = document.getElementById("gen-pass-length");
    const passLengthVal = document.getElementById("gen-pass-length-val");

    if (userLengthInput && userLengthVal) {
      userLengthInput.addEventListener("input", () => {
        userLengthVal.textContent = userLengthInput.value;
      });
    }

    if (passLengthInput && passLengthVal) {
      passLengthInput.addEventListener("input", () => {
        passLengthVal.textContent = passLengthInput.value;
      });
    }

    // Nút Tạo Cặp
    const btnGenPair = document.getElementById("btn-generate-pair");
    if (btnGenPair) {
      btnGenPair.addEventListener("click", () => this.generateSinglePair());
    }

    // Nút Chỉ tạo User
    const btnGenUser = document.getElementById("btn-generate-user");
    if (btnGenUser) {
      btnGenUser.addEventListener("click", () => {
        const mode = document.getElementById("gen-user-mode")?.value || "random-alphanumeric";
        const len = parseInt(document.getElementById("gen-user-length")?.value || "8", 10);
        const username = RobloxGenerator.generateUsername({ mode, length: len });
        this.lastGenerated.username = username;
        this.lastGenerated.combo = `${username}:${this.lastGenerated.password || ""}`;
        document.getElementById("result-username").value = username;
      });
    }

    // Nút Chỉ tạo Pass (mặc định 8 ký tự)
    const btnGenPass = document.getElementById("btn-generate-pass");
    if (btnGenPass) {
      btnGenPass.addEventListener("click", () => {
        const len = parseInt(document.getElementById("gen-pass-length")?.value || "8", 10);
        const password = RobloxGenerator.generatePassword(len);
        this.lastGenerated.password = password;
        this.lastGenerated.combo = `${this.lastGenerated.username || ""}:${password}`;
        document.getElementById("result-password").value = password;
      });
    }

    // Nút Copy User
    const btnCopyUser = document.getElementById("btn-copy-gen-user");
    if (btnCopyUser) {
      btnCopyUser.addEventListener("click", () => {
        const val = document.getElementById("result-username")?.value;
        if (val) AccountManager.copyText(val, "Username");
        else App.showToast("Chưa có username nào được tạo!", "error");
      });
    }

    // Nút Copy Pass
    const btnCopyPass = document.getElementById("btn-copy-gen-pass");
    if (btnCopyPass) {
      btnCopyPass.addEventListener("click", () => {
        const val = document.getElementById("result-password")?.value;
        if (val) AccountManager.copyText(val, "Mật khẩu");
        else App.showToast("Chưa có mật khẩu nào được tạo!", "error");
      });
    }

    // Nút Copy Combo
    const btnCopyCombo = document.getElementById("btn-copy-gen-combo");
    if (btnCopyCombo) {
      btnCopyCombo.addEventListener("click", () => {
        const u = document.getElementById("result-username")?.value;
        const p = document.getElementById("result-password")?.value;
        if (u && p) AccountManager.copyText(`${u}:${p}`, "Combo user:pass");
        else App.showToast("Hãy tạo cả username và mật khẩu trước!", "error");
      });
    }

    // Nút Lưu vào Quản Lý Tài Khoản
    const btnSaveToVault = document.getElementById("btn-save-gen-to-vault");
    if (btnSaveToVault) {
      btnSaveToVault.addEventListener("click", () => {
        const u = document.getElementById("result-username")?.value;
        const p = document.getElementById("result-password")?.value;
        if (!u || !p) {
          App.showToast("Vui lòng tạo hoặc điền username và password trước!", "error");
          return;
        }
        AccountManager.openAddModal(u, p);
      });
    }

    // Nút Tạo Hàng Loạt (Batch)
    const btnGenBatch = document.getElementById("btn-generate-batch");
    if (btnGenBatch) {
      btnGenBatch.addEventListener("click", () => this.generateBatchPairs());
    }

    // Nút Copy tất cả batch
    const btnCopyAllBatch = document.getElementById("btn-copy-all-batch");
    if (btnCopyAllBatch) {
      btnCopyAllBatch.addEventListener("click", () => {
        const textarea = document.getElementById("batch-results-textarea");
        if (textarea && textarea.value.trim()) {
          AccountManager.copyText(textarea.value.trim(), "Danh sách tài khoản hàng loạt");
        } else {
          App.showToast("Chưa có danh sách tài khoản nào!", "error");
        }
      });
    }

    // Sinh 1 cặp ban đầu khi mở trang
    this.generateSinglePair();
  },

  generateSinglePair() {
    const mode = document.getElementById("gen-user-mode")?.value || "random-alphanumeric";
    const userLen = parseInt(document.getElementById("gen-user-length")?.value || "8", 10);
    const passLen = parseInt(document.getElementById("gen-pass-length")?.value || "8", 10);

    const combo = RobloxGenerator.generateCombo({ mode, length: userLen }, passLen);
    this.lastGenerated = combo;

    const uInput = document.getElementById("result-username");
    const pInput = document.getElementById("result-password");
    if (uInput) uInput.value = combo.username;
    if (pInput) pInput.value = combo.password;
  },

  generateBatchPairs() {
    const count = parseInt(document.getElementById("batch-count")?.value || "10", 10);
    const mode = document.getElementById("gen-user-mode")?.value || "random-alphanumeric";
    const userLen = parseInt(document.getElementById("gen-user-length")?.value || "8", 10);
    const passLen = parseInt(document.getElementById("gen-pass-length")?.value || "8", 10);

    const list = RobloxGenerator.generateBatch(count, { mode, length: userLen }, passLen);
    const textarea = document.getElementById("batch-results-textarea");
    if (textarea) {
      textarea.value = list.map(item => item.combo).join("\n");
      App.showToast(`Đã tạo thành công ${list.length} tài khoản Roblox!`, "success");
    }
  },

  renderCloudTools() {
    const container = document.getElementById("cloud-links-grid");
    if (!container) return;

    const links = StorageManager.getCloudLinks();
    container.innerHTML = links.map(item => `
      <div class="bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-lg shadow-black/20">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${item.type === "client" ? "bg-purple-500/15 text-purple-400 border-purple-500/30" : "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"} border">
              ${item.type === "client" ? "Client / Executor" : "Cloud Treo Game"}
            </span>
            <span class="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
              ${item.platform || "PC"}
            </span>
          </div>

          <h4 class="text-base font-semibold text-slate-100 mb-1">${ScriptManager.escapeHTML(item.title)}</h4>
          <p class="text-xs text-slate-400 mb-3">${ScriptManager.escapeHTML(item.description || "")}</p>
          <div class="text-[11px] text-emerald-400 font-medium mb-3">💰 Giá: ${item.pricing || "Free"}</div>
        </div>

        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <a 
            href="${item.url}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="w-full text-center px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5">
            <span>Truy Cập / Tải Về</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </div>
    `).join("");

    // Render Note Leviathan
    const notesContainer = document.getElementById("notes-container");
    if (notesContainer) {
      const notes = StorageManager.getNotes();
      notesContainer.innerHTML = notes.map(n => `
        <div class="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <h4 class="text-base font-semibold text-amber-400 mb-2.5 flex items-center gap-2">
            <span>🌊</span>
            <span>${ScriptManager.escapeHTML(n.title)}</span>
          </h4>
          <pre class="text-xs font-sans text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/80 border border-slate-800 p-4 rounded-xl select-text">${ScriptManager.escapeHTML(n.content)}</pre>
        </div>
      `).join("");
    }
  },

  setupSettings() {
    // Nút Xuất Backup JSON
    const btnExport = document.getElementById("btn-export-backup");
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        StorageManager.exportBackupJSON();
        App.showToast("Đã xuất file sao lưu JSON!", "success");
      });
    }

    // File input Nhập JSON
    const fileInput = document.getElementById("import-file-input");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const res = StorageManager.importBackupJSON(event.target.result);
          if (res.success) {
            App.showToast(`Khôi phục thành công ${res.count} script và ${res.accCount} tài khoản!`, "success");
            ScriptManager.renderCategoryPills();
            ScriptManager.renderScripts();
            AccountManager.renderAccounts();
            App.renderCloudTools();
            App.updateStats();
          } else {
            App.showToast("Lỗi nhập dữ liệu: " + res.error, "error");
          }
        };
        reader.readAsText(file);
      });
    }

    // Nút Khôi phục mặc định
    const btnReset = document.getElementById("btn-reset-default");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (confirm("Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu ban đầu từ Google Doc? Mọi thay đổi chưa sao lưu sẽ bị ghi đè.")) {
          StorageManager.resetToDefault();
          ScriptManager.renderCategoryPills();
          ScriptManager.renderScripts();
          AccountManager.renderAccounts();
          App.renderCloudTools();
          App.updateStats();
          App.showToast("Đã khôi phục dữ liệu gốc thành công!", "success");
        }
      });
    }
  },

  setupModals() {
    // Đóng tất cả modal khi bấm vào nút close hoặc backdrop
    document.querySelectorAll(".btn-close-modal").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".modal-container").forEach(m => m.classList.add("hidden"));
      });
    });

    document.querySelectorAll(".modal-container").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
        }
      });
    });
  },

  updateStats() {
    const scripts = StorageManager.getScripts();
    const accounts = StorageManager.getAccounts();
    const favorites = scripts.filter(s => s.isFavorite).length;

    const statScripts = document.getElementById("stat-total-scripts");
    const statAccounts = document.getElementById("stat-total-accounts");
    const statFavs = document.getElementById("stat-total-favs");

    if (statScripts) statScripts.textContent = scripts.length;
    if (statAccounts) statAccounts.textContent = accounts.length;
    if (statFavs) statFavs.textContent = favorites;
  },

  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    const bgColors = {
      success: "bg-slate-900 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20",
      error: "bg-slate-900 border-rose-500/50 text-rose-300 shadow-rose-500/20",
      info: "bg-slate-900 border-cyan-500/50 text-cyan-300 shadow-cyan-500/20"
    };

    const icons = {
      success: `<svg class="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
      error: `<svg class="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
      info: `<svg class="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    };

    toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-xs font-medium backdrop-blur-md transition-all duration-300 transform translate-y-4 opacity-0 ${bgColors[type] || bgColors.success}`;
    toast.innerHTML = `
      ${icons[type] || icons.success}
      <span class="leading-tight">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
    }, 10);

    // Remove after 3s
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Khởi chạy khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
