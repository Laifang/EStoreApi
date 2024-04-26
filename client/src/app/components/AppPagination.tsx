import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/Pagination";

interface Props {
  metaData: MetaData;
  onChange: (currentPage: number) => void;
}

function AppPagination({ metaData, onChange }: Props) {
  const { pageNumber, pageSize, totalCount, totalPages } = metaData;

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography>
        显示 {(pageNumber - 1) * pageSize + 1} -
        {pageNumber * pageSize > totalCount ? totalCount : pageNumber * pageSize} 条，共 {totalCount} 条
      </Typography>
      <Pagination
        shape="rounded"
        variant="outlined"
        color="primary"
        size="large"
        count={totalPages}
        page={pageNumber}
        onChange={(_, pageNumber: number) => onChange(pageNumber)}
      />
    </Box>
  );
}

export default AppPagination;
