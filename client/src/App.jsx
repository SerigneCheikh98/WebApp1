import { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import { LoginForm } from './Auth';
import { PageNotFound } from './PageNotFound';
import { PagesList } from './PagesList';
import { PageWithBlocks } from './Blocks';
import { login, getPages, logout } from './API';
import UserContext from './context';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [pages, setPages] = useState([]);
  const [user, setUser] = useState({}) ;

  const doLogin = async (username, password) => {
    const user = await login(username, password);
    setUser(user);
  }
  
  useEffect(() => {
    getPages().then((allPages) => {
      setPages(allPages);
    })
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser({});
  }

  return <UserContext.Provider value={user}>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout doLogout={handleLogout} />}>
        <Route index element={<PagesList pages={pages} />} />
          <Route path='/login' element={ <LoginForm doLogin={doLogin}/> }/>
          <Route path='/pages/:pageId' element={<PageWithBlocks />} />
          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </UserContext.Provider>;
}

function MainLayout(props) {
  const user = useContext(UserContext);
  console.log(user);
  return <>
    <header>
      <Navbar sticky="top" variant='dark' bg="dark" expand="lg" className='mb-3'>
        <Container>
          <Navbar.Brand><Link to='/' style={{ color: 'white', textDecoration: 'none' }}>CMSmall</Link></Navbar.Brand>
          <Navbar.Text>
            {user.id ? <span>{user.username} <Link onClick={props.doLogout}>Logout</Link></span> : <Link to='/login'>Login</Link>}
          </Navbar.Text>
        </Container>
      </Navbar>
    </header>
    <main>
      <Container>
        <Outlet />
      </Container>
    </main>

  </>
}

export default App
