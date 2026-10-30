"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import Link from "next/link";
import { type FC, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { TypographyLead } from "../typography/lead";
import { NavLinks } from "./nav-links";
import { VerificationBanner } from "./verification-banner";

export const Header: FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null,
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const fetchUserStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        // Fallback to user metadata or default to UNVERIFIED if field is missing
        setVerificationStatus(
          user.user_metadata?.verificationStatus ?? "UNVERIFIED",
        );
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchUserStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setVerificationStatus(
          session.user.user_metadata?.verificationStatus ?? "UNVERIFIED",
        );
      } else {
        setIsLoggedIn(false);
        setVerificationStatus(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {isLoggedIn && <VerificationBanner status={verificationStatus} />}
      <header className="flex justify-between items-center h-20 sm:h-28 md:h-32 px-4 sm:px-16">
        <Logo />
        <NavLinks />
      </header>
      <Separator />
    </>
  );
};

const Logo: FC = () => {
  const { i18n } = useLingui();
  const { locale: lang } = i18n;

  return (
    <Link href={`/${lang}/`} className="flex flex-col">
      <span className="font-extrabold text-2xl sm:text-3xl tracking-widest">
        ttbids
      </span>
      <TypographyLead className="max-sm:hidden text-xs md:text-base mt-1">
        <Trans>Track Auctions. Effortlessly</Trans>
      </TypographyLead>
    </Link>
  );
};
