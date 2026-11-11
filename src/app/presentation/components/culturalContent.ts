export interface CulturalSection {
  id: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  highlights: string[];
}

/**
 * levantamento historico-cultural e matematico da Quinzena 1
 * vai alimentar o modal de regras e as historias na interface grafica 
 */
export const YOTE_CULTURAL_CONTENT: CulturalSection[] = [
  {
    id: 'historia',
    title: 'Herança da África Ocidental',
    subtitle: 'Tradição viva em Senegal, Mali, Gâmbia e Burkina Faso',
    paragraphs: [
      'O Yoté é um tradicional jogo de tabuleiro estratégico da África Ocidental, historicamente desenhado diretamente na terra ou em pequenos buracos cavados na areia, utilizando sementes, conchas, pedrinhas ou pequenos gravetos como peças.',
      'Mais do que entretenimento, o Yoté funciona como uma ferramenta de socialização, transmissão oral de saberes e desenvolvimento de raciocínio tático acelerado.'
    ],
    highlights: [
      'Tabuleiro geométrico de 30 casas (matriz 5x6).',
      '24 peças no total (12 para cada jogador), iniciando fora do tabuleiro.'
    ]
  },
  {
    id: 'etnomatematica',
    title: 'Etnomatemática e Educação Antirracista',
    subtitle: 'Pensamento computacional e Leis Federais nº 10.639/03 e 11.645/08',
    paragraphs: [
      'Fundamentado nos estudos de Paulus Gerdes e Ubiratan D’Ambrosio, o Yoté evidencia como os povos africanos desenvolveram sistemas lógicos e matemáticos de alta abstração, rompendo com a visão eurocêntrica da ciência.',
      'Sua aplicação pedagógica exercita a geometria espacial (eixos ortogonais X e Y), árvores de decisão algorítmica e inteligência emocional diante de reviravoltas rápidas.'
    ],
    highlights: [
      'Movimentação estritamente ortogonal (horizontal e vertical).',
      'Captura não obrigatória: permite sacrifícios estratégicos e armadilhas.'
    ]
  },
  {
    id: 'regras',
    title: 'Regras Oficiais e a Captura Dupla',
    subtitle: 'Como jogar e vencer no Yoté',
    paragraphs: [
      'Na sua vez, cada jogador executa apenas uma de três ações: (1) Inserir uma peça da sua reserva em qualquer casa vazia; (2) Mover uma peça já posicionada para uma casa vazia adjacente na vertical ou horizontal; ou (3) Saltar sobre uma peça adversária adjacente para uma casa vazia imediatamente após ela.',
      'A Regra de Ouro (Captura Dupla): Ao capturar uma peça por salto, o jogador ganha o direito imediato de escolher e confiscar uma segunda peça qualquer do adversário em qualquer ponto do tabuleiro.'
    ],
    highlights: [
      'Vitória por Eliminação: capturar todas as 12 peças adversárias.',
      'Vitória por Bloqueio: imobilizar o adversário (vence quem tiver mais peças).',
      'Empate Técnico: ambos os jogadores reduzidos a 3 ou menos peças sem progressão.'
    ]
  }
];