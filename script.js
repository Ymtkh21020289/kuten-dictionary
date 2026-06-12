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
    { word: "mi", meaning: "私（一人称）" },
    { word: "yoti", meaning: "あなた" },
    { word: "saki", meaning: "彼（男性三人称）" },
    { word: "sali", meaning: "彼女（女性三人称）" } // 例として追加
];

// --- 3. DOM要素の取得 ---
const searchInput = document.getElementById('searchInput');
const wordList = document.getElementById('wordList');
const wordDetail = document.getElementById('wordDetail');
const placeholder = document.getElementById('placeholder');
const detailWord = document.getElementById('detailWord');
const detailOriginalFont = document.getElementById('detailOriginalFont');
const detailMeaning = document.getElementById('detailMeaning');

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
    
    // オリジナル文字（スプライト）の生成【ここが大きく変わりました】
    detailOriginalFont.innerHTML = '';
    let wordStr = item.word.toLowerCase();
    let index = 0;

    while (index < wordStr.length) {
        let matched = false;

        // 文字数の多い音節から順にマッチするか確認する
        for (let syllable of sortedSyllables) {
            if (wordStr.startsWith(syllable, index)) {
                // マッチした音節の画像を表示
                const charIndex = charMap[syllable];
                const x = -(charIndex % COLS) * CHAR_SIZE;
                const y = -Math.floor(charIndex / COLS) * CHAR_SIZE;
                
                const span = document.createElement('span');
                span.className = 'custom-char';
                span.style.backgroundPosition = `${x}px ${y}px`;
                detailOriginalFont.appendChild(span);

                // マッチした文字数分だけ読み取り位置を進める
                index += syllable.length;
                matched = true;
                break; // 次の文字へ
            }
        }

        // charMapに登録されていない文字（記号など）があった場合は飛ばす
        if (!matched) {
            index++;
        }
    }

    // 他単語へのジャンプリンクの処理
    let meaningHtml = item.meaning.replace(/\[(.*?)\]/g, (match, wordName) => {
        return `<span class="word-link" onclick="showDetail('${wordName}')">${wordName}</span>`;
    });
    
    detailMeaning.innerHTML = meaningHtml;
}

// 起動
init();
