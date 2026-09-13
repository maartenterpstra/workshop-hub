import efompLogo from "@/assets/efomp-logo.png";
import miccaiLogo from "@/assets/miccai-logo.png";
import estroLogo from "@/assets/estro.svg";

const endorsements = [
  {
    name: "EFOMP",
    href: "https://www.efomp.org/",
    src: efompLogo,
    imageClassName: "h-10 sm:h-12",
  },
  {
    name: "MICCAI Society",
    href: "https://miccai.org/",
    src: miccaiLogo,
    imageClassName: "h-14 sm:h-16",
  },
  {
    name: "ESTRO",
    href: "https://www.estro.org/",
    src: estroLogo,
    imageClassName: "h-10 sm:h-12",
  },
];

const EndorsementLogos = () => (
  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
    {endorsements.map((endorsement) => (
      <a
        key={endorsement.name}
        href={endorsement.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit the ${endorsement.name} website`}
        className="flex h-20 min-w-32 items-center justify-center rounded-md border border-border bg-background px-5 py-2 shadow-soft transition-shadow hover:shadow-card"
      >
        <img
          src={endorsement.src}
          alt={`${endorsement.name} logo`}
          className={`${endorsement.imageClassName} max-w-40 object-contain`}
        />
      </a>
    ))}
  </div>
);

export default EndorsementLogos;