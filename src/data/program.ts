import adrianImg from "@/assets/speakers/adrian-thummerer.jpg";
import anaImg from "@/assets/organizers/ana-maria-barragan-montero.jpg";
import hariniImg from "@/assets/speakers/harini-veeraraghavan.jpg";
import yeImg from "@/assets/speakers/ye-zhang.jpg";
import cecileImg from "@/assets/speakers/cecile-wolfs.jpg";
import keynoteManImg from "@/assets/keynotes/placeholder-man.svg";
import keynoteWomanImg from "@/assets/keynotes/placeholder-woman.svg";

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
};

export type ProgramRow =
  | { kind: "item"; time: string; label: string }
  | { kind: "keynote"; time: string; label: string; keynote: Keynote }
  | { kind: "session"; time: string; id: string; title: string; talk: ExpertTalk };

export type ProgramDay = { label: string; date: string; rows: ProgramRow[] };

const item = (time: string, label: string): ProgramRow => ({ kind: "item", time, label });
const keynote = (time: string, label: string, avatarUrl: string): ProgramRow => ({
  kind: "keynote", time, label,
  keynote: { speaker: "Speaker to be announced", affiliation: "", title: "Title to be announced", bio: "", abstract: "", avatarUrl },
});

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
      item("16:00–16:45", "Keynote 1"),
      item("16:45–17:30", "Refreshments"),
      item("from 19:00", "Optional: social dinner"),
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
        talk: { title: "State of the art: clinical implementation, QA and ethics of AI in radiotherapy", speaker: "Tomas Janssen", affiliation: "Netherlands Cancer Institute (NKI), Amsterdam", initials: "TJ" },
      },
      item("15:45–16:30", "Keynote 2"),
      item("16:30–17:00", "Awards & closing"),
      item("17:00–18:30", "Farewell borrel"),
    ],
  },
];

export const programNotice =
  "Provisional programme. The final programme will be confirmed in December 2026, after abstract acceptance.";
