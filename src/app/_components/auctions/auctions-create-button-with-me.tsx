"use client";

import { type ComponentProps, type FC, useEffect, useState } from "react";
import type { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { AuctionsCreateButton } from "./auctions-create-button";

type Props = ComponentProps<typeof Button>;

export const AuctionsCreateButtonWithMe: FC<Props> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuctionsCreateButton disabled={loading || !isAuthenticated} {...props} />
  );
};
