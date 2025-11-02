import { mount } from 'svelte'
import './app.css'
import './styles/theme.css'
import './styles/global.css'
import './styles/typography.css'
import './styles/layout.css'
import './styles/responsive.css'
import App from './App.svelte'

// Mount the Svelte app directly
// Database initialization is handled by App.svelte via data.js store
const app = mount(App, {
  target: document.getElementById('app'),
})

// Export app instance
window.__SVELTE_APP__ = app
