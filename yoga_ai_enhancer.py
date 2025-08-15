"""
BALI YOGA STUDIOS & RETREATS AI ENHANCEMENT SCRIPT
==================================================
This script uses OpenAI GPT to enhance existing yoga business data by:
1. Analyzing completeness of current data
2. Using AI to extract missing information
3. Improving data quality and consistency
4. Processing in cost-controlled batches

Author: AI Assistant
For: Bali Yoga Studios & Retreats Project
Date: August 2025
"""

import json
import os
import time
import argparse
from pathlib import Path
from datetime import datetime
import sys

try:
    from dotenv import load_dotenv
    # Try to load .env.local first, then .env as fallback
    load_dotenv('.env.local')
    load_dotenv('.env')
except ImportError:
    print("❌ Error: python-dotenv not installed. Run: pip install python-dotenv")
    sys.exit(1)

try:
    import openai
except ImportError:
    print("❌ Error: openai not installed. Run: pip install openai")
    sys.exit(1)

MODEL_NAME = "gpt-4o-mini"  # Can be changed to other models as needed

class YogaBusinessAIEnhancer:
    def __init__(self, max_cost=30.0, batch_size=50):
        """
        Initialize the AI enhancer
        
        Args:
            max_cost (float): Maximum cost in USD to spend
            batch_size (int): Number of businesses to process per batch
        """
        self.max_cost = max_cost
        self.batch_size = batch_size
        self.current_cost = 0.0
        self.base_folder = Path(__file__).parent
        
        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("❌ Error: OPENAI_API_KEY not found in environment variables or .env file")
            print("Please set your OpenAI API key before running this script")
            sys.exit(1)
            
        self.client = openai.OpenAI(api_key=api_key)
        
        # Statistics tracking
        self.stats = {
            'total_processed': 0,
            'successfully_enhanced': 0,
            'yoga_styles_added': 0,
            'amenities_added': 0,
            'languages_added': 0,
            'descriptions_enhanced': 0,
            'emails_added': 0,
            'websites_added': 0,
            'opening_hours_added': 0,
            'phone_numbers_added': 0,
            'failed_enhancements': 0
        }
        
        # Cost tracking (approximate)
        self.cost_per_1k_tokens = {
            'gpt-4o-mini': {'input': 0.00015, 'output': 0.0006}
        }

    def load_existing_data(self, input_file=None):
        """Load the existing yoga business data"""
        if not input_file:
            input_file = self.base_folder / "yoga_businesses_enriched_full.json"
        
        if not input_file.exists():
            print(f"❌ Error: {input_file} not found!")
            return None
        
        try:
            with open(input_file, 'r', encoding='utf-8') as file:
                data = json.load(file)
            
            businesses = data.get('businesses', [])
            print(f"✅ Loaded {len(businesses)} yoga businesses from existing data")
            return businesses
            
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return None

    def calculate_completeness_score(self, business):
        """
        Calculate how complete a yoga business's data is (0-100)
        
        Args:
            business (dict): Business data
            
        Returns:
            int: Completeness score out of 100
        """
        score = 0
        
        # Essential information (50 points total)
        # Website score (15 points)
        if business.get('website'):
            score += 15
        
        # Opening hours score (15 points)
        opening_hours = business.get('opening_hours', '')
        if opening_hours and opening_hours != '[]':
            score += 15
        
        # Phone number score (10 points)
        if business.get('phone_number'):
            score += 10
            
        # Review score (10 points)
        if business.get('review_score') is not None:
            score += 10
            
        # Enhanced information (50 points total)
        # Yoga styles score (15 points)
        yoga_styles = business.get('yoga_styles', []) or []
        if isinstance(yoga_styles, str):
            try:
                yoga_styles = json.loads(yoga_styles)
            except:
                yoga_styles = []
                
        if len(yoga_styles) >= 3:
            score += 15
        elif len(yoga_styles) >= 1:
            score += 10
        
        # Business description score (15 points)
        description = business.get('business_description', '') or ''
        if len(description) > 150:
            score += 15
        elif len(description) > 75:
            score += 10
        elif len(description) > 25:
            score += 5
        
        # Amenities score (10 points)
        amenities = business.get('amenities', []) or []
        if isinstance(amenities, str):
            try:
                amenities = json.loads(amenities)
            except:
                amenities = []
                
        if len(amenities) >= 3:
            score += 10
        elif len(amenities) >= 1:
            score += 5
        
        # Languages score (5 points)
        languages = business.get('languages_spoken', []) or []
        if isinstance(languages, str):
            try:
                languages = json.loads(languages)
            except:
                languages = []
                
        if len(languages) >= 1:
            score += 5
        
        # Social media score (5 points)
        has_instagram = bool(business.get('instagram_url'))
        has_facebook = bool(business.get('facebook_url'))
        if has_instagram and has_facebook:
            score += 5
        elif has_instagram or has_facebook:
            score += 3
        
        return min(score, 100)

    def needs_enhancement(self, business, threshold=70):
        """
        Determine if a yoga business needs AI enhancement
        
        Args:
            business (dict): Business data
            threshold (int): Minimum completeness score to skip enhancement
            
        Returns:
            bool: True if needs enhancement
        """
        score = self.calculate_completeness_score(business)
        return score < threshold

    def create_enhancement_prompt(self, business):
        """
        Create an AI prompt for enhancing yoga business data
        
        Args:
            business (dict): Business data
            
        Returns:
            str: Formatted prompt for AI
        """
        
        # Gather existing data
        name = business.get('name', 'Unknown Business')
        category = business.get('category_name', 'Yoga studio')
        address = business.get('address', '')
        city = business.get('city', '')
        website = business.get('website', '')
        
        # Handle potential JSON strings
        yoga_styles = business.get('yoga_styles', [])
        if isinstance(yoga_styles, str):
            try:
                yoga_styles = json.loads(yoga_styles)
            except:
                yoga_styles = []
                
        amenities = business.get('amenities', [])
        if isinstance(amenities, str):
            try:
                amenities = json.loads(amenities)
            except:
                amenities = []
                
        languages = business.get('languages_spoken', [])
        if isinstance(languages, str):
            try:
                languages = json.loads(languages)
            except:
                languages = []
        
        opening_hours = business.get('opening_hours', '')
        description = business.get('business_description', '')
        phone = business.get('phone_number', '')
        email = business.get('email_address', '')
        instagram = business.get('instagram_url', '')
        facebook = business.get('facebook_url', '')
        
        prompt = f"""
You are analyzing a yoga business in Bali to extract and enhance information.

BUSINESS DETAILS:
- Name: {name}
- Category: {category}
- Location: {address}, {city}, Bali
- Website: {website}
- Current Description: {description}
- Current Yoga Styles: {yoga_styles}
- Current Amenities: {amenities}
- Current Languages: {languages}
- Current Opening Hours: {opening_hours}
- Current Phone: {phone}
- Current Email: {email}
- Instagram: {instagram}
- Facebook: {facebook}

TASK: Enhance and expand this yoga business's information. Use the existing data as context but improve and add to it.

Please return ONLY valid JSON in this exact format:
{{
    "enhanced_yoga_styles": ["list of yoga styles offered, e.g., Hatha, Vinyasa, Yin, etc."],
    "enhanced_amenities": ["specific amenities offered, e.g., mats, showers, pool, etc."],
    "enhanced_languages": ["languages spoken by instructors, e.g., English, Indonesian, etc."],
    "enhanced_description": "professional 1-2 sentence business description",
    "enhanced_opening_hours": [{{"day": "Monday", "hours": "7 AM to 7 PM"}}, ...] or null if unknown,
    "enhanced_phone_number": "phone number in international format",
    "enhanced_website": "website URL or null if unknown",
    "enhanced_email": "email address or null if unknown",
    "meditation_offered": true/false,
    "teacher_training": true/false,
    "drop_in_price_usd": 15 (approximate drop-in class price in USD or null),
    "price_range": "budget/mid-range/luxury",
    "confidence_score": 85
}}

RULES:
1. For yoga styles: Be specific (not just "yoga" but actual styles taught)
2. For amenities: Include physical facilities and services
3. For languages: Focus on languages used for instruction
4. For description: Create a professional, accurate description
5. Only include information you're confident about
6. If no additional info can be inferred, return null or empty arrays
7. Confidence score: 0-100 based on how certain you are about the enhancements
8. For opening hours: Use the format shown above with day and hours
9. For price: Estimate based on location and amenities if unknown

CONTEXT ABOUT BALI YOGA SCENE:
- Ubud is known as Bali's yoga hub with many studios and retreats
- Canggu and Seminyak are popular beach areas with yoga studios
- Many studios offer teacher training programs
- Common amenities include mats, props, showers, and cafes
- Typical drop-in prices range from $8-20 USD
- Many studios offer both group and private classes
"""
        
        return prompt

    def ai_enhance_single_business(self, business):
        """
        Use AI to enhance a single yoga business's data
        
        Args:
            business (dict): Business data to enhance
            
        Returns:
            dict: Enhanced business data or None if failed
        """
        try:
            prompt = self.create_enhancement_prompt(business)
            
            response = self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": "You are an expert at extracting and enhancing yoga business information in Bali. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            # Estimate cost
            input_tokens = len(prompt) // 4  # Rough estimate
            output_tokens = len(response.choices[0].message.content) // 4
            cost = (input_tokens * self.cost_per_1k_tokens[MODEL_NAME]['input'] / 1000 + 
                   output_tokens * self.cost_per_1k_tokens[MODEL_NAME]['output'] / 1000)
            self.current_cost += cost
            
            # Parse AI response
            ai_data = json.loads(response.choices[0].message.content)
            
            # Merge with existing business data
            enhanced_business = business.copy()
            
            # Update yoga styles
            ai_yoga_styles = ai_data.get('enhanced_yoga_styles', [])
            if ai_yoga_styles and len(ai_yoga_styles) > 0:
                enhanced_business['yoga_styles'] = ai_yoga_styles
                self.stats['yoga_styles_added'] += 1
            
            # Update amenities
            ai_amenities = ai_data.get('enhanced_amenities', [])
            if ai_amenities and len(ai_amenities) > 0:
                enhanced_business['amenities'] = ai_amenities
                self.stats['amenities_added'] += 1
            
            # Update languages
            ai_languages = ai_data.get('enhanced_languages', [])
            if ai_languages and len(ai_languages) > 0:
                enhanced_business['languages_spoken'] = ai_languages
                self.stats['languages_added'] += 1
            
            # Update description
            ai_description = ai_data.get('enhanced_description', '')
            if ai_description and len(ai_description) > len(str(business.get('business_description', ''))):
                enhanced_business['business_description'] = ai_description
                self.stats['descriptions_enhanced'] += 1
            
            # Update opening hours
            ai_opening_hours = ai_data.get('enhanced_opening_hours')
            if ai_opening_hours and (not business.get('opening_hours') or business.get('opening_hours') == '[]'):
                enhanced_business['opening_hours'] = json.dumps(ai_opening_hours)
                self.stats['opening_hours_added'] += 1
            
            # Update phone number
            ai_phone = ai_data.get('enhanced_phone_number')
            if ai_phone and not business.get('phone_number'):
                enhanced_business['phone_number'] = ai_phone
                self.stats['phone_numbers_added'] += 1
            
            # Update website
            ai_website = ai_data.get('enhanced_website')
            if ai_website and not business.get('website'):
                enhanced_business['website'] = ai_website
                self.stats['websites_added'] += 1
            
            # Update email
            ai_email = ai_data.get('enhanced_email')
            if ai_email and not business.get('email_address'):
                enhanced_business['email_address'] = ai_email
                self.stats['emails_added'] += 1
            
            # Update boolean fields
            enhanced_business['meditation_offered'] = ai_data.get('meditation_offered', business.get('meditation_offered', False))
            enhanced_business['teacher_training'] = ai_data.get('teacher_training', business.get('teacher_training', False))
            
            # Update pricing information
            if ai_data.get('drop_in_price_usd') is not None:
                enhanced_business['drop_in_price_usd'] = ai_data.get('drop_in_price_usd')
            
            if ai_data.get('price_range'):
                enhanced_business['price_range'] = ai_data.get('price_range')
            
            # Add AI enhancement metadata
            enhanced_business['ai_enhancement_confidence'] = ai_data.get('confidence_score', 0)
            enhanced_business['ai_enhanced'] = True
            enhanced_business['ai_enhancement_timestamp'] = datetime.now().isoformat()
            
            return enhanced_business
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error for {business.get('name', 'Unknown')}: {e}")
            return None
        except Exception as e:
            print(f"❌ AI enhancement error for {business.get('name', 'Unknown')}: {e}")
            return None

    def analyze_data_completeness(self, businesses):
        """
        Analyze the completeness of existing yoga business data
        
        Args:
            businesses (list): List of business data
            
        Returns:
            dict: Analysis results
        """
        print("\n🔍 ANALYZING YOGA BUSINESS DATA COMPLETENESS...")
        print("=" * 60)
        
        total_businesses = len(businesses)
        needs_enhancement = []
        completeness_scores = []
        
        # Analyze each business
        for business in businesses:
            score = self.calculate_completeness_score(business)
            completeness_scores.append(score)
            
            if self.needs_enhancement(business):
                needs_enhancement.append(business)
        
        # Calculate statistics
        avg_completeness = sum(completeness_scores) / len(completeness_scores) if completeness_scores else 0
        businesses_with_websites = len([b for b in businesses if b.get('website')])
        businesses_with_opening_hours = len([b for b in businesses if b.get('opening_hours') and b.get('opening_hours') != '[]'])
        businesses_with_yoga_styles = len([b for b in businesses if b.get('yoga_styles') and b.get('yoga_styles') != '[]'])
        businesses_with_descriptions = len([b for b in businesses if b.get('business_description')])
        businesses_with_phone = len([b for b in businesses if b.get('phone_number')])
        
        # Estimate costs
        estimated_cost_min = len(needs_enhancement) * 0.01
        estimated_cost_max = len(needs_enhancement) * 0.025
        
        analysis = {
            'total_businesses': total_businesses,
            'average_completeness': avg_completeness,
            'businesses_needing_enhancement': len(needs_enhancement),
            'current_stats': {
                'with_websites': businesses_with_websites,
                'with_opening_hours': businesses_with_opening_hours,
                'with_yoga_styles': businesses_with_yoga_styles,
                'with_descriptions': businesses_with_descriptions,
                'with_phone': businesses_with_phone
            },
            'estimated_cost_range': (estimated_cost_min, estimated_cost_max),
            'businesses_to_enhance': needs_enhancement
        }
        
        # Print analysis
        print(f"📊 Total yoga businesses: {total_businesses}")
        print(f"📈 Average completeness: {avg_completeness:.1f}%")
        print(f"🎯 Businesses needing enhancement: {len(needs_enhancement)} ({len(needs_enhancement)/total_businesses*100:.1f}%)")
        print(f"\n📋 CURRENT DATA QUALITY:")
        print(f"   Businesses with websites: {businesses_with_websites} ({businesses_with_websites/total_businesses*100:.1f}%)")
        print(f"   Businesses with opening hours: {businesses_with_opening_hours} ({businesses_with_opening_hours/total_businesses*100:.1f}%)")
        print(f"   Businesses with yoga styles: {businesses_with_yoga_styles} ({businesses_with_yoga_styles/total_businesses*100:.1f}%)")
        print(f"   Businesses with descriptions: {businesses_with_descriptions} ({businesses_with_descriptions/total_businesses*100:.1f}%)")
        print(f"   Businesses with phone numbers: {businesses_with_phone} ({businesses_with_phone/total_businesses*100:.1f}%)")
        print(f"\n💰 ESTIMATED COSTS:")
        print(f"   Minimum: ${estimated_cost_min:.2f}")
        print(f"   Maximum: ${estimated_cost_max:.2f}")
        print(f"   Your limit: ${self.max_cost:.2f}")
        
        return analysis

    def process_batch(self, batch_businesses, batch_number, total_batches):
        """
        Process a batch of yoga businesses with AI enhancement
        
        Args:
            batch_businesses (list): Businesses to process
            batch_number (int): Current batch number
            total_batches (int): Total number of batches
            
        Returns:
            list: Enhanced businesses
        """
        print(f"\n🔄 Processing Batch {batch_number}/{total_batches} ({len(batch_businesses)} businesses)")
        print(f"💰 Current cost: ${self.current_cost:.2f} / ${self.max_cost:.2f}")
        
        enhanced_batch = []
        batch_start_cost = self.current_cost
        
        for i, business in enumerate(batch_businesses, 1):
            business_name = business.get('name', 'Unknown')
            print(f"[{i}/{len(batch_businesses)}] Enhancing: {business_name}")
            
            # Check cost limit
            if self.current_cost >= self.max_cost:
                print(f"💰 Cost limit reached (${self.max_cost:.2f}). Stopping.")
                break
            
            # AI enhancement
            enhanced = self.ai_enhance_single_business(business)
            
            if enhanced:
                enhanced_batch.append(enhanced)
                self.stats['successfully_enhanced'] += 1
                print(f"   ✅ Enhanced successfully")
            else:
                enhanced_batch.append(business)  # Keep original if enhancement failed
                self.stats['failed_enhancements'] += 1
                print(f"   ❌ Enhancement failed, keeping original")
            
            self.stats['total_processed'] += 1
            
            # Small delay to avoid rate limits
            time.sleep(0.5)
        
        batch_cost = self.current_cost - batch_start_cost
        print(f"💰 Batch cost: ${batch_cost:.2f}")
        
        return enhanced_batch

    def enhance_yoga_businesses(self, input_file=None, output_file=None):
        """
        Main function to enhance yoga businesses data
        
        Args:
            input_file (str): Path to input JSON file
            output_file (str): Path to output JSON file
        """
        print("\n🧘‍♀️ BALI YOGA BUSINESSES AI ENHANCEMENT 🧘‍♂️")
        print("=" * 60)
        
        # Set default file paths if not provided
        if input_file:
            input_path = Path(input_file)
        else:
            input_path = self.base_folder / "yoga_businesses_enriched_full.json"
            
        if output_file:
            output_path = Path(output_file)
        else:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_path = self.base_folder / f"yoga_businesses_enhanced_{timestamp}.json"
        
        # Load data
        businesses = self.load_existing_data(input_path)
        if not businesses:
            return
        
        # Analyze data completeness
        analysis = self.analyze_data_completeness(businesses)
        businesses_to_enhance = analysis['businesses_to_enhance']
        
        if not businesses_to_enhance:
            print("\n✅ All businesses have sufficient data quality. No enhancement needed!")
            return
        
        # Confirm with user
        print(f"\n🚀 Ready to enhance {len(businesses_to_enhance)} businesses")
        proceed = input(f"Proceed with enhancement? Estimated cost: ${analysis['estimated_cost_range'][0]:.2f}-${analysis['estimated_cost_range'][1]:.2f} [y/N]: ")
        
        if proceed.lower() != 'y':
            print("Enhancement cancelled by user.")
            return
        
        # Process in batches
        enhanced_businesses = []
        businesses_not_enhanced = []
        
        # Identify businesses that don't need enhancement
        for business in businesses:
            if not self.needs_enhancement(business):
                businesses_not_enhanced.append(business)
        
        # Process businesses that need enhancement in batches
        total_batches = (len(businesses_to_enhance) + self.batch_size - 1) // self.batch_size
        
        for batch_num in range(total_batches):
            start_idx = batch_num * self.batch_size
            end_idx = min(start_idx + self.batch_size, len(businesses_to_enhance))
            batch = businesses_to_enhance[start_idx:end_idx]
            
            enhanced_batch = self.process_batch(batch, batch_num + 1, total_batches)
            enhanced_businesses.extend(enhanced_batch)
            
            # Check if cost limit reached
            if self.current_cost >= self.max_cost:
                remaining = businesses_to_enhance[end_idx:]
                businesses_not_enhanced.extend(remaining)
                print(f"💰 Cost limit reached. {len(remaining)} businesses not processed.")
                break
        
        # Combine enhanced and non-enhanced businesses
        all_businesses = enhanced_businesses + businesses_not_enhanced
        
        # Create output JSON
        output_data = {
            "metadata": {
                "total_businesses": len(all_businesses),
                "generation_date": datetime.now().strftime("%Y-%m-%d"),
                "source": "Bali Yoga Studios & Retreats AI Enhancement",
                "description": "AI-enhanced dataset of yoga studios and retreat centers in Bali",
                "columns": len(all_businesses[0].keys()) if all_businesses else 0,
                "enhancement_stats": self.stats
            },
            "businesses": all_businesses
        }
        
        # Save output
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            print(f"\n✅ Enhanced data saved to {output_path}")
        except Exception as e:
            print(f"❌ Error saving output: {e}")
        
        # Print final stats
        print("\n📊 ENHANCEMENT STATISTICS:")
        print(f"   Total businesses processed: {self.stats['total_processed']}")
        print(f"   Successfully enhanced: {self.stats['successfully_enhanced']}")
        print(f"   Failed enhancements: {self.stats['failed_enhancements']}")
        print(f"   Yoga styles added/improved: {self.stats['yoga_styles_added']}")
        print(f"   Amenities added/improved: {self.stats['amenities_added']}")
        print(f"   Languages added/improved: {self.stats['languages_added']}")
        print(f"   Descriptions enhanced: {self.stats['descriptions_enhanced']}")
        print(f"   Websites added: {self.stats['websites_added']}")
        print(f"   Opening hours added: {self.stats['opening_hours_added']}")
        print(f"   Phone numbers added: {self.stats['phone_numbers_added']}")
        print(f"   Emails added: {self.stats['emails_added']}")
        print(f"💰 Total cost: ${self.current_cost:.2f}")


def main():
    parser = argparse.ArgumentParser(description="Enhance Bali yoga business data using AI")
    parser.add_argument("--input", "-i", help="Path to input JSON file")
    parser.add_argument("--output", "-o", help="Path to output JSON file")
    parser.add_argument("--max-cost", "-c", type=float, default=30.0, help="Maximum cost in USD (default: 30.0)")
    parser.add_argument("--batch-size", "-b", type=int, default=50, help="Batch size (default: 50)")
    parser.add_argument("--analyze-only", "-a", action="store_true", help="Only analyze data, don't enhance")
    
    args = parser.parse_args()
    
    enhancer = YogaBusinessAIEnhancer(max_cost=args.max_cost, batch_size=args.batch_size)
    
    if args.analyze_only:
        businesses = enhancer.load_existing_data(args.input if args.input else None)
        if businesses:
            enhancer.analyze_data_completeness(businesses)
    else:
        enhancer.enhance_yoga_businesses(args.input, args.output)


if __name__ == "__main__":
    main()