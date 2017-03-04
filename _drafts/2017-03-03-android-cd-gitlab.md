---
layout: post
title: 'Android CD on GitLab'
date: '2017-03-03T9:15:00+05:30'
tags:
- android
- gitlab
---

As software projects grow in complexity and users expect more advanced features from apps, it becomes harder to ship reliable software on schedule using the software engineering processes of the past. **Continous Deployment** (CD) is a new approach to building software that involves frequent, automated deployments based on a **Continuously Integrated** (CI) branch of code. Setting up CI allows you to develop and test features faster, while ensuring better stability for your app in production.

Let's see how to set up an Android project for continuous deployment on GitLab. You should already know how to write tests for Android, and to set up CI on Gitlab. If you don't, take a look at _[Setting Up Gitlab CI for Android Projects](https://about.gitlab.com/2016/11/30/setting-up-gitlab-ci-for-android-projects/)_ to get started.

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
  artifacts:
    paths:
    - ./app/build/outputs/apk
test:
  stage: test
  script:
    - ./gradlew test --no-daemon
```

If you push up the modified project at this point, you should see it building successfully and producing build artifacts:

![Successful Build with Build Artifacts](/files/android-gitlab/topeka-build.png)

# Publishing

Publishing new builds of your app to the Play Store used to be a chore, but can now be automated with a service account, and the `gradle-play-publisher` gradle plugin.

First, head to **Settings > API Access** in your Google Play Developer Console. There, you can configure a service account and grant it permission to use your account.

![Google Play Developer Console API Access](/files/android-gitlab/service-account.png)

Once you've done this, you'll want to create and download a key for the newly created service account. You can do this by clicking on the *View in Developers Console* link on the API Access page, or by heading to the correct project on Google Cloud Console yourself.

![Google Cloud Console - Service Account Credentials](/files/android-gitlab/service-account-credentials.png)

This should give you `keys.json`, a file containing credentials for the service account. As this grants unrestricted access to your Play Developer Account, you should ensure it remains private and keep it out of source control.

Add `gradle-play-publisher` to your module-specific `build.gradle`:

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

Point it to the `keys.json` file you downloaded:

```gradle
play {
    jsonFile = file('../keys.json')
}
```

And apply it:

```gradle
apply plugin: 'com.github.triplet.play'
```

Before we can actually use `gradle-play-publisher` to publish APKs to Play Store, we need to make sure we have a valid signingConfig for the build type and flavour we wish to publish. A good way to do this conveniently and safely is to set up the signing config in a separate file, which is not checked into source control (`sign.gradle`, for example):

```gradle
apply plugin: 'com.android.application';

android {
    signingConfigs {
        release {
            storeFile file("../keystore.jks")
            storePassword "password"
            keyAlias "alias"
            keyPassword "password"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release;
        }
    }
}
```

And then, conditionally apply it, if it exists, so things still work fine for developers on your team who don't have access to the signing configuration (modifying your module `build.gradle`):

```gradle
if (new File('sign.gradle').exists()) {
    apply from: '../sign.gradle'
}
```

Once you've done this, you should have several new gradle tasks available, including `publishRelease` and `publishListingRelease` (or one for each build flavour you have, called `publishFlavourRelease` for example.) You can finally modify your `.gitlab-ci.yml` to actually publish the build APKs to the Play Store:

```yaml
deploy:
  stage: deploy
  script:
    - ./gradlew publishRelease --no-daemon
```

`gradle-play-publisher` is very flexible and even allows you to check in your Play Store listing and screenshots into source control. For information on how to do this, check [Triple-T/gradle-play-publisher](https://github.com/Triple-T/gradle-play-publisher).

We're not done yet -- `keys.json` and our signing config and key are not checked into source control, so Gitlab has no way to use them. A great way to make them available to Gitlab is to stash them in secret variables, and export them back to files using our CI script.

Save the contents of `sign.gradle`, `keys.json` and `signing-key.jks` as secret variables from Gitlab's CI/CD Settings:

![GitLab Secret Variables](/files/android-gitlab/secret-vars.png)

Add the following rule to your `.gitlab-ci.yml`:

```yaml
before_script:
  - echo $KEYS_JSON > keys.json
  - echo $SIGN_GRADLE > sign.gradle
  - echo $SIGNING_KEY_JKS > signing-key.jks
```

If you push this up at this point, and everything is configured correctly, your project will actually build and deploy to the Play Store!

# Version Management

With what we have so far, if you try to commit and push a change without modifying your build.gradle, you'll notice that nothing will actually get deployed to Play Store. This is because Play Store automatically rejects new APKs unless they have a higher versionCode than all existing APKs.

You could manually increment the versionCode for every build you want deployed, but that goes against the spirit of CI/CD. Instead, you could automatically generate the versionCode (and optionally the versionName) by adding the following to your project `build.gradle`:

```gradle
static def gitRevision() {
  def cmd = "git rev-parse --short HEAD"
  return cmd.execute().text.trim()
}

static def gitRevisionDate() {
  def cmd = "git show -s --format=%ci HEAD^{commit}"
  return cmd.execute().text.trim()
}

static def generateVersionCode() {
  def cmd = "git rev-list HEAD --count"
  return cmd.execute().text.trim().toInteger()
}

static def generateVersionName() {
  def ret = String.format("%s (%s)", gitRevisionDate().split(" ")[0].substring(2).replace("-", "."), gitRevision())
  return ret
}

subprojects {
  project.plugins.whenPluginAdded { plugin ->
    if ("com.android.build.gradle.AppPlugin" == plugin.class.name) {
      project.android.defaultConfig.versionName generateVersionName()
      project.android.defaultConfig.versionCode generateVersionCode()
    }
  }
}
```

# Crash Reporting

Even the most comprehensive test suite cannot catch a hundred percent of all errors, so you need to have a good strategy for handling errors in production. The simplest and the default approach for Android apps, is not to handle them yourself and to leave them to Play Store. While this works well for most apps, it has a few drawbacks:

- manual tracking of issue status (from the Play Developer Console to your own issue tracker)
- limited insight into target device

By setting up [Crashlytics](https://fabric.io/kits/android/crashlytics) with your Android app, you can easily track crashes, right inside GitLab. To do so, follow the instructions at [https://fabric.io/kits/android/crashlytics/install](https://fabric.io/kits/android/crashlytics/install). Once you've done this, you can configure Crashlytics to automatically create Gitlab issues when new crashes occur:

![GitLab integration in Crashlytics](/files/android-gitlab/fabric-gitlab.png)

# Wrapping Up

The final `.gitlab-ci.yml` you should end up with should be:

```yaml
image: jacekmarchwicki/android:java7-8-r25
before_script:
  - echo $KEYS_JSON > keys.json
  - echo $SIGN_GRADLE > sign.gradle
  - echo $SIGNING_KEY_JKS > signing-key.jks
build:
  stage: build
  script:
    - ./gradlew clean assemble --no-daemon
  artifacts:
    paths:
    - ./app/build/outputs/apk
test:
  stage: test
  script:
    - ./gradlew test --no-daemon
deploy:
  stage: deploy
  script:
    - ./gradlew publishRelease --no-daemon
```

If you got stuck somewhere, you could check out the updated version of Topeka that I set up for continuous deployments at: [aviraldg/android-topeka](https://gitlab.com/aviraldg/android-topeka).
