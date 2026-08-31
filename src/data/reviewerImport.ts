// Reviewer roster for the AIinRT2027 abstract track, homogenised from the
// reviewer preference collection form. Topic labels are mapped to the current
// abstract submission topics. Used by the admin reviewer-import action.

export type ReviewerImportRecord = {
  firstName: string;
  lastName: string;
  email: string;
  affiliation: string;
  /** Must match public.topics.name exactly. */
  topics: string[];
};

export const DEFAULT_REVIEWER_PASSWORD = "AIinRT2027";

export const reviewerImportRoster: ReviewerImportRecord[] = [
  {"firstName": "Ana María", "lastName": "Barragán Montero", "email": "ana.barragan@uclouvain.be", "affiliation": "MIRO (Molecular Imaging Radiation Oncology), UCLouvain, Belgium", "topics": ["Dose & Adaptive Workflows", "Segmentation & Registration"]},
  {"firstName": "Tom Julius", "lastName": "Bloecker", "email": "hallo@tomjulius.de", "affiliation": "Department of Radiation Oncology, LMU University Hospital, Munich, Germany", "topics": ["Segmentation & Registration", "Foundation Models, Text, Explainability & Uncertainty"]},
  {"firstName": "Gijs", "lastName": "Bol", "email": "g.h.bol@umcutrecht.nl", "affiliation": "UMC Utrecht, The Netherlands", "topics": ["Reconstruction & Synthesis", "Segmentation & Registration", "Dose & Adaptive Workflows"]},
  {"firstName": "Pim", "lastName": "Borman", "email": "pborman@umcutrecht.nl", "affiliation": "UMC Utrecht, The Netherlands", "topics": ["Implementation, QA & Ethics", "Dose & Adaptive Workflows"]},
  {"firstName": "Sebastiaan", "lastName": "Breedveld", "email": "s.breedveld@erasmusmc.nl", "affiliation": "Erasmus MC, The Netherlands", "topics": ["Dose & Adaptive Workflows", "Implementation, QA & Ethics"]},
  {"firstName": "Charlotte", "lastName": "Brouwer", "email": "c.l.brouwer@umcg.nl", "affiliation": "Department of Radiation Oncology, University Medical Center Groningen, The Netherlands", "topics": ["Implementation, QA & Ethics", "Segmentation & Registration"]},
  {"firstName": "Joren", "lastName": "Brunekreef", "email": "j.brunekreef@nki.nl", "affiliation": "Department of Radiotherapy, Netherlands Cancer Institute, The Netherlands", "topics": ["Segmentation & Registration", "Foundation Models, Text, Explainability & Uncertainty"]},
  {"firstName": "Wouter", "lastName": "Crijns", "email": "wouter.crijns@uzleuven.be", "affiliation": "Laboratory of Experimental Radiotherapy, Department of Oncology, KU Leuven, Belgium", "topics": ["Implementation, QA & Ethics", "Dose & Adaptive Workflows"]},
  {"firstName": "Davide", "lastName": "Cusumano", "email": "davide.cusumano@materolbia.com", "affiliation": "Mater Olbia, Italy", "topics": ["Reconstruction & Synthesis", "Clinical Predictions & Outcomes"]},
  {"firstName": "Szabolcs", "lastName": "David", "email": "s.david@amsterdamumc.nl", "affiliation": "Department of Radiotherapy, Amsterdam UMC, The Netherlands", "topics": ["Clinical Predictions & Outcomes"]},
  {"firstName": "Marco", "lastName": "Fusella", "email": "marco.fusella@gmail.com", "affiliation": "Radiation Oncology Department, Policlinico Abano Terme, Abano Terme, Italy", "topics": ["Dose & Adaptive Workflows", "Reconstruction & Synthesis", "Implementation, QA & Ethics"]},
  {"firstName": "André", "lastName": "Haraldsson", "email": "andre.haraldsson@skane.se", "affiliation": "Radiation Physics, Skåne University Hospital, Sweden", "topics": ["Clinical Predictions & Outcomes", "Implementation, QA & Ethics", "Dose & Adaptive Workflows"]},
  {"firstName": "Coen", "lastName": "Hurkmans", "email": "coen.hurkmans@cze.nl", "affiliation": "Catharina Hospital, The Netherlands", "topics": ["Dose & Adaptive Workflows", "Implementation, QA & Ethics"]},
  {"firstName": "Christian", "lastName": "Jamtheim Gustafsson", "email": "christian.jamtheimgustafsson@skane.se", "affiliation": "Skåne University Hospital and Lund University, Sweden", "topics": ["Segmentation & Registration", "Reconstruction & Synthesis", "Implementation, QA & Ethics"]},
  {"firstName": "Tomas", "lastName": "Janssen", "email": "t.janssen@nki.nl", "affiliation": "Netherlands Cancer Institute (NKI), The Netherlands", "topics": ["Segmentation & Registration", "Implementation, QA & Ethics", "Foundation Models, Text, Explainability & Uncertainty"]},
  {"firstName": "Mustafa", "lastName": "Kadhim", "email": "mustafa.i.kadhim@skane.se", "affiliation": "Lund University and Skåne University Hospital, Sweden", "topics": ["Reconstruction & Synthesis", "Segmentation & Registration", "Foundation Models, Text, Explainability & Uncertainty"]},
  {"firstName": "Amith", "lastName": "Kamath", "email": "amith.kamath@unibe.ch", "affiliation": "University of Bern, Switzerland", "topics": ["Segmentation & Registration", "Dose & Adaptive Workflows", "Implementation, QA & Ethics"]},
  {"firstName": "Christopher", "lastName": "Kurz", "email": "christopher.kurz@med.uni-muenchen.de", "affiliation": "Department of Radiation Oncology, LMU University Hospital Munich, Germany", "topics": ["Segmentation & Registration", "Reconstruction & Synthesis"]},
  {"firstName": "Federica Carmen", "lastName": "Maruccio", "email": "f.maruccio@nki.nl", "affiliation": "Department of Radiotherapy, Netherlands Cancer Institute, The Netherlands", "topics": ["Implementation, QA & Ethics", "Segmentation & Registration"]},
  {"firstName": "Federico", "lastName": "Mastroleo", "email": "mastroleo.federico@mayo.edu", "affiliation": "Department of Radiation Oncology, Mayo Clinic, Rochester, MN, USA", "topics": ["Segmentation & Registration", "Foundation Models, Text, Explainability & Uncertainty", "Implementation, QA & Ethics"]},
  {"firstName": "Nicolas", "lastName": "Mühlschlegel", "email": "nicolas.muehlschlegel@med.uni-muenchen.de", "affiliation": "Department of Radiation Oncology, LMU University Hospital, LMU Munich, Germany", "topics": ["Segmentation & Registration", "Dose & Adaptive Workflows"]},
  {"firstName": "Marcel", "lastName": "Nachbar", "email": "marcel.nachbar@med.uni-tuebingen.de", "affiliation": "University Hospital Tübingen, Germany", "topics": ["Segmentation & Registration", "Dose & Adaptive Workflows"]},
  {"firstName": "Zoltán", "lastName": "Perkó", "email": "z.perko@tudelft.nl", "affiliation": "Delft University of Technology, The Netherlands / Radformation Inc.", "topics": ["Dose & Adaptive Workflows"]},
  {"firstName": "Josien", "lastName": "Pluim", "email": "j.pluim@tue.nl", "affiliation": "Biomedical Engineering, TU/e, The Netherlands", "topics": ["Segmentation & Registration"]},
  {"firstName": "Florian", "lastName": "Putz", "email": "florian.putz@uk-erlangen.de", "affiliation": "Radiotherapy Department, University Hospital Erlangen, Germany", "topics": ["Segmentation & Registration", "Foundation Models, Text, Explainability & Uncertainty"]},
  {"firstName": "Viktor", "lastName": "Rogowski", "email": "viktor.rogowski@skane.se", "affiliation": "Skåne University Hospital and Lund University, Sweden", "topics": ["Reconstruction & Synthesis", "Dose & Adaptive Workflows", "Clinical Predictions & Outcomes"]},
  {"firstName": "Chelsea", "lastName": "Sargeant", "email": "chelsea.sargeant@manchester.ac.uk", "affiliation": "University of Manchester, United Kingdom", "topics": ["Reconstruction & Synthesis", "Segmentation & Registration", "Clinical Predictions & Outcomes"]},
  {"firstName": "Annette", "lastName": "Schwarz", "email": "annette.schwarz@fau.de", "affiliation": "Department of Radiation Oncology, University Hospital Erlangen, Germany", "topics": ["Foundation Models, Text, Explainability & Uncertainty", "Segmentation & Registration", "Clinical Predictions & Outcomes"]},
  {"firstName": "Marianna", "lastName": "Sijtsema", "email": "n.m.sijtsema@umcg.nl", "affiliation": "University Medical Center Groningen, The Netherlands", "topics": ["Segmentation & Registration", "Clinical Predictions & Outcomes"]},
  {"firstName": "Attila", "lastName": "Simkó", "email": "attila.simko@umu.se", "affiliation": "Umeå University, Sweden", "topics": ["Reconstruction & Synthesis", "Segmentation & Registration", "Dose & Adaptive Workflows"]},
  {"firstName": "Konrad", "lastName": "Stawiski", "email": "konradg_stawiski@dfci.harvard.edu", "affiliation": "Department of Biostatistics and Translational Medicine, Medical University of Lodz, Poland & Department of Radiation Oncology, Dana-Farber Cancer Institute / Harvard Medical School, USA", "topics": ["Segmentation & Registration", "Foundation Models, Text, Explainability & Uncertainty", "Clinical Predictions & Outcomes"]},
  {"firstName": "Stephanie", "lastName": "Tanadini-Lang", "email": "stephanie.tanadini-lang@usz.ch", "affiliation": "Department of Radiation Oncology, University Hospital Zurich, Switzerland", "topics": ["Dose & Adaptive Workflows", "Implementation, QA & Ethics"]},
  {"firstName": "Adrian", "lastName": "Thummerer", "email": "adrian.thummerer@unibe.ch", "affiliation": "Department of Radiation Oncology, Inselspital, University of Bern, Switzerland", "topics": ["Reconstruction & Synthesis", "Foundation Models, Text, Explainability & Uncertainty"]},
  {"firstName": "Harini", "lastName": "Veeraraghavan", "email": "veerarah@mskcc.org", "affiliation": "Medical Physics, Memorial Sloan Kettering Cancer Center, USA", "topics": ["Segmentation & Registration", "Foundation Models, Text, Explainability & Uncertainty", "Clinical Predictions & Outcomes"]},
  {"firstName": "Kareem", "lastName": "Wahid", "email": "kareemwahid111@gmail.com", "affiliation": "Radiation Oncology, MD Anderson Cancer Center, USA", "topics": ["Segmentation & Registration", "Clinical Predictions & Outcomes", "Implementation, QA & Ethics"]},
  {"firstName": "Niklas", "lastName": "Wahl", "email": "n.wahl@dkfz-heidelberg.de", "affiliation": "Division of Medical Physics in Radiation Oncology, Deutsches Krebsforschungszentrum (DKFZ) Heidelberg, Germany", "topics": ["Dose & Adaptive Workflows", "Clinical Predictions & Outcomes"]},
  {"firstName": "Cecile", "lastName": "Wolfs", "email": "cecile.wolfs@maastro.nl", "affiliation": "Clinical Data Science, Maastro, The Netherlands", "topics": ["Clinical Predictions & Outcomes", "Implementation, QA & Ethics"]},
  {"firstName": "Ye", "lastName": "Zhang", "email": "ye.zhang@psi.ch", "affiliation": "Center for Proton Therapy, Paul Scherrer Institute, Switzerland", "topics": ["Reconstruction & Synthesis", "Dose & Adaptive Workflows", "Foundation Models, Text, Explainability & Uncertainty"]},
  {"firstName": "Lukas", "lastName": "Zimmermann", "email": "lukas.a.zimmermann@meduniwien.ac.at", "affiliation": "Department of Radiooncology, Medical University of Vienna, Austria", "topics": ["Reconstruction & Synthesis", "Segmentation & Registration", "Foundation Models, Text, Explainability & Uncertainty"]},
  {"firstName": "Wouter", "lastName": "van Elmpt", "email": "wouter.vanelmpt@maastro.nl", "affiliation": "Maastro, The Netherlands", "topics": ["Clinical Predictions & Outcomes", "Implementation, QA & Ethics"]},
  {"firstName": "Erik", "lastName": "van der Bijl", "email": "erik.vanderbijl@radboudumc.nl", "affiliation": "Department of Radiation Oncology, Radboudumc, The Netherlands", "topics": ["Segmentation & Registration", "Implementation, QA & Ethics"]},
];
