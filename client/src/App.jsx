import { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import { LoginForm } from './Auth';
import { PageNotFound } from './PageNotFound';
import { PagesList, PagesListBackOffice } from './PagesList';
import { PageWithBlocks } from './Blocks';
import { login, getPages, logout, getWebsiteName, deletePage } from './API';
import UserContext from './context';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [pages, setPages] = useState([]);
  const [user, setUser] = useState({});
  const [webName, setWebName] = useState('');

  const doLogin = async (username, password) => {
    const user = await login(username, password);
    setUser(user);
  }
  
  useEffect(() => {
    getWebsiteName().then((n) => {
      setWebName(n.name);

      getPages().then((allPages) => {
        // const filteredPages = allPages.filter((page) =>
        //   dayjs(page.publication_date).isSame(dayjs(), 'day') ||
        //   dayjs(page.publication_date).isBefore(dayjs(), 'day')
        // );

        // if (!user.id) {
        //   // anonymous user
        //   setPages(filteredPages);
        // }
        // else {
        //   setPages(allPages);
        // }
        setPages(allPages);
      })
    })
  }, [user.id]);

  const handleLogout = async () => {
    await logout();
    setUser({});
  }

  const handleDeletePage = async (pageId) => {
    await deletePage(pageId);
    const pages = await getPages();
    setPages(pages);
  }

  return <UserContext.Provider value={user}>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout doLogout={handleLogout} webName={webName}/>}>
          <Route index element={<PagesList pages={pages} idUser={user.id}/>} />
          <Route path='/login' element={ <LoginForm doLogin={doLogin}/> }/>
          <Route path='/pages/:pageId' element={<PageWithBlocks />} />
          <Route path='/backOffice/pages' element={<PagesListBackOffice  pages={pages} handleDeletePage={handleDeletePage} userUsername={user.username}/>} />
          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </UserContext.Provider>;
}

function MainLayout(props) {
  const user = useContext(UserContext);
  console.log(user)
  return <>
    <header>
      <Navbar sticky="top" variant='dark' bg="dark" expand="lg" className='mb-3'>
        <Container>
          <Navbar.Brand><Link to='/' style={{ color: 'white', textDecoration: 'none' }}>{props.webName}</Link></Navbar.Brand>
          <Navbar.Text>
            {user.id ? <span>{user.username} <Link to='/' onClick={props.doLogout}>Logout</Link></span> : <Link to='/login'>Login</Link>}
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
