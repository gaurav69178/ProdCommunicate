# Design Guidelines: Chatbot Web Application

## Design Approach: Utility-Focused Chat Interface

**Selected Approach:** Design System with Modern Chat Interface Patterns  
**Primary References:** Linear (clean aesthetics), ChatGPT (focused conversation), Discord (familiar patterns)  
**Justification:** Chat applications prioritize clarity, readability, and efficiency. Users need immediate access to conversation history and input without visual distractions.

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 220 15% 8% (deep slate)
- Surface/Cards: 220 15% 12% (elevated surface)
- Message bubbles (user): 215 85% 55% (vibrant blue)
- Message bubbles (assistant): 220 12% 16% (neutral gray)
- Text primary: 0 0% 95%
- Text secondary: 220 10% 65%
- Border/dividers: 220 12% 20%
- Input focus: 215 90% 60%

**Light Mode:**
- Background: 0 0% 98%
- Surface/Cards: 0 0% 100%
- Message bubbles (user): 215 85% 50%
- Message bubbles (assistant): 220 10% 94%
- Text primary: 220 15% 15%
- Text secondary: 220 10% 45%
- Border/dividers: 220 10% 88%

### B. Typography

**Font Stack:**
- Primary: 'Inter' (Google Fonts) - exceptional readability for chat interfaces
- Monospace: 'JetBrains Mono' (Google Fonts) - for code blocks in messages

**Type Scale:**
- Message text: text-base (16px)
- Timestamps: text-xs (12px)
- Input text: text-base (16px)
- Header title: text-lg font-semibold (18px)
- System messages: text-sm (14px)

**Weights:** 400 (regular), 500 (medium), 600 (semibold)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of **2, 3, 4, 6, 8** consistently
- Message padding: p-3 or p-4
- Container padding: px-4 py-3
- Message gaps: space-y-3 or space-y-4
- Section spacing: mb-6 or mb-8

**Container Structure:**
- Full-height layout: h-screen flex flex-col
- Messages container: flex-1 overflow-y-auto
- Fixed input area at bottom
- Max width for messages: max-w-3xl mx-auto
- Mobile padding: px-4
- Desktop padding: px-6 or px-8

### D. Component Library

**1. Header Component:**
- Fixed top position with backdrop blur
- Title/logo on left
- Theme toggle on right
- Border bottom with subtle shadow
- Height: h-14 or h-16
- Background: bg-background/95 backdrop-blur

**2. Message Bubbles:**
- User messages: Right-aligned, colored background, white text
- Assistant messages: Left-aligned, neutral background
- Rounded corners: rounded-2xl or rounded-xl
- Padding: px-4 py-3
- Max width: max-w-[85%] md:max-w-[75%]
- Drop shadow on user messages: shadow-sm

**3. Message Container:**
- Display avatar/icon for assistant messages (left side)
- Username/role label above message (text-xs text-muted-foreground)
- Timestamp below message (text-xs opacity-60)
- Smooth scroll behavior
- Auto-scroll to latest message

**4. Input Area:**
- Fixed bottom with backdrop blur
- Textarea that auto-expands (max 5 lines)
- Send button (icon only, always visible)
- Border top with subtle shadow
- Padding: p-4
- Background: bg-background/95 backdrop-blur
- Textarea styling: rounded-xl, border, focus ring

**5. System Messages:**
- Centered text, smaller font
- Muted color
- Light background pill: bg-muted rounded-full px-3 py-1
- Used for timestamps, connection status

**6. Empty State:**
- Centered content when no messages
- Icon + welcome text + suggested prompts
- Suggested prompts as clickable pills: rounded-xl border hover effect

**7. Loading Indicator:**
- Three animated dots for assistant typing
- Subtle pulse animation
- Matches assistant message bubble style

### E. Interactions & Animations

**Minimal Animation Strategy:**
- Message entrance: Simple fade-in (200ms)
- Typing indicator: Subtle pulse
- Input focus: Smooth ring transition (150ms)
- Scroll behavior: smooth
- **NO** slide animations, parallax, or elaborate effects

**Hover States:**
- Message bubbles: Slight opacity change (hover:opacity-90)
- Input button: Background color shift
- Clickable elements: Cursor pointer

---

## Mobile-First Specifications

**Responsive Breakpoints:**
- Mobile: < 768px (base styles)
- Tablet: md: 768px
- Desktop: lg: 1024px

**Mobile Optimizations:**
- Touch-friendly tap targets (min 44x44px)
- Larger text input area on mobile
- Simplified header (hide secondary elements)
- Bottom sheet style for settings/menu
- Viewport-aware height (h-[100dvh] to account for mobile browsers)

**Desktop Enhancements:**
- Wider max-width for messages
- Keyboard shortcuts display
- Hover states more pronounced
- Optional sidebar for chat history (if implemented)

---

## Critical Implementation Notes

1. **Scroll Management:** Messages container must auto-scroll to bottom on new messages with smooth behavior
2. **Input Focus:** Textarea should auto-focus on page load for immediate use
3. **Message Grouping:** Group consecutive messages from same sender (reduce redundant avatars/labels)
4. **Accessibility:** Proper ARIA labels, keyboard navigation, focus management
5. **Performance:** Virtualize message list if history exceeds 100 messages
6. **Error States:** Clear error messages in red pill format, retry button for failed messages

---

## Images

**No hero image required** - This is a utility application focused on conversation.

**Icon Usage:**
- Use Heroicons (outline style) via CDN
- Icons needed: PaperAirplaneIcon (send), MoonIcon/SunIcon (theme toggle), UserCircleIcon (avatar fallback)
- Size: w-5 h-5 for UI actions, w-8 h-8 for avatars

**Optional Avatar System:**
- User: Colored circle with initials (generated from name)
- Assistant: Bot icon or circular colored background with icon
- Size: w-8 h-8 on mobile, w-10 h-10 on desktop

---

## Professional Polish

- Consistent spacing rhythm throughout (using 2, 3, 4, 6, 8 scale)
- Smooth color transitions for theme switching
- Proper focus management for accessibility
- Loading states for all async operations
- Clear visual hierarchy: Header → Messages → Input
- Maintain 60fps scrolling performance
- Optimistic UI updates (show user message immediately)