export default function SectionHeader({
  eyebrow,
  title,
  lede,
  titleId,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Referenced by the section's aria-labelledby so the landmark has a name. */
  titleId?: string;
}) {
  return (
    <div className="sec-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="title" id={titleId}>
        {title}
      </h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  );
}
