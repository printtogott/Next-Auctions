import type { Locale } from "@lingui/core";

type Params = {
  value: number | null;
  locale: Locale;
};

export const formatCurrency = (params: Params) => {
  const { value, locale } = params;

  if (value == null) return null;

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "TTD",
  }).format(value);

  return formatted;
};
