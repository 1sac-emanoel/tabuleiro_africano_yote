import 'peca.dart';

class Tabuleiro {
  final int linhas = 5;
  final int colunas = 6;

  // a posicao pode contar  um objeto ou ser null
  late List<List<Peca?>> malha;

  Tabuleiro() {
    //inicializando o tabuleiro
    malha = List.generate(linhas, (_) => List.filled(colunas, null));
  }

  //para saber quais casas estao vazias
  bool casaEstaVazia(int x, int y) {
    if (!isPosicaoValida(x, y)) return false;
  }

  // quais estao ocupadas
  bool casaEstaOcupada(int x, int y) {
    if (!isPosicaoValida(x, y)) return false;
  }

  // metodo auxiliar para saber se a coordenada existe no tabuleiro
  bool isPosicaoValida(int x, int y) {
    return x >= 0 && x < linhas && y >= 0 && y < colunas;
  }
}
