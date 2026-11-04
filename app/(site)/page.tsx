import Hero from "./home/Hero";
import ServicesGrid from "./services/ServicesGrid";
import FeaturedCars from "./home/FeaturedCars";
import { getFeaturedCars, getServices } from "@/lib/api";
import WhyChooseUs from "./home/WhyChooseUs";
import CTABanner from "./home/CTABanner";

export default async function Home() {
  const [services, featuredCars] = await Promise.all([
    getServices(),
    getFeaturedCars(),
  ]);

  return (
    <>
      <Hero />
      <ServicesGrid services={services} />
      <FeaturedCars cars={featuredCars} />
      <WhyChooseUs/>
      <CTABanner/>
    </>
  );
}