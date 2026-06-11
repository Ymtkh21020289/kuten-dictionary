// --- 1. スプライトフォントの文字マッピング設定 ---
// 画像のどこにどの文字があるかを定義します。
// (例: 'a'は0番目(左上), 'b'は1番目...)
// 18列(0~17) x 6行の画像として計算します。
const charMap = {
    'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5,
    'g': 6, 'h': 7, 'i': 8, 'j': 9, 'k': 10, 'l': 11,
    'm': 12, 'n': 13, 'o': 14, 'p': 15, 'q': 16, 'r': 17,
    's': 18, 't': 19, 'u': 20, 'v': 21, 'w': 22, 'x': 23,
    'y': 24, 'z': 25
    // 記号などがあれば追加してください
};

const COLS = 18; // 画像の列数
const CHAR_SIZE = 32; // 1文字のサイズ(px)

// --- 2. 辞書データ ---
// 単語(word)とその意味(meaning)のリストです。
const dictionary = [
    { word: "aria", meaning: "こんにちは。[kaza]と一緒に使われることが多いです。" },
    { word: "kaza", meaning: "世界。または人々。" },
    { word: "fina", meaning: "さようなら。" },
    { word: "runa", meaning: "美しい。" }
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
    
    // オリジナル文字（スプライト）の生成
    detailOriginalFont.innerHTML = '';
    for (let char of item.word.toLowerCase()) {
        if (charMap[char] !== undefined) {
            const index = charMap[char];
            const x = -(index % COLS) * CHAR_SIZE;
            const y = -Math.floor(index / COLS) * CHAR_SIZE;
            
            const span = document.createElement('span');
            span.className = 'custom-char';
            span.style.backgroundPosition = `${x}px ${y}px`;
            detailOriginalFont.appendChild(span);
        }
    }

    // 他単語へのジャンプリンクの処理（[単語] をリンク化する）
    // 例: "意味テキストの中の [kaza] をリンクにします"
    let meaningHtml = item.meaning.replace(/\[(.*?)\]/g, (match, wordName) => {
        return `<span class="word-link" onclick="showDetail('${wordName}')">${wordName}</span>`;
    });
    
    detailMeaning.innerHTML = meaningHtml;
}

// 起動
init();
