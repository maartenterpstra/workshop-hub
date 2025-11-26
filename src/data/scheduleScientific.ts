// Scientific Symposium Schedule - Tuesday, March 18, 2025
export interface ScientificSession {
  time: string;
  title: string;
  chair?: string;
  presentations?: Array<{
    time: string;
    title: string;
    presenter: string;
    affiliation: string;
  }>;
  type?: "break" | "session" | "keynote" | "panel";
  theme?: "synthesis" | "contouring" | "radiomics" | "implementation";
}

export const scientificSchedule: ScientificSession[] = [
  {
    time: "",
    title: "To be announced: express your intention to provide a talk in the registration form - check back in February!",
    type: "session"
  }
  // {
  //   time: "09:00 - 09:30",
  //   title: "Registration and Coffee",
  //   type: "break"
  // },
  // {
  //   time: "09:30 - 09:40",
  //   title: "Welcome and Opening Remarks",
  //   chair: "Matteo Maspero",
  //   type: "session"
  // },
  // {
  //   time: "09:40 - 11:00",
  //   title: "Session 1: Image Synthesis and Reconstruction",
  //   chair: "Maarten Terpstra",
  //   theme: "synthesis",
  //   type: "session",
  //   presentations: [
  //     {
  //       time: "09:40",
  //       title: "Deep Learning for MR-to-CT Synthesis in Radiotherapy Planning",
  //       presenter: "Dr. Emma van der Bijl",
  //       affiliation: "UMC Utrecht"
  //     },
  //     {
  //       time: "10:00",
  //       title: "Conditional GANs for Multi-modal Image Translation",
  //       presenter: "Dr. Peter Koopmans",
  //       affiliation: "Radboud UMC"
  //     },
  //     {
  //       time: "10:20",
  //       title: "CBCT Enhancement Using Deep Learning for Adaptive RT",
  //       presenter: "Dr. Lisa de Vries",
  //       affiliation: "NKI Amsterdam"
  //     },
  //     {
  //       time: "10:40",
  //       title: "Panel Discussion: Clinical Translation of Synthetic Imaging",
  //       presenter: "All speakers",
  //       affiliation: ""
  //     }
  //   ]
  // },
  // {
  //   time: "11:00 - 11:20",
  //   title: "Coffee Break",
  //   type: "break"
  // },
  // {
  //   time: "11:20 - 12:40",
  //   title: "Session 2: Contouring & Registration",
  //   chair: "Charlotte Brouwer",
  //   theme: "contouring",
  //   type: "session",
  //   presentations: [
  //     {
  //       time: "11:20",
  //       title: "Multi-organ Segmentation with Attention-based U-Net",
  //       presenter: "Dr. Mark Hendriks",
  //       affiliation: "MAASTRO Clinic"
  //     },
  //     {
  //       time: "11:40",
  //       title: "Deformable Image Registration for Dose Accumulation",
  //       presenter: "Dr. Sophie Janssen",
  //       affiliation: "UMCG"
  //     },
  //     {
  //       time: "12:00",
  //       title: "Uncertainty Quantification in Deep Learning Segmentation",
  //       presenter: "Dr. Thomas van Dijk",
  //       affiliation: "Erasmus MC"
  //     },
  //     {
  //       time: "12:20",
  //       title: "Panel Discussion: Quality Assurance in Auto-contouring",
  //       presenter: "All speakers",
  //       affiliation: ""
  //     }
  //   ]
  // },
  // {
  //   time: "12:40 - 13:40",
  //   title: "Lunch Break",
  //   type: "break"
  // },
  // {
  //   time: "13:40 - 15:00",
  //   title: "Session 3: Radiomics and Outcome Prediction",
  //   chair: "Wouter van Elmpt",
  //   theme: "radiomics",
  //   type: "session",
  //   presentations: [
  //     {
  //       time: "13:40",
  //       title: "Delta-radiomics for Treatment Response Prediction",
  //       presenter: "Dr. Anna Wesseling",
  //       affiliation: "VU Medical Center"
  //     },
  //     {
  //       time: "14:00",
  //       title: "Deep Learning Radiomics vs. Handcrafted Features",
  //       presenter: "Dr. Robert Meier",
  //       affiliation: "University Hospital Zurich"
  //     },
  //     {
  //       time: "14:20",
  //       title: "Multi-modal Radiomics for Survival Prediction in Lung Cancer",
  //       presenter: "Dr. Julia Kramer",
  //       affiliation: "German Cancer Research Center"
  //     },
  //     {
  //       time: "14:40",
  //       title: "Panel Discussion: Standardization and Reproducibility",
  //       presenter: "All speakers",
  //       affiliation: ""
  //     }
  //   ]
  // },
  // {
  //   time: "15:00 - 15:20",
  //   title: "Coffee Break",
  //   type: "break"
  // },
  // {
  //   time: "15:20 - 16:40",
  //   title: "Session 4: Clinical Implementation and Future Directions",
  //   chair: "Tomas Janssen",
  //   theme: "implementation",
  //   type: "session",
  //   presentations: [
  //     {
  //       time: "15:20",
  //       title: "Regulatory Frameworks for AI in Radiotherapy",
  //       presenter: "Dr. Michael Anderson",
  //       affiliation: "NHS England"
  //     },
  //     {
  //       time: "15:40",
  //       title: "Clinical Validation Study: Auto-planning in Daily Practice",
  //       presenter: "Dr. Nina Patel",
  //       affiliation: "Cambridge University Hospitals"
  //     },
  //     {
  //       time: "16:00",
  //       title: "Industry Perspective: From Research to Clinical Product",
  //       presenter: "Dr. Hans Mueller",
  //       affiliation: "Varian Medical Systems"
  //     },
  //     {
  //       time: "16:20",
  //       title: "Panel Discussion: Barriers and Opportunities",
  //       presenter: "All speakers",
  //       affiliation: ""
  //     }
  //   ]
  // },
  // {
  //   time: "16:40 - 17:00",
  //   title: "Closing Remarks and Future Outlook",
  //   chair: "Matteo Maspero",
  //   type: "session"
  // }
];
