import { mount } from 'svelte'
import './app.css'
import './styles/layout.css'
import './styles/responsive.css'
import App from './App.svelte'
import { initializeDatabase } from './lib/initData.js'

// Initialize database before mounting the app
initializeDatabase()
  .then(result => {
    console.log('Database initialization result:', result)

    // Mount the Svelte app
    const app = mount(App, {
      target: document.getElementById('app'),
    })

    // Export app instance
    window.__SVELTE_APP__ = app
  })
  .catch(error => {
    console.error('Failed to initialize database:', error)
    // Show error to user
    document.getElementById('app').innerHTML = `
      <div style="padding: 20px; color: red; font-family: sans-serif;">
        <h2>Initialization Error</h2>
        <p>Failed to initialize the application database.</p>
        <p>Error: ${error.message}</p>
        <p>Please refresh the page or check the console for more details.</p>
      </div>
    `
  })
