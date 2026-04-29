import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";

const HomeBelowFold = lazy(() => import("@/components/home/HomeBelowFold"));

const DeferredHomeBelowFold = () => {
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
      { rootMargin: "500px 0px" }
    );
    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  if (!ready) return <div ref={markerRef} className="h-px bg-background" />;
  return (
    <Suspense fallback={<div className="min-h-[30vh] bg-background" />}>
      <HomeBelowFold />
    </Suspense>
  );
};

const Index = () => (
  <Layout>
    <HeroSection />
    <StatsSection />
    <DeferredHomeBelowFold />
  </Layout>
);

export default Index;
