import type { Messages } from "@lingui/core";
import { i18n } from "@lingui/core";
import { messages as enMessages } from "./messages/en";
import { messages as esMessages } from "./messages/es";

export const allMessages: Record<string, Messages> = {
  en: enMessages,
  es: esMessages,
};

const CatalogsMapper: Record<string, () => Promise<Messages>> = {
  en: async () => enMessages,
  es: async () => esMessages,
};

export const dynamicActivate = async (locale: string) => {
  const catalog = allMessages[locale] || enMessages;
  i18n.load(locale, catalog);
  i18n.activate(locale);
  return catalog;
};

export const getI18nInstance = async (locale: string) => {
  await dynamicActivate(locale);
  return i18n;
};
