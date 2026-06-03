import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Vehiculos from './pages/Vehiculos';
import Citas from './pages/Citas';
import Ventas from './pages/Ventas';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Vehiculos />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/ventas" element={<Ventas />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
