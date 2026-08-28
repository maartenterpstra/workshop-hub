import umcuLogo from "@/assets/umcu_logo.svg";
import pmcLogo from "@/assets/pmc_logo.png";
import ailabslogo from "@/assets/ailabs_logo.png";
import dlinrtLogo from "@/assets/dlinrteu_logo.png";
import ciglogo from "@/assets/cig_logo.png";
import estroEndorsement from "@/assets/estro.svg"

const PartnerLogos = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  const isDark = variant === "dark";
  const wrapper = `flex flex-col sm:flex-row items-center gap-3 px-4 py-2 rounded-md ${
    isDark ? "bg-white/95" : "bg-background"
  } shadow-soft`;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-10">
      {/* UMC Utrecht */}
      <a
        href="https://www.umcutrecht.nl"
        target="_blank"
        rel="noopener noreferrer"
        className={`${wrapper} hover:shadow-card transition-shadow`}
        aria-label="UMC Utrecht"
      >
        <img src={umcuLogo} alt="UMC Utrecht" className="h-10 w-auto object-contain" />
{/*        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            University Medical Center
          </div>
          <div className="text-sm font-bold text-primary">Utrecht</div>
        </div>*/}
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
            Prinses Máxima Center
          </div>
          <div className="text-sm font-bold text-secondary">for pediatric oncology</div>
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
      <a
        href="https://www.estro.org/"
        target="_blank"
        rel="noopener noreferrer"
        className={`${wrapper} hover:shadow-card transition-shadow`}
        aria-label="ESTRO"
      >
        <img src={estroEndorsement} alt="Endorsed by ESTRO" className="h-10 w-auto object-contain" />
        <div className="leading-tight">
        </div>
      </a>

    </div>
  );
};

export default PartnerLogos;
