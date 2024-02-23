# Harbourbit API 

The api for harbourbit. 

Uses nodejs and express. Drizzle(ORM) for postgres. NeonDB is used as the serverless postgres database.

Sentiment analysis is done using this package : [node-nlp](https://www.npmjs.com/package/node-nlp).
Currently, a pre trained model is  used for the analysis. 

JWT authentication used, with refresh and access tokens. Password encrytion done through bcrypt.

The frontend using this API : [Harbourbit](https://github.com/Heel2Toe/Harbourbit)

