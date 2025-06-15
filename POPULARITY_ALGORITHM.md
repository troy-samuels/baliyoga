# Popularity-Based Ranking Algorithm

## Overview

The Bali Yoga directory now features a sophisticated popularity-based ranking algorithm that prioritizes listings based on how often they're added to users' wishlists. This creates a dynamic, user-driven ranking system where the most desired studios and retreats naturally rise to the top.

## How It Works

### 1. Wishlist Tracking
- Every time a user adds a studio or retreat to their wishlist, the popularity score for that item increases by 1
- When a user removes an item from their wishlist, the popularity score decreases by 1
- Scores are stored in localStorage for immediate client-side access

### 2. Ranking Algorithm
The algorithm combines popularity with existing ratings using this formula:

```
Combined Score = Rating + Popularity Boost
Popularity Boost = log(wishlist_count + 1) * 0.1
```

**Why logarithmic scaling?**
- Prevents extremely popular items from completely dominating results
- Provides diminishing returns for additional wishlist additions
- Maintains balance between popularity and quality (ratings)

### 3. Sorting Priority
Items are sorted by:
1. **Combined Score** (rating + popularity boost) - Primary
2. **Pure Popularity Count** - Secondary (if combined scores are very close)
3. **Rating** - Tertiary
4. **Name (A-Z)** - Final tiebreaker

## Visual Indicators

### Popularity Badges
Items display colored badges based on their wishlist count:

- 🔥 **Very Popular** (20+ wishlists) - Red badge with pulse animation
- 📈 **Popular** (10-19 wishlists) - Orange badge
- ⭐ **Trending** (5-9 wishlists) - Yellow badge
- ✨ **Rising** (3-4 wishlists) - Green badge

### Page Headers
Both Studios and Retreats pages display "Sorted by popularity and rating" to inform users about the ranking system.

## Implementation Details

### Client-Side Components
- **`PopularitySortedGrid`**: Handles client-side sorting and display
- **`PopularityBadge`**: Shows visual popularity indicators
- **`PopularityDemo`**: Interactive demo for testing the algorithm

### Utility Functions
- **`lib/popularity-utils.ts`**: Core popularity tracking and sorting logic
- **`contexts/wishlist-context.tsx`**: Updated to track popularity changes

### Data Storage
- **Current**: localStorage for immediate client-side functionality
- **Future**: Supabase `popularity_scores` table for persistent, server-side tracking

## Database Schema (Future Implementation)

```sql
-- Popularity tracking table
CREATE TABLE popularity_scores (
    id UUID PRIMARY KEY,
    item_id TEXT UNIQUE NOT NULL,
    item_type TEXT CHECK (item_type IN ('studio', 'retreat')),
    wishlist_count INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Functions for atomic updates
CREATE FUNCTION increment_popularity_score(item_id, item_type);
CREATE FUNCTION decrement_popularity_score(item_id);
```

## Benefits

### For Users
- **Discover Popular Choices**: See what other users love most
- **Quality Assurance**: Popular items are often high-quality
- **Social Proof**: Wishlist counts provide social validation
- **Dynamic Results**: Rankings update based on real user behavior

### For Business Owners
- **Organic Promotion**: Quality listings naturally gain visibility
- **User Engagement**: Encourages users to interact with listings
- **Fair Competition**: Algorithm balances popularity with ratings
- **Performance Insights**: Track which listings resonate with users

## Testing the Algorithm

Use the **Popularity Demo** component (bottom-right corner on Studios/Retreats pages) to:
1. Click heart buttons to simulate wishlist additions
2. Observe how scores affect ranking
3. Understand the algorithm's behavior

## Technical Considerations

### Performance
- Client-side sorting prevents server load
- localStorage provides instant updates
- Lazy loading maintains page speed

### Scalability
- Ready for Supabase integration
- Atomic database operations prevent race conditions
- Indexed queries for fast retrieval

### User Experience
- Seamless integration with existing wishlist feature
- Visual feedback through badges and animations
- No disruption to current functionality

## Future Enhancements

1. **Time-based Decay**: Reduce influence of old wishlist additions
2. **Category-specific Ranking**: Separate popularity scores by yoga style
3. **Geographic Weighting**: Boost items popular in user's location
4. **Seasonal Adjustments**: Account for retreat seasonality
5. **A/B Testing**: Compare algorithm variations

## Monitoring & Analytics

Track these metrics to optimize the algorithm:
- Wishlist addition/removal rates
- Click-through rates on popular items
- User engagement with ranked results
- Conversion rates for top-ranked listings

---

*The popularity algorithm creates a self-improving directory where user preferences directly influence search results, leading to better discovery and higher user satisfaction.* 