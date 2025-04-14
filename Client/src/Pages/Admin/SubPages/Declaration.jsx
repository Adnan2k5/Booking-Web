"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Edit, ClipboardCheck, Save } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Card, CardContent } from "../../../components/ui/card"
import { Textarea } from "../../../components/ui/textarea"

// Mock data for user declarations
const mockDeclarations = [
  {
    id: 1,
    title: "Health and Fitness Declaration",
    version: "2.1",
    lastUpdated: "2025-02-10",
    status: "active",
    applicableFor: "All Adventures",
    createdBy: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    title: "Water Activities Safety Declaration",
    version: "1.5",
    lastUpdated: "2025-01-15",
    status: "active",
    applicableFor: "Water Sports",
    createdBy: "Michael Brown",
  },
  {
    id: 3,
    title: "Altitude Sickness Awareness",
    version: "3.0",
    lastUpdated: "2025-03-01",
    status: "active",
    applicableFor: "Mountain Climbing",
    createdBy: "Dr. Robert Wilson",
  },
  {
    id: 4,
    title: "Diving Medical Questionnaire",
    version: "2.2",
    lastUpdated: "2025-02-20",
    status: "active",
    applicableFor: "Scuba Diving",
    createdBy: "Dr. Emily Davis",
  },
  {
    id: 5,
    title: "General Liability Waiver",
    version: "4.1",
    lastUpdated: "2025-02-28",
    status: "active",
    applicableFor: "All Adventures",
    createdBy: "Legal Department",
  },
]

export default function Dash_Declation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDeclaration, setSelectedDeclaration] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [declarationContent, setDeclarationContent] = useState("")

  // Sample content for a selected declaration
  const sampleContent = `
# Health and Fitness Declaration Form

This form must be completed by all participants before engaging in adventure activities.

## Personal Information
- Full Name: ________________________
- Date of Birth: ____/____/________
- Emergency Contact: ________________
- Emergency Contact Phone: __________

## Health Information
Please answer the following questions honestly. Your safety depends on it.

1. Do you have any medical conditions that could affect your participation in physical activities?
   □ Yes □ No
   If yes, please specify: ________________________

2. Are you currently taking any medication?
   □ Yes □ No
   If yes, please specify: ________________________

3. Do you have any allergies?
   □ Yes □ No
   If yes, please specify: ________________________

4. Have you had any injuries in the past 12 months?
   □ Yes □ No
   If yes, please specify: ________________________

5. Do you have any heart conditions or high blood pressure?
   □ Yes □ No

6. Do you have any respiratory conditions (e.g., asthma)?
   □ Yes □ No

7. Are you pregnant?
   □ Yes □ No □ Not Applicable

## Declaration
I hereby declare that the information provided above is true and complete to the best of my knowledge. I understand that participating in adventure activities involves inherent risks, and I voluntarily accept these risks. I agree to follow all safety instructions provided by the guides and staff.

Signature: ________________________
Date: ____/____/________

Version: 2.1
Last Updated: February 10, 2025
  `

  // Filter declarations based on search term
  const filteredDeclarations = mockDeclarations.filter((declaration) => {
    return (
      declaration.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.applicableFor.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleSelectDeclaration = (declaration) => {
    setSelectedDeclaration(declaration)
    setDeclarationContent(sampleContent)
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
          <h2 className="text-2xl font-bold tracking-tight">User Declaration Forms</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Add New Declaration
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search declarations..."
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
                      <TableHead>Applicable For</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeclarations.map((declaration) => (
                      <TableRow
                        key={declaration.id}
                        className={`cursor-pointer ${selectedDeclaration?.id === declaration.id ? "bg-muted/50" : ""}`}
                        onClick={() => handleSelectDeclaration(declaration)}
                      >
                        <TableCell className="font-medium">{declaration.title}</TableCell>
                        <TableCell>v{declaration.version}</TableCell>
                        <TableCell>{declaration.applicableFor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedDeclaration ? (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedDeclaration.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Version {selectedDeclaration.version} • Last updated on{" "}
                        {new Date(selectedDeclaration.lastUpdated).toLocaleDateString()}
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
                      value={declarationContent}
                      onChange={(e) => setDeclarationContent(e.target.value)}
                    />
                  ) : (
                    <div className="prose max-w-none dark:prose-invert">
                      <pre className="whitespace-pre-wrap text-sm">{declarationContent}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] border rounded-lg border-dashed">
                <div className="text-center">
                  <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-semibold">No Declaration Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a declaration form from the list to view or edit
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
  )
}

