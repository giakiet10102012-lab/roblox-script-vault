/**
 * Quản lý danh sách tài khoản Roblox (Account Vault - Giao diện Cyberpunk Cao Cấp)
 */
const AccountManager = {
  searchQuery: "",
  selectedGame: "all",

  init() {
    this.renderAccounts();
    this.bindEvents();
  },

  bindEvents() {
    const searchInput = document.getElementById("acc-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderAccounts();
      });
    }

    const gameSelect = document.getElementById("acc-filter-game");
    if (gameSelect) {
      gameSelect.addEventListener("change", (e) => {
        this.selectedGame = e.target.value;
        this.renderAccounts();
      });
    }

    const addAccBtn = document.getElementById("btn-add-account");
    if (addAccBtn) {
      addAccBtn.addEventListener("click", () => this.openAddModal());
    }

    const accForm = document.getElementById("form-acc-modal");
    if (accForm) {
      accForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSaveAccount();
      });
    }

    const exportComboBtn = document.getElementById("btn-export-combo");
    if (exportComboBtn) {
      exportComboBtn.addEventListener("click", () => {
        const success = StorageManager.exportAccountsComboText();
        if (success) {
          App.showToast("Đã tải về file text danh sách user:pass!", "success");
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
        <div class="col-span-full py-20 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 backdrop-blur-xl">
          <div class="inline-flex p-5 rounded-2xl bg-slate-800/60 mb-4 text-emerald-400 border border-slate-700/60 shadow-lg shadow-emerald-500/10">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <p class="text-base font-bold text-slate-200 font-heading">Chưa có tài khoản nào</p>
          <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Bấm "+ Thêm Tài Khoản" hoặc tạo mới từ Tab "Tạo Nick & MK".</p>
        </div>
      `;
      return;
    }

    const statusMap = {
      active: { text: "Sẵn sàng", badge: "glow-badge-emerald", dot: "bg-emerald-400" },
      farming: { text: "Đang treo", badge: "glow-badge-amber", dot: "bg-amber-400 animate-pulse" },
      sold: { text: "Đã bán", badge: "glow-badge-cyan", dot: "bg-blue-400" },
      locked: { text: "Khóa/Lỗi", badge: "glow-badge-purple", dot: "bg-rose-400" }
    };

    container.innerHTML = accounts.map(a => {
      const statusInfo = statusMap[a.status] || statusMap.active;
      const combo = `${a.username}:${a.password}`;
      const initials = (a.username || "RB").substring(0, 2).toUpperCase();

      return `
        <div class="acc-card glass-card rounded-2xl p-5 flex flex-col justify-between group" data-id="${a.id}">
          <div>
            <!-- Header: Avatar + Purpose & Status -->
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl avatar-gradient flex items-center justify-center font-bold text-white text-xs font-mono ring-1 ring-white/20 flex-shrink-0">
                  ${initials}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-slate-100 font-heading tracking-wide">
                    ${this.escapeHTML(a.purpose || a.username)}
                  </h4>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[11px] font-semibold text-cyan-400">${this.escapeHTML(a.game || "Roblox")}</span>
                    <span class="text-slate-600">&bull;</span>
                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${statusInfo.badge}">
                      <span class="w-1.5 h-1.5 rounded-full ${statusInfo.dot}"></span>
                      <span>${statusInfo.text}</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Menu -->
              <div class="flex items-center gap-1">
                <button 
                  onclick="AccountManager.openEditModal('${a.id}')" 
                  class="p-2 rounded-xl text-slate-500 hover:text-cyan-400 hover:bg-slate-800/80 transition-all" 
                  title="Chỉnh sửa">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button 
                  onclick="AccountManager.confirmDelete('${a.id}')" 
                  class="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 transition-all" 
                  title="Xóa tài khoản">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>

            <!-- Credentials Box (High-Contrast Neon Text, 1-Click Copy) -->
            <div class="space-y-2 mb-3 bg-slate-950/90 border border-slate-800/90 rounded-xl p-3.5 shadow-inner">
              <!-- Username Row -->
              <div class="flex items-center justify-between gap-2 group/u cursor-pointer py-0.5" onclick="AccountManager.copyText('${this.escapeHTML(a.username)}', 'Username')">
                <span class="text-[11px] font-semibold text-slate-500 font-mono">User:</span>
                <div class="flex items-center gap-2 overflow-hidden">
                  <span class="font-mono text-xs font-bold text-cyan-300 group-hover/u:text-cyan-200 transition-colors truncate tracking-wide">${this.escapeHTML(a.username)}</span>
                  <span class="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-800 text-slate-400 group-hover/u:bg-cyan-500/20 group-hover/u:text-cyan-300 transition-colors">COPY</span>
                </div>
              </div>

              <!-- Password Row (Always visible in clear text) -->
              <div class="flex items-center justify-between gap-2 group/p cursor-pointer border-t border-slate-900 pt-2 pb-0.5" onclick="AccountManager.copyText('${this.escapeHTML(a.password)}', 'Mật khẩu')">
                <span class="text-[11px] font-semibold text-slate-500 font-mono">Pass:</span>
                <div class="flex items-center gap-2 overflow-hidden">
                  <span class="font-mono text-xs font-bold text-emerald-400 group-hover/p:text-emerald-300 transition-colors tracking-wider truncate">${this.escapeHTML(a.password)}</span>
                  <span class="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-800 text-slate-400 group-hover/p:bg-emerald-500/20 group-hover/p:text-emerald-300 transition-colors">COPY</span>
                </div>
              </div>
            </div>

            <!-- Notes -->
            ${a.notes ? `
              <div class="text-xs text-slate-400 mb-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 flex items-start gap-2">
                <span class="text-slate-500">💬</span>
                <p class="leading-relaxed select-text">${this.escapeHTML(a.notes)}</p>
              </div>
            ` : ""}
          </div>

          <!-- Bottom Action: Quick Copy user:pass -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <span class="text-[10px] text-slate-500 font-mono">${a.createdAt ? a.createdAt.slice(0, 10) : ""}</span>
            <button 
              onclick="AccountManager.copyText('${this.escapeHTML(combo)}', 'Combo user:pass')" 
              class="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/50 transition-all flex items-center gap-2 active:scale-95 shadow-md">
              <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
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
