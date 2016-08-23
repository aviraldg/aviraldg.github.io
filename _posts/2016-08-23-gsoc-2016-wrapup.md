---
layout: post
title: GSoC Wrapup!
date: '2016-08-23T08:20:00+05:30'
tags:
- vector
- matrix.org
- gsoc
---

For the past few weeks I've been working with the [Matrix.org](http://www.matrix.org) team on its [Vector.im](http://www.vector.im) client. Most of the work described here has been continously merged into the **/develop** branch of `matrix-react-sdk` and `vector-web` and hence has been available on [Vector (Develop)](https://vector.im/develop/) for feedback from the community throughout GSoC, and has been developed accordingly. What follows is a brief outline of the work I've done (not all commits are mentioned or linked to).

---

Although originally not a part of my proposal for GSoC, a major part of the work done throughout has been on a **rich text editor** for Vector. While the Markdown-only editor formerly used was quite convenient for early adopters, RTE is essential for the kind of business and casual users Vector hopes to gain mindshare among next.

- [Initial version of rich text editor (matrix-react-sdk)](https://github.com/matrix-org/matrix-react-sdk/commit/001011df2735d11c30a0010ccc660bf63440b642)
- [Initial version of rich text editor (vector-web)](https://github.com/vector-im/vector-web/commit/7e563b89c73523627532b464a2e688c5b8f00b15)
- [Minor improvements](https://github.com/matrix-org/matrix-react-sdk/commit/fe76eb9f737b60f153329cd5476be1e64c2ee652)
- [Fix MessageComposerInput.setLastTextEntry](https://github.com/matrix-org/matrix-react-sdk/commit/4e0720db12ee7170ada7a8f63848683015a3012c)
- [RTE improvements, markdown mode](https://github.com/matrix-org/matrix-react-sdk/commit/e4217c3fb7238d0da09101f1e6fd75bd82a4712e)
- [Cleanup, better comments, markdown hotkeys](https://github.com/matrix-org/matrix-react-sdk/commit/b960d220d27524aa419fe643817a7ca6e79e00d7)
- [Add basic Markdown highlighting](https://github.com/matrix-org/matrix-react-sdk/commit/df69d1de44810d2c6d8a338be33b73ee8829d177)
- [Fixes and improvements in RichText](https://github.com/matrix-org/matrix-react-sdk/commit/2606ea959673600fea94df0f169467ef325f979a)
- [User and room decorators, history & typing notifs](https://github.com/matrix-org/matrix-react-sdk/commit/29cdd1fc4144bf7f583273409e858aeec29950dd)
- [Use constants for keycodes in RTE](https://github.com/matrix-org/matrix-react-sdk/commit/8cb086ef31d1f1f80c3cbd91dc1f8eb24e30bab9)
- [More RTE fixes](https://github.com/matrix-org/matrix-react-sdk/commit/ba69e4365d3c97752d8dfccbd33a2c305e0f707b)
- [Fix cursor bug, persist editor mode & RTE default](https://github.com/matrix-org/matrix-react-sdk/commit/3f1b57b35b84c90c0d13e1e049dcb9ecf81ba216)
- [Fix RTE escaping, HTML output with breaks](https://github.com/matrix-org/matrix-react-sdk/commit/3f1b57b35b84c90c0d13e1e049dcb9ecf81ba216)
- [Use different keys for new MessageComposerInput](https://github.com/matrix-org/matrix-react-sdk/commit/8b1332cd292282a9195fe31833b7fe39060b7b72)
- [Style changes and improvements in autocomplete](https://github.com/matrix-org/matrix-react-sdk/commit/4af983ed902c767b87c0c39890753f0432fef91c)
- [Style selection color](https://github.com/vector-im/vector-web/commit/12157edd624ea2287b3442b576848d4c386966d6)
- [MessageComposer styling for Draft](https://github.com/vector-im/vector-web/commit/819e06e2cd66540e58ba0afece2f8d28de1eea2c)
- [RTE mode switch styling & cleanup](https://github.com/vector-im/vector-web/commit/f6ed21559a0d298cec76a9ed9f3638f3b0ffc86a)

As this was a completely new feature, it was implemented based on my own designs, without input from [ribot](http://ribot.co.uk/) (the design firm for Vector). Once those designs were available, I made the required changes.

----

Another major part of the work done was autocomplete with various providers replacing the concept of "plugins" from the proposal.

- [Initial version of autocomplete](https://github.com/matrix-org/matrix-react-sdk/commit/b979a16199fe1a14474dd7d3b9e32ba0eaffd03f)
- [Autocomplete style](https://github.com/vector-im/vector-web/commit/ec7067e7bdccab3a9cec720aba0304b10ee05495)
- [Styling for autocomplete](https://github.com/vector-im/vector-web/commit/ec7067e7bdccab3a9cec720aba0304b10ee05495)
- [Room, user, DDG autocomplete providers (wip)](https://github.com/matrix-org/matrix-react-sdk/commit/4bc8ec3e6dac96f92458c1d5186ea20539fb5fcc)
- [Emoji provider, DDG working, style improvements](https://github.com/matrix-org/matrix-react-sdk/commit/b9d7743e5a30f91c71c6d57c5f0e2a0695a4852d)
- [Style changes and improvements in autocomplete](https://github.com/matrix-org/matrix-react-sdk/commit/4af983ed902c767b87c0c39890753f0432fef91c)
- [Fuzzy matching in User and Room providers](https://github.com/matrix-org/matrix-react-sdk/commit/f6a76edfdfa7b5ec0f5c1ecedc62ce82dbb56465)
- [Hide/show autocomplete based on selection state](https://github.com/matrix-org/matrix-react-sdk/commit/fb6eec0f7d25be5714da478ce36aac4faccfbe44)
- [Get basic keyboard selection working](https://github.com/matrix-org/matrix-react-sdk/commit/a74db3a815879558110fcaa4b2f6f322dc1af783)
- [Autocomplete selection wraparound](https://github.com/matrix-org/matrix-react-sdk/commit/8961c87cf95e1aa7edb349a9c7fdaf6d6c131228)
- [Autocomplete replacement](https://github.com/matrix-org/matrix-react-sdk/commit/cccc58b47f77f0eec644bc2455916496ed468318)
- [Use canonical room alias for completion](https://github.com/matrix-org/matrix-react-sdk/commit/b3d82921137a28edf5b511390c5d6bc34ee402ff)
- [https for DDG, provide range for UserProvider](https://github.com/matrix-org/matrix-react-sdk/commit/ed305bd547b3bd9d2ffb04a44d12f2d0f3a55c29)
- [Code cleanup and emoji replacement in composer](https://github.com/matrix-org/matrix-react-sdk/commit/b33452216875ba3ffd09747158bd5e1a12512e96)
- [Strip (IRC) displayname suffix from autocomplete](https://github.com/matrix-org/matrix-react-sdk/commit/2cddf18461851c851d75eea55b21e830325754a5)
- [Fix autocomplete to use tab instead of return](https://github.com/matrix-org/matrix-react-sdk/commit/1f9a396fa53b5da3fd8f6e9e6ea6669d13a92d00)
- [Allow up/down normally for no completions](https://github.com/matrix-org/matrix-react-sdk/commit/a2d64f51197109c3a85d18fbf81704147362b07e)

----

One of the most shockingly popular parts of the work I did (to the extent where I've received direct messages about it, and it's been discussed in the Vector User Feedback room) is emoji replacement. Normally, only platforms with a system font that supports emoji renders them correctly. With my changes, almost all emoji are rendered correctly.

- [Render unicode emoji as emojione images](https://github.com/matrix-org/matrix-react-sdk/commit/48f2c4a69680839000e1347a5cb83d3df66057cd)
- [Large emoji support](https://github.com/matrix-org/matrix-react-sdk/commit/4069886cbda08459fa5145fb2771cd77f7e95277)
- [Use SVG emoji](https://github.com/matrix-org/matrix-react-sdk/commit/9c0dc7428920fab3fffac9d576b7cffa4388eb98)
- [Emojify ALL THE THINGS!](https://github.com/matrix-org/matrix-react-sdk/commit/020f1f4320ff05fead13aca72d40d0e765c91c9b)*
- [And emojify name in MemberInfo](https://github.com/matrix-org/matrix-react-sdk/commit/6a133bc034745209e84addc76f2cd52831ee4f29)
- [Improve emoji-body detection](https://github.com/matrix-org/matrix-react-sdk/commit/a9a3d31b3fabe899fab57fdf9a732a691f71026e)
- [Add EmojiText component for emoji replacement](https://github.com/matrix-org/matrix-react-sdk/commit/09e8a45cde5478b4bb53b9c82acc7bdb1e39a593)
- [Add max-width to emoji completions](https://github.com/matrix-org/matrix-react-sdk/commit/1b414cad18519ee40d623732af256215e0459a74)
- [Styling for emojione emojis 😃](https://github.com/vector-im/vector-web/commit/d7157696f44149701ef9e01e0a9a8d2b3e99cec8)
- [Large emoji support](https://github.com/vector-im/vector-web/commit/49dd93ffab0009388027ea8963e1b903f7de826c)
- [Bump emoji-body font-size down to 48px](https://github.com/vector-im/vector-web/commit/74f459f8a4c843ce69287d25f89cb019d8d865cd)
- [Various fixes and improvements to emojificiation](https://github.com/vector-im/vector-web/commit/bd9f5d3e06a3e71815846c952889460da36024f2)

*actually a commit message

----

Making all of these mostly-WIP changes available on /develop meant we couldn't have them enabled by default. So, I added a "Labs mode", for options to enable experimental features:

- [Add experimental "Labs" section to settings](https://github.com/matrix-org/matrix-react-sdk/commit/c3a96583928305e42a5bb5f5296dde4cd1a0583d)
- [Fix key attr placement in UserSettings](https://github.com/matrix-org/matrix-react-sdk/commit/727e6daaae62a7f80e36333e46c3ad001f10f857)
- [Labs improvements](https://github.com/matrix-org/matrix-react-sdk/commit/5831a68e114b227adecaf7156b22135478aace9a)
- [Use RTE labs settings](https://github.com/matrix-org/matrix-react-sdk/commit/34be17cc7e9f93676cc2874dafa68713ccd8daea)

This is now also used for other experimental features like End-to-End Encryption and Integration Management.

----

A rather interesting part of the work done was the Slack Webhook-compatible bridge, which immediately makes a Slack-like Webhook interface available for Matrix servers, making it possible to use other services' Slack integrations without modifications. This is available at [github.com/aviraldg/matrix-appservice-slack-api](https://github.com/aviraldg/matrix-appservice-slack-api).

![Gitlab Notification Bridged to Matrix](/files/gsoc-wrapup/gitlab.png "Gitlab Notification Bridged to Matrix")


----

I also spent a fair amount of time refactoring, and cleaning up code; a part of which was [setting up eslint](https://github.com/matrix-org/matrix-react-sdk/commit/1c002866e8fbb0cb225fe0899ca08736c1101951) with sensible defaults to lint our code; and working on and discussing proposals for message metadata and message type extensions (not linked to here since they are not public.)

----
