---
layout: post
title: 'Android CD on GitLab'
date: '2017-01-30T22:15:00+05:30'
tags:
- android
- gitlab
---

We'll be looking at how to set up an Android project for continuous integration and continuous deployment on GitLab. I assume prior knowledge of testing on Android, so explaining _how_ to test Android applications is outside the scope of this article.

# Building

`.gitlab-ci.yml` is how you tell GitLab how to build, test and deploy your project.

```yaml
image: jacekmarchwicki/android
build:
  stage: build
  script:
    - ./gradlew -g /cache/.gradle clean assemble --no-daemon
  allow_failure: false
```

# Testing

TODO

# Publishing

Publishing new builds of your app to the Play Store used to be a chore, but can now be automated with a service account, and the `gradle-play-publisher` gradle plugin.

First, head to `Settings > API Access` in your Google Play Developer Console. There, you can configure a service account and grant it permission to use your account.

![Google Play Developer Console API Access](/files/android-gitlab/service-account.png)

Once you've done this, you'll want to create and download a key for the newly created service account. You can do this by clicking on the *View in Developers Console* link on the API Access page, or by heading to the correct project on Google Cloud Console yourself.

![Google Cloud Console - Service Account Credentials](/files/android-gitlab/service-account-credentials.png)

This should give you a JSON file containing credentials for the service account. As this grants unrestricted access to your Play Console, you should ensure it remains private and keep it out of source control.

Add `gradle-play-publisher` to your dependencies:

```gradle
buildscript {
    repositories {
        mavenCentral()
    }

    dependencies {
        // ...
        classpath 'com.github.triplet.gradle:play-publisher:1.1.5'
    }
}
```

And apply it:

```gradle
apply plugin: 'com.github.triplet.play'
```

`gradle-play-publisher` is very flexible and even allows you to check in your Play Store listing and screenshots into source control. For information on how to do this, check [Triple-T/gradle-play-publisher](https://github.com/Triple-T/gradle-play-publisher).

# Crash Reporting

Your app is now continuously tested and deployed to the Play Store, all thanks to GitLab. But a few issues have still crept into production. What now?

By setting up [Crashlytics](https://fabric.io/kits/android/crashlytics) with your Android app, you can easily track crashes, right inside GitLab.

![GitLab integration in Crashlytics](/files/android-gitlab/fabric-gitlab.png)
