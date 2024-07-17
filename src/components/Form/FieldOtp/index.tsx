import { useRef } from 'react';

import {
  HStack,
  PinInput,
  PinInputField,
  PinInputProps,
} from '@chakra-ui/react';
import {
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

import { FieldCommonProps, useFormField } from '@/components/Form/FormField';
import { FormFieldError } from '@/components/Form/FormFieldError';

type PinInputRootProps = Pick<
  PinInputProps,
  'size' | 'autoFocus' | 'onComplete'
>;

export type FieldOtpProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  type: 'otp';
  length?: number;
  autoSubmit?: boolean;
  pinInputProps?: RemoveFromType<
    RemoveFromType<
      Omit<PinInputProps, 'isDisabled' | 'isInvalid' | 'children'>,
      PinInputRootProps
    >,
    ControllerRenderProps
  >;
} & PinInputRootProps &
  FieldCommonProps<TFieldValues, TName>;

export const FieldOtp = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FieldOtpProps<TFieldValues, TName>
) => {
  const { isDisabled, id } = useFormField();
  const stackRef = useRef<HTMLDivElement>(null);
  return (
    <Controller
      {...props}
      render={({ field: { ref, ...field }, fieldState, formState }) => (
        <>
          <HStack ref={stackRef}>
            <PinInput
              autoFocus={props.autoFocus}
              size={props.size}
              placeholder="·"
              isInvalid={fieldState.invalid}
              isDisabled={isDisabled}
              otp
              id={id}
              onComplete={(v) => {
                props.onComplete?.(v);
                // Only auto submit on first try
                if (!formState.isSubmitted && props.autoSubmit) {
                  const button = document.createElement('button');
                  button.type = 'submit';
                  button.style.display = 'none';
                  stackRef.current?.append(button);
                  button.click();
                  button.remove();
                }
              }}
              {...props.pinInputProps}
              {...field}
            >
              {Array.from({ length: props.length ?? 6 }).map((_, index) => (
                <PinInputField ref={ref} flex={1} key={index} />
              ))}
            </PinInput>
          </HStack>
          <FormFieldError />
        </>
      )}
    />
  );
};
