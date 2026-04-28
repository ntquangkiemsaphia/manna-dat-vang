import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import heroAbout from "@/assets/hero-about.jpg";
import { usePageSection } from "@/hooks/usePageSection";

const About = () => {
  const { data: html, isLoading, isFetched } = usePageSection("about", "full_html");
  const waiting = isLoading && !isFetched;
  const content = html?.description || "";

  return (
    <Layout>
      <HeroBanner
        page="about"
        image={heroAbout}
        title="Về Manna Đất Vàng"
        subtitle="Hành trình 30 năm nghiên cứu và phát triển nông nghiệp sinh học Việt Nam"
        compact
      />

      <section className="py-16">
        <div className="container max-w-4xl">
          {waiting ? (
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-64 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
            </div>
          ) : content ? (
            <article
              className="about-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-center text-muted-foreground italic">
              Chưa có nội dung. Vào trang quản trị → "Nội dung trang" để soạn.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default About;
