import { NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ 
      success: false, 
      message: 'Supabase not configured',
      deleted: 0 
    }, { status: 503 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ 
      success: false, 
      message: 'Supabase unavailable',
      deleted: 0 
    }, { status: 503 });
  }

  try {
    // Delete expired listings (status = 'expired' or expires_at < now)
    const { data, error } = await supabase
      .from('listings')
      .delete()
      .or(`status.eq.expired,expires_at.lt.${new Date().toISOString()}`)
      .select('id');

    if (error) {
      console.error('Cleanup error:', error);
      return NextResponse.json({ 
        success: false, 
        message: error.message,
        deleted: 0 
      }, { status: 400 });
    }

    const deletedCount = data?.length || 0;

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deletedCount} expired listings`,
      deleted: deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Cleanup exception:', err);
    return NextResponse.json({
      success: false,
      message: err instanceof Error ? err.message : 'Unknown error',
      deleted: 0,
    }, { status: 500 });
  }
}