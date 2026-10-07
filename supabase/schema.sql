-- DesiList Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  avatar_url TEXT,
  city TEXT,
  locality TEXT,
  pincode TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (is_active = TRUE);

-- Subcategories table
CREATE TABLE subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subcategories are viewable by everyone"
  ON subcategories FOR SELECT USING (is_active = TRUE);

-- Cities table (major Indian cities)
CREATE TABLE cities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  state TEXT NOT NULL,
  is_metro BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are viewable by everyone"
  ON cities FOR SELECT USING (is_active = TRUE);

-- Listings table
CREATE TABLE listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  price_type TEXT CHECK (price_type IN ('fixed', 'negotiable', 'exchange')) DEFAULT 'negotiable',
  condition TEXT CHECK (condition IN ('new', 'like_new', 'used', 'fair')) DEFAULT 'like_new',
  locality TEXT,
  pincode TEXT,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  images TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('draft', 'active', 'sold', 'expired', 'rejected')) DEFAULT 'active',
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Listings policies
CREATE POLICY "Active listings are viewable by everyone"
  ON listings FOR SELECT USING (status = 'active');

CREATE POLICY "Users can view their own listings"
  ON listings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create listings"
  ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings"
  ON listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings"
  ON listings FOR DELETE USING (auth.uid() = user_id);

-- Saved listings (favorites)
CREATE TABLE saved_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved listings"
  ON saved_listings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save listings"
  ON saved_listings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave listings"
  ON saved_listings FOR DELETE USING (auth.uid() = user_id);

-- Listing views (for analytics)
CREATE TABLE listing_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listing owners can view their views"
  ON listing_views FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings WHERE listings.id = listing_views.listing_id AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert views"
  ON listing_views FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_city ON listings(city_id);
CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_created ON listings(created_at DESC);
CREATE INDEX idx_listings_featured ON listings(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_search ON listings USING GIN (to_tsvector('english', title || ' ' || description));

CREATE INDEX idx_saved_listings_user ON saved_listings(user_id);
CREATE INDEX idx_listing_views_listing ON listing_views(listing_id, created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (slug, name, icon, color, sort_order) VALUES
('electronics', 'Electronics', 'Smartphone', '#3b82f6', 1),
('vehicles', 'Vehicles', 'Car', '#22c55e', 2),
('property', 'Property', 'Home', '#a855f7', 3),
('jobs', 'Jobs', 'Briefcase', '#f59e0b', 4),
('services', 'Services', 'Wrench', '#ec4899', 5),
('fashion', 'Fashion', 'Shirt', '#8b5cf6', 6),
('home-garden', 'Home & Garden', 'Sofa', '#06b6d4', 7),
('books-hobbies', 'Books & Hobbies', 'BookOpen', '#84cc16', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert default subcategories
INSERT INTO subcategories (category_id, slug, name, sort_order) VALUES
((SELECT id FROM categories WHERE slug = 'electronics'), 'mobiles', 'Mobiles', 1),
((SELECT id FROM categories WHERE slug = 'electronics'), 'laptops', 'Laptops', 2),
((SELECT id FROM categories WHERE slug = 'electronics'), 'tablets', 'Tablets', 3),
((SELECT id FROM categories WHERE slug = 'electronics'), 'cameras', 'Cameras', 4),
((SELECT id FROM categories WHERE slug = 'electronics'), 'audio', 'Audio', 5),
((SELECT id FROM categories WHERE slug = 'electronics'), 'gaming', 'Gaming', 6),
((SELECT id FROM categories WHERE slug = 'electronics'), 'wearables', 'Wearables', 7),
((SELECT id FROM categories WHERE slug = 'electronics'), 'accessories', 'Accessories', 8),

((SELECT id FROM categories WHERE slug = 'vehicles'), 'cars', 'Cars', 1),
((SELECT id FROM categories WHERE slug = 'vehicles'), 'bikes-scooters', 'Bikes & Scooters', 2),
((SELECT id FROM categories WHERE slug = 'vehicles'), 'commercial-vehicles', 'Commercial Vehicles', 3),
((SELECT id FROM categories WHERE slug = 'vehicles'), 'auto-parts', 'Auto Parts', 4),
((SELECT id FROM categories WHERE slug = 'vehicles'), 'cycles', 'Cycles', 5),

((SELECT id FROM categories WHERE slug = 'property'), 'flats-rent', 'Flats for Rent', 1),
((SELECT id FROM categories WHERE slug = 'property'), 'houses-rent', 'Houses for Rent', 2),
((SELECT id FROM categories WHERE slug = 'property'), 'pg-coliving', 'PG & Co-living', 3),
((SELECT id FROM categories WHERE slug = 'property'), 'flats-sale', 'Flats for Sale', 4),
((SELECT id FROM categories WHERE slug = 'property'), 'houses-sale', 'Houses for Sale', 5),
((SELECT id FROM categories WHERE slug = 'property'), 'plots-land', 'Plots & Land', 6),
((SELECT id FROM categories WHERE slug = 'property'), 'commercial-property', 'Commercial Property', 7),
((SELECT id FROM categories WHERE slug = 'property'), 'office-space', 'Office Space', 8),

((SELECT id FROM categories WHERE slug = 'jobs'), 'it-software', 'IT & Software', 1),
((SELECT id FROM categories WHERE slug = 'jobs'), 'sales-marketing', 'Sales & Marketing', 2),
((SELECT id FROM categories WHERE slug = 'jobs'), 'accounting-finance', 'Accounting & Finance', 3),
((SELECT id FROM categories WHERE slug = 'jobs'), 'hr-admin', 'HR & Admin', 4),
((SELECT id FROM categories WHERE slug = 'jobs'), 'engineering', 'Engineering', 5),
((SELECT id FROM categories WHERE slug = 'jobs'), 'teaching', 'Teaching', 6),
((SELECT id FROM categories WHERE slug = 'jobs'), 'customer-service', 'Customer Service', 7),
((SELECT id FROM categories WHERE slug = 'jobs'), 'drivers-logistics', 'Drivers & Logistics', 8),

((SELECT id FROM categories WHERE slug = 'services'), 'home-repair', 'Home Repair', 1),
((SELECT id FROM categories WHERE slug = 'services'), 'tutors-classes', 'Tutors & Classes', 2),
((SELECT id FROM categories WHERE slug = 'services'), 'beauty-wellness', 'Beauty & Wellness', 3),
((SELECT id FROM categories WHERE slug = 'services'), 'event-services', 'Event Services', 4),
((SELECT id FROM categories WHERE slug = 'services'), 'business-services', 'Business Services', 5),
((SELECT id FROM categories WHERE slug = 'services'), 'packers-movers', 'Packers & Movers', 6),
((SELECT id FROM categories WHERE slug = 'services'), 'appliance-repair', 'Appliance Repair', 7),
((SELECT id FROM categories WHERE slug = 'services'), 'cleaning-services', 'Cleaning Services', 8),

((SELECT id FROM categories WHERE slug = 'fashion'), 'mens-clothing', 'Men''s Clothing', 1),
((SELECT id FROM categories WHERE slug = 'fashion'), 'womens-clothing', 'Women''s Clothing', 2),
((SELECT id FROM categories WHERE slug = 'fashion'), 'kids-clothing', 'Kids'' Clothing', 3),
((SELECT id FROM categories WHERE slug = 'fashion'), 'footwear', 'Footwear', 4),
((SELECT id FROM categories WHERE slug = 'fashion'), 'accessories', 'Accessories', 5),
((SELECT id FROM categories WHERE slug = 'fashion'), 'jewellery', 'Jewellery', 6),
((SELECT id FROM categories WHERE slug = 'fashion'), 'bags-wallets', 'Bags & Wallets', 7),
((SELECT id FROM categories WHERE slug = 'fashion'), 'watches', 'Watches', 8),

((SELECT id FROM categories WHERE slug = 'home-garden'), 'furniture', 'Furniture', 1),
((SELECT id FROM categories WHERE slug = 'home-garden'), 'home-decor', 'Home Decor', 2),
((SELECT id FROM categories WHERE slug = 'home-garden'), 'kitchen-dining', 'Kitchen & Dining', 3),
((SELECT id FROM categories WHERE slug = 'home-garden'), 'bedding-bath', 'Bedding & Bath', 4),
((SELECT id FROM categories WHERE slug = 'home-garden'), 'lighting', 'Lighting', 5),
((SELECT id FROM categories WHERE slug = 'home-garden'), 'garden-outdoor', 'Garden & Outdoor', 6),
((SELECT id FROM categories WHERE slug = 'home-garden'), 'appliances', 'Appliances', 7),
((SELECT id FROM categories WHERE slug = 'home-garden'), 'storage', 'Storage', 8),

((SELECT id FROM categories WHERE slug = 'books-hobbies'), 'books', 'Books', 1),
((SELECT id FROM categories WHERE slug = 'books-hobbies'), 'musical-instruments', 'Musical Instruments', 2),
((SELECT id FROM categories WHERE slug = 'books-hobbies'), 'art-craft', 'Art & Craft', 3),
((SELECT id FROM categories WHERE slug = 'books-hobbies'), 'collectibles', 'Collectibles', 4),
((SELECT id FROM categories WHERE slug = 'books-hobbies'), 'toys-games', 'Toys & Games', 5),
((SELECT id FROM categories WHERE slug = 'books-hobbies'), 'sports-equipment', 'Sports Equipment', 6),
((SELECT id FROM categories WHERE slug = 'books-hobbies'), 'fitness-equipment', 'Fitness Equipment', 7),
((SELECT id FROM categories WHERE slug = 'books-hobbies'), 'pet-supplies', 'Pet Supplies', 8)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert major Indian cities
INSERT INTO cities (name, slug, state, is_metro, sort_order) VALUES
('Mumbai', 'mumbai', 'Maharashtra', TRUE, 1),
('Delhi', 'delhi', 'Delhi', TRUE, 2),
('Bangalore', 'bangalore', 'Karnataka', TRUE, 3),
('Hyderabad', 'hyderabad', 'Telangana', TRUE, 4),
('Chennai', 'chennai', 'Tamil Nadu', TRUE, 5),
('Kolkata', 'kolkata', 'West Bengal', TRUE, 6),
('Pune', 'pune', 'Maharashtra', TRUE, 7),
('Ahmedabad', 'ahmedabad', 'Gujarat', TRUE, 8),
('Surat', 'surat', 'Gujarat', FALSE, 9),
('Jaipur', 'jaipur', 'Rajasthan', FALSE, 10),
('Lucknow', 'lucknow', 'Uttar Pradesh', FALSE, 11),
('Kanpur', 'kanpur', 'Uttar Pradesh', FALSE, 12),
('Nagpur', 'nagpur', 'Maharashtra', FALSE, 13),
('Indore', 'indore', 'Madhya Pradesh', FALSE, 14),
('Thane', 'thane', 'Maharashtra', FALSE, 15),
('Bhopal', 'bhopal', 'Madhya Pradesh', FALSE, 16),
('Visakhapatnam', 'visakhapatnam', 'Andhra Pradesh', FALSE, 17),
('Pimpri-Chinchwad', 'pimpri-chinchwad', 'Maharashtra', FALSE, 18),
('Patna', 'patna', 'Bihar', FALSE, 19),
('Vadodara', 'vadodara', 'Gujarat', FALSE, 20),
('Ghaziabad', 'ghaziabad', 'Uttar Pradesh', FALSE, 21),
('Ludhiana', 'ludhiana', 'Punjab', FALSE, 22),
('Agra', 'agra', 'Uttar Pradesh', FALSE, 23),
('Nashik', 'nashik', 'Maharashtra', FALSE, 24),
('Faridabad', 'faridabad', 'Haryana', FALSE, 25),
('Meerut', 'meerut', 'Uttar Pradesh', FALSE, 26),
('Rajkot', 'rajkot', 'Gujarat', FALSE, 27),
('Kalyan-Dombivli', 'kalyan-dombivli', 'Maharashtra', FALSE, 28),
('Vasai-Virar', 'vasai-virar', 'Maharashtra', FALSE, 29),
('Varanasi', 'varanasi', 'Uttar Pradesh', FALSE, 30),
('Srinagar', 'srinagar', 'Jammu & Kashmir', FALSE, 31),
('Aurangabad', 'aurangabad', 'Maharashtra', FALSE, 32),
('Dhanbad', 'dhanbad', 'Jharkhand', FALSE, 33),
('Amritsar', 'amritsar', 'Punjab', FALSE, 34),
('Navi Mumbai', 'navi-mumbai', 'Maharashtra', FALSE, 35),
('Allahabad', 'allahabad', 'Uttar Pradesh', FALSE, 36),
('Howrah', 'howrah', 'West Bengal', FALSE, 37),
('Ranchi', 'ranchi', 'Jharkhand', FALSE, 38),
('Gwalior', 'gwalior', 'Madhya Pradesh', FALSE, 39),
('Jabalpur', 'jabalpur', 'Madhya Pradesh', FALSE, 40),
('Coimbatore', 'coimbatore', 'Tamil Nadu', FALSE, 41),
('Vijayawada', 'vijayawada', 'Andhra Pradesh', FALSE, 42),
('Jodhpur', 'jodhpur', 'Rajasthan', FALSE, 43),
('Madurai', 'madurai', 'Tamil Nadu', FALSE, 44),
('Raipur', 'raipur', 'Chhattisgarh', FALSE, 45),
('Kota', 'kota', 'Rajasthan', FALSE, 46),
('Guwahati', 'guwahati', 'Assam', FALSE, 47),
('Chandigarh', 'chandigarh', 'Chandigarh', FALSE, 48),
('Solapur', 'solapur', 'Maharashtra', FALSE, 49),
('Hubli-Dharwad', 'hubli-dharwad', 'Karnataka', FALSE, 50)
ON CONFLICT (slug) DO NOTHING;

-- Function to get listing with relations (for API)
CREATE OR REPLACE FUNCTION get_listing_with_relations(listing_uuid UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  price NUMERIC,
  price_type TEXT,
  condition TEXT,
  category_slug TEXT,
  category_name TEXT,
  category_icon TEXT,
  category_color TEXT,
  subcategory_slug TEXT,
  subcategory_name TEXT,
  city_slug TEXT,
  city_name TEXT,
  city_state TEXT,
  locality TEXT,
  pincode TEXT,
  images TEXT[],
  views INTEGER,
  is_featured BOOLEAN,
  status TEXT,
  posted_at TIMESTAMPTZ,
  user_id UUID,
  user_name TEXT,
  user_phone TEXT,
  user_whatsapp TEXT,
  user_avatar TEXT,
  user_verified BOOLEAN,
  user_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.description,
    l.price,
    l.price_type,
    l.condition,
    c.slug as category_slug,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    sc.slug as subcategory_slug,
    sc.name as subcategory_name,
    ci.slug as city_slug,
    ci.name as city_name,
    ci.state as city_state,
    l.locality,
    l.pincode,
    l.images,
    l.views,
    l.is_featured,
    l.status,
    l.created_at as posted_at,
    p.id as user_id,
    p.full_name as user_name,
    p.phone as user_phone,
    p.whatsapp as user_whatsapp,
    p.avatar_url as user_avatar,
    p.is_verified as user_verified,
    p.rating as user_rating
  FROM listings l
  LEFT JOIN categories c ON l.category_id = c.id
  LEFT JOIN subcategories sc ON l.subcategory_id = sc.id
  LEFT JOIN cities ci ON l.city_id = ci.id
  LEFT JOIN profiles p ON l.user_id = p.id
  WHERE l.id = listing_uuid AND l.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search listings
CREATE OR REPLACE FUNCTION search_listings(
  p_category_slug TEXT DEFAULT NULL,
  p_subcategory_slug TEXT DEFAULT NULL,
  p_city_slug TEXT DEFAULT NULL,
  p_query TEXT DEFAULT NULL,
  p_condition TEXT[] DEFAULT NULL,
  p_price_type TEXT[] DEFAULT NULL,
  p_price_min NUMERIC DEFAULT NULL,
  p_price_max NUMERIC DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'newest',
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  price NUMERIC,
  price_type TEXT,
  condition TEXT,
  category_slug TEXT,
  category_name TEXT,
  category_icon TEXT,
  category_color TEXT,
  subcategory_slug TEXT,
  subcategory_name TEXT,
  city_slug TEXT,
  city_name TEXT,
  locality TEXT,
  images TEXT[],
  views INTEGER,
  is_featured BOOLEAN,
  posted_at TIMESTAMPTZ,
  total_count BIGINT
) AS $$
DECLARE
  sort_clause TEXT;
BEGIN
  CASE p_sort_by
    WHEN 'price_low' THEN sort_clause := 'l.price ASC';
    WHEN 'price_high' THEN sort_clause := 'l.price DESC';
    WHEN 'popular' THEN sort_clause := 'l.views DESC';
    WHEN 'nearby' THEN sort_clause := 'l.created_at DESC'; -- Would need geo for real nearby
    ELSE sort_clause := 'l.created_at DESC';
  END CASE;

  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.price,
    l.price_type,
    l.condition,
    c.slug as category_slug,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    sc.slug as subcategory_slug,
    sc.name as subcategory_name,
    ci.slug as city_slug,
    ci.name as city_name,
    l.locality,
    l.images,
    l.views,
    l.is_featured,
    l.created_at as posted_at,
    COUNT(*) OVER() as total_count
  FROM listings l
  LEFT JOIN categories c ON l.category_id = c.id
  LEFT JOIN subcategories sc ON l.subcategory_id = sc.id
  LEFT JOIN cities ci ON l.city_id = ci.id
  WHERE l.status = 'active'
    AND (p_category_slug IS NULL OR c.slug = p_category_slug)
    AND (p_subcategory_slug IS NULL OR sc.slug = p_subcategory_slug)
    AND (p_city_slug IS NULL OR ci.slug = p_city_slug)
    AND (p_query IS NULL OR 
      l.title ILIKE '%' || p_query || '%' OR 
      l.description ILIKE '%' || p_query || '%' OR
      l.locality ILIKE '%' || p_query || '%')
    AND (p_condition IS NULL OR l.condition = ANY(p_condition))
    AND (p_price_type IS NULL OR l.price_type = ANY(p_price_type))
    AND (p_price_min IS NULL OR l.price >= p_price_min)
    AND (p_price_max IS NULL OR l.price <= p_price_max)
  ORDER BY 
    l.is_featured DESC,
    CASE WHEN p_sort_by = 'newest' THEN l.created_at END DESC,
    CASE WHEN p_sort_by = 'price_low' THEN l.price END ASC,
    CASE WHEN p_sort_by = 'price_high' THEN l.price END DESC,
    CASE WHEN p_sort_by = 'popular' THEN l.views END DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;