"use client"
import { AlertDestructive } from "@/components/alert-destructive";
import LoginForm, { AuthFormData } from "@/components/login-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null)

    const submitHandler = async (formdata: AuthFormData) => {
        setError(null)
        const { email, password } = formdata
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            console.log('Logged in:', data.user);
            localStorage.setItem("user", JSON.stringify(data.user))
            router.push("/");
        } else {
            console.log(error)
            setError(data.error || 'Login failed. Please try again.')
        }
    };



    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            {error && <AlertDestructive key={crypto.randomUUID()} text={error} />}
            <div className="w-full max-w-sm">
                <LoginForm isLogin={true} onFormSubmit={submitHandler} />
            </div>
        </div>
    )
}