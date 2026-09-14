import { createContext, useCallback, useContext, useState } from "react";
import { registerUser, loginUser } from "../api/auth";

const AuthContext = createContext(null);

const TOKEN_KEY = "modimal_token";
const USER_KEY = "modimal_user";

/**
 * Wrap your app with this provider so any component can check who's
 * logged in, or call login()/register()/logout(). The token and user
 * are saved to localStorage so a page refresh doesn't log you out.
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const persistSession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const register = useCallback(async ({ name, email, password }) => {
    const data = await registerUser({ name, email, password });
    persistSession(data);
    return data;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await loginUser({ email, password });
    persistSession(data);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isLoggedIn: !!token,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
};

export default AuthContext;