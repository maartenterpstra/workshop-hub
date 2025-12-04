// Educational Workshop Schedule - Monday, March 17, 2025
export interface ScheduleItem {
  time: string;
  title: string;
  speaker?: string;
  speakerId?: string;
  description?: string;
  type?: "break" | "session" | "discussion";
}

export const educationalSchedule: ScheduleItem[] = [
  {
    time: "09:00 - 09:20",
    title: "Registration and Coffee",
    type: "break"
  },
  {
    time: "09:20 - 09:30",
    title: "Welcome and Introduction",
    speaker: "Matteo Maspero",
    speakerId: "matteo-maspero",
    type: "session"
  },
  {
    time: "09:30 - 10:30",
    title: "Introduction to Machine Learning and Deep Learning",
    speaker: "Alberto de Luca",
    speakerId: "alberto-de-luca",
    description: "Fundamentals of ML/DL, neural networks, and training processes",
    type: "session"
  },
  {
    time: "10:30 - 11:00",
    title: "Deep learning for autocontouring",
    speaker: "Matteo Maspero",
    speakerId: "matteo-maspero",
    description: "Automated organ and tumor segmentation techniques",
    type: "session"
  },
  {
    time: "11:00 - 11:20",
    title: "Coffee Break",
    type: "break"
  },
  {
    time: "11:20 - 11:55",
    title: "Deep learning methods for image reconstruction",
    speaker: "Stefan Fransen",
    speakerId: "stefan-fransen",
    description: "Techniques for image reconstruction using deep learning",
    type: "session"
  },
  {
    time: "11:55 - 12:30",
    title: "Deep learning methods for image registration and contour propagation",
    speaker: "Maarten Terpstra",
    speakerId: "maarten-terpstra",
    description: "Deformable registration and adaptive radiotherapy applications",
    type: "session"
  },
  {
    time: "12:30 - 13:30",
    title: "Lunch Break",
    type: "break"
  },
  {
    time: "13:30 - 14:15",
    title: "Deep learning for image synthesis",
    speaker: "Adrian Thummerer",
    speakerId: "adrian-thummerer",
    description: "Synthetic CT generation for MR-only radiotherapy and adaptive CBCT workflows",
    type: "session"
  },
  {
    time: "14:15 - 14:55",
    title: "Deep learning for treatment planning",
    speaker: "Sebastiaan Breedveld",
    speakerId: "sebastiaan-breedveld",
    description: "Fast and automated treatment plan generation using DL",
    type: "session"
  },
  {
    time: "14:55 - 15:35",
    title: "Explainable AI & Uncertainty Quantification in Radiotherapy",
    speaker: "Ana Maria Barragán Montero",
    speakerId: "ana-maria-barragan-montero",
    description: "Ensuring transparency and reliability of DL models in clinical practice",
    type: "session"
  },
  {
    time: "15:35 - 15:50",
    title: "Coffee Break",
    type: "break"
  },
  {
    time: "15:50 - 16:30",
    title: "Large language models (LLMs) in Radiotherapy",
    speaker: "Nico van den Berg",
    speakerId: "nico-van-den-berg",
    description: "Applications of LLMs for clinical documentation and decision support",
    type: "session"
  },
  {
    time: "16:30 - 17:00",
    title: "Regulatory issues & implementation of deep learning in the clinic",
    speaker: "Pim Borman",
    speakerId: "pim-borman",
    description: "Regulatory aspects, workflow integration, and practical considerations",
    type: "session"
  },
  {
    time: "17:00 - 17:10",
    title: "Closing Remarks and Q&A",
    speaker: "Matteo Maspero",
    speakerId: "matteo-maspero",
    type: "discussion"
  }
];
