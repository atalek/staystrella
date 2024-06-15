import { useToast } from 'vue-toastification'
import type { Listing, QueryParams } from '~/types'

export function useFilteredPagination() {
  const route = useRoute()
  const query = computed(() => route.query)
  const page = ref(1)
  const allListingsFetched = ref(false)
  const toast = useToast()
  const isLoading = ref(true)
  const allListings = ref<Listing[]>([])

  async function fetchListings(pageNumber: number, filters: QueryParams) {
    isLoading.value = true
    try {
      const response = await $fetch('/api/v1/listings', {
        params: { ...filters, page: pageNumber },
      })
      if (pageNumber === 1) {
        allListings.value = response
      } else {
        allListings.value = [...allListings.value, ...response]
      }
      allListingsFetched.value = response.length === 0
    } catch (err) {
      console.error(err)
      toast.error('Error fetching listings')
    } finally {
      isLoading.value = false
    }
  }

  watch(
    query,
    (newQuery, oldQuery = {}) => {
      const filtersChanged = Object.keys(newQuery).some(
        key => key !== 'page' && newQuery[key] !== oldQuery[key],
      )
      if (filtersChanged) {
        page.value = 1
        allListings.value = []
        allListingsFetched.value = false
      }
      fetchListings(page.value, newQuery)
    },
    { deep: true, immediate: true },
  )

  async function fetchNextSet() {
    if (!allListingsFetched.value && !isLoading.value) {
      page.value++
      fetchListings(page.value, query.value)
    }
  }

  return { allListings, isLoading, fetchListings, fetchNextSet }
}
