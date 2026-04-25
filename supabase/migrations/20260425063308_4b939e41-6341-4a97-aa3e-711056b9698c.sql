
-- Create journey_milestones table for the homepage timeline
CREATE TABLE public.journey_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view milestones"
  ON public.journey_milestones FOR SELECT TO public USING (true);

CREATE POLICY "Admins can insert milestones"
  ON public.journey_milestones FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update milestones"
  ON public.journey_milestones FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete milestones"
  ON public.journey_milestones FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_journey_milestones_updated_at
  BEFORE UPDATE ON public.journey_milestones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with current static milestones
INSERT INTO public.journey_milestones (year, title, description, sort_order) VALUES
  ('1993', 'Khởi nguồn', 'Thành lập Công ty TNHH Thành Phương, chuyên nghiên cứu bảo vệ thực vật từ tinh dầu thảo dược.', 1),
  ('1999 – 2000', 'Nghiên cứu tại Mỹ', 'Nhà khoa học Nguyễn Phương Dung du học và nghiên cứu chuyên sâu về sinh học ứng dụng tại Hoa Kỳ.', 2),
  ('2005 – 2015', 'Phát triển sản phẩm', 'Ứng dụng kết quả nghiên cứu vào sản xuất chế phẩm sinh học cho nông nghiệp Việt Nam.', 3),
  ('2021', 'Manna Đất Vàng ra đời', 'Thành lập Công ty Cổ phần Manna Đất Vàng, tập trung nông nghiệp sinh học toàn diện.', 4),
  ('2025', 'Thương hiệu uy tín', 'Được công nhận ''Thương hiệu uy tín quốc gia 2025'', sở hữu nhiều bằng sáng chế độc quyền.', 5);

-- Seed page_sections for hero banners on other pages so admin can override
INSERT INTO public.page_sections (page, section, title, subtitle, sort_order) VALUES
  ('about', 'hero', 'Về Manna Đất Vàng', 'Hành trình 30 năm nghiên cứu và phát triển nông nghiệp sinh học Việt Nam', 0),
  ('products', 'hero', 'Sản phẩm & Dịch vụ', 'Giải pháp sinh học toàn diện cho nông nghiệp tuần hoàn', 0),
  ('news', 'hero', 'Tin tức & Sự kiện', 'Cập nhật thông tin mới nhất về nông nghiệp sinh học', 0),
  ('contact', 'hero', 'Liên hệ với chúng tôi', 'Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn', 0)
ON CONFLICT DO NOTHING;
