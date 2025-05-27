import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import ActivityPage from "./page/ActivityPage";
import "./index.css";
import "./lib/chartjs/chart"


const router = createBrowserRouter([
    {path:"/", element: <App/>},
    {path:"/activity/:id", element: <ActivityPage/>}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>

);