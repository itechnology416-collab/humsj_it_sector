import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Sep', members: 145 },
  { month: 'Oct', members: 168 },
  { month: 'Nov', members: 185 },
  { month: 'Dec', members: 192 },
  { month: 'Jan', members: 210 },
  { month: 'Feb', members: 234 },
];

export function MemberChart() {
  return (
    <div className="bg-card rounded-2xl shadow-soft p-6 animate-slide-up opacity-0" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg">Member Growth</h3>
          <p className="text-sm text-muted-foreground">Last 6 months performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full gradient-primary" />
          <span className="text-muted-foreground">Active Members</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 60%, 28%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(160, 60%, 28%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 20%, 88%)" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(160, 15%, 40%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(160, 15%, 40%)', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="members" 
              stroke="hsl(160, 60%, 28%)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMembers)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
