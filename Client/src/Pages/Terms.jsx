import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { getLiveTerms } from '../Api/terms.api'
import { toast } from 'sonner'

export const Terms = () => {
  const [termsData, setTermsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch the latest published terms (no title required for public endpoint)
        const data = await getLiveTerms()
        setTermsData(data)
      } catch (err) {
        console.error('Error fetching terms:', err)
        setError(err.message || 'Failed to load terms')
        toast.error('Failed to load terms and conditions')
      } finally {
        setLoading(false)
      }
    }

    fetchTerms()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] mt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-700">Loading terms and conditions...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-8 mt-20"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Unable to load terms</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl">
                    {termsData?.title || 'Terms and Conditions'}
                  </CardTitle>
                  {termsData?.publishedAt && (
                    <p className="text-sm text-gray-600 mt-1">
                      Last updated: {formatDate(termsData.publishedAt)}
                    </p>
                  )}
                  {termsData?.version && (
                    <p className="text-xs text-gray-500">
                      Version: {termsData.version}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {termsData?.content ? (
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: termsData.content }}
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Terms Available
                  </h3>
                  <p className="text-gray-600">
                    Terms and conditions are currently being updated. Please check back later.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            If you have any questions about these terms, please{' '}
            <Link to="/contact" className="text-blue-600 hover:text-blue-800 underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </motion.div>

      <Footer />
    </div>
  )
}

export default Terms
