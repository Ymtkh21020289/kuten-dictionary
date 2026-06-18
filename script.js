// --- 1. スプライトフォントの文字マッピング設定 ---
// 1音節（ローマ字の塊）ごとに画像の位置（0から始まる番号）を定義します。
const charMap = {
    'a': 0, 'ya': 1, 'ta': 2, 'la': 3, 'ka': 4, 'pa': 5, 'ha': 6, 'sa': 7, 'na': 8, 'ma': 9, 'tya': 10, 'lya': 11, 'kya': 12, 'pya': 13, 'hya': 14, 'sya': 15, 'mya': 16, 'pha': 17,
    'i': 18, 'yi': 19, 'ti': 20, 'li': 21, 'ki': 22, 'pi': 23, 'hi': 24, 'si': 25, 'ni': 26, 'mi': 27, 'tyi': 28, 'lyi': 29, 'kyi': 30, 'pyi': 31, 'hyi': 32, 'syi': 33, 'myi': 34, 'phi': 35,
    'u': 36, 'yu': 37, 'tu': 38, 'lu': 39, 'ku': 40, 'pu': 41, 'hu': 42, 'su': 43, 'nu': 44, 'mu': 45, 'tyu': 46, 'lyu': 47, 'kyu': 48, 'pyu': 49, 'hyu': 50, 'syu': 51, 'myu': 52, 'phu': 53,
    'e': 54, 'ye': 55, 'te': 56, 'le': 57, 'ke': 58, 'pe': 59, 'he': 60, 'se': 61, 'ne': 62, 'me': 63, 'tyi': 64, 'lyi': 65, 'kyi': 66, 'pyi': 67, 'hyi': 68, 'syi': 69, 'myi': 70, 'phi': 71,
    'o': 72, 'yo': 73, 'to': 74, 'lo': 75, 'ko': 76, 'po': 77, 'ho': 78, 'so': 79, 'no': 80, 'mo': 81, 'tyo': 82, 'lyo': 83, 'kyo': 84, 'pyo': 85, 'hyi': 86, 'syi': 87, 'myi': 88, 'phi': 89,
    'mm': 90, 'y': 91, 't': 92, 'l': 93, 'k': 94, 'p': 95, 'h': 96, 's': 97, 'n': 98, 'm': 99, 'nn': 100,
};

const COLS = 18; // 画像の列数
const CHAR_SIZE = 32; // 1文字のサイズ(px)

// 【重要】文字数の多い順に並べ替えた配列を作成（pya等を ka や a より先に判定させるため）
const sortedSyllables = Object.keys(charMap).sort((a, b) => b.length - a.length);

// --- 2. 辞書データ ---
const dictionary = [
    { word: "mi", meaning: "私（一人称）", examples: ["{mi lu puka.} \n[mi] [lu] [puka].（私は歩く）"] },
    { word: "yoti", meaning: "あなた" },
    { word: "saki", meaning: "彼（男性三人称）\n彼ら（三人称複数形）" },
    { word: "sali", meaning: "彼女（女性三人称）\n彼ら（三人称複数形）\n\n「彼ら」を表す時は[saki]を使うのが一般的である。" }, // 例として追加
    { word: "kutenn", meaning: "言語" },
    { word: "lu", meaning: "〜は、〜が（主語を前に伴う助詞）" },
    { word: "tyo", meaning: "〜を（目的語を前に伴う助詞）" },
    { word: "puka", meaning: "歩く" },
    { word: "enn", meaning: "〜または〜" }
];

// --- 3. DOM要素の取得 ---
const searchInput = document.getElementById('searchInput');
const wordList = document.getElementById('wordList');
const wordDetail = document.getElementById('wordDetail');
const placeholder = document.getElementById('placeholder');
const detailWord = document.getElementById('detailWord');
const detailOriginalFont = document.getElementById('detailOriginalFont');
const detailMeaning = document.getElementById('detailMeaning');

// --- 追加：ローマ字をオリジナル文字（画像）に変換する関数 ---
function textToSpriteHtml(text) {
    let html = '';
    let wordStr = text.toLowerCase();
    let index = 0;

    while (index < wordStr.length) {
        let matched = false;

        for (let syllable of sortedSyllables) {
            if (wordStr.startsWith(syllable, index)) {
                const charIndex = charMap[syllable];
                const x = -(charIndex % COLS) * CHAR_SIZE;
                const y = -Math.floor(charIndex / COLS) * CHAR_SIZE;
                
                html += `<span class="custom-char" style="background-position: ${x}px ${y}px;"></span>`;
                index += syllable.length;
                matched = true;
                break;
            }
        }

        if (!matched) {
            const currentChar = text[index];
            // 半角スペースまたは全角スペースの場合
            if (currentChar === ' ' || currentChar === ' ') {
                html += `<span class="custom-space"></span>`;
            } else {
                // その他の記号や日本語はそのまま出力
                html += currentChar;
            }
            index++;
        }
    }
    return html;
}

// --- 4. 初期化処理 ---
function init() {
    renderList(dictionary);
    
    // 検索イベント
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredWords = dictionary.filter(item => 
            item.word.toLowerCase().includes(query) || 
            item.meaning.includes(query)
        );
        renderList(filteredWords);
    });
}

// --- 5. 左側リストの描画 ---
function renderList(words) {
    wordList.innerHTML = '';
    words.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.word;
        li.addEventListener('click', () => showDetail(item.word));
        wordList.appendChild(li);
    });
}

// --- 6. 詳細ページの表示 ---
function showDetail(targetWord) {
    const item = dictionary.find(d => d.word === targetWord);
    if (!item) return;

    placeholder.classList.add('hidden');
    wordDetail.classList.remove('hidden');

    detailWord.textContent = item.word;
    
    // ▼ ここをスッキリ書き換え（先ほどの関数を使用）
    detailOriginalFont.innerHTML = textToSpriteHtml(item.word);

    // 他単語へのジャンプリンクと改行の処理
    let meaningHtml = item.meaning
        .replace(/\r?\n/g, '<br>')
        .replace(/\[(.*?)\]/g, (match, wordName) => {
            return `<span class="word-link" onclick="showDetail('${wordName}')">${wordName}</span>`;
        });
    
    detailMeaning.innerHTML = meaningHtml;

    // 例文の表示処理
    if (item.examples && item.examples.length > 0) {
        exampleBox.classList.remove('hidden');
        detailExamples.innerHTML = '';
        
        item.examples.forEach(exText => {
            let exHtml = exText
                .replace(/\r?\n/g, '<br>')
                .replace(/\[(.*?)\]/g, (match, wordName) => {
                    return `<span class="word-link" onclick="showDetail('${wordName}')">${wordName}</span>`;
                })
                // ▼▼ ここを追加： {文字列} をオリジナル文字に変換 ▼▼
                .replace(/\{(.*?)\}/g, (match, originalText) => {
                    return textToSpriteHtml(originalText);
                });
                
            const li = document.createElement('li');
            li.innerHTML = exHtml;
            detailExamples.appendChild(li);
        });
    } else {
        exampleBox.classList.add('hidden');
    }
}

// 起動
init();
