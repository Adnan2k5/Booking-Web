import UserLayout from "./UserLayout"
import { UserFriendRequests } from "./UserFriendRequests"

export default function UserFriendsPage() {
    return (
        <UserLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/20">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent mb-2">Friends</h1>
                            <p className="text-gray-600 text-lg">Connect with adventure partners</p>
                        </div>
                    </div>

                    {/* Content */}
                    <UserFriendRequests />
                </div>
            </div>
        </UserLayout>
    )
}
