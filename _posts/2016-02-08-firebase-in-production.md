---
layout: post
title: 'Firebase in Production'
date: '2016-02-08T13:07:00+05:30'
tags:
- firebase
- baas
---

**Firebase** is Google's lightweight Backend as a Service solution which includes:

- JSON datastore with full changefeed support (over websockets)
- Common authentication provider integration (email, Google, Facebook, Twitter, etc.)
- Basic static website hosting

All this makes it quite suitable for a quick prototype or a hackathon project, especially where making the system realtime is a concern. The real problem emerges only when you need to convert that prototype into something that works sustainably for a couple of months, or at least until you can build your own backend and rewire your client apps.

Here are a few strategies you can use to deal with Firebase in such a situation:

Allowing Structural Changes
===========================
By default, Firebase's Java/Android SDK uses [Jackson](https://github.com/FasterXML/jackson) to deserialize JSON to POJOs. The default Jackson mapper however, is likely to cause problems when you update your Firebase structure, as it is configured to error out on unknown properties. Easy fix:

    val mapper = JsonHelpers.getMapper()
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

Structure is Key
================
[One very fatal flaw of Firebase](http://stackoverflow.com/a/26701282/152873) that is strangely never mentioned in any documentation is that you can **only filter by a single property at a time** (and this includes ordering). Structure your Firebase accordingly, and keep in mind that until your prototype is ready to migrate off Firebase, it will always have this limitation.

Priority is Ordering
====================
Since you can only filter by one property, ordering that way is out of the question. There are only two ways to fix this:

- Reorder on the client (not really a solution)
- Insert with priority values

Priority values are numbers associated with every Firebase object which naturally determine the order in which objects are returned from queries. Setting priorities to the id or the timestamp will fix most of your ordering issues.

Add Indexes and Security Rules
==============================
**Firebase is world readable and writable by default.** While extremely convenient for prototyping, this can also mean waking up one fine morning and finding an empty, or worse tampered Firebase. And while Firebase does a decent job of querying by default, specifying indexes can speed queries up significantly.

[Check Firebase's documentation for the best discussion of these topics](https://www.firebase.com/docs/security/).

Build in a Kill Switch
======================
You'll definitely want to migrate off Firebase at some point, or even migrate parts of your Firebase. For this purpose, you should always have a key at the top of the hierarchy which specifies the minimum client version that can use the Firebase. This is no different from what one would do with a regular backend, but is even more important given the relative fragility of Firebase.
