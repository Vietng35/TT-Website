import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Login() {
    // Use useAuth from AuthContext
    const { login } = useAuth();

    const [message, setMessage] = useState(""); //Status Message

    //A function to handle login action
    const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
        const form = e.target as HTMLFormElement

        let email = (form.querySelector('input') as HTMLInputElement).value
        const password = (form.querySelector('input[type=password]') as HTMLInputElement).value

        e.preventDefault();

        if (!email || !password) {
            setMessage("Incorrect username or password");
            return
        }

        email = email.toLowerCase()
        //validate citeria email for siging - up
        const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

        if (!email.match(emailPattern)) {
            setMessage("Fail email pattern")
            return;
        }
        if (!email.includes("@rmit.edu.au")) {
            setMessage("Email must have @rmit.edu.au")
            return;
        }

        // Call the login function from AuthContext
        // If login is successful, set the message to "Success"
        // If login fails, set the message to "Failed to login, please check your username and password"
        if (await login(email, password)) {
            setMessage("Success");
        }
        else {
            setMessage("Failed to login, please check your username and password");
        }
    };

    return (
        <>
            <form
                onSubmit={handleLogin}
                className="flex flex-col items-center justify-center border-2 w-[300px] border-red-700 p-6 rounded-lg shadow-2xl mx-auto mt-40 relative bg-white/80"
            >
                <h1 className="font-bold underline text-3xl">Login</h1>
                {message !== "Success" && message && <p data-testid="login-message" className={`bg-red-100 w-60 p-4 flex flex-col items-center text-red-500 rounded-md text-center`}>
                    {message}
                </p>}

                <div className="mb-5">
                    <label htmlFor="emailLogin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input
                        data-testid="login-username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Username"
                        type="emailLogin"
                        onChange={() => setMessage('')}
                    />
                </div>

                <div className="mb-5">

                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input
                        data-testid="login-password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="password"
                        placeholder="Password"
                        onChange={() => setMessage('')}
                    />
                </div>
                <button
                    data-testid="login-button"
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Sign-in
                </button>



            </form>
            {message === "Success" && <div data-testid="login-dialog" className="fixed top-0 left-0 w-full h-full bg-black/20 flex justify-center items-center">
                <p className={`bg-blue-100 w-60 p-4 flex flex-col items-center rounded-md  text-green-400`}>
                    Your logged in successfully
                    <Link href={'/'}
                        className={`bg-green-200 text-black border-2 p-4 rounded hover:cursor-pointer`}>
                        Ok
                    </Link>
                </p>
            </div>}
        </>
    );
}

