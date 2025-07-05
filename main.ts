import { Hono } from 'hono'
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;

const supabase = createClient(supabaseUrl, supabaseKey);

const app = new Hono();

app.get("/", async (c) => {
  const { data, error } = await supabase.from("charms").select("*");

  if (error) {
    return c.json({ error }, 500);
  }

  return c.json(data);
});

Deno.serve(app.fetch);
