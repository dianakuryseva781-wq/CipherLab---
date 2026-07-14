const ShopItems = [
    { id: 'hints_3', name: '3 подсказки', icon: '💡', desc: 'Добавляет 3 подсказки.', basePrice: 60, priceMultiplier: 1.5, effect: '+3 подсказки', type: 'consumable', permanent: false, onBuy: (g) => g.addHints(3) },
    { id: 'hints_10', name: '10 подсказок', icon: '💡💡', desc: 'Добавляет 10 подсказок.', basePrice: 180, priceMultiplier: 1.5, effect: '+10 подсказок', type: 'consumable', permanent: false, onBuy: (g) => g.addHints(10) },
    { id: 'double_reward', name: 'Двойная награда', icon: '💰', desc: 'x2 награда за следующую продажу.', basePrice: 200, priceMultiplier: 1.8, effect: '1 использование', type: 'consumable', permanent: false },
    { id: 'xp_boost', name: 'Ускоритель опыта', icon: '🚀', desc: '+50% XP за следующую расшифровку.', basePrice: 180, priceMultiplier: 1.7, effect: '1 использование', type: 'consumable', permanent: false },
    { id: 'premium_badge', name: 'Премиум-статус', icon: '👑', desc: 'Золотое свечение имени.', basePrice: 500, priceMultiplier: 1, effect: 'Навсегда', type: 'permanent', permanent: true, statusClass: 'status-premium' },
    { id: 'elite_badge', name: 'Элитный-статус', icon: '💜', desc: 'Фиолетовое свечение имени.', basePrice: 800, priceMultiplier: 1, effect: 'Навсегда', type: 'permanent', permanent: true, statusClass: 'status-elite' },
    { id: 'legend_badge', name: 'Легендарный-статус', icon: '🌈', desc: 'Радужное свечение имени.', basePrice: 1500, priceMultiplier: 1, effect: 'Навсегда', type: 'permanent', permanent: true, statusClass: 'status-legend' },
    { id: 'auto_sell', name: 'Авто-продажа', icon: '🤖', desc: 'Автоматически продаёт расшифрованные сообщения.', basePrice: 400, priceMultiplier: 1, effect: 'Навсегда', type: 'permanent', permanent: true },
    { id: 'lucky_scan', name: 'Удачное сканирование', icon: '🍀', desc: '+25% шанс получить редкое задание.', basePrice: 350, priceMultiplier: 1, effect: 'Навсегда', type: 'permanent', permanent: true }
];

function getItemPrice(item, count) {
    if (item.permanent && count > 0) return 0;
    return Math.floor(item.basePrice * Math.pow(item.priceMultiplier, count));
}

window.ShopItems = ShopItems;
window.getItemPrice = getItemPrice;