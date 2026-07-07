import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AppConfig {
  submission_opens_at: string | null;
  submission_closes_at: string | null;
  debug_mode: boolean;
}

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("app_config")
      .select("submission_opens_at, submission_closes_at, debug_mode")
      .maybeSingle()
      .then(({ data }) => {
        setConfig(
          data ?? { submission_opens_at: null, submission_closes_at: null, debug_mode: false }
        );
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const opensAt = config?.submission_opens_at ? new Date(config.submission_opens_at) : null;
  const closesAt = config?.submission_closes_at ? new Date(config.submission_closes_at) : null;
  const debug = !!config?.debug_mode;

  const submissionOpen = debug || (!!opensAt && now >= opensAt && (!closesAt || now < closesAt));
  const submissionClosed = debug || (!!closesAt && now >= closesAt);

  return { config, loading, debug, submissionOpen, submissionClosed, opensAt, closesAt };
}
