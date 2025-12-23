import { APP_CONFIG } from '@/config/app';

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  hijriDate: string;
  qibla: number;
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
    date: {
      readable: string;
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
        month: {
          number: number;
          en: string;
          ar: string;
        };
        year: string;
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: Record<string, number>;
    };
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export class PrayerTimesService {
  private baseUrl = APP_CONFIG.apis.prayerTimes;
  private cache = new Map<string, { data: PrayerTimes; timestamp: number }>();
  private cacheTimeout = APP_CONFIG.limits.cacheTimeout;

  async getPrayerTimes(
    coordinates: Coordinates,
    date?: Date,
    method: number = APP_CONFIG.defaults.prayerCalculationMethod,
    school: number = APP_CONFIG.defaults.madhab
  ): Promise<PrayerTimes> {
    const targetDate = date || new Date();
    const dateString = this.formatDate(targetDate);
    const cacheKey = `${coordinates.latitude}-${coordinates.longitude}-${dateString}-${method}-${school}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const url = `${this.baseUrl}/timings/${dateString}`;
      const params = new URLSearchParams({
        latitude: coordinates.latitude.toString(),
        longitude: coordinates.longitude.toString(),
        method: method.toString(),
        school: school.toString(),
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Prayer times API error: ${response.status}`);
      }

      const data: PrayerTimesResponse = await response.json();
      
      if (data.code !== 200) {
        throw new Error(`Prayer times API error: ${data.status}`);
      }

      const prayerTimes: PrayerTimes = {
        fajr: this.formatTime(data.data.timings.Fajr),
        sunrise: this.formatTime(data.data.timings.Sunrise),
        dhuhr: this.formatTime(data.data.timings.Dhuhr),
        asr: this.formatTime(data.data.timings.Asr),
        maghrib: this.formatTime(data.data.timings.Maghrib),
        isha: this.formatTime(data.data.timings.Isha),
        date: data.data.date.readable,
        hijriDate: `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`,
        qibla: this.calculateQibla(coordinates),
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: prayerTimes,
        timestamp: Date.now(),
      });

      return prayerTimes;
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      
      // Return fallback times if API fails
      return this.getFallbackPrayerTimes(coordinates, targetDate);
    }
  }

  async getPrayerTimesForMonth(
    coordinates: Coordinates,
    year: number,
    month: number,
    method: number = APP_CONFIG.defaults.prayerCalculationMethod,
    school: number = APP_CONFIG.defaults.madhab
  ): Promise<PrayerTimes[]> {
    try {
      const url = `${this.baseUrl}/calendar/${year}/${month}`;
      const params = new URLSearchParams({
        latitude: coordinates.latitude.toString(),
        longitude: coordinates.longitude.toString(),
        method: method.toString(),
        school: school.toString(),
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Prayer times calendar API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error(`Prayer times calendar API error: ${data.status}`);
      }

      return data.data.map((day: any) => ({
        fajr: this.formatTime(day.timings.Fajr),
        sunrise: this.formatTime(day.timings.Sunrise),
        dhuhr: this.formatTime(day.timings.Dhuhr),
        asr: this.formatTime(day.timings.Asr),
        maghrib: this.formatTime(day.timings.Maghrib),
        isha: this.formatTime(day.timings.Isha),
        date: day.date.readable,
        hijriDate: `${day.date.hijri.day} ${day.date.hijri.month.en} ${day.date.hijri.year}`,
        qibla: this.calculateQibla(coordinates),
      }));
    } catch (error) {
      console.error('Error fetching monthly prayer times:', error);
      throw error;
    }
  }

  async getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to default coordinates (Haramaya University)
          resolve(APP_CONFIG.defaults.coordinates);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  private formatTime(time: string): string {
    // Remove timezone info and format consistently
    return time.split(' ')[0];
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private calculateQibla(coordinates: Coordinates): number {
    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    
    const lat1 = coordinates.latitude * Math.PI / 180;
    const lat2 = kaabaLat * Math.PI / 180;
    const deltaLng = (kaabaLng - coordinates.longitude) * Math.PI / 180;
    
    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
    
    let qibla = Math.atan2(y, x) * 180 / Math.PI;
    qibla = (qibla + 360) % 360;
    
    return Math.round(qibla);
  }

  private getFallbackPrayerTimes(coordinates: Coordinates, date: Date): PrayerTimes {
    // Simplified calculation for fallback
    const sunrise = new Date(date);
    sunrise.setHours(6, 0, 0, 0);
    
    return {
      fajr: this.addMinutes(sunrise, -90).toTimeString().slice(0, 5),
      sunrise: sunrise.toTimeString().slice(0, 5),
      dhuhr: this.addMinutes(sunrise, 360).toTimeString().slice(0, 5),
      asr: this.addMinutes(sunrise, 540).toTimeString().slice(0, 5),
      maghrib: this.addMinutes(sunrise, 720).toTimeString().slice(0, 5),
      isha: this.addMinutes(sunrise, 810).toTimeString().slice(0, 5),
      date: date.toDateString(),
      hijriDate: 'Fallback Date',
      qibla: this.calculateQibla(coordinates),
    };
  }

  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const prayerTimesService = new PrayerTimesService();