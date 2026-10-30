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
        <div className="sm:hidden" style={{ cursor: "not-allowed" }}>
          <DisabledBtn {...rest} />
        </div>

        {/* Desktop View with Tooltip */}
        <span className="max-sm:hidden" style={{ cursor: "not-allowed" }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div style={{ cursor: "not-allowed", display: "inline-block" }}>
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
      variant="outline"
      aria-disabled={true}
      style={{ cursor: "not-allowed" }}
      className={cn(
        className,
        "text-muted-foreground opacity-70 pointer-events-auto",
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Trans>Create Auction</Trans>
    </Button>
  );
};
