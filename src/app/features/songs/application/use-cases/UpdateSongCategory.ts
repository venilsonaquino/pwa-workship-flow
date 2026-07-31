import type { ISongRepository } from '../../domain/repositories/ISongRepository';
import type { SongCategory } from '../../domain/entities/Song';

// ── UpdateSongCategory Use Case ──────────────────────────────────────────────
// Orquestra a alteração de categoria de uma música isolando a regra de negócio.

export class UpdateSongCategory {
  private readonly repository: ISongRepository;

  constructor(repository: ISongRepository) {
    this.repository = repository;
  }

  execute(token: string, songId: string, newCategory: SongCategory): Promise<void> {
    if (!songId || !newCategory) {
      throw new Error('Música e nova categoria são obrigatórias');
    }
    return this.repository.updateCategory(token, songId, newCategory);
  }
}
