import axios from "axios";

export async function changePassword(email:string, newPassword:string)
{
    const response = await axios.post("http://localhost:3000/changepassword", {
        email,
        newPassword
    });
    return response.data;
}