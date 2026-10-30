"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";

type Props = {
  status?: string | null;
};

export const VerificationBanner: FC<Props> = ({ status = "UNVERIFIED" }) => {
  const { i18n } = useLingui();
  const { locale: lang } = i18n;

  if (status === "VERIFIED") return null;

  const isPending = status === "PENDING";

  return (
    <div
      className={`w-full py-2.5 px-4 text-xs sm:text-sm font-medium text-center flex items-center justify-center gap-x-2 transition-colors ${
        isPending
          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-b border-amber-500/20"
          : "bg-destructive/10 text-destructive border-b border-destructive/20"
      }`}
    >
      {isPending ? (
        <ShieldAlert className="size-4 shrink-0" />
      ) : (
        <AlertTriangle className="size-4 shrink-0" />
      )}

      <span>
        {isPending ? (
          <Trans>
            Your identity verification is currently under review. Auction
            creation will be enabled once approved.
          </Trans>
        ) : (
          <Trans>
            Your account is unverified. Please upload your identity documents to
            unlock auction creation features.
          </Trans>
        )}
      </span>

      {!isPending && (
        <Link
          href={`/${lang}/profile/edit`}
          className="underline font-semibold hover:opacity-80 transition-opacity ml-1"
        >
          <Trans>Verify Now</Trans> &rarr;
        </Link>
      )}
    </div>
  );
};
