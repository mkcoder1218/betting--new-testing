import React from 'react'
import generatehover, { disablehover } from '../../utils/generatehover'

function forthmini() {
  return (
     <div className="forthmini_container">
              <div className="childmini childmini3">
              <p className='orange' onMouseEnter={()=>generatehover('.orangenumber')} onMouseLeave={()=>disablehover('.orangenumber')}>32/15/19/4/21/2</p>
              <p className='blue' onMouseEnter={()=>generatehover('.bluenumber')} onMouseLeave={()=>disablehover('.bluenumber')}>25/17/34/6/27/13</p>
                  <p className='rose' onMouseEnter={()=>generatehover('.rosenumber')} onMouseLeave={()=>disablehover('.rosenumber')}>36/11/30/8/23/10</p>
                  <p className='lightgreen' onMouseEnter={()=>generatehover('.greennumber')} onMouseLeave={()=>disablehover('.greennumber')}>5/24/16/33/1/20</p>
              <p className='yellow' onMouseEnter={()=>generatehover('.yellownumber')} onMouseLeave={()=>disablehover('.yellownumber')}>14/31/9/22/18/29</p>
                  <p className='white' onMouseEnter={()=>generatehover('.whitenumber')} onMouseLeave={()=>disablehover('.whitenumber')}>7/28/12/35/3/26</p>
                  </div>
          </div>
  )
}

export default forthmini
