import './App.css';
import { Routes, Route } from 'react-router-dom';
import UploadPage from "./upload";
import ProductPage from './product';
import MainPageComponent from './main/index';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPageComponent />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </div>
  );
}

export default App;