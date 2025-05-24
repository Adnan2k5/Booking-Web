import { Button } from "../../components/ui/button"

export function NoResults({ clearFilter }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-md inline-block">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No adventures found</h3>
      <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
      <Button
        onClick={() => clearFilter("all")}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      >
        Clear all filters
      </Button>
    </div>
  )
}
