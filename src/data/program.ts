import adrianImg from "@/assets/speakers/adrian-thummerer.jpg";
import anaImg from "@/assets/organizers/ana-maria-barragan-montero.jpg";
import hariniImg from "@/assets/speakers/harini-veeraraghavan.jpg";
import yeImg from "@/assets/speakers/ye-zhang.jpg";
import cecileImg from "@/assets/speakers/cecile-wolfs.jpg";
import tomasImg from "@/assets/speakers/tomas-janssen.jpg";
import akshayImg from "@/assets/speakers/akshay-chaudhari.jpg";
import jelmerImg from "@/assets/speakers/jelmer-wolterink.jpg";

export type ExpertTalk = {
  title: string;
  speaker: string;
  affiliation: string;
  initials: string;
  avatarUrl?: string;
};

/** Website-only details; never included in the PDF programme. */
export type Keynote = {
  speaker: string;
  affiliation: string;
  title: string;
  bio: string;
  abstract: string;
  avatarUrl: string;
  profileUrl?: string;
  profileLabel?: string;
};

export type ProgramRow =
  | { kind: "item"; time: string; label: string; location?: string; mapsUrl?: string }
  | { kind: "keynote"; time: string; label: string; keynote: Keynote }
  | { kind: "session"; time: string; id: string; title: string; talk: ExpertTalk };

export type ProgramDay = { label: string; date: string; rows: ProgramRow[] };

const item = (
  time: string,
  label: string,
  extra?: { location?: string; mapsUrl?: string },
): ProgramRow => ({ kind: "item", time, label, ...extra });
const keynote = (time: string, label: string, k: Keynote): ProgramRow => ({ kind: "keynote", time, label, keynote: k });

const keynote1: Keynote = {
  speaker: "Akshay S. Chaudhari",
  affiliation: "Stanford University, USA",
  title: "Foundation models in radiology — state and future",
  avatarUrl: akshayImg,
  profileUrl: "https://profiles.stanford.edu/akshay-chaudhari",
  profileLabel: "Stanford profile",
  abstract: "Foundation models are large networks pretrained on vast, mostly unlabelled collections of images, reports and health-record data. In a few years they have moved from proof of concept to 3D vision–language models that can classify findings, draft reports and segment organs with little or no task-specific training. This keynote surveys where foundation models in radiology stand today: how they are built, what they can and cannot yet do, and why evaluation, generalisation across institutions and safe clinical deployment remain the open problems. It closes with where the field is heading, and what this may mean for other imaging-intensive disciplines such as radiotherapy.",
  bio: "Akshay Chaudhari is Associate Professor (Research) of Radiology and of Biomedical Data Science at Stanford University, and Interim Division Chief of the Imaging Informatics research section at Stanford Radiology. He is Co-Director of Clinical AI at Stanford Radiology and Associate Director of Research and Education at the Stanford AIMI Center. His group develops representation-learning and evaluation methods for large-scale, multimodal deep-learning models that combine images, language and medical records. His work has appeared in Nature, Nature Medicine and Nature Biomedical Engineering. Dr. Chaudhari’s research is funded by the NIH, ARPA-H, and several industry partners. He is a co-founder of Cognita Imaging, which received the first FDA breakthrough status for a generative vision language model.",
};

const keynote2: Keynote = {
  speaker: "Jelmer M. Wolterink",
  affiliation: "University of Twente, the Netherlands",
  title: "Artificial intelligence for cardiovascular applications",
  avatarUrl: jelmerImg,
  profileUrl: "https://people.utwente.nl/j.m.wolterink",
  profileLabel: "University of Twente profile",
  abstract: "Cardiovascular imaging has been one of the proving grounds of medical AI. Deep learning moved quickly from calcium scoring and vessel segmentation to models that turn CT, MR and ultrasound images into patient-specific representations of anatomy and blood flow. This keynote surveys where AI for cardiovascular applications stands today. It covers generative models, geometric deep learning that treats anatomy as shapes and meshes rather than voxel grids, and neural surrogates that make biomechanical simulation fast enough for clinical use. It also discusses what is still missing before these personalised models can guide diagnosis, prognosis and treatment planning, and where the field is heading. Many of these questions (deformation, geometry, trustworthy simulation) are shared with radiotherapy.",
  bio: "Jelmer M. Wolterink is Associate Professor in the Mathematics of Imaging & AI (MIA) group, Faculty of Electrical Engineering, Mathematics and Computer Science (EEMCS), University of Twente, and is part of the TechMed Centre’s cardiovascular health programme. He obtained his PhD at Utrecht University (UMC Utrecht) in 2017 with a thesis on machine-learning-based analysis of cardiovascular images, followed by postdocs at UMC Utrecht and Amsterdam UMC. He joined Twente in 2020. His research focuses on machine learning for medical image analysis, in particular generative models and geometric deep learning, with the aim of building personalised models of cardiovascular patients. In 2020 he received an NWO Veni grant to predict abdominal aortic aneurysm growth and rupture.",
};

export const programDays: ProgramDay[] = [
  {
    label: "Day 1",
    date: "1 April 2027",
    rows: [
      item("08:30–09:15", "Registration & welcome coffee"),
      item("09:15–09:30", "Opening remarks"),
      {
        kind: "session", time: "09:30–11:00", id: "S1", title: "Segmentation & Registration",
        talk: { title: "State of the art: AI for segmentation and registration in radiotherapy", speaker: "Ana Barragán-Montero", affiliation: "UCLouvain, Belgium", initials: "AB", avatarUrl: anaImg },
      },
      item("11:00–11:30", "Coffee break"),
      {
        kind: "session", time: "11:30–13:00", id: "S2", title: "Reconstruction & Synthesis",
        talk: { title: "State of the art: AI for image reconstruction and synthesis", speaker: "Adrian Thummerer", affiliation: "Department of Radiation Oncology, Inselspital, University of Bern, Switzerland", initials: "AT", avatarUrl: adrianImg },
      },
      item("13:00–14:15", "Lunch"),
      {
        kind: "session", time: "14:15–15:45", id: "S3", title: "Foundation Models, Text, Explainability & Uncertainty",
        talk: { title: "State of the art: foundation models, language and uncertainty in radiotherapy", speaker: "Harini Veeraraghavan", affiliation: "Memorial Sloan Kettering Cancer Center, USA", initials: "HV", avatarUrl: hariniImg },
      },
      keynote("16:00–16:45", "Keynote 1", keynote1),
      item("16:45–17:30", "Refreshments"),
      item("from 19:00", "Optional: social dinner", {
        location: "Humphrey's Restaurant Utrecht",
        mapsUrl:
          "https://www.google.com/maps/dir/?api=1&destination=Humphrey's%20Restaurant%2C%20Stadhuisbrug%203%2C%203511%20KP%20Utrecht",
      }),
    ],
  },
  {
    label: "Day 2",
    date: "2 April 2027",
    rows: [
      item("08:30–09:15", "Morning coffee / re-registration"),
      {
        kind: "session", time: "09:15–10:45", id: "S4", title: "Dose & Adaptive Workflows",
        talk: { title: "State of the art: AI for dose prediction and adaptive workflows", speaker: "Ye Zhang", affiliation: "Paul Scherrer Institute, Switzerland", initials: "YZ", avatarUrl: yeImg },
      },
      item("10:45–11:15", "Coffee break"),
      {
        kind: "session", time: "11:15–12:45", id: "S5", title: "Clinical Predictions & Outcomes",
        talk: { title: "State of the art: AI for outcome modelling and clinical prediction", speaker: "Cécile Wolfs", affiliation: "MAASTRO Clinic, Maastricht, the Netherlands", initials: "CW", avatarUrl: cecileImg },
      },
      item("12:45–14:00", "Lunch"),
      {
        kind: "session", time: "14:00–15:30", id: "S6", title: "Implementation, QA & Ethics",
        talk: { title: "State of the art: clinical implementation, QA and ethics of AI in radiotherapy", speaker: "Tomas Janssen", affiliation: "Netherlands Cancer Institute (NKI), Amsterdam", initials: "TJ", avatarUrl: tomasImg },
      },
      keynote("15:45–16:30", "Keynote 2", keynote2),
      item("16:30–17:00", "Awards & closing"),
      item("17:00–18:30", "Farewell borrel"),
    ],
  },
];

export const programNotice =
  "Provisional programme. The final programme will be confirmed in December 2026, after abstract acceptance.";
