import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { connect } from "react-redux";
import { withCookies } from "react-cookie";
import Profile from "./components/Profile";
import Login from "./components/Login";
import SignupAll from "./components/SignupAll";
import Logout from "./components/Logout";
import DashBoard3 from "./components/DashBoard3";
import DashBoardBogdan from "./components/DashBoardBogdan";
import DashBoardCommander from "./components/DashBoardCommander"
import IBMiX from "./components/IBMiX";
import Password from "./components/newPassword/Password";
import InstructionsNewPassword from "./components/newPassword/InstructionsNewPassword";
import SetNewPassword from "./components/newPassword/SetNewPassword";


class App extends React.Component {
  render() {
    // const isLogin = this.props.cookies.get("isLogin");
    return (
        <Router>
          <Switch>
            <Route exact path={"/"} component={Logout} />
            <Route exact path={"/dashboard3"} component={DashBoard3} />
            <Route exact path={"/dashboardbogdan"} component={DashBoardBogdan} />
            <Route exact path={"/dashboardC"} component={DashBoardCommander} />
            <Route exact path={'/IBMiX'} component={IBMiX} />
            <Route exact path={"/profile"} component={Profile} />
            <Route exact path={"/login"} component={Login} />
            <Route exact path={"/password"} component={Password} />
            <Route exact path={"/instructions_new_password"} component={InstructionsNewPassword} />
            <Route exact path={"/set_new_password/:id"} component={SetNewPassword} />
            <Route exact path={"/signupAll"} component={SignupAll} />
            <Route exact path={"/logout"} component={Logout} />
          </Switch>
        </Router>
    );
  }
}

function mapStateToProps(store) {
  return {
    isLogin: store.isLogin
  };
}

export default withCookies(connect(mapStateToProps)(App));
