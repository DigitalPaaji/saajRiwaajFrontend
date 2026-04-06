import React, { Suspense } from 'react'
import ParamsCompo from './ParamsCompo'

const page = () => {
  return (
    <Suspense fallback="">
<ParamsCompo />
    </Suspense>
  )
}

export default page