//para nao permitir a alteracao de cor durante o jogo
enum Cor { branco, preto }

class Peca {
  final Cor cor;
  int x;
  int y;

  Peca({required this.cor, required this.x, required this.y});
}
