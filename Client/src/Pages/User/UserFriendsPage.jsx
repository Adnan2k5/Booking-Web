import UserLayout from "./UserLayout"
import { UserFriendRequests } from "./UserFriendRequests"

export default function UserFriendsPage() {
    return (
        <UserLayout>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-black">Friends</h1>
                            <p className="text-gray-600">Connect with adventure partners</p>
                        </div>
                    </div>

                    {/* Content */}
                    <UserFriendRequests />
                </div>
            </div>
        </UserLayout>
    )
}
