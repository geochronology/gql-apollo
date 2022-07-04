import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { getAccessToken } from '../auth'

const GRAPHQL_URL = 'http://localhost:9000/graphql'

export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
})

const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
}`

export const JOB_QUERY = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        ...JobDetail
      }
    }
    # Fragment needs to be added here in order to be accessible by query
    ${JOB_DETAIL_FRAGMENT}
  `

export const JOBS_QUERY = gql`
    query JobsQuery {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `

export const COMPANY_QUERY = gql`
  query CompanyQuery($id: ID!) {
    company(id: $id) {
      name
      id
      description
        jobs {
          id
          title
        }
      }
    }
  `

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJobMutation($input: CreateJobInput!){
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${JOB_DETAIL_FRAGMENT}
  `
  const variables = { input }
  const context = {
    headers: { 'Authorization': 'Bearer ' + getAccessToken() }
  }
  const { data: { job } } = await client.mutate({
    mutation,
    variables,
    context,
    // update takes 2 params, 2nd is `result`
    // this is the same as `data` destructured above
    update: (cache, { data: { job } }) => {
      // console.log('[createJob] job: ', job)
      cache.writeQuery({
        query: JOB_QUERY,
        variables: { id: job.id },
        data: { job }
      })
    }
  })
  return job
}
