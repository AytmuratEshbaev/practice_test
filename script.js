// --- HOLAT (STATE) ---
let state = {
    class: null, 
    lang: 'uz',
    quarter: 1 
};

// --- MA'LUMOTLAR BAZASI ---
// "desc" maydoni olib tashlandi, faqat title, lang, quarter va url qoldi
const topicsData = {
    5: [
        // 1-Chorak
        { title: "Taqdimot Yaratish", lang: "uz", quarter: 1, url: "tests/5/ppt-uz/index.html" },
        { title: "Создание презентаций", lang: "ru", quarter: 1, url: "tests/5/ppt-ru/index.html" },
        
        // 2-Chorak
        { title: "Paint dasturi", lang: "uz", quarter: 2, url: "tests/5/paint/index.html" },
        
        // 3-Chorak
        { title: "Scratch: Sprite", lang: "uz", quarter: 3, url: "tests/5/scratch/index.html" }
    ],
    6: [
        { title: "Shart operatorlari (if/else)", lang: "uz", quarter: 1, url: "tests/6/cond-uz/index.html" },
        { title: "Takrorlash operatorlari (For)", lang: "uz", quarter: 2, url: "tests/6/loops-uz/index.html" }
    ],
    9: [
        { title: "Olimpiada masalalari", lang: "uz", quarter: 1, url: "tests/9/olymp/index.html" }
    ],
    10: [
        { title: "Photoshop: Layers", lang: "uz", quarter: 1, url: "tests/10/ps-layers/index.html" },
        { title: "Photoshop: Filters", lang: "uz", quarter: 2, url: "tests/10/ps-filters/index.html" }
    ],
    11: [
        { title: "HTML Asoslari", lang: "uz", quarter: 1, url: "tests/11/html/index.html" }
    ]
};

// --- 1. SINFNI TANLASH ---
function selectClass(classNum) {
    state.class = classNum;
    document.querySelectorAll('.class-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(classNum + "-Sinf")) btn.classList.add('active');
    });
    document.getElementById('filtersSection').classList.remove('hidden');
    renderTopics();
}

// --- 2. TILNI TANLASH ---
function selectLanguage(langCode) {
    state.lang = langCode;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(langCode)) btn.classList.add('active');
    });
    renderTopics();
}

// --- 3. CHORAKNI TANLASH ---
function selectQuarter(qNum) {
    state.quarter = qNum;
    document.querySelectorAll('.quarter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(`(${qNum})`)) btn.classList.add('active');
    });
    renderTopics();
}

// --- EKRANGA CHIQARISH ---
function renderTopics() {
    const container = document.getElementById('topicsContainer');
    container.classList.remove('show'); 

    setTimeout(() => {
        container.innerHTML = "";

        if (!state.class) {
            container.innerHTML = `<p class="empty-msg">Iltimos, avval sinfni tanlang.</p>`;
            container.classList.add('show');
            return;
        }

        const allTopics = topicsData[state.class] || [];
        
        const filteredTopics = allTopics.filter(topic => 
            topic.lang === state.lang && 
            topic.quarter === state.quarter
        );

        if (filteredTopics.length > 0) {
            filteredTopics.forEach(topic => {
                const card = document.createElement('a');
                card.className = 'topic-card';
                card.href = topic.url;
                // Description qismi olib tashlandi
                card.innerHTML = `
                    <div>
                        <div class="topic-title">${topic.title}</div>
                    </div>
                    <div class="card-footer">
                        <span class="meta-info">${state.quarter}-chorak</span>
                        <span class="start-link">Boshlash &rarr;</span>
                    </div>
                `;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = `
                <div class="empty-msg">
                    <p>Ushbu chorakda testlar topilmadi.</p>
                </div>`;
        }
        container.classList.add('show');
    }, 200);
}