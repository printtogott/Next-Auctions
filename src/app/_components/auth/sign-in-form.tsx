"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowRightFromLineIcon } from "lucide-react";
import { type FC, startTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  onCloseSideSheet?: () => void;
};

export const SignInForm: FC<Props> = ({ onCloseSideSheet }) => {
  const { t } = useLingui();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = useCallback(
    async (values: FormSchema) => {
      try {
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) throw error;

        toast.success(t`Successfully signed in!`);

        startTransition(() => {
          if (onCloseSideSheet) onCloseSideSheet();
          window.location.reload();
        });
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
            <Trans>Signing in...</Trans>
          ) : (
            <span className="inline-flex gap-x-2 items-center">
              <ArrowRightFromLineIcon size={16} />
              <Trans>Sign in</Trans>
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
};
