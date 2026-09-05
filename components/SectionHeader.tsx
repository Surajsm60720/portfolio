import Reveal from "@/components/Reveal";

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
  /* Headings used to appear the instant a section scrolled into view while
     the content beneath them faded in, so every section arrived in two
     pieces. They share the reveal now. */
  return (
    <Reveal className="sec-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="title" id={titleId}>
        <span>{title}</span>
      </h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </Reveal>
  );
}
