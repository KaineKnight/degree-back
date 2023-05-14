export enum Criterions {
  price = 0,
  time = 1,
  category = 2,
  brand = 3,
  model = 4,
  commonness = 5,
}

/*
algorithm:
1. get user by id
2. get all tasks
3. get priorities of user
4. compute maxMinPriceDiff and maxMinTimeDiff
5. compute supercriterion for every task
  5.1 get criterion weights and normalize them
  5.2  normalize weights if needed
  5.3 product weights and priorities
  5.4 summarize supercriterion of task
6. slice elements according to pagination
7. return data
*/
