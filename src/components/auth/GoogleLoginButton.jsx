import { useEffect, useRef } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function GoogleLoginButton({ onToken, onError }) {
  const containerRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  onTokenRef.current = onToken;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!CLIENT_ID || !containerRef.current) return;

    let cancelled = false;
    const renderButton = () => {
      if (cancelled || !window.google?.accounts?.id || !containerRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => {
          if (response?.credential) onTokenRef.current?.(response.credential);
          else onErrorRef.current?.();
        },
      });
      // GIS only accepts a pixel width (no %) and caps it at 400 -- measure the
      // container so the button matches the rest of the form's full width
      // instead of floating at a hardcoded size.
      const width = Math.min(400, Math.round(containerRef.current.getBoundingClientRect().width));
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width,
      });
    };

    if (window.google?.accounts?.id) {
      renderButton();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          renderButton();
        }
      }, 100);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    return () => {
      cancelled = true;
    };
  }, []);

  if (!CLIENT_ID) return null;

  return <div ref={containerRef} className="w-full [&>div]:!w-full" />;
}
