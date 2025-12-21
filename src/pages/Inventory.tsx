import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Package, 
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  RefreshCw,
  Laptop,
  Book,
  Wrench,
  Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface InventoryItem {
  id: string;
  name: string;
  category: 'electronics' | 'books' | 'furniture' | 'tools' | 'supplies' | 'other';
  description?: string;
  serialNumber?: string;
  model?: string;
  brand?: string;
  quantity: number;
  availableQuantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  location: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warranty?: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'retired';
  borrowedBy?: string;
  borrowedDate?: string;
  returnDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface BorrowRecord {
  id: string;
  itemId: string;
  itemName: string;
  borrowerId: string;
  borrowerName: string;
  borrowerEmail: string;
  quantity: number;
  borrowedDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  notes?: string;
}

// Mock inventory data
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    category: 'electronics',
    description: 'High-performance laptop for development work',
    serialNumber: 'MBP2023001',
    model: 'MacBook Pro 16-inch',
    brand: 'Apple',
    quantity: 5,
    availableQuantity: 3,
    condition: 'excellent',
    location: 'IT Office - Cabinet A',
    purchaseDate: '2023-09-15',
    purchasePrice: 2500,
    warranty: '2026-09-15',
    status: 'available',
    createdAt: '2023-09-15T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z'
  },
  {
    id: '2',
    name: 'Programming Books Collection',
    category: 'books',
    description: 'Collection of programming and Islamic tech books',
    quantity: 50,
    availableQuantity: 42,
    condition: 'good',
    location: 'Library - Section B',
    purchaseDate: '2023-10-01',
    purchasePrice: 1200,
    status: 'available',
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z'
  },
  {
    id: '3',
    name: 'Projector - Epson',
    category: 'electronics',
    description: 'HD projector for presentations and workshops',
    serialNumber: 'EP2023005',
    model: 'EpsonPro X500',
    brand: 'Epson',
    quantity: 2,
    availableQuantity: 1,
    condition: 'good',
    location: 'Conference Room',
    purchaseDate: '2023-08-20',
    purchasePrice: 800,
    warranty: '2025-08-20',
    status: 'borrowed',
    borrowedBy: 'Ahmed Hassan',
    borrowedDate: '2024-12-18',
    returnDate: '2024-12-25',
    createdAt: '2023-08-20T00:00:00Z',
    updatedAt: '2024-12-18T00:00:00Z'
  },
  {
    id: '4',
    name: 'Office Chairs',
    category: 'furniture',
    description: 'Ergonomic office chairs for workspace',
    quantity: 20,
    availableQuantity: 18,
    condition: 'good',
    location: 'Storage Room A',
    purchaseDate: '2023-07-10',
    purchasePrice: 150,
    status: 'available',
    createdAt: '2023-07-10T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z'
  }
];

const mockBorrowRecords: BorrowRecord[] = [
  {
    id: '1',
    itemId: '3',
    itemName: 'Projector - Epson',
    borrowerId: 'user1',
    borrowerName: 'Ahmed Hassan',
    borrowerEmail: 'ahmed@hu.edu.et',
    quantity: 1,
    borrowedDate: '2024-12-18',
    expectedReturnDate: '2024-12-25',
    status: 'active',
    notes: 'For workshop presentation'
  },
  {
    id: '2',
    itemId: '1',
    itemName: 'MacBook Pro 16"',
    borrowerId: 'user2',
    borrowerName: 'Fatima Ali',
    borrowerEmail: 'fatima@hu.edu.et',
    quantity: 1,
    borrowedDate: '2024-12-15',
    expectedReturnDate: '2024-12-22',
    actualReturnDate: '2024-12-21',
    status: 'returned'
  }
];

const categoryIcons = {
  electronics: Laptop,
  books: Book,
  furniture: Package,
  tools: Wrench,
  supplies: Package,
  other: Package
};

const categoryColors = {
  electronics: "bg-blue-500/20 text-blue-600",
  books: "bg-green-500/20 text-green-600",
  furniture: "bg-purple-500/20 text-purple-600",
  tools: "bg-orange-500/20 text-orange-600",
  supplies: "bg-pink-500/20 text-pink-600",
  other: "bg-gray-500/20 text-gray-600"
};

const conditionColors = {
  excellent: "bg-green-500/20 text-green-600",
  good: "bg-blue-500/20 text-blue-600",
  fair: "bg-yellow-500/20 text-yellow-600",
  poor: "bg-orange-500/20 text-orange-600",
  damaged: "bg-red-500/20 text-red-600"
};

const statusColors = {
  available: "bg-green-500/20 text-green-600",
  borrowed: "bg-yellow-500/20 text-yellow-600",
  maintenance: "bg-orange-500/20 text-orange-600",
  retired: "bg-red-500/20 text-red-600"
};

export default function InventoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(mockBorrowRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect non-admins for management functions
  const canManage = isAdmin;

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getInventoryStats = () => {
    const total = inventoryItems.length;
    const available = inventoryItems.filter(item => item.status === 'available').length;
    const borrowed = inventoryItems.filter(item => item.status === 'borrowed').length;
    const maintenance = inventoryItems.filter(item => item.status === 'maintenance').length;
    const lowStock = inventoryItems.filter(item => item.availableQuantity <= 2).length;
    
    return { total, available, borrowed, maintenance, lowStock };
  };

  const stats = getInventoryStats();

  const handleBorrowItem = (item: InventoryItem) => {
    if (item.availableQuantity <= 0) {
      toast.error('Item not available for borrowing');
      return;
    }
    
    // In a real app, this would open a borrow dialog
    toast.success('Borrow functionality would be implemented here');
  };

  const handleReturnItem = (recordId: string) => {
    setBorrowRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: 'returned' as const, actualReturnDate: new Date().toISOString() }
        : record
    ));
    
    // Update inventory availability
    const record = borrowRecords.find(r => r.id === recordId);
    if (record) {
      setInventoryItems(prev => prev.map(item => 
        item.id === record.itemId 
          ? { ...item, availableQuantity: item.availableQuantity + record.quantity, status: 'available' as const }
          : item
      ));
    }
    
    toast.success('Item returned successfully');
  };

  return (
    <PageLayout 
      title="Inventory Management" 
      subtitle="Track and manage IT equipment, books, and resources"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-green-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.available}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.borrowed}</p>
                <p className="text-sm text-muted-foreground">Borrowed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-orange-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.maintenance}</p>
                <p className="text-sm text-muted-foreground">Maintenance</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border/30 hover:border-red-500/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{stats.lowStock}</p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="books">Books</option>
              <option value="furniture">Furniture</option>
              <option value="tools">Tools</option>
              <option value="supplies">Supplies</option>
              <option value="other">Other</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export
            </Button>
            {canManage && (
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 shadow-red" size="sm">
                    <Plus size={16} className="mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Item Name</Label>
                      <Input id="name" placeholder="Enter item name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                        <option value="electronics">Electronics</option>
                        <option value="books">Books</option>
                        <option value="furniture">Furniture</option>
                        <option value="tools">Tools</option>
                        <option value="supplies">Supplies</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" placeholder="Enter description" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Storage location" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      toast.success('Item added successfully (Mock)');
                      setIsAddModalOpen(false);
                    }}>
                      Add Item
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => {
            const CategoryIcon = categoryIcons[item.category];
            
            return (
              <div 
                key={item.id}
                className="bg-card rounded-xl p-5 border border-border/30 hover:border-primary/50 hover:shadow-red transition-all duration-300 hover:-translate-y-1 animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <CategoryIcon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.brand} {item.model}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <Eye size={14} />
                    </Button>
                    {canManage && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge className={cn("text-xs", categoryColors[item.category])}>
                      {item.category}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={cn("text-xs", statusColors[item.status])}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available:</span>
                    <span className={cn(
                      "font-semibold",
                      item.availableQuantity <= 2 ? "text-red-500" : "text-green-500"
                    )}>
                      {item.availableQuantity}/{item.quantity}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Condition:</span>
                    <Badge className={cn("text-xs", conditionColors[item.condition])}>
                      {item.condition}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-xs">{item.location}</span>
                  </div>
                </div>

                {item.status === 'borrowed' && item.borrowedBy && (
                  <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center gap-2 text-xs text-yellow-600">
                      <User size={12} />
                      <span>Borrowed by {item.borrowedBy}</span>
                    </div>
                    {item.returnDate && (
                      <div className="flex items-center gap-2 text-xs text-yellow-600 mt-1">
                        <Calendar size={12} />
                        <span>Return: {new Date(item.returnDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {item.status === 'available' && item.availableQuantity > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleBorrowItem(item)}
                    >
                      Borrow
                    </Button>
                  )}
                  {canManage && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => toast.success('Edit functionality would be implemented')}
                    >
                      Manage
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No inventory items found matching your criteria.</p>
          </div>
        )}

        {/* Item Details Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Item Details</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <Badge className={cn("text-xs", categoryColors[selectedItem.category])}>
                      {selectedItem.category}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Serial Number</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.serialNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Brand/Model</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.brand} {selectedItem.model}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Quantity</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.availableQuantity}/{selectedItem.quantity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Condition</Label>
                    <Badge className={cn("text-xs", conditionColors[selectedItem.condition])}>
                      {selectedItem.condition}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={cn("text-xs", statusColors[selectedItem.status])}>
                      {selectedItem.status}
                    </Badge>
                  </div>
                </div>
                {selectedItem.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                  </div>
                )}
                {selectedItem.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}