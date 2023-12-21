import React from 'react';

import { Box, Button, Stack } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';

import { FieldSelect } from '.';

const colors = [
  { label: 'Red', value: 'red' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Blue', value: 'blue' },
];

export default {
  title: 'Fields/FieldSelect',
};

export const Default = () => {
  const form = useForm({ onSubmit: console.log });
  return (
    <Formiz connect={form} autoForm>
      <Stack spacing={4}>
        <FieldSelect
          name="colors"
          label="Colors"
          helper="This is an helper"
          required="Color is required"
          options={colors}
          componentProps={{ placeholder: 'Placeholder' }}
        />
        <Box>
          <Button type="submit">Submit</Button>
        </Box>
      </Stack>
    </Formiz>
  );
};

export const Disabled = () => {
  const form = useForm({ onSubmit: console.log });
  return (
    <Formiz connect={form} autoForm>
      <Stack spacing={4}>
        <FieldSelect
          name="colors"
          label="Colors"
          helper="This is an helper"
          options={colors}
          isDisabled
          componentProps={{ placeholder: 'Placeholder' }}
        />
        <Box>
          <Button type="submit">Submit</Button>
        </Box>
      </Stack>
    </Formiz>
  );
};

export const DefaultValue = () => {
  const form = useForm({ onSubmit: console.log });
  return (
    <Formiz connect={form} autoForm>
      <Stack spacing={4}>
        <FieldSelect
          name="colors"
          label="Colors"
          helper="This is an helper"
          required="Color is required"
          defaultValue={colors[0]?.value}
          options={colors}
          componentProps={{ isClearable: true, placeholder: 'Placeholder' }}
        />
        <Box>
          <Button type="submit">Submit</Button>
        </Box>
      </Stack>
    </Formiz>
  );
};

export const OptionsColorScheme = () => {
  const form = useForm<{ colors: string }>({ onSubmit: console.log });

  return (
    <Formiz connect={form} autoForm>
      <Stack spacing={4}>
        <FieldSelect
          name="colors"
          label="Colors"
          helper="This is an helper"
          required="Color is required"
          options={colors}
          componentProps={{
            isClearable: true,
            selectedOptionColorScheme: 'red',
            placeholder: 'Placeholder',
          }}
        />
        <Box>
          <Button type="submit">Submit</Button>
        </Box>
      </Stack>
    </Formiz>
  );
};

export const CreateableMultiSelect = () => {
  const form = useForm({ onSubmit: console.log });
  return (
    <Formiz connect={form} autoForm>
      <Stack spacing={4}>
        <FieldSelect
          name="colors"
          label="Colors"
          helper="This is an helper"
          required="Color is required"
          options={colors}
          componentProps={{
            isMulti: true,
            type: 'creatable',
            placeholder: 'Placeholder',
          }}
        />
        <Box>
          <Button type="submit">Submit</Button>
        </Box>
      </Stack>
    </Formiz>
  );
};

export const DefaultValueCreateableMultiSelect = () => {
  const form = useForm({
    onSubmit: console.log,
  });
  return (
    <Formiz connect={form} autoForm>
      <Stack spacing={4}>
        <FieldSelect
          name="colors"
          label="Colors"
          helper="This is an helper"
          required="Color is required"
          options={colors}
          defaultValue={['red', 'blue']}
          componentProps={{
            isMulti: true,
            type: 'creatable',
            placeholder: 'Placeholder',
          }}
        />
        <Box>
          <Button type="submit">Submit</Button>
        </Box>
      </Stack>
    </Formiz>
  );
};

export const InitialValuesCreateableMultiSelect = () => {
  const form = useForm({
    onSubmit: console.log,
    initialValues: { colors: ['red', 'blue'] },
  });
  return (
    <Formiz connect={form} autoForm>
      <Stack spacing={4}>
        <FieldSelect
          name="colors"
          label="Colors"
          helper="This is an helper"
          required="Color is required"
          options={colors}
          componentProps={{
            isMulti: true,
            type: 'creatable',
            placeholder: 'Placeholder',
          }}
        />
        <Box>
          <Button type="submit">Submit</Button>
        </Box>
      </Stack>
    </Formiz>
  );
};
