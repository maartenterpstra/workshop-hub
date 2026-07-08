// Text-based partner "logo" badges. These are typographic representations
// styled in each partner's brand colours; swap for official logo files when
// permission and assets are available.

const PartnerLogos = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  const isDark = variant === "dark";
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-6 md:gap-10 ${
        isDark ? "" : ""
      }`}
    >
      {/* UMC Utrecht */}
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-md ${
          isDark ? "bg-white/95" : "bg-background"
        } shadow-soft`}
        aria-label="UMC Utrecht"
      >
        <div className="h-9 w-9 rounded-sm bg-white flex items-center justify-center">
          <span className="text-primary-foreground font-black text-sm tracking-tighter">
            <img src="/src/assets/umcu_logo.png" alt="UMC Utrecht Logo" />
          </span>
        </div>
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            University Medical Center
          </div>
          <div className="text-sm font-bold text-primary">Utrecht</div>
        </div>
      </div>

      {/* Princess Máxima Center */}
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-md ${
          isDark ? "bg-white/95" : "bg-background"
        } shadow-soft`}
        aria-label="Princess Máxima Center"
      >
        <div className="h-9 w-9 rounded-sm flex items-center justify-center">
          <img src="/src/assets/pmc_logo.png" alt="Princess Máxima Center Logo" className="h-10 w-auto" />
        </div>
        <div className="leading-tight">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Prinses Máxima Centrum
          </div>
          <div className="text-sm font-bold text-secondary">
            voor kinderoncologie
          </div>
        </div>
      </div>

      {/* DLinRT.eu */}
      <a
        href="https://dlinrt.eu"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 px-4 py-2 rounded-md ${
          isDark ? "bg-white/95" : "bg-background"
        } shadow-soft hover:shadow-card transition-shadow`}
        aria-label="DLinRT.eu"
      >
        <div className="h-9 w-9 rounded-sm bg-gradient-brand flex items-center justify-center">
          <img src="/src/assets/dlinrteu_logo.png" alt="Princess Máxima Center Logo" className="h-10 w-auto" />
        </div>
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
