import { useState, useEffect, useRef, Suspense , useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere, Cylinder, Environment, PerspectiveCamera, Html } from "@react-three/drei";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  VolumeX,
  Compass,
  Clock,
  BookOpen,
  Users,
  Heart,
  Star,
  Camera,
  Settings,
  Info
} from "lucide-react";
import * as THREE from "three";

// 3D Mosque Component
function MosqueStructure({ position = [0, 0, 0] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main Building Base */}
      <Box args={[8, 4, 8]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#f4f1e8" />
      </Box>
      
      {/* Dome */}
      <Sphere args={[3, 32, 16]} position={[0, 6.5, 0]}>
        <meshStandardMaterial color="#4a9eff" metalness={0.3} roughness={0.2} />
      </Sphere>
      
      {/* Minaret */}
      <Cylinder args={[0.5, 0.5, 12]} position={[6, 6, 6]}>
        <meshStandardMaterial color="#f4f1e8" />
      </Cylinder>
      
      {/* Minaret Top */}
      <Sphere args={[0.8, 16, 8]} position={[6, 12.5, 6]}>
        <meshStandardMaterial color="#4a9eff" metalness={0.3} roughness={0.2} />
      </Sphere>
      
      {/* Entrance Arch */}
      <Box args={[2, 3, 0.5]} position={[0, 1.5, 4.25]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      
      {/* Windows */}
      {[-2, 2].map((x, i) => (
        <Box key={i} args={[1, 1.5, 0.2]} position={[x, 3, 4.1]}>
          <meshStandardMaterial color="#4a9eff" transparent opacity={0.7} />
        </Box>
      ))}
      
      {/* Islamic Geometric Patterns */}
      <Text
        position={[0, 5, 4.5]}
        fontSize={0.5}
        color="#d4af37"
        anchorX="center"
        anchorY="middle"
      >
        ﷲ
      </Text>
      
      {/* Prayer Hall Interior Indication */}
      <Box args={[6, 0.1, 6]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
    </group>
  );
}

// Floating Islamic Calligraphy
function FloatingCalligraphy() {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 + 8;
      textRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={textRef}>
      <Text
        fontSize={1}
        color="#d4af37"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </Text>
    </group>
  );
}

// Interactive Hotspots
function InteractiveHotspot({ position, label, onClick }: { position: [number, number, number], label: string, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <Sphere 
        args={[0.3]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial 
          color={hovered ? "#d4af37" : "#4a9eff"} 
          emissive={hovered ? "#d4af37" : "#4a9eff"}
          emissiveIntensity={0.3}
        />
      </Sphere>
      {hovered && (
        <Html>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Main 3D Scene
function MosqueScene({ selectedHotspot, onHotspotClick }: { selectedHotspot: string | null, onHotspotClick: (spot: string) => void }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[10, 8, 10]} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#d4af37" />
      
      <Environment preset="sunset" />
      
      <MosqueStructure />
      <FloatingCalligraphy />
      
      {/* Interactive Hotspots */}
      <InteractiveHotspot 
        position={[0, 1, 4]} 
        label="Main Entrance" 
        onClick={() => onHotspotClick('entrance')}
      />
      <InteractiveHotspot 
        position={[0, 2, 0]} 
        label="Prayer Hall" 
        onClick={() => onHotspotClick('prayer-hall')}
      />
      <InteractiveHotspot 
        position={[6, 6, 6]} 
        label="Minaret" 
        onClick={() => onHotspotClick('minaret')}
      />
      <InteractiveHotspot 
        position={[0, 6.5, 0]} 
        label="Main Dome" 
        onClick={() => onHotspotClick('dome')}
      />
      
      {/* Ground */}
      <Box args={[50, 0.1, 50]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#90EE90" />
      </Box>
    </>
  );
}

const VirtualMosque = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("explore");

  const hotspotInfo = {
    'entrance': {
      title: 'Main Entrance',
      description: 'The welcoming entrance to the mosque, designed with traditional Islamic architecture featuring beautiful arches and calligraphy.',
      significance: 'Enter with your right foot and recite the dua for entering the mosque.',
      dua: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ'
    },
    'prayer-hall': {
      title: 'Prayer Hall (Musalla)',
      description: 'The main prayer area where Muslims gather for daily prayers and Friday congregational prayer.',
      significance: 'Face the Qibla (direction of Mecca) during prayer. Remove shoes before entering.',
      capacity: 'Accommodates up to 500 worshippers'
    },
    'minaret': {
      title: 'Minaret',
      description: 'The tall tower from which the call to prayer (Adhan) is announced five times daily.',
      significance: 'Symbolizes the call to worship and serves as a landmark for the Muslim community.',
      height: '45 meters tall'
    },
    'dome': {
      title: 'Main Dome',
      description: 'The central dome representing the vault of heaven and Islamic architectural excellence.',
      significance: 'Provides excellent acoustics for recitation and creates a sense of spiritual elevation.',
      features: 'Decorated with Islamic geometric patterns and calligraphy'
    }
  };

  const handleHotspotClick = (spot: string) => {
    setSelectedHotspot(spot);
    setActiveTab("info");
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <PublicPageLayout
      title="Virtual Mosque Experience"
      subtitle="Explore Islamic architecture and learn about mosque etiquette in 3D"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={isPlaying ? "default" : "outline"}
                  size="sm"
                  onClick={toggleAudio}
                  className="gap-2"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  {isPlaying ? "Pause Tour" : "Start Audio Tour"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMute}
                  className="gap-2"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Users size={12} />
                  Virtual Visitors: 1,247
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock size={12} />
                  Next Prayer: Maghrib 6:20 PM
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main 3D Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Canvas */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="h-[600px] bg-gradient-to-b from-sky-200 to-sky-100">
                <Canvas shadows>
                  <Suspense fallback={
                    <Html center>
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading Virtual Mosque...</p>
                      </div>
                    </Html>
                  }>
                    <MosqueScene 
                      selectedHotspot={selectedHotspot}
                      onHotspotClick={handleHotspotClick}
                    />
                  </Suspense>
                </Canvas>
              </div>
            </Card>
          </div>

          {/* Information Panel */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="explore">Explore</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="learn">Learn</TabsTrigger>
              </TabsList>

              <TabsContent value="explore" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Compass size={20} />
                      Navigation Guide
                    </CardTitle>
                    <CardDescription>
                      Click and drag to rotate, scroll to zoom, click hotspots to learn more
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Camera size={14} />
                        Screenshot
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <RotateCcw size={14} />
                        Reset View
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Interactive Areas:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span>Main Entrance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span>Prayer Hall</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span>Minaret</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span>Main Dome</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info" className="space-y-4">
                {selectedHotspot && hotspotInfo[selectedHotspot as keyof typeof hotspotInfo] ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info size={20} />
                        {hotspotInfo[selectedHotspot as keyof typeof hotspotInfo].title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {hotspotInfo[selectedHotspot as keyof typeof hotspotInfo].description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Significance:</h4>
                        <p className="text-sm">
                          {hotspotInfo[selectedHotspot as keyof typeof hotspotInfo].significance}
                        </p>
                      </div>
                      
                      {'dua' in hotspotInfo[selectedHotspot as keyof typeof hotspotInfo] && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Dua:</h4>
                          <p className="text-lg font-arabic text-right bg-muted p-2 rounded">
                            {(hotspotInfo[selectedHotspot as keyof typeof hotspotInfo] as unknown).dua}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Info size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Click on a blue hotspot in the 3D scene to learn more about that area
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="learn" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen size={20} />
                      Mosque Etiquette
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Before Entering:</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Remove shoes</li>
                        <li>• Perform ablution (Wudu)</li>
                        <li>• Dress modestly</li>
                        <li>• Enter with right foot</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Inside the Mosque:</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Maintain silence</li>
                        <li>• Face the Qibla for prayer</li>
                        <li>• Respect prayer times</li>
                        <li>• Keep the space clean</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart size={20} />
                      Spiritual Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <Star size={14} className="mt-0.5 text-yellow-500" />
                        <span>Community worship strengthens faith</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star size={14} className="mt-0.5 text-yellow-500" />
                        <span>Peaceful environment for reflection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star size={14} className="mt-0.5 text-yellow-500" />
                        <span>Connection with Islamic heritage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star size={14} className="mt-0.5 text-yellow-500" />
                        <span>Spiritual purification and growth</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prayer Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fajr</span>
                  <span className="font-mono">5:30 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Dhuhr</span>
                  <span className="font-mono">12:45 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Asr</span>
                  <span className="font-mono">3:20 PM</span>
                </div>
                <div className="flex justify-between font-semibold text-primary">
                  <span>Maghrib</span>
                  <span className="font-mono">6:20 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Isha</span>
                  <span className="font-mono">7:45 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Virtual Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-muted rounded">
                  <p className="font-medium">Friday Khutbah</p>
                  <p className="text-muted-foreground">Live Stream - 12:30 PM</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="font-medium">Quran Study Circle</p>
                  <p className="text-muted-foreground">Tonight - 8:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Online Now</span>
                  <Badge variant="secondary">247</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Today's Visitors</span>
                  <Badge variant="secondary">1,247</Badge>
                </div>
                <Button size="sm" className="w-full mt-2">
                  Join Community Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default VirtualMosque;