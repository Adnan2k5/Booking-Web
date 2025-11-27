import UserLayout from "./UserLayout"
import { UserTickets } from "./UserTickets"

export default function UserTicketsPage() {
    return (
        <UserLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-amber-800 to-orange-800 bg-clip-text text-transparent mb-2">Support Tickets</h1>
                            <p className="text-gray-600 text-lg">Get help and track your requests</p>
                        </div>
                    </div>

                    {/* Content */}
                    <UserTickets />
                </div>
            </div>
        </UserLayout>
    )
}
