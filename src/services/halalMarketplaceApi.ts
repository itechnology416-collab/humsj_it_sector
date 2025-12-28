import { supabase } from '@/integrations/supabase/client';
import { errorHandler } from './errorHandler';
import { analyticsApi } from './analyticsApi';

// Type assertion helper for marketplace tables
const marketplaceSupabase = supabase as unknown;

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined data
  children?: MarketplaceCategory[];
  business_count?: number;
}

export interface MarketplaceBusiness {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category_id?: string;
  owner_id?: string;
  logo_url?: string;
  cover_image_url?: string;
  contact_info: Record<string, unknown>;
  address: Record<string, unknown>;
  business_hours: Record<string, unknown>;
  halal_certification: Record<string, unknown>;
  verification_status: 'pending' | 'verified' | 'rejected';
  is_featured: boolean;
  is_active: boolean;
  rating_average?: number;
  rating_count?: number;
  created_at: string;
  updated_at: string;
  
  // Joined data
  category?: MarketplaceCategory;
  owner?: {
    id: string;
    full_name?: string;
    email?: string;
  };
}

export interface MarketplaceProduct {
  id: string;
  business_id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  images: string[];
  specifications: Record<string, unknown>;
  halal_certification: Record<string, unknown>;
  stock_quantity?: number;
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined data
  business?: MarketplaceBusiness;
}

export interface MarketplaceReview {
  id: string;
  business_id?: string;
  product_id?: string;
  user_id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined data
  user?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface MarketplaceOrder {
  id: string;
  user_id: string;
  business_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
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
  delivery_address: Record<string, unknown>;
  delivery_instructions?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  business?: MarketplaceBusiness;
  user?: {
    id: string;
    full_name?: string;
    email?: string;
    phone?: string;
  };
}

class HalalMarketplaceApiService {
  // Categories
  async getCategories(includeInactive = false): Promise<MarketplaceCategory[]> {
    try {
      let query = marketplaceSupabase
        .from('marketplace_categories')
        .select(`
          *,
          children:marketplace_categories!parent_id(*)
        `)
        .is('parent_id', null)
        .order('sort_order');

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching marketplace categories:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'getCategories' }
      });
      throw error;
    }
  }

  async getCategoryById(categoryId: string): Promise<MarketplaceCategory | null> {
    try {
      const { data, error } = await marketplaceSupabase
        .from('marketplace_categories')
        .select(`
          *,
          children:marketplace_categories!parent_id(*),
          business_count:marketplace_businesses(count)
        `)
        .eq('id', categoryId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching marketplace category:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getCategoryById', categoryId }
      });
      throw error;
    }
  }

  async createCategory(categoryData: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    parent_id?: string;
    sort_order?: number;
  }): Promise<MarketplaceCategory> {
    try {
      const { data, error } = await marketplaceSupabase
        .from('marketplace_categories')
        .insert([{
          ...categoryData,
          sort_order: categoryData.sort_order || 0,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      // Track category creation
      await analyticsApi.trackEvent('category_created', 'marketplace', {
        category_name: categoryData.name,
        parent_id: categoryData.parent_id
      });

      return data;
    } catch (error) {
      console.error('Error creating marketplace category:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'createCategory', categoryData }
      });
      throw error;
    }
  }

  // Businesses
  async getBusinesses(filters: {
    category_id?: string;
    search?: string;
    is_featured?: boolean;
    verification_status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ businesses: MarketplaceBusiness[]; total: number }> {
    try {
      let query = marketplaceSupabase
        .from('marketplace_businesses')
        .select(`
          *,
          category:marketplace_categories(*),
          owner:profiles!owner_id(id, full_name, email)
        `, { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
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
        businesses: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching marketplace businesses:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getBusinesses', filters }
      });
      throw error;
    }
  }

  async getBusinessById(businessId: string): Promise<MarketplaceBusiness | null> {
    try {
      const { data, error } = await marketplaceSupabase
        .from('marketplace_businesses')
        .select(`
          *,
          category:marketplace_categories(*),
          owner:profiles!owner_id(id, full_name, email)
        `)
        .eq('id', businessId)
        .single();

      if (error) throw error;

      // Track business view
      await analyticsApi.trackEvent('business_viewed', 'marketplace', {
        business_id: businessId,
        business_name: data?.name
      });

      return data;
    } catch (error) {
      console.error('Error fetching marketplace business:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getBusinessById', businessId }
      });
      throw error;
    }
  }

  async createBusiness(businessData: {
    name: string;
    slug: string;
    description?: string;
    category_id?: string;
    logo_url?: string;
    cover_image_url?: string;
    contact_info: Record<string, unknown>;
    address: Record<string, unknown>;
    business_hours: Record<string, unknown>;
    halal_certification: Record<string, unknown>;
  }): Promise<MarketplaceBusiness> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await marketplaceSupabase
        .from('marketplace_businesses')
        .insert([{
          ...businessData,
          owner_id: user.user?.id,
          verification_status: 'pending',
          is_featured: false,
          is_active: true
        }])
        .select(`
          *,
          category:marketplace_categories(*),
          owner:profiles!owner_id(id, full_name, email)
        `)
        .single();

      if (error) throw error;

      // Track business creation
      await analyticsApi.trackEvent('business_created', 'marketplace', {
        business_name: businessData.name,
        category_id: businessData.category_id
      });

      return data;
    } catch (error) {
      console.error('Error creating marketplace business:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'createBusiness', businessData }
      });
      throw error;
    }
  }

  async updateBusiness(
    businessId: string,
    updates: Partial<Omit<MarketplaceBusiness, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>
  ): Promise<MarketplaceBusiness> {
    try {
      const { data, error } = await marketplaceSupabase
        .from('marketplace_businesses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId)
        .select(`
          *,
          category:marketplace_categories(*),
          owner:profiles!owner_id(id, full_name, email)
        `)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating marketplace business:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'updateBusiness', businessId, updates }
      });
      throw error;
    }
  }

  // Products
  async getProducts(filters: {
    business_id?: string;
    category?: string;
    search?: string;
    is_featured?: boolean;
    is_available?: boolean;
    min_price?: number;
    max_price?: number;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ products: MarketplaceProduct[]; total: number }> {
    try {
      let query = marketplaceSupabase
        .from('marketplace_products')
        .select(`
          *,
          business:marketplace_businesses(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.business_id) {
        query = query.eq('business_id', filters.business_id);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      if (filters.is_available !== undefined) {
        query = query.eq('is_available', filters.is_available);
      }
      if (filters.min_price !== undefined) {
        query = query.gte('price', filters.min_price);
      }
      if (filters.max_price !== undefined) {
        query = query.lte('price', filters.max_price);
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
        products: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching marketplace products:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getProducts', filters }
      });
      throw error;
    }
  }

  async getProductById(productId: string): Promise<MarketplaceProduct | null> {
    try {
      const { data, error } = await marketplaceSupabase
        .from('marketplace_products')
        .select(`
          *,
          business:marketplace_businesses(*)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;

      // Track product view
      await analyticsApi.trackEvent('product_viewed', 'marketplace', {
        product_id: productId,
        product_name: data?.name,
        business_id: data?.business_id
      });

      return data;
    } catch (error) {
      console.error('Error fetching marketplace product:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getProductById', productId }
      });
      throw error;
    }
  }

  async createProduct(productData: {
    business_id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    currency: string;
    category?: string;
    images: string[];
    specifications: Record<string, unknown>;
    halal_certification: Record<string, unknown>;
    stock_quantity?: number;
  }): Promise<MarketplaceProduct> {
    try {
      const { data, error } = await marketplaceSupabase
        .from('marketplace_products')
        .insert([{
          ...productData,
          is_available: true,
          is_featured: false
        }])
        .select(`
          *,
          business:marketplace_businesses(*)
        `)
        .single();

      if (error) throw error;

      // Track product creation
      await analyticsApi.trackEvent('product_created', 'marketplace', {
        product_name: productData.name,
        business_id: productData.business_id,
        price: productData.price
      });

      return data;
    } catch (error) {
      console.error('Error creating marketplace product:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'createProduct', productData }
      });
      throw error;
    }
  }

  // Reviews
  async getReviews(filters: {
    business_id?: string;
    product_id?: string;
    user_id?: string;
    is_approved?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ reviews: MarketplaceReview[]; total: number }> {
    try {
      let query = marketplaceSupabase
        .from('marketplace_reviews')
        .select(`
          *,
          user:profiles!user_id(id, full_name, avatar_url)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.business_id) {
        query = query.eq('business_id', filters.business_id);
      }
      if (filters.product_id) {
        query = query.eq('product_id', filters.product_id);
      }
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.is_approved !== undefined) {
        query = query.eq('is_approved', filters.is_approved);
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
        reviews: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching marketplace reviews:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getReviews', filters }
      });
      throw error;
    }
  }

  async createReview(reviewData: {
    business_id?: string;
    product_id?: string;
    rating: number;
    title?: string;
    comment?: string;
  }): Promise<MarketplaceReview> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await marketplaceSupabase
        .from('marketplace_reviews')
        .insert([{
          ...reviewData,
          user_id: user.user?.id,
          is_verified: false,
          is_approved: false
        }])
        .select(`
          *,
          user:profiles!user_id(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Track review creation
      await analyticsApi.trackEvent('review_created', 'marketplace', {
        rating: reviewData.rating,
        business_id: reviewData.business_id,
        product_id: reviewData.product_id
      });

      return data;
    } catch (error) {
      console.error('Error creating marketplace review:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'createReview', reviewData }
      });
      throw error;
    }
  }

  // Orders
  async getOrders(filters: {
    user_id?: string;
    business_id?: string;
    status?: string;
    payment_status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ orders: MarketplaceOrder[]; total: number }> {
    try {
      let query = marketplaceSupabase
        .from('marketplace_orders')
        .select(`
          *,
          business:marketplace_businesses(*),
          user:profiles!user_id(id, full_name, email, phone)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.business_id) {
        query = query.eq('business_id', filters.business_id);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
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
        orders: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching marketplace orders:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getOrders', filters }
      });
      throw error;
    }
  }

  async createOrder(orderData: {
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
    delivery_address: Record<string, unknown>;
    delivery_instructions?: string;
    estimated_delivery?: string;
  }): Promise<MarketplaceOrder> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const { data, error } = await marketplaceSupabase
        .from('marketplace_orders')
        .insert([{
          ...orderData,
          user_id: user.user?.id,
          order_number: orderNumber,
          status: 'pending',
          payment_status: 'pending'
        }])
        .select(`
          *,
          business:marketplace_businesses(*),
          user:profiles!user_id(id, full_name, email, phone)
        `)
        .single();

      if (error) throw error;

      // Track order creation
      await analyticsApi.trackEvent('order_created', 'marketplace', {
        order_number: orderNumber,
        business_id: orderData.business_id,
        total_amount: orderData.total_amount,
        items_count: orderData.items.length
      });

      return data;
    } catch (error) {
      console.error('Error creating marketplace order:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'createOrder', orderData }
      });
      throw error;
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: MarketplaceOrder['status'],
    paymentStatus?: MarketplaceOrder['payment_status']
  ): Promise<MarketplaceOrder> {
    try {
      const updates: unknown = {
        status,
        updated_at: new Date().toISOString()
      };
      
      if (paymentStatus) {
        updates.payment_status = paymentStatus;
      }

      const { data, error } = await marketplaceSupabase
        .from('marketplace_orders')
        .update(updates)
        .eq('id', orderId)
        .select(`
          *,
          business:marketplace_businesses(*),
          user:profiles!user_id(id, full_name, email, phone)
        `)
        .single();

      if (error) throw error;

      // Track order status update
      await analyticsApi.trackEvent('order_status_updated', 'marketplace', {
        order_id: orderId,
        new_status: status,
        payment_status: paymentStatus
      });

      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'high' as unknown,
        metadata: { action: 'updateOrderStatus', orderId, status }
      });
      throw error;
    }
  }

  // Search and Discovery
  async searchMarketplace(query: string, filters: {
    type?: 'businesses' | 'products' | 'all';
    category_id?: string;
    limit?: number;
  } = {}): Promise<{
    businesses: MarketplaceBusiness[];
    products: MarketplaceProduct[];
    total: number;
  }> {
    try {
      const searchType = filters.type || 'all';
      const limit = filters.limit || 20;
      
      let businesses: MarketplaceBusiness[] = [];
      let products: MarketplaceProduct[] = [];

      if (searchType === 'businesses' || searchType === 'all') {
        const businessQuery = marketplaceSupabase
          .from('marketplace_businesses')
          .select(`
            *,
            category:marketplace_categories(*)
          `)
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .eq('is_active', true)
          .eq('verification_status', 'verified')
          .limit(searchType === 'all' ? Math.floor(limit / 2) : limit);

        if (filters.category_id) {
          businessQuery.eq('category_id', filters.category_id);
        }

        const { data: businessData } = await businessQuery;
        businesses = businessData || [];
      }

      if (searchType === 'products' || searchType === 'all') {
        const productQuery = marketplaceSupabase
          .from('marketplace_products')
          .select(`
            *,
            business:marketplace_businesses(*)
          `)
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .eq('is_available', true)
          .limit(searchType === 'all' ? Math.floor(limit / 2) : limit);

        const { data: productData } = await productQuery;
        products = productData || [];
      }

      // Track search
      await analyticsApi.trackEvent('marketplace_search', 'marketplace', {
        query,
        type: searchType,
        results_count: businesses.length + products.length
      });

      return {
        businesses,
        products,
        total: businesses.length + products.length
      };
    } catch (error) {
      console.error('Error searching marketplace:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'searchMarketplace', query, filters }
      });
      throw error;
    }
  }

  // Analytics and Statistics
  async getMarketplaceStats(): Promise<{
    total_businesses: number;
    verified_businesses: number;
    total_products: number;
    total_orders: number;
    total_revenue: number;
    avg_order_value: number;
  }> {
    try {
      const [
        { count: totalBusinesses },
        { count: verifiedBusinesses },
        { count: totalProducts },
        { count: totalOrders },
        { data: revenueData }
      ] = await Promise.all([
        marketplaceSupabase.from('marketplace_businesses').select('*', { count: 'exact', head: true }),
        marketplaceSupabase.from('marketplace_businesses').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified'),
        marketplaceSupabase.from('marketplace_products').select('*', { count: 'exact', head: true }),
        marketplaceSupabase.from('marketplace_orders').select('*', { count: 'exact', head: true }),
        marketplaceSupabase.from('marketplace_orders').select('total_amount').eq('payment_status', 'paid')
      ]);

      const totalRevenue = (revenueData || []).reduce((sum: number, order: unknown) => sum + order.total_amount, 0);
      const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

      return {
        total_businesses: totalBusinesses || 0,
        verified_businesses: verifiedBusinesses || 0,
        total_products: totalProducts || 0,
        total_orders: totalOrders || 0,
        total_revenue: totalRevenue,
        avg_order_value: avgOrderValue
      };
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
      errorHandler.handleError(error, {
        category: 'api' as unknown,
        severity: 'medium' as unknown,
        metadata: { action: 'getMarketplaceStats' }
      });
      throw error;
    }
  }
}

export const halalMarketplaceApi = new HalalMarketplaceApiService();