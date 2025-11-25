"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpAZ, ArrowDownAZ, Search, Trophy, Calendar, Users, Star, HeartIcon, Bug } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardDescription, CardTitle, CardFooter, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SearchItem {
  id: number
  creator: string
  title: string
  description: string
  tags: string[]
}

interface Challenge {
  id: number
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  participants: number
  deadline: string
  prize: string
  tags: string[]
}

interface ChallengeCardItem {
  id: number
  title: string
  description: string
  labels: string[]
  liked?: boolean
}

interface Label {
  id: number
  name: string
  color: string
}

interface SearchComponentProps {
  data: SearchItem[]
}

interface ChallengeSearchProps {
  challenges: Challenge[]
}

interface ChallengeCardSearchProps {
  items: ChallengeCardItem[]
  labels: Label[]
}

// LabelBadge Component
const LabelBadge = ({ labels }: { labels: Label[] }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {labels.map((label) => (
        <Badge 
          key={label.id} 
          variant="outline" 
          style={{ backgroundColor: label.color + '20', borderColor: label.color, color: label.color }}
        >
          {label.name}
        </Badge>
      ))}
    </div>
  )
}

// Challenge Card Component for Search Grid
const ChallengeCardComponent = ({ item, labels }: { item: ChallengeCardItem; labels: Label[] }) => {
  const itemLabels = labels.filter(label => item.labels.includes(label.name))
  
  return (
    <Card className="flex w-full flex-col justify-between sm:max-h-48 bg-card gap-3 rounded-lg shadow-none">
      <CardHeader className="flex items-center justify-start">
        <CardTitle className="font-medium">{item.title}</CardTitle>
        <Bug className="size-5 shrink-0 text-red-500" />
      </CardHeader>
      <CardContent className="">
        <CardDescription className="text-sm text-muted-foreground">
          {item.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="my-0 py-0">
        <LabelBadge labels={itemLabels} />
      </CardFooter>
    </Card>
  )
}

// Full Page Challenge Card Search Component
const ChallengeCardSearchComponent = ({ items, labels }: ChallengeCardSearchProps) => {
  const [query, setQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("") 
  const [filteredItems, setFilteredItems] = useState(items)

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase().trim()
    let results = items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery) ||
        item.labels.some((label) => label.toLowerCase().includes(lowerCaseQuery))
    )

    if (sortOrder === "asc") {
      results.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOrder === "desc") {
      results.sort((a, b) => b.title.localeCompare(a.title))
    }

    setFilteredItems(results)
  }, [query, sortOrder, items])

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header Section */}
      <div className="w-full border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Issue Tracker</h1>
            <p className="text-xl text-muted-foreground">Browse and manage project issues</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search issues by title, description, or labels..."
                className="w-full pr-10 h-12 text-lg"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 bg-transparent px-6">
                  Sort By
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                  <ArrowUpAZ className="mr-2 h-4 w-4" />
                  Name A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  Name Z-A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredItems.length} {filteredItems.length === 1 ? 'issue' : 'issues'} found
            {query && ` for "${query}"`}
          </p>
        </div>

        {/* Grid Layout - 5 items per row */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex w-full ">
                <ChallengeCardComponent 
                  item={item} 
                  labels={labels}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No issues found</h3>
            <p className="text-muted-foreground mb-4">
              {query 
                ? `No issues match "${query}". Try adjusting your search.`
                : "No issues available at the moment."
              }
            </p>
            {query && (
              <Button variant="outline" onClick={() => setQuery("")}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const SearchComponent = ({ data }: SearchComponentProps) => {
  const [query, setQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("")
  const [filteredData, setFilteredData] = useState(data)

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase().trim()
    const results = data.filter((item) => item.title.toLowerCase().includes(lowerCaseQuery))

    if (sortOrder === "asc") {
      results.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOrder === "desc") {
      results.sort((a, b) => b.title.localeCompare(a.title))
    }

    setFilteredData(results)
  }, [query, sortOrder, data])

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      {/* Search Input and Sort Dropdown */}
      <div className="w-full md:w-[40%] max-w-lg flex flex-col sm:flex-row gap-4">
        {/* Search Bar with Icon */}
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search your data..."
            className="w-full pr-10"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setSortOrder("asc")} className="flex justify-between items-center">
              <span>Title Ascending</span>
              <ArrowUpAZ className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("desc")} className="flex justify-between items-center">
              <span>Title Descending</span>
              <ArrowDownAZ className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Results with Scroll */}
      <ScrollArea className="h-72 w-full md:w-[40%] max-w-lg border rounded-md">
        <div className="p-4 space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id} className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium leading-none">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-secondary text-secondary-foreground text-xs px-2.5 py-0.5 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No results found.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

const SearchComponentLight = ({ data }: SearchComponentProps) => {
  const [query, setQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("")
  const [filteredData, setFilteredData] = useState(data)

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase().trim()
    const results = data.filter((item) => item.title.toLowerCase().includes(lowerCaseQuery))

    if (sortOrder === "asc") {
      results.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOrder === "desc") {
      results.sort((a, b) => b.title.localeCompare(a.title))
    }

    setFilteredData(results)
  }, [query, sortOrder, data])

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Minimal Search Input */}
      <div className="w-full flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search..."
            className="w-full pr-8 h-8 text-sm border-0 bg-muted/50 focus-visible:ring-1"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => setSortOrder("asc")} className="text-xs">
              A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("desc")} className="text-xs">
              Z-A
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Minimal Results */}
      <ScrollArea className="h-48 w-full">
        <div className="space-y-2">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id} className="p-2 hover:bg-muted/50 rounded border-0">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8 text-xs">No results</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

const ChallengeSearchComponent = ({ challenges }: ChallengeSearchProps) => {
  const [query, setQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "deadline" | "participants" | "">("") 
  const [difficultyFilter, setDifficultyFilter] = useState<"Easy" | "Medium" | "Hard" | "">("")
  const [filteredChallenges, setFilteredChallenges] = useState(challenges)

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase().trim()
    let results = challenges.filter(
      (challenge) =>
        challenge.title.toLowerCase().includes(lowerCaseQuery) ||
        challenge.description.toLowerCase().includes(lowerCaseQuery) ||
        challenge.category.toLowerCase().includes(lowerCaseQuery) ||
        challenge.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery)),
    )

    if (difficultyFilter) {
      results = results.filter((challenge) => challenge.difficulty === difficultyFilter)
    }

    if (sortOrder === "asc") {
      results.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortOrder === "desc") {
      results.sort((a, b) => b.title.localeCompare(a.title))
    } else if (sortOrder === "deadline") {
      results.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    } else if (sortOrder === "participants") {
      results.sort((a, b) => b.participants - a.participants)
    }

    setFilteredChallenges(results)
  }, [query, sortOrder, difficultyFilter, challenges])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Challenge Search</h1>
        </div>
        <p className="text-muted-foreground">Discover and join exciting challenges</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search challenges by title, description, category, or tags..."
            className="w-full pr-10 h-12"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 bg-transparent">
                Difficulty {difficultyFilter && `(${difficultyFilter})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDifficultyFilter("")}>All Levels</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficultyFilter("Easy")}>Easy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficultyFilter("Medium")}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficultyFilter("Hard")}>Hard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 bg-transparent">
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                <ArrowUpAZ className="mr-2 h-4 w-4" />
                Title A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                Title Z-A
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("deadline")}>
                <Calendar className="mr-2 h-4 w-4" />
                Deadline
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("participants")}>
                <Users className="mr-2 h-4 w-4" />
                Most Popular
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results */}
      <ScrollArea className="h-[600px] w-full border rounded-lg">
        <div className="p-6 space-y-4">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => (
              <div key={challenge.id} className="bg-card p-6 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <Trophy className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold leading-tight">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{challenge.category}</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{challenge.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {challenge.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(challenge.difficulty)}`}
                    >
                      {challenge.difficulty}
                    </span>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{challenge.participants}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{challenge.deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      <Star className="h-4 w-4" />
                      <span>{challenge.prize}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No challenges found</p>
              <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}



export { SearchComponent, SearchComponentLight, ChallengeSearchComponent, ChallengeCardSearchComponent }
export type { SearchItem, Challenge, ChallengeCardItem, Label }
