import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom/cjs/react-router-dom.min"
import NavBar from "../NavBar"


test('reders Navbar', () => {
    render(<Router>
        <NavBar />
    </Router>);
    // screen.debug();

  const signInLink = screen.getByRole("link", { name: "Sign in" });
  expect(signInLink).toBeInTheDocument(); 
});