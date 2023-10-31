"use client";

import { useEffect, type ReactNode } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineChevronDown, HiXMark } from "react-icons/hi2";
import Image from "next/image";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Spinner from "../spinner";
import useImageUpload from "@/lib/hooks/useImageUpload";

type FieldOptions =
  | "toggle"
  | "horizontal-tabs"
  | "input"
  | "number"
  | "text-area"
  | "upload"
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
  options?: {
    label: string;
    value: string;
    icon?: ReactNode;
    description?: string;
  }[];
};
type FieldType<TSchema> = DefaultFieldType<TSchema> &
  (
    | {
        type: "select-search";
        options: {
          label: string;
          description?: string;
          value: string;
          icon?: ReactNode;
        }[];
      }
    | {
        type: "select";
        description?: string;
        options: {
          label: string;
          value: string;
          icon?: ReactNode;
          description?: string;
        }[];
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
    <Template title={title} className="md:max-w-[450px]">
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
              if (condition) {
                const state = watch(condition as Path<TSchema>);
                if (!state) return;
              }
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
                      ) : type === "select-search" ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="flex">
                              {(() => {
                                const val = watch(slug as Path<TSchema>);
                                const selectedOption = fieldProps.options?.find(
                                  (o) => o.value === val,
                                );
                                if (selectedOption) {
                                  return selectedOption.label;
                                }
                                return "no list selected";
                              })()}{" "}
                              <HiOutlineChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="z-modal+ p-0"
                            align="start"
                          >
                            <Command>
                              <CommandInput placeholder={placeholder} />
                              <CommandList>
                                <CommandEmpty>No options found.</CommandEmpty>
                                <CommandGroup className="p-1.5">
                                  {fieldProps.options?.map((o) => (
                                    <CommandItem
                                      key={o.value}
                                      onSelect={() => {
                                        setValue(
                                          field.name,
                                          o.value as PathValue<
                                            TSchema,
                                            Path<TSchema>
                                          >,
                                        );
                                      }}
                                      className="teamaspace-y-1 flex flex-col items-start px-4 py-2"
                                    >
                                      <p>{o.label}</p>
                                      {!!o.description && (
                                        <p className="text-sm text-muted-foreground">
                                          {o.description}
                                        </p>
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      ) : // <Select
                      //   onValueChange={field.onChange}
                      //   defaultValue={field.value}
                      // >
                      //   <FormControl>
                      //     <SelectTrigger>
                      //       <SelectValue placeholder={placeholder} />
                      //     </SelectTrigger>
                      //   </FormControl>
                      //   <SelectContent className="z-modal+">
                      //     {fieldProps.options?.map((o) => (
                      //       <SelectItem key={o.value} value={o.value}>
                      //         {o.label}
                      //       </SelectItem>
                      //     ))}
                      //   </SelectContent>
                      // </Select>
                      type === "toggle" ? (
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      ) : type === "upload" ? (
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
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

function ImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (imageUrl: string) => void;
}) {
  const { status, imageUrl, clear, ImageUploadButton } =
    useImageUpload("event");
  const handleClear = () => {
    clear();
    onChange("");
  };
  useEffect(() => {
    if (imageUrl && value !== imageUrl) {
      onChange(imageUrl);
    }
  }, [imageUrl]);
  return (
    <div className="">
      {value || imageUrl ? (
        <div className="relative overflow-hidden rounded-xl">
          <div className="">
            <Image
              alt="Image"
              height="288"
              width="288"
              src={(value || imageUrl) as string}
              className={cn(
                "bg-bckground h-full rounded-xl object-cover object-center max-sm:max-h-[100px]",
                status === "uploading" && "grayscale",
                status === "error" && "blur-xl",
              )}
            />
          </div>
          {status === "uploading" && (
            <button className="center absolute left-1 top-1 rounded-full bg-foreground bg-opacity-70 p-1 text-background hover:bg-opacity-100">
              <Spinner />
            </button>
          )}
          {(status === "success" || value) && (
            <button
              onClick={handleClear}
              className="center absolute left-1 top-1 rounded-full bg-foreground bg-opacity-70 p-1 hover:bg-opacity-100"
            >
              <HiXMark
                className="block h-4 w-4 text-background"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      ) : (
        <ImageUploadButton>
          <Button
            className=""
            variant={"outline"}
            loading={status === "uploading"}
          >
            {imageUrl ? "Uploaded!" : "Upload"}
          </Button>
        </ImageUploadButton>
      )}
    </div>
  );
}
