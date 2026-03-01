import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import { NextResponse } from "next/server";
import absoluteUrl from "next-absolute-url";

// To handle a GET request to /api
export async function POST(req, res) {
  // Get the priceId from the request body
  const { origin } = absoluteUrl(req);
  const data = await req.json();
  const priceId = data.priceId;
  const selectedPlan = data.selectedPlan;
  const uid = data.uid;
  const email = data.email;
  const trial = data.trial;
  const baseUrl = process.env.WEBSITE_URL
    ? `${process.env.WEBSITE_URL}`
    : "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: baseUrl,
      cancel_url: baseUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: email, // optional
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      metadata: {
        plan: selectedPlan, // Pass the selected plan as metadata
        uid: uid,
        email: email,
      },
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
        ...(trial && { trial_period_days: 7 }),
      },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error("Error creating Stripe Checkout session:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
