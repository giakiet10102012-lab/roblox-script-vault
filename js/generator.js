/**
 * Thuật toán tạo Roblox Username ngẫu nhiên và Mật khẩu 8 ký tự
 */
const RobloxGenerator = {
  // Bảng ký tự
  consonants: "bcdfghjklmnpqrstvwxyz",
  vowels: "aeiou",
  alphanumeric: "abcdefghijklmnopqrstuvwxyz0123456789",
  lettersUpper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lettersLower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",

  /**
   * Tạo Username ngẫu nhiên ghép từ chữ và số (tuân thủ quy tắc Roblox: 3-20 ký tự)
   * @param {Object} options 
   * @returns {string}
   */
  generateUsername(options = {}) {
    const mode = options.mode || "random-alphanumeric"; // 'random-alphanumeric' | 'syllables' | 'prefix-random'
    const length = Math.max(5, Math.min(18, options.length || 8));

    let username = "";

    if (mode === "syllables") {
      // Ghép âm tiết ngẫu nhiên dễ nhớ + số
      const sylCount = Math.floor(length / 3);
      for (let i = 0; i < sylCount; i++) {
        const c = this.consonants[Math.floor(Math.random() * this.consonants.length)];
        const v = this.vowels[Math.floor(Math.random() * this.vowels.length)];
        username += c + v;
      }
      // Thêm số ngẫu nhiên cho đủ độ dài
      while (username.length < length) {
        username += this.numbers[Math.floor(Math.random() * this.numbers.length)];
      }
    } else if (mode === "prefix-random") {
      // Prefix như kaitun/farm + chuỗi ngẫu nhiên
      const prefixes = ["farm", "kt", "rbx", "acc", "clone", "bot", "auto", "nb", "pro"];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      username = prefix;
      while (username.length < length) {
        username += this.alphanumeric[Math.floor(Math.random() * this.alphanumeric.length)];
      }
    } else {
      // Mặc định: Ghép hoàn toàn ngẫu nhiên chữ cái và số không có nghĩa (ví dụ: k8x9m2a4, ab34kx91, vx7q9pl1)
      // Ký tự đầu tiên nên là chữ cái theo chuẩn đặt tên đẹp
      username += this.lettersLower[Math.floor(Math.random() * this.lettersLower.length)];
      for (let i = 1; i < length; i++) {
        username += this.alphanumeric[Math.floor(Math.random() * this.alphanumeric.length)];
      }
    }

    // Đảm bảo không quá 20 ký tự và không dưới 3 ký tự
    return username.substring(0, 20);
  },

  /**
   * Tạo Mật khẩu ngẫu nhiên độ dài 8 ký tự (hoặc tùy chỉnh)
   * @param {number} length Mặc định 8 ký tự
   * @param {Object} options 
   * @returns {string}
   */
  generatePassword(length = 8, options = {}) {
    const useMixedCase = options.useMixedCase !== false; // Chữ hoa + thường
    const useNumbers = options.useNumbers !== false; // Số

    let charset = this.lettersLower;
    if (useMixedCase) charset += this.lettersUpper;
    if (useNumbers) charset += this.numbers;

    let password = "";
    // Đảm bảo có ít nhất 1 chữ thường và 1 số
    password += this.lettersLower[Math.floor(Math.random() * this.lettersLower.length)];
    password += this.numbers[Math.floor(Math.random() * this.numbers.length)];
    if (useMixedCase) {
      password += this.lettersUpper[Math.floor(Math.random() * this.lettersUpper.length)];
    }

    while (password.length < length) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Trộn ngẫu nhiên các ký tự
    return password.split("").sort(() => 0.5 - Math.random()).join("");
  },

  /**
   * Tạo 1 cặp Combo (Username & Password)
   */
  generateCombo(userOpts = {}, passLength = 8, passOpts = {}) {
    const username = this.generateUsername(userOpts);
    const password = this.generatePassword(passLength, passOpts);
    return {
      username,
      password,
      combo: `${username}:${password}`
    };
  },

  /**
   * Tạo danh sách nhiều combo cùng lúc (Batch generation)
   */
  generateBatch(count = 10, userOpts = {}, passLength = 8, passOpts = {}) {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(this.generateCombo(userOpts, passLength, passOpts));
    }
    return list;
  }
};
