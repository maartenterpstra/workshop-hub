import { DEMO_ABSTRACT_ID } from "@/lib/demoAbstract";

/** Public, anonymous identifier for an abstract, e.g. AIinRT27-007. */
export const formatAbstractNumber = (n: number | null | undefined, id?: string): string => {
  if (id && id === DEMO_ABSTRACT_ID) return "EXAMPLE";
  if (n == null || !Number.isFinite(n) || n < 1) return "AIinRT27-???";
  return `AIinRT27-${String(Math.trunc(n)).padStart(3, "0")}`;
};
