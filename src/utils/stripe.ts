import { loadStripe } from '@stripe/stripe-js'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// loadStripe는 스크립트를 한 번만 로드하도록 앱 전체에서 이 Promise 하나를 공유해야 한다.
export const stripePromise = loadStripe(publishableKey)
