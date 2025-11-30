import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Container,
  CssBaseline,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import HomePage from "./pages/HomePage";
import ArtistsPage from "./pages/ArtistsPage";
import TracksPage from "./pages/TracksPage";
import ArtistDetailPage from "./pages/ArtistDetailPage";
import TrackDetailPage from "./pages/TrackDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorBoundary from "./context/ErrorBoundary";
import { useKeycloakContext } from "./context/KeycloakContext";
import { AuthStatus } from "./types";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { AppNavbar } from "./components/AppNavbar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/artists" element={<ArtistsPage />} />
      <Route path="/artists/:id" element={<ArtistDetailPage />} />
      <Route path="/tracks" element={<TracksPage />} />
      <Route path="/tracks/:id" element={<TrackDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  const { state } = useKeycloakContext();

  if (state.status === AuthStatus.INITIALIZING) {
    return <LoadingView />;
  }

  if (state.status === AuthStatus.ERROR) {
    return <AuthErrorView onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            <CssBaseline />
            <AppNavbar />
            <Container sx={{ mt: 3 }}>
              <AppRoutes />
            </Container>
          </ErrorBoundary>
        </BrowserRouter>
        <TanStackDevtools
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
              defaultOpen: true,
            },
            formDevtoolsPlugin(),
          ]}
        />
      </QueryClientProvider>
    </>
  );
}

function LoadingView() {
  return (
    <>
      <CssBaseline />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    </>
  );
}

function AuthErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
        px={3}
      >
        <Typography variant="h5" gutterBottom>
          Authentication error
        </Typography>
        <Typography component="p">
          An error occurred while initializing authentication.
        </Typography>
        <Button variant="contained" onClick={onRetry} sx={{ mt: 2 }}>
          Try again
        </Button>
      </Box>
    </>
  );
}
