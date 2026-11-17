-- =========================================================================
-- WHERE DID I PARK? – Smart Two-Wheeler Campus Parking Management System
-- Course: Design Thinking (INT335 P07)
-- University: Lovely Professional University (LPU), Punjab, India
-- Team: Priyanshu Raj (Lead), Ujwal Tiwari, Sagar Kumar, Om Jaiswal
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'staff', 'admin')),
    reg_number VARCHAR(30) NOT NULL UNIQUE, -- LPU Reg No e.g. 12509608
    department VARCHAR(150),
    default_vehicle_type VARCHAR(40) DEFAULT 'Motorcycle',
    default_vehicle_number VARCHAR(30),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. PARKING LOTS TABLE
CREATE TABLE IF NOT EXISTS public.parking_lots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) NOT NULL UNIQUE, -- e.g. TWB-A
    name VARCHAR(150) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    total_capacity INTEGER NOT NULL CHECK (total_capacity > 0),
    occupied_spaces INTEGER NOT NULL DEFAULT 0 CHECK (occupied_spaces >= 0),
    available_spaces INTEGER GENERATED ALWAYS AS (total_capacity - occupied_spaces) STORED,
    status VARCHAR(20) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Limited', 'Full')),
    assigned_blocks TEXT[] DEFAULT '{}',
    sections TEXT[] DEFAULT '{"A", "B", "C", "D"}',
    floor_or_zones TEXT[] DEFAULT '{"Ground Level"}',
    is_covered BOOLEAN DEFAULT TRUE,
    has_cctv BOOLEAN DEFAULT TRUE,
    has_ev_charging BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. PARKING SLOTS TABLE
CREATE TABLE IF NOT EXISTS public.parking_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lot_id UUID NOT NULL REFERENCES public.parking_lots(id) ON DELETE CASCADE,
    section VARCHAR(10) NOT NULL,
    slot_number VARCHAR(20) NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    occupied_by_reg VARCHAR(30),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(lot_id, section, slot_number)
);

-- 4. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(40) NOT NULL CHECK (type IN ('Motorcycle', 'Scooter', 'Electric Bike', 'Bicycle')),
    reg_number VARCHAR(30) NOT NULL,
    model VARCHAR(100),
    nickname VARCHAR(60),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. SAVED PARKING (CURRENT ACTIVE LOCATION)
CREATE TABLE IF NOT EXISTS public.saved_parking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(40) NOT NULL,
    reg_number VARCHAR(30) NOT NULL,
    lot_id UUID REFERENCES public.parking_lots(id) ON DELETE SET NULL,
    lot_name VARCHAR(150) NOT NULL,
    section VARCHAR(20) NOT NULL,
    slot VARCHAR(20) NOT NULL,
    floor_zone VARCHAR(60) DEFAULT 'Ground Level',
    notes TEXT,
    parked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. PARKING HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.parking_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(40) NOT NULL,
    reg_number VARCHAR(30) NOT NULL,
    lot_name VARCHAR(150) NOT NULL,
    section VARCHAR(20) NOT NULL,
    slot VARCHAR(20) NOT NULL,
    floor_zone VARCHAR(60),
    notes TEXT,
    parked_at TIMESTAMP WITH TIME ZONE NOT NULL,
    departed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL means broadcast to all
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('success', 'warning', 'info', 'danger')),
    action_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =========================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_saved_parking_user_id ON public.saved_parking(user_id);
CREATE INDEX IF NOT EXISTS idx_parking_history_user_id ON public.parking_history(user_id);
CREATE INDEX IF NOT EXISTS idx_parking_slots_lot_id ON public.parking_slots(lot_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_parking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but update only their own
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Parking Lots: Read-only for all, Admin can insert/update/delete
CREATE POLICY "Anyone can view parking lots"
ON public.parking_lots FOR SELECT USING (true);

CREATE POLICY "Admins can manage parking lots"
ON public.parking_lots FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Saved Parking: Students can see and modify only their own saved spot
CREATE POLICY "Users can view and manage their own saved parking"
ON public.saved_parking FOR ALL USING (auth.uid() = user_id);

-- Parking History: Students can see and delete only their own history
CREATE POLICY "Users can view and delete their own parking history"
ON public.parking_history FOR ALL USING (auth.uid() = user_id);

-- Notifications: Users see notifications targeted to them or broadcast (user_id IS NULL)
CREATE POLICY "Users view personal or global notifications"
ON public.notifications FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

-- =========================================================================
-- SEED INITIAL DEMO DATA (SIMULATED LPU TWO-WHEELER BAYS)
-- =========================================================================
INSERT INTO public.parking_lots (code, name, latitude, longitude, total_capacity, occupied_spaces, status, assigned_blocks, description)
VALUES 
('TWB-A', 'Two-Wheeler Bay A (Behind Block 28)', 31.2530, 75.7041, 120, 52, 'Available', ARRAY['block-27', 'block-28', 'block-library'], 'Paved, shaded two-wheeler parking with 24/7 security.'),
('TWB-B', 'Central Library Perimeter Lot (Two-Wheeler)', 31.2533, 75.7034, 90, 78, 'Limited', ARRAY['block-library', 'block-28'], 'Perimeter parking adjacent to central library steps.'),
('TWB-C', 'Block 25/26 Multi-Level Two-Wheeler Bay', 31.2545, 75.7025, 150, 150, 'Full', ARRAY['block-25', 'block-26'], 'High-density covered multi-level structure for Engineering students.'),
('TWB-D', 'Unipolis East Two-Wheeler Stand', 31.2522, 75.7048, 100, 34, 'Available', ARRAY['block-27', 'block-30'], 'Spacious lot near the Unipolis amphitheater.'),
('TWB-E', 'Block 29/30 North Wing Parking', 31.2518, 75.7054, 80, 72, 'Limited', ARRAY['block-29', 'block-30'], 'Convenient ground-level bays for Agriculture & Pharmacy.'),
('TWB-F', 'Main Academic & Auditorium Two-Wheeler Plaza', 31.2554, 75.7015, 110, 38, 'Available', ARRAY['block-main-academic', 'block-25'], 'Modern shaded lot near the main gate and Shanti Devi Mittal auditorium.')
ON CONFLICT (code) DO NOTHING;
