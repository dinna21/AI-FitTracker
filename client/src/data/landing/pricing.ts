import type { PricingPlan } from "../../types/landing"

export const pricingData: PricingPlan[] = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    features: [
      "Calorie and meal tracking",
      "Basic activity log",
      "Community support",
      "Weekly progress summary",
    ],
    mostPopular: false,
  },
  {
    name: "Growth",
    price: 79,
    period: "month",
    features: [
      "Everything in Starter",
      "Advanced analytics",
      "Priority support",
      "Smart recommendations",
      "Coach collaboration tools",
    ],
    mostPopular: true,
  },
  {
    name: "Scale",
    price: 199,
    period: "month",
    features: [
      "Everything in Growth",
      "Team workspaces",
      "Role-based access",
      "Custom onboarding",
      "Dedicated success manager",
    ],
    mostPopular: false,
  },
]
