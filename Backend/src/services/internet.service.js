import {tavily} from "@tavily/core"

const tvly=tavily({
    apiKey:process.env.TAVILY_API_KEY
})

export async function internetSearch({query}) {
    const result=await tvly.search(query)
    console.log(JSON.stringify(result))
    return JSON.stringify(result)
}