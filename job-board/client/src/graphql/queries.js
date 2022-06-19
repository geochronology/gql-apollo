import { request, gql } from 'graphql-request'

const GRAPHQL_URL = 'http://localhost:9000/graphql'

export async function createJob(input) {
  const query = gql`
    mutation CreateJobMutation($input: CreateJobInput!){
      job: createJob(input: $input) {
        id
      }
    }
  `
  const variables = { input }
  const { job } = await request(GRAPHQL_URL, query, variables)
  return job
}

export async function getCompany(id) {
  const query = gql`
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
  const variables = { id }
  const { company } = await request(GRAPHQL_URL, query, variables)
  console.log('company: ', company)
  return company
}

export async function getJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `

  const variables = { id }
  const { job } = await request(GRAPHQL_URL, query, variables)
  console.log('job: ', job)
  return job
}

export async function getJobs() {
  const query = gql`
    {
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `
  const { jobs } = await request(GRAPHQL_URL, query)
  console.log('jobs: ', jobs)
  return jobs
}


