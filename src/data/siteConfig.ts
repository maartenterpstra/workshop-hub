// Site-wide configuration and content
export const siteConfig = {
  title: "Artificial Intelligence in Radiotherapy",
  subtitle: "2027 Workshop",
  dates: "18-19 March 2027",
  location: "UMC Utrecht & Princess Máxima Center",
  registrationDeadline: "TBC",

  // Phase / status flags for 2027 — keep these in sync with the timeline
  callForAbstractsOpens: "September 1, 2026",
  abstractSubmissionDeadline: "TBC",
  registrationOpensOn: "TBC",

  // Registration is handled on a separate site for 2027; leave empty until live.
  externalRegistrationUrl: "",

  contact: {
    name: "Matteo Maspero & Maarten Terpstra",
    email: "M.Maspero@umcutrecht.nl",
    email2: "M.L.Terpstra-5@umcutrecht.nl",
    department: "Department of Radiotherapy",
    institution: "UMC Utrecht",
  },

  organizers: [
    { name: "Matteo Maspero", institution: "UMC Utrecht" },
    { name: "Maarten Terpstra", institution: "UMC Utrecht" },
    // PMC organizer(s) to be added
  ],

  // Previous-edition archive
  previousEditionUrl: "/2026/index.html",

  // Legacy fields (kept so old Registration.tsx logic keeps compiling until rewritten this turn)
  registrationFormUrl: "",
  registrationFormUrlNotify: "",
};
