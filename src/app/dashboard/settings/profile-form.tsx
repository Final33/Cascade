"use client";

import Link from "next/link";
import { Plus, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { UserContext } from "@/context/UserContext";

import { useContext, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const AP_CLASSES = [
  "AP Calculus",
  "AP Statistics",
  "AP Biology",
  "AP Chemistry",
  "AP Physics 1",
  "AP Physics 2",
  "AP Physics C",
  "AP Environmental Science",
  "AP Computer Science A",
  "AP Computer Science Principles",
  "AP English Language",
  "AP English Literature",
  "AP U.S. History",
  "AP World History",
  "AP European History",
  "AP Government",
  "AP Economics",
  "AP Psychology",
] as const;

export function ProfileForm({
  submitProfileForm,
}: {
  submitProfileForm: () => void;
}) {
  const { userData, refreshUserData } = useContext(UserContext);

  const profileFormSchema = z.object({
    name: z.string().min(1, "Please enter your name"),
    role: z.string().min(1, "Please enter your role"),
    apclasses: z.array(z.string()).default([]),
  });

  type ProfileFormValues = z.infer<typeof profileFormSchema>;

  // Create a modified version of userData without the role field
  const defaultFormValues = {
    ...userData,
    role: "", // Explicitly set role to empty string
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      apclasses: [],
      ...defaultFormValues,
    },
    mode: "onChange",
  });

  // Add AP Classes form array
  const { fields, append, remove } = useFieldArray({
    name: "apclasses",
    control: form.control,
  });

  useEffect(() => {
    if (userData) {
      // Reset form but maintain empty role
      form.reset({
        ...userData,
        role: form.getValues("role"), // Preserve current role value
      });
    }
  }, [userData, form.reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    submitProfileForm();

    const supabase = createSupabaseBrowserClient();
    const session = await supabase.auth.getSession();

    if (session.data.session) {
      const { error } = await supabase
        .from("users")
        .update({
          name: data.name,
          role: data.role,
          apclasses: data.apclasses || [],
        })
        .eq("uid", session.data.session.user.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      refreshUserData();
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl w-full">

        {userData?.onboarded && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  This is your name. It can be your real name or a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="referrer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How did you hear about Prepsy?</FormLabel>
              <FormControl>
                <Input
                  placeholder="TikTok, Linkedin, Reddit, etc."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Feel free to enter multiple sources.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your role?</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Student, Teacher, etc." 
                  {...field}
                  value={field.value || ""} // Ensure empty string if undefined
                />
              </FormControl>
              <FormDescription>
                This information helps us understand your role and what you are interested in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-base">AP Classes</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const currentClasses = form.getValues("apclasses") || [];
                append({ class: "" });
              }}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Select
                onValueChange={(value) => {
                  const currentClasses = form.getValues("apclasses") || [];
                  currentClasses[index] = value;
                  form.setValue("apclasses", currentClasses);
                }}
                value={form.getValues(`apclasses.${index}`) || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an AP Class" />
                </SelectTrigger>
                <SelectContent>
                  {AP_CLASSES.map((apClass) => (
                    <SelectItem key={apClass} value={apClass}>
                      {apClass}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="submit">Submit profile</Button>
      </form>
    </Form>
  );
}
