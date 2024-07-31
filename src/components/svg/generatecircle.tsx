import React from 'react'
import Circle from '@mui/icons-material/Circle'

function generatecircle(number: number) {
    const result=[]
    for (let i = 0; i < number; i++){
        result.push(<Circle/>)
    }
return(result)
}

export default generatecircle
