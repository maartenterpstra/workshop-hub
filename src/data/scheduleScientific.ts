// Scientific Symposium Schedule - Tuesday, March 18, 2025
export interface ScientificSession {
  time: string;
  title: string;
  chair?: string;
  presentations?: Array<{
    time: string;
    title: string;
    presenter: string;
    email: string;
    affiliation: string;
  }>;
  type?: "break" | "session" | "keynote" | "panel";
  themeConfig?: {
    bg: string;
    border: string;
    iconBg: string;
    iconText: string;
    label: string;
  };
}

export const scientificSchedule: ScientificSession[] = [
  {
    time: "09:00 - 09:30",
    title: "Registration and Coffee",
    type: "break"
  },
  {
    time: "09:30 - 09:35",
    title: "Welcome and Opening Remarks",
    chair: "Matteo Maspero",
    type: "session"
  },
  {
    time: "09:35 - 10:30",
    title: "Session 1: Image Synthesis and Reconstruction",
    chair: "Maarten Terpstra • UMC Utrecht",
    themeConfig: {
      bg: "bg-blue-50/80 dark:bg-blue-950/20",
      border: "border-blue-600/30",
      iconBg: "op-blue-100 dark:bg-blue-900",
      iconText: "text-blue-700 dark:text-blue-300",
      label: "Synthesis"
    },
    type: "session",
    presentations: [
      {
        "time": "09:35",
        "title": "Introduction",
        "presenter": "Maarten Terpstra",
        "affiliation": "UMC Utrecht",
        "email": "M.L.Terpstra-5@umcutrecht.nl"
      },
      {
        "time": "09:40",
        "title": "Anomaly Detection using Deep Learning",
        "presenter": "Musti Kadhim",
        "affiliation": "Lund University and Skåne University Hospital",
        "email": "mustafa.i.kadhim@skane.se"
      },
      {
        "time": "09:50",
        "title": "Rectified flow-based prediction of post-treatment MRI for patients with glioma from pre-radiotherapy priors",
        "presenter": "Selena Huisman",
        "affiliation": "Amsterdam UMC",
        "email": "s.i.huisman@amsterdamumc.nl"
      },
      {
        "time": "10:00",
        "title": "Superior multi-artifact reduction using Mamba infused residual 3D-Unet for adaptive Head and Neck radiotherapy",
        "presenter": "Viktor Rogowski",
        "affiliation": "Skåne University Hospital",
        "email": "viktor.rogowski@skane.se"
      },
      {
        "time": "10:10",
        "title": "From synthetic to clinical: The unexpected success of simulated CBCT data in radiotherapy applications",
        "presenter": "Lukas Zimmermann",
        "affiliation": "Medical University of Vienna",
        "email": "lukas.a.zimmermann@meduniwien.ac.at"
      },
      {
        "time": "10:20",
        "title": "Report SynthRAD2025 Grand Challenge",
        "presenter": "Adrian Thummerer / Maarten Terpstra",
        "affiliation": "University of Bern / UMC Utrecht",
        "email": "Adrian.Thummerer@med.uni-muenchen.de"
      },
      {
        "time": "10:25",
        "title": "Intro COBRA2026 Challenge",
        "presenter": "Lukas Zimmermann",
        "affiliation": "Medical University of Vienna",
        "email": "lukas.a.zimmermann@meduniwien.ac.at"
      }
    ]
  },
  {
    "time": "10:30 - 10:55",
    "title": "Coffee",
    "type": "break"
  },

  {
    time: "10:55 - 11:50",
    title: "Session 2: Dose and treatment planning",
    chair: "Matteo Maspero • UMC Utrecht",
    themeConfig: {
      bg: "bg-green-50/80 dark:bg-green-950/20",
      border: "border-green-600/30",
      iconBg: "bg-green-100 dark:bg-green-900",
      iconText: "ras_text-green-700 dark:text-green-300",
      label: "text-Planning"
    },
    type: "session",
    presentations: [
      {
        "time": "10:55",
        "title": "Intro DoseRAD2026",
        "presenter": "Nikolaos Delopoulos",
        "affiliation": "LMU University Hospital Munich",
        "email": ""
      },
      {
        "time": "11:00",
        "title": "End-to-end differentiable RT planning in PyTorch",
        "presenter": "Attila Simkó",
        "affiliation": "Umeå University, Umeå, Sweden",
        "email": "attila.simko@umu.se"
      },
      {
        "time": "11:10",
        "title": "From MR to Dose: Direct Prediction Versus Synthetic CT Workflows",
        "presenter": "Nikolaos Delopoulos",
        "affiliation": "LMU University Hospital Munich",
        "email": ""
      },
      {
        "time": "11:20",
        "title": "MRI-based proton dose calculation for pelvic tumors using deep learning",
        "presenter": "Tian Liheng",
        "affiliation": "TMU Dortmund",
        "email": "Liheng.Tian@tu-dortmund.de"
      },
      {
        "time": "11:30",
        "title": "Fast and flexible beam's eye view monte carlo dose approximation towards dynamic, online adaptive workflows",
        "presenter": "Victor Strijbis",
        "affiliation": "Inselspital, Bern, Switzerland",
        "email": "victor.strijbis@unibe.ch"
      }
    ]
  },

  {
    time: "11:40 - 12:25",
    title: "Session 3: Clinical predictions",
    chair: "Marianna Sijtsema • UMC Groningen",
    themeConfig: {
      bg: "bg-amber-50/80 dark:bg-amber-950/20",
      border: "border-amber-600/30",
      iconBg: "bg-amber-100 dark:bg-amber-900",
      iconText: "text-amber-700 dark:text-amber-300",
      label: "Prediction"
    },
    type: "session",
    presentations: [
      {
        "time": "11:40",
        "title": "Introduction",
        "presenter": "Marianna Sijtsema",
        "affiliation": "UMC Groningen",
        "email": "n.m.sijtsema@umcg.nl"
      },
      {
        "time": "11:45",
        "title": "Predicting Overall Survival of NSCLC Patients with Clinical, Radiomics and Deep Learning Features",
        "presenter": "Jikai Zhou",
        "affiliation": "Maastro",
        "email": "jikai.zhou@maastro.nl"
      },
      {
        "time": "11:55",
        "title": "Self-Supervised Deep Learning for Label-Free Brain Metastasis Detection in Clinical MR Imaging",
        "presenter": "Anne Rückert",
        "affiliation": "UMC Utrecht",
        "email": "a.ruckert@umcutrecht.nl"
      },
      {
        "time": "12:05",
        "title": "Uncertainty quantification methods for deep learning outcome prediction models",
        "presenter": "Daniel MacRae",
        "affiliation": "UMCG",
        "email": "d.c.macrae@umcg.nl"
      },
      {
        "time": "12:15",
        "title": "Malignant pleural mesothelioma classification and survival prediction with CT imaging using ResNet",
        "presenter": "Minghua Li",
        "affiliation": "Maastro",
        "email": ""
      }
    ]
  },

  {
    time: "12:25 - 13:40",
    title: "Lunch",
    type: "break"
  },
  {
    time: "13:40 - 14:50",
    title: "Session 4: Segmentation",
    chair: "Joren Brunekreef • NKI-AVL",
    themeConfig: {
      bg: "bg-purple-50/dark purple-950/20",
      border: "border-purple-600/30",
      iconBg:            "bg-purple-100 dark:bg-purple-900",
      iconText: "text-purple-700 dark:text-purple-300",
      label: "Segmentation"
    },
    type: "session",
    presentations: [
      {
          "time": "13:40",
          "title": "Introduction",
          "presenter": "Joren Brunekreef",
          "affiliation": "NKI-AVL",
          "email": "j.brunekreef@nki.nl"
        },
        {
          "time": "13:45",
          "title": "Dose-based evaluation of delineation variation in radiotherapy: a scoping review",
          "presenter": "Joelle van Aalst",
          "affiliation": "UMC Groningen",
          "email": "j.e.van.aalst@umcg.nl"
        },
        {
          "time": "13:55",
          "title": "Learning curves for head-and-neck tumor segmentation",
          "presenter": "Prerak Mody",
          "affiliation": "Leiden University Medical Center",
          "email": "prerakmody@gmail.com"
        },
        {
          "time": "14:05",
          "title": "Morphometric Outlier Detection for Quality Assurance in Automated Anatomical Contouring",
          "presenter": "Amal Joseph Varghese",
          "affiliation": "Netherlands Cancer Institute",
          "email": "a.joseph@nki.nl"
        },
        {
          "time": "14:15",
          "title": "Impact of uncertainty maps on manual editing of rectal cancer auto-segmentation",
          "presenter": "Federica Carmen Maruccio",
          "affiliation": "NKI",
          "email": "f.maruccio@nki.nl"
        },
        {
          "time": "14:25",
          "title": "LUND-PROBE - LUND Prostate Radiotherapy Open Benchmarking and Evaluation dataset",
          "presenter": "Christian Jamtheim Gustafsson",
          "affiliation": "Skåne University Hospital",
          "email": "christian.jamtheimgustafsson@skane.se"
        },
        {
          "time": "14:35",
          "title": "Real-world federated learning for auto-contouring in pediatric renal tumor flank irradiation",
          "presenter": "Mianyong Ding",
          "affiliation": "PMC Utrecht/ UMC Utrecht",
          "email": "m.ding-3@umcutrecht.nl"
        },
        {
          "time": "14:45",
          "title": "Report TrackRAD2025 Grand Challenge",
          "presenter": "Matteo Maspero",
          "affiliation": "UMC Utrecht",
          "email": ""
        }
      ]
  },
  {
    time: "14:50 - 15:15",
    title: "Coffee Break",
    type: "break"
  },

  {
    time: "15:15 - 16:20",
    title: "Session 5: Clinical implementation",
    chair: "Tomas Janssen • NKI-AVL",
    themeConfig: {
      bg: "bg-rose-50/80 dark:bg-rose-950/20",
      border: "border-rose-600/30",
      iconBg: "bg-rose-100 dark:bg-rose-900",
      iconText: "text-rose-700 dark:text-rose-300",
      label: "Implementation"
    },
    type: "session",
    presentations: [
      {
        "time": "15:15",
        "title": "Introduction",
        "presenter": "Tomas Janssen",
        "affiliation": "NKI-AVL",
        "email": "t.janssen@nki-avl.nl"
      },
      {
        "time": "15:20",
        "title": "AID-RT: Model cards to increase transparancy and safety of AI in RT",
        "presenter": "Ana Barragan-Montero",
        "affiliation": "UC Louvain",
        "email": "ana.barragan@uclouvain.be"
      },
      {
        "time": "15:30",
        "title": "Off/Online prostate autocontouring pipeline",
        "presenter": "Hendrik",
        "affiliation": "RIF",
        "email": "h.piersma@skf-rif.nl"
      },
      {
        "time": "15:40",
        "title": "Clinical introduction of prediction models – first experiences at MAASTRO",
        "presenter": "Wouter van Elmpt",
        "affiliation": "Maastro",
        "email": "wouter.vanelmpt@maastro.nl"
      },
      {
        "time": "15:50",
        "title": "Implementation and clinical evaluation of an in-house thoracic auto-segmentation model for 0.35 T MRgRT planning",
        "presenter": "Nikolaos Delopoulos",
        "affiliation": "LMU University Hospital Munich",
        "email": "nikolaos.ntelopoulos@med.uni-muenchen.de"
      },
      {
        "time": "16:00",
        "title": "Feasibility of full auto-segmentation of head and neck organs at risk",
        "presenter": "Annamieke Koops",
        "affiliation": "UMC Groningen",
        "email": "a.koops01@umcg.nl"
      },
      {
        "time": "16:10",
        "title": "Monitoring of AI in clinical practice",
        "presenter": "Rita Simoes",
        "affiliation": "NKI-AVL",
        "email": "r.simoes@nki.nl"
      },
    ]
  },
  {
    time: "16:20 - 17:30",
    title: "Closure and drinks",
    chair: "Matteo Maspero • UMC Utrecht",
    type: "session"
  }
];
