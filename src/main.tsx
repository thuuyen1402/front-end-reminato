import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from './provider'
import { createBrowserRouter } from 'react-router-dom';
import { routerConfig } from './router';
const router = createBrowserRouter(routerConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider router={router} />
  </React.StrictMode>,
)