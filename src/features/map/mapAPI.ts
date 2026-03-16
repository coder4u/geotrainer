import {createApi, fetchBaseQuery, retry} from "@reduxjs/toolkit/query/react"

export type RectangleBounds = {
    north: number
    south: number
    east: number
    west: number
}

export type Settlement = {
    id: number
    name: string
    coords: {
        lat: number
        lng: number
    }
}

type OverpassElement = {
    id: number
    lat: number
    lon: number
    tags?: {
        name?: string
        place?: string
    }
}

type OverpassResponse = {
    elements?: OverpassElement[]
}

const buildSettlementsQuery = (bounds: RectangleBounds): string => {
    const bbox = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`

    return `
    [out:json][timeout:200];
    (
      node["place"="city"](${bbox});
      node["place"="town"](${bbox});
      node["place"="village"](${bbox});
    );
    out body;
  `
}

export const mapApi = createApi({
    reducerPath: "mapApi",
    baseQuery: retry(fetchBaseQuery({
        baseUrl: "https://overpass-api.de/api/",
    }), {maxRetries: 3}),
    endpoints: builder => ({
        getSettlementsByBounds: builder.query<Settlement[], RectangleBounds>({
            query: bounds => ({
                url: "interpreter",
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=UTF-8",
                },
                body: buildSettlementsQuery(bounds),
                responseHandler: async (response: { json: () => OverpassResponse | PromiseLike<OverpassResponse> }) => {
                    return (await response.json()) as OverpassResponse
                },
            }),
            transformResponse: (response: OverpassResponse): Settlement[] => {
                return (response.elements ?? [])
                    .filter(element => {
                        return (
                            typeof element.tags?.name === "string" &&
                            typeof element.tags?.place === "string" &&
                            typeof element.lat === "number" &&
                            typeof element.lon === "number"
                        )
                    })
                    .map(element => ({
                        id: element.id,
                        name: element.tags!.name!,
                        coords: {
                            lat: element.lat,
                            lng: element.lon,
                        }
                    }))
            },
        }),
    }),
})

export const {useGetSettlementsByBoundsQuery} = mapApi
