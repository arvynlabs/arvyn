import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "mx-auto max-w-[680px] text-center" : "max-w-[680px]"}>
      <p className={`eyebrow flex items-center gap-2 ${centered ? "justify-center" : ""}`}>
        <span className="inline-block h-px w-6 bg-arvyn-orange" />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-tight text-white md:text-[44px]">
        {title}
      </h2>
      {text && <p className="mt-4 text-[15.5px] leading-relaxed text-arvyn-muted">{text}</p>}
    </Reveal>
  );
}
