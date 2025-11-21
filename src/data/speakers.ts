// Speaker information for the educational workshop
export interface Speaker {
  id: string;
  name: string;
  affiliation: string;
  avatarUrl?: string;
  initials: string;
  bio: string;
}

import matteoMasperoImg from "@/assets/speakers/matteo-maspero.jpg";
import maartenTerpstraImg from "@/assets/speakers/maarten-terpstra.jpg";
import charlotteBrouwerImg from "@/assets/speakers/charlotte-brouwer.jpg";
import alexTeacherImg from "@/assets/speakers/alex-treacher.jpg";
import oscarAcostaImg from "@/assets/speakers/oscar-acosta.jpg";
import wouterVanElmptImg from "@/assets/speakers/wouter-van-elmpt.jpg";
import alexZwanenburgImg from "@/assets/speakers/alex-zwanenburg.jpg";
import tomasJanssenImg from "@/assets/speakers/tomas-janssen.jpg";

export const speakers: Record<string, Speaker> = {
  "matteo-maspero": {
    id: "matteo-maspero",
    name: "Matteo Maspero",
    affiliation: "UMC Utrecht",
    avatarUrl: matteoMasperoImg,
    initials: "MM",
    bio: "Medical physicist and researcher at UMC Utrecht, specializing in deep learning applications for radiotherapy. Focus on MR-only radiotherapy and synthetic CT generation."
  },
  "maarten-terpstra": {
    id: "maarten-terpstra",
    name: "Maarten Terpstra",
    affiliation: "UMC Utrecht",
    avatarUrl: maartenTerpstraImg,
    initials: "MT",
    bio: "Researcher at UMC Utrecht working on deep learning for medical image analysis and radiotherapy applications."
  },
  "charlotte-brouwer": {
    id: "charlotte-brouwer",
    name: "Charlotte Brouwer",
    affiliation: "UMCG",
    avatarUrl: charlotteBrouwerImg,
    initials: "CB",
    bio: "Medical physicist at University Medical Center Groningen, expert in radiotherapy treatment planning and clinical implementation of AI solutions."
  },
  "alex-treacher": {
    id: "alex-treacher",
    name: "Alex Treacher",
    affiliation: "Cambridge University Hospitals",
    avatarUrl: alexTeacherImg,
    initials: "AT",
    bio: "Medical physicist at Cambridge University Hospitals with expertise in machine learning applications for radiotherapy."
  },
  "oscar-acosta": {
    id: "oscar-acosta",
    name: "Oscar Acosta",
    affiliation: "CLCC Eugene Marquis",
    avatarUrl: oscarAcostaImg,
    initials: "OA",
    bio: "Researcher at Centre de Lutte Contre le Cancer Eugene Marquis, specializing in medical image analysis and radiomics."
  },
  "wouter-van-elmpt": {
    id: "wouter-van-elmpt",
    name: "Wouter van Elmpt",
    affiliation: "MAASTRO Clinic",
    avatarUrl: wouterVanElmptImg,
    initials: "WE",
    bio: "Medical physicist at MAASTRO Clinic, leading research in adaptive radiotherapy and deep learning for treatment optimization."
  },
  "alex-zwanenburg": {
    id: "alex-zwanenburg",
    name: "Alex Zwanenburg",
    affiliation: "OncoRay Dresden",
    avatarUrl: alexZwanenburgImg,
    initials: "AZ",
    bio: "Researcher at OncoRay Dresden focusing on radiomics and quantitative image analysis for personalized radiotherapy."
  },
  "tomas-janssen": {
    id: "tomas-janssen",
    name: "Tomas Janssen",
    affiliation: "NKI Amsterdam",
    avatarUrl: tomasJanssenImg,
    initials: "TJ",
    bio: "Medical physicist at Netherlands Cancer Institute, expert in image-guided radiotherapy and clinical AI implementation."
  }
};
