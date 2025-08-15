import fs from "fs"
import path from "path"

// Define types for our data
export type Studio = {
  id: number | string
  name: string
  slug: string
  location: string
  rating: number
  reviewCount: number
  image: string
  styles: string[]
  tagline?: string
  description?: string
  longDescription?: string
  price?: {
    dropIn?: string
    weekly?: string
    monthly?: string
  }
  images?: string[]
  amenities?: string[]
  schedule?: any[]
  instructors?: any[]
  reviews?: any[]
  faqs?: any[]
  similar?: any[]
  location_details?: {
    address?: string
    area?: string
    coordinates?: { lat: number; lng: number }
  }
  type?: string
  phone_number?: string
  website?: string
  opening_hours?: any[]
  category?: string
  // AI-enhanced fields
  business_description?: string
  languages_spoken?: string[]
  drop_in_price_usd?: number | null
  price_range?: string
}

export type Retreat = {
  id: number | string
  name: string
  slug: string
  location: string
  rating: number
  reviewCount: number
  image: string
  duration: string
  price: string
  tagline?: string
  description?: string
  longDescription?: string
  price_details?: {
    standard?: string
    premium?: string
    deposit?: string
  }
  images?: string[]
  styles?: string[]
  includes?: string[]
  accommodation?: any[]
  schedule?: any
  facilitators?: any[]
  reviews?: any[]
  faqs?: any[]
  similar?: any[]
  dates?: any[]
  location_details?: {
    address?: string
    area?: string
    coordinates?: { lat: number; lng: number }
  }
  type?: string
  phone_number?: string
  website?: string
  opening_hours?: any[]
  category?: string
  // AI-enhanced fields
  business_description?: string
  amenities?: string[]
  languages_spoken?: string[]
  drop_in_price_usd?: number | null
  price_range?: string
}

// Update the mockStudios array to include more detailed information
const mockStudios: Studio[] = [
  {
    id: 1,
    name: "Harmony Yoga Studio",
    slug: "harmony-yoga-studio",
    location: "Ubud",
    rating: 4.9,
    reviewCount: 127,
    image: "/placeholder.svg?height=200&width=300&text=Studio%201",
    styles: ["Vinyasa", "Hatha", "Yin"],
    tagline: "Find your balance in the heart of Ubud",
    description:
      "A peaceful sanctuary nestled in the lush greenery of Ubud offering a variety of yoga classes for all levels.",
    longDescription:
      "Harmony Yoga Studio was founded in 2015 with a vision to create a peaceful sanctuary where people could connect with themselves through the practice of yoga. Nestled in the lush greenery of Ubud, our studio has become a beloved destination for both locals and travelers seeking to deepen their practice.\n\nOur spacious bamboo studio is designed to bring the outside in, with open sides that allow the gentle Bali breeze to flow through during practice. The sounds of nature – birds singing, leaves rustling – create a natural soundtrack that enhances your yoga experience.\n\nWe believe that yoga is for everyone, which is why we offer a diverse range of classes suitable for all levels. Whether you're a complete beginner or an experienced yogi, our skilled instructors will guide you through your practice with care and attention.",
    type: "studio",
    price: {
      dropIn: "$15",
      weekly: "$75",
      monthly: "$220",
    },
    images: [
      "/placeholder.svg?height=600&width=800&text=Harmony%20Yoga%20Studio%201",
      "/placeholder.svg?height=600&width=800&text=Harmony%20Yoga%20Studio%202",
      "/placeholder.svg?height=600&width=800&text=Harmony%20Yoga%20Studio%203",
      "/placeholder.svg?height=600&width=800&text=Harmony%20Yoga%20Studio%204",
    ],
    amenities: [
      "Mats provided",
      "Changing rooms",
      "Showers",
      "Drinking water",
      "Tea service",
      "Wi-Fi",
      "Air conditioning",
      "Props available",
    ],
    schedule: [
      {
        day: "Monday",
        classes: [
          { time: "07:00 - 08:30", name: "Morning Flow", style: "Vinyasa", instructor: "Sarah" },
          { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
          { time: "17:30 - 19:00", name: "Evening Yin", style: "Yin", instructor: "Emma" },
        ],
      },
      {
        day: "Tuesday",
        classes: [
          { time: "07:00 - 08:30", name: "Morning Flow", style: "Vinyasa", instructor: "Sarah" },
          { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
          { time: "17:30 - 19:00", name: "Evening Yin", style: "Yin", instructor: "Emma" },
        ],
      },
      {
        day: "Wednesday",
        classes: [
          { time: "07:00 - 08:30", name: "Morning Flow", style: "Vinyasa", instructor: "Sarah" },
          { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
          { time: "17:30 - 19:00", name: "Evening Yin", style: "Yin", instructor: "Emma" },
        ],
      },
      {
        day: "Thursday",
        classes: [
          { time: "07:00 - 08:30", name: "Morning Flow", style: "Vinyasa", instructor: "Sarah" },
          { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
          { time: "17:30 - 19:00", name: "Evening Yin", style: "Yin", instructor: "Emma" },
        ],
      },
      {
        day: "Friday",
        classes: [
          { time: "07:00 - 08:30", name: "Morning Flow", style: "Vinyasa", instructor: "Sarah" },
          { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
          { time: "17:30 - 19:00", name: "Evening Yin", style: "Yin", instructor: "Emma" },
        ],
      },
      {
        day: "Saturday",
        classes: [
          { time: "08:00 - 09:30", name: "Weekend Flow", style: "Vinyasa", instructor: "Sarah" },
          { time: "10:00 - 11:30", name: "Gentle Hatha", style: "Hatha", instructor: "David" },
        ],
      },
      {
        day: "Sunday",
        classes: [
          { time: "08:00 - 09:30", name: "Weekend Flow", style: "Vinyasa", instructor: "Sarah" },
          { time: "16:00 - 17:30", name: "Restorative", style: "Restorative", instructor: "Emma" },
        ],
      },
    ],
    instructors: [
      {
        name: "Sarah Johnson",
        image: "/placeholder.svg?height=200&width=200&text=Sarah",
        bio: "Sarah has been practicing yoga for over 15 years and teaching for 10. She specializes in Vinyasa and Hatha yoga, with additional training in meditation and mindfulness.",
        styles: ["Vinyasa", "Hatha", "Meditation"],
      },
      {
        name: "David Lee",
        image: "/placeholder.svg?height=200&width=200&text=David",
        bio: "David discovered yoga during his travels in India and has been teaching for 8 years. His classes focus on alignment and breath awareness.",
        styles: ["Hatha", "Alignment", "Pranayama"],
      },
      {
        name: "Emma Wilson",
        image: "/placeholder.svg?height=200&width=200&text=Emma",
        bio: "Emma specializes in Yin and Restorative yoga, creating a nurturing space for deep relaxation and release. She has been teaching for 5 years.",
        styles: ["Yin", "Restorative", "Yoga Nidra"],
      },
    ],
    reviews: [
      {
        name: "Michael T.",
        date: "April 2023",
        rating: 5,
        text: "Beautiful studio with excellent teachers. The morning flow class with Sarah was exactly what I needed - challenging but accessible. Will definitely return!",
      },
      {
        name: "Lisa R.",
        date: "March 2023",
        rating: 5,
        text: "I've been coming to Harmony for a month now and love the variety of classes. The studio itself is gorgeous and peaceful. Highly recommend the Yin classes with Emma.",
      },
      {
        name: "James K.",
        date: "February 2023",
        rating: 4,
        text: "Great studio with knowledgeable instructors. The only reason for 4 stars instead of 5 is that it can get quite busy during peak times. Otherwise, excellent!",
      },
    ],
    faqs: [
      {
        question: "Do I need to book classes in advance?",
        answer:
          "We recommend booking classes in advance, especially during high season (June-August). You can book through our website or by calling the studio.",
      },
      {
        question: "What should I bring to class?",
        answer:
          "We provide mats and props, but you're welcome to bring your own if you prefer. We recommend bringing a water bottle and a small towel.",
      },
      {
        question: "Are beginners welcome?",
        answer:
          "We have classes suitable for all levels, including complete beginners. Our Gentle Hatha classes are perfect for those new to yoga.",
      },
      {
        question: "Do you offer private classes?",
        answer: "Yes, we offer private one-on-one or small group sessions. Please contact us directly to arrange.",
      },
    ],
    similar: [
      {
        name: "Serenity Yoga Center",
        image: "/placeholder.svg?height=200&width=300&text=Serenity",
        location: "Ubud",
        rating: 4.8,
      },
      {
        name: "Lotus Yoga Bali",
        image: "/placeholder.svg?height=200&width=300&text=Lotus",
        location: "Ubud",
        rating: 4.7,
      },
      {
        name: "Green Path Yoga",
        image: "/placeholder.svg?height=200&width=300&text=Green%20Path",
        location: "Ubud",
        rating: 4.9,
      },
    ],
  },
  {
    id: 2,
    name: "Serenity Yoga Center",
    slug: "serenity-yoga-center",
    location: "Canggu",
    rating: 4.8,
    reviewCount: 95,
    image: "/placeholder.svg?height=200&width=300&text=Studio%202",
    styles: ["Yin", "Restorative", "Meditation"],
    tagline: "Restore your inner peace by the beach",
    description: "A beachside yoga center offering gentle and restorative practices with ocean views.",
    longDescription:
      "Serenity Yoga Center is a tranquil oasis located just steps from the beach in Canggu. Founded in 2017, our center specializes in gentle, restorative practices designed to help you find balance in a busy world.\n\nOur open-air studio offers breathtaking views of the ocean, creating the perfect backdrop for your practice. The sound of waves and sea breezes enhance the meditative quality of our classes, helping you to connect deeply with your breath and body.\n\nWe believe in the healing power of gentle yoga practices and offer a range of classes focused on restoration, relaxation, and mindfulness. Our experienced teachers create a nurturing environment where you can slow down, release tension, and cultivate inner peace.",
    type: "studio",
    price: {
      dropIn: "$12",
      weekly: "$65",
      monthly: "$200",
    },
    images: [
      "/placeholder.svg?height=600&width=800&text=Serenity%20Yoga%20Center%201",
      "/placeholder.svg?height=600&width=800&text=Serenity%20Yoga%20Center%202",
      "/placeholder.svg?height=600&width=800&text=Serenity%20Yoga%20Center%203",
      "/placeholder.svg?height=600&width=800&text=Serenity%20Yoga%20Center%204",
    ],
    amenities: [
      "Ocean views",
      "Mats and props provided",
      "Changing rooms",
      "Herbal tea service",
      "Meditation cushions",
      "Beach access",
      "Relaxation area",
      "Eco-friendly facilities",
    ],
    schedule: [
      {
        day: "Monday",
        classes: [
          { time: "08:00 - 09:15", name: "Gentle Morning Yoga", style: "Hatha", instructor: "Anna" },
          { time: "16:00 - 17:15", name: "Yin Yoga", style: "Yin", instructor: "Mark" },
          { time: "17:30 - 18:45", name: "Sunset Meditation", style: "Meditation", instructor: "Lily" },
        ],
      },
      {
        day: "Tuesday",
        classes: [
          { time: "08:00 - 09:15", name: "Gentle Morning Yoga", style: "Hatha", instructor: "Anna" },
          { time: "16:00 - 17:15", name: "Restorative Yoga", style: "Restorative", instructor: "Mark" },
          { time: "17:30 - 18:45", name: "Sunset Meditation", style: "Meditation", instructor: "Lily" },
        ],
      },
      {
        day: "Wednesday",
        classes: [
          { time: "08:00 - 09:15", name: "Gentle Morning Yoga", style: "Hatha", instructor: "Anna" },
          { time: "16:00 - 17:15", name: "Yin Yoga", style: "Yin", instructor: "Mark" },
          { time: "17:30 - 18:45", name: "Sunset Meditation", style: "Meditation", instructor: "Lily" },
        ],
      },
      {
        day: "Thursday",
        classes: [
          { time: "08:00 - 09:15", name: "Gentle Morning Yoga", style: "Hatha", instructor: "Anna" },
          { time: "16:00 - 17:15", name: "Restorative Yoga", style: "Restorative", instructor: "Mark" },
          { time: "17:30 - 18:45", name: "Sunset Meditation", style: "Meditation", instructor: "Lily" },
        ],
      },
      {
        day: "Friday",
        classes: [
          { time: "08:00 - 09:15", name: "Gentle Morning Yoga", style: "Hatha", instructor: "Anna" },
          { time: "16:00 - 17:15", name: "Yin Yoga", style: "Yin", instructor: "Mark" },
          { time: "17:30 - 18:45", name: "Sunset Meditation", style: "Meditation", instructor: "Lily" },
        ],
      },
      {
        day: "Saturday",
        classes: [
          { time: "08:00 - 09:15", name: "Weekend Gentle Flow", style: "Hatha", instructor: "Anna" },
          { time: "16:00 - 17:30", name: "Deep Relaxation", style: "Restorative", instructor: "Mark" },
        ],
      },
      {
        day: "Sunday",
        classes: [
          { time: "08:00 - 09:15", name: "Weekend Gentle Flow", style: "Hatha", instructor: "Anna" },
          { time: "16:00 - 17:30", name: "Sunset Meditation", style: "Meditation", instructor: "Lily" },
        ],
      },
    ],
    instructors: [
      {
        name: "Anna Chen",
        image: "/placeholder.svg?height=200&width=200&text=Anna",
        bio: "Anna has been teaching yoga for 12 years and specializes in gentle, alignment-based practices. Her classes are accessible and nurturing, with a focus on mindful movement.",
        styles: ["Hatha", "Gentle Flow", "Alignment"],
      },
      {
        name: "Mark Taylor",
        image: "/placeholder.svg?height=200&width=200&text=Mark",
        bio: "Mark is a certified Yin and Restorative yoga teacher with a background in massage therapy. His classes offer deep release and relaxation through supported postures.",
        styles: ["Yin", "Restorative", "Therapeutic"],
      },
      {
        name: "Lily Nguyen",
        image: "/placeholder.svg?height=200&width=200&text=Lily",
        bio: "Lily is a meditation teacher and sound healer who guides students in cultivating present-moment awareness and inner peace through various meditation techniques.",
        styles: ["Meditation", "Sound Healing", "Mindfulness"],
      },
    ],
    reviews: [
      {
        name: "Sophie R.",
        date: "May 2023",
        rating: 5,
        text: "The ocean view from the studio is incredible! I took the sunset meditation class with Lily and it was the perfect way to end my day in Bali. Very peaceful and centering.",
      },
      {
        name: "Thomas H.",
        date: "April 2023",
        rating: 5,
        text: "Mark's restorative class was exactly what I needed after a long flight. The props were high quality and the instruction was clear and helpful. Highly recommend!",
      },
      {
        name: "Olivia P.",
        date: "March 2023",
        rating: 4,
        text: "Beautiful studio with a calming atmosphere. The teachers are knowledgeable and attentive. Only giving 4 stars because the classes can fill up quickly in high season.",
      },
    ],
    faqs: [
      {
        question: "Is this studio suitable for beginners?",
        answer:
          "Yes, our gentle and restorative classes are perfect for beginners. Our teachers offer modifications and use props to make the practice accessible to all levels.",
      },
      {
        question: "Do I need to reserve a spot in advance?",
        answer:
          "We recommend booking in advance, especially for sunset classes which tend to fill up quickly. You can book through our website or WhatsApp.",
      },
      {
        question: "What if I have injuries or health concerns?",
        answer:
          "Please inform the teacher before class about any injuries or health concerns. Our teachers are trained to offer modifications and alternatives.",
      },
      {
        question: "Is there parking available?",
        answer: "Yes, we have limited parking available at the studio. There is also street parking nearby.",
      },
    ],
    similar: [
      {
        name: "Ocean Flow Yoga",
        image: "/placeholder.svg?height=200&width=300&text=Ocean%20Flow",
        location: "Seminyak",
        rating: 4.6,
      },
      {
        name: "Surfer's Yoga Den",
        image: "/placeholder.svg?height=200&width=300&text=Surfer's%20Den",
        location: "Canggu",
        rating: 4.7,
      },
      {
        name: "Beachside Yoga Shack",
        image: "/placeholder.svg?height=200&width=300&text=Beachside",
        location: "Amed",
        rating: 4.8,
      },
    ],
  },
  {
    id: 3,
    name: "Lotus Yoga Bali",
    slug: "lotus-yoga-bali",
    location: "Ubud",
    rating: 4.7,
    reviewCount: 83,
    image: "/placeholder.svg?height=200&width=300&text=Studio%203",
    styles: ["Ashtanga", "Vinyasa", "Power Yoga"],
    tagline: "Strengthen your practice, transform your life",
    description:
      "A dynamic yoga studio specializing in more vigorous practices for those looking to challenge themselves.",
    type: "studio",
    price: {
      dropIn: "$18",
      weekly: "$85",
      monthly: "$240",
    },
    // Add similar detailed information for this studio
  },
  {
    id: 4,
    name: "Green Path Yoga",
    slug: "green-path-yoga",
    location: "Ubud",
    rating: 4.9,
    reviewCount: 112,
    image: "/placeholder.svg?height=200&width=300&text=Studio%204",
    styles: ["Hatha", "Kundalini", "Meditation"],
    tagline: "Connect with nature through yoga",
    description: "An eco-friendly studio surrounded by rice fields, offering a serene environment for your practice.",
    type: "studio",
    price: {
      dropIn: "$14",
      weekly: "$70",
      monthly: "$210",
    },
  },
  {
    id: 5,
    name: "Ocean Flow Yoga",
    slug: "ocean-flow-yoga",
    location: "Seminyak",
    rating: 4.6,
    reviewCount: 78,
    image: "/placeholder.svg?height=200&width=300&text=Studio%205",
    styles: ["Vinyasa", "Aerial", "SUP Yoga"],
    tagline: "Yoga with ocean views and sea breezes",
    description: "A beachfront studio specializing in flow-based practices and unique offerings like SUP yoga.",
    type: "studio",
    price: {
      dropIn: "$16",
      weekly: "$80",
      monthly: "$230",
    },
  },
  {
    id: 6,
    name: "Bamboo Yoga Shala",
    slug: "bamboo-yoga-shala",
    location: "Ubud",
    rating: 4.8,
    reviewCount: 91,
    image: "/placeholder.svg?height=200&width=300&text=Studio%206",
    styles: ["Hatha", "Yin", "Sound Healing"],
    tagline: "Traditional practices in a bamboo sanctuary",
    description: "A beautiful bamboo yoga shala offering traditional practices and sound healing sessions.",
    type: "studio",
    price: {
      dropIn: "$13",
      weekly: "$65",
      monthly: "$195",
    },
  },
  {
    id: 7,
    name: "Surfer's Yoga Den",
    slug: "surfers-yoga-den",
    location: "Canggu",
    rating: 4.7,
    reviewCount: 86,
    image: "/placeholder.svg?height=200&width=300&text=Studio%207",
    styles: ["Vinyasa", "Yin", "Mobility"],
    tagline: "Yoga for surfers and active lifestyles",
    description: "A yoga studio catering to surfers and active individuals, focusing on mobility and recovery.",
    type: "studio",
    price: {
      dropIn: "$14",
      weekly: "$70",
      monthly: "$210",
    },
  },
  {
    id: 8,
    name: "Sacred Space Yoga",
    slug: "sacred-space-yoga",
    location: "Uluwatu",
    rating: 4.9,
    reviewCount: 104,
    image: "/placeholder.svg?height=200&width=300&text=Studio%208",
    styles: ["Kundalini", "Meditation", "Breathwork"],
    tagline: "Elevate your consciousness through yoga",
    description: "A spiritual yoga center focusing on kundalini, meditation, and breathwork practices.",
    type: "studio",
    price: {
      dropIn: "$17",
      weekly: "$85",
      monthly: "$250",
    },
  },
  {
    id: 9,
    name: "Jungle Yoga Pavilion",
    slug: "jungle-yoga-pavilion",
    location: "Ubud",
    rating: 4.8,
    reviewCount: 93,
    image: "/placeholder.svg?height=200&width=300&text=Studio%209",
    styles: ["Vinyasa", "Acro Yoga", "Partner Yoga"],
    tagline: "Connect with nature and community",
    description: "An open-air yoga pavilion in the jungle offering community-focused yoga practices.",
    type: "studio",
    price: {
      dropIn: "$15",
      weekly: "$75",
      monthly: "$220",
    },
  },
  {
    id: 10,
    name: "Sunrise Yoga Studio",
    slug: "sunrise-yoga-studio",
    location: "Sanur",
    rating: 4.7,
    reviewCount: 82,
    image: "/placeholder.svg?height=200&width=300&text=Studio%2010",
    styles: ["Hatha", "Gentle Flow", "Meditation"],
    tagline: "Begin your day with intention",
    description: "A morning-focused studio offering sunrise classes with ocean views.",
    type: "studio",
    price: {
      dropIn: "$13",
      weekly: "$65",
      monthly: "$195",
    },
  },
  {
    id: 11,
    name: "Mountain View Yoga",
    slug: "mountain-view-yoga",
    location: "Bedugul",
    rating: 4.9,
    reviewCount: 76,
    image: "/placeholder.svg?height=200&width=300&text=Studio%2011",
    styles: ["Hatha", "Yin", "Forest Bathing"],
    tagline: "Yoga with mountain and lake views",
    description: "A serene studio in the mountains offering yoga combined with nature experiences.",
    type: "studio",
    price: {
      dropIn: "$16",
      weekly: "$80",
      monthly: "$240",
    },
  },
  {
    id: 12,
    name: "Healing Heart Yoga",
    slug: "healing-heart-yoga",
    location: "Ubud",
    rating: 4.8,
    reviewCount: 88,
    image: "/placeholder.svg?height=200&width=300&text=Studio%2012",
    styles: ["Restorative", "Yoga Therapy", "Meditation"],
    tagline: "Gentle practices for healing and recovery",
    description: "A therapeutic yoga studio focusing on healing practices for all bodies and abilities.",
    type: "studio",
    price: {
      dropIn: "$15",
      weekly: "$75",
      monthly: "$225",
    },
  },
  {
    id: 13,
    name: "Power Yoga Bali",
    slug: "power-yoga-bali",
    location: "Seminyak",
    rating: 4.7,
    reviewCount: 94,
    image: "/placeholder.svg?height=200&width=300&text=Studio%2013",
    styles: ["Power Yoga", "HIIT Yoga", "Sculpt"],
    tagline: "Strengthen your body, empower your mind",
    description: "A high-energy studio offering power yoga and fitness-focused yoga classes.",
    type: "studio",
    price: {
      dropIn: "$17",
      weekly: "$85",
      monthly: "$250",
    },
  },
  {
    id: 14,
    name: "Traditional Balinese Yoga",
    slug: "traditional-balinese-yoga",
    location: "Gianyar",
    rating: 4.9,
    reviewCount: 72,
    image: "/placeholder.svg?height=200&width=300&text=Studio%2014",
    styles: ["Traditional Balinese Yoga", "Meditation", "Ceremony"],
    tagline: "Experience authentic Balinese yoga traditions",
    description: "A cultural yoga center offering traditional Balinese yoga practices and ceremonies.",
    type: "studio",
    price: {
      dropIn: "$14",
      weekly: "$70",
      monthly: "$210",
    },
  },
  {
    id: 15,
    name: "Beachside Yoga Shack",
    slug: "beachside-yoga-shack",
    location: "Amed",
    rating: 4.8,
    reviewCount: 81,
    image: "/placeholder.svg?height=200&width=300&text=Studio%2015",
    styles: ["Vinyasa", "Yin", "Sunset Meditation"],
    tagline: "Yoga by the black sand beaches",
    description: "A laid-back yoga studio on the black sand beaches of Amed, perfect for sunset practices.",
    type: "studio",
    price: {
      dropIn: "$12",
      weekly: "$60",
      monthly: "$180",
    },
  },
]

// Update the mockRetreats array to include more detailed information
const mockRetreats: Retreat[] = [
  {
    id: 1,
    name: "Serenity Wellness Retreat",
    slug: "serenity-wellness-retreat",
    location: "Ubud",
    rating: 4.9,
    reviewCount: 89,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%201",
    duration: "7 days / 6 nights",
    price: "$1,299",
    tagline: "A transformative 7-day journey to wellness in paradise",
    description: "Escape to our tranquil retreat center nestled in the lush rice fields of Ubud.",
    longDescription:
      "Serenity Wellness Retreat offers a transformative 7-day journey in the heart of Bali's cultural center, Ubud. Our retreat center is nestled among lush rice fields, providing a peaceful sanctuary away from the hustle and bustle of everyday life.\n\nOur carefully crafted program combines daily yoga and meditation practices, nourishing plant-based cuisine, cultural excursions, and healing spa treatments to create a holistic experience that rejuvenates your body, mind, and spirit.\n\nWhether you're seeking to deepen your yoga practice, reset your health, or simply take time for self-care, our retreat provides the perfect setting for your personal journey. Our experienced facilitators create a supportive environment where you can explore, grow, and connect with like-minded individuals from around the world.",
    styles: ["Vinyasa", "Yin", "Meditation"],
    includes: ["6 nights accommodation", "3 vegetarian meals daily", "2 daily yoga sessions"],
    type: "retreat",
    images: [
      "/placeholder.svg?height=600&width=800&text=Serenity%20Retreat%201",
      "/placeholder.svg?height=600&width=800&text=Serenity%20Retreat%202",
      "/placeholder.svg?height=600&width=800&text=Serenity%20Retreat%203",
      "/placeholder.svg?height=600&width=800&text=Serenity%20Retreat%204",
    ],
    accommodation: [
      {
        type: "Shared Room",
        description:
          "Comfortable shared room with twin beds, en-suite bathroom, air conditioning, and a balcony overlooking the rice fields.",
        price: "$1,299 per person",
      },
      {
        type: "Private Room",
        description:
          "Spacious private room with a queen bed, en-suite bathroom, air conditioning, and a private balcony with stunning views.",
        price: "$1,599 per person",
      },
    ],
    schedule: {
      typical: [
        { time: "06:30 - 07:00", activity: "Morning tea" },
        { time: "07:00 - 08:30", activity: "Morning yoga practice" },
        { time: "08:30 - 09:30", activity: "Breakfast" },
        { time: "10:00 - 12:00", activity: "Workshop or excursion" },
        { time: "12:30 - 13:30", activity: "Lunch" },
        { time: "13:30 - 15:30", activity: "Free time / Optional spa treatments" },
        { time: "15:30 - 16:30", activity: "Afternoon workshop" },
        { time: "17:00 - 18:30", activity: "Evening yoga / Meditation" },
        { time: "19:00 - 20:00", activity: "Dinner" },
        { time: "20:30 - 21:30", activity: "Evening activity (varies by day)" },
      ],
    },
    dates: [
      { start: "June 15, 2023", end: "June 21, 2023", availability: "Limited" },
      { start: "July 10, 2023", end: "July 16, 2023", availability: "Available" },
      { start: "August 5, 2023", end: "August 11, 2023", availability: "Available" },
      { start: "September 12, 2023", end: "September 18, 2023", availability: "Available" },
    ],
    facilitators: [
      {
        name: "Maya Patel",
        image: "/placeholder.svg?height=200&width=200&text=Maya",
        bio: "Maya is the founder of Serenity Wellness Retreat and has been teaching yoga for over 15 years. Her approach combines traditional Hatha and Vinyasa with mindfulness practices.",
        role: "Lead Yoga Teacher",
      },
      {
        name: "Ketut Wira",
        image: "/placeholder.svg?height=200&width=200&text=Ketut",
        bio: "Ketut is a Balinese healer and meditation guide who brings local wisdom and spiritual practices to the retreat experience.",
        role: "Meditation Guide",
      },
      {
        name: "Claire Bennett",
        image: "/placeholder.svg?height=200&width=200&text=Claire",
        bio: "Claire is a nutritionist and plant-based chef who creates nourishing, delicious meals using local, organic ingredients.",
        role: "Retreat Chef",
      },
    ],
    reviews: [
      {
        name: "Sophia L.",
        date: "March 2023",
        rating: 5,
        text: "This retreat exceeded all my expectations. The location is breathtaking, the food was incredible, and the yoga sessions were transformative. I left feeling renewed and inspired.",
      },
      {
        name: "Thomas B.",
        date: "February 2023",
        rating: 5,
        text: "A life-changing experience. The perfect balance of structure and free time, with excellent teachers and beautiful accommodations. I've already booked to return next year!",
      },
      {
        name: "Olivia M.",
        date: "January 2023",
        rating: 4,
        text: "A wonderful retreat in a stunning location. The yoga and meditation sessions were excellent. My only suggestion would be to offer more variety in the workshops.",
      },
    ],
    faqs: [
      {
        question: "Is this retreat suitable for beginners?",
        answer:
          "Yes, our retreat welcomes practitioners of all levels. Our teachers offer modifications for beginners and challenges for more advanced students.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Deposits are non-refundable. Full payments are refundable up to 60 days before the retreat minus the deposit. Within 60 days, no refunds are available, but you may transfer your booking to another person.",
      },
      {
        question: "Is airport transfer included?",
        answer: "Yes, we provide complimentary airport transfers on arrival and departure days.",
      },
      {
        question: "What should I pack?",
        answer:
          "We recommend comfortable yoga clothes, a light jacket or sweater for evenings, swimwear, sunscreen, insect repellent, and any personal items you may need. Yoga mats and props are provided.",
      },
    ],
    similar: [
      {
        name: "Bali Bliss Retreat",
        image: "/placeholder.svg?height=200&width=300&text=Bali%20Bliss",
        location: "Ubud",
        duration: "5 days",
        rating: 4.8,
      },
      {
        name: "Jungle Yoga Escape",
        image: "/placeholder.svg?height=200&width=300&text=Jungle%20Yoga",
        location: "Ubud",
        duration: "8 days",
        rating: 4.7,
      },
      {
        name: "Ocean Harmony Retreat",
        image: "/placeholder.svg?height=200&width=300&text=Ocean%20Harmony",
        location: "Canggu",
        duration: "6 days",
        rating: 4.9,
      },
    ],
  },
  {
    id: 2,
    name: "Bali Bliss Retreat",
    slug: "bali-bliss-retreat",
    location: "Canggu",
    rating: 4.8,
    reviewCount: 76,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%202",
    duration: "5 days / 4 nights",
    price: "$899",
    tagline: "Find your bliss by the ocean",
    description: "A beachside retreat combining yoga, surfing, and wellness practices.",
    longDescription:
      "Bali Bliss Retreat offers the perfect balance of yoga, surfing, and relaxation in the vibrant beach town of Canggu. Our 5-day program is designed for those seeking an active yet rejuvenating getaway that connects you with the ocean and yourself.\n\nOur beachfront villa provides the ideal setting to wake up to the sound of waves and practice yoga with ocean views. In between yoga sessions, you'll have the opportunity to learn or improve your surfing skills with experienced instructors who know the local breaks.\n\nThe retreat combines energizing morning practices, surf sessions, and gentle evening yoga to help you recover and relax. Our chef prepares nutritious, delicious meals that fuel your activities while introducing you to the flavors of Balinese cuisine.",
    styles: ["Hatha", "Vinyasa", "Surfing"],
    includes: ["4 nights accommodation", "All meals included", "Daily yoga and surf lessons"],
    type: "retreat",
    images: [
      "/placeholder.svg?height=600&width=800&text=Bali%20Bliss%20Retreat%201",
      "/placeholder.svg?height=600&width=800&text=Bali%20Bliss%20Retreat%202",
      "/placeholder.svg?height=600&width=800&text=Bali%20Bliss%20Retreat%203",
      "/placeholder.svg?height=600&width=800&text=Bali%20Bliss%20Retreat%204",
    ],
    accommodation: [
      {
        type: "Shared Room",
        description:
          "Comfortable shared room with twin beds, en-suite bathroom, and air conditioning, just steps from the beach.",
        price: "$899 per person",
      },
      {
        type: "Private Room",
        description:
          "Private room with a queen bed, en-suite bathroom, air conditioning, and a small terrace with garden views.",
        price: "$1,199 per person",
      },
    ],
    schedule: {
      typical: [
        { time: "06:00 - 06:30", activity: "Morning tea/coffee" },
        { time: "06:30 - 08:00", activity: "Morning yoga practice" },
        { time: "08:00 - 09:00", activity: "Breakfast" },
        { time: "09:30 - 12:00", activity: "Surf lesson" },
        { time: "12:30 - 13:30", activity: "Lunch" },
        { time: "13:30 - 16:00", activity: "Free time / Beach time" },
        { time: "16:30 - 18:00", activity: "Evening yoga / Restorative practice" },
        { time: "18:30 - 19:30", activity: "Dinner" },
        { time: "20:00 - 21:00", activity: "Evening gathering (varies by day)" },
      ],
    },
    dates: [
      { start: "May 20, 2023", end: "May 24, 2023", availability: "Limited" },
      { start: "June 15, 2023", end: "June 19, 2023", availability: "Available" },
      { start: "July 10, 2023", end: "July 14, 2023", availability: "Available" },
      { start: "August 5, 2023", end: "August 9, 2023", availability: "Available" },
    ],
    facilitators: [
      {
        name: "Jack Robinson",
        image: "/placeholder.svg?height=200&width=200&text=Jack",
        bio: "Jack is a certified yoga instructor and professional surfer who has been teaching yoga for surfers for over 10 years. His classes focus on building strength, flexibility, and balance for the surf.",
        role: "Lead Yoga Teacher & Surf Instructor",
      },
      {
        name: "Leilani Wong",
        image: "/placeholder.svg?height=200&width=200&text=Leilani",
        bio: "Leilani is a Hawaiian-born yoga teacher specializing in vinyasa flow and restorative practices. Her classes incorporate elements of traditional Hawaiian healing.",
        role: "Yoga Instructor",
      },
      {
        name: "Gede Artha",
        image: "/placeholder.svg?height=200&width=200&text=Gede",
        bio: "Gede is a local Balinese surf instructor with over 15 years of experience teaching surfing in Canggu. He knows all the best spots for beginners and intermediate surfers.",
        role: "Surf Instructor",
      },
    ],
    reviews: [
      {
        name: "Ryan M.",
        date: "April 2023",
        rating: 5,
        text: "Perfect combination of yoga and surfing! The instructors were knowledgeable and supportive, and the beachfront location was incredible. I improved both my yoga practice and my surfing skills.",
      },
      {
        name: "Emma L.",
        date: "March 2023",
        rating: 4,
        text: "Great retreat for active people who want to combine wellness with adventure. The yoga classes complemented the surf lessons perfectly. Food was amazing too!",
      },
      {
        name: "Jason K.",
        date: "February 2023",
        rating: 5,
        text: "As a beginner surfer, I was a bit nervous, but the instructors made me feel comfortable and I was standing up on the board by day two! The yoga was the perfect way to stretch out after surfing.",
      },
    ],
    faqs: [
      {
        question: "Do I need prior surfing experience?",
        answer:
          "No, our surf lessons cater to all levels from complete beginners to intermediate surfers. Our instructors will assess your level and provide appropriate instruction.",
      },
      {
        question: "What if I'm an experienced yogi but new to surfing?",
        answer:
          "That's perfectly fine! Many of our participants are experienced in one activity and beginners in the other. Our instructors will help you find the right balance.",
      },
      {
        question: "Are surf boards provided?",
        answer:
          "Yes, we provide surf boards and rash guards for all participants. You're welcome to bring your own if you prefer.",
      },
      {
        question: "What if the surf conditions are poor?",
        answer:
          "If surf conditions aren't suitable, we'll offer alternative activities such as SUP (stand-up paddleboarding), beach workouts, or additional yoga sessions.",
      },
    ],
    similar: [
      {
        name: "Ocean Harmony Retreat",
        image: "/placeholder.svg?height=200&width=300&text=Ocean%20Harmony",
        location: "Canggu",
        duration: "6 days",
        rating: 4.9,
      },
      {
        name: "Surfer's Yoga Retreat",
        image: "/placeholder.svg?height=200&width=300&text=Surfer's%20Retreat",
        location: "Uluwatu",
        duration: "7 days",
        rating: 4.8,
      },
      {
        name: "Beachside Yoga Shack",
        image: "/placeholder.svg?height=200&width=300&text=Beachside",
        location: "Amed",
        duration: "5 days",
        rating: 4.7,
      },
    ],
  },
  {
    id: 3,
    name: "Jungle Yoga Escape",
    slug: "jungle-yoga-escape",
    location: "Ubud",
    rating: 4.7,
    reviewCount: 62,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%203",
    duration: "8 days / 7 nights",
    price: "$1,499",
    tagline: "Reconnect with nature in the heart of Bali",
    description: "An immersive retreat in a jungle setting with waterfall hikes and traditional ceremonies.",
    styles: ["Vinyasa", "Meditation", "Nature Walks"],
    includes: ["7 nights eco-accommodation", "Organic meals", "Waterfall excursions"],
    type: "retreat",
    // Add similar detailed information for this retreat
  },
  {
    id: 4,
    name: "Sacred Healing Journey",
    slug: "sacred-healing-journey",
    location: "Ubud",
    rating: 4.9,
    reviewCount: 94,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%204",
    duration: "10 days / 9 nights",
    price: "$1,899",
    tagline: "Deep healing through ancient practices",
    description: "A transformative retreat focusing on traditional healing modalities and sacred ceremonies.",
    styles: ["Kundalini", "Sound Healing", "Breathwork"],
    includes: ["9 nights luxury accommodation", "Plant-based meals", "Traditional healing ceremonies"],
    type: "retreat",
  },
  {
    id: 5,
    name: "Ocean Harmony Retreat",
    slug: "ocean-harmony-retreat",
    location: "Amed",
    rating: 4.8,
    reviewCount: 71,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%205",
    duration: "6 days / 5 nights",
    price: "$1,099",
    tagline: "Yoga and diving in Bali's best kept secret",
    description: "A unique retreat combining yoga practices with snorkeling and diving experiences.",
    styles: ["Hatha", "Yin", "Underwater Meditation"],
    includes: ["5 nights beachfront accommodation", "Meals included", "Diving/snorkeling excursions"],
    type: "retreat",
  },
  {
    id: 6,
    name: "Mountain Meditation Escape",
    slug: "mountain-meditation-escape",
    location: "Munduk",
    rating: 4.9,
    reviewCount: 68,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%206",
    duration: "5 days / 4 nights",
    price: "$999",
    tagline: "Find clarity in the mountain mists",
    description: "A meditation-focused retreat in the cool mountain region of Bali.",
    styles: ["Meditation", "Gentle Yoga", "Forest Bathing"],
    includes: ["4 nights mountain villa", "Vegetarian meals", "Guided meditation journeys"],
    type: "retreat",
  },
  {
    id: 7,
    name: "Detox & Renew Retreat",
    slug: "detox-renew-retreat",
    location: "Ubud",
    rating: 4.7,
    reviewCount: 82,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%207",
    duration: "7 days / 6 nights",
    price: "$1,399",
    tagline: "Cleanse your body, clear your mind",
    description: "A comprehensive detox retreat combining yoga, juice fasting, and wellness therapies.",
    styles: ["Gentle Yoga", "Meditation", "Cleansing Practices"],
    includes: ["6 nights accommodation", "Juice cleanse program", "Detox therapies"],
    type: "retreat",
  },
  {
    id: 8,
    name: "Surfer's Yoga Retreat",
    slug: "surfers-yoga-retreat",
    location: "Uluwatu",
    rating: 4.8,
    reviewCount: 79,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%208",
    duration: "7 days / 6 nights",
    price: "$1,299",
    tagline: "Ride the waves, find your balance",
    description: "The perfect retreat for yoga practitioners who also love to surf.",
    styles: ["Vinyasa", "Mobility", "Surf Lessons"],
    includes: ["6 nights surf villa", "Healthy meals", "Daily surf lessons and yoga"],
    type: "retreat",
  },
  {
    id: 9,
    name: "Women's Empowerment Retreat",
    slug: "womens-empowerment-retreat",
    location: "Ubud",
    rating: 4.9,
    reviewCount: 91,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%209",
    duration: "8 days / 7 nights",
    price: "$1,599",
    tagline: "Connect with your divine feminine",
    description: "A women-only retreat focused on empowerment, connection, and sacred feminine practices.",
    styles: ["Goddess Yoga", "Dance", "Women's Circles"],
    includes: ["7 nights shared accommodation", "Organic meals", "Women's circle ceremonies"],
    type: "retreat",
  },
  {
    id: 10,
    name: "Yoga & Permaculture Retreat",
    slug: "yoga-permaculture-retreat",
    location: "Tabanan",
    rating: 4.7,
    reviewCount: 65,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%2010",
    duration: "10 days / 9 nights",
    price: "$1,699",
    tagline: "Sustainable living and mindful practice",
    description: "A unique retreat combining yoga practice with hands-on permaculture and sustainable living skills.",
    styles: ["Hatha", "Karma Yoga", "Permaculture"],
    includes: ["9 nights eco-accommodation", "Farm-to-table meals", "Permaculture workshops"],
    type: "retreat",
  },
  {
    id: 11,
    name: "Silent Meditation Retreat",
    slug: "silent-meditation-retreat",
    location: "Sidemen",
    rating: 4.9,
    reviewCount: 72,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%2011",
    duration: "5 days / 4 nights",
    price: "$899",
    tagline: "Find your voice in the silence",
    description: "A challenging but rewarding silent retreat focused on deep meditation practices.",
    styles: ["Vipassana", "Walking Meditation", "Mindfulness"],
    includes: ["4 nights simple accommodation", "Vegetarian meals", "Guided and self-directed meditation"],
    type: "retreat",
  },
  {
    id: 12,
    name: "Yoga & Arts Retreat",
    slug: "yoga-arts-retreat",
    location: "Ubud",
    rating: 4.8,
    reviewCount: 84,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%2012",
    duration: "7 days / 6 nights",
    price: "$1,299",
    tagline: "Express yourself through movement and creativity",
    description: "A creative retreat combining yoga practice with various art forms and expression.",
    styles: ["Vinyasa", "Expressive Arts", "Dance"],
    includes: ["6 nights artistic accommodation", "Healthy meals", "Art materials and workshops"],
    type: "retreat",
  },
  {
    id: 13,
    name: "Family Yoga Adventure",
    slug: "family-yoga-adventure",
    location: "Sanur",
    rating: 4.7,
    reviewCount: 68,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%2013",
    duration: "6 days / 5 nights",
    price: "$2,499",
    tagline: "Yoga and adventure for the whole family",
    description: "A family-friendly retreat with yoga for all ages and exciting Balinese adventures.",
    styles: ["Family Yoga", "Kids Yoga", "Adventure Activities"],
    includes: ["5 nights family villa", "Kid-friendly meals", "Family excursions"],
    type: "retreat",
    price_details: {
      standard: "$2,499 for family of 4",
      premium: "$2,999 for family of 4",
      deposit: "$500",
    },
  },
  {
    id: 14,
    name: "Luxury Wellness Escape",
    slug: "luxury-wellness-escape",
    location: "Nusa Dua",
    rating: 4.9,
    reviewCount: 96,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%2014",
    duration: "7 days / 6 nights",
    price: "$2,999",
    tagline: "The ultimate luxury wellness experience",
    description:
      "A high-end retreat offering premium accommodations, gourmet food, and exclusive wellness experiences.",
    styles: ["Hatha", "Yin", "Spa Treatments"],
    includes: ["6 nights luxury suite", "Gourmet meals", "Daily spa treatments"],
    type: "retreat",
  },
  {
    id: 15,
    name: "Yoga Teacher Immersion",
    slug: "yoga-teacher-immersion",
    location: "Ubud",
    rating: 4.8,
    reviewCount: 87,
    image: "/placeholder.svg?height=200&width=300&text=Retreat%2015",
    duration: "14 days / 13 nights",
    price: "$2,499",
    tagline: "Deepen your practice and teaching skills",
    description: "An immersive retreat for yoga teachers looking to refine their skills and expand their knowledge.",
    styles: ["Various Styles", "Teaching Methodology", "Anatomy"],
    includes: ["13 nights accommodation", "All meals included", "Teaching materials and certification"],
    type: "retreat",
  },
]

// Define the data directory
const DATA_DIR = path.join(process.cwd(), "data")

// Ensure the data directory exists
export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  // Ensure studios.json exists
  const studiosPath = path.join(DATA_DIR, "studios.json")
  if (!fs.existsSync(studiosPath)) {
    fs.writeFileSync(studiosPath, JSON.stringify(mockStudios, null, 2))
  }

  // Ensure retreats.json exists
  const retreatsPath = path.join(DATA_DIR, "retreats.json")
  if (!fs.existsSync(retreatsPath)) {
    fs.writeFileSync(retreatsPath, JSON.stringify(mockRetreats, null, 2))
  }
}

// Get all studios
export function getStudios(): Studio[] {
  try {
    ensureDataDir()
    const studiosPath = path.join(DATA_DIR, "studios.json")
    const studiosData = fs.readFileSync(studiosPath, "utf8")
    const studios = JSON.parse(studiosData)

    // Validate the data
    if (!Array.isArray(studios) || studios.length === 0) {
      console.warn("Studios data is empty or invalid, using mock data")
      return mockStudios
    }

    return studios
  } catch (error) {
    console.error("Error reading studios data:", error)
    return mockStudios
  }
}

// Get all retreats
export function getRetreats(): Retreat[] {
  try {
    ensureDataDir()
    const retreatsPath = path.join(DATA_DIR, "retreats.json")
    const retreatsData = fs.readFileSync(retreatsPath, "utf8")
    const retreats = JSON.parse(retreatsData)

    // Validate the data
    if (!Array.isArray(retreats) || retreats.length === 0) {
      console.warn("Retreats data is empty or invalid, using mock data")
      return mockRetreats
    }

    return retreats
  } catch (error) {
    console.error("Error reading retreats data:", error)
    return mockRetreats
  }
}

// Get a studio by slug
export function getStudioBySlug(slug: string): Studio | null {
  const studios = getStudios()
  return studios.find((studio) => studio.slug === slug) || null
}

// Get a retreat by slug
export function getRetreatBySlug(slug: string): Retreat | null {
  const retreats = getRetreats()
  return retreats.find((retreat) => retreat.slug === slug) || null
}

// Save studios
export function saveStudios(studios: Studio[]) {
  ensureDataDir()
  const studiosPath = path.join(DATA_DIR, "studios.json")
  fs.writeFileSync(studiosPath, JSON.stringify(studios, null, 2))
}

// Save retreats
export function saveRetreats(retreats: Retreat[]) {
  ensureDataDir()
  const retreatsPath = path.join(DATA_DIR, "retreats.json")
  fs.writeFileSync(retreatsPath, JSON.stringify(retreats, null, 2))
}

// Add or update a studio
export function saveStudio(studio: Studio) {
  const studios = getStudios()
  const index = studios.findIndex((s) => s.id === studio.id || s.slug === studio.slug)

  if (index !== -1) {
    // Update existing studio
    studios[index] = { ...studios[index], ...studio }
  } else {
    // Add new studio
    studios.push({
      ...studio,
      type: "studio",
    })
  }

  saveStudios(studios)
}

// Add or update a retreat
export function saveRetreat(retreat: Retreat) {
  const retreats = getRetreats()
  const index = retreats.findIndex((r) => r.id === retreat.id || r.slug === retreat.slug)

  if (index !== -1) {
    // Update existing retreat
    retreats[index] = { ...retreats[index], ...retreat }
  } else {
    // Add new retreat
    retreats.push({
      ...retreat,
      type: "retreat",
    })
  }

  saveRetreats(retreats)
}

// Delete a studio
export function deleteStudio(id: number | string) {
  const studios = getStudios()
  const updatedStudios = studios.filter((studio) => studio.id !== id)
  saveStudios(updatedStudios)
}

// Delete a retreat
export function deleteRetreat(id: number | string) {
  const retreats = getRetreats()
  const updatedRetreats = retreats.filter((retreat) => retreat.id !== id)
  saveRetreats(updatedRetreats)
}

// Import data from JSON
export function importData(type: "studios" | "retreats", data: any[]) {
  if (type === "studios") {
    // Ensure each item has the type field
    const studios = data.map((item) => ({ ...item, type: "studio" }))
    saveStudios(studios)
  } else {
    // Ensure each item has the type field
    const retreats = data.map((item) => ({ ...item, type: "retreat" }))
    saveRetreats(retreats)
  }
}

export { mockStudios, mockRetreats }
