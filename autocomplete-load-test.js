import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 100,
  duration: "30s",
};

const BASE_URL = "https://kataho.app/autosuggest-new";

/*setup flow --- run once per iteration*/
export function setup() {
  let statusRes = http.get(`${BASE_URL}/autocomplete/status`);
  console.log("status res", statusRes.json("ready"));

  let configRes = http.post(
    `${BASE_URL}/autocomplete/config`,
    JSON.stringify({ region: "nep", language: "eng" }),
    { headers: { "Content-Type": "application/json" } },
  );
  console.log("config", configRes.json("status"));
  check(configRes, {
    "config api status to be configured": (r) =>
      r.json("status") === "configured",
  });

  let tokenRes = http.get(`${BASE_URL}/autocomplete/token`);
  check(tokenRes, {
    "token generation should return 200 OK": (r) => r.status === 200,
  });
  return {
    token: tokenRes.json("access_token"),
  };
}

export default function (data) {
  const queries = ["Lak", "K", "O", "N", "P", "L", "Nak"];
  let randomQuery = queries[Math.floor(Math.random() * queries.length)];
  //   console.log("random query", randomQuery);

  let res = http.post(
    `${BASE_URL}/autocomplete/suggest`,
    JSON.stringify({ text: `${randomQuery}` }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
    },
  );
  //   console.log("response", res.json());

  check(res, {
    "suggest response to be 200 OK": (r) => r.status === 200,
  });

  sleep(1);
}
