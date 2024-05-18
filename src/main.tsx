import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Login from './pages/Login.tsx'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/router.tsx'
import { Provider } from 'react-redux'
import { store } from './features/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes}></RouterProvider>
    </Provider>

  </React.StrictMode>,
)
