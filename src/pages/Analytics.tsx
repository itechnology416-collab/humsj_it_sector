import { useNavigate, useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend
} from 'recharts';

const memberGrowthData = [
  { month: 'Sep', members: 145, newMembers: 15 },
  { month: 'Oct', members: 168, newMembers: 23 },
  { month: 'Nov', members: 185, newMembers: 17 },
  { month: 'Dec', members: 192, newMembers: 7 },
  { month: 'Jan', members: 210, newMembers: 18 },
  { month: 'Feb', members: 234, newMembers: 24 },
];

const eventAttendanceData = [
  { name: 'Friday Prayer', value: 180, color: 'hsl(160, 60%, 28%)' },
  { name: 'Dars/Halaqa', value: 85, color: 'hsl(40, 60%, 50%)' },
  { name: 'Workshops', value: 45, color: 'hsl(40, 70%, 55%)' },
  { name: 'Special Events', value: 120, color: 'hsl(160, 50%, 35%)' },
];

const collegeDistribution = [
  { name: 'Computing', students: 45 },
  { name: 'Business', students: 38 },
  { name: 'Health', students: 32 },
  { name: 'Agriculture', students: 28 },
  { name: 'Engineering', students: 42 },
  { name: 'Law', students: 25 },
  { name: 'Others', students: 24 },
];

const monthlyActivities = [
  { month: 'Sep', events: 8, attendance: 420 },
  { month: 'Oct', events: 12, attendance: 580 },
  { month: 'Nov', events: 10, attendance: 510 },
  { month: 'Dec', events: 6, attendance: 320 },
  { month: 'Jan', events: 14, attendance: 680 },
  { month: 'Feb', events: 11, attendance: 590 },
];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PageLayout 
      title="Analytics" 
      subtitle="Comprehensive analytics and insights for HUMSJ Academic Sector"
      currentPath={location.pathname}
      onNavigate={navigate}
    >
      <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">Last updated: February 15, 2024</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button variant="default" size="sm">
            <Download size={16} />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Members"
          value="234"
          change="+12%"
          changeType="positive"
          icon={Users}
          description="vs last month"
        />
        <MetricCard
          title="Event Attendance"
          value="1,850"
          change="+8%"
          changeType="positive"
          icon={Calendar}
          description="this month"
        />
        <MetricCard
          title="Engagement Rate"
          value="78%"
          change="+5%"
          changeType="positive"
          icon={Activity}
          description="active participation"
        />
        <MetricCard
          title="Content Views"
          value="2.4K"
          change="-3%"
          changeType="negative"
          icon={Target}
          description="total this month"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth Chart */}
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Member Growth</h3>
              <p className="text-sm text-muted-foreground">6-month trend</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                Total Members
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                New Members
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memberGrowthData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 60%, 28%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(160, 60%, 28%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 20%, 88%)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="members" stroke="hsl(160, 60%, 28%)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="newMembers" stroke="hsl(40, 60%, 50%)" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Attendance Pie Chart */}
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Event Attendance</h3>
              <p className="text-sm text-muted-foreground">By event type</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={eventAttendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eventAttendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* College Distribution */}
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Members by College</h3>
              <p className="text-sm text-muted-foreground">Distribution breakdown</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collegeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                <Tooltip />
                <Bar dataKey="students" fill="hsl(160, 60%, 28%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Activities */}
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Monthly Activities</h3>
              <p className="text-sm text-muted-foreground">Events & attendance</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivities}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="events" fill="hsl(160, 60%, 28%)" radius={[4, 4, 0, 0]} name="Events" />
                <Bar yAxisId="right" dataKey="attendance" fill="hsl(40, 60%, 50%)" radius={[4, 4, 0, 0]} name="Attendance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats Table */}
      <div className="bg-card rounded-2xl shadow-soft p-6">
        <h3 className="font-bold text-lg mb-4">Recent Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Metric</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">This Week</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Last Week</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50 hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">New Registrations</td>
                <td className="py-3 px-4 text-right">12</td>
                <td className="py-3 px-4 text-right">8</td>
                <td className="py-3 px-4 text-right text-primary">+50%</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Event Attendance</td>
                <td className="py-3 px-4 text-right">245</td>
                <td className="py-3 px-4 text-right">198</td>
                <td className="py-3 px-4 text-right text-primary">+24%</td>
              </tr>
              <tr className="border-b border-border/50 hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Content Uploads</td>
                <td className="py-3 px-4 text-right">5</td>
                <td className="py-3 px-4 text-right">7</td>
                <td className="py-3 px-4 text-right text-destructive">-29%</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Messages Sent</td>
                <td className="py-3 px-4 text-right">156</td>
                <td className="py-3 px-4 text-right">142</td>
                <td className="py-3 px-4 text-right text-primary">+10%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </PageLayout>
  );
}

function MetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  description 
}: { 
  title: string; 
  value: string; 
  change: string; 
  changeType: "positive" | "negative"; 
  icon: React.ElementType;
  description: string;
}) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-glow transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        <span className={cn(
          "flex items-center gap-1 text-sm font-medium",
          changeType === "positive" ? "text-primary" : "text-destructive"
        )}>
          {changeType === "positive" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </span>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground/70">{description}</p>
    </div>
  );
}
