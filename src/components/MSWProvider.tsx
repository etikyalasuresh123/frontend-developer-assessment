'use client';

import { useEffect, useRef, useState } from 'react';

export function MSWProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    async function enableMocking() {
      const { worker } = await import('@/mocks/browser');

      await worker.start({
        onUnhandledRequest: 'bypass',
      });

      setReady(true);
    }

    enableMocking();
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}