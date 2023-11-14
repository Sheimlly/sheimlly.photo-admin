import { createRoot } from 'react-dom/client'
import { Routes } from '@generouted/react-router'
import Header from './partials/header';
import './resources/styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <>
	{localStorage.getItem("token") ? <Header/> : <></>}
    <Routes/>
  </>
);