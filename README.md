# Testing React App with Testing Library and Mock Service Worker

A simple example on testing React applications using Testing Library and Mock Service Worker.

# Why [Mock Service Worker](https://mswjs.io/)?

Intercepts network requests made by FE app. Mock different responses made to API endpoints to account for different scenarios that FE app needs to account for. This includes, not found, server error, different responses for /posts where API returns empty array or an array of posts.

Easier to mock API responses as compared to mocking a component's dependencies.

# Getting Started

- `npm i`
- `npm run start:json-server` spins up a json server to handle API calls for application
- `npm run test:coverage` to watch test files and view coverage
- `npm run test:report` to view test coverage

# Notes

### What to avoid with Testing Library?

> <br>
> Testing Library encourages you to avoid testing implementation details like the internals of a component you're testing (though it's still possible). The Guiding Principles of this library emphasize a focus on tests that closely resemble how your web pages are interacted by the users. <br><br>
> 
> 1. Internal state of a component 
> 2. Internal methods of a component
> 3. Lifecycle methods of a component
> 4. Child components
> <br>

### Accessing elements in the DOM

Syntax: `[command][single element or multiple elements][query type]`.

- Command
  - `get`: expects element to be in the DOM
  - `query`: expects element **NOT** to be in the DOM
  - `find`: expects element to appear **async** ie **await** is necessary

- Single element or multiple elements
  - `By`: single element
  - `AllBy`: multiple elements

- Query type (in order of priority)
  - `Role`: based on accessibility tree
  - `LabelText`: `<label>` for form fields such as `<select>`, `<input>`
  - `PlaceholderText`: last resort since every form field should have an accompanying label
  - `Text`: for non-interactive elements such as `<div>`, `<span>`, and `<p>`
  - `DisplayValue`: current value of a form element
  - `AltText`: elements that support `alt` attribute such as `<img>`
  - `Title`: not consistently read by screenreaders
  - `TestId` LAST LAST resort by adding the attribute “data-testid” to element

### Accessing `<input type="password">` element

Since password input field is of `<input type="password">`, the password field cannot be accessed through the role `textbox`. Therefore, to access the password input field and interact with it in Testing Library, access it through `LabelText` instead:

```ts
const passwordInput = screen.getByLabelText(/password/i);
userEvent.type(passwordInput, "password1");
```

# Articles & References

### Accessibility
- [What do we recommend people do for elements that have no implicit role (like input[type=password])](https://github.com/testing-library/dom-testing-library/issues/567)

### Testing Library
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Fix the "not wrapped in act(...)" warning](https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning)

### MSW
- [Pause MSW response](https://stackoverflow.com/questions/71182668/how-to-pause-the-mock-service-worker-for-testing-the-intermediate-state-in-reac)