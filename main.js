import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- 1. BANCO DE DADOS DE HISTÓRIAS ---
const bookData = {
    "book_tree": {
        title: "The Day Saturn Exploded",
        content: `
            <p><span>Today</span> <span>is</span> <span>a</span> <span>very</span> <span>strange</span> <span>day</span>. <span>Max</span> <span>is</span> <span>an</span> <span>astronaut</span>. <span>He</span> <span>lives</span> <span>in</span> <span>a</span> <span>big</span> <span>space station</span>. <span>He</span> <span>looks out</span> <span>the</span> <span>window</span>. <span>The</span> <span>sky</span> <span>is</span> <span>black</span> <span>and</span> <span>the</span> <span>stars</span> <span>are</span> <span>white</span>.</p>
            <p><span>Max</span> <span>looks at</span> <span>Saturn</span>. <span>Saturn</span> <span>is</span> <span>a</span> <span>very</span> <span>beautiful</span> <span>planet</span>. <span>It</span> <span>is</span> <span>big</span> <span>and</span> <span>yellow</span>. <span>It</span> <span>has</span> <span>many</span> <span>rings</span>. <span>The</span> <span>rings</span> <span>are</span> <span>made of</span> <span>ice</span> <span>and</span> <span>dust</span>. <span>Max</span> <span>loves</span> <span>Saturn</span>.</p>
            <p><span>Suddenly</span>, <span>something</span> <span>happens</span>. <span>There is</span> <span>a</span> <span>loud</span> <span>sound</span>. "<span>BOOM</span>!" <span>Max</span> <span>is</span> <span>surprised</span>. <span>He</span> <span>sees</span> <span>a</span> <span>bright</span> <span>light</span>. <span>The</span> <span>light</span> <span>is</span> <span>orange</span>, <span>red</span>, <span>and</span> <span>purple</span>. <span>Saturn</span> <span>is</span> <span>not</span> <span>round</span> <span>anymore</span>. <span>Saturn</span> <span>is</span> <span>breaking</span>!</p>
            <p>"<span>Oh no</span>!" <span>Max</span> <span>says</span>. "<span>Saturn</span> <span>is</span> <span>exploding</span>!"</p>
            <p><span>The</span> <span>big</span> <span>planet</span> <span>breaks into</span> <span>millions</span> <span>of</span> <span>small</span> <span>pieces</span>. <span>The</span> <span>rings</span> <span>fly away</span> <span>into</span> <span>the</span> <span>dark</span> <span>space</span>. <span>It</span> <span>looks like</span> <span>fireworks</span> <span>in</span> <span>the</span> <span>sky</span>. <span>It</span> <span>is</span> <span>very</span> <span>beautiful</span>, <span>but</span> <span>it</span> <span>is</span> <span>also</span> <span>very</span> <span>sad</span>.</p>
            <p><span>Max</span> <span>takes</span> <span>his</span> <span>camera</span>. <span>He</span> <span>takes a photo</span> <span>of</span> <span>the</span> <span>light</span>. <span>The</span> <span>sun</span> <span>is</span> <span>still</span> <span>there</span>, <span>but</span> <span>Saturn</span> <span>is</span> <span>gone</span>. <span>Now</span>, <span>there are</span> <span>only</span> <span>small</span> <span>rocks</span> <span>in its place</span>.</p>
            <p><span>Max</span> <span>calls</span> <span>his</span> <span>friends</span> <span>on</span> <span>Earth</span>. "<span>Hello</span>? <span>Can you</span> <span>see</span> <span>the</span> <span>sky</span>?" <span>he</span> <span>asks</span>.</p>
            <p>"<span>Yes</span>," <span>they</span> <span>say</span>. "<span>The</span> <span>sky</span> <span>is</span> <span>very</span> <span>bright</span> <span>tonight</span>."</p>
            <p><span>Max</span> <span>sits</span> <span>in</span> <span>his</span> <span>chair</span>. <span>He</span> <span>watches</span> <span>the</span> <span>pieces</span> <span>of the planet</span> <span>move</span> <span>slowly</span>. <span>Space</span> <span>is</span> <span>very</span> <span>quiet</span> <span>again</span>. <span>Max</span> <span>is</span> <span>tired</span>. <span>He</span> <span>goes to sleep</span> <span>and</span> <span>dreams about</span> <span>the</span> <span>beautiful</span> <span>rings of Saturn</span>. <span>It</span> <span>is</span> <span>a day</span> <span>he</span> <span>will</span> <span>never forget</span>.</p>
        `
    },
    "book_lunch": {
        title: "Lunch Time",
        content: `
            <p><span>It</span> <span>is</span> <span>twelve</span> <span>o'clock</span>. <span>It is lunch time</span>. <span>Sarah</span> <span>is hungry</span>. <span>She</span> <span>goes to</span> <span>the</span> <span>kitchen</span>.</p>
            <p><span>She</span> <span>makes</span> <span>a</span> <span>sandwich</span>. <span>The</span> <span>sandwich</span> <span>has</span> <span>cheese</span> <span>and</span> <span>tomato</span>.</p>
        `
    },
    "book_bike": {
        title: "The New Bike",
        content: `
            <p><span>Tom</span> <span>has</span> <span>a</span> <span>new</span> <span>bike</span>. <span>The</span> <span>bike</span> <span>is</span> <span>blue</span> <span>and</span> <span>fast</span>. <span>He</span> <span>rides</span> <span>in</span> <span>the</span> <span>park</span>.</p>
        `
    }
};

// --- VARIÁVEIS GLOBAIS DE ÁUDIO ---
let sintetizador = window.speechSynthesis;
let locucao = null;

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.btn-tab');
    const storyContainer = document.querySelector('.story-content');
    const storyTitle = document.querySelector('.story-title');
    let activeTooltip = null;

    // --- 2. CARREGAMENTO DINÂMICO DO LIVRO ---
    const loadBookContent = () => {
        const params = new URLSearchParams(window.location.search);
        const bookId = params.get('id');

        if (window.location.pathname.includes('book.html')) {
            if (bookId && bookData[bookId]) {
                if (storyTitle) storyTitle.innerText = bookData[bookId].title;
                if (storyContainer) storyContainer.innerHTML = bookData[bookId].content;
                document.title = `${bookData[bookId].title} - Lersotoria`;
                
                // Parar qualquer áudio anterior ao mudar de livro
                sintetizador.cancel();
            } else {
                if (storyTitle) storyTitle.innerText = "Livro não encontrado 404";
            }
        }
    };

    loadBookContent();

    // --- 3. FUNÇÃO DE VOZ (TEXT-TO-SPEECH) ---
    window.toggleOuvir = () => {
        if (sintetizador.speaking) {
            sintetizador.cancel();
            atualizarBotaoAudio(false);
            return;
        }

        if (storyContainer) {
            const texto = storyContainer.innerText;
            locucao = new SpeechSynthesisUtterance(texto);
            locucao.lang = 'en-US';
            locucao.rate = 0.9;

            locucao.onstart = () => atualizarBotaoAudio(true);
            locucao.onend = () => atualizarBotaoAudio(false);
            locucao.onerror = () => atualizarBotaoAudio(false);

            sintetizador.speak(locucao);
        }
    };

    const atualizarBotaoAudio = (tocando) => {
        const btn = document.getElementById('btn-read-aloud');
        if (btn) {
            btn.innerHTML = tocando 
                ? `<span>✦</span> Parar Leitura ⏹` 
                : `<span>✦</span> Ouvir Capítulo 🔊`;
            btn.classList.toggle('playing', tocando);
        }
    };

    // --- 4. ESTADO DO USUÁRIO (FIREBASE) ---
    let currentUser = null;
    let userData = { history: [], favorites: [], quizzes: {} };

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                userData = userDoc.data();
                const nameDisplay = document.querySelector('.user-name');
                if (nameDisplay && userData.name) {
                    nameDisplay.innerText = userData.name;
                }
            }
            renderLibrary();
        } else {
            const path = window.location.pathname;
            if (path.includes('library.html') || path.includes('book.html')) {
                window.location.href = 'login.html';
            }
        }
    });

    const renderLibrary = () => {
        updateFavVisuals();
        checkLevelUnlocks();
    };

    // --- 5. LÓGICA DE NÍVEIS E DESBLOQUEIO ---
    const checkLevelUnlocks = () => {
        const levelsOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']; 
        
        levelsOrder.forEach((level, index) => {
            const currentSection = document.querySelector(`[data-level="${level}"]`);
            if (!currentSection) return;

            const quizBtn = currentSection.querySelector('.btn-quiz');
            const nextLevelId = levelsOrder[index + 1];
            const nextSection = document.querySelector(`[data-level="${nextLevelId}"]`);
            
            if (nextSection) {
                if (userData.quizzes && userData.quizzes[level] === true) {
                    nextSection.classList.remove('locked');
                    nextSection.style.opacity = "1";
                    nextSection.style.pointerEvents = "auto";
                    nextSection.style.filter = "grayscale(0)";
                    
                    const tag = nextSection.querySelector('.level-tag');
                    if (tag && tag.innerText.includes('🔒')) {
                        tag.innerText = tag.innerText.replace('🔒', '🔓');
                    }
                }
            }

            if (quizBtn) {
                quizBtn.style.display = !currentSection.classList.contains('locked') ? 'inline-block' : 'none';
            }

            if (userData.quizzes && userData.quizzes[level] === true) {
                const tag = currentSection.querySelector('.level-tag');
                if (tag) tag.innerText = tag.innerText.replace(/[🔒🔓]/, '✅');
            }
        });
    };

    const updateFavVisuals = () => {
        document.querySelectorAll('.book-item').forEach(item => {
            const id = item.getAttribute('data-id');
            const badge = item.querySelector('.fav-badge');
            if (badge) {
                const isFav = (userData.favorites || []).includes(id);
                badge.classList.toggle('active', isFav);
                badge.innerText = isFav ? '❤️' : '✦';
            }
        });
    };

    // --- 6. EVENTOS DE CLIQUE ---
    document.addEventListener('click', async (e) => {
        // Botão de Áudio (Caso ele seja gerado dinamicamente)
        if (e.target.closest('#btn-read-aloud')) {
            window.toggleOuvir();
        }

        if (e.target.closest('.book-card-link')) {
            const item = e.target.closest('.book-item');
            const id = item.getAttribute('data-id');

            if (currentUser && !userData.history.includes(id)) {
                userData.history.push(id);
                await updateDoc(doc(db, "users", currentUser.uid), {
                    history: arrayUnion(id)
                });
                checkLevelUnlocks();
            }
        }

        if (e.target.classList.contains('fav-badge')) {
            e.preventDefault();
            const item = e.target.closest('.book-item');
            const id = item.getAttribute('data-id');

            if (currentUser) {
                let newFavs = userData.favorites.includes(id) 
                    ? userData.favorites.filter(favId => favId !== id)
                    : [...userData.favorites, id];

                userData.favorites = newFavs;
                await updateDoc(doc(db, "users", currentUser.uid), { favorites: newFavs });
                updateFavVisuals();
            }
        }
    });

    // Filtros
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterId = btn.id;
            document.querySelectorAll('.book-item').forEach(item => {
                const id = item.getAttribute('data-id');
                let show = filterId === 'btn-all' || (filterId === 'btn-fav' && userData.favorites.includes(id));
                item.style.display = show ? 'block' : 'none';
            });
        });
    });

    // --- 7. TRADUTOR ---
    if (storyContainer) {
        storyContainer.addEventListener('click', async (e) => {
            const el = e.target;
            if (el.tagName === 'SPAN') {
                const word = el.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
                if (!word) return;

                if (activeTooltip) activeTooltip.remove();
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerText = "🔍...";
                document.body.appendChild(tooltip);
                
                const rect = el.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
                tooltip.style.top = `${rect.top + window.scrollY - 45}px`;
                activeTooltip = tooltip;

                try {
                    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|pt-BR`);
                    const data = await response.json();
                    let translations = [data.responseData.translatedText.toLowerCase()];
                    
                    if (data.matches) {
                        data.matches.forEach(m => {
                            const t = m.translation.toLowerCase().trim();
                            if (!translations.includes(t) && t.length < 20) translations.push(t);
                        });
                    }
                    tooltip.innerText = translations.slice(0, 3).join(' / ');
                } catch { tooltip.innerText = "Erro ❌"; }
            }
        });

        document.addEventListener('mousedown', (e) => {
            if (activeTooltip && !e.target.closest('.tooltip') && e.target.tagName !== 'SPAN') {
                activeTooltip.remove();
                activeTooltip = null;
            }
        });
    }
});