import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ejejlzydraljhrhcnvqe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZWpsenlkcmFsamhyaGNudnFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODM4NzIsImV4cCI6MjA4ODI1OTg3Mn0.g32YPutod8tKwjqk7_tamnnfHq1HybeYRVEIFXkeEjo'

export const supabase = createClient(supabaseUrl, supabaseKey)