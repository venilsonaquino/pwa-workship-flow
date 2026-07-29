import type { ISongRepository, SongsResult } from '../../domain/repositories/ISongRepository';

// ── FetchSongs Use Case ────────────────────────────────────────────────────────
// Orquestra o fluxo: chama o repositório e retorna o resultado estruturado.
// Não conhece HTTP — depende apenas da interface ISongRepository (DIP).

export class FetchSongs {
  constructor(private readonly repository: ISongRepository) {}

  execute(token: string): Promise<SongsResult> {
    return this.repository.fetchAll(token);
  }
}
