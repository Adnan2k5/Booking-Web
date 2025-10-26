"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Download, ChevronDown, Trash2, UserPlus, Edit } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Label } from "../../../components/ui/label"
import { Checkbox } from "../../../components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../../components/ui/dialog"
import { createAdmin, deleteAdmin, fetchAdmins, updateAdmin } from "../../../Api/admin.api"
import { updateUser } from "../../../Api/user.api"
import { format } from "date-fns"
import { toast } from "sonner"

const deleteUser = async (userId) => {
    // Mock implementation
}


export default function Managers() {
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    // Default to showing admins when opening managers page
    const [roleFilter, setRoleFilter] = useState("admin")
    const [adminRoleFilter, setAdminRoleFilter] = useState("all")
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [showAddAdmin, setShowAddAdmin] = useState(false)
    const [addAdminLoading, setAddAdminLoading] = useState(false)
    const [addAdminForm, setAddAdminForm] = useState({
        name: "",
        email: "",
        password: "",
        adminRoles: [],
    })
    const [addAdminError, setAddAdminError] = useState("")
    const [isEdit, setIsEdit] = useState(false);

    // Admin-role options (value = stored enum, label = UI text)
    const adminRoles = [
        { value: 'Hotel', label: 'Hotel Admin' },
        { value: 'Instructor', label: 'Instructor Admin' },
        { value: 'User', label: 'User Admin' },
        { value: 'Admin', label: 'Admin' },
    ]

    const getAdminRoleLabel = (val) => {
        const found = adminRoles.find((r) => r.value === val)
        return found ? found.label : val
    }

    // Debounce search input to avoid spamming API
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 400)
        return () => clearTimeout(t)
    }, [searchTerm])

    // Fetch users function (uses debouncedSearch)
    const getUsers = useCallback(async () => {
        setLoading(true)
        try {
            // Only send top-level role param if a specific role is selected; pass undefined for 'all'
            const roleParam = roleFilter && roleFilter !== 'all' ? roleFilter : undefined
            // Only send adminRole param when filtering admins specifically and a specific admin role is selected
            const adminRoleParam = roleFilter === 'admin' && adminRoleFilter && adminRoleFilter !== 'all' ? adminRoleFilter : undefined
            const res = await fetchAdmins({ search: debouncedSearch, role: roleParam, adminRole: adminRoleParam, page })
            setUsers(res.admins)
            setTotalPages(res.totalPages)
        } catch (e) {
            setUsers([])
            setTotalPages(1)
        }
        setLoading(false)
    }, [debouncedSearch, page, roleFilter, adminRoleFilter])

    useEffect(() => {
        getUsers()
    }, [getUsers])

    // Reset to page 1 when the user starts a new search (immediate)
    useEffect(() => {
        setPage(1)
    }, [searchTerm])

    // Reset adminRoleFilter when switching away from admin top-level filter
    useEffect(() => {
        if (roleFilter !== 'admin') {
            setAdminRoleFilter('all')
        }
    }, [roleFilter])

    // Delete user handler
    const handleDeleteUser = async (userId) => {
        const toastId = toast.loading("Deleting user...")
        try {
            await deleteAdmin(userId)
            await getUsers()
            toast.success("User deleted successfully", { id: toastId })
        } catch (error) {
            console.error("Error deleting user:", error)
            toast.error("Error deleting user", { id: toastId })
        }
    }

    // Promote a top-level user to admin
    const handlePromoteUser = async (userId) => {
        const toastId = toast.loading("Promoting user to admin...")
        try {
            await updateUser(userId, { role: 'admin' })
            await getUsers()
            toast.success("User promoted to admin", { id: toastId })
        } catch (error) {
            console.error("Error promoting user:", error)
            toast.error("Failed to promote user", { id: toastId })
        }
    }

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setAddAdminForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle checkbox changes - simplified
    const handleRoleChange = (role, checked) => {
        setAddAdminForm((prev) => {
            if (checked) {
                return {
                    ...prev,
                    adminRoles: [...prev.adminRoles, role],
                }
            } else {
                return {
                    ...prev,
                    adminRoles: prev.adminRoles.filter((r) => r !== role),
                }
            }
        })
    }    // Reset form
    const resetForm = () => {
        setAddAdminForm({
            name: "",
            email: "",
            password: "",
            adminRoles: [],
        })
        setAddAdminError("")
        setIsEdit(false)
    }

    const handleEdit = (user) => {
        setAddAdminForm({
            name: user.name || "",
            email: user.email || "",
            password: "",
            adminRoles: user.admin?.adminRole || [],
            _id: user._id || "",
        })
        setShowAddAdmin(true)
        setIsEdit(true);
    }

    // Handle form submission
    const handleAddAdmin = async (e) => {
        e.preventDefault()
        setAddAdminLoading(true)
        setAddAdminError("")
        try {
            if (!isEdit) {
                const res = await createAdmin(addAdminForm)
                if (res.statusCode === 201) {
                    toast.success("Admin added successfully!")
                    resetForm()
                    setShowAddAdmin(false)
                    getUsers()
                }
            }
            else {
                const res = await updateAdmin(addAdminForm)
                if (res.statusCode === 200) {
                    toast.success("Admin updated successfully!")
                    resetForm()
                    setShowAddAdmin(false)
                    getUsers()
                }
            }
        } catch (error) {
            console.error("Error adding admin:", error)
            setAddAdminError("Failed to add admin. Please try again.")
            toast.error("Error adding admin")
        } finally {
            setAddAdminLoading(false)
        }
    }

    // Handle dialog close
    const handleDialogClose = () => {
        setShowAddAdmin(false)
        resetForm()
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <h2 className="text-2xl font-bold tracking-tight">Admin Management</h2>                <Button onClick={() => {
                    resetForm()
                    setShowAddAdmin(true)
                }} size="sm" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" /> Add Admin
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search users..."
                        className="w-full sm:w-[300px] pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Users</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter("user")}>Explorers</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter("admin")}>Admins</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter("instructor")}>Instructors</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* When 'Admins' is selected, show a secondary filter for admin.adminRole */}
                    {roleFilter === 'admin' && (
                        <select
                            value={adminRoleFilter}
                            onChange={(e) => setAdminRoleFilter(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value="all">All Admin Roles</option>
                            {adminRoles.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    )}

                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Assigned Roles</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : !users || users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No admins found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user?.role === 'admin' ? (
                                                Array.isArray(user.admin?.adminRole) && user.admin?.adminRole.length > 0 ? (
                                                    user.admin.adminRole.map((role) => (
                                                        <Badge key={role} variant="outline" className="mr-1">
                                                            {getAdminRoleLabel(role)}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    // admin with no specific adminRole -> super-admin/admin
                                                    <Badge variant="outline">Admin</Badge>
                                                )
                                            ) : (
                                                // non-admin users: show their top-level role (capitalized)
                                                <Badge variant="outline">
                                                    {user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'User'}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {user?.createdAt && new Date(user.createdAt).getTime()
                                                ? format(new Date(user.createdAt), 'dd/MM/yyyy')
                                                : 'N/A'
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                {user?.role === 'admin' ? (
                                                    <>
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user?._id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    // For non-admin users, allow quick promotion to admin
                                                    <Button variant="ghost" size="icon" onClick={() => handlePromoteUser(user?._id)} title="Promote to Admin">
                                                        <UserPlus className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    <div className="flex justify-end items-center gap-2 p-4">
                        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                            Prev
                        </Button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Add Admin Dialog */}
            <Dialog open={showAddAdmin} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Edit Admin" : "Add Admin"}</DialogTitle>
                        <DialogDescription>{isEdit ? "Update the fields" : "Fill in the details to add a new admin and assign roles."}</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddAdmin} className="space-y-4">
                        <div>
                            <Label htmlFor="admin-name">Name</Label>
                            <Input id="admin-name" name="name" value={addAdminForm.name} onChange={handleInputChange} required />
                        </div>

                        <div>
                            <Label htmlFor="admin-email">Email</Label>
                            <Input
                                id="admin-email"
                                name="email"
                                type="email"
                                value={addAdminForm.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="admin-password">Password</Label>
                            <Input
                                id="admin-password"
                                name="password"
                                type="password"
                                value={addAdminForm.password}
                                onChange={handleInputChange}
                                required={isEdit ? false : true}
                            />
                        </div>

                        <div>
                            <Label>Assign Roles</Label>
                            <div className="flex flex-col gap-2 mt-2">
                                {adminRoles.map((r) => (
                                    <div key={r.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`role-${r.value}`}
                                            checked={addAdminForm.adminRoles.includes(r.value)}
                                            onCheckedChange={(checked) => handleRoleChange(r.value, checked)}
                                        />
                                        <Label htmlFor={`role-${r.value}`}>{r.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {addAdminError && <div className="text-red-500 text-sm">{addAdminError}</div>}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleDialogClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={addAdminLoading}>
                                {addAdminLoading ? "Adding..." : isEdit ? "Update Admin" : "Add Admin"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div >
    )
}
