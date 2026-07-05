"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Palette, ImageIcon, Video, X } from "lucide-react"
import Link from "next/link"

const colorOptions = [
  "#FEF3C7", // yellow-100
  "#FED7AA", // orange-100
  "#FDE68A", // yellow-200
  "#FDBA74", // orange-200
  "#FCD34D", // yellow-300
  "#FB923C", // orange-300
  "#F59E0B", // yellow-500
  "#EA580C", // orange-600
  "#D97706", // yellow-600
  "#C2410C", // orange-700
]

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

export default function EditJournalPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("#FEF3C7")
  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const journals = JSON.parse(localStorage.getItem("mindscribe_journals") || "[]")
    const journal = journals.find((j: Journal) => j.id === params.id)
    if (journal) {
      setTitle(journal.title)
      setContent(journal.content)
      setBackgroundColor(journal.backgroundColor)
      setImages(journal.images || [])
      setVideos(journal.videos || [])
    } else {
      router.push("/")
    }
    setLoading(false)
  }, [params.id, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setVideos((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    try {
      const journals = JSON.parse(localStorage.getItem("mindscribe_journals") || "[]")
      const journalIndex = journals.findIndex((j: Journal) => j.id === params.id)

      if (journalIndex === -1) {
        alert("Journal not found. It may have been deleted.")
        router.push("/")
        return
      }

      journals[journalIndex] = {
        ...journals[journalIndex],
        title: title.trim() || "Untitled",
        content: content.trim(),
        backgroundColor,
        images,
        videos,
        hasImages: images.length > 0,
        hasVideos: videos.length > 0,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem("mindscribe_journals", JSON.stringify(journals))

      // Show success message
      alert("Journal updated successfully!")
      router.push(`/journal/${params.id}`)
    } catch (error) {
      alert("Error updating journal. Please try again.")
      console.error("Update error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-700">Loading journal...</p>
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
            <Link href={`/journal/${params.id}`}>
              <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-amber-800">Edit Journal</h1>
          </div>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto border-yellow-200" style={{ backgroundColor: backgroundColor + "40" }}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-amber-800">Edit Your Journal</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Color
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Add Images
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => videoInputRef.current?.click()}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Add Videos
                </Button>
              </div>
            </div>

            {showColorPicker && (
              <div className="flex flex-wrap gap-2 p-4 bg-white/50 rounded-lg">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      backgroundColor === color
                        ? "border-amber-600 ring-2 ring-amber-300"
                        : "border-gray-300 hover:border-amber-400"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setBackgroundColor(color)
                      setShowColorPicker(false)
                    }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-amber-800">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your journal a title..."
                className="border-yellow-200 focus:border-orange-400 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-amber-800">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts, experiences, or memories..."
                className="border-yellow-200 focus:border-orange-400 min-h-[200px] resize-none"
              />
            </div>

            {/* Images */}
            {images.length > 0 && (
              <div className="space-y-2">
                <Label className="text-amber-800">Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-yellow-200"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <div className="space-y-2">
                <Label className="text-amber-800">Videos</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <video
                        src={video}
                        controls
                        className="w-full h-48 object-cover rounded-lg border border-yellow-200"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                        onClick={() => removeVideo(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
