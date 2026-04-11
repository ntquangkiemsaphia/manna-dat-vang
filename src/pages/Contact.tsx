import { useState } from "react";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/HeroBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroAbout from "@/assets/hero-about.jpg";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <HeroBanner image={heroAbout} title="Liên hệ với chúng tôi" subtitle="Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn" compact />

      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-foreground">Thông tin liên hệ</h2>
              <p className="text-muted-foreground leading-relaxed">Hãy liên hệ với chúng tôi để được tư vấn giải pháp nông nghiệp sinh học phù hợp nhất.</p>

              <div className="space-y-4">
                {[
                  { icon: MapPin, title: "Địa chỉ", text: "TP. Hồ Chí Minh, Việt Nam" },
                  { icon: Phone, title: "Điện thoại", text: "0901 234 567" },
                  { icon: Mail, title: "Email", text: "info@mannadatvang.vn" },
                  { icon: Clock, title: "Giờ làm việc", text: "Thứ 2 - Thứ 6: 8:00 - 17:30" },
                ].map((info) => (
                  <div key={info.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{info.title}</p>
                      <p className="text-sm text-muted-foreground">{info.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="text-xl font-serif font-bold text-foreground mb-6">Gửi yêu cầu tư vấn</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Họ và tên *</label>
                      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Nguyễn Văn A" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                      <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Số điện thoại</label>
                      <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="0901 234 567" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Lĩnh vực quan tâm</label>
                      <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                        <SelectTrigger><SelectValue placeholder="Chọn lĩnh vực" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phan-bon">Phân bón sinh học</SelectItem>
                          <SelectItem value="chan-nuoi">Chăn nuôi</SelectItem>
                          <SelectItem value="thuy-san">Thủy sản</SelectItem>
                          <SelectItem value="hop-tac">Hợp tác kinh doanh</SelectItem>
                          <SelectItem value="khac">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Nội dung *</label>
                    <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={5} placeholder="Mô tả nhu cầu của bạn..." />
                  </div>
                  <Button type="submit" className="gradient-primary text-primary-foreground border-0 px-8 py-5">Gửi yêu cầu</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
