document.addEventListener('DOMContentLoaded', () => {
    // Предотвращение двойного тапа на мобильных
    let lastTap = 0;
    document.addEventListener('touchstart', function(e) {
        const now = Date.now();
        if (now - lastTap < 300 && e.target.closest('button, .message-card, .nav-link, .reg-tab')) {
            e.preventDefault();
        }
        lastTap = now;
    }, { passive: false });

    console.log('🔐 CipherLab v1.0 DEMO — Цезарь, Атбаш, Морзе');
    console.log('👩‍💻 Разработчик: Диана Курышева • vk.com/kuryshevadiana');

    // Анимация клика
    document.addEventListener('click', function(e) {
        if (e.target.closest('button, a, input, textarea, .message-card, .modal, .nav-link, .modal-overlay, .shop-item')) return;
        const count = window.innerWidth < 768 ? 3 : 6;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            particle.style.left = e.clientX + 'px'; particle.style.top = e.clientY + 'px';
            const size = 3 + Math.random() * 5;
            particle.style.width = size + 'px'; particle.style.height = size + 'px';
            particle.style.animationDuration = (0.4 + Math.random() * 0.5) + 's';
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    });

    document.getElementById('logoHome').addEventListener('click', () => {
        if (Game.agent) { UI.showPage('desktop'); UI.updateDesktop(); } else UI.showPage('registration');
    });

    if (Game.agent) { UI.updateAll(); UI.showPage('desktop'); }
    else { UI.showPage('registration'); UI.updateHeader(); }

    // Табы
    document.querySelector('[data-tab="register"]').addEventListener('click', function() {
        this.classList.add('active'); document.querySelector('[data-tab="login"]').classList.remove('active');
        document.getElementById('formRegister').classList.add('active'); document.getElementById('formLogin').style.display = 'none';
    });
    document.querySelector('[data-tab="login"]').addEventListener('click', function() {
        this.classList.add('active'); document.querySelector('[data-tab="register"]').classList.remove('active');
        document.getElementById('formLogin').classList.add('active'); document.getElementById('formLogin').style.display = 'block';
        document.getElementById('formRegister').classList.remove('active');
    });

    const ri = document.getElementById('regCodename'), rb = document.getElementById('btnRegister'), rf = document.getElementById('regFeedback'), pn = document.getElementById('previewName');
    ri.addEventListener('input', function() {
        const pos = this.selectionStart; this.value = this.value.toUpperCase(); this.setSelectionRange(pos, pos);
        const v = this.value.trim(); pn.textContent = v || '[ВВЕДИТЕ_ИМЯ]';
        if (!v) { rf.textContent = ''; rf.className = 'reg-feedback'; rb.disabled = true; }
        else if (!/^[A-ZА-ЯЁ0-9]+_[A-ZА-ЯЁ0-9]+$/.test(v)) { rf.textContent = '❌ Формат: Префикс_Суффикс'; rf.className = 'reg-feedback error'; rb.disabled = true; }
        else if (Game.isNameTaken(v)) { rf.textContent = '❌ Занято.'; rf.className = 'reg-feedback error'; rb.disabled = true; }
        else { rf.textContent = '✅ Доступно!'; rf.className = 'reg-feedback success'; rb.disabled = false; }
    });
    rb.addEventListener('click', () => {
        const r = Game.register(ri.value.trim());
        if (r.success) { UI.updateAll(); UI.showPage('desktop'); UI.toast(`🕵️ "${ri.value.trim()}"`, 'success'); }
        else { rf.textContent = '❌ ' + r.error; rf.className = 'reg-feedback error'; }
    });

    const li = document.getElementById('loginCodename'), lb = document.getElementById('btnLogin'), lf = document.getElementById('loginFeedback');
    li.addEventListener('input', function() {
        const pos = this.selectionStart; this.value = this.value.toUpperCase(); this.setSelectionRange(pos, pos);
        lb.disabled = this.value.trim().length < 3; lf.textContent = ''; lf.className = 'reg-feedback';
    });
    lb.addEventListener('click', () => {
        const r = Game.login(li.value.trim());
        if (r.success) { UI.updateAll(); UI.showPage('desktop'); UI.toast('🔑 С возвращением!', 'success'); }
        else { lf.textContent = '❌ ' + r.error; lf.className = 'reg-feedback error'; }
    });
    [ri, li].forEach(inp => inp.addEventListener('keypress', e => {
        if (e.key === 'Enter') { if (inp === ri && !rb.disabled) rb.click(); if (inp === li && !lb.disabled) lb.click(); }
    }));

    // Сканирование
    document.getElementById('btnScanEther').addEventListener('click', function() {
        this.disabled = true; this.innerHTML = '⏳ СКАНИРОВАНИЕ...';
        setTimeout(() => {
            let t = MessageBank.getRandom();
            if (Game.hasItem('lucky_scan') && Math.random() < 0.25) {
                const exp = MessageBank.getAll().filter(m => m.difficulty >= 3);
                if (exp.length > 0) t = exp[Math.floor(Math.random() * exp.length)];
            }
            const c = Ciphers[t.type]; const e = c.encrypt(t.text, t.shift || undefined);
            Game.addMessage({ ...t, cipherText: e.cipherText, params: e.params });
            UI.updateDesktop(); UI.toast(`📡 ${Ciphers[t.type].name}`, 'info');
            this.disabled = false; this.innerHTML = '⚡ СКАНИРОВАТЬ ЭФИР';
        }, 700 + Math.random() * 1000);
    });

    document.getElementById('btnBackToDesktop').addEventListener('click', () => { UI.showPage('desktop'); UI.updateDesktop(); });

    // Подсказка
    document.getElementById('btnShowHint').addEventListener('click', () => {
        if (!Game.currentMessage) return;
        if (Game.hints <= 0) {
            document.getElementById('decryptFeedback').textContent = '💡 Нет подсказок! Заберите бонус в магазине.';
            document.getElementById('decryptFeedback').className = 'decrypt-feedback info'; return;
        }
        const m = Game.currentMessage;
        const correct = Ciphers[m.type].decrypt(m.cipherText, m.params || {});
        const user = document.getElementById('decryptInput').value.toUpperCase();
        let hc = '', hp = 0;
        for (let i = 0; i < correct.length; i++) {
            if (i >= user.length || user[i] !== correct[i]) { hc = correct[i]; hp = i + 1; break; }
        }
        if (!hc && user.length < correct.length) { hc = correct[user.length]; hp = user.length + 1; }
        if (hc) {
            Game.useHint(); UI.updateHeader();
            document.getElementById('decryptHintsCount').textContent = Game.hints;
            document.getElementById('decryptFeedback').textContent = `💡 Буква №${hp}: "${hc}"`;
            document.getElementById('decryptFeedback').className = 'decrypt-feedback info';
        } else {
            document.getElementById('decryptFeedback').textContent = '💡 Всё верно! Нажмите Проверить.';
            document.getElementById('decryptFeedback').className = 'decrypt-feedback info';
        }
    });

    function checkDecrypt() {
        if (!Game.currentMessage) return;
        const u = document.getElementById('decryptInput').value.trim().toUpperCase();
        const fb = document.getElementById('decryptFeedback');
        if (!u) { fb.textContent = '❌ Введите текст'; fb.className = 'decrypt-feedback error'; return; }
        const c = Ciphers[Game.currentMessage.type].decrypt(Game.currentMessage.cipherText, Game.currentMessage.params || {});
        if (u.replace(/\s+/g, ' ').trim() === c.replace(/\s+/g, ' ').trim()) {
            const first = Game.currentMessage.status !== 'decrypted';
            fb.textContent = '✅ Верно!'; fb.className = 'decrypt-feedback success';
            if (first) Game.markDecrypted(Game.currentMessage.id, true);
            document.getElementById('decryptedDisplay').textContent = c;
            document.getElementById('sellReward').textContent = Game.currentMessage.reward;
            document.getElementById('successCard').style.display = 'block';
            UI.updateDesktop(); UI.toast('🔓 Расшифровано!', 'success');
            if (Game.hasItem('auto_sell')) {
                setTimeout(() => {
                    const r = Game.sellMessage(Game.currentMessage.id);
                    if (r.success) { UI.toast(`💰 +₿${r.reward}!`, 'success'); UI.updateAll(); UI.showPage('desktop'); Game.currentMessage = null; }
                }, 1500);
            }
        } else {
            Game.stats.totalAttempts++; Game.save();
            fb.textContent = '❌ Неверно. Проверьте буквы.';
            fb.className = 'decrypt-feedback error';
        }
        fb.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    document.getElementById('btnCheckDecrypt').addEventListener('click', checkDecrypt);
    const di = document.getElementById('decryptInput');
    di.addEventListener('keydown', function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); checkDecrypt(); } });
    di.addEventListener('input', function() { const pos = this.selectionStart; this.value = this.value.toUpperCase(); this.setSelectionRange(pos, pos); });

    document.getElementById('btnSellMessage').addEventListener('click', () => {
        if (!Game.currentMessage || Game.currentMessage.status !== 'decrypted') { UI.toast('Сначала расшифруйте', 'warning'); return; }
        const r = Game.sellMessage(Game.currentMessage.id);
        if (r.success) { UI.toast(`💰 +₿${r.reward}!`, 'success'); UI.updateAll(); UI.showPage('desktop'); Game.currentMessage = null; }
    });

    document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', e => { e.preventDefault(); nav(l.dataset.page); }));
    function nav(p) {
        if (p === 'desktop') { UI.showPage('desktop'); UI.updateDesktop(); }
        else if (p === 'tutorials') { UI.showPage('tutorials'); renderTutorials(); }
        else if (p === 'shop') { UI.showPage('shop'); renderShop(); }
        else if (p === 'stats') { UI.showPage('stats'); renderStats(); }
    }

    document.getElementById('btnLogout').addEventListener('click', () => UI.openModal('modalLogout'));
    document.getElementById('btnConfirmLogout').addEventListener('click', () => {
        Game.logout(); UI.closeModal('modalLogout'); UI.updateAll(); UI.showPage('registration');
        ri.value = ''; pn.textContent = '[ВВЕДИТЕ_ИМЯ]'; rf.textContent = ''; rf.className = 'reg-feedback'; rb.disabled = true;
        li.value = ''; lf.textContent = ''; lb.disabled = true;
        UI.toast('Вы вышли.', 'info');
    });
    document.getElementById('footerCommunity').addEventListener('click', e => { e.preventDefault(); UI.openModal('modalCommunity'); });
    document.querySelectorAll('.modal-close, [data-close]').forEach(b => b.addEventListener('click', () => UI.closeModal(b.dataset.close || b.closest('.modal-overlay').id)));
    document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) UI.closeModal(o.id); }));

    // Горячие клавиши
    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') { if (e.key === 'Escape') e.target.blur(); return; }
        if (!Game.agent) return;
        switch (e.key) {
            case '1': e.preventDefault(); nav('desktop'); break;
            case '2': e.preventDefault(); nav('tutorials'); break;
            case '3': e.preventDefault(); nav('shop'); break;
            case '4': e.preventDefault(); nav('stats'); break;
            case 'h': case 'H': e.preventDefault(); UI.openModal('modalHelp'); break;
            case 'Escape': e.preventDefault();
                if (document.getElementById('pageDecrypt').classList.contains('active')) { UI.showPage('desktop'); UI.updateDesktop(); }
                document.querySelectorAll('.modal-overlay.active').forEach(m => UI.closeModal(m.id)); break;
        }
    });

    function renderTutorials() {
        document.getElementById('tutorialsGrid').innerHTML = [
            { name: 'Шифр Цезаря', icon: '🏛️', desc: 'Сдвиг каждой буквы на N позиций.', example: 'Сдвиг 3: А→Г, Б→Д', history: 'Юлий Цезарь, I век до н.э.', steps: '1. Определите сдвиг\n2. Буква + сдвиг\n3. Если вышли за Я — с А' },
            { name: 'Шифр Атбаш', icon: '🪞', desc: 'Зеркальное отражение алфавита.', example: 'А↔Я, Б↔Ю', history: 'Древнееврейский шифр.', steps: '1. Запишите алфавит\n2. Переверните\n3. Заменяйте попарно' },
            { name: 'Азбука Морзе', icon: '📻', desc: 'Точки и тире для букв.', example: 'А=.-, Б=-..., Е=.', history: 'Сэмюэль Морзе, 1838.', steps: '1. Таблица кодов\n2. •=короткий, —=длинный\n3. /=пробел' }
        ].map(t => `<div class="tutorial-card"><div class="tutorial-icon">${t.icon}</div><h3 class="tutorial-name">${t.name}</h3><p class="tutorial-desc">${t.desc}</p><div class="tutorial-example"><b>Пример:</b> ${t.example}</div><div class="tutorial-history">📜 ${t.history}</div><div class="tutorial-steps"><b>Как расшифровать:</b><br>${t.steps.replace(/\n/g, '<br>')}</div></div>`).join('');
    }

    function renderShop() {
        document.getElementById('shopBalance').textContent = `₿${Game.agent ? Game.agent.balance : 0}`;
        const adStatus = Game.getAdBonusStatus();
        let adHtml = '';
        if (adStatus.available) {
            adHtml = `<div class="shop-item" style="border-color:var(--yellow);"><div class="shop-icon">📺</div><h3 class="shop-name" style="color:var(--yellow);">Бонус за рекламу</h3><p class="shop-desc">Посмотрите короткую рекламу и получите 2 подсказки.</p><p class="shop-price" style="color:var(--green);">БЕСПЛАТНО</p><p class="shop-effect">+2 подсказки (раз в час)</p><button class="btn btn-small btn-success ad-bonus-btn" style="width:100%;">📺 ЗАБРАТЬ БОНУС</button></div>`;
        } else {
            const lastTime = new Date(adStatus.lastClaim);
            const nextTime = new Date(lastTime.getTime() + 3600000);
            const remaining = Math.max(0, Math.ceil((nextTime - new Date()) / 60000));
            adHtml = `<div class="shop-item" style="opacity:0.6;"><div class="shop-icon">📺</div><h3 class="shop-name">Бонус за рекламу</h3><p class="shop-desc">Вы уже получили бонус.</p><p class="shop-price" style="color:var(--text-muted);">НЕДОСТУПНО</p><p class="shop-effect">Доступен через ~${remaining} мин.</p></div>`;
        }

        const itemsHtml = ShopItems.map(item => {
            const count = Game.getItemCount(item.id);
            const owned = item.permanent && count > 0;
            const price = owned ? 0 : getItemPrice(item, count);
            const canBuy = !owned && Game.agent && Game.agent.balance >= price;
            return `<div class="shop-item${owned ? ' owned' : ''}"><div class="shop-icon">${item.icon}</div><h3 class="shop-name">${item.name}</h3><p class="shop-desc">${item.desc}</p><p class="shop-price">${owned ? '✅ КУПЛЕНО' : '₿' + price}</p>${count > 0 && !owned ? `<p class="shop-owned">Куплено: ${count}</p>` : ''}<p class="shop-effect">${item.effect}</p>${!owned ? `<button class="btn btn-small btn-primary shop-buy-btn" data-id="${item.id}" data-price="${price}" ${!canBuy ? 'disabled' : ''}>${!canBuy ? 'НЕДОСТАТОЧНО' : 'КУПИТЬ'}</button>` : ''}</div>`;
        }).join('');

        document.getElementById('shopGrid').innerHTML = adHtml + itemsHtml;

        const adBtn = document.querySelector('.ad-bonus-btn');
        if (adBtn) {
            adBtn.addEventListener('click', function() {
                this.disabled = true; this.textContent = '📺 ЗАГРУЗКА...';
                setTimeout(() => {
                    const result = Game.claimAdBonus();
                    if (result.success) { UI.toast(`📺 +${result.reward} подсказки!`, 'success'); UI.updateHeader(); renderShop(); }
                    else { UI.toast('❌ ' + result.error, 'error'); this.disabled = false; this.textContent = '📺 ЗАБРАТЬ БОНУС'; }
                }, 3000);
            });
        }

        document.querySelectorAll('.shop-buy-btn').forEach(b => b.addEventListener('click', function() {
            const id = this.dataset.id, price = parseInt(this.dataset.price);
            const item = ShopItems.find(i => i.id === id);
            const r = Game.buyItem(id, price, item.permanent, item.statusClass || null);
            if (r.success) { if (item.onBuy) item.onBuy(Game); UI.toast(`✅ "${item.name}"!`, 'success'); UI.updateHeader(); renderShop(); }
            else UI.toast('❌ ' + (r.error || 'Ошибка'), 'error');
        }));
    }

    function renderStats() {
        const s = Game.stats, a = Game.agent;
        const xpN = s.level * 150, xpP = Math.min(100, (s.xp / xpN) * 100);
        const statusNames = { premium: '👑 Премиум', elite: '💜 Элитный', legend: '🌈 Легендарный' };
        const rows = [
            ['🕵️ Имя', a ? a.name : '---'], ['⭐ Уровень', s.level], ['✨ Опыт', `${s.xp}/${xpN}`],
            ['🏅 Статус', Game.activeStatus ? statusNames[Game.activeStatus] || Game.activeStatus : 'Нет'],
            ['📨 Перехвачено', s.intercepted], ['🔓 Расшифровано', s.decrypted],
            ['🎯 Попыток', s.totalAttempts], ['💎 Идеальных', s.perfectDecrypts],
            ['₿ Баланс', a ? a.balance : 0], ['💰 Заработано', '₿' + s.earned],
            ['💡 Подсказок', Game.hints], ['🛒 Предметов', Object.values(Game.ownedItems).reduce((a, b) => a + b, 0)]
        ];
        let h = rows.map(r => `<div class="stat-row"><span class="stat-row-label">${r[0]}</span><span class="stat-row-value">${r[1]}</span></div>`).join('');
        h += `<div class="xp-bar-container"><div class="xp-bar-label">Прогресс: ${s.xp}/${xpN} XP</div><div class="xp-bar"><div class="xp-bar-fill" style="width:${xpP}%;"></div></div><div style="text-align:right;font-size:0.65rem;color:var(--text-muted);margin-top:4px;">Ур.${s.level}→${s.level+1}</div></div>`;
        document.getElementById('statsDetailed').innerHTML = h;
    }

    console.log('✅ CipherLab готов — ПК и телефон');
});