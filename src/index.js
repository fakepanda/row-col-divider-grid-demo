import React from 'react';
import ReactDOM from 'react-dom';
import Container from './components/Container';

const rootEl = document.getElementById('root');

const render = () => {
  ReactDOM.render(<Container />, rootEl);
};
render();
