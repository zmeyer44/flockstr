"use client";

import { type ReactNode } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldErrors,
  useForm,
  FieldValues,
  DefaultValues,
  Path,
  PathValue,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import Template from "./Template";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type FieldOptions =
  | "toggle"
  | "horizontal-tabs"
  | "input"
  | "number"
  | "text-area"
  | "custom";

type DefaultFieldType<TSchema> = {
  label: string;
  slug: keyof z.infer<z.Schema<TSchema>> & string;
  placeholder?: string;
  subtitle?: string;
  description?: string;
  lines?: number;
  styles?: string;
  value?: string | number | boolean;
  custom?: ReactNode;
  condition?: keyof z.infer<z.Schema<TSchema>> & string;
  options?: { label: string; value: string; icon?: ReactNode }[];
};
type FieldType<TSchema> = DefaultFieldType<TSchema> &
  (
    | {
        type: "select";
        options: { label: string; value: string; icon?: ReactNode }[];
      }
    | {
        type: FieldOptions;
      }
  );

type FormModalProps<TSchema> = {
  title: string;
  fields: FieldType<TSchema>[];
  errors?: FieldErrors;
  isSubmitting?: boolean;
  cta: {
    text: string;
  };
  defaultValues?: Partial<z.infer<z.Schema<TSchema>>>;
  onSubmit: (props: z.infer<z.Schema<TSchema>>) => any;
  formSchema: z.Schema<TSchema>;
};

export default function FormModal<TSchema extends FieldValues>({
  title,
  fields,
  cta,
  errors,
  isSubmitting,
  formSchema,
  defaultValues,
  onSubmit,
}: FormModalProps<TSchema>) {
  type FormDataType = z.infer<typeof formSchema>;
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as DefaultValues<TSchema>,
    mode: "onChange",
  });
  const { watch, setValue } = form;
  return (
    <Template title={title} className="md:max-w-[400px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map(
            ({
              label,
              slug,
              type,
              placeholder,
              description,
              subtitle,
              condition,
              ...fieldProps
            }) => {
              if (!condition) {
                return (
                  <FormField
                    key={slug}
                    control={form.control}
                    name={slug as Path<TSchema>}
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          type === "toggle" &&
                            "flex items-center gap-x-3 space-y-0",
                        )}
                      >
                        <FormLabel>{label}</FormLabel>
                        {type === "input" ? (
                          <FormControl>
                            <Input placeholder={placeholder} {...field} />
                          </FormControl>
                        ) : type === "text-area" ? (
                          <FormControl>
                            <Textarea
                              placeholder={placeholder}
                              {...field}
                              className="auto-sizing"
                            />
                          </FormControl>
                        ) : type === "select" ? (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-modal+">
                              {fieldProps.options?.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : type === "toggle" ? (
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        ) : type === "number" ? (
                          <FormControl>
                            <Input
                              placeholder={placeholder}
                              type="number"
                              {...field}
                            />
                          </FormControl>
                        ) : (
                          <FormControl>
                            <Input placeholder={placeholder} {...field} />
                          </FormControl>
                        )}
                        {!!description && (
                          <FormDescription>{description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }
              const state = watch(condition as Path<TSchema>);
              if (!state) return;
              return (
                <FormField
                  key={slug}
                  control={form.control}
                  name={slug as Path<TSchema>}
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        type === "toggle" &&
                          "flex items-center gap-x-3 space-y-0",
                      )}
                    >
                      <FormLabel>
                        {label}
                        {!!subtitle && (
                          <span className="ml-1.5 text-[0.8rem] font-normal text-muted-foreground ">
                            {subtitle}
                          </span>
                        )}
                      </FormLabel>
                      {type === "input" ? (
                        <FormControl>
                          <Input placeholder={placeholder} {...field} />
                        </FormControl>
                      ) : type === "text-area" ? (
                        <FormControl>
                          <Textarea
                            placeholder={placeholder}
                            {...field}
                            className="auto-sizing"
                          />
                        </FormControl>
                      ) : type === "select" ? (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-modal+">
                            {fieldProps.options?.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : type === "toggle" ? (
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      ) : type === "number" ? (
                        <FormControl>
                          <Input
                            placeholder={placeholder}
                            type="number"
                            {...field}
                            onChange={(e) => {
                              setValue(
                                field.name,
                                parseInt(e.target.value) as PathValue<
                                  TSchema,
                                  Path<TSchema>
                                >,
                              );
                            }}
                          />
                        </FormControl>
                      ) : (
                        <FormControl>
                          <Input placeholder={placeholder} {...field} />
                        </FormControl>
                      )}
                      {!!description && (
                        <FormDescription>{description}</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            },
          )}
          <Button type="submit" className="w-full" loading={isSubmitting}>
            {cta.text}
          </Button>
        </form>
      </Form>
    </Template>
  );
}
