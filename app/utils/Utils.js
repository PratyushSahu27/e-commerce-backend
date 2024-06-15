const stateMap = {
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

export const smIdGenerator = (state, sn) => {
  return `SM${stateMap[state]}${makeFiveDigitNumber(sn)}`;
};

const makeFiveDigitNumber = (num) => {
  // Convert number to string
  let str = String(num);

  // Calculate the number of zeros to add
  let zerosToAdd = 5 - str.length;

  // Add leading zeros
  for (let i = 0; i < zerosToAdd; i++) {
    str = "0" + str;
  }
  return str;
};

export const API_BASE_ROUTE = "/api";
