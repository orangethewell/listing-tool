import { createRef } from "react";
import { createRoot } from "react-dom/client";
import { 
  createBrowserRouter, 
  RouterProvider,
  NavLink,
  useLocation,
  useOutlet,
} from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Container, Navbar, Nav, NavbarBrand, NavbarCollapse, NavbarToggle } from "react-bootstrap";
import TodoList from "./pages/todoList";
import InvitationList from "./pages/guestList";
import WishesList from "./pages/wishList";
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import { Check2Square } from "react-bootstrap-icons";

const routes = [
  { path: '/', name: 'To-do', element: <TodoList />, nodeRef: createRef() },
  { path: '/wishes', name: 'Wish', element: <WishesList />, nodeRef: createRef() },
  {
    path: '/guests',
    name: 'Guests',
    element: <InvitationList />,
    nodeRef: createRef(),
  },
]

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: routes.map((route) => ({
      index: route.path === '/',
      path: route.path === '/' ? undefined : route.path,
      element: route.element,
    })),
  },
])

function Root() {
  const location = useLocation()
  const currentOutlet = useOutlet()
  const { nodeRef } =
    routes.find((route) => route.path === location.pathname) ?? {}
  return (
    <>
      <Navbar expand="md" bg="light">
          <NavbarBrand className="d-flex align-items-center mx-3"><Check2Square className="me-3"/> List Tools</NavbarBrand>
          <NavbarToggle className="mx-3"/>
          <NavbarCollapse>  
            <Nav>
              {routes.map((route) => (
                <Nav.Link
                  key={route.path}
                  as={NavLink}
                  to={route.path}
                  className={`mx-4 ${({ isActive }) => (isActive ? 'active' : undefined)}`}
                  end
                >
                  {route.name}
                </Nav.Link>
              ))}
          </Nav>
        </NavbarCollapse>
      </Navbar>
      <Container className="container">
        <SwitchTransition>
          <CSSTransition
            key={location.pathname}
            nodeRef={nodeRef}
            timeout={300}
            classNames="page"
            unmountOnExit
          >
            {(state) => (
              <div ref={nodeRef} className="page">
                {currentOutlet}
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
      </Container>
    </>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<RouterProvider router={router} />)
