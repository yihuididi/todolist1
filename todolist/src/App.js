import './App.css';
import { CreateAccount } from './Components/CreateAccount.jsx';
import { Login } from './Components/Login.jsx';
import {BrowserRouter, Routes, Route} from 'react-router-dom'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/create-account' element={<CreateAccount />}></Route>
      <Route path='/login' element={<Login />}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
