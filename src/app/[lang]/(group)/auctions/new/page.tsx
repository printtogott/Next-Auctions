export const runtime = "edge";

import { Trans } from "@lingui/react/macro";
import type { FC } from "react";
import { TypographyH2 } from "@/app/_components/typography/h2";
import { TypographyLead } from "@/app/_components/typography/lead";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type LangParam, withI18n } from "@/i18n";
import { CreateAuctionForm } from "./_components/create-auction-form";

type Props = {
  params: Promise<LangParam>;
};

const Page: FC<Props> = async (props) => {
  return (
    <div className="max-w-5xl flex flex-col gap-4 mx-auto pb-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <TypographyH2>
              <Trans>Create your auction</Trans>
            </TypographyH2>
          </CardTitle>
          <CardDescription>
            <TypographyLead>
              <Trans>Fill the form below to create a new auction</Trans>
            </TypographyLead>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateAuctionForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default withI18n(Page);
