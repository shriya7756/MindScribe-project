"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2, Calendar } from "lucide-react"
import Link from "next/link"

interface Journal {
  id: string
  title: string
  content: string
  backgroundColor: string
  images: string[]
  videos: string[]
  createdAt: string
  updatedAt: string
}

export default function ViewJournalPage() {
  const [journal, setJournal] = useState<Journal | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    try {
      const journals = JSON.parse(localStorage.getItem("mindscribe_journals") || "[]")
      const foundJournal = journals.find((j: Journal) => j.id === params.id)
      if (foundJournal) {
        setJournal(foundJournal)
      } else {
        alert("Journal not found. It may have been deleted.")
        router.push("/")
      }
    } catch (error) {
      console.error("Error loading journal:", error)
      alert("Error loading journal. Please try again.")
      router.push("/")
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  const handleDelete = () => {
    if (!journal) return

    if (confirm("Are you sure you want to delete this journal? This action cannot be undone.")) {
      try {
        const journals = JSON.parse(localStorage.getItem("mindscribe_journals") || "[]")
        const updatedJournals = journals.filter((j: Journal) => j.id !== params.id)
        localStorage.setItem("mindscribe_journals", JSON.stringify(updatedJournals))
        alert("Journal deleted successfully!")
        router.push("/")
      } catch (error) {
        console.error("Delete error:", error)
        alert("Error deleting journal. Please try again.")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading journal...</p>
        </div>
      </div>
    )
  }

  if (!journal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-700 mb-4">Journal not found</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-yellow-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-amber-800">View Journal</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/journal/${journal.id}/edit`}>
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card
          className="max-w-4xl mx-auto border-yellow-200"
          style={{ backgroundColor: journal.backgroundColor + "40" }}
        >
          <CardHeader>
            <CardTitle className="text-2xl text-amber-800">{journal.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Calendar className="w-4 h-4" />
              <span>Created: {new Date(journal.createdAt).toLocaleDateString()}</span>
              {journal.updatedAt !== journal.createdAt && (
                <span>• Updated: {new Date(journal.updatedAt).toLocaleDateString()}</span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {journal.content && (
              <div className="prose max-w-none">
                <p className="text-amber-800 whitespace-pre-wrap leading-relaxed">{journal.content}</p>
              </div>
            )}

            {journal.images && journal.images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-800">Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {journal.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Journal image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg border border-yellow-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        // Open image in new tab for full view
                        const newWindow = window.open()
                        if (newWindow) {
                          newWindow.document.write(`<img src="${image}" style="max-width:100%;height:auto;" />`)
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {journal.videos && journal.videos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-800">Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {journal.videos.map((video, index) => (
                    <video
                      key={index}
                      src={video}
                      controls
                      className="w-full h-64 object-cover rounded-lg border border-yellow-200 shadow-sm"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ))}
                </div>
              </div>
            )}

            {!journal.content &&
              (!journal.images || journal.images.length === 0) &&
              (!journal.videos || journal.videos.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-amber-600">This journal entry is empty.</p>
                  <Link href={`/journal/${journal.id}/edit`}>
                    <Button className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                      Add Content
                    </Button>
                  </Link>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
