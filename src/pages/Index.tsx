import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import SectionTitle from "@/components/SectionTitle";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import JourneySection from "@/components/home/JourneySection";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import ProductsBento from "@/components/home/ProductsBento";
import NewsSection from "@/components/home/NewsSection";
import PatentsSection from "@/components/home/PatentsSection";
import PartnersSection from "@/components/home/PartnersSection";

const Index = () => (
  <Layout>
    <HeroSection />
    <StatsSection />
    <JourneySection />
    <ProductsShowcase />
    <ProductsBento />
    <NewsSection />
    <PatentsSection />
    <PartnersSection />
  </Layout>
);

export default Index;
