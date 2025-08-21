import { ClientProviders } from "@/components/client-providers"

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientProviders>{children}</ClientProviders>
}