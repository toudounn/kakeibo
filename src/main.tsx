import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './assets/components/Layout.tsx'
import Category from './pages/Category.tsx'
import SummaryPage from './pages/SummaryPage.tsx'
import Settings from './assets/components/Settings.tsx'
import GraphPage from './pages/GraphPage.tsx'

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "home", element: <App /> },
      { path: "category", element: <Category /> },
      { path: "summary", element: <SummaryPage /> },
      { path: "graph-page", element:<GraphPage />},
      { path: "settings", element: <Settings /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
