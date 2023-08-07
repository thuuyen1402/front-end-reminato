import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import { Home } from "@pages/index"
import { SharingPage } from "@pages/video/sharing";
import { ProtectedRoute } from "./protected";
import { NotFound } from "@pages/not-found";

export const routerConfig = createRoutesFromElements(
    <>
        <Route index  path="/" element={<Home />} />
        <Route path="/video/sharing" element={
            <ProtectedRoute>
                <SharingPage />
            </ProtectedRoute>
        } />
        <Route path='*' element={<NotFound />} />
    </>
)

export const routers = createBrowserRouter(routerConfig)
