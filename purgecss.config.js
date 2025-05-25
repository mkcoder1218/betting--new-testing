// purgecss.config.js
export default {
  // Content sources to analyze for used CSS
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  
  // CSS files to process
  css: [
    './src/styles/*.css',
    './src/components/**/*.css',
  ],
  
  // Output directory for purged CSS files
  output: './dist/assets',
  
  // Safelist specific selectors from being purged
  safelist: {
    // Standard safelist (exact matches)
    standard: [
      // Animation classes
      'animator', 'ticket-pop',
      // Active states
      'isActive', 'active',
      // MUI-specific classes that might be added dynamically
      /^Mui/,
      // Tailwind classes that might be added dynamically
      'flex', 'items-center', 'justify-center',
    ],
    // Patterns to match (using regex)
    patterns: [
      // Tailwind responsive classes
      /^(sm|md|lg|xl):/,
      // Animation related classes
      /^animate-/,
      // State-related classes
      /(show|hide|open|close)/,
      // Transition classes
      /^transition/,
      // Hover, focus, active states
      /:(hover|focus|active)/,
    ],
  },
  
  // Reject specific selectors from being purged
  rejected: false,
  
  // Options for better handling of CSS variables and keyframes
  variables: true,
  keyframes: true,
  
  // Font face rules
  fontFace: true,
  
  // Minimize the CSS
  minify: true,
  
  // Print summary to console
  summary: true,
};
