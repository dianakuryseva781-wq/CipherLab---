const UI = {
    showPage(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const page = document.getElementById('page' + id.charAt(0).toUpperCase() + id.slice(1));
        if (page) page.classList.add('active');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === id));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    updateAll() { this.updateHeader(); this.updateDesktop(); },
    updateHeader() {
        const a = Game.agent;
        const n = document.getElementById('headerAgentName'), b = document.getElementById('headerBalance'),
              l = document.getElementById('headerLevel'), h = document.getElementById('headerHints'),
              ap = document.getElementById('agentPanel'), mn = document.getElementById('mainNav');
        if (a) {
            n.textContent = a.name; b.textContent = `₿${a.balance}`;
            l.textContent = `Ур.${Game.stats.level}`; h.textContent = `💡${Game.hints}`;
            ap.style.display = 'flex'; mn.style.display = 'flex';
            n.className = 'agent-name';
            if (Game.activeStatus === 'premium') n.classList.add('status-premium');
            else if (Game.activeStatus === 'elite') n.classList.add('status-elite');
            else if (Game.activeStatus === 'legend') n.classList.add('status-legend');
        } else {
            n.textContent = '---'; n.className = 'agent-name';
            b.textContent = '₿0'; l.textContent = ''; h.textContent = '💡0';
            ap.style.display = 'none'; mn.style.display = 'none';
        }
    },
    updateDesktop() { this.renderMessages(); },
    renderMessages() {
        const g = document.getElementById('messagesGrid'), ms = Game.getInterceptedMessages();
        if (ms.length === 0) {
            g.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>Нет перехваченных сообщений</p><p class="empty-hint">Нажмите «СКАНИРОВАТЬ ЭФИР»</p></div>`;
            return;
        }
        g.innerHTML = ms.map(m => `<div class="message-card" data-id="${m.id}"><div class="msg-card-header"><span class="msg-cipher-badge ${m.type}">${Ciphers[m.type].name.toUpperCase()}</span><span class="msg-difficulty">${'★'.repeat(m.difficulty)}</span></div><div class="msg-preview">${m.cipherText.substring(0,50)}...</div><div class="msg-reward">₿${m.reward}</div>${m.status==='decrypted'?'<div class="msg-status-tag">✓</div>':''}</div>`).join('');
        g.querySelectorAll('.message-card').forEach(c => c.addEventListener('click', () => this.openDecrypt(parseFloat(c.dataset.id))));
    },
    openDecrypt(id) {
        const m = Game.messages.find(x => x.id === id); if (!m) return; Game.currentMessage = m;
        document.getElementById('encryptedDisplay').textContent = m.cipherText;
        document.getElementById('cipherTypeBadge').textContent = Ciphers[m.type].name.toUpperCase();
        document.getElementById('difficultyStars').textContent = '★'.repeat(m.difficulty);
        document.getElementById('rewardTag').textContent = `₿${m.reward}`;
        document.getElementById('decryptHintsCount').textContent = Game.hints;
        this.renderCipherTools(m);
        document.getElementById('decryptInput').value = '';
        document.getElementById('decryptFeedback').className = 'decrypt-feedback'; document.getElementById('decryptFeedback').textContent = '';
        document.getElementById('successCard').style.display = 'none';
        document.getElementById('decryptedDisplay').textContent = ''; document.getElementById('sellReward').textContent = m.reward;
        this.showPage('decrypt');
        setTimeout(() => document.getElementById('decryptInput').focus(), 300);
    },
    renderCipherTools(m) {
        const d = document.getElementById('cipherTools');
        if (m.type === 'caesar') {
            const s = m.params.shift || 0;
            let h = `<p style="color:var(--text-secondary);margin-bottom:8px;">📏 Линейка (сдвиг: <b style="color:var(--yellow);">${s}</b>)</p><div class="alphabet-ruler"><div class="ruler-row">`;
            for (const c of RU_ALPHABET) h += `<span class="ruler-cell original">${c}</span>`;
            h += '</div><div class="ruler-row">';
            for (let i = 0; i < RU_ALPHABET.length; i++) h += `<span class="ruler-cell shifted">${RU_ALPHABET[(i + s) % RU_ALPHABET.length]}</span>`;
            h += '</div></div><p style="color:var(--text-muted);font-size:0.7rem;margin-top:6px;">Верхний ряд → оригинал. Нижний → со сдвигом.</p>';
            d.innerHTML = h;
        } else if (m.type === 'atbash') {
            let h = '<p style="color:var(--text-secondary);margin-bottom:8px;">🪞 Зеркальная таблица</p><div class="alphabet-ruler"><div class="ruler-row">';
            for (const c of RU_ALPHABET) h += `<span class="ruler-cell original">${c}</span>`;
            h += '</div><div class="ruler-row">';
            for (let i = RU_ALPHABET.length-1; i >= 0; i--) h += `<span class="ruler-cell shifted">${RU_ALPHABET[i]}</span>`;
            h += '</div></div><p style="color:var(--text-muted);font-size:0.7rem;margin-top:6px;">А↔Я, Б↔Ю — зеркало.</p>';
            d.innerHTML = h;
        } else if (m.type === 'morse') {
            let h = '<p style="color:var(--text-secondary);margin-bottom:8px;">📻 Таблица Морзе</p><div class="morse-table">';
            for (const [c, code] of Object.entries(Ciphers.morse.morseMap)) {
                if (c === ' ') continue;
                h += `<div class="morse-item"><span class="morse-char">${c}</span><span class="morse-code">${code}</span></div>`;
            }
            h += '</div><p style="color:var(--text-muted);font-size:0.7rem;margin-top:6px;">• = короткий, — = длинный. / = пробел.</p>';
            d.innerHTML = h;
        }
    },
    toast(text, type = 'info') {
        const c = document.getElementById('toastContainer');
        const e = document.createElement('div'); e.className = `toast ${type}`; e.textContent = text;
        c.appendChild(e);
        const remove = () => { e.style.opacity = '0'; e.style.transition = 'opacity 0.3s'; setTimeout(() => e.remove(), 300); };
        setTimeout(remove, 3000);
    },
    openModal(id) { document.getElementById(id).classList.add('active'); },
    closeModal(id) { document.getElementById(id).classList.remove('active'); }
};
window.UI = UI;