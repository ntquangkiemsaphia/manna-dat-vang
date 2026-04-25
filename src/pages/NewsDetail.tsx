import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["news-post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", post?.category, id],
    queryFn: async () => {
      const { data } = await supabase
        .from("news_posts")
        .select("id, title, created_at, category, image_url")
        .eq("is_published", true)
        .eq("category", post!.category)
        .neq("id", id!)
        .order("created_at", { ascending: false })
        .limit(3);
      return data || [];
    },
    enabled: !!post,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-40 text-center">
          <div className="animate-pulse text-muted-foreground">Đang tải...</div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container py-40 text-center">
          <h2 className="text-2xl font-serif">Không tìm thấy bài viết</h2>
          <Link to="/tin-tuc" className="text-primary mt-4 inline-block">← Quay lại tin tức</Link>
        </div>
      </Layout>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString("vi-VN");

  return (
    <Layout>
      <section className="py-12">
        <div className="container max-w-4xl">
          <Link to="/tin-tuc" className="inline-flex items-center gap-1 text-primary text-sm font-medium mb-8 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Quay lại tin tức
          </Link>

          <article>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary uppercase tracking-wider">
                <Tag className="w-3 h-3" /> {post.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" /> {date}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <div
                className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-4 [&_p]:mb-2 [&_img]:rounded-lg [&_img]:my-3"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}

            {post.image_url && (
              <img src={post.image_url} alt={post.title} className="w-full h-80 object-cover rounded-2xl mb-8" />
            )}

            <div
              className="prose prose-lg max-w-none text-foreground
                         [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
                         [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-foreground
                         [&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-foreground
                         [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                         [&_li]:text-muted-foreground [&_li]:mb-1
                         [&_a]:text-primary [&_a]:underline
                         [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
                         [&_img]:rounded-xl [&_img]:my-6 [&_img]:mx-auto [&_img]:max-w-full
                         [&_strong]:font-semibold [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </article>

          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-16 border-t border-border pt-8">
              <h3 className="text-xl font-serif font-bold text-foreground mb-6">Bài viết liên quan</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} to={`/tin-tuc/${rp.id}`} className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all group">
                    <span className="text-xs text-secondary font-medium">{rp.category}</span>
                    <h4 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h4>
                    <p className="mt-2 text-xs text-muted-foreground">{new Date(rp.created_at).toLocaleDateString("vi-VN")}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetail;
