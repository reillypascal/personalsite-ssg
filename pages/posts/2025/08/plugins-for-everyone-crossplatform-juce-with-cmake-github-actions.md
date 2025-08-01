---
title: "Plugins for Everyone! Cross-Platform JUCE with CMake & GitHub Actions"
description: "My C++ reverb plugin is finally available for macOS, Windows, and Linux! Here's how I'm using JUCE's CMake API and GitHub actions to make that possible." 
fedi_url: 
og_image: 
og_image_width: 
og_image_height: 
date: 2025-08-01T14:31:00-0400
octothorpes:
  - Audio
  - audio
  - music
tags:
  - post
  - juce
  - cpp
  - cmake
  - programming
  - audio
post_series:
---

<!-- <link rel="stylesheet" type="text/css" href="/styles/notes-photos.css"> -->

<link rel="stylesheet" type="text/css" href="/styles/code/prism-dracula.css" />
<link rel="stylesheet" type="text/css" href="/styles/code/code-tweaks.css" />

I have [a few](https://github.com/reillypascal/RSBrokenMedia) [C++/JUCE](https://github.com/reillypascal/RSAlgorithmicVerb) [audio plugins](https://github.com/reillypascal/RSTelecom) I've worked on off and on over the last couple of years. I've wanted them to be available to anyone who's interested, but I previously wasn't able to get them compiled for Windows (and Linux was very inconvenient).

I'm now able to easily compile them for Linux, macOS, and Windows using the [JUCE CMake API](https://github.com/juce-framework/JUCE/blob/d6181bde38d858c283c3b7bf699ce6340c050b5d/docs/CMake%20API.md#L4) and GitHub actions. Let's look at how that works!

## My Starting Point

The JUCE C++ framework is a popular way to build audio plugins. When you first learn it, the [tutorials show how to build projects using the “Projucer” GUI tool](https://juce.com/tutorials/tutorial_new_projucer_project/). This generates project files for Visual Studio, Xcode, and Linux Makefiles. It's a convenient and well-documented way to work if you're only building for one platform, but if you want to compile for multiple OSes, you need to have each OS available to work with (in order to run the appropriate GUI program for which the Projucer generates files). Since my primary computer is a MacBook, I've only had compiled releases for macOS. This was where I was when I started learning the CMake API.

## CMake and JUCE

When I started on the [JUCE CMake API](https://github.com/juce-framework/JUCE/blob/d6181bde38d858c283c3b7bf699ce6340c050b5d/docs/CMake%20API.md#L4), I had next to no experience with CMake. The official website has this nice web book [*Mastering CMake*](https://cmake.org/cmake/help/book/mastering-cmake/index.html). Among other things, it has [a step-by-step tutorial](https://cmake.org/cmake/help/book/mastering-cmake/cmake/Help/guide/tutorial/index.html) and [documentation for the `cmake` CLI command](https://cmake.org/cmake/help/latest/manual/cmake.1.html#manual:cmake(1)), which were particularly helpful. You can also look at the examples in the JUCE [examples/CMake folder](https://github.com/juce-framework/JUCE/tree/master/examples/CMake) for reference on the JUCE end of things. 

Below is the CMakeLists.txt file for my [algorithmic reverb plugin](https://github.com/reillypascal/RSAlgorithmicVerb)—this goes in the root directory. Let's go through line by line:
- The [`cmake_minimum_required`](https://cmake.org/cmake/help/latest/command/cmake_minimum_required.html) statement should be the first line in any CMakeLists.txt file.
- Without [`set(CMAKE_EXPORT_COMPILE_COMMANDS ON)`](https://cmake.org/cmake/help/latest/command/set.html), my text editor (currently using Zed and Neovim) can't find the JUCE imports it needs.
- The [`project`](https://cmake.org/cmake/help/latest/command/project.html) statement gives the name/version.
- [`add_subdirectory(JUCE)`](https://cmake.org/cmake/help/latest/command/add_subdirectory.html): if you clone the [JUCE framework](https://github.com/juce-framework/JUCE) into the working directory (`git clone https://github.com/juce-framework/JUCE.git`), this statement will make the resulting folder available. 
    - I've seen the [CPM](https://github.com/cpm-cmake/CPM.cmake) package manager used (e.g., [here](https://www.youtube.com/watch?v=Uq7Hwt18s3s)) to bring in these dependencies, but I was having some kind of issue with dependencies being included twice and decided to figure that out later.
- The [`juce_add_plugin`](https://github.com/juce-framework/JUCE/blob/d6181bde38d858c283c3b7bf699ce6340c050b5d/docs/CMake%20API.md#juce_add_target) line is from the JUCE API. This contains a list of options and metadata for the plugin. 
    - Note in particular `COPY_PLUGIN_AFTER_BUILD TRUE`, and the following two lines `VST3_COPY_DIR "/Library/Audio/Plug-Ins/VST3"` and `AU_COPY_DIR "/Library/Audio/Plug-Ins/Components"`. If you uncomment these, CMake will copy the plugin files to the given directories after building. You *don't* want this for the GitHub actions, 
- [`juce_generate_juce_header`](https://github.com/juce-framework/JUCE/blob/d6181bde38d858c283c3b7bf699ce6340c050b5d/docs/CMake%20API.md#juce_generate_juce_header) generates the `JuceHeader.h` file. As the link above describes and [Sudara demonstrates](https://melatonin.dev/manuals/pamplejuce/juce/juceheader-h/), if you're not using the Projucer you can include the JUCE module(s) you need directly.
- [`target_sources`](https://cmake.org/cmake/help/latest/command/target_sources.html) lists the .cpp that need to be included in the project.
- [`target_compile_definitions`](https://cmake.org/cmake/help/latest/command/target_compile_definitions.html) adds preprocessor definitions to the target—see the options used below.
- [`target_link_libraries`](https://cmake.org/cmake/help/latest/command/target_link_libraries.html): in the `PRIVATE` field, we include the JUCE modules we're using in this project. In the `PUBLIC` field, we include some recommended flags.


```cmake
cmake_minimum_required(VERSION 3.22)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

project(RSAlgorithmicVerb VERSION 0.5.5)

add_subdirectory(JUCE)                    # If you've put JUCE in a subdirectory called JUCE

juce_add_plugin(${PROJECT_NAME}
    # VERSION ...                               # Set this if the plugin version is different to the project version
    # ICON_BIG ...                              # ICON_* arguments specify a path to an image file to use as an icon for the Standalone
    # ICON_SMALL ...
    COMPANY_NAME "Reilly Spitzfaden"                          # Specify the name of the plugin's author
    BUNDLE_ID "com.reillyspitzfaden.RSAlgorithmicVerb"
    IS_SYNTH FALSE                       # Is this a synth or an effect?
    # NEEDS_MIDI_INPUT TRUE/FALSE               # Does the plugin need midi input?
    # NEEDS_MIDI_OUTPUT TRUE/FALSE              # Does the plugin need midi output?
    IS_MIDI_EFFECT FALSE                 # Is this plugin a MIDI effect?
    # EDITOR_WANTS_KEYBOARD_FOCUS TRUE/FALSE    # Does the editor need keyboard focus?
    # Should the plugin be installed to a default location after building?
    # COPY_PLUGIN_AFTER_BUILD TRUE
    # VST3_COPY_DIR "/Library/Audio/Plug-Ins/VST3"
    # AU_COPY_DIR "/Library/Audio/Plug-Ins/Components"
    PLUGIN_MANUFACTURER_CODE Rspi               # A four-character manufacturer id with at least one upper-case character
    PLUGIN_CODE Rsav                            # A unique four-character plugin id with exactly one upper-case character
                                                # GarageBand 10.3 requires the first letter to be upper-case, and the remaining letters to be lower-case
    FORMATS AU VST3                  # The formats to build. Other valid formats are: AAX Unity VST AU AUv3 Standalone
    PRODUCT_NAME "RSAlgorithmicVerb")        # The name of the final executable, which can differ from the target name

juce_generate_juce_header(${PROJECT_NAME})

target_sources(${PROJECT_NAME}
    PRIVATE
        Source/ConcertHallB.cpp
        Source/CustomDelays.cpp
        Source/DattorroVerb.cpp
        Source/EarlyReflections.cpp
        Source/FDNs.cpp
        Source/Freeverb.cpp
        Source/GardnerRooms.cpp
        Source/LFO.cpp
        Source/SpecialFX.cpp
        Source/PluginEditor.cpp
        Source/PluginProcessor.cpp)

target_compile_definitions(${PROJECT_NAME}
    PUBLIC
        # JUCE_WEB_BROWSER and JUCE_USE_CURL would be on by default, but you might not need them.
        JUCE_WEB_BROWSER=0  # If you remove this, add `NEEDS_WEB_BROWSER TRUE` to the `juce_add_plugin` call
        JUCE_USE_CURL=0     # If you remove this, add `NEEDS_CURL TRUE` to the `juce_add_plugin` call
        JUCE_VST3_CAN_REPLACE_VST2=0)

target_link_libraries(${PROJECT_NAME}
    PRIVATE
        # AudioPluginData           # If we'd created a binary data target, we'd link to it here
        # juce::juce_analytics
        juce::juce_audio_basics
        juce::juce_audio_devices
        juce::juce_audio_formats
        juce::juce_audio_processors
        juce::juce_audio_utils
        juce::juce_core
        # juce::juce_cryptography
        juce::juce_data_structures
        juce::juce_dsp
        juce::juce_events
        juce::juce_graphics
        juce::juce_gui_basics
        juce::juce_gui_extra
        # juce::juce_opengl
        # juce::juce_osc
        # juce::juce_video
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags)

```

With this `CMakeLists.txt`, you can run `cmake -S . -B build` in the root directory to create the build environment. This means the source is the root directory, and `build` is the build directory. You can add the flags `-D CMAKE_BUILD_TYPE=Debug` or `-D CMAKE_BUILD_TYPE=Release` to specify debug/release builds. After that, run `cmake --build build` to compile. Note that if you have the `COPY_PLUGIN_AFTER_BUILD TRUE` option in `juce_add_plugin`, you will likely need to add `sudo` to both of the build commands since my installation directories above are system ones.

## Compiling with GitHub Actions

The nice thing about using CMake is that it doesn't require a desktop GUI program like Xcode or Visual Studio, meaning that it's possible to use something like [GitHub actions](https://docs.github.com/en/actions) to compile in the terminal on virtual versions of the target OSes. For my build action, I referenced [Sudara's Pamplejuce template](https://github.com/sudara/pamplejuce/blob/main/.github/workflows/build_and_test.yml). This is the file `.github/workflows/cmake.yml`. I have this set to manually trigger, and if you go to the “Actions” tab for your project, you can trigger a build using the GUI.

The file is fairly straightforward, but I'll point out some specifics. [`on: [workflow_dispatch]`](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow) means that you manually trigger the build. The [`matrix` strategy](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations) allows for running multiple copies of the job, in this case, on macOS, Ubuntu, and Windows.

The first two steps, which only run on Linux, are taken directly from Pamplejuce's example .yml file. Note however that the [current version of the Linux dependencies](https://github.com/juce-framework/JUCE/blob/develop/docs/Linux%20Dependencies.md) is slightly different, and I had to adjust accordingly.

After this, we check out the project repo, clone the JUCE repo, and run (almost) the same CMake commands as above. Note that we specify the `Release` build when we actually build, rather than when we set up the build, and that the syntax is a bit different: `--config Release`. `-D CMAKE_BUILD_TYPE` only seems to work on \*nix OSes, not on Windows.

Finally, we archive the build artifacts (i.e., the compiled files). Note that I append `${{ runner.os }}` to the end of the artifact name. This is important—without it, the artifacts for each OS will all be named the same thing, and the process will fail due to path conflicts.

```yaml
name: rsav-compile

on: [workflow_dispatch]

jobs:
  build:
    runs-on: ${{matrix.os}}
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]

    steps:
      # Use clang on Linux so we don't introduce a 3rd compiler (Windows and macOS use MSVC and Clang)
      - name: Set up Clang
        if: runner.os == 'Linux'
        uses: egor-tensin/setup-clang@v1

      - name: Install JUCE's Linux Deps
        if: runner.os == 'Linux'
        # Official list of Linux deps: https://github.com/juce-framework/JUCE/blob/develop/docs/Linux%20Dependencies.md
        run: |
          sudo apt-get update && sudo apt install libasound2-dev libjack-jackd2-dev \
              ladspa-sdk \
              libcurl4-openssl-dev  \
              libfreetype-dev libfontconfig1-dev \
              libx11-dev libxcomposite-dev libxcursor-dev libxext-dev libxinerama-dev libxrandr-dev libxrender-dev \
              libwebkit2gtk-4.1-dev \
              libglu1-mesa-dev mesa-common-dev

      - name: "Preparation"
        uses: actions/checkout@v2

      - name: "(JUCE) Clone Repository"
        uses: actions/checkout@v2
        with:
          repository: juce-framework/JUCE
          path: ${{runner.workspace}}/RSAlgorithmicVerb/JUCE

      - name: "Create Build Environment"
        working-directory: ${{runner.workspace}}/RSAlgorithmicVerb
        run: cmake -S . -B build

      - name: "Build"
        working-directory: ${{runner.workspace}}/RSAlgorithmicVerb
        run: cmake --build build --config Release

      - name: Archive build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: "RSAlgorithmicVerb_${{ runner.os }}"
          path: ${{runner.workspace}}/RSAlgorithmicVerb/build/RSAlgorithmicVerb_artefacts/

```

## Linux Build Issues

Frustratingly, this all works perfectly for Mac and Windows, but gives me a perplexing issue on Linux. The GitHub action works without issue on all OSes. However, when I use [pluginval](https://github.com/Tracktion/pluginval) to validate the Linux build on Debian 12.11, I get the following error for both the “open plugin (cold)” and “open plugin (warm)” tests:

```sh
!!! Test 1 failed: Expected value: , Actual value: Unable to load VST-3 plug-in file
!!! Test 2 failed: Unable to create juce::AudioPluginInstance
```

When I try to load the plugin in REAPER (same distro/version), the DAW detects that the plugin exists but won't load it. However, if I manually compile on my Debian laptop using CMake, everything works fine! The only other clue I've been able to find is that the VST3 `RSAlgorithmicVerb.so` file is significantly bigger when I use the GitHub action than when I manually compile it—31.9 MB, instead of 5.1 MB. At this point, I've decided to manually compile the Linux version, although I would very much like to figure this issue out, if anyone has any idea!

## Wrapping Up

Please check out the [releases for my reverb plugin](https://github.com/reillypascal/RSAlgorithmicVerb/releases)—it's available for Linux, Mac, and Windows! This is the only one for which I've set up this workflow, but next on my list is [my telecom codec plugin](https://github.com/reillypascal/RSTelecom)—I want to to add a C++ version of the [Rust ADPCM codec I wrote about previously](/posts/2025/05/databending-part-5/), for example.

For the time being, I don't have the full release and validation process automated. I decided to leave it as is since the main reason I want to do this is so I have easy access to Windows/Linux compilers. As a next step, I would like to reference [the Pamplejuce workflow file](https://github.com/sudara/pamplejuce/blob/main/.github/workflows/build_and_test.yml) and finish automating that. The example uses [the Xcode `pkgbuild` utility](https://keith.github.io/xcode-man-pages/pkgbuild.1.html) and [Tracktion's `pluginval` validator](https://github.com/Tracktion/pluginval), and it would be very convenient. Until next time!
