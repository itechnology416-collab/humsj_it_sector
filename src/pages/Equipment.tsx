import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Monitor, 
  Plus, 
  Search,
  Filter,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Laptop,
  Smartphone,
  Server,
  Wifi,
  HardDrive,
  Printer,
  Camera,
  Headphones,
  Save,
  Loader2,
  QrCode,
  MapPin,
  Calendar,
  User,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Equipment {
  id: string;
  name: string;
  category: string;
  model: string;
  serial_number: string;
  status: "available" | "in_use" | "maintenance" | "damaged" | "retired";
  condition: "excellent" | "good" | "fair" | "poor";
  location: string;
  assigned_to?: string;
  purchase_date: string;
  warranty_expiry?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  purchase_price: number;
  current_value: number;
  notes?: string;
  created_at: string;
}

const mockEquipment: Equipment[] = [
  {
    id: "1",
    name: "Dell OptiPlex 7090",
    category: "Desktop Computer",
    model: "OptiPlex 7090",
    serial_number: "DL7090001",
    status: "in_use",
    condition: "excellent",
    location: "Computer Lab A",
    assigned_to: "Ahmed Hassan",
    purchase_date: "2023-09-15",
    warranty_expiry: "2026-09-15",
    last_maintenance: "2024-01-15",
    next_maintenance: "2024-07-15",
    purchase_price: 850,
    current_value: 680,
    notes: "Primary development workstation",
    created_at: "2023-09-15"
  },
  {
    id: "2",
    name: "MacBook Pro 16\"",
    category: "Laptop",
    model: "MacBook Pro M2",
    serial_number: "MBP16M2001",
    status: "available",
    condition: "good",
    location: "IT Storage",
    purchase_date: "2023-11-20",
    warranty_expiry: "2026-11-20",
    purchase_price: 2499,
    current_value: 2100,
    notes: "For mobile development projects",
    created_at: "2023-11-20"
  },
  {
    id: "3",
    name: "HP LaserJet Pro",
    category: "Printer",
    model: "LaserJet Pro 4025n",
    serial_number: "HP4025001",
    status: "maintenance",
    condition: "fair",
    location: "Office Floor 2",
    purchase_date: "2022-03-10",
    warranty_expiry: "2025-03-10",
    last_maintenance: "2024-02-20",
    next_maintenance: "2024-05-20",
    purchase_price: 450,
    current_value: 280,
    notes: "Paper jam issue - under repair",
    created_at: "2022-03-10"
  },
  {
    id: "4",
    name: "Cisco Switch 24-Port",
    category: "Network Equipment",
    model: "Catalyst 2960-X",
    serial_number: "CS2960X001",
    status: "in_use",
    condition: "excellent",
    location: "Server Room",
    purchase_date: "2023-06-05",
    warranty_expiry: "2028-06-05",
    last_maintenance: "2024-01-10",
    next_maintenance: "2024-07-10",
    purchase_price: 1200,
    current_value: 1000,
    notes: "Main network switch for building",
    created_at: "2023-06-05"
  }
];

const categories = [
  "All Categories",
  "Desktop Computer",
  "Laptop", 
  "Server",
  "Network Equipment",
  "Printer",
  "Monitor",
  "Mobile Device",
  "Audio/Video",
  "Storage Device",
  "Accessories"
];

const statusConfig = {
  available: { label: "Available", color: "bg-green-500/20 text-green-400", icon: CheckCircle },
  in_use: { label: "In Use", color: "bg-blue-500/20 text-blue-400", icon: User },
  maintenance: { label: "Maintenance", color: "bg-yellow-500/20 text-yellow-400", icon: Wrench },
  damaged: { label: "Damaged", color: "bg-red-500/20 text-red-400", icon: AlertTriangle },
  retired: { label: "Retired", color: "bg-gray-500/20 text-gray-400", icon: Clock }
};

const conditionConfig = {
  excellent: { label: "Excellent", color: "bg-green-500/20 text-green-400" },
  good: { label: "Good", color: "bg-blue-500/20 text-blue-400" },
  fair: { label: "Fair", color: "bg-yellow-500/20 text-yellow-400" },
  poor: { label: "Poor", color: "bg-red-500/20 text-red-400" }
};

const categoryIcons: Record<string, React.ElementType> = {
  "Desktop Computer": Monitor,
  "Laptop": Laptop,
  "Server": Server,
  "Network Equipment": Wifi,
  "Printer": Printer,
  "Monitor": Monitor,
  "Mobile Device": Smartphone,
  "Audio/Video": Camera,
  "Storage Device": HardDrive,
  "Accessories": Headphones
};

export default function EquipmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    category: "",
    model: "",
    serial_number: "",
    location: "",
    purchase_date: "",
    warranty_expiry: "",
    purchase_price: "",
    notes: ""
  });

  const filteredEquipment = equipment.filter(item => {
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleCreateEquipment = async () => {
    if (!newEquipment.name || !newEquipment.category || !newEquipment.model) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const equipmentItem: Equipment = {
        id: Date.now().toString(),
        name: newEquipment.name,
        category: newEquipment.category,
        model: newEquipment.model,
        serial_number: newEquipment.serial_number,
        status: "available",
        condition: "excellent",
        location: newEquipment.location,
        purchase_date: newEquipment.purchase_date,
        warranty_expiry: newEquipment.warranty_expiry || undefined,
        purchase_price: parseFloat(newEquipment.purchase_price) || 0,
        current_value: parseFloat(newEquipment.purchase_price) || 0,
        notes: newEquipment.notes || undefined,
        created_at: new Date().toISOString()
      };

      setEquipment([equipmentItem, ...equipment]);
      toast.success("Equipment added successfully!");
      
      setNewEquipment({
        name: "",
        category: "",
        model: "",
        serial_number: "",
        location: "",
        purchase_date: "",
        warranty_expiry: "",
        purchase_price: "",
        notes: ""
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Failed to add equipment");
    } finally {
      setIsCreating(false);
    }
  };

  const stats = {
    total: equipment.length,
    available: equipment.filter(e => e.status === "available").length,
    inUse: equipment.filter(e => e.status === "in_use").length,
    maintenance: equipment.filter(e => e.status === "maintenance").length,
    totalValue: equipment.reduce((acc, e) => acc + e.current_value, 0)
  };

  return (
    <PageLayout 
      title="Equipment & Inventory" 
      subtitle="Manage IT equipment and track inventory"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <User size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inUse}</p>
                <p className="text-xs text-muted-foreground">In Use</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Wrench size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.maintenance}</p>
                <p className="text-xs text-muted-foreground">Maintenance</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary text-sm outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 shadow-red gap-2">
                  <Plus size={18} />
                  Add Equipment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Equipment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Equipment Name *</Label>
                      <Input
                        id="name"
                        value={newEquipment.name}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Dell OptiPlex 7090"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newEquipment.category} onValueChange={(value) => setNewEquipment(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        value={newEquipment.model}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, model: e.target.value }))}
                        placeholder="OptiPlex 7090"
                      />
                    </div>
                    <div>
                      <Label htmlFor="serial_number">Serial Number</Label>
                      <Input
                        id="serial_number"
                        value={newEquipment.serial_number}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, serial_number: e.target.value }))}
                        placeholder="DL7090001"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newEquipment.location}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Computer Lab A"
                      />
                    </div>
                    <div>
                      <Label htmlFor="purchase_price">Purchase Price ($)</Label>
                      <Input
                        id="purchase_price"
                        type="number"
                        value={newEquipment.purchase_price}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, purchase_price: e.target.value }))}
                        placeholder="850"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="purchase_date">Purchase Date</Label>
                      <Input
                        id="purchase_date"
                        type="date"
                        value={newEquipment.purchase_date}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, purchase_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="warranty_expiry">Warranty Expiry</Label>
                      <Input
                        id="warranty_expiry"
                        type="date"
                        value={newEquipment.warranty_expiry}
                        onChange={(e) => setNewEquipment(prev => ({ ...prev, warranty_expiry: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newEquipment.notes}
                      onChange={(e) => setNewEquipment(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes about the equipment..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleCreateEquipment} 
                      disabled={isCreating}
                      className="flex-1 bg-primary hover:bg-primary/90 shadow-red"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 size={16} className="animate-spin mr-2" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Add Equipment
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateModalOpen(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEquipment.map((item, index) => (
            <EquipmentCard key={item.id} equipment={item} delay={index * 100} />
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-display mb-2">No Equipment Found</h3>
            <p className="text-muted-foreground">No equipment matches your current filters.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function EquipmentCard({ equipment, delay }: { equipment: Equipment; delay: number }) {
  const status = statusConfig[equipment.status];
  const condition = conditionConfig[equipment.condition];
  const StatusIcon = status.icon;
  const CategoryIcon = categoryIcons[equipment.category] || Package;

  const isWarrantyExpiring = equipment.warranty_expiry && 
    new Date(equipment.warranty_expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div 
      className="bg-card rounded-xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-500 hover:scale-105 animate-slide-up opacity-0 group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <CategoryIcon size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{equipment.name}</h3>
            <p className="text-sm text-muted-foreground">{equipment.model}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", status.color)}>
            <StatusIcon size={12} className="inline mr-1" />
            {status.label}
          </span>
          <span className={cn("text-xs px-2 py-1 rounded-full font-medium", condition.color)}>
            {condition.label}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <QrCode size={14} />
            Serial:
          </span>
          <span className="font-mono text-xs">{equipment.serial_number}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <MapPin size={14} />
            Location:
          </span>
          <span>{equipment.location}</span>
        </div>

        {equipment.assigned_to && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <User size={14} />
              Assigned:
            </span>
            <span>{equipment.assigned_to}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Value:</span>
          <span className="font-semibold">${equipment.current_value.toLocaleString()}</span>
        </div>

        {equipment.warranty_expiry && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar size={14} />
              Warranty:
            </span>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              isWarrantyExpiring ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
            )}>
              {new Date(equipment.warranty_expiry).toLocaleDateString()}
              {isWarrantyExpiring && <AlertCircle size={12} className="inline ml-1" />}
            </span>
          </div>
        )}

        {equipment.notes && (
          <div className="pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground leading-relaxed">{equipment.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}