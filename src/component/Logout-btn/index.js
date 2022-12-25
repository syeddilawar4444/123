import React from 'react'
import { logout } from '../../config/firebase'

export default function button(props) {
  return (
      <div className='logout'>
      <h1>{props.name}</h1>
      <button className='logout' onClick={logout}>Logout</button>
     </div>
  )
}
