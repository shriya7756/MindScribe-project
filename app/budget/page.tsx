"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Calculator,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BookOpen,
  Calendar,
  User,
} from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
}

const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Other Income"]
const expenseCategories = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Healthcare",
  "Education",
  "Other Expense",
]

export default function BudgetPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [user, setUser] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Form states
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    const userData = localStorage.getItem("mindscribe_user")
    if (userData) {
      setUser(JSON.parse(userData))
      loadTransactions()
    }
  }, [])

  const loadTransactions = () => {
    const savedTransactions = localStorage.getItem("mindscribe_transactions")
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }

  const saveTransaction = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Please enter a valid amount greater than 0")
      return
    }

    if (!category) {
      alert("Please select a category")
      return
    }

    if (!date) {
      alert("Please select a date")
      return
    }

    try {
      const transaction: Transaction = {
        id: editingTransaction ? editingTransaction.id : Date.now().toString(),
        type,
        amount: Number.parseFloat(Number.parseFloat(amount).toFixed(2)),
        category,
        description: description.trim(),
        date,
        createdAt: editingTransaction ? editingTransaction.createdAt : new Date().toISOString(),
      }

      let updatedTransactions
      if (editingTransaction) {
        updatedTransactions = transactions.map((t) => (t.id === editingTransaction.id ? transaction : t))
      } else {
        updatedTransactions = [...transactions, transaction]
      }

      setTransactions(updatedTransactions)
      localStorage.setItem("mindscribe_transactions", JSON.stringify(updatedTransactions))

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      alert("Error saving transaction. Please try again.")
      console.error("Transaction save error:", error)
    }
  }

  const deleteTransaction = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        const updatedTransactions = transactions.filter((t) => t.id !== id)
        setTransactions(updatedTransactions)
        localStorage.setItem("mindscribe_transactions", JSON.stringify(updatedTransactions))
        alert("Transaction deleted successfully!")
      } catch (error) {
        alert("Error deleting transaction. Please try again.")
        console.error("Delete error:", error)
      }
    }
  }

  const resetForm = () => {
    setType("expense")
    setAmount("")
    setCategory("")
    setDescription("")
    setDate(new Date().toISOString().split("T")[0])
    setEditingTransaction(null)
  }

  const editTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setType(transaction.type)
    setAmount(transaction.amount.toString())
    setCategory(transaction.category)
    setDescription(transaction.description)
    setDate(transaction.date)
    setIsDialogOpen(true)
  }

  // Calculate totals
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  // Daily calculations
  const dailyTransactions = transactions.filter((t) => t.date === selectedDate)
  const dailyIncome = dailyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const dailyExpenses = dailyTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const dailyBalance = dailyIncome - dailyExpenses

  // Recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  // Category breakdown
  const categoryTotals = transactions.reduce(
    (acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = { income: 0, expense: 0 }
      }
      acc[transaction.category][transaction.type] += transaction.amount
      return acc
    },
    {} as Record<string, { income: number; expense: number }>,
  )

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
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Calculator className="w-4 h-4 mr-2" />
              Budget
            </Button>

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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Total Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Total Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card
                className={`border-${balance >= 0 ? "green" : "red"}-200 bg-${balance >= 0 ? "green" : "red"}-50/50`}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className={`text-sm font-medium text-${balance >= 0 ? "green" : "red"}-700 flex items-center gap-2`}
                  >
                    <DollarSign className="w-4 h-4" />
                    Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold text-${balance >= 0 ? "green" : "red"}-600`}>
                    ${balance.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Balance */}
            <Card className="border-yellow-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-amber-800">Daily Balance</CardTitle>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto border-yellow-200 focus:border-orange-400"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">${dailyIncome.toFixed(2)}</div>
                    <div className="text-sm text-green-700">Income</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">${dailyExpenses.toFixed(2)}</div>
                    <div className="text-sm text-red-700">Expenses</div>
                  </div>
                  <div className={`text-center p-4 bg-${dailyBalance >= 0 ? "green" : "red"}-50 rounded-lg`}>
                    <div className={`text-xl font-bold text-${dailyBalance >= 0 ? "green" : "red"}-600`}>
                      ${dailyBalance.toFixed(2)}
                    </div>
                    <div className={`text-sm text-${dailyBalance >= 0 ? "green" : "red"}-700`}>Balance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-amber-800">Recent Transactions</CardTitle>
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
                        Add Transaction
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-yellow-200">
                      <DialogHeader>
                        <DialogTitle className="text-amber-800">
                          {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-amber-800">Type</Label>
                          <Select value={type} onValueChange={(value: "income" | "expense") => setType(value)}>
                            <SelectTrigger className="border-yellow-200 focus:border-orange-400">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="amount" className="text-amber-800">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="border-yellow-200 focus:border-orange-400"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-amber-800">Category</Label>
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="border-yellow-200 focus:border-orange-400">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {(type === "income" ? incomeCategories : expenseCategories).map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-amber-800">
                            Description
                          </Label>
                          <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Transaction description"
                            className="border-yellow-200 focus:border-orange-400"
                          />
                        </div>
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
                        <div className="flex gap-2">
                          <Button
                            onClick={saveTransaction}
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                          >
                            {editingTransaction ? "Update Transaction" : "Save Transaction"}
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
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {recentTransactions.length === 0 ? (
                    <p className="text-amber-700 text-sm text-center py-8">No transactions yet</p>
                  ) : (
                    <div className="space-y-2">
                      {recentTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex justify-between items-center p-3 bg-yellow-50/50 rounded-lg border border-yellow-100"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={transaction.type === "income" ? "default" : "destructive"}
                                className={
                                  transaction.type === "income"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {transaction.type}
                              </Badge>
                              <span className="font-medium text-amber-800">{transaction.category}</span>
                            </div>
                            <p className="text-sm text-amber-600 mt-1">{transaction.description}</p>
                            <p className="text-xs text-amber-500">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                transaction.type === "income" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-amber-600 hover:bg-amber-100"
                                onClick={() => editTransaction(transaction)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
                                onClick={() => deleteTransaction(transaction.id)}
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-xl text-amber-800">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {Object.keys(categoryTotals).length === 0 ? (
                    <p className="text-amber-700 text-sm">No categories yet</p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(categoryTotals).map(([category, totals]) => (
                        <div key={category} className="p-3 bg-white/50 rounded-lg">
                          <h4 className="font-medium text-amber-800 mb-2">{category}</h4>
                          {totals.income > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-green-700">Income:</span>
                              <span className="text-green-600 font-medium">${totals.income.toFixed(2)}</span>
                            </div>
                          )}
                          {totals.expense > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-red-700">Expenses:</span>
                              <span className="text-red-600 font-medium">${totals.expense.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader>
                <CardTitle className="text-xl text-amber-800">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-amber-700">Total Transactions:</span>
                  <span className="font-medium text-amber-800">{transactions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">This Month Income:</span>
                  <span className="font-medium text-green-600">
                    $
                    {transactions
                      .filter(
                        (t) =>
                          t.type === "income" &&
                          new Date(t.date).getMonth() === new Date().getMonth() &&
                          new Date(t.date).getFullYear() === new Date().getFullYear(),
                      )
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">This Month Expenses:</span>
                  <span className="font-medium text-red-600">
                    $
                    {transactions
                      .filter(
                        (t) =>
                          t.type === "expense" &&
                          new Date(t.date).getMonth() === new Date().getMonth() &&
                          new Date(t.date).getFullYear() === new Date().getFullYear(),
                      )
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
