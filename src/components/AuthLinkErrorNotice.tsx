import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { parseAuthLinkError, type AuthLinkError } from "@/lib/authLinkError";

export default function AuthLinkErrorNotice() {
  const [error, setError] = useState<AuthLinkError | null>(null);
  useEffect(() => {
    const e = parseAuthLinkError(window.location.hash, window.location.search);
    if (e) {
      setError(e);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);
  return (
    <Dialog open={!!error} onOpenChange={(o) => !o && setError(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>This email link has expired</DialogTitle>
          <DialogDescription>
            Links can only be used once and expire after a while. Some work email systems open links automatically, which uses them up. Request a fresh one below — you can also use the code in the email instead of the link.
          </DialogDescription>
        </DialogHeader>
        <ForgotPasswordForm />
      </DialogContent>
    </Dialog>
  );
}
