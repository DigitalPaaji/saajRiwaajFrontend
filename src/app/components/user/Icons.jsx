import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

function Icons() {
  return ( 
    <div>
        {/* Floating Contact Icon */}
        <div className=" flex flex-col items-center justify-center gap-2 fixed  bottom-4 right-4 z-[999999]">
            <Link
              href="https://wa.me/9988823422"
              className=" text-white  flex items-center justify-center  "
            >
              <Image 
              
                src={"/Images/icons8-whatsapp-96.png"}
                // src={"/Images/services/whIcon.webp"}
unoptimized
                width={150}
                height={150}
                alt="img"
                className="w-16 h-w-16"

              />
            </Link>
            </div>
    </div>
  )
}

export default Icons