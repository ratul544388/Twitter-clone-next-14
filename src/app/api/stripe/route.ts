import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const blueBadgeUrl = absoluteUrl("/blue-badge");

export async function GET() {
  try {
    const { userId } = auth();
    const currentUser = await getCurrentUser();

    if (!userId || !currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await db.blueBadgeSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: blueBadgeUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: blueBadgeUrl,
      cancel_url: blueBadgeUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: currentUser.email,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Blue Badge",
            //   images: [imageUrl],
              description:
                "Get Blue Badge and more advantages will be added soon",
            },
            unit_amount: 999,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
