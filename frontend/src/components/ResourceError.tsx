import { Alert, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../api/ApiConnector";

interface ResourceErrorProps {
  error: unknown;
  resource: string; // e.g. 'Track'
  id?: string;
  backTo?: string; // path to return
}

export function ResourceError({
  error,
  resource,
  id,
  backTo,
}: ResourceErrorProps) {
  const navigate = useNavigate();

  const apiErr = error instanceof ApiError ? error : undefined;
  const status = apiErr?.status;

  let title: string;
  let message: string;

  if (status === 404) {
    title = `${resource} Not Found`;
    message = id
      ? `${resource} with ID '${id}' does not exist or was removed.`
      : `${resource} not found.`;
  } else if (status === 400 || status === 422) {
    title = `Invalid ${resource} ID`;
    message = `The provided identifier${
      id ? ` '${id}'` : ""
    } is not a valid UUID.`;
  } else if (status && status >= 500) {
    title = `Server Error (${status})`;
    message = `We encountered an internal problem fetching this ${resource.toLowerCase()}. Please try again later.`;
  } else {
    title = `Unable to Load ${resource}`;
    message =
      apiErr?.message ||
      `An unexpected error occurred while loading the ${resource.toLowerCase()}.`;
  }

  return (
    <Box>
      <Alert severity={status === 404 ? "warning" : "error"} sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2">{message}</Typography>
        {status === 400 && (
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Ensure the URL contains a valid UUID
            (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
          </Typography>
        )}
      </Alert>
      {backTo && (
        <Button variant="contained" onClick={() => navigate(backTo)}>
          Back to {backTo.replace("/", "") || "home"}
        </Button>
      )}
    </Box>
  );
}
