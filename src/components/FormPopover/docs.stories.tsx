import { useState } from 'react';

import { Box, Button, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { SubmitHandler } from 'react-hook-form';
import { LuChevronDown } from 'react-icons/lu';
import { P, match } from 'ts-pattern';
import { z } from 'zod';

import { FormField } from '@/components/Form';

import { FormPopover } from '.';

export default {
  title: 'Components/FormPopover',
};

type FilterStarterFormSchema = z.infer<
  ReturnType<typeof zFilterStarterFormSchema>
>;
const zFilterStarterFormSchema = () =>
  z.object({
    starter: z.string().nullable(),
  });

const options = ['Start UI [web]', 'Start UI [native]', 'Start UI [figma]'].map(
  (v) => ({
    label: v,
    value: v.toLocaleLowerCase(),
  })
);

// MARK: Default
export const Default = () => {
  const [value, setValue] = useState<string | null>(null);

  const handleSubmit: SubmitHandler<FilterStarterFormSchema> = (values) => {
    setValue(values.starter);
  };

  return (
    <FormPopover
      value={{ starter: value }}
      onSubmit={handleSubmit}
      schema={zFilterStarterFormSchema()}
      renderTrigger={({ onClick }) => (
        <Button onClick={onClick}>
          Starter{' '}
          {value ? (
            <> : {options.find((o) => o.value === value)?.label}</>
          ) : null}
        </Button>
      )}
    >
      {(form) => (
        <FormField
          // Provide the `control` so you can enjoy the `name` typings
          control={form.control}
          label="Starter"
          type="select"
          name="starter"
          options={options}
        />
      )}
    </FormPopover>
  );
};

// MARK: TriggerCustomization
export const WithTriggerCustomization = () => {
  const [value, setValue] = useState<string | null>(null);

  const handleSubmit: SubmitHandler<FilterStarterFormSchema> = (values) => {
    setValue(values.starter);
  };

  return (
    <FormPopover
      value={{ starter: value }}
      onSubmit={handleSubmit}
      schema={zFilterStarterFormSchema()}
      renderTrigger={({ onClick }) => (
        <Button
          variant={!!value ? '@secondary' : undefined}
          rightIcon={<LuChevronDown />}
          size="sm"
          onClick={onClick}
        >
          Starter{' '}
          {value ? (
            <> : {options.find((o) => o.value === value)?.label}</>
          ) : null}
        </Button>
      )}
    >
      {(form) => (
        <FormField
          // Provide the `control` so you can enjoy the `name` typings
          control={form.control}
          label="Starter"
          type="select"
          name="starter"
          options={options}
        />
      )}
    </FormPopover>
  );
};

// MARK: Filter clear and value
export const WithFilterClearAndValue = () => {
  const [value, setValue] = useState<string | null>('start ui [native]');

  const options = [
    'Start UI [web]',
    'Start UI [native]',
    'Start UI [figma]',
  ].map((v) => ({
    label: v,
    value: v.toLocaleLowerCase(),
  }));

  const handleSubmit: SubmitHandler<FilterStarterFormSchema> = (values) => {
    setValue(values.starter);
  };

  return (
    <FormPopover
      value={{ starter: value }}
      onSubmit={handleSubmit}
      schema={zFilterStarterFormSchema()}
      renderTrigger={({ onClick }) => (
        <Button
          variant={!!value ? '@secondary' : undefined}
          rightIcon={<LuChevronDown />}
          size="sm"
          onClick={onClick}
        >
          Starter{' '}
          {value ? (
            <> : {options.find((o) => o.value === value)?.label}</>
          ) : null}
        </Button>
      )}
      with={['reset']}
      onReset={() => setValue(null)}
    >
      {(form) => (
        <FormField
          // Provide the `control` so you can enjoy the `name` typings
          control={form.control}
          label="Starter"
          type="select"
          name="starter"
          options={options}
        />
      )}
    </FormPopover>
  );
};

type FilterStartersFormSchema = z.infer<
  ReturnType<typeof zFilterStartersFormSchema>
>;
const zFilterStartersFormSchema = () =>
  z.object({
    starters: z.array(z.string()).nullable(),
  });

// MARK: MultiSelect and value
export const WithMultiSelectAndValue = () => {
  const [value, setValue] = useState<Array<string>>(['start ui [figma]']);

  const options = [
    'Start UI [web]',
    'Start UI [native]',
    'Start UI [figma]',
  ].map((v) => ({
    label: v,
    value: v.toLocaleLowerCase(),
  }));

  const handleSubmit: SubmitHandler<FilterStartersFormSchema> = (values) => {
    setValue(values.starters ?? []);
  };

  const label = match(value.length)
    .with(P.not(P.number), () => null)
    .with(0, () => null)
    .with(1, () => (
      <> : {options.find((o) => value.includes(o.value))?.label}</>
    ))
    .otherwise(() => <> : {value.length}</>);

  return (
    <FormPopover
      onSubmit={handleSubmit}
      schema={zFilterStartersFormSchema()}
      value={{ starters: value }}
      renderTrigger={({ onClick }) => (
        <Button
          variant={value && value.length > 0 ? '@secondary' : undefined}
          rightIcon={<LuChevronDown />}
          size="sm"
          onClick={onClick}
        >
          Starters {label}
        </Button>
      )}
    >
      {(form) => (
        <FormField
          // Provide the `control` so you can enjoy the `name` typings
          control={form.control}
          type="multi-select"
          name="starters"
          options={options}
        />
      )}
    </FormPopover>
  );
};

type FilterDatesFormSchema = z.infer<ReturnType<typeof zFilterDatesFormSchema>>;
const zFilterDatesFormSchema = () =>
  z
    .object({
      start: z.date().nullable(),
      end: z.date().nullable(),
    })
    .refine(
      (values) => {
        if (!values.start || !values.end) {
          return true;
        }

        return values.start.getTime() <= values.end.getTime();
      },
      { path: ['end'], message: 'End date should be after start date' }
    );

// MARK: Date and validations
export const WithDateAndValidations = () => {
  const [value, setValue] = useState<FilterDatesFormSchema>({
    start: null,
    end: null,
  });

  const handleSubmit: SubmitHandler<FilterDatesFormSchema> = (values) => {
    setValue(values ?? { start: null, end: null });
  };

  const label = match(value)
    .with({ start: P.nonNullable, end: null }, ({ start }) => (
      <>: From {dayjs(start).format('DD/MM/YYYY')}</>
    ))
    .with({ start: null, end: P.nonNullable }, ({ end }) => (
      <>: To {dayjs(end).format('DD/MM/YYYY')}</>
    ))
    .with({ start: P.nonNullable, end: P.nonNullable }, ({ start, end }) => (
      <>
        : From {dayjs(start).format('DD/MM/YYYY')} to{' '}
        {dayjs(end).format('DD/MM/YYYY')}
      </>
    ))
    .otherwise(() => null);

  return (
    <Stack>
      <Box>
        <FormPopover
          onSubmit={handleSubmit}
          value={value}
          schema={zFilterDatesFormSchema()}
          with={['cancel']}
          renderTrigger={({ onClick }) => (
            <Button
              variant={
                !!value && (!!value.start || !!value.end)
                  ? '@secondary'
                  : undefined
              }
              onClick={onClick}
            >
              Range{label}
            </Button>
          )}
        >
          {() => (
            <>
              <FormField type="date" name="start" />
              <FormField type="date" name="end" />
            </>
          )}
        </FormPopover>
      </Box>
      <Text color="text-dimmed" fontSize="sm">
        Try to put the first date after the second one to check the schema
        validation
      </Text>
    </Stack>
  );
};
