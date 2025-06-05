import UserLayout from "./UserLayout"
import { UserTickets } from "./UserTickets"

export default function UserTicketsPage() {
    return (
        <UserLayout>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-black">Support Tickets</h1>
                            <p className="text-gray-600">Get help and track your requests</p>
                        </div>
                    </div>

                    {/* Content */}
                    <UserTickets />
                </div>
            </div>
        </UserLayout>
    )
}
