-- ============================================
-- Supabase Functions untuk Waste Care App
-- ============================================
-- 
-- File ini berisi SQL functions yang perlu dibuat di Supabase
-- untuk mengatasi masalah RLS dan permission issues
--
-- Cara menggunakan:
-- 1. Buka Supabase Dashboard
-- 2. Go to SQL Editor
-- 3. Copy-paste function yang dibutuhkan
-- 4. Execute
-- ============================================

-- Function 1: Add EXP to user profile
-- Menambahkan EXP ke user dengan aman, menangani race conditions
CREATE OR REPLACE FUNCTION add_exp_to_profile(
  user_id UUID,
  exp_amount BIGINT
)
RETURNS TABLE(new_exp BIGINT, success BOOLEAN) 
LANGUAGE plpgsql
SECURITY DEFINER -- Run dengan privileges dari function creator
AS $$
DECLARE
  current_exp BIGINT;
  updated_exp BIGINT;
BEGIN
  -- Lock row untuk mencegah race conditions
  SELECT exp INTO current_exp
  FROM profiles
  WHERE id = user_id
  FOR UPDATE;

  -- Jika profile tidak ada, buat baru
  IF NOT FOUND THEN
    INSERT INTO profiles (id, exp)
    VALUES (user_id, exp_amount)
    ON CONFLICT (id) DO UPDATE SET exp = profiles.exp + exp_amount
    RETURNING exp INTO updated_exp;
    
    RETURN QUERY SELECT updated_exp, TRUE;
    RETURN;
  END IF;

  -- Update exp yang sudah ada
  updated_exp := current_exp + exp_amount;
  
  UPDATE profiles
  SET exp = updated_exp
  WHERE id = user_id;

  RETURN QUERY SELECT updated_exp, TRUE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_exp_to_profile(UUID, BIGINT) TO authenticated;

-- ============================================
-- Function 2: Ensure profile exists
-- Membuat profile jika belum ada, tidak error jika sudah ada
CREATE OR REPLACE FUNCTION ensure_profile_exists(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$   
BEGIN
  INSERT INTO profiles (id, exp)
  VALUES (user_id, 0)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION ensure_profile_exists(UUID) TO authenticated;

-- ============================================
-- Function 3: Get user exp safely
-- Mendapatkan EXP user, return 0 jika profile tidak ada
CREATE OR REPLACE FUNCTION get_user_exp(user_id UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_exp BIGINT;
BEGIN
  SELECT exp INTO user_exp
  FROM profiles
  WHERE id = user_id;
  
  RETURN COALESCE(user_exp, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION get_user_exp(UUID) TO authenticated;

-- ============================================
-- TESTING
-- Gunakan queries ini untuk test functions
-- ============================================

-- Test 1: Ensure profile exists
-- SELECT ensure_profile_exists(auth.uid());

-- Test 2: Add EXP
-- SELECT * FROM add_exp_to_profile(auth.uid(), 100);

-- Test 3: Get current EXP
-- SELECT get_user_exp(auth.uid());

-- Test 4: Add EXP multiple times
-- SELECT * FROM add_exp_to_profile(auth.uid(), 50);
-- SELECT * FROM add_exp_to_profile(auth.uid(), 50);
-- SELECT get_user_exp(auth.uid()); -- Should be 200

-- ============================================
-- RLS POLICIES (PENTING! HARUS DI-SETUP)
-- ============================================
-- Tanpa RLS policies yang benar, user tidak bisa update/insert profile mereka
-- RLS memastikan user hanya bisa akses data mereka sendiri

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy untuk SELECT (READ)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy untuk INSERT (CREATE)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy untuk UPDATE (MODIFY)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy untuk DELETE (optional, biasanya tidak diperlukan)
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
USING (auth.uid() = id);

-- ============================================
-- VERIFY RLS POLICIES
-- Jalankan query ini untuk memastikan policies sudah benar
-- ============================================

-- Check all policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Expected output:
-- 1. "Users can view own profile" - SELECT - USING: (auth.uid() = id)
-- 2. "Users can insert own profile" - INSERT - WITH CHECK: (auth.uid() = id)
-- 3. "Users can update own profile" - UPDATE - USING: (auth.uid() = id), WITH CHECK: (auth.uid() = id)
-- 4. "Users can delete own profile" - DELETE - USING: (auth.uid() = id)

-- ============================================
-- TROUBLESHOOTING: Test Manual Update
-- Gunakan ini untuk test apakah RLS policies bekerja
-- ============================================

-- Test 1: Check if you can read your own profile
-- SELECT * FROM profiles WHERE id = auth.uid();

-- Test 2: Try to update your own profile
-- UPDATE profiles SET exp = exp + 100 WHERE id = auth.uid();

-- Test 3: Check the result
-- SELECT id, exp FROM profiles WHERE id = auth.uid();

-- Jika query di atas gagal atau return 0 rows, berarti:
-- 1. Profile belum dibuat untuk user
-- 2. RLS policy belum di-setup dengan benar
-- 3. User tidak authenticated

-- ============================================
-- QUICK FIX: Recreate ALL RLS Policies
-- Jalankan ini jika ada masalah dengan RLS
-- ============================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Recreate with correct permissions
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);
