import React from 'react'
import axios from 'axios'

export default function signup() {
    const handleSignup: React.FormEventHandler<HTMLFormElement> = async (e) => {
        const form = e.target as HTMLFormElement
        const email = (form.querySelector('input') as HTMLInputElement).value
        const password = (form.querySelector('input[type=password]') as HTMLInputElement).value

        e.preventDefault();

        const newUser = {
            email,
            password
        }

        const respons = await axios.post(
            "http://localhost:3000/users/sign-up",
            newUser,
        )

        if (respons.data.status) {
            alert("Creating user successfully")
        }
        else {
            alert(respons.data.message)
        }
    }
    return (
        <>
            <form
                onSubmit={handleSignup}
                className="flex flex-col items-center justify-center border-2 w-[300px] border-red-700 p-6 rounded-lg shadow-2xl mx-auto mt-40 relative bg-white/80"
            >
                <h1 className="font-bold underline text-3xl">Sign Up</h1>
                <div className='mb-5'>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="email"
                        id="email"
                        placeholder="Username ..."
                    />
                </div>

                <div className='mb-5'>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="password"
                        id="password"
                        placeholder="Password ..."
                    />

                </div>
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Sign-up
                </button>

            </form>
        </>
    );
}

