import DataLoader from 'dataloader';
import knex from 'knex';

export const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite3',
  },
  useNullAsDefault: true,
});

db.on('query', ({ sql, bindings }) => {
  console.log('[db] query: ', sql, bindings)
})

// By default, DataLoader caches data forever
// This function overrides default behavior to make sure data is fresh
export function createCompanyLoader() {
  // companyLoader uses DataLoader to avoid N+1 Problem
  // Process is referred to as 'batch loading'
  return new DataLoader(async (companyIds) => {
    console.log('[companyLoader] companyIds: ', companyIds)
    const companies = await db.select().from('companies').whereIn('id', companyIds)
    return companyIds.map(companyId => {
      // ensure that results are returned from DB in same order they're passed in
      return companies.find(company => company.id === companyId)
    })
  })
}
