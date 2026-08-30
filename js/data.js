/**
 * Dữ liệu mặc định khởi tạo từ Google Doc
 */
const DEFAULT_DATA = {
  categories: [
    { id: "all", name: "Tất cả Game", icon: "layout-grid" },
    { id: "blox-fruits", name: "Blox Fruits", icon: "sword" },
    { id: "dead-rails", name: "Dead Rails", icon: "train" },
    { id: "fisch", name: "Fisch", icon: "fish" },
    { id: "arise", name: "Arise", icon: "zap" },
    { id: "pls-donate", name: "Pls Donate", icon: "coins" },
    { id: "grow-a-garden", name: "Grow a Garden", icon: "sprout" },
    { id: "99-nights", name: "99 Nights Forest", icon: "trees" },
    { id: "dev-tools", name: "Dev & Công cụ", icon: "terminal" },
    { id: "other", name: "Khác", icon: "folder" }
  ],

  tags: [
    "Kaitun", "Auto Farm", "Fix Lag", "PvP / Aim", "Fruit / Chest", "Hop Server",
    "Có Key", "Không Key", "Mob Aura", "Teleport", "Config Đầy Đủ"
  ],

  scripts: [
    // --- BLOX FRUITS ---
    {
      id: "bf-cyborg",
      title: "Get Cyborg (Tộc Cyborg)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Kaitun"],
      description: "Script tự động chọn Team Marines và lấy tộc Cyborg bằng Luarmor loader.",
      keyLink: "",
      isFavorite: true,
      script: `getgenv().Team = "Marines"
getgenv().Get_Race = "Cyborg"
loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/7a6c326e81861b3e1e7207c5d11ed755.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-ghoul",
      title: "Get Ghoul (Tộc Quỷ)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Kaitun"],
      description: "Script tự động chọn Team Marines và lấy tộc Ghoul (Quỷ) bằng Luarmor loader.",
      keyLink: "",
      isFavorite: true,
      script: `getgenv().Team = "Marines"
getgenv().Get_Race = "Ghoul"
loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/7a6c326e81861b3e1e7207c5d11ed755.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-farm-chest",
      title: "Farm Rương & Lụm Trái (Skull Hub)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Fruit / Chest", "Auto Farm", "Hop Server", "Config Đầy Đủ"],
      description: "Cấu hình nhặt rương & trái ác quỷ, tự hop server, webhook Discord, FPS boost, anti AFK. (false = giữ lại chén và key, true = ko giữ lại)",
      keyLink: "",
      isFavorite: true,
      script: `getgenv().BloxFruits = {
    ["Team"] = "Marines", -- Pirates/Marines
    ["TweenSpeed"] = 350, -- Studs per second 380 no flag but kick
    ["Fruit"] = {
        ["FruitNotifier"] = false, -- Fruit notifier
        ["AutoRandom"] = true, -- Auto random/store fruit
        ["FruitSniper"] = {
            ["Enabled"] = false, -- Auto buy fruit in normal shop
            ["TargetFruits"] = {"Yeti-Yeti", "Dragon-Dragon", "Dough-Dough"},
        },
    },
    ["Farm"] = {
        ["Enabled"] = true, -- Farm chest & fruit
        ["FastMethod"] = false, -- Faster but more risky
        ["AutoHop"] = true, -- Auto hop after collect all
        ["ItemHop"] = false, -- God's Chalice/Fist of Darkness
    },
    ["Webhook"] = {
        ["Enabled"] = false,
        ["URL"] = "Your Webhook Url",
        ["UserId"] = "Id Discord",
    },
    ["BlackScreen"] = false, -- Black screen
    ["FpsBoost"] = false, -- Boost FPS
    ["AntiIdle"] = true, -- Anti AFK
}

loadstring(game:HttpGet('https://skullhub.xyz/loader.lua'))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-ak-gaming",
      title: "AK Gaming Hub",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Không Key"],
      description: "Script AK Gaming đa năng cho Blox Fruits.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/binh99999yeuem/ak-gaming/refs/heads/main/ak%20gaming.txt"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-min-gaming",
      title: "Min Gaming Hub (MinME)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Không Key"],
      description: "Script Min Gaming crack / no key.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/LuaCrack/Min/refs/heads/main/MinME"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-xeter",
      title: "Xeter Hub",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Không Key"],
      description: "Script Xeter Blox Fruits loader.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/LuaCrack/Loader/main/Xeter.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-doremon",
      title: "Doremon Hub (MasterHub)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm"],
      description: "MasterHub Doremon Blox Fruits obfuscated loader.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/obfmoonsec/Masterhub/refs/heads/main/obf"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-cokka",
      title: "Cokka Hub",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Có Key"],
      description: "Cokka Hub Blox Fruits - Điền key của bạn vào _G.Key.",
      keyLink: "",
      isFavorite: false,
      script: `_G.Key = "Your Key" 
loadstring(game:HttpGet"https://raw.githubusercontent.com/UserDevEthical/Loadstring/main/CokkaHub.lua")()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-fly",
      title: "Bay / Fly Script (TurboLite)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Teleport", "PvP / Aim", "Không Key"],
      description: "Script bay tự do trong game của TurboLite.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/TurboLite/Script/refs/heads/main/Fly.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-ok-hub",
      title: "OK Hub Main Blox Fruit",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Không Key"],
      description: "Script OK Hub cho Blox Fruits.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/fakekuri/Okhubhere/refs/heads/main/MainBloxFruit.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-xero-main",
      title: "Xero Hub Main",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Kaitun"],
      description: "Xero Hub phiên bản chính Blox Fruits với cấu hình Marines, Hide Menu, Auto Execute.",
      keyLink: "",
      isFavorite: true,
      script: `getgenv().Team = "Marines"
getgenv().Hide_Menu = false
getgenv().Auto_Execute = false
loadstring(game:HttpGet("https://raw.githubusercontent.com/Xero2409/XeroHub/refs/heads/main/main.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-rubu-v3",
      title: "Rubu Hub v3 (RubuBF)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Không Key"],
      description: "Rubu Hub version 3 crack cho Blox Fruits.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/LuaCrack/RubuRoblox/refs/heads/main/RubuBF"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-teddy-premium",
      title: "Teddy Premium (Tự đổi server Rip Indra, Dough v2)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Hop Server", "Auto Farm", "Kaitun"],
      description: "Script tự tìm và đổi server có Rip Indra, Dough v2 và các sự kiện boss.",
      keyLink: "",
      isFavorite: true,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/skibiditoiletgojo/Haidepzai/refs/heads/main/Teddy-Premium"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-fixlag-kaitun",
      title: "Fix Lag Dành Cho Kaitun (Teddy)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Fix Lag", "Kaitun"],
      description: "Xóa 100% rác, hiệu ứng thừa, tối ưu hóa FPS tối đa khi treo nhiều acc kaitun.",
      keyLink: "",
      isFavorite: true,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/skibiditoiletgojo/Haidepzai/refs/heads/main/Fixlag-delete100%25trash-Teddy"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-fixlag-turbo",
      title: "Fix Lag Cho Farm (TurboLite)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Fix Lag", "Auto Farm"],
      description: "Script giảm đồ họa, tối ưu FPS nhẹ nhàng khi cày cấp/farm rương.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/TurboLite/Script/main/FixLag.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-auto-aim",
      title: "Auto Aim / Silent Aim (Ace)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["PvP / Aim"],
      description: "Script tự động khóa mục tiêu hỗ trợ PvP và combo chiêu thức.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/Totocoems/Ace/main/Ace"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-fruit-collect",
      title: "Lụm Trái Ác Quỷ Tự Động (Skull Hub Fruit Collect)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Fruit / Chest", "Auto Farm", "Hop Server", "Config Đầy Đủ"],
      description: "Tự tìm và cất trái ác quỷ, tự hop server sau 20s, hỗ trợ gửi Webhook Discord khi nhặt được trái ngon.",
      keyLink: "",
      isFavorite: true,
      script: `_G.Settings = {
    ["Start Farm"] = true,
    ["Choose Team"] = "Marines",
    ["Store Fruit"] = true,
    ["Bypass TP"] = false,
    ["Next Server Time"] = 20,
    ["Chat Settings"] = {
        ["Enable"] = false,
        ["Messages"] = {
            "Wow! I found a legendary fruit when I used the Skull Hub",
            "Search Y T SKULL HUB"
        },
        ["Chat Delay"] = 5
    },
    ["Webhook Settings"] = {
        ["Enable"] = true,
        ["Link"] = "",
        ["Mention"] = "@",
        ["SendTimes"] = 1,
        ["Interval"] = 1
    }
}
loadstring(game:HttpGet("https://raw.githubusercontent.com/xxhumggxx/SkullHub/refs/heads/main/FruitCollect.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-turbo-main",
      title: "Turbo Lite Main Hub",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Không Key"],
      description: "TurboLite Blox Fruits script chính.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/TurboLite/Script/main/Main.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-teddy-v2",
      title: "Teddy Hub v2 Main",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Kaitun"],
      description: "Teddy Hub v2 bản đầy đủ chức năng farm.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/skibiditoiletgojo/Haidepzai/refs/heads/main/TeddyHubv2"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-quantum",
      title: "Quantum Onyx Hub",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Không Key"],
      description: "Quantum Onyx Blox Fruits loader.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/flazhy/QuantumOnyx/refs/heads/main/QuantumOnyx.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-kaitun-v4",
      title: "Kaitun V4 Config (ThangSiTink)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Kaitun", "Auto Farm", "Có Key", "Config Đầy Đủ"],
      description: "Cấu hình Kaitun V4 nâng gear, auto change race, webhook discord thông báo done trial/train.",
      keyLink: "",
      isFavorite: true,
      script: `getgenv().ConfigV4 = {
    ["Account Up Gear"] = {
      ""
    },
    ["Account Help"] = {
      ""
    },
    ["Method Kick"] = {
        ["End Moon"] = false,
    },
    ["Auto Join"] = false,
    ["Auto Change Race"] = {
        ["Enabled"] = false,
        ["Race"] = {""} --- Human,Skypiea,Fishman,Mink
    },
    ["Webhook"] = {
        ["url"] = "https://discord.com/api/webhooks/1459175561501872403/HqlVZrVleUbOqrAq7sfy3KtqSeaKzH7njzjecG9QLjKMM8EjpEKM105lZIAE0ox-0v-7",
        ["Done Train"] = false,
        ["Done Trial"] = false,
    }
}
getgenv().Key = "e974620d2340e0657190c86a"
loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/refs/heads/main/NewV4Config.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-banana-main",
      title: "Banana Hub Main",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Có Key"],
      description: "Banana Hub Blox Fruits - Kèm sẵn Key và link get key dự phòng.",
      keyLink: "https://ads.luarmor.net/get_key?for=VHFslhWdrPey",
      isFavorite: true,
      script: `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer 
getgenv().Key = "e974620d2340e0657190c86a" 
loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/main/BananaHub.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-hoho",
      title: "HoHo Hub",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Có Key"],
      description: "HoHo Hub script huyền thoại Blox Fruits.",
      keyLink: "",
      isFavorite: true,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/acsu123/HOHO_H/main/Loading_UI"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-mukuro",
      title: "Mukuro Hub",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm"],
      description: "Mukuro Hub Blox Fruits via quartyz auth.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://auth.quartyz.com/scripts/Loader.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-w-azure",
      title: "W-Azure Hub",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Kaitun"],
      description: "W-Azure Hub cực mượt cho Blox Fruits.",
      keyLink: "",
      isFavorite: true,
      script: `loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/3b2169cf53bc6104dabe8e19562e5cc2.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-cuttay",
      title: "CutTay Hub",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Không Key"],
      description: "CutTay Hub Blox Fruits loader.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet('https://raw.githubusercontent.com/diemquy/CutTayHub/main/Cuttayhubreal.lua'))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-thunderz",
      title: "ThunderZ Hub (All Game)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Không Key"],
      description: "ThunderZ hỗ trợ nhiều game bao gồm Blox Fruits.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet('https://raw.githubusercontent.com/ThundarZ/Welcome/refs/heads/main/Main/Loader/AllGame.lua'))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-astral",
      title: "Astral v1 Blox Fruits",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm"],
      description: "Astral v1 Blox Fruits loader.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/Overgustx2/Main/refs/heads/main/BloxFruits_25.html"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-banana-kaitun-full",
      title: "Banana Cat Kaitun (Full Config Items & Fruits)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Kaitun", "Auto Farm", "Fruit / Chest", "Có Key", "Config Đầy Đủ"],
      description: "Cấu hình siêu chi tiết: Lấy Saber, Godhuman, Skull Guitar, Mirror Fractal, CDK, Race V2-V3, Pull Lever, Hop Rip Indra, Dough King, Mua Haki, Sniper Trái (Leopard, Kitsune, Dragon, Yeti, Gas).",
      keyLink: "https://ads.luarmor.net/get_key?for=VHFslhWdrPey",
      isFavorite: true,
      script: `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
getgenv().Key = "e974620d2340e0657190c86a"
getgenv().SettingFarm ={
    ["Hide UI"] = false,
    ["Reset Teleport"] = {
        ["Enabled"] = false,
        ["Delay Reset"] = 3,
        ["Item Dont Reset"] = {
            ["Fruit"] = {
                ["Enabled"] = true,
                ["All Fruit"] = true, 
                ["Select Fruit"] = {
                    ["Enabled"] = false,
                    ["Fruit"] = {},
                },
            },
        },
    },
    ["White Screen"] = false,
    ["Lock Fps"] = {
        ["Enabled"] = false,
        ["FPS"] = 20,
    },
    ["Get Items"] = {
        ["Saber"] = true,
        ["Godhuman"] =  true,
        ["Skull Guitar"] = true,
        ["Mirror Fractal"] = true,
        ["Cursed Dual Katana"] = true,
        ["Upgrade Race V2-V3"] = true,
        ["Auto Pull Lever"] = true,
    },
    ["Select Hop"] = { -- 70% will have it
        ["Hop Find Rip Indra Get Valkyrie Helm or Get Tushita"] = true, 
        ["Hop Find Dough King Get Mirror Fractal"] = false,
        ["Hop Find Raids Castle [CDK]"] = true,
        ["Hop Find Cake Queen [CDK]"] = true,
        ["Hop Find Soul Reaper [CDK]"] = true,
        ["Hop Find Darkbeard [SG]"] = true,
        ["Hop Find Mirage [ Pull Lever ]"] = true,
    },
    ["Buy Haki"] = {
        ["Enhancement"] = false,
        ["Skyjump"] = true,
        ["Flash Step"] = true,
        ["Observation"] = true,
    },
    ["Sniper Fruit Shop"] = {
        ["Enabled"] = true, -- Auto Buy Fruit in Shop Mirage and Normal
        ["Fruit"] = {"Leopard-Leopard","Kitsune-Kitsune","Dragon-Dragon","Yeti-Yeti","Gas-Gas"},
    },
    ["Lock Fruit"] = {},
    ["Webhook"] = {
        ["Enabled"] = false,
        ["WebhookUrl"] = "",
    }
}

loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/main/BananaCat-kaitunBF.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-crystal-kaitun",
      title: "Crystal Kaitun Blox Fruit (PhucShin)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Kaitun", "Auto Farm", "Config Đầy Đủ"],
      description: "Kaitun làm nhiệm vụ tộc V2, V3, Haki 7 màu, gạt cần Cổng Gạt (Pull Lever), farm full 19+ kiếm và full súng, có FPS booster.",
      keyLink: "",
      isFavorite: true,
      script: `getgenv().Configs = {
    ["Quest"] = {
        ["Evo Race V2"] = true;
        ["Evo Race V3"] = true;
        ["RGB Haki"] = true;
        ["Pull Lerver"] = true;
    };
    ["Webhook"] = {
        ["Url Webhook"] = "";
        ["Ping discord"] = "";      
        ["Time Send"] = "10m";
    };
    ["Sword"] = {
        "Dual-Headed Blade", "Smoke Admiral", "Wardens Sword", "Cutlass", "Katana",
        "Dual Katana", "Triple Katana", "Iron Mace", "Saber", "Pole (1st Form)",
        "Gravity Blade", "Longsword", "Rengoku", "Midnight Blade", "Soul Cane",
        "Bisento", "Yama", "Tushita", "Cursed Dual Katana"
    };
    ["Gun"] = {
        "Skull Guitar", "Kabucha", "Venom Bow", "Musket", "Flintlock",
        "Refined Slingshot", "Magma Blaster", "Dual Flintlock", "Cannon",
        "Bizarre Revolver", "Bazooka"
    };
    ["FPS Booster"] = true;
};
loadstring(game:HttpGet("https://raw.githubusercontent.com/shinichi-dz/phucshinsayhi/refs/heads/main/KaitunBloxFruit.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-simple-kaitun",
      title: "Simple Hub Kaitun (Godhuman & Mastery)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Kaitun", "Auto Farm", "Config Đầy Đủ"],
      description: "Auto cày Mastery vũ khí, tự đi Raid Legit, tự mở khóa Godhuman, Race V3, farm CDK, Shark Anchor, Soul Guitar, Haki Color, snipe Trái Rồng/Dough/Buddha.",
      keyLink: "",
      isFavorite: true,
      script: `getgenv().simple_settings = {
    ["MASTERY"] = {
        ["ACTIVE"] = true,
        ["METHOD"] = "Half", -- "Half"[350] or "Full"[600]
    },
    ["RAID"] = {
        ["MODE"] = "Legit", -- Legit / KillAura
    },
    ["OBJECTIVE"] = {
        ["GODHUMAN"] = true,
        ["RACE-CONFIGURE"] = {
            ["RACE"] = {"Human", "Skypiea", "Fishman", "Mink"},
            ["RACE-LOCK"] = true,
            ["RACE-V3"] = true,
        },
        ["FRAGMENT"] = 100000,
        ["CANVANDER"] = true,
        ["BUDDY-SWORD"] = true,
        ["CURSED-DUAL-KATANA"] = true,
        ["SHARK-ANCHOR"] = true,
        ["ACIDUM-RIFLE"] = true,
        ["VENOM-BOW"] = true,
        ["SOUL-GUITAR"] = true,
        ["COLOR-HAKI"] = {"Pure Red","Winter Sky","Snow White"},
    },
    ["FRUITPURCHASE"] = true,
    ["PRIORITYFRUIT"] = {
        [1] = "Dragon-Dragon",
        [2] = "Dough-Dough",
        [3] = "Flame-Flame",
        [4] = "Rumble-Rumble",
        [5] = "Human-Human: Buddha",
        [6] = "Dark-Dark",
    },
    ["FPSCAP"] = 30,
    ["LOWTEXTURE"] = true
}
loadstring(game:HttpGet("https://raw.githubusercontent.com/simple-hubs/contents/refs/heads/main/bloxfruit-kaitan-main.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-xero-kaitun",
      title: "Xero Kaitun (Max Level, Godhuman, CDK, SGT)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Kaitun", "Auto Farm", "Hop Server", "Config Đầy Đủ"],
      description: "Bản Kaitun đầy đủ nhất của Xero: Auto Max Level, Cursed Dual Katana, Soul Guitar, Godhuman, Awakening Fruit, Rainbow Haki, tự đổi server tìm Tushita/Valkyrie Helm/Mirror Fractal.",
      keyLink: "",
      isFavorite: true,
      script: `-- Max level, godhuman, cdk, sgt
script_key = "" -- premium only, u can leave it blank if ur not
getgenv().Shutdown = false -- Turn on if u are farming bulk accounts
getgenv().Configs = {
    ["Team"] = "Marines",
    ["FPS Boost"] = {
        ["Enable"] = false,
        ["FPS Cap"] = 30,
    },
    ["Farm Boss Drops"] = {
        ["Enable"] = false,
        ["When x2 Exp Expired"] = false
    },
    ["Hop"] = { -- premium only
        ["Enable"] = true,
        ["Hop Find Tushita"] = true,
        ["Hop Find Valkyrie Helm"] = true,
        ["Hop Find Mirror Fractal"] = true
    },
    ["Farm Mastery"] = {
        ["Enable"] = true,
        ["Farm Mastery Weapons"] = {"Sword", "Gun", "Blox Fruit"},
        ["Swords To Farm"] = {"Cursed Dual Katana"},
        ["Guns To Farm"] = {"Skull Guitar"},
        ["Mastery Health (%)"] = 40
    },
    ["Auto Collect Berry"] = false,
    ["Auto Evo Race"] = true,
    ["Awaken Fruit"] = true,
    ["Rainbow Haki"] = true,
    ["Hop Player Near"] = true,
    ["Skull Guitar"] = true,
    ["Find Fruit"] = false,
    ["Cursed Dual Katana"] = true,
    ["Switch Melee"] = true,
    ["Eat Fruit"] = "",
    ["Snipe Fruit"] = "",
    ["Lock Fragment"] = 0,
    ["Buy Stuffs"] = true
}
repeat task.wait() pcall(function() loadstring(game:HttpGet("https://raw.githubusercontent.com/Xero2409/XeroHub/refs/heads/main/kaitun.lua"))() end) until getgenv().Check_Execute`,
      createdAt: "2026-08-30"
    },
    {
      id: "bf-nexus",
      title: "Nexus Hub Revival (BL)",
      game: "Blox Fruits",
      category: "blox-fruits",
      tags: ["Auto Farm", "Không Key"],
      description: "Nexus Hub Revival Blox Fruits.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/CrazyHub123/NexusHubRevival/refs/heads/main/Main.lua"))()`,
      createdAt: "2026-08-30"
    },

    // --- DEAD RAILS ---
    {
      id: "dr-sterling",
      title: "Sterling New (Dead Rails 11)",
      game: "Dead Rails",
      category: "dead-rails",
      tags: ["Auto Farm", "Không Key"],
      description: "Script SterlingNew cho tựa game Dead Rails.",
      keyLink: "",
      isFavorite: true,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/Zayn31214/name/refs/heads/main/SterlingNew"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "dr-blrtbd-mobile",
      title: "BLRTBD Mobile Key Sys (Dead Rails 2)",
      game: "Dead Rails",
      category: "dead-rails",
      tags: ["Auto Farm", "Có Key"],
      description: "Script Dead Rails tối ưu cho điện thoại di động.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/selciawashere/screepts/refs/heads/main/BLRTBDMOBILEKEYSYS",true))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "dr-autobond-1",
      title: "Auto Bond 1 (Dead Rails)",
      game: "Dead Rails",
      category: "dead-rails",
      tags: ["Auto Farm"],
      description: "Script tự động nhận/farm bond Dead Rails.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/thiennrb7/Script/refs/heads/main/autobond"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "dr-autobond-2",
      title: "Auto Bond 2 (Ngon hơn / Bản VIP)",
      game: "Dead Rails",
      category: "dead-rails",
      tags: ["Auto Farm", "Không Key"],
      description: "Bản Auto Bond Dead Rails mượt hơn, nhanh hơn và ổn định.",
      keyLink: "",
      isFavorite: true,
      script: `loadstring(game:HttpGet('https://raw.githubusercontent.com/SevenIsYouScripts/Main/refs/heads/main/Auto%20Bonds%20Script'))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "dr-killaura",
      title: "Kill Aura (Null-Fire / DingaScripts)",
      game: "Dead Rails",
      category: "dead-rails",
      tags: ["Mob Aura", "PvP / Aim"],
      description: "Tự động đánh và tiêu diệt quái vật xung quanh trong Dead Rails.",
      keyLink: "",
      isFavorite: true,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/InfernusScripts/Null-Fire/main/Loader"))("DingaScripts")`,
      createdAt: "2026-08-30"
    },
    {
      id: "dr-tpend",
      title: "TP End (Dịch chuyển về đích)",
      game: "Dead Rails",
      category: "dead-rails",
      tags: ["Teleport"],
      description: "Script Teleport thẳng về cuối màn chơi Dead Rails.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/JonasThePogi/DeadRails/refs/heads/main/newloadstring"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "dr-tplang",
      title: "TP Làng / Bank TP",
      game: "Dead Rails",
      category: "dead-rails",
      tags: ["Teleport"],
      description: "Teleport đến ngân hàng và các địa điểm làng trong Dead Rails.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/ringtaa/Tptobank.github.io/refs/heads/main/Banktp.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "dr-autowin",
      title: "Auto Win Dead Rails",
      game: "Dead Rails",
      category: "dead-rails",
      tags: ["Auto Farm", "Teleport"],
      description: "Script tự động hoàn thành và giành chiến thắng map Dead Rails.",
      keyLink: "",
      isFavorite: true,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/gumanba/Scripts/main/DeadRails"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "dr-class-ngua",
      title: "Lấy Class Ngựa (XuanVPPHUB)",
      game: "Dead Rails",
      category: "dead-rails",
      tags: ["Auto Farm"],
      description: "Script XuanVP HUB hỗ trợ lấy class ngựa trong Dead Rails.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/XUANVNPRO/XuanVPHUB/a322d4f50abcd7fcaecf0ff7d36adc5f6e7604ee/XuanVPPHUB.lua.txt"))()`,
      createdAt: "2026-08-30"
    },

    // --- FISCH ---
    {
      id: "fisch-free",
      title: "Fisch Free Script (Lythicals)",
      game: "Fisch",
      category: "fisch",
      tags: ["Auto Farm", "Có Key"],
      description: "Script câu cá tự động Fisch với key nạp sẵn.",
      keyLink: "",
      isFavorite: true,
      script: `script_key="qdZaPkLBjadMLqmaKRzvPKJfpQADeXFe";
loadstring(game:HttpGet("https://raw.githubusercontent.com/Lythicals/script/refs/heads/main/free.lua"))()`,
      createdAt: "2026-08-30"
    },

    // --- ARISE ---
    {
      id: "arise-goomba",
      title: "Arise Crossover (Goomba Hub)",
      game: "Arise",
      category: "arise",
      tags: ["Auto Farm", "Không Key"],
      description: "Goomba Hub tự động farm cho Arise Crossover.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/JustLevel/goombahub/main/AriseCrossover.lua"))()`,
      createdAt: "2026-08-30"
    },

    // --- PLS DONATE ---
    {
      id: "pls-donate-mozil",
      title: "Pls Donate (MozilHub)",
      game: "Pls Donate",
      category: "pls-donate",
      tags: ["Auto Farm", "Không Key"],
      description: "Script MozilHub tự động dựng quầy và xin donate.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/MozilOnTopp/MozilHub/refs/heads/main/PlsDonate"))()`,
      createdAt: "2026-08-30"
    },

    // --- GROW A GARDEN ---
    {
      id: "gag-native",
      title: "Grow a Garden (Native Loader)",
      game: "Grow a Garden",
      category: "grow-a-garden",
      tags: ["Auto Farm", "Có Key"],
      description: "Native Loader cho Grow a Garden (GAG) - Điền key từ link bên dưới.",
      keyLink: "https://ads.luarmor.net/get_key?for=Native_Lootlabs-hgTHxCASTxVE",
      isFavorite: false,
      script: `script_key="PASTEKEYHERE";
(loadstring or load)(game:HttpGet("https://getnative.cc/script/loader"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "gag-ameicaa",
      title: "Grow a Garden (Ameicaa Hub)",
      game: "Grow a Garden",
      category: "grow-a-garden",
      tags: ["Auto Farm", "Không Key"],
      description: "Script Ameicaa cho Grow a Garden.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://raw.githubusercontent.com/tesghg/Grow-a-Garden/main/ameicaa_Grow_A_Garden.lua"))()`,
      createdAt: "2026-08-30"
    },

    // --- 99 NIGHTS IN THE FOREST ---
    {
      id: "99n-vector",
      title: "Kaitun Farm Diamond 99 Day (Vector Hub)",
      game: "99 Nights in the Forest",
      category: "99-nights",
      tags: ["Kaitun", "Auto Farm", "Config Đầy Đủ"],
      description: "Vector Hub tự động cày kim cương 99 ngày rừng rậm kèm thông báo Discord Webhook.",
      keyLink: "",
      isFavorite: true,
      script: `getgenv().V = "Kaitundiamond" --Delete if not using kaitun version
getgenv().Webhookurl = "https://discord.com/api/webhooks/1411353511769276456/u6ix3Zi4hfgevKt3PRuQ2pEfupjqkFhDyW6WeFvHtlEJyBeD3YaXveCR7ictHukGcmsg" --Delete if not using Webhook
loadstring(game:HttpGet("https://raw.githubusercontent.com/AAwful/Vector_Hub/0/v2"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "99n-rawscripts",
      title: "99 Nights Farm Diamond v2",
      game: "99 Nights in the Forest",
      category: "99-nights",
      tags: ["Auto Farm", "Không Key"],
      description: "Bản script farm kim cương v2 trên RawScripts.",
      keyLink: "",
      isFavorite: false,
      script: `loadstring(game:HttpGet("https://rawscripts.net/raw/99-Nights-in-the-Forest-Farm-diamond-v2-50169"))()`,
      createdAt: "2026-08-30"
    },

    // --- DEV TOOLS / TIỆN ÍCH ---
    {
      id: "dev-dex",
      title: "Dex Explorer v3 (Soi cấu trúc game)",
      game: "Dev Tools",
      category: "dev-tools",
      tags: ["Mob Aura", "Teleport", "Không Key"],
      description: "Bộ công cụ soi cấu trúc Workspace, ReplicatedStorage, Players, Remotes trong game Roblox.",
      keyLink: "",
      isFavorite: true,
      script: `-- 1. Mở Dex Explorer (Dùng để soi cấu trúc game)
loadstring(game:HttpGet("https://raw.githubusercontent.com/infyiff/backup/main/dex.lua"))()`,
      createdAt: "2026-08-30"
    },
    {
      id: "dev-simplespy",
      title: "SimpleSpy v3 (Bắt Remote & Packet)",
      game: "Dev Tools",
      category: "dev-tools",
      tags: ["Mob Aura", "Teleport", "Không Key"],
      description: "Công cụ bắt lệnh Đánh, Nhận nhiệm vụ, Mua đồ, FireServer, InvokeServer trong Roblox.",
      keyLink: "",
      isFavorite: true,
      script: `-- 2. Mở SimpleSpy (Dùng để bắt lệnh Đánh/Nhận nhiệm vụ)
loadstring(game:HttpGet("https://raw.githubusercontent.com/78n/SimpleSpy/main/SimpleSpySource.lua"))()`,
      createdAt: "2026-08-30"
    }
  ],

  // Danh sách tài khoản đã có
  accounts: [
    {
      id: "acc-1",
      username: "framdeadraild",
      password: "010203040506070809",
      game: "Dead Rails",
      purpose: "Nick farm Dead Rails",
      status: "active",
      notes: "Treo farm bond & auto win map Dead Rails",
      createdAt: "2026-08-30"
    },
    {
      id: "acc-2",
      username: "asfcasad",
      password: "235689147",
      game: "Khác",
      purpose: "Nick bán gem",
      status: "active",
      notes: "Chuyên trữ và giao dịch gem",
      createdAt: "2026-08-30"
    },
    {
      id: "acc-3",
      username: "avhiben",
      password: "lahchabafd",
      game: "Blox Fruits",
      purpose: "Acc Blox Fruit 1",
      status: "farming",
      notes: "Acc kaitun Blox Fruits",
      createdAt: "2026-08-30"
    },
    {
      id: "acc-4",
      username: "hjbvhjja",
      password: "jhabvjhbadv",
      game: "Blox Fruits",
      purpose: "Acc Blox Fruit 2",
      status: "farming",
      notes: "Acc phụ chạy script",
      createdAt: "2026-08-30"
    }
  ],

  // Link Cloud & Treo game
  cloudLinks: [
    {
      id: "cloud-1",
      title: "LT4C Cloud Dashboard (PC Free)",
      type: "cloud",
      url: "https://dash.lt4c.io.vn/dashboard",
      platform: "PC",
      pricing: "Miễn phí (Free)",
      description: "Dịch vụ VPS / Cloud treo game PC miễn phí."
    },
    {
      id: "cloud-2",
      title: "MaxCloudPhone Store (Cloud Phone)",
      type: "cloud",
      url: "https://app.maxcloudphone.com/store",
      platform: "Điện thoại Android",
      pricing: "Có phí (Paid)",
      description: "Cloud phone Android treo Roblox 24/7 không hao pin điện thoại thật."
    },
    {
      id: "cloud-3",
      title: "EzyCloudX GPU VM (PC GPU)",
      type: "cloud",
      url: "https://www.ezycloudx.com/console/gpu-vm",
      platform: "PC (Có Card GPU)",
      pricing: "Có phí (Paid)",
      description: "Cloud máy ảo PC có GPU mạnh mẽ chuyên treo nhiều tab giả lập / Roblox."
    },
    {
      id: "client-1",
      title: "Volcano Client (Chạy được Banana Hub)",
      type: "client",
      url: "https://gofile.io/d/Z6GPy8",
      platform: "Android / Emulator",
      pricing: "Free",
      description: "Executor hỗ trợ chạy mượt mà Banana Hub và các script nặng."
    },
    {
      id: "client-2",
      title: "Swift Client",
      type: "client",
      url: "https://gofile.io/d/igQQDZ",
      platform: "Android / Emulator",
      pricing: "Free",
      description: "Executor Swift ổn định cho thiết bị di động."
    }
  ],

  // Ghi chú săn Leviathan
  notes: [
    {
      id: "note-levi",
      title: "Lưu ý Tuyển Chân Săn Leviathan (Hydra PS)",
      content: `Tuyển chân chạy việc Levi về Hydra có Private Server:
✿ Chứng minh không bị CD bằng hình ảnh + thời gian thực hoặc chat "CCCP" lên khung chat.
✿ Chỉ tuyển đủ 6 nhân công (không trả lời khi full-slot).
✿ Hỗ trợ mua chuộc 1 lần (bao được thì xịn).
✿ Có hack thì đi hack, không thì đi chay (khuyến khích đi chay).
✿ Đủ người là không rep.
✿ Sài gì cũng được đừng biến rồng nguyên con là được.
✿ Có Terror thịt Terror. Dm để xin 1 chân.
Cre: CCCP`
    }
  ]
};
