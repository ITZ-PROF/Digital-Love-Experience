import './quote.css';
import quote from '../../assets/quotes.svg'


function Quote(){
    return(
        <div className='quote-container'>
            <img  src={quote} alt='quote'/>
            <p>"To be human is to have a collection of memories that tells you who you are <br/>and how you got there."</p>
            <p>— Rosecrans Baldwin</p>
        </div>
    )
}



export default Quote;