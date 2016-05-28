---
layout: post
title: 'Flexbox & overflow: scroll'
date: '2016-05-18T21:20:00+05:30'
tags:
- vector
- matrix.org
- gsoc
---

<style>
.p20160525 {
  display: flex;
  background-color: #333 !important;
  border-radius: 4px;
  box-shadow: 0 4px 0 #111;
  height: 300px;
  flex-direction: column;
}

.p20160525 .inner.inner {
  background-color: #eee;
  border-radius: 4px;
  box-shadow: 0 4px 0 #ccc;
  height: 64px;
  width: 64px;
  margin: 8px;
  margin-left: auto;
  margin-right: auto;
}

.p20160525 .container.container {
  overflow: auto;
  flex: 1 1;
}

.p20160525 .container.container:first-child {
  background-color: rgba(255, 255, 255, 0.1);
}

</style>

<div class="p20160525">
  <div class="container">
  </div>
  <div class="container">
    <div class="inner"></div>
    <div class="inner"></div>
    <div class="inner"></div>
    <div class="inner"></div>
    <div class="inner"></div>
    <div class="inner"></div>
    <div class="inner"></div>
    <div class="inner"></div>
    <div class="inner"></div>
    <div class="inner"></div>
    <div class="inner"></div>
    <div class="inner"></div>
  </div>
</div>
