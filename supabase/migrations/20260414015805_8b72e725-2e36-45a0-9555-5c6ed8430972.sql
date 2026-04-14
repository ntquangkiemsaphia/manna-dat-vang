
CREATE TABLE public.news_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON public.news_categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories" ON public.news_categories FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update categories" ON public.news_categories FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete categories" ON public.news_categories FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.news_categories (name, description) VALUES
  ('Phát triển bền vững', 'Các bài viết về phát triển nông nghiệp bền vững và bảo vệ môi trường'),
  ('Tin tức thị trường', 'Cập nhật tin tức thị trường nông nghiệp, giá cả và xu hướng'),
  ('Kiến thức chuyên ngành', 'Chia sẻ kiến thức chuyên sâu về phân bón, chăn nuôi và thủy sản');
