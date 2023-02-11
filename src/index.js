import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './Assets/fonts/Almarena.otf';
import './Assets/fonts/Neue-Bold.otf';
import './Assets/fonts/Neue-Regular.otf';
import './Assets/fonts/Neue-Light.otf';
import './Assets/fonts/Neue-Medium.otf';
import './Assets/fonts/Almarena-Light.woff';
import './Assets/fonts/Almarena-Regular.woff';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.8 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: '35px' },
      }}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
