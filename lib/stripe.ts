import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (
  userId: string,
  userEmail: string,
  priceId: string = 'price_1Rk98HPNsKubd86hyt8UhrOQ' // Replace with actual Stripe price ID
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?cancelled=true`,
      customer_email: userEmail,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw new Error('Failed to create checkout session');
  }
};

export const createCustomer = async (email: string, name?: string) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  } catch (error) {
    console.error('Stripe customer creation error:', error);
    throw new Error('Failed to create customer');
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Stripe subscription cancellation error:', error);
    throw new Error('Failed to cancel subscription');
  }
};

export const getSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Stripe subscription retrieval error:', error);
    throw new Error('Failed to retrieve subscription');
  }
};

export const constructEvent = (body: string, signature: string) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  return stripe.webhooks.constructEvent(body, signature, endpointSecret);
};
