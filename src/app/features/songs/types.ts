export interface Song {
  id: string;
  title: string;
  artist: string;
  category: 'sugestao' | 'ensaiando' | 'repertorio';
  duration: string;
  progress: string;
  progressPct: number;
  engagement: number;
  isHeard: boolean;
  image: string;
  suggestedBy?: string;
  /** Musical key, e.g. 'F', 'Am' */
  tom?: string;
  /** Raw cifra lines as received from the data source */
  cifra?: string[];
}
