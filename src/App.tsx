import { useEffect, useState } from "react";

import { supabase } from "./supabaseClient";
import { UserPanel } from "./pages/UserPanel";
import { SignInForm, SignUpForm } from "./components";

function App() {
  const [userEmail, setUserEmail] = useState<string | undefined>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && data.session.user) {
        setUserEmail(data.session.user?.email);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? undefined);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return userEmail ? (
    <UserPanel
      userEmail={userEmail}
      onSignOut={() => setUserEmail(undefined)}
    />
  ) : (
    <div>
      <SignUpForm />
      <SignInForm onLoginSuccess={() => {}} />
    </div>
  );
}

export default App;
