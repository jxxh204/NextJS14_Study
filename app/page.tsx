import { Suspense, useEffect, useState } from "react";
import ComponentOne from "./componentone/page";
import ComponentTwo from "./componentthree/page";
import ComponentThree from "./componenttwo/page";

export default async function Home() {
  const corona = await fetch(
    "https://api.corona-19.kr/korea/?serviceKey=m5ObFozU6ZWQuAiEPrBgsevftCK2h3DL1"
  ).then((response) => response.json());
  console.log(corona);
  return (
    <main>
      <h1>Home</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ComponentOne state={"corona"} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <ComponentTwo />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <ComponentThree />
      </Suspense>
    </main>
  );
}
