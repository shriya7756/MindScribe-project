"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Clock,
  BookOpen,
  Calculator,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  color: string
  createdAt: string
}

const eventColors = [
  "#FEF3C7", // yellow-100
  "#FED7AA", // orange-100
  "#FDE68A", // yellow-200
  "#FDBA74", // orange-200
  "#FCD34D", // yellow-300
  "#FB923C", // orange-300
]

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [user, setUser] = useState<any>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [color, setColor] = useState(eventColors[0])

  useEffect(() => {
    const userData = localStorage.getItem("mindscribe_user")
    if (userData) {
      setUser(JSON.parse(userData))
      loadEvents()
    }
  }, [])

  const loadEvents = () => {
    const savedEvents = localStorage.getItem("mindscribe_events")
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }

  const saveEvent = () => {
    if (!title.trim()) {
      alert("Please enter an event title")
      return
    }

    if (!date) {
      alert("Please select a date for the event")
      return
    }

    try {
      const event: Event = {
        id: editingEvent ? editingEvent.id : Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        date,
        time,
        color,
        createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString(),
      }

      let updatedEvents
      if (editingEvent) {
        updatedEvents = events.map((e) => (e.id === editingEvent.id ? event : e))
      } else {
        updatedEvents = [...events, event]
      }

      setEvents(updatedEvents)
      localStorage.setItem("mindscribe_events", JSON.stringify(updatedEvents))

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      alert("Error saving event. Please try again.")
      console.error("Event save error:", error)
    }
  }

  const deleteEvent = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const updatedEvents = events.filter((e) => e.id !== id)
        setEvents(updatedEvents)
        localStorage.setItem("mindscribe_events", JSON.stringify(updatedEvents))
        alert("Event deleted successfully!")
      } catch (error) {
        alert("Error deleting event. Please try again.")
        console.error("Delete error:", error)
      }
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDate("")
    setTime("")
    setColor(eventColors[0])
    setEditingEvent(null)
  }

  const editEvent = (event: Event) => {
    setEditingEvent(event)
    setTitle(event.title)
    setDescription(event.description)
    setDate(event.date)
    setTime(event.time)
    setColor(event.color)
    setIsDialogOpen(true)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const todayEvents = events.filter((event) => event.date === new Date().toISOString().split("T")[0])
  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

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
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
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
                  window.location.href = "/"
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="border-yellow-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl text-amber-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("prev")}
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("next")}
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            resetForm()
                            setIsDialogOpen(true)
                          }}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white border-yellow-200">
                        <DialogHeader>
                          <DialogTitle className="text-amber-800">
                            {editingEvent ? "Edit Event" : "Add New Event"}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title" className="text-amber-800">
                              Title
                            </Label>
                            <Input
                              id="title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Event title"
                              className="border-yellow-200 focus:border-orange-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description" className="text-amber-800">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Event description"
                              className="border-yellow-200 focus:border-orange-400"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="date" className="text-amber-800">
                                Date
                              </Label>
                              <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border-yellow-200 focus:border-orange-400"
                              />
                            </div>
                            <div>
                              <Label htmlFor="time" className="text-amber-800">
                                Time
                              </Label>
                              <Input
                                id="time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="border-yellow-200 focus:border-orange-400"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-amber-800">Color</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {eventColors.map((eventColor) => (
                                <button
                                  key={eventColor}
                                  type="button"
                                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                                    color === eventColor
                                      ? "border-amber-600 ring-2 ring-amber-300"
                                      : "border-gray-300 hover:border-amber-400"
                                  }`}
                                  style={{ backgroundColor: eventColor }}
                                  onClick={() => setColor(eventColor)}
                                  aria-label={`Select color ${eventColor}`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={saveEvent}
                              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                            >
                              {editingEvent ? "Update Event" : "Save Event"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                              className="border-orange-300 text-orange-600 hover:bg-orange-50"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-amber-700 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentDate).map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[80px] p-1 border border-yellow-100 rounded ${
                        day ? "bg-white/50 hover:bg-yellow-50" : ""
                      }`}
                    >
                      {day && (
                        <>
                          <div className="text-sm font-medium text-amber-800 mb-1">{day}</div>
                          <div className="space-y-1">
                            {getEventsForDate(day)
                              .slice(0, 2)
                              .map((event) => (
                                <div
                                  key={event.id}
                                  className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                                  style={{ backgroundColor: event.color }}
                                  onClick={() => editEvent(event)}
                                >
                                  {event.title}
                                </div>
                              ))}
                            {getEventsForDate(day).length > 2 && (
                              <div className="text-xs text-amber-600">+{getEventsForDate(day).length - 2} more</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <Card className="border-orange-200 bg-gradient-to-br from-yellow-100 to-orange-100">
              <CardHeader>
                <CardTitle className="text-xl text-amber-800 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Today's Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayEvents.length === 0 ? (
                  <p className="text-amber-700 text-sm">No events today</p>
                ) : (
                  <div className="space-y-2">
                    {todayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg border border-yellow-200"
                        style={{ backgroundColor: event.color }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-amber-800">{event.title}</h4>
                            {event.time && <p className="text-sm text-amber-600">{event.time}</p>}
                            {event.description && <p className="text-sm text-amber-700 mt-1">{event.description}</p>}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-amber-600 hover:bg-amber-100"
                              onClick={() => editEvent(event)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
                              onClick={() => deleteEvent(event.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-xl text-amber-800">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-amber-700 text-sm">No upcoming events</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 rounded-lg border border-yellow-200"
                          style={{ backgroundColor: event.color }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-amber-800">{event.title}</h4>
                              <p className="text-sm text-amber-600">
                                {new Date(event.date).toLocaleDateString()}
                                {event.time && ` at ${event.time}`}
                              </p>
                              {event.description && (
                                <p className="text-sm text-amber-700 mt-1 line-clamp-2">{event.description}</p>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-amber-600 hover:bg-amber-100"
                                onClick={() => editEvent(event)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
                                onClick={() => deleteEvent(event.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
