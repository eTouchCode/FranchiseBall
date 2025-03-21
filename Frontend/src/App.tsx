import { Route, Routes, Outlet, Navigate } from 'react-router-dom';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import DefaultLayout from './layout/DefaultLayout';

import routes from './routes';
import { useAuthStore } from './store/auth.store';

function App() {
  const { isAuthenticated } = useAuthStore() as { isAuthenticated: boolean };

  return (
    <>
      <Routes>
        <Route path='/auth/signin' element={<SignIn />} />
        <Route path='/auth/signup' element={<SignUp />} />
        <Route element={<DefaultLayout><Outlet /></DefaultLayout>}>
          {routes.map((route, index) => {
            const { path, component: Component } = route;
            return (
              <Route
                key={index}
                path={path}
                element={
                  isAuthenticated ? (
                    <Component />
                  ) : (
                    <Navigate to="/auth/signin" />
                  )
                }
              />
            );
          })}
        </Route>
      </Routes>
    </>
  );
}

export default App;
