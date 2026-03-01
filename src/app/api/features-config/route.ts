import { NextResponse } from 'next/server';

export async function GET() {
  const featuresApiKey = process.env.FEATURES_API;
  
  if (!featuresApiKey) {
    return NextResponse.json({ error: 'Features API key not configured' }, { status: 500 });
  }

  return NextResponse.json({
    apiKey: featuresApiKey,
    slug: 'prepsy'
  });
}
