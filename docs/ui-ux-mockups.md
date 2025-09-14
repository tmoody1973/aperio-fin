# Aperio.fin UI/UX Design Mockups

## Design Philosophy

**Visual Identity**: Premium financial journalism meets accessible audio-first design
**Inspiration**: Financial Times typography + NPR Marketplace warmth + Spotify audio UX
**Core Principle**: Progressive sophistication that scales with user expertise

---

## Design System

### Color Palette

```
Primary Colors:
- Aperio Blue: #1E40AF (trust, professionalism)
- Deep Navy: #1E293B (premium journalism feel)
- Accent Gold: #F59E0B (highlights, achievements)

Neutral Grays:
- Text Primary: #0F172A
- Text Secondary: #64748B
- Background Light: #F8FAFC
- Border Light: #E2E8F0

Semantic Colors:
- Success Green: #10B981 (gains, positive trends)
- Warning Red: #EF4444 (losses, alerts)
- Info Blue: #3B82F6 (neutral information)
```

### Typography Hierarchy

```
Primary Font: "Inter" (clean, readable)
Secondary Font: "Crimson Text" (editorial elegance)

H1 - Platform Title: 32px, Bold, Crimson Text
H2 - Section Headers: 24px, Semibold, Inter
H3 - Content Titles: 20px, Medium, Inter
H4 - Subsections: 18px, Medium, Inter
Body - Content: 16px, Regular, Inter
Caption - Metadata: 14px, Regular, Inter
```

### Component Library

**Buttons:**
```
Primary: Blue background, white text, rounded corners
Secondary: White background, blue border, blue text
Ghost: Transparent background, blue text
Audio Controls: Circular, with intuitive play/pause icons
```

**Cards:**
```
Episode Cards: White background, subtle shadow, rounded corners
Content Previews: Minimal border, hover effects
Premium Features: Gradient border, gold accents
```

---

## Screen Mockups

### 1. Onboarding Flow - Welcome Screen

```
┌─────────────────────────────────────────────────────┐
│                    [Status Bar]                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│                 📊  📈  📰                         │
│                                                     │
│              **APERIO.FIN**                        │
│           [Crimson Text, 32px]                     │
│                                                     │
│         AI-Powered Financial                        │
│            Journalism                               │
│        [Inter, 20px, Secondary]                    │
│                                                     │
│    "Transform raw market data into                  │
│     compelling stories you'll                       │
│         actually understand"                        │
│     [Inter, 16px, centered, gray]                  │
│                                                     │
│                                                     │
│    ┌─────────────────────────────────┐            │
│    │     Get Started  →             │            │
│    │   [Primary Button, Full Width]  │            │
│    └─────────────────────────────────┘            │
│                                                     │
│         Already have an account?                    │
│              [Sign In]                              │
│        [Ghost Button, Blue Text]                   │
│                                                     │
│           ● ○ ○ ○ ○ ○ ○                          │
│        [Progress Indicators]                        │
│                                                     │
└─────────────────────────────────────────────────────┘

Design Notes:
- Clean, spacious layout builds trust
- Visual icons suggest data → stories transformation
- Progress indicators set expectation of journey
- Primary CTA prominent but not aggressive
```

### 2. Dashboard Home - Content Discovery Hub

```
┌─────────────────────────────────────────────────────┐
│ ☰   Aperio.fin    🔍   📊   👤              ≡     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Good morning, Emma! 🌅                             │
│ [Personal greeting, name, time-appropriate icon]   │
│                                                     │
│ Your Daily Lineup                                   │
│ [H3, with today's date subtitle]                   │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 📊 Market Pulse          🔴 LIVE      2m 34s   │ │
│ │ S&P up 1.2%, Tech leads gains                   │ │
│ │                                                 │ │
│ │ ▶ [Play Button] ────●──── [Progress Bar]       │ │
│ │                                                 │ │
│ │ 🎭 Voices: Sarah, Marcus    📈 Market Data      │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🏛️ Economic Lens           NEW       5m 12s    │ │
│ │ Fed Minutes Decoded: What Powell Really Means   │ │
│ │                                                 │ │
│ │ ▶ [Play Button]  Sarah, Elena, Marcus          │ │
│ │                                                 │ │
│ │ 🎯 Your Focus: Fed Policy, Interest Rates       │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🚀 Tech Spotlight         PREMIUM     4m 45s    │ │
│ │ AI Earnings Bonanza: Who's Winning?            │ │
│ │                                                 │ │
│ │ 🔒 [Upgrade Button] Alex, Sarah                │ │
│ │                                                 │ │
│ │ ⭐ 94% listener approval                        │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Quick Actions                                       │
│ [Browse All] [Watchlist] [Learning Path] [History] │
│                                                     │
│ ──────────────────────────────────────────────────  │
│ 🎧 Now Playing: Market Pulse                  ⏸️   │
│ [Persistent Player Bar]                             │
└─────────────────────────────────────────────────────┘

Design Notes:
- Personal greeting creates connection
- Visual hierarchy: Live content → New → Premium
- Voice indicators help users recognize AI personalities
- Content preview with complexity indicators
- Persistent player maintains audio continuity
- Premium content clearly marked but not intrusive
```

### 3. Content Player - Rich Audio Experience

```
┌─────────────────────────────────────────────────────┐
│ ←  Market Pulse                            ⋮       │
├─────────────────────────────────────────────────────┤
│                                                     │
│              Economic Lens                          │
│          Fed Minutes Decoded                        │
│      What Powell Really Means                       │
│         [Content Title Hierarchy]                   │
│                                                     │
│    ┌─────────────────────────────────────────────┐  │
│    │                                             │  │
│    │  🎭 Multi-Voice Conversation                │  │
│    │                                             │  │
│    │  👩‍💼 Sarah Chen (Host)                      │  │
│    │  📊 Marcus Rodriguez (Analyst)              │  │
│    │  🎓 Dr. Elena Petrov (Economist)           │  │
│    │                                             │  │
│    │  ╭─────────────────────────────────────────╮ │  │
│    │  │ ●●●●●●●●○○○○○○○○○○○○  3:24 / 5:12    │ │  │
│    │  │        [Waveform Visualization]         │ │  │
│    │  ╰─────────────────────────────────────────╯ │  │
│    │                                             │  │
│    │      ⏮️   ▶️   ⏭️     1x   ♡   📤          │  │
│    │   [Controls: Prev, Play, Next, Speed,      │  │
│    │    Like, Share]                             │  │
│    └─────────────────────────────────────────────┘  │
│                                                     │
│ Currently Speaking: Dr. Elena Petrov 🎓             │
│ "The Fed's language suggests they're more           │
│  dovish than markets initially interpreted..."      │
│ [Real-time speaker identification & transcript]     │
│                                                     │
│ Key Topics This Episode:                            │
│ 🏛️ Federal Reserve Policy                          │
│ 📊 Interest Rate Impact                             │
│ 💰 Market Reaction Analysis                         │
│                                                     │
│ ──────────────────────────────────────────────────  │
│ Related Content                                     │
│                                                     │
│ ┌──────────────────┐ ┌──────────────────┐          │
│ │ 📈 Market Pulse  │ │ 🏠 Housing Impact│          │
│ │ Fed Day Recap    │ │ Mortgage Rates   │          │
│ │ 2m 15s          │ │ 3m 45s          │          │
│ └──────────────────┘ └──────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘

Design Notes:
- Large, prominent content title hierarchy
- Visual representation of multi-voice format
- Waveform shows audio progress and speaking patterns
- Real-time speaker identification builds connection
- Key topics help users understand value
- Related content encourages exploration
- Professional audio player with advanced controls
```

### 4. Episode Library - Content Organization

```
┌─────────────────────────────────────────────────────┐
│ ☰   Episode Library        🔍 [Search]        ⚙️   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Browse by Format ▼                                  │
│ [All] [Market Pulse] [Economic Lens] [Deep Dive]   │
│                                                     │
│ Filter: [Today] [This Week] [All Time] [Saved]     │
│                                                     │
│ ──────────────────────────────────────────────────  │
│                                                     │
│ Today - March 15, 2024                             │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🔴 📊 Market Pulse                    2m 34s    │ │
│ │ S&P Breaks Records, Tech Surge                  │ │
│ │ Sarah, Marcus • Just published                   │ │
│ │ ▶️  🎯 Your Watchlist Mentioned                 │ │
│ │ Progress: ████████████████████ 100%            │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🆕 🏛️ Economic Lens                 5m 12s     │ │
│ │ Fed Minutes Decoded: What Powell Means          │ │
│ │ Sarah, Elena, Marcus • 2 hours ago              │ │
│ │ ▶️  💡 Learn Mode Available                     │ │
│ │ Progress: ████████░░░░░░░░░░░░ 65%               │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ⭐ 🚀 Tech Spotlight      PREMIUM   4m 45s      │ │
│ │ AI Earnings: The Winners and Losers            │ │
│ │ Alex, Sarah • This morning                       │ │
│ │ 🔒 Upgrade to Premium                           │ │
│ │ ⭐ 94% approval • 🏆 Editor's Pick              │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Yesterday - March 14, 2024                         │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ♡ 📰 Breaking Analysis            3m 22s        │ │
│ │ CPI Shock: Inflation Higher Than Expected       │ │
│ │ Sarah, Marcus, Elena • Yesterday 8:45 AM        │ │
│ │ ▶️  📚 Added to Learning Path                   │ │
│ │ Progress: ████████████████████ 100%            │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ──────────────────────────────────────────────────  │
│ 🎧 Now Playing: Economic Lens             ⏸️ 3:24  │
└─────────────────────────────────────────────────────┘

Design Notes:
- Clear content organization by format and date
- Visual indicators for content type and status
- Progress tracking encourages completion
- Personalization hints (watchlist, learning path)
- Premium content integrated but not pushy
- Social proof with approval ratings
- Persistent player maintains context
```

### 5. User Profile - Learning & Personalization

```
┌─────────────────────────────────────────────────────┐
│ ←  Profile                               ⚙️ Settings │
├─────────────────────────────────────────────────────┤
│                                                     │
│           👤 Emma Rodriguez                         │
│         emma@marketing.com                          │
│        [Profile Avatar & Info]                     │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │             Learning Progress                    │ │
│ │                                                 │ │
│ │ 🔥 47 Day Streak        📚 23 Concepts Mastered │ │
│ │                                                 │ │
│ │ Current Level: Intermediate 📈                  │ │
│ │ ████████████░░░░░░░░ Progress to Advanced       │ │
│ │                                                 │ │
│ │ Next Achievement: "Market Maven" (5 episodes)   │ │
│ │ ████████████████████ 4/5 complete              │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Listening Stats                                     │
│                                                     │
│ ┌──────────────────┐ ┌──────────────────┐          │
│ │ Total Time       │ │ Favorite Format  │          │
│ │ 12h 34m         │ │ Economic Lens    │          │
│ │ [Icon: headphones] │ │ [Icon: building] │          │
│ └──────────────────┘ └──────────────────┘          │
│                                                     │
│ ┌──────────────────┐ ┌──────────────────┐          │
│ │ Episodes Completed│ │ Avg. Session     │          │
│ │ 89 episodes      │ │ 8m 23s          │          │
│ │ [Icon: checkmark] │ │ [Icon: clock]    │          │
│ └──────────────────┘ └──────────────────┘          │
│                                                     │
│ Your Interests & Watchlist                          │
│                                                     │
│ 🎯 Primary Focus Areas:                            │
│ [Fed Policy] [Tech Stocks] [Real Estate] [+Add]    │
│                                                     │
│ 📊 Stock Watchlist:                                │
│ AAPL (+2.3%) • TSLA (-1.2%) • NVDA (+4.1%)        │
│ GOOGL (+0.8%) • MSFT (+1.5%)                      │
│ [Manage Watchlist]                                  │
│                                                     │
│ Recent Achievements 🏆                              │
│                                                     │
│ ┌─ March 12 ─────────────────────────────────────┐ │
│ │ 🎓 "Economics 101" - Completed inflation series │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─ March 10 ─────────────────────────────────────┐ │
│ │ 🔥 "Week Warrior" - 7 consecutive days          │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘

Design Notes:
- Gamification elements encourage engagement
- Clear progress visualization motivates learning
- Statistics provide sense of accomplishment
- Watchlist integration shows platform sophistication
- Achievement history builds momentum
- Personal data helps refine content generation
```

### 6. Premium Upgrade - Subscription Interface

```
┌─────────────────────────────────────────────────────┐
│ ←  Upgrade to Premium                    ✕ Close    │
├─────────────────────────────────────────────────────┤
│                                                     │
│            Unlock Full Aperio.fin                   │
│          [H2, centered, premium feel]               │
│                                                     │
│  "Get unlimited access to professional-grade        │
│   financial journalism powered by AI"               │
│     [Subtitle, compelling value prop]               │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │                   FREE                          │ │
│ │                  $0/month                       │ │
│ │                                                 │ │
│ │ ✓ 1 daily briefing (Market Pulse)              │ │
│ │ ✓ Basic personalization                        │ │
│ │ ✓ Community access                             │ │
│ │ ⚠️ Limited to 5 minutes/day                    │ │
│ │ ⚠️ Advertisements included                      │ │
│ │                                                 │ │
│ │         [Current Plan]                          │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │              ⭐ PREMIUM ⭐                      │ │
│ │                $9.99/month                      │ │
│ │              [Gold accent border]               │ │
│ │                                                 │ │
│ │ ✅ All content formats & series                │ │
│ │ ✅ Advanced AI personalization                 │ │
│ │ ✅ Multi-voice deep-dive episodes              │ │
│ │ ✅ Offline downloads                           │ │
│ │ ✅ Ad-free experience                          │ │
│ │ ✅ Priority customer support                   │ │
│ │ ✅ Custom watchlist alerts                     │ │
│ │                                                 │ │
│ │    ┌─────────────────────────────────────┐     │ │
│ │    │   Start 7-Day Free Trial  →        │     │ │
│ │    │  [Primary CTA, prominent]           │     │ │
│ │    └─────────────────────────────────────┘     │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │                🏆 PRO                           │ │
│ │               $19.99/month                      │ │
│ │                                                 │ │
│ │ ✨ Everything in Premium, plus:                 │ │
│ │ ✅ Custom brief requests                        │ │
│ │ ✅ Portfolio integration & analysis             │ │
│ │ ✅ Advanced analytics dashboard                 │ │
│ │ ✅ Early access to new features                 │ │
│ │ ✅ Direct line to AI personalities             │ │
│ │                                                 │ │
│ │         [Upgrade to Pro]                        │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ 🛡️ 30-day money-back guarantee                     │
│ 💳 Cancel anytime, no questions asked              │
│ 📱 Works on all devices                            │
│                                                     │
│ ──────────────────────────────────────────────────  │
│                                                     │
│ What Premium Users Say:                             │
│ ⭐⭐⭐⭐⭐ "Better than Bloomberg for my needs"      │
│ - Sarah K., Investment Advisor                      │
│                                                     │
│ ⭐⭐⭐⭐⭐ "Finally, financial news I understand"     │
│ - Mike R., Software Engineer                        │
│                                                     │
└─────────────────────────────────────────────────────┘

Design Notes:
- Clear value proposition hierarchy
- Premium tier prominently featured (most popular)
- Social proof builds confidence
- Risk reduction with guarantees
- Specific benefit callouts vs generic features
- Professional testimonials add credibility
```

---

## Responsive Design Specifications

### Mobile Portrait (320px - 768px)

**Layout Adaptations:**
- Single column content stacking
- Larger touch targets (44px minimum)
- Collapsible navigation drawer
- Simplified audio player controls
- Swipe gestures for episode navigation

**Key Changes:**
- Episode cards stack vertically
- Player controls reorganize for thumb access
- Text scales down gracefully
- Voice indicators become icons only

### Tablet (768px - 1024px)

**Layout Enhancements:**
- Two-column content display
- Enhanced audio player with waveform
- Side-by-side episode browsing
- Larger typography for comfortable reading

**Interaction Improvements:**
- Hover states for all interactive elements
- Keyboard navigation support
- Enhanced filtering and search

### Desktop (1024px+)

**Full Experience:**
- Multi-column dashboard layout
- Advanced audio visualizations
- Comprehensive filtering options
- Keyboard shortcuts for power users
- Enhanced premium feature showcase

---

## Accessibility Considerations

**Visual Accessibility:**
- High contrast mode support (4.5:1 minimum ratio)
- Scalable text up to 200% without horizontal scrolling
- Clear focus indicators for keyboard navigation
- Alternative text for all images and icons

**Audio Accessibility:**
- Full transcripts for all episodes
- Closed caption support
- Audio description tracks for visual elements
- Adjustable playback speeds (0.5x to 3x)

**Motor Accessibility:**
- Large click targets (44px minimum)
- Voice command support
- Switch navigation compatibility
- Reduced motion options for animations

**Cognitive Accessibility:**
- Clear information hierarchy
- Consistent navigation patterns
- Progress indicators for multi-step flows
- Simple language with jargon explanations

---

## Implementation Notes

**Design System Tools:**
- Use CSS Custom Properties for consistent theming
- Component-based architecture for reusability
- Figma design system for team collaboration
- Design tokens for developer handoff

**Performance Considerations:**
- Optimized images and icons
- Progressive loading for content
- Efficient CSS animations
- Minimal JavaScript for interactions

**Technical Integration:**
- Audio player built with Web Audio API
- Responsive breakpoints using CSS Grid/Flexbox
- PWA features for mobile app-like experience
- Dark mode support for premium users

---

*These mockups establish the visual foundation for Aperio.fin's journalism platform, balancing professional credibility with user-friendly accessibility. The design scales from beginner-friendly to sophisticated professional use.*