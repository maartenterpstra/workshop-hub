import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Seo from "./Seo";

const SITE_URL = "https://workshop-spark-25.lovable.app";

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "AIinRT2027 — Artificial Intelligence in Radiotherapy",
  startDate: "2027-04-01",
  endDate: "2027-04-02",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  url: `${SITE_URL}/`,
  description:
    "Scientific symposium on Artificial Intelligence in Radiotherapy, Utrecht, 1–2 April 2027.",
  location: {
    "@type": "Place",
    name: "Princess Máxima Center / UMC Utrecht — Auditorium (2nd floor)",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Heidelberglaan 25",
      addressLocality: "Utrecht",
      postalCode: "3584 CS",
      addressCountry: "NL",
    },
  },
  organizer: [
    { "@type": "Organization", name: "UMC Utrecht", url: "https://www.umcutrecht.nl" },
    {
      "@type": "Organization",
      name: "Princess Máxima Center for Pediatric Oncology",
      url: "https://www.prinsesmaximacentrum.nl",
    },
    { "@type": "Organization", name: "DLinRT.eu", url: "https://dlinrt.eu" },
  ],
};

const meta: Record<
  string,
  { title: string; description: string; jsonLd?: Record<string, unknown> }
> = {
  "/": {
    title: "AIinRT2027 — AI in Radiotherapy Symposium · Utrecht",
    description:
      "AIinRT2027, 1–2 April 2027 in Utrecht: a scientific symposium on artificial intelligence in radiotherapy by UMC Utrecht with Princess Máxima Center and DLinRT.eu.",
    jsonLd: eventJsonLd,
  },
  "/program": {
    title: "Programme — AIinRT2027 Utrecht",
    description:
      "Six 90-minute sessions in clinical-workflow order, invited state-of-the-art talks, proffered papers and daily cross-disciplinary keynotes at AIinRT2027.",
  },
  "/submission": {
    title: "Abstract Submission — AIinRT2027",
    description:
      "Submission rules, templates, word limits and review criteria for AIinRT2027 abstracts, including the APC waiver for the best-scoring paper.",
  },
  "/registration": {
    title: "Registration — AIinRT2027",
    description:
      "Registration and payment for AIinRT2027 are handled on the Princess Máxima Center platform, which also lists suggested accommodation.",
  },
  "/organizers": {
    title: "Organizers & Committees — AIinRT2027",
    description:
      "Local and regional organizers, the Scientific Organizing Committee and the advisory board behind the AIinRT2027 symposium in Utrecht.",
  },
  "/venue": {
    title: "Venue & Travel — AIinRT2027 Utrecht",
    description:
      "How to reach the AIinRT2027 venue in Utrecht Science Park: public transport to the PMC stop, parking, airport connections and suggested hotels.",
  },
  "/reviewers": {
    title: "Reviewers — AIinRT2027",
    description:
      "The international reviewer panel evaluating AIinRT2027 abstracts, with affiliations and short biographies.",
  },
};

const RouteSeo = () => {
  const { pathname } = useLocation();
  const key = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const entry = meta[key];

  if (!entry) {
    return (
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
    );
  }

  return (
    <Seo title={entry.title} description={entry.description} path={key} jsonLd={entry.jsonLd} />
  );
};

export default RouteSeo;
