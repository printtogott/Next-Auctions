"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import Link from "next/link";
import type { ComponentProps, FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof Button>;

export const AuctionsCreateButton: FC<Props> = (props) => {
  const { disabled, ...rest } = props;
  const { i18n } = useLingui();
  const { locale: lang } = i18n;

  if (disabled) {
    return (
      <>
        {/* Mobile View */}
        <div className="sm:hidden cursor-not-allowed inline-block">
          <DisabledBtn {...rest} />
        </div>

        {/* Desktop View with Tooltip */}
        <span className="max-sm:hidden cursor-not-allowed inline-block">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-not-allowed inline-block">
                <DisabledBtn {...rest} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <Trans>Please log in to create auctions.</Trans>
            </TooltipContent>
          </Tooltip>
        </span>
      </>
    );
  }

  return (
    <Button {...rest} asChild variant="outline">
      <Link href={`/${lang}/auctions/new`}>
        <Trans>Create Auction</Trans>
      </Link>
    </Button>
  );
};

const DisabledBtn: FC<Props> = (props) => {
  const { className, ...rest } = props;

  return (
    <Button
      {...rest}
      type="button"
      // We use pointer-events-auto on a wrapper/button with aria-disabled so the hover works and cursor shows correctly
      aria-disabled={true}
      variant="outline"
      className={cn(
        className,
        "text-muted-foreground !cursor-not-allowed pointer-events-auto opacity-70"
      )}
      onClick={(e) => e.preventDefault()}
    >
      <Trans>Create Auction</Trans>
    </Button>
  );
};
