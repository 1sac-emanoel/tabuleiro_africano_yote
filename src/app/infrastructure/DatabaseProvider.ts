import type { IGameRepository } from '../domain/repositories/IGameRepository';
import { PostgresGameRepository } from './repositories_impl/PostgresGameRepository';

/**
 * A Glenda entrega o banco pronto para uso
 */
class DatabaseProvider {
  private static instance: IGameRepository;

  public static getGameRepository(): IGameRepository {
    if (!DatabaseProvider.instance) {
      DatabaseProvider.instance = new PostgresGameRepository();
    }
    return DatabaseProvider.instance;
  }
}

export const gameRepository = DatabaseProvider.getGameRepository();