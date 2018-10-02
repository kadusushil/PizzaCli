# Homework Assignment #3

This project has codebase for assignment #3.

# How to run
Before you run the project, we need to set environment variables for Mailgun and
Stripe.
We have used Mailgun for sending email after order is placed. Use following
command to set private key via command prompt

```
export MAILGUN=<<private key from mailgun>>
```

The reason being, mailgun privacy policy does not allow the token being committed
to open repositories like github or bitbucket.

Similar to this, I've also exported Stripe token secret key. Use following command.
export STRIPE=<<Stripe test secret key>>

The reason is same, it's privacy policy does not allow it's token being flaunted
openly.

Once these 2 steps are done, you can use one of the following commands to run the
project.

```
$ NODE_ENV=staging node index.js // for staging environment
$ NODE_ENV=production node index.js // for production environment
```

# It offers following commands
```
'exit': 'Kills the entire app',
'man' : 'Gives your information of all the powers you have',
'help': 'Alias of "man" command',
'list users' : 'List all the users of the system',
'menu' : 'View current menu',
'recent orders' : 'View orders from last 24 hours',
'view orders --hrs' : 'View all order in given hours or default 24 hours',
'order info --id' : 'View specific order details by providing order id',
'recent users --hrs' : 'View all users from provided hours, default 24 hours',
'user info --email' : 'View user information from given e-mail',
'stats' : 'Show system statistics'
```
