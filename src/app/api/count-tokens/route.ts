import assert from "node:assert";
import { getEncoding, encodingForModel } from "js-tiktoken";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

interface UserInfo {
  tokens_used: number;
  Gpt_3_tokens_used: number;
  Gpt_4_tokens_used: number;
  Gpt_version: string;
  login_times?: string[];
}

export async function POST(req: Request) {
  try {
    const { text, model } = await req.json();
    
    const encoding = model ? encodingForModel(model) : getEncoding("gpt2");
    assert(encoding.decode(encoding.encode(text)) === text);
    const tokensUsed = encoding.encode(text).length;

    const supabase = createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userInfo } = await supabase
      .from("users")
      .select<"*", UserInfo>("tokens_used, Gpt_3_tokens_used, Gpt_4_tokens_used, Gpt_version, login_times")
      .eq("uid", userId)
      .single();

    if (!userInfo) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const updateData = {
      tokens_used: (userInfo.tokens_used || 0) + tokensUsed,
      ...(userInfo.Gpt_version?.includes('4')
        ? { Gpt_4_tokens_used: (userInfo.Gpt_4_tokens_used || 0) + tokensUsed }
        : { Gpt_3_tokens_used: (userInfo.Gpt_3_tokens_used || 0) + tokensUsed })
    };

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("uid", userId);

    if (error) {
      console.error("Error updating token usage:", error);
      return Response.json({ error: "Failed to update token usage" }, { status: 500 });
    }

    return Response.json({ tokensUsed });
  } catch (error) {
    console.error("Token counting error:", error);
    return Response.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
