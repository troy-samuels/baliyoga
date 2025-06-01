import { Calendar } from "lucide-react"
import { YogaFlowerIcon } from "./yoga-flower-icon"
import { Checkbox } from "./ui/checkbox"

export function SidebarFilter() {
  return (
    <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:w-72 lg:overflow-auto">
      <div className="space-y-6 rounded-2xl bg-[#f2e8dc] p-6 shadow-sm">
        {/* Location Filter */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#5d4c42]">Location</h3>
          <div className="space-y-2 rounded-xl bg-[#a39188] p-4 text-white">
            <div className="flex items-center justify-between">
              <span>Ubud</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Canggu</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Seminyak</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Uluwatu</span>
              <Checkbox />
            </div>
          </div>
        </div>

        {/* Quality Rating Filter with Yoga Flowers */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#5d4c42]">Quality Rating</h3>
          <div className="space-y-2 rounded-xl bg-[#a39188] p-4 text-white">
            <div className="flex items-center gap-1 cursor-pointer hover:bg-white/10 rounded p-1 transition-colors">
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <span className="ml-2">(5 flowers)</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:bg-white/10 rounded p-1 transition-colors">
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={false} />
              <span className="ml-2">(4+ flowers)</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:bg-white/10 rounded p-1 transition-colors">
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={true} />
              <YogaFlowerIcon className="h-5 w-5" filled={false} />
              <YogaFlowerIcon className="h-5 w-5" filled={false} />
              <span className="ml-2">(3+ flowers)</span>
            </div>
          </div>
        </div>

        {/* Yoga Style Filter */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#5d4c42]">Yoga Style</h3>
          <div className="space-y-2 rounded-xl bg-[#a39188] p-4 text-white">
            <div className="flex items-center justify-between">
              <span>Hatha</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Vinyasa</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Yin</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Ashtanga</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Kundalini</span>
              <Checkbox />
            </div>
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#5d4c42]">Availability</h3>
          <div className="space-y-3 rounded-xl bg-[#a39188] p-4 text-white">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Select dates</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Morning</span>
                <Checkbox />
              </div>
              <div className="flex items-center justify-between">
                <span>Afternoon</span>
                <Checkbox />
              </div>
              <div className="flex items-center justify-between">
                <span>Evening</span>
                <Checkbox />
              </div>
            </div>
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#5d4c42]">Price Range</h3>
          <div className="space-y-2 rounded-xl bg-[#a39188] p-4 text-white">
            <div className="flex items-center justify-between">
              <span>Free</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>&lt;$20/day</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>$20–$100/day</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>$100+</span>
              <Checkbox />
            </div>
          </div>
        </div>

        {/* Amenities Filter */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#5d4c42]">Amenities</h3>
          <div className="space-y-2 rounded-xl bg-[#a39188] p-4 text-white">
            <div className="flex items-center justify-between">
              <span>Pool</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Vegan Meals</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Wi-Fi</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Air Conditioning</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Spa</span>
              <Checkbox />
            </div>
          </div>
        </div>

        {/* Bonus Filters */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-[#5d4c42]">Bonus Filters</h3>
          <div className="space-y-2 rounded-xl bg-[#a39188] p-4 text-white">
            <div className="flex items-center justify-between">
              <span>Eco-friendly</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Female Instructor</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Family-friendly</span>
              <Checkbox />
            </div>
            <div className="flex items-center justify-between">
              <span>Beginner-friendly</span>
              <Checkbox />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
