// Reviewers for DLinRT / AIinRT 2027 — sourced from the reviewer preference
// collection form. Only reviewers who consented to be listed publicly are
// included here.

export type Reviewer = {
  name: string;
  surname: string;
  affiliation: string;
  website?: string;
};

const withScheme = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const raw: Reviewer[] = [
  { name: "Szabolcs", surname: "David", affiliation: "Department of Radiotherapy, Amsterdam UMC, The Netherlands", website: "https://www.amsterdamumc.org/en/research/researchers/szabolcs-david" },
  { name: "Harini", surname: "Veeraraghavan", affiliation: "Medical Physics, Memorial Sloan Kettering Cancer Center, USA", website: "https://www.mskcc.org/profile/harini-veeraraghavan" },
  { name: "Tom Julius", surname: "Bloecker", affiliation: "Department of Radiation Oncology, LMU University Hospital, Munich, Germany", website: "https://lmu-art-lab.userweb.mwn.de/author/tom-blocker/" },
  { name: "Federico", surname: "Mastroleo", affiliation: "Department of Radiation Oncology, Mayo Clinic, Rochester, MN, USA" },
  { name: "Konrad", surname: "Stawiski", affiliation: "Department of Biostatistics and Translational Medicine, Medical University of Lodz, Poland & Department of Radiation Oncology, Dana-Farber Cancer Institute / Harvard Medical School, USA", website: "konsta.com.pl" },
  { name: "Kareem", surname: "Wahid", affiliation: "Radiation Oncology, MD Anderson Cancer Center, USA", website: "https://kareemwahid.com/" },
  { name: "Joren", surname: "Brunekreef", affiliation: "Department of Radiotherapy, Netherlands Cancer Institute, The Netherlands", website: "https://jorenb.github.io/" },
  { name: "Marco", surname: "Fusella", affiliation: "Radiation Oncology Department, Policlinico Abano Terme, Abano Terme, Italy", website: "https://www.linkedin.com/in/marco-fusella-750b358b" },
  { name: "Gijs", surname: "Bol", affiliation: "UMC Utrecht, The Netherlands" },
  { name: "Erik", surname: "van der Bijl", affiliation: "Department of Radiation Oncology, Radboudumc, The Netherlands" },
  { name: "Mustafa", surname: "Kadhim", affiliation: "Lund University and Skåne University Hospital, Sweden", website: "https://www.linkedin.com/in/mustafa-musti-kadhim/" },
  { name: "Christopher", surname: "Kurz", affiliation: "Department of Radiation Oncology, LMU University Hospital Munich, Germany" },
  { name: "Attila", surname: "Simkó", affiliation: "Umeå University, Sweden" },
  { name: "Florian", surname: "Putz", affiliation: "Radiotherapy Department, University Hospital Erlangen, Germany" },
  { name: "Christian", surname: "Jamtheim Gustafsson", affiliation: "Skåne University Hospital and Lund University, Sweden" },
  { name: "Ana María", surname: "Barragán Montero", affiliation: "MIRO (Molecular Imaging Radiation Oncology), UCLouvain, Belgium", website: "https://www.uclouvain.be/en/research-institutes/irec/miro" },
  { name: "Charlotte", surname: "Brouwer", affiliation: "Department of Radiation Oncology, University Medical Center Groningen, The Netherlands" },
  { name: "Sebastiaan", surname: "Breedveld", affiliation: "Erasmus MC, The Netherlands", website: "sebastiaanbreedveld.nl" },
  { name: "Nicolas", surname: "Mühlschlegel", affiliation: "Department of Radiation Oncology, LMU University Hospital, LMU Munich, Germany", website: "https://lmu-art-lab.userweb.mwn.de/" },
  { name: "Adrian", surname: "Thummerer", affiliation: "Department of Radiation Oncology, Inselspital, University of Bern, Switzerland" },
  { name: "Stephanie", surname: "Tanadini-Lang", affiliation: "Department of Radiation Oncology, University Hospital Zurich, Switzerland" },
  { name: "Davide", surname: "Cusumano", affiliation: "Mater Olbia, Italy" },
  { name: "Lukas", surname: "Zimmermann", affiliation: "Department of Radiooncology, Medical University of Vienna, Austria" },
  { name: "André", surname: "Haraldsson", affiliation: "Radiation Physics, Skåne University Hospital, Sweden" },
  { name: "Wouter", surname: "Crijns", affiliation: "Laboratory of Experimental Radiotherapy, Department of Oncology, KU Leuven, Belgium" },
  { name: "Chelsea", surname: "Sargeant", affiliation: "University of Manchester, United Kingdom" },
  { name: "Federica", surname: "Carmen Maruccio", affiliation: "Department of Radiotherapy, Netherlands Cancer Institute, The Netherlands" },
  { name: "Tomas", surname: "Janssen", affiliation: "Netherlands Cancer Institute (NKI), The Netherlands" },
  { name: "Ye", surname: "Zhang", affiliation: "Center for Proton Therapy, Paul Scherrer Institute, Switzerland" },
  { name: "Cecile", surname: "Wolfs", affiliation: "Clinical Data Science, Maastro, The Netherlands" },
  { name: "Niklas", surname: "Wahl", affiliation: "Division of Medical Physics in Radiation Oncology, Deutsches Krebsforschungszentrum (DKFZ) Heidelberg, Germany", website: "dkfz.de/radopt" },
  { name: "Zoltán", surname: "Perkó", affiliation: "Delft University of Technology, The Netherlands / Radformation Inc." },
  { name: "Wouter", surname: "van Elmpt", affiliation: "Maastro, The Netherlands" },
  { name: "Amith", surname: "Kamath", affiliation: "University of Bern, Switzerland", website: "https://amithjkamath.github.io" },
  { name: "Marcel", surname: "Nachbar", affiliation: "University Hospital Tübingen, Germany" },
  { name: "Annette", surname: "Schwarz", affiliation: "Department of Radiation Oncology, University Hospital Erlangen, Germany" },
  { name: "Marianna", surname: "Sijtsema", affiliation: "University Medical Center Groningen, The Netherlands" },
  { name: "Coen", surname: "Hurkmans", affiliation: "Catharina Hospital, The Netherlands" },
];

export const reviewers: Reviewer[] = raw
  .map((r) => ({ ...r, website: withScheme(r.website) }))
  .sort((a, b) => a.surname.localeCompare(b.surname, "en", { sensitivity: "base" }));
