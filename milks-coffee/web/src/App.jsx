import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PDV from './pages/PDV';
import ClienteHome from './pages/ClienteHome'; // ADICIONE ESTE IMPORT REAL
import ProtectedRoute from './components/ProtectedRoute';

// APAGUE aquela linha "const ClienteHome = ..." que estava aqui!

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />        
        <Route 
          path="/pdv" 
          element={
            <ProtectedRoute roleRequired="pdv">
              <PDV />
            </ProtectedRoute>
          } 
        />
        <Route path="/loja" element={<ClienteHome />} />
      </Routes>
    </Router>
  );
}

export default App;