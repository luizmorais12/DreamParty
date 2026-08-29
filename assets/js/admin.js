// admin.js - Lógica de Controle do Painel Administrativo (Integrado com Supabase / LocalStorage)

let guestsChartInstance = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Configuração da data atual no painel
  const optDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("admin-welcome-date").textContent = new Date().toLocaleDateString('pt-BR', optDate);

  // Inicializa banco de dados (detecta se há Supabase)
  await DB.init();

  // Verifica Autenticação
  await checkAuth();


});

/* ==========================================================================
   1. AUTENTICAÇÃO E LOGIN
   ========================================================================== */
async function checkAuth() {
  const loggedIn = sessionStorage.getItem("lavinia_logged_in");
  const loginScreen = document.getElementById("admin-login-screen");
  const mainPanel = document.getElementById("admin-main-panel");

  if (loggedIn === "true") {
    loginScreen.classList.add("d-none");
    mainPanel.classList.remove("d-none");
    await initAdminPanel();
  } else {
    loginScreen.classList.remove("d-none");
    mainPanel.classList.add("d-none");
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById("admin-password").value;
  const errorAlert = document.getElementById("login-error-alert");

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
async function initAdminPanel() {
  await updateDashboardStats();
  await renderGuestTable();
  await renderModerationGrid();
  await populateConfigForms();
}

async function resetDatabaseToDefault() {
  if (confirm("ATENÇÃO: Isso restaurará todos os dados originais do site, excluindo confirmações recentes, mensagens enviadas e edições de texto. Deseja prosseguir?")) {
    await DB.reset();
    alert("Banco de dados restaurado com sucesso!");
    location.reload();
  }
}
window.resetDatabaseToDefault = resetDatabaseToDefault;

/* ==========================================================================
   3. SIDEBAR NAVIGATION
   ========================================================================== */
async function switchSection(sectionId, element) {
  // Esconde a sidebar no mobile ao trocar de seção
  if (window.innerWidth < 768) {
    toggleAdminSidebar(false);
  }

  const sections = document.querySelectorAll(".admin-section");
  sections.forEach(sec => sec.classList.add("d-none"));

  const targetSec = document.getElementById(`sec-${sectionId}`);
  if (targetSec) {
    targetSec.classList.remove("d-none");
  }

  const navItems = document.querySelectorAll(".admin-nav-item");
  navItems.forEach(item => item.classList.remove("active"));
  element.classList.add("active");

  if (sectionId === "dashboard") {
    await updateDashboardStats();
  } else if (sectionId === "convidados") {
    await renderGuestTable();
  } else if (sectionId === "moderacao") {
    await renderModerationGrid();
  } else if (sectionId === "fotos-convidados") {
    await renderGuestPhotosAdmin();
  }
}
window.switchSection = switchSection;

/* ==========================================================================
   4. DASHBOARD - ESTATÍSTICAS E GRÁFICOS
   ========================================================================== */
async function updateDashboardStats() {
  const db = await DB.get();

  let totalAdults = 0;
  let totalKids = 0;

  db.rsvps.forEach(rsvp => {
    totalAdults += 1 + parseInt(rsvp.adultsCount || 0);
    totalKids += parseInt(rsvp.kidsCount || 0);
  });

  const grandTotal = totalAdults + totalKids;
  document.getElementById("dash-total-guests").textContent = grandTotal;
  document.getElementById("dash-adults").textContent = totalAdults;
  document.getElementById("dash-kids").textContent = totalKids;

  const feed = document.getElementById("dash-notifications");
  feed.innerHTML = "";

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
          'rgba(183, 110, 121, 0.85)',
          'rgba(212, 175, 55, 0.85)'
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
async function renderGuestTable() {
  const db = await DB.get();
  const tbody = document.getElementById("guests-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (db.rsvps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">Nenhum convidado confirmado até o momento.</td></tr>`;
    return;
  }

  const sorted = [...db.rsvps].sort((a,b) => new Date(b.dateConfirmed) - new Date(a.dateConfirmed));

  sorted.forEach(rsvp => {
    const row = document.createElement("tr");
    const dConfirmed = new Date(rsvp.dateConfirmed).toLocaleString('pt-BR', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    const rLabel = (rsvp.dietaryRestrictions && rsvp.dietaryRestrictions !== "Sem restrições" && rsvp.dietaryRestrictions.trim() !== "")
      ? `<span class="badge bg-warning-subtle text-warning border border-warning-subtle text-wrap">${rsvp.dietaryRestrictions}</span>`
      : `<span class="text-muted small">Nenhuma</span>`;

    row.innerHTML = `
      <td class="fw-bold">${rsvp.name}</td>
      <td class="d-none d-md-table-cell">${rsvp.phone || "--"}</td>
      <td class="d-none d-lg-table-cell text-lowercase">${rsvp.email || "--"}</td>
      <td class="text-center">${rsvp.adultsCount}</td>
      <td class="text-center">${rsvp.kidsCount}</td>
      <td class="d-none d-md-table-cell text-muted text-truncate" style="max-width: 150px;" title="${rsvp.companionNames || ""}">${rsvp.companionNames || "--"}</td>
      <td>${rLabel}</td>
      <td class="d-none d-md-table-cell text-muted">${dConfirmed}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-danger" onclick="deleteGuest('${rsvp.id}')" title="Excluir Convidado">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function deleteGuest(id) {
  if (confirm("Tem certeza que deseja excluir esta confirmação? Os dados serão removidos definitivamente.")) {
    const success = await DB.deleteRsvp(id);
    if (success) {
      await renderGuestTable();
      await updateDashboardStats();
    } else {
      alert("Erro ao excluir convidado. Detalhes: " + (DB.lastError || "Erro de permissão ou conexão") + "\n\nSe estiver usando o Supabase, certifique-se de que desabilitou a segurança de linha (RLS) para a tabela 'rsvps' executando o script SQL no editor do Supabase.");
    }
  }
}
window.deleteGuest = deleteGuest;

async function handleManualGuestAdd(event) {
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

  const success = await DB.saveRsvp(newRsvp);
  if (success) {
    const modalEl = document.getElementById("addGuestModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    document.getElementById("add-guest-form").reset();

    await renderGuestTable();
    await updateDashboardStats();
  } else {
    alert("Erro ao salvar convidado. Detalhes: " + (DB.lastError || "Erro de permissão ou conexão") + "\n\nSe estiver usando o Supabase, certifique-se de que desabilitou a segurança de linha (RLS) para a tabela 'rsvps' executando o script SQL no editor do Supabase.");
  }
}
window.handleManualGuestAdd = handleManualGuestAdd;

function filterGuestTable() {
  const query = document.getElementById("search-guest-input").value.toLowerCase();
  const dietFilter = document.getElementById("filter-diet-select").value;
  const rows = document.querySelectorAll("#guests-table-body tr");

  rows.forEach(row => {
    if (row.cells.length < 5) return;

    const name = row.cells[0].textContent.toLowerCase();
    const phone = row.cells[1].textContent.toLowerCase();
    const email = row.cells[2].textContent.toLowerCase();
    const companions = row.cells[5].textContent.toLowerCase();
    const diet = row.cells[6].textContent.toLowerCase();

    const matchesQuery = name.includes(query) || phone.includes(query) || email.includes(query) || companions.includes(query);
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
async function renderModerationGrid() {
  const db = await DB.get();
  const grid = document.getElementById("messages-moderation-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (db.messages.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center text-muted py-5">Nenhuma mensagem deixada por convidados.</div>`;
    return;
  }

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

async function approveMessage(id) {
  const db = await DB.get();
  const msg = db.messages.find(m => m.id === id);
  if (msg) {
    msg.approved = true;
    const success = await DB.saveMessage(msg);
    if (success) {
      await renderModerationGrid();
      await updateDashboardStats();
    } else {
      alert("Erro ao aprovar mensagem. Detalhes: " + (DB.lastError || "Erro de permissão ou conexão") + "\n\nSe estiver usando o Supabase, certifique-se de que desabilitou a segurança de linha (RLS) para a tabela 'messages' executando o script SQL no editor do Supabase.");
    }
  }
}
window.approveMessage = approveMessage;

async function deleteMessage(id) {
  if (confirm("Excluir esta mensagem de forma definitiva?")) {
    const success = await DB.deleteMessage(id);
    if (success) {
      await renderModerationGrid();
      await updateDashboardStats();
    } else {
      alert("Erro ao excluir mensagem. Detalhes: " + (DB.lastError || "Erro de permissão ou conexão") + "\n\nSe estiver usando o Supabase, certifique-se de que desabilitou a segurança de linha (RLS) para a tabela 'messages' executando o script SQL no editor do Supabase.");
    }
  }
}
window.deleteMessage = deleteMessage;



/* ==========================================================================
   7.5. GERENCIAMENTO DAS FOTOS DOS CONVIDADOS
   ========================================================================== */
async function renderGuestPhotosAdmin() {
  const db = await DB.get();
  const grid = document.getElementById("guest-photos-admin-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const guestPhotos = (db.gallery || []).filter(item => item.category === "convidados");

  if (guestPhotos.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center text-muted py-5">
        <i class="fa-solid fa-images fs-1 mb-3 d-block text-rose-gold"></i>
        Nenhuma foto foi enviada pelos convidados ainda.
      </div>
    `;
    return;
  }

  guestPhotos.forEach(item => {
    const col = document.createElement("div");
    col.classList.add("col-sm-6", "col-md-4", "col-lg-3");

    col.innerHTML = `
      <div class="card h-100 shadow-sm" style="border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
        <div style="height: 180px; overflow: hidden; position: relative; background: #fafafa;">
          <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="card-body p-3 d-flex flex-column justify-content-between">
          <div class="mb-3">
            <h6 class="fw-bold mb-1 text-truncate" title="${item.title}">${item.title}</h6>
            <span class="badge bg-secondary-subtle text-secondary small">Foto do Convidado</span>
          </div>
          <button class="btn btn-sm btn-outline-danger w-100" onclick="deleteGuestPhoto('${item.id}')">
            <i class="fa-solid fa-trash me-1"></i> Excluir Foto
          </button>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}
window.renderGuestPhotosAdmin = renderGuestPhotosAdmin;

async function deleteGuestPhoto(id) {
  if (confirm("Deseja realmente excluir esta foto? Ela será removida definitivamente do site.")) {
    const success = await DB.deleteGalleryItem(id);
    if (success) {
      await renderGuestPhotosAdmin();
    } else {
      alert("Erro ao excluir foto. Detalhes: " + (DB.lastError || "Erro de conexão."));
    }
  }
}
window.deleteGuestPhoto = deleteGuestPhoto;

/* ==========================================================================
   8. CONFIGURAÇÕES DO CONTEÚDO DO SITE (FORMULÁRIOS)
   ========================================================================== */
async function populateConfigForms() {
  const db = await DB.get();

  // Geral
  document.getElementById("cfg-name").value = db.config.name;
  document.getElementById("cfg-quote").value = db.config.quote;
  document.getElementById("cfg-party-date").value = db.config.partyDate.slice(0, 16);
  document.getElementById("cfg-birthday-date").value = db.config.birthdayDate.slice(0, 16);

  // Local & Pix
  document.getElementById("cfg-pix").value = db.config.pixKey;
  document.getElementById("cfg-dress").value = db.config.dressCode;
  document.getElementById("cfg-address").value = db.config.location.address;
  document.getElementById("cfg-time").value = db.config.location.time;
  document.getElementById("cfg-parking").value = db.config.location.parking;
  document.getElementById("cfg-map").value = db.config.location.mapUrl;

  // Vídeo (Segurança para caso os campos tenham sido removidos)
  const videoTitleEl = document.getElementById("cfg-video-title");
  const videoUrlEl = document.getElementById("cfg-video-url");
  if (videoTitleEl && videoUrlEl && db.videos && db.videos.length > 0) {
    videoTitleEl.value = db.videos[0].title;
    videoUrlEl.value = db.videos[0].videoUrl;
  }

  // Credenciais Supabase
  document.getElementById("cfg-sb-url").value = localStorage.getItem("supabase_url") || "";
  document.getElementById("cfg-sb-key").value = localStorage.getItem("supabase_anon_key") || "";
}

async function saveGeneralConfig(event) {
  event.preventDefault();
  const db = await DB.get();

  db.config.name = document.getElementById("cfg-name").value;
  db.config.quote = document.getElementById("cfg-quote").value;
  db.config.partyDate = document.getElementById("cfg-party-date").value;
  db.config.birthdayDate = document.getElementById("cfg-birthday-date").value;

  const success = await DB.saveConfig(db.config);
  if (success) {
    alert("Configurações Gerais salvas com sucesso!");
  } else {
    alert("Erro ao salvar configurações gerais.");
  }
}
window.saveGeneralConfig = saveGeneralConfig;

async function saveLocalPixConfig(event) {
  event.preventDefault();
  const db = await DB.get();

  db.config.pixKey = document.getElementById("cfg-pix").value;
  db.config.dressCode = document.getElementById("cfg-dress").value;
  
  db.config.location = {
    address: document.getElementById("cfg-address").value,
    time: document.getElementById("cfg-time").value,
    parking: document.getElementById("cfg-parking").value,
    mapUrl: document.getElementById("cfg-map").value
  };

  const success = await DB.saveConfig(db.config);
  if (success) {
    alert("Local e informações de Pix salvas com sucesso!");
  } else {
    alert("Erro ao salvar informações de local.");
  }
}
window.saveLocalPixConfig = saveLocalPixConfig;

async function saveVideoConfig(event) {
  event.preventDefault();
  const db = await DB.get();

  const title = document.getElementById("cfg-video-title").value;
  const url = document.getElementById("cfg-video-url").value;

  let videos = db.videos;
  if (videos.length > 0) {
    videos[0].title = title;
    videos[0].videoUrl = url;
  } else {
    videos.push({
      id: "v1",
      title: title,
      videoUrl: url,
      type: "youtube"
    });
  }

  db.config.videos = videos;
  const success = await DB.saveConfig(db.config);
  if (success) {
    alert("Vídeo da retrospectiva atualizado!");
  } else {
    alert("Erro ao atualizar vídeo.");
  }
}
window.saveVideoConfig = saveVideoConfig;

// Gravar credenciais de conexão do Supabase
async function saveSupabaseConfig(event) {
  event.preventDefault();
  
  const sbUrl = document.getElementById("cfg-sb-url").value.trim();
  const sbKey = document.getElementById("cfg-sb-key").value.trim();

  if (!sbUrl || !sbKey) {
    alert("Por favor, preencha a URL e a Chave Anon antes de conectar.");
    return;
  }

  localStorage.setItem("supabase_url", sbUrl);
  localStorage.setItem("supabase_anon_key", sbKey);

  const connected = await DB.init();
  if (connected) {
    alert("Conectado ao Supabase com sucesso! Os dados foram sincronizados com a nuvem.");
    location.reload();
  } else {
    alert("Falha de conexão. Verifique as chaves fornecidas e garanta que as tabelas foram criadas via supabase_schema.sql.");
  }
}
window.saveSupabaseConfig = saveSupabaseConfig;

function clearSupabaseConfig() {
  if (confirm("Deseja mesmo remover a conexão com o Supabase? O site retornará a rodar em modo LocalStorage.")) {
    localStorage.removeItem("supabase_url");
    localStorage.removeItem("supabase_anon_key");
    alert("Conexão com o Supabase removida. Recarregando...");
    location.reload();
  }
}
window.clearSupabaseConfig = clearSupabaseConfig;

/* ==========================================================================
   9. EXPORTADORES (CSV, EXCEL, PDF)
   ========================================================================== */
async function exportData(type) {
  const db = await DB.get();
  
  if (db.rsvps.length === 0) {
    alert("Não há dados de convidados para exportar.");
    return;
  }

  if (type === 'csv' || type === 'excel') {
    let content = "";
    const headers = ["Nome", "Telefone", "Email", "Acomp Adultos", "Acomp Criancas", "Acompanhantes", "Restricoes", "Data de Confirmacao"];
    
    if (type === 'excel') {
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

/* ==========================================================================
   10. CONTROLE DO MENU LATERAL RESPONSIVO (MOBILE)
   ========================================================================== */
function toggleAdminSidebar(show) {
  const sidebar = document.getElementById("admin-sidebar");
  const overlay = document.getElementById("admin-sidebar-overlay");
  if (!sidebar) return;
  
  if (show) {
    sidebar.classList.add("show");
    if (overlay) overlay.classList.add("show");
  } else {
    sidebar.classList.remove("show");
    if (overlay) overlay.classList.remove("show");
  }
}
window.toggleAdminSidebar = toggleAdminSidebar;


