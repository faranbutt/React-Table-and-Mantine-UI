
import Image from 'next/image'
import axios from 'axios'
import Comp from './components/MantineComp'
const UserData = async() => {
  const {data} = await axios.get('http://localhost:3000/api/users')
  return data;
}

export default async function Home() {
  const {data} = await UserData();
  
  return (
    <>
          
   <main>
   <div  className='text-7xl font-bold flex justify-center items-center text-transparent bg-clip-text bg-gradient-to-l from-red-500 to bg-orange-300'>
     React Table with Manitine UI
   </div>
   <Comp  data={data} />
   </main>
  
    </>
    
  )
}
