import React from 'react'
import OrderCompo from './OrderCompo'

const page = async({params}) => {
    const id= await params.id
  return (
    <div>

<OrderCompo id={id} />

    </div>
  )
}

export default page