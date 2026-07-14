// ============================================
// js/messages.js — Банк сообщений (Цезарь, Атбаш, Морзе)
// ============================================

const MessageBank = (function() {
    const subjects = [
        'АГЕНТ', 'ОПЕРАЦИЯ', 'ГРУЗ', 'ПАРОЛЬ', 'ШИФР', 'ДАННЫЕ', 'ЦЕЛЬ',
        'СВЯЗНОЙ', 'РЕЗИДЕНТ', 'КОНТАКТ', 'ЯВКА', 'ДОКУМЕНТ', 'АРХИВ',
        'КОД', 'СИГНАЛ', 'ПЕРЕХВАТ', 'РАЗВЕДКА', 'ДОЗОР', 'ПЕРИМЕТР',
        'ШТАБ', 'БАЗА', 'ЛАБОРАТОРИЯ', 'ПРОТОКОЛ', 'МАРШРУТ', 'СЕКТОР',
        'КАНАЛ', 'ЧАСТОТА', 'КЛЮЧ', 'СЕЙФ', 'ТЕРМИНАЛ', 'СПУТНИК',
        'РАДИСТ', 'ШИФРОВАЛЬЩИК', 'КУРЬЕР', 'НАБЛЮДАТЕЛЬ', 'КОМАНДИР'
    ];

    const actions = [
        'ЗАПУЩЕН', 'ЗАВЕРШЕН', 'ПЕРЕДАН', 'ПОЛУЧЕН', 'РАСКРЫТ', 'ЗАХВАЧЕН',
        'ОБНАРУЖЕН', 'ПЕРЕХВАЧЕН', 'РАСШИФРОВАН', 'УНИЧТОЖЕН', 'ЭВАКУИРОВАН',
        'ЗАБЛОКИРОВАН', 'ПОДТВЕРЖДЁН', 'ОТМЕНЁН', 'ИЗМЕНЁН', 'СОХРАНЁН',
        'ВЗЛОМАН', 'ВОССТАНОВЛЕН', 'ПРОВЕРЕН', 'ОТПРАВЛЕН', 'АКТИВИРОВАН',
        'ДЕАКТИВИРОВАН', 'ЗАДЕРЖАН', 'ОСВОБОЖДЁН', 'ЗАМАСКИРОВАН'
    ];

    const locations = [
        'В ТОЧКЕ Б', 'В СЕКТОРЕ ГАММА', 'НА БАЗЕ АЛЬФА', 'У ФОНТАНА',
        'НА МОСТУ', 'В ПАРКЕ', 'У СТАНЦИИ', 'В ПОРТУ', 'НА КРЫШЕ',
        'В ПОДВАЛЕ', 'В БУНКЕРЕ', 'НА СКЛАДЕ', 'В ЛЕСУ', 'У РЕКИ',
        'НА ГРАНИЦЕ', 'В ЦЕНТРЕ', 'У БАШНИ', 'В ТОННЕЛЕ', 'НА ПЛОЩАДИ',
        'В АЭРОПОРТУ', 'НА ВОКЗАЛЕ', 'В ПОСОЛЬСТВЕ', 'У БОЛЬНИЦЫ',
        'НА ЗАВОДЕ', 'В ШКОЛЕ', 'У БАНКА', 'В ГОСТИНИЦЕ', 'НА СТАДИОНЕ'
    ];

    const times = [
        'В ПОЛДЕНЬ', 'В ПОЛНОЧЬ', 'НА РАССВЕТЕ', 'В ТРИ ЧАСА',
        'В ПЯТЬ УТРА', 'В ДЕВЯТЬ ВЕЧЕРА', 'ЗАВТРА', 'ЧЕРЕЗ ЧАС',
        'НЕМЕДЛЕННО', 'В ТЕЧЕНИЕ СУТОК', 'В СРОЧНОМ ПОРЯДКЕ',
        'СЕГОДНЯ ВЕЧЕРОМ', 'В СУББОТУ', 'ЧЕРЕЗ ДВА ДНЯ',
        'ПОСЛЕЗАВТРА', 'В БЛИЖАЙШЕЕ ВРЕМЯ', 'ДО КОНЦА НЕДЕЛИ'
    ];

    const codes = [
        'СОРОК ДВА', 'ТРИДЦАТЬ СЕМЬ', 'ДЕВЯНОСТО ПЯТЬ', 'ШЕСТЬДЕСЯТ ТРИ',
        'ДВАДЦАТЬ ОДИН', 'ПЯТЬДЕСЯТ ВОСЕМЬ', 'СТО ДВАДЦАТЬ', 'СЕМЬДЕСЯТ',
        'ВОСЕМЬДЕСЯТ ЧЕТЫРЕ', 'ДЕВЯНОСТО ДЕВЯТЬ', 'ТРИДЦАТЬ ТРИ',
        'СОРОК ПЯТЬ', 'ШЕСТЬДЕСЯТ ОДИН', 'ДВАДЦАТЬ ВОСЕМЬ', 'ПЯТЬДЕСЯТ',
        'СТО СОРОК СЕМЬ', 'ДЕВЯНОСТО ДВА', 'ВОСЕМЬДЕСЯТ', 'СЕМЬДЕСЯТ ШЕСТЬ'
    ];

    function generateMessages() {
        const messages = [];
        let idCounter = 1000;

        // ==================== ЦЕЗАРЬ (350 сообщений) ====================
        const caesarEasyTexts = [
            'ВСТРЕЧА В ПОЛДЕНЬ У ФОНТАНА', 'ПАРОЛЬ ОТ СЕЙФА СОРОК ДВА',
            'АГЕНТ РАСКРЫТ НЕМЕДЛЕННО УХОДИТЕ', 'ГРУЗ ДОСТАВЛЕН В ТОЧКУ Б',
            'ЗАВТРА В ТРИ ЧАСА У МОСТА', 'КОДОВОЕ СЛОВО АЛЬБАТРОС',
            'СВЯЗЬ ПО РАСПИСАНИЮ В ПОЛДЕНЬ', 'ДАННЫЕ ПЕРЕДАНЫ ЧЕРЕЗ КАНАЛ ТРИ',
            'ЯВКА ПОДТВЕРЖДЕНА ЖДИТЕ СИГНАЛ', 'ДОКУМЕНТЫ УНИЧТОЖЕНЫ ПО ПРОТОКОЛУ',
            'МАРШРУТ ИЗМЕНЁН СЛЕДУЙТЕ ЧЕРЕЗ СЕКТОР СЕМЬ', 'КОНТАКТ ПОДТВЕРДИЛ ПОЛУЧЕНИЕ ГРУЗА',
            'РЕЗИДЕНТ ВЫШЕЛ НА СВЯЗЬ ВСЁ ЧИСТО', 'ПЕРИМЕТР ПРОВЕРЕН НАРУШЕНИЙ НЕТ',
            'КАНАЛ СВЯЗИ ЗАЩИЩЁН МОЖНО ПЕРЕДАВАТЬ', 'ШИФРОВАЛЬНАЯ МАШИНА ГОТОВА К РАБОТЕ',
            'АРХИВ ПЕРЕНЕСЁН НА РЕЗЕРВНЫЙ СЕРВЕР', 'КЛЮЧ ШИФРОВАНИЯ ОБНОВЛЁН УСПЕШНО',
            'СПУТНИКОВЫЙ КАНАЛ АКТИВИРОВАН', 'ТЕРМИНАЛ РАЗБЛОКИРОВАН ДОСТУП ОТКРЫТ',
            'КУРЬЕР ДОСТАВИЛ ПАКЕТ ВОВРЕМЯ', 'СООБЩЕНИЕ ОТ СОЮЗНИКОВ ПОЛУЧЕНО',
            'БАЗА ГОТОВА К ПРИЁМУ ГОСТЕЙ', 'ПРОВЕРКА СВЯЗИ КАЖДЫЙ ЧАС',
            'НОВЫЙ ПАРОЛЬ УСТАНОВЛЕН УСПЕШНО', 'РАДИСТ ПЕРЕДАЛ КООРДИНАТЫ ТОЧНО',
            'ОХРАНА УСИЛЕНА НА ВСЕХ ПОСТАХ', 'ПОГОДА БЛАГОПРИЯТНА ДЛЯ ОПЕРАЦИИ',
            'ВСЕ ГРУППЫ ДОЛОЖИЛИ О ГОТОВНОСТИ', 'СВЯЗНОЙ ПОДТВЕРДИЛ ВРЕМЯ ВСТРЕЧИ'
        ];

        caesarEasyTexts.forEach(text => {
            messages.push({ id: idCounter++, text, type: 'caesar', difficulty: 1, reward: 35 + Math.floor(Math.random() * 25), shift: Math.floor(Math.random() * 5) + 1 });
        });

        for (let i = 0; i < 120; i++) {
            const parts = [subjects[Math.floor(Math.random() * subjects.length)], actions[Math.floor(Math.random() * actions.length)], locations[Math.floor(Math.random() * locations.length)]];
            messages.push({ id: idCounter++, text: parts.join(' '), type: 'caesar', difficulty: 2, reward: 55 + Math.floor(Math.random() * 45), shift: Math.floor(Math.random() * 6) + 3 });
        }

        for (let i = 0; i < 120; i++) {
            const parts = [subjects[Math.floor(Math.random() * subjects.length)], actions[Math.floor(Math.random() * actions.length)], locations[Math.floor(Math.random() * locations.length)], times[Math.floor(Math.random() * times.length)]];
            messages.push({ id: idCounter++, text: parts.join(' '), type: 'caesar', difficulty: 3, reward: 80 + Math.floor(Math.random() * 70), shift: Math.floor(Math.random() * 8) + 4 });
        }

        for (let i = 0; i < 80; i++) {
            const parts = [subjects[Math.floor(Math.random() * subjects.length)], actions[Math.floor(Math.random() * actions.length)], locations[Math.floor(Math.random() * locations.length)], times[Math.floor(Math.random() * times.length)], codes[Math.floor(Math.random() * codes.length)]];
            messages.push({ id: idCounter++, text: parts.join(' '), type: 'caesar', difficulty: Math.random() > 0.5 ? 4 : 5, reward: 120 + Math.floor(Math.random() * 130), shift: Math.floor(Math.random() * 12) + 5 });
        }

        // ==================== АТБАШ (250 сообщений) ====================
        const atbashBaseTexts = [
            'СЕКРЕТНАЯ ЛАБОРАТОРИЯ НА ТРЕТЬЕМ ЭТАЖЕ', 'ШИФРОВАЛЬНАЯ МАШИНА СЛОМАНА ТРЕБУЕТСЯ РЕМОНТ',
            'АРХИВ С ДАННЫМИ ПЕРЕНЕСЕН НА СЕРВЕР ТРИ', 'ДИПЛОМАТИЧЕСКАЯ ПОЧТА ПЕРЕХВАЧЕНА ПРОТИВНИКОМ',
            'СОГЛАШЕНИЕ ПОДПИСАНО ВСЕ ПУНКТЫ УТВЕРЖДЕНЫ', 'РАЗВЕДЫВАТЕЛЬНАЯ ГРУППА ВЕРНУЛАСЬ БЕЗ ПОТЕРЬ',
            'КОМПРОМАТ НА ЦЕЛЬ ГОТОВ НАЧИНАЙТЕ ОПЕРАЦИЮ', 'БАЗА ПРОТИВНИКА ОБНАРУЖЕНА В КВАДРАНТЕ ДЕВЯТЬ',
            'СИСТЕМЫ СВЯЗИ ВОССТАНОВЛЕНЫ ПОСЛЕ АТАКИ', 'НОВЫЙ АЛГОРИТМ ШИФРОВАНИЯ ВНЕДРЁН УСПЕШНО',
            'КООРДИНАТЫ ЦЕЛИ ПЕРЕДАНЫ АРТИЛЛЕРИИ', 'ПЛАН ЭВАКУАЦИИ УТВЕРЖДЕН НАЧИНАЙТЕ ПОДГОТОВКУ',
            'ДВОЙНОЙ АГЕНТ ПЕРЕДАЛ ЦЕННУЮ ИНФОРМАЦИЮ', 'ЗАПАСЫ ПРОДОВОЛЬСТВИЯ ПОПОЛНЕНЫ НА МЕСЯЦ',
            'МЕДИЦИНСКИЙ ПЕРСОНАЛ ГОТОВ К ПРИЁМУ РАНЕНЫХ'
        ];

        atbashBaseTexts.forEach(text => {
            messages.push({ id: idCounter++, text, type: 'atbash', difficulty: 2, reward: 65 + Math.floor(Math.random() * 35) });
        });

        for (let i = 0; i < 235; i++) {
            const parts = [subjects[Math.floor(Math.random() * subjects.length)], actions[Math.floor(Math.random() * actions.length)]];
            if (Math.random() > 0.5) parts.push(locations[Math.floor(Math.random() * locations.length)]);
            if (Math.random() > 0.7) parts.push(times[Math.floor(Math.random() * times.length)]);
            messages.push({ id: idCounter++, text: parts.join(' '), type: 'atbash', difficulty: Math.random() > 0.5 ? 2 : 3, reward: 60 + Math.floor(Math.random() * 100) });
        }

        // ==================== МОРЗЕ (250 сообщений) ====================
        const morseBaseTexts = [
            'СРОЧНО СВЯЖИТЕСЬ С ЦЕНТРОМ КОД КРАСНЫЙ', 'ПЕРЕХВАТ СИГНАЛА ПРОТИВНИКА ЧАСТОТА ДВЕСТИ',
            'РАДИОПЕРЕХВАТ РАСШИФРОВАН КЛЮЧ НАЙДЕН', 'СПУТНИКОВЫЕ СНИМКИ ПОКАЗЫВАЮТ АКТИВНОСТЬ',
            'КОД КРАСНЫЙ АКТИВИРОВАТЬ ПРОТОКОЛ ОМЕГА', 'КООРДИНАТЫ ЦЕЛИ ПЯТЬДЕСЯТ ПЯТЬ СЕВЕР',
            'ЭКСТРЕННАЯ ЭВАКУАЦИЯ ВСЕГО ПЕРСОНАЛА', 'ОБНАРУЖЕНА УТЕЧКА ИНФОРМАЦИИ ИЩИТЕ КРОТА',
            'ПОДВОДНАЯ ЛОДКА ЗАМЕЧЕНА У БЕРЕГА', 'ВОЗДУШНАЯ ТРЕВОГА ВСЕМ В УКРЫТИЕ',
            'РАКЕТНАЯ АТАКА ОЖИДАЕТСЯ СЕВЕРНОЕ НАПРАВЛЕНИЕ', 'ГРУППА БЫСТРОГО РЕАГИРОВАНИЯ ВЫДВИГАЕТСЯ',
            'СВЯЗЬ ПОТЕРЯНА ВОССТАНАВЛИВАЕМ КАНАЛ', 'РАЗВЕДЧИКИ ОБНАРУЖИЛИ МИННОЕ ПОЛЕ',
            'СНАЙПЕР НА ПОЗИЦИИ ЖДЁТ КОМАНДЫ'
        ];

        morseBaseTexts.forEach(text => {
            messages.push({ id: idCounter++, text, type: 'morse', difficulty: 3, reward: 85 + Math.floor(Math.random() * 55) });
        });

        for (let i = 0; i < 235; i++) {
            const parts = [subjects[Math.floor(Math.random() * subjects.length)], codes[Math.floor(Math.random() * codes.length)]];
            if (Math.random() > 0.5) parts.push(actions[Math.floor(Math.random() * actions.length)]);
            messages.push({ id: idCounter++, text: parts.join(' '), type: 'morse', difficulty: Math.random() > 0.5 ? 3 : 4, reward: 80 + Math.floor(Math.random() * 120) });
        }

        // Перемешиваем
        for (let i = messages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [messages[i], messages[j]] = [messages[j], messages[i]];
        }

        return messages;
    }

    const allMessages = generateMessages();
    console.log(`📦 MessageBank: ${allMessages.length} сообщений (Цезарь, Атбаш, Морзе)`);

    return {
        getAll: () => allMessages,
        getRandom: () => allMessages[Math.floor(Math.random() * allMessages.length)],
        getByType: (type) => allMessages.filter(m => m.type === type),
        getCount: () => allMessages.length
    };
})();