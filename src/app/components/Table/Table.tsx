import axios from "axios"
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import {
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMantineReactTable,
  MRT_Cell,
} from 'mantine-react-table';
import {Input ,ActionIcon, Button, Flex, Text, Tooltip, Title, Select } from '@mantine/core';
import { IconTrash, IconAt } from '@tabler/icons-react';
import { User } from "@/utils/drizzle";
import { ModalsProvider, modals } from '@mantine/modals';

const Cities = [
  "ISLAMABAD 🇵🇰",
  "LONDON 🇬🇧",
  "DELHI 🇮🇳",
  "NEWYORK 🇺🇸"
]

const UserData = async() => {
  const {data} = await axios.get('http://localhost:3000/api/users')
  return data;
}

const postUserData = async({name,email,city}:{name:any,email:any,city:any}) => {
  const data  =await axios.post('http://localhost:3000/api/users',{
    name,email,city
  })
  console.log("POST Request",data)
}

const updateUserData = async({id,field,value}:{id:number,field:string|null,value:string})=>{
  console.log("Inside Update",{id,field,value})
  const data = await axios.patch("http://localhost:3000/api/users",{
    id,field,value
  })
  
}

const deleteUser = async({id}:{id:number}) => {
   console.log("Inside Delete",id);
   const data = await axios.delete(`http://localhost:3000/api/users?id=${id}`)
}

export default function Tables({queryClient}:{queryClient:any}){
  const {data,status}:{data:any,status:any} = useQuery(['users'],UserData);
  const [email,setEmail]  = useState('');
  const [name,setName]  = useState('');
  const [city,setCity]  = useState<string | null>('');
  const {mutate} = useMutation(postUserData, {
    onSuccess:(data)=>{
      console.log(data)
      queryClient.invalidateQueries('users')
    }
  })
  const updateMutation = useMutation(updateUserData,{
    onSuccess(data) {
        queryClient.invalidateQueries('users')
    },
  })

  const deleteMutation = useMutation(deleteUser,{
    onSuccess(data) {
        queryClient.invalidateQueries('users')
    },
  })

const addUser = (name:any,email:any,city:any) => {
  console.log("InsideAdd user,",email,name,city)
  mutate({name, email, city})
}

const deleteUserWithMutate = (id:any) => {
  console.log("InsideDelete user,",id)
  deleteMutation.mutate({id})

}


const columns = useMemo<MRT_ColumnDef<User>[]>(
  () => [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'city',
      header: 'City',
      editVariant: 'select',
      mantineEditSelectProps: ({ row }) => ({
        data: Cities,
        //store edited user in state to be saved later
        onChange: (value: any) =>{
          const field = city;
          const id = row.original.id;
          updateUserData({id,field,value})
        }
          
      }),
    },
  ],
  [],
);
const handleSaveCell = (cell: MRT_Cell<User>, value: any) => {
  const id = cell.row._valuesCache.id;
  const field = cell.column.id;
  updateMutation.mutate({id,field,value})
}

// const table = useMantineReactTable({
//   columns:columns,
//   data: data.data,
//   createDisplayMode: 'row',
//   editDisplayMode:"cell",
//   enableEditing:true,
//   mantineEditTextInputProps:({ cell }) => ({
//     //onBlur is more efficient, but could use onChange instead
//     onBlur: (event) => {
//       handleSaveCell(cell, event.target.value);
//     },
//   })

// })
const openDeleteConfirmModal = (row: MRT_Row<User>) =>{
  deleteUserWithMutate(row.original.id)
}


  if(status === 'loading'){
    return <p>Loading...</p>
  }
  if(status === 'error'){
    return <p>Error!</p>
  }
  if(status==='success'){
    return(
      <div className="m-10">
        <div><i>Double click on cells to edit existing data</i></div>
      <MantineReactTable 
      columns={columns} 
      data={data.data} 
      createDisplayMode="row"
      editDisplayMode="cell"
      enableEditing
      enableRowActions
      positionActionsColumn="last"
    
      mantineEditTextInputProps={({ cell }) => ({
            //onBlur is more efficient, but could use onChange instead
            onBlur: (event) => {
              handleSaveCell(cell, event.target.value);
            },
          })}
      renderRowActions={({ row }) => (
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      )}
      mantineTableBodyProps={{
        style:{
          backgroundColor:'gray',
          border:'1px solid blue',
          borderRadius:"5%",
        }
      }}
      />
    <div className="flex flex-col justify-center items-center">  
    <div className='flex flex-col md:flex-row justify-between gap-10 p-8'>
      <div>
          <Title order={3}>Email</Title>
          <Input icon={<IconAt />} placeholder="Your email" type="text" onChange={(e)=>setEmail(e.target.value)}/>
      </div>
      <div>
          <Title order={3}>Name</Title>
          <Input type="text" placeholder="Your name" onChange={(e)=>setName(e.target.value)}/>
      </div>
      <div>
          <Title order={3}>City</Title>
          <Select
            value = {data.value}
            onChange={setCity}
            placeholder="Pick one"
             data={[
           { value: 'ISLAMABAD', label: 'ISLAMABAD 🇵🇰' },
           { value: 'LONDON', label: 'LONDON 🇬🇧' },
           { value: 'DELHI', label: 'DELHI 🇮🇳' },
            { value: 'NEWYORK', label: 'NEWYORK 🇺🇸' },
            
      ]}
    />
          {/* <Input type="text" placeholder="You City" onChange={(e)=>setCity(e.target.value)}/> */}
      </div>
      </div>
      <div className="flex justify-center items-center ">
        <button className="bg-gradient-to-b from-orange-300 to-red-400 w-32 px-3 py-2 rounded-lg">Add</button>
      </div>
      </div>
    </div>
    )
  }
}