# testing-library-selector

Reusable selectors for @testing-library. Define selectors for ui elements that can be reused inside the same test or between tests. Full typescript support.

## Install

```sh
npm install --save-dev testing-library-selector
yarn add -D testing-library-selector
```

## Usage

```typescript
import { byLabelText, byRole, byTestId } from './selector';

// define reusable selectors
const ui = {
  container: byTestId('my-container'),
  submitButton: byRole('button', { name: 'Submit' }),
  usernameInput: byLabelText('Username:'),

  // can encode more specific html element type
  passwordInput: byLabelText<HTMLInputElement>('Password:'),
};

// reuse them in the same test or across multiple tests by calling
// .get(), .getAll(), .find(), .findAll(), .query(), .queryAll()
it('example test', async () => {
  // by default elements will be queried against screen
  await ui.submitButton.find();
  expect(ui.submitButton.query()).not.toBeInDocument();
  expect(ui.submitButton.get()).toBeInDocument();

  const containers = ui.container.getAll();
  expect(containers).toHaveLength(3);

  // provide a container as first param to query element inside that container
  const username = ui.usernameInput.get(containers[0]);
});
```
