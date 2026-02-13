# Styling Guide - RyzeAI UI Generator

## How to Customize Component Styling

### ✅ Option 1: Use `className` Prop (Recommended)

All major components now support a `className` prop that lets you add custom Tailwind classes:

```tsx
// Change background color
<Card className="bg-blue-50">
  Content here
</Card>

// Add shadow and border
<Container className="shadow-2xl border border-gray-300">
  Content here
</Container>

// Custom button colors
<Button className="bg-green-600 hover:bg-green-700 text-white">
  Custom Green Button
</Button>

// Multiple utilities
<Grid className="bg-gray-100 p-6 rounded-xl shadow-md">
  Grid items here
</Grid>
```

### 📋 Components with `className` Support

- **Layout**: `Container`, `Grid`, `Flex`, `Stack`
- **Display**: `Card`, `Text`, `Badge`
- **Input**: `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`
- **Feedback**: `Alert`, `Spinner`, `ProgressBar`
- **Navigation**: `Tabs`, `Breadcrumb`, `Pagination`
- **Overlay**: `Modal`, `Tooltip`, `Dropdown`

### 🎨 Common Tailwind Patterns

#### Background Colors

```tsx
className = "bg-blue-500"; // Solid blue
className = "bg-gradient-to-r from-purple-500 to-pink-500"; // Gradient
className = "bg-opacity-50"; // 50% opacity
```

#### Text Colors

```tsx
className = "text-red-600"; // Red text
className = "text-gray-400"; // Light gray
```

#### Spacing

```tsx
className = "p-6"; // Padding all sides
className = "px-4 py-2"; // Horizontal/vertical padding
className = "m-4"; // Margin
className = "space-y-4"; // Vertical spacing between children
```

#### Borders & Shadows

```tsx
className = "border border-gray-300"; // Standard border
className = "border-2 border-blue-500"; // Thick colored border
className = "shadow-lg"; // Large shadow
className = "shadow-xl"; // Extra large shadow
className = "rounded-lg"; // Rounded corners
```

#### Sizing

```tsx
className = "w-full"; // Full width
className = "h-64"; // Fixed height
className = "max-w-md"; // Max width
```

### 🤖 How to Request Custom Styling from AI

**Example Prompts:**

1. **"Create a dashboard with a dark blue background"**
   - AI will use: `<Container className="bg-blue-900">`

2. **"Add a green submit button with shadow"**
   - AI will use: `<Button className="bg-green-600 shadow-lg">`

3. **"Make the card have a gradient background from purple to pink"**
   - AI will use: `<Card className="bg-gradient-to-r from-purple-500 to-pink-500">`

4. **"Create a form with light gray background and rounded corners"**
   - AI will use: `<Container className="bg-gray-100 rounded-xl p-6">`

### ✅ Option 2: Use Built-in Variants

Many components have built-in style variants:

```tsx
// Card variants
<Card variant="default">     // White with border
<Card variant="bordered">    // Thick border
<Card variant="elevated">    // Drop shadow

// Button variants
<Button variant="primary">   // Blue
<Button variant="secondary"> // Gray
<Button variant="outline">   // Outline
<Button variant="danger">    // Red
<Button variant="ghost">     // Transparent

// Alert variants
<Alert variant="info">       // Blue
<Alert variant="success">    // Green
<Alert variant="warning">    // Yellow
<Alert variant="error">      // Red
```

### ✅ Option 3: Request Iterative Changes

If the AI generates a UI but you want different colors:

**Initial**: "Create a user profile page"
**Follow-up**: "Make the header background purple and add more spacing"

The AI will modify just the specified components while preserving the rest!

### ❌ What NOT to Do

```tsx
// ❌ NEVER use inline styles (will fail validation)
<Card style={{ backgroundColor: 'blue' }}>

// ❌ NEVER use arbitrary Tailwind values
<Card className="bg-[#ff0000]">

// ✅ Instead, use standard Tailwind classes
<Card className="bg-red-500">
```

### 🎯 Pro Tips

1. **Combine className with variants**:

   ```tsx
   <Button variant="primary" className="shadow-xl text-lg">
     Large Primary Button with Shadow
   </Button>
   ```

2. **Use responsive classes**:

   ```tsx
   <Grid className="bg-white md:bg-gray-100 lg:bg-gray-200">
     // Different backgrounds at different screen sizes
   </Grid>
   ```

3. **Dark mode support**:

   ```tsx
   <Card className="bg-white dark:bg-gray-800">
     // Adapts to light/dark mode
   </Card>
   ```

4. **Hover states**:
   ```tsx
   <Card className="hover:shadow-2xl hover:scale-105 transition-all">
     // Interactive effects
   </Card>
   ```

### 📚 Full Tailwind Reference

For all available classes, see: https://tailwindcss.com/docs

### 🔄 Common Styling Requests

| Want to...    | Tell AI...                   | Result                      |
| ------------- | ---------------------------- | --------------------------- |
| Change color  | "Make it blue/green/red"     | Uses Tailwind color classes |
| Add spacing   | "Add more padding/margin"    | Uses p-_/m-_ classes        |
| Add shadow    | "Add a drop shadow"          | Uses shadow-\* classes      |
| Round corners | "Make it rounded"            | Uses rounded-\* classes     |
| Change size   | "Make it larger/smaller"     | Adjusts size classes        |
| Add gradient  | "Use a gradient from X to Y" | Uses bg-gradient-\* classes |

---

**Remember**: All styling is done via Tailwind CSS classes through the `className` prop. No inline styles allowed!
