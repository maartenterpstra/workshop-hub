import umcuLogo from "@/assets/umcu_logo.png";
import pmcLogo from "@/assets/pmc_logo.png";
import ailabslogo from "@/assets/ailabs_logo.png";
import dlinrtLogo from "@/assets/dlinrteu_logo.png";
import ciglogo from "@/assets/cig_logo.png";

const PartnerLogos = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  const isDark = variant === "dark";
  const wrapper = `flex items-center gap-3 px-4 py-2 rounded-md ${
    isDark ? "bg-white/95" : "bg-background"
  } shadow-soft`;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
      {/* UMC Utrecht */}
      <a
        href="https://www.umcutrecht.nl"
        target="_blank"
        rel="noopener noreferrer"
        className={`${wrapper} hover:shadow-card transition-shadow`}
        aria-label="UMC Utrecht"
      >
        <img src={umcuLogo} alt="UMC Utrecht" className="h-10 w-auto object-contain" />
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            University Medical Center
          </div>
          <div className="text-sm font-bold text-primary">Utrecht</div>
        </div>
      </a>

      {/* Princess Máxima Center */}
      <a
        href="https://www.prinsesmaximacentrum.nl"
        target="_blank"
        rel="noopener noreferrer"
        className={`${wrapper} hover:shadow-card transition-shadow`}
        aria-label="Princess Máxima Center"
      >
        <img src={pmcLogo} alt="Princess Máxima Center" className="h-10 w-auto object-contain" />
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Prinses Máxima Centrum
          </div>
          <div className="text-sm font-bold text-secondary">voor kinderoncologie</div>
        </div>
      </a>

      {/* DLinRT.eu */}
      <a
        href="https://dlinrt.eu"
        target="_blank"
        rel="noopener noreferrer"
        className={`${wrapper} hover:shadow-card transition-shadow`}
        aria-label="DLinRT.eu"
      >
        <img src={dlinrtLogo} alt="DLinRT.eu" className="h-10 w-auto object-contain" />
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Product catalog
          </div>
          <div className="text-sm font-bold text-foreground">
            DLinRT<span className="text-secondary">.eu</span>
          </div>
        </div>
      </a>

      {/* Computational Imaging Group */}
      <a
        href="https://www.cig-utrecht.org"
        target="_blank"
        rel="noopener noreferrer"
        className={`${wrapper} hover:shadow-card transition-shadow`}
        aria-label="Computational Imaging Group"
      >
        <img src={ciglogo} alt="Computational Imaging Group" className="h-10 w-auto object-contain" />
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            UMC Utrecht
          </div>
          <div className="text-sm font-bold text-primary">
            Computational Imaging Group
          </div>
        </div>
      </a>
      <a
        href="https://www.uu.nl/onderzoek/ai-labs"
        target="_blank"
        rel="noopener noreferrer"
        className={`${wrapper} hover:shadow-card transition-shadow`}
        aria-label="AI Labs"
      >
        <img src={ailabslogo} alt="AI Labs" className="h-10 w-auto object-contain" />
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Utrecht University 
          </div>
          <div className="text-sm font-bold text-foreground">
            AI Labs 
          </div>
        </div>
      </a>

    </div>
  );
};

export default PartnerLogos;
