"use client"
import React from 'react'
import { Provider } from 'react-redux'
import store from '../components/store/store'
import AnnouncementBar from '../components/user/AnnouncementBar'
import Navbar from '../components/user/Navbar'
import Icon from "../components/user/Icons";
import axios from 'axios'
import Footer from '../components/user/Footer'

axios.defaults.withCredentials= true

const LayoutComp = ({children}) => {
  return (
    <div>
<Provider store={store}>
<AnnouncementBar />
                <Navbar/>
{children}


<Icon />

<Footer />
</Provider>
    </div>
  )
}

export default LayoutComp