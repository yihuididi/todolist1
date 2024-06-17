import './App.css';
import { CreateAccount } from './Components/CreateAccount.jsx';
import { Login } from './Components/Login.jsx';
import { Home } from './Components/Home.jsx';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useState, useEffect } from 'react';
import { auth } from './firebase'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState()
  useEffect(() => {
    auth.onAuthStateChanged((user) => { 
      //when user logged in, auth changed, user set to true
      setUser(user);
    });
  })
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={ user 
            ? <Navigate to='/home' /> 
            : <Login />}/>
          <Route path='/create-account' element={<CreateAccount />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/home' element={<Home />}/>
        </Routes>
        <ToastContainer />
    </BrowserRouter>
    
  );
}

export default App;
