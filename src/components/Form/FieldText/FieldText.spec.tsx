import { expect, test, vi } from 'vitest';
import { z } from 'zod';

import { render, screen, setupUser } from '@/lib/test-utils';

import { FormField } from '..';
import { FormMocked } from '../form-test-utils';

test('update value', async () => {
  const user = setupUser();
  const mockedSubmit = vi.fn();

  render(
    <FormMocked
      schema={z.object({ name: z.string() })}
      useFormOptions={{ defaultValues: { name: '' } }}
      onSubmit={mockedSubmit}
    >
      {({ form }) => (
        <FormField
          type="text"
          control={form.control}
          name="name"
          label="Name"
        />
      )}
    </FormMocked>
  );
  const input = screen.getByLabelText<HTMLInputElement>('Name');
  await user.type(input, 'new value');
  expect(input.value).toBe('new value');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(mockedSubmit).toHaveBeenCalledWith({ name: 'new value' });
});

test('default value', async () => {
  const user = setupUser();
  const mockedSubmit = vi.fn();
  render(
    <FormMocked
      schema={z.object({ name: z.string() })}
      useFormOptions={{
        defaultValues: {
          name: 'default value',
        },
      }}
      onSubmit={mockedSubmit}
    >
      {({ form }) => (
        <FormField
          type="text"
          control={form.control}
          name="name"
          label="Name"
        />
      )}
    </FormMocked>
  );
  const input = screen.getByLabelText<HTMLInputElement>('Name');
  expect(input.value).toBe('default value');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(mockedSubmit).toHaveBeenCalledWith({ name: 'default value' });
  await user.clear(input);
  await user.type(input, 'new value');
  expect(input.value).toBe('new value');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(mockedSubmit).toHaveBeenCalledWith({ name: 'new value' });
});
