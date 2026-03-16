import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./auth-context";

const DEMO_USERS_KEY = "demo_users";
const TOKEN_KEY = "token";
const USER_KEY = "user";

const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  axios.defaults.headers.common["x-auth-token"] = token;
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  delete axios.defaults.headers.common["x-auth-token"];
};

const getDemoUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveDemoUsers = (users) => {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }

    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      const nextToken = response.data?.token;
      const nextUser = response.data?.user;

      saveSession(nextToken, nextUser);
      setToken(nextToken);
      setUser(nextUser);
      toast.success("Signed in successfully!");
      return true;
    } catch (error) {
      const demoUser = getDemoUsers().find(
        (entry) => entry.email === email && entry.password === password,
      );

      if (demoUser) {
        const nextToken = `demo-token-${Date.now()}`;
        const nextUser = {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
        };

        saveSession(nextToken, nextUser);
        setToken(nextToken);
        setUser(nextUser);
        toast.success("Signed in using local demo data.");
        return true;
      }

      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        },
      );

      const nextToken = response.data?.token;
      const nextUser = response.data?.user;

      saveSession(nextToken, nextUser);
      setToken(nextToken);
      setUser(nextUser);
      toast.success("Account created successfully!");
      return true;
    } catch {
      const demoUsers = getDemoUsers();

      if (demoUsers.some((entry) => entry.email === email)) {
        toast.error("An account with this email already exists.");
        return false;
      }

      const nextDemoUser = {
        id: `demo-user-${Date.now()}`,
        name,
        email,
        password,
      };

      saveDemoUsers([...demoUsers, nextDemoUser]);

      const nextToken = `demo-token-${Date.now()}`;
      const nextUser = {
        id: nextDemoUser.id,
        name: nextDemoUser.name,
        email: nextDemoUser.email,
      };

      saveSession(nextToken, nextUser);
      setToken(nextToken);
      setUser(nextUser);
      toast.success("Account created using local demo data.");
      return true;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
    toast.success("Signed out.");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
