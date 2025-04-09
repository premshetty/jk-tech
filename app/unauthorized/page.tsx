import UnauthorizedPage from "@/components/un-authorized"
import { Suspense } from "react"


export default function Unauthorized() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UnauthorizedPage />
        </Suspense>
    )
}
