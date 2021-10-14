/* eslint-disable import/no-anonymous-default-export */
import { useCallback, useRef } from "react"

function usePersistCallback<T extends(...args: any[]) => any>(fn?: T) {
  const ref = useRef<T>();

  ref.current = fn;

  return useCallback((...args: any[]) => {
    const fn = ref.current;
    return fn && fn(...args);
  }, [ref])
}

export default usePersistCallback;