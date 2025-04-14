// __tests__/UserManagementTable.test.tsx
import UserManagementTable from "@/app/users/page"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

// Mock fetch
const mockUsers = [
    { id: 1, name: "Prem Kumar", email: "prem@example.com", role: "user" },
    { id: 2, name: "Raj Singh", email: "raj@example.com", role: "admin" },
]

beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
        if (options?.method === "PATCH") {
            return Promise.resolve({ ok: true, json: async () => ({}) })
        }
        if (options?.method === "DELETE") {
            return Promise.resolve({ ok: true, json: async () => ({}) })
        }
        return Promise.resolve({ ok: true, json: async () => mockUsers })
    }) as jest.Mock
})

afterEach(() => {
    jest.clearAllMocks()
})

describe("UserManagementTable", () => {
    it("renders fetched users", async () => {
        render(<UserManagementTable />)

        await waitFor(() => {
            expect(screen.getByText("Prem Kumar")).toBeInTheDocument()
            expect(screen.getByText("raj@example.com")).toBeInTheDocument()
        })
    })

    it("check roles render and click", async () => {
        render(<UserManagementTable />)
        const adminOption = await screen.findByText("Admin")
        fireEvent.click(adminOption)
    })
})
