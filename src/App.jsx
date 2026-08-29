import { Route, Routes } from 'react-router-dom'
import WeddingLayout from './wedding/WeddingLayout'
import Home from './wedding/screens/Home'
import Historia from './wedding/screens/Historia'
import Dijo from './wedding/screens/Dijo'
import Pedacito from './wedding/screens/Pedacito'
import Galeria from './wedding/screens/Galeria'

export default function App() {
  return (
    <Routes>
      <Route element={<WeddingLayout />}>
        <Route index element={<Home />} />
        <Route path="nuestra-historia" element={<Historia />} />
        <Route path="dijo-que-si" element={<Dijo />} />
        <Route path="un-pedacito" element={<Pedacito />} />
        <Route path="galeria" element={<Galeria />} />
      </Route>
    </Routes>
  )
}
