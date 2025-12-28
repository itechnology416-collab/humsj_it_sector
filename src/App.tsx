import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider, useAI } from "@/contexts/AIContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AIAssistant from "@/components/ai/AIAssistant";
import FloatingVoiceButton from "@/components/ai/FloatingVoiceButton";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import Members from "./pages/Members";
import Events from "./pages/Events";
import Communication from "./pages/Communication";
import Content from "./pages/Content";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import PrayerTimes from "./pages/PrayerTimes";
import PrayerReminders from "./pages/PrayerReminders";
import IslamicTech from "./pages/IslamicTech";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Equipment from "./pages/Equipment";
import Support from "./pages/Support";
import Opportunities from "./pages/Opportunities";
import About from "./pages/About";
import Leadership from "./pages/Leadership";
import Donations from "./pages/Donations";
import Partnerships from "./pages/Partnerships";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Conduct from "./pages/Conduct";
import Library from "./pages/Library";
import Volunteers from "./pages/Volunteers";
import Downloads from "./pages/Downloads";
import Forms from "./pages/Forms";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import ContactTest from "./pages/ContactTest";
import CloudinaryExample from "./components/examples/CloudinaryExample";
import AdminMediaManagement from "./pages/AdminMediaManagement";
import InformationChannels from "./pages/InformationChannels";
import Calendar from "./pages/Calendar";
import Attendance from "./pages/Attendance";
import Inventory from "./pages/Inventory";
import Feedback from "./pages/Feedback";
import Achievements from "./pages/Achievements";
import LearningCenter from "./pages/LearningCenter";
import QuranTracker from "./pages/QuranTracker";
import SpiritualProgress from "./pages/SpiritualProgress";
import MyEvents from "./pages/MyEvents";
import VolunteerOpportunities from "./pages/VolunteerOpportunities";
import MyContributions from "./pages/MyContributions";
import Messages from "./pages/Messages";
import DiscussionForum from "./pages/DiscussionForum";
import MyTasks from "./pages/MyTasks";
import LoginActivity from "./pages/LoginActivity";
import Logout from "./pages/Logout";
import AIInsights from "./pages/AIInsights";
import AIVoiceAssistant from "./pages/AIVoiceAssistant";
import SystemStatus from "./pages/SystemStatus";
import FAQ from "./pages/FAQ";
import News from "./pages/News";
import Courses from "./pages/Courses";
import RoleManagement from "./pages/RoleManagement";
import WebsiteContentManagement from "./pages/WebsiteContentManagement";
import DigitalDawaManagement from "./pages/DigitalDawaManagement";
import CommitteeManagement from "./pages/CommitteeManagement";
import VolunteerManagement from "./pages/VolunteerManagement";
import Khutbah from "./pages/Khutbah";
import IslamicResourcesHubPage from "./pages/IslamicResourcesHubPage";
import DuaCollection from "./pages/DuaCollection";
import IslamicCalendar from "./pages/IslamicCalendar";
import IslamicNames from "./pages/IslamicNames";
import HadithCollection from "./pages/HadithCollection";
import QiblaFinder from "./pages/QiblaFinder";
import AdminMemberManagement from "./pages/AdminMemberManagement";
import AdminUserApproval from "./pages/AdminUserApproval";
import IslamicEducationHub from "./pages/IslamicEducationHub";
import QuranStudy from "./pages/QuranStudy";
import AqeedahStudy from "./pages/AqeedahStudy";
import HadithStudy from "./pages/HadithStudy";
import FiqhStudy from "./pages/FiqhStudy";
import SeerahStudy from "./pages/SeerahStudy";
import ArabicStudy from "./pages/ArabicStudy";
import MaleStudentDashboard from "./pages/MaleStudentDashboard";
import FemaleStudentDashboard from "./pages/FemaleStudentDashboard";
import GenderSelection from "./pages/GenderSelection";
import IslamicProgramsPage from "./pages/IslamicProgramsPage";
import SmartStudyPage from "./pages/SmartStudyPage";
import IslamicHistory from "./pages/IslamicHistory";
import ProphetLife from "./pages/ProphetLife";
import SahabaWomen from "./pages/SahabaWomen";
import IslamInEthiopia from "./pages/IslamInEthiopia";
import IslamicArt from "./pages/IslamicArt";
import DawaContent from "./pages/DawaContent";
import MediaGallery from "./pages/MediaGallery";
import IslamicContentShowcase from "./pages/IslamicContentShowcase";
import QuranAudioPage from "./pages/QuranAudioPage";
import PrayerTrackerPage from "./pages/PrayerTrackerPage";
import DhikrCounterPage from "./pages/DhikrCounterPage";
import HijriCalendarPage from "./pages/HijriCalendarPage";
import IslamicNotificationsPage from "./pages/IslamicNotificationsPage";
import HalalMarketplacePage from "./pages/HalalMarketplacePage";
import IslamicFeaturesShowcase from "./pages/IslamicFeaturesShowcase";
import IslamicCourseEnrollment from "./pages/IslamicCourseEnrollment";
import TafsirPage from "./pages/TafsirPage";
import TajweedLessons from "./pages/TajweedLessons";
import IslamicSupplications from "./pages/IslamicSupplications";
import NamesOfAllah from "./pages/NamesOfAllah";
import IslamicMeditation from "./pages/IslamicMeditation";
import FastingTracker from "./pages/FastingTracker";
import CommunityForum from "./pages/CommunityForum";
import IslamicMarriage from "./pages/IslamicMarriage";
import IslamicChildcare from "./pages/IslamicChildcare";
import ElderCare from "./pages/ElderCare";
import CommunitySupport from "./pages/CommunitySupport";
import IslamicPodcasts from "./pages/IslamicPodcasts";
import IslamicVideos from "./pages/IslamicVideos";
import IslamicBooks from "./pages/IslamicBooks";
import IslamicMusic from "./pages/IslamicMusic";
import IslamicDocumentaries from "./pages/IslamicDocumentaries";
import LiveStreaming from "./pages/LiveStreaming";
import UserVerification from "./pages/UserVerification";
import ThirdPartyIntegrations from "./pages/ThirdPartyIntegrations";
import APIManagement from "./pages/APIManagement";
import WebhookManager from "./pages/WebhookManager";
import DataExport from "./pages/DataExport";
import IslamicAITutor from "./pages/IslamicAITutor";
import VirtualMosque from "./pages/VirtualMosque";
import MyAttendance from "./pages/MyAttendance";
import EmailVerification from "./pages/EmailVerification";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <AIProvider>
                  <AIAssistantWrapper />
                  <FloatingVoiceButton />
                  <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/members" element={<Members />} />
                <Route path="/events" element={<Events />} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/content" element={<Content />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/profile/:id?" element={<Profile />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/prayer-times" element={<PrayerTimes />} />
                <Route path="/prayer-reminders" element={<PrayerReminders />} />
                <Route path="/islamic-tech" element={<IslamicTech />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/equipment" element={<Equipment />} />
                <Route path="/support" element={<Support />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/about" element={<About />} />
                <Route path="/leadership" element={<Leadership />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/partnerships" element={<Partnerships />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/conduct" element={<Conduct />} />
                <Route path="/library" element={<Library />} />
                <Route path="/volunteers" element={<Volunteers />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/forms" element={<Forms />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cloudinary-example" element={<CloudinaryExample />} />
                <Route path="/information-channels" element={<InformationChannels />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/my-attendance" element={<MyAttendance />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/learning-center" element={<LearningCenter />} />
                <Route path="/quran-tracker" element={<QuranTracker />} />
                <Route path="/spiritual-progress" element={<SpiritualProgress />} />
                <Route path="/my-events" element={<MyEvents />} />
                <Route path="/volunteer-opportunities" element={<VolunteerOpportunities />} />
                <Route path="/my-contributions" element={<MyContributions />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/discussion-forum" element={<DiscussionForum />} />
                <Route path="/my-tasks" element={<MyTasks />} />
                <Route path="/login-activity" element={<LoginActivity />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/ai-voice-assistant" element={<AIVoiceAssistant />} />
                <Route path="/system-status" element={<SystemStatus />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/news" element={<News />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/role-management" element={<RoleManagement />} />
                <Route path="/website-content" element={<WebsiteContentManagement />} />
                <Route path="/digital-dawa" element={<DigitalDawaManagement />} />
                <Route path="/committee-management" element={<CommitteeManagement />} />
                <Route path="/volunteer-management" element={<VolunteerManagement />} />
                <Route path="/admin-members" element={<AdminMemberManagement />} />
                <Route path="/admin-user-approval" element={<AdminUserApproval />} />
                <Route path="/admin-media" element={<AdminMediaManagement />} />
                <Route path="/khutbah" element={<Khutbah />} />
                <Route path="/islamic-resources" element={<IslamicResourcesHubPage />} />
                <Route path="/dua-collection" element={<DuaCollection />} />
                <Route path="/islamic-calendar" element={<IslamicCalendar />} />
                <Route path="/islamic-names" element={<IslamicNames />} />
                <Route path="/hadith-collection" element={<HadithCollection />} />
                <Route path="/qibla-finder" element={<QiblaFinder />} />
                <Route path="/islamic-education" element={<IslamicEducationHub />} />
                <Route path="/quran-study" element={<QuranStudy />} />
                <Route path="/aqeedah-study" element={<AqeedahStudy />} />
                <Route path="/hadith-study" element={<HadithStudy />} />
                <Route path="/fiqh-study" element={<FiqhStudy />} />
                <Route path="/seerah-study" element={<SeerahStudy />} />
                <Route path="/arabic-study" element={<ArabicStudy />} />
                <Route path="/male-dashboard" element={<MaleStudentDashboard />} />
                <Route path="/female-dashboard" element={<FemaleStudentDashboard />} />
                <Route path="/gender-selection" element={<GenderSelection />} />
                <Route path="/islamic-programs" element={<IslamicProgramsPage />} />
                <Route path="/smart-study" element={<SmartStudyPage />} />
                <Route path="/islamic-history" element={<IslamicHistory />} />
                <Route path="/prophet-life" element={<ProphetLife />} />
                <Route path="/sahaba-women" element={<SahabaWomen />} />
                <Route path="/islam-ethiopia" element={<IslamInEthiopia />} />
                <Route path="/islamic-art" element={<IslamicArt />} />
                <Route path="/dawa-content" element={<DawaContent />} />
                <Route path="/media-gallery" element={<MediaGallery />} />
                <Route path="/islamic-content-showcase" element={<IslamicContentShowcase />} />
                <Route path="/quran-audio" element={<QuranAudioPage />} />
                <Route path="/prayer-tracker" element={<PrayerTrackerPage />} />
                <Route path="/dhikr-counter" element={<DhikrCounterPage />} />
                <Route path="/hijri-calendar" element={<HijriCalendarPage />} />
                <Route path="/islamic-notifications" element={<IslamicNotificationsPage />} />
                <Route path="/halal-marketplace" element={<HalalMarketplacePage />} />
                <Route path="/islamic-features" element={<IslamicFeaturesShowcase />} />
                <Route path="/islamic-course-enrollment" element={<IslamicCourseEnrollment />} />
                <Route path="/tafsir" element={<TafsirPage />} />
                <Route path="/tajweed-lessons" element={<TajweedLessons />} />
                <Route path="/islamic-supplications" element={<IslamicSupplications />} />
                <Route path="/names-of-allah" element={<NamesOfAllah />} />
                <Route path="/islamic-meditation" element={<IslamicMeditation />} />
                <Route path="/fasting-tracker" element={<FastingTracker />} />
                <Route path="/community-forum" element={<CommunityForum />} />
                <Route path="/islamic-marriage" element={<IslamicMarriage />} />
                <Route path="/islamic-childcare" element={<IslamicChildcare />} />
                <Route path="/elder-care" element={<ElderCare />} />
                <Route path="/community-support" element={<CommunitySupport />} />
                <Route path="/islamic-podcasts" element={<IslamicPodcasts />} />
                <Route path="/islamic-videos" element={<IslamicVideos />} />
                <Route path="/islamic-books" element={<IslamicBooks />} />
                <Route path="/islamic-music" element={<IslamicMusic />} />
                <Route path="/islamic-documentaries" element={<IslamicDocumentaries />} />
                <Route path="/live-streaming" element={<LiveStreaming />} />
                <Route path="/user-verification" element={<UserVerification />} />
                <Route path="/third-party-integrations" element={<ThirdPartyIntegrations />} />
                <Route path="/api-management" element={<APIManagement />} />
                <Route path="/webhook-manager" element={<WebhookManager />} />
                <Route path="/data-export" element={<DataExport />} />
                <Route path="/islamic-ai-tutor" element={<IslamicAITutor />} />
                <Route path="/virtual-mosque" element={<VirtualMosque />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AIProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
      </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// AI Assistant Wrapper Component
function AIAssistantWrapper() {
  const { isAIAssistantOpen, isAIAssistantMinimized, toggleAIAssistant, minimizeAIAssistant } = useAI();
  
  return (
    <AIAssistant
      isOpen={isAIAssistantOpen}
      onToggle={toggleAIAssistant}
      isMinimized={isAIAssistantMinimized}
      onMinimize={minimizeAIAssistant}
    />
  );
}

export default App;
