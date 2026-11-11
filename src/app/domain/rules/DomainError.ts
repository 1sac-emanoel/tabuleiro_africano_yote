/**
 * em caso de violações das regras matemáticas do jogo
 * isso permite que o Integrante 4 diferencie erros de regra de negócio
 * de falhas técnicas de rede ou banco de dados
 */
export class DomainError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = 'YOTE_RULE_VIOLATION') {
    super(message);
    this.name = 'DomainError';
    this.code = code;
  }
}