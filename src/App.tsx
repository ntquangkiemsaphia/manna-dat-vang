import { lazy, Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";

// Lazy-load các route ít dùng / nặng để giảm bundle ban đầu
const AuthBoundary = lazy(() => import("@/components/AuthBoundary"));
const DeferredToasters = lazy(() => import("@/components/DeferredToasters"));
const About = lazy(() => import("./pages/About"));
const Catalog = lazy(() => import("./pages/Catalog"));
const ProductsOverview = lazy(() =>
  import("./pages/Products").then((m) => ({ default: m.ProductsOverview }))
);
const ProductCategory = lazy(() =>
  import("./pages/Products").then((m) => ({ default: m.ProductCategory }))
);
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const DeferredAppToasters = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <DeferredToasters />
    </Suspense>
  );
};

const AdminAuthRoutes = () => (
  <Suspense fallback={<PageFallback />}>
    <AuthBoundary>
      <Outlet />
    </AuthBoundary>
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DeferredAppToasters />
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gioi-thieu" element={<About />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/san-pham" element={<ProductsOverview />} />
          <Route path="/san-pham/:category" element={<ProductCategory />} />
          <Route path="/san-pham/chi-tiet/:id" element={<ProductDetail />} />
          <Route path="/tin-tuc" element={<News />} />
          <Route path="/tin-tuc/:id" element={<NewsDetail />} />
          <Route path="/lien-he" element={<Contact />} />
          <Route element={<AdminAuthRoutes />}>
            <Route path="/dang-nhap" element={<Login />} />
            <Route path="/quan-tri" element={<Admin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
