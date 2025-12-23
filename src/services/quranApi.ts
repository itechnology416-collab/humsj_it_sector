import { APP_CONFIG } from '@/config/app';

export interface QuranVerse {
  id: number;
  verse_number: number;
  chapter_id: number;
  verse_key: string;
  text_uthmani: string;
  text_simple: string;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  page_number: number;
  translations?: Translation[];
  audio?: AudioFile[];
}

export interface Translation {
  id: number;
  language_name: string;
  text: string;
  resource_name: string;
  resource_id: number;
}

export interface AudioFile {
  url: string;
  duration: number;
  format: string;
  segments: number[];
}

export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface Reciter {
  id: number;
  name: string;
  arabic_name: string;
  relative_path: string;
  format: string;
  files_size: number;
}

export interface QuranApiResponse<T> {
  verses?: T[];
  chapters?: T[];
  audio_files?: T[];
  pagination?: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}

export class QuranApiService {
  private baseUrl = 'https://api.quran.com/api/v4';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = APP_CONFIG.limits.cacheTimeout;

  // Get all chapters (Surahs)
  async getChapters(): Promise<Chapter[]> {
    const cacheKey = 'chapters';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseUrl}/chapters`);
      
      if (!response.ok) {
        throw new Error(`Quran API error: ${response.status}`);
      }

      const data: QuranApiResponse<Chapter> = await response.json();
      const chapters = data.chapters || [];

      this.cache.set(cacheKey, {
        data: chapters,
        timestamp: Date.now(),
      });

      return chapters;
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return this.getFallbackChapters();
    }
  }

  // Get verses from a specific chapter
  async getChapterVerses(
    chapterId: number,
    page: number = 1,
    perPage: number = 50,
    translations: number[] = [131] // English - Sahih International
  ): Promise<{ verses: QuranVerse[]; pagination: any }> {
    const translationsParam = translations.join(',');
    const cacheKey = `chapter-${chapterId}-${page}-${perPage}-${translationsParam}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/verses/by_chapter/${chapterId}`;
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        translations: translationsParam,
        fields: 'text_uthmani,text_simple,verse_key,translations',
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Quran API error: ${response.status}`);
      }

      const data: QuranApiResponse<QuranVerse> = await response.json();
      const result = {
        verses: data.verses || [],
        pagination: data.pagination,
      };

      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      console.error('Error fetching chapter verses:', error);
      throw error;
    }
  }

  // Get specific verse
  async getVerse(verseKey: string, translations: number[] = [131]): Promise<QuranVerse> {
    const translationsParam = translations.join(',');
    const cacheKey = `verse-${verseKey}-${translationsParam}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/verses/by_key/${verseKey}`;
      const params = new URLSearchParams({
        translations: translationsParam,
        fields: 'text_uthmani,text_simple,verse_key,translations',
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Quran API error: ${response.status}`);
      }

      const data: QuranApiResponse<QuranVerse> = await response.json();
      const verse = data.verses?.[0];

      if (!verse) {
        throw new Error('Verse not found');
      }

      this.cache.set(cacheKey, {
        data: verse,
        timestamp: Date.now(),
      });

      return verse;
    } catch (error) {
      console.error('Error fetching verse:', error);
      throw error;
    }
  }

  // Get random verse
  async getRandomVerse(translations: number[] = [131]): Promise<QuranVerse> {
    try {
      // Get a random chapter and verse
      const chapters = await this.getChapters();
      const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
      const randomVerseNumber = Math.floor(Math.random() * randomChapter.verses_count) + 1;
      const verseKey = `${randomChapter.id}:${randomVerseNumber}`;

      return await this.getVerse(verseKey, translations);
    } catch (error) {
      console.error('Error fetching random verse:', error);
      return this.getFallbackVerse();
    }
  }

  // Get audio for a chapter
  async getChapterAudio(chapterId: number, reciterId: number = 7): Promise<AudioFile[]> {
    const cacheKey = `audio-${chapterId}-${reciterId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/chapter_recitations/${reciterId}/${chapterId}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Quran Audio API error: ${response.status}`);
      }

      const data: QuranApiResponse<AudioFile> = await response.json();
      const audioFiles = data.audio_files || [];

      this.cache.set(cacheKey, {
        data: audioFiles,
        timestamp: Date.now(),
      });

      return audioFiles;
    } catch (error) {
      console.error('Error fetching chapter audio:', error);
      return [];
    }
  }

  // Get available reciters
  async getReciters(): Promise<Reciter[]> {
    const cacheKey = 'reciters';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseUrl}/resources/recitations`);
      
      if (!response.ok) {
        throw new Error(`Reciters API error: ${response.status}`);
      }

      const data = await response.json();
      const reciters = data.recitations || [];

      this.cache.set(cacheKey, {
        data: reciters,
        timestamp: Date.now(),
      });

      return reciters;
    } catch (error) {
      console.error('Error fetching reciters:', error);
      return this.getFallbackReciters();
    }
  }

  // Search verses
  async searchVerses(
    query: string,
    page: number = 1,
    perPage: number = 20,
    translations: number[] = [131]
  ): Promise<{ verses: QuranVerse[]; pagination: any }> {
    try {
      const translationsParam = translations.join(',');
      const url = `${this.baseUrl}/search`;
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        size: perPage.toString(),
        translations: translationsParam,
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Quran Search API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        verses: data.search?.results || [],
        pagination: data.search?.pagination,
      };
    } catch (error) {
      console.error('Error searching verses:', error);
      throw error;
    }
  }

  // Fallback data for offline mode
  private getFallbackChapters(): Chapter[] {
    return [
      {
        id: 1,
        name_simple: 'Al-Fatihah',
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fātiḥah',
        revelation_place: 'makkah',
        revelation_order: 5,
        bismillah_pre: true,
        verses_count: 7,
        pages: [1, 2],
        translated_name: {
          language_name: 'english',
          name: 'The Opening'
        }
      },
      // Add more fallback chapters as needed
    ];
  }

  private getFallbackReciters(): Reciter[] {
    return [
      {
        id: 7,
        name: 'Mishary Rashid Alafasy',
        arabic_name: 'مشاري بن راشد العفاسي',
        relative_path: 'mishary_rashid_alafasy',
        format: 'mp3',
        files_size: 1024000
      },
    ];
  }

  private getFallbackVerse(): QuranVerse {
    return {
      id: 1,
      verse_number: 1,
      chapter_id: 1,
      verse_key: '1:1',
      text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
      text_simple: 'بسم الله الرحمن الرحيم',
      juz_number: 1,
      hizb_number: 1,
      rub_number: 1,
      page_number: 1,
      translations: [{
        id: 131,
        language_name: 'english',
        text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        resource_name: 'Sahih International',
        resource_id: 131
      }]
    };
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

export const quranApiService = new QuranApiService();