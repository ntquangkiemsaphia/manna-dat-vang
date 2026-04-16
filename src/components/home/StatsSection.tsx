const stats = [
  { value: "30+", label: "Năm nghiên cứu, thử nghiệm & ứng dụng" },
  { value: "50+", label: "Sản phẩm sinh học" },
  { value: "10,000+", label: "Nông dân tin dùng" },
  { value: "20+", label: "Tỉnh thành phủ sóng" },
];

const StatsSection = () => (
  <section className="section-navy py-10">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-3xl md:text-4xl font-serif font-bold text-secondary">{s.value}</p>
            <p className="mt-1 text-sm text-white/70">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
