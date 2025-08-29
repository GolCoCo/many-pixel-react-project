import './init';
import 'mutationobserver-shim';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import './index.scss';
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));
