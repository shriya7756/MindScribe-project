"use client"

import { useState, useEffect } from "react"
import { Plus, BookOpen, Calendar, Palette, Edit, Trash2, Eye, Calculator, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface Journal {
  id: string
  title: string
  content: string
  backgroundColor: string
  createdAt: string
  updatedAt: string
  hasImages: boolean
  hasVideos: boolean
}

export default function HomePage() {
  const [journals, setJournals] = useState<Journal[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication status
    const userData = localStorage.getItem("mindscribe_user")
    if (userData) {
      setUser(JSON.parse(userData))
      setIsAuthenticated(true)
      loadJournals()
    }
  }, [])

  const loadJournals = () => {
    const savedJournals = localStorage.getItem("mindscribe_journals")
    if (savedJournals) {
      setJournals(JSON.parse(savedJournals))
    }
  }

  const deleteJournal = (id: string) => {
    if (confirm("Are you sure you want to delete this journal?")) {
      const updatedJournals = journals.filter((journal) => journal.id !== id)
      setJournals(updatedJournals)
      localStorage.setItem("mindscribe_journals", JSON.stringify(updatedJournals))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                mindScribe
              </h1>
              <p className="text-xl text-amber-700 max-w-2xl mx-auto">
                Your personal digital journal for capturing life's moments, managing events, and tracking finances
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg bg-transparent"
                >
                  Register
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mt-16 max-w-6xl mx-auto">
              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardHeader>
                  <BookOpen className="w-8 h-8 text-yellow-600 mx-auto" />
                  <CardTitle className="text-yellow-800">Rich Journals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700">Write with text, images, and videos all in one place</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <Calendar className="w-8 h-8 text-orange-600 mx-auto" />
                  <CardTitle className="text-orange-800">Event Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700">Mark important events and set reminders</p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <Calculator className="w-8 h-8 text-amber-600 mx-auto" />
                  <CardTitle className="text-amber-800">Budget Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700">Track spending and income with daily balance</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardHeader>
                  <Palette className="w-8 h-8 text-yellow-600 mx-auto" />
                  <CardTitle className="text-yellow-800">Personalize</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700">Customize with your favorite colors</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-yellow-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            mindScribe
          </h1>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-amber-600 hover:bg-amber-100">
                <BookOpen className="w-4 h-4 mr-2" />
                Journals
              </Button>
            </Link>
            <Link href="/calendar">
              <Button variant="ghost" className="text-amber-600 hover:bg-amber-100">
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
            </Link>
            <Link href="/budget">
              <Button variant="ghost" className="text-amber-600 hover:bg-amber-100">
                <Calculator className="w-4 h-4 mr-2" />
                Budget
              </Button>
            </Link>

            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-yellow-200">
              <User className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700 text-sm">{user?.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("mindscribe_user")
                  localStorage.removeItem("mindscribe_journals")
                  localStorage.removeItem("mindscribe_events")
                  localStorage.removeItem("mindscribe_transactions")
                  setIsAuthenticated(false)
                  setUser(null)
                  window.location.reload()
                }}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-120px)]">
          {/* Left Half - Journal List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-amber-800 mb-6">Your Journals</h2>
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                {journals.length === 0 ? (
                  <Card className="border-yellow-200 bg-yellow-50/50">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <p className="text-yellow-700">No journals yet. Start writing your first entry!</p>
                    </CardContent>
                  </Card>
                ) : (
                  journals.map((journal) => (
                    <Card
                      key={journal.id}
                      className="border-yellow-200 hover:shadow-lg transition-shadow cursor-pointer"
                      style={{ backgroundColor: journal.backgroundColor + "20" }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-amber-800 line-clamp-1">
                            {journal.title || "Untitled"}
                          </CardTitle>
                          <div className="flex gap-1">
                            <Link href={`/journal/${journal.id}`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-100"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/journal/${journal.id}/edit`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-100"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-100"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                deleteJournal(journal.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-amber-700 text-sm line-clamp-3 mb-3">
                          {journal.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            {journal.hasImages && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Images
                              </Badge>
                            )}
                            {journal.hasVideos && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                Videos
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-amber-600">
                            {new Date(journal.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Half - Dashboard */}
          <div className="space-y-6">
            <Card className="border-orange-200 bg-gradient-to-br from-yellow-100 to-orange-100">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-800">Welcome back, {user?.name}!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{journals.length}</div>
                    <div className="text-sm text-orange-700">Total Journals</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {journals.filter((j) => j.hasImages || j.hasVideos).length}
                    </div>
                    <div className="text-sm text-yellow-700">With Media</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-xl text-amber-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/journal/new">
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Write New Journal
                  </Button>
                </Link>
                <Link href="/calendar">
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
                <Link href="/budget">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-600 hover:bg-amber-50 bg-transparent"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Track Budget
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-xl text-amber-800">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <p className="text-amber-700 text-sm">Rich media journals with text, images, and videos</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className="text-amber-700 text-sm">Calendar events and reminders for important dates</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <p className="text-amber-700 text-sm">Budget tracking with daily balance calculations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating Add Button */}
        <Link href="/journal/new">
          <Button
            size="lg"
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all z-50"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
