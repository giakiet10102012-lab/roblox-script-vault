/**
 * Điều khiển chính ứng dụng: Tab navigation, Generator UI, Cloud Tools CRUD, Settings, GitHub Sync & Toasts
 */
const App = {
  currentTab: "scripts",
  lastGenerated: { username: "", password: "", combo: "" },

  async init() {
    this.setupTabs();
    this.setupGenerator();
    this.setupCloudEvents();
    this.renderCloudTools();
    this.setupSettings();
    this.setupModals();
    this.updateStats();

    // Khởi tạo các module con
    ScriptManager.init();
    AccountManager.init();

    // Tải dữ liệu đám mây mới nhất từ GitHub Repository
    const syncRes = await StorageManager.fetchFromGitHub();
    if (syncRes.success) {
      console.log("Đã nạp dữ liệu mới nhất từ GitHub Cloud.");
      ScriptManager.renderCategoryPills();
      ScriptManager.renderScripts();
      AccountManager.renderAccounts();
      this.renderCloudTools();
      this.updateStats();
    }

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

    console.log("Roblox Script & Account Vault initialized with full Cloud CRUD.");
  },

  setupTabs() {
    const tabButtons = document.querySelectorAll(".nav-tab-btn");
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

    const btnGenPair = document.getElementById("btn-generate-pair");
    if (btnGenPair) btnGenPair.addEventListener("click", () => this.generateSinglePair());

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

    const btnCopyUser = document.getElementById("btn-copy-gen-user");
    if (btnCopyUser) {
      btnCopyUser.addEventListener("click", () => {
        const val = document.getElementById("result-username")?.value;
        if (val) AccountManager.copyText(val, "Username");
        else App.showToast("Chưa có username nào được tạo!", "error");
      });
    }

    const btnCopyPass = document.getElementById("btn-copy-gen-pass");
    if (btnCopyPass) {
      btnCopyPass.addEventListener("click", () => {
        const val = document.getElementById("result-password")?.value;
        if (val) AccountManager.copyText(val, "Mật khẩu");
        else App.showToast("Chưa có mật khẩu nào được tạo!", "error");
      });
    }

    const btnCopyCombo = document.getElementById("btn-copy-gen-combo");
    if (btnCopyCombo) {
      btnCopyCombo.addEventListener("click", () => {
        const u = document.getElementById("result-username")?.value;
        const p = document.getElementById("result-password")?.value;
        if (u && p) AccountManager.copyText(`${u}:${p}`, "Combo user:pass");
        else App.showToast("Hãy tạo cả username và mật khẩu trước!", "error");
      });
    }

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

    const btnGenBatch = document.getElementById("btn-generate-batch");
    if (btnGenBatch) btnGenBatch.addEventListener("click", () => this.generateBatchPairs());

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

  // --- CLOUD & TIỆN ÍCH CRUD ---
  setupCloudEvents() {
    // Nút mở modal thêm link cloud
    const btnAddCloud = document.getElementById("btn-add-cloud");
    if (btnAddCloud) {
      btnAddCloud.addEventListener("click", () => this.openAddCloudModal());
    }

    // Form submit cloud modal
    const formCloud = document.getElementById("form-cloud-modal");
    if (formCloud) {
      formCloud.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSaveCloudLink();
      });
    }

    // Nút mở modal thêm ghi chú
    const btnAddNote = document.getElementById("btn-add-note");
    if (btnAddNote) {
      btnAddNote.addEventListener("click", () => this.openAddNoteModal());
    }

    // Form submit note modal
    const formNote = document.getElementById("form-note-modal");
    if (formNote) {
      formNote.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSaveNote();
      });
    }
  },

  renderCloudTools() {
    const container = document.getElementById("cloud-links-grid");
    if (!container) return;

    const links = StorageManager.getCloudLinks();
    if (links.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <p class="text-sm font-medium text-slate-300">Chưa có dịch vụ cloud nào</p>
          <p class="text-xs text-slate-500 mt-1">Bấm "+ Thêm Tiện Ích / Cloud" để lưu thêm.</p>
        </div>
      `;
    } else {
      container.innerHTML = links.map(item => `
        <div class="glass-card rounded-2xl p-5 flex flex-col justify-between group relative" data-id="${item.id}">
          <div>
            <!-- Header: Type Badge & Edit/Delete -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-1.5">
                <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold ${item.type === "client" ? "glow-badge-purple" : (item.type === "tool" ? "glow-badge-emerald" : "glow-badge-cyan")}">
                  ${item.type === "client" ? "Executor / Client" : (item.type === "tool" ? "Công cụ Lập Trình" : "Cloud Treo Game")}
                </span>
                <span class="px-2 py-0.5 rounded-md text-[10px] bg-slate-900/80 text-slate-400 border border-slate-800 font-mono">
                  ${item.platform || "PC"}
                </span>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center gap-1">
                <button 
                  onclick="App.openEditCloudModal('${item.id}')" 
                  class="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-all" 
                  title="Chỉnh sửa">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button 
                  onclick="App.confirmDeleteCloud('${item.id}')" 
                  class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 transition-all" 
                  title="Xóa link">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>

            <h4 class="text-base font-bold text-slate-100 mb-1 font-heading group-hover:text-cyan-300 transition-colors">${ScriptManager.escapeHTML(item.title)}</h4>
            <p class="text-xs text-slate-400 mb-3 leading-relaxed">${ScriptManager.escapeHTML(item.description || "")}</p>
            <div class="text-[11px] text-emerald-400 font-semibold mb-3">💰 Giá: ${item.pricing || "Free"}</div>
          </div>

          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <a 
              href="${item.url}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold btn-cyber-primary flex items-center justify-center gap-1.5 active:scale-95">
              <span>Truy Cập / Tải Về</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </div>
        </div>
      `).join("");
    }

    // Render Notes
    const notesContainer = document.getElementById("notes-container");
    if (notesContainer) {
      const notes = StorageManager.getNotes();
      if (notes.length === 0) {
        notesContainer.innerHTML = `
          <div class="py-8 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 text-xs">
            Chưa có ghi chú nào. Bấm "+ Thêm Ghi Chú" để tạo ghi chú mới.
          </div>
        `;
      } else {
        notesContainer.innerHTML = notes.map(n => `
          <div class="glass-card rounded-2xl p-5 shadow-lg">
            <div class="flex items-center justify-between gap-2 mb-3">
              <h4 class="text-base font-bold text-amber-400 flex items-center gap-2 font-heading">
                <span>📝</span>
                <span>${ScriptManager.escapeHTML(n.title)}</span>
              </h4>
              <div class="flex items-center gap-1">
                <button 
                  onclick="App.openEditNoteModal('${n.id}')" 
                  class="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-all" 
                  title="Chỉnh sửa ghi chú">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button 
                  onclick="App.confirmDeleteNote('${n.id}')" 
                  class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 transition-all" 
                  title="Xóa ghi chú">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
            <pre class="text-xs font-sans text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/90 border border-slate-800/80 p-4 rounded-xl select-text">${ScriptManager.escapeHTML(n.content)}</pre>
          </div>
        `).join("");
      }
    }
  },

  openAddCloudModal() {
    const modal = document.getElementById("modal-cloud");
    const title = document.getElementById("modal-cloud-title");
    const form = document.getElementById("form-cloud-modal");
    if (!modal || !form) return;

    title.textContent = "Thêm Tiện Ích / Cloud Mới";
    form.reset();
    document.getElementById("cloud-id-input").value = "";
    modal.classList.remove("hidden");
  },

  openEditCloudModal(id) {
    const links = StorageManager.getCloudLinks();
    const item = links.find(l => l.id === id);
    if (!item) return;

    const modal = document.getElementById("modal-cloud");
    const title = document.getElementById("modal-cloud-title");
    if (!modal) return;

    title.textContent = "Chỉnh Sửa Tiện Ích / Cloud";
    document.getElementById("cloud-id-input").value = item.id;
    document.getElementById("cloud-title-input").value = item.title || "";
    document.getElementById("cloud-type-input").value = item.type || "cloud";
    document.getElementById("cloud-platform-input").value = item.platform || "PC";
    document.getElementById("cloud-pricing-input").value = item.pricing || "Free";
    document.getElementById("cloud-url-input").value = item.url || "";
    document.getElementById("cloud-desc-input").value = item.description || "";

    modal.classList.remove("hidden");
  },

  handleSaveCloudLink() {
    const id = document.getElementById("cloud-id-input").value;
    const title = document.getElementById("cloud-title-input").value.trim();
    const type = document.getElementById("cloud-type-input").value;
    const platform = document.getElementById("cloud-platform-input").value.trim();
    const pricing = document.getElementById("cloud-pricing-input").value.trim();
    const url = document.getElementById("cloud-url-input").value.trim();
    const description = document.getElementById("cloud-desc-input").value.trim();

    if (!title || !url) {
      App.showToast("Vui lòng nhập Tên và Đường link URL!", "error");
      return;
    }

    const linkData = {
      id: id || undefined,
      title,
      type: type || "cloud",
      platform: platform || "PC",
      pricing: pricing || "Free",
      url,
      description
    };

    StorageManager.saveCloudLink(linkData);
    document.getElementById("modal-cloud").classList.add("hidden");
    this.renderCloudTools();
    App.showToast(id ? "Đã cập nhật tiện ích!" : "Đã thêm tiện ích mới thành công!", "success");
  },

  confirmDeleteCloud(id) {
    const links = StorageManager.getCloudLinks();
    const item = links.find(l => l.id === id);
    if (!item) return;

    if (confirm(`Bạn có chắc chắn muốn xóa tiện ích "${item.title}"?`)) {
      StorageManager.deleteCloudLink(id);
      this.renderCloudTools();
      App.showToast("Đã xóa tiện ích.", "info");
    }
  },

  openAddNoteModal() {
    const modal = document.getElementById("modal-note");
    const title = document.getElementById("modal-note-title");
    const form = document.getElementById("form-note-modal");
    if (!modal || !form) return;

    title.textContent = "Thêm Ghi Chú Mới";
    form.reset();
    document.getElementById("note-id-input").value = "";
    modal.classList.remove("hidden");
  },

  openEditNoteModal(id) {
    const notes = StorageManager.getNotes();
    const item = notes.find(n => n.id === id);
    if (!item) return;

    const modal = document.getElementById("modal-note");
    const title = document.getElementById("modal-note-title");
    if (!modal) return;

    title.textContent = "Chỉnh Sửa Ghi Chú";
    document.getElementById("note-id-input").value = item.id;
    document.getElementById("note-title-input").value = item.title || "";
    document.getElementById("note-content-input").value = item.content || "";

    modal.classList.remove("hidden");
  },

  handleSaveNote() {
    const id = document.getElementById("note-id-input").value;
    const title = document.getElementById("note-title-input").value.trim();
    const content = document.getElementById("note-content-input").value.trim();

    if (!title || !content) {
      App.showToast("Vui lòng nhập Tiêu đề và Nội dung ghi chú!", "error");
      return;
    }

    const noteData = {
      id: id || undefined,
      title,
      content
    };

    StorageManager.saveNote(noteData);
    document.getElementById("modal-note").classList.add("hidden");
    this.renderCloudTools();
    App.showToast(id ? "Đã cập nhật ghi chú!" : "Đã thêm ghi chú mới!", "success");
  },

  confirmDeleteNote(id) {
    const notes = StorageManager.getNotes();
    const item = notes.find(n => n.id === id);
    if (!item) return;

    if (confirm(`Bạn có chắc chắn muốn xóa ghi chú "${item.title}"?`)) {
      StorageManager.deleteNote(id);
      this.renderCloudTools();
      App.showToast("Đã xóa ghi chú.", "info");
    }
  },

  setupSettings() {
    const tokenInput = document.getElementById("gh-token-input");
    const btnSaveToken = document.getElementById("btn-save-token");
    const btnSyncNow = document.getElementById("btn-sync-cloud-now");

    if (tokenInput) {
      tokenInput.value = StorageManager.getGitHubToken();
    }

    if (btnSaveToken) {
      btnSaveToken.addEventListener("click", async () => {
        const token = tokenInput ? tokenInput.value.trim() : "";
        StorageManager.setGitHubToken(token);
        if (token) {
          App.showToast("Đang kiểm tra và đồng bộ với GitHub Cloud...", "info");
          const res = await StorageManager.syncToGitHub();
          if (res.success) {
            App.showToast("Đã kích hoạt đồng bộ GitHub Cloud thành công!", "success");
          } else {
            App.showToast("Lỗi đồng bộ: " + res.error, "error");
          }
        } else {
          StorageManager.updateSyncUI();
          App.showToast("Đã xóa Token GitHub.", "info");
        }
      });
    }

    if (btnSyncNow) {
      btnSyncNow.addEventListener("click", async () => {
        App.showToast("Đang đồng bộ dữ liệu lên GitHub Cloud...", "info");
        const res = await StorageManager.syncToGitHub();
        if (res.success) {
          App.showToast("Đã đồng bộ toàn bộ Script, Acc & Cloud lên GitHub thành công!", "success");
        } else {
          App.showToast("Không thể đồng bộ: " + res.error, "error");
        }
      });
    }

    const btnExport = document.getElementById("btn-export-backup");
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        StorageManager.exportBackupJSON();
        App.showToast("Đã xuất file sao lưu JSON!", "success");
      });
    }

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

    setTimeout(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
    }, 10);

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
