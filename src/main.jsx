import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';
import { ToastContainer } from 'react-toastify';
const Layout = lazy(() => import("./Layout"))
const Spinner = lazy(() => import("./Component/Spinner"))
const ScrollToTop = lazy(() => import("./Component/ScrollToTop"))
const HomePage = lazy(() => import("./Page/FrontPage/HomePage"))
const Blog = lazy(() => import("./Page/FrontPage/BlogPage"))
const ReadBlog = lazy(() => import("./Page/SideFrontPage/ReadBlog"))
const Gallery = lazy(() => import("./Page/FrontPage/Gallery"))
const Booking = lazy(() => import("./Page/FrontPage/BookingPage"))
const TattooSample = lazy(() => import("./Page/FrontPage/TattooSamplePage"))
const Favourite = lazy(() => import("./Page/FrontPage/FavouritePage"))
const LoginUser = lazy(() => import("./Page/AccountPage/LoginUser"))
const LoginAdmin = lazy(() => import("./Page/AccountPage/LoginAdmin"))
const AdminPanel = lazy(() => import("./Page/PanelPage/AdminPanel"))
const UserPanel = lazy(() => import("./Page/PanelPage/UserPanel"))
const NotFound = lazy(() => import("./Component/NotFound404"))

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/BlogPage" element={<Blog />} />
          <Route path="/ReadBlogPage/:id" element={<ReadBlog />} />
          <Route path="/GalleryPage" element={<Gallery />} />
          <Route path="/BookingPage" element={<Booking />} />
          <Route path="/TattooSamplePage/:sorted/:cate/:star" element={<TattooSample />} />
          <Route path="/FavouritePage/:sorted/:cate/:star" element={<Favourite />} />
          <Route path="/LoginUserPage" element={<LoginUser />} />
          <Route path="/UserPanel" element={<UserPanel />} />
        </Route>
        <Route path="/AdminPanel" element={<AdminPanel />} />
        <Route path="/LoginAdminPage" element={<LoginAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
      <ScrollToTop />
    </Suspense>
  </BrowserRouter>
)
