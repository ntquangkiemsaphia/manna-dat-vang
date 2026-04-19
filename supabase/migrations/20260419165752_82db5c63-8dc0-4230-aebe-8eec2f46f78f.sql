-- Table to manage editable page sections (image + text) per page
CREATE TABLE public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section text NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT '',
  cta_link text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page, section)
);

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view page sections"
  ON public.page_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert page sections"
  ON public.page_sections FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update page sections"
  ON public.page_sections FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete page sections"
  ON public.page_sections FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Reuse update timestamp trigger if exists, else create
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_page_sections_updated_at
BEFORE UPDATE ON public.page_sections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed common sections so admin sees them immediately
INSERT INTO public.page_sections (page, section, title, subtitle, description, cta_text, cta_link, sort_order) VALUES
  ('home', 'hero', 'Manna Đất Vàng', 'Nông nghiệp sinh học — Vì một Việt Nam xanh và bền vững', '"Thương hiệu uy tín quốc gia" 2025', 'Xem sản phẩm', '/san-pham', 1),
  ('home', 'journey', 'Hành trình Manna Đất Vàng', '', '', '', '', 2),
  ('about', 'hero', 'Về chúng tôi', 'Câu chuyện Manna Đất Vàng', '', '', '', 1),
  ('about', 'story', 'Câu chuyện thương hiệu', '', '', '', '', 2),
  ('products', 'hero', 'Sản phẩm', 'Giải pháp sinh học cho nông nghiệp', '', '', '', 1),
  ('news', 'hero', 'Tin tức', 'Cập nhật mới nhất', '', '', '', 1),
  ('contact', 'hero', 'Liên hệ', 'Kết nối với Manna Đất Vàng', '', '', '', 1);