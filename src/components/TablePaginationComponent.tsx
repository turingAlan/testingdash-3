// MUI Imports
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

// Third Party Imports
import type { useReactTable } from '@tanstack/react-table'

const TablePaginationComponent = ({
  table,
  tableSize = 0
}: {
  table: ReturnType<typeof useReactTable>
  tableSize?: number
}) => {
  const currentIndex = table.getState().pagination.pageIndex - 1

  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>
      <Typography color='text.disabled'>
        {`Showing ${tableSize === 0 ? 0 : currentIndex * table.getState().pagination.pageSize + 1}
        to ${Math.min((currentIndex + 1) * table.getState().pagination.pageSize, tableSize)} of ${tableSize} entries`}
      </Typography>
      <Pagination
        shape='rounded'
        color='primary'
        variant='tonal'
        count={Math.ceil(tableSize / table.getState().pagination.pageSize)}
        page={currentIndex + 1}
        onChange={(_, page) => {
          table.setPageIndex(page)
        }}
        showFirstButton
        showLastButton
      />
    </div>
  )
}

export default TablePaginationComponent
