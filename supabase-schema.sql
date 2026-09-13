-- ====================================================================
-- JOSH RAMBO BDIX Bypass™ — Production Supabase Schema & Strict RLS
-- Brand: JOSH RAMBO BDIX Bypass™ | Faster Bangladesh Together
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ADMINS TABLE
-- Stores authorized administrators mapped to Supabase auth.users(id)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('editor', 'admin', 'super_admin')) DEFAULT 'admin',
    status TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    internet_speed TEXT NOT NULL DEFAULT '30 Mbps',
    service_speed TEXT NOT NULL DEFAULT '3.75 Mbps',
    price TEXT NOT NULL,
    duration TEXT NOT NULL DEFAULT '24 Hours',
    description TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    badge TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Network',
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'important')) DEFAULT 'info',
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email TEXT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- HELPER FUNCTIONS FOR SECURITY & AUTHORIZATION (SECURITY DEFINER)
-- ====================================================================

-- Check if current authenticated user has active editor, admin, or super_admin role
CREATE OR REPLACE FUNCTION public.is_active_editor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admins
        WHERE user_id = auth.uid()
          AND status = 'active'
          AND role IN ('editor', 'admin', 'super_admin')
    );
$$;

-- Check if current authenticated user is an active admin or super_admin
CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admins
        WHERE user_id = auth.uid()
          AND status = 'active'
          AND role IN ('admin', 'super_admin')
    );
$$;

-- Check if current authenticated user is an active super administrator
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admins
        WHERE user_id = auth.uid()
          AND status = 'active'
          AND role = 'super_admin'
    );
$$;

-- Helper to log admin actions automatically
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_action TEXT,
    p_table TEXT,
    p_record_id TEXT DEFAULT NULL,
    p_meta JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_email TEXT;
BEGIN
    SELECT email INTO v_admin_email FROM public.admins WHERE user_id = auth.uid();
    INSERT INTO public.admin_audit_logs(admin_user_id, admin_email, action, table_name, record_id, metadata)
    VALUES (auth.uid(), v_admin_email, p_action, p_table, p_record_id, p_meta);
END;
$$;

-- ====================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ====================================================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- RLS POLICIES: ADMINS TABLE
-- ====================================================================
-- Authenticated users can read their own admin record to resolve role/status.
-- Super admins can view the full administrator roster.
CREATE POLICY "Admins read self or super_admins read all"
ON public.admins
FOR SELECT
USING (
    user_id = auth.uid() 
    OR public.is_super_admin()
);

-- Only super admins can insert new admins
CREATE POLICY "Super admins can create admins"
ON public.admins
FOR INSERT
WITH CHECK (public.is_super_admin());

-- Only super admins can update admins (preventing self-promotion or status tampering by normal admins)
CREATE POLICY "Super admins can update admins"
ON public.admins
FOR UPDATE
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- Only super admins can delete admins
CREATE POLICY "Super admins can delete admins"
ON public.admins
FOR DELETE
USING (public.is_super_admin());

-- ====================================================================
-- RLS POLICIES: PACKAGES TABLE
-- ====================================================================
-- Public read only for active packages; staff can read all
CREATE POLICY "Public read active packages"
ON public.packages
FOR SELECT
USING (status = 'active' OR public.is_active_editor());

-- Editor/Admin insert packages
CREATE POLICY "Staff insert packages"
ON public.packages
FOR INSERT
WITH CHECK (public.is_active_editor());

-- Editor/Admin update packages
CREATE POLICY "Staff update packages"
ON public.packages
FOR UPDATE
USING (public.is_active_editor())
WITH CHECK (public.is_active_editor());

-- Only Admin / Super Admin can delete packages
CREATE POLICY "Admin delete packages"
ON public.packages
FOR DELETE
USING (public.is_active_admin());

-- ====================================================================
-- RLS POLICIES: SERVICES TABLE
-- ====================================================================
CREATE POLICY "Public read active services"
ON public.services
FOR SELECT
USING (status = 'active' OR public.is_active_editor());

CREATE POLICY "Staff insert services"
ON public.services
FOR INSERT
WITH CHECK (public.is_active_editor());

CREATE POLICY "Staff update services"
ON public.services
FOR UPDATE
USING (public.is_active_editor())
WITH CHECK (public.is_active_editor());

CREATE POLICY "Admin delete services"
ON public.services
FOR DELETE
USING (public.is_active_admin());

-- ====================================================================
-- RLS POLICIES: FAQS TABLE
-- ====================================================================
CREATE POLICY "Public read active faqs"
ON public.faqs
FOR SELECT
USING (status = 'active' OR public.is_active_editor());

CREATE POLICY "Staff insert faqs"
ON public.faqs
FOR INSERT
WITH CHECK (public.is_active_editor());

CREATE POLICY "Staff update faqs"
ON public.faqs
FOR UPDATE
USING (public.is_active_editor())
WITH CHECK (public.is_active_editor());

CREATE POLICY "Admin delete faqs"
ON public.faqs
FOR DELETE
USING (public.is_active_admin());

-- ====================================================================
-- RLS POLICIES: ANNOUNCEMENTS TABLE
-- ====================================================================
CREATE POLICY "Public read active announcements"
ON public.announcements
FOR SELECT
USING (
    (status = 'active' 
     AND (start_date IS NULL OR start_date <= timezone('utc'::text, now())) 
     AND (end_date IS NULL OR end_date >= timezone('utc'::text, now())))
    OR public.is_active_editor()
);

CREATE POLICY "Staff insert announcements"
ON public.announcements
FOR INSERT
WITH CHECK (public.is_active_editor());

CREATE POLICY "Staff update announcements"
ON public.announcements
FOR UPDATE
USING (public.is_active_editor())
WITH CHECK (public.is_active_editor());

CREATE POLICY "Admin delete announcements"
ON public.announcements
FOR DELETE
USING (public.is_active_admin());

-- ====================================================================
-- RLS POLICIES: SETTINGS TABLE
-- ====================================================================
CREATE POLICY "Public read public settings"
ON public.settings
FOR SELECT
USING (is_public = true OR public.is_active_admin());

CREATE POLICY "Admin insert settings"
ON public.settings
FOR INSERT
WITH CHECK (public.is_active_admin());

CREATE POLICY "Admin update settings"
ON public.settings
FOR UPDATE
USING (public.is_active_admin())
WITH CHECK (public.is_active_admin());

CREATE POLICY "Admin delete settings"
ON public.settings
FOR DELETE
USING (public.is_active_admin());

-- ====================================================================
-- RLS POLICIES: AUDIT LOGS TABLE
-- ====================================================================
-- Only Super Admins can view audit logs
CREATE POLICY "Super admin view audit logs"
ON public.admin_audit_logs
FOR SELECT
USING (public.is_super_admin());

-- Active staff (editors, admins, super admins) can insert audit logs for their own actions
CREATE POLICY "Staff insert audit logs"
ON public.admin_audit_logs
FOR INSERT
WITH CHECK (
    public.is_active_editor() 
    AND (admin_user_id = auth.uid() OR admin_user_id IS NULL)
);

-- Audit logs are strictly immutable: NO UPDATE or DELETE policies are granted to anyone!

-- ====================================================================
-- SEED DEFAULT SETTINGS
-- ====================================================================
INSERT INTO public.settings (key, value, is_public)
VALUES
    ('brand_name', 'JOSH RAMBO BDIX Bypass™', true),
    ('short_brand_name', 'JOSH RAMBO', true),
    ('tagline', 'Faster Bangladesh Together', true),
    ('hero_title', 'দীর্ঘ ৩ বছরের বেশি সময় সফলতার সাথে BDIX বাইপাস প্রোভাইড করে যাচ্ছি।', true),
    ('hero_description', 'Bufferless experience এর জন্য JOSH RAMBO BDIX Bypass™-এর সাথে যোগাযোগ করুন।', true),
    ('about_text', 'দীর্ঘ ৩ বছরের বেশি সময় ধরে JOSH RAMBO BDIX Bypass™ BDIX Bypass connectivity এবং networking experience নিয়ে কাজ করে আসছে। আমাদের লক্ষ্য হলো ব্যবহারকারীদের জন্য একটি stable, smooth এবং better streaming experience তৈরি করা।', true),
    ('support_text', 'সরাসরি সাপোর্ট ও সার্ভিসের তথ্যের জন্য আমাদের অফিসিয়াল টেলিগ্রাম বা মেসেঞ্জারে যোগাযোগ করুন।', true),
    ('telegram_url', 'https://t.me/joshvhai', true),
    ('telegram_username', '@joshvhai', true),
    ('telegram_group_url', 'https://t.me/josharmy007', true),
    ('facebook_url', 'https://www.fb.com/joshrambo007', true),
    ('footer_text', 'দীর্ঘ ৩ বছরের বেশি সময় সফলতার সাথে BDIX বাইপাস প্রোভাইড করে যাচ্ছি।', true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ====================================================================
-- SEED INITIAL SERVICES
-- ====================================================================
INSERT INTO public.services (title, description, icon, status, sort_order)
VALUES
    ('BDIX Bypass', 'Reliable BDIX Bypass connectivity for a smoother online experience.', 'Network', 'active', 1),
    ('Streaming Optimized', 'Optimized connectivity for better streaming and reduced buffering.', 'PlayCircle', 'active', 2),
    ('Network Optimization', 'Smart routing and connectivity optimization for improved performance.', 'Cpu', 'active', 3),
    ('Stable Connectivity', 'Focus on consistent and reliable network performance.', 'ShieldCheck', 'active', 4),
    ('Technical Support', 'Direct support through our official communication channels.', 'Headphones', 'active', 5),
    ('Custom Solution', 'Networking solutions based on individual requirements.', 'Settings2', 'active', 6)
ON CONFLICT DO NOTHING;

-- ====================================================================
-- SEED INITIAL PACKAGES (8 JOSH RAMBO PACKAGES)
-- ====================================================================
INSERT INTO public.packages (name, internet_speed, service_speed, price, duration, description, features, badge, status, sort_order)
VALUES
    ('SKY', '30 Mbps', '3.75 Mbps', '75', '24 Hours', 'দৈনন্দিন ব্রাউজিং ও এন্ট্রি-লেভেল BDIX বাইপাস কানেক্টিভিটি।', '["YouTube 30 Mbps", "Facebook 30 Mbps", "Steam / Epic ETC 30 Mbps", "BDIX / Streaming 3.75 Mbps", "Bufferless Experience", "Standard Telegram Support"]'::jsonb, 'Starter', 'active', 1),
    ('MOON', '40 Mbps', '5.00 Mbps', '90', '24 Hours', 'সোশ্যাল মিডিয়া ও স্মুথ ভিডিও স্ট্রিমিংয়ের জন্য উপযুক্ত প্যাকেজ।', '["YouTube 40 Mbps", "Facebook 40 Mbps", "Steam / Epic ETC 40 Mbps", "BDIX / Streaming 5.00 Mbps", "Low Jitter & Latency", "Direct Telegram Support"]'::jsonb, 'Standard', 'active', 2),
    ('SUN', '50 Mbps', '6.25 Mbps', '110', '24 Hours', 'দিনভর নিরবচ্ছিন্ন ব্রাউজিং ও লাইট এইচডি স্ট্রিমিং নিশ্চয়তা।', '["YouTube 50 Mbps", "Facebook 50 Mbps", "Steam / Epic ETC 50 Mbps", "BDIX / Streaming 6.25 Mbps", "Bufferless HD Streaming", "Fast CDN Routing Acceleration"]'::jsonb, 'Popular', 'active', 3),
    ('WORLD', '100 Mbps', '12.5 Mbps', '170', '24 Hours', 'আন্তর্জাতিক ও লোকাল কন্টেন্টে ব্যালেন্সড গ্লোবাল রাউটিং।', '["YouTube 100 Mbps", "Facebook 100 Mbps", "Steam / Epic ETC 100 Mbps", "BDIX / Streaming 12.5 Mbps", "Global Route Balancing", "Multi-Server Failover Support"]'::jsonb, 'Recommended', 'active', 4),
    ('SONIC', '20 Mbps', '2.50 Mbps', '80', '24 Hours', 'হাই-স্পিড টার্বো ট্রাফিক ও বাফারলেস মাল্টিমিডিয়া অভিজ্ঞতা।', '["YouTube 20 Mbps", "Facebook 20 Mbps", "Steam / Epic ETC 20 Mbps", "BDIX / Streaming 2.50 Mbps", "Sonic Speed Acceleration", "Low Latency Optimization"]'::jsonb, 'Turbo', 'active', 5),
    ('LIGHT', '30 Mbps', '3.75 Mbps', '110', '24 Hours', 'আল্ট্রা-লাইট প্যাকেট রাউটিং ও স্মুথ গেমিং/স্ট্রিমিং পারফরম্যান্স।', '["YouTube 30 Mbps", "Facebook 30 Mbps", "Steam / Epic ETC 30 Mbps", "BDIX / Streaming 3.75 Mbps", "Ultra Low Ping & Jitter", "Dedicated Routing Nodes"]'::jsonb, 'Pro Gamer', 'active', 6),
    ('MOTION', '50 Mbps', '6.25 Mbps', '150', '24 Hours', 'ডাইনামিক ট্রাফিক ম্যানেজমেন্ট এবং 4K আল্ট্রা এইচডি স্ট্রিমিং।', '["YouTube 50 Mbps", "Facebook 50 Mbps", "Steam / Epic ETC 50 Mbps", "BDIX / Streaming 6.25 Mbps", "Dynamic Traffic Steering", "High Bandwidth Optimization"]'::jsonb, 'High Performance', 'active', 7),
    ('S25 ULTRA', '100 Mbps', '12.5 Mbps', '240', '24 Hours', 'সর্বোচ্চ ফ্ল্যাগশিপ পারফরম্যান্স, ডেডিকেটেড ভিআইপি রাউটিং ও সাপোর্ট।', '["YouTube 100 Mbps", "Facebook 100 Mbps", "Steam / Epic ETC 100 Mbps", "BDIX / Streaming 12.5 Mbps", "Flagship Ultra Dedicated Line", "Zero Buffering Guarantee"]'::jsonb, 'Flagship', 'active', 8)
ON CONFLICT DO NOTHING;

-- ====================================================================
-- SEED INITIAL FAQS
-- ====================================================================
INSERT INTO public.faqs (question, answer, status, sort_order)
VALUES
    ('BDIX Bypass কী?', 'BDIX Bypass হলো একটি নেটওয়ার্কিং টেকনোলজি যার মাধ্যমে ট্রাফিক অপ্টিমাইজড রুটে রিডাইরেক্ট করে নির্ভরযোগ্য এবং বাফারলেস কানেক্টিভিটি নিশ্চিত করা হয়।', 'active', 1),
    ('JOSH RAMBO BDIX Bypass™ কতদিন ধরে সার্ভিস দিচ্ছে?', 'দীর্ঘ ৩ বছরের বেশি সময় সফলতার সাথে আমরা BDIX বাইপাস প্রোভাইড করে আসছি।', 'active', 2),
    ('কিভাবে সার্ভিস নিতে পারি?', 'সার্ভিস নিতে আমাদের অফিসিয়াল টেলিগ্রাম (@joshvhai) বা মেসেঞ্জারে সরাসরি মেসেজ করুন।', 'active', 3),
    ('কিভাবে Support পাবো?', 'আমাদের অফিসিয়াল টেলিগ্রাম (@joshvhai) এবং টেলিগ্রাম গ্রুপ (t.me/josharmy007)-এ সরাসরি টেকনিক্যাল সাপোর্ট প্রদান করা হয়।', 'active', 4),
    ('কোন নেটওয়ার্কে ব্যবহার করা যাবে?', 'বাংলাদেশের যেকোনো স্ট্যান্ডার্ড ব্রডব্যান্ড বা মোবাইল নেটওয়ার্কে সহজে কনফিগার করে ব্যবহার করা সম্ভব।', 'active', 5)
ON CONFLICT DO NOTHING;

-- ====================================================================
-- INSTRUCTIONS TO PROMOTE FIRST SUPER ADMIN:
-- 1. Create a user via Supabase Auth (Sign Up in Dashboard or Auth panel).
-- 2. Execute in SQL Editor:
--    INSERT INTO public.admins (user_id, email, role, status)
--    SELECT id, email, 'super_admin', 'active'
--    FROM auth.users
--    WHERE email = 'YOUR_ADMIN_EMAIL@example.com';
-- ====================================================================
