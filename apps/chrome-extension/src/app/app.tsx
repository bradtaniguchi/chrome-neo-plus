import { Route, Routes, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './core/loading-spinner';
import { AppBar } from '@chrome-neo-plus/app-bar';

const NotFoundPage = lazy(() => import('./pages/not-found'));
const Overview = lazy(() =>
  import('@chrome-neo-plus/neows').then(({ Overview }) => ({
    default: Overview,
  }))
);
const ViewNeo = lazy(() =>
  import('@chrome-neo-plus/neows').then(({ ViewNeo }) => ({ default: ViewNeo }))
);
const BugPage = lazy(() => import('./pages/bug-page'));
const HelpPage = lazy(() => import('./pages/help-page'));
const SettingsPage = lazy(() => import('./pages/settings-page'));
/**
 * Main app export
 */
export function App() {
  return (
    <>
      <AppBar />
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route
            index
            element={
              <Suspense fallback={<LoadingSpinner />}>
                {/* TODO: add APOD */}
                <Overview />
              </Suspense>
            }
          />
          <Route
            path="/neo/:id"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ViewNeo />
              </Suspense>
            }
          />
          <Route
            path="/bug"
            element={
              <Suspense>
                <BugPage />
              </Suspense>
            }
          />
          <Route
            path="/help"
            element={
              <Suspense>
                <HelpPage />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense>
                <SettingsPage />
              </Suspense>
            }
          />
          {/* TODO: add other routes */}
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
