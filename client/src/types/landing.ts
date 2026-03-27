export interface LandingNavLink {
  label: string
  href: string
}

export interface FeatureItem {
  title: string
  description: string
}

export interface TestimonialItem {
  image: string
  name: string
  handle: string
  quote: string
}

export interface PricingPlan {
  name: string
  price: number
  period: string
  features: string[]
  mostPopular: boolean
}

export interface FooterSection {
  title: string
  links: Array<{ name: string; href: string }>
}
