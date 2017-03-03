---
layout: post
title: 'Android CD on GitLab'
date: '2017-03-03T9:15:00+05:30'
tags:
- android
- gitlab
---

We'll be looking at how to set up an Android project for continuous integration and continuous deployment on GitLab. I assume prior knowledge of testing on Android, so explaining _how_ to test Android applications is outside the scope of this article. Take a look at _[Setting Up Gitlab CI for Android Projects](https://about.gitlab.com/2016/11/30/setting-up-gitlab-ci-for-android-projects/)_ to learn how to set up testing.

We'll be modifying [Google's Topeka sample app](https://github.com/googlesamples/android-topeka) to automatically build, test and deploy to the Play Store, but the instructions described here should work for any project. To follow along, clone a copy of that project to Gitlab.

# Building

`.gitlab-ci.yml` is how you tell GitLab how to build, test and deploy your project. If you followed the instructions from _[Setting Up Gitlab CI for Android Projects](https://about.gitlab.com/2016/11/30/setting-up-gitlab-ci-for-android-projects/)_, you probably have a list of commands that pull down the correct versions of the Android SDK and associated tools required to build your project. That approach, however, will download those dependencies each time your project is rebuilt and hence make your build slower. 

Instead, you can use a docker image that already has the dependencies baked in, so they don't need to be downloaded again. There is already an excellent docker image available for building Android projects available at [hub.docker.com/r/jacekmarchwicki/android](https://hub.docker.com/r/jacekmarchwicki/android/). You should pick a tag appropriate for your project, which at the time of writing should be `java7-8-r25` which has java7/8 with version 25 of the Android SDK. If your project uses a different version of the SDK/build tools, you can push up your own version of the image to Docker Hub with a modified Dockerfile and use that instead.

So, the `.gitlab-ci.yml` you should use is:

```yaml
image: jacekmarchwicki/android:java7-8-r25
build:
  stage: build
  script:
    - ./gradlew clean assemble --no-daemon
test:
  stage: test
  script:
    - ./gradlew test --no-daemon
```

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

`gradle-play-publisher` is very flexible and even allows you to check in your Play Store listing and screenshots into source control. For information on how to do this, check [Triple-T/gradle-play-publisher](https://github.com/Triple-T/gradle-play-publisher). Once you've done this, you should have several new gradle tasks available, including `publishRelease` and `publishListingRelease` (or one for each build flavour you have, called `publishFlavourRelease` for example)

We can now modify our `.gitlab-ci.yml` to actually publish the build APKs to the Play Store:

```yaml
image: jacekmarchwicki/android:java7-8-r25
build:
  stage: build
  script:
    - ./gradlew clean assemble --no-daemon
test:
  stage: test
  script:
    - ./gradlew test --no-daemon
deploy:
  stage: deploy
  script:
    - ./gradlew publishRelease --no-daemon
```

We're not done yet -- we still need to provide our release signing key and config, along with the service account keys to Gitlab, so it can publish APKs for us.

# Crash Reporting

Even the most comprehensive test suite cannot catch a hundred percent of all errors, so you need to have a good strategy for handling errors in production. The simplest and the default approach for Android apps, is not to handle them yourself and to leave them to Play Store. While this works well for most apps, it has a few drawbacks:

- manual tracking of issue status (from the Play Developer Console to your own issue tracker)
- limited insight into target device

By setting up [Crashlytics](https://fabric.io/kits/android/crashlytics) with your Android app, you can easily track crashes, right inside GitLab.

![GitLab integration in Crashlytics](/files/android-gitlab/fabric-gitlab.png)
