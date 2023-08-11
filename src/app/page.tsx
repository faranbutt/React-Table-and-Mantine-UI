
import Image from 'next/image'
import axios from 'axios'
import Comp from './components/MantineComp'


export default async function Home() {
  
  return (
    <>
          
   <main>
   <div  className='text-7xl font-bold flex justify-center items-center text-transparent bg-clip-text bg-gradient-to-l from-red-500 to bg-orange-300'>
     React Table with Manitine UI
   </div>
   <Comp/>
   </main>
  
    </>
    
  )
}
