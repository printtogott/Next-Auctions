import { Trans, useLingui } from "@lingui/react/macro";
import Link from "next/link";
import type { FC } from "react";
import { TypographyH6 } from "./typography/h6";

export const Footer: FC = () => {
  const { i18n } = useLingui();
  const { locale: lang } = i18n;

  return (
    <footer className="flex flex-col py-4 sm:pb-8 gap-2 sm:gap-4 items-center justify-center">
      <div className="flex gap-2 items-center">
        <TypographyH6>© {new Date().getFullYear()}</TypographyH6>

        <Link href={`/${lang}/`} scroll>
          <TypographyH6>
            ttbids | <Trans>Track Auctions. Effortlessly.</Trans>
          </TypographyH6>
        </Link>
      </div>
    </footer>
  );
};
