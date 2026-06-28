import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MoviesPage, SeriesPage, MusicPage, PodcastsPage, CodePage, GalleryPage } from "./pages/CategoryPages";
import FavoritesPage from "./pages/FavoritesPage";
import PlaylistPage from "./pages/PlaylistPage";
import ViewerPage from "./pages/ViewerPage";
import EditorPage from "./pages/EditorPage";
import HistoryPage from "./pages/HistoryPage";
import ContinuousPlayerPage from "./pages/ContinuousPlayerPage";
import LiveTVPage from "./pages/LiveTVPage";
import ImportPage from "./pages/ImportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/podcasts" element={<PodcastsPage />} />
          <Route path="/code" element={<CodePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/player" element={<ContinuousPlayerPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/livetv" element={<LiveTVPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/viewer/:id" element={<ViewerPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
