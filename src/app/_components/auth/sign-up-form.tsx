"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowRightFromLineIcon } from "lucide-react";
import { type FC, startTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateUserParamsSchema } from "@/core/domains/user";
import { createClient } from "@/utils/supabase/client"; // Or your standard client import path

const formSchema = CreateUserParamsSchema;
type FormSchema = z.infer<typeof formSchema>;

type Props = {
  onCloseSideSheet: () => void;
};

export const SignUpForm: FC<Props> = (props) => {
  const { onCloseSideSheet } = props;
  const { t } = useLingui();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = useCallback(
    async (values: FormSchema) => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              first_name: values.firstName,
              last_name: values.lastName,
            },
          },
        });

        if (error) throw error;

        startTransition(() => {
          onCloseSideSheet();
        });

        toast.success(
          t`You successfully signed up! Please check your email for verification.`,
        );
      } catch (err: any) {
        console.error(err);
        toast.error(
          err.message || t`Something went wrong, please try again later.`,
        );
      }
    },
    [t, onCloseSideSheet],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Trans>First name</Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="jane doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Trans>Last name</Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Trans>Email</Trans>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jane.doe@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Trans>Password</Trans>
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full cursor-pointer"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Trans>Signing up...</Trans>
          ) : (
            <span className="inline-flex gap-x-2 items-center">
              <ArrowRightFromLineIcon size={8} />
              <Trans>Sign up</Trans>
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};
