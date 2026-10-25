"use client";

import type { FC } from "react";
import { NotificationsWithChannel } from "../../real-time/notifications-with-channel";

type Props = {
  me: any;
};

export const NotificationsMenu: FC<Props> = (props) => {
  const { me } = props;
  if (!me) return null;

  return <NotificationsWithChannel userId={me.id} initNotifications={[]} />;
};
