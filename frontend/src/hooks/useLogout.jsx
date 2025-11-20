import { useAuthContext } from "./useAuthContext";
import { useMaterialsContext } from "./useMaterialsContext";
import { useState } from "react";
import debug from "debug";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchMaterials } = useMaterialsContext();
  const [logoutError, setLogoutError] = useState(null);
  const log = debug("useLogout:error");

  const logout = async () => {
    try {
      const base = import.meta.env.VITE_RAILWAY_BACKEND_URL;
      const response = await fetch(`${base}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      // Prevent persistence after logout
      localStorage.removeItem("allTags");

      dispatch({ type: "LOGOUT" });
      dispatchMaterials({ type: "SET_MATERIALS", payload: null });
    } catch (error) {
      setLogoutError("An error occured. Please try again");
      log("Logout error: ", error);
    }
  };

  return { logout, logoutError };
};
