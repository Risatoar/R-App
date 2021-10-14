/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export default (fn: () => void) => {
  useEffect(() => {
    fn();
  }, [])
}