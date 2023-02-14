import { useEffect } from 'react'; // React
import {
  Box,
  Flex,
  Table as ChakraTable,
  Th,
  Td,
  Thead,
  Tbody,
  Tr,
  Center,
  VStack,
  Spinner,
  Text,
} from '@chakra-ui/react'; // Chakra UI
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'; // Chakra UI Icons
import { useTable, useSortBy } from 'react-table'; // React Table

// // Table Props
// type Props<T extends object> = {
//   readonly columns: Array<Column<T>>; // Depends on shape of data
//   readonly data: Array<T>; // Depends on shape of data
//   readonly loading?: boolean;
//   readonly onChangeSortOrder?: (sort: SortOptions) => unknown; // Callback after changing sorting
//   readonly onRowClick?: (row: T) => unknown;
// };

export default function Table(props){
  const { columns, data, loading, onChangeSortOrder, onRowClick } = props;

  // Table rendering functions
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data,
      manualSortBy: true,
    },
    useSortBy
  );

  // Call onChangeSortOrder function when sorting changes
  useEffect(() => {
    if (onChangeSortOrder !== undefined) {
      onChangeSortOrder(sortBy);
    }
  }, [sortBy]);

  return (
    <Box>
      {loading ? (
        <Center height="240px">
          <VStack>
            <Spinner color="primary" boxSize="100px" thickness="8px" speed="0.65s" mb="10px" />
            <Text textStyle="display-small-semibold" color="secondary" fontSize="xl">
              Loading Data...
            </Text>
          </VStack>
        </Center>
      ) : (
        <ChakraTable {...getTableProps()}  style={{borderCollapse:"separate", borderSpacing:"0 8px"}}>
          <Thead>
            {headerGroups.map(headerGroup => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map(column => (
                  <Th
                    paddingX="0"
                    fontSize="16px"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    width={column.width}
                    minWidth={column.minWidth}
                    maxWidth={column.maxWidth}
                    key={column.id}
                    _first={{textAlign: "left"}}
                  >
                    {column.render('Header')}

                    {/* SORTING LOGIC BELOW */}
                    {/* {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ArrowDownIcon aria-label="sorted descending" />
                          ) : (
                            <ArrowUpIcon aria-label="sorted ascending" />
                          )
                        ) : null
                    } */}
                    {/* <Flex justify={"center"} >
                      <Box height="24px" display="inline">
                        {column.render('Header')}
                      </Box>
                      <Box height="24px" display="inline" marginLeft="4px">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ArrowDownIcon aria-label="sorted descending" />
                          ) : (
                            <ArrowUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                      </Box>
                    </Flex> */}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}

                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  cursor={onRowClick ? 'pointer' : undefined}
                  _hover={onRowClick && { background: 'background.interactive' }}
                >
                  {row.cells.map((cell, i) => (
                    <Td
                      height="80px"
                      paddingX="0"
                      {...cell.getCellProps()}
                      key={`cell-${i}`}
                      _first={{borderStartRadius: 'md'}}
                      _last={{borderEndRadius: 'md'}}
                      fontSize='14px'
                    >
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </ChakraTable>
      )}
    </Box>
  );
}
