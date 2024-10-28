'use server';

import { auth, currentUser } from '@clerk/nextjs/server';

import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscription } from '@/db/queries';

const returnUrl = absoluteUrl('/shop'); //http://localhost:3000/shop

export const createStripeUrl = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!user || !userId) {
    throw new Error('Unauthorized');
  }

  const userSubscription = await getUserSubscription();

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      return_url: returnUrl,
      customer: userSubscription.stripeCustomerId,
    });

    return { data: stripeSession.url };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Lingo Pro',
            description: 'Unlimited hearts',
          },
          unit_amount: 2000, //$20.00 USD
          recurring: {
            interval: 'month',
          },
        },
      },
    ],
    metadata: {
      userId,
    },
    success_url: returnUrl,
    cancel_url: returnUrl,
  });

  return { data: stripeSession.url };
};
