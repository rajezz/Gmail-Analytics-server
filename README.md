# Gmail-Analytics-server
A Node.js server to process Gmail threads and categorize them based on the email address. The main advantage of segregating the emails/threads based on email is that we can get insights on number of emails received for particular address. Sorting them based on the hierarchy will help us in observing the spam/junk mails.

### Feature:
- Secure authentication using OAuth 2.0
- Efficient algorithm for polling email threads from Google account inorder to cope with the rate limit.
- Downloading data in either CSV or JSON format
