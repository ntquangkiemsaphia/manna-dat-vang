import { lazy, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import Header from "./Header";

const Footer = lazy(() => import("./Footer"));

const DeferredFooter = () => {
  const [ready, setReady] = useState(false);
  const markerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || ready) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" }
    );
    observer.observe(marker);
    return () => observer.disconnect();
  }, [ready]);

  if (!ready) return <div ref={markerRef} className="h-px bg-background" />;
  return (
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  );
};

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 pt-[108px]">{children}</main>
    <DeferredFooter />
  </div>
);

export default Layout;
