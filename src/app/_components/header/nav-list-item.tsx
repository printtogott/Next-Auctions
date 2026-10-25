"use client";

import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef, FC } from "react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const linkClassName =
  "group text-sm h-12 leading-none font-medium flex flex-row items-center gap-x-2 w-full cursor-pointer px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors";

const iconClassName =
  "opacity-70 group-hover:opacity-100 transition-opacity duration-200";

type BaseProps = ComponentPropsWithoutRef<"li"> & {
  title: string;
  icon?: LucideIcon;
};

type LinkItemProps = {
  href: string;
};

type DisabledItemProps = {
  disabledLabel: string;
};

type ListItemProps = BaseProps & LinkItemProps;

export const NavListItem: FC<ListItemProps> = (props) => {
  const { title, icon, href, className, ...rest } = props;
  const Icon = icon;
  const router = useRouter();

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <li {...rest} className={cn("w-full", className)}>
      <NavigationMenuLink asChild>
        <a
          href={href}
          onClick={handleNavigation}
          className={cn(linkClassName, "min-w-full")}
        >
          {Icon && <Icon size={16} className={iconClassName} />}
          <span>{title}</span>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

type DisabledNavListItemProps = BaseProps & DisabledItemProps;
export const DisabledNavListItem: FC<DisabledNavListItemProps> = (props) => {
  const { title, icon, disabledLabel, className, ...rest } = props;
  const Icon = icon;

  return (
    <li {...rest} className={cn("w-full", className)}>
      <NavigationMenuLink asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                linkClassName,
                "inline-flex text-muted-foreground cursor-not-allowed opacity-50",
              )}
              aria-disabled={true}
            >
              {Icon && <Icon size={16} className={iconClassName} />}
              <span>{title}</span>
            </span>
          </TooltipTrigger>
          <TooltipContent>{disabledLabel}</TooltipContent>
        </Tooltip>
      </NavigationMenuLink>
    </li>
  );
};
