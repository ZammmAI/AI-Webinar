import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { MainLayout } from './layouts/MainLayout';

export function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
