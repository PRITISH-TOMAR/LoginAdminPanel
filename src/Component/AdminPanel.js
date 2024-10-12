import {React, useState, useEffect} from 'react'
import axios from 'axios'


const AdminPanel = () => {
    const [usersData, setUsersData] = useState([]);      


    useEffect(()=>{

        const toggleUsersData = async () => {
        
            // console.log( process.env.REACT_APP_API_END )
        
          try {
            const response = await axios.get( process.env.REACT_APP_API_END); 
            setUsersData(response.data.users);
        } catch (error) {
            console.error("Error fetching users' data:", error);
        
    }
};

toggleUsersData()

}, [])
      

  return (
    <div className='w-full overflow-x-auto'>
    
      { usersData.length  ?
        <div className="mt-6 p-6 rounded-lg shadow-lg ">
        
          <table className="table-auto w-full text-left border-collapse overflow-x-auto">
  <thead>
    <tr className="bg-blue-600 text-white">
      <th className="border px-4 py-2">Name</th>
      <th className="border px-4 py-2">Social Media Handle</th>
      <th className="border px-4 py-2">Uploaded Images</th>
    </tr>
  </thead>
  <tbody>
    {usersData.map((user, index) => (
      <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
        <td className="border px-4 py-2 text-gray-800">{user.username}</td>
        <td className="border px-4 py-2 text-gray-800"> <a target="_blank" href={user.social_media_handle}>{user.social_media_handle} </a></td>
        <td className="border px-4 py-2">
          <div className="flex overflow-x-auto space-x-2 w-full">
            {user.images.map((image, index) => (
              <a key={index} href={image} target="_blank" >
                <img src={image} alt="Uploaded" className="min-w-16 h-16 object-cover flex-shrink-0 border rounded-md hover:border-blue-500" />
              </a>
            ))}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>


        </div>
      :  
      
      "Loading..."
      }
    </div>
  )
}

export default AdminPanel
