import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout';
import "./index.css"
import { ToastContainer } from 'react-toastify';
import 'react-responsive-modal/styles.css';
import ScrollToTop from './Component/ScrollToTop';
const HomePage = React.lazy(() => import("./Page/FrontPage/HomePage"))
const Blog = React.lazy(() => import("./Page/FrontPage/BlogPage"))
const ReadBlog = React.lazy(() => import("./Page/SideFrontPage/ReadBlog"))
const Gallery = React.lazy(() => import("./Page/FrontPage/Gallery"))
const Booking = React.lazy(() => import("./Page/FrontPage/BookingPage"))
const TattooSample = React.lazy(() => import("./Page/FrontPage/TattooSamplePage"))
const Favourite = React.lazy(() => import("./Page/FrontPage/FavouritePage"))
const LoginUser = React.lazy(() => import("./Page/AccountPage/LoginUser"))
const LoginAdmin = React.lazy(() => import("./Page/AccountPage/LoginAdmin"))
const AdminPanel = React.lazy(() => import("./Page/PanelPage/AdminPanel"))
const UserPanel = React.lazy(() => import("./Page/PanelPage/UserPanel"))
const NotFound = React.lazy(() => import("./Component/NotFound404"))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
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
  </BrowserRouter>
);