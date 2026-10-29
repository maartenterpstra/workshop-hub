import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PublicSlot = {
  session_id: string; kind: "oral"; slot_position: number;
  start_time: string | null; end_time: string | null; title: string; presenter: string | null; authors: string | null;
};

export async function fetchPublicSchedule(): Promise<PublicSlot[]> {
  const { data, error } = await supabase.rpc("get_public_schedule");
  if (error) { console.error("Schedule unavailable", error); return []; }
  return (data ?? []) as PublicSlot[];
}

/** Accepted talks; empty until the SOC publishes the schedule. */
export function usePublicSchedule() {
  const [slots, setSlots] = useState<PublicSlot[]>([]);
  useEffect(() => { fetchPublicSchedule().then(setSlots); }, []);
  return slots;
}
