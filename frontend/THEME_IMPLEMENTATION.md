# 🎨 Light & Dark Mode Implementation Guide

## ✅ What Was Implemented

### 1. Theme Context & Provider

- **File**: `contexts/ThemeContext.tsx`
- Manages theme state globally
- Persists theme preference to localStorage
- Respects system preference on first load

### 2. Updated Components

- **Sidebar**: Updated app name to "Liqtra Finance"
- **Header**: Added functional theme toggle button
- **App Layout**: Updated metadata with new app name

### 3. Tailwind Configuration

- Added `darkMode: 'class'` strategy
- Light mode color variants
- Both dark and light background colors

### 4. Global Styles

- Theme-aware scrollbars
- CSS variables for light/dark themes
- Smooth transitions between themes

---

## 🎯 Usage

### Theme Hook

```tsx
"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return <button onClick={toggleTheme}>Current theme: {theme}</button>;
}
```

### Available Methods

```typescript
interface ThemeContextType {
  theme: "light" | "dark"; // Current theme
  toggleTheme: () => void; // Toggle between themes
  setTheme: (theme) => void; // Set specific theme
}
```

---

## 🎨 Styling Components for Both Themes

### Using Tailwind Classes

```tsx
// Text colors
<h1 className="text-gray-900 dark:text-white">
  This text adapts to theme
</h1>

// Backgrounds
<div className="bg-white dark:bg-gray-800">
  Content
</div>

// Borders
<div className="border border-gray-200 dark:border-gray-800">
  Card content
</div>

// Hover states
<button className="hover:bg-gray-100 dark:hover:bg-gray-700">
  Click me
</button>
```

### Common Patterns

#### Card Component

```tsx
<div className="bg-card-light dark:bg-card border-gray-200 dark:border-gray-800">
  {/* Content */}
</div>
```

#### Text Elements

```tsx
// Primary text
<h1 className="text-gray-900 dark:text-white">Title</h1>

// Secondary text
<p className="text-gray-600 dark:text-gray-400">Description</p>

// Tertiary text
<span className="text-gray-500 dark:text-gray-500">Details</span>
```

#### Input Fields

```tsx
<input
  className="
    bg-gray-50 dark:bg-gray-800/50 
    border-gray-300 dark:border-gray-700
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
  "
/>
```

#### Buttons

```tsx
<button
  className="
  bg-white dark:bg-gray-800
  hover:bg-gray-50 dark:hover:bg-gray-700
  text-gray-900 dark:text-white
  border-gray-300 dark:border-gray-600
"
>
  Button
</button>
```

---

## 🔧 Configuration

### Tailwind Config (`tailwind.config.js`)

```javascript
module.exports = {
  darkMode: "class", // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#1a1d2e", // Dark background
          light: "#f5f7fa", // Light background
        },
        card: {
          DEFAULT: "#252837", // Dark card
          light: "#ffffff", // Light card
        },
      },
    },
  },
};
```

### Theme Provider in App

```tsx
// app/providers.tsx
import { ThemeProvider } from "@/contexts/ThemeContext";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      {/* Other providers */}
      {children}
    </ThemeProvider>
  );
}
```

---

## 🎨 Color Palette

### Dark Mode (Default)

```css
Background:      #1a1d2e
Card:            #252837
Border:          #2d3748
Text Primary:    #ffffff
Text Secondary:  #cbd5e0
Text Tertiary:   #a0aec0
```

### Light Mode

```css
Background:      #f5f7fa
Card:            #ffffff
Border:          #e2e8f0
Text Primary:    #1a202c
Text Secondary:  #4a5568
Text Tertiary:   #718096
```

### Accent Colors (Both Modes)

```css
Primary Purple:  #b794f6
Primary Blue:    #667eea
Success:         #48bb78
Danger:          #f56565
Warning:         #ed8936
```

---

## 📱 Component Examples

### Header Theme Toggle

```tsx
"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun
          size={20}
          weight="fill"
          className="text-gray-600 dark:text-gray-400"
        />
      ) : (
        <Moon size={20} weight="fill" className="text-gray-600" />
      )}
    </button>
  );
}
```

### Themed Card

```tsx
export function ThemedCard({ children }) {
  return (
    <div
      className="
      bg-white dark:bg-card
      border border-gray-200 dark:border-gray-800
      rounded-2xl p-6
      shadow-sm dark:shadow-none
    "
    >
      {children}
    </div>
  );
}
```

### Themed Modal

```tsx
export function ThemedModal({ children }) {
  return (
    <div
      className="
      fixed inset-0 z-50 flex items-center justify-center
      bg-black/50 dark:bg-black/70
    "
    >
      <div
        className="
        bg-white dark:bg-card
        border border-gray-200 dark:border-gray-800
        rounded-2xl p-6 max-w-md w-full
        shadow-xl
      "
      >
        {children}
      </div>
    </div>
  );
}
```

---

## 🔄 Theme Persistence

The theme is automatically saved to `localStorage` and restored on page load:

```typescript
// Save theme
localStorage.setItem("theme", "dark");

// Load theme
const savedTheme = localStorage.getItem("theme");

// Respect system preference if no saved theme
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";
```

---

## 🎯 Best Practices

### 1. Always Support Both Modes

```tsx
// ✅ Good
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">

// ❌ Bad (only works in dark mode)
<div className="bg-gray-800 text-white">
```

### 2. Use Semantic Color Names

```tsx
// ✅ Good
<p className="text-gray-600 dark:text-gray-400">

// ❌ Bad (hard to maintain)
<p className="text-[#4a5568] dark:text-[#cbd5e0]">
```

### 3. Test in Both Modes

Always test your components in both light and dark mode to ensure:

- Text is readable
- Contrast is sufficient
- Borders are visible
- Hover states work

### 4. Use CSS Variables for Complex Theming

```css
.dark {
  --bg-primary: #1a1d2e;
  --text-primary: #ffffff;
}

.light {
  --bg-primary: #f5f7fa;
  --text-primary: #1a202c;
}
```

---

## 🧪 Testing

### Manual Testing

```bash
npm run dev
```

1. Click the sun/moon icon in the header
2. Theme should toggle smoothly
3. Refresh page - theme should persist
4. Check all pages for proper contrast

### Browser DevTools

```javascript
// Force dark mode
document.documentElement.classList.add("dark");

// Force light mode
document.documentElement.classList.remove("dark");

// Toggle
document.documentElement.classList.toggle("dark");
```

---

## 📊 Component Status

### ✅ Fully Themed

- [x] Sidebar
- [x] Header
- [x] Theme toggle button
- [x] App metadata

### 🔄 Needs Light Mode Support

All other components need dark mode classes added:

- [ ] Dashboard cards
- [ ] Active positions
- [ ] Yield cards
- [ ] Portfolio components
- [ ] Settings page
- [ ] Modals & dropdowns
- [ ] Forms & inputs

### How to Add Support

For each component, add `dark:` variants:

```tsx
// Before
<div className="bg-card text-white border-gray-800">

// After
<div className="bg-white dark:bg-card text-gray-900 dark:text-white border-gray-200 dark:border-gray-800">
```

---

## 🚀 Next Steps

### 1. Update Remaining Components

Add light mode support to all components using the patterns above.

### 2. Create Theme-Aware Variants

```tsx
// components/common/Card.tsx
export function Card({ children, variant = "default" }) {
  const baseClasses = "rounded-2xl p-6 border";
  const variantClasses = {
    default: "bg-white dark:bg-card border-gray-200 dark:border-gray-800",
    glass: "bg-white/80 dark:bg-gray-800/30 backdrop-blur-xl",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </div>
  );
}
```

### 3. Add Transition Animations

```css
* {
  @apply transition-colors duration-200;
}
```

### 4. Create Theme Presets

Allow users to choose from multiple themes:

- Light
- Dark
- Auto (system)
- High contrast
- Custom colors

---

## 📚 Resources

- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [Next.js Themes Guide](https://nextjs.org/docs/app/building-your-application/styling/css-modules#theme-support)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 🎉 Summary

✅ Theme system is fully functional
✅ Toggle button in header works
✅ Theme persists across sessions
✅ Respects system preference
✅ Smooth transitions
✅ App name updated to "Liqtra Finance"

**Current Status**: Core theme system implemented. Components need light mode variants added individually.

**Next Task**: Go through each component and add `dark:` Tailwind classes for full light mode support!
