"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";

const chatbotFormSchema = z.object({
  gpt_version: z.string(),
  tone: z.string(),
  essay_length: z.string(),
  essay_style: z.string(),
  include_examples: z.boolean(),
  custom_instructions: z.string().optional(),
});

type ChatbotFormValues = z.infer<typeof chatbotFormSchema>;

export function ChatbotForm() {
  const { userData, refreshUserData } = useContext(UserContext);
  const [defaultValues, setDefaultValues] = useState<
    Partial<ChatbotFormValues>
  >({});
  const [formKey, setFormKey] = useState(Date.now());

  useEffect(() => {
    if (userData) {
      setDefaultValues(userData);
      setFormKey(Date.now()); // Update key to force re-render
    }
  }, [userData]);

  const form = useForm<ChatbotFormValues>({
    resolver: zodResolver(chatbotFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    // This will reset the form with new default values whenever userData changes
    if (userData) {
      form.reset(userData);
    }
  }, [userData, form.reset]);

  async function onSubmit(data: ChatbotFormValues) {
    console.log(data);
    toast({
      title: "Success",
      description: "Your chatbot settings have been updated successfully.",
    });

    //send data to the server
    const session = await createSupabaseBrowserClient().auth.getSession();
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
      .from("users")
      .update({
        gpt_version: data.gpt_version,
        tone: data.tone,
        essay_length: data.essay_length,
        essay_style: data.essay_style,
        include_examples: data.include_examples,
        custom_instructions: data.custom_instructions,
      })
      .eq("uid", session.data.session?.user.id);

    refreshUserData();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  }

  return (
    userData && (
      <div>
        <Form {...form} key={formKey}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="gpt_version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GPT Version</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label="Select gpt version">
                        <SelectValue placeholder="Select gpt version" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-3.5-turbo">
                          GPT-3.5-Turbo
                        </SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choose the GPT version you want to use.
                    <br />
                    <br />
                    GPT-4 will be always be used no matter what for all
                    functionalities, except document commands and "write about
                    next" suggestions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot Tone</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label="Select chatbot tone">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="enthusiastic">
                          Enthusiastic
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choose the tone in which the chatbot will respond.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="essay_length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Essay Length</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      {...field}
                    >
                      <SelectTrigger aria-label="Select essay length">
                        <SelectValue placeholder="Select essay length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choose the length of the essay the chatbot will write.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="essay_style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Essay Style</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} {...field}>
                      <SelectTrigger aria-label="Select essay style">
                        <SelectValue placeholder="Select essay style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="narrative">Narrative</SelectItem>
                        <SelectItem value="expository">Expository</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                        <SelectItem value="descriptive">Descriptive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Choose the style of the essay the chatbot will write.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="include_examples"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Include Examples</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {field.value
                      ? "Examples will be included in the chatbot's responses."
                      : "Examples will not be included in the chatbot's responses."}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="custom_instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Instruction</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Add any other specific instructions you want to add to the
                    chatbot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update chatbot</Button>
          </form>
        </Form>
      </div>
    )
  );
}
