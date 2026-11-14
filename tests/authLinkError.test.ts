import { test, expect } from "bun:test";
import { parseAuthLinkError } from "../src/lib/authLinkError";

test("detects expired reset link in hash", () => {
  const r = parseAuthLinkError("#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired&sb=");
  expect(r?.code).toBe("otp_expired");
  expect(r?.description).toBe("Email link is invalid or has expired");
});
test("ignores normal URLs", () => {
  expect(parseAuthLinkError("#section", "?utm_source=x")).toBeNull();
});
