"use client";

import { type Messages, setupI18n } from "@lingui/core";
import { I18nProvider as LinguiProvider } from "@lingui/react";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";

type Props = {
  lang: string;
  messages: Messages;
};

export const I18nProvider: FC<PropsWithChildren<Props>> = (props) => {
  const { lang, messages, children } = props;

  const [i18n] = useState(() => {
    return setupI18n({
      locale: lang,
      messages: { [lang]: messages },
    });
  });

  useEffect(() => {
    if (lang && messages) {
      i18n.load(lang, messages);
      i18n.activate(lang);
    }
  }, [lang, messages, i18n]);

  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
};
