import { useEffect } from 'react';
import IslamicResources from '@/components/islamic/IslamicResourcesHub';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function IslamicResourcesHubPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Islamic Resources Hub | Jama\'a Connect';
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Islamic Resources Hub</h1>
      </div>
      
      <IslamicResources />
    </div>
  );
}
