import type { Messages } from "@lingui/core";

const CatalogsMapper: Record<string, () => Promise<Messages>> = {
  en: async () => import("./messages/en").then((mod) => mod.messages),
  es: async () => import("./messages/es").then((mod) => mod.messages),
};

export const dynamicActivate = async (locale: string) => {
  const catalog = await CatalogsMapper[locale]();
  return catalog;
};
