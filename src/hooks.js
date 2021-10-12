import { useState, useEffect, useCallback, useRef } from "react";

// eslint-disable-next-line
export function useSafeState(data) {
  const [value, _setValue] = useState(data);

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setValue = useCallback((v) => {
    if (mountedRef.current) {
      _setValue(v);
    }
  }, []);

  return [value, setValue];
}
