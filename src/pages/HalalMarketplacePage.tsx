import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import HalalMarketplace from "@/components/islamic/HalalMarketplace";
import IslamicEducationFiller from "@/components/islamic/IslamicEducationFiller";

export default function HalalMarketplacePage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <PageLayout 
      title="Halal Marketplace" 
      subtitle="Discover halal businesses and services in your community"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8">
        <HalalMarketplace />
        
        {/* Additional Islamic Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IslamicEducationFiller type="hadith" size="medium" />
          <IslamicEducationFiller type="tip" size="medium" />
        </div>
      </div>
    </PageLayout>
  );
}