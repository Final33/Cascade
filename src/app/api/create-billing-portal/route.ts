import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import { NextResponse } from "next/server";

const baseUrl = process.env.WEBSITE_URL
  ? `${process.env.WEBSITE_URL}`
  : "http://localhost:3000";

// To handle a GET request to /api
export async function POST(req, res) {
  // Get the priceId from the request body
  const data = await req.json();
  const customerId = data.customerId;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: baseUrl,
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
}
