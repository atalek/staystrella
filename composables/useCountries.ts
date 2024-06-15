import countries from 'world-countries'

const formattedCountries = countries.map(country => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
}))

export function useCountries() {
  function getAll() {
    return formattedCountries
  }

  function getByValue(value?: string) {
    if (value) {
      return formattedCountries.find(item => item.value == value)
    }
  }
  return { getAll, getByValue }
}
