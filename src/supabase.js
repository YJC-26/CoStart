import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qgcxxtkbzphpruokngdo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY3h4dGtienBocHJ1b2tuZ2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjU0MzcsImV4cCI6MjA5MzU0MTQzN30.tKcH0YyAYW-dmoHEluXkysP0VPUFlO2bPCHMfFBuqOY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


