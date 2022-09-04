# Testing React App with Testing Library and Mock Service Worker

TODO

# Getting Started

TODO


# Notes

### Accessing elements in the DOM

Syntax: `[command][single element or multiple elements][query type]`.

- Command
  - `get`: expects element to be in the DOM
  - `query`: expects element **NOT** to be in the DOM
  - `find`: expects element to appear **async** ie **await** is necessary

- Single element or multiple elements
  - `By`: single element
  - `AllBy`: multiple elements

- Query type
  - `Role`: based on accessibility tree
  - `LabelText`: `<label>` for form fields such as `<select>`, `<input>`
  - `PlaceholderText`: last resort since every form field should have an accompanying label
  - `Text`: for non-interactive elements such as `<div>`, `<span>`, and `<p>`
  - `DisplayValue`: current value of a form element
  - `AltText`: elements that support `alt` attribute such as `<img>`
  - `Title`: not consistently read by screenreaders
  - `TestId` LAST LAST resort by adding the attribute “data-testid” to element

# Articles & References

TODO