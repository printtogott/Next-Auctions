import { Trans } from "@lingui/react/macro";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      className="relative min-h-[85vh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url('/hero-gavel.jpg')` }}
    >
      {/* Dark overlay for rich contrast */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
          <Trans>Discover, Bid & Win Unique Auctions</Trans>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          <Trans>
            Join our community-driven platform to find exclusive deals and one-of-a-kind items.
          </Trans>
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="rounded-xl font-semibold">
            <Link href="/auctions">
              <Trans>Browse Auctions</Trans>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl border-white/20 bg-black/40 text-white hover:bg-black/60 font-semibold">
            <Link href="/auctions/create">
              <Trans>Create Auction</Trans>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
