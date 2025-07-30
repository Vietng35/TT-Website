import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Page from '../src/pages/login'
import { DEFAULT_USERS } from '@/Utils/User'

vi.mock('../src/hooks/useAuth', () => ({
    useAuth: () => ({
        user: null,
        users: [],
        login: vi.fn(() => true),
        logout: vi.fn()
    })
}))

describe('Login Page', () => {
    test('has heading "Login"', () => {
        render(<Page />)
        expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeDefined()

    })

    test('has username input', () => {
        expect(screen.getByTestId('login-username')).toBeDefined()
    })

    test('has password input with type=password', () => {
        const inputPassword = screen.getByTestId('login-password')
        expect(inputPassword).toBeDefined()
        expect(inputPassword).property('type', 'password')
    })

    test('has button input with type=submit', () => {
        const buttonInLogin = screen.getByTestId('login-button')
        expect(buttonInLogin).toBeDefined()
        expect(buttonInLogin).property('type', 'submit')
    })

    test('clicks submit button, message changes to "Incorrect username or password"', () => {
        const buttonInLogin = screen.getByTestId('login-button')
        fireEvent.click(buttonInLogin)
        expect(screen.getByTestId('login-message').textContent).toContain('Incorrect username or password')
    })

    test('clicks submit button, message changes to "Please enter a valid email"'),() =>{
        const inputUsername = screen.getByTestId('login-username') as HTMLInputElement
        const inputPassword = screen.getByTestId('login-password') as HTMLInputElement
        const buttonInLogin = screen.getByTestId('login-button')

        fireEvent.change(inputUsername, { target: { value:"lecturer"} })
        fireEvent.change(inputPassword, { target: { value:"9ye983"} })
        fireEvent.click(buttonInLogin)

        expect(screen.getByTestId('login-message').textContent).toContain('Please enter a valid email')
    }

    const passwordErrorMessage = 'Please enter a password contains 8-12 characters with at least one lowercase letter, one uppercase letter, one number and a special character'
    test(`clicks submit button, message changes to "${passwordErrorMessage}"`),() =>{
        const inputUsername = screen.getByTestId('login-username') as HTMLInputElement
        const inputPassword = screen.getByTestId('login-password') as HTMLInputElement
        const buttonInLogin = screen.getByTestId('login-button')

        fireEvent.change(inputUsername, { target: { value:"lecturer@rmit.edu.vn"} })
        fireEvent.change(inputPassword, { target: { value:"9ye983"} })
        fireEvent.click(buttonInLogin)

        expect(screen.getByTestId('login-message').textContent).toContain(passwordErrorMessage)
    }



    test('login successfully, show the dialog', () => {
        const inputUsername = screen.getByTestId('login-username') as HTMLInputElement
        const inputPassword = screen.getByTestId('login-password') as HTMLInputElement
        const buttonInLogin = screen.getByTestId('login-button')
        const user = DEFAULT_USERS[0]

        fireEvent.change(inputUsername, { target: { value: user.username } })
        expect(inputUsername.value).toEqual(user.username)
        fireEvent.change(inputPassword, { target: { value: user.password } })
        expect(inputPassword.value).toEqual(user.password)

        fireEvent.click(buttonInLogin)

        expect(screen.getByTestId('login-dialog')).toBeDefined()

    })
})