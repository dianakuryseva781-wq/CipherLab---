class GameState {
    constructor() {
        this.STORAGE_KEY = 'cipherlab_v10_state'; this.NAMES_KEY = 'cipherlab_v10_names';
        this.agent = null; this.messages = [];
        this.stats = { intercepted: 0, decrypted: 0, earned: 0, level: 1, xp: 0, totalAttempts: 0, perfectDecrypts: 0 };
        this.currentMessage = null; this.ownedItems = {}; this.hints = 3;
        this.activeStatus = null;
        this.lastAdBonus = null; // Время последнего бонуса за рекламу
        this.adBonusAvailable = true; // Доступен ли бонус
        this.DEV_NAME = 'NeonCipher_ByteStorm';
        this.load();
    }

    isNameTaken(n) { const l = n.toLowerCase(); if (l === this.DEV_NAME.toLowerCase()) return true; return (JSON.parse(localStorage.getItem(this.NAMES_KEY) || '[]')).includes(l); }
    nameExists(n) { const l = n.toLowerCase(); if (l === this.DEV_NAME.toLowerCase()) return true; return (JSON.parse(localStorage.getItem(this.NAMES_KEY) || '[]')).includes(l); }

    register(fullName) {
        if (this.isNameTaken(fullName)) return { success: false, error: 'Имя занято.' };
        if (!/^[a-zA-Zа-яА-ЯёЁ0-9]+_[a-zA-Zа-яА-ЯёЁ0-9]+$/.test(fullName)) return { success: false, error: 'Формат: Префикс_Суффикс.' };
        const taken = JSON.parse(localStorage.getItem(this.NAMES_KEY) || '[]'); taken.push(fullName.toLowerCase());
        localStorage.setItem(this.NAMES_KEY, JSON.stringify(taken));
        this.agent = { name: fullName, balance: 0, registeredAt: new Date().toISOString() };
        this.stats = { intercepted: 0, decrypted: 0, earned: 0, level: 1, xp: 0, totalAttempts: 0, perfectDecrypts: 0 };
        this.messages = []; this.ownedItems = {}; this.hints = 3; this.activeStatus = null;
        this.lastAdBonus = null; this.adBonusAvailable = true;
        this.save(); return { success: true };
    }

    login(fullName) {
        if (!this.nameExists(fullName)) return { success: false, error: 'Агент не найден.' };
        const key = 'cipherlab_user_v10_' + fullName.toLowerCase();
        const saved = localStorage.getItem(key);
        if (saved) {
            const d = JSON.parse(saved); this.agent = d.agent; this.messages = d.messages || [];
            this.stats = d.stats || { intercepted: 0, decrypted: 0, earned: 0, level: 1, xp: 0, totalAttempts: 0, perfectDecrypts: 0 };
            this.ownedItems = d.ownedItems || {}; this.hints = d.hints !== undefined ? d.hints : 3;
            this.activeStatus = d.activeStatus || null;
            this.lastAdBonus = d.lastAdBonus || null;
        } else {
            this.agent = { name: fullName, balance: 0, registeredAt: new Date().toISOString() };
            this.stats = { intercepted: 0, decrypted: 0, earned: 0, level: 1, xp: 0, totalAttempts: 0, perfectDecrypts: 0 };
            this.messages = []; this.ownedItems = {}; this.hints = 3; this.activeStatus = null;
            this.lastAdBonus = null;
        }
        if (fullName.toLowerCase() === this.DEV_NAME.toLowerCase()) { this.agent.balance = 900000; this.stats.level = 99; this.stats.xp = 999999; this.hints = 999; this.activeStatus = 'legend'; }
        this.checkAdBonus();
        this.save(); return { success: true };
    }

    // Проверка доступности бонуса за рекламу
    checkAdBonus() {
        if (!this.lastAdBonus) { this.adBonusAvailable = true; return; }
        const now = new Date();
        const diff = now - new Date(this.lastAdBonus);
        this.adBonusAvailable = diff > 3600000; // Доступен раз в час
    }

    // Получить бонус за просмотр рекламы
    claimAdBonus() {
        if (!this.adBonusAvailable) return { success: false, error: 'Бонус уже получен. Приходите через час.' };
        this.hints += 2;
        this.lastAdBonus = new Date().toISOString();
        this.adBonusAvailable = false;
        this.save();
        return { success: true, reward: 2 };
    }

    logout() {
        if (this.agent) {
            const key = 'cipherlab_user_v10_' + this.agent.name.toLowerCase();
            localStorage.setItem(key, JSON.stringify({ agent: this.agent, messages: this.messages, stats: this.stats, ownedItems: this.ownedItems, hints: this.hints, activeStatus: this.activeStatus, lastAdBonus: this.lastAdBonus }));
        }
        this.agent = null; this.messages = []; this.stats = { intercepted: 0, decrypted: 0, earned: 0, level: 1, xp: 0, totalAttempts: 0, perfectDecrypts: 0 };
        this.currentMessage = null; this.ownedItems = {}; this.hints = 3; this.activeStatus = null;
        this.lastAdBonus = null; this.adBonusAvailable = true;
        localStorage.removeItem(this.STORAGE_KEY);
    }

    useHint() { if (this.hints <= 0) return false; this.hints--; this.save(); return true; }
    addHints(c) { this.hints += c; this.save(); }

    addMessage(msg) {
        const m = { id: Date.now() + Math.random(), plainText: msg.text, cipherText: msg.cipherText, type: msg.type, difficulty: msg.difficulty || 1, reward: msg.reward || 50, params: msg.params || {}, status: 'intercepted', interceptedAt: new Date().toISOString() };
        this.messages.unshift(m); this.stats.intercepted++; this.save(); return m;
    }

    markDecrypted(id, perfect = false) {
        const m = this.messages.find(x => x.id === id);
        if (m && m.status !== 'decrypted') { m.status = 'decrypted'; this.stats.decrypted++; this.stats.totalAttempts++; if (perfect) this.stats.perfectDecrypts++; this.addXP(m.difficulty * 20); this.save(); }
    }

    sellMessage(id) {
        const m = this.messages.find(x => x.id === id);
        if (m && m.status === 'decrypted') {
            let r = m.reward;
            if (this.ownedItems['double_reward'] > 0) { r *= 2; this.ownedItems['double_reward']--; if (this.ownedItems['double_reward'] <= 0) delete this.ownedItems['double_reward']; }
            this.agent.balance += r; this.stats.earned += r; this.messages = this.messages.filter(x => x.id !== id); this.save(); return { success: true, reward: r };
        }
        return { success: false, reward: 0 };
    }

    addXP(amount) {
        if (this.ownedItems['xp_boost'] > 0) { amount = Math.floor(amount * 1.5); this.ownedItems['xp_boost']--; if (this.ownedItems['xp_boost'] <= 0) delete this.ownedItems['xp_boost']; }
        this.stats.xp += amount; let xpNeeded = this.stats.level * 150;
        while (this.stats.xp >= xpNeeded) { this.stats.xp -= xpNeeded; this.stats.level++; xpNeeded = this.stats.level * 150; }
        this.save();
    }

    getItemCount(id) { return this.ownedItems[id] || 0; }

    buyItem(id, cost, isPermanent = false, statusClass = null) {
        if (this.agent.balance < cost) return { success: false, error: 'Недостаточно средств' };
        if (isPermanent && this.hasItem(id)) return { success: false, error: 'Уже куплено.' };
        this.agent.balance -= cost;
        if (isPermanent) {
            this.ownedItems[id] = 1;
            ['premium_badge', 'elite_badge', 'legend_badge'].forEach(sid => { if (sid !== id) delete this.ownedItems[sid]; });
            if (statusClass) this.activeStatus = statusClass.replace('status-', '');
        } else {
            this.ownedItems[id] = (this.ownedItems[id] || 0) + 1;
        }
        this.save(); return { success: true };
    }

    hasItem(id) { return (this.ownedItems[id] || 0) > 0; }
    getInterceptedMessages() { return this.messages.filter(m => m.status === 'intercepted' || m.status === 'decrypted'); }

    getAdBonusStatus() {
        this.checkAdBonus();
        return { available: this.adBonusAvailable, lastClaim: this.lastAdBonus };
    }

    save() {
        if (!this.agent) return;
        const key = 'cipherlab_user_v10_' + this.agent.name.toLowerCase();
        localStorage.setItem(key, JSON.stringify({ agent: this.agent, messages: this.messages, stats: this.stats, ownedItems: this.ownedItems, hints: this.hints, activeStatus: this.activeStatus, lastAdBonus: this.lastAdBonus, version: '10.0' }));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ currentUser: this.agent.name }));
    }

    load() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) { const d = JSON.parse(raw); if (d.currentUser) {
                const key = 'cipherlab_user_v10_' + d.currentUser.toLowerCase(); const ud = localStorage.getItem(key);
                if (ud) { const p = JSON.parse(ud); this.agent = p.agent || null; this.messages = p.messages || [];
                    this.stats = p.stats || { intercepted: 0, decrypted: 0, earned: 0, level: 1, xp: 0, totalAttempts: 0, perfectDecrypts: 0 };
                    this.ownedItems = p.ownedItems || {}; this.hints = p.hints !== undefined ? p.hints : 3;
                    this.activeStatus = p.activeStatus || null; this.lastAdBonus = p.lastAdBonus || null;
                    this.checkAdBonus();
                    if (this.agent && this.agent.name.toLowerCase() === this.DEV_NAME.toLowerCase()) { this.agent.balance = 900000; this.stats.level = 99; this.stats.xp = 999999; this.hints = 999; this.activeStatus = 'legend'; this.save(); }
                }
            }}
        } catch (e) {}
    }
}

const Game = new GameState();
window.Game = Game;