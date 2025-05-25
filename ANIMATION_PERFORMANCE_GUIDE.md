# Animation Performance Guide

This guide provides best practices for creating high-performance animations in our React application. Following these guidelines will help ensure smooth animations and better overall user experience.

## Table of Contents

1. [Animation Performance Principles](#animation-performance-principles)
2. [CSS Animation Best Practices](#css-animation-best-practices)
3. [React Component Optimization](#react-component-optimization)
4. [Using Our Animation Utilities](#using-our-animation-utilities)
5. [Performance Testing](#performance-testing)

## Animation Performance Principles

### The 60fps Target

For smooth animations, we need to maintain 60 frames per second (fps). This means each frame must complete in under 16.67ms. When animations drop below this threshold, they appear janky and slow.

### Browser Rendering Pipeline

Understanding the browser rendering pipeline helps optimize animations:

1. **JavaScript**: Calculate style changes
2. **Style**: Determine which CSS rules apply
3. **Layout**: Calculate how elements affect each other
4. **Paint**: Fill in pixels
5. **Composite**: Draw layers to screen

### Properties to Animate

Some properties are more expensive to animate than others:

**Inexpensive (GPU-accelerated):**
- `opacity`
- `transform` (translate, scale, rotate)

**Expensive (trigger layout recalculations):**
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `font-size`

## CSS Animation Best Practices

### 1. Use GPU-Accelerated Properties

```css
/* Good - uses transform and opacity */
.good-animation {
  animation: slide-in 0.2s ease-out;
}
@keyframes slide-in {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Bad - animates width and height */
.bad-animation {
  animation: grow 0.2s ease-out;
}
@keyframes grow {
  from { width: 0; height: 0; }
  to { width: 100px; height: 100px; }
}
```

### 2. Use Hardware Acceleration Hints

```css
.gpu-accelerated {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

### 3. Keep Animations Short and Simple

- Use short durations (0.15s - 0.3s)
- Avoid complex timing functions
- Limit the number of animated properties
- Use simple easing functions (ease-out is generally best)

### 4. Use CSS Containment

```css
.contained-animation {
  contain: layout style paint;
}
```

## React Component Optimization

### 1. Memoize Components with React.memo

```jsx
// Prevent unnecessary re-renders
export default React.memo(MyAnimatedComponent);

// With custom comparison function
export default React.memo(MyAnimatedComponent, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && prevProps.isActive === nextProps.isActive;
});
```

### 2. Memoize Expensive Calculations

```jsx
// Memoize calculations that feed into animations
const memoizedValue = React.useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);
```

### 3. Optimize Event Handlers

```jsx
// Memoize event handlers
const handleClick = React.useCallback(() => {
  // Handle click
}, [dependency]);
```

### 4. Batch State Updates

```jsx
// Bad - multiple renders
const handleAction = () => {
  setIsVisible(true);
  setPosition({ x: 0, y: 0 });
  setScale(1);
};

// Good - batch updates
const handleAction = () => {
  setAnimationState({
    isVisible: true,
    position: { x: 0, y: 0 },
    scale: 1
  });
};
```

## Using Our Animation Utilities

We've created optimized animation utilities in `src/styles/animation-performance.css`. Use these classes for consistent, high-performance animations:

### Basic Animation Classes

```jsx
// Fade in animation
<div className="fade-in">Content</div>

// Slide in from left
<div className="slide-in-left">Content</div>

// Slide in from right
<div className="slide-in-right">Content</div>

// Scale in animation
<div className="scale-in">Content</div>
```

### Animation Container

Wrap animated content in an animation container:

```jsx
<div className="animation-container">
  <div className="fade-in">First item</div>
  <div className="slide-in-left">Second item</div>
</div>
```

### Performance Utility Classes

```jsx
// Apply GPU acceleration
<div className="gpu-accelerated">Content</div>

// Apply CSS containment
<div className="content-containment">Content</div>

// Prevent layout shifts
<div className="maintain-height">Content</div>
```

## Performance Testing

### Tools for Measuring Animation Performance

1. **Chrome DevTools Performance Panel**
   - Record animations and look for long frames
   - Identify layout thrashing and paint bottlenecks

2. **Rendering Tab**
   - Enable "Paint Flashing" to see repaints
   - Enable "FPS Meter" to monitor frame rate

3. **Lighthouse**
   - Run performance audits
   - Check for "Avoid large layout shifts" and "Avoid non-composited animations"

### Common Performance Issues

1. **Layout Thrashing**
   - Reading layout properties and then changing them repeatedly
   - Fix: Batch reads and writes, use `requestAnimationFrame`

2. **Paint Storms**
   - Large areas being repainted
   - Fix: Use `will-change`, reduce animated area size

3. **JavaScript Blocking**
   - Heavy JS calculations during animation
   - Fix: Move work off the main thread, use `requestIdleCallback`

4. **Too Many Animated Elements**
   - Animating many elements simultaneously
   - Fix: Reduce number of animated elements, stagger animations

## Conclusion

By following these guidelines, we can create smooth, high-performance animations that enhance the user experience without causing performance issues. Remember that animation performance is especially important on mobile devices with limited resources.

For any questions or further optimization needs, refer to this guide or consult with the team.
