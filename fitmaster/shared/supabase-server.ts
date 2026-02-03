import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

export const supabaseAdmin = supabaseUrl && supabaseUrl !== 'your_supabase_url' && supabaseServiceKey && supabaseServiceKey !== 'your_service_key'
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null as any