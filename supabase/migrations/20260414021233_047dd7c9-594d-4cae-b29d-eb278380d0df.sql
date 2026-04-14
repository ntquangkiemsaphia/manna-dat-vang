
-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Storage policies
CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Admins can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete uploads" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));

-- Create product_categories table
CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert product categories" ON public.product_categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product categories" ON public.product_categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product categories" ON public.product_categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed default product categories
INSERT INTO public.product_categories (name, slug, description) VALUES
  ('Phân bón sinh học', 'phan-bon', 'Các sản phẩm phân bón sinh học cho cây trồng'),
  ('Chăn nuôi', 'chan-nuoi', 'Các sản phẩm hỗ trợ chăn nuôi'),
  ('Thủy sản', 'thuy-san', 'Các sản phẩm dành cho nuôi trồng thủy sản');

-- Change products.category from enum to text
ALTER TABLE public.products ALTER COLUMN category TYPE TEXT USING category::TEXT;

-- Drop the enum type (no longer needed)
DROP TYPE IF EXISTS public.product_category;
