
try {
    if (window.lucide) {
        window.lucide.createIcons();
    }
} catch (e) { console.error('Lucide error:', e); }


const APP_CONFIG = {
    webhookUrl: "https://canary.discord.com/api/webhooks/1438269655394418809/03CplowHX7uKg_sVsQVTbcQxcAP06_03xBd6OoKNl0G3hVtXZ013U7uTdQMxaDaTC9Ow",
    successMessage: "Participação enviada com sucesso! Boa sorte!",
    errorMessage: "Erro ao enviar participação. Tente novamente."
};


window.copyToClipboard = function (text) {
    if (!navigator.clipboard) {

        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast(`Código ${text} copiado!`);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            showToast('Erro ao copiar código', true);
        }
        document.body.removeChild(textArea);
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast(`Código ${text} copiado!`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Erro ao copiar código', true);
    });
}

function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.innerHTML = `
        <i data-lucide="${isError ? 'alert-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();


    setTimeout(() => toast.classList.add('show'), 100);


    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {

    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('.header');


    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav-overlay';
    mobileNav.innerHTML = `
        <nav class="mobile-nav-content">
            <a href="#partners">Parceiros</a>
            <a href="#giveaways">Sorteios</a>
            <a href="#how-to">Como Participar</a>
            <a href="#history">Histórico</a>
            <a href="#forms">Formulários</a>
            <button class="close-menu"><i data-lucide="x"></i></button>
        </nav>
    `;
    document.body.appendChild(mobileNav);


    const style = document.createElement('style');
    style.innerHTML = `
      .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(9, 9, 11, 0.95);
          backdrop-filter: blur(10px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
      }
      .mobile-nav-overlay.active {
          opacity: 1;
          pointer-events: all;
      }
      .mobile-nav-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          text-align: center;
          font-family: var(--font-heading);
          font-size: 2rem;
      }
      .mobile-nav-content a {
          color: white;
      }
      .mobile-nav-content a:hover {
          color: var(--primary);
      }
      .close-menu {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          width: 40px;
          height: 40px;
      }
    `;
    document.head.appendChild(style);

    mobileBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
        if (window.lucide) window.lucide.createIcons();
    });

    mobileNav.querySelector('.close-menu').addEventListener('click', () => {
        mobileNav.classList.remove('active');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });


    const themeBtn = document.querySelector('.theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });



    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const targetId = anchor.getAttribute('href');
        if (targetId === '#' || !targetId) return;

        e.preventDefault();
        try {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                }
            }
        } catch (err) {
            console.error('Smooth scroll failed:', err);
        }
    });


    function updateAllTimers() {
        const timerElements = document.querySelectorAll('.text-timer');
        if (timerElements.length === 0) return;

        const now = Date.now();
        timerElements.forEach(el => {
            const endAt = el.dataset.expiry;
            const distance = new Date(endAt).getTime() - now;

            if (distance < 0) {
                el.innerText = "ENCERRADO";
                el.classList.remove('text-timer');
                el.style.color = "var(--muted)";
                return;
            }

            const d = Math.floor(distance / 86400000);
            const h = Math.floor((distance % 86400000) / 3600000);
            const m = Math.floor((distance % 3600000) / 60000);
            const s = Math.floor((distance % 60000) / 1000);

            el.innerText = `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
        });
    }


    setInterval(updateAllTimers, 1000);
    updateAllTimers();


    const modal = document.getElementById('participation-modal');

    if (modal) {
        const modalClose = modal.querySelector('.modal-close');
        const modalCancel = modal.querySelector('.modal-cancel');
        const participationForm = document.getElementById('participation-form');


        const openModal = () => {
            modal.classList.add('active');
            if (window.lucide) window.lucide.createIcons();
        };


        const closeModal = () => {
            modal.classList.remove('active');
            if (participationForm) participationForm.reset();
        };


        const participateBtns = document.querySelectorAll('.giveaway-card .btn-primary, .exclusive-card .btn-secondary');

        participateBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });


        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalCancel) modalCancel.addEventListener('click', closeModal);


        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });


        if (participationForm) {
            participationForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const tradeInput = document.getElementById('steam-trade-url');
                const profileInput = document.getElementById('site-profile-url');
                const depositInput = document.getElementById('deposit-amount');

                const formData = {
                    giveawayId: modal.dataset.giveawayId || 'default',
                    userName: tradeInput ? tradeInput.value.split('/').pop() || 'User' : 'User',
                    steamTradeUrl: tradeInput ? tradeInput.value : '',
                    depositAmount: depositInput ? parseFloat(depositInput.value) : 0,
                    siteProfileUrl: profileInput ? profileInput.value : '',
                    submittedAt: new Date().toISOString()
                };


                const participations = JSON.parse(localStorage.getItem('sp3c_participations') || '[]');
                participations.push(formData);
                localStorage.setItem('sp3c_participations', JSON.stringify(participations));

                console.log('Enviando dados do formulário:', formData);





                showToast('Participação confirmada com sucesso!');
                closeModal();
            });
        }
    }


    const giveawayForms = document.querySelectorAll('.giveaway-form');

    giveawayForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'ENVIAR';


            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'ENVIANDO...';
            }

            try {

                const nameInput = form.querySelector('input[id="user-name"]') || form.querySelector('input[type="text"]');
                const steamInput = form.querySelector('input[id="steam-url"]');
                const profileInput = form.querySelector('input[id="site-profile"]');
                const depositInput = form.querySelector('input[id="deposit-amount"]');
                const couponUpload = form.querySelector('input[id="upload-coupon"]');
                const historyUpload = form.querySelector('input[id="upload-history"]');


                const formData = new FormData();


                let contentMessage = `**NOVA PARTICIPAÇÃO DE SORTEIO**\n`;
                contentMessage += `**Origem:** ${document.title}\n`;
                contentMessage += `**Nome:** ${nameInput ? nameInput.value : 'N/A'}\n`;
                contentMessage += `**Steam:** ${steamInput ? steamInput.value : 'N/A'}\n`;
                contentMessage += `**Perfil Site:** ${profileInput ? profileInput.value : 'N/A'}\n`;
                contentMessage += `**Depósito:** R$ ${depositInput ? depositInput.value : '0.00'}\n`;
                contentMessage += `**Data:** ${new Date().toLocaleString('pt-BR')}`;

                formData.append('content', contentMessage);


                let fileCount = 0;
                if (couponUpload && couponUpload.files.length > 0) {
                    formData.append(`file${fileCount}`, couponUpload.files[0]);
                    fileCount++;
                }
                if (historyUpload && historyUpload.files.length > 0) {
                    formData.append(`file${fileCount}`, historyUpload.files[0]);
                    fileCount++;
                }

                console.log('Enviando dados...', {
                    url: APP_CONFIG.webhookUrl,
                    content: contentMessage
                });

                if (APP_CONFIG.webhookUrl && APP_CONFIG.webhookUrl !== "") {
                    const response = await fetch(APP_CONFIG.webhookUrl, {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error(`Erro HTTP: ${response.status}`);
                    }
                    showToast(APP_CONFIG.successMessage);
                    form.reset();
                } else {

                    await new Promise(r => setTimeout(r, 1500));
                    console.warn('MODO SIMULAÇÃO: Configure a APP_CONFIG.webhookUrl no main.js para envio real.');
                    showToast('Modo Simulação: Sucesso! Configure o Webhook para funcionar.');
                    form.reset();
                }

            } catch (error) {
                console.error('Erro no envio:', error);
                showToast(APP_CONFIG.errorMessage, true);
            } finally {

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            }
        });
    });


    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;


            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));


            btn.classList.add('active');


            const content = document.getElementById(`tab-${target}`);
            if (content) {
                content.classList.add('active');
            }
        });
    });

    const activeGrid = document.getElementById('active-giveaways-grid');
    if (activeGrid) {
        const stored = localStorage.getItem('sp3c_giveaways');
        let giveaways = [];

        if (stored) {
            giveaways = JSON.parse(stored);
        } else {
            giveaways = [
                {
                    id: 1,
                    name: "AK-47 | ASIIMOV",
                    value: "R$ 150,00",
                    image: "./assets/skin_ak47.png",
                    minDeposit: "$5.00",
                    endAt: new Date(Date.now() + 86400000 * 2).toISOString(),
                    winner: null
                },
                {
                    id: 2,
                    name: "AWP | REDLINE",
                    value: "R$ 200,00",
                    image: "./assets/skin_awp.png",
                    minDeposit: "$10.00",
                    endAt: new Date(Date.now() + 3600000).toISOString(),
                    winner: null
                }
            ];
            localStorage.setItem('sp3c_giveaways', JSON.stringify(giveaways));
        }

        activeGrid.innerHTML = '';

        giveaways.forEach(item => {
            const isEnded = new Date(item.endAt) < new Date();
            const card = document.createElement('article');
            card.className = `giveaway-card ${item.winner ? 'has-winner' : ''}`;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <span class="status-badge ${isEnded ? 'ended' : 'active'}">
                        ${isEnded ? (item.winner ? 'Concluído' : 'Encerrado') : 'Ativo'}
                    </span>
                    <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                </div>
                <div class="card-body">
                    <h3 class="skin-name">${item.name}</h3>
                    <p class="skin-value">${item.value}</p>
                    <div class="card-meta">
                        <div class="meta-item">
                            <span class="meta-label">Depósito Min:</span>
                            <span class="meta-value">${item.minDeposit}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">${item.winner ? 'Vencedor:' : 'Termina em:'}</span>
                            <span class="${item.winner ? 'winner-name' : 'meta-value text-timer'}" data-expiry="${item.endAt}">
                                ${item.winner || 'Calculando...'}
                            </span>
                        </div>
                    </div>
                    ${item.winner
                    ? `<button class="btn-outline full-width" disabled>SORTEIO FINALIZADO</button>`
                    : `<button class="btn-primary full-width" data-action="participate" data-id="${item.id}">PARTICIPAR</button>`
                }
                </div>
            `;
            activeGrid.appendChild(card);
        });


        activeGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action="participate"]');
            if (!btn) return;

            e.preventDefault();
            const modal = document.getElementById('participation-modal');
            if (modal) {
                modal.dataset.giveawayId = btn.dataset.id;
                modal.classList.add('active');
                if (window.lucide) window.lucide.createIcons();
            }
        });
    }

});
