"use client"

import { useState, useEffect } from "react" // Import useEffect
import { motion } from "framer-motion"
import { Search, Edit, FileText, Save } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Textarea } from "../../../components/ui/textarea"
import { getAllTermDocuments } from "../../../Api/terms,api.js" // Import the API function

export default function Dash_Terms() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [termContent, setTermContent] = useState("")
  const [terms, setTerms] = useState([]) // State for API fetched terms
  const [isLoading, setIsLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state

  // Sample content for a selected term - This might need to be fetched or adjusted
  const sampleContent = `
# General Terms and Conditions

## 1. Introduction
These Terms and Conditions govern your use of our adventure services and website. By booking with us, you agree to these terms.

## 2. Booking and Payment
- All bookings require a 30% deposit.
- Full payment is due 30 days before the adventure date.
- Payments are accepted via credit card, bank transfer, or PayPal.

## 3. Cancellation Policy
- Cancellations made 30+ days before: Full refund minus processing fee.
- Cancellations made 15-29 days before: 50% refund.
- Cancellations made 0-14 days before: No refund.

## 4. Liability
We take all reasonable steps to ensure your safety, but adventure activities involve inherent risks. Participants must follow all safety instructions.

## 5. Insurance
All participants are strongly advised to obtain travel insurance that covers adventure activities.

## 6. Changes to Bookings
We reserve the right to modify or cancel adventures due to weather conditions, insufficient participants, or circumstances beyond our control.

## 7. Privacy
Your personal information will be handled according to our Privacy Policy.

## 8. Governing Law
These terms are governed by the laws of [Jurisdiction].

Last Updated: February 15, 2025
Version: 3.2
  `

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true)
        const data = await getAllTermDocuments()
        console.log("Fetched terms:", data)
        // Assuming the API returns an array of term documents
        // And each document has at least: id, title, version, status, lastUpdated
        // You might need to map the data if the structure is different
        setTerms(data || [])
        setError(null)
      } catch (err) {
        console.error("Failed to fetch terms:", err)
        setError("Failed to load terms. Please try again later.")
        setTerms([]) // Set to empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchTerms()
  }, [])

  // Filter terms based on search term
  const filteredTerms = terms.filter((term) => {
    return term.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleSelectTerm = (term) => {
    setSelectedTerm(term)
    setTermContent(sampleContent)
    setEditMode(false)
  }

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold tracking-tight">Terms & Conditions</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Add New Terms
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search terms..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan="3" className="text-center">Loading terms...</TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan="3" className="text-center text-red-500">{error}</TableCell>
                      </TableRow>
                    ) : filteredTerms.length === 0 && !searchTerm ? (
                      <TableRow>
                        <TableCell colSpan="3" className="text-center">No terms documents found.</TableCell>
                      </TableRow>
                    ) : filteredTerms.length === 0 && searchTerm ? (
                       <TableRow>
                        <TableCell colSpan="3" className="text-center">No terms matching your search.</TableCell>
                      </TableRow>
                    ) : (
                      filteredTerms.map((term) => (
                        <TableRow
                          key={term._id || term.id} 
                          className={`cursor-pointer ${selectedTerm?._id === term._id || selectedTerm?.id === term.id ? "bg-muted/50" : ""}`}
                          onClick={() => handleSelectTerm(term)}
                        >
                          <TableCell className="font-medium">{term.title}</TableCell>
                          <TableCell>v{term.version}</TableCell>
                          <TableCell>
                            <Badge variant={term.status === "active" ? "default" : "secondary"}>
                              {term.status ? term.status.charAt(0).toUpperCase() + term.status.slice(1) : 'N/A'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedTerm ? (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedTerm.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Version {selectedTerm.version} • Last updated on{" "}
                        {new Date(selectedTerm.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {editMode ? (
                        <Button onClick={() => setEditMode(false)}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => setEditMode(true)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>

                  {editMode ? (
                    <Textarea
                      className="min-h-[500px] font-mono text-sm"
                      value={termContent}
                      onChange={(e) => setTermContent(e.target.value)}
                    />
                  ) : (
                    <div className="prose max-w-none dark:prose-invert">
                      <pre className="whitespace-pre-wrap text-sm">{termContent}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] border rounded-lg border-dashed">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No Terms Selected</h3>
                  <p className="text-sm text-muted-foreground">Select a terms document from the list to view or edit</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
  )
}

