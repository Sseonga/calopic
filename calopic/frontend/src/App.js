import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutShell from './components/common/LayoutShell';
import PageUpload from './pages/upload/PageUpload';
import PageDiary from './pages/diary/PageDiary';
import PageCalculator from './pages/calculator/PageCalculator';
import ComponentView from './pages/ComponentView';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutShell />}>
          <Route index element={<PageUpload />} />
          <Route path="/diary" element={<PageDiary />} />
          <Route path="/calculator" element={<PageCalculator />} />
          <Route path="/component" element={<ComponentView/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
