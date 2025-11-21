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

        const filteredTopics = allTopicsData.filter(topic => 
            topic.grade === state.class &&
            topic.lang === state.lang &&
            topic.quarter === state.quarter
        );

        if (filteredTopics.length > 0) {
            filteredTopics.forEach(topic => {
                // URL
                const dynamicUrl = `tests/grade_${topic.grade}/quarter_${topic.quarter}/${topic.lang}/${topic.id}/index.html`;
                
                // Har bir status div uchun unikal ID yaratamiz (keyin topib olish uchun)
                const uniqueStatusId = `status-${topic.id}`;

                const card = document.createElement('div');
                card.className = 'topic-card';
                card.style.cursor = "pointer";
                
                // HTML TUZILISHI: Title -> Status (O'rtada) -> Footer
                card.innerHTML = `
                    <div>
                        <div class="topic-title">${topic.title}</div>
                        
                        <div id="${uniqueStatusId}" class="status-badge status-loading">
                            Tekshirilmoqda...
                        </div>
                    </div>

                    <div class="card-footer">
                        <span class="meta-info">ID: ${topic.id}</span>
                        <span class="start-link">Boshlash &rarr;</span>
                    </div>
                `;

                // Click hodisasi: Faqat fayl "Status: Joylangan" bo'lsa ochadi
                card.onclick = function() {
                    // Hozirgi statusni tekshiramiz
                    const statusEl = document.getElementById(uniqueStatusId);
                    if (statusEl.classList.contains('status-success')) {
                        window.location.href = dynamicUrl;
                    } else if (statusEl.classList.contains('status-error')) {
                        alert("Uzr, ushbu test hali bazaga yuklanmagan.");
                    } else {
                        alert("Iltimos, tekshiruv tugashini kuting...");
                    }
                };

                container.appendChild(card);

                // Karta qo'shilgandan keyin darhol tekshiruvni boshlaymiz
                checkFileStatus(dynamicUrl, uniqueStatusId);
            });
        } else {
            let langText = state.lang === 'uz' ? "o'zbek" : state.lang === 'qr' ? "qoraqalpoq" : "rus";
            container.innerHTML = `
                <div class="empty-msg">
                    <p>${state.class}-sinf, ${state.quarter}-chorak uchun ${langText} tilida testlar topilmadi.</p>
                </div>`;
        }
        container.classList.add('show');
    }, 200);
}

// --- YANGI: ORQA FONDA TEKSHIRISH FUNKSIYASI ---
function checkFileStatus(url, elementId) {
    fetch(url, { method: 'HEAD' }) // Faylni yuklab olmasdan, faqat "bormi?" deb so'raydi
        .then(response => {
            const el = document.getElementById(elementId);
            if (!el) return; // Agar element topilmasa to'xtaymiz

            el.classList.remove('status-loading'); // Loadingni olib tashlaymiz

            if (response.ok) {
                // 200 OK - Fayl bor
                el.innerText = "✅ Test joylangan";
                el.classList.add('status-success');
            } else {
                // 404 - Fayl yo'q
                el.innerText = "❌ Hali joylanmagan";
                el.classList.add('status-error');
            }
        })
        .catch(error => {
            const el = document.getElementById(elementId);
            if (el) {
                el.classList.remove('status-loading');
                el.innerText = "⚠️ Xatolik";
                el.classList.add('status-error');
            }
        });
}