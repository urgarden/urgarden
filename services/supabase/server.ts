import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ymwtljnsuraanqirfbxj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltd3Rsam5zdXJhYW5xaXJmYnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NTU5NDIsImV4cCI6MjA1ODAzMTk0Mn0.nvWInpRQz0Ne-LmCC5BWzvmGOQ5rF_Ql7py2VxmGojA";

export const supabaseServerClient = createClient(supabaseUrl, supabaseKey);
