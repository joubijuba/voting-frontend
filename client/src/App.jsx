import { Route, Redirect, Switch } from "react-router-dom"
import Welcome from "./pages/Welcome"
import Voters from "./pages/Voters"
import Admin from "./pages/Admin"
import Layout from "./components/Layout/Layout"
import Undefined from "./pages/Undefined"

import { EthProvider } from "./contexts/EthContext";

function App() {
  return (
    <EthProvider>
      <Layout>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/welcome"></Redirect>
          </Route>
          <Route path="/welcome">
            <Welcome/>
          </Route>
          <Route path="/voters">
            <Voters/>
          </Route>
          <Route path="/admin">
            <Admin/>
          </Route>
          <Route path="*">
            <Undefined/>
          </Route>
        </Switch>
      </Layout>
    </EthProvider>
  );
}

export default App;
