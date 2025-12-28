import { useLocation, useNavigate } from "react-router-dom";
import { ProtectedPageLayout } from "@/components/layout/ProtectedPageLayout";
import PrayerTracker from "@/components/islamic/PrayerTracker";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

export default function PrayerTrackerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ProtectedPageLayout 
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
    </ProtectedPageLayout>
  );
}