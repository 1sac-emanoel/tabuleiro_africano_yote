import '../entities/peca.dart';
import '../entities/jogador.dart';
import '../repositories/salvar_jogo_repository.dart';

class JogoYote {
  //criando a malha do jogo
  List<List<Peca?>> tabuleiro = List.generate(5, (_) => List.filled(6, null));

  Jogador jogadorBranco = Jogador(Cor.branco);
  Jogador jogadorPreto = Jogador(Cor.preto);

  //para controlar os turnos dos jogadores
  Cor turnoAtual = Cor.branco;

  //para salvar a interface atual
  final SalvarJogoInterface? salvarInterface;

  JogoYote({this.salvarInterface});

  // metodos de acoes
  //verifica se a casa esta vazia antes de colocar a peca
  void colocarPeca(int x, int y, Cor corTentandoJogar) {
    if (corTentandoJogar != turnoAtual) {
      throw Exception("Erro: Não é a sua vez de jogar.");
    }

    Jogador jogadorDestaVez = (turnoAtual == Cor.branco)
        ? jogadorBranco
        : jogadorPreto;

    if (jogadorDestaVez.pecasNaMao <= 0) {
      throw Exception("Erro: Não tem mais peças para colocar.");
    }

    if (x < 0 || x > 4 || y < 0 || y > 5) {
      throw Exception("Erro: Posição fora do tabuleiro. ");
    }

    if (tabuleiro[x][y] != null) {
      throw Exception("Erro: Esta casa já está ocupada. ");
    }

    //autorizado peca nova
    Peca novaPeca = Peca(cor: turnoAtual, x: x, y: y);
    tabuleiro[x][y] = novaPeca;
    jogadorDestaVez.pecasNaMao--;

    finalizarTurno();
  }

  // para verificar se a peca andou na horizontal ou vertical
  void moverPeca(
    int xOrigem,
    int yOrigem,
    int xDestino,
    int yDestino,
    Cor corTentandoJogar,
  ) {
    if (corTentandoJogar != turnoAtual) {
      throw Exception("Erro: Nao e sua vez.");
    }

    if (xDestino < 0 ||
        xDestino > 4 ||
        yDestino < 0 ||
        yDestino > 5 ||
        xOrigem < 0 ||
        xOrigem > 4 ||
        yOrigem < 0 ||
        yOrigem > 5) {
      throw Exception(" Erro: Posicao fora do tabuleiro. ");
    }

    Peca? pecaParaMover = tabuleiro[xOrigem][yOrigem];

    if (pecaParaMover == null) {
      throw Exception("Erro: nao ha peca nesta posicao.");
    }

    if (pecaParaMover.cor != corTentandoJogar) {
      throw Exception("Erro: Esta peca pertence ao adversario.");
    }

    if (tabuleiro[xDestino][yDestino] != null) {
      throw Exception("Erro: A casa de destino ja esta ocupada.");
    }

    int distanciaX = (xOrigem - xDestino).abs();
    int distanciaY = (yOrigem - yDestino).abs();

    bool movimentoValido =
        (distanciaX == 1 && distanciaY == 0) ||
        (distanciaX == 0 && distanciaY == 1);
    if (!movimentoValido) {
      throw Exception(
        "Erro: Movimento invalido, so pode andar uma casa na horizontal ou vertical.",
      );
    }

    pecaParaMover.x = xDestino;
    pecaParaMover.y = yDestino;
    tabuleiro[xDestino][yDestino] = pecaParaMover;
    tabuleiro[xOrigem][yOrigem] = null;

    finalizarTurno();
  }

  // para capturar a peca: verifica se pulou sobre a peca inimiga e posou em uuma casa vazia
  void capturarPeca(
    int xOrigem,
    int yOrigem,
    int xDestino,
    int yDestino,
    int xBonus,
    int yBonus,
    Cor corTentandoJogar,
  ) {
    //validar o turno e limites do tabuleiro
    if (corTentandoJogar != turnoAtual)
      throw Exception("Erro: Nao e a sua vez de jogar.");

    if (xDestino < 0 ||
        xDestino > 4 ||
        yDestino < 0 ||
        yDestino > 5 ||
        xOrigem < 0 ||
        xOrigem > 4 ||
        yOrigem < 0 ||
        yOrigem > 5 ||
        xBonus < 0 ||
        xBonus > 4 ||
        yBonus < 0 ||
        yBonus > 5) {
      throw Exception("Erro: Posicao fora do tabuleiro.");
    }

    // pegar a peca do atacante e veririficar as regaras da casa de destino
    Peca? pecaParaMover = tabuleiro[xOrigem][yOrigem];
    if (pecaParaMover == null) throw Exception("Erro: Nao ha peca na origem.");
    if (pecaParaMover.cor != corTentandoJogar)
      throw Exception("Erro: Esta peca pertence ao adversario.");
    if (tabuleiro[xDestino][yDestino] != null)
      throw Exception("Erro: A casa de destina ja esta ocupada.");

    // a matematica do salto
    int distanciaX = (xOrigem - xDestino).abs();
    int distanciaY = (yOrigem - yDestino).abs();

    bool saltoValido = (distanciaX == 2 && distanciaY == 0) || (distanciaX == 0 && distanciaY == 2);
    if (!saltoValido) {
      throw Exception("Erro: O salto deve ser de exatas 2 casas em linha reta.");
    }

    // 4. Identificar quem está a ser pisado (A peça do meio)
    // usar a média matemática das coordenadas para achar a casa intermediária: $xMeio = (xOrigem + xDestino) / 2$
    int xMeio = (xOrigem + xDestino) ~/ 2; // O operador ~/ faz a divisão de números inteiros em Dart
    int yMeio = (yOrigem + yDestino) ~/ 2;
    Peca? pecaSaltada = tabuleiro[xMeio][yMeio];

    if (pecaSaltada == null) throw Exception("Erro: Não há peça inimiga para saltar.");
    if (pecaSaltada.cor == corTentandoJogar) throw Exception("Erro: Não pode saltar sobre a sua própria peça.");

    // 5. A Regra do Yoté: O Confisco da Segunda Peça (Bónus)
    Peca? pecaBonus = tabuleiro[xBonus][yBonus];
    if (pecaBonus == null) throw Exception("Erro: A casa da peça de bónus está vazia.");
    if (pecaBonus.cor == corTentandoJogar) throw Exception("Erro: Não pode remover a sua própria peça como bónus.");
    if (xMeio == xBonus && yMeio == yBonus) throw Exception("Erro: A peça de bónus tem de ser diferente da que foi saltada.");

    // Se passou por TODOS os testes acima, o Juiz autoriza a execução!

    // A) Mover a peça do atacante
    pecaParaMover.x = xDestino;
    pecaParaMover.y = yDestino;
    tabuleiro[xDestino][yDestino] = pecaParaMover;
    tabuleiro[xOrigem][yOrigem] = null;

    // B) Eliminar as duas peças inimigas do tabuleiro
    tabuleiro[xMeio][yMeio] = null;
    tabuleiro[xBonus][yBonus] = null;

    // C) Contabilizar os pontos
    Jogador jogadorDestaVez = (turnoAtual == Cor.branco) ? jogadorBranco : jogadorPreto;
    jogadorDestaVez.pecasCapturadas += 2; // Como capturou a do salto e a de bónus, ganha 2 pontos

    // D) Passar a vez (NOTA: O Yoté permite saltos em cadeia, mas para simplificar a orquestração inicial, finalizamos o turno).
    finalizarTurno();
  }

  void finalizarTurno() {
    turnoAtual = (turnoAtual == Cor.branco) ? Cor.preto : Cor.branco;
  }

  //checando se todas as pecas do jogador foram capturadas
  Cor? verificarVencedor() {
    // A vitória por eliminação ocorre quando se captura todas as 12 peças do adversário.
    if (jogadorBranco.pecasCapturadas >= 12) {
      return Cor.branco;
    }
    
    if (jogadorPreto.pecasCapturadas >= 12) {
      return Cor.preto;
    }

    // Se ninguém capturou 12 peças, o jogo continua (retorna null).
    return null;
  }
}
