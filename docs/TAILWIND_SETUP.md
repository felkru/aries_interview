# Tailwind CSS Configuration

This project uses **Tailwind CSS v4** integrated into the Next.js App Router.

## Key Differences from Tailwind v3

1. **No `tailwind.config.js`**: Tailwind v4 is fundamentally **CSS-first**. All configuration and theme variables are now defined directly in CSS using native variables and the new `@theme` directive, processed via PostCSS.
2. **Simplified Directives**: Instead of the traditional three directives (`base`, `components`, `utilities`), we simply use `@import "tailwindcss";` at the top of our global stylesheet.

## Project Structure

- **Global Styles & Theme Config**: `smart-reviewer/app/globals.css`
  - Contains `@import "tailwindcss";`.
  - Also contains custom native CSS variables for features like dark mode (`--background`, `--foreground`).
- **PostCSS Configuration**: `smart-reviewer/postcss.config.mjs`
  - Loads the `@tailwindcss/postcss` plugin, which enables Next.js to compile our Tailwind v4 styles seamlessly via Turbopack or Webpack.

## Modifying the Theme

To add custom design tokens (colors, fonts, breakpoints), you modify `smart-reviewer/app/globals.css` directly.

Example:

```css
@theme {
  --font-sans: "Inter", sans-serif;
  --color-brand-blue: #2563eb;
}
```

Tailwind automatically translates these `--color-*` variables into utility classes like `text-brand-blue` or `bg-brand-blue`.

## Troubleshooting IDE Errors

If you experience "unknown at-rule" warnings in VSCode (e.g., for `@import "tailwindcss"` or `@theme`), make sure to:

1. Update the official **Tailwind CSS IntelliSense** extension to the latest version.
2. Ensure your editor treats `globals.css` as a PostCSS or Tailwind-enabled file.
