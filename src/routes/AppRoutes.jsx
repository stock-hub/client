import { Route, Routes } from "react-router-dom"
import LoginPage from "../pages/admin/LoginPage/LoginPage"
import DashboardPage from "../pages/admin/DashboardPage/DashboardPage"
import ProductsPage from "../pages/admin/ProductsPage/ProductsPage"
import InvoicesPage from "../pages/admin/InvoicesPage/InvoicesPage"
import HomePage from "../pages/HomePage/HomePage"
import { useContext } from "react"
import { AuthContext } from "../context/auth.context"
import PageNotFound from "../pages/PageNotFound/PageNotFound"
import ViewProduct from "../pages/ViewProduct/ViewProduct"
import NewProductPage from "../pages/admin/NewProductPage/NewProductPage"


const AppRoutes = () => {
    const { isLoggedIn } = useContext(AuthContext)
    return (
        <Routes>

            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            {
                isLoggedIn &&
                <>
                    <Route path="/admin" element={<DashboardPage />} />
                    <Route path="/admin/productos" element={<ProductsPage />} />
                    <Route path="/admin/productos/nuevo" element={<NewProductPage />} />
                    <Route path="/productos/:productId" element={<ViewProduct />} />
                    <Route path="/admin/recibos" element={<InvoicesPage />} />
                </>
            }
            <Route path="*" element={<PageNotFound />} />

        </Routes>
    )
}

export default AppRoutes