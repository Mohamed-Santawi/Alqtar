# Template Styling Feature 📐

## Templates Available

Your app now has **5 unique templates** that change the visual appearance of the research:

### 1. **أكاديمي (Academic)** 📚

- **Style**: Professional, standard academic format
- **Title Size**: 2em (medium-large)
- **Content Size**: 1.1em
- **Line Height**: 1.8 (balanced)
- **Spacing**: Medium
- **Background**: Light gray (#f9fafb)
- **Border**: Gray
- **Best for**: Standard academic papers, university reports

### 2. **حديث (Modern)** ✨

- **Style**: Contemporary, clean, spacious
- **Title Size**: 2.2em (large)
- **Content Size**: 1.15em (slightly larger)
- **Line Height**: 1.9 (more spacing)
- **Spacing**: Wide (20px)
- **Background**: Blue gradient
- **Border**: Light blue
- **Best for**: Modern presentations, business reports

### 3. **تقليدي (Classic)** 📄

- **Style**: Traditional, compact, formal
- **Title Size**: 1.8em (smaller)
- **Content Size**: 1.05em (compact)
- **Line Height**: 1.7 (tighter)
- **Spacing**: Compact (12px)
- **Background**: Light yellow (#fefce8)
- **Border**: Yellow
- **Best for**: Traditional documents, historical research

### 4. **رسالة (Thesis)** 🎓

- **Style**: Formal thesis format, very spacious
- **Title Size**: 2.4em (very large)
- **Content Size**: 1.2em (large)
- **Line Height**: 2 (double-spaced)
- **Spacing**: Maximum (24px)
- **Background**: Stone gray (#fafaf9)
- **Border**: Stone
- **Best for**: PhD theses, master's dissertations, formal research

### 5. **صحفي (Newspaper)** 📰

- **Style**: Newspaper/journalism format
- **Title Size**: 2.5em (largest - headlines)
- **Content Size**: 1em (compact)
- **Line Height**: 1.6 (tight)
- **Spacing**: Minimal (8px)
- **Background**: Pure white
- **Border**: Black
- **Best for**: Articles, journalistic pieces, news reports

## How to Use

1. **Generate research** first (click "إنشاء البحث")
2. **After research appears**, click any template in "القوالب الجاهزة"
3. **Watch the research transform instantly!** ✨

## What Changes When You Select a Template

- ✅ **Title font size** - Different for each template
- ✅ **Content font size** - Optimized per template
- ✅ **Line spacing** - From tight (newspaper) to wide (thesis)
- ✅ **Paragraph spacing** - From compact to spacious
- ✅ **Background color** - Unique color/gradient per template
- ✅ **Border color** - Matches template theme

## Real-Time Updates

Templates work just like colors and fonts:

- **No regeneration needed**
- **Instant visual change**
- **React automatically re-renders**

## Combining Features

You can combine templates with your custom settings:

```
1. Select "Modern" template (gets blue gradient background)
2. Change title color to red (titles become red on blue background)
3. Change font to "Amiri" (everything uses Amiri font)
4. Change content color to dark blue

Result: Modern template layout + your custom colors + your font!
```

## Technical Implementation

```javascript
const templateStyles = {
  academic: {
    titleSize: '2em',
    contentSize: '1.1em',
    background: '#f9fafb',
    // ... more settings
  },
  // ... other templates
};

// Applied in real-time
<h2 style={{
  fontSize: currentTemplateStyle.titleSize,  // Changes when template changes!
  ...
}}>
```

## Testing Templates

Try this:

1. Generate a research
2. Click each template one by one:
   - **Academic** → See standard format
   - **Modern** → See it become spacious with blue gradient
   - **Classic** → See it become compact with yellow tint
   - **Thesis** → See it become very spaced out (double-spaced)
   - **Newspaper** → See it become tight like a newspaper column

## Export with Template

When you click "تحميل البحث", the downloaded HTML file includes:

- Your selected template styling
- Your custom colors
- Your selected font

Everything is preserved in the export! 🎨

## Summary

| Feature             | Status                  |
| ------------------- | ----------------------- |
| **لون العناوين**    | ✅ Real-time updates    |
| **لون المحتوى**     | ✅ Real-time updates    |
| **نوع الخط**        | ✅ Real-time updates    |
| **القوالب الجاهزة** | ✅ Real-time updates    |
| **Export**          | ✅ Includes all styling |

Now you have complete control over your research appearance! 🚀
