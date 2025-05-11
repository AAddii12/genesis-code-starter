
-- Function to get a user's theme preference
CREATE OR REPLACE FUNCTION public.get_user_theme(userid UUID)
RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_theme VARCHAR;
BEGIN
  SELECT theme INTO user_theme FROM public.user_preferences WHERE user_id = userid;
  RETURN user_theme;
END;
$$;

-- Function to set a user's theme preference
CREATE OR REPLACE FUNCTION public.set_user_theme(userid UUID, user_theme VARCHAR)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id, theme, updated_at)
  VALUES (userid, user_theme, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    theme = user_theme,
    updated_at = now();
END;
$$;
