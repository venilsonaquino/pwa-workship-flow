import Button from '@shared/components/ui/button';
import Input from '@shared/components/ui/input';

export interface SongsHeaderProps {
  isSearchExpanded: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearchToggle: () => void;
  onSearchClose: () => void;
  onBack: () => void;
}

export const SongsHeader = ({
  isSearchExpanded,
  searchQuery,
  onSearchQueryChange,
  onSearchToggle,
  onSearchClose,
  onBack,
}: SongsHeaderProps) => {
  return (
    <header 
      className="sticky top-0 z-50 w-full h-16 bg-surface border-b border-outline-variant/30 flex items-center justify-between"
      style={{ paddingLeft: '20px', paddingRight: '20px' }}
    >
      {!isSearchExpanded ? (
        <>
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-200"
            style={{ padding: 0 }}
            aria-label="Voltar"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </Button>
          <h1 className="font-headline-md font-bold text-primary text-center flex-1">
            Musicas
          </h1>
          <Button
            onClick={onSearchToggle}
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-200"
            style={{ padding: 0 }}
            aria-label="Buscar música"
          >
            <span className="material-symbols-outlined text-[24px]">search</span>
          </Button>
        </>
      ) : (
        <div className="flex items-center w-full gap-2">
          <Button
            onClick={onSearchClose}
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-200"
            style={{ padding: 0 }}
            aria-label="Voltar"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </Button>
          <div className="flex-1">
            <Input
              autoFocus
              placeholder="Buscar em todas as abas..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              leftAdornment={<span className="material-symbols-outlined text-outline text-[20px]">search</span>}
              rightAdornment={
                searchQuery && (
                  <button 
                    onClick={() => onSearchQueryChange('')}
                    className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                )
              }
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default SongsHeader;
