import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import PrayerTracker from "@/components/islamic/PrayerTracker";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

export default function PrayerTrackerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <PageLayout 
      title="Prayer Tracker" 
      subtitle="Track your daily prayers and build consistent habits"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8">
        <PrayerTracker />
        
        {/* Additional Islamic Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="dua" size="medium" />
          <IslamicEducationFiller type="tip" size="medium" />
        </div>
      </div>
    </PageLayout>
  );
}