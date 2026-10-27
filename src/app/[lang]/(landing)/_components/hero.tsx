import { Trans } from "@lingui/react/macro";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section 
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6 min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      {/* Edge-to-edge background image covering full viewport width */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{ 
          backgroundImage: `url('/hero-gavel.jpg')`,
        }}
      />

      {/* Lightened overlay to make the wooden gavel & sound block details clearly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-zinc-950/80" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
          <Trans>Discover, Bid & Win Unique Auctions</Trans>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow-md font-medium">
          <Trans>
            Join our community-driven platform to find exclusive deals and one-of-a-kind items.
          </Trans>
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="rounded-xl font-semibold shadow-xl">
            <Link href="/auctions">
              <Trans>Browse Auctions</Trans>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl border-white/30 bg-black/40 text-white hover:bg-black/60 font-semibold backdrop-blur-md">
            <Link href="/auctions/create">
              <Trans>Create Auction</Trans>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
