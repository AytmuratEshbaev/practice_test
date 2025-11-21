// --- HOLAT (STATE) ---
let state = {
    class: null,
    lang: 'uz',
    quarter: 1
};

// Barcha mavzular shu yerga yuklanadi
let allTopicsData = [];

// --- 1. DASTUR BOSHLANISHI (JSON YUKLASH) ---
document.addEventListener("DOMContentLoaded", () => {
    fetch('topics.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("JSON fayl topilmadi!");
            }
            return response.json();
        })
        .then(data => {
            allTopicsData = data;
            console.log("Ma'lumotlar yuklandi:", allTopicsData.length + " ta mavzu");
        })
        .catch(error => {
            console.error("Xatolik:", error);
            document.getElementById('topicsContainer').innerHTML = 
                `<p class="empty-msg" style="color:red;">Xatolik: Ma'lumotlar bazasi (topics.json) yuklanmadi.</p>`;
        });
});

// --- 2. SELECT FUNKSIYALARI ---
function selectClass(classNum) {
    state.class = classNum;
    updateButtons('.class-btn', classNum + "-Sinf");
    document.getElementById('filtersSection').classList.remove('hidden');
    renderTopics();
}

function selectLanguage(langCode) {
    state.lang = langCode;
    // Buttonni topish uchun onclick atributini tekshiramiz
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(`'${langCode}'`)) {
            btn.classList.add('active');
        }
    });
    renderTopics();
}

function selectQuarter(qNum) {
    state.quarter = qNum;
    const buttons = document.querySelectorAll('.quarter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(`(${qNum})`)) {
            btn.classList.add('active');
        }
    });
    renderTopics();
}

// Yordamchi funksiya: Tugmalar aktivligini o'zgartirish
function updateButtons(selector, searchText) {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.includes(searchText)) btn.classList.add('active');
    });
}

// --- 3. EKRANGA CHIQARISH VA URL AVTOMATLASHTIRISH ---
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

        // FILTRLASH
        // JSON dagi "grade", "lang", "quarter" bo'yicha saralaymiz
        const filteredTopics = allTopicsData.filter(topic => 
            topic.grade === state.class &&
            topic.lang === state.lang &&
            topic.quarter === state.quarter
        );

        if (filteredTopics.length > 0) {
            filteredTopics.forEach(topic => {
                // --- LINKNI AVTOMATIK YASASH ---
                // FORMULA: tests/grade_5/quarter_1/uz/001/index.html
                const dynamicUrl = `tests/grade_${topic.grade}/quarter_${topic.quarter}/${topic.lang}/${topic.id}/index.html`;

                const card = document.createElement('a');
                card.className = 'topic-card';
                card.href = dynamicUrl;
                
                card.innerHTML = `
                    <div>
                        <div class="topic-title">${topic.title}</div>
                    </div>
                    <div class="card-footer">
                        <span class="meta-info">ID: ${topic.id}</span>
                        <span class="start-link">Boshlash &rarr;</span>
                    </div>
                `;
                container.appendChild(card);
            });
        } else {
            let langText = state.lang === 'uz' ? "o'zbek" : state.lang === 'qr' ? "qoraqalpoq" : "rus";
            container.innerHTML = `
                <div class="empty-msg">
                    <p>${state.class}-sinf, ${state.quarter}-chorak uchun ${langText} tilida testlar hali kiritilmagan.</p>
                </div>`;
        }
        container.classList.add('show');
    }, 200);
}