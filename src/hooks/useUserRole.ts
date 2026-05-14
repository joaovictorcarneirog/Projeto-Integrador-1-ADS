import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "vendedor" | "comprador" | null;

export function useUserRole() {
  const [role, setRole] = useState<AppRole>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const resolve = async (uid: string | null) => {
      if (!uid) {
        if (mounted) {
          setRole(null);
          setUserId(null);
          setLoading(false);
        }
        return;
      }
      // Check admin first via user_roles table
      const { data: adminRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();

      if (adminRow) {
        if (mounted) {
          setRole("admin");
          setUserId(uid);
          setLoading(false);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("tipo_usuario")
        .eq("id", uid)
        .maybeSingle();

      if (mounted) {
        setRole((profile?.tipo_usuario as AppRole) || "comprador");
        setUserId(uid);
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      resolve(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoading(true);
      resolve(session?.user?.id ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { role, userId, loading };
}
