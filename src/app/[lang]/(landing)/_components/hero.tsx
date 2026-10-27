import { Trans } from "@lingui/react/macro";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background Image Container with responsive sizing */}
      <div 
        className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-contain md:bg-cover transition-all duration-300"
        style={{ 
          backgroundImage: `url('/hero-gavel.jpg')`,
          backgroundPosition: 'center center',
        }}
      />

      {/* Balanced dark overlay to preserve wood detail */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/65 to-zinc-950/90" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-md">
          <Trans>Discover, Bid & Win Unique Auctions</Trans>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 drop-shadow">
          <Trans>
            Join our community-driven platform to find exclusive deals and one-of-a-kind items.
          </Trans>
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="rounded-xl font-semibold shadow-lg">
            <Link href="/auctions">
              <Trans>Browse Auctions</Trans>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl border-white/30 bg-black/50 text-white hover:bg-black/70 font-semibold backdrop-blur-sm">
            <Link href="/auctions/create">
              <Trans>Create Auction</Trans>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
