// pages/api/stripe-webhook.js
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
const baseUrl = process.env.WEBSITE_URL
  ? `${process.env.WEBSITE_URL}`
  : "http://localhost:3000";

export async function POST(req: Request) {
  console.log("--- STRIPE WEBHOOK RECEIVED ---");

  async function sendEmail(emailType: String, email: String) {
    console.log("emailing...");
    //post to /api/send
    const response = await fetch(`${baseUrl}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailType: emailType,
        email: email,
      }),
    });
    //get the response json
    const data = await response.json();
    console.log(data);
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    console.error('Failed to create Supabase client');
    return new NextResponse("Failed to create Supabase client", { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse("WEBHOOK ERROR:" + err.message, { status: 400 });
  }
  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    const checkoutSession = session as Stripe.Checkout.Session;
    console.log("Processing checkout session:", checkoutSession);

    if (!checkoutSession.metadata?.uid) {
      console.error("No user id in checkout session metadata");
      return new NextResponse("No user id in session metadata", { status: 400 });
    }
    console.log("UID", checkoutSession.metadata.uid);

    let subscription: Stripe.Subscription;
    if (!checkoutSession.subscription || typeof checkoutSession.subscription !== 'string') {
      console.error("Error: checkoutSession.subscription is missing or not a string", checkoutSession);
      return new NextResponse("Webhook Error: Missing or invalid subscription ID in checkout session", { status: 400 });
    }

    try {
      subscription = await stripe.subscriptions.retrieve(
        checkoutSession.subscription
      );
      console.log("Retrieved subscription:", subscription);
    } catch (error) {
      console.error("Error retrieving Stripe subscription:", error);
      console.error("Failed subscription ID:", checkoutSession.subscription);
      return new NextResponse(`Webhook Error: Could not retrieve subscription ${checkoutSession.subscription}`, { status: 500 });
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        stripe_subscription_id: subscription.id as string,
        stripe_customer_id: subscription.customer as string,
        stripe_price_id: subscription.items.data[0].price.id,
        onboarded: true,
        plan: "pro",
        stripe_current_period_end: new Date(
          subscription.current_period_end * 1000
        ),
      })
      .eq("uid", checkoutSession.metadata.uid)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return new NextResponse(error.message, { status: 500 });
    }
    
    console.log("Updated user data:", data);
  }
  if (event.type === "invoice.payment_succeeded") {
    const invoice = session as Stripe.Invoice;

    // Correctly get subscription ID directly from invoice object
    const subscriptionId = invoice.subscription;
    if (!subscriptionId || typeof subscriptionId !== 'string') {
      console.error("No subscription ID found on invoice:", invoice);
      return new NextResponse("No subscription ID found on invoice", { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(
      subscriptionId
    );

    // Declare data and error variables outside the try block
    let updatedUserData: any[] | null = null;
    let updateError: any | null = null;

    // Check for the column name error specifically in this block
    try {
      // Assign result to the outer variables
      const { data, error } = await supabase
        .from("users")
        .update({
          stripe_price_id: subscription.items.data[0].price.id,
          stripe_current_period_end: new Date(
            subscription.current_period_end * 1000
          ), // Now correctly formatted for timestampz
        })
        .eq("stripe_subscription_id", subscription.id)
        .select(); // Add select to see result/error

      updatedUserData = data;
      updateError = error;

    } catch (dbError) {
      console.error("Unexpected error during Supabase update (invoice.payment_succeeded):", dbError);
      // Assign error to the outer variable
      updateError = { message: "Unexpected database error" }; // Create a simple error object
    }

    // Check the error variable after the try/catch
    if (updateError) {
      console.error("Supabase update error (invoice.payment_succeeded):", updateError);
      // Check specifically for the column name error message
      if (updateError.message?.includes("'stripe_current_period_end' column")) {
        console.error("Hint: Verify the column 'stripe_current_period_end' exists in your 'users' table.");
      }
      return new NextResponse(updateError.message ?? "Database update failed", { status: 500 });
    }
    
    console.log("Updated user data (invoice.payment_succeeded):", updatedUserData);
  }
  return new NextResponse(null, { status: 200 });
}
