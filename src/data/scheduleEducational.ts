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
    time: "09:00 - 09:30",
    title: "Registration and Coffee",
    type: "break"
  },
  {
    time: "09:30 - 09:40",
    title: "Welcome and Introduction",
    speaker: "Matteo Maspero",
    speakerId: "matteo-maspero",
    type: "session"
  },
  {
    time: "09:40 - 10:25",
    title: "Introduction to Machine Learning and Deep Learning",
    speaker: "Matteo Maspero",
    speakerId: "matteo-maspero",
    description: "Fundamentals of ML/DL, neural networks, and training processes",
    type: "session"
  },
  {
    time: "10:25 - 11:10",
    title: "Image Synthesis in Radiotherapy",
    speaker: "Maarten Terpstra",
    speakerId: "maarten-terpstra",
    description: "Synthetic CT generation, MR-to-CT synthesis, and applications",
    type: "session"
  },
  {
    time: "11:10 - 11:30",
    title: "Coffee Break",
    type: "break"
  },
  {
    time: "11:30 - 12:15",
    title: "Auto-contouring with Deep Learning",
    speaker: "Charlotte Brouwer",
    speakerId: "charlotte-brouwer",
    description: "Automated organ and tumor segmentation techniques",
    type: "session"
  },
  {
    time: "12:15 - 13:00",
    title: "Deep Learning for Treatment Planning",
    speaker: "Alex Treacher",
    speakerId: "alex-treacher",
    description: "Automated planning, dose prediction, and optimization",
    type: "session"
  },
  {
    time: "13:00 - 14:00",
    title: "Lunch Break",
    type: "break"
  },
  {
    time: "14:00 - 14:45",
    title: "Image Registration and Contour Propagation",
    speaker: "Oscar Acosta",
    speakerId: "oscar-acosta",
    description: "Deformable registration and adaptive radiotherapy applications",
    type: "session"
  },
  {
    time: "14:45 - 15:30",
    title: "Radiomics and Outcome Prediction",
    speaker: "Wouter van Elmpt",
    speakerId: "wouter-van-elmpt",
    description: "Feature extraction, predictive modeling, and clinical applications",
    type: "session"
  },
  {
    time: "15:30 - 15:50",
    title: "Coffee Break",
    type: "break"
  },
  {
    time: "15:50 - 16:35",
    title: "Quality Assurance and Validation of DL Models",
    speaker: "Alex Zwanenburg",
    speakerId: "alex-zwanenburg",
    description: "Testing, validation strategies, and performance metrics",
    type: "session"
  },
  {
    time: "16:35 - 17:20",
    title: "Clinical Implementation: Challenges and Solutions",
    speaker: "Tomas Janssen",
    speakerId: "tomas-janssen",
    description: "Regulatory aspects, workflow integration, and practical considerations",
    type: "session"
  },
  {
    time: "17:20 - 17:30",
    title: "Closing Remarks and Q&A",
    speaker: "Matteo Maspero",
    speakerId: "matteo-maspero",
    type: "discussion"
  }
];
