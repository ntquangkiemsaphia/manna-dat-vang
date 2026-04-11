interface SectionTitleProps {
  label?: string;
  title: string;
  description?: string;
  center?: boolean;
}

const SectionTitle = ({ label, title, description, center = true }: SectionTitleProps) => (
  <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""} mb-12`}>
    {label && <span className="text-sm font-semibold text-secondary uppercase tracking-wider">{label}</span>}
    <h2 className="mt-2 text-3xl md:text-4xl font-serif font-bold text-foreground">{title}</h2>
    {description && <p className="mt-4 text-muted-foreground leading-relaxed">{description}</p>}
  </div>
);

export default SectionTitle;
