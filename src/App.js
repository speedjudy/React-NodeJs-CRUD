import React from "react";
import { Route, Routes } from "react-router-dom";
import { createBrowserHistory } from "history";
import Users from "./pages/users";
import Items from "./pages/items";
import './App.css';

function App() {
  const history = createBrowserHistory();
  return (
    <Routes history={history}>
      <Route path="/" element={<Users />} />
      <Route path="/users" element={<Users />} />
      <Route path="/items" element={<Items />} />
    </Routes>
  );
}

export default App;
