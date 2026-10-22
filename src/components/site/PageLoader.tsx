"use client";

import { useEffect, useState } from "react";

/**
 * Full-screen loader shown from the first paint (it is in the static HTML) until the page and fonts have loaded,
 * then it fades out and unmounts. Gives up after 6 s so a slow asset never traps the visitor.
 */
export function PageLoader() {
  const [state, setState] = useState<"on" | "leaving" | "gone">("on");

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setState("leaving");
      window.setTimeout(() => setState("gone"), 600);
    };
    const ready = () => { document.fonts?.ready.then(finish, finish) ?? finish(); };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    const cap = window.setTimeout(finish, 6000);
    return () => { window.removeEventListener("load", ready); window.clearTimeout(cap); };
  }, []);

  if (state === "gone") return null;
  return (
    <div className={`page-loader${state === "leaving" ? " is-leaving" : ""}`} role="status" aria-label="Loading">
      <div className="loader" aria-hidden="true" />
    </div>
  );
}
