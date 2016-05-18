---
layout: post
title: 'Matrix ∙ Vector'
date: '2016-04-28T12:00:00+05:30'
tags:
- vector
- matrix.org
- gsoc
draft: true
---

> Matrix is an open standard for decentralised communication, providing simple HTTP APIs and open source reference implementations for securely distributing and persisting JSON over an open federation of servers.
>
> -- [Matrix.org](http://matrix.org/)

[Google Summer of Code 2016](https://summerofcode.withgoogle.com/) kicked off a couple of weeks ago and after looking through the list of organizations, [Matrix.org](https://summerofcode.withgoogle.com/organizations/5783338316988416/) really caught my attention.

Now, I have a decently long history with "text-based communication": be it the first web application I developed (a PHP-based Twitter clone with chat features), Reacthub, or more recently, [Work.ai](https://www.youtube.com/watch?v=Wrwx1A_1ATk). The choice of protocol and interoperability is always an issue, so it's nice to finally have a solution to the problem. Working on Reacthub, Nafees and I spent almost over a month defining our custom protocol, working out issues with the messaging and authentication servers and multiple apps. The Matrix.org team, with their vector-(android, iOS, web) and console-(android, iOS, web), synapse and supporting projects have not only solved these issues but have also worked out effective federation.

Working on a collaboration or communication tool has one very large advantage: dogfooding is very easy and in fact obvious, since most collaboration on project development happens on the tool itself. So, most Matrix development collaboration happens at [#matrix-dev](https://vector.im/develop/#/room/#freenode_#matrix-dev:matrix.org), and just using Vector and Matrix in this way is a great source of ideas for improvement.

A few days of using Vector this way, coupled with a discussion of the ideas behind Work.ai with Matthew and Amandine helped me realize that a lot could be done to improve usability of Vector as a work focused communication tool. To this end, I proposed the development of a plugin system for Vector.

While certainly useful, this is only evolutionary and builds upon the excellent work already done by Matrix and Synapse contributors and members of the community, with plenty of extremely useful bots. However, there is much room for improvement - specifically, making these integrations easier for non-technical users to customize and setup, as is often requested on #matrix.

Trying to integrate the world is overambitious, so I've decided to begin with a small set of logical integrations that could naturally lead to the development of others that are needed. Here follows the entire proposal along with the list of proposed integrations. **I'd love your feedback on what else interests you. Drop me a message on #matrix-dev or #vector or send me an email at me@<this domain>.**

---

# INTRODUCTION

Text-based, real time communication has existed for decades, but recently, there’s been a lot of excitement about productivity enhancing communication apps. The main innovation in this space is creating integrations and plugins that enhance the user’s workflow by presenting all information they need inside the messaging app, thus preventing unnecessary context switches which waste time and increasing the user’s productivity.

# ABSTRACT

This proposal aims to develop a sufficiently flexible, easy-to-use plugin system for matrix clients along with productivity enhancing plugins based on the same system.

The primary inspiration for this proposal was one of my hackathon projects called Work.ai - a smart communication tool for business users, a demo video video for which you can find at [https://www.youtube.com/watch?v=Wrwx1A_1ATk](https://www.youtube.com/watch?v=Wrwx1A_1ATk).

# MY BACKGROUND

I’m **Aviral Dasgupta**, a 2nd year student of Computer Science & Engineering from Jamshedpur, India. I have been involved with the open source software community for over 5 years and was a **Google Code-in Grand Prize Winner** (the high-school equivalent GSoC) in **2010** (with Tux4Kids) and **2012** (with Sahana Software Foundation. [Find a write-up on my work on my website](http://www.aviraldg.com/p/gci-2012-and-sahana-software-foundation/)) and a Google Code-in Mentor for Sahana Software Foundation in 2014.

Other than my open source work, I’ve been [consulting for almost the same amount of time](http://www.aviraldg.com/files/aviral-dasgupta-resume.pdf), with [glowing reviews from many satisfied clients](https://www.codementor.io/aviraldg).

I like to think of myself as a full-stack developer, but here are most of the languages and frameworks I feel comfortable working with:

1. **Python** - my language of choice; I like it for its elegance and pragmatism.
*Django*, *Flask*, *Web2py* and *Twisted* are among the frameworks I’ve commonly used.

2. **Android** - I love working on mobile apps because of the power the platform gives you to develop *smart* apps, Android especially.

3. **JavaScript** - I don’t like the language as much as I do Python, but I’ve definitely written a lot of it. In general, I prefer transpiling a slightly better designed language like *Kotlin* or *Typescript*.
I’ve used *React* and *Angular.js* to build a fair number of single page web applications.

Matrix/Vector Experience:

1. [https://github.com/aviraldg/commenthero](https://github.com/aviraldg/commenthero) (an early prototype of the ["HTML Embeddable Matrix Chat Rooms"](https://github.com/matrix-org/GSoC/blob/master/IDEAS.md#html-embeddable-matrix-chat-rooms) idea)

2. [https://github.com/matrix-org/matrix-react-sdk/pull/221](https://github.com/matrix-org/matrix-react-sdk/pull/221)

3. [https://github.com/matrix-org/matrix-react-sdk/pull/224](https://github.com/matrix-org/matrix-react-sdk/pull/224)

4. [https://github.com/matrix-org/matrix-react-sdk/pull/22](https://github.com/matrix-org/matrix-react-sdk/pull/225)[5](https://github.com/matrix-org/matrix-react-sdk/pull/225)

5. [https://github.com/vector-im/vector-android/pull/48](https://github.com/vector-im/vector-android/pull/48)

# GOALS

Developing:

1. a framework that allows for plugins in matrix clients, starting with **vector-web**, consisting of custom UI elements, */actions* and bots packaged together.

2. a system that effectively sandboxes each plugin making sure that it is safe for users to install plugins from unknown sources as long as they verify the permissions that the plugin requests. ~~(Have concluded after discussions with Matthew that this is maybe a "nice to have" but not that urgent, and should probably come ***after*** the rest of this proposal.)~~

3. a plugin for discovery and configuration of plugins ("plugin store")

4. productivity focused plugins that make a strong case for Vector (or other Matrix clients) as serious business collaboration tools (see Specifications for complete list)

5. a Slack API compatible App Service that allows integrations meant for Slack to be used with Matrix

# SPECIFICATIONS

## 1. Plugin System

1. User should be able to access a list of plugins normally available on the current home server, or install their own from a custom URL with a warning.

2. This interface should inform the user about which other plugins this plugin can interact with, most notably the messages, conversation list, the message list and the user list plugin.

3. Once installed, a plugin should begin functioning normally without requiring a restart of Vector.

4. If a plugin requires another plugin to function, it should be able to request that that plugin be installed.

5. An extension to I-D is the messages plugin, which could request that particular plugins be installed to handle custom message types.

6. Plugins exposing user interfaces should be moveable to the left, centre or right panels.

7. Plugins should be able to embed other plugins. This is especially relevant when displaying custom message types using a plugin inside the message list.

8. There should be some form of whitelisting/blacklisting at the home server level specifying specifying which plugins are allowed.

![image alt text](/files/matrix-vector/image_1.png)

UI for general layout of plugins.

![image alt text](/files/matrix-vector/image_2.png)

Plugin installation UI (which itself could be a plugin)

## 2. DuckDuckGo Search Plugin

The DuckDuckGo Search plugin will let users quickly look up information from inside a Matrix client.

1. Interactions with the plugin will be possible in one of two ways: /ddg action, or side panel.

2. The plugin will consist of no server side component, and only UI and action components that will hit DuckDuckGo’s API at [https://duckduckgo.com/api](https://duckduckgo.com/api).

3. /actions will cause a short list of search results to be populated in the message composer autocomplete.

4. The side panel, when triggered will reveal a UI with a search box that allows direct searches.

5. Each result in the side panel will have a button next to it which when clicked will populate the message composer with the link for that result.

6. The plugin will require access to the following other plugins (tentative): **Message List / Composer**

7. The plugin, for the time being will not be extensible by other plugins.

![image alt text](/files/matrix-vector/image_3.png)

## 3. Yandex.Dictionary Plugin

The Yandex.Dictionary plugin will let users easily look up words in the dictionary. Yandex.Dictionary was chosen because it appears to be one of the only freely available APIs with relatively high limits.

1. Interactions with the plugin will be possible in one of two ways: /define action, or side panel.

2. The plugin will consist of no server side component, and only UI and action components that will hit the Yandex.Dictionary API at [https://tech.yandex.com/dictionary/](https://tech.yandex.com/dictionary/).

3. /actions will cause a short list of results to be populated in the message composer autocomplete.

4. The side panel, when triggered will reveal a UI with a search box that allows direct lookups.

5. The plugin will require access to the following other plugins (tentative): **Message List / Composer**

6. The plugin, for the time being will not be extensible by other plugins.

![image alt text](/files/matrix-vector/image_4.png)

## 4. Smart Actions Plugin

The Smart Actions plugin will require access to the user’s Google Calendar. It will then analyze all messages sent to the user to extract intents for appointments and navigation and will add them to the user’s calendar.

1. Interactions with the plugin will be possible in one of two ways: by directly sending or receiving messages as one does normally, or side panel.

2. The plugin will consist of both, a server side component, and UI and action components.

3. The server side component will use Google Calendar webhooks to notify users when the state of a calendar item has changed. It could also be used to expose the user’s current calendar event in a Matrix client.

4. The side panel, will display user’s current calendar events and will let user send invites.

5. Intents in normally sent messages will be detected using **Wit.ai**.

6. The plugin will require access to the following other plugins (tentative): **Message List / Composer, Messaging**

7. The plugin, for the time being will not be extensible by other plugins.

![image alt text](/files/matrix-vector/image_5.png)

## 5. Github Plugin

The Github plugin will provide access to issues, pull requests and commits through /commands,  inline message notifications and a panel UI.

1. Interactions with the plugin will be possible in one of two ways: /commands, or side panel.

2. The plugin will consist of both, a server side component, and UI and action components.

3. The server side component will use Github webhooks to send notifications about issues, pull requests and commits.

4. The side panel, will let the user configure their integrations.

5. The plugin will require access to the following: **Messaging**

6. The plugin, for the time being will not be extensible by other plugins.

![image alt text](/files/matrix-vector/image_6.png)

## 6. Notify Plugin

The notify plugin will let users set actions that will trigger on particular events, specifically when a user’s presence changes (like in IRC) but also on other events.

One way this could work is with a command like: /onevent (e) => {if(e.type === "m.room.member") alert(JSON.stringify(e))} which would let users execute their own code on receiving specific events (presence events being a particularly useful common example) - this is completely safe, since it’s just users running their own code on their own devices, and a nice tool for power users.

Of course, this would require another *normal* interface, which would work exactly the same as the /notify command in IRC, intended for regular (nontechnical) users.

1. Interactions with the plugin will be possible with /commands.

2. The plugin will consist of only action components..

3. The plugin will require access to the following: **Messaging**

4. The plugin, for the time being will not be extensible by other plugins.

7. Trello Plugin

The Trello plugin will notify users about changes and let them quickly take some relevant actions.

5. Interactions with the plugin will be possible in one of two ways: /commands, or side panel.

6. The plugin will consist of both, a server side component, and UI and action components.

7. The server side component will use Trello webhooks to send notifications about cards, lists and assignments.

8. The side panel, will let the user configure their integrations.

9. The plugin will require access to the following: **Messaging**

10. The plugin, for the time being will not be extensible by other plugins.

![image alt text](/files/matrix-vector/image_7.png)

## 8. Drive Plugin

The drive plugin will allow users to collaboratively edit Google Drive documents and also allow them to navigate their Google Drive folder to select files to share.

1. Interactions with the plugin will be possible in one of two ways: by clicking on drive links in message list, or side panel or main panel.

2. The plugin will consist of only UI components, which will gain access to the user’s Drive with the standard client-side OAuth flow and use the Google Drive REST API to access their files.

3. The side panel, will display an interface that will let the user browse their Drive files and start sharing a particular file.

4. The main panel will display whenever a document is actively being edited, and will basically consist of an iframe embedding the relevant Google Drive editor.

5. Clicking on a Google Drive link will prompt the user to start editing it in the current room.

6. The plugin will require access to: **Messaging**

7. The plugin, for the time being will not be extensible by other plugins.

![image alt text](/files/matrix-vector/image_8.png)

## 9. Slack API-Compatibility App Service

The Slack API-compatibility App Service will expose the interface described at [https://api.slack.com/](https://api.slack.com/) and allow Slack integrations to be used directly with Matrix. This will immediately make a much larger set of plugins and integrations usable with Matrix.

There are very specific kinds of integrations where an API-compatible app service will result in a reduction of effort:

1. Bot Users / RTM API - user written bot users can be simply altered to use the app service’s endpoint, functioning exactly as they would have in Slack.

2. Incoming and Outgoing Webhooks - again, just modifying the endpoint should get integrations that work with Slack through this method working with Matrix.

3. [Slash Commands ](https://api.slack.com/slash-commands)- As above.

However any integrations that operate from Slack’s side will still require additional effort, for example, Slack’s Github integration adds their webhook URL to the user’s repos, but the data received at these endpoints is in Github’s format, not Slack’s. Which is to say that it’s mostly third party apps which offer integrations with Slack through their APIs which will work with Matrix through such a compatibility service (which *push* data to Slack in Slack’s expected format as described above)

Bot Users are channel aware, so there is no need to expose them only to particular channels (limiting them to a subset of all channels may be a future enhancement here.) Webhooks and slash commands however need to be configured, but the configuration is very basic, so it could be exposed through a /command interface on the app service itself. As the standard configuration here is just a URL, plus channels, a UI plugin could be built to handle this for the user in the future.

# ADDITIONAL CONSIDERATIONS

The next two sections ("Sandboxing" and “Interplugin Communication”) were originally a part of the specification, but after discussions with various mentors I’ve decided to exclude them from the scope of this project. While useful, they are probably secondary to the goal of just getting more plugins that work with Matrix/Vector and hence I will be working on them outside GSoC.

## Sandboxing

If users are to be allowed to download plugins from arbitrary sources, there should be some system in place to make sure that their credentials are not leaked, their account is not abused, etc.

This requires an sandboxing system to be in place, and [Sandboxed Iframes](http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/) are a good candidate, [widely supported in most current browsers](http://caniuse.com/#feat=iframe-sandbox).

## Interplugin Communication

With sandboxing in place, plugins need some way to communicate with each other for there to be a real advantage from a plugin system. The [Window.postMessage() API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) can then be used to send predefined messages from one plugin to another (and broadcast Matrix messages to all plugins.) React’s virtual DOM lends itself nicely to such a system, and there have been [previous attempts at creating a sandboxed plugin system with this combination of technologies](https://groups.google.com/forum/#!topic/reactjs/xSJDfIAJttQ).

## User Interface

A plugin system, while extremely useful can make an application very confusing for the end user, if different plugins end up having a different look & feel. To this end, the standard styling of Vector needs to be extended to support a few common components that can be used in various plugins.

## Other Platforms

A plugin system should ideally work on all platforms that Vector is commonly used on - web, Android and iOS. A sandboxed, message-based plugin system means that when work begins on supporting plugins on these platforms, non-UI related JavaScript code from web plugins can simply be reused, and can interact with native UI code.

Specifically on Android, apps can execute code from other installed applications if allowed, making installing new plugins on Android as simple as installing just another app from the Play Store.

## Compatibility

While Slack does not directly support the kind of plugin described in this document, it definitely is the most popular alternative in the productivity focused messaging segment. Hence, creating a Slack plugin compatible interface would immediately make a lot more plugins available for Matrix clients.

## Clashing Commands

An easy to use UI will need to be designed for users to configure the relative priority of plugins, or choose particular plugins for particular commands, since multiple plugins could implement the same commands. Inspiration could be be taken here from how Android handles this situation with apps and Intents - when an intent resolves to multiple apps, the user is prompted to choose which they want to use with the option to save their choice, and later change it from settings.

Another possible solution which sacrifices flexibility for ease of use is to make plugins have an ID, use that as the command, and leave clashes to the person (whom we can safely assume is technical) setting up the plugins on the home server. One major disadvantage to this approach is that users might find familiar plugins mapped to unknown commands on a different home server - not good UX.

## Repeated Authorizations

With several plugins requiring access to user’s accounts, asking the user to grant each access separately may be a usability issue.

## Potential Problems

WIth a purely plugin based system, development becomes much harder, and versions of interdependent plugins have to be carefully synchronized to make sure they are compatible.

The current design of the plugin system and the kinds of UI it can expose may result in UIs that are suboptimal from a UX standpoint. On the other hand, a fully flexible layout system will be too confusing for the end-user.

---

ps. I also used this blog post as an excuse to add [MathJax](https://www.mathjax.org/) to my template:

\`[[cos theta, -sin theta], [sin theta, cos theta]].((x), (y))\`

(because matrices and vectors)
