import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  /* Control display 
    error messages when redundant in Login*/
  const clearError = () => {
    setError(null);
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    const base = import.meta.env.VITE_RAILWAY_BACKEND_URL;
    if (!base) console.error("🛑 Missing VITE_RAILWAY_BACKEND_URL");
    const response = await fetch(`${base}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      return;
    }

    dispatch({ type: "LOGIN", payload: json.user });

    setIsLoading(false);
  };

  return { login, isLoading, error, clearError };
};
