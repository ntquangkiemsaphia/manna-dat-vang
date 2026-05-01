import { lazy, Suspense } from "react";

const JourneySection = lazy(() => import("@/components/home/JourneySection"));
const CoreValuesSection = lazy(() => import("@/components/home/CoreValuesSection"));
const VisionMissionSection = lazy(() => import("@/components/home/VisionMissionSection"));
const ProductsShowcase = lazy(() => import("@/components/home/ProductsShowcase"));
const ProductsBento = lazy(() => import("@/components/home/ProductsBento"));
const NewsSection = lazy(() => import("@/components/home/NewsSection"));
const PatentsSection = lazy(() => import("@/components/home/PatentsSection"));
const PartnersSection = lazy(() => import("@/components/home/PartnersSection"));

const HomeBelowFold = () => (
  <Suspense fallback={<div className="min-h-[40vh] bg-background" />}>
    <JourneySection />
    <CoreValuesSection />
    <VisionMissionSection />
    <ProductsShowcase />
    <ProductsBento />
    <NewsSection />
    <PatentsSection />
    <PartnersSection />
  </Suspense>
);

export default HomeBelowFold;