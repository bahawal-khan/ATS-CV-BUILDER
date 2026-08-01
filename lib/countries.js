export const COUNTRIES = [
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "AE", name: "UAE", dial: "+971" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "KW", name: "Kuwait", dial: "+965" },
  { iso: "OM", name: "Oman", dial: "+968" },
  { iso: "BH", name: "Bahrain", dial: "+973" },
  { iso: "TR", name: "Turkey", dial: "+90" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "MY", name: "Malaysia", dial: "+60" },
  { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "SE", name: "Sweden", dial: "+46" },
  { iso: "NO", name: "Norway", dial: "+47" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "PT", name: "Portugal", dial: "+351" },
  { iso: "RU", name: "Russia", dial: "+7" },
  { iso: "EG", name: "Egypt", dial: "+20" },
  { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "BR", name: "Brazil", dial: "+55" },
  { iso: "MX", name: "Mexico", dial: "+52" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "IL", name: "Israel", dial: "+972" },
];

export function flagEmoji(iso) {
  try {
    return iso
      .toUpperCase()
      .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
  } catch (e) {
    return "";
  }
}
