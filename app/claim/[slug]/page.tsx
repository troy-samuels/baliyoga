import { createServerClient } from "@/lib/supabase"
import { ClaimForm } from "./claim-form"

export default async function ClaimPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Fetch business info from Supabase
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('v2_bali_yoga_studios_and_retreats')
    .select('name')
    .eq('slug', slug)
    .single()
  const businessName = data?.name || "this business"

  return <ClaimForm businessName={businessName} businessSlug={slug} />
} 