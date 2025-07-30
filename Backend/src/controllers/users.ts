import { myDataSource } from "../app-data-source"
import { UserEntity } from "../entities/user.entity"
import { createHash } from "crypto"

export const userRepository = myDataSource.getRepository(UserEntity)

/**
 * 
 * @param email User's email
 * @param password User's password
 * @returns status and a message if an error occurs
 */
export async function signUpTutor(email: string, password: string) {
    email = email.toLowerCase()
    //validate citeria email for siging - up
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    if (!email.match(emailPattern)) return {
        status: false, message: "Fail email pattern"
    }

    if (!email.includes("@rmit.edu.au")) return {
        status: false, message: "Email must have @rmit.edu.au"
    }

    //validate pass at least 8 keys more / Minimum eight characters, at least one letter, one number and one special character:
    const passPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    if (!password.match(passPattern)) return {
        status: false, message: "Password not strong"
    }

    //Validate existing email
    const result = await userRepository.findOne({
        where: {
            email: email
        }
    })

    if (result) return {
        status: false, message: "Existing Email"
    };

    //Create new user and assign to role Tutor
    const newUser = new UserEntity()
    newUser.name = email
    newUser.email = email
    newUser.role = "Tutor"

    //Hash password
    const hashPassword = createHash("sha256").update(password).digest('hex')
    newUser.hashPassword = hashPassword
    newUser.isBlock = false

    try {
        await userRepository.save(newUser)
    } catch (error) {
        return {
            status: false, message: "server Error"
        }
    }

    return {
        status: true
    }
}
/**
 * 
 * @param email User's email
 * @param password User's password
 * @returns status, a message if an error occurs and an object of User containing user details
 */

export async function changePassword(email:string,newPassword:string){
    email=email.toLowerCase()
    const user = await userRepository.findOne({
        where:{
            email
        }
    })

    if(!user) return {
        status: false, message: "User not found"
    }

    const passPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    if (!newPassword.match(passPattern)) return {
        status: false, message: "Password not strong"
    }

    user.hashPassword = createHash("sha256").update(newPassword).digest('hex')
    await userRepository.save(user)

    return {
        status: true,
        message: "Password changed successfully"
    }
}

export async function signInTutor(email: string, password: string) {
    email = email.toLowerCase()
    //validate citeria email for siging - up
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    if (!email.match(emailPattern)) return {
        status: false, message: "Fail email pattern"
    }

    if (!email.includes("@rmit.edu.au")) return {
        status: false, message: "Email must have @rmit.edu.au"
    }

    //validate password
    const hashPasswordInput = createHash("sha256").update(password).digest('hex')
    const user = await userRepository.findOne({
        where: {
            email,
            hashPassword: hashPasswordInput
        }
    })

    if (!user) return {
        status: false, message: "Wrong password or Wrong email"
    }

    if (user.isBlock) return {
        status: false, message: "Your account has been blocked. Please contact the admin!"
    }

    const token = createHash("sha256").update(Date.now() + email).digest('hex')

    user.token = token
    await userRepository.save(user)

    delete user.hashPassword

    return {
        status: true, user
    }

}

