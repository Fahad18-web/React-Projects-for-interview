import React, { useState } from 'react'
import {FaStar} from 'react-icons/fa'
import './styles.css'
function StarRating({noofStars = 5}) {
 const [rating,setRating] = useState(0)
 const [hover,setHover] = useState(0)

 const handleClick = function(getCurrentIndex){
    setRating(getCurrentIndex)
 }

 const handleMouseEnter = function(getCurrentIndex){
 setHover(getCurrentIndex)
 }

 const  handleMouseLeave = function() {
   setHover(rating)
 }

  return (
      <>
        <div>
          {
            [...Array(noofStars)].map((_, index)=>{
              index += 1
              return <FaStar
              className={index <=( hover || rating ) ? 'active' : 'inactive'}
              key={index}
              onClick={()=> handleClick(index)}
              onMouseEnter={()=> handleMouseEnter(index)}
              onMouseLeave={()=> handleMouseLeave()}
              size={40}
              />
            }) 
          }

        </div>
      
      </>
  )
}

export default StarRating