import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import DhikrCounter from "@/components/islamic/DhikrCounter";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

export default function DhikrCounterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <PageLayout 
      title="Digital Tasbih" 
      subtitle="Keep track of your dhikr and remembrance of Allah"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8">
        <DhikrCounter />
        
        {/* Additional Islamic Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="hadith" size="medium" />
          <IslamicEducationFiller type="quote" size="medium" />
        </div>
      </div>
    </PageLayout>
  );
}