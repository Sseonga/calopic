import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutShell from './components/common/LayoutShell';
import PageUpload from './pages/upload/PageUpload';
import PageDiary from './pages/diary/PageDiary';
import PageCalculator from './pages/calculator/PageCalculator';
import PageMypage from './pages/mypage/PageMypage';
import ComponentView from './pages/ComponentView';
import PageLogin from './pages/auth/PageLogin';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<PageLogin />} />
          <Route element={<LayoutShell />}>
            <Route index element={<PageUpload />} />
            <Route path="/diary" element={<PageDiary />} />
            <Route path="/calculator" element={<PageCalculator />} />
            <Route path="/component" element={<ComponentView/>} />
            <Route path="/mypage" element={<PageMypage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
