import React from "react";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// const auth = getAuth();

import { auth } from "../.././config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export function useAuthentication() {
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setUser(user);
        } else {
          // User is signed out
          setUser(undefined);
        }
      }
    );

    return unsubscribeFromAuthStatusChanged;
  }, []);

  return {
    user,
  };
}
