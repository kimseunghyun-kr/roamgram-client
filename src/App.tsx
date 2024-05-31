import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import GoogleMapWrapper from './components/google/GoogleMapWrapper.tsx';

function App() {

  return (
    <>
    <header className = 'l-header top-header'>
      <div className = 'l-header-left'>
        <a className = 'l-header-logo' href = '#'>
          <img height = '55' width = '100%' src = './src/assets/RoamGram Logo.png' alt = 'RoamGram'></img>
        </a>
      </div>
      <nav className = 'l-header-menu'>
        <ul className = 'l-header-menu-list'>
          <li className = 'l-header-menu-list-child'>
            <a href = 'Explore'>
            Explore
            </a>
          </li>
          <li className = 'l-header-menu-list-child'>
            <a href = 'Travel Diary'>
            Travel Diary
            </a>
          </li>
          <li className = 'l-header-menu-list-child'>
            <a href = 'Book'>
              Booking
            </a>
          </li>
        </ul>
      </nav>
      <div className = 'l-header-right'>
        <div className = 'header-language'>
          <label className = 'header-language-label'> 
            <select className = 'header-language-select' value = 'english'>
              <option>
                ENG
              </option>
            </select> 
            </label>
        </div>
      </div>

    </header>
    <main>
      <div className = 'main-map'>
        <div className = 'scheduler-schedule'>
          <h1>Schedule</h1>
          <div className = 'scheduler-edit'>
            <button>test</button>
          </div>
        </div>
        <div className = 'scheduler-map'>
          <h1>Map</h1>
          <GoogleMapWrapper></GoogleMapWrapper>
        </div>
      </div>
    </main>
    </>
  );
}

export default App
