// context/AuthContext.jsx
import { createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuthQueries";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export function useAuthProvider() {
  const authContext = useContext(AuthContext);
  if (authContext === undefined) {
    throw new Error("useAuthProvider must be used within AuthProvider");
  }
  return authContext;
}

export default AuthProvider;
