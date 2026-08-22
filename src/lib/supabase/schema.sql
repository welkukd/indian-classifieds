/**
 * Supabase setup instructions:
 * 1. Go to https://supabase.com and create a new project
 * 2. Run these SQL queries in the SQL Editor:
 *
 * -- Enable required extensions
 * create extension if not exists "uuid-ossp";
 *
 * -- Listings table
 * create table listings (
 *   id uuid default uuid_generate_uuid() primary key,
 *   title varchar(80) not null,
 *   description text not null,
 *   price bigint not null,
 *   price_type text check (price_type in ('fixed', 'negotiable', 'exchange')) default 'fixed',
 *   condition text check (condition in ('new', 'like_new', 'used', 'fair')) default 'used',
 *   category text not null,
 *   sub_category text not null,
 *   city text not null,
 *   locality text not null,
 *   country text default 'India',
 *   images text[] default '{}',
 *   status text check (status in ('draft', 'active', 'sold', 'archived')) default 'active',
 *   views integer default 0,
 *   is_featured boolean default false,
 *   user_id uuid references auth.users not null,
 *   created_at timestamp default timezone('utc'::text, now()) not null,
 *   updated_at timestamp default timezone('utc'::text, now()) not null
 * );
 *
 * -- Profiles table
 * create table profiles (
 *   id uuid references auth.users on delete cascade primary key,
 *   name text,
 *   phone text unique,
 *   whatsapp text,
 *   verified boolean default false,
 *   rating numeric(3,2) default 0,
 *   ads_count integer default 0,
 *   created_at timestamp default timezone('utc'::text, now()) not null
 * );
 *
 * -- Saved listings
 * create table saved_listings (
 *   id uuid default uuid_generate_uuid() primary key,
 *   user_id uuid references auth.users not null,
 *   listing_id uuid references listings not null,
 *   created_at timestamp default timezone('utc'::text, now()) not null,
 *   unique(user_id, listing_id)
 * );
 *
 * -- Enable Row Level Security
 * alter table listings enable row level security;
 * alter table profiles enable row level security;
 * alter table saved_listings enable row level security;
 *
 * -- RLS Policies
 * -- Listings: public can read active listings
 * create policy "Public can view active listings" on listings for select using (status = 'active');
 * -- Users can manage their own listings
 * create policy "Users can manage own listings" on listings for all using (auth.uid() = user_id);
 * -- Profiles: public can read
 * create policy "Public profiles are visible" on profiles for select using (true);
 * -- Users can update own profile
 * create policy "Users can manage own profile" on profiles for all using (auth.uid() = id);
 * -- Saved listings: users manage their own
 * create policy "Users manage own saved listings" on saved_listings for all using (auth.uid() = user_id);
 *
 * -- Triggers
 * create trigger handle_new_user for each row on profiles
 *   after insert on profiles for each row
 *   execute function ensure_profile_exists();
 *
 * -- Functions
 * create function increase_views() returns trigger as $$
 * begin
 *   update listings set views = views + 1 where id = NEW.listing_id;
 *   return NEW;
 * end;
 * $$ language plpgsql;
 */