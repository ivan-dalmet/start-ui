import React, { ReactNode } from 'react';

import { FieldProps, useField } from '@formiz/core';
import { GroupBase, MultiValue, SingleValue } from 'react-select';

import { FormGroup, FormGroupProps } from '@/components/FormGroup';
import { Select, SelectProps } from '@/components/Select';

export type FieldSelectProps<
  Option extends { label: ReactNode; value: unknown },
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = FieldProps<
  IsMulti extends true ? Array<Option['value']> : Option['value']
> &
  FormGroupProps & {
    options: Option[];
    componentProps?: SelectProps<Option, IsMulti, Group>;
  };

export const FieldSelect = <
  Option extends { label: ReactNode; value: unknown },
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: FieldSelectProps<Option, IsMulti, Group>
) => {
  const field = useField(props);

  const { componentProps, children, options, ...rest } = field.otherProps;

  const formGroupProps = {
    ...rest,
    errorMessage: field.errorMessage,
    id: field.id,
    isRequired: field.isRequired,
    showError: field.shouldDisplayError,
  };

  const fieldValue = field.value;

  // If we are in creatable mode, the onChange will add values to the Formiz value state
  // value is an Array so we filter the options to make sure we don't double it in the "label" section
  const getCreatedValues = () =>
    Array.isArray(fieldValue) &&
    (componentProps?.type === 'creatable' ||
      componentProps?.type === 'async-creatable')
      ? fieldValue
          // We do not want already available options, so we filter them.
          .filter((v) => !options.map((o) => o.value).includes(v))
          // We need to map the created values so they match the Option format
          .map((v) => ({ label: v, value: v }) as Option)
      : [];

  // We compute the final value.
  // If the FieldSelect is in multi mode, the value is an Array
  // If the FieldSelect is not in multi mode, then the value is a single element
  const finalValue = Array.isArray(fieldValue)
    ? [
        ...(options?.filter((option) => fieldValue?.includes(option.value)) ??
          []),
        ...getCreatedValues(),
      ]
    : options?.find((option) => option.value === fieldValue) ?? undefined;

  return (
    <FormGroup {...formGroupProps}>
      <Select<Option, IsMulti, Group>
        {...componentProps}
        id={field.id}
        value={finalValue}
        onFocus={() => field.setIsTouched(false)}
        onBlur={() => field.setIsTouched(true)}
        placeholder={componentProps?.placeholder ?? 'Select...'}
        onChange={(fieldValue) => {
          if (isMultiValue<Option>(fieldValue)) {
            field.setValue(
              fieldValue.length
                ? (fieldValue.map((f) => f.value) as TODO)
                : null
            );
          } else {
            field.setValue(fieldValue ? (fieldValue.value as TODO) : null);
          }
        }}
        options={options}
      />
      {children}
    </FormGroup>
  );
};

function isMultiValue<Option extends { label: ReactNode; value: unknown }>(
  value: MultiValue<Option> | SingleValue<Option>
): value is MultiValue<Option> {
  return Array.isArray(value);
}
