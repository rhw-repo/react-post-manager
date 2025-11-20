import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  /* Control display
    error messages when redundant in Signup*/
  const clearError = () => {
    setError(null);
  };

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);
    const base = import.meta.env.VITE_RAILWAY_BACKEND_URL;
    const response = await fetch(`${base}/api/user/signup`, {
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

    if (response.ok) {
      dispatch({ type: "LOGIN", payload: json.user });
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error, clearError };
};
