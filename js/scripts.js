/**
 * Quản lý giao diện, tìm kiếm, lọc và thao tác với Script
 */
const ScriptManager = {
  activeCategory: "all",
  activeTag: "all",
  searchQuery: "",
  showOnlyFavorites: false,
  expandedScripts: new Set(),

  init() {
    this.renderCategoryPills();
    this.renderTagPills();
    this.renderScripts();
    this.bindEvents();
  },

  bindEvents() {
    // Tìm kiếm script
    const searchInput = document.getElementById("script-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.renderScripts();
      });
    }

    // Nút lọc Yêu thích
    const favFilterBtn = document.getElementById("filter-favorite-btn");
    if (favFilterBtn) {
      favFilterBtn.addEventListener("click", () => {
        this.showOnlyFavorites = !this.showOnlyFavorites;
        favFilterBtn.classList.toggle("bg-amber-500/20", this.showOnlyFavorites);
        favFilterBtn.classList.toggle("text-amber-400", this.showOnlyFavorites);
        favFilterBtn.classList.toggle("border-amber-500/50", this.showOnlyFavorites);
        this.renderScripts();
      });
    }

    // Modal Thêm Script
    const addScriptBtn = document.getElementById("btn-add-script");
    if (addScriptBtn) {
      addScriptBtn.addEventListener("click", () => this.openAddModal());
    }

    const scriptForm = document.getElementById("form-script-modal");
    if (scriptForm) {
      scriptForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSaveScript();
      });
    }
  },

  renderCategoryPills() {
    const container = document.getElementById("category-pills-container");
    if (!container) return;

    const data = StorageManager.getData();
    const categories = data.categories || DEFAULT_DATA.categories;
    const allScripts = StorageManager.getScripts();

    container.innerHTML = categories.map(cat => {
      const count = cat.id === "all" 
        ? allScripts.length 
        : allScripts.filter(s => s.category === cat.id || s.game.toLowerCase() === cat.name.toLowerCase()).length;
      
      const isActive = this.activeCategory === cat.id;
      return `
        <button 
          data-category="${cat.id}" 
          class="cat-pill px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
            isActive 
              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/10 font-semibold" 
              : "bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 border-slate-700/60"
          }">
          <span>${cat.name}</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? "bg-cyan-500/30 text-cyan-200" : "bg-slate-900/60 text-slate-500"}">${count}</span>
        </button>
      `;
    }).join("");

    container.querySelectorAll(".cat-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeCategory = btn.dataset.category;
        this.renderCategoryPills();
        this.renderScripts();
      });
    });
  },

  renderTagPills() {
    const container = document.getElementById("tag-pills-container");
    if (!container) return;

    const tags = ["Tất cả", ...(DEFAULT_DATA.tags || [])];
    container.innerHTML = tags.map(tag => {
      const tagId = tag === "Tất cả" ? "all" : tag;
      const isActive = this.activeTag === tagId;
      return `
        <button 
          data-tag="${tagId}" 
          class="tag-pill px-2.5 py-1 rounded-lg text-[11px] transition-all border ${
            isActive 
              ? "bg-purple-500/20 text-purple-300 border-purple-500/50 font-medium" 
              : "bg-slate-900/40 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700"
          }">
          #${tag}
        </button>
      `;
    }).join("");

    container.querySelectorAll(".tag-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTag = btn.dataset.tag;
        this.renderTagPills();
        this.renderScripts();
      });
    });
  },

  getFilteredScripts() {
    let list = StorageManager.getScripts();

    // Lọc theo Category
    if (this.activeCategory !== "all") {
      list = list.filter(s => s.category === this.activeCategory || s.game.toLowerCase().includes(this.activeCategory.replace("-", " ")));
    }

    // Lọc theo Tag
    if (this.activeTag !== "all") {
      list = list.filter(s => s.tags && s.tags.includes(this.activeTag));
    }

    // Lọc theo Yêu thích
    if (this.showOnlyFavorites) {
      list = list.filter(s => s.isFavorite);
    }

    // Tìm kiếm text
    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(s => 
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.game && s.game.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.script && s.script.toLowerCase().includes(q)) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Ưu tiên script yêu thích lên đầu
    return list.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
  },

  renderScripts() {
    const container = document.getElementById("scripts-grid");
    const countBadge = document.getElementById("scripts-count-badge");
    if (!container) return;

    const scripts = this.getFilteredScripts();
    if (countBadge) {
      countBadge.textContent = `${scripts.length} script`;
    }

    if (scripts.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <div class="inline-flex p-4 rounded-full bg-slate-800/60 mb-3 text-slate-500">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <p class="text-base font-medium text-slate-300">Không tìm thấy script phù hợp</p>
          <p class="text-xs text-slate-500 mt-1">Hãy thử đổi từ khóa tìm kiếm hoặc bấm vào "Thêm Script Mới".</p>
        </div>
      `;
      return;
    }

    container.innerHTML = scripts.map(s => {
      const isExpanded = this.expandedScripts.has(s.id);
      const isLongCode = s.script.split("\n").length > 4 || s.script.length > 150;
      
      // Cắt ngắn preview nếu chưa mở rộng
      const previewCode = isExpanded 
        ? s.script 
        : (isLongCode ? s.script.split("\n").slice(0, 4).join("\n") + "\n..." : s.script);

      return `
        <div class="script-card group bg-slate-900/80 hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between shadow-lg shadow-black/20 relative" data-id="${s.id}">
          <div>
            <!-- Header Card: Category & Favorite -->
            <div class="flex items-start justify-between gap-2 mb-2.5">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  ${this.escapeHTML(s.game || "Roblox")}
                </span>
                ${(s.tags || []).map(t => `
                  <span class="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-400 border border-slate-700/60">
                    ${this.escapeHTML(t)}
                  </span>
                `).join("")}
              </div>

              <div class="flex items-center gap-1">
                <button 
                  onclick="ScriptManager.toggleFav('${s.id}')" 
                  class="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 transition-colors ${s.isFavorite ? "text-amber-400 bg-amber-500/10" : "hover:bg-slate-800"}"
                  title="${s.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}">
                  <svg class="w-4 h-4" fill="${s.isFavorite ? "currentColor" : "none"}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                </button>
                <div class="relative inline-block text-left">
                  <button 
                    onclick="ScriptManager.openActionMenu('${s.id}', event)" 
                    class="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Title & Description -->
            <h3 class="text-base font-semibold text-slate-100 mb-1 group-hover:text-cyan-300 transition-colors">
              ${this.escapeHTML(s.title)}
            </h3>
            ${s.description ? `
              <p class="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                ${this.escapeHTML(s.description)}
              </p>
            ` : ""}

            <!-- Code Preview Box -->
            <div class="relative mt-2 mb-3 rounded-xl bg-slate-950/90 border border-slate-800 p-3 font-mono text-xs overflow-hidden">
              <pre class="text-slate-300 overflow-x-auto select-all whitespace-pre-wrap break-all text-[11px] leading-relaxed max-h-48 scrollbar-thin"><code>${this.escapeHTML(previewCode)}</code></pre>
              ${isLongCode ? `
                <button 
                  onclick="ScriptManager.toggleExpand('${s.id}')" 
                  class="mt-2 text-[11px] text-cyan-400 hover:text-cyan-300 font-sans flex items-center gap-1">
                  <span>${isExpanded ? "Thu gọn code ▲" : "Xem toàn bộ code ▼"}</span>
                </button>
              ` : ""}
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              ${s.keyLink ? `
                <a 
                  href="${s.keyLink}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 flex items-center gap-1 transition-all">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                  <span>Lấy Key</span>
                </a>
              ` : ""}
            </div>

            <button 
              onclick="ScriptManager.copyScript('${s.id}')" 
              class="btn-copy-script px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <span>Sao chép Script</span>
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  toggleExpand(id) {
    if (this.expandedScripts.has(id)) {
      this.expandedScripts.delete(id);
    } else {
      this.expandedScripts.add(id);
    }
    this.renderScripts();
  },

  toggleFav(id) {
    const isFav = StorageManager.toggleFavorite(id);
    this.renderScripts();
    App.updateStats();
    App.showToast(isFav ? "Đã thêm vào mục Yêu thích ⭐" : "Đã bỏ khỏi Yêu thích", "info");
  },

  copyScript(id) {
    const script = StorageManager.getScriptById(id);
    if (!script) return;

    navigator.clipboard.writeText(script.script).then(() => {
      App.showToast(`Đã sao chép: "${script.title}"!`, "success");
    }).catch(err => {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = script.script;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      App.showToast(`Đã sao chép: "${script.title}"!`, "success");
    });
  },

  openActionMenu(id, event) {
    event.stopPropagation();
    const existingMenu = document.getElementById("script-context-menu");
    if (existingMenu) existingMenu.remove();

    const script = StorageManager.getScriptById(id);
    if (!script) return;

    const menu = document.createElement("div");
    menu.id = "script-context-menu";
    menu.className = "fixed z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 text-xs text-slate-200 min-w-36";
    
    // Position menu near button
    const rect = event.currentTarget.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.left = `${Math.min(window.innerWidth - 160, rect.left - 80)}px`;

    menu.innerHTML = `
      <button onclick="ScriptManager.openEditModal('${id}'); document.getElementById('script-context-menu')?.remove();" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2">
        <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        <span>Chỉnh sửa</span>
      </button>
      <button onclick="ScriptManager.confirmDelete('${id}'); document.getElementById('script-context-menu')?.remove();" class="w-full text-left px-3 py-2 hover:bg-red-500/20 text-red-400 flex items-center gap-2">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        <span>Xóa Script</span>
      </button>
    `;

    document.body.appendChild(menu);

    const closeHandler = () => {
      menu.remove();
      document.removeEventListener("click", closeHandler);
    };
    setTimeout(() => document.addEventListener("click", closeHandler), 10);
  },

  openAddModal() {
    const modal = document.getElementById("modal-script");
    const title = document.getElementById("modal-script-title");
    const form = document.getElementById("form-script-modal");
    if (!modal || !form) return;

    title.textContent = "Thêm Script Mới";
    form.reset();
    document.getElementById("script-id-input").value = "";
    modal.classList.remove("hidden");
  },

  openEditModal(id) {
    const script = StorageManager.getScriptById(id);
    if (!script) return;

    const modal = document.getElementById("modal-script");
    const title = document.getElementById("modal-script-title");
    if (!modal) return;

    title.textContent = "Chỉnh Sửa Script";
    document.getElementById("script-id-input").value = script.id;
    document.getElementById("script-title-input").value = script.title || "";
    document.getElementById("script-game-input").value = script.game || "Blox Fruits";
    document.getElementById("script-category-input").value = script.category || "blox-fruits";
    document.getElementById("script-tags-input").value = (script.tags || []).join(", ");
    document.getElementById("script-keylink-input").value = script.keyLink || "";
    document.getElementById("script-desc-input").value = script.description || "";
    document.getElementById("script-code-input").value = script.script || "";

    modal.classList.remove("hidden");
  },

  handleSaveScript() {
    const id = document.getElementById("script-id-input").value;
    const title = document.getElementById("script-title-input").value.trim();
    const game = document.getElementById("script-game-input").value.trim();
    const category = document.getElementById("script-category-input").value;
    const tagsStr = document.getElementById("script-tags-input").value.trim();
    const keyLink = document.getElementById("script-keylink-input").value.trim();
    const description = document.getElementById("script-desc-input").value.trim();
    const scriptCode = document.getElementById("script-code-input").value.trim();

    if (!title || !scriptCode) {
      App.showToast("Vui lòng nhập Tên Script và Nội dung Script!", "error");
      return;
    }

    const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : [];

    const scriptData = {
      id: id || undefined,
      title,
      game: game || "Roblox",
      category: category || "other",
      tags,
      keyLink,
      description,
      script: scriptCode
    };

    StorageManager.saveScript(scriptData);
    document.getElementById("modal-script").classList.add("hidden");
    this.renderCategoryPills();
    this.renderScripts();
    App.updateStats();
    App.showToast(id ? "Đã cập nhật script thành công!" : "Đã thêm script mới thành công!", "success");
  },

  confirmDelete(id) {
    const script = StorageManager.getScriptById(id);
    if (!script) return;

    if (confirm(`Bạn có chắc chắn muốn xóa script "${script.title}"?`)) {
      StorageManager.deleteScript(id);
      this.renderCategoryPills();
      this.renderScripts();
      App.updateStats();
      App.showToast("Đã xóa script khỏi danh sách.", "info");
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
