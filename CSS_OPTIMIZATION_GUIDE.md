# CSS Optimization Guide

This guide outlines best practices for maintaining optimized CSS in our project. Following these guidelines will help ensure better performance, maintainability, and scalability.

## Table of Contents

1. [CSS Organization](#css-organization)
2. [Selector Efficiency](#selector-efficiency)
3. [CSS Variables](#css-variables)
4. [Animation Performance](#animation-performance)
5. [Media Queries](#media-queries)
6. [Reducing File Size](#reducing-file-size)
7. [Tools and Commands](#tools-and-commands)

## CSS Organization

### File Structure
- **Component-specific styles**: Keep in the component's directory
- **Global styles**: Keep in the `src/styles` directory
- **Theme variables**: Define in `:root` in a central file

### Naming Conventions
- Use descriptive class names
- Follow a consistent naming pattern (e.g., BEM or similar)
- Avoid excessive nesting (max 3 levels)

## Selector Efficiency

### Do's
- Use class selectors when possible
- Keep selectors short and specific
- Group related styles

```css
/* Good */
.button {
  /* Base styles */
}
.button--primary {
  /* Primary button styles */
}

/* Avoid */
div > ul > li > a.button {
  /* Too specific and slow */
}
```

### Don'ts
- Avoid universal selectors (`*`)
- Minimize use of descendant selectors
- Avoid inline styles
- Avoid `!important` flags

## CSS Variables

Use CSS variables for consistent values:

```css
:root {
  --primary-color: #02ad1c;
  --secondary-color: #fb827f;
  --text-color: rgb(145, 144, 144);
  --border-color: rgba(215, 213, 213, 0.308);
}

.button {
  background-color: var(--primary-color);
  color: white;
}
```

## Animation Performance

### Optimizing Animations
- Use `transform` and `opacity` for animations when possible
- Add `will-change` for elements that will animate
- Use `transform: translateZ(0)` for GPU acceleration
- Keep animations short and simple

```css
/* Optimized animation */
.animator {
  animation: tableanimation 0.3s forwards;
  will-change: transform;
  transform: translateZ(0);
}
```

### Reducing Animation Impact
- Use `@media (prefers-reduced-motion: reduce)` for accessibility
- Avoid animating many elements simultaneously
- Use CSS containment with `contain: content` or `contain: layout`

## Media Queries

### Mobile-First Approach
- Start with mobile styles as the base
- Add media queries for larger screens
- Use min-width rather than max-width when possible

```css
/* Base styles for mobile */
.container {
  width: 100%;
}

/* Tablet styles */
@media screen and (min-width: 481px) {
  .container {
    width: 80%;
  }
}

/* Desktop styles */
@media screen and (min-width: 769px) {
  .container {
    width: 70%;
  }
}
```

## Reducing File Size

### Techniques
- Remove unused CSS with PurgeCSS
- Minify CSS for production
- Combine similar rules
- Use shorthand properties
- Remove redundant properties

### Example
```css
/* Before */
.element {
  margin-top: 10px;
  margin-right: 15px;
  margin-bottom: 10px;
  margin-left: 15px;
  padding-top: 5px;
  padding-right: 10px;
  padding-bottom: 5px;
  padding-left: 10px;
}

/* After */
.element {
  margin: 10px 15px;
  padding: 5px 10px;
}
```

## Tools and Commands

### Available Commands
- `npm run build` - Build with CSS optimization
- `npm run css:purge` - Run PurgeCSS separately

### PurgeCSS
We use PurgeCSS to remove unused CSS. The configuration is in `purgecss.config.js`.

### CSS Minification
CSS is automatically minified during the build process using cssnano.

## Best Practices Summary

1. **Use CSS variables** for consistent values
2. **Optimize selectors** for performance
3. **Minimize use of `!important`**
4. **Use GPU-accelerated properties** for animations
5. **Follow mobile-first approach** for responsive design
6. **Remove unused CSS** with PurgeCSS
7. **Use CSS containment** for better performance
8. **Optimize font loading** with `font-display: swap`
