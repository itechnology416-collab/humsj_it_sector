import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import IslamicNotifications from "@/components/islamic/IslamicNotifications";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

export default function IslamicNotificationsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <PageLayout 
      title="Islamic Notifications" 
      subtitle="Stay connected with your Islamic obligations and reminders"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IslamicNotifications />
          </div>
          <div className="space-y-6">
            <IslamicEducationFiller type="dua" size="medium" />
            <IslamicEducationFiller type="verse" size="medium" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}