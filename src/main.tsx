import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './assets/components/Layout.tsx'
import GrandTotal from './pages/GrandTotal.tsx'
import Point from './pages/Point.tsx'
import Iryou from './pages/Iryou.tsx'
import { Card } from '@mui/material'

const router = createHashRouter([
  {
    path:"/",
    Component: Layout,
    children:[
      {index: true, Component:App},
      {path:"home",Component:App},
      {
        path:"grand-total",
        Component: GrandTotal,
      },
      {
        path:"point",
        Component: Point,
      },
      {
        path:"iryou",
        Component: Iryou,
      },
      {
        path:"card",
        Component: Card,
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
