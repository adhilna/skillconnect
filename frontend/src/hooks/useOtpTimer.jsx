import { useState, useEffect } from 'react';

export default function useOtpTimer(initial = 300) {
  const [timer, setTimer] = useState(initial);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const reset = () => setTimer(initial);

  return [timer, reset];
}
