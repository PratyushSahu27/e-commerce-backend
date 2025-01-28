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
  "Jammu and Kashmir": "10",
  Jharkhand: "11",
  Karnataka: "12",
  Kerala: "13",
  "Madhya Pradesh": "14",
  Maharashtra: "15",
  Manipur: "16",
  Meghalaya: "17",
  Mizoram: "18",
  Nagaland: "19",
  Odisha: "20",
  Punjab: "21",
  Rajasthan: "22",
  Sikkim: "23",
  "Tamil Nadu": "24",
  Telangana: "25",
  Tripura: "26",
  "Uttar Pradesh": "27",
  Uttarakhand: "28",
  "West Bengal": "29",
  "Andaman and Nicobar Islands": "30",
  Chandigarh: "31",
  "Dadra and Nagar Haveli and Daman and Diu": "32",
  Delhi: "33",
  Ladakh: "34",
  Lakshadweep: "35",
  Puducherry: "36",
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
  tax: string,
  price: number
): { price: number; tax: number } {
  const number1 = parseFloat(
    ((price * 100) / (100 + parseInt(tax))).toFixed(3)
  );
  const number2 = parseFloat(
    ((price * parseInt(tax)) / (100 + parseInt(tax))).toFixed(3)
  );
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
