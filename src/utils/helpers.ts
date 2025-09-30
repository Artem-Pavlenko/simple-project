import type { User } from "@supabase/supabase-js";

export const parseUserData = (user: User) => ({
  id: user.id,
  email: user.email,
  firstName: user.user_metadata?.firstName,
  lastName: user.user_metadata?.lastName,
});
