import { supabase } from './supabase';

/**
 * Test function untuk debug EXP service
 * Call this from browser console: testExpAccess()
 */
export async function testExpAccess() {
  try {
    console.log('='.repeat(50));
    console.log('🧪 TESTING EXP SERVICE');
    console.log('='.repeat(50));

    // Get current user and session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (sessionError || userError || !user || !session) {
      console.error('❌ [TEST] No user logged in:', sessionError || userError);
      return;
    }

    console.log('✅ [TEST] User authenticated');
    console.log('   User ID:', user.id);
    console.log('   Session valid:', !!session);
    console.log('   Auth UID:', session.user.id);

    // Test 1: Check if profile exists
    console.log('\n📝 Test 1: Checking if profile exists...');
    const { data: profile, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (selectError) {
      console.error('❌ [TEST] Error checking profile:', selectError);
    } else if (!profile) {
      console.warn('⚠️  [TEST] Profile not found');
    } else {
      console.log('✅ [TEST] Profile found:', profile);
    }

    // Test 2: Try to insert profile if doesn't exist
    if (!profile && !selectError) {
      console.log('\n📝 Test 2: Profile not found, trying to insert...');
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        // @ts-expect-error - Type issue
        .insert({ id: user.id, exp: 0 })
        .select()
        .maybeSingle();

      if (insertError) {
        console.error('❌ [TEST] Insert failed:', insertError);
        console.error('   Error code:', insertError.code);
        console.error('   Error message:', insertError.message);
      } else {
        console.log('✅ [TEST] Profile created:', insertData);
      }
    }

    // Test 3: Try to read profile (testing SELECT policy)
    console.log('\n📝 Test 3: Testing SELECT permission...');
    const { data: readProfile, error: readError } = await supabase
      .from('profiles')
      .select('id, exp')
      .eq('id', user.id)
      .single();

    if (readError) {
      console.error('❌ [TEST] Cannot read profile:', readError);
      console.error('   This means SELECT RLS policy is missing or incorrect');
    } else {
      console.log('✅ [TEST] Can read profile:', readProfile);
    }

    // Test 4: Try to update profile (testing UPDATE policy)
    console.log('\n📝 Test 4: Testing UPDATE permission...');
    const currentExp = readProfile ? (readProfile as any).exp || 0 : 0;
    const testExp = currentExp + 50;
    
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      // @ts-expect-error - Type issue
      .update({ exp: testExp })
      .eq('id', user.id)
      .select();

    if (updateError) {
      console.error('❌ [TEST] Cannot update profile:', updateError);
      console.error('   Error code:', updateError.code);
      console.error('   Error message:', updateError.message);
      console.error('   This means UPDATE RLS policy is missing or incorrect');
    } else if (!updateData || updateData.length === 0) {
      console.error('❌ [TEST] Update returned no rows');
      console.error('   This means UPDATE RLS policy blocked the update');
      console.error('   Check if USING and WITH CHECK conditions are correct');
    } else {
      console.log('✅ [TEST] Update successful:', updateData);
    }

    // Test 5: Verify the update
    console.log('\n📝 Test 5: Verifying update...');
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('exp')
      .eq('id', user.id)
      .single();

    if (verifyError) {
      console.error('❌ [TEST] Cannot verify update:', verifyError);
    } else {
      const finalExp = (verifyProfile as any).exp;
      console.log('✅ [TEST] Current EXP:', finalExp);
      console.log('   Expected:', testExp);
      console.log('   Match:', finalExp === testExp ? '✅ YES' : '❌ NO');
    }

    // Test 6: Check RLS policies
    console.log('\n📝 Test 6: Testing table access (other users)...');
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('id, exp')
      .limit(5);

    if (allError) {
      console.error('❌ [TEST] Cannot query profiles:', allError);
    } else {
      console.log('✅ [TEST] Can access profiles, count:', allProfiles?.length);
      console.log('   Note: You should only see your own profile due to RLS');
      console.log('   Profiles:', allProfiles);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log('✅ Authenticated:', !!user);
    console.log(profile ? '✅' : '❌', 'Profile exists');
    console.log(readProfile ? '✅' : '❌', 'Can read profile (SELECT)');
    console.log((updateData && updateData.length > 0) ? '✅' : '❌', 'Can update profile (UPDATE)');
    
    console.log('\n💡 NEXT STEPS:');
    if (!profile || !readProfile) {
      console.log('1. Run the SQL from supabase-functions.sql to create RLS policies');
      console.log('2. Make sure RLS is enabled on profiles table');
      console.log('3. Check that profile exists for this user');
    } else if (!updateData || updateData.length === 0) {
      console.log('1. UPDATE RLS policy is blocking updates');
      console.log('2. Run QUICK FIX section from supabase-functions.sql');
      console.log('3. Make sure USING and WITH CHECK both use: auth.uid() = id');
    } else {
      console.log('✅ Everything looks good! EXP system should work.');
    }
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ [TEST] Unexpected error:', error);
  }
}

// Export to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).testExpAccess = testExpAccess;
  console.log('💡 Run testExpAccess() in console to debug EXP issues');
}
