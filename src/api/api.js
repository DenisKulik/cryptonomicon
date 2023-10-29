const API_KEY =
  "3858c8f19e12b37fc41bb26a21962b574d71bade424011af806ce780f4c7e0d8";

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";
socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX) return;

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((handler) => handler(newPrice));
});

const tickersHandlers = new Map();

const sendToWs = (message) => {
  const stringifiedMessage = JSON.stringify(message);
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
};

const subscribeToTickerOnWs = (ticker) => {
  sendToWs({
    action: "SubAdd",
    subs: [`${AGGREGATE_INDEX}~CCCAGG~${ticker}~USD`],
  });
};

const unsubscribeFromTickerOnWs = (ticker) => {
  sendToWs({
    action: "SubRemove",
    subs: [`${AGGREGATE_INDEX}~CCCAGG~${ticker}~USD`],
  });
};

export const subscribeToTicker = (ticker, callback) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, callback]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};
