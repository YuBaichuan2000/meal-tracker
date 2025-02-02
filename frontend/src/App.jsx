import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Dish from './pages/Dish';
import Ingredient from './pages/Ingredient';


function App() {
 
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/menu' element={<Menu />}></Route>
        <Route path='/dish' element={<Dish />}></Route>
        <Route path='/ingredient' element={<Ingredient />}></Route>
      </Routes>
    </Router>
  )
}

export default App
