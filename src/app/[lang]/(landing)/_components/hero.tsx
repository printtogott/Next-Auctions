"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import Link from "next/link";
import { AuctionsCreateButtonWithMe } from "@/app/_components/auctions/auctions-create-button-with-me";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { i18n } = useLingui();
  const { locale: lang } = i18n;

  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 sm:-mt-12 md:-mt-16 min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{
          backgroundImage: `url("/hero-gavel.jpg")`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-zinc-950/70" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-xl">
          <Trans>Discover, Bid & Win Unique Auctions</Trans>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-8 drop-shadow-lg font-medium">
          <Trans>
            Join our community-driven platform to find exclusive deals and
            one-of-a-kind items.
          </Trans>
        </p>
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <Button
            asChild
            size="lg"
            className="rounded-xl font-semibold shadow-xl"
          >
            <Link href={`/${lang}/auctions`}>
              <Trans>Browse Auctions</Trans>
            </Link>
          </Button>

          <AuctionsCreateButtonWithMe
            size="lg"
            className="rounded-xl border-white/40 bg-black/40 text-white hover:bg-black/60 font-semibold backdrop-blur-md"
          />
        </div>
      </div>
    </section>
  );
}
