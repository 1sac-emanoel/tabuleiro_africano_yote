// app/application/usecases/realizar_jogada_usecase.dart

import '../../domain/rules/tabuleiro_regras.dart';
import '../../domain/repositories/salvar_jogo_repository.dart';
import '../../domain/entities/peca.dart';

class RealizarJogadaUseCase {
  final JogoYote regrasDoJogo;
  
  // É aqui que a Glenda vai "injetar" a classe SQLite dela que cumpre o seu contrato!
  final SalvarJogoInterface repositorioDeSalvamento; 

  RealizarJogadaUseCase({
    required this.regrasDoJogo,
    required this.repositorioDeSalvamento,
  });

  // O Integrante 3 (Flutter) vai chamar esta função quando o utilizador tentar mover uma peça no ecrã
  Future<void> executarMovimento(int xOrigem, int yOrigem, int xDestino, int yDestino, Cor cor) async {
    
    // 1. O MAESTRO CHAMA O JUIZ (Você)
    // O Use Case pede às suas regras para tentarem fazer o movimento.
    // Se a jogada for ilegal (ex: na diagonal), o seu código dispara a 'Exception' e tudo para aqui.
    regrasDoJogo.moverPeca(xOrigem, yOrigem, xDestino, yDestino, cor);

    // 2. O MAESTRO CHAMA O ARQUIVISTA (Glenda/SQLite)
    // Se o código não parou na linha de cima, significa que o "Juiz" aprovou o movimento!
    // Agora mandamos o contrato salvar o jogo.
    
    String estadoEmTexto = _converterTabuleiroParaJson(); 
    
    // Aqui nós dizemos: "Guarda isto!". Como é feito (SQLite)? Não nos importa, a infraestrutura da Glenda resolve.
    await repositorioDeSalvamento.salvarEstadoDoJogo(estadoEmTexto);
  }

  // O documento sugeriu salvar o estado num texto longo (JSON) para facilitar no SQLite
  String _converterTabuleiroParaJson() {
    // Numa versão final, aqui usaríamos a pasta app/application/dtos/ para converter 
    // a matriz List<List<Peca?>> num texto estruturado para o SQLite engolir facilmente.
    return "{ 'turnoAtual': 'preto', 'pecasBrancasCapturadas': 0, 'tabuleiro': [...] }";
  }
}