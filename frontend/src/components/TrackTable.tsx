import { useMemo, useState } from "react";
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
import type { Track } from "../types";
import { useArtist } from "../api/hooks";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

type Props = {
  tracks: Track[];
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
  onView?: (track: Track) => void;
};

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const columnHelper = createColumnHelper<Track>();

export default function TrackTable({
  tracks,
  onEdit,
  onDelete,
  onView,
}: Props) {
  const isAdmin = useIsAdmin();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("artistId", {
        header: "Artist",
        cell: (info) => <ArtistCell artistId={info.getValue()} />,
      }),
      columnHelper.accessor("album", {
        header: "Album",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("mediaType", {
        header: "Media Type",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("lengthMs", {
        header: "Duration",
        cell: (info) => formatDuration(info.getValue()),
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
                aria-label="view track"
              >
                <VisibilityIcon />
              </IconButton>
            )}
            {isAdmin && (
              <>
                <IconButton
                  size="small"
                  onClick={() => onEdit(props.row.original)}
                  aria-label="edit track"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(props.row.original.id)}
                  aria-label="delete track"
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
    data: tracks,
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
                No tracks found
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

function ArtistCell({ artistId }: { artistId: string }) {
  const { data: artist } = useArtist(artistId);
  const label = artist?.name || artistId;
  return (
    <Link component={RouterLink} to={`/artists/${artistId}`} underline="hover">
      {label}
    </Link>
  );
}
