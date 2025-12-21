import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider, useAI } from "@/contexts/AIContext";
import AIAssistant from "@/components/ai/AIAssistant";
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
import IslamicResources from "./pages/IslamicResources";
import DuaCollection from "./pages/DuaCollection";
import IslamicCalendar from "./pages/IslamicCalendar";
import IslamicNames from "./pages/IslamicNames";
import HadithCollection from "./pages/HadithCollection";
import QiblaFinder from "./pages/QiblaFinder";
import AdminMemberManagement from "./pages/AdminMemberManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AIProvider>
              <AIAssistantWrapper />
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
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/attendance" element={<Attendance />} />
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
                <Route path="/khutbah" element={<Khutbah />} />
                <Route path="/islamic-resources" element={<IslamicResources />} />
                <Route path="/dua-collection" element={<DuaCollection />} />
                <Route path="/islamic-calendar" element={<IslamicCalendar />} />
                <Route path="/islamic-names" element={<IslamicNames />} />
                <Route path="/hadith-collection" element={<HadithCollection />} />
                <Route path="/qibla-finder" element={<QiblaFinder />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AIProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
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
