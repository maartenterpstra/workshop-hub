import { expect, test } from "bun:test";
import { formatAbstractNumber } from "../src/lib/abstractNumber";
import { DEMO_ABSTRACT_ID } from "../src/lib/demoAbstract";
test("pads abstract number to three digits", () => expect(formatAbstractNumber(7)).toBe("AIinRT27-007"));
test("example abstract is labelled EXAMPLE", () => expect(formatAbstractNumber(null, DEMO_ABSTRACT_ID)).toBe("EXAMPLE"));
import { pdfVersionFromPath, versionedPdfName } from "../src/lib/abstractNumber";
test("reads version from stored PDF name", () => expect(pdfVersionFromPath("u/a/AIinRT27-003_2.pdf")).toBe(2));
test("unversioned path counts as version 0", () => expect(pdfVersionFromPath("u/a/upload-1.pdf")).toBe(0));
test("first upload is _1", () => expect(versionedPdfName("AIinRT27-008", pdfVersionFromPath(null) + 1)).toBe("AIinRT27-008_1.pdf"));
