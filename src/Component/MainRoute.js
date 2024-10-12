import { React, useState } from 'react'
import AdminPanel from './AdminPanel';
import UserForm from './UserForm';

const MainRoute = () => {

    const [showUsers, setShowUsers] = useState(false);
    return (
        <>

            <div className="flex items-center flex-col min-h-screen bg-gray-100">

                <button
                    onClick={() => setShowUsers(!showUsers)}
                    className="mt-6  bg-gray-500 text-white mb-4 font-semibold py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                {showUsers ? 'Open Form' : 'Show Admin Panel'}
                </button>

                {
                    showUsers ? <AdminPanel /> : <UserForm />
                }

            </div>


        </>
    )
}

export default MainRoute
