import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { useNavigate, useLocation } from "react-router-dom";

export default function ContactTest() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PublicPageLayout 
      title="Contact Test" 
      subtitle="Testing contact page display"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="p-8">
        <h1 className="text-4xl font-bold text-center">Contact Page Test</h1>
        <p className="text-center mt-4">If you can see this, the routing is working.</p>
      </div>
    </PublicPageLayout>
  );
}