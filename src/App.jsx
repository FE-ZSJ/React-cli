import React, { Suspense, lazy} from "react";
import { Link, Routes, Route } from 'react-router-dom'
// import Home from './pages/home'
// import About from "./pages/about";

// 路由懒加载，配合splitchunk单独打包
const Home = lazy(() => import(/* webpackChunkName: 'home' */ './pages/home'))
const About = lazy(() => import(/* webpackChunkName: 'about' */ './pages/about'))

function App() {
    return (
    <div>
            <h1>App</h1>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
            <Suspense fallback={ <div>loading...</div>}>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About/>} />
                </Routes>
            </Suspense>
     </div>
    )
}

export default App
