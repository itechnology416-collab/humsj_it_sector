import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BookOpen, BookMarked, BookText, BookOpenText, Link as LinkIcon } from 'lucide-react';
import PrayerTimesSection from './PrayerTimesSection';
import QuranTrackerSection from './QuranTrackerSection';
import DhikrCounterSection from './DhikrCounterSection';
import IslamicCalendarSection from './IslamicCalendarSection';

const tabMap: { [key: string]: string } = {
  'prayer-times': 'prayer-times',
  'quran-tracker': 'quran-tracker',
  'dhikr-counter': 'dhikr-counter',
  'islamic-calendar': 'islamic-calendar',
};

const reverseTabMap: { [key: string]: string } = {
  'prayer-times': 'prayer-times',
  'quran-tracker': 'quran-tracker',
  'dhikr-counter': 'dhikr-counter',
  'islamic-calendar': 'islamic-calendar',
};

export default function IslamicResourcesHub() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('prayer-times');

  // Sync tab state with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && tab in tabMap) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`?tab=${value}`, { replace: true });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Islamic Resources Hub</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
        defaultValue="prayer-times"
      >
        <TabsList className="w-full overflow-x-auto flex">
          <TabsTrigger value="prayer-times" className="whitespace-nowrap">Prayer Times</TabsTrigger>
          <TabsTrigger value="quran-tracker" className="whitespace-nowrap">Quran Tracker</TabsTrigger>
          <TabsTrigger value="dhikr-counter" className="whitespace-nowrap">Dhikr Counter</TabsTrigger>
          <TabsTrigger value="islamic-calendar" className="whitespace-nowrap">Islamic Calendar</TabsTrigger>
          <TabsTrigger value="knowledge" className="whitespace-nowrap">Knowledge & Learning</TabsTrigger>
          <TabsTrigger value="books" className="whitespace-nowrap">Recommended Books</TabsTrigger>
        </TabsList>

        <TabsContent value="prayer-times">
          <PrayerTimesSection />
        </TabsContent>

        <TabsContent value="quran-tracker">
          <QuranTrackerSection />
        </TabsContent>

        <TabsContent value="dhikr-counter">
          <DhikrCounterSection />
        </TabsContent>

        <TabsContent value="islamic-calendar">
          <IslamicCalendarSection />
        </TabsContent>

        <TabsContent value="knowledge">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Quran Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a 
                  href="https://www.facebook.com/share/1A5JXhpiG6/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  Quran Audio Collection
                </a>
                <div className="space-y-2">
                  <h3 className="font-medium">Quran Tafseer</h3>
                  <p className="text-sm text-muted-foreground">Detailed explanations of Quranic verses</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Hadith Study</h3>
                  <p className="text-sm text-muted-foreground">Study of the Prophet's sayings and teachings</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Fiqh (Islamic Jurisprudence)</h3>
                  <p className="text-sm text-muted-foreground">Understanding Islamic rulings and laws</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Seerah (Prophet's Life)</h3>
                  <p className="text-sm text-muted-foreground">Biography of Prophet Muhammad (PBUH)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="books">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenText className="h-5 w-5 text-primary" />
                  Quran with Translation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Complete Quran with multiple translations and tafseer</p>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-primary" />
                  Riyadus Saliheen
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">A collection of hadith on Islamic manners and ethics</p>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookText className="h-5 w-5 text-primary" />
                  Fortress of the Muslim
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">A collection of authentic supplications from the Quran and Sunnah</p>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  The Sealed Nectar
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Biography of the Noble Prophet Muhammad (PBUH)</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-6 flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          size="sm"
        >
          Back to Top
        </Button>
      </div>
    </div>
  );
}

