"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import Link from "next/link";
import type { ComponentProps, FC } from "react";
import { Button } from "@/components/ui/button";

type Props = ComponentProps<typeof Button> & {
  isAuthenticated?: boolean;
};

export const AuctionsCreateButton: FC<Props> = (props) => {
  const { disabled, isAuthenticated, ...rest } = props;
  const { i18n } = useLingui();
  const { locale: lang } = i18n;

  if (!isAuthenticated) {
    return (
      <Button {...rest} asChild variant="outline">
        <Link href={`/${lang}/login`}>
          <Trans>Sign In to Create Auction</Trans>
        </Link>
      </Button>
    );
  }

  return (
    <Button {...rest} asChild variant="default">
      <Link href={`/${lang}/auctions/new`}>
        <Trans>Create Auction</Trans>
      </Link>
    </Button>
  );
};
