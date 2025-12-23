import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import QuranAudioPlayer from "@/components/islamic/QuranAudioPlayer";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

export default function QuranAudioPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <PageLayout 
      title="Quran Audio Player" 
      subtitle="Listen to the Holy Quran with beautiful recitations"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8">
        <QuranAudioPlayer />
        
        {/* Additional Islamic Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="verse" size="medium" />
          <IslamicEducationFiller type="hadith" size="medium" />
        </div>
      </div>
    </PageLayout>
  );
}