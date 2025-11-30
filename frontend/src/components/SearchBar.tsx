import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchArtists, useSearchTracks } from "../api/hooks";

export default function SearchBar() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  const shouldSearch = debouncedQuery.length > 0;

  const { data: artistResults, isFetching: isFetchingArtists } =
    useSearchArtists(shouldSearch ? debouncedQuery : "", {
      page: 0,
      size: 5,
    });
  const { data: trackResults, isFetching: isFetchingTracks } = useSearchTracks(
    shouldSearch ? debouncedQuery : "",
    {
      page: 0,
      size: 5,
    }
  );

  type SearchOption = {
    type: "Artist" | "Track";
    id: string;
    label: string;
    subtitle?: string;
  };

  const options: SearchOption[] = useMemo(() => {
    const artists = (artistResults?.content || []).map((a) => ({
      type: "Artist" as const,
      id: a.id,
      label: a.name,
      subtitle: a.primaryGenre || a.countryOfOrigin || undefined,
    }));
    const tracks = (trackResults?.content || []).map((t) => ({
      type: "Track" as const,
      id: t.id,
      label: t.title,
      subtitle: t.album || t.category || undefined,
    }));
    return [...artists, ...tracks];
  }, [artistResults, trackResults]);

  return (
    <Autocomplete
      size="small"
      sx={{ minWidth: 320 }}
      options={options}
      groupBy={(opt) => opt.type}
      getOptionLabel={(opt) => opt.label}
      filterOptions={(x) => x}
      forcePopupIcon={false}
      inputValue={input}
      onInputChange={(_, value) => setInput(value)}
      open={open && shouldSearch}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      clearOnBlur={true}
      loading={isFetchingArtists || isFetchingTracks}
      loadingText="Searching..."
      noOptionsText={debouncedQuery ? "No results" : "Type to search"}
      onChange={(_, value) => {
        if (!value) return;
        if (value.type === "Artist") navigate(`/artists/${value.id}`);
        else navigate(`/tracks/${value.id}`);
        // Close dropdown and clear input after navigation
        setOpen(false);
        setInput("");
        // Remove focus from the search input
        inputRef.current?.blur();
      }}
      renderOption={(props, option) => (
        <li {...props} key={`${option.type}-${option.id}`}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {option.label}
            </Typography>
            {option.subtitle && (
              <Typography variant="caption" color="text.secondary">
                {option.subtitle}
              </Typography>
            )}
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Search artists or tracks"
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: "white",
            },
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  <InputAdornment position="end">
                    {isFetchingArtists || isFetchingTracks ? (
                      <CircularProgress size={18} sx={{ mr: 1 }} />
                    ) : (
                      <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                    )}
                  </InputAdornment>
                </>
              ),
            },
          }}
          inputRef={inputRef}
        ></TextField>
      )}
    />
  );
}
