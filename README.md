# task-backend

run cmd  nodemon server.js

Followed MVC pattern


api end point 

// to get every country list

http://localhost:4000/countries

// to get  country Details using country code {eg: us}


http://localhost:4000/countriescode/us


// to get  country Details using region {eg: asia}


http://localhost:4000/region/asia



// search country using certain parameters like name, capital, region etc.. 


http://localhost:4000/countries/search?name:India&region:asia




Utils

In utils folder cache function available, cache will be available for 1hr, we can change based on our condition

for professional project we can use redis for cache

