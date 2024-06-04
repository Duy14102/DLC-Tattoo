import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout';
import "./index.css"
const HomePage = React.lazy(() => import("./Page/HomePage"))
const Blog = React.lazy(() => import("./Page/BlogPage"))
const Gallery = React.lazy(() => import("./Page/Gallery"))
const Booking = React.lazy(() => import("./Page/BookingPage"))
const NotFound = React.lazy(() => import("./Component/NotFound404"))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/BlogPage" element={<Blog />} />
        <Route path="/GalleryPage" element={<Gallery />} />
        <Route path="/BookingPage" element={<Booking />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);