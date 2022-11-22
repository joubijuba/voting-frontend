import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from "react"

test('render', () => {
  render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>);
});
