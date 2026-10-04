import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar/Navbar';

function Applive() {
  return (
    <div className="App">
      <header className="App-header">
      <Navbar type="authenticated"/>
      </header>
    </div>
  );
}

export default Applive;
