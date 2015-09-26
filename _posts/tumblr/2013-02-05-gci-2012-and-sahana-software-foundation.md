---
layout: post
title: GCI 2012 and Sahana Software Foundation
date: '2013-02-05T17:48:00+05:30'
tags:
- competitions
- open-source
tumblr_url: http://www.aviraldg.com/post/42349284334/gci-2012-and-sahana-software-foundation
---
This is a post about my experience working with the Sahana Software Foundation, a nonprofit organisation that develops software like Eden, Vesuvius and Agasti to help organisations like the UN in disaster management efforts.



(I was selected as one of the Grand Prize Winners for GCI 2012 from SSF. :D)

The Experience

Before working with Sahana, I’d never really used Web2py, only Flask and Django. So, while reading up on Web2py and S3 (Eden’s custom CRUD framework) I started with some stuff that didn’t require intimate knowledge of them. This included some documentation tasks, and bug hunting tasks (something I really don’t like that much!)

That was when Michael helped me get started with some of the Selenium tests. Before long, I realised that doing them by hand would be repetitive and would get complicated rather quickly, so I wrote a few helpers to make it easier. Later, Liezl added to this to enable automatic comparison with results returned from the DB, greatly simplifying the task of writing Selenium tests.

Then, I helped clean up Trac (either by fixing issues, or by triaging tickets) – much of this wasn’t a part of GCI, but I did it anyway because it was a lot of fun ;)

After that, I worked on one of the bigger issues, the image crop widget. Eden is often deployed in very remote locations where a reliable connection isn’t usually available, so it’s essential to ensure that there’s as little data transfer as possible. The image crop widget, completely implemented using HTML5 and Javascript, simply allows a user to crop large images client-side, without having to transfer them to the server. This might sound easy, but in practice, it’s slightly harder, because of several security restrictions that modern browsers put into place, like fakepath and the “dirty” flag for Canvases. The final widget implements both scaling and cropping both on the client side, and on the server side (as a fallback, where it uses PIL)



This was followed by some more client-side modifications that used HTML5 (eg. the fullscreen API) and the colour picker widget. All this was relatively easy to do.

Finally, I worked on some of Eden’s GIS components – the hard stuff – imports, deduplication and synchronisation. Now, every time you import POIs from OpenStreetMap into Eden, Eden will automatically sync with OSM and ensure that no duplicates are created on new imports.

All the mentors were extremely helpful throughout, and none of this would have been possible without them.

Thanks, Everyone!

First, a big thank you to all the mentors (in no particular order):

Pat, who would always stay around and help, sometimes even at the cost of her own sleep.
Robby, for his encouragement (and showering me with praises! :D)
Dominic, for being the “drill sergeant” (wink) and really helping out when I got into trouble with S3.
Fran, who helped me with a lot of Eden’s internals, and generally guided me around the project.
Michael, who introduced me to Selenium testing (and helped me with some of my first tasks!)
and, to some of the students:

Liezl, a great developer. (We’ll be meeting anyway, so I’ll leave it at this!)
Cynthia, for making GCI about more than just development and showing remarkable resilience, even when dealing with difficult issues. Truly inspiring.
Vijay, for being a gentleman (he knows what I’m talking about!)
Toh(or Zie? [or Jie?]), a fun guy in general, who taught me about Asian names (it’s still rather confusing though, as you can see :P)
and finally, to everyone at OSPO (Carol, Chris, Stephanie, and anyone else I’ve forgotten) The work that you guys put into encouraging students to get involved with Open Source Software is really admirable. I remember many people asking me for guidance on how to get started with OSS dev after GCI 2010, including people who’d never heard of the term before.

Also, thanks to everyone I forgot to mention here! I hope I’ll get to know you better in the future.

About the Future

(if you don’t work on Eden, you could probably stop reading at this point)

While working on Eden I found several issues that were out of scope in terms of GCI, but were pretty interesting on their own. These are pretty major ideas and require significant amounts of work to get done, so I’d definitely need people to work on these ideas with me.

Firstly, I found it odd, that Eden, being a disaster management platform, doesn’t have a “proper” mobile app. So, during GCI, I started working on a native Android app for Eden. (UI/UX sketches are available at http://eden.sahanafoundation.org/wiki/DeveloperGuidelines/Mobile/Android#NativeClient) Some of the XForms code could probably be reused for this, and we could have an “app repackager” to allow deployments to create their own custom versions of the app.

Another idea suggested by Michael, was that we could have a new theme based on Twitter Bootstrap. Not only would this add some spice to the existing UI, but it would also allow us to support other mobile devices easily, as Bootstrap supports RWD (of course, this could be done without Bootstrap, but it’d require much more time and effort.)

During GCI, I implemented two widgets for Eden, a colour picker and an image cropper (that’s based on HTML5 hawtness!) As far as UI widgets and JS goes, these are relatively untested, except on the newest browsers. Compatibility tests need to done for these, and suitable workarounds need to be devised where required.

Since most of Eden’s modules basically do CRUD operations on models, I think it would be a wise idea to consider using something like AngularJS for the client side framework in the future. (I expect a long chat with Dominic about this on IRC :D) This would also enable us to create things like “live widgets” etc. (of course, this is still possible now, but doing that would make it easier)

Finally, I think the static file build system should be replaced with something that’s actually meant for that purpose, like Grunt.

TL;DR


It was: LEGEN-wait for it-DARY.
