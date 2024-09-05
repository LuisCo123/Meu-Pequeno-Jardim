import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { PublicRoutes } from './routes/publicRoutes'
import { NavbarComponent } from './components/navBarComponent'
import { FooterComponent } from './components/footerComponent'
import UserProvider from './context/userContext'
import { RoutesManager } from './routes/routesManager'

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <div className="fixed w-screen z-50">
          <NavbarComponent />
        </div>
        <RoutesManager />
        <FooterComponent />
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
