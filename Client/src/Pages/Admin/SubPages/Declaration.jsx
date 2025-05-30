"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Edit, ClipboardCheck, Save, Plus, Trash2 } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Card, CardContent } from "../../../components/ui/card"
import { Textarea } from "../../../components/ui/textarea"
import { 
  getAllDeclarations, 
  getDeclarationById, 
  createDeclaration, 
  updateDeclaration, 
  deleteDeclaration 
} from "../../../Api/declaration.api.js"

export default function Dash_Declation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDeclaration, setSelectedDeclaration] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [declarationContent, setDeclarationContent] = useState("")
  const [declarations, setDeclarations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newDeclaration, setNewDeclaration] = useState({
    title: "",
    version: "",
    content: ""
  })

  // Fetch declarations on component mount
  useEffect(() => {
    fetchDeclarations()
  }, [])

  const fetchDeclarations = async () => {
    try {
      setLoading(true)
      const data = await getAllDeclarations()
      setDeclarations(data)
    } catch (error) {
      console.error("Error fetching declarations:", error)
    } finally {
      setLoading(false)
    }  }

  // Filter declarations based on search term
  const filteredDeclarations = declarations.filter((declaration) => {
    return (
      declaration.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.version.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleSelectDeclaration = async (declaration) => {
    try {
      setSelectedDeclaration(declaration)
      setDeclarationContent(declaration.content)
      setEditMode(false)
    } catch (error) {
      console.error("Error selecting declaration:", error)
    }
  }

  const handleSaveChanges = async () => {
    try {
      if (selectedDeclaration) {
        await updateDeclaration(selectedDeclaration._id, {
          title: selectedDeclaration.title,
          version: selectedDeclaration.version,
          content: declarationContent
        })
        
        // Update the local state
        setDeclarations(declarations.map(d => 
          d._id === selectedDeclaration._id 
            ? { ...d, content: declarationContent }
            : d
        ))
        
        setEditMode(false)
        alert("Declaration updated successfully!")
      }
    } catch (error) {
      console.error("Error updating declaration:", error)
      alert("Failed to update declaration")
    }
  }

  const handleCreateDeclaration = async () => {
    try {
      if (!newDeclaration.title || !newDeclaration.version || !newDeclaration.content) {
        alert("Please fill all fields")
        return
      }

      const createdDeclaration = await createDeclaration(newDeclaration)
      setDeclarations([createdDeclaration, ...declarations])
      setNewDeclaration({ title: "", version: "", content: "" })
      setIsCreating(false)
      alert("Declaration created successfully!")
    } catch (error) {
      console.error("Error creating declaration:", error)
      alert("Failed to create declaration")
    }
  }

  const handleDeleteDeclaration = async (declarationId) => {
    try {
      if (window.confirm("Are you sure you want to delete this declaration?")) {
        await deleteDeclaration(declarationId)
        setDeclarations(declarations.filter(d => d._id !== declarationId))
        
        if (selectedDeclaration?._id === declarationId) {
          setSelectedDeclaration(null)
          setDeclarationContent("")
        }
        
        alert("Declaration deleted successfully!")
      }
    } catch (error) {
      console.error("Error deleting declaration:", error)
      alert("Failed to delete declaration")
    }
  }

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-2xl font-bold tracking-tight">User Declaration Forms</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsCreating(!isCreating)}>
              <ClipboardCheck className="mr-2 h-4 w-4" />
              {isCreating ? "Cancel" : "Add New Declaration"}
            </Button>
          </div>
        </div>

        {/* Create New Declaration Form */}
        {isCreating && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Create New Declaration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Declaration title"
                    value={newDeclaration.title}
                    onChange={(e) => setNewDeclaration({...newDeclaration, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Version</label>
                  <Input
                    placeholder="e.g., v1.0"
                    value={newDeclaration.version}
                    onChange={(e) => setNewDeclaration({...newDeclaration, version: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="Declaration content..."
                    className="min-h-[200px]"
                    value={newDeclaration.content}
                    onChange={(e) => setNewDeclaration({...newDeclaration, content: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateDeclaration}>Create Declaration</Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
            </div>            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 text-center">Loading declarations...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeclarations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No declarations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDeclarations.map((declaration) => (
                          <TableRow
                            key={declaration._id}
                            className={`cursor-pointer ${selectedDeclaration?._id === declaration._id ? "bg-muted/50" : ""}`}
                            onClick={() => handleSelectDeclaration(declaration)}
                          >
                            <TableCell className="font-medium">{declaration.title}</TableCell>
                            <TableCell>{declaration.version}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteDeclaration(declaration._id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedDeclaration ? (
              <Card>
                <CardContent className="p-4">                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedDeclaration.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Version {selectedDeclaration.version} • Created on{" "}
                        {new Date(selectedDeclaration.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {editMode ? (
                        <Button onClick={handleSaveChanges}>
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

