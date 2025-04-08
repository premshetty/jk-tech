"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRef } from "react"

export type AuthFormData = {
    email: string;
    password: string;
    name?: string;
    confirmPassword?: string;
};

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
    isLogin?: boolean;
    onFormSubmit?: (data: AuthFormData) => void;
}

export default function LoginForm({
    className,
    isLogin = true,
    onFormSubmit,
    ...props
}: LoginFormProps) {
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries()) as AuthFormData
        onFormSubmit?.(data)
        formRef.current?.reset()
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {isLogin ? "Login" : "Sign Up"}
                    </CardTitle>
                    <CardDescription>
                        {isLogin
                            ? "Enter your email below to login to your account"
                            : "Create your account by filling in the details below"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} ref={formRef}>
                        <div className="flex flex-col gap-6">
                            {!isLogin && (
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        name="name"
                                        required
                                    />
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {isLogin && (
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    )}
                                </div>
                                <Input id="password" type="password" name="password" required />
                            </div>
                            {!isLogin && (
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        required
                                    />
                                </div>
                            )}
                            <Button type="submit" className="w-full">
                                {isLogin ? "Login" : "Sign Up"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <Link
                                href={isLogin ? "/auth/signup" : "/auth/login"}
                                className="underline underline-offset-4"
                            >
                                {isLogin ? "Sign Up" : "Login"}
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
