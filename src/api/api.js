const API_KEY =
  "3858c8f19e12b37fc41bb26a21962b574d71bade424011af806ce780f4c7e0d8";

export const loadTickers = (tickers) => {
  return fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(
      ","
    )}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) =>
      Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value.USD])
      )
    );
};
