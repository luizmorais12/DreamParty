// admin.js - Lógica de Controle do Painel Administrativo

let guestsChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  // Configuração da data atual no painel
  const optDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("admin-welcome-date").textContent = new Date().toLocaleDateString('pt-BR', optDate);

  // Verifica Autenticação
  checkAuth();
});

/* ==========================================================================
   1. AUTENTICAÇÃO E LOGIN
   ========================================================================== */
function checkAuth() {
  const loggedIn = sessionStorage.getItem("lavinia_logged_in");
  const loginScreen = document.getElementById("admin-login-screen");
  const mainPanel = document.getElementById("admin-main-panel");

  if (loggedIn === "true") {
    loginScreen.classList.add("d-none");
    mainPanel.classList.remove("d-none");
    initAdminPanel();
  } else {
    loginScreen.classList.remove("d-none");
    mainPanel.classList.add("d-none");
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById("admin-password").value;
  const errorAlert = document.getElementById("login-error-alert");

  // Senha padrão de acesso
  if (passwordInput === "lavinia15") {
    sessionStorage.setItem("lavinia_logged_in", "true");
    errorAlert.classList.add("d-none");
    document.getElementById("admin-password").value = "";
    checkAuth();
  } else {
    errorAlert.classList.remove("d-none");
    setTimeout(() => errorAlert.classList.add("d-none"), 4000);
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem("lavinia_logged_in");
  checkAuth();
}

window.handleAdminLogin = handleAdminLogin;
window.handleAdminLogout = handleAdminLogout;

/* ==========================================================================
   2. INICIALIZAÇÃO GERAL E REVERTER DADOS
   ========================================================================== */
function initAdminPanel() {
  updateDashboardStats();
  renderGuestTable();
  renderModerationGrid();
  renderGiftsAdmin();
  populateConfigForms();
}

function resetDatabaseToDefault() {
  if (confirm("ATENÇÃO: Isso restaurará todos os dados originais do site, excluindo confirmações recentes, mensagens enviadas e edições de texto. Deseja prosseguir?")) {
    DB.reset();
    alert("Banco de dados restaurado com sucesso!");
    location.reload();
  }
}
window.resetDatabaseToDefault = resetDatabaseToDefault;

/* ==========================================================================
   3. SIDEBAR NAVIGATION
   ========================================================================== */
function switchSection(sectionId, element) {
  // Esconde todas as seções
  const sections = document.querySelectorAll(".admin-section");
  sections.forEach(sec => sec.classList.add("d-none"));

  // Exibe a seção ativa
  const targetSec = document.getElementById(`sec-${sectionId}`);
  if (targetSec) {
    targetSec.classList.remove("d-none");
  }

  // Remove classe ativa de todos os nav items
  const navItems = document.querySelectorAll(".admin-nav-item");
  navItems.forEach(item => item.classList.remove("active"));

  // Adiciona classe ativa no selecionado
  element.classList.add("active");

  // Ações de refresh específicas
  if (sectionId === "dashboard") {
    updateDashboardStats();
  } else if (sectionId === "convidados") {
    renderGuestTable();
  } else if (sectionId === "moderacao") {
    renderModerationGrid();
  } else if (sectionId === "presentes") {
    renderGiftsAdmin();
  }
}
window.switchSection = switchSection;

/* ==========================================================================
   4. DASHBOARD - ESTATÍSTICAS E GRÁFICOS
   ========================================================================== */
function updateDashboardStats() {
  const db = DB.get();

  let totalAdults = 0;
  let totalKids = 0;

  db.rsvps.forEach(rsvp => {
    totalAdults += 1 + parseInt(rsvp.adultsCount || 0); // 1 (próprio) + acompanhantes
    totalKids += parseInt(rsvp.kidsCount || 0);
  });

  const grandTotal = totalAdults + totalKids;
  const chosenGiftsCount = db.gifts.filter(g => g.chosen).length;
  const totalGiftsCount = db.gifts.length;

  // Atualiza contadores visuais
  document.getElementById("dash-total-guests").textContent = grandTotal;
  document.getElementById("dash-adults").textContent = totalAdults;
  document.getElementById("dash-kids").textContent = totalKids;
  document.getElementById("dash-gifts").textContent = `${chosenGiftsCount}/${totalGiftsCount}`;

  // Prepara Notificações / Feed de atividades
  const feed = document.getElementById("dash-notifications");
  feed.innerHTML = "";

  // Adiciona confirmações recentes
  const sortedRsvps = [...db.rsvps].sort((a,b) => new Date(b.dateConfirmed) - new Date(a.dateConfirmed));
  
  if (sortedRsvps.length === 0) {
    feed.innerHTML = `<div class="text-center text-muted small py-4">Nenhuma atividade recente.</div>`;
  } else {
    sortedRsvps.slice(0, 5).forEach(rsvp => {
      const companionMsg = (parseInt(rsvp.adultsCount) + parseInt(rsvp.kidsCount)) > 0 
        ? ` (+${parseInt(rsvp.adultsCount) + parseInt(rsvp.kidsCount)} acompanhantes)`
        : "";
      
      const item = document.createElement("div");
      item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start", "border-0", "px-0");
      item.innerHTML = `
        <div class="ms-2 me-auto">
          <div class="fw-bold text-rose-gold text-truncate" style="max-width: 250px;">${rsvp.name}</div>
          <span class="small text-muted">Confirmou presença${companionMsg}.</span>
        </div>
        <span class="badge bg-primary rounded-pill small">${new Date(rsvp.dateConfirmed).toLocaleDateString('pt-BR')}</span>
      `;
      feed.appendChild(item);
    });
  }

  // Atualiza ou inicializa o Gráfico de Rosca
  renderGuestsChart(totalAdults, totalKids);
}

function renderGuestsChart(adults, kids) {
  const ctx = document.getElementById('guestsChart');
  if (!ctx) return;

  if (guestsChartInstance) {
    guestsChartInstance.destroy();
  }

  guestsChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Adultos Confirmados', 'Crianças Confirmadas'],
      datasets: [{
        label: 'Convidados',
        data: [adults, kids],
        backgroundColor: [
          'rgba(183, 110, 121, 0.85)', // Rosé Gold
          'rgba(212, 175, 55, 0.85)'   // Dourado
        ],
        borderColor: [
          '#B76E79',
          '#D4AF37'
        ],
        borderWidth: 1.5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: 'Montserrat'
            }
          }
        }
      },
      cutout: '65%'
    }
  });
}

/* ==========================================================================
   5. GESTÃO DE CONVIDADOS (RSVP)
   ========================================================================== */
function renderGuestTable() {
  const db = DB.get();
  const tbody = document.getElementById("guests-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (db.rsvps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">Nenhum convidado confirmado até o momento.</td></tr>`;
    return;
  }

  // Ordena por data decrescente
  const sorted = [...db.rsvps].sort((a,b) => new Date(b.dateConfirmed) - new Date(a.dateConfirmed));

  sorted.forEach(rsvp => {
    const row = document.createElement("tr");
    const dConfirmed = new Date(rsvp.dateConfirmed).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    // Identifica se tem restrições alimentares
    const rLabel = (rsvp.dietaryRestrictions && rsvp.dietaryRestrictions !== "Sem restrições" && rsvp.dietaryRestrictions.trim() !== "")
      ? `<span class="badge bg-warning-subtle text-warning border border-warning-subtle text-wrap">${rsvp.dietaryRestrictions}</span>`
      : `<span class="text-muted small">Nenhuma</span>`;

    row.innerHTML = `
      <td class="fw-bold">${rsvp.name}</td>
      <td>${rsvp.phone || "--"}</td>
      <td class="text-lowercase">${rsvp.email || "--"}</td>
      <td class="text-center">${rsvp.adultsCount}</td>
      <td class="text-center">${rsvp.kidsCount}</td>
      <td class="text-muted text-truncate" style="max-width: 150px;" title="${rsvp.companionNames || ""}">${rsvp.companionNames || "--"}</td>
      <td>${rLabel}</td>
      <td class="text-muted">${dConfirmed}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-danger" onclick="deleteGuest('${rsvp.id}')" title="Excluir Convidado">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function deleteGuest(id) {
  if (confirm("Tem certeza que deseja excluir esta confirmação? Os dados serão removidos definitivamente.")) {
    const db = DB.get();
    db.rsvps = db.rsvps.filter(r => r.id !== id);
    DB.save(db);
    renderGuestTable();
    updateDashboardStats();
  }
}
window.deleteGuest = deleteGuest;

function handleManualGuestAdd(event) {
  event.preventDefault();
  
  const name = document.getElementById("ag-name").value;
  const phone = document.getElementById("ag-phone").value;
  const email = document.getElementById("ag-email").value;
  const adults = parseInt(document.getElementById("ag-adults").value) || 0;
  const kids = parseInt(document.getElementById("ag-kids").value) || 0;
  const companions = document.getElementById("ag-companions").value;
  const diet = document.getElementById("ag-diet").value;
  const message = document.getElementById("ag-message").value;

  if (!name.trim()) return;

  const db = DB.get();
  const newRsvp = {
    id: "r_man_" + Date.now(),
    name: name,
    phone: phone,
    email: email,
    adultsCount: adults,
    kidsCount: kids,
    companionNames: companions,
    dietaryRestrictions: diet || "Sem restrições",
    message: message,
    dateConfirmed: new Date().toISOString()
  };

  db.rsvps.push(newRsvp);
  DB.save(db);

  // Fecha Modal
  const modalEl = document.getElementById("addGuestModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  // Reset Form
  document.getElementById("add-guest-form").reset();

  // Re-render
  renderGuestTable();
  updateDashboardStats();
}
window.handleManualGuestAdd = handleManualGuestAdd;

// Filtro da tabela de convidados
function filterGuestTable() {
  const query = document.getElementById("search-guest-input").value.toLowerCase();
  const dietFilter = document.getElementById("filter-diet-select").value;
  const rows = document.querySelectorAll("#guests-table-body tr");

  rows.forEach(row => {
    // Evita filtrar linha vazia
    if (row.cells.length < 5) return;

    const name = row.cells[0].textContent.toLowerCase();
    const phone = row.cells[1].textContent.toLowerCase();
    const email = row.cells[2].textContent.toLowerCase();
    const companions = row.cells[5].textContent.toLowerCase();
    const diet = row.cells[6].textContent.toLowerCase();

    // Validação da query textual
    const matchesQuery = name.includes(query) || phone.includes(query) || email.includes(query) || companions.includes(query);

    // Validação de restrição alimentar
    let matchesDiet = true;
    if (dietFilter === "com") {
      matchesDiet = !diet.includes("nenhuma");
    } else if (dietFilter === "sem") {
      matchesDiet = diet.includes("nenhuma");
    }

    if (matchesQuery && matchesDiet) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
window.filterGuestTable = filterGuestTable;

/* ==========================================================================
   6. MODERAÇÃO DE MENSAGENS (LIVRO DE VISITAS)
   ========================================================================== */
function renderModerationGrid() {
  const db = DB.get();
  const grid = document.getElementById("messages-moderation-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (db.messages.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center text-muted py-5">Nenhuma mensagem deixada por convidados.</div>`;
    return;
  }

  // Ordena por data (mais recentes primeiro)
  const sorted = [...db.messages].sort((a,b) => new Date(b.date) - new Date(a.date));

  sorted.forEach(msg => {
    const col = document.createElement("div");
    col.classList.add("col-md-6", "col-xl-4");

    const badge = msg.approved 
      ? `<span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill"><i class="fa-solid fa-check me-1"></i> Aprovado</span>`
      : `<span class="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-1 rounded-pill"><i class="fa-solid fa-hourglass-half me-1"></i> Pendente</span>`;

    const formattedDate = new Date(msg.date).toLocaleString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    col.innerHTML = `
      <div class="card glass-panel h-100 ${msg.approved ? "border-success-subtle" : "border-warning-subtle"}" style="background: white;">
        <div class="card-body p-4 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="font-heading fs-6 fw-bold mb-0 text-rose-gold text-truncate" style="max-width: 150px;">${msg.author}</h5>
              ${badge}
            </div>
            <div class="small font-monospace text-gold mb-3">${msg.relation}</div>
            <p class="card-text text-muted small italic">"${msg.text}"</p>
          </div>
          
          <div class="mt-4 pt-3 border-top border-light d-flex justify-content-between align-items-center">
            <span class="small text-muted" style="font-size:0.75rem;">${formattedDate}</span>
            <div class="d-flex gap-2">
              ${!msg.approved ? `<button class="btn btn-sm btn-outline-success" onclick="approveMessage('${msg.id}')"><i class="fa-solid fa-check"></i> Aprovar</button>` : ""}
              <button class="btn btn-sm btn-outline-danger" onclick="deleteMessage('${msg.id}')"><i class="fa-solid fa-trash"></i> Excluir</button>
            </div>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

function approveMessage(id) {
  const db = DB.get();
  const msgIndex = db.messages.findIndex(m => m.id === id);
  if (msgIndex !== -1) {
    db.messages[msgIndex].approved = true;
    DB.save(db);
    renderModerationGrid();
    updateDashboardStats();
  }
}
window.approveMessage = approveMessage;

function deleteMessage(id) {
  if (confirm("Excluir esta mensagem de forma definitiva?")) {
    const db = DB.get();
    db.messages = db.messages.filter(m => m.id !== id);
    DB.save(db);
    renderModerationGrid();
    updateDashboardStats();
  }
}
window.deleteMessage = deleteMessage;

/* ==========================================================================
   7. GERENCIAMENTO DA LISTA DE PRESENTES
   ========================================================================== */
function renderGiftsAdmin() {
  const db = DB.get();
  const grid = document.getElementById("gifts-admin-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (db.gifts.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center text-muted py-5">Nenhum presente na lista.</div>`;
    return;
  }

  db.gifts.forEach(item => {
    const col = document.createElement("div");
    col.classList.add("col-md-6", "col-lg-4");

    const badge = item.chosen 
      ? `<span class="badge bg-danger-subtle text-danger px-3 py-1 rounded-pill border border-danger-subtle">Escolhido por: ${item.chosenBy}</span>`
      : `<span class="badge bg-success-subtle text-success px-3 py-1 rounded-pill border border-success-subtle">Disponível</span>`;

    col.innerHTML = `
      <div class="card h-100 shadow-sm" style="border-radius:15px; overflow:hidden;">
        <div style="height: 150px; overflow: hidden; position: relative;">
          <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
          <div class="position-absolute bottom-0 end-0 bg-dark text-white p-2 small font-monospace fw-bold">R$ ${item.value.toFixed(2)}</div>
        </div>
        <div class="card-body p-4 d-flex flex-column justify-content-between">
          <div>
            <h5 class="font-heading fs-6 fw-bold mb-2">${item.name}</h5>
            <p class="text-muted small mb-3 text-truncate-2">${item.description}</p>
            <div class="mb-3">${badge}</div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-secondary w-100" onclick="openEditGiftModal('${item.id}')"><i class="fa-solid fa-pen-to-square me-1"></i> Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteGift('${item.id}')" title="Excluir Presente"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

function openAddGiftModal() {
  document.getElementById("gift-form").reset();
  document.getElementById("gift-id-field").value = "";
  document.getElementById("gift-chosen-field").checked = false;
  document.getElementById("gift-chosen-by-wrapper").classList.add("d-none");
  document.getElementById("giftModalLabel").textContent = "Novo Presente";

  const modal = new bootstrap.Modal(document.getElementById("giftModal"));
  modal.show();
}
window.openAddGiftModal = openAddGiftModal;

function openEditGiftModal(id) {
  const db = DB.get();
  const gift = db.gifts.find(g => g.id === id);
  if (!gift) return;

  document.getElementById("gift-id-field").value = gift.id;
  document.getElementById("gift-name-field").value = gift.name;
  document.getElementById("gift-desc-field").value = gift.description;
  document.getElementById("gift-value-field").value = gift.value;
  document.getElementById("gift-image-field").value = gift.image;
  
  const chosenChk = document.getElementById("gift-chosen-field");
  chosenChk.checked = gift.chosen;

  const wrapper = document.getElementById("gift-chosen-by-wrapper");
  const chosenByField = document.getElementById("gift-chosen-by-field");
  
  if (gift.chosen) {
    wrapper.classList.remove("d-none");
    chosenByField.value = gift.chosenBy;
  } else {
    wrapper.classList.add("d-none");
    chosenByField.value = "";
  }

  document.getElementById("giftModalLabel").textContent = "Editar Presente";
  const modal = new bootstrap.Modal(document.getElementById("giftModal"));
  modal.show();
}
window.openEditGiftModal = openEditGiftModal;

function toggleGiftGiverField() {
  const chk = document.getElementById("gift-chosen-field").checked;
  const wrapper = document.getElementById("gift-chosen-by-wrapper");
  if (chk) {
    wrapper.classList.remove("d-none");
  } else {
    wrapper.classList.add("d-none");
    document.getElementById("gift-chosen-by-field").value = "";
  }
}
window.toggleGiftGiverField = toggleGiftGiverField;

function handleGiftSave(event) {
  event.preventDefault();

  const id = document.getElementById("gift-id-field").value;
  const name = document.getElementById("gift-name-field").value;
  const desc = document.getElementById("gift-desc-field").value;
  const value = parseFloat(document.getElementById("gift-value-field").value) || 0;
  const image = document.getElementById("gift-image-field").value || "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=300";
  const chosen = document.getElementById("gift-chosen-field").checked;
  const chosenBy = document.getElementById("gift-chosen-by-field").value;

  if (!name.trim()) return;

  const db = DB.get();

  if (id) {
    // Editar
    const index = db.gifts.findIndex(g => g.id === id);
    if (index !== -1) {
      db.gifts[index] = {
        ...db.gifts[index],
        name,
        description: desc,
        value,
        image,
        chosen,
        chosenBy: chosen ? chosenBy : ""
      };
    }
  } else {
    // Novo
    const newGift = {
      id: "gift_" + Date.now(),
      name,
      description: desc,
      value,
      image,
      chosen,
      chosenBy: chosen ? chosenBy : ""
    };
    db.gifts.push(newGift);
  }

  DB.save(db);

  // Fecha Modal
  const modalEl = document.getElementById("giftModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  // Re-render
  renderGiftsAdmin();
  updateDashboardStats();
}
window.handleGiftSave = handleGiftSave;

function deleteGift(id) {
  if (confirm("Remover este presente da lista definitivamente?")) {
    const db = DB.get();
    db.gifts = db.gifts.filter(g => g.id !== id);
    DB.save(db);
    renderGiftsAdmin();
    updateDashboardStats();
  }
}
window.deleteGift = deleteGift;

/* ==========================================================================
   8. CONFIGURAÇÕES DO CONTEÚDO DO SITE (FORMULÁRIOS)
   ========================================================================== */
function populateConfigForms() {
  const db = DB.get();

  // Geral
  document.getElementById("cfg-name").value = db.config.name;
  document.getElementById("cfg-quote").value = db.config.quote;
  document.getElementById("cfg-party-date").value = db.config.partyDate.slice(0, 16); // Formata yyyy-MM-ddThh:mm
  document.getElementById("cfg-birthday-date").value = db.config.birthdayDate.slice(0, 16);

  // Local & Pix
  document.getElementById("cfg-pix").value = db.config.pixKey;
  document.getElementById("cfg-dress").value = db.config.dressCode;
  document.getElementById("cfg-address").value = db.config.location.address;
  document.getElementById("cfg-time").value = db.config.location.time;
  document.getElementById("cfg-parking").value = db.config.location.parking;
  document.getElementById("cfg-map").value = db.config.location.mapUrl;

  // Vídeo
  if (db.videos.length > 0) {
    document.getElementById("cfg-video-title").value = db.videos[0].title;
    document.getElementById("cfg-video-url").value = db.videos[0].videoUrl;
  }
}

function saveGeneralConfig(event) {
  event.preventDefault();
  const db = DB.get();

  db.config.name = document.getElementById("cfg-name").value;
  db.config.quote = document.getElementById("cfg-quote").value;
  db.config.partyDate = document.getElementById("cfg-party-date").value;
  db.config.birthdayDate = document.getElementById("cfg-birthday-date").value;

  DB.save(db);
  alert("Configurações Gerais salvas com sucesso!");
}
window.saveGeneralConfig = saveGeneralConfig;

function saveLocalPixConfig(event) {
  event.preventDefault();
  const db = DB.get();

  db.config.pixKey = document.getElementById("cfg-pix").value;
  db.config.dressCode = document.getElementById("cfg-dress").value;
  
  db.config.location = {
    address: document.getElementById("cfg-address").value,
    time: document.getElementById("cfg-time").value,
    parking: document.getElementById("cfg-parking").value,
    mapUrl: document.getElementById("cfg-map").value
  };

  DB.save(db);
  alert("Local e informações de Pix salvas com sucesso!");
}
window.saveLocalPixConfig = saveLocalPixConfig;

function saveVideoConfig(event) {
  event.preventDefault();
  const db = DB.get();

  const title = document.getElementById("cfg-video-title").value;
  const url = document.getElementById("cfg-video-url").value;

  if (db.videos.length > 0) {
    db.videos[0].title = title;
    db.videos[0].videoUrl = url;
  } else {
    db.videos.push({
      id: "v1",
      title: title,
      videoUrl: url,
      type: "youtube"
    });
  }

  DB.save(db);
  alert("Vídeo da retrospectiva atualizado!");
}
window.saveVideoConfig = saveVideoConfig;

/* ==========================================================================
   9. EXPORTADORES (CSV, EXCEL, PDF)
   ========================================================================== */
function exportData(type) {
  const db = DB.get();
  
  if (db.rsvps.length === 0) {
    alert("Não há dados de convidados para exportar.");
    return;
  }

  if (type === 'csv' || type === 'excel') {
    let content = "";
    const headers = ["Nome", "Telefone", "Email", "Acomp Adultos", "Acomp Criancas", "Acompanhantes", "Restricoes", "Data de Confirmacao"];
    
    if (type === 'excel') {
      // Formato compatível com Excel (separado por tabulação)
      content = headers.join("\t") + "\n";
      db.rsvps.forEach(r => {
        const row = [
          r.name,
          r.phone || "",
          r.email || "",
          r.adultsCount,
          r.kidsCount,
          r.companionNames || "",
          r.dietaryRestrictions || "Sem restrições",
          new Date(r.dateConfirmed).toLocaleString('pt-BR')
        ];
        content += row.join("\t") + "\n";
      });
      
      const blob = new Blob(["\ufeff" + content], { type: "application/vnd.ms-excel;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `convidados_lavinia_15_anos_${Date.now()}.xls`;
      link.click();
    } else {
      // Formato CSV comum (valores entre aspas e separados por vírgula)
      content = headers.map(h => `"${h}"`).join(",") + "\n";
      db.rsvps.forEach(r => {
        const row = [
          r.name,
          r.phone || "",
          r.email || "",
          r.adultsCount,
          r.kidsCount,
          r.companionNames || "",
          r.dietaryRestrictions || "Sem restrições",
          new Date(r.dateConfirmed).toLocaleString('pt-BR')
        ];
        content += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
      });

      const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `convidados_lavinia_15_anos_${Date.now()}.csv`;
      link.click();
    }
  } else if (type === 'pdf') {
    // Exportação em PDF utilizando html2pdf.js
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 25px; color: #2c2c2c;">
        <div style="text-align: center; border-bottom: 2px solid #B76E79; padding-bottom: 15px; margin-bottom: 25px;">
          <h1 style="color: #B76E79; margin: 0; font-size: 24px;">Relatório de Convidados Confirmados</h1>
          <h2 style="color: #6C757D; margin: 5px 0 0 0; font-size: 16px; font-weight: normal;">Lavinia - 15 Anos</h2>
          <p style="margin: 5px 0 0 0; font-size: 12px;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa; border-bottom: 1.5px solid #dee2e6;">
              <th style="padding: 8px; text-align: left; border: 1px solid #dee2e6;">Nome</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #dee2e6;">Telefone</th>
              <th style="padding: 8px; text-align: center; border: 1px solid #dee2e6;">Adultos</th>
              <th style="padding: 8px; text-align: center; border: 1px solid #dee2e6;">Crianças</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #dee2e6;">Acompanhantes</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #dee2e6;">Restrições</th>
            </tr>
          </thead>
          <tbody>
            ${db.rsvps.map(r => `
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">${r.name}</td>
                <td style="padding: 8px; border: 1px solid #dee2e6;">${r.phone || "--"}</td>
                <td style="padding: 8px; border: 1px solid #dee2e6; text-align: center;">${1 + parseInt(r.adultsCount)}</td>
                <td style="padding: 8px; border: 1px solid #dee2e6; text-align: center;">${r.kidsCount}</td>
                <td style="padding: 8px; border: 1px solid #dee2e6; font-size: 10px;">${r.companionNames || "--"}</td>
                <td style="padding: 8px; border: 1px solid #dee2e6; color: #b76e79;">${r.dietaryRestrictions || "Sem restrições"}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const opt = {
      margin:       0.5,
      filename:     `convidados_lavinia_15_anos_${Date.now()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  }
}
window.exportData = exportData;
