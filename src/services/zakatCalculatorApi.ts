import { supabase } from '@/integrations/supabase/client';
import { errorHandler, ErrorCategory, ErrorSeverity } from './errorHandler';
import { analyticsApi } from './analyticsApi';

// Type assertion helper for zakat tables
const zakatSupabase = supabase as unknown as typeof supabase;

export interface ZakatCalculation {
  id: string;
  user_id: string;
  calculation_date: string;
  hijri_year: string;
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
  payment_status: 'calculated' | 'paid' | 'partially_paid' | 'overdue';
  payment_date?: string;
  payment_amount?: number;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ZakatPayment {
  id: string;
  calculation_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: 'cash' | 'bank_transfer' | 'online' | 'check' | 'other';
  recipient_type: 'mosque' | 'charity' | 'individual' | 'organization';
  recipient_name?: string;
  recipient_details?: Record<string, unknown>;
  payment_date: string;
  reference_number?: string;
  receipt_url?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  calculation?: ZakatCalculation;
}

export interface ZakatReminder {
  id: string;
  user_id: string;
  reminder_type: 'annual_calculation' | 'payment_due' | 'payment_overdue' | 'custom';
  title: string;
  message: string;
  scheduled_date: string;
  is_recurring: boolean;
  recurrence_pattern?: 'yearly' | 'monthly' | 'custom';
  is_sent: boolean;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ZakatEducation {
  id: string;
  title: string;
  content: string;
  category: 'basics' | 'calculation' | 'recipients' | 'rulings' | 'faqs';
  language: string;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface NisabRates {
  id: string;
  date: string;
  gold_price_per_gram: number;
  silver_price_per_gram: number;
  gold_nisab_grams: number; // 85 grams
  silver_nisab_grams: number; // 595 grams
  currency: string;
  source: string;
  created_at: string;
}

export interface ZakatRecipient {
  id: string;
  name: string;
  type: 'mosque' | 'charity' | 'organization' | 'individual';
  description?: string;
  contact_info: Record<string, unknown>;
  verification_status: 'verified' | 'pending' | 'rejected';
  is_featured: boolean;
  total_received?: number;
  created_at: string;
  updated_at: string;
}

class ZakatCalculatorApiService {
  // Zakat Calculations
  async calculateZakat(wealthData: {
    cash: number;
    bank_savings: number;
    gold: number; // in grams or currency value
    silver: number; // in grams or currency value
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
  }): Promise<{
    total_wealth: number;
    total_deductions: number;
    zakatable_wealth: number;
    nisab_threshold: number;
    zakat_due: number;
    zakat_rate: number;
    is_zakat_due: boolean;
    calculation_breakdown: {
      wealth_breakdown: Record<string, number>;
      deductions_breakdown: Record<string, number>;
      nisab_rates: unknown;
      calculation_date: string;
    };
  }> {
    try {
      // Get current Nisab rates
      const nisabRates = await this.getCurrentNisabRates(wealthData.currency);
      
      // Convert gold/silver to currency if provided in grams
      let goldValue = wealthData.gold;
      let silverValue = wealthData.silver;
      
      if (wealthData.gold_in_grams && nisabRates) {
        goldValue = wealthData.gold * nisabRates.gold_price_per_gram;
      }
      
      if (wealthData.silver_in_grams && nisabRates) {
        silverValue = wealthData.silver * nisabRates.silver_price_per_gram;
      }

      // Calculate total wealth
      const totalWealth = 
        wealthData.cash +
        wealthData.bank_savings +
        goldValue +
        silverValue +
        wealthData.investments +
        wealthData.business_assets +
        wealthData.debts_owed_to_you +
        wealthData.other_assets;

      // Calculate total deductions
      const totalDeductions = 
        wealthData.personal_debts +
        wealthData.business_debts +
        wealthData.immediate_expenses +
        wealthData.other_deductions;

      // Calculate zakatable wealth
      const zakatableWealth = Math.max(0, totalWealth - totalDeductions);

      // Determine Nisab threshold (use lower of gold or silver nisab)
      const goldNisab = nisabRates ? nisabRates.gold_nisab_grams * nisabRates.gold_price_per_gram : 0;
      const silverNisab = nisabRates ? nisabRates.silver_nisab_grams * nisabRates.silver_price_per_gram : 0;
      const nisabThreshold = Math.min(goldNisab, silverNisab);

      // Check if Zakat is due
      const isZakatDue = zakatableWealth >= nisabThreshold;

      // Calculate Zakat (2.5% of zakatable wealth if above nisab)
      const zakatRate = 0.025; // 2.5%
      const zakatDue = isZakatDue ? zakatableWealth * zakatRate : 0;

      const calculationBreakdown = {
        wealth_breakdown: {
          cash: wealthData.cash,
          bank_savings: wealthData.bank_savings,
          gold: goldValue,
          silver: silverValue,
          investments: wealthData.investments,
          business_assets: wealthData.business_assets,
          debts_owed_to_you: wealthData.debts_owed_to_you,
          other_assets: wealthData.other_assets
        },
        deductions_breakdown: {
          personal_debts: wealthData.personal_debts,
          business_debts: wealthData.business_debts,
          immediate_expenses: wealthData.immediate_expenses,
          other_deductions: wealthData.other_deductions
        },
        nisab_rates: nisabRates,
        calculation_date: new Date().toISOString()
      };

      return {
        total_wealth: totalWealth,
        total_deductions: totalDeductions,
        zakatable_wealth: zakatableWealth,
        nisab_threshold: nisabThreshold,
        zakat_due: zakatDue,
        zakat_rate: zakatRate,
        is_zakat_due: isZakatDue,
        calculation_breakdown: calculationBreakdown
      };
    } catch (error) {
      console.error('Error calculating Zakat:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'calculateZakat', wealthData }
      });
      throw error;
    }
  }

  async saveZakatCalculation(calculationData: {
    total_wealth: number;
    nisab_threshold: number;
    zakat_due: number;
    currency: string;
    wealth_breakdown: ZakatCalculation['wealth_breakdown'];
    deductions: ZakatCalculation['deductions'];
    notes?: string;
  }): Promise<ZakatCalculation> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Get current Hijri year (simplified - would use proper Hijri calendar)
      const hijriYear = (new Date().getFullYear() + 579).toString(); // Approximate conversion

      const { data, error } = await zakatSupabase
        .from('zakat_calculations')
        .insert([{
          user_id: user.user?.id,
          calculation_date: new Date().toISOString().split('T')[0],
          hijri_year: hijriYear,
          ...calculationData,
          payment_status: 'calculated'
        }])
        .select()
        .single();

      if (error) throw error;

      // Track calculation
      await analyticsApi.trackEvent('zakat_calculated', 'financial', {
        zakat_amount: calculationData.zakat_due,
        currency: calculationData.currency,
        total_wealth: calculationData.total_wealth
      });

      // Create reminder for payment
      if (user.user?.id) {
        await this.createZakatReminder(user.user.id, {
          reminder_type: 'payment_due',
          title: 'Zakat Payment Due',
          message: `Your calculated Zakat of ${calculationData.zakat_due} ${calculationData.currency} is due for payment.`,
          scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        });
      }

      return data;
    } catch (error) {
      console.error('Error saving Zakat calculation:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'saveZakatCalculation', calculationData }
      });
      throw error;
    }
  }

  async getZakatCalculations(userId?: string, filters: {
    year?: string;
    payment_status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ calculations: ZakatCalculation[]; total: number }> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      let query = zakatSupabase
        .from('zakat_calculations')
        .select('*', { count: 'exact' })
        .eq('user_id', targetUserId)
        .order('calculation_date', { ascending: false });

      if (filters.year) {
        query = query.eq('hijri_year', filters.year);
      }
      if (filters.payment_status) {
        query = query.eq('payment_status', filters.payment_status);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        calculations: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching Zakat calculations:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getZakatCalculations', userId, filters }
      });
      throw error;
    }
  }

  // Zakat Payments
  async recordZakatPayment(paymentData: {
    calculation_id: string;
    amount: number;
    currency: string;
    payment_method: ZakatPayment['payment_method'];
    recipient_type: ZakatPayment['recipient_type'];
    recipient_name?: string;
    recipient_details?: Record<string, unknown>;
    payment_date: string;
    reference_number?: string;
    notes?: string;
  }): Promise<ZakatPayment> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await zakatSupabase
        .from('zakat_payments')
        .insert([{
          ...paymentData,
          user_id: user.user?.id,
          verification_status: 'pending'
        }])
        .select(`
          *,
          calculation:zakat_calculations(*)
        `)
        .single();

      if (error) throw error;

      // Update calculation payment status
      const totalPaid = await this.getTotalPaidForCalculation(paymentData.calculation_id);
      const calculation = await this.getCalculationById(paymentData.calculation_id);
      
      if (calculation) {
        let paymentStatus: ZakatCalculation['payment_status'] = 'partially_paid';
        
        if (totalPaid >= calculation.zakat_due) {
          paymentStatus = 'paid';
        }

        await zakatSupabase
          .from('zakat_calculations')
          .update({ 
            payment_status: paymentStatus,
            payment_date: paymentData.payment_date,
            payment_amount: totalPaid,
            updated_at: new Date().toISOString()
          })
          .eq('id', paymentData.calculation_id);
      }

      // Track payment
      await analyticsApi.trackEvent('zakat_payment_recorded', 'financial', {
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_method: paymentData.payment_method,
        recipient_type: paymentData.recipient_type
      });

      return data;
    } catch (error) {
      console.error('Error recording Zakat payment:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'recordZakatPayment', paymentData }
      });
      throw error;
    }
  }

  async getZakatPayments(userId?: string, filters: {
    calculation_id?: string;
    year?: string;
    verification_status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ payments: ZakatPayment[]; total: number }> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      let query = zakatSupabase
        .from('zakat_payments')
        .select(`
          *,
          calculation:zakat_calculations(*)
        `, { count: 'exact' })
        .eq('user_id', targetUserId)
        .order('payment_date', { ascending: false });

      if (filters.calculation_id) {
        query = query.eq('calculation_id', filters.calculation_id);
      }
      if (filters.verification_status) {
        query = query.eq('verification_status', filters.verification_status);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        payments: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching Zakat payments:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getZakatPayments', userId, filters }
      });
      throw error;
    }
  }

  // Nisab Rates Management
  async getCurrentNisabRates(currency = 'USD'): Promise<NisabRates | null> {
    try {
      const { data, error } = await zakatSupabase
        .from('nisab_rates')
        .select('*')
        .eq('currency', currency)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data;
    } catch (error) {
      console.error('Error fetching current Nisab rates:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getCurrentNisabRates', currency }
      });
      throw error;
    }
  }

  async updateNisabRates(ratesData: {
    gold_price_per_gram: number;
    silver_price_per_gram: number;
    currency: string;
    source: string;
  }): Promise<NisabRates> {
    try {
      const { data, error } = await zakatSupabase
        .from('nisab_rates')
        .insert([{
          ...ratesData,
          date: new Date().toISOString().split('T')[0],
          gold_nisab_grams: 85, // Standard gold nisab
          silver_nisab_grams: 595 // Standard silver nisab
        }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating Nisab rates:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.HIGH,
        metadata: { action: 'updateNisabRates', ratesData }
      });
      throw error;
    }
  }

  // Zakat Recipients
  async getZakatRecipients(filters: {
    type?: string;
    verification_status?: string;
    is_featured?: boolean;
    limit?: number;
  } = {}): Promise<ZakatRecipient[]> {
    try {
      let query = zakatSupabase
        .from('zakat_recipients')
        .select('*')
        .order('name');

      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.verification_status) {
        query = query.eq('verification_status', filters.verification_status);
      }
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching Zakat recipients:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getZakatRecipients', filters }
      });
      throw error;
    }
  }

  // Zakat Education
  async getZakatEducation(filters: {
    category?: string;
    language?: string;
    is_featured?: boolean;
    limit?: number;
  } = {}): Promise<ZakatEducation[]> {
    try {
      let query = zakatSupabase
        .from('zakat_education')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('view_count', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching Zakat education:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getZakatEducation', filters }
      });
      throw error;
    }
  }

  // Zakat Reminders
  async createZakatReminder(userId: string, reminderData: {
    reminder_type: ZakatReminder['reminder_type'];
    title: string;
    message: string;
    scheduled_date: string;
    is_recurring?: boolean;
    recurrence_pattern?: ZakatReminder['recurrence_pattern'];
  }): Promise<ZakatReminder> {
    try {
      const { data, error } = await zakatSupabase
        .from('zakat_reminders')
        .insert([{
          user_id: userId,
          ...reminderData,
          is_recurring: reminderData.is_recurring || false,
          is_sent: false
        }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating Zakat reminder:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'createZakatReminder', userId, reminderData }
      });
      throw error;
    }
  }

  async getZakatReminders(userId?: string): Promise<ZakatReminder[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      const { data, error } = await zakatSupabase
        .from('zakat_reminders')
        .select('*')
        .eq('user_id', targetUserId)
        .order('scheduled_date');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching Zakat reminders:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getZakatReminders', userId }
      });
      throw error;
    }
  }

  // Analytics and Statistics
  async getZakatAnalytics(userId?: string): Promise<{
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
  }> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      
      const [calculations, payments] = await Promise.all([
        this.getZakatCalculations(targetUserId),
        this.getZakatPayments(targetUserId)
      ]);

      const totalCalculated = calculations.calculations.reduce((sum, calc) => sum + calc.zakat_due, 0);
      const totalPaid = payments.payments.reduce((sum, payment) => sum + payment.amount, 0);
      const paymentRate = totalCalculated > 0 ? (totalPaid / totalCalculated) * 100 : 0;
      const averageZakat = calculations.calculations.length > 0 ? totalCalculated / calculations.calculations.length : 0;

      // Yearly summary
      const yearlyMap = new Map();
      calculations.calculations.forEach(calc => {
        const year = calc.hijri_year;
        if (!yearlyMap.has(year)) {
          yearlyMap.set(year, { calculated: 0, paid: 0, payment_count: 0 });
        }
        const yearData = yearlyMap.get(year);
        yearData.calculated += calc.zakat_due;
      });

      payments.payments.forEach(payment => {
        const calc = calculations.calculations.find(c => c.id === payment.calculation_id);
        if (calc) {
          const year = calc.hijri_year;
          if (yearlyMap.has(year)) {
            const yearData = yearlyMap.get(year);
            yearData.paid += payment.amount;
            yearData.payment_count += 1;
          }
        }
      });

      const yearlySummary = Array.from(yearlyMap.entries()).map(([year, data]) => ({
        year,
        ...data
      }));

      // Recipient distribution
      const recipientDistribution: Record<string, number> = {};
      payments.payments.forEach(payment => {
        const type = payment.recipient_type;
        recipientDistribution[type] = (recipientDistribution[type] || 0) + payment.amount;
      });

      // Payment methods
      const paymentMethods: Record<string, number> = {};
      payments.payments.forEach(payment => {
        const method = payment.payment_method;
        paymentMethods[method] = (paymentMethods[method] || 0) + 1;
      });

      return {
        total_calculated: totalCalculated,
        total_paid: totalPaid,
        payment_rate: paymentRate,
        average_zakat: averageZakat,
        yearly_summary: yearlySummary,
        recipient_distribution: recipientDistribution,
        payment_methods: paymentMethods
      };
    } catch (error) {
      console.error('Error fetching Zakat analytics:', error);
      errorHandler.handleError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.MEDIUM,
        metadata: { action: 'getZakatAnalytics', userId }
      });
      throw error;
    }
  }

  // Utility Methods
  private async getTotalPaidForCalculation(calculationId: string): Promise<number> {
    try {
      const { data, error } = await zakatSupabase
        .from('zakat_payments')
        .select('amount')
        .eq('calculation_id', calculationId)
        .eq('verification_status', 'verified');

      if (error) throw error;

      return (data || []).reduce((sum: number, payment: unknown) => sum + payment.amount, 0);
    } catch (error) {
      console.error('Error calculating total paid:', error);
      return 0;
    }
  }

  private async getCalculationById(calculationId: string): Promise<ZakatCalculation | null> {
    try {
      const { data, error } = await zakatSupabase
        .from('zakat_calculations')
        .select('*')
        .eq('id', calculationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data;
    } catch (error) {
      console.error('Error fetching calculation:', error);
      return null;
    }
  }

  // Automated Tasks
  async processScheduledReminders(): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      const { data: dueReminders, error } = await zakatSupabase
        .from('zakat_reminders')
        .select('*')
        .eq('is_sent', false)
        .lte('scheduled_date', now);

      if (error) throw error;

      for (const reminder of dueReminders || []) {
        // Send reminder (would integrate with notification service)
        console.log(`Sending Zakat reminder: ${reminder.title} to user ${reminder.user_id}`);
        
        // Mark as sent
        await zakatSupabase
          .from('zakat_reminders')
          .update({ 
            is_sent: true, 
            sent_at: new Date().toISOString() 
          })
          .eq('id', reminder.id);

        // If recurring, create next reminder
        if (reminder.is_recurring && reminder.recurrence_pattern) {
          const nextDate = this.calculateNextReminderDate(reminder.scheduled_date, reminder.recurrence_pattern);
          
          await this.createZakatReminder(reminder.user_id, {
            reminder_type: reminder.reminder_type,
            title: reminder.title,
            message: reminder.message,
            scheduled_date: nextDate,
            is_recurring: true,
            recurrence_pattern: reminder.recurrence_pattern
          });
        }
      }
    } catch (error) {
      console.error('Error processing scheduled reminders:', error);
      throw error;
    }
  }

  private calculateNextReminderDate(currentDate: string, pattern: string): string {
    const date = new Date(currentDate);
    
    switch (pattern) {
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        date.setFullYear(date.getFullYear() + 1); // Default to yearly
    }
    
    return date.toISOString();
  }
}

export const zakatCalculatorApi = new ZakatCalculatorApiService();
