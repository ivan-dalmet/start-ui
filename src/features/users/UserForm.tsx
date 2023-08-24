import React from 'react';

import { Card, CardBody, Stack } from '@chakra-ui/react';
import {
  isEmail,
  isMaxLength,
  isMinLength,
  isPattern,
} from '@formiz/validations';
import { useTranslation } from 'react-i18next';

import { FieldCheckboxes } from '@/components/FieldCheckboxes';
import { FieldInput } from '@/components/FieldInput';
import { FieldSelect } from '@/components/FieldSelect';
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE_KEY,
} from '@/lib/i18n/constants';

const AUTHORITIES = ['ROLE_ADMIN', 'ROLE_USER'] as const;

export type UserFormFields = {
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  langKey?: string;
  authorities: Array<(typeof AUTHORITIES)[number]>;
};

export const UserForm = () => {
  const { t } = useTranslation(['common', 'users']);

  const authorities = AUTHORITIES.map((value) => ({ value }));
  return (
    <Card>
      <CardBody>
        <Stack spacing={4}>
          <FieldInput
            name="login"
            label={t('users:data.login.label')}
            required={t('users:data.login.required')}
            validations={[
              {
                handler: isMinLength(2),
                message: t('users:data.login.tooShort', { min: 2 }),
              },
              {
                handler: isMaxLength(50),
                message: t('users:data.login.tooLong', { max: 50 }),
              },
              {
                handler: isPattern(
                  '^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'
                ),
                message: t('users:data.login.invalid'),
              },
            ]}
          />
          <Stack direction={{ base: 'column', sm: 'row' }} spacing="6">
            <FieldInput
              name="firstName"
              label={t('users:data.firstname.label')}
            />
            <FieldInput
              name="lastName"
              label={t('users:data.lastname.label')}
            />
          </Stack>
          <FieldInput
            name="email"
            label={t('users:data.email.label')}
            required={t('users:data.email.required')}
            validations={[
              {
                handler: isMinLength(5),
                message: t('users:data.email.tooShort', { min: 5 }),
              },
              {
                handler: isMaxLength(254),
                message: t('users:data.email.tooLong', { min: 254 }),
              },
              {
                handler: isEmail(),
                message: t('users:data.email.invalid'),
              },
            ]}
          />
          <FieldSelect
            name="langKey"
            label={t('users:data.language.label')}
            options={AVAILABLE_LANGUAGES.map(({ key }) => ({
              label: t(`common:languages.${key}`),
              value: key,
            }))}
            defaultValue={DEFAULT_LANGUAGE_KEY}
          />
          <FieldCheckboxes
            name="authorities"
            label={t('users:data.authorities.label')}
            options={authorities}
            required={t('users:data.authorities.required')}
          />
        </Stack>
      </CardBody>
    </Card>
  );
};
