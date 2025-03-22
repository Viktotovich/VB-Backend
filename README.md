# Mini Documentation

## Regarding Auth

1. By default, both Passport JWT and Jsonwebtoken use HS256 algorithm, it saves
   us a lot of headache of manually configuring them

2. I put the JWT token limit to 15 minutes for security purpose, however - what
   happens if a user is doing a critical task? Does that mean they are logged out
   from say, the blog editor? If that is the case, I think session cookies are
   significantly better.

3. For the reason mentioned above, I would reccomend using JWT with session cookies
   to protect from XSS, and at the same time allow us to set httpOnly and protect
   users from possible JS attacks.

### Actions needed

1. CORS, cookie implementation for JWT instead of Local Storage, making JWT read from
   cookies instead of headers on protect routes.

2. Frontend: How will the frontend handle the credentials.

3. Logout: Clearing the cookies

4. Since our Frontend non-admin, and Frontend for admins is separated - how are we
   planning to handle the blog editor? I think the first frontend can ignore the
   existance of the backend JWT/AUTH completely, and the admin frontend handle that
   instead.

   This allows us to do the following:

   1. Have a good separation of concerns
   2. The cookie/credential/auth logic of the frontend is only handled by the
      admin frontend.
   3. The blogs themselves are freely displayed on the non-admin frontend as long
      as they are set to published: _however_: We need CORS here, specifying
      only the non-admin frontend as the allowed consumer of the API/resource.
