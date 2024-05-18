import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from 'containers/App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import FontFaceObserver from 'fontfaceobserver'
import createHistory from 'history/createBrowserHistory'
import 'sanitize.css/sanitize.css'
import smoothscroll from 'smoothscroll-polyfill'
import { translationMessages } from './i18n.js'
import configureStore from './configureStore'
// load runtime environment
// eslint-disable-next-line import/no-webpack-loader-syntax
import './env.js'
// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider'
const root = ReactDOM.createRoot(document.getElementById('root'))

// Create redux store with history
const initialState = {}
const history = createHistory()
const store = configureStore(initialState, history)
root.render(
  <Provider store={store}>
    <LanguageProvider messages={translationMessages}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </LanguageProvider>
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
