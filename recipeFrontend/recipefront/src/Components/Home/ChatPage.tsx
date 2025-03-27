
import './aistyle.css'
import SearchBar from './SearchBar';

function ChatPage() {
    return(
 <div className='chatPage-style'>
    <div className='chatPage-content'>
        <p>What recipe do you want to know about?</p>
        <SearchBar/>
    </div>

 </div>)
}

export default ChatPage;