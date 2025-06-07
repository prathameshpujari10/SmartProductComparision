"use client"
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'

export default function ProductListing({ params }: { params: {slug: string} }) {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(6)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/search/${params.slug}`)
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
         console.log("API response data:", data); // Log the data

    // Check if products are in the expected format
    if (Array.isArray(data.products)) {
      setProducts(data.products);
    } else {
      console.error("Expected an array but got:", data.products);
      setProducts([]); // Ensure products is an empty array if the expected data structure is not met
    }
        setProducts(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load products. Please try again later.')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [params.slug]) // Re-fetch when category changes

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  const totalPages = Math.ceil(products.length / productsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleProductsPerPageChange = (value: string) => {
    setProductsPerPage(Number(value))
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-8">Our Products in {params.slug}</h1>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select value={productsPerPage.toString()} onValueChange={handleProductsPerPageChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="6" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {currentProducts.map((product,idx) => (
          <Card key={idx} className="flex flex-col justify-between w-full">
            <CardHeader>
              <img src={product.img} alt={product.name} className="w-44 h-48 rounded-t-lg" />
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">{product.name}</CardTitle>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <div className="flex items-center mb-2">
                <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
              </div>
              <p className="text-lg font-bold">${product.price}</p>
            </CardContent>
            <CardFooter>
            <Link href={`/specs/${product.link.split("/").slice(-2).join("/")}`}>
              <Button className="w-32">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            onClick={() => handlePageChange(index + 1)}
            className="w-10 h-10 p-0"
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

