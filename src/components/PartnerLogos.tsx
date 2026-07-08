import umcuLogo from "@/assets/umcu_logo.png";
import pmcLogo from "@/assets/pmc_logo.png";
import dlinrtLogo from "@/assets/dlinrteu_logo.png";

const PartnerLogos = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  const isDark = variant === "dark";
  const wrapper = `flex items-center gap-3 px-4 py-2 rounded-md ${
    isDark ? "bg-white/95" : "bg-background"
  } shadow-soft`;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
      {/* UMC Utrecht */}
      <div className={wrapper} aria-label="UMC Utrecht">
        <img src={umcuLogo} alt="UMC Utrecht" className="h-10 w-auto object-contain" />
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            University Medical Center
          </div>
          <div className="text-sm font-bold text-primary">Utrecht</div>
        </div>
      </div>

      {/* Princess Máxima Center */}
      <div className={wrapper} aria-label="Princess Máxima Center">
        <img src={pmcLogo} alt="Princess Máxima Center" className="h-10 w-auto object-contain" />
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Prinses Máxima Centrum
          </div>
          <div className="text-sm font-bold text-secondary">voor kinderoncologie</div>
        </div>
      </div>

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
    </div>
  );
};

export default PartnerLogos;
