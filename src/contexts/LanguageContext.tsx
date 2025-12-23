import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'am' | 'om' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.events': 'Events',
    'nav.news': 'News',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.join': 'Join Us',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    
    // Common
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.add': 'Add',
    'common.update': 'Update',
    'common.submit': 'Submit',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    
    // Islamic Terms
    'islamic.bismillah': 'In the name of Allah',
    'islamic.alhamdulillah': 'All praise is due to Allah',
    'islamic.subhanallah': 'Glory be to Allah',
    'islamic.allahu_akbar': 'Allah is the Greatest',
    'islamic.astaghfirullah': 'I seek forgiveness from Allah',
    'islamic.inshallah': 'God willing',
    'islamic.mashallah': 'What Allah has willed',
    'islamic.barakallahu_feek': 'May Allah bless you',
    
    // Prayer Times
    'prayer.fajr': 'Fajr',
    'prayer.dhuhr': 'Dhuhr',
    'prayer.asr': 'Asr',
    'prayer.maghrib': 'Maghrib',
    'prayer.isha': 'Isha',
    'prayer.times': 'Prayer Times',
    'prayer.next': 'Next Prayer',
    
    // Pages
    'page.khutbah': 'Khutbah Collection',
    'page.dua': 'Dua Collection',
    'page.hadith': 'Hadith Collection',
    'page.quran': 'Quran',
    'page.calendar': 'Islamic Calendar',
    'page.qibla': 'Qibla Finder',
    
    // Organization
    'org.name': 'Haramaya University Muslim Students\' Union',
    'org.short': 'HUMSJ',
    'org.sector': 'IT Sector',
    'org.description': 'Connecting Muslim students through technology and faith'
  },
  
  am: {
    // Navigation (Amharic)
    'nav.home': 'መነሻ',
    'nav.about': 'ስለ እኛ',
    'nav.events': 'ዝግጅቶች',
    'nav.news': 'ዜናዎች',
    'nav.gallery': 'ምስሎች',
    'nav.contact': 'ያግኙን',
    'nav.login': 'ግባ',
    'nav.join': 'ተቀላቀል',
    'nav.dashboard': 'ዳሽቦርድ',
    'nav.logout': 'ውጣ',
    
    // Common (Amharic)
    'common.loading': 'በመጫን ላይ...',
    'common.search': 'ፈልግ',
    'common.filter': 'አጣራ',
    'common.save': 'አስቀምጥ',
    'common.cancel': 'ሰርዝ',
    'common.edit': 'አርም',
    'common.delete': 'ሰርዝ',
    'common.view': 'ተመልከት',
    'common.add': 'አክል',
    'common.update': 'አዘምን',
    'common.submit': 'አስገባ',
    'common.close': 'ዝጋ',
    'common.back': 'ተመለስ',
    'common.next': 'ቀጣይ',
    'common.previous': 'ቀዳሚ',
    
    // Islamic Terms (Amharic)
    'islamic.bismillah': 'በአላህ ስም',
    'islamic.alhamdulillah': 'ምስጋና ለአላህ ይሁን',
    'islamic.subhanallah': 'ክብር ለአላህ ይሁን',
    'islamic.allahu_akbar': 'አላህ ታላቅ ነው',
    'islamic.astaghfirullah': 'ከአላህ ይቅርታ እጠይቃለሁ',
    'islamic.inshallah': 'አላህ ቢፈቅድ',
    'islamic.mashallah': 'አላህ የፈለገው',
    'islamic.barakallahu_feek': 'አላህ ይባርክህ',
    
    // Prayer Times (Amharic)
    'prayer.fajr': 'ፈጅር',
    'prayer.dhuhr': 'ዙህር',
    'prayer.asr': 'አስር',
    'prayer.maghrib': 'መግሪብ',
    'prayer.isha': 'ኢሻ',
    'prayer.times': 'የጸሎት ሰዓቶች',
    'prayer.next': 'ቀጣይ ጸሎት',
    
    // Organization (Amharic)
    'org.name': 'የሐረማያ ዩኒቨርሲቲ ሙስሊም ተማሪዎች ማህበር',
    'org.short': 'ሐ.ዩ.ሙ.ተ.ማ',
    'org.sector': 'የአይቲ ክፍል',
    'org.description': 'የሙስሊም ተማሪዎችን በቴክኖሎጂ እና በእምነት ማገናኘት'
  },
  
  om: {
    // Navigation (Oromo)
    'nav.home': 'Mana',
    'nav.about': 'Waa\'ee Keenya',
    'nav.events': 'Taateewwan',
    'nav.news': 'Oduu',
    'nav.gallery': 'Suuraa',
    'nav.contact': 'Nu Qunnamaa',
    'nav.login': 'Seeni',
    'nav.join': 'Makamuu',
    'nav.dashboard': 'Gabatee',
    'nav.logout': 'Ba\'i',
    
    // Common (Oromo)
    'common.loading': 'Fe\'aa jira...',
    'common.search': 'Barbaadi',
    'common.filter': 'Cali',
    'common.save': 'Olkaa\'i',
    'common.cancel': 'Dhiisi',
    'common.edit': 'Fooyyessi',
    'common.delete': 'Haqi',
    'common.view': 'Ilaali',
    'common.add': 'Dabali',
    'common.update': 'Haaromsi',
    'common.submit': 'Ergi',
    'common.close': 'Cufii',
    'common.back': 'Deebi\'i',
    'common.next': 'Itti Aanuu',
    'common.previous': 'Dura',
    
    // Islamic Terms (Oromo)
    'islamic.bismillah': 'Maqaa Allaahiin',
    'islamic.alhamdulillah': 'Galanni Allaahiif',
    'islamic.subhanallah': 'Qulqulluu Allaahi',
    'islamic.allahu_akbar': 'Allaahi Guddaa',
    'islamic.astaghfirullah': 'Allaah dhiifama nan gaafadha',
    'islamic.inshallah': 'Allaahi fedhee',
    'islamic.mashallah': 'Allaahi fedhe',
    'islamic.barakallahu_feek': 'Allaahi si haa eebbisu',
    
    // Prayer Times (Oromo)
    'prayer.fajr': 'Fajrii',
    'prayer.dhuhr': 'Zuhurii',
    'prayer.asr': 'Asrii',
    'prayer.maghrib': 'Maghribii',
    'prayer.isha': 'Ishaa',
    'prayer.times': 'Sa\'aatii Kadhannaa',
    'prayer.next': 'Kadhannaa Itti Aanu',
    
    // Organization (Oromo)
    'org.name': 'Yunivarsiitii Haramayaa Barattoota Muslimoota Waldaa',
    'org.short': 'YHBMW',
    'org.sector': 'Kutaa IT',
    'org.description': 'Barattoota Muslimoota teeknooloojii fi amantiitiin walitti dhiyeessuu'
  },
  
  ar: {
    // Navigation (Arabic)
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.events': 'الفعاليات',
    'nav.news': 'الأخبار',
    'nav.gallery': 'المعرض',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'nav.join': 'انضم إلينا',
    'nav.dashboard': 'لوحة التحكم',
    'nav.logout': 'تسجيل الخروج',
    
    // Common (Arabic)
    'common.loading': 'جاري التحميل...',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.view': 'عرض',
    'common.add': 'إضافة',
    'common.update': 'تحديث',
    'common.submit': 'إرسال',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    
    // Islamic Terms (Arabic)
    'islamic.bismillah': 'بسم الله',
    'islamic.alhamdulillah': 'الحمد لله',
    'islamic.subhanallah': 'سبحان الله',
    'islamic.allahu_akbar': 'الله أكبر',
    'islamic.astaghfirullah': 'أستغفر الله',
    'islamic.inshallah': 'إن شاء الله',
    'islamic.mashallah': 'ما شاء الله',
    'islamic.barakallahu_feek': 'بارك الله فيك',
    
    // Prayer Times (Arabic)
    'prayer.fajr': 'الفجر',
    'prayer.dhuhr': 'الظهر',
    'prayer.asr': 'العصر',
    'prayer.maghrib': 'المغرب',
    'prayer.isha': 'العشاء',
    'prayer.times': 'أوقات الصلاة',
    'prayer.next': 'الصلاة التالية',
    
    // Pages (Arabic)
    'page.khutbah': 'مجموعة الخطب',
    'page.dua': 'مجموعة الأدعية',
    'page.hadith': 'مجموعة الأحاديث',
    'page.quran': 'القرآن الكريم',
    'page.calendar': 'التقويم الهجري',
    'page.qibla': 'محدد القبلة',
    
    // Organization (Arabic)
    'org.name': 'اتحاد الطلاب المسلمين بجامعة هرماية',
    'org.short': 'ا.ط.م.ج.ه',
    'org.sector': 'قطاع تقنية المعلومات',
    'org.description': 'ربط الطلاب المسلمين من خلال التكنولوجيا والإيمان'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('humsj-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('humsj-language', language);
    
    // Set document direction for RTL languages
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'ar';

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}