# Comprehensive API Documentation for Jama'a Connect Hub

This document provides complete API documentation for all services implemented in the Jama'a Connect Hub application.

## Table of Contents

1. [Admin Dashboard API](#admin-dashboard-api)
2. [Reports API](#reports-api)
3. [Islamic Education API](#islamic-education-api)
4. [System Monitoring API](#system-monitoring-api)
5. [Zakat Calculator API](#zakat-calculator-api)
6. [Halal Marketplace API](#halal-marketplace-api)
7. [API Integration Manager](#api-integration-manager)

---

## Admin Dashboard API

### Overview
Provides comprehensive administrative functionality including dashboard statistics, system alerts, user management, and activity logging.

### Key Features
- Dashboard statistics and metrics
- System alerts management
- Admin user management
- Activity logging and monitoring
- System configuration management

### Main Methods

#### `getDashboardStats()`
Returns comprehensive dashboard statistics.

**Returns:**
```typescript
{
  total_users: number;
  active_users: number;
  new_users_today: number;
  total_events: number;
  upcoming_events: number;
  total_donations: number;
  monthly_donations: number;
  total_courses: number;
  active_enrollments: number;
  system_health: 'healthy' | 'warning' | 'critical';
  last_updated: string;
}
```

#### `getSystemAlerts(includeRead?: boolean)`
Retrieves system alerts with optional filtering.

**Parameters:**
- `includeRead` (optional): Include read alerts in results

**Returns:** `SystemAlert[]`

#### `createSystemAlert(alertData)`
Creates a new system alert.

**Parameters:**
```typescript
{
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  expires_at?: string;
}
```

#### `getRecentActivity(limit?: number)`
Fetches recent admin activity logs.

**Parameters:**
- `limit` (optional): Maximum number of records to return (default: 50)

**Returns:** `RecentActivity[]`

#### `logActivity(activityData)`
Logs an admin activity.

**Parameters:**
```typescript
{
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
}
```

---

## Reports API

### Overview
Comprehensive reporting system with analytics generation, scheduled reports, and various export formats.

### Key Features
- User analytics reports
- Financial analytics
- Event analytics
- Content analytics
- Scheduled and recurring reports
- Multiple export formats (PDF, Excel, CSV, JSON)

### Main Methods

#### `getReports(filters?)`
Retrieves reports with optional filtering.

**Parameters:**
```typescript
{
  type?: string;
  status?: string;
  generated_by?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}
```

**Returns:**
```typescript
{
  reports: Report[];
  total: number;
}
```

#### `createReport(reportData)`
Creates a new report.

**Parameters:**
```typescript
{
  title: string;
  description?: string;
  type: 'user_analytics' | 'financial' | 'event_analytics' | 'content_analytics' | 'system_performance' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  parameters: Record<string, any>;
  scheduled_for?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
}
```

#### `generateUserAnalytics(parameters)`
Generates comprehensive user analytics.

**Returns:**
```typescript
{
  total_users: number;
  active_users: number;
  new_registrations: number;
  user_growth_rate: number;
  demographics: {
    age_groups: Record<string, number>;
    locations: Record<string, number>;
    registration_sources: Record<string, number>;
  };
  engagement_metrics: {
    daily_active_users: number;
    weekly_active_users: number;
    monthly_active_users: number;
    average_session_duration: number;
    bounce_rate: number;
  };
  time_series: AnalyticsData;
}
```

#### `generateFinancialAnalytics(parameters)`
Generates financial analytics including donations and Zakat data.

**Returns:**
```typescript
{
  total_donations: number;
  monthly_donations: number;
  average_donation: number;
  donation_growth_rate: number;
  top_donors: Array<{
    user_id: string;
    full_name?: string;
    total_amount: number;
    donation_count: number;
  }>;
  donation_methods: Record<string, number>;
  donation_categories: Record<string, number>;
  time_series: AnalyticsData;
  zakat_analytics: {
    total_zakat_calculated: number;
    total_zakat_paid: number;
    average_zakat_amount: number;
  };
}
```

---

## Islamic Education API

### Overview
Comprehensive Islamic education system including Tajweed lessons, Hadith study, Quran progress tracking, and spiritual development features.

### Key Features
- Tajweed lessons with progress tracking
- Hadith study and memorization
- Quran reading and memorization progress
- Islamic calendar events
- Prayer time settings
- Fasting tracker
- Spiritual progress analytics

### Main Methods

#### `getTajweedLessons(filters?)`
Retrieves Tajweed lessons with optional filtering.

**Parameters:**
```typescript
{
  level?: 'beginner' | 'intermediate' | 'advanced';
  published_only?: boolean;
  limit?: number;
  offset?: number;
}
```

**Returns:**
```typescript
{
  lessons: TajweedLesson[];
  total: number;
}
```

#### `updateTajweedProgress(lessonId, progressData)`
Updates user's progress on a Tajweed lesson.

**Parameters:**
```typescript
{
  status?: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  progress_percentage?: number;
  time_spent_minutes?: number;
  practice_attempts?: number;
  best_score?: number;
  notes?: string;
}
```

#### `getHadithCollection(filters?)`
Retrieves Hadith collection with filtering options.

**Parameters:**
```typescript
{
  collection?: 'bukhari' | 'muslim' | 'tirmidhi' | 'abu_dawud' | 'nasai' | 'ibn_majah' | 'malik' | 'ahmad';
  topic_tags?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  search?: string;
  limit?: number;
  offset?: number;
}
```

#### `recordQuranStudySession(sessionData)`
Records a Quran study session.

**Parameters:**
```typescript
{
  surah_number: number;
  surah_name: string;
  ayah_from: number;
  ayah_to: number;
  study_type: 'recitation' | 'memorization' | 'translation' | 'tafseer' | 'reflection';
  duration_minutes: number;
  notes?: string;
  reflection?: string;
  difficulty_rating?: number;
}
```

#### `updateQuranProgress(progressData)`
Updates overall Quran reading/memorization progress.

**Parameters:**
```typescript
{
  verses_read?: number;
  verses_memorized?: number;
  current_surah?: number;
  current_ayah?: number;
  daily_goal_verses?: number;
  study_preferences?: {
    preferred_reciter: string;
    translation_language: string;
    study_time_preference: string;
    reminder_enabled: boolean;
  };
}
```

#### `recordFastingDay(fastingData)`
Records a fasting day with details.

**Parameters:**
```typescript
{
  date: string;
  fast_type: 'ramadan' | 'voluntary' | 'makeup' | 'arafah' | 'ashura' | 'monday_thursday';
  status: 'intended' | 'completed' | 'broken' | 'missed';
  suhoor_time?: string;
  iftar_time?: string;
  intention_made?: boolean;
  notes?: string;
  spiritual_reflection?: string;
  energy_level?: number;
  mood_rating?: number;
}
```

---

## System Monitoring API

### Overview
Comprehensive system monitoring with health checks, performance metrics, security events, and automated monitoring tasks.

### Key Features
- Service health monitoring
- Performance metrics tracking
- Security event logging
- System alerts management
- Backup status monitoring
- Automated health checks

### Main Methods

#### `getSystemHealth()`
Retrieves current system health status for all services.

**Returns:** `SystemHealth[]`

#### `updateServiceHealth(serviceName, healthData)`
Updates health status for a specific service.

**Parameters:**
```typescript
{
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  response_time_ms: number;
  uptime_percentage?: number;
  error_message?: string;
  metadata?: Record<string, any>;
}
```

#### `recordSystemMetric(metricData)`
Records a system performance metric.

**Parameters:**
```typescript
{
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  category: 'performance' | 'usage' | 'error' | 'business' | 'security';
  tags?: Record<string, string>;
}
```

#### `getCurrentPerformanceMetrics()`
Gets current system performance metrics.

**Returns:**
```typescript
{
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_io: {
    bytes_in: number;
    bytes_out: number;
  };
  database_connections: number;
  active_sessions: number;
  response_times: {
    avg: number;
    p95: number;
    p99: number;
  };
  error_rate: number;
  throughput: number;
}
```

#### `recordSecurityEvent(eventData)`
Records a security event.

**Parameters:**
```typescript
{
  event_type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'permission_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address: string;
  user_agent: string;
  details: Record<string, any>;
  is_blocked?: boolean;
}
```

---

## Zakat Calculator API

### Overview
Comprehensive Zakat calculation system with wealth tracking, payment recording, reminders, and educational resources.

### Key Features
- Accurate Zakat calculations based on Islamic principles
- Wealth breakdown and deductions tracking
- Payment recording and verification
- Automated reminders
- Nisab rates management
- Educational resources
- Analytics and reporting

### Main Methods

#### `calculateZakat(wealthData)`
Calculates Zakat based on wealth and deductions.

**Parameters:**
```typescript
{
  cash: number;
  bank_savings: number;
  gold: number;
  silver: number;
  investments: number;
  business_assets: number;
  debts_owed_to_you: number;
  other_assets: number;
  personal_debts: number;
  business_debts: number;
  immediate_expenses: number;
  other_deductions: number;
  currency: string;
  gold_in_grams?: boolean;
  silver_in_grams?: boolean;
}
```

**Returns:**
```typescript
{
  total_wealth: number;
  total_deductions: number;
  zakatable_wealth: number;
  nisab_threshold: number;
  zakat_due: number;
  zakat_rate: number;
  is_zakat_due: boolean;
  calculation_breakdown: Record<string, any>;
}
```

#### `saveZakatCalculation(calculationData)`
Saves a Zakat calculation to the database.

**Parameters:**
```typescript
{
  total_wealth: number;
  nisab_threshold: number;
  zakat_due: number;
  currency: string;
  wealth_breakdown: {
    cash: number;
    bank_savings: number;
    gold: number;
    silver: number;
    investments: number;
    business_assets: number;
    debts_owed_to_you: number;
    other_assets: number;
  };
  deductions: {
    personal_debts: number;
    business_debts: number;
    immediate_expenses: number;
    other_deductions: number;
  };
  notes?: string;
}
```

#### `recordZakatPayment(paymentData)`
Records a Zakat payment.

**Parameters:**
```typescript
{
  calculation_id: string;
  amount: number;
  currency: string;
  payment_method: 'cash' | 'bank_transfer' | 'online' | 'check' | 'other';
  recipient_type: 'mosque' | 'charity' | 'individual' | 'organization';
  recipient_name?: string;
  recipient_details?: Record<string, any>;
  payment_date: string;
  reference_number?: string;
  notes?: string;
}
```

#### `getCurrentNisabRates(currency?)`
Gets current Nisab rates for gold and silver.

**Parameters:**
- `currency` (optional): Currency code (default: 'USD')

**Returns:**
```typescript
{
  id: string;
  date: string;
  gold_price_per_gram: number;
  silver_price_per_gram: number;
  gold_nisab_grams: number;
  silver_nisab_grams: number;
  currency: string;
  source: string;
  created_at: string;
}
```

#### `getZakatAnalytics(userId?)`
Gets comprehensive Zakat analytics for a user.

**Returns:**
```typescript
{
  total_calculated: number;
  total_paid: number;
  payment_rate: number;
  average_zakat: number;
  yearly_summary: Array<{
    year: string;
    calculated: number;
    paid: number;
    payment_count: number;
  }>;
  recipient_distribution: Record<string, number>;
  payment_methods: Record<string, number>;
}
```

---

## Halal Marketplace API

### Overview
Complete halal marketplace system with business listings, product catalog, order management, and review system.

### Key Features
- Business directory with verification
- Product catalog with halal certification
- Order management system
- Review and rating system
- Category management
- Search and filtering
- Analytics and reporting

### Main Methods

#### `getBusinesses(filters?)`
Retrieves businesses with optional filtering.

**Parameters:**
```typescript
{
  category_id?: string;
  search?: string;
  is_featured?: boolean;
  verification_status?: string;
  limit?: number;
  offset?: number;
}
```

**Returns:**
```typescript
{
  businesses: MarketplaceBusiness[];
  total: number;
}
```

#### `createBusiness(businessData)`
Creates a new business listing.

**Parameters:**
```typescript
{
  name: string;
  slug: string;
  description?: string;
  category_id?: string;
  logo_url?: string;
  cover_image_url?: string;
  contact_info: Record<string, any>;
  address: Record<string, any>;
  business_hours: Record<string, any>;
  halal_certification: Record<string, any>;
}
```

#### `getProducts(filters?)`
Retrieves products with filtering options.

**Parameters:**
```typescript
{
  business_id?: string;
  category?: string;
  search?: string;
  is_featured?: boolean;
  is_available?: boolean;
  min_price?: number;
  max_price?: number;
  limit?: number;
  offset?: number;
}
```

#### `createOrder(orderData)`
Creates a new marketplace order.

**Parameters:**
```typescript
{
  business_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
    product_name: string;
  }>;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  total_amount: number;
  currency: string;
  delivery_address: Record<string, any>;
  delivery_instructions?: string;
  estimated_delivery?: string;
}
```

#### `searchMarketplace(query, filters?)`
Performs comprehensive marketplace search.

**Parameters:**
```typescript
{
  type?: 'businesses' | 'products' | 'all';
  category_id?: string;
  limit?: number;
}
```

**Returns:**
```typescript
{
  businesses: MarketplaceBusiness[];
  products: MarketplaceProduct[];
  total: number;
}
```

---

## API Integration Manager

### Overview
Central management system for all API services, health monitoring, data synchronization, and bulk operations.

### Key Features
- API service health monitoring
- System integrations management
- Data synchronization jobs
- Bulk data operations
- Rate limiting and throttling
- Automated maintenance tasks

### Main Methods

#### `checkAllApiServices()`
Performs health checks on all API services.

**Returns:** `ApiServiceStatus[]`

#### `getSystemIntegrations()`
Retrieves all system integrations.

**Returns:** `SystemIntegration[]`

#### `createDataSyncJob(jobData)`
Creates a new data synchronization job.

**Parameters:**
```typescript
{
  integration_id: string;
  job_type: 'import' | 'export' | 'sync' | 'backup';
  total_records?: number;
}
```

#### `performBulkDataOperation(operation)`
Performs bulk data operations.

**Parameters:**
```typescript
{
  type: 'export' | 'import' | 'cleanup' | 'migration';
  tables: string[];
  filters?: Record<string, any>;
  options?: Record<string, any>;
}
```

**Returns:**
```typescript
{
  success: boolean;
  message: string;
  records_affected: number;
  file_url?: string;
}
```

#### `getSystemHealthDashboard()`
Gets comprehensive system health dashboard.

**Returns:**
```typescript
{
  overall_status: 'healthy' | 'degraded' | 'critical';
  api_services: ApiServiceStatus[];
  integrations: SystemIntegration[];
  recent_sync_jobs: DataSyncJob[];
  system_metrics: {
    total_api_calls_today: number;
    average_response_time: number;
    error_rate: number;
    active_integrations: number;
  };
}
```

#### `runMaintenanceTasks()`
Runs automated maintenance tasks.

**Returns:**
```typescript
{
  tasks_completed: string[];
  tasks_failed: string[];
  total_duration_ms: number;
}
```

---

## Error Handling

All API methods implement comprehensive error handling:

1. **Input Validation**: Parameters are validated before processing
2. **Database Errors**: Proper handling of database connection and query errors
3. **Authentication**: User authentication and authorization checks
4. **Rate Limiting**: API rate limiting and throttling
5. **Logging**: Comprehensive error logging with context
6. **User-Friendly Messages**: Clear error messages for client applications

### Error Response Format

```typescript
{
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
  }
}
```

## Authentication & Authorization

All APIs use Supabase authentication with role-based access control:

1. **User Authentication**: JWT tokens from Supabase Auth
2. **Role-Based Access**: Different access levels (user, admin, super_admin)
3. **Row Level Security**: Database-level security policies
4. **API Key Authentication**: For external integrations
5. **Rate Limiting**: Per-user and per-API-key rate limits

## Performance Considerations

1. **Caching**: Implement caching for frequently accessed data
2. **Pagination**: All list endpoints support pagination
3. **Indexing**: Proper database indexing for query performance
4. **Connection Pooling**: Database connection pooling
5. **Async Operations**: Long-running operations are handled asynchronously
6. **Monitoring**: Comprehensive performance monitoring and alerting

This API documentation provides a complete reference for all implemented services in the Jama'a Connect Hub application. Each API is designed to be robust, scalable, and maintainable while providing comprehensive functionality for the Islamic community platform.

## Digital Tasbih & Dhikr Tracking API

### Overview
Complete API service for digital dhikr tracking, including sessions, streaks, goals, achievements, and user settings.

### Service: `dhikrApi`

#### Dhikr Types Management

##### `getDhikrTypes(activeOnly?: boolean): Promise<DhikrType[]>`
Retrieve all available dhikr types.

**Parameters:**
- `activeOnly` (optional): Filter for active dhikr types only (default: true)

**Returns:** Array of dhikr types with Arabic text, translations, and metadata

##### `getDhikrTypeById(dhikrTypeId: string): Promise<DhikrType>`
Get specific dhikr type by ID.

#### Dhikr Sessions Management

##### `getTodaySession(dhikrTypeId: string, userId?: string): Promise<DhikrSession | null>`
Get today's dhikr session for a specific dhikr type.

##### `createOrUpdateSession(sessionData, userId?: string): Promise<DhikrSession>`
Create or update a dhikr counting session.

**Session Data:**
```typescript
{
  dhikr_type_id: string;
  count: number;
  target: number;
  session_duration_minutes?: number;
  notes?: string;
  location?: string;
  mood_before?: 'excellent' | 'good' | 'neutral' | 'stressed' | 'sad';
  mood_after?: 'excellent' | 'good' | 'neutral' | 'stressed' | 'sad';
}
```

##### `getUserSessions(userId?: string, filters?): Promise<{sessions: DhikrSession[], total: number}>`
Get user's dhikr sessions with filtering options.

**Filters:**
- `dhikr_type_id`: Filter by specific dhikr type
- `date_from`: Start date filter
- `date_to`: End date filter
- `limit`: Number of results
- `offset`: Pagination offset

#### Dhikr Streaks Management

##### `getUserStreaks(userId?: string): Promise<DhikrStreak[]>`
Get user's current streaks for all dhikr types.

**Features:**
- Automatic streak calculation
- Longest streak tracking
- Streak start date tracking
- Daily goal completion tracking

#### Dhikr Goals Management

##### `getUserGoals(userId?: string, activeOnly?: boolean): Promise<DhikrGoal[]>`
Get user's dhikr goals.

##### `createGoal(goalData, userId?: string): Promise<DhikrGoal>`
Create a new dhikr goal.

**Goal Types:**
- `daily`: Daily dhikr targets
- `weekly`: Weekly dhikr targets
- `monthly`: Monthly dhikr targets
- `custom`: Custom date range goals

#### Dhikr Achievements Management

##### `getUserAchievements(userId?: string): Promise<DhikrAchievement[]>`
Get user's earned achievements.

**Achievement Types:**
- `first_dhikr`: First dhikr completion
- `daily_goal`: Daily goal completion
- `weekly_goal`: Weekly goal completion
- `monthly_goal`: Monthly goal completion
- `streak_milestone`: Streak milestones (7, 30, 100 days)
- `total_count_milestone`: Total count milestones (100, 500, 1000, 5000, 10000)

#### Dhikr Settings Management

##### `getUserSettings(userId?: string): Promise<DhikrSettings>`
Get user's dhikr counter preferences.

##### `updateUserSettings(settings, userId?: string): Promise<DhikrSettings>`
Update user's dhikr counter settings.

**Settings Options:**
- `sound_enabled`: Audio feedback toggle
- `vibration_enabled`: Haptic feedback toggle
- `auto_reset_daily`: Auto-reset counter daily
- `preferred_dhikr_type_id`: Default dhikr type
- `notification_reminders`: Reminder notifications
- `reminder_times`: Array of reminder times
- `theme_preference`: UI theme preference

#### Analytics and Reports

##### `getDhikrAnalytics(userId?: string, dateRange?): Promise<DhikrAnalytics>`
Get comprehensive dhikr analytics.

**Analytics Include:**
- Total dhikr count across all types
- Total sessions completed
- Goals completed count
- Current active streaks
- Favorite dhikr type (most practiced)
- Daily averages over time period
- Category breakdown (tasbih, istighfar, salawat, dua, quran)
- Achievement count

### Database Schema

#### Core Tables
- `dhikr_types`: Predefined dhikr with Arabic text and translations
- `dhikr_sessions`: Daily counting sessions per dhikr type
- `dhikr_streaks`: Streak tracking per user per dhikr type
- `dhikr_goals`: User-defined goals with progress tracking
- `dhikr_achievements`: Achievement system with badges and points
- `dhikr_statistics`: Aggregated statistics for performance
- `dhikr_settings`: User preferences and configuration

#### Key Features
- **Row Level Security (RLS)**: Users can only access their own data
- **Automatic Triggers**: Update timestamps and statistics
- **Performance Indexes**: Optimized queries for large datasets
- **Unique Constraints**: Prevent duplicate sessions per day
- **Achievement System**: Automatic achievement detection
- **Streak Calculation**: Smart streak tracking with break detection

### Integration Features

#### Real-time Updates
- Debounced session updates (1-second delay)
- Automatic statistics recalculation
- Streak updates on goal completion
- Achievement notifications

#### Offline Support
- Local state management for real-time counting
- Sync with database when online
- Conflict resolution for offline changes

#### Gamification
- Achievement badges and points
- Streak milestones
- Progress visualization
- Goal completion celebrations

#### Accessibility
- Sound feedback with customizable tones
- Vibration patterns for different events
- Visual progress indicators
- RTL support for Arabic text

### Usage Example

```typescript
import { dhikrApi } from '@/services/dhikrApi';

// Load dhikr types
const dhikrTypes = await dhikrApi.getDhikrTypes();

// Get today's session
const session = await dhikrApi.getTodaySession(dhikrTypeId);

// Update count
await dhikrApi.createOrUpdateSession({
  dhikr_type_id: dhikrTypeId,
  count: newCount,
  target: dailyGoal
});

// Get user analytics
const analytics = await dhikrApi.getDhikrAnalytics();
```

### Error Handling
- Comprehensive error logging
- User-friendly error messages
- Graceful degradation for offline scenarios
- Automatic retry for failed operations