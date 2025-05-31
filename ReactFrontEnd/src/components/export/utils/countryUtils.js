// Helper function to get full country name from country code
export const getFullCountryName = (code) => {
  if (!code) return '';
  
  // Map of common country codes to full names
  const countryMap = {
    'AF': 'Afghanistan',
    'AL': 'Albania',
    'DZ': 'Algeria',
    'AD': 'Andorra',
    'AO': 'Angola',
    'AR': 'Argentina',
    'AU': 'Australia',
    'AT': 'Austria',
    'BE': 'Belgium',
    'BR': 'Brazil',
    'CA': 'Canada',
    'CN': 'China',
    'DK': 'Denmark',
    'EG': 'Egypt',
    'FR': 'France',
    'DE': 'Germany',
    'GR': 'Greece',
    'IN': 'India',
    'ID': 'Indonesia',
    'IT': 'Italy',
    'JP': 'Japan',
    'MA': 'Morocco',
    'NL': 'Netherlands',
    'NZ': 'New Zealand',
    'NG': 'Nigeria',
    'NO': 'Norway',
    'PK': 'Pakistan',
    'PT': 'Portugal',
    'RU': 'Russia',
    'SA': 'Saudi Arabia',
    'ZA': 'South Africa',
    'ES': 'Spain',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'TH': 'Thailand',
    'TR': 'Turkey',
    'AE': 'United Arab Emirates',
    'GB': 'United Kingdom',
    'US': 'United States',
    // Add more as needed
  };
  
  return countryMap[code] || code;
}; 