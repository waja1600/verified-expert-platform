
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange: (pageNumber: number) => void
}

export function Pagination({
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize)
  
  // Generate page numbers to display
  const generatePageNumbers = () => {
    const totalNumbers = 5
    const totalPageBlocks = Math.ceil(totalPages / totalNumbers)
    const currentBlock = Math.ceil(currentPage / totalNumbers)
    
    const start = (currentBlock - 1) * totalNumbers + 1
    const end = Math.min(start + totalNumbers - 1, totalPages)
    
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx)
  }
  
  const pageNumbers = generatePageNumbers()

  return (
    <nav aria-label="Pagination" className="flex justify-center my-8">
      <ul className="flex list-none">
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className={cn("mr-1", currentPage === 1 && "opacity-50 cursor-not-allowed")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        
        {/* First Page */}
        {pageNumbers[0] > 1 && (
          <>
            <li>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(1)}
                aria-label="Page 1"
                className="mx-1"
              >
                1
              </Button>
            </li>
            {pageNumbers[0] > 2 && (
              <li className="flex items-center mx-1">
                <span className="text-gray-500">...</span>
              </li>
            )}
          </>
        )}
        
        {/* Page Numbers */}
        {pageNumbers.map((number) => (
          <li key={number}>
            <Button
              variant={currentPage === number ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(number)}
              aria-label={`Page ${number}`}
              className="mx-1"
            >
              {number}
            </Button>
          </li>
        ))}
        
        {/* Last Page */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <li className="flex items-center mx-1">
                <span className="text-gray-500">...</span>
              </li>
            )}
            <li>
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(totalPages)}
                aria-label={`Page ${totalPages}`}
                className="mx-1"
              >
                {totalPages}
              </Button>
            </li>
          </>
        )}
        
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className={cn("ml-1", currentPage === totalPages && "opacity-50 cursor-not-allowed")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}
