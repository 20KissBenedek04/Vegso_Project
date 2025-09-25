import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AnimalList from './pages/AnimalList';
import AnimalDetails from './pages/AnimalDetails';
import AdminDashboard from './pages/AdminDashboard';
import AddAnimal from './pages/AddAnimal';
import VetDashboard from './pages/VetDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Navigate to="/login"/>}/>
          <Route path='/login' element = {<LoginPage/>} />
          <Route path='/register' element = {<RegisterPage/>} />
          <Route path='/animals' element = {<AnimalList/>} />
          <Route path='/animals/:id' element = {<AnimalDetails/>} />
          <Route path='/add-animal' element = {<AddAnimal/>} />
          <Route path='/admin' element = {<AdminDashboard/>} />
          <Route path='/vet' element = {<VetDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
