import { expect, test } from "bun:test";
import { formatAbstractNumber } from "../src/lib/abstractNumber";
import { DEMO_ABSTRACT_ID } from "../src/lib/demoAbstract";
test("pads abstract number to three digits", () => expect(formatAbstractNumber(7)).toBe("AIinRT27-007"));
test("example abstract is labelled EXAMPLE", () => expect(formatAbstractNumber(null, DEMO_ABSTRACT_ID)).toBe("EXAMPLE"));
