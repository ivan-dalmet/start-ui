import React from 'react';

import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuBookMarked, LuPlus } from 'react-icons/lu';
import { Link, useSearchParams } from 'react-router-dom';

import {
  DataList,
  DataListCell,
  DataListEmptyState,
  DataListErrorState,
  DataListFooter,
  DataListLoadingState,
  DataListRow,
} from '@/components/DataList';
import { Icon } from '@/components/Icons';
import { Page, PageContent } from '@/components/Page';
import {
  Pagination,
  PaginationButtonFirstPage,
  PaginationButtonLastPage,
  PaginationButtonNextPage,
  PaginationButtonPrevPage,
  PaginationInfo,
} from '@/components/Pagination';
import { RepositoryActions } from '@/features/repositories/RepositoryActions';
import { useRepositoryList } from '@/features/repositories/service';

export default function PageRepositories() {
  const { t } = useTranslation(['repositories']);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +(searchParams?.get('page') || 1);

  const pageSize = 20;
  const repositories = useRepositoryList({
    page: page - 1,
    size: pageSize,
  });

  return (
    <Page containerSize="lg">
      <PageContent>
        <HStack mb="4">
          <Box flex="1">
            <Heading size="md">{t('repositories:list.title')}</Heading>
          </Box>
          <Box>
            <Button
              display={{ base: 'none', sm: 'flex' }}
              as={Link}
              to="/repositories/create"
              variant="@primary"
              leftIcon={<LuPlus />}
            >
              {t('repositories:list.actions.createRepository')}
            </Button>
            <IconButton
              display={{ base: 'flex', sm: 'none' }}
              aria-label={t('repositories:list.actions.createRepository')}
              as={Link}
              to="/repositories/create"
              size="sm"
              variant="@primary"
              icon={<LuPlus />}
            />
          </Box>
        </HStack>

        <DataList>
          {repositories.isLoading && <DataListLoadingState />}
          {repositories.isError && (
            <DataListErrorState
              title={t('repositories:feedbacks.loadingRepositoryError.title')}
              retry={() => repositories.refetch()}
            />
          )}
          {repositories.isSuccess && !repositories.data.repositories.length && (
            <DataListEmptyState />
          )}
          {repositories.data?.repositories?.map((repository) => (
            <DataListRow as={LinkBox} key={repository.id}>
              <DataListCell colWidth={1} colName="name">
                <HStack maxW="100%">
                  <Icon
                    icon={LuBookMarked}
                    fontSize="2xl"
                    color="gray.500"
                    _dark={{ color: 'gray.400' }}
                    marginX={1}
                  />
                  <Box minW="0">
                    <Text noOfLines={1} maxW="full" fontWeight="bold">
                      <LinkOverlay
                        as={Link}
                        to={`/repositories/${repository.id}`}
                      >
                        {repository.name}
                      </LinkOverlay>
                    </Text>

                    <Text
                      noOfLines={1}
                      maxW="full"
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: 'gray.300' }}
                      _hover={{ textDecoration: 'underline' }}
                    >
                      {repository.link}
                    </Text>
                  </Box>
                </HStack>
              </DataListCell>
              <DataListCell
                colWidth={1}
                colName="description"
                isVisible={{ base: false, md: true }}
              >
                <Text noOfLines={2} fontSize="sm">
                  {repository.description}
                </Text>
              </DataListCell>
              <DataListCell colWidth="4rem" colName="actions">
                <RepositoryActions repository={repository} />
              </DataListCell>
            </DataListRow>
          ))}
          <DataListFooter>
            <Pagination
              isLoadingPage={repositories.isLoadingPage}
              setPage={(newPage) =>
                setSearchParams({ page: newPage.toString() })
              }
              page={page}
              pageSize={pageSize}
              totalItems={repositories.data?.totalItems}
            >
              <PaginationButtonFirstPage />
              <PaginationButtonPrevPage />
              <PaginationInfo flex="1" />
              <PaginationButtonNextPage />
              <PaginationButtonLastPage />
            </Pagination>
          </DataListFooter>
        </DataList>
      </PageContent>
    </Page>
  );
}