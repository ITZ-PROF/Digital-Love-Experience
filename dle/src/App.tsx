import './App.css';
import Homepage from './pages/home/Homepage';
import LoadingPage from './components/loadingpage/loader';
import { useEffect, useState } from 'react';




function Applive() {
const [loading, setLoading] = useState(true);

  useEffect(()=>{
const timer = setTimeout(()=> setLoading(false), 2000)

    return ()=> clearTimeout(timer);
})


  return (
    <div className="App">
      {
        loading? <LoadingPage/> : <Homepage/>
      }
    </div>
  );
}

export default Applive;
