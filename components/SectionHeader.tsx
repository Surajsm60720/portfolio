export default function SectionHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="sec-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="title">{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  );
}
