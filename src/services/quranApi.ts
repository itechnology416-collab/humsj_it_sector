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
  style?: string;
  description?: string;
  country?: string;
  audio_url_template?: string;
}

export interface ReciterAudioSource {
  id: string;
  name: string;
  arabic_name: string;
  description: string;
  country: string;
  style: string;
  base_url: string;
  format: string;
  quality: 'high' | 'medium' | 'low';
  sample_rate?: string;
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
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private cacheTimeout = APP_CONFIG.limits.cacheTimeout;

  // Enhanced reciters with the requested ones
  private enhancedReciters: ReciterAudioSource[] = [
    {
      id: 'ali_jabir',
      name: 'Ali Jabir',
      arabic_name: 'علي جابر',
      description: 'Beautiful and melodious recitation with perfect Tajweed',
      country: 'Saudi Arabia',
      style: 'Melodious',
      base_url: 'https://server8.mp3quran.net/ali_jaber',
      format: 'mp3',
      quality: 'high',
      sample_rate: '128kbps'
    },
    {
      id: 'abdullah_basfar',
      name: 'Abdullah Basfar',
      arabic_name: 'عبد الله بصفر',
      description: 'Emotional and heart-touching recitation',
      country: 'Saudi Arabia',
      style: 'Emotional',
      base_url: 'https://server8.mp3quran.net/basfar',
      format: 'mp3',
      quality: 'high',
      sample_rate: '128kbps'
    },
    {
      id: 'abdulwadud_haneef',
      name: 'Abdulwadud Haneef',
      arabic_name: 'عبد الودود حنيف',
      description: 'Clear and precise recitation with excellent pronunciation',
      country: 'India',
      style: 'Clear',
      base_url: 'https://server8.mp3quran.net/abdulwadud',
      format: 'mp3',
      quality: 'high',
      sample_rate: '128kbps'
    },
    {
      id: 'eyman_rushed',
      name: 'Dr. Eyman Rushed',
      arabic_name: 'د. إيمان رشيد',
      description: 'Female reciter with beautiful voice and perfect Tajweed',
      country: 'Egypt',
      style: 'Classical',
      base_url: 'https://server8.mp3quran.net/eyman_rushed',
      format: 'mp3',
      quality: 'high',
      sample_rate: '128kbps'
    },
    {
      id: 'mahmud_kalil',
      name: 'Mahmud Kalil Al-Husary',
      arabic_name: 'محمود خليل الحصري',
      description: 'Legendary reciter known for teaching Tajweed',
      country: 'Egypt',
      style: 'Educational',
      base_url: 'https://server8.mp3quran.net/husary',
      format: 'mp3',
      quality: 'high',
      sample_rate: '128kbps'
    },
    {
      id: 'abdullah_huthaif',
      name: 'Abdullah Ali Huthaif',
      arabic_name: 'عبد الله علي هذيف',
      description: 'Young reciter with modern style and clear voice',
      country: 'Saudi Arabia',
      style: 'Modern',
      base_url: 'https://server8.mp3quran.net/huthaif',
      format: 'mp3',
      quality: 'high',
      sample_rate: '128kbps'
    },
    {
      id: 'mishary_alafasy',
      name: 'Mishary Rashid Alafasy',
      arabic_name: 'مشاري بن راشد العفاسي',
      description: 'Popular reciter with melodious voice',
      country: 'Kuwait',
      style: 'Melodious',
      base_url: 'https://server8.mp3quran.net/afs',
      format: 'mp3',
      quality: 'high',
      sample_rate: '128kbps'
    },
    {
      id: 'abdul_rahman_sudais',
      name: 'Abdul Rahman Al-Sudais',
      arabic_name: 'عبد الرحمن السديس',
      description: 'Imam of Masjid al-Haram with emotional recitation',
      country: 'Saudi Arabia',
      style: 'Emotional',
      base_url: 'https://server8.mp3quran.net/sudais',
      format: 'mp3',
      quality: 'high',
      sample_rate: '128kbps'
    }
  ];

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
  ): Promise<{ verses: QuranVerse[]; pagination: unknown }> {
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

  // Get available reciters (enhanced with local reciters)
  async getReciters(): Promise<Reciter[]> {
    const cacheKey = 'reciters';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // First try to get from API
      const response = await fetch(`${this.baseUrl}/resources/recitations`);
      let apiReciters: Reciter[] = [];
      
      if (response.ok) {
        const data = await response.json();
        apiReciters = data.recitations || [];
      }

      // Convert enhanced reciters to Reciter format and merge with API reciters
      const enhancedAsReciters: Reciter[] = this.enhancedReciters.map((reciter, index) => ({
        id: 1000 + index, // Use high IDs to avoid conflicts
        name: reciter.name,
        arabic_name: reciter.arabic_name,
        relative_path: reciter.id,
        format: reciter.format,
        files_size: 0,
        style: reciter.style,
        description: reciter.description,
        country: reciter.country,
        audio_url_template: reciter.base_url
      }));

      // Merge and deduplicate
      const allReciters = [...enhancedAsReciters, ...apiReciters];
      const uniqueReciters = allReciters.filter((reciter, index, self) => 
        index === self.findIndex(r => r.name === reciter.name)
      );

      this.cache.set(cacheKey, {
        data: uniqueReciters,
        timestamp: Date.now(),
      });

      return uniqueReciters;
    } catch (error) {
      console.error('Error fetching reciters:', error);
      return this.getFallbackReciters();
    }
  }

  // Get enhanced reciters with additional metadata
  getEnhancedReciters(): ReciterAudioSource[] {
    return this.enhancedReciters;
  }

  // Get audio URL for specific reciter and chapter
  getAudioUrl(reciterId: string | number, chapterNumber: number): string {
    // Handle both string and number IDs
    const reciterIdStr = typeof reciterId === 'string' ? reciterId : reciterId.toString();
    
    // Find enhanced reciter first
    const enhancedReciter = this.enhancedReciters.find(r => 
      r.id === reciterIdStr || r.id === `reciter_${reciterId}`
    );
    
    if (enhancedReciter) {
      const chapterStr = String(chapterNumber).padStart(3, '0');
      return `${enhancedReciter.base_url}/${chapterStr}.${enhancedReciter.format}`;
    }

    // Fallback to default URL structure
    const chapterStr = String(chapterNumber).padStart(3, '0');
    return `https://server8.mp3quran.net/afs/${chapterStr}.mp3`;
  }

  // Get multiple audio sources for a chapter (for quality options)
  getMultipleAudioSources(chapterNumber: number): Array<{
    reciter: ReciterAudioSource;
    url: string;
  }> {
    return this.enhancedReciters.map(reciter => ({
      reciter,
      url: this.getAudioUrl(reciter.id, chapterNumber)
    }));
  }

  // Validate audio URL availability
  async validateAudioUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get reciter by ID
  getReciterById(id: string | number): ReciterAudioSource | null {
    const idStr = typeof id === 'string' ? id : id.toString();
    return this.enhancedReciters.find(r => r.id === idStr) || null;
  }

  // Search verses
  async searchVerses(
    query: string,
    page: number = 1,
    perPage: number = 20,
    translations: number[] = [131]
  ): Promise<{ verses: QuranVerse[]; pagination: unknown }> {
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
    return this.enhancedReciters.map((reciter, index) => ({
      id: 1000 + index,
      name: reciter.name,
      arabic_name: reciter.arabic_name,
      relative_path: reciter.id,
      format: reciter.format,
      files_size: 0,
      style: reciter.style,
      description: reciter.description,
      country: reciter.country,
      audio_url_template: reciter.base_url
    }));
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