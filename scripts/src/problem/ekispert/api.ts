import { httpFetch } from "../../lib/util";

type Point = {
  GeoPoint: {
    gcs: string;
    lati: string;
    lati_d: string;
    longi: string;
    longi_d: string;
  };
  Prefecture: {
    Name: string;
    code: string;
  };
  Station: {
    Name: string;
    Yomi: string;
    Type: string;
    code: string;
  };
};

export type StationApiResult = {
  ResultSet: {
    apiVersion: string;
    engineVersion: string;
    Point: Point[];
  };
};

type Line = {
  Color: string;
  Name: string;
  Yomi: string;
  code: string;
  corporationIndex: string;
};

export type OperationLineApiResult = {
  ResultSet: {
    apiVersion: string;
    engineVersion: string;
    max?: string;
    offset?: string;
    Line: Line[];
  };
};

type FetchStationResult = ReturnType<typeof fetchStation> extends Promise<
  infer T
>
  ? T
  : any;

function joinWords(pages: FetchStationResult["words"][]) {
  let words = [...pages[0]];
  for (let i = 1; i < pages.length; i++) {
    const page = pages[i];
    const pstart = page.shift();
    const plast = page.pop();
    const wstart = words[0];
    const wlast = words[words.length - 1];
    if (wstart.info === pstart.info) {
      words.unshift(...page, plast);
    } else if (wlast.info === plast.info) {
      words.push(...page, plast);
    } else if (wstart.info === plast.info) {
      words = [pstart, ...page, ...words];
    } else if (pstart.info === wlast.info) {
      words = [...words, ...page, plast];
    } else {
      throw `mismatch stations [${wstart.info}...${wlast.info}] [${pstart.info}...${plast.info}]`;
    }
  }
  return words;
}

export async function fetchStation({
  key,
  operationLineCode,
}: {
  key: string;
  operationLineCode: string;
}) {
  return await httpFetch(
    `https://api.ekispert.jp/v1/json/station?key=${key}&operationLineCode=${operationLineCode}`
  )
    .then(({ data }) => JSON.parse(data.toString()) as StationApiResult)
    .then((data) => {
      const points = Array.isArray(data.ResultSet.Point)
        ? data.ResultSet.Point
        : [data.ResultSet.Point];
      const words = points.map((p: any) => ({
        info: p.Station.Name.replace(`(${p.Prefecture.Name})`, "") as string,
        info2: p.Station.Yomi as string,
      }));
      return { data, words };
    });
}

export async function fetchStations({
  key,
  operationLineCodes,
}: {
  key: string;
  operationLineCodes: string[];
}) {
  const fetchs = operationLineCodes.map((operationLineCode) =>
    fetchStation({ key, operationLineCode })
  );

  const data = await Promise.all(fetchs);

  return {
    data,
    words: joinWords(data.map(({ words }) => words)),
  };
}

export async function fetchOperationLine({
  key,
  code,
}: {
  key: string;
  code: string;
}) {
  return await httpFetch(
    `https://api.ekispert.jp/v1/json/operationLine?key=${key}&code=${code}`
  )
    .then(({ data }) => JSON.parse(data.toString()) as OperationLineApiResult)
    .then((data) => {
      if (!Array.isArray(data.ResultSet.Line)) {
        data.ResultSet.Line = [data.ResultSet.Line];
      }
      return data.ResultSet;
    });
}
