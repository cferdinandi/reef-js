---
title: "About"
date: 2018-01-24T11:48:20-05:00
draft: false
noTitle: false
noIndex: false
anchors: true
---

<div id="table-of-contents"></div>


## Browser Compatibility

Reef works in all modern browsers. That means:

- The latest versions of Edge, Chrome, Firefox, and Safari.
- Mobile Safari, Chrome, and Firefox on Safari.
- WebView, Chrome, and Firefox for Android.

If you need to support older browsers, you'll need to transpile your code into ES5 with [BabelJS](https://babeljs.io/).



## License

The code is available under the [MIT License](/mit).



## Changelog

You can find all available versions [under releases](https://github.com/cferdinandi/reef/releases).

**Version 12 (current version) shifts to small, decoupled utility functions.**

- Removed `new Reef()` constructor and component-focused API.
- Added three small utility functions: `store()`, `render()`, and `component()`.
- Focused on more vanilla JS oriented developer experience.
- Removed support for AMD modules.

**[Version 11](/v11) improves the developer experience.**

- Removed `getters` (which were causing confusion).
- Removed `Reef.clone()`, `Reef.emit()`, and `Reef.err()` methods.
- Updated nested components for easier use.
- Added ability to attach event listeners directly to elements in templates.
- Updated dynamic and default form values to use `@` and `#` for better ergonomics.

**[Version 10](/v10) brings more layout control.**

- Template `data` is allowed to contain HTML by default.
- The sanitization engine has been updated to be more robust.
- `on*` attributes are no longer allowed on elements.
- Components can now use both a shared `store` _and_ local `data`.

**[Version 9](/v9) reduces under-the-hood complexity.**

- Large refactor to reduce abstractions for improved performance and reduced file size.
- Removed all router options.

**[Version 8](/v8) brings more predictability and convenience when building interactive UIs.**

- Added `reef-checked`, `reef-selected`, and `reef-value` attributes (and `reef-default-*` versions) for more predictable form field behavior.
- Added new helper methods for more accurate type checking and throwing errors.
- Improved DOM diffing under-the-hood.
- Fixed router issues with module bundlers.
- Improved control for route titles.
- Dropped legacy browser support.

**[Version 7](/v7) introduces new tools for managing more complex applications.**

- Added `new Reef.Store()` *data store* constructor for reactive shared state.
- Added `getter` and `setter` functions for more fine-grained control over how data flows in and out of components.
- Improved process for attaching nested components to parent components.
- Removed the `clone()` method on individual components (the global `Reef.clone()` method still exists).

**[Version 6](/v6) completely changes how data reactivity works.**

- Component data is now directly reactive.
- The `setData()` and `getData()` methods (previously used for reactivity) have been removed.
- You can get an immutable copy of your data with the `clone()` method.
- Added an `emit()` method for emitting custom events.
- IE support now requires polyfills or transpiling.

**[Version 5](/v5) adds new build system and filename structure,**

- Specific named versions for ES modules, AMD, and CommonJS.
- Default build is browser-only.
- ES modules now natively supported.

**[Version 4](/v4) adds better performance and XSS protection.**

- Data is once again automatically encoded to help protect you from cross-site scripting (XSS) attacks.
- Changes to diffing and rendering reduce reflows and improve performance.
- Support pushed back even further to IE9.
- *Deprecated:* Custom sanitizer methods were removed in favor of built-in, automated HTML encoding. You can still add custom sanitization within template functions.

**[Version 3](/v3) removes built-in sanitization.**

- Automatic sanitization has been removed. *HTML templates are unsanitized by default.*
- Two new hooks to add sanitization to your components have been added. This provides more developer flexibility and keeps Reef as lightweight as possible.

**[Version 2](/v2) adds a better sanitizing engine and markup support.**

- [DOMPurify](https://github.com/cure53/DOMPurify) is now the template sanitizing engine.
- The *attribute exceptions* feature has been removed in favor of DOMPurify's configuration options. The `addAttributes()` and `removeAttributes()` methods no longer exist.
- Reef now offers a smaller *unsafe* version for UIs that don't use any third-party or user-provided content. It does *not* sanitize templates before rendering, so use with caution.
- SVGs are now properly supported and will render correctly.

**[Version 1](/v1) removed polyfill dependencies.**

- All polyfills have been removed and are no longer needed. This is a breaking change, as the `.polyfill` versions of scripts no longer exist.

**Version 0.2 introduced some big new features.**

- Data reactivity and automatically updating UI
- Support for nested components
- Shared state support (with data reactivity!)
- Custom attribute exceptions for your templates

{{<cta for="bio-short">}}

{{<mailchimp intro="true">}}