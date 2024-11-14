import { DateTime } from "@bsdaoquang/rncomponent"

export interface ReviewModel {
    productId : string
    userId: string
    rating : number
    comment : string
    createdAt: DateTime
}