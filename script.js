// --- MA'LUMOTLAR BAZASI ---
// 'url' qismiga iSpring publish qilgan html faylga to'g'ri yo'l ko'rsating
const topicsData = {
    5: [
        { title: "Taqdimot Yaratish", desc: "PowerPoint asoslari va slaydlarni bezash", url: "tests/5-sinf/ppt-basics/index.html" },
        { title: "C++ ga kirish", desc: "Sintaksis va ma'lumot turlari", url: "tests/5-sinf/cpp-intro/index.html" }
    ],
    6: [
        { title: "Shart operatorlari", desc: "if, else va switch operatorlari (C++)", url: "tests/6-sinf/conditions/index.html" },
        { title: "Takrorlash operatorlari", desc: "For va While tsikllari", url: "tests/6-sinf/loops/index.html" }
    ],
    9: [
        { title: "Olimpiada masalalari", desc: "Kirish-chiqarish va oddiy masalalar", url: "tests/9-sinf/olympiad-1/index.html" }
    ],
    10: [
        { title: "Photoshop: Layers", desc: "Qatlamlar bilan ishlash texnikasi", url: "tests/10-sinf/ps-layers/index.html" },
        { title: "Photoshop: Selection", desc: "Ajratib olish uskunalari", url: "tests/10-sinf/ps-select/index.html" }
    ],
    11: [
        { title: "Web Dasturlash", desc: "HTML va CSS strukturalari", url: "tests/11-sinf/web-intro/index.html" }
    ]
};

// --- FUNKSIYA ---
function filterTopics(sinf) {
    const container = document.getElementById('topicsContainer');
    const buttons = document.querySelectorAll('.class-btn');
    
    // 1. Tugmalarni faol holatini o'zgartirish
    buttons.forEach(btn => {
        btn.classList.remove('active');
        // Tugma matnida sinf raqami borligini tekshiramiz
        if(btn.innerText.includes(sinf + "-Sinf")) {
            btn.classList.add('active');
        }
    });

    // 2. Konteynerni vaqtincha yashirish (animatsiya uchun)
    container.classList.remove('show');
    
    // 3. Kichik kechikishdan so'ng ma'lumotni yangilash
    setTimeout(() => {
        container.innerHTML = ""; // Ichini tozalash

        const data = topicsData[sinf];

        if (data && data.length > 0) {
            // Mavzular bor bo'lsa, ularni yaratish
            data.forEach(topic => {
                const card = document.createElement('a');
                card.className = 'topic-card';
                // Havola
                card.href = topic.url;
                // Testni yangi oynada ochish uchun (ixtiyoriy):
                // card.target = "_blank"; 

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
            // Agar mavzu bo'lmasa
            container.innerHTML = `<p class="empty-msg">Bu sinf uchun hozircha testlar yuklanmagan.</p>`;
        }

        // 4. Qayta ko'rsatish
        container.classList.add('show');
    }, 200); 
}
