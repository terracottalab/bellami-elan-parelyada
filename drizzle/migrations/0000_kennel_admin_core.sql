-- Roles ---------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('admin', 'accountant');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Profiles ------------------------------------------------------------
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;

  -- The very first account that registers becomes the kennel administrator.
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enquiries -----------------------------------------------------------
CREATE TYPE public.enquiry_status AS ENUM ('new', 'in_progress', 'approved', 'declined');

CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  locale text NOT NULL DEFAULT 'ru',
  name text NOT NULL,
  place text NOT NULL,
  email text NOT NULL,
  preferred_contact text NOT NULL,
  handle text,
  timing text NOT NULL,
  purpose text NOT NULL,
  experience text NOT NULL,
  why_norwich text NOT NULL,
  message text,
  consent boolean NOT NULL DEFAULT false,
  status public.enquiry_status NOT NULL DEFAULT 'new',
  ip_hash text,
  user_agent text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX enquiries_created_at_idx ON public.enquiries (created_at DESC);
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff read enquiries" ON public.enquiries
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'accountant'));
CREATE POLICY "Admins update enquiries" ON public.enquiries
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete enquiries" ON public.enquiries
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.can_submit_enquiry(_ip_hash text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT count(*) FROM public.enquiries
    WHERE ip_hash = _ip_hash AND created_at > now() - interval '1 hour'
  ), 0) < 3
$$;
GRANT EXECUTE ON FUNCTION public.can_submit_enquiry(text) TO anon, authenticated;

CREATE TABLE public.enquiry_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  author_id uuid,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.enquiry_notes TO authenticated;
GRANT ALL ON public.enquiry_notes TO service_role;
ALTER TABLE public.enquiry_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read notes" ON public.enquiry_notes
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'accountant'));
CREATE POLICY "Admins write notes" ON public.enquiry_notes
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete notes" ON public.enquiry_notes
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Traffic -------------------------------------------------------------
CREATE TABLE public.page_views (
  id bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  path text NOT NULL,
  locale text,
  referrer text,
  visitor_hash text,
  device text
);
CREATE INDEX page_views_created_at_idx ON public.page_views (created_at DESC);
GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record a page view" ON public.page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff read page views" ON public.page_views
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'accountant'));

-- Litters, shows, finance ---------------------------------------------
CREATE TABLE public.litters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  planned_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.litters TO authenticated;
GRANT ALL ON public.litters TO service_role;
ALTER TABLE public.litters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read litters" ON public.litters
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'accountant'));
CREATE POLICY "Admins manage litters" ON public.litters
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  show_date date NOT NULL,
  title text NOT NULL,
  country text,
  city text,
  dog_class text,
  result text,
  awarded_title text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX shows_date_idx ON public.shows (show_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shows TO authenticated;
GRANT ALL ON public.shows TO service_role;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read shows" ON public.shows
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'accountant'));
CREATE POLICY "Admins manage shows" ON public.shows
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TYPE public.finance_direction AS ENUM ('income', 'expense');

CREATE TABLE public.finance_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date date NOT NULL DEFAULT current_date,
  direction public.finance_direction NOT NULL,
  category text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'EUR',
  description text,
  litter_id uuid REFERENCES public.litters(id) ON DELETE SET NULL,
  show_id uuid REFERENCES public.shows(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX finance_entries_date_idx ON public.finance_entries (entry_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_entries TO authenticated;
GRANT ALL ON public.finance_entries TO service_role;
ALTER TABLE public.finance_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read finance" ON public.finance_entries
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'accountant'));
CREATE POLICY "Staff manage finance" ON public.finance_entries
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'accountant'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'accountant'));