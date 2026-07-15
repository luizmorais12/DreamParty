// db.js - Gerenciamento de Persistência com Supabase e Fallback em LocalStorage

const DB_KEY = 'lavinia_15_anos_db';

// CONFIGURAÇÃO GLOBAL DO SUPABASE (Opcional - Para quando publicar o site na internet)
// Insira as chaves abaixo para que todos os seus convidados conectem ao mesmo banco automaticamente.
const SUPABASE_URL_DEFAULT = 'https://mfxjhsszkywwkpqfuepp.supabase.co';
const SUPABASE_ANON_KEY_DEFAULT = 'sb_publishable_uMlijmLuk7X_3NfD1bsPyQ_Eos7A9t2';

const defaultDatabase = {
  config: {
    name: "Lavinia dos Santos Mattos",
    partyDate: "2026-11-02T21:00:00",
    birthdayDate: "2026-11-02T00:00:00",
    quote: "Cada sonho merece uma noite para se tornar realidade.",
    heroImage: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=1920",
    musicTracks: [
      { id: "1", title: "Beauty and the Beast (Piano)", artist: "Disney Instrumental", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { id: "2", title: "Valsa das Flores", artist: "Tchaikovsky", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      { id: "3", title: "Perfect (Piano Version)", artist: "Ed Sheeran Cover", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
    ],
    currentTrackId: "1",
    pixKey: "lavinia15anos@pix.com.br",
    pixQrCode: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126580014br.gov.bcb.pix0119lavinia15anos@pix.com.br5204000053039865802BR5925LAVINIA%20DOS%20SANTOS%20MATTOS6009SAO%20PAULO62070503***63041A2D",
    dressCode: "Gala / Esporte Fino: Sugerimos tons pastéis claros para harmonizar com nosso Jardim Encantado.",
    location: {
      address: "Mansão das Flores, Av. das Rosas, 1500 - Rio de Janeiro, RJ",
      time: "21:00",
      parking: "Serviço de manobrista gratuito no local para todos os convidados.",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.84478149867!2d-43.22699892377747!3d-22.955986479219894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997fd59828d11f%3A0x2865910fae13467e!2sParque%20Lage!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
    }
  },
  timeline: [
    {
      id: "t1",
      age: "Nascimento (2011)",
      title: "O início de tudo",
      description: "Lavinia chegou trazendo luz e alegria ao mundo no dia 2 de novembro de 2011. Um bebê doce que desde cedo já encantava a todos com seu sorriso.",
      image: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?q=80&w=800"
    },
    {
      id: "t2",
      age: "5 Anos (2016)",
      title: "Primeiros passinhos no jardim",
      description: "Amante da natureza e de brincar ao ar livre. Aqui ela já ensaiava seus primeiros passos de dança e adorava se fantasiar de princesa.",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800"
    },
    {
      id: "t3",
      age: "10 Anos (2021)",
      title: "Descobertas e Amizades",
      description: "Uma menina sonhadora, dedicada aos estudos e muito apegada à família. Seu amor pelas artes e pela música começou a florescer.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800"
    },
    {
      id: "t4",
      age: "15 Anos (Hoje)",
      title: "A realização de um sonho",
      description: "Chegou o grande momento! Lavinia floresceu e está pronta para celebrar o início de um novo capítulo em uma noite mágica cercada de quem ama.",
      image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800"
    }
  ],
  gallery: [
    { id: "g1", title: "Ensaio Jardim 1", category: "ensaio", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800" },
    { id: "g2", title: "Sorriso Doce", category: "ensaio", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800" },
    { id: "g3", title: "Recordação de Infância", category: "infancia", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800" },
    { id: "g4", title: "Com a Família", category: "familia", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800" },
    { id: "g5", title: "Brilho no Olhar", category: "ensaio", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800" },
    { id: "g6", title: "Passeio Especial", category: "familia", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800" }
  ],
  videos: [
    { id: "v1", title: "Teaser Oficial do Ensaio de 15 Anos", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", type: "youtube" }
  ],
  gifts: [
    { id: "gft1", name: "Passaporte para o País das Maravilhas", description: "Ajude Lavinia a fazer sua viagem dos sonhos após a festa.", value: 500, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300", chosen: false, chosenBy: "" },
    { id: "gft2", name: "Ensaio Fotográfico Álbum de Luxo", description: "Uma recordação eterna impressa em papel fotográfico importado.", value: 300, image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=300", chosen: false, chosenBy: "" },
    { id: "gft3", name: "Dia de Princesa no SPA", description: "Massagem relaxante, banho de pétalas e cuidados especiais pré-festa.", value: 200, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=300", chosen: false, chosenBy: "" },
    { id: "gft4", name: "Sapato de Cristal da Valsa", description: "Contribuição para o icônico sapato que será usado na valsa da meia-noite.", value: 150, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300", chosen: true, chosenBy: "Maria Alice (Tia)" },
    { id: "gft5", name: "Arranjo Flor de Cerejeira", description: "Ajuda para a ambientação com lindas flores de cerejeira na entrada.", value: 100, image: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=300", chosen: false, chosenBy: "" },
    { id: "gft6", name: "Caixa de Bombons Finos Belgas", description: "Mimos doces para adoçar a mesa de doces finos.", value: 50, image: "https://images.unsplash.com/photo-1549007994-cb92ca888bd6?q=80&w=300", chosen: false, chosenBy: "" }
  ],
  rsvps: [
    { id: "r1", name: "Claudio Mattos", phone: "(21) 98888-7777", email: "claudio@email.com", adultsCount: 2, kidsCount: 1, companionNames: "Camila Mattos, Lucas Mattos", dietaryRestrictions: "Sem restrições", message: "Mal posso esperar por este grande dia!", dateConfirmed: "2026-07-01T15:30:00" },
    { id: "r2", name: "Ana Beatriz Ramos", phone: "(21) 97777-6666", email: "ana.beatriz@email.com", adultsCount: 1, kidsCount: 0, companionNames: "", dietaryRestrictions: "Vegetariana", message: "Lavinia, você vai estar linda! Parabéns!", dateConfirmed: "2026-07-05T18:45:00" }
  ],
  messages: [
    { id: "m1", author: "Madrinha Sandra", relation: "Madrinha", text: "Minha afilhada linda, ver você completar 15 anos enche meu coração de orgulho. Que sua jornada seja sempre iluminada e abençoada!", date: "2026-07-06T10:00:00", approved: true },
    { id: "m2", author: "Lucas Santos", relation: "Amigo de Escola", text: "Parabéns, Lavi! A festa vai ser demais! Muito feliz em fazer parte desse dia.", date: "2026-07-07T14:20:00", approved: true },
    { id: "m3", author: "Tio Renato", relation: "Tio", text: "Muitas felicidades, minha querida sobrinha! Que papai do céu guie sempre seus caminhos.", date: "2026-07-07T20:10:00", approved: false }
  ],
  schedule: [
    { time: "21:00", title: "Recepção dos Convidados", icon: "fa-door-open" },
    { time: "22:00", title: "Jantar dos Convidados", icon: "fa-utensils" },
    { time: "23:30", title: "Cerimonial & Valsa", icon: "fa-crown" },
    { time: "00:30", title: "Abertura da Balada", icon: "fa-compact-disc" },
    { time: "05:00", title: "Encerramento da Festa", icon: "fa-moon" }
  ]
};

// Funções locais auxiliares de LocalStorage
function loadDBLocal() {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDatabase));
    return defaultDatabase;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Erro ao carregar banco de dados local. Resetando...", e);
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDatabase));
    return defaultDatabase;
  }
}

function saveDBLocal(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Objeto de banco de dados global com integração do Supabase
const DB = {
  isSupabase: false,
  supabaseClient: null,

  // Inicializa a conexão com o Supabase se configurado
  init: async () => {
    const sbUrl = localStorage.getItem("supabase_url") || SUPABASE_URL_DEFAULT;
    const sbKey = localStorage.getItem("supabase_anon_key") || SUPABASE_ANON_KEY_DEFAULT;
    
    if (sbUrl && sbKey && typeof supabase !== 'undefined') {
      try {
        DB.supabaseClient = supabase.createClient(sbUrl, sbKey);
        // Testar a conexão puxando as configurações
        const { data, error } = await DB.supabaseClient.from('settings').select('*').limit(1);
        if (error) throw error;
        
        DB.isSupabase = true;
        console.log("Supabase inicializado e conectado com sucesso!");
        updateStatusBadge();
        return true;
      } catch (e) {
        console.error("Erro de conexão ao Supabase. Utilizando fallback local:", e);
        DB.isSupabase = false;
      }
    } else {
      DB.isSupabase = false;
    }
    updateStatusBadge();
    return false;
  },

  // Retorna os dados agregados (seja do Supabase ou do LocalStorage)
  get: async () => {
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        const [rsvpsRes, messagesRes, giftsRes, settingsRes] = await Promise.all([
          DB.supabaseClient.from('rsvps').select('*'),
          DB.supabaseClient.from('messages').select('*'),
          DB.supabaseClient.from('gifts').select('*'),
          DB.supabaseClient.from('settings').select('*').eq('key', 'site_config').maybeSingle()
        ]);

        if (rsvpsRes.error) throw rsvpsRes.error;
        if (messagesRes.error) throw messagesRes.error;
        if (giftsRes.error) throw giftsRes.error;

        // Recupera valores padrão
        let config = { ...defaultDatabase.config };
        let timeline = [...defaultDatabase.timeline];
        let gallery = [...defaultDatabase.gallery];
        let videos = [...defaultDatabase.videos];
        let schedule = [...defaultDatabase.schedule];

        // Se houver config personalizada no Supabase
        if (settingsRes.data && settingsRes.data.value) {
          const val = settingsRes.data.value;
          config = val.config || val;
          timeline = val.timeline || timeline;
          gallery = val.gallery || gallery;
          videos = val.videos || videos;
          schedule = val.schedule || schedule;
          
          config.timeline = timeline;
          config.gallery = gallery;
          config.videos = videos;
          config.schedule = schedule;
        }

        const messages = (messagesRes.data || []).map(m => ({
          id: m.id,
          author: m.author,
          relation: m.relation,
          text: m.text,
          date: m.date,
          approved: m.approved ?? false
        }));

        const gifts = (giftsRes.data || []).map(g => ({
          id: g.id,
          name: g.name,
          description: g.description,
          value: parseFloat(g.value),
          image: g.image,
          chosen: g.chosen ?? false,
          chosenBy: g.chosen_by || ""
        })).sort((a, b) => b.value - a.value);

        const rsvps = (rsvpsRes.data || []).map(r => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          adultsCount: r.adults_count ?? 0,
          kidsCount: r.kids_count ?? 0,
          companionNames: r.companion_names || "",
          dietaryRestrictions: r.dietary_restrictions || "Sem restrições",
          message: r.message || "",
          dateConfirmed: r.date_confirmed
        }));

        return {
          config,
          timeline,
          gallery,
          videos,
          gifts,
          rsvps,
          messages,
          schedule
        };
      } catch (err) {
        console.error("Erro na leitura assíncrona do Supabase. Alternando para LocalStorage:", err);
        return loadDBLocal();
      }
    }
    return loadDBLocal();
  },

  // Salva configurações gerais (config, timeline, galeria, etc.)
  saveConfig: async (configData) => {
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        const { error } = await DB.supabaseClient.from('settings').upsert({
          key: 'site_config',
          value: configData
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao salvar configurações no Supabase:", err);
        return false;
      }
    } else {
      const db = loadDBLocal();
      db.config = { ...db.config, ...configData };
      if (configData.timeline) db.timeline = configData.timeline;
      if (configData.gallery) db.gallery = configData.gallery;
      if (configData.videos) db.videos = configData.videos;
      if (configData.schedule) db.schedule = configData.schedule;
      saveDBLocal(db);
      return true;
    }
  },

  // Grava confirmação RSVP
  saveRsvp: async (rsvp) => {
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        const { error } = await DB.supabaseClient.from('rsvps').upsert({
          id: rsvp.id,
          name: rsvp.name,
          phone: rsvp.phone,
          email: rsvp.email,
          adults_count: parseInt(rsvp.adultsCount),
          kids_count: parseInt(rsvp.kidsCount),
          companion_names: rsvp.companionNames,
          dietary_restrictions: rsvp.dietaryRestrictions,
          message: rsvp.message,
          date_confirmed: rsvp.dateConfirmed
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao salvar RSVP no Supabase:", err);
        return false;
      }
    } else {
      const db = loadDBLocal();
      const idx = db.rsvps.findIndex(r => r.id === rsvp.id);
      if (idx !== -1) {
        db.rsvps[idx] = rsvp;
      } else {
        db.rsvps.push(rsvp);
      }
      saveDBLocal(db);
      return true;
    }
  },

  // Deleta confirmação RSVP
  deleteRsvp: async (id) => {
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        const { error } = await DB.supabaseClient.from('rsvps').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao deletar RSVP no Supabase:", err);
        return false;
      }
    } else {
      const db = loadDBLocal();
      db.rsvps = db.rsvps.filter(r => r.id !== id);
      saveDBLocal(db);
      return true;
    }
  },

  // Grava Mensagem (Livro de Visitas)
  saveMessage: async (msg) => {
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        const { error } = await DB.supabaseClient.from('messages').upsert({
          id: msg.id,
          author: msg.author,
          relation: msg.relation,
          text: msg.text,
          date: msg.date,
          approved: msg.approved
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao salvar mensagem no Supabase:", err);
        return false;
      }
    } else {
      const db = loadDBLocal();
      const idx = db.messages.findIndex(m => m.id === msg.id);
      if (idx !== -1) {
        db.messages[idx] = msg;
      } else {
        db.messages.push(msg);
      }
      saveDBLocal(db);
      return true;
    }
  },

  // Deleta Mensagem
  deleteMessage: async (id) => {
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        const { error } = await DB.supabaseClient.from('messages').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao excluir mensagem no Supabase:", err);
        return false;
      }
    } else {
      const db = loadDBLocal();
      db.messages = db.messages.filter(m => m.id !== id);
      saveDBLocal(db);
      return true;
    }
  },

  // Grava Presente (CRUD ou Escolha)
  saveGift: async (gift) => {
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        const { error } = await DB.supabaseClient.from('gifts').upsert({
          id: gift.id,
          name: gift.name,
          description: gift.description,
          value: parseFloat(gift.value),
          image: gift.image,
          chosen: gift.chosen,
          chosen_by: gift.chosenBy
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao salvar presente no Supabase:", err);
        return false;
      }
    } else {
      const db = loadDBLocal();
      const idx = db.gifts.findIndex(g => g.id === gift.id);
      if (idx !== -1) {
        db.gifts[idx] = gift;
      } else {
        db.gifts.push(gift);
      }
      saveDBLocal(db);
      return true;
    }
  },

  // Deleta Presente
  deleteGift: async (id) => {
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        const { error } = await DB.supabaseClient.from('gifts').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao excluir presente no Supabase:", err);
        return false;
      }
    } else {
      const db = loadDBLocal();
      db.gifts = db.gifts.filter(g => g.id !== id);
      saveDBLocal(db);
      return true;
    }
  },

  // Reseta banco de dados para os valores padrão
  reset: async () => {
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        // Limpa tabelas
        await Promise.all([
          DB.supabaseClient.from('rsvps').delete().neq('id', 'null'),
          DB.supabaseClient.from('messages').delete().neq('id', 'null'),
          DB.supabaseClient.from('gifts').delete().neq('id', 'null'),
          DB.supabaseClient.from('settings').delete().eq('key', 'site_config')
        ]);

        // Insere as configurações padrão
        await DB.supabaseClient.from('settings').insert({
          key: 'site_config',
          value: {
            config: defaultDatabase.config,
            timeline: defaultDatabase.timeline,
            gallery: defaultDatabase.gallery,
            videos: defaultDatabase.videos,
            schedule: defaultDatabase.schedule
          }
        });

        // Insere mimos, convidados e mensagens padrão
        for (const r of defaultDatabase.rsvps) {
          await DB.saveRsvp(r);
        }
        for (const m of defaultDatabase.messages) {
          await DB.saveMessage(m);
        }
        for (const g of defaultDatabase.gifts) {
          await DB.saveGift(g);
        }
        console.log("Supabase resetado com sucesso.");
      } catch (e) {
        console.error("Falha ao resetar banco do Supabase:", e);
      }
    }
    
    // Backup local
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDatabase));
    return defaultDatabase;
  }
};

// Atualiza o crachá indicador de status de conexão no header
function updateStatusBadge() {
  const badge = document.getElementById("db-status-badge");
  if (!badge) return;
  if (DB.isSupabase) {
    badge.className = "badge bg-info-subtle text-info border border-info-subtle px-3 py-2 rounded-pill";
    badge.innerHTML = `<i class="fa-solid fa-cloud me-1"></i> Sincronizado com Supabase`;
  } else {
    badge.className = "badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill";
    badge.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Banco de Dados Local Ativo`;
  }
}

// Execução imediata de inicialização do DB ao carregar o script
DB.init();

// Exportar globalmente
window.DB = DB;
