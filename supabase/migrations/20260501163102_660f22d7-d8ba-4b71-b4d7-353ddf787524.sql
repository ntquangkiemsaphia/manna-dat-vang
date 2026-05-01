
-- Core values table
CREATE TABLE public.core_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Award',
  image_url text,
  is_highlight boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view core values" ON public.core_values FOR SELECT USING (true);
CREATE POLICY "Admins can insert core values" ON public.core_values FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update core values" ON public.core_values FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete core values" ON public.core_values FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));

-- Vision & Mission: 1 row for header, 1 row for vision card, 1 row for mission card
CREATE TABLE public.vision_mission (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE, -- 'header' | 'vision' | 'mission'
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Target',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.vision_mission ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view vision mission" ON public.vision_mission FOR SELECT USING (true);
CREATE POLICY "Admins can insert vision mission" ON public.vision_mission FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update vision mission" ON public.vision_mission FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete vision mission" ON public.vision_mission FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));

-- Seed defaults
INSERT INTO public.core_values (title, icon_name, is_highlight, sort_order) VALUES
  ('Chất lượng tuyệt đối', 'Award', false, 1),
  ('Phát triển bền vững', 'Leaf', false, 2),
  ('Uy tín – Niềm tin', 'ShieldCheck', true, 3),
  ('Đổi mới & Khát vọng vươn xa', 'Rocket', false, 4),
  ('Con người là trung tâm', 'Heart', false, 5);

INSERT INTO public.vision_mission (section_key, eyebrow, title, description, icon_name, sort_order) VALUES
  ('header', 'Tầm nhìn & Sứ mệnh của chúng tôi', 'Thương hiệu hàng đầu về Thực phẩm & Nông sản sạch', 'Manna Đất Vàng định hướng trở thành tập đoàn thực phẩm – nông sản dẫn đầu Việt Nam và vươn tầm khu vực, mang tinh hoa nông nghiệp Việt đến với người tiêu dùng toàn cầu. Chúng tôi không chỉ xuất khẩu sản phẩm, mà còn xuất khẩu chất lượng, niềm tin và giá trị bền vững, góp phần nâng tầm thương hiệu quốc gia trên bản đồ ẩm thực toàn cầu.', '', 0),
  ('vision', '', 'Tầm Nhìn', 'Trở thành thương hiệu thực phẩm – nông sản hàng đầu Việt Nam và khu vực, được tin cậy bởi chất lượng, sự minh bạch và cam kết phát triển bền vững. Chúng tôi đồng hành cùng người nông dân, ứng dụng công nghệ hiện đại để nâng tầm giá trị nông sản Việt.', 'Target', 1),
  ('mission', '', 'Sứ Mệnh', 'Mang đến cho người tiêu dùng những sản phẩm thực phẩm và nông sản sạch, an toàn, giàu dinh dưỡng. Đồng hành cùng nhà nông Việt Nam phát triển vùng nguyên liệu bền vững, tạo việc làm và nâng cao đời sống cộng đồng – đóng góp vào sự thịnh vượng chung của đất nước.', 'Compass', 2);
