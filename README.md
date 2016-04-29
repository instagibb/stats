# Strava stats

This is a small project for John Dawson of [Tassie Trails](http://www.tassietrails.org) which is hosted at https://stats.andrewgibb.info

### Why
This tool extracts trail usage counts for given Strava segments using the Strava V3 API. This is useful because the Strava website is very limited in the count information that it provides and if you want counts from last month or last year... forget about it.

### Problems
Unfortunately the Strava API provides no easy way to get the counts for particular Segments. So the process involves listing all the 'Efforts' for a 'Segment' for a particular date range. This however is slow and clunky and involves making many many requests to get the pages of Efforts just to count them. Hopefully in future the Strava API will be improved to make this easier 
