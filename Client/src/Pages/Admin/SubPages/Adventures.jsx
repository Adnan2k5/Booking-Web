import { useEffect, useState } from "react"
import { Download, Plus, Search } from 'lucide-react'
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Card, CardContent } from "../../../components/ui/card"
import { deleteAdventure } from "../../../Api/adventure.api"
import { toast } from "sonner"
import AdventureTableRow from "./../../../components/AdventureTableRow"
import { useAdventures } from "../../../hooks/useAdventure"
import { useNavigate } from "react-router-dom"

export default function AdventuresPage() {
  const navigate = useNavigate()

  // Use the custom hook to fetch all adventures with pagination
  const {
    adventures,
    isLoading,
    refetch,
    page,
    setPage,
    totalPages,
    total,
    search,
    setSearch,
  } = useAdventures()

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this adventure?")) {
      return
    }
    const toastId = toast.loading("Deleting adventure...")
    try {
      const res = await deleteAdventure(id)
      if (res.status === 200) {
        toast.success("Adventure deleted successfully", { id: toastId })
      }
      refetch()
    } catch (error) {
      toast.error("Error deleting adventure", { id: toastId })
      console.log(error)
    }
  }

  // Pagination controls
  const handlePrev = () => setPage((p) => Math.max(1, p - 1))
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Adventures</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate("/admin/adventures/new")} className="bg-black hover:bg-gray-800 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Adventure
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search adventures..."
                className="w-[200px] sm:w-[300px] pl-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1) // Reset to first page on new search
                }}
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Instructors</TableHead>
                    <TableHead className="text-left">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableHead colSpan={5} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                        </div>
                      </TableHead>
                    </TableRow>
                  ) : adventures.length === 0 ? (
                    <TableRow>
                      <TableHead colSpan={5} className="text-center py-8">
                        No adventures found
                      </TableHead>
                    </TableRow>
                  ) : (
                    adventures.map((adventure, idx) => (
                      <AdventureTableRow
                        key={adventure._id || idx}
                        adventure={adventure}
                        onEdit={() => navigate(`/admin/adventures/edit/${adventure._id}`)}
                        onDelete={() => handleDelete(adventure._id)}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePrev} disabled={page === 1} variant="outline" size="sm">
              Prev
            </Button>
            <span>
              Page {page} of {totalPages} ({total} adventures)
            </span>
            <Button onClick={handleNext} disabled={page === totalPages} variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
