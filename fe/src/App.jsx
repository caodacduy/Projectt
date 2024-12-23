import { Routes, Route } from 'react-router-dom';
import Apps from './components/layout/admin';  // Trang admin
import User from './components/users/mainUser';  // Trang người dùng


function App() {
  return (
    <Routes>
      {/* Route cho trang người dùng */}
      <Route path="/" element={<User />} />
      
      
      {/* Route cho trang admin */}
      <Route path="/admin/*" element={<Apps />} />
    </Routes>
  );
}

export default App;

