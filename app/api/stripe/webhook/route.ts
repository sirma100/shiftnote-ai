import { NextRequest, NextResponse } from 'next/server';
import { constructEvent } from '@/lib/stripe';
import { userDb } from '@/lib/database-cloud';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  try {
    const event = constructEvent(body, signature);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (userId) {
          // Update user subscription status
          userDb.updateSubscription(userId, 'pro');
          console.log(`Updated user ${userId} to pro subscription`);
        }
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object;
        const customerId = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id;
        
        // Find user by customer ID
        const user = userDb.findByCustomerId(customerId);
        
        if (user) {
          const status = subscription.status === 'active' ? 'pro' : 'free';
          userDb.updateSubscription(user.id, status);
          console.log(`Updated user ${user.id} subscription to ${status}`);
        }
        break;

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        const canceledCustomerId = typeof canceledSubscription.customer === 'string'
          ? canceledSubscription.customer
          : canceledSubscription.customer.id;
        
        const canceledUser = userDb.findByCustomerId(canceledCustomerId);
        
        if (canceledUser) {
          userDb.updateSubscription(canceledUser.id, 'free');
          console.log(`Downgraded user ${canceledUser.id} to free subscription`);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
