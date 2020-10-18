# testing-library-selector

Selectors for @testing-library. Define selectors for ui items that can be reused inside the same test or between tests. Full typescript support.

```javascript
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { byRole, byLabelText } from 'testing-library-selector';

test('using vanilla queries', async () => {
  const usernameInput = await screen.findByLabelText('Username');
  const passwordInput = await screen.findByLabelText('Password');
  const submitButton = await screen.findByRole('button', { name: 'Log in' });
  expect(screen.getByText('Welcome, Bob!')).not.toBeInDocument();

  expect(submitButton).toBeDisabled();
  userEvent.type(usernameInput, 'bob');
  userEvent.type(usernameInput, 'password123');
  expect(submitButton).not.toBeDisabled();
  userEvent.click(submitButton);

  await screen.findByText('Welcome, Bob!');
  expect(screen.getByLabelText('Username')).not.toBeInDocument();
  expect(screen.getByLabelText('Password')).not.toBeInDocument();
  expect(screen.getByRole('button', { name: 'Log in' })).not.toBeInDocument();
});

test('using testing-library-selector', async () => {
  const page = {
    username: byLabelText('Username'),
    password: byLabelText('Password'),
    submit: byRole('button', { name: 'Log in' }),
    welcomeMessage: byText('Welcome, Bob!'),
  };

  const usernameInput = await page.username.find();
  const passwordInput = await page.password.find();
  const submitButton = await page.submit.find();
  expect(page.welcomeMessage.get()).not.toBeInDocument();

  expect(submitButton).toBeDisabled();
  userEvent.type(usernameInput, 'bob');
  userEvent.type(usernameInput, 'password123');
  expect(submitButton).not.toBeDisabled();
  userEvent.click(submitButton);

  await page.welcomeMessage.find();
  expect(page.username.get()).not.toBeInDocument();
  expect(page.username.get()).not.toBeInDocument();
});
```

# Scoping to element

By default elements will be scoped to `screen`, but `.get`, `.find`, and other methods accept a container param:

```javascript
const page = {
  modal: byTestId('my-modal'),
  saveButton: byRole('button', { name: 'Save' }),
};

const modal = await page.modal.find();
userEvent.click(page.saveButton.get(modal)); // get a save button inside a modal
```
