import { ArrowRightOutlined } from '@ant-design/icons';
import {Input,message} from 'antd'
import { useState } from 'react';
const { TextArea } = Input;
 

function SearchBar() {
  const [instructions, setInstructions] = useState('');

  return (
    <div className='searchbar'>
      <TextArea
        rows={2}
        name="instructions"
        placeholder="add instructions"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
        style={{
          border: 'none',
          outline: 'none', 
          boxShadow: 'none', 
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ArrowRightOutlined
        
          className="enter-search-icon"
          style={{
            color: instructions ? 'white' : 'rgb(176,176,172);',
            fontWeight:'bold',
            backgroundColor: instructions ? '#4D99A3' : 'rgb(238,238,234)', // Change color if text exists
            padding: '10px',
            fontSize:15,
            borderRadius: '50%',
            marginTop:20
          }}
        />
      </div>
    </div>
  );
}

export default SearchBar;