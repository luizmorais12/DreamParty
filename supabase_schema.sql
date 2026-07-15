-- SCHEMA SQL PARA CONFIGURAÇÃO DO BANCO DE DADOS NO SUPABASE
-- Copie todo este conteúdo e cole no SQL Editor do seu projeto no Supabase, depois execute.

-- 1. TABELA DE CONFIGURAÇÕES GERAIS (SALVA TEXTOS, TIMELINE, CRONOGRAMA, GALERIA, TRACKS)
create table if not exists settings (
  key text primary key,
  value jsonb not null
);

-- 2. TABELA DE CONFIRMAÇÕES DE PRESENÇA (RSVP)
create table if not exists rsvps (
  id text primary key,
  name text not null,
  phone text,
  email text,
  adults_count integer default 0,
  kids_count integer default 0,
  companion_names text,
  dietary_restrictions text,
  message text,
  date_confirmed timestamp with time zone default timezone('utc'::text, now())
);

-- 3. TABELA DE MENSAGENS (LIVRO DE VISITAS)
create table if not exists messages (
  id text primary key,
  author text not null,
  relation text,
  text text not null,
  date timestamp with time zone default timezone('utc'::text, now()),
  approved boolean default false
);

-- 4. TABELA DE PRESENTES FÍSICOS E VIRTUAIS
create table if not exists gifts (
  id text primary key,
  name text not null,
  description text,
  value numeric(10, 2) not null,
  image text,
  chosen boolean default false,
  chosen_by text
);

-- Habilitar leitura pública para todas as tabelas (importante para o site estático)
-- Nota: RLS (Row Level Security) pode ser desativado ou configurado com políticas públicas.
alter table settings disable row level security;
alter table rsvps disable row level security;
alter table messages disable row level security;
alter table gifts disable row level security;


-- ==========================================================================
-- DADOS INICIAIS MOCKADOS PARA POPULAR O SEU BANCO DE DADOS DO SUPABASE
-- ==========================================================================

-- Popula Configuração Inicial do Site
insert into settings (key, value) values (
  'site_config',
  '{
    "name": "Lavinia dos Santos Mattos",
    "partyDate": "2026-11-02T21:00:00",
    "birthdayDate": "2026-11-02T00:00:00",
    "quote": "Cada sonho merece uma noite para se tornar realidade.",
    "heroImage": "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=1920",
    "musicTracks": [
      {"id": "1", "title": "Beauty and the Beast (Piano)", "artist": "Disney Instrumental", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
      {"id": "2", "title": "Valsa das Flores", "artist": "Tchaikovsky", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"},
      {"id": "3", "title": "Perfect (Piano Version)", "artist": "Ed Sheeran Cover", "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"}
    ],
    "currentTrackId": "1",
    "pixKey": "lavinia15anos@pix.com.br",
    "pixQrCode": "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126580014br.gov.bcb.pix0119lavinia15anos@pix.com.br5204000053039865802BR5925LAVINIA%20DOS%20SANTOS%20MATTOS6009SAO%20PAULO62070503***63041A2D",
    "dressCode": "Gala / Esporte Fino: Sugerimos tons pastéis claros para harmonizar com nosso Jardim Encantado.",
    "location": {
      "address": "Mansão das Flores, Av. das Rosas, 1500 - Rio de Janeiro, RJ",
      "time": "21:00",
      "parking": "Serviço de manobrista gratuito no local para todos os convidados.",
      "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.84478149867!2d-43.22699892377747!3d-22.955986479219894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997fd59828d11f%3A0x2865910fae13467e!2sParque%20Lage!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
    },
    "timeline": [
      {
        "id": "t1",
        "age": "Nascimento (2011)",
        "title": "O início de tudo",
        "description": "Lavinia chegou trazendo luz e alegria ao mundo no dia 2 de novembro de 2011. Um bebê doce que desde cedo já encantava a todos com seu sorriso.",
        "image": "https://images.unsplash.com/photo-1519689680058-324335c77ebe?q=80&w=800"
      },
      {
        "id": "t2",
        "age": "5 Anos (2016)",
        "title": "Primeiros passinhos no jardim",
        "description": "Amante da natureza e de brincar ao ar livre. Aqui ela já ensaiava seus primeiros passos de dança e adorava se fantasiar de princesa.",
        "image": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800"
      },
      {
        "id": "t3",
        "age": "10 Anos (2021)",
        "title": "Descobertas e Amizades",
        "description": "Uma menina sonhadora, dedicada aos estudos e muito apegada à família. Seu amor pelas artes e pela música começou a florescer.",
        "image": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800"
      },
      {
        "id": "t4",
        "age": "15 Anos (Hoje)",
        "title": "A realização de um sonho",
        "description": "Chegou o grande momento! Lavinia floresceu e está pronta para celebrar o início de um novo capítulo em uma noite mágica cercada de quem ama.",
        "image": "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800"
      }
    ],
    "gallery": [
      { "id": "g1", "title": "Ensaio Jardim 1", "category": "ensaio", "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800" },
      { "id": "g2", "title": "Sorriso Doce", "category": "ensaio", "image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800" },
      { "id": "g3", "title": "Recordação de Infância", "category": "infancia", "image": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800" },
      { "id": "g4", "title": "Com a Família", "category": "familia", "image": "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800" },
      { "id": "g5", "title": "Brilho no Olhar", "category": "ensaio", "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800" },
      { "id": "g6", "title": "Passeio Especial", "category": "familia", "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800" }
    ],
    "videos": [
      { "id": "v1", "title": "Teaser Oficial do Ensaio de 15 Anos", "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ", "type": "youtube" }
    ],
    "schedule": [
      { "time": "21:00", "title": "Recepção dos Convidados", "icon": "fa-door-open" },
      { "time": "22:00", "title": "Jantar dos Convidados", "icon": "fa-utensils" },
      { "time": "23:30", "title": "Cerimonial & Valsa", "icon": "fa-crown" },
      { "time": "00:30", "title": "Abertura da Balada", "icon": "fa-compact-disc" },
      { "time": "05:00", "title": "Encerramento da Festa", "icon": "fa-moon" }
    ]
  }'
) on conflict (key) do update set value = excluded.value;

-- Popula Lista de Presentes Inicial
insert into gifts (id, name, description, value, image, chosen, chosen_by) values
  ('gft1', 'Passaporte para o País das Maravilhas', 'Ajude Lavinia a fazer sua viagem dos sonhos após a festa.', 500.00, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300', false, ''),
  ('gft2', 'Ensaio Fotográfico Álbum de Luxo', 'Uma recordação eterna impressa em papel fotográfico importado.', 300.00, 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=300', false, ''),
  ('gft3', 'Dia de Princesa no SPA', 'Massagem relaxante, banho de pétalas e cuidados especiais pré-festa.', 200.00, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=300', false, ''),
  ('gft4', 'Sapato de Cristal da Valsa', 'Contribuição para o icônico sapato que será usado na valsa da meia-noite.', 150.00, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300', true, 'Maria Alice (Tia)'),
  ('gft5', 'Arranjo Flor de Cerejeira', 'Ajuda para a ambientação com lindas flores de cerejeira na entrada.', 100.00, 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=300', false, ''),
  ('gft6', 'Caixa de Bombons Finos Belgas', 'Mimos doces para adoçar a mesa de doces finos.', 50.00, 'https://images.unsplash.com/photo-1549007994-cb92ca888bd6?q=80&w=300', false, '')
on conflict (id) do nothing;

-- Popula Convidados de Teste Inicial
insert into rsvps (id, name, phone, email, adults_count, kids_count, companion_names, dietary_restrictions, message, date_confirmed) values
  ('r1', 'Claudio Mattos', '(21) 98888-7777', 'claudio@email.com', 2, 1, 'Camila Mattos, Lucas Mattos', 'Sem restrições', 'Mal posso esperar por este grande dia!', now() - interval '5 days'),
  ('r2', 'Ana Beatriz Ramos', '(21) 97777-6666', 'ana.beatriz@email.com', 1, 0, '', 'Vegetariana', 'Lavinia, você vai estar linda! Parabéns!', now() - interval '2 days')
on conflict (id) do nothing;

-- Popula Mensagens Iniciais
insert into messages (id, author, relation, text, date, approved) values
  ('m1', 'Madrinha Sandra', 'Madrinha', 'Minha afilhada linda, ver você completar 15 anos enche meu coração de orgulho. Que sua jornada seja sempre iluminada e abençoada!', now() - interval '3 days', true),
  ('m2', 'Lucas Santos', 'Amigo de Escola', 'Parabéns, Lavi! A festa vai ser demais! Muito feliz em fazer parte desse dia.', now() - interval '1 day', true),
  ('m3', 'Tio Renato', 'Tio', 'Muitas felicidades, minha querida sobrinha! Que papai do céu guie sempre seus caminhos.', now(), false)
on conflict (id) do nothing;
