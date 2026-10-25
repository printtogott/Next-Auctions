import { cva } from "class-variance-authority";
import type { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { TypographyH4 } from "./typography/h4";
import { TypographySmall } from "./typography/small";

const userAvatarVariants = cva(
  "flex items-center gap-x-2 px-3 py-2 rounded-md overflow-hidden truncate text-ellipsis",
  {
    variants: {
      variant: {
        default: "",
        hover: "hover:bg-gray-100 dark:hover:bg-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type Props = {
  user: any;
  className?: string;
  avatarClassName?: string;
  variant?: "default" | "hover";
  onlyAvatar?: boolean;
};

export const UserAvatar: FC<Props> = ({
  user,
  className,
  avatarClassName,
  variant = "default",
  onlyAvatar = false,
}) => {
  const avatarUrl = user?.avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const email = user?.email;

  return (
    <div className={cn(userAvatarVariants({ variant }), className)}>
      <Avatar
        className={cn(
          "size-10 sm:size-12 md:size-14 rounded-md border border-border shadow-sm",
          avatarClassName,
        )}
      >
        {avatarUrl && (
          <AvatarImage src={`${avatarUrl}?t=${Date.now()}`} alt="User Avatar" />
        )}
        <AvatarFallback className="rounded-md bg-muted text-foreground font-semibold flex items-center justify-center size-full text-sm">
          {getInitials(user)}
        </AvatarFallback>
      </Avatar>
      {!onlyAvatar && (
        <div className="flex flex-col text-left">
          <TypographyH4 className="font-medium capitalize">
            {getFullName(user)}
          </TypographyH4>
          <TypographySmall className="max-[480px]:hidden mt-1">
            {email}
          </TypographySmall>
        </div>
      )}
    </div>
  );
};

const getFullName = (user: any) => {
  if (!user) return "";
  if (user.firstName || user.lastName) {
    return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  }
  const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
  if (metaName) return metaName;
  if (user.email) return user.email.split("@")[0];
  return "User";
};

const getInitials = (user: any) => {
  if (!user) return "U";
  if (user.firstName || user.lastName) {
    return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  }
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "";
  const parts = name.trim().split(/[s@_.-]+/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "U";
};
