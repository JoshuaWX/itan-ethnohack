"use client";

import { useEffect, useRef } from "react";

export function BotanicalHero() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const hero = host?.closest<HTMLElement>(".hero");
    if (!host || !hero || typeof IntersectionObserver === "undefined" || typeof ResizeObserver === "undefined") return;

    const wide = window.matchMedia("(min-width: 701px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean };
    }).connection;
    let visible = false;
    let loading: AbortController | undefined;
    let stop: (() => void) | undefined;

    function reset() {
      loading?.abort();
      loading = undefined;
      stop?.();
      stop = undefined;
    }

    const update = () => {
      if (!wide.matches || reducedMotion.matches || connection?.saveData) {
        reset();
        return;
      }
      if (!visible || document.hidden || loading) return;
      const attempt = new AbortController();
      loading = attempt;
      void import("./botanical-scene").then(({ mountBotanicalScene }) => {
        if (!attempt.signal.aborted && visible && !document.hidden) {
          stop = mountBotanicalScene(host, hero);
        } else if (loading === attempt) {
          loading = undefined;
        }
      }).catch(() => {
        // The poster is already visible if the scene chunk cannot load.
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(host);
    wide.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    connection?.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      wide.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
      connection?.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      reset();
    };
  }, []);

  return (
    <div className="hero-flower" ref={hostRef}>
      <div className="hero-flower-poster" />
    </div>
  );
}
