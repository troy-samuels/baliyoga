/**
 * Yoga Style Data for Category Pages
 *
 * These pages filter studios by yoga style and provide educational content
 * optimized for SEO and LLM citations
 */

export interface YogaStyleData {
  slug: string
  name: string
  displayName: string
  metaTitle: string
  metaDescription: string
  shortDescription: string
  detailedDescription: string
  keywords: string[]
  benefits: string[]
  bestFor: string[]
  typicalClass: {
    duration: string
    intensity: string
    focus: string[]
    temperature: string
  }
  history: string
  whatToExpect: string
  forBeginners: {
    suitable: boolean
    considerations: string
  }
  popularIn: string[] // Bali locations where this style is popular
  relatedStyles: string[]
  faqs: Array<{
    question: string
    answer: string
  }>
}

export const YOGA_STYLE_SLUGS = [
  'vinyasa-yoga',
  'hatha-yoga',
  'yin-yoga',
  'ashtanga-yoga',
  'kundalini-yoga',
  'restorative-yoga'
] as const

export type YogaStyleSlug = typeof YOGA_STYLE_SLUGS[number]

export const YOGA_STYLES: Record<YogaStyleSlug, YogaStyleData> = {
  'vinyasa-yoga': {
    slug: 'vinyasa-yoga',
    name: 'Vinyasa Yoga',
    displayName: 'Vinyasa Flow Yoga',
    metaTitle: 'Vinyasa Yoga in Bali 2025 | Best Studios & Classes',
    metaDescription: 'Discover Vinyasa Flow yoga studios in Bali. Dynamic, breath-synchronized practice perfect for building strength and flexibility. Find classes for all levels across Ubud, Canggu, and Seminyak.',
    shortDescription: 'Dynamic, flowing practice synchronizing breath with movement. Build strength, flexibility, and mindfulness through creative sequences.',
    detailedDescription: `Vinyasa Yoga, often called "Flow Yoga," is a dynamic practice where poses flow seamlessly from one to another, synchronized with breath. Unlike more static styles, Vinyasa emphasizes smooth transitions and creative sequencing, making each class unique.

The term "vinyasa" means "to place in a special way," referring to the intentional linking of breath and movement. This style emerged from Ashtanga yoga but offers more freedom and creativity, allowing teachers to design varied sequences rather than following a fixed series.

In Bali, Vinyasa is the most popular yoga style, offered at 42% of studios. The island's vibrant, active culture aligns perfectly with Vinyasa's energetic nature. You'll find everything from gentle beginner flows to advanced power vinyasa classes that rival intensive workouts.`,
    keywords: [
      'vinyasa yoga bali',
      'vinyasa flow classes',
      'dynamic yoga bali',
      'flow yoga studios',
      'vinyasa canggu',
      'power vinyasa bali'
    ],
    benefits: [
      'Builds full-body strength and endurance',
      'Increases flexibility through dynamic stretching',
      'Improves cardiovascular fitness',
      'Enhances mind-body coordination',
      'Develops breath awareness and control',
      'Burns calories (300-500 per class)',
      'Reduces stress through flowing movement',
      'Never gets boring—each class is different'
    ],
    bestFor: [
      'Active individuals wanting physical challenge',
      'Those who get bored with repetitive routines',
      'People seeking cardio and strength combined',
      'Intermediate to advanced practitioners',
      'Young, energetic students (popular with 20-40 age group)',
      'Those wanting variety and creative sequences',
      'Fitness enthusiasts transitioning to yoga'
    ],
    typicalClass: {
      duration: '60-90 minutes',
      intensity: 'Moderate to high (varies by level)',
      focus: [
        'Breath-movement synchronization',
        'Creative pose sequences',
        'Building strength and stamina',
        'Flexibility through dynamic movement',
        'Mindful transitions between poses'
      ],
      temperature: 'Room temperature or slightly warm (not heated like hot yoga)'
    },
    history: `Vinyasa yoga evolved from Ashtanga yoga in the 1980s-90s as Western teachers sought more creative freedom. While maintaining Ashtanga's emphasis on breath-linked movement, Vinyasa allows teachers to design unique sequences rather than following the fixed Ashtanga series.

The style gained massive popularity in Western countries during the 2000s and became dominant in Bali's yoga scene by 2010. Today, it represents the most common style taught across Bali's studios, appealing to the island's active, adventurous community.

Key innovators include Shiva Rea (who popularized the term "vinyasa flow"), Seane Corn, and Baron Baptiste, though many teachers have contributed to the style's evolution.`,
    whatToExpect: `**Class Structure:**
A typical Vinyasa class follows this general arc, though specifics vary widely:

**Opening (5-10 min):** Centering, intention-setting, initial breathwork
**Warm-up (10-15 min):** Cat-cow, gentle spinal movements, sun salutations
**Building Heat (20-30 min):** Dynamic sequences linking multiple poses, repetition to build strength
**Peak Poses (10-15 min):** More challenging poses or inversions
**Cool Down (10 min):** Gentle stretches, hip openers, forward folds
**Savasana (5-10 min):** Final relaxation

**Music:** Many Vinyasa classes include curated playlists (indie, electronic, acoustic) to enhance flow. Some studios offer silent practice—check in advance if you have preferences.

**Teaching Style:** Teachers guide you through sequences verbally, often demonstrating poses. Hands-on adjustments are common (you can decline). The pace varies significantly—ask about "gentle flow" vs "power vinyasa" vs "intermediate flow" to find your level.

**Physical Challenge:** Expect to sweat! Vinyasa builds heat through continuous movement. Bring a towel (especially important in Bali's humidity) and plan to be active for most of class. Rest in child's pose whenever needed—this is encouraged.`,
    forBeginners: {
      suitable: true,
      considerations: `Vinyasa can be beginner-friendly IF you choose the right class level:

**Look for:**
• "Vinyasa Basics" or "Slow Flow" classes
• "Level 1" or "All Levels" designations
• Smaller class sizes (more personal attention)
• Teachers known for clear instruction

**Avoid as beginner:**
• "Power Vinyasa" or "Advanced Flow"
• Fast-paced classes (described as "vigorous" or "challenging")
• Large drop-in classes at peak times (less individual attention)

**First Class Tips:**
• Arrive 10 minutes early to inform teacher you're new
• Set up near experienced practitioners to watch when confused
• Don't try to keep up with every pose—rest when needed
• Focus on breath more than perfect form initially
• Expect to feel lost at times—this is normal!

**Building Block:** 3-4 weeks of consistent Vinyasa basics classes give you enough foundation to join intermediate flows. Most studios offer progressive pathways for beginners.`
    },
    popularIn: [
      'Canggu (most Vinyasa studios in Bali)',
      'Seminyak (power vinyasa and athletic flows)',
      'Ubud (mix of gentle and vigorous)',
      'Uluwatu (surf and yoga combinations)'
    ],
    relatedStyles: [
      'Power Yoga (similar but always vigorous)',
      'Ashtanga (Vinyasa\'s parent style, more structured)',
      'Hot Yoga (Vinyasa in heated room)',
      'Rocket Yoga (fast-paced Vinyasa variation)'
    ],
    faqs: [
      {
        question: 'What is the difference between Vinyasa and Hatha yoga?',
        answer: 'Vinyasa is faster-paced with flowing transitions between poses, while Hatha holds poses longer with breaks between. Think of Hatha as learning individual words, Vinyasa as speaking in sentences. Hatha is generally better for beginners learning alignment; Vinyasa is better for those wanting cardio and dynamic movement.'
      },
      {
        question: 'How many calories does Vinyasa yoga burn?',
        answer: 'Vinyasa typically burns 300-500 calories per 60-minute class, depending on intensity and your body weight. Power Vinyasa can reach 500-600 calories. This is comparable to moderate jogging or swimming, making it effective for fitness and weight management.'
      },
      {
        question: 'Do I need to be strong to do Vinyasa yoga?',
        answer: 'No—Vinyasa builds strength over time. Start with beginner or "slow flow" classes that offer modifications. You\'ll build arm, core, and leg strength gradually. Within 4-6 weeks of regular practice (3x per week), most people notice significant strength gains, especially in upper body and core.'
      },
      {
        question: 'What should I bring to a Vinyasa class in Bali?',
        answer: 'Essential: Water bottle, towel (Bali humidity makes you sweat even in non-heated classes), comfortable stretchy clothes. Optional: Your own mat (studios provide them). Avoid eating 1-2 hours before class—continuous movement on a full stomach is uncomfortable.'
      },
      {
        question: 'Is Vinyasa yoga spiritual or just exercise?',
        answer: 'This varies by teacher and studio. Some Vinyasa classes are purely physical (emphasizing fitness and athleticism), while others integrate philosophy, meditation, and spiritual elements. Check studio descriptions or ask—Bali offers both approaches. Canggu tends toward athletic; Ubud tends toward spiritual.'
      },
      {
        question: 'How is Vinyasa different from "Flow Yoga"?',
        answer: 'They\'re the same thing! "Flow Yoga" is simply a more accessible English term for Vinyasa. Some studios use "Vinyasa Flow" to emphasize both. Any class labeled "Flow" will have continuous, breath-linked movement characteristic of Vinyasa.'
      }
    ]
  },

  'hatha-yoga': {
    slug: 'hatha-yoga',
    name: 'Hatha Yoga',
    displayName: 'Hatha Yoga',
    metaTitle: 'Hatha Yoga in Bali 2025 | Traditional Classes & Best Studios',
    metaDescription: 'Find authentic Hatha yoga studios in Bali. Traditional, alignment-focused practice perfect for beginners and those seeking foundational understanding. Classes across Ubud, Sanur, and beyond.',
    shortDescription: 'Traditional yoga emphasizing proper alignment and breath. Perfect for beginners and those wanting to deepen their understanding of foundational poses.',
    detailedDescription: `Hatha Yoga is the foundational style from which most modern yoga derives. The term "hatha" literally means "force" in Sanskrit, but has come to represent a practice that balances body and mind through physical postures (asanas) and breath control (pranayama).

Unlike flowing Vinyasa, Hatha classes typically hold poses for several breaths with pauses between, allowing time to explore alignment and make adjustments. This slower pace makes Hatha ideal for beginners learning the foundations, as well as experienced practitioners wanting to refine their practice.

In Bali, 38% of studios offer Hatha yoga, making it the second most common style after Vinyasa. Ubud, with its spiritual focus and traditional approach, has the highest concentration of Hatha studios. The style attracts an older demographic (30-55 years old) and those seeking mindful, meditative practice over athletic challenge.`,
    keywords: [
      'hatha yoga bali',
      'traditional yoga bali',
      'hatha classes ubud',
      'beginner yoga bali',
      'alignment yoga',
      'foundational yoga bali'
    ],
    benefits: [
      'Builds solid foundational understanding of yoga',
      'Improves posture and body awareness',
      'Develops precise alignment skills',
      'Reduces injury risk through proper technique',
      'Calms nervous system through slower pace',
      'Deepens breath awareness',
      'Suitable for all fitness levels',
      'Therapeutic for chronic pain when alignment-focused',
      'Prepares body for more advanced practices'
    ],
    bestFor: [
      'Complete beginners wanting strong foundation',
      'Those recovering from injury (with teacher guidance)',
      'Practitioners wanting to improve alignment',
      'People who find fast-paced yoga overwhelming',
      'Mature students (40+ years old)',
      'Those preferring meditative over athletic practice',
      'People with limited flexibility (time to work into poses)',
      'Students interested in traditional yoga philosophy'
    ],
    typicalClass: {
      duration: '60-90 minutes',
      intensity: 'Low to moderate (accessible to most fitness levels)',
      focus: [
        'Proper alignment and technique',
        'Breath awareness and control',
        'Building foundational strength',
        'Flexibility development',
        'Mind-body connection',
        'Often includes meditation and philosophy'
      ],
      temperature: 'Room temperature (not heated)'
    },
    history: `Hatha yoga traces back to 15th century India, particularly to the text "Hatha Yoga Pradipika" by Swami Swatmarama. This text systematized physical practices as preparation for meditation, emphasizing pranayama (breath control) and asana (postures).

The style came to the West in the early 1900s through teachers like Tirumalai Krishnamacharya (often called "the father of modern yoga"), who trained influential teachers including B.K.S. Iyengar, Pattabhi Jois, and Indra Devi.

In Bali, Hatha yoga arrived with the first wave of yoga tourism in the 1990s. Ubud became particularly known for traditional Hatha practice, attracting teachers wanting to study classical yoga in a spiritual setting. Today, Bali's Hatha classes range from very traditional (including philosophy and Sanskrit chanting) to modern Western approaches focusing primarily on physical practice.`,
    whatToExpect: `**Class Structure:**
Hatha classes follow a slower, more methodical approach than Vinyasa:

**Opening (10 min):** Seated meditation, intention-setting, pranayama (breathing exercises)
**Warm-up (10 min):** Gentle movements to prepare body
**Standing Poses (20-30 min):** Foundational poses held for 3-8 breaths each with detailed alignment cues
**Seated/Floor Poses (15-20 min):** Forward folds, twists, hip openers held for extended time
**Cool Down (10 min):** Gentle stretches and restorative poses
**Savasana (10 min):** Longer relaxation than most styles
**Closing (5 min):** Seated meditation, sometimes philosophy discussion or chanting

**Pace:** Expect pauses between poses. Teacher demonstrates and explains alignment before you try. There's time for questions and adjustments. This deliberate pace allows deep exploration of each pose.

**Alignment Focus:** Teachers provide detailed instruction: "Press through four corners of feet," "Engage quadriceps to protect knees," etc. This precise cueing is Hatha's hallmark—you learn WHY you position your body certain ways.

**Props:** Hatha classes use blocks, straps, and bolsters extensively. Props aren't "cheating"—they're intelligent tools allowing proper alignment before your body develops flexibility. Teachers demonstrate how to use them.

**Philosophy:** Traditional Hatha classes often include brief philosophy discussions, explanations of chakras or energy, or Sanskrit terminology. Modern Western Hatha might skip this. If you want traditional approach, ask studios about their philosophy.`,
    forBeginners: {
      suitable: true,
      considerations: `Hatha is widely considered THE best style for absolute beginners:

**Why It's Ideal for Beginners:**
• Slow pace allows time to understand each pose
• Teachers explain alignment in detail
• Pauses between poses let you rest and process
• Lower injury risk due to controlled movement
• Builds strong foundation before trying advanced styles
• Less intimidating than athletic Vinyasa classes

**Perfect First Class:**
Look for classes specifically labeled:
• "Hatha for Beginners"
• "Gentle Hatha"
• "Hatha Basics"
• "Level 1 Hatha"

**Building Your Practice:**
Most experts recommend 6-8 weeks of Hatha basics before trying faster styles. This foundation prevents injury and creates better understanding of more advanced practices.

**What Beginners Love About Hatha:**
• Time to ask questions
• Not feeling rushed
• Understanding the "why" behind poses
• Supportive, non-competitive atmosphere
• Visible progress week to week

**One Consideration:**
If you're very fit and athletic, Hatha might feel too slow initially. Give it 3-4 classes before deciding—the depth of practice often hooks athletic types who initially resist the pace.`
    },
    popularIn: [
      'Ubud (most traditional Hatha, often includes philosophy)',
      'Sanur (gentle Hatha for mature practitioners)',
      'Denpasar (authentic local Hatha classes)',
      'All locations (Hatha is universally available as foundational style)'
    ],
    relatedStyles: [
      'Iyengar Yoga (even more alignment-focused Hatha derivative)',
      'Gentle Yoga (slower, more accessible Hatha)',
      'Yin Yoga (passive holds vs. active Hatha holds)',
      'Restorative Yoga (ultra-gentle Hatha variation)'
    ],
    faqs: [
      {
        question: 'What is the main difference between Hatha and Vinyasa yoga?',
        answer: 'Hatha holds poses longer with pauses between (like learning individual words), while Vinyasa flows continuously from pose to pose (like speaking sentences). Hatha is typically slower, more alignment-focused, and better for learning foundations. Vinyasa is faster, more cardiovascular, and better for fitness and variety.'
      },
      {
        question: 'Is Hatha yoga too easy or boring?',
        answer: 'No! While Hatha is slower-paced, it can be profoundly challenging. Holding poses for extended periods builds significant strength and stamina. The deep work in alignment and breath creates mental challenge beyond physical movement. Many advanced practitioners prefer Hatha for its depth over flashier styles. That said, if you prefer high-energy workouts, Vinyasa might suit you better.'
      },
      {
        question: 'How long should I practice Hatha before trying other styles?',
        answer: 'Most teachers recommend 6-8 weeks of regular Hatha practice (2-3 classes per week) before exploring faster styles like Vinyasa or Ashtanga. This foundation prevents injury and makes other styles more accessible. However, there\'s no rule—some people study Hatha exclusively for years. Let your goals guide you.'
      },
      {
        question: 'Can Hatha yoga help with back pain?',
        answer: 'Yes, when practiced with proper alignment and under qualified instruction. Hatha\'s emphasis on correct positioning makes it particularly therapeutic. Many people find relief from chronic back pain through consistent Hatha practice. Important: Inform teachers of back issues before class so they can offer appropriate modifications. Consider private sessions initially if you have significant pain.'
      },
      {
        question: 'Do all Hatha classes include meditation and philosophy?',
        answer: 'Not all—it varies by studio and teacher. Traditional Hatha (common in Ubud) often includes meditation, pranayama, and brief philosophy teachings. Western-influenced Hatha (common in Canggu/Seminyak) may focus primarily on physical poses with minimal philosophy. Check studio descriptions or ask directly if this matters to you.'
      },
      {
        question: 'Is Hatha yoga religious?',
        answer: 'Hatha yoga has roots in Hindu philosophy but is not inherently religious. Modern practice focuses on physical and mental benefits accessible to anyone regardless of religious beliefs. Some traditional classes reference energy systems (chakras) or include Sanskrit chanting—these are cultural elements, not religious requirements. You can fully benefit from Hatha without adopting any religious beliefs.'
      }
    ]
  },

  'yin-yoga': {
    slug: 'yin-yoga',
    name: 'Yin Yoga',
    displayName: 'Yin Yoga',
    metaTitle: 'Yin Yoga in Bali 2025 | Restorative Classes & Best Studios',
    metaDescription: 'Discover Yin Yoga studios in Bali. Slow, meditative practice holding poses for 3-5 minutes. Perfect for flexibility, stress relief, and deep relaxation. Classes in Ubud, Canggu, and Sanur.',
    shortDescription: 'Slow, meditative practice holding passive floor poses for 3-5 minutes. Deeply relaxing, increases flexibility, and calms the nervous system.',
    detailedDescription: `Yin Yoga is a slow-paced, meditative style where poses are held for extended periods (typically 3-5 minutes) while muscles remain relatively relaxed. Unlike active "yang" styles (Vinyasa, Ashtanga) that work muscles, Yin targets deep connective tissues—ligaments, joints, fascia, and bones.

The practice combines ancient Chinese Taoist yoga principles with modern understanding of anatomy. While holding passive poses, you access deeper layers of tension, improve joint mobility, and stimulate energy meridians (similar to acupuncture theory).

In Bali, 28% of studios offer Yin yoga, often in evening classes or combined with sound healing. The style has grown significantly in popularity over the past 5 years as modern life's stress drives demand for deeply restorative practices. Ubud studios particularly embrace Yin, often integrating it with meditation, breathwork, and energy healing.`,
    keywords: [
      'yin yoga bali',
      'restorative yoga',
      'deep stretch yoga',
      'meditative yoga bali',
      'yin yoga ubud',
      'flexibility yoga'
    ],
    benefits: [
      'Dramatically increases flexibility in hips, spine, and connective tissue',
      'Deeply calming for nervous system (activates parasympathetic response)',
      'Improves joint mobility and health',
      'Releases deep-seated tension and trauma',
      'Cultivates mindfulness and meditation skills',
      'Balances active lifestyle or intense workouts',
      'Helps insomnia and anxiety',
      'Prepares mind for deeper meditation',
      'Increases circulation to joints and organs',
      'Complements active yoga styles perfectly'
    ],
    bestFor: [
      'Athletes needing deep stretching (runners, surfers, climbers)',
      'People with high-stress lifestyles',
      'Those wanting to improve flexibility',
      'Practitioners balancing active yoga with passive practice',
      'People dealing with anxiety or insomnia',
      'Those interested in meditation but finding it difficult',
      'Mature students (Yin is joint-friendly)',
      'Anyone wanting profound relaxation',
      'Practitioners recovering from injury (with guidance)'
    ],
    typicalClass: {
      duration: '75-90 minutes (longer than active styles)',
      intensity: 'Low physical intensity, high mental/emotional intensity',
      focus: [
        'Passive long-held stretches',
        'Releasing deep connective tissue',
        'Stillness and meditation',
        'Breath awareness',
        'Energetic body (meridians/chakras)',
        'Surrendering and letting go'
      ],
      temperature: 'Room temperature, often dimly lit with soft music'
    },
    history: `Yin Yoga was developed in the late 1970s by martial artist and Taoist yoga teacher Paulie Zink, combining Taoist yoga with modern anatomical understanding. In the 1990s, Paul Grilley and Sarah Powers further developed and popularized the style, integrating Traditional Chinese Medicine meridian theory.

The style reached Bali in the early 2000s and exploded in popularity around 2015-2020 as Western practitioners sought balance to busy, active lifestyles. Today, nearly every yoga studio in Bali offers at least one Yin class weekly, recognizing its role as the perfect complement to more active practices.

Yin represents the ancient Chinese concept of receptive, cooling, feminine energy—contrasting with yang's active, heating, masculine energy. This philosophy of balance resonates deeply with yoga practitioners seeking wholeness rather than constant activity.`,
    whatToExpect: `**Class Structure:**
Yin classes follow a unique, deeply relaxing format:

**Opening (5-10 min):** Guided relaxation, breath awareness, intention-setting from already lying down
**Yin Poses (60-70 min):**
  - 8-12 poses held for 3-5 minutes each
  - All seated or lying poses (no standing)
  - Props (blocks, bolsters, blankets) used extensively
  - Teacher guides into pose, then mostly silence during holds
  - Gentle music or complete silence
  - Between poses: brief pause to notice sensations
**Savasana (10-15 min):** Extended final relaxation (longer than other styles)
**Closing (5 min):** Gentle return to awareness, perhaps brief meditation

**The Experience:**
Yin is profoundly different from active yoga. You'll find your "edge"—the point of sensation without pain—then remain still. The first 90 seconds often feel fine; then you notice intensity as tissues begin to release. This is intentional discomfort, not pain. You'll practice staying present with sensation—this is the meditation.

**Mental Challenge:**
Yin is often called "the hardest easy practice." While not physically demanding, staying still for 5 minutes with discomfort challenges your mind intensely. Modern minds resist stillness. This practice teaches patience, surrender, and equanimity—valuable life skills beyond yoga.

**Physical Sensations:**
Expect to feel deep stretching, sometimes intense. You might experience emotional release (tears are common and welcomed—stuck emotions release through fascia). After class, you'll feel profoundly relaxed, sometimes almost floaty or spacey. This is normal—plan quiet time afterward rather than intense activities.

**Props are Essential:**
Unlike active styles where props are optional, Yin requires them. Bolsters, blocks, and blankets allow you to relax into poses. Teachers will show you how to set up. The goal is supported, passive stretching—not "achieving" the deepest version of poses.`,
    forBeginners: {
      suitable: true,
      considerations: `Yin is beginner-friendly BUT requires different understanding than active yoga:

**Why It's Good for Beginners:**
• No complex sequences to learn
• No strength requirements
• No flexibility required (you're building it!)
• Accessible to any fitness level
• Teachers provide extensive setup guidance

**Why It Can Be Challenging:**
• Staying still is harder than it looks
• Confronting discomfort is mentally intense
• Emotional release can be unexpected
• Patience required (modern minds resist)

**Perfect as First Class?**
Opinions vary. Some say yes (non-intimidating, gentle). Others suggest trying gentle Hatha first so you understand basic yoga concepts. Either way, Yin is highly accessible for beginners willing to embrace stillness.

**Tips for First Yin Class:**
• Don't eat heavy meal within 3 hours (uncomfortable lying down)
• Arrive extra early—setup is crucial
• Tell teacher you're new—they'll help with props
• Remember: sensation is normal; pain is not
• Give yourself permission to adjust anytime
• If emotions arise, allow them—this is healing
• Plan quiet evening afterward

**Building Your Practice:**
Many people combine Yin with active styles (Vinyasa or Hatha). Try:
• 2-3 active classes + 1 Yin class weekly (balanced)
• Active morning practice + Yin evening (daily Yin schedule)
• Yin only if seeking purely meditative practice

Some practitioners do exclusively Yin, others use it as weekly supplement. Both approaches are valid.`
    },
    popularIn: [
      'Ubud (most Yin studios, often combined with sound healing)',
      'Sanur (gentle Yin for mature practitioners)',
      'Canggu (Yin as balance to intense surf/fitness culture)',
      'All locations (increasingly popular everywhere)'
    ],
    relatedStyles: [
      'Restorative Yoga (even gentler, more props, shorter holds)',
      'Yoga Nidra (lying meditation, no poses)',
      'Yin Yang Yoga (combines Yin with active practice in one class)',
      'Myofascial Release (similar tissue targeting, uses tools)'
    ],
    faqs: [
      {
        question: 'What is the difference between Yin and Restorative yoga?',
        answer: 'Both are slow and gentle, but Restorative uses more props to fully support your body in complete comfort (no stretch sensation), while Yin uses fewer props to create gentle stretch tension. Restorative is about total rest and nervous system regulation; Yin is about stretching deep connective tissue. Restorative is perfect when exhausted; Yin is perfect for flexibility and balance to active practice.'
      },
      {
        question: 'Is it normal to feel emotional during Yin yoga?',
        answer: 'Yes, very normal! Fascia (connective tissue) stores emotional tension and trauma. As you release physical tissue, emotions can surface—tears, laughter, sadness, joy. This is healthy and welcomed in Yin classes. Teachers are trained to hold space for emotional release. Allow what arises; it\'s part of the healing process. No need to explain or apologize for emotions.'
      },
      {
        question: 'Can Yin yoga help me become more flexible faster than other styles?',
        answer: 'Yes and no. Yin targets deep tissues that active yoga doesn\'t reach as effectively, so you\'ll develop flexibility in joints and connective tissue. However, it doesn\'t build the muscle flexibility that active practice does. The most effective flexibility approach combines both: active yoga (Vinyasa/Hatha) for muscle flexibility + Yin for deep connective tissue. Together, they create comprehensive flexibility faster than either alone.'
      },
      {
        question: 'How do I know if I\'m pushing too hard in Yin poses?',
        answer: 'In Yin, you want to feel sensation rated 6-7 out of 10 (10 being pain). You should be able to breathe calmly and relax muscles. Warning signs you\'re too deep: sharp or burning pain, muscles tensing to protect, breath holding, numbness or tingling (except gentle tingling that fades quickly). When in doubt, back off slightly. Yin is about finding your edge, not exceeding it. Less is often more.'
      },
      {
        question: 'Can athletes benefit from Yin yoga?',
        answer: 'Absolutely—Yin is often called "the athlete\'s secret weapon." Athletes (runners, surfers, climbers) build muscle tightness and joint stress through repetitive movement. Yin provides the deep connective tissue stretching that active recovery doesn\'t address. Many professional athletes practice Yin weekly to prevent injury, improve range of motion, and balance intense training. It also provides mental training in staying present with discomfort—valuable for competition.'
      },
      {
        question: 'Why do some Yin classes include sound healing or energy work?',
        answer: 'Yin\'s long holds create ideal conditions for sound healing—you\'re already in deep relaxation. Sound vibrations (singing bowls, gongs) enhance the meditative state and support tissue release. Many Ubud studios combine these modalities. It\'s not required for Yin benefits—purely physical Yin classes work perfectly well. Try both approaches and see what resonates with you.'
      }
    ]
  },

  'ashtanga-yoga': {
    slug: 'ashtanga-yoga',
    name: 'Ashtanga Yoga',
    displayName: 'Ashtanga Yoga',
    metaTitle: 'Ashtanga Yoga in Bali 2025 | Mysore & Led Classes',
    metaDescription: 'Find traditional Ashtanga yoga studios in Bali. Rigorous, structured practice building strength and discipline. Mysore-style and led primary series classes in Ubud and beyond.',
    shortDescription: 'Rigorous, structured practice following a fixed sequence. Builds significant strength, flexibility, and discipline through regular practice.',
    detailedDescription: `Ashtanga Yoga is a physically demanding, structured style following a specific sequence of poses performed in the same order every time. Developed by K. Pattabhi Jois in Mysore, India, it's often called "the original power yoga" and serves as the foundation for modern Vinyasa.

The practice links breath with movement (like Vinyasa) but follows a predetermined series rather than creative sequencing. There are six series of increasing difficulty; most practitioners spend years mastering the Primary Series before advancing. This repetition builds deep body knowledge and meditation through movement.

In Bali, 18% of studios offer Ashtanga—lower than Vinyasa or Hatha, but with dedicated communities. Ubud has the strongest Ashtanga scene, with several studios offering traditional Mysore-style classes (self-paced practice with teacher assistance). The style attracts disciplined, committed practitioners—often those with years of yoga experience or athletic backgrounds.`,
    keywords: [
      'ashtanga yoga bali',
      'mysore style bali',
      'primary series yoga',
      'traditional ashtanga',
      'ashtanga ubud',
      'led ashtanga classes'
    ],
    benefits: [
      'Builds exceptional strength (especially upper body, core)',
      'Develops significant flexibility through consistent practice',
      'Creates daily discipline and commitment',
      'Meditation through repetitive movement',
      'Weight loss and muscle definition',
      'Cardiovascular fitness',
      'Deep body awareness through repetition',
      'Strong community among Ashtanga practitioners',
      'Traditional yogic lineage and authenticity',
      'Progressive system with clear advancement path'
    ],
    bestFor: [
      'Athletic individuals wanting rigorous practice',
      'Those who thrive on routine and structure',
      'Practitioners seeking traditional yoga lineage',
      'People wanting clear progression system',
      'Disciplined personalities (Type A)',
      'Experienced yogis wanting to deepen practice',
      'Those who love the journey of mastery',
      'Athletes transitioning to yoga'
    ],
    typicalClass: {
      duration: '90-120 minutes (longer than most styles)',
      intensity: 'High—one of yoga\'s most physically demanding styles',
      focus: [
        'Memorizing and perfecting fixed sequence',
        'Building strength through challenging poses',
        'Breath count (specific breath number for each pose)',
        'Bandhas (internal energy locks)',
        'Drishti (specific gaze points)',
        'Traditional Ashtanga elements'
      ],
      temperature: 'Room temperature (heat builds from practice intensity)'
    },
    history: `Ashtanga Yoga was developed by Sri K. Pattabhi Jois (1915-2009) in Mysore, India. He learned from Tirumalai Krishnamacharya and systematized the practice into fixed series in the 1930s-40s. The name "Ashtanga" refers to Patanjali's eight limbs of yoga, though the physical practice focuses primarily on asana (poses).

The style came to Western attention in the 1970s when Western students traveled to Mysore to study with Pattabhi Jois. Madonna, Gwyneth Paltrow, and other celebrities practicing in the 1990s-2000s brought mainstream attention, though the style maintains traditional elements despite popularity.

Ashtanga arrived in Bali in the 1990s and built a strong following in Ubud among serious practitioners. Several prominent teachers trained directly with Pattabhi Jois have established Balinese shalas. Today, Bali's Ashtanga community maintains traditional practice standards while welcoming new students.`,
    whatToExpect: `**Two Class Formats:**

**Mysore Style (Traditional):**
• Students practice at their own pace
• Teacher circulates, offering individual assistance
• You memorize your sequence over time
• Arrive anytime during 2-3 hour window
• Practice as much as you know, then stop
• Teacher gradually adds new poses as you master current ones
• Silent except for teacher's quiet instructions
• Most traditional and recommended format

**Led Primary Series:**
• Teacher calls out poses with breath count
• Everyone moves together
• Full Primary Series (90 minutes)
• Good for learning sequence before Mysore
• More structured than Mysore style
• Usually offered weekly while Mysore is daily

**What Makes Ashtanga Challenging:**
The Primary Series includes jump-backs, jump-throughs, chaturangas (low plank poses), arm balances, and deep forward folds. Expect to build up slowly—even athletic people often struggle initially. Many practitioners take 1-2 years to complete the full Primary Series.

**The Physical Reality:**
Ashtanga is demanding. You'll sweat profusely (bring towel). Your arms will shake. Some days you'll feel frustrated by poses that seem impossible. This is normal. The practice teaches patience, humility, and persistence as much as physical skills.

**Memorization:**
Unlike other styles where teachers guide you through sequences, Ashtanga requires memorizing your practice. This happens gradually in Mysore style—you learn a few poses at a time. Don't expect to remember everything after one class! The memorization process itself becomes meditation.

**Community Aspect:**
Ashtanga practitioners form close communities through regular practice. You'll see the same people daily at Mysore classes, creating accountability and friendship. This community is one of Ashtanga's greatest strengths—you're not practicing alone.`,
    forBeginners: {
      suitable: false,
      considerations: `Ashtanga is generally NOT recommended for complete beginners without modification:

**Why It's Challenging for Beginners:**
• Very physically demanding
• Requires significant upper body strength
• Fast-paced with complex transitions
• Assumed knowledge of basic poses
• Easy to injure without proper foundation
• Can be overwhelming and discouraging

**If You Want to Start Ashtanga as Beginner:**

**Option 1: Foundation First (Recommended)**
• Practice Hatha or Vinyasa for 3-6 months
• Build strength, flexibility, and basic knowledge
• Then start Ashtanga with solid foundation

**Option 2: Beginner-Friendly Ashtanga**
• Look for "Ashtanga Fundamentals" or "Half Primary" classes
• Start with Mysore style (self-paced, learn gradually)
• Find teacher experienced with beginners
• Be patient—expect 1-2 years to build Primary Series

**Common Beginner Mistakes:**
• Trying to do full class immediately
• Forcing poses body isn't ready for
• Comparing yourself to experienced students
• Getting discouraged by difficulty
• Skipping foundation work

**When Ashtanga Works for Beginners:**
• You're very athletic/strong already
• You have patient, experienced teacher
• You commit to regular practice (4-5x per week)
• You're willing to go slowly and modify
• You don't have ego about doing full poses

**Realistic Expectation:**
Most Ashtanga teachers agree: complete beginners need 6-12 months of foundation before benefiting from traditional Ashtanga. This isn't gatekeeping—it's safety and setting you up for success rather than injury and discouragement.`
    },
    popularIn: [
      'Ubud (strongest Ashtanga community, multiple Mysore programs)',
      'Canggu (some studios offer led primary series)',
      'Sanur (smaller Ashtanga community)',
      'Less common in Seminyak (more Vinyasa-focused)'
    ],
    relatedStyles: [
      'Vinyasa (evolved from Ashtanga, more creative)',
      'Power Yoga (Western athletic adaptation of Ashtanga)',
      'Rocket Yoga (modified Ashtanga allowing pose reordering)',
      'Jivamukti (incorporates Ashtanga elements with other influences)'
    ],
    faqs: [
      {
        question: 'What is the difference between Ashtanga and Vinyasa yoga?',
        answer: 'Ashtanga follows a fixed sequence of poses in the same order every practice, while Vinyasa allows creative sequencing that changes each class. Ashtanga is more structured and traditional; Vinyasa offers more variety. Ashtanga is typically more physically demanding. Vinyasa evolved from Ashtanga, so they share breath-linked movement, but Vinyasa added flexibility in sequencing.'
      },
      {
        question: 'Do I need to practice Ashtanga six days per week?',
        answer: 'Traditional Ashtanga practitioners practice six days weekly (rest on moon days and one day per week). However, this is ideal, not mandatory. Many modern practitioners do 3-4 days weekly and still progress. If you\'re starting, begin with 3 days per week and build up. The key is consistency—regular practice matters more than perfection in frequency.'
      },
      {
        question: 'How long does it take to learn the Primary Series?',
        answer: 'Most students take 1-3 years to learn and comfortably perform the full Primary Series, though this varies widely based on starting fitness, flexibility, and practice frequency. Athletic individuals might progress in 12-18 months; those starting with limited strength/flexibility might need 3-4 years. Remember, Ashtanga is a lifetime practice—there\'s no rush. Quality over speed.'
      },
      {
        question: 'What is Mysore style and why is it preferred?',
        answer: 'Mysore style is self-paced practice where students work through their memorized sequence while the teacher circulates offering individual assistance. Named after Mysore, India where the method originated. It\'s preferred because: you practice at your own level (not forced into full series before ready), receive personalized instruction, develop independent practice, and gradually build knowledge. It seems intimidating but is actually very beginner-friendly when taught well.'
      },
      {
        question: 'Is Ashtanga yoga safe? I\'ve heard about injuries.',
        answer: 'Ashtanga has injury potential due to its demanding nature, but injuries usually result from pushing too hard, poor alignment, or insufficient foundation—not the practice itself. When approached with patience, proper instruction, and respect for your body\'s limits, Ashtanga is safe. Key safety factors: experienced teacher, building foundation slowly, listening to your body, taking rest days, and modifying challenging poses. Never force or compete.'
      },
      {
        question: 'Can I practice Ashtanga if I can\'t do chaturanga or jump-backs?',
        answer: 'Absolutely! In Mysore style, you learn modifications until you build the strength for full expressions. Instead of chaturanga, you can lower to knees. Instead of jumping back, you can step back. Instead of jumping through, you can step through. Good teachers provide appropriate modifications and progressions. You don\'t need to master these immediately—building strength is part of the journey.'
      }
    ]
  },

  'kundalini-yoga': {
    slug: 'kundalini-yoga',
    name: 'Kundalini Yoga',
    displayName: 'Kundalini Yoga',
    metaTitle: 'Kundalini Yoga in Bali 2025 | Energy Work & Meditation Classes',
    metaDescription: 'Find Kundalini yoga studios in Bali. Spiritual practice combining dynamic movement, breathwork, mantra, and meditation. Awaken energy and consciousness in Ubud and beyond.',
    shortDescription: 'Spiritual practice combining dynamic movements, breathwork, mantra chanting, and meditation. Focuses on awakening energy and expanding consciousness.',
    detailedDescription: `Kundalini Yoga is a spiritual and energetic practice aimed at awakening dormant energy (called "kundalini") believed to reside at the base of the spine. The practice combines physical poses (often repetitive movements), powerful breathing techniques (pranayama), chanting, mudras (hand positions), and meditation to move energy through the body's chakra system.

Unlike many yoga styles that focus primarily on physical fitness, Kundalini emphasizes spiritual transformation and consciousness expansion. Classes follow specific "kriyas" (complete exercises targeting particular effects) passed down through traditional lineage. The practice can feel intense—physically, emotionally, and energetically.

In Bali, 12% of studios offer Kundalini, primarily in Ubud where spiritual seekers congregate. The style attracts practitioners interested in yoga's mystical and transformative aspects rather than physical fitness. Many students come to Kundalini after years of other styles, seeking deeper spiritual experiences.`,
    keywords: [
      'kundalini yoga bali',
      'spiritual yoga',
      'energy work bali',
      'chakra yoga',
      'kundalini ubud',
      'transformational yoga'
    ],
    benefits: [
      'Awakens dormant energy and vitality',
      'Balances nervous system and emotional regulation',
      'Expands consciousness and awareness',
      'Releases subconscious patterns and blocks',
      'Strengthens electromagnetic field and aura',
      'Integrates body, mind, and spirit',
      'Powerful breathwork benefits (stress, anxiety, trauma)',
      'Develops meditation ability rapidly',
      'Connects to spiritual aspects of self',
      'Transformative experiences and insights'
    ],
    bestFor: [
      'Spiritually-oriented practitioners',
      'Those seeking transformation beyond physical fitness',
      'People interested in energy work and chakras',
      'Practitioners wanting powerful breathwork',
      'Those who love chanting and mantra',
      'Individuals dealing with trauma (with guidance)',
      'Experienced yogis wanting to go deeper',
      'People interested in meditation but finding it difficult',
      'Those called to mystical practices'
    ],
    typicalClass: {
      duration: '60-90 minutes',
      intensity: 'Moderate to high (but different from athletic intensity)',
      focus: [
        'Awakening kundalini energy',
        'Chakra activation and balancing',
        'Powerful breathwork (pranayama)',
        'Mantra chanting',
        'Repetitive movements (kriyas)',
        'Deep meditation',
        'Energy awareness'
      ],
      temperature: 'Room temperature'
    },
    history: `Kundalini Yoga traces to ancient Tantric traditions in India but was kept secret for centuries, passed only from master to student. In 1968, Yogi Bhajan brought Kundalini to the West, breaking tradition by teaching openly. He systematized and democratized the practice, training thousands of teachers.

The style gained prominence in the 1970s-80s counterculture movement and saw resurgence in the 2000s-2010s as Western practitioners sought spiritual depth beyond physical yoga. However, the lineage faced controversy in recent years regarding Yogi Bhajan's conduct, leading some teachers to separate from traditional organizations while maintaining the practices.

Kundalini arrived in Bali in the early 2000s and found natural home in Ubud's spiritual community. Today, several Bali studios offer regular Kundalini classes, often combined with sound healing, cacao ceremonies, or other consciousness-expanding practices. The style remains somewhat niche but devoted—attracting serious spiritual seekers rather than mainstream audiences.`,
    whatToExpect: `**Class Structure:**
Kundalini classes follow a specific format:

**Tuning In (5 min):** Chanting "Ong Namo Guru Dev Namo" (opening mantra connecting to lineage)
**Pranayama (5-10 min):** Powerful breathing exercises (often fast or unusual patterns)
**Warm-up (5-10 min):** Spinal warm-ups, gentle movements
**Kriya (20-30 min):** The main practice—specific sequence of movements, breath, and mantra targeting particular effect
**Relaxation (5-10 min):** Deep rest allowing energy to integrate
**Meditation (10-20 min):** Often includes mudra, mantra, and specific focus
**Closing (5 min):** Song or closing mantra, often "Sat Nam" (truth is my identity)

**What Makes It Different:**
Unlike flowing Vinyasa or static Hatha, Kundalini uses repetitive movements—sometimes holding arms up for 3 minutes while doing breath of fire, or repeatedly moving spine in specific patterns. This repetition creates powerful energetic effects but can feel strange initially.

**The Chanting:**
Kundalini uses specific mantras extensively—sometimes in ancient Gurmukhi language. You don't need to understand meaning; the sound vibrations create effects. Teachers provide translations. Many students initially feel self-conscious chanting but grow to love it. You can chant quietly until comfortable.

**White Clothing:**
Traditional Kundalini practitioners wear white and sometimes head coverings (turbans). This isn't mandatory—especially in Bali's casual environment—but some studios maintain this tradition. Wear whatever feels right; white is said to expand aura but isn't required for benefits.

**The Intensity:**
Kundalini can feel very intense. Students sometimes experience kriyas (spontaneous movements), strong emotions, altered states, or profound insights. This is normal and considered part of awakening. Teachers trained to hold space for intense experiences. That said, you always have agency—take breaks if needed.

**Not Your Typical Yoga:**
If you come expecting athletic workout or gentle stretching, Kundalini will surprise you. It's mystical, energetic, and sometimes weird. Embrace the strangeness! The benefits often appear in subtle shifts in consciousness, emotional clarity, and life circumstances rather than just physical fitness.`,
    forBeginners: {
      suitable: true,
      considerations: `Kundalini is actually quite beginner-friendly—no athletic ability or flexibility required. However, beginners should understand what they're getting into:

**Why It's Accessible:**
• No complex poses or physical strength needed
• Welcoming to all body types and ages
• Teachers guide you through everything
• Modifications always available
• Community is supportive and non-judgmental

**Why It Might Feel Uncomfortable:**
• Chanting can feel awkward initially
• Repetitive movements seem strange
• Energy experiences can be unfamiliar
• Spiritual language might be new
• Emotional release happens sometimes

**Perfect as First Yoga Style?**
If you're primarily interested in yoga's spiritual aspects (not fitness), yes! If you want athletic workout or physical practice, start with Vinyasa or Hatha first. Kundalini attracts different personality type than fitness-oriented yoga.

**First Class Tips:**
• Research the style beforehand (know what to expect)
• Wear comfortable clothes (white optional)
• Arrive early to talk with teacher
• Let teacher know you're new
• Don't judge the experience immediately—give it 3 classes
• Water before and after (not during—disrupts energy)
• Clear evening schedule (you might feel spaced out afterward)

**When to Skip Kundalini:**
• Active psychosis or severe mental health crisis
• Very recent (within 3 months) serious trauma (too activating)
• Pregnancy (some kriyas not appropriate—tell teacher)
• Seeking purely physical workout

**After Your First Class:**
You might feel energized, emotional, spacey, or profound. This is all normal. The practice works on subtle levels that manifest differently for everyone. Drink water, rest, journal if you feel called. The benefits often reveal themselves over time rather than immediately.`
    },
    popularIn: [
      'Ubud (spiritual community embraces Kundalini)',
      'Occasional classes in Canggu/Seminyak (less common)',
      'Retreat centers (often included in spiritual retreat programs)',
      'Relatively rare compared to other styles'
    ],
    relatedStyles: [
      'Tantra Yoga (similar energetic focus)',
      'Kriya Yoga (different tradition but similar energy work)',
      'Yoga Nidra (deep meditation, less dynamic)',
      'Breathwork/Pranayama Classes (Kundalini emphasizes breath heavily)'
    ],
    faqs: [
      {
        question: 'Is Kundalini yoga religious or spiritual?',
        answer: 'Kundalini is spiritual but not religious—you don\'t need to adopt any religious beliefs. It draws from Sikh and Hindu traditions (mantras in Gurmukhi and Sanskrit) but focuses on universal energy and consciousness, not religious doctrine. Many practitioners from various religions practice Kundalini, viewing it as complementary to their faith rather than conflicting. That said, it\'s more spiritually-oriented than purely physical yoga styles.'
      },
      {
        question: 'Is it safe to awaken kundalini energy?',
        answer: 'When practiced with qualified teacher and appropriate pace, yes. "Kundalini awakening" sounds dramatic but happens gradually in most cases. Sudden, overwhelming awakenings (sometimes called "kundalini crisis") are rare and usually result from unsupervised intensive practice or combining with drugs. In class setting with experienced teacher, the practice safely activates energy in manageable amounts. If you have history of trauma, psychosis, or severe anxiety, inform teacher—they can modify practice appropriately.'
      },
      {
        question: 'Do I have to chant? I feel self-conscious about it.',
        answer: 'Chanting is integral to Kundalini, but you can start quietly until comfortable. Many initially self-conscious students grow to love chanting—it creates powerful energetic effects and community bonding. The sounds don\'t require "good voice"—it\'s about vibration, not performance. That said, if chanting deeply bothers you, Kundalini might not be your style. The benefits and chanting are interconnected.'
      },
      {
        question: 'What is Breath of Fire and why does Kundalini use it so much?',
        answer: 'Breath of Fire (Kapalabhati) is rapid, rhythmic breathing through the nose with emphasis on exhale. It oxygenates blood, strengthens nervous system, generates heat, and moves energy. Kundalini uses it extensively because it\'s one of yoga\'s most powerful techniques for shifting consciousness. It takes practice to master—beginners often feel dizzy initially. Always learn proper technique from teacher rather than YouTube. Once mastered, it becomes one of practice\'s most valuable tools.'
      },
      {
        question: 'Can Kundalini yoga help with anxiety and depression?',
        answer: 'Many practitioners report significant help with anxiety and depression through Kundalini\'s breathwork and meditation components. Research supports yoga and breathwork for mental health. However, Kundalini can temporarily intensify emotions as it processes subconscious material—this is part of healing but can be challenging. If dealing with clinical anxiety or depression, work with qualified teacher aware of your condition, continue professional mental health treatment, and communicate if practice feels overwhelming. Kundalini complements therapy beautifully for many people.'
      },
      {
        question: 'How is Kundalini different from other yoga styles?',
        answer: 'Kundalini explicitly focuses on energy, consciousness, and spiritual transformation rather than physical fitness or flexibility. It uses powerful breathwork, repetitive movements, extensive chanting, and specific kriyas rather than flowing sequences or static poses. The practice is more mystical and inward-focused. If you want athletic workout or physical challenge, choose Vinyasa or Ashtanga. If you want spiritual transformation and energy work, Kundalini delivers powerfully.'
      }
    ]
  },

  'restorative-yoga': {
    slug: 'restorative-yoga',
    name: 'Restorative Yoga',
    displayName: 'Restorative Yoga',
    metaTitle: 'Restorative Yoga in Bali 2025 | Deeply Relaxing Classes',
    metaDescription: 'Find Restorative yoga studios in Bali. Deeply nurturing practice using props for complete support. Perfect for stress relief, healing, and nervous system regulation. Classes in Ubud and Sanur.',
    shortDescription: 'Ultra-gentle practice using extensive props to fully support the body. Deeply restorative for nervous system, perfect for stress relief and healing.',
    detailedDescription: `Restorative Yoga is the gentlest yoga style, using extensive props (bolsters, blankets, blocks) to fully support the body in comfortable positions held for 5-20 minutes. Unlike active practices, there's no stretching effort—you're completely relaxed, allowing the nervous system to shift into deep parasympathetic (rest-and-digest) state.

The practice was developed by B.K.S. Iyengar and further refined by Judith Lasater, who recognized yoga's potential for healing stress-related conditions. Each pose is carefully constructed with props to eliminate all effort, allowing complete surrender and deep rest.

In Bali, 15% of studios offer Restorative yoga, often in evening classes or combined with Yoga Nidra (guided meditation). The style has grown significantly since 2020 as pandemic stress increased demand for nervous system healing. Sanur and Ubud studios particularly embrace Restorative, recognizing its profound healing potential for modern stress-related conditions.`,
    keywords: [
      'restorative yoga bali',
      'gentle yoga',
      'relaxation yoga',
      'healing yoga',
      'stress relief yoga',
      'nervous system yoga'
    ],
    benefits: [
      'Profound nervous system regulation and healing',
      'Reduces cortisol and stress hormones',
      'Helps insomnia and sleep disorders',
      'Supports recovery from burnout or adrenal fatigue',
      'Healing for chronic stress, anxiety, PTSD',
      'Lowers blood pressure and heart rate',
      'Digestive system regulation',
      'Immune system support',
      'Gentle healing for chronic pain',
      'Teaches deep relaxation skills',
      'Perfect during menstruation or pregnancy',
      'Recovery support for intense training or illness'
    ],
    bestFor: [
      'People experiencing burnout or chronic stress',
      'Those dealing with anxiety, insomnia, or trauma',
      'Individuals recovering from injury or illness',
      'Pregnant women (with appropriate modifications)',
      'Athletes needing deep recovery',
      'Anyone experiencing physical or emotional exhaustion',
      'Those new to yoga who feel intimidated by active classes',
      'Mature students or those with mobility limitations',
      'Complementing intense yoga or fitness practices',
      'Anyone wanting to learn how to truly relax'
    ],
    typicalClass: {
      duration: '75-90 minutes (longer holds than other styles)',
      intensity: 'Minimal physical effort (focus is complete relaxation)',
      focus: [
        'Nervous system regulation',
        'Complete relaxation and letting go',
        'Healing and restoration',
        'Breath awareness',
        'Gentle opening without effort',
        'Meditation and mindfulness'
      ],
      temperature: 'Comfortable room temperature, often dimly lit with soft music or silence'
    },
    history: `Restorative Yoga emerged from B.K.S. Iyengar's therapeutic yoga work in India, where he used props to help injured and ill students practice safely. In the 1990s, American teacher Judith Lasater studied with Iyengar and developed Restorative Yoga as distinct style emphasizing parasympathetic activation rather than therapeutic poses for specific conditions.

The practice gained attention in the 2000s as stress-related health issues increased in Western countries. By 2010, most yoga studios offered at least one Restorative class weekly, recognizing that modern culture needs rest practices as much as active ones.

Restorative arrived in Bali in the mid-2000s and grew substantially after 2015, particularly as digital nomads and burned-out travelers sought healing from overactive lifestyles. The COVID-19 pandemic further accelerated Restorative's popularity as collective nervous systems needed regulation. Today, evening Restorative classes draw devoted followings—practitioners recognizing it as essential self-care in fast-paced world.`,
    whatToExpect: `**Class Structure:**
Restorative classes follow a calming, nurturing format:

**Opening (5-10 min):** Gentle arrival, breath awareness, intention-setting while already comfortable
**Restorative Poses (60-75 min):**
  - 4-6 poses total (fewer than other styles)
  - Each held 5-20 minutes
  - Extensive prop setup for complete support
  - Teacher guides you into position, adjusts props
  - Soft music or silence during holds
  - Teacher offers gentle reminders to relax
  - Often includes eye pillows, blankets for warmth
**Closing (5-10 min):** Gentle transition back to awareness, perhaps brief meditation

**The Setup:**
Setting up each pose takes 3-5 minutes. You'll use multiple props: 2-3 bolsters, 4-6 blankets, several blocks, eye pillow, sometimes sand bags. The teacher shows you how to arrange them, then helps adjust for your body. This careful setup is crucial—it allows complete relaxation impossible without proper support.

**The Experience:**
Once in position, you do absolutely nothing. No stretching, no holding, no effort. You're completely supported. The first few minutes, your mind often races ("this feels weird," "I should be doing something," "I'm bored"). This is normal! Modern minds resist doing nothing. Around minute 5, you start to actually relax. By minute 10-15, you're in deep parasympathetic state—the healing happens here.

**Common Sensations:**
• Initial resistance or boredom
• Feeling "too relaxed" (unfamiliar for busy people)
• Emotional release (tears, laughter)
• Deep peace and letting go
• Sometimes sleep (that's okay!)
• Afterward: profound rest, sometimes spacey feeling

**Temperature:**
Studios keep rooms warm (Restorative doesn't generate body heat). Bring socks, wear layers. Teachers often provide extra blankets. Being too cold prevents relaxation.

**Comparison to Napping:**
Restorative isn't napping (though you might doze). The specific positioning opens body gently while you're relaxed, creating healing impossible in sleep. The practice teaches conscious relaxation—different from unconscious sleep. Both are valuable; Restorative uniquely restores while maintaining gentle awareness.`,
    forBeginners: {
      suitable: true,
      considerations: `Restorative is exceptionally beginner-friendly—arguably the most accessible yoga style:

**Why It's Perfect for Beginners:**
• Zero strength or flexibility required
• No confusing sequences to learn
• No fear of doing poses wrong
• Completely supported and safe
• Can't injure yourself (nothing is strenuous)
• Teacher sets up everything
• Accessible to any age, size, or fitness level

**Actually, It's Perfect for EVERYONE:**
You don't need to be stressed, injured, or unfit to benefit from Restorative. Elite athletes, healthy people, and experienced yogis all benefit from nervous system regulation. Many practitioners combine active yoga with weekly Restorative—the balance is powerful.

**Potential "Challenges" for Beginners:**
• Surrendering control feels unfamiliar
• Doing "nothing" triggers productivity guilt
• Some people get bored (modern minds want stimulation)
• Might fall asleep (that's actually okay!)
• Could feel "too" relaxed (this improves with practice)

**First Class Tips:**
• Eat light meal 2+ hours before (lying down on full stomach uncomfortable)
• Arrive 10 minutes early for proper setup time
• Wear warm, comfortable layers (you'll be still for long time)
• Tell teacher if you're new—they'll help with props
• Give yourself permission to do nothing
• Clear your evening schedule (you'll want quiet afterward)
• Don't judge the practice on first class—try 2-3 times

**If You Hate It:**
Some personality types (Type A, highly athletic, those who equate movement with value) initially resist Restorative. If you hate your first class, examine WHY. Often, the resistance reveals exactly why you need it—you've lost ability to rest. That said, not every style suits everyone. If you genuinely prefer active practice, that's valid too.

**Building Practice:**
Many people use Restorative as weekly balance to active yoga:
• 3x Vinyasa or Hatha + 1x Restorative weekly (balanced)
• Daily active practice + weekly Restorative (sustainable)
• Restorative only during menstruation, recovery, high stress
• Monthly "Restorative Day" for deep rest

Some practice only Restorative for healing periods. All approaches are valid.`
    },
    popularIn: [
      'Sanur (gentle, healing-focused community)',
      'Ubud (often combined with sound healing or energy work)',
      'All locations (increasingly recognized as essential self-care)'
    ],
    relatedStyles: [
      'Yin Yoga (passive but includes stretch; Restorative is pure rest)',
      'Yoga Nidra (lying meditation, no poses)',
      'Gentle Hatha (slow but more active than Restorative)',
      'Therapeutic Yoga (similar healing focus, more targeted)'
    ],
    faqs: [
      {
        question: 'What is the difference between Restorative and Yin yoga?',
        answer: 'Both are slow and gentle, but the key difference: Restorative uses extensive props to completely support you with no stretch sensation (pure rest), while Yin uses fewer props to create gentle stretch in connective tissue. Restorative activates parasympathetic (rest/digest) response through total comfort; Yin stretches deep tissues through sustained gentle tension. Choose Restorative when you need pure rest; choose Yin when you want flexibility work without intensity.'
      },
      {
        question: 'Can Restorative yoga really help with serious stress or trauma?',
        answer: 'Yes—Restorative is one of yoga\'s most powerful tools for nervous system healing. Research shows it reduces cortisol, regulates heart rate variability, and shifts autonomic nervous system from sympathetic (stress) to parasympathetic (rest). For trauma, the practice helps nervous system learn safety again—crucial for healing. Many trauma therapists recommend Restorative. However, if you have complex trauma, work with trauma-informed yoga teacher and continue professional mental health support. Restorative complements therapy, doesn\'t replace it.'
      },
      {
        question: 'Is Restorative yoga "real" yoga or just relaxation?',
        answer: 'Restorative is absolutely real yoga—perhaps the most yoga-aligned practice available! Traditional yoga aims to quiet the mind and integrate body-mind-spirit. Restorative achieves this powerfully through conscious relaxation. The modern notion that "real" yoga must be athletic is cultural misunderstanding. Ancient yogis would consider Restorative extremely advanced—most people can\'t truly relax! The stillness and surrender in Restorative require significant skill.'
      },
      {
        question: 'Will I fall asleep in Restorative yoga?',
        answer: 'You might, especially if you\'re sleep-deprived, and that\'s okay! Teachers understand. The goal is conscious relaxation (awake but deeply restful state), different from sleep. With practice, you\'ll develop ability to rest deeply while maintaining gentle awareness—this is the skill Restorative teaches. If you consistently fall asleep, examine your sleep habits—your body might be communicating a need for more rest generally.'
      },
      {
        question: 'Can I do Restorative yoga during pregnancy?',
        answer: 'Yes—Restorative is excellent during pregnancy with appropriate modifications! The complete support and stress reduction benefit both mother and baby. Important: Tell teacher you\'re pregnant before class. They\'ll modify poses to avoid lying flat on back (after first trimester) and ensure all positioning is pregnancy-safe. Many studios offer prenatal Restorative classes specifically designed for pregnant women\'s needs.'
      },
      {
        question: 'How often should I practice Restorative yoga?',
        answer: 'This depends on your needs and lifestyle. Guidelines: For burnout or high stress: 2-3x weekly. For balance to active practice: 1x weekly. During menstruation or recovery: Daily is fine. For general self-care: 1-2x monthly minimum. Unlike active styles where daily practice might be too much, Restorative can be done daily without overworking your system—it\'s pure rest and restoration. Listen to your body and life circumstances.'
      }
    ]
  }
}

/**
 * Get yoga style by slug
 */
export function getYogaStyleBySlug(slug: string): YogaStyleData | null {
  return YOGA_STYLES[slug as YogaStyleSlug] || null
}

/**
 * Get all yoga styles
 */
export function getAllYogaStyles(): YogaStyleData[] {
  return Object.values(YOGA_STYLES)
}

/**
 * Get related styles
 */
export function getRelatedYogaStyles(currentSlug: string): YogaStyleData[] {
  const currentStyle = getYogaStyleBySlug(currentSlug)
  if (!currentStyle) return []

  return currentStyle.relatedStyles
    .map(styleName => {
      // Convert style names to slugs
      const slug = styleName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      return getYogaStyleBySlug(slug)
    })
    .filter((style): style is YogaStyleData => style !== null)
}
