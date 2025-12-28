import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search,
  Download,
  Heart,
  Share2,
  Star,
  User,
  Calendar,
  Eye,
  FileText,
  Library,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  language: string;
  pages: number;
  file_url: string;
  cover_image: string;
  published_date: string;
  downloads: number;
  rating: number;
  tags: string[];
  is_featured: boolean;
  is_new: boolean;
  file_size: string;
  format: string;
}

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Sealed Nectar (Ar-Raheeq Al-Makhtum)',
    author: 'Safi-ur-Rahman al-Mubarakpuri',
    description: 'A complete biography of Prophet Muhammad (PBUH), winner of the first prize in the worldwide competition on the biography of the Prophet.',
    category: 'Seerah',
    language: 'English',
    pages: 624,
    file_url: 'https://example.com/sealed-nectar.pdf',
    cover_image: 'https://example.com/cover1.jpg',
    published_date: '1979-01-01',
    downloads: 125430,
    rating: 4.9,
    tags: ['Prophet Muhammad', 'Biography', 'Seerah'],
    is_featured: true,
    is_new: false,
    file_size: '15.2 MB',
    format: 'PDF'
  },
  {
    id: '2',
    title: 'Fortress of the Muslim (Hisn al-Muslim)',
    author: 'Sa\'id ibn Ali ibn Wahf Al-Qahtani',
    description: 'A collection of authentic supplications and remembrances from the Quran and Sunnah for daily use.',
    category: 'Dua',
    language: 'English',
    pages: 256,
    file_url: 'https://example.com/fortress-muslim.pdf',
    cover_image: 'https://example.com/cover2.jpg',
    published_date: '1988-01-01',
    downloads: 89750,
    rating: 4.8,
    tags: ['Dua', 'Supplications', 'Daily Prayers'],
    is_featured: false,
    is_new: true,
    file_size: '8.5 MB',
    format: 'PDF'
  },
  {
    id: '3',
    title: 'Tafsir Ibn Kathir (Abridged)',
    author: 'Ibn Kathir',
    description: 'One of the most respected and accepted explanations of the Quran in the world today.',
    category: 'Tafsir',
    language: 'English',
    pages: 2048,
    file_url: 'https://example.com/tafsir-ibn-kathir.pdf',
    cover_image: 'https://example.com/cover3.jpg',
    published_date: '1365-01-01',
    downloads: 67890,
    rating: 4.9,
    tags: ['Tafsir', 'Quran Commentary', 'Classical'],
    is_featured: true,
    is_new: false,
    file_size: '45.8 MB',
    format: 'PDF'
  }
];

const categories = ['All', 'Quran', 'Hadith', 'Seerah', 'Fiqh', 'Aqeedah', 'Tafsir', 'Dua', 'History', 'Contemporary'];
const languages = ['All', 'English', 'Arabic', 'Amharic', 'Oromo'];
const formats = ['All', 'PDF', 'EPUB', 'MOBI'];

export default function IslamicBooks() {
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [readingList, setReadingList] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('book-favorites');
    const savedReadingList = localStorage.getItem('reading-list');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedReadingList) {
      setReadingList(JSON.parse(savedReadingList));
    }
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'All' || book.language === selectedLanguage;
    const matchesFormat = selectedFormat === 'All' || book.format === selectedFormat;
    
    return matchesSearch && matchesCategory && matchesLanguage && matchesFormat;
  });

  const featuredBooks = books.filter(b => b.is_featured);
  const newBooks = books.filter(b => b.is_new);

  const toggleFavorite = (bookId: string) => {
    const newFavorites = favorites.includes(bookId)
      ? favorites.filter(id => id !== bookId)
      : [...favorites, bookId];
    
    setFavorites(newFavorites);
    localStorage.setItem('book-favorites', JSON.stringify(newFavorites));
  };

  const toggleReadingList = (bookId: string) => {
    const newReadingList = readingList.includes(bookId)
      ? readingList.filter(id => id !== bookId)
      : [...readingList, bookId];
    
    setReadingList(newReadingList);
    localStorage.setItem('reading-list', JSON.stringify(newReadingList));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Quran': 'bg-green-500/20 text-green-600',
      'Hadith': 'bg-blue-500/20 text-blue-600',
      'Seerah': 'bg-purple-500/20 text-purple-600',
      'Fiqh': 'bg-orange-500/20 text-orange-600',
      'Aqeedah': 'bg-red-500/20 text-red-600',
      'Tafsir': 'bg-indigo-500/20 text-indigo-600',
      'Dua': 'bg-pink-500/20 text-pink-600',
      'History': 'bg-yellow-500/20 text-yellow-600',
      'Contemporary': 'bg-teal-500/20 text-teal-600'
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <ProtectedPageLayout 
      title="Islamic Books" 
      subtitle="Access a comprehensive digital library of Islamic literature"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display">Islamic Digital Library</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Discover knowledge through authentic Islamic literature
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <BookOpen size={20} className="text-emerald-600" />
                </div>
                <p className="text-sm font-medium">{books.length}+ Books</p>
                <p className="text-xs text-muted-foreground">Digital collection</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <User size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium">Renowned Authors</p>
                <p className="text-xs text-muted-foreground">Classical & modern</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                  <Download size={20} className="text-purple-600" />
                </div>
                <p className="text-sm font-medium">Free Downloads</p>
                <p className="text-xs text-muted-foreground">Multiple formats</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
                  <Library size={20} className="text-orange-600" />
                </div>
                <p className="text-sm font-medium">Organized</p>
                <p className="text-xs text-muted-foreground">By categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search books, authors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[120px]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[100px]"
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>

                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-sm outline-none cursor-pointer min-w-[80px]"
                >
                  {formats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="new">New Additions</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="reading-list">Reading List</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book, index) => (
                <Card 
                  key={book.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4 mb-4">
                      <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={24} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getCategoryColor(book.category))}>
                            {book.category}
                          </Badge>
                          {book.is_featured && (
                            <Badge variant="outline" className="text-xs">
                              <Star size={10} className="mr-1" />
                              Featured
                            </Badge>
                          )}
                          {book.is_new && (
                            <Badge className="bg-green-500 text-white text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {book.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          by {book.author}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {book.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <FileText size={12} />
                            {book.pages} pages
                          </span>
                          <span className="flex items-center gap-1">
                            <Download size={12} />
                            {book.downloads.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500 fill-current" />
                          {book.rating}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{book.format} • {book.file_size}</span>
                        <span>{book.language}</span>
                      </div>

                      {book.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {book.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                        <Button
                          size="sm"
                          className="flex-1 gap-2"
                        >
                          <Download size={14} />
                          Download
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFavorite(book.id)}
                          className={cn(
                            "w-9 h-8 p-0",
                            favorites.includes(book.id) && "text-red-500 border-red-300"
                          )}
                        >
                          <Heart size={14} className={favorites.includes(book.id) ? "fill-current" : ""} />
                        </Button>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-9 h-8 p-0"
                          onClick={() => toggleReadingList(book.id)}
                        >
                          <BookOpen size={14} />
                        </Button>

                        <Button variant="outline" size="sm" className="w-9 h-8 p-0">
                          <Share2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredBooks.map((book, index) => (
                <Card 
                  key={book.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-24 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={32} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs", getCategoryColor(book.category))}>
                            {book.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Star size={10} className="mr-1" />
                            Featured
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          by {book.author}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {book.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText size={12} />
                              {book.pages} pages
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={12} className="text-yellow-500 fill-current" />
                              {book.rating}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="gap-2"
                          >
                            <Download size={14} />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {newBooks.map((book, index) => (
                <Card 
                  key={book.id}
                  className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-500 text-white text-xs">
                            New
                          </Badge>
                          <Badge className={cn("text-xs", getCategoryColor(book.category))}>
                            {book.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {book.author}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText size={12} />
                            {book.pages} pages
                          </span>
                          <span className="flex items-center gap-1">
                            <Download size={12} />
                            {book.downloads.toLocaleString()}
                          </span>
                          <span>{book.format} • {book.file_size}</span>
                        </div>
                      </div>
                      <Button
                        className="gap-2"
                      >
                        <Download size={16} />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground">
                    Start adding books to your favorites to see them here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books
                  .filter(book => favorites.includes(book.id))
                  .map((book, index) => (
                    <Card 
                      key={book.id}
                      className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-15 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <Heart size={20} className="text-white fill-current" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                              {book.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              by {book.author}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full gap-2"
                        >
                          <Download size={14} />
                          Download Favorite
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reading-list" className="space-y-6">
            {readingList.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Reading list is empty</h3>
                  <p className="text-muted-foreground">
                    Add books to your reading list to keep track of what you want to read.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {books
                  .filter(book => readingList.includes(book.id))
                  .map((book, index) => (
                    <Card 
                      key={book.id}
                      className="hover:shadow-lg transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <BookOpen size={24} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              by {book.author}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{book.pages} pages</span>
                              <span>{book.format}</span>
                              <Badge className={cn("text-xs", getCategoryColor(book.category))}>
                                {book.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleReadingList(book.id)}
                              className="gap-2"
                            >
                              Remove
                            </Button>
                            <Button
                              className="gap-2"
                            >
                              <Download size={16} />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Islamic Educational Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </ProtectedPageLayout>
  );
}