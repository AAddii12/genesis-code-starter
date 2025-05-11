
-- Drop theme-related RPC functions
DROP FUNCTION IF EXISTS public.get_user_theme;
DROP FUNCTION IF EXISTS public.set_user_theme;

-- Drop the user_preferences table
DROP TABLE IF EXISTS public.user_preferences;
