"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type FC } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { createClient } from "@/utils/supabase/client";
import { AuthButton } from "../auth/auth-button";
import { AuctionsMenu } from "./auctions-menu/auctions-menu";
import { SettingsMenu } from "./settings-menu/settings-menu";
import { UserMenu } from "./user-menu/user-menu";

// Dynamically import NotificationsMenu with SSR disabled to isolate server component dependencies
const NotificationsMenu = dynamic(
  () => import("./notifications-menu/notifications-menu").then((mod) => mod.NotificationsMenu),
  { ssr: false }
);

export const NavLinks: FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for sign-in / sign-out changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-row items-center gap-x-2 sm:gap-x-4 md:gap-x-6 h-full">
      {!loading && !user && (
        <Button asChild variant={"outline"}>
          <AuthButton className="h-8 sm:h-10 cursor-pointer text-sm leading-none font-medium flex flex-row justify-center items-center gap-x-2" />
        </Button>
      )}

      <NavigationMenu viewport={true}>
        <NavigationMenuList className="flex items-center gap-x-2 sm:gap-x-4 md:gap-x-6">
          <AuctionsMenu me={user} />
          <SettingsMenu />
          {!loading && user && (
            <>
              <UserMenu me={user} />
              <NotificationsMenu me={user} />
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
