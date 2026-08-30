/**
 * Quản lý danh sách tài khoản Roblox (Account Vault)
 */
const AccountManager = {
  searchQuery: "",
  selectedGame: "all",

  init() {
    this.renderAccounts();
    this.bindEvents();
  },

  bindEvents() {
    // Tìm kiếm tài khoản
    const searchInput = document.getElementById("acc-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderAccounts();
      });
    }

    // Lọc theo game
    const gameSelect = document.getElementById("acc-filter-game");
    if (gameSelect) {
      gameSelect.addEventListener("change", (e) => {
        this.selectedGame = e.target.value;
        this.renderAccounts();
      });
    }

    // Nút mở modal thêm account
    const addAccBtn = document.getElementById("btn-add-account");
    if (addAccBtn) {
      addAccBtn.addEventListener("click", () => this.openAddModal());
    }

    // Form submit
    const accForm = document.getElementById("form-acc-modal");
    if (accForm) {
      accForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSaveAccount();
      });
    }

    // Nút xuất file combo text
    const exportComboBtn = document.getElementById("btn-export-combo");
    if (exportComboBtn) {
      exportComboBtn.addEventListener("click", () => {
        const success = StorageManager.exportAccountsComboText();
        if (success) {
          App.showToast("Đã tải về danh sách user:pass!", "success");
        } else {
          App.showToast("Không có tài khoản nào để xuất!", "error");
        }
      });
    }
  },

  getFilteredAccounts() {
    let list = StorageManager.getAccounts();

    if (this.selectedGame !== "all") {
      list = list.filter(a => a.game === this.selectedGame);
    }

    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(a => 
        (a.username && a.username.toLowerCase().includes(q)) ||
        (a.purpose && a.purpose.toLowerCase().includes(q)) ||
        (a.notes && a.notes.toLowerCase().includes(q)) ||
        (a.game && a.game.toLowerCase().includes(q))
      );
    }

    return list;
  },

  renderAccounts() {
    const container = document.getElementById("accounts-list-container");
    const countBadge = document.getElementById("accounts-count-badge");
    if (!container) return;

    const accounts = this.getFilteredAccounts();
    if (countBadge) {
      countBadge.textContent = `${accounts.length} tài khoản`;
    }

    if (accounts.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <div class="inline-flex p-4 rounded-full bg-slate-800/60 mb-3 text-slate-500">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <p class="text-base font-medium text-slate-300">Chưa có tài khoản nào</p>
          <p class="text-xs text-slate-500 mt-1">Bấm "+ Thêm Tài Khoản" hoặc tạo mới từ Tab "Tạo Nick & MK".</p>
        </div>
      `;
      return;
    }

    const statusMap = {
      active: { text: "Sẵn sàng", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
      farming: { text: "Đang treo", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
      sold: { text: "Đã bán", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
      locked: { text: "Khóa/Lỗi", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" }
    };

    container.innerHTML = accounts.map(a => {
      const statusInfo = statusMap[a.status] || statusMap.active;
      const combo = `${a.username}:${a.password}`;

      return `
        <div class="acc-card bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between shadow-lg shadow-black/20 relative" data-id="${a.id}">
          <div>
            <!-- Header: Purpose & Game -->
            <div class="flex items-start justify-between gap-2 mb-3">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ${this.escapeHTML(a.game || "Roblox")}
                </span>
                <span class="px-2 py-0.5 rounded-md text-[10px] ${statusInfo.color} border">
                  ${statusInfo.text}
                </span>
              </div>

              <!-- Actions: Edit & Delete -->
              <div class="flex items-center gap-1">
                <button 
                  onclick="AccountManager.openEditModal('${a.id}')" 
                  class="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors" 
                  title="Chỉnh sửa">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button 
                  onclick="AccountManager.confirmDelete('${a.id}')" 
                  class="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors" 
                  title="Xóa tài khoản">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>

            <!-- Purpose Title -->
            <h4 class="text-sm font-semibold text-slate-200 mb-2">
              ${this.escapeHTML(a.purpose || a.username)}
            </h4>

            <!-- Credentials Box (Always visible as requested) -->
            <div class="space-y-2 mb-3 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
              <!-- Username Row -->
              <div class="flex items-center justify-between gap-2 group/u cursor-pointer" onclick="AccountManager.copyText('${this.escapeHTML(a.username)}', 'Username')">
                <span class="text-[11px] text-slate-500 font-mono">User:</span>
                <div class="flex items-center gap-1.5 overflow-hidden">
                  <span class="font-mono text-xs font-semibold text-cyan-300 group-hover/u:text-cyan-200 transition-colors truncate">${this.escapeHTML(a.username)}</span>
                  <svg class="w-3 h-3 text-slate-500 group-hover/u:text-cyan-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
              </div>

              <!-- Password Row (Always in clear text, click to copy) -->
              <div class="flex items-center justify-between gap-2 group/p cursor-pointer border-t border-slate-900 pt-1.5" onclick="AccountManager.copyText('${this.escapeHTML(a.password)}', 'Mật khẩu')">
                <span class="text-[11px] text-slate-500 font-mono">Pass:</span>
                <div class="flex items-center gap-1.5 overflow-hidden">
                  <span class="font-mono text-xs font-bold text-emerald-400 group-hover/p:text-emerald-300 transition-colors tracking-wide truncate">${this.escapeHTML(a.password)}</span>
                  <svg class="w-3 h-3 text-slate-500 group-hover/p:text-emerald-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
              </div>
            </div>

            <!-- Notes -->
            ${a.notes ? `
              <p class="text-xs text-slate-400 mb-2 leading-relaxed">
                💬 ${this.escapeHTML(a.notes)}
              </p>
            ` : ""}
          </div>

          <!-- Bottom Action: Quick Copy user:pass -->
          <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <span class="text-[10px] text-slate-500 font-mono">${a.createdAt ? a.createdAt.slice(0, 10) : ""}</span>
            <button 
              onclick="AccountManager.copyText('${this.escapeHTML(combo)}', 'Combo user:pass')" 
              class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-1.5 active:scale-95">
              <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              <span>Copy combo (user:pass)</span>
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  copyText(text, label = "Nội dung") {
    navigator.clipboard.writeText(text).then(() => {
      App.showToast(`Đã sao chép ${label}: ${text}`, "success");
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      App.showToast(`Đã sao chép ${label}: ${text}`, "success");
    });
  },

  openAddModal(defaultUser = "", defaultPass = "") {
    const modal = document.getElementById("modal-account");
    const title = document.getElementById("modal-account-title");
    const form = document.getElementById("form-acc-modal");
    if (!modal || !form) return;

    title.textContent = "Thêm Tài Khoản Mới";
    form.reset();
    document.getElementById("acc-id-input").value = "";
    document.getElementById("acc-username-input").value = defaultUser;
    document.getElementById("acc-password-input").value = defaultPass;
    modal.classList.remove("hidden");
  },

  openEditModal(id) {
    const accounts = StorageManager.getAccounts();
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;

    const modal = document.getElementById("modal-account");
    const title = document.getElementById("modal-account-title");
    if (!modal) return;

    title.textContent = "Chỉnh Sửa Tài Khoản";
    document.getElementById("acc-id-input").value = acc.id;
    document.getElementById("acc-username-input").value = acc.username || "";
    document.getElementById("acc-password-input").value = acc.password || "";
    document.getElementById("acc-game-input").value = acc.game || "Blox Fruits";
    document.getElementById("acc-purpose-input").value = acc.purpose || "";
    document.getElementById("acc-status-input").value = acc.status || "active";
    document.getElementById("acc-notes-input").value = acc.notes || "";

    modal.classList.remove("hidden");
  },

  handleSaveAccount() {
    const id = document.getElementById("acc-id-input").value;
    const username = document.getElementById("acc-username-input").value.trim();
    const password = document.getElementById("acc-password-input").value.trim();
    const game = document.getElementById("acc-game-input").value;
    const purpose = document.getElementById("acc-purpose-input").value.trim();
    const status = document.getElementById("acc-status-input").value;
    const notes = document.getElementById("acc-notes-input").value.trim();

    if (!username || !password) {
      App.showToast("Vui lòng nhập Username và Password!", "error");
      return;
    }

    const accData = {
      id: id || undefined,
      username,
      password,
      game: game || "Blox Fruits",
      purpose: purpose || username,
      status: status || "active",
      notes
    };

    StorageManager.saveAccount(accData);
    document.getElementById("modal-account").classList.add("hidden");
    this.renderAccounts();
    App.updateStats();
    App.showToast(id ? "Đã cập nhật tài khoản!" : "Đã thêm tài khoản mới thành công!", "success");
  },

  confirmDelete(id) {
    const accounts = StorageManager.getAccounts();
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;

    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${acc.username}"?`)) {
      StorageManager.deleteAccount(id);
      this.renderAccounts();
      App.updateStats();
      App.showToast("Đã xóa tài khoản.", "info");
    }
  },

  escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};
