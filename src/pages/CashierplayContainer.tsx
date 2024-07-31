import React,{useRef,useEffect} from 'react'
import Firstminicontainer from '../components/innercontainers/firstminicontainer';
import Secondminicontainer from '../components/innercontainers/secondminicontainer';
import Thirdminicontainer from '../components/innercontainers/thirdminicontainer';
import Forthmini from '../components/innercontainers/forthmini';
import Fifthmini from '../components/innercontainers/fifthmini';
import Fourrowhover from '../components/svg/fourrowhover';
function Container() {
    
  return (
    <div className='container'>
       
          <Firstminicontainer/>
        <Secondminicontainer/>
        <Thirdminicontainer/>
          <Forthmini/>
      <Fifthmini />
   
      
    </div>
  )
}

export default Container
