import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IslamicEducationFiller, { 
  IslamicVerseFiller, 
  IslamicHadithFiller, 
  IslamicDuaFiller,
  IslamicFactFiller,
  IslamicTipFiller,
  IslamicQuoteFiller
} from '@/components/islamic/IslamicEducationFiller';
import IslamicSidebarWidget, {
  PrayerTimesWidget,
  DailyVerseWidget,
  IslamicCalendarWidget,
  DhikrCounterWidget,
  QiblaDirectionWidget
} from '@/components/islamic/IslamicSidebarWidget';
import IslamicFooter, {
  MinimalIslamicFooter,
  CompactIslamicFooter,
  FullIslamicFooter
} from '@/components/islamic/IslamicFooter';
import IslamicSpaceFiller, {
  SmallIslamicFiller,
  MediumIslamicFiller,
  LargeIslamicFiller
} from '@/components/islamic/IslamicSpaceFiller';
import {
  BookOpen,
  Star,
  Heart,
  Clock,
  Compass,
  Calendar,
  Zap,
  Quote,
  Lightbulb,
  Target,
  Award,
  Globe,
  Users,
  MessageCircle,
  Volume2,
  Eye,
  Share2,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Moon,
  Sun,
  Layout,
  Sidebar,
  Grid
} from 'lucide-react';

export default function IslamicContentShowcase() {
  const [selectedDemo, setSelectedDemo] = useState('education');

  return (
    <PageLayout title="Islamic Content Showcase" currentPath="/islamic-content-showcase" onNavigate={() => {}}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2">
            <BookOpen size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Islamic Educational Components</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide">
            Islamic Content <span className="text-primary">Showcase</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive Islamic educational components designed to fill gaps and spaces throughout 
            the HUMSJ application while providing valuable Islamic knowledge and reminders.
          </p>
        </div>

        <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="education" className="flex items-center gap-2">
              <BookOpen size={16} />
              Education
            </TabsTrigger>
            <TabsTrigger value="widgets" className="flex items-center gap-2">
              <Sidebar size={16} />
              Widgets
            </TabsTrigger>
            <TabsTrigger value="footers" className="flex items-center gap-2">
              <Grid size={16} />
              Footers
            </TabsTrigger>
            <TabsTrigger value="fillers" className="flex items-center gap-2">
              <Grid size={16} />
              Space Fillers
            </TabsTrigger>
            <TabsTrigger value="layouts" className="flex items-center gap-2">
              <Layout size={16} />
              Layouts
            </TabsTrigger>
          </TabsList>

          {/* Educational Components */}
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={20} />
                  Islamic Educational Components
                </CardTitle>
                <CardDescription>
                  Rich educational content including Quranic verses, Hadiths, Duas, Islamic facts, tips, and quotes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Mixed Content */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    Mixed Islamic Content (Auto-Rotating)
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <IslamicEducationFiller type="mixed" size="medium" />
                    <IslamicEducationFiller type="mixed" size="large" />
                  </div>
                </div>

                {/* Specific Content Types */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target size={16} className="text-primary" />
                    Specific Content Types
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <IslamicVerseFiller size="medium" />
                    <IslamicHadithFiller size="medium" />
                    <IslamicDuaFiller size="medium" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <IslamicFactFiller size="medium" />
                    <IslamicTipFiller size="medium" />
                    <IslamicQuoteFiller size="medium" />
                  </div>
                </div>

                {/* Size Variations */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    Size Variations
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <IslamicEducationFiller type="verse" size="small" />
                      <IslamicEducationFiller type="hadith" size="small" />
                      <IslamicEducationFiller type="dua" size="small" />
                    </div>
                    <IslamicEducationFiller type="mixed" size="large" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sidebar Widgets */}
          <TabsContent value="widgets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sidebar size={20} />
                  Islamic Sidebar Widgets
                </CardTitle>
                <CardDescription>
                  Compact widgets perfect for sidebars, dashboards, and small spaces
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <PrayerTimesWidget />
                  <DailyVerseWidget />
                  <IslamicCalendarWidget />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DhikrCounterWidget />
                  <QiblaDirectionWidget />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Footer Components */}
          <TabsContent value="footers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Footer size={20} />
                  Islamic Footer Components
                </CardTitle>
                <CardDescription>
                  Footer components with Islamic content for different page layouts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Minimal Footer</h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <MinimalIslamicFooter />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Compact Footer</h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <CompactIslamicFooter />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Full Footer</h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <FullIslamicFooter />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Space Fillers */}
          <TabsContent value="fillers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid size={20} />
                  Adaptive Space Fillers
                </CardTitle>
                <CardDescription>
                  Intelligent components that adapt to available space and fill gaps with Islamic content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Auto-Adaptive Filler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div style={{ height: '200px' }}>
                      <IslamicSpaceFiller autoDetectSize={true} />
                    </div>
                    <div style={{ height: '300px' }}>
                      <IslamicSpaceFiller autoDetectSize={true} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Size-Specific Fillers</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SmallIslamicFiller />
                      <SmallIslamicFiller />
                      <SmallIslamicFiller />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MediumIslamicFiller />
                      <MediumIslamicFiller />
                    </div>
                    <LargeIslamicFiller />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Content-Specific Fillers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <IslamicSpaceFiller preferredContent="educational" />
                    <IslamicSpaceFiller preferredContent="prayer" />
                    <IslamicSpaceFiller preferredContent="calendar" />
                    <IslamicSpaceFiller preferredContent="mixed" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Examples */}
          <TabsContent value="layouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout size={20} />
                  Layout Integration Examples
                </CardTitle>
                <CardDescription>
                  Examples of how to integrate Islamic components into different page layouts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Dashboard Layout */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dashboard Layout</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Main Content Area</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">
                              Your main dashboard content goes here...
                            </p>
                            <div className="h-32 bg-secondary/30 rounded-lg flex items-center justify-center">
                              <span className="text-muted-foreground">Dashboard Content</span>
                            </div>
                          </CardContent>
                        </Card>
                        <IslamicEducationFiller type="mixed" size="medium" />
                      </div>
                      <IslamicSpaceFiller minHeight={150} maxHeight={200} />
                    </div>
                    <div className="space-y-4">
                      <PrayerTimesWidget />
                      <DailyVerseWidget />
                      <DhikrCounterWidget />
                    </div>
                  </div>
                </div>

                {/* Article Layout */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Article/Blog Layout</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Article Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground">
                            Article content would go here. Between paragraphs or sections, 
                            Islamic educational content can be seamlessly integrated...
                          </p>
                          <IslamicEducationFiller type="verse" size="small" />
                          <p className="text-muted-foreground">
                            More article content continues here, with Islamic wisdom 
                            providing spiritual enrichment throughout the reading experience...
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-4">
                      <IslamicCalendarWidget />
                      <QiblaDirectionWidget />
                      <SmallIslamicFiller />
                    </div>
                  </div>
                </div>

                {/* Full Page Layout */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Full Page Layout with Footer</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <MediumIslamicFiller />
                      <MediumIslamicFiller />
                      <MediumIslamicFiller />
                    </div>
                    <CompactIslamicFooter />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Usage Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb size={20} />
              Usage Guidelines
            </CardTitle>
            <CardDescription>
              Best practices for integrating Islamic educational components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-primary">When to Use</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Fill empty spaces in dashboards and layouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Add Islamic content between main sections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide spiritual reminders throughout the app</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Enhance user engagement with educational content</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-primary">Component Selection</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Education Fillers:</strong> For content-rich areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Sidebar Widgets:</strong> For compact spaces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Space Fillers:</strong> For adaptive layouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Footers:</strong> For page bottom areas</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}