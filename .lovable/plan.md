# Move Federico Mastroleo's reviewer account to his Gmail

Federico has one reviewer account under mastroleo.federico@mayo.edu. Mayo's firewall blocks the reset link, so the account moves to fed.mastroleo@gmail.com.

## Steps
1. Change the email on his **existing** account to fed.mastroleo@gmail.com, marked as confirmed. His reviewer role, topics and assigned abstracts stay the same. No second account is created.
2. Update the contact email stored with his reviewer details, so the admin panel and later emails use the Gmail address.
3. Send him one reviewer invitation (guide + "Set password" button) to the Gmail address, using the existing "Send to one reviewer" process.
4. Check that the account now shows the Gmail address and the email was accepted for sending.

## Notes
- The Mayo address will no longer sign in. He uses the Gmail address from now on.
- The account record says he signed in today at 15:29 UTC. He may have got in once already, but the new email will still let him set a password.

## Technical details
- One-off admin update of the user's email (email_confirm true) for user 65b39d5b-31a8-422c-bc7f-68921cd62ccd, plus the matching profile/reviewer email fields.
- No code changes.
