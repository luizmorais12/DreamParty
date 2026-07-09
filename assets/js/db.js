// db.js - Gerenciamento de Persistência no LocalStorage

const DB_KEY = 'lavinia_15_anos_db';

const defaultDatabase = {
  config: {
    name: "Lavinia dos Santos Mattos",
    partyDate: "2026-11-01T21:00:00",
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

// Carrega ou inicializa a base de dados
function loadDB() {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDatabase));
    return defaultDatabase;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Erro ao carregar banco de dados. Resetando...", e);
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDatabase));
    return defaultDatabase;
  }
}

// Salva a base de dados
function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Métodos auxiliares
const DB = {
  get: () => loadDB(),
  save: (data) => saveDB(data),
  
  // Resetar aos padrões
  reset: () => {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDatabase));
    return defaultDatabase;
  }
};

// Exportar globalmente
window.DB = DB;
