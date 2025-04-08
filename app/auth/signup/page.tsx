'use client'
import { AlertDestructive } from "@/components/alert-destructive";
import LoginForm, { AuthFormData } from "@/components/login-form";
import { useState } from "react";
export default function Page() {
    const [error, setError] = useState<string | null>(null)
    const submitHandler = async (formdata: AuthFormData) => {
        setError(null)
        const { email, password, confirmPassword } = formdata
        console.log({ email, password, confirmPassword })
        if (confirmPassword !== undefined && password !== confirmPassword ) {
            setError("Passwords do not match.");
            return;
        }
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        console.log(res)
        const data = await res.json();
        if (res.ok) {
            console.log('Logged in:', data.user);
        } else {
            setError(data.error || 'SignUp failed. Please try again.')
        }
    };


    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            {error && <AlertDestructive key={crypto.randomUUID()} text={error} />}
            <div className="w-full max-w-sm">
                <LoginForm isLogin={false} onFormSubmit={submitHandler} />
            </div>
        </div>
    )
}
