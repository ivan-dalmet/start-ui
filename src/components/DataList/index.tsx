import React, {
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionProps,
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Flex,
  FlexProps,
  Skeleton,
  Stack,
  Wrap,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCw } from 'react-icons/lu';

type DataListColumns = Record<string, DataListCellProps>;
type DataListContextValue = {
  setColumns: React.Dispatch<React.SetStateAction<DataListColumns>>;
  columns: DataListColumns;
  isHover: boolean;
};
type DataListHeaderContextValue = boolean;

export const DataListContext = React.createContext<DataListContextValue | null>(
  null
);

const useDataListContext = () => {
  const context = useContext(DataListContext);
  if (context === null) {
    throw new Error('Missing parent <DataList> component');
  }
  return context;
};

export const DataListHeaderContext =
  React.createContext<DataListHeaderContextValue>(false);

export type DataListCellProps = FlexProps & {
  colName?: string;
  colWidth?: string | number | Record<string, string | number>;
  isVisible?: boolean | boolean[] | Record<string, boolean>;
};

export const DataListCell = ({
  children,
  colName,
  colWidth = 1,
  isVisible = true,
  ...rest
}: DataListCellProps) => {
  const { columns, setColumns } = useDataListContext();
  const isInHeader = useContext(DataListHeaderContext);
  const restRef = useRef(rest);
  restRef.current = rest;

  useEffect(() => {
    if (isInHeader && colName) {
      setColumns((prevColumns) => ({
        ...prevColumns,
        [colName]: { colWidth, isVisible, ...restRef.current },
      }));
    }
  }, [isInHeader, colName, colWidth, isVisible, setColumns]);

  const headerProps = !isInHeader ? columns?.[colName ?? ''] ?? {} : {};
  const {
    isVisible: _isVisible = true,
    colWidth: _colWidth = true,
    ...cellProps
  } = {
    colWidth,
    isVisible,
    ...headerProps,
    ...rest,
  };

  const showCell = useBreakpointValue(
    typeof _isVisible === 'object' ? _isVisible : { base: _isVisible }
  );

  const cellWidth =
    useBreakpointValue(
      typeof _colWidth === 'object' ? _colWidth : { base: _colWidth }
    ) ?? 0;

  if (!showCell) return null;

  const isWidthUnitless = /^[0-9.]+$/.test(String(cellWidth));

  return (
    <Flex
      direction="column"
      minW={!isWidthUnitless ? String(cellWidth) : 0}
      flexBasis={
        isWidthUnitless ? `${Number(cellWidth) * 100}%` : String(cellWidth)
      }
      py="2"
      px="3"
      align="flex-start"
      justifyContent="center"
      {...cellProps}
    >
      {children}
    </Flex>
  );
};

export const DataListAccordion = ({ ...rest }) => {
  return <AccordionItem border="none" {...rest} />;
};

export const DataListAccordionButton = ({ ...rest }) => {
  return (
    <AccordionButton
      role="group"
      p="0"
      textAlign="left"
      _focusVisible={{ outline: 'none' }}
      _hover={{}}
      {...rest}
    />
  );
};

export const DataListAccordionIcon = ({ ...rest }) => {
  return (
    <AccordionIcon
      borderRadius="full"
      _groupFocusVisible={{ boxShadow: 'outline' }}
      {...rest}
    />
  );
};

export const DataListAccordionPanel = ({ ...rest }) => {
  return (
    <AccordionPanel
      boxShadow="inner"
      px="4"
      py="3"
      bg="gray.50"
      _dark={{ bg: 'blackAlpha.300' }}
      {...rest}
    />
  );
};

export type DataListRowProps = FlexProps & {
  isVisible?: boolean | boolean[] | Record<string, boolean>;
  isDisabled?: boolean;
};

export const DataListRow: FC<React.PropsWithChildren<DataListRowProps>> = ({
  isVisible = true,
  isDisabled = false,
  ...rest
}) => {
  const { isHover } = useDataListContext();
  const showRow = useBreakpointValue(
    typeof isVisible === 'object' ? isVisible : { base: isVisible }
  );
  const disabledProps = isDisabled
    ? {
        bg: 'gray.50',
        _dark: { borderBottomColor: 'gray.900', bg: 'gray.800' },
        _hover: {},
        _focusVisible: {},
        'aria-disabled': true,
        opacity: '1 !important',
        css: {
          '> *': {
            opacity: 0.3,
          },
        },
      }
    : {};
  return (
    <Flex
      display={!showRow ? 'none' : undefined}
      position="relative"
      borderBottom="1px solid"
      borderBottomColor="gray.100"
      transition="0.2s"
      _dark={{
        borderBottomColor: 'gray.900',
        _hover: isHover ? { bg: 'blackAlpha.200' } : undefined,
      }}
      _hover={isHover ? { bg: 'gray.50' } : undefined}
      {...disabledProps}
      {...rest}
    />
  );
};

export type DataListHeaderProps = DataListRowProps;

export const DataListHeader: FC<
  React.PropsWithChildren<DataListHeaderProps>
> = ({ ...rest }) => {
  return (
    <DataListHeaderContext.Provider value={true}>
      <DataListRow
        fontSize="xs"
        fontWeight="bold"
        color="gray.500"
        borderBottom="1px solid"
        borderBottomColor="gray.100"
        _hover={{}}
        _dark={{ color: 'gray.400', borderBottomColor: 'gray.900' }}
        {...rest}
      />
    </DataListHeaderContext.Provider>
  );
};

export type DataListFooterProps = DataListRowProps;

export const DataListFooter: FC<
  React.PropsWithChildren<DataListFooterProps>
> = ({ ...rest }) => {
  return (
    <Box mt="auto">
      <Flex
        fontSize="sm"
        mt="-1px"
        p="2"
        align="center"
        borderTop="1px solid"
        borderTopColor="gray.100"
        color="gray.600"
        _dark={{
          color: 'gray.300',
          borderTopColor: 'gray.900',
        }}
        {...rest}
      />
    </Box>
  );
};

export type DataListErrorStateProps = {
  title?: ReactNode;
  children?: ReactNode;
  retry?: () => void;
};

export const DataListErrorState = (props: DataListErrorStateProps) => {
  const { t } = useTranslation(['components']);
  return (
    <DataListRow>
      <DataListCell>
        <Alert status="error">
          <AlertTitle>
            {props.title ?? t('components:datalist.errorTitle')}
          </AlertTitle>
          {(!!props.children || !!props.retry) && (
            <AlertDescription>
              <Wrap spacingX={2} spacingY={1}>
                {!!props.children && (
                  <Box alignSelf="center">{props.children}</Box>
                )}
                {!!props.retry && (
                  <Button
                    colorScheme="error"
                    variant="ghost"
                    size="sm"
                    leftIcon={<LuRefreshCw />}
                    onClick={() => props.retry?.()}
                  >
                    {t('components:datalist.retry')}
                  </Button>
                )}
              </Wrap>
            </AlertDescription>
          )}
        </Alert>
      </DataListCell>
    </DataListRow>
  );
};

export type DataListEmptyStateProps = {
  title?: ReactNode;
  children?: ReactNode;
  searchTerm?: string;
};

export const DataListEmptyState = (props: DataListEmptyStateProps) => {
  const { t } = useTranslation(['components']);
  return (
    <DataListRow
      flex={1}
      opacity={1}
      _hover={{ bg: 'transparent', _dark: { bg: 'transparent' } }}
    >
      <DataListCell>
        <Flex
          flex={1}
          w="full"
          justifyContent="center"
          alignItems="center"
          fontSize="sm"
          fontWeight="semibold"
          color="gray.500"
          _dark={{ color: 'gray.300' }}
        >
          {props.title ?? props.searchTerm
            ? t('components:datalist.noResultsTitle', {
                searchTerm: props.searchTerm,
              })
            : t('components:datalist.emptyTitle')}
          {!!props.children && props.children}
        </Flex>
      </DataListCell>
    </DataListRow>
  );
};

export const DataListLoadingState = () => {
  return (
    <>
      <DataListRow>
        <DataListCell>
          <Stack w="full" opacity={0.6} p={2}>
            <Skeleton w="30%" h={2} noOfLines={1} />
            <Skeleton w="20%" h={2} noOfLines={1} />
          </Stack>
        </DataListCell>
      </DataListRow>
      <DataListRow>
        <DataListCell>
          <Stack w="full" opacity={0.4} p={2}>
            <Skeleton w="30%" h={2} noOfLines={1} />
            <Skeleton w="20%" h={2} noOfLines={1} />
          </Stack>
        </DataListCell>
      </DataListRow>
      <DataListRow>
        <DataListCell>
          <Stack w="full" opacity={0.2} p={2}>
            <Skeleton w="30%" h={2} noOfLines={1} />
            <Skeleton w="20%" h={2} noOfLines={1} />
          </Stack>
        </DataListCell>
      </DataListRow>
    </>
  );
};

export type DataListProps = AccordionProps & {
  isHover?: boolean;
};

export const DataList: FC<React.PropsWithChildren<DataListProps>> = ({
  allowMultiple = true,
  allowToggle = false,
  isHover = true,
  ...rest
}) => {
  const [columns, setColumns] = useState<DataListColumns>({});
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <DataListContext.Provider
      value={{
        setColumns,
        columns,
        isHover,
      }}
    >
      <Accordion
        display="flex"
        flexDirection="column"
        position="relative"
        boxShadow="card"
        borderRadius="md"
        overflowX="auto"
        overflowY="hidden"
        minH="10rem"
        allowMultiple={allowMultiple && !allowToggle}
        allowToggle={allowToggle}
        bg="white"
        border="1px solid"
        borderColor="gray.100"
        _dark={{
          bg: 'gray.800',
          borderColor: 'gray.800',
        }}
        ref={listRef}
        {...rest}
      />
    </DataListContext.Provider>
  );
};
