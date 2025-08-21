import { CardGridLoading } from '@/components/loading-states'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <div className="bg-[#e6ceb3] py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="text-center text-2xl font-bold text-[#5d4c42] sm:text-3xl md:text-4xl">
            Yoga Studios in Bali
          </h1>
          <p className="mt-2 text-center text-base text-[#5d4c42]/80 sm:text-lg">
            Find the perfect studio for your practice
          </p>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-12 md:px-6">
        <CardGridLoading count={8} />
      </div>
    </div>
  )
}
