import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import {Routes} from './routes/Routes'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


    ReactDOM.createRoot(document.getElementById('root')).render(
        <div  className="bg-dark text-white min-vh-100">
            <React.StrictMode>
                <RouterProvider router={Routes}/>
            </React.StrictMode>
        </div>

    )
