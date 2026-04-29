import { lazy, Suspense, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";

const HomeBelowFold = lazy(() => import("@/components/home/HomeBelowFold"));

const DeferredHomeBelowFold = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;
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
