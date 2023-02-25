import { Route, Routes } from "react-router-dom"
import LoginPage from "../pages/dashboard/LoginPage/LoginPage"
import DashboardPage from "../pages/dashboard/DashboardPage/DashboardPage"
import ProductsPage from "../pages/dashboard/ProductsPage/ProductsPage"
import InvoicesPage from "../pages/dashboard/InvoicesPage/InvoicesPage"
import HomePage from "../pages/HomePage/HomePage"
import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import PageNotFound from "../pages/PageNotFound/PageNotFound"
import ViewProduct from "../pages/ViewProduct/ViewProduct"
import NewProductPage from "../pages/dashboard/NewProductPage/NewProductPage"


const AppRoutes = () => {
    const { isLoggedIn } = useContext(AuthContext)
    return (
        <Routes>

            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard/login" element={<LoginPage />} />
            {
                isLoggedIn &&
                <>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/dashboard/products" element={<ProductsPage />} />
                    <Route path="/dashboard/products/new" element={<NewProductPage />} />
                    <Route path="/dashboard/products/:productId" element={<ViewProduct />} />
                    <Route path="/dashboard/invoices" element={<InvoicesPage />} />
                </>
            }
            <Route path="*" element={<PageNotFound />} />

        </Routes>
    )
}

export default AppRoutes
