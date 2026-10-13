import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const database = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
    ? 'configured'
    : 'not_configured';

  return NextResponse.json({
    status: 'healthy',
    database,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}