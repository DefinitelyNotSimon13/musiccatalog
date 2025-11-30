import { useMemo } from "react";
import { useIsAdmin } from "../context/roles";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Artist } from "../types";
import { useState } from "react";

type Props = {
  artists: Artist[];
  onEdit: (artist: Artist) => void;
  onDelete: (id: string) => void;
  onView?: (artist: Artist) => void;
};

const columnHelper = createColumnHelper<Artist>();

export default function ArtistTable({
  artists,
  onEdit,
  onDelete,
  onView,
}: Props) {
  const isAdmin = useIsAdmin();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("countryOfOrigin", {
        header: "Country",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("primaryGenre", {
        header: "Genre",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (props) => (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            {onView && (
              <IconButton
                size="small"
                onClick={() => onView(props.row.original)}
                aria-label="view artist"
              >
                <VisibilityIcon />
              </IconButton>
            )}
            {isAdmin && (
              <>
                <IconButton
                  size="small"
                  onClick={() => onEdit(props.row.original)}
                  aria-label="edit artist"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(props.row.original.id)}
                  aria-label="delete artist"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        ),
      }),
    ],
    [onEdit, onDelete, onView, isAdmin]
  );

  const table = useReactTable({
    data: artists,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  align={header.id === "actions" ? "right" : "left"}
                  sx={{ fontWeight: 600 }}
                >
                  {header.isPlaceholder ? null : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <TableSortLabel
                          active={!!header.column.getIsSorted()}
                          direction={
                            header.column.getIsSorted() === "asc"
                              ? "asc"
                              : "desc"
                          }
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No artists found
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} hover>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    align={cell.column.id === "actions" ? "right" : "left"}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
