import UserLayout from "./UserLayout"
import { UserProfile } from "./UserProfile"

export default function UserProfilePage() {
    return (
        <UserLayout>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-black">Profile</h1>
                            <p className="text-gray-600">Manage your personal information</p>
                        </div>
                    </div>

                    {/* Content */}
                    <UserProfile />
                </div>
            </div>
        </UserLayout>
    )
}
