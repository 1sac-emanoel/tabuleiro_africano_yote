// esta e a interface que a integrante 2 tem que implementar

abstract class SalvarJogoInterface {
  //pega o estado atual do jogo e salva
  Future<void> salvarEstadoDoJogo(String estadoDoJogo);

  //buscar no banco de dados o ultimo estado salvo do jogo
  Future<String?> carregarUltimoJogo();
}
