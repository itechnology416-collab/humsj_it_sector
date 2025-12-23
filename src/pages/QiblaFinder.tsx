import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Compass, 
  MapPin,
  Navigation,
  Locate,
  Info,
  RefreshCw,
  Share2,
  Bookmark,
  Map,
  Globe,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Smartphone,
  Settings,
  Eye,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  accuracy?: number;
}

interface QiblaData {
  direction: number;
  distance: number;
  bearing: string;
}

const KAABA_COORDINATES = {
  latitude: 21.4225,
  longitude: 39.8262
};

export default function QiblaFinder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<QiblaData | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [compassCalibrated, setCompassCalibrated] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Calculate Qibla direction using the great circle method
  const calculateQiblaDirection = (userLat: number, userLng: number): QiblaData => {
    const kaabaLat = KAABA_COORDINATES.latitude;
    const kaabaLng = KAABA_COORDINATES.longitude;

    // Convert degrees to radians
    const lat1 = (userLat * Math.PI) / 180;
    const lat2 = (kaabaLat * Math.PI) / 180;
    const deltaLng = ((kaabaLng - userLng) * Math.PI) / 180;

    // Calculate bearing using great circle formula
    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
    
    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    bearing = (bearing + 360) % 360; // Normalize to 0-360

    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in kilometers
    const dLat = lat2 - lat1;
    const dLng = deltaLng;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Convert bearing to compass direction
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(bearing / 22.5) % 16;
    const compassDirection = directions[index];

    return {
      direction: bearing,
      distance: Math.round(distance),
      bearing: compassDirection
    };
  };

  // Get user's current location
  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setIsLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      // Try to get city/country information (in a real app, you'd use a geocoding service)
      try {
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${locationData.latitude}&longitude=${locationData.longitude}&localityLanguage=en`);
        const geoData = await response.json();
        locationData.city = geoData.city || geoData.locality;
        locationData.country = geoData.countryName;
      } catch (geoError) {
        console.log('Geocoding failed, continuing without city/country info');
      }

      setUserLocation(locationData);
      const qibla = calculateQiblaDirection(locationData.latitude, locationData.longitude);
      setQiblaDirection(qibla);
      setPermissionStatus('granted');
      toast.success("Location found! Qibla direction calculated.");

    } catch (err: GeolocationPositionError) {
      let errorMessage = "Failed to get location";
      
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Location access denied. Please enable location services.";
          setPermissionStatus('denied');
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable.";
          break;
        case err.TIMEOUT:
          errorMessage = "Location request timed out.";
          break;
        default:
          errorMessage = err.message || "Unknown location error";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle device orientation for compass
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceOrientation(event.alpha);
        if (!compassCalibrated) {
          setCompassCalibrated(true);
        }
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [compassCalibrated]);

  // Request device orientation permission (for iOS 13+)
  const requestOrientationPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          toast.success("Compass access granted");
        } else {
          toast.error("Compass access denied");
        }
      } catch (error) {
        toast.error("Failed to request compass permission");
      }
    }
  };

  // Calculate the visual compass direction
  const getCompassDirection = () => {
    if (!qiblaDirection) return 0;
    return qiblaDirection.direction - deviceOrientation;
  };

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return 'text-muted-foreground';
    if (accuracy <= 10) return 'text-green-500';
    if (accuracy <= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getAccuracyText = (accuracy?: number) => {
    if (!accuracy) return 'Unknown';
    if (accuracy <= 10) return 'Excellent';
    if (accuracy <= 50) return 'Good';
    if (accuracy <= 100) return 'Fair';
    return 'Poor';
  };

  return (
    <PageLayout 
      title="Qibla Finder" 
      subtitle="Find the direction to Kaaba for prayer"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-4">
            <Compass size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Prayer Direction</span>
          </div>
          <h1 className="text-4xl font-display tracking-wide mb-4">Qibla Finder</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the accurate direction to the Holy Kaaba in Mecca for your daily prayers. 
            Use your device's GPS and compass for precise Qibla direction.
          </p>
        </div>

        {/* Instructions */}
        {showInstructions && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">How to Use</h3>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Allow location access when prompted</li>
                  <li>• Hold your device flat and level</li>
                  <li>• Point your device in the direction of the green arrow</li>
                  <li>• For best accuracy, calibrate your compass by moving your device in a figure-8 pattern</li>
                  <li>• The red needle points to magnetic north, green arrow points to Qibla</li>
                </ul>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowInstructions(false)}
                  className="mt-3 text-blue-600 hover:text-blue-700"
                >
                  Got it, hide instructions
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Location Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border/30 p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                permissionStatus === 'granted' ? "bg-green-500/20" : "bg-amber-500/20"
              )}>
                <MapPin size={20} className={permissionStatus === 'granted' ? "text-green-500" : "text-amber-500"} />
              </div>
              <div>
                <p className="font-medium">Location Status</p>
                <p className="text-sm text-muted-foreground">
                  {permissionStatus === 'granted' ? 'Located' : 'Not Located'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/30 p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                compassCalibrated ? "bg-green-500/20" : "bg-amber-500/20"
              )}>
                <Compass size={20} className={compassCalibrated ? "text-green-500" : "text-amber-500"} />
              </div>
              <div>
                <p className="font-medium">Compass Status</p>
                <p className="text-sm text-muted-foreground">
                  {compassCalibrated ? 'Calibrated' : 'Needs Calibration'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/30 p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                userLocation?.accuracy ? "bg-green-500/20" : "bg-gray-500/20"
              )}>
                <Target size={20} className={userLocation?.accuracy ? getAccuracyColor(userLocation.accuracy) : "text-gray-500"} />
              </div>
              <div>
                <p className="font-medium">Accuracy</p>
                <p className="text-sm text-muted-foreground">
                  {userLocation?.accuracy ? getAccuracyText(userLocation.accuracy) : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Compass */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Get Location Button */}
            {!userLocation && (
              <div className="text-center">
                <Button
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 gap-2 mb-4"
                  size="lg"
                >
                  {isLoading ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <Locate size={20} />
                  )}
                  {isLoading ? 'Finding Location...' : 'Find My Location'}
                </Button>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}

            {/* Compass Display */}
            {userLocation && qiblaDirection && (
              <div className="relative">
                {/* Compass Circle */}
                <div className="w-80 h-80 rounded-full border-4 border-border bg-card relative overflow-hidden">
                  {/* Compass Background */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                    {/* Degree Markings */}
                    {Array.from({ length: 36 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-6 bg-muted-foreground/30 origin-bottom"
                        style={{
                          left: '50%',
                          bottom: '50%',
                          transform: `translateX(-50%) rotate(${i * 10}deg)`,
                          transformOrigin: '50% 144px'
                        }}
                      />
                    ))}
                    
                    {/* Cardinal Directions */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-bold text-red-500">N</div>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-bold text-muted-foreground">E</div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-bold text-muted-foreground">S</div>
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-bold text-muted-foreground">W</div>
                    
                    {/* Qibla Direction Arrow */}
                    <div
                      className="absolute w-1 h-24 bg-green-500 origin-bottom rounded-full"
                      style={{
                        left: '50%',
                        bottom: '50%',
                        transform: `translateX(-50%) rotate(${getCompassDirection()}deg)`,
                        transformOrigin: '50% 144px'
                      }}
                    >
                      <div className="absolute -top-2 -left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Navigation size={12} className="text-white" />
                      </div>
                    </div>
                    
                    {/* North Arrow */}
                    <div
                      className="absolute w-0.5 h-20 bg-red-500 origin-bottom"
                      style={{
                        left: '50%',
                        bottom: '50%',
                        transform: `translateX(-50%) rotate(${-deviceOrientation}deg)`,
                        transformOrigin: '50% 144px'
                      }}
                    >
                      <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    
                    {/* Center Dot */}
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>

                {/* Compass Info */}
                <div className="mt-6 text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(qiblaDirection.direction)}°
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {qiblaDirection.bearing} • {qiblaDirection.distance.toLocaleString()} km to Kaaba
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Information */}
        {userLocation && (
          <div className="bg-card rounded-xl border border-border/30 p-6">
            <h3 className="font-display text-lg mb-4 flex items-center gap-2">
              <Globe size={20} className="text-primary" />
              Your Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Coordinates</p>
                <p className="text-sm">
                  {userLocation.latitude.toFixed(6)}°, {userLocation.longitude.toFixed(6)}°
                </p>
              </div>
              {userLocation.city && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                  <p className="text-sm">
                    {userLocation.city}{userLocation.country && `, ${userLocation.country}`}
                  </p>
                </div>
              )}
              {userLocation.accuracy && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">GPS Accuracy</p>
                  <p className={cn("text-sm", getAccuracyColor(userLocation.accuracy))}>
                    ±{Math.round(userLocation.accuracy)}m ({getAccuracyText(userLocation.accuracy)})
                  </p>
                </div>
              )}
              {qiblaDirection && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Distance to Kaaba</p>
                  <p className="text-sm">
                    {qiblaDirection.distance.toLocaleString()} kilometers
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {userLocation && qiblaDirection && (
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh Location
            </Button>
            
            <Button
              variant="outline"
              onClick={requestOrientationPermission}
              className="gap-2"
            >
              <Compass size={16} />
              Calibrate Compass
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const text = `Qibla direction from my location: ${Math.round(qiblaDirection.direction)}° (${qiblaDirection.bearing})`;
                navigator.clipboard.writeText(text);
                toast.success("Qibla direction copied to clipboard");
              }}
              className="gap-2"
            >
              <Share2 size={16} />
              Share Direction
            </Button>
            
            <Button
              variant="outline"
              onClick={() => toast.success("Qibla direction bookmarked")}
              className="gap-2"
            >
              <Bookmark size={16} />
              Bookmark
            </Button>
          </div>
        )}

        {/* Tips */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
          <h3 className="font-medium text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
            <Info size={16} />
            Tips for Accurate Qibla Direction
          </h3>
          <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-2">
            <li>• Ensure your device's location services are enabled and accurate</li>
            <li>• Hold your device flat and level for best compass reading</li>
            <li>• Move away from metal objects and electronic devices that may interfere with the compass</li>
            <li>• Calibrate your compass regularly by moving your device in a figure-8 pattern</li>
            <li>• For prayer, face the direction of the green arrow on the compass</li>
            <li>• The accuracy depends on your device's GPS and compass sensors</li>
          </ul>
        </div>

        {/* Islamic Information */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="font-display text-lg mb-3 text-primary">About Qibla</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Qibla is the direction that Muslims face when performing their daily prayers (Salah). 
            It points toward the Kaaba, the sacred cube-shaped building located in the center of the 
            Great Mosque in Mecca, Saudi Arabia. The Kaaba is considered the most sacred site in Islam, 
            and facing it during prayer symbolizes the unity of Muslims worldwide in worship of Allah.
          </p>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-primary font-medium">
              "And wherever you are, turn your faces toward it [the Kaaba]" - Quran 2:150
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}