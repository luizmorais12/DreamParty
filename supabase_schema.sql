-- SCHEMA SQL PARA CONFIGURAÇÃO DO BANCO DE DADOS NO SUPABASE
-- Copie todo este conteúdo e cole no SQL Editor do seu projeto no Supabase, depois execute.

-- 0. APAGAR TABELAS ANTIGAS SE EXISTIREM PARA REATUALIZAR O SCHEMA CACHE
drop table if exists settings cascade;
drop table if exists rsvps cascade;
drop table if exists messages cascade;
drop table if exists gifts cascade;

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
  chosen_by text,
  collective boolean default false
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
    "heroImage": "assets/IMG/fundo_hero_azul.jpeg",
    "musicTracks": [
      {"id": "1", "title": "Video Games", "artist": "Lana Del Rey", "url": "https://archive.org/download/relax-fm-collection-vol.1-11/Relax%20FM%20-%20Collection%20%28Vol.1-11%29/2013%20-%20Relax%20FM%20-%20vol.11/09.%20Lana%20Del%20Rey%20-%20Video%20Games.mp3"}
    ],
    "currentTrackId": "1",
    "pixKey": "11963020240",
    "pixQrCode": "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021226330014br.gov.bcb.pix0111119630202405204000053039865802BR5925LAVINIA%20DOS%20SANTOS%20MATTOS6009SAO%20PAULO62070503***630452D5",
    "dressCode": "Gala / Esporte Fino: Sugerimos tons pastéis claros para harmonizar com nosso Jardim Encantado.",
    "location": {
      "address": "Rua Piracicaba, 79 - Vila Augusta",
      "time": "18:00",
      "parking": "Serviço de manobrista gratuito no local para todos os convidados.",
      "mapUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.1834162794715!2d-46.57467612470732!3d-23.473551578854424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce58a9833f444f%3A0xe54d89e1a1b411d7!2sBuffet%20Venturi!5e0!3m2!1spt-BR!2sbr!4v1723983240000!5m2!1spt-BR!2sbr"
    },
    "timeline": [
      {
        "id": "t1",
        "age": "Nascimento (2011)",
        "title": "O início de tudo",
        "description": "Lavinia chegou trazendo luz e alegria ao mundo no dia 2 de novembro de 2011. Um bebê doce que desde cedo já encantava a todos com seu sorriso.",
        "image": ""
      },
      {
        "id": "t2",
        "age": "5 Anos (2016)",
        "title": "Primeiros passinhos no jardim",
        "description": "Amante da natureza e de brincar ao ar livre. Aqui ela já ensaiava seus primeiros passos de dança e adorava se fantasiar de princesa.",
        "image": ""
      },
      {
        "id": "t3",
        "age": "10 Anos (2021)",
        "title": "Descobertas e Amizades",
        "description": "Uma menina sonhadora, dedicada aos estudos e muito apegada à família. Seu amor pelas artes e pela música começou a florescer.",
        "image": ""
      },
      {
        "id": "t4",
        "age": "15 Anos (Hoje)",
        "title": "A realização de um sonho",
        "description": "Chegou o grande momento! Lavinia floresceu e está pronta para celebrar o início de um novo capítulo em uma noite mágica cercada de quem ama.",
        "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (2).jpeg"
      }
    ],
    "gallery": [
      { "id": "g1", "title": "Caminho dos Sonhos", "category": "ensaio", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (1).jpeg", "featured": true },
      { "id": "g2", "title": "Sorriso Encantado", "category": "ensaio", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (2).jpeg" },
      { "id": "g3", "title": "Giro Encantado", "category": "ensaio", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47.jpeg" },
      { "id": "g4", "title": "Olhar de Princesa", "category": "ensaio", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47 (1).jpeg" },
      { "id": "g5", "title": "Amor de Mãe", "category": "familia", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.47 (2).jpeg" },
      { "id": "g6", "title": "Mar de Azul", "category": "ensaio", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.48.jpeg" },
      { "id": "g7", "title": "Luz da Noite", "category": "ensaio", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.48 (1).jpeg" },
      { "id": "g8", "title": "Dança com a Mãe", "category": "familia", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49.jpeg" },
      { "id": "g9", "title": "Diante do Palácio", "category": "ensaio", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49 (1).jpeg" },
      { "id": "g10", "title": "Jardim Encantado", "category": "ensaio", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.49 (2).jpeg" },
      { "id": "g11", "title": "Laços Eternos", "category": "familia", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50.jpeg" },
      { "id": "g12", "title": "Conto de Fadas", "category": "ensaio", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.23.50 (3).jpeg", "featured": true },
      { "id": "g13", "title": "Princesa do Palácio", "category": "ensaio", "image": "assets/IMG/WhatsApp Image 2026-08-10 at 23.25.42.jpeg" }
    ],
    "videos": [
      { "id": "v1", "title": "Teaser Oficial do Ensaio de 15 Anos", "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ", "type": "youtube" }
    ],
    "giftGuide": {
      "enabled": true,
      "title": "Dicas de Presentes & Marcas Favoritas",
      "subtitle": "Mimos & Inspirações da Debutante",
      "quote": "O presente é você quem escolhe... mas separamos algumas dicas sobre os tamanhos e as lojas que a Lavínia mais ama para te ajudar!",
      "sizes": {
        "clothing": "M / P",
        "shoes": "38",
        "ring": "25",
        "style": "Dourado, Tons Neutros & Brilho",
        "perfume": "Florais e Doces Suaves",
        "bag": "Pequenas / Tiracolo"
      },
      "brands": [
        { "id": "b1", "name": "Zara", "category": "Moda & Looks", "image": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=400", "tips": "Vestidos modernos, conjuntos elegantes e looks casuais. Tamanho: P / M.", "url": "https://www.zara.com/br/" },
        { "id": "b2", "name": "Vivara", "category": "Joias & Acessórios", "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400", "tips": "Anel tamanho 25, colares delicados, brincos e berloques Life by Vivara.", "url": "https://www.vivara.com.br/" },
        { "id": "b3", "name": "Pandora", "category": "Joias & Charms", "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400", "tips": "Anel tamanho 25, charms, braceletes e pingentes com brilho.", "url": "https://www.pandorajoias.com.br/" },
        { "id": "b4", "name": "Sephora", "category": "Beleza & Perfumes", "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400", "tips": "Skincare, maquiagens iluminadas e perfumes florais/adocicados importados.", "url": "https://www.sephora.com.br/" },
        { "id": "b5", "name": "Schutz", "category": "Calçados & Bolsas", "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400", "tips": "Sandálias modernas, saltos confortáveis e bolsas pequenas. Calçado: 38.", "url": "https://www.schutz.com.br/" },
        { "id": "b6", "name": "Farm Rio", "category": "Moda & Estilo", "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400", "tips": "Vestidos florais, croppeds e estampas coloridas. Tamanho: P / M.", "url": "https://www.farmrio.com.br/" },
        { "id": "b7", "name": "Kiko Milano", "category": "Maquiagens", "image": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400", "tips": "Lip oils hidratantes, batons com acabamento gloss e blushes radiantes.", "url": "https://www.kikocosmetics.com/pt-br/" },
        { "id": "b8", "name": "Arezzo", "category": "Calçados", "image": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=400", "tips": "Rasteirinhas sofisticadas, mules e tênis casuais elegantes. Calçado: 38.", "url": "https://www.arezzo.com.br/" },
        { "id": "b9", "name": "Beleza na Web", "category": "Cosméticos & Cabelo", "image": "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=400", "tips": "Tratamentos capilares, óleos finalizadores e body splash.", "url": "https://www.belezanaweb.com.br/" },
        { "id": "b10", "name": "Victor Hugo", "category": "Bolsas & Carteiras", "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400", "tips": "Bolsas tiracolo compactas, carteiras e nécessaires estruturadas.", "url": "https://www.victorhugo.com.br/" },
        { "id": "b11", "name": "Amazon & Livros", "category": "Livros & Lifestyle", "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400", "tips": "Livros de ficção e romance jovem, itens de decoração e tecnologia.", "url": "https://www.amazon.com.br/" },
        { "id": "b12", "name": "Adidas", "category": "Sneakers & Streetwear", "image": "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=400", "tips": "Sneakers icônicos (Samba, Campus, Gazelle). Calçado: 38.", "url": "https://www.adidas.com.br/" }
      ]
    },
    "schedule": [
      { "time": "18h00", "title": "Recepção dos convidados", "description": "Abertura da festa e recepção dos convidados.", "icon": "fa-door-open" },
      { "time": "18h30", "title": "Início da recepção e serviço", "description": "Momento para confraternizar, aproveitar as bebidas e os deliciosos quitutes preparados para a noite.", "icon": "fa-champagne-glasses" },
      { "time": "19h30", "title": "Preparação para o Cerimonial", "description": "Os convidados serão convidados a se dirigir à pista para o início do momento especial da noite.", "icon": "fa-hourglass-start" },
      { "time": "19h40", "title": "Cerimonial dos 15 Anos", "description": "Um momento emocionante com homenagens, valsas e a tradicional celebração dos 15 anos da Lavínia.", "icon": "fa-crown" },
      { "time": "20h40", "title": "Abertura da Balada", "description": "É hora de comemorar! Música, dança e muita diversão com as atrações da festa.", "icon": "fa-compact-disc" },
      { "time": "21h30", "title": "Bolo, Sorvete e Doces", "description": "Momento especial para saborear o bolo e as delícias da mesa de doces.", "icon": "fa-cake-candles" },
      { "time": "Após o bolo", "title": "Festa continua!", "description": "A música e a diversão seguem até o encerramento da festa.", "icon": "fa-glass-cheers" },
      { "time": "23h00", "title": "Encerramento", "description": "Finalização da comemoração. Prepare-se para uma noite inesquecível!", "icon": "fa-moon" }
    ]
  }'
) on conflict (key) do update set value = excluded.value;

-- Popula Lista de Presentes Inicial
insert into gifts (id, name, description, value, image, chosen, chosen_by, collective) values
  ('gft1', 'Passaporte para o País das Maravilhas', 'Ajude Lavinia a fazer sua viagem dos sonhos após a festa.', 500.00, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300', false, '', true),
  ('gft2', 'Ensaio Fotográfico Álbum de Luxo', 'Uma recordação eterna impressa em papel fotográfico importado.', 300.00, 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=300', false, '', false),
  ('gft3', 'Dia de Princesa no SPA', 'Massagem relaxante, banho de pétalas e cuidados especiais pré-festa.', 200.00, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=300', false, '', true),
  ('gft4', 'Sapato de Cristal da Valsa', 'Contribuição para o icônico sapato que será usado na valsa da meia-noite.', 150.00, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300', true, 'Maria Alice (Tia)', false),
  ('gft5', 'Arranjo Flor de Cerejeira', 'Ajuda para a ambientação com lindas flores de cerejeira na entrada.', 100.00, 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=300', false, '', false),
  ('gft6', 'Caixa de Bombons Finos Belgas', 'Mimos doces para adoçar a mesa de doces finos.', 50.00, 'https://images.unsplash.com/photo-1549007994-cb92ca888bd6?q=80&w=300', false, '', false)
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
