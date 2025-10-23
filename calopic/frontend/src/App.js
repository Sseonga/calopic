import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutShell from './components/common/LayoutShell';
import PageUpload from './pages/upload/PageUpload';
import PageDiary from './pages/diary/PageDiary';
import PageCalculator from './pages/calculator/PageCalculator';
import PageMypage from './pages/mypage/PageMypage';
import PageAdmin from './pages/admin/PageAdmin';
import AdminClass from './components/admin/AdminClass';
import AdminUser from './components/admin/AdminUser';
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
            <Route path="/admin" element={<PageAdmin/>}> 
              <Route index element={<AdminUser />} />
              <Route path="users" element={<AdminUser/>}/>
              <Route path="classes" element={<AdminClass/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
