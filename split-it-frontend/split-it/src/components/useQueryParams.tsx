// Importing React utilities
import { useEffect, useState } from "react";

function useQueryParams() {
  const [params, setParams] = useState(
    new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handlePopstate = () => {
      setParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const getQueryParam = (key: string) => {
    return params.get(key);
  };

  return {
    params,
    getQueryParam,
  };
}

export default useQueryParams;
