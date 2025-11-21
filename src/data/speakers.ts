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
import albertoDeLucaImg from "@/assets/speakers/alberto-de-luca.jpg";
import stefanFransenImg from "@/assets/speakers/stefan-fransen.jpg";
import sebastiaanBreedveldImg from "@/assets/speakers/sebastiaan-breedveld.jpg";
import adrianThummererImg from "@/assets/speakers/adrian-thummerer.jpg";
import anaMariaBarraganMonteroImg from "@/assets/speakers/ana-maria-barragan-montero.png";
import nicoVanDenBergImg from "@/assets/speakers/nico-van-den-berg.png";
import pimBormanImg from "@/assets/speakers/pim-borman.jpg";

export const speakers: Record<string, Speaker> = {
  "matteo-maspero": {
    id: "matteo-maspero",
    name: "Matteo Maspero",
    affiliation: "UMC Utrecht",
    avatarUrl: matteoMasperoImg,
    initials: "MM",
    bio: "Assistant professor at UMC Utrecht and medical physicist in training, specializing in deep learning applications for radiotherapy. Focus on MR-only radiotherapy and synthetic CT generation."
  },
  "maarten-terpstra": {
    id: "maarten-terpstra",
    name: "Maarten Terpstra",
    affiliation: "UMC Utrecht",
    avatarUrl: maartenTerpstraImg,
    initials: "MT",
    bio: "Researcher at UMC Utrecht working on deep learning for real-time motion-robust MRI imaging."
  },
  "charlotte-brouwer": {
    id: "charlotte-brouwer",
    name: "Charlotte Brouwer",
    affiliation: "UMCG",
    avatarUrl: charlotteBrouwerImg,
    initials: "CB",
    bio: "Medical physicist at University Medical Center Groningen, expert in radiotherapy treatment planning and clinical implementation of AI solutions."
  },
  "alberto-de-luca": {
    id: "alberto-de-luca",
    name: "Alberto de Luca",
    affiliation: "UMC Utrecht",
    avatarUrl: albertoDeLucaImg,
    initials: "AL",
    bio: "Assistant professor at the Image Sciences Institute (ISI) at UMC Utrecht. Focuses on diffusion MRI and treatment response."
  },
  "ana-maria-barragan-montero": {
    id: "ana-maria-barragan-montero",
    name: "Ana Maria Barragán Montero",
    affiliation: "KU Leuven",
    avatarUrl: anaMariaBarraganMonteroImg,
    initials: "AB",
    bio: "Postdoctoral lecturer at KU Leuven, specializing in MR-guided treatment of esophageal cancer."
  },
  "stefan-fransen": {
    id: "stefan-fransen",
    name: "Stefan Fransen",
    affiliation: "UMCG",
    avatarUrl: stefanFransenImg,
    initials: "SF",
    bio: "Medical physicist at UMCG, focusing on treatment outcome prediction in prostate cancer."
  },
  "adrian-thummerer": {
    id: "adrian-thummerer",
    name: "Adrian Thummerer",
    affiliation: "LMU Munich",
    avatarUrl: adrianThummererImg,
    initials: "AT",
    bio: "Postdoctoral researcher at LMU Munich who develops deep learning models for synthetic CT generation."
  },
  "sebastiaan-breedveld": {
    id: "sebastiaan-breedveld",
    name: "Sebastiaan Breedveld",
    affiliation: "Erasmus MC",
    avatarUrl: sebastiaanBreedveldImg,
    initials: "SB",
    bio: "Associate professor at Erasmus MC, specializing in deep learning for radiotherapy treatment planning."
  },
  "nico-van-den-berg": {
    id: "nico-van-den-berg",
    name: "Nico van den Berg",
    affiliation: "UMC Utrecht",
    avatarUrl: nicoVanDenBergImg,
    initials: "NvdB",
    bio: "Professor at the UMC Utrecht, head of the Computational Imaging Group."
  },
  "pim-borman": {
    id: "pim-borman",
    name: "Pim Borman",
    affiliation: "UMC Utrecht",
    avatarUrl: pimBormanImg,
    initials: "PB",
    bio: "Computer scientist at UMC Utrecht, working on novel dose delivery techniques."
  },
  "TBA": {
    id: "TBA",
    name: "To Be Announced",
    affiliation: "TBA",
    avatarUrl: "",
    initials: "TBA",
    bio: "TBA"
  }
};
