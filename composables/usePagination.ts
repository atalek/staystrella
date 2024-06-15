import { useToast } from 'vue-toastification'

export function usePagination<T>(apiEndpoint: string) {
  const data: Ref<T[]> = ref([])
  const page = ref(1)
  const allDataFetched = ref(false)
  const isLoading = ref(false)
  const toast = useToast()

  async function fetchData(pageNumber: number) {
    isLoading.value = true
    try {
      const response = await $fetch<T[]>(apiEndpoint, {
        params: { page: pageNumber },
      })
      if (pageNumber === 1) {
        data.value = response
      } else {
        data.value = [...data.value, ...response]
      }
      allDataFetched.value = response.length === 0
    } catch (error: any) {
      console.error(error.data.message)
      toast.error(error.data.message)
    } finally {
      isLoading.value = false
    }
  }

  watch(
    () => page.value,
    async (newPage, oldPage) => {
      if (newPage !== oldPage) {
        await fetchData(newPage)
      }
    },
    { immediate: true },
  )

  async function fetchNextSet() {
    if (!allDataFetched.value && !isLoading.value) {
      page.value++
    }
  }

  return {
    data,
    page,
    allDataFetched,
    isLoading,
    fetchData,
    fetchNextSet,
  }
}
