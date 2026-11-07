import { Route, Routes } from 'react-router-dom';
import { LangProvider } from './lib/i18n';
import { RevealObserver, UIProvider } from './lib/ui';
import { CallBar, Footer, Navbar, ScrollExtras, ScrollManager } from './components/Layout';
import Home from './pages/Home';
import Departments from './pages/Departments';
import ConditionPage from './pages/ConditionPage';
import DoctorPage from './pages/DoctorPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <LangProvider>
      <UIProvider>
        <ScrollManager />
        <RevealObserver />
        <ScrollExtras />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conditions" element={<Departments />} />
          <Route path="/conditions/:id" element={<ConditionPage />} />
          <Route path="/doctors/:id" element={<DoctorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <CallBar />
      </UIProvider>
    </LangProvider>
  );
}
