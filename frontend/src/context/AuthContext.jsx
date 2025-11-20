import { createContext, useReducer, useEffect } from "react";
import debug from "debug";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const log = debug("AuthContext:error");
    const base = import.meta.env.VITE_RAILWAY_BACKEND_URL;
    fetch(`${base}/api/user/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not authenticated");
        }
        return res.json();
      })

      .then((data) => {
        dispatch({ type: "LOGIN", payload: data.user });
      })
      .catch((err) => {
        log("Failed to fetch authenticated user:", err);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
