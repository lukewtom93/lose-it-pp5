import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import BodyWeight from "./pages/bodyweight/BodyWeight";
import Profile from "./pages/profile/Profile";
import CurrentBodyWeight from "./pages/bodyweight/CurrentBodyWeight";
import Dashboard from "./pages/Home/Dashboard";
import MealLog from "./pages/nutrition/MealLog";
import CreateFood from "./pages/nutrition/CreateFood";
import AddFood from "./pages/nutrition/AddFood";


function App() {
  return (

    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <Dashboard />} />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/profiles/:id" render={() => <Profile />} />
          <Route exact path="/bodyweight" render={() => <BodyWeight />} />
          <Route exact path="/currentbodyweight" render={() => <CurrentBodyWeight />} />
          <Route exact path="/meallog" render={() => <MealLog />} />
          <Route exact path="/createfood" render={() => <CreateFood />} />
          <Route exact path="/addfood" render={() => <AddFood />} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;