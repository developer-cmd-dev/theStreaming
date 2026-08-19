import CategorySection from '@/components/streaming/CategorySection'
import { topCategories } from '@/lib/mock-data'
function Browse() {
  return (
    <div className="p-4 pb-6 sm:px-5 lg:px-6">
    <CategorySection
      title="Browse Categories"
      categories={topCategories}
    />
  </div>
  )
}

export default Browse