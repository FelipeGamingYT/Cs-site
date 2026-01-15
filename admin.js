
const ADMIN_PASS = "admin123";

document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    renderGiveawaysTable();
    updateStats();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('admin-pass').value;
            if (pass === ADMIN_PASS) {
                localStorage.setItem('admin_logged', 'true');
                checkLogin();
            } else {
                alert('Senha incorreta!');
            }
        });
    }

    const configForm = document.getElementById('giveaway-config-form');
    if (configForm) {
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveGiveaway();
        });
    }
});

function checkLogin() {
    const isLogged = localStorage.getItem('admin_logged') === 'true';
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');

    if (isLogged) {
        if (loginSection) loginSection.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'grid';
        if (window.lucide) window.lucide.createIcons();
    } else {
        if (loginSection) loginSection.style.display = 'flex';
        if (dashboardSection) dashboardSection.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('admin_logged');
    location.reload();
}

function switchTab(tabName) {
    const views = ['view-dashboard', 'view-giveaways'];
    const titles = { 'dashboard': 'Visão Geral', 'giveaways': 'Gerenciar Sorteios' };

    document.getElementById('view-dashboard').style.display = 'none';
    document.getElementById('view-giveaways').style.display = 'none';

    document.getElementById(`view-${tabName}`).style.display = 'block';

    document.getElementById('page-title').innerText = titles[tabName];

    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));

}



function getGiveaways() {
    const stored = localStorage.getItem('sp3c_giveaways');
    if (stored) return JSON.parse(stored);

    const defaults = [
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
    localStorage.setItem('sp3c_giveaways', JSON.stringify(defaults));
    return defaults;
}

function saveGiveaway() {
    const idInput = document.getElementById('edit-id').value;
    const name = document.getElementById('skin-name').value;
    const value = document.getElementById('skin-value').value;
    const image = document.getElementById('skin-image').value;
    const minDeposit = document.getElementById('min-deposit').value;
    const endDate = document.getElementById('end-date').value;

    let giveaways = getGiveaways();

    const giveawayData = {
        id: idInput ? parseInt(idInput) : Date.now(),
        name,
        value,
        image,
        minDeposit,
        endAt: new Date(endDate).toISOString(),
        winner: idInput ? giveaways.find(g => g.id == idInput)?.winner : null
    };

    if (idInput) {
        const index = giveaways.findIndex(g => g.id == idInput);
        if (index !== -1) giveaways[index] = giveawayData;
    } else {
        giveaways.push(giveawayData);
    }

    localStorage.setItem('sp3c_giveaways', JSON.stringify(giveaways));
    closeGiveawayModal();
    renderGiveawaysTable();
    updateStats();
    alert('Sorteio salvo!');
}

function deleteGiveaway(id) {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    let giveaways = getGiveaways();
    giveaways = giveaways.filter(g => g.id != id);
    localStorage.setItem('sp3c_giveaways', JSON.stringify(giveaways));
    renderGiveawaysTable();
    updateStats();
}

function editGiveaway(id) {
    const giveaways = getGiveaways();
    const item = giveaways.find(g => g.id == id);
    if (!item) return;

    document.getElementById('edit-id').value = item.id;
    document.getElementById('skin-name').value = item.name;
    document.getElementById('skin-value').value = item.value;
    document.getElementById('skin-image').value = item.image;
    document.getElementById('min-deposit').value = item.minDeposit;

    const date = new Date(item.endAt);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    document.getElementById('end-date').value = date.toISOString().slice(0, 16);

    openGiveawayModal();
}

function drawWinner(id) {
    let giveaways = getGiveaways();
    const index = giveaways.findIndex(g => g.id == id);
    if (index === -1) return;

    if (giveaways[index].winner) {
        if (!confirm('Este sorteio já tem um vencedor. Deseja sortear novamente?')) return;
    }

    const participants = JSON.parse(localStorage.getItem('sp3c_participations') || '[]');
    const giveawayParticipants = participants.filter(p => p.giveawayId == id);

    let winnerName = "";

    if (giveawayParticipants.length > 0) {
        const randomIndex = Math.floor(Math.random() * giveawayParticipants.length);
        winnerName = giveawayParticipants[randomIndex].userName;
    } else {
        const dummyNames = ["Gaules", "Fallen", "Coldzera", "S1mple", "Niko", "Zywoo", "Fer", "Taco"];
        winnerName = dummyNames[Math.floor(Math.random() * dummyNames.length)];
        alert('Nenhuma participação real encontrada. Sorteando ganhador fictício para teste.');
    }

    giveaways[index].winner = winnerName;
    giveaways[index].endAt = new Date().toISOString();

    localStorage.setItem('sp3c_giveaways', JSON.stringify(giveaways));


    alert(`O vencedor é: ${winnerName}!`);
    renderGiveawaysTable();
}


function renderGiveawaysTable() {
    const tbody = document.getElementById('giveaways-table-body');
    if (!tbody) return;

    const data = getGiveaways();
    tbody.innerHTML = '';

    data.forEach(item => {
        const isEnded = new Date(item.endAt) < new Date();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.image}" style="width: 50px; border-radius: 4px;"></td>
            <td>${item.name}</td>
            <td>${new Date(item.endAt).toLocaleString('pt-BR')}</td>
            <td>
                <span class="status-badge ${isEnded ? 'ended' : 'active'}">${isEnded ? (item.winner ? 'Finalizado' : 'Expirado') : 'Ativo'}</span>
                ${item.winner ? `<br><small style="color:var(--primary)">Vencedor: ${item.winner}</small>` : ''}
            </td>
            <td>
                <button class="action-btn btn-edit" title="Editar" onclick="editGiveaway(${item.id})"><i data-lucide="edit-2"></i></button>
                <button class="action-btn" title="Sortear Vencedor" style="background:var(--secondary); color:white" onclick="drawWinner(${item.id})"><i data-lucide="trophy"></i></button>
                <button class="action-btn btn-delete" title="Excluir" onclick="deleteGiveaway(${item.id})"><i data-lucide="trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();
}

function updateStats() {
    const data = getGiveaways();
    const activeEl = document.getElementById('stat-active');
    if (activeEl) activeEl.innerText = data.length;
}

function openGiveawayModal() {
    document.getElementById('giveaway-modal').classList.add('active');
}

function closeGiveawayModal() {
    document.getElementById('giveaway-modal').classList.remove('active');
    document.getElementById('giveaway-config-form').reset();
    document.getElementById('edit-id').value = '';
}
