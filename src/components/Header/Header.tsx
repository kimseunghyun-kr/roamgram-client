import React from "react";
import './styles.css'
import { Autocomplete } from '@react-google-maps/api'
import { FaSearch } from 'react-icons/fa'

function Header(){
    return(
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
            <div className = 'search-logo'>
                <FaSearch className = 's-logo'>
                </FaSearch>
                <input type = 'string' placeholder="Search Places Here"></input>
            </div>
            <div className="headerBtn">
                <button className = 'btn'>
                        <a href = 'login' className = 'loginBtn'>
                            Login
                        </a>
                    </button>
                <button className = 'btn'>
                        <a href = 'signup' className = 'signBtn'>
                            Sign Up
                        </a>
                    </button>
            </div>
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

    );
}

export default Header