-- has_role becomes invoker-rights: signed-in users can read their own rows
-- in public.user_roles, which is all policies checking auth.uid() need.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Rate-limit helper is not used by any policy; it is only called by trusted
-- server code. Drop it from the exposed API schema entirely.
DROP FUNCTION IF EXISTS public.can_submit_enquiry(text);

-- Trigger-only function: not callable through the API.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;