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

Reef works in all modern browsers, and IE 9 and above.

<p class="margin-bottom-small"><strong>For IE support, you need to either...</strong></p>

- Use the `.polyfill` build of Reef, or
- Include your own polyfills for Proxies and the CustomEvent() object, or
- Transpile your code into ES5 with BabelJS.

## License

The code is available under the [MIT License](/mit).

## Changelog

You can find all available versions [under releases](https://github.com/cferdinandi/reef/releases).

**Version 6 (current version) completely changes how data reactivity works.**

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

{{<about-me>}}

{{<mailchimp intro="true">}}