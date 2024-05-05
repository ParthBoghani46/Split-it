/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export function useMediaQuery(query: any) {
  const getMatches = (query: any) => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia =
      typeof window !== "undefined" && window.matchMedia(query);

    handleChange();

    if (matchMedia && matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else if (matchMedia) {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia && matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else if (matchMedia) {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  }, [query]);

  return matches;
}

export function useBaseUrl() {
  const [baseUrl, setBaseUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  return baseUrl;
}

export function useActiveUser(groupId: string) {
  const [activeUser, setActiveUser] = useState<string | null>(null);

  useEffect(() => {
    const storedActiveUser = localStorage.getItem(`${groupId}-activeUser`);
    if (storedActiveUser) {
      setActiveUser(storedActiveUser);
    }
  }, [groupId]);

  return activeUser;
}
