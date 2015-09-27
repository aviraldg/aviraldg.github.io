---
layout: post
title: 'HOWTO: Get started with Amazon EC2.'
date: '2012-04-09T23:16:00+05:30'
tags:
- howto
- ec2
- linux
- ubuntu
tumblr_url: http://www.aviraldg.com/post/20787238572/howto-get-started-with-amazon-ec2-12
---
TLDR: I just got myself an Amazon EC2 micro instance (which, by the way, is free for an entire year) and set up gunicorn and nginx on it. This is the first blog post, which documents the EC2 part of the process.

I’m assuming you’ve already created an Amazon Web Services account. There’s nothing much in it, just the regular email confirmation, followed by a phone number confirmation call and a dialog asking you to enter credit card details. Don’t worry, if this is the first time you’re doing this and you stay within free usage limits, you won’t be charged (at least for a year.)

Next, sign in to your AWS control panel and head over to the EC2 tab and create a new Ubuntu Server 11.10 instance from the “Instances” sub-tab. This shouldn’t be much of a problem. It’ll also generate a new key pair for your EC2 instance and let you download it. Keep it safe, it’ll come in handy later.

Now, here’s the first major problem you might face - your new instance won’t accept any incoming traffic, unless you specifically tell it to do so. So, switch to the “Security Groups” tab and either create a new security group, or select the default one. Then, create a new SSH rule from the “Incoming” tab, with source set to “0.0.0.0/0” (which allows all incoming traffic.)You’ll probably want to do the same with HTTP/HTTPS etc depending upon what you want to use your instance for (in my case, I have it set up for ICMP echo request/response, which allows pings to work, HTTP and SSH)

Get your server’s public address from the instances tab (it’ll look like `ec2-???-???-???-???.ap-southeast-1.compute.amazonaws.com.`) You’re now ready to SSH into your instance:

Notice that this differs slightly from instructions you might find for other distros, because the default user on Ubuntu images is ubuntu, not root.

That’s it, you now have SSH access. Before you start with setting up nginx or gunicorn, you might want to create a new usergroup and a new user for running your server processes under (for security reasons.) It’s quite simple, using addgroup and adduser, though if you want SSH access to that account, you’ll need to add your publickey to the ~/.ssh/authorized_keys file.

ps. Thanks to @doismellburning, he helped me figure out some of this stuff :)

I’ll be doing the next post in this series, on setting up and configuring nginx and gunicorn soon, so remember to check back later!
