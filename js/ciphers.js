// ============================================
// js/ciphers.js — Цезарь, Атбаш, Морзе
// ============================================

const RU_ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
const RU_LENGTH = RU_ALPHABET.length;

const Ciphers = {
    caesar: {
        name: 'Шифр Цезаря',
        encrypt(text, shift) {
            shift = shift || Math.floor(Math.random() * 10) + 1;
            let result = '';
            for (const char of text.toUpperCase()) {
                const idx = RU_ALPHABET.indexOf(char);
                if (idx !== -1) result += RU_ALPHABET[(idx + shift) % RU_LENGTH];
                else result += char;
            }
            return { cipherText: result, params: { shift } };
        },
        decrypt(text, params) {
            const { shift } = params;
            let result = '';
            for (const char of text) {
                const idx = RU_ALPHABET.indexOf(char);
                if (idx !== -1) {
                    let newIdx = (idx - shift) % RU_LENGTH;
                    if (newIdx < 0) newIdx += RU_LENGTH;
                    result += RU_ALPHABET[newIdx];
                } else result += char;
            }
            return result;
        },
        getHint(params) { return `Сдвиг: ${params.shift}. "А" → "${RU_ALPHABET[params.shift % RU_LENGTH]}".`; }
    },

    atbash: {
        name: 'Шифр Атбаш',
        encrypt(text) {
            let result = '';
            for (const char of text.toUpperCase()) {
                const idx = RU_ALPHABET.indexOf(char);
                if (idx !== -1) result += RU_ALPHABET[RU_LENGTH - 1 - idx];
                else result += char;
            }
            return { cipherText: result, params: {} };
        },
        decrypt(text) { return this.encrypt(text).cipherText; },
        getHint() { return 'А↔Я, Б↔Ю, В↔Э — зеркало алфавита.'; }
    },

    morse: {
        name: 'Азбука Морзе',
        morseMap: {
            'А':'.-','Б':'-...','В':'.--','Г':'--.','Д':'-..','Е':'.','Ё':'.','Ж':'...-','З':'--..','И':'..','Й':'.---','К':'-.-','Л':'.-..','М':'--','Н':'-.','О':'---','П':'.--.','Р':'.-.','С':'...','Т':'-','У':'..-','Ф':'..-.','Х':'....','Ц':'-.-.','Ч':'---.','Ш':'----','Щ':'--.-','Ъ':'--.--','Ы':'-.--','Ь':'-..-','Э':'..-..','Ю':'..--','Я':'.-.-',' ':'/'
        },
        encrypt(text) {
            let result = [];
            for (const char of text.toUpperCase()) {
                if (this.morseMap[char]) result.push(this.morseMap[char]);
            }
            return { cipherText: result.join(' '), params: {} };
        },
        decrypt(text) {
            const reverse = {};
            for (const [k, v] of Object.entries(this.morseMap)) reverse[v] = k;
            const parts = text.split(' ');
            let result = '';
            for (const part of parts) {
                if (part === '/') result += ' ';
                else if (reverse[part]) result += reverse[part];
            }
            return result;
        },
        getHint() { return '• = короткий, — = длинный. "Е" = •.'; }
    }
};

window.Ciphers = Ciphers;
window.RU_ALPHABET = RU_ALPHABET;