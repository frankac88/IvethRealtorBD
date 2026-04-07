
DROP POLICY "No public read access" ON public.leads;

CREATE POLICY "Authenticated users can read leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (true);
