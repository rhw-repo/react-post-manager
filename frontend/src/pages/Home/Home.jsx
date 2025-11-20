import { useEffect, useMemo } from "react";
import { useMaterialsContext } from "../../hooks/useMaterialsContext.jsx";
import { useAuthContext } from "../../hooks/useAuthContext.jsx";
import styles from "./Home.module.css";
import Table from "./Table.jsx";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary.jsx";

const Home = () => {
  const { materials, dispatch } = useMaterialsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchMaterials = async () => {
      const base = import.meta.env.VITE_RAILWAY_BACKEND_URL;
      const response = await fetch(`${base}/api/materials`, {
        credentials: "include",
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_MATERIALS", payload: json });
      }
    };

    if (user) {
      fetchMaterials();
    }
  }, [dispatch, user]);

  const data = useMemo(() => materials, [materials]);

  if (!data) {
    return;
  }

  return (
    <>
      <ErrorBoundary>
        <div className={styles.home}>
          <Table data={data} />
        </div>
        <div></div>
      </ErrorBoundary>
    </>
  );
};

export default Home;
