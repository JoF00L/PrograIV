import {createBrowserRouter} from 'react-router-dom';
import {App} from '../App'
import {About} from "../pages/About";
import {Bill} from "../pages/Bill";
import {Billing} from "../pages/Billing";
import {Product} from "../pages/Product";
import {Supplier} from "../pages/Supplier";
import {Profile} from "../pages/Profile";
import {Client} from "../pages/Client";
import Login from "../pages/Login";


export const Routes = createBrowserRouter([
    {
        path:'',
        element:<App/>,
        children:[
            {
                path:'',
                element:<About/>
            },
            {
                path:'bill',
                element:<Bill/>
            },
            {
                path:'billing',
                element:<Billing/>
            },
            {
                path:'client',
                element:<Client/>
            },
            {
                path:'product',
                element:<Product/>
            },
            {
                path:'supplier',
                element:<Supplier/>
            },
            {
                path:'perfil',
                element:<Profile/>
            }
        ]

    },
    {
        path:'/login',
        element:<Login/>
    }
])
