import './App.css'
import { Button } from "@/components/ui/button"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import DishForm from './pages/DishForm';
import IngredientForm from './pages/IngredientForm';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/menu' element={<Menu/>}></Route>
        <Route path='/dish/new' element={<DishForm/>}></Route>
        <Route path='/ingredient/new' element={<IngredientForm/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
