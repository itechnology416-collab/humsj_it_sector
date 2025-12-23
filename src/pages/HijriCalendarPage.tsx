import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import HijriDateDisplay from "@/components/islamic/HijriDateDisplay";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

export default function HijriCalendarPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <PageLayout 
      title="Hijri Calendar" 
      subtitle="Islamic lunar calendar with important dates and events"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HijriDateDisplay variant="full" showGregorian={true} />
          </div>
          <div className="space-y-6">
            <IslamicEducationFiller type="fact" size="medium" />
            <IslamicEducationFiller type="tip" size="medium" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}