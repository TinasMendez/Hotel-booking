import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';          // assume you have this
import Login from './pages/Login';
import Booking from './pages/Booking';    // the page we fixed

/**
 * App-level layout. Header appears ONCE here.
 * Pages SHOULD NOT render their own header to avoid duplication.
 */
export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking/:productId" element={<Booking />} />
        </Routes>
      </div>
    </div>
  );
}
