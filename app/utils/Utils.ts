const stateMap: Record<string, string> = {
  "Andhra Pradesh": "01",
  "Arunachal Pradesh": "02",
  Assam: "03",
  Bihar: "04",
  Chhattisgarh: "05",
  Goa: "06",
  Gujarat: "07",
  Haryana: "08",
  "Himachal Pradesh": "09",
  Jharkhand: "10",
  Karnataka: "11",
  Kerala: "12",
  "Madhya Pradesh": "13",
  Maharashtra: "14",
  Manipur: "15",
  Meghalaya: "16",
  Mizoram: "17",
  Nagaland: "18",
  Odisha: "19",
  Punjab: "20",
  Rajasthan: "21",
  Sikkim: "22",
  "Tamil Nadu": "23",
  Telangana: "24",
  Tripura: "25",
  "Uttar Pradesh": "26",
  Uttarakhand: "27",
  "West Bengal": "28",
  "Andaman and Nicobar Islands": "29",
  Chandigarh: "30",
  "Dadra and Nagar Haveli and Daman and Diu": "31",
  Delhi: "32",
  Lakshadweep: "33",
  Puducherry: "34",
};

export const smIdGenerator = (state: string, sn: number) => {
  return `SM${stateMap[state]}${makeNDigitNumber(sn, 5)}`;
};

export const makeNDigitNumber = (num: number, n: number) => {
  // Convert number to string
  let str = String(num);

  // Calculate the number of zeros to add
  let zerosToAdd = n - str.length;

  // Add leading zeros
  for (let i = 0; i < zerosToAdd; i++) {
    str = "0" + str;
  }
  return str;
};

export const API_BASE_ROUTE = "/api";

export const DOMAIN = "shooramall.com";

export function splitPriceFromTax(
  tax: number,
  price: number
): { price: number; tax: number } {
  const number1 = parseFloat(((price * 100) / (100 + tax)).toFixed(3));
  const number2 = parseFloat(((price * tax) / (100 + tax)).toFixed(3));
  return { price: number1, tax: number2 };
}

const num =
  "Zero One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen".split(
    " "
  );
const tens = "Twenty Thirty Forty Fifty Sixty Seventy Eighty Ninety".split(" ");

export function number2Words(n: number): string {
  if (n < 20) return num[n];

  let digit = n % 10;
  if (n < 100)
    return tens[Math.floor(n / 10) - 2] + (digit ? "-" + num[digit] : "");

  if (n < 1000)
    return (
      num[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 === 0 ? "" : " and " + number2Words(n % 100))
    );

  if (n < 1000000)
    return (
      number2Words(Math.floor(n / 1000)) +
      " Thousand" +
      (n % 1000 !== 0 ? " " + number2Words(n % 1000) : "")
    );

  if (n < 1000000000)
    return (
      number2Words(Math.floor(n / 100000)) +
      " Lakh" +
      (n % 1000000 !== 0 ? " " + number2Words(n % 1000000) : "")
    );

  return (
    number2Words(Math.floor(n / 10000000)) +
    " Crore" +
    (n % 1000000000 !== 0 ? " " + number2Words(n % 1000000000) : "")
  );
}

export function number2WordsWithDecimal(n: number): string {
  const integerPart = Math.floor(n);
  const fractionalPart = n - integerPart;

  let result = number2Words(integerPart);

  if (fractionalPart > 0) {
    const fractionalStr = fractionalPart
      .toFixed(10)
      .slice(2)
      .replace(/0+$/, ""); // Convert fractional part to a string and remove trailing zeros
    result += " Point";
    for (let digit of fractionalStr) {
      result += " " + num[parseInt(digit)];
    }
  }

  return result;
}

export function splitGST(
  taxAmount: number,
  userState: string,
  sellerState: string
): { igst: number | null; sgst: number | null; cgst: number | null } {
  if (userState === sellerState) {
    return {
      igst: null,
      sgst: parseFloat((taxAmount / 2).toFixed(3)),
      cgst: parseFloat((taxAmount / 2).toFixed(3)),
    };
  }
  return { igst: parseFloat(taxAmount.toFixed(3)), sgst: null, cgst: null };
}
