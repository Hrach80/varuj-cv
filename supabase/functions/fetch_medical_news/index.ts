// supabase/functions/fetch_medical_news/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req: Request) => { // ՓՈՓՈԽԵԼ req-ը req: Request-ի
  try {
    // Կանչում ենք ապահով պահպանված բանալին (Secrets)
    // Մենք ենթադրում ենք, որ NEWSDATA_API_KEY-ն արդեն դրված է
    const NEWSDATA_API_KEY = Deno.env.get('NEWSDATA_API_KEY')

    if (!NEWSDATA_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Կազմում ենք NewsData.io-ի հարցման URL-ը
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&category=health&language=en`

    // Կատարում ենք հարցումը դեպի NewsData.io
    const response = await fetch(url)
    const data = await response.json()

    // Վերադարձնում ենք տվյալները React-ին (CORS-ի հետ)
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        // CORS կարգավորում, որպեսզի React-ը կարողանա կանչել այն
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
      },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})