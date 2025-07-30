import { gql } from "@apollo/client";
import { client } from "./apollo-client";

// Our typescript interface for a pet
export interface UserBlock {
    id: number,
    name: string
    isBlock: boolean
}

export const BLOCK_STATUS_UPDATED = gql`
    subscription BlockStatusUpdated {
        blockStatusUpdated {
            id
            name
            isBlock
        }
    }
`