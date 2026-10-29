import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import {
  type AuctionCategory,
  AuctionCategorySchema,
} from "@/core/domains/auction";

export const AuctionCategoryToMessage: Record<
  AuctionCategory,
  MessageDescriptor
> = {
  [AuctionCategorySchema.enum.AUTOMOTIVE]: msg`Automotive`,
  [AuctionCategorySchema.enum.ELECTRONICS]: msg`Electronics`,
  [AuctionCategorySchema.enum.HOME]: msg`Home`,
};

export const AuctionCategoryClassNames: Record<AuctionCategory, string> = {
  [AuctionCategorySchema.enum.AUTOMOTIVE]:
    "bg-red-400 text-accent dark:text-accent-foreground",
  [AuctionCategorySchema.enum.ELECTRONICS]:
    "bg-gray-500 text-accent dark:text-accent-foreground",
  [AuctionCategorySchema.enum.HOME]:
    "bg-gray-300 text-accent-foreground dark:text-accent",
};
