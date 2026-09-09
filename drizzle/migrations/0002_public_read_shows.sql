GRANT SELECT ON public.shows TO anon;

CREATE POLICY "Public can read show results"
ON public.shows
FOR SELECT
TO anon, authenticated
USING (true);