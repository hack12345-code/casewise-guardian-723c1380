
import {
  CreditCard,
  Check,
  type LucideIcon,
} from "lucide-react";

export type Icon = LucideIcon

export const Icons = {
  creditCard: CreditCard,
  check: Check,
  paypal: ({ ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17.5 7H17c-2.5 0-5 2-5 6.3C12 17.7 14.5 20 17 20h.5c1.5 0 2.5-1 2.5-2.5V9.5C20 8 19 7 17.5 7Z" />
      <path d="M10 17h1c2 0 3.5-1.5 3.5-5 0-3.5-1.5-5-3.5-5H10" />
      <path d="M7 7h3" />
    </svg>
  ),
}
