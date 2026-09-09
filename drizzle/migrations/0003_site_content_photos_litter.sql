CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  locale text NOT NULL,
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (locale, key)
);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site content"
  ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site content"
  ON public.site_content FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.site_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot text NOT NULL,
  url text NOT NULL,
  caption text,
  alt text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX site_photos_slot_idx ON public.site_photos (slot, sort_order);

GRANT SELECT ON public.site_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_photos TO authenticated;
GRANT ALL ON public.site_photos TO service_role;

ALTER TABLE public.site_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site photos"
  ON public.site_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site photos"
  ON public.site_photos FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.litters ADD COLUMN status text NOT NULL DEFAULT 'planning';
ALTER TABLE public.litters ADD COLUMN headline_ru text;
ALTER TABLE public.litters ADD COLUMN body_ru text;
ALTER TABLE public.litters ADD COLUMN headline_en text;
ALTER TABLE public.litters ADD COLUMN body_en text;
ALTER TABLE public.litters ADD COLUMN timing_label_ru text;
ALTER TABLE public.litters ADD COLUMN timing_label_en text;
ALTER TABLE public.litters ADD COLUMN is_published boolean NOT NULL DEFAULT false;
ALTER TABLE public.litters ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

GRANT SELECT ON public.litters TO anon;

CREATE POLICY "Public can read published litter"
  ON public.litters FOR SELECT TO anon, authenticated USING (is_published = true);

CREATE POLICY "Storage admins manage site media"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'site-media' AND has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'site-media' AND has_role(auth.uid(), 'admin'::app_role));
