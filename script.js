// --- HOLAT (STATE) ---
// Hozir qaysi sinf va til tanlangani shu yerda saqlanadi
let state = {
    class: null, // Boshida tanlanmagan
    lang: 'uz'   // Boshlang'ich til: O'zbek
};

// --- MA'LUMOTLAR BAZASI ---
// Har bir mavzuga "lang" parametri qo'shildi
const topicsData = {
    5: [
        { title: "Taqdimot Yaratish", desc: "PowerPoint asoslari", lang: "uz", url: "tests/5/ppt-uz/index.html" },
        { title: "Создание презентаций", desc: "Основы PowerPoint", lang: "ru", url: "tests/5/ppt-ru/index.html" },
        { title: "C++ ga kirish", desc: "Sintaksis va turlar", lang: "uz", url: "tests/5/cpp-uz/index.html" }
    ],
    6: [
        { title: "Shart operatorlari", desc: "if/else (C++)", lang: "uz", url: "tests/6/cond-uz/index.html" },
        { title: "Условные операторы", desc: "if/else (C++)", lang: "ru", url: "tests/6/cond-ru/index.html" },
        { title: "Takrorlash operatorlari", desc: "For va While", lang: "uz", url: "tests/6/loops-uz/index.html" }
    ],
    9: [
        { title: "Olimpiada masalalari", desc: "Kirish-chiqarish", lang: "uz", url: "tests/9/olymp-uz/index.html" },
        { title: "Olympiad Problems", desc: "Input-Output basics", lang: "en", url: "tests/9/olymp-en/index.html" }
    ],
    10: [
        { title: "Photoshop: Layers", desc: "Qatlamlar bilan ishlash", lang: "uz", url: "tests/10/ps-uz/index.html" }
    ],
    11: [
        { title: "Web Dasturlash", desc: "HTML va CSS", lang: "uz", url: "tests/11/web-uz/index.html" }
    ]
};

// --- 1. SINFNI TANLASH ---
function selectClass(classNum) {
    state.class = classNum;
    
    // Sinf tugmalarini yangilash
    const buttons = document.querySelectorAll('.class-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(classNum + "-Sinf")) {
            btn.classList.add('active');
        }
    });

    // Til bo'limini ko'rsatish (agar yashirin bo'lsa)
    document.getElementById('langSection').classList.remove('hidden');

    // Natijani yangilash
    renderTopics();
}

// --- 2. TILNI TANLASH ---
function selectLanguage(langCode) {
    state.lang = langCode;

    // Til tugmalarini yangilash
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        // Tugma onclick funksiyasini tekshirib active qilamiz
        if(btn.getAttribute('onclick').includes(langCode)) {
            btn.classList.add('active');
        }
    });

    // Natijani yangilash
    renderTopics();
}

// --- 3. EKRANGA CHIQARISH (RENDER) ---
function renderTopics() {
    const container = document.getElementById('topicsContainer');

    // 1. Animatsiya uchun yashiramiz
    container.classList.remove('show');

    setTimeout(() => {
        container.innerHTML = ""; // Tozalash

        // Agar sinf tanlanmagan bo'lsa
        if (!state.class) {
            container.innerHTML = `<p class="empty-msg">Iltimos, avval sinfni tanlang.</p>`;
            container.classList.add('show');
            return;
        }

        // Ma'lumotlarni olamiz
        const allTopics = topicsData[state.class] || [];
        
        // Filtrlash: Sinf ichidan faqat tanlangan TILdagi mavzularni olamiz
        const filteredTopics = allTopics.filter(topic => topic.lang === state.lang);

        if (filteredTopics.length > 0) {
            filteredTopics.forEach(topic => {
                const card = document.createElement('a');
                card.className = 'topic-card';
                card.href = topic.url;
                
                card.innerHTML = `
                    <div>
                        <div class="topic-title">${topic.title}</div>
                        <div class="topic-meta">${topic.desc}</div>
                    </div>
                    <div class="start-btn">Boshlash &rarr;</div>
                `;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = `<p class="empty-msg">Bu sinf va til uchun testlar topilmadi.</p>`;
        }

        // 2. Qayta ko'rsatamiz
        container.classList.add('show');

    }, 200);
}