import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import "./index.css";

const router = createBrowserRouter([
    {path:"/", element: <App/>}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>

);