// db.js - Gerenciamento de Persistência com Supabase e Fallback em LocalStorage

const DB_KEY = 'lavinia_15_anos_db';

const SUPABASE_URL_DEFAULT = typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : '';
const SUPABASE_ANON_KEY_DEFAULT = typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : '';

const defaultDatabase = {
  config: {
    name: "Lavinia dos Santos Mattos",
    partyDate: "2026-11-02T21:00:00",
    birthdayDate: "2026-11-02T00:00:00",
    quote: "Cada sonho merece uma noite para se tornar realidade.",
    heroImage: "assets/IMG/fundo_hero_azul.jpeg",
    musicTracks: [
      { id: "1", title: "Video Games", artist: "Lana Del Rey", url: "https://archive.org/download/relax-fm-collection-vol.1-11/Relax%20FM%20-%20Collection%20%28Vol.1-11%29/2013%20-%20Relax%20FM%20-%20vol.11/09.%20Lana%20Del%20Rey%20-%20Video%20Games.mp3" }
    ],
    currentTrackId: "1",
    pixKey: "11963020240",
    pixQrCode: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021226330014br.gov.bcb.pix0111119630202405204000053039865802BR5925LAVINIA%20DOS%20SANTOS%20MATTOS6009SAO%20PAULO62070503***630452D5",
    dressCode: "Gala / Esporte Fino: Sugerimos tons pastéis claros para harmonizar com nosso Jardim Encantado.",
    location: {
      address: "Rua Piracicaba, 79 - Vila Augusta",
      time: "18:00",
      parking: "Serviço de manobrista gratuito no local para todos os convidados.",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.1834162794715!2d-46.57467612470732!3d-23.473551578854424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce58a9833f444f%3A0xe54d89e1a1b411d7!2sBuffet%20Venturi!5e0!3m2!1spt-BR!2sbr!4v1723983240000!5m2!1spt-BR!2sbr"
    }
  },
  timeline: [
    {
      id: "t1",
      age: "Nascimento (2011)",
      title: "O início de tudo",
      description: "Lavinia chegou trazendo luz e alegria ao mundo no dia 2 de novembro de 2011. Um bebê doce que desde cedo já encantava a todos com seu sorriso.",
      image: ""
    },
    {
      id: "t2",
      age: "5 Anos (2016)",
      title: "Primeiros passinhos no jardim",
      description: "Amante da natureza e de brincar ao ar livre. Aqui ela já ensaiava seus primeiros passos de dança e adorava se fantasiar de princesa.",
      image: ""
    },
    {
      id: "t3",
      age: "10 Anos (2021)",
      title: "Descobertas e Amizades",
      description: "Uma menina sonhadora, dedicada aos estudos e muito apegada à família. Seu amor pelas artes e pela música começou a florescer.",
      image: ""
    },
    {
      id: "t4",
      age: "15 Anos (Hoje)",
      title: "A realização de um sonho",
      description: "Chegou o grande momento! Lavinia floresceu e está pronta para celebrar o início de um novo capítulo em uma noite mágica cercada de quem ama.",
      image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (2).jpeg"
    }
  ],
  gallery: [
    { id: "g1", title: "Caminho dos Sonhos", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (1).jpeg", featured: true },
    { id: "g2", title: "Sorriso Encantado", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (2).jpeg" },
    { id: "g3", title: "Giro Encantado", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47.jpeg" },
    { id: "g4", title: "Olhar de Princesa", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47 (1).jpeg" },
    { id: "g5", title: "Amor de Mãe", category: "familia", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47 (2).jpeg" },
    { id: "g6", title: "Mar de Azul", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.48.jpeg" },
    { id: "g7", title: "Luz da Noite", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.48 (1).jpeg" },
    { id: "g8", title: "Dança com a Mãe", category: "familia", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49.jpeg" },
    { id: "g9", title: "Diante do Palácio", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49 (1).jpeg" },
    { id: "g10", title: "Jardim Encantado", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49 (2).jpeg" },
    { id: "g11", title: "Laços Eternos", category: "familia", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50.jpeg" },
    { id: "g12", title: "Conto de Fadas", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (3).jpeg", featured: true },
    { id: "g13", title: "Princesa do Palácio", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.25.42.jpeg" }
  ],
  videos: [
    { id: "v1", title: "Teaser Oficial do Ensaio de 15 Anos", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", type: "youtube" }
  ],
  giftGuide: {
    enabled: true,
    title: "Dicas de Presentes & Marcas Favoritas",
    subtitle: "Mimos & Inspirações da Debutante",
    quote: "O presente é você quem escolhe... mas separamos algumas dicas sobre os tamanhos e as lojas que a Lavínia mais ama para te ajudar!",
    sizes: {
      clothing: "M / P",
      shoes: "38",
      ring: "25",
      style: "Dourado, Tons Neutros & Brilho",
      perfume: "Florais e Doces Suaves",
      bag: "Pequenas / Tiracolo"
    },
    brands: [
      {
        id: "b1",
        name: "Zara",
        category: "Moda & Looks",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=400",
        tips: "Vestidos modernos, conjuntos elegantes e looks casuais. Tamanho: P / M.",
        url: "https://www.zara.com/br/"
      },
      {
        id: "b2",
        name: "Vivara",
        category: "Joias & Acessórios",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400",
        tips: "Anel tamanho 25, colares delicados, brincos e berloques Life by Vivara.",
        url: "https://www.vivara.com.br/"
      },
      {
        id: "b3",
        name: "Pandora",
        category: "Joias & Charms",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400",
        tips: "Anel tamanho 25, charms, braceletes e pingentes com brilho.",
        url: "https://www.pandorajoias.com.br/"
      },
      {
        id: "b4",
        name: "Sephora",
        category: "Beleza & Perfumes",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400",
        tips: "Skincare, maquiagens iluminadas e perfumes florais/adocicados importados.",
        url: "https://www.sephora.com.br/"
      },
      {
        id: "b5",
        name: "Schutz",
        category: "Calçados & Bolsas",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400",
        tips: "Sandálias modernas, saltos confortáveis e bolsas pequenas. Calçado: 38.",
        url: "https://www.schutz.com.br/"
      },
      {
        id: "b6",
        name: "Farm Rio",
        category: "Moda & Estilo",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400",
        tips: "Vestidos florais, croppeds e estampas coloridas. Tamanho: P / M.",
        url: "https://www.farmrio.com.br/"
      },
      {
        id: "b7",
        name: "Kiko Milano",
        category: "Maquiagens",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400",
        tips: "Lip oils hidratantes, batons com acabamento gloss e blushes radiantes.",
        url: "https://www.kikocosmetics.com/pt-br/"
      },
      {
        id: "b8",
        name: "Arezzo",
        category: "Calçados",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=400",
        tips: "Rasteirinhas sofisticadas, mules e tênis casuais elegantes. Calçado: 38.",
        url: "https://www.arezzo.com.br/"
      },
      {
        id: "b9",
        name: "Beleza na Web",
        category: "Cosméticos & Cabelo",
        image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=400",
        tips: "Tratamentos capilares, óleos finalizadores e body splash.",
        url: "https://www.belezanaweb.com.br/"
      },
      {
        id: "b10",
        name: "Victor Hugo",
        category: "Bolsas & Carteiras",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400",
        tips: "Bolsas tiracolo compactas, carteiras e nécessaires estruturadas.",
        url: "https://www.victorhugo.com.br/"
      },
      {
        id: "b11",
        name: "Amazon & Livros",
        category: "Livros & Lifestyle",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
        tips: "Livros de ficção e romance jovem, itens de decoração e tecnologia.",
        url: "https://www.amazon.com.br/"
      },
      {
        id: "b12",
        name: "Adidas",
        category: "Sneakers & Streetwear",
        image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=400",
        tips: "Sneakers icônicos (Samba, Campus, Gazelle). Calçado: 38.",
        url: "https://www.adidas.com.br/"
      }
    ]
  },
  gifts: [
    { id: "gft1", name: "Passaporte para o País das Maravilhas", description: "Ajude Lavinia a fazer sua viagem dos sonhos após a festa.", value: 500, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300", chosen: false, chosenBy: "", collective: true },
    { id: "gft2", name: "Ensaio Fotográfico Álbum de Luxo", description: "Uma recordação eterna impressa em papel fotográfico importado.", value: 300, image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=300", chosen: false, chosenBy: "", collective: false },
    { id: "gft3", name: "Dia de Princesa no SPA", description: "Massagem relaxante, banho de pétalas e cuidados especiais pré-festa.", value: 200, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=300", chosen: false, chosenBy: "", collective: true },
    { id: "gft4", name: "Sapato de Cristal da Valsa", description: "Contribuição para o icônico sapato que será usado na valsa da meia-noite.", value: 150, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300", chosen: true, chosenBy: "Maria Alice (Tia)", collective: false },
    { id: "gft5", name: "Arranjo Flor de Cerejeira", description: "Ajuda para a ambientação com lindas flores de cerejeira na entrada.", value: 100, image: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=300", chosen: false, chosenBy: "", collective: false },
    { id: "gft6", name: "Caixa de Bombons Finos Belgas", description: "Mimos doces para adoçar a mesa de doces finos.", value: 50, image: "https://images.unsplash.com/photo-1549007994-cb92ca888bd6?q=80&w=300", chosen: false, chosenBy: "", collective: false }
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
    {
      time: "18h00",
      title: "Recepção dos convidados",
      description: "Abertura da festa e recepção dos convidados.",
      icon: "fa-door-open"
    },
    {
      time: "18h30",
      title: "Início da recepção e serviço",
      description: "Momento para confraternizar, aproveitar as bebidas e os deliciosos quitutes preparados para a noite.",
      icon: "fa-champagne-glasses"
    },
    {
      time: "19h30",
      title: "Preparação para o Cerimonial",
      description: "Os convidados serão convidados a se dirigir à pista para o início do momento especial da noite.",
      icon: "fa-hourglass-start"
    },
    {
      time: "19h40",
      title: "Cerimonial dos 15 Anos",
      description: "Um momento emocionante com homenagens, valsas e a tradicional celebração dos 15 anos da Lavínia.",
      icon: "fa-crown"
    },
    {
      time: "20h40",
      title: "Abertura da Balada",
      description: "É hora de comemorar! Música, dança e muita diversão com as atrações da festa.",
      icon: "fa-compact-disc"
    },
    {
      time: "21h30",
      title: "Bolo, Sorvete e Doces",
      description: "Momento especial para saborear o bolo e as delícias da mesa de doces.",
      icon: "fa-cake-candles"
    },
    {
      time: "Após o bolo",
      title: "Festa continua!",
      description: "A música e a diversão seguem até o encerramento da festa.",
      icon: "fa-glass-cheers"
    },
    {
      time: "23h00",
      title: "Encerramento",
      description: "Finalização da comemoração. Prepare-se para uma noite inesquecível!",
      icon: "fa-moon"
    }
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
    const parsed = JSON.parse(data);
    // Se contiver referências antigas, se não contiver "Buffet Venturi", ou se a galeria não tiver os destaques certos (verificando g2 e g12), força o reset do LocalStorage
    const serialized = JSON.stringify(parsed);
    const hasOldImages = serialized.includes("Lavinia-");
    const hasOldMusic = !serialized.includes("Lana Del Rey");
    const hasOldHero = parsed.config && parsed.config.heroImage && (parsed.config.heroImage.includes("23.23.50 (1).jpeg") || parsed.config.heroImage.includes("23.23.50 (2).jpeg"));
    const hasOldGallery = !parsed.gallery || parsed.gallery.some(item => 
      (item.id === "g1" && item.category !== "ensaio") ||
      (item.id === "g2" && item.category !== "ensaio") ||
      (item.id === "g3" && item.category !== "ensaio") ||
      (item.id === "g4" && item.category !== "ensaio") ||
      (item.id === "g5" && item.category !== "familia") ||
      (item.id === "g6" && item.category !== "ensaio") ||
      (item.id === "g7" && item.category !== "ensaio") ||
      (item.id === "g8" && item.category !== "familia") ||
      (item.id === "g9" && item.category !== "ensaio") ||
      (item.id === "g10" && item.category !== "ensaio") ||
      (item.id === "g11" && item.category !== "familia") ||
      (item.id === "g12" && item.category !== "ensaio") ||
      (item.id === "g13" && item.category !== "ensaio") ||
      (item.image && item.image.includes("unsplash.com"))
    );
    const hasOldPixKey = serialized.includes("lavinia15anos@pix.com.br");
    const hasGiftGuide = parsed.giftGuide && parsed.giftGuide.sizes && parsed.giftGuide.sizes.shoes === "38" && parsed.giftGuide.sizes.ring === "25" && parsed.giftGuide.brands && parsed.giftGuide.brands.length >= 10;
    
    if (hasOldImages || hasOldMusic || hasOldHero || hasOldLocation || hasOldGallery || hasOldPixKey || !hasGiftGuide) {
      console.warn("Detectado banco de dados local antigo ou sem guia de presentes. Resetando...");
      localStorage.setItem(DB_KEY, JSON.stringify(defaultDatabase));
      return defaultDatabase;
    }
    return parsed;
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
  lastError: "",
  getDefaults: () => defaultDatabase,

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
    let data;
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
          chosenBy: g.chosen_by || "",
          collective: g.collective ?? false
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

        data = {
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
        data = loadDBLocal();
      }
    } else {
      data = loadDBLocal();
    }

    // Sobrescrever imagens e atualizar galeria para as novas fotos locais da debutante
    if (data) {
      // 1. Hero
      data.config.heroImage = "assets/IMG/fundo_hero_azul.jpeg";
      
      // 2. Linha do Tempo (Somente a foto dos 15 anos/hoje)
      if (data.timeline) {
        data.timeline.forEach((item, index) => {
          if (index === 3) {
            item.image = "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (2).jpeg";
          } else {
            item.image = "";
          }
        });
      }
      
      // 3. Galeria (13 novas fotos locais)
      const updatedGallery = [
        { id: "g1", title: "Caminho dos Sonhos", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (1).jpeg", featured: true },
        { id: "g2", title: "Sorriso Encantado", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (2).jpeg" },
        { id: "g3", title: "Giro Encantado", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47.jpeg" },
        { id: "g4", title: "Olhar de Princesa", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47 (1).jpeg" },
        { id: "g5", title: "Amor de Mãe", category: "familia", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47 (2).jpeg" },
        { id: "g6", title: "Mar de Azul", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.48.jpeg" },
        { id: "g7", title: "Luz da Noite", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.48 (1).jpeg" },
        { id: "g8", title: "Dança com a Mãe", category: "familia", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49.jpeg" },
        { id: "g9", title: "Diante do Palácio", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49 (1).jpeg" },
        { id: "g10", title: "Jardim Encantado", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49 (2).jpeg" },
        { id: "g11", title: "Laços Eternos", category: "familia", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50.jpeg" },
        { id: "g12", title: "Conto de Fadas", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (3).jpeg", featured: true },
        { id: "g13", title: "Princesa do Palácio", category: "ensaio", image: "assets/IMG/WhatsApp Image 2026-08-10 at 23.25.42.jpeg" }
      ];
      
      // Anexar as fotos enviadas pelos convidados
      if (data.gallery) {
        data.gallery.forEach(item => {
          if (item && (item.category === "convidados" || (item.id && String(item.id).startsWith("upload_")))) {
            updatedGallery.push(item);
          }
        });
      }
      
      data.gallery = updatedGallery;
      data.config.gallery = updatedGallery;

      // 4. Guia de Presentes & Marcas
      if (!data.giftGuide) {
        data.giftGuide = JSON.parse(JSON.stringify(defaultDatabase.giftGuide));
      }
    }

    return data;
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
        DB.lastError = err.message || JSON.stringify(err);
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
        DB.lastError = err.message || JSON.stringify(err);
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
        DB.lastError = err.message || JSON.stringify(err);
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
        DB.lastError = err.message || JSON.stringify(err);
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
        DB.lastError = err.message || JSON.stringify(err);
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
          chosen_by: gift.chosenBy,
          collective: gift.collective
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao salvar presente no Supabase:", err);
        DB.lastError = err.message || JSON.stringify(err);
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
        DB.lastError = err.message || JSON.stringify(err);
        return false;
      }
    } else {
      const db = loadDBLocal();
      db.gifts = db.gifts.filter(g => g.id !== id);
      saveDBLocal(db);
      return true;
    }
  },

  // Salva foto enviada pelo convidado na galeria
  saveGalleryItem: async (galleryItem) => {
    const db = await DB.get();
    
    // Adiciona o item na galeria carregada
    db.gallery.push(galleryItem);
    
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        // Buscar o valor atual de settings para atualizar apenas a galeria
        const { data: settingsData } = await DB.supabaseClient.from('settings').select('*').eq('key', 'site_config').maybeSingle();
        let val = settingsData ? settingsData.value : {};
        
        // Se a chave gallery não existir no banco de dados, inicializa ela
        val.gallery = db.gallery;
        
        const { error } = await DB.supabaseClient.from('settings').upsert({
          key: 'site_config',
          value: val
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao salvar item da galeria no Supabase:", err);
        return false;
      }
    } else {
      const localDb = loadDBLocal();
      localDb.gallery.push(galleryItem);
      saveDBLocal(localDb);
      return true;
    }
  },

  deleteGalleryItem: async (id) => {
    const db = await DB.get();
    db.gallery = db.gallery.filter(item => item.id !== id);
    
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        const { data: settingsData } = await DB.supabaseClient.from('settings').select('*').eq('key', 'site_config').maybeSingle();
        let val = settingsData ? settingsData.value : {};
        val.gallery = db.gallery;
        
        const { error } = await DB.supabaseClient.from('settings').upsert({
          key: 'site_config',
          value: val
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao deletar item da galeria no Supabase:", err);
        DB.lastError = err.message || err;
        return false;
      }
    } else {
      const localDb = loadDBLocal();
      localDb.gallery = localDb.gallery.filter(item => item.id !== id);
      saveDBLocal(localDb);
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
  },

  // Salva o Guia de Presentes (Tamanhos e Marcas)
  saveGiftGuide: async (giftGuideData) => {
    const db = await DB.get();
    db.giftGuide = giftGuideData;
    
    if (DB.isSupabase && DB.supabaseClient) {
      try {
        const { data: settingsData } = await DB.supabaseClient.from('settings').select('*').eq('key', 'site_config').maybeSingle();
        let val = settingsData ? settingsData.value : {};
        val.giftGuide = giftGuideData;
        
        const { error } = await DB.supabaseClient.from('settings').upsert({
          key: 'site_config',
          value: val
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Falha ao salvar guia de presentes no Supabase:", err);
        return false;
      }
    } else {
      const localDb = loadDBLocal();
      localDb.giftGuide = giftGuideData;
      saveDBLocal(localDb);
      return true;
    }
  },

  // Retorna os dados padrão hardcoded
  getDefaults: () => JSON.parse(JSON.stringify(defaultDatabase))
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
