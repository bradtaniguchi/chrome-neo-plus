// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import { Route, Routes, Link, Outlet } from 'react-router-dom';

/**
 * Main app export
 */
export function App() {
  return (
    <>
      <div>
        <h1>Hello World!</h1>
      </div>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route
            index
            element={
              <div>
                <div>This is the generated root route.</div>
                <Link to="/page-2">Click here for page 2.</Link>
              </div>
            }
          />
          <Route
            path="page-2"
            element={
              <div>
                <Link to="/">Click here to go back to root page.</Link>
              </div>
            }
          />
          <Route path="*" element={<div>Unknown page!</div>} />
        </Route>
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
