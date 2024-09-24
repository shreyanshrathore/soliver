"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { api } from "../../../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useApiMutation } from "@/src/hooks/use-api-mutation";

interface CreateFormProps {
  username: string;
}
const CreateFormSchema = z.object({
  title: z
    .string()
    .min(20, {
      message: "Title must be at least 20 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  subcategoryId: z.string({
    required_error: "Please select a subcategory.",
  }),
});

type CreateFormValues = z.infer<typeof CreateFormSchema>;

const defaultValues: Partial<CreateFormValues> = {
  title: "",
};

export const CreateForm = ({ username }: CreateFormProps) => {
  const categories = useQuery(api.categories.get);
  const [subcategories, setSubcategories] = useState<Doc<"subcategories">[]>(
    []
  );
  const { mutate, pending } = useApiMutation(api.gig.create);
  const router = useRouter();

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function handleCategoryChange(categoryName: string) {
    if (categories === undefined) return;
    const selectedCategory = categories.find(
      (category) => category.name === categoryName
    );
    if (selectedCategory) {
      setSubcategories(selectedCategory.subcategories);
    }
  }

  function onSubmit(data: CreateFormValues) {
    mutate({
      title: data.title,
      description: "",
      subcategoryId: data.subcategoryId,
    })
      .then((gigId: Id<"gigs">) => {
        toast.info("Gig created successfully");
        //form.setValue("title", "");
        router.push(`/seller/${username}/manage-gigs/edit/${gigId}`);
      })
      .catch(() => {
        toast.error("Failed to create gig");
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="I will do something amazing" {...field} />
              </FormControl>
              <FormDescription>
                Craft a keyword-rich Gig title to attract potential buyers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(categoryName: string) => {
                  field.onChange(categoryName);
                  handleCategoryChange(categoryName);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                {categories && (
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
              <FormDescription>
                Select a category most relevant to your service.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subcategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subcategories.map((subcategory, index) => (
                    <SelectItem key={index} value={subcategory._id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Subcategory will help buyers pinpoint your service more
                narrowly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          Save
        </Button>
      </form>
    </Form>
  );
};
