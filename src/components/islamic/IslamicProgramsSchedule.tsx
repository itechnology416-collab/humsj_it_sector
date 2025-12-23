import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BookOpen, 
  Clock, 
  User, 
  Calendar,
  Edit,
  Plus,
  Save,
  X,
  CheckCircle,
  Star,
  Users,
  Mic,
  Volume2,
  Heart,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Program {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  instructor: string;
  instructorTitle: string;
  days: string[];
  time: string;
  duration: string;
  language: string;
  category: string;
  level: string;
  color: string;
  icon: string;
}

interface IslamicProgramsScheduleProps {
  className?: string;
}

export function IslamicProgramsSchedule({ className }: IslamicProgramsScheduleProps) {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [programs, setPrograms] = useState<Program[]>([
    {
      id: "1",
      name: "Quran Tafsir Program",
      nameArabic: "برنامج تفسير القرآن",
      description: "In-depth explanation and interpretation of Quranic verses in Afaan Oromo",
      instructor: "Sheikh Nuru Mohammed",
      instructorTitle: "Sheikh",
      days: ["Monday", "Tuesday"],
      time: "After Maghrib",
      duration: "1.5 hours",
      language: "Afaan Oromo",
      category: "Tafsir",
      level: "Intermediate",
      color: "from-green-500 to-emerald-500",
      icon: "📖"
    },
    {
      id: "2",
      name: "Quran Tafsir Program",
      nameArabic: "برنامج تفسير القرآن",
      description: "Comprehensive Quranic interpretation and commentary in Amharic",
      instructor: "Sheikh Nuru Mohammed",
      instructorTitle: "Sheikh",
      days: ["Wednesday", "Thursday"],
      time: "After Maghrib",
      duration: "1.5 hours",
      language: "Amharic",
      category: "Tafsir",
      level: "Intermediate",
      color: "from-blue-500 to-cyan-500",
      icon: "📚"
    },
    {
      id: "3",
      name: "Riyada Qirat Program",
      nameArabic: "برنامج رياضة القراءة",
      description: "Advanced Quranic recitation training and Tajweed practice",
      instructor: "Ustaz Yusuf Usman",
      instructorTitle: "Ustaz",
      days: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      time: "After Maghrib",
      duration: "2 hours",
      language: "Arabic/Amharic",
      category: "Qirat",
      level: "Advanced",
      color: "from-purple-500 to-violet-500",
      icon: "🎵"
    },
    {
      id: "4",
      name: "Quran Tilawa Program",
      nameArabic: "برنامج تلاوة القرآن",
      description: "Beautiful Quranic recitation practice for beginners",
      instructor: "Ustaz Ahmed Ali",
      instructorTitle: "Ustaz",
      days: ["Saturday", "Sunday"],
      time: "After Maghrib",
      duration: "1 hour",
      language: "Arabic",
      category: "Tilawa",
      level: "Beginner",
      color: "from-amber-500 to-yellow-500",
      icon: "🌟"
    },
    {
      id: "5",
      name: "Usul al-Qirat Program",
      nameArabic: "برنامج أصول القراءات",
      description: "Principles and foundations of Quranic readings (Qira'at)",
      instructor: "Sheikh Ibrahim Hassan",
      instructorTitle: "Sheikh",
      days: ["Monday", "Wednesday", "Friday"],
      time: "After Maghrib",
      duration: "1.5 hours",
      language: "Arabic",
      category: "Usul",
      level: "Advanced",
      color: "from-red-500 to-pink-500",
      icon: "📜"
    },
    {
      id: "6",
      name: "Umda Program",
      nameArabic: "برنامج العمدة",
      description: "Classical Islamic text study focusing on fundamental principles",
      instructor: "Sheikh Omar Abdullahi",
      instructorTitle: "Sheikh",
      days: ["Tuesday", "Thursday"],
      time: "After Maghrib",
      duration: "2 hours",
      language: "Arabic/Amharic",
      category: "Classical Texts",
      level: "Intermediate",
      color: "from-teal-500 to-green-500",
      icon: "📋"
    }
  ]);

  const [newProgram, setNewProgram] = useState<Partial<Program>>({
    name: "",
    nameArabic: "",
    description: "",
    instructor: "",
    instructorTitle: "Sheikh",
    days: [],
    time: "After Maghrib",
    duration: "",
    language: "",
    category: "",
    level: "Beginner",
    color: "from-blue-500 to-cyan-500",
    icon: "📖"
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = ["After Fajr", "After Dhuhr", "After Asr", "After Maghrib", "After Isha"];
  const categories = ["Tafsir", "Qirat", "Tilawa", "Usul", "Classical Texts", "Hadith", "Fiqh", "Aqeedah"];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-purple-500 to-violet-500",
    "from-amber-500 to-yellow-500",
    "from-red-500 to-pink-500",
    "from-teal-500 to-green-500"
  ];

  const handleSaveProgram = () => {
    if (editingProgram) {
      setPrograms(programs.map(p => p.id === editingProgram.id ? editingProgram : p));
      toast.success("Program updated successfully!");
    }
    setEditingProgram(null);
    setIsEditing(false);
  };

  const handleAddProgram = () => {
    if (newProgram.name && newProgram.instructor && newProgram.days && newProgram.days.length > 0) {
      const program: Program = {
        ...newProgram as Program,
        id: Date.now().toString()
      };
      setPrograms([...programs, program]);
      setNewProgram({
        name: "",
        nameArabic: "",
        description: "",
        instructor: "",
        instructorTitle: "Sheikh",
        days: [],
        time: "After Maghrib",
        duration: "",
        language: "",
        category: "",
        level: "Beginner",
        color: "from-blue-500 to-cyan-500",
        icon: "📖"
      });
      setIsAddingNew(false);
      toast.success("New program added successfully!");
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const getDayColor = (day: string) => {
    const colors = {
      Monday: "bg-blue-500/20 text-blue-700",
      Tuesday: "bg-green-500/20 text-green-700",
      Wednesday: "bg-purple-500/20 text-purple-700",
      Thursday: "bg-amber-500/20 text-amber-700",
      Friday: "bg-red-500/20 text-red-700",
      Saturday: "bg-teal-500/20 text-teal-700",
      Sunday: "bg-pink-500/20 text-pink-700"
    };
    return colors[day as keyof typeof colors] || "bg-gray-500/20 text-gray-700";
  };

  return (
    <div className={cn("bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-3xl p-8 border border-emerald-500/20", className)}>
      <div className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
            <BookOpen size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-display tracking-wide mb-4">Islamic Programs Schedule</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our comprehensive Islamic education programs designed to deepen your understanding of the Quran and Islamic sciences
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2">
            <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 gap-2">
                  <Plus size={16} />
                  Add Program
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Islamic Program</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Program Name</Label>
                      <Input
                        id="name"
                        value={newProgram.name || ""}
                        onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                        placeholder="e.g., Quran Tafsir Program"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameArabic">Arabic Name</Label>
                      <Input
                        id="nameArabic"
                        value={newProgram.nameArabic || ""}
                        onChange={(e) => setNewProgram({...newProgram, nameArabic: e.target.value})}
                        placeholder="e.g., برنامج تفسير القرآن"
                        className="text-right"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProgram.description || ""}
                      onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                      placeholder="Brief description of the program"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instructor">Instructor</Label>
                      <Input
                        id="instructor"
                        value={newProgram.instructor || ""}
                        onChange={(e) => setNewProgram({...newProgram, instructor: e.target.value})}
                        placeholder="e.g., Sheikh Nuru Mohammed"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructorTitle">Title</Label>
                      <Select value={newProgram.instructorTitle} onValueChange={(value) => setNewProgram({...newProgram, instructorTitle: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sheikh">Sheikh</SelectItem>
                          <SelectItem value="Ustaz">Ustaz</SelectItem>
                          <SelectItem value="Dr.">Dr.</SelectItem>
                          <SelectItem value="Imam">Imam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Select value={newProgram.time} onValueChange={(value) => setNewProgram({...newProgram, time: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(slot => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={newProgram.duration || ""}
                        onChange={(e) => setNewProgram({...newProgram, duration: e.target.value})}
                        placeholder="e.g., 1.5 hours"
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Input
                        id="language"
                        value={newProgram.language || ""}
                        onChange={(e) => setNewProgram({...newProgram, language: e.target.value})}
                        placeholder="e.g., Arabic/Amharic"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newProgram.category} onValueChange={(value) => setNewProgram({...newProgram, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="level">Level</Label>
                      <Select value={newProgram.level} onValueChange={(value) => setNewProgram({...newProgram, level: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Days of Week</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {daysOfWeek.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const days = newProgram.days || [];
                            const newDays = days.includes(day) 
                              ? days.filter(d => d !== day)
                              : [...days, day];
                            setNewProgram({...newProgram, days: newDays});
                          }}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition-all",
                            (newProgram.days || []).includes(day)
                              ? getDayColor(day)
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          )}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProgram}>
                    <Save size={16} className="mr-2" />
                    Add Program
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className={`bg-gradient-to-br ${program.color} p-6 rounded-2xl text-white shadow-lg hover:scale-105 transition-transform duration-300 relative`}>
            {isAdmin && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 text-white hover:bg-white/20"
                onClick={() => {
                  setEditingProgram(program);
                  setIsEditing(true);
                }}
              >
                <Edit size={14} />
              </Button>
            )}
            
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">{program.icon}</span>
              <h3 className="text-xl font-semibold mb-1">{program.name}</h3>
              <p className="text-lg font-arabic opacity-90">{program.nameArabic}</p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm opacity-90">{program.description}</p>
              
              <div className="bg-white/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span className="text-sm">{program.instructorTitle} {program.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span className="text-sm">{program.time} ({program.duration})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 size={14} />
                  <span className="text-sm">{program.language}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {program.days.map(day => (
                  <span key={day} className="bg-white/30 px-2 py-1 rounded-full text-xs">
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="bg-white/30 px-2 py-1 rounded-full text-xs">{program.category}</span>
                <span className="bg-white/30 px-2 py-1 rounded-full text-xs">{program.level}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Program Dialog */}
      {editingProgram && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Program: {editingProgram.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Program Name</Label>
                  <Input
                    id="edit-name"
                    value={editingProgram.name}
                    onChange={(e) => setEditingProgram({...editingProgram, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-nameArabic">Arabic Name</Label>
                  <Input
                    id="edit-nameArabic"
                    value={editingProgram.nameArabic}
                    onChange={(e) => setEditingProgram({...editingProgram, nameArabic: e.target.value})}
                    className="text-right"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProgram.description}
                  onChange={(e) => setEditingProgram({...editingProgram, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-instructor">Instructor</Label>
                  <Input
                    id="edit-instructor"
                    value={editingProgram.instructor}
                    onChange={(e) => setEditingProgram({...editingProgram, instructor: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    value={editingProgram.time}
                    onChange={(e) => setEditingProgram({...editingProgram, time: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProgram}>
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}